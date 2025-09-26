import { dbConnect } from "@/lib/db";
import { PrayerPoint } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function PrayerCapsule() {
  await dbConnect();
  const points = await PrayerPoint.find().sort({ createdAt: -1 }).limit(500).lean();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Prayer Capsule</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {points.length === 0 && <p>No prayer points yet. Check back soon.</p>}
        {points.map((p: any) => (
          <article key={p._id} className="border rounded p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="mt-2 whitespace-pre-wrap">{p.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Prayer Request</h2>
        <a className="inline-block underline text-[var(--mz-deep-blue)]"
           href="mailto:mzpmintal@gmail.com?subject=Prayer%20Request&body=Please%20pray%20for%3A%20">
          Send to Church Mail →
        </a>
      </div>
    </main>
  );
}
