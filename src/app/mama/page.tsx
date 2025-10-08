// src/app/mama/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0; // disable caching

// --- helpers ---------------------------------------------------------------

/** Extract a YouTube video ID from many possible URL formats or plain IDs. */
function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const s = input.trim();

  // Bare ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  try {
    const u = new URL(s);
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean).at(-1);
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    // youtube.com/watch?v=<id> or youtube.com/embed/<id>
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const i = parts.findIndex((p) => p === "embed");
      if (i >= 0) {
        const id = parts[i + 1];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    // not a URL; fall through
  }
  return null;
}

/** Normalize to [{ _id?, title?, videoId }] allowing legacy docs with only `url`. */
function normalizeItems(raw: any): Array<{ _id?: string; title?: string; videoId: string }> {
  const items = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
  return items
    .map((it: any) => {
      const id =
        it?.videoId ||
        getYouTubeId(it?.url) ||
        getYouTubeId(it?.link) ||
        getYouTubeId(it?.embedUrl) ||
        getYouTubeId(it?.video);

      return id ? { _id: it?._id, title: it?.title, videoId: id } : null;
    })
    .filter(Boolean) as Array<{ _id?: string; title?: string; videoId: string }>;
}

// --- data ------------------------------------------------------------------

async function getData() {
  try {
    // Relative fetch -> same host on Vercel (matches Media page behavior)
    const res = await fetch("/api/mama", {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return { items: [] as any[] };
    const json = await res.json();
    return { items: normalizeItems(json) };
  } catch {
    return { items: [] as any[] };
  }
}

// --- page ------------------------------------------------------------------

export default async function MamaPage() {
  const { items } = await getData();

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero / Header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-b border-black/10">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-14 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="inline-block rounded-full border border-rose-300/50 bg-white/60 px-4 py-1 text-xs font-semibold text-rose-600 shadow-sm backdrop-blur">
            Mama’s Section
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 drop-shadow-sm">
            This is a dedicated page for spiritual women
          </h1>

          <p className="mt-3 max-w-2xl text-sm md:text-base text-rose-900/70">
            Messages, teachings, and inspirations from Mama: watch,
            reflect, and be refreshed.
          </p>
        </div>
      </section>

      {/* Grid of videos */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-xl border bg-white/80 p-6 text-center text-sm text-gray-600 shadow-sm">
            No videos yet — please check back soon.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <article
                key={m._id ?? m.videoId}
                className="group relative rounded-2xl border bg-white shadow-sm transition hover:shadow-rose-200/50 hover:shadow-xl ring-1 ring-rose-100/60 hover:ring-rose-200"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400" />
                <div className="p-3">
                  {m.title && (
                    <h3 className="mb-2 line-clamp-2 font-semibold text-rose-900 group-hover:text-rose-700 transition-colors">
                      {m.title}
                    </h3>
                  )}

                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-rose-100 bg-rose-50">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${m.videoId}`}
                      title={m.title || "Mama video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-3 h-8 w-full rounded-lg bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 blur-[2px] opacity-70" />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
