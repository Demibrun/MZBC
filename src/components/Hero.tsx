export default function Hero(){
  return (
    <div className="gradient-hero">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <img src="../logo.jpg" alt="Church Logo" className="mx-auto h-28 w-28 object-contain"/>
        <h1 className="mt-6 text-3xl md:text-5xl font-extrabold text-[var(--mz-deep-blue)]">Mount Zion Bible Church Nigeria</h1>
        <p className="mt-3 text-lg md:text-xl">Zion, where captives become captains.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#visit" className="btn-primary">Plan Your Visit</a>
          <a href="#media" className="btn-outline">Watch Live/Recent</a>
        </div>
      </div>
    </div>
  );
}
