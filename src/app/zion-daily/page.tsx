"use client";
import { useEffect, useMemo, useState } from "react";

/** ---------- Types ---------- */
type SectionKey = "wordOfDay" | "prophetic" | "sundaySchool" | "devotional" | "homecare";

type Entry = {
  _id?: string;
  date?: string;
  title: string;
  subtitle?: string;
  text: string;
  // optional media (only meaningful for sundaySchool)
  mediaKind?: "youtube" | "audio" | "video" | null;
  mediaUrl?: string;
  mediaTitle?: string;
  thumbnail?: string;
};

type ApiDailyOne = { section?: { key: SectionKey; items?: Entry[] } };

const TITLES: Record<SectionKey, string> = {
  wordOfDay: "Word of the Day",
  prophetic: "Prophetic Declaration",
  sundaySchool: "Sunday School",
  devotional: "Daily Devotional",
  homecare: "Homecare Fellowship",
};

const FALLBACK_ITEMS: Record<SectionKey, Entry[]> = {
  wordOfDay: [
    {
      date: "Today",
      title: "Word of the Day",
      subtitle: "Psalm 3:3",
      text: "But thou, O LORD, art a shield for me; my glory, and the lifter up of mine head.",
    },
  ],
  prophetic: [{ date: "Today", title: "Daily Declarations", text: "Declare the Word of God daily." }],
  sundaySchool: [
    {
      date: "This Sunday",
      title: "Sunday School",
      subtitle: "Faith & Obedience",
      text: "Lesson: living faith that obeys God promptly.",
    },
  ],
  devotional: [{ date: "Today", title: "Daily Devotional", text: "God is faithful in every season." }],
  homecare: [
    {
      date: "This Week",
      title: "Homecare Fellowship",
      subtitle: "See ushers for nearest center.",
      text: "Care for one another (Gal. 6:2).",
    },
  ],
};

