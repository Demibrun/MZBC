import { dbConnect } from "@/lib/db";
import { MinistryGroup } from "@/lib/models";

export const dynamic = "force-dynamic";

const keys = [
  { key: "women", title: "Gracious Zion Women" },
  { key: "beacons", title: "Zion Covenant Beacons" },
  { key: "men", title: "Zion Men of Valour" },
  { key: "heritage", title: "Zion Heritage" },
  { key: "champions", title: "Zion Divine Champions" },
];

export default async function AboutPage(){
  await dbConnect();
  const docs = await MinistryGroup.find({ key: { $in: keys.map(k=>k.key) } }).lean();
  const byKey = Object.fromEntries(docs.map((d:any)=>[d.key, d]));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 grid gap-8">
      <h1 className="text-2xl font-bold">About Us</h1>
      {keys.map(k=>{
        const d:any = byKey[k.key] || {};
        return (
          <section key={k.key} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{k.title}</h2>
            {d.photoUrl && <img src={d.photoUrl} alt={k.title} className="mt-3 w-full max-h-64 object-cover rounded" />}
            <p className="mt-3 whitespace-pre-wrap">{d.body || "Content coming soon."}</p>
          </section>
        );
      })}
    </main>
  );
}
