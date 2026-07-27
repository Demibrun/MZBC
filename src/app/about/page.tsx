// src/app/about/page.tsx
import dbConnect from "@/lib/db";
import { MinistryGroup } from "@/lib/models";
import type mongoose from "mongoose";

type GroupDoc = {
  _id?: string;
  key: string;
  title?: string;
  photoUrl?: string;
  body?: string;
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await dbConnect();

  const groupsMeta = [
    { key: "women", title: "Women of Zion" },
    { key: "beacons", title: "Beacons(Youth)" },
    { key: "men", title: "Men of Valor" },
    { key: "heritage", title: "Heritage (Children)" },
    { key: "champions", title: "Champions (Teens)" },
  ] as const;

  const wantedKeys = groupsMeta.map((k) => k.key);

  // 👇 Cast through unknown first to silence TS "not callable"/"missing key" complaints
  const docs = (await (MinistryGroup as unknown as mongoose.Model<any>)
    .find({ key: { $in: wantedKeys } })
    .lean()
    .exec()) as unknown as GroupDoc[];

  const byKey = Object.fromEntries(docs.map((d) => [d.key, d]));

  return (
    <main className="section grid gap-8">
      <header>
        <p className="section-kicker">Our family</p>
        <h1 className="h1 mt-2">About</h1>
        <p className="section-subtitle">
          Learn more about the sub-ministries at Mount Zion Bible Church.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {groupsMeta.map((g) => {
          const doc = byKey[g.key] as GroupDoc | undefined;
          return (
            <section key={g.key} className="card p-5">
              <h2 className="text-xl font-semibold text-[var(--mz-deep-blue)]">
                {doc?.title || g.title}
              </h2>
              {doc?.photoUrl && (
                <img
                  src={doc.photoUrl}
                  alt={doc.title || g.title}
                  className="mt-4 h-52 w-full rounded-lg object-cover"
                />
              )}
              <p className="mt-4 whitespace-pre-wrap leading-7 text-[var(--mz-dark)]/75">
                {doc?.body || "Details coming soon."}
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
