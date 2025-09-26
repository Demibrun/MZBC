// src/app/about/page.tsx
import { dbConnect } from "@/lib/db";
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
    { key: "beacons", title: "Beacons" },
    { key: "men", title: "Men of Valor" },
    { key: "heritage", title: "Heritage (Children)" },
    { key: "champions", title: "Champions (Teens/Youth)" },
  ] as const;

  const wantedKeys = groupsMeta.map((k) => k.key);

  // 👇 Cast through unknown first to silence TS "not callable"/"missing key" complaints
  const docs = (await (MinistryGroup as unknown as mongoose.Model<any>)
    .find({ key: { $in: wantedKeys } })
    .lean()
    .exec()) as unknown as GroupDoc[];

  const byKey = Object.fromEntries(docs.map((d) => [d.key, d]));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid gap-8">
      <header>
        <h1 className="text-2xl font-bold">About</h1>
        <p className="text-sm text-gray-600">
          Learn more about the sub-ministries at Mount Zion Bible Church.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {groupsMeta.map((g) => {
          const doc = byKey[g.key] as GroupDoc | undefined;
          return (
            <section key={g.key} className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold">{doc?.title || g.title}</h2>
              {doc?.photoUrl && (
                <img
                  src={doc.photoUrl}
                  alt={doc.title || g.title}
                  className="mt-3 h-44 w-full object-cover rounded"
                />
              )}
              <p className="mt-3 whitespace-pre-wrap">
                {doc?.body || "Details coming soon."}
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
