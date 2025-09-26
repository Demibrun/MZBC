// src/app/about/page.tsx
export const dynamic = "force-dynamic";

import { dbConnect } from "@/lib/db";
import { MinistryGroup } from "@/lib/models";

/**
 * About page
 * - Pulls specific ministry groups by key
 * - Uses .lean().exec() to avoid Mongoose TS signature issues in builds
 */

const KEYS = [
  { key: "women",     title: "Gracious Zion Women" },
  { key: "beacons",   title: "Zion Covenant Beacons" },
  { key: "men",       title: "Zion Men of Valour" },
  { key: "heritage",  title: "Zion Heritage" },
  { key: "champions", title: "Zion Divine Champions" },
] as const;

type GroupDoc = {
  _id?: string;
  key: string;
  title?: string;
  photoUrl?: string;
  body?: string;
};

export default async function AboutPage() {
  await dbConnect();

  const wantedKeys = KEYS.map(k => k.key);
  // ✅ Use .lean().exec() so Vercel/TS stops complaining
  const docs = (await MinistryGroup
    .find({ key: { $in: wantedKeys } })
    .lean()
    .exec()) as GroupDoc[];

  const byKey: Record<string, GroupDoc | undefined> =
    Object.fromEntries(docs.map(d => [d.key, d]));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 grid gap-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--mz-deep-blue)]">
          About Us
        </h1>
        <p className="mt-1 text-[var(--mz-dark)]/70">
          Learn about our ministries and family groups in Mount Zion.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {KEYS.map(({ key, title }) => {
          const g = byKey[key];
          return (
            <section
              key={key}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                {g?.photoUrl ? (
                  <img
                    src={g.photoUrl}
                    alt={g.title || title}
                    className="h-24 w-24 flex-none rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 flex-none rounded-lg bg-black/5 grid place-items-center text-sm text-black/40">
                    No Image
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-[var(--mz-deep-blue)]">
                    {g?.title || title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--mz-dark)]/80 whitespace-pre-wrap">
                    {g?.body || "Details will appear here when available."}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
