import { Button } from "@/components/ui/button";

export default function MapEmbed({
  address = "26 Busayo Taiwo Street, Oni and Sons, Ibadan, Nigeria",
}: {
  address?: string;
}) {
  const q = encodeURIComponent(address);
  const maps = `https://www.google.com/maps?q=${q}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <section id="visit" className="section">
      <p className="section-kicker">Plan your visit</p>
      <h2 className="h2 mt-2">Map & Directions</h2>
      <p className="section-subtitle">{address}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr,1fr]">
        <div className="overflow-hidden rounded-lg border border-[var(--mz-border)] bg-white shadow-sm">
          <iframe
            src={maps}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="soft-panel p-5">
          <h3 className="font-semibold text-[var(--mz-deep-blue)]">Quick Tips</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--mz-dark)]/75">
            <li>Parking available around the church premises.</li>
            <li>Public transport drops at Oni and Sons, a short walk to church.</li>
            <li>Ushers are on ground to assist first-time visitors.</li>
          </ul>
          <a href={directions} target="_blank" rel="noreferrer" className="mt-5 inline-block">
            <Button className="rounded-lg">Get Directions</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
