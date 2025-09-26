// src/app/work-force/PastorCard.tsx
"use client";

import Image from "next/image";

export default function PastorCard({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/10">
      {/* Fixed aspect so the image is tall/visible and not a thin slice */}
      <div className="relative aspect-[4/3] sm:aspect-[3/2]">
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="(min-width:1024px) 420px, (min-width:640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          quality={90}
        />
      </div>

      <div className="p-4">
        <p className="font-semibold text-[var(--mz-deep-blue)]">{name}</p>
      </div>
    </div>
  );
}
