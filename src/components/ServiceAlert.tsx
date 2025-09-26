"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/**
 * ServiceAlert
 * - Shows a modal on the home page when today is a service day.
 * - Dismiss state is stored per-day in localStorage: serviceAlertDismissed-YYYY-MM-DD
 * - Uses browser local time; set schedule below (24h time).
 */

type Service = {
  title: string;
  day: number;         // 0=Sun ... 6=Sat
  time: string;        // "HH:MM" 24h local time
  note?: string;
  lastFriday?: boolean; // if true, this service occurs on the last Friday of the month
};

// EDIT to match your schedule
const SCHEDULE: Service[] = [
  {
    title: "HolyGhost Visitation Service",
    day: 0, // Sunday
    time: "08:15",
    note: "Evangelism/Sunday School: 7:40–8:10am • Service from 8:15am",
  },
  {
    title: "Deliverance & Miracle Hour",
    day: 1, // Monday
    time: "11:30",
    note: "Come expecting miracles",
  },
  {
    title: "Word Liberation Hour",
    day: 3, // Wednesday
    time: "17:00",
  },
  {
    title: "Zion Breakthrough Night",
    day: 5, // Friday
    time: "22:00",
    lastFriday: true,
  },
];

function isLastFriday(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0); // last day of month
  // go backwards to Friday
  const lastFriday = new Date(d);
  while (lastFriday.getDay() !== 5) lastFriday.setDate(lastFriday.getDate() - 1);
  return (
    date.getFullYear() === lastFriday.getFullYear() &&
    date.getMonth() === lastFriday.getMonth() &&
    date.getDate() === lastFriday.getDate()
  );
}

function ymd(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ServiceAlert() {
  const [open, setOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const todayKey = `serviceAlertDismissed-${ymd(today)}`;
  const weekday = today.getDay(); // 0..6

  // Build today's services list
  const todaysServices = useMemo(() => {
    return SCHEDULE.filter((s) => {
      if (s.day !== weekday) return false;
      if (s.lastFriday) return isLastFriday(today);
      return true;
    });
  }, [weekday, today]);

  // Decide whether to show
  useEffect(() => {
    if (todaysServices.length === 0) return;
    const dismissed = localStorage.getItem(todayKey);
    if (!dismissed) setOpen(true);
  }, [todaysServices, todayKey]);

  if (!open || todaysServices.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-[92vw] max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-black/10"
        style={{
          // gentle glass look
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow:
            "0 0 0 2px var(--mz-gold), 0 12px 36px rgba(30,109,227,.25)",
        }}
      >
        <h3 className="text-xl font-extrabold text-[var(--mz-deep-blue)]">
          Service Today
        </h3>
        <p className="text-sm text-[var(--mz-dark)]/70 mt-1">
          You’re welcome to worship with us!
        </p>

        <ul className="mt-4 space-y-3">
          {todaysServices.map((s, i) => (
            <li
              key={i}
              className="rounded-xl border border-black/10 p-3 bg-[var(--mz-light)]"
            >
              <div className="font-semibold text-[var(--mz-deep-blue)]">
                {s.title}
              </div>
              <div className="text-sm text-[var(--mz-dark)]/80">
                {formatTime(s.time)} • {weekdayName(weekday)}
              </div>
              {s.note && (
                <div className="text-xs text-[var(--mz-dark)]/60 mt-1">
                  {s.note}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href="/services"
            className="rounded-lg px-4 py-2 text-white"
            style={{ backgroundColor: "var(--mz-primary-blue)" }}
            onClick={() => {
              localStorage.setItem(todayKey, "1");
              setOpen(false);
            }}
          >
            View Services
          </Link>

            <button
              onClick={() => {
                localStorage.setItem(todayKey, "1");
                setOpen(false);
              }}
              className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
            >
              Dismiss for today
            </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function weekdayName(d: number) {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d];
}

function formatTime(t: string) {
  // "HH:MM" -> local 12h format
  const [h, m] = t.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
