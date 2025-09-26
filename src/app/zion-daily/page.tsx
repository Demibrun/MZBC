"use client";
import { useEffect, useState } from "react";

type Entry = { _id?: string; date?: string; title: string; subtitle?: string; text: string };
type ApiDaily = {
  sections?: {
    wordOfDay?: { items?: Entry[] };
    prophetic?: { items?: Entry[] };
    sundaySchool?: { items?: Entry[] };
    devotional?: { items?: Entry[] };
    homecare?: { items?: Entry[] };
  };
};

const FALLBACK: Required<ApiDaily> = {
  sections: {
    wordOfDay: { items: [{ date: "Today", title: "Word of the Day", subtitle: "Psalm 3:3", text: "But thou, O LORD, art a shield for me; my glory, and the lifter up of mine head." }] },
    prophetic: { items: [{ date: "Today", title: "Daily Declarations", text: "Declare the Word of God daily." }] },
    sundaySchool: { items: [{ date: "This Sunday", title: "Sunday School", subtitle: "Faith & Obedience", text: "Lesson: living faith that obeys God promptly." }] },
    devotional: { items: [{ date: "Today", title: "Daily Devotional", text: "God is faithful in every season." }] },
    homecare: { items: [{ date: "This Week", title: "Homecare Fellowship", subtitle: "See ushers for nearest center.", text: "Care for one another (Gal. 6:2)." }] },
  },
};

export default function ZionDailyPage() {
  const [data, setData] = useState<ApiDaily | null>(null);
  const [open, setOpen] = useState<{ key: keyof NonNullable<ApiDaily["sections"]>; index: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/daily", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const json = (await res.json()) as ApiDaily;
        if (mounted) setData(json);
      } catch {
        if (mounted) setData(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sections = normalizeData(data);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--mz-primary-blue)] drop-shadow">
          Zion Daily
        </h1>
        <p className="mt-1 text-[var(--mz-dark)]/70">
          Tap any card to read or pick a previous day.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <div
            key={sec.key}
            className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,.15)]"
          >
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[var(--mz-deep-blue)]">{sec.title}</h2>
                <button
                  onClick={() => setOpen({ key: sec.key as any, index: 0 })}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
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
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2"
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (!Number.isNaN(idx)) setOpen({ key: sec.key as any, index: idx });
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-black/10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <h3 className="text-lg font-semibold text-[var(--mz-deep-blue)]">
                {sectionsByKey(sections, open.key)?.items[open.index]?.title ?? "Details"}
              </h3>
              <button
                onClick={() => setOpen(null)}
                className="rounded-md p-2 hover:bg-black/5"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-4">
              {(() => {
                const it = sectionsByKey(sections, open.key)?.items[open.index];
                if (!it) return <p className="text-sm text-gray-600">Not found.</p>;
                return (
                  <>
                    {it.subtitle && (
                      <p className="text-sm font-medium text-[var(--mz-deep-blue)]/80">{it.subtitle}</p>
                    )}
                    <div className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--mz-dark)]">
                      {it.text}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function normalizeData(api: ApiDaily | null): { key: string; title: string; items: Entry[] }[] {
  const src = api?.sections || FALLBACK.sections;
  const coerce = (arr?: Entry[]) =>
    Array.isArray(arr) && arr.length ? arr : [{ title: "No content", text: "Content will appear here soon." }];

  return [
    { key: "wordOfDay", title: "Word of the Day", items: coerce(src.wordOfDay?.items) },
    { key: "prophetic", title: "Prophetic Declaration", items: coerce(src.prophetic?.items) },
    { key: "sundaySchool", title: "Sunday School", items: coerce(src.sundaySchool?.items) },
    { key: "devotional", title: "Daily Devotional", items: coerce(src.devotional?.items) },
    { key: "homecare", title: "Homecare Fellowship", items: coerce(src.homecare?.items) },
  ];
}

function sectionsByKey(list: { key: string; title: string; items: Entry[] }[], key: any) {
  return list.find((x) => x.key === key);
}
