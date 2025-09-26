import { dbConnect } from "@/lib/db";
import { Testimony } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function TestimoniesPage() {
  await dbConnect();
  const items = await Testimony.find({ approved: true })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--mz-deep-blue)] mb-6">
        Testimonies
      </h1>

      {items.length === 0 && <p>No testimonies yet.</p>}

      <div className="grid gap-4">
        {items.map((t: any) => (
          <article key={t._id} className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">
              {t.title} {t.name ? <span className="text-sm text-gray-500">— {t.name}</span> : null}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-[var(--mz-dark)]/90">{t.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
