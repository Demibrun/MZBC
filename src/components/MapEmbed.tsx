export default function MapEmbed({ address }:{ address:string }){
  const q = encodeURIComponent(address);
  return (
    <div className="card p-3">
      <iframe className="w-full h-72 rounded-xl" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${q}&output=embed`}></iframe>
      <div className="mt-3">
        <a className="btn-primary" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer">Get Directions</a>
      </div>
    </div>
  );
}
