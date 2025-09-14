export default function MediaCarousel({ ids }:{ ids:string[] }){
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {ids.map(id=> (
        <div key={id} className="aspect-video card overflow-hidden">
          <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}`} title="YouTube video" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
        </div>
      ))}
    </div>
  );
}
