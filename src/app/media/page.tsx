export const dynamic = "force-dynamic";

import { headers } from "next/headers";

type Media = {
  _id: string;
  kind: "youtube" | "photo" | "audio";
  title?: string;
  url: string;       // youtube videoId or full URL (photo/audio)
  thumbnail?: string;
  createdAt?: string;
};

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

export default async function MediaPage() {
  const items = await getMedia();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Media</h1>

      {items.length === 0 ? (
        <p>No media uploaded yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <article key={m._id} className="rounded-xl border bg-white p-4">
              <div className="text-xs uppercase text-gray-500 mb-1">{m.kind}</div>
              {m.title && <h3 className="font-semibold">{m.title}</h3>}

              {/* Render previews */}
              <div className="mt-3">
                {m.kind === "youtube" && (
                  <iframe
                    className="w-full aspect-video rounded"
                    src={`https://www.youtube.com/embed/${m.url}`}
                    title={m.title || "YouTube"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
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
