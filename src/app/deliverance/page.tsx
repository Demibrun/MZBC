import { dbConnect } from "@/lib/db";
import { Deliverance } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function DeliverancePage() {
  await dbConnect();
  const d:any = await Deliverance.findOne().lean();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-bold">Deliverance Session</h1>
      <p>Virtual deliverance is available via Zoom.</p>
      {d ? (
        <div className="rounded border p-4">
          <p><strong>Zoom ID:</strong> {d.zoomId || "—"}</p>
          {d.zoomPasscode && <p><strong>Passcode:</strong> {d.zoomPasscode}</p>}
          {d.instructions && <p className="mt-2 whitespace-pre-wrap">{d.instructions}</p>}
        </div>
      ) : <p>Details coming soon.</p>}
      <p className="text-sm">Contact us: <a className="underline" href="tel:+2348148599942">+234-814-859-9942</a></p>
    </main>
  );
}
