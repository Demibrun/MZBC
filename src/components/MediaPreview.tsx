// src/components/MediaPreview.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import YouTubeLite from "@/components/YouTubeLite";

const YT_CHANNEL =
  "https://www.youtube.com/@MountZionPrayerMinistryI-fz9ls/videos";


const VIDEOS = [
  { id: "jyzOFsvSh4g", title: "HGVS// THE SPIRIT OF THANKSGIVING- PST DAVID JESSE// 26-07-2026" },
  { id: "xR6V2uCBqIk", title: "DELIVERANCE AND MIRACLE HOUR" },
  { id: "EB4tU4_3Ijw", title: "How to kill Demonic birds- Pst Banke Jesse #Jesus #love #holyspirit #inspiration" },
  { id: "55iUJSWbU-Y", title: "WORD LIBERATION HOUR// 22-07-2026" },
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
            <YouTubeLite id={v.id} title={v.title} />
            <div className="px-3 py-2 text-sm text-[var(--mz-dark)]/80 line-clamp-1">
              {v.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
