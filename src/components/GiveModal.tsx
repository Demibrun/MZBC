"use client";

import { useState } from "react";

export default function GiveModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const accounts = [
    {
      label: "Naira Account",
      fields: [
        { k: "Account number", v: "9200927934" },
        {
          k: "Account name",
          v: "MOUNT ZION PRAYER MINISTRY INTERNATIONAL",
        },
        { k: "Bank name", v: "STANBIC-IBTC BANK PLC" },
      ],
    },
  ];

  function copy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => alert("Copied!"),
      () => alert("Could not copy. Please copy manually.")
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="w-[92vw] max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-[var(--mz-deep-blue)]">
          Give to the Mission
        </h3>
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
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3"
                  >
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
                        f.v
                          ? "hover:bg-black/5"
                          : "opacity-40 cursor-not-allowed"
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
            onClick={onClose}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-black/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
