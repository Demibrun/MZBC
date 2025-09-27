"use client";
import { useState } from "react";
// ...your other imports

export default function Hero() {
  const [liveOpen, setLiveOpen] = useState(false);
  const [giveOpen, setGiveOpen] = useState(false);

  const accounts = [
    {
      label: "Naira Account",
      fields: [
        { k: "Account number", v: "9200927934" },
        { k: "Account name", v: "MOUNT ZION PRAYER MINISTRY INTERNATIONAL" },
        { k: "Bank name", v: "STANBIC-IBTC BANK PLC" },
      ],
    },
  ]

  function copy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => alert("Copied!"),
      () => alert("Could not copy. Please copy manually.")
    );
  }

  return (
    <div className="gradient-hero">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        {/* If your logo is in /public/logo.jpg, use /logo.jpg (no ../) */}
        <img src="/logo.jpg" alt="Church Logo" className="mx-auto h-28 w-28 object-contain" />

        <h1 className="mt-6 text-3xl md:text-5xl font-extrabold text-[var(--mz-deep-blue)]">
          Mount Zion Bible Church Nigeria
        </h1>
        <p className="mt-3 text-lg md:text-xl">Zion, where captives become captains.</p>

        {/* Buttons row (kept exactly; Watch uses your btn-primary too) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#visit" className="btn-primary">Plan Your Visit</a>

          <button
            onClick={() => setLiveOpen(true)}
            className="btn-primary"
          >
            Watch Live
          </button>
        </div>

        {/* Give button placed UNDER the first two buttons, as requested */}
        <div className="mt-3 flex items-center justify-center">
          <button
            onClick={() => setGiveOpen(true)}
            className="bg-[var(--mz-green)]/90 text-blue px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
          >
            Give to the Mission
          </button>
        </div>
      </div>

      {/* Watch Live chooser (unchanged layout) */}
      {liveOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-[92vw] max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">Watch Live</h3>
            <p className="text-sm text-gray-600 mt-1 mb-4">Choose your platform:</p>

          <div className="grid gap-3">
  <a
    href="https://www.youtube.com/@MountZionPrayerMinistryI-fz9ls/live"
    target="_blank"
    rel="noreferrer"
    className="block rounded-md px-4 py-2 text-center font-medium text-white bg-[#FF0000] hover:opacity-90"
  >
    YouTube
  </a>
  <a
    href="https://web.facebook.com/mzpmi"
    target="_blank"
    rel="noreferrer"
    className="block rounded-md px-4 py-2 text-center font-medium text-white bg-[#1877F2] hover:opacity-90"
  >
    Facebook
  </a>
</div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setLiveOpen(false)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Give to the Mission modal (unchanged style) */}
      {giveOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
          <div className="w-[92vw] max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[var(--mz-deep-blue)]">Give to the Mission</h3>
            <p className="text-sm text-[var(--mz-dark)]/70 mt-1 mb-4">
              Church account details
            </p>

            <div className="space-y-4">
              {accounts.map((acc, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-black/10 p-4 bg-[var(--mz-light)]"
                >
                  <p className="font-semibold text-[var(--mz-deep-blue)] mb-2">
                    {acc.label}
                  </p>

                  <dl className="space-y-2">
                    {acc.fields.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <div>
                          <dt className="text-xs text-[var(--mz-dark)]/70">{f.k}</dt>
                          <dd className="text-sm font-medium text-[var(--mz-dark)] break-all">
                            {f.v || <span className="text-gray-400">—</span>}
                          </dd>
                        </div>
                        <button
                          disabled={!f.v}
                          onClick={() => copy(f.v)}
                          className={`rounded-md border px-3 py-1 text-sm ${
                            f.v ? "hover:bg-black/5" : "opacity-40 cursor-not-allowed"
                          }`}
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setGiveOpen(false)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
