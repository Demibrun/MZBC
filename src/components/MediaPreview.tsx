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
    <section className="section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Latest messages</p>
          <h2 className="h2 mt-2">Media Highlights</h2>
          <p className="section-subtitle">
            Recent services and teachings from the Mount Zion media channel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/media" className="btn-primary">
            See more
          </Link>
          <a href={YT_CHANNEL} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline" className="rounded-lg">
              View Channel
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <div key={v.id} className="card">
            <YouTubeLite id={v.id} title={v.title} />
            <div className="px-4 py-3 text-sm font-medium text-[var(--mz-dark)]/80 line-clamp-2">
              {v.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
