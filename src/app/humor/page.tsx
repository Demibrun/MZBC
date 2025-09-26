import { dbConnect } from "@/lib/db";
import { Humor } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function HumorPage() {
  await dbConnect();
  const h:any = await Humor.findOne().sort({ createdAt: -1 }).lean();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 grid gap-6">
      <section className="border rounded p-4">
        <h1 className="text-2xl font-bold">Humor of the Week</h1>
        <p className="mt-2 whitespace-pre-wrap">{h?.humor || "—"}</p>
      </section>
      <section className="border rounded p-4">
        <h2 className="text-xl font-semibold">Science Fact</h2>
        <p className="mt-2 whitespace-pre-wrap">{h?.scienceFact || "—"}</p>
      </section>
      <section className="border rounded p-4">
        <h2 className="text-xl font-semibold">Health Fact</h2>
        <p className="mt-2 whitespace-pre-wrap">{h?.healthFact || "—"}</p>
      </section>
    </main>
  );
}
