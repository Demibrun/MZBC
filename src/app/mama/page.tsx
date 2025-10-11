// src/app/mama/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

type MamaItem = { _id: string; title?: string; url: string; videoId: string };

async function getData(): Promise<MamaItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/mama`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return Array.isArray(json?.items) ? json.items : [];
  } catch {
    // fallback to relative (works on prod too)
    try {
      const res = await fetch("/api/mama", { cache: "no-store", next: { revalidate: 0 } });
      const json = await res.json();
      return Array.isArray(json?.items) ? json.items : [];
    } catch {
      return [];
    }
  }
}

export default async function MamaPage() {
  const items = await getData();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--mz-primary-blue)]">
          Mama’s Section
        </h1>
        <p className="mt-1 text-[var(--mz-dark)]/70">
          {/* Edit this subheader text directly in code later */}
          Inspiring teachings and messages.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-600">
          No videos yet — please check back soon.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <article key={m._id} className="rounded-2xl border bg-white shadow-sm">
              <div className="p-3">
                {m.title && <h3 className="mb-2 font-semibold">{m.title}</h3>}
                <div className="aspect-video w-full overflow-hidden rounded border">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${m.videoId}`}
                    title={m.title || "Mama video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
