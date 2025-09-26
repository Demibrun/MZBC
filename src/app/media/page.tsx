import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function MediaPage(){
  await dbConnect();
  const items = await MediaItem.find().sort({ createdAt: -1 }).lean();

  const yt = items.filter((i:any)=>i.kind==="youtube");
  const photos = items.filter((i:any)=>i.kind==="photo");
  const audio = items.filter((i:any)=>i.kind==="audio");

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-4">Sermons & Praise (YouTube)</h1>
        {yt.length === 0 && <p>No videos yet.</p>}
        <div className="grid md:grid-cols-3 gap-4">
          {yt.map((v:any)=>(
            <iframe key={v._id} className="w-full aspect-video rounded"
              src={`https://www.youtube.com/embed/${v.url}`} title={v.title} allowFullScreen />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Photo Highlights</h2>
        {photos.length === 0 && <p>No photos yet.</p>}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {photos.map((p:any)=>(
            <img key={p._id} className="w-full h-48 object-cover rounded" src={p.thumbnail || p.url} alt={p.title}/>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Audio</h2>
        {audio.length === 0 && <p>No audio yet.</p>}
        <ul className="space-y-3">
          {audio.map((a:any)=>(
            <li key={a._id} className="border rounded p-3">
              <p className="font-medium">{a.title}</p>
              <audio controls className="mt-2 w-full"><source src={a.url} /></audio>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
