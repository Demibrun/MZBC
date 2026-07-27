"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

type YouTubeLiteProps = {
  id: string;
  title: string;
  className?: string;
};

export default function YouTubeLite({ id, title, className = "" }: YouTubeLiteProps) {
  const [active, setActive] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-black ${className}`}>
      {active ? (
        <iframe
          className="h-full w-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group relative h-full w-full"
          aria-label={`Play ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/15" />
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--mz-primary-blue)] shadow-lg transition group-hover:scale-105">
            <Play className="h-7 w-7 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