/** ---------- Page ---------- */
export default function ZionDailyPage() {
  const [sections, setSections] = useState<
    { key: SectionKey; title: string; items: Entry[] }[]
  >(() =>
    (Object.keys(TITLES) as SectionKey[]).map((k) => ({
      key: k,
      title: TITLES[k],
      items: FALLBACK_ITEMS[k],
    }))
  );

  const [open, setOpen] = useState<{ key: SectionKey; index: number } | null>(null);

  // Load all sections individually to match /api/daily?section=...
  useEffect(() => {
    let alive = true;
    const keys: SectionKey[] = ["wordOfDay", "prophetic", "sundaySchool", "devotional", "homecare"];

    (async () => {
      try {
        const results = await Promise.allSettled(
          keys.map(async (key) => {
            const res = await fetch(`/api/daily?section=${key}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed");
            const json = (await res.json()) as ApiDailyOne;
            const items = json?.section?.items ?? [];
            return { key, items };
          })
        );

        if (!alive) return;

        const mapped = results.map((r, i) => {
          const key = keys[i];
          if (r.status === "fulfilled" && r.value && Array.isArray(r.value.items) && r.value.items.length) {
            return { key, title: TITLES[key], items: r.value.items };
          }
          // fallback for empty/error
          return { key, title: TITLES[key], items: FALLBACK_ITEMS[key] };
        });

        setSections(mapped);
      } catch {
        // leave fallbacks on any global failure
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const sectionByKey = useMemo(
    () => new Map(sections.map((s) => [s.key, s] as const)),
    [sections]
  );
  const activeEntry = open ? sectionByKey.get(open.key)?.items[open.index] : null;
  const isSundayMedia =
    open?.key === "sundaySchool" && !!activeEntry?.mediaKind && !!activeEntry?.mediaUrl;

  return (
    <main className="section">
      <header className="mb-8">
        <p className="section-kicker">Daily nourishment</p>
        <h1 className="h1 mt-2">Zion Daily</h1>
        <p className="section-subtitle">Tap any card to read or pick a previous day.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <div
            key={sec.key}
            className="card"
          >
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[var(--mz-deep-blue)]">{sec.title}</h2>
                <button
                  onClick={() => setOpen({ key: sec.key, index: 0 })}
                  className="btn-primary px-3 py-1.5"
                  style={{ backgroundColor: "var(--mz-primary-blue)" }}
                >
                  Open
                </button>
              </div>

              <p className="mt-2 text-sm text-[var(--mz-dark)]/80 line-clamp-3 whitespace-pre-line">
                {sec.items[0]?.text ?? "No content yet."}
              </p>

              <div className="mt-4">
                <label className="text-xs text-[var(--mz-dark)]/60">Previous entries</label>
                <select
                  className="input-polish mt-1 w-full"
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (!Number.isNaN(idx)) setOpen({ key: sec.key, index: idx });
                  }}
                  value=""
                >
                  <option value="" disabled>
                    Select a day…
                  </option>
                  {sec.items.map((it, i) => (
                    <option key={i} value={i}>
                      {it.date ? `${it.date} — ${it.title}` : it.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--mz-deep-blue)]/55 p-4 backdrop-blur-sm">
          <div
            className={`w-full max-h-[88vh] overflow-y-auto rounded-lg bg-white shadow-2xl border border-[var(--mz-border)] ${
              isSundayMedia ? "max-w-5xl" : "max-w-2xl"
            }`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--mz-border)] px-5 py-4">
              <h3 className="text-lg font-semibold text-[var(--mz-deep-blue)]">
                {activeEntry?.title ?? "Details"}
              </h3>
              <div className="flex items-center gap-2">
                {isSundayMedia && activeEntry?.mediaUrl ? (
                  <a
                    href={mediaHref(activeEntry.mediaKind, activeEntry.mediaUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-[var(--mz-border)] px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
                  >
                    Open media
                  </a>
                ) : null}
                <button
                  onClick={() => setOpen(null)}
                  className="relative rounded-md px-3 py-2 text-sm font-semibold text-transparent hover:bg-slate-50 after:text-[var(--mz-deep-blue)] after:content-['x']"
                  aria-label="Close"
                >
                ✕
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              {(() => {
                const it = activeEntry;
                if (!it) return <p className="text-sm text-gray-600">Not found.</p>;

                const hasMedia =
                  open.key === "sundaySchool" && it.mediaKind && it.mediaUrl;

                return (
                  <div className={hasMedia ? "grid gap-5 lg:grid-cols-[1fr_1.35fr]" : ""}>
                    <div>
                      {it.subtitle && (
                        <p className="text-sm font-medium text-[var(--mz-deep-blue)]/80">{it.subtitle}</p>
                      )}
                      <div className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--mz-dark)]">
                        {it.text}
                      </div>
                    </div>

                    {hasMedia ? (
                      <div className="lg:sticky lg:top-4">
                        <RenderMedia
                          kind={it.mediaKind}
                          url={it.mediaUrl}
                          title={it.mediaTitle || it.title}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/** ---------- Helpers ---------- */
function RenderMedia({
  kind,
  url,
  title,
}: {
  kind?: "youtube" | "audio" | "video" | null;
  url?: string;
  title?: string;
}) {
  if (!kind || !url) return null;

  if (kind === "youtube") {
    const id = getYouTubeId(url);
    if (!id) return null;
    return (
      <iframe
        className="aspect-video w-full rounded border"
        src={`https://www.youtube.com/embed/${id}`}
        title={title || "Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (kind === "audio") {
    return <audio className="w-full" controls src={url} />;
  }

  if (kind === "video") {
    return <video className="w-full rounded" controls src={url} />;
  }

  return null;
}

function mediaHref(kind: Entry["mediaKind"], url: string) {
  if (kind === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://youtu.be/${id}` : url;
  }
  return url;
}

function getYouTubeId(input: string): string | null {
  try {
    if (!input) return null;
    if (!input.includes("http")) return input;
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") || null;
    }
    return null;
  } catch {
    return null;
  }
}
