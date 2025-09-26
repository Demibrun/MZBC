// src/app/about/page.tsx
import { dbConnect } from "@/lib/db";
import { MinistryGroup } from "@/lib/models";

export const dynamic = "force-dynamic";

const GROUPS = [
  { key: "women",     title: "Women" },
  { key: "beacons",   title: "Beacons" },
  { key: "men",       title: "Men" },
  { key: "heritage",  title: "Heritage" },
  { key: "champions", title: "Champions" },
];

export default async function AboutPage() {
  await dbConnect();

  const wantedKeys = GROUPS.map((g) => g.key);

  // Cast to any to avoid TS's Mongoose overload confusion during build
  const docs: any[] = await (MinistryGroup as any)
    .find({ key: { $in: wantedKeys } })
    .lean()
    .exec();

  const byKey: Record<string, any> = Object.fromEntries(
    docs.map((d: any) => [d.key, d])
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid gap-6">
      <h1 className="text-3xl font-bold">About Our Ministries</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {GROUPS.map((g) => {
          const item = byKey[g.key] || {};
          return (
            <section
              key={g.key}
              className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{item.title || g.title}</h2>
              {item.photoUrl && (
                <img
                  src={item.photoUrl}
                  alt={item.title || g.title}
                  className="mt-3 h-48 w-full object-cover rounded-lg"
                />
              )}
              <p className="mt-3 whitespace-pre-wrap text-[var(--mz-dark)]/90">
                {item.body || "Details coming soon."}
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
