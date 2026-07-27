import YouTubeLite from "@/components/YouTubeLite";

export default function MediaCarousel({ ids }:{ ids:string[] }){
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {ids.map(id=> (
        <div key={id} className="aspect-video card overflow-hidden">
          <YouTubeLite id={id} title="YouTube video" />
        </div>
      ))}
    </div>
  );
}
