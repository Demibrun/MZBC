// src/app/about/page.tsx
import { dbConnect } from "@/lib/db";
import { MinistryGroup } from "@/lib/models";

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

  const keys = [
    { key: "women", title: "Women of Zion" },
    { key: "beacons", title: "Beacons" },
    { key: "men", title: "Men of Valor" },
    { key: "heritage", title: "Heritage (Children)" },
    { key: "champions", title: "Champions (Teens/Youth)" },
  ] as const;

  const wantedKeys = keys.map((k) => k.key);

  // ✅ Use .lean().exec() and cast to our local type
  const docs = (await MinistryGroup.find({ key: { $in: wantedKeys } })
    .lean()
    .exec()) as GroupDoc[];

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
        {keys.map((k) => {
          const g = byKey[k.key] as GroupDoc | undefined;
          return (
            <section key={k.key} className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold">
                {g?.title || k.title}
              </h2>
              {g?.photoUrl && (
                <img
                  src={g.photoUrl}
                  alt={g.title || k.title}
                  className="mt-3 h-44 w-full object-cover rounded"
                />
              )}
              <p className="mt-3 whitespace-pre-wrap">
                {g?.body || "Details coming soon."}
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
