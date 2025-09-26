// src/app/work-force/page.tsx
import { dbConnect } from "@/lib/db";
import { Pastor, Unit } from "@/lib/models";
import PastorCard from "./PastorCard";

export const dynamic = "force-dynamic";

export default async function WorkForce() {
  await dbConnect();

  const [pastors, units] = await Promise.all([
    Pastor.find().sort({ order: 1 }).lean(),
    Unit.find().sort({ order: 1 }).lean(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 grid gap-12">
      {/* Pastors */}
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--mz-deep-blue)] mb-6">
          Pastors Column
        </h1>

        {pastors.length === 0 ? (
          <p className="text-slate-600">No pastors added yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastors.map((p: any) => (
              <PastorCard
                key={String(p._id)}
                name={p.name}
                photoUrl={p.photoUrl || "/uploads/default-pastor.jpg"}
              />
            ))}
          </div>
        )}
      </section>

      {/* Service Units */}
      <section>
        <h2 className="text-2xl font-bold text-[var(--mz-deep-blue)] mb-4">
          Service Units
        </h2>

        {units.length === 0 ? (
          <p className="text-slate-600">No units yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((u: any) => (
              <article
                key={String(u._id)}
                className="rounded-2xl bg-white shadow-md ring-1 ring-black/10 p-5"
              >
                <h3 className="font-semibold text-[var(--mz-dark)]">
                  {u.name}
                </h3>
                {u.description && (
                  <p className="text-sm text-slate-600 mt-2">{u.description}</p>
                )}
                {u.joinLink && (
                  <a
                    className="inline-block mt-3 text-sm font-medium text-[var(--mz-primary-blue)] hover:underline"
                    href={u.joinLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Join this unit →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
