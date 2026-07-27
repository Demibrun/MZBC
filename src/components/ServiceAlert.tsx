"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Service = {
  title: string;
  day: number;
  time: string;
  note?: string;
  lastFriday?: boolean;
};

const SCHEDULE: Service[] = [
  {
    title: "HolyGhost Visitation Service",
    day: 0,
    time: "08:15",
    note: "Evangelism/Sunday School: 7:40-8:10am - Service from 8:15am",
  },
  {
    title: "Deliverance & Miracle Hour",
    day: 1,
    time: "11:30",
    note: "Come expecting miracles",
  },
  {
    title: "Word Liberation Hour",
    day: 3,
    time: "17:00",
  },
  {
    title: "Zion Breakthrough Night",
    day: 5,
    time: "22:00",
    lastFriday: true,
  },
];

function isLastFriday(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
  const weekday = today.getDay();

  const todaysServices = useMemo(() => {
    return SCHEDULE.filter((s) => {
      if (s.day !== weekday) return false;
      if (s.lastFriday) return isLastFriday(today);
      return true;
    });
  }, [weekday, today]);

  useEffect(() => {
    if (todaysServices.length === 0) return;
    const dismissed = localStorage.getItem(todayKey);
    if (!dismissed) setOpen(true);
  }, [todaysServices, todayKey]);

  if (!open || todaysServices.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--mz-deep-blue)]/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg border border-[var(--mz-border)] bg-white p-6 shadow-2xl">
        <p className="section-kicker">Service Today</p>
        <h3 className="mt-2 text-xl font-extrabold text-[var(--mz-deep-blue)]">
          You're welcome to worship with us
        </h3>
        <p className="mt-1 text-sm text-[var(--mz-dark)]/70">
          Join today's gathering and come expectant.
        </p>

        <ul className="mt-4 space-y-3">
          {todaysServices.map((s, i) => (
            <li
              key={i}
              className="rounded-lg border border-[var(--mz-border)] bg-[var(--mz-light)] p-3"
            >
              <div className="font-semibold text-[var(--mz-deep-blue)]">{s.title}</div>
              <div className="text-sm text-[var(--mz-dark)]/80">
                {formatTime(s.time)} - {weekdayName(weekday)}
              </div>
              {s.note && (
                <div className="mt-1 text-xs text-[var(--mz-dark)]/60">{s.note}</div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href="/services"
            className="btn-primary"
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
            className="rounded-lg border border-[var(--mz-border)] px-3 py-2 text-sm hover:bg-slate-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function weekdayName(d: number) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
