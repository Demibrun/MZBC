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
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Media</h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse church videos, photos, and audio messages by category.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Media categories">
          {(["all", "youtube", "photo", "audio"] as const).map((kind) => (
            <a
              key={kind}
              href={kind === "all" ? "/media" : `/media?kind=${kind}`}
              className={`rounded border px-3 py-1.5 text-sm ${
                activeKind === kind
                  ? "bg-[var(--mz-primary-blue)] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {labelFor(kind)} ({counts[kind]})
            </a>
          ))}
        </nav>
      </div>

      {filteredItems.length === 0 ? (
        <p>No media uploaded yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((m) => (
            <article key={m._id} className="rounded-xl border bg-white p-4">
              <div className="text-xs uppercase text-gray-500 mb-1">{m.kind}</div>
              {m.title && <h3 className="font-semibold">{m.title}</h3>}

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
                    className="w-full h-56 object-cover rounded"
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
                className="mt-3 inline-block text-sm text-blue-700 underline break-all"
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
