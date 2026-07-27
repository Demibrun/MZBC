export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import YouTubeLite from "@/components/YouTubeLite";

type Media = {
  _id: string;
  kind: "youtube" | "photo" | "audio";
  title?: string;
  url: string;       // youtube videoId or full URL (photo/audio)
  thumbnail?: string;
  createdAt?: string;
};

type MediaKindFilter = "all" | "youtube" | "photo" | "audio";

function getBaseUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

async function getMedia(): Promise<Media[]> {
  const res = await fetch(`${getBaseUrl()}/api/media`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.items) ? (json.items as Media[]) : [];
}

function labelFor(kind: MediaKindFilter) {
  if (kind === "youtube") return "Videos";
  if (kind === "photo") return "Photos";
  if (kind === "audio") return "Audio";
  return "All";
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams?: { kind?: string };
}) {
  const items = await getMedia();
  const activeKind = (
    ["youtube", "photo", "audio"].includes(searchParams?.kind || "")
      ? searchParams?.kind
      : "all"
  ) as MediaKindFilter;
  const filteredItems =
    activeKind === "all"
      ? items
      : items.filter((item) => item.kind === activeKind);
  const counts = {
    all: items.length,
    youtube: items.filter((item) => item.kind === "youtube").length,
    photo: items.filter((item) => item.kind === "photo").length,
    audio: items.filter((item) => item.kind === "audio").length,
  };

  return (
    <main className="section">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Church media</p>
          <h1 className="h1 mt-2">Media</h1>
          <p className="section-subtitle">
            Browse church videos, photos, and audio messages by category.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Media categories">
          {(["all", "youtube", "photo", "audio"] as const).map((kind) => (
            <a
              key={kind}
              href={kind === "all" ? "/media" : `/media?kind=${kind}`}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                activeKind === kind
                  ? "border-[var(--mz-primary-blue)] bg-[var(--mz-primary-blue)] text-white"
                  : "border-[var(--mz-border)] bg-white text-gray-700 hover:bg-slate-100"
              }`}
            >
              {labelFor(kind)} ({counts[kind]})
            </a>
          ))}
        </nav>
      </div>

      {filteredItems.length === 0 ? (
        <div className="soft-panel p-8 text-center">
          <p className="font-semibold text-[var(--mz-deep-blue)]">No media uploaded yet.</p>
          <p className="mt-1 text-sm text-[var(--mz-dark)]/65">
            Check another category or come back after the next upload.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((m) => (
            <article key={m._id} className="card p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--mz-primary-blue)]">
                {m.kind}
              </div>
              {m.title && <h3 className="font-semibold text-[var(--mz-deep-blue)]">{m.title}</h3>}

              {/* Render previews */}
              <div className="mt-3">
                {m.kind === "youtube" && (
                  <YouTubeLite
                    id={m.url}
                    title={m.title || "YouTube"}
                    className="rounded"
                  />
                )}

                {m.kind === "photo" && (
                  // If thumbnail is present prefer it; otherwise use url
                  <img
                    src={m.thumbnail || m.url}
                    alt={m.title || "Photo"}
                    className="h-56 w-full rounded-lg object-cover"
                  />
                )}

                {m.kind === "audio" && (
                  <audio className="w-full" controls src={m.url}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>

              {/* Show the raw link for convenience */}
              <a
                href={m.kind === "youtube" ? `https://youtu.be/${m.url}` : m.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block break-all text-sm font-medium text-[var(--mz-primary-blue)] underline"
              >
                Open
              </a>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
