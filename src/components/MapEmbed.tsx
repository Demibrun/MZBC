// src/components/MapEmbed.tsx
import { Button } from "@/components/ui/button";

export default function MapEmbed({
  address = "26 Busayo Taiwo Street, Oni and Sons, Ibadan, Nigeria",
}: { address?: string }) {
  const q = encodeURIComponent(address);
  const maps = `https://www.google.com/maps?q=${q}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <section id="visit" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--mz-deep-blue)]">
        Visit Us (Map & Directions)
      </h2>
      <p className="mt-1 text-sm text-[var(--mz-dark)]/80">{address}</p>

      <div className="mt-4 grid gap-6 md:grid-cols-[1.5fr,1fr]">
        <div className="overflow-hidden rounded-xl border">
          <iframe
            src={maps}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Quick Tips</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>Parking available around the church premises.</li>
            <li>Public transport drops at Oni and Sons—short walk to church.</li>
            <li>Ushers are on ground to assist first-time visitors.</li>
          </ul>
          <a href={directions} target="_blank" rel="noreferrer" className="mt-4 inline-block">
            <Button>Get Directions</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
