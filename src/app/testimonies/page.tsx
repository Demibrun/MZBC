export const dynamic = "force-dynamic";

import { headers } from "next/headers";

type Testimony = {
  _id: string;
  title: string;
  name?: string;
  body: string;
  approved?: boolean;
  createdAt?: string;
};

function getBaseUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

async function getTestimonies(): Promise<Testimony[]> {
  // If your API uses ?approved=1 to filter, keep it; otherwise it will ignore it.
  const res = await fetch(`${getBaseUrl()}/api/testimonies?approved=1`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  const items: Testimony[] = Array.isArray(json?.items) ? json.items : [];
  // Sort newest first if backend didn’t already
  return items.sort((a, b) => {
    const aa = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bb = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bb - aa;
  });
}

export default async function TestimoniesPage() {
  const items = await getTestimonies();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Testimonies</h1>

      {items.length === 0 ? (
        <p>No testimonies yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((t) => (
            <article key={t._id} className="rounded-xl border bg-white p-4">
              <h3 className="font-semibold">
                {t.title} {t.name ? <span className="text-gray-500">— {t.name}</span> : null}
              </h3>
              <div className="mt-2 whitespace-pre-wrap text-[var(--mz-dark,#111)]">
                {t.body}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
