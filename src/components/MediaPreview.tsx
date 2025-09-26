// src/components/MediaPreview.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

const YT_CHANNEL =
  "https://www.youtube.com/@MountZionPrayerMinistryI-fz9ls/videos";


const VIDEOS = [
  { id: "C3Ej8ewh4BE", title: "Recovering Your Changed Destiny" },
  { id: "XICJmTCnfJ4", title: "Trusting God's Faithfullness for All Provisions" },
  { id: "EE6elPu3PiM", title: "Overcoming the Thief of God's Blessing -DOUBT-" },
  { id: "VKnGhDa8gAo", title: "Breaking the Connection of Evil Dreams into Reality" },
];

export default function MediaPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--mz-deep-blue)]">
          Media Highlights
        </h2>
        <div className="flex items-center gap-2">
          <Link href="/media" className="text-sm underline">
            See more
          </Link>
          <a href={YT_CHANNEL} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline">View Channel</Button>
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <div key={v.id} className="w-full overflow-hidden rounded-xl border">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="px-3 py-2 text-sm text-[var(--mz-dark)]/80 line-clamp-1">
              {v.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
