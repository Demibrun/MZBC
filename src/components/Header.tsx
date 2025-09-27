"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Header
 * - White bar
 * - Burger -> X (animated)
 * - Slide-in mobile/tablet drawer (white)
 * - Gold + Blue accent (ring + shadow) on the sheet for mobile/tablet
 * - Desktop menu shows from lg and above
 */

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-black/10">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.jpg"
              alt="MZBC"
              className="h-9 w-9 rounded-full ring-2 ring-[var(--mz-primary-blue)]/30"
            />
            <span className="font-semibold text-[var(--mz-deep-blue)]">
              Mount Zion Bible Church
            </span>
          </Link>

          {/* Desktop (lg+) */}
          <nav className="hidden lg:flex items-center gap-6 text-[var(--mz-dark)]">
            <NavLinks onClick={() => {}} />
            {/* Admin link removed from public header */}
          </nav>

          {/* Burger (mobile + tablet) */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden relative h-10 w-10 grid place-items-center rounded-lg border border-black/10"
          >
            {/* Animated burger -> X */}
            <span className="sr-only">Toggle menu</span>
            <span
              className={`block h-0.5 w-6 bg-[var(--mz-deep-blue)] transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[var(--mz-deep-blue)] transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[var(--mz-deep-blue)] transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in Drawer (mobile/tablet) */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[86%] max-w-[360px] bg-white
          transform transition-transform duration-300 lg:hidden
          border-l border-black/10
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          // Gold/Blue interchangeable accent: ring + outer glow
          boxShadow:
            "0 0 0 2px var(--mz-gold), 0 10px 30px rgba(30,109,227,.25)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-black/10">
          <span className="font-semibold text-[var(--mz-deep-blue)]">MZPMI</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-2 hover:bg-black/5"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="px-4 py-4">
          <ul className="space-y-1">
            <NavItem label="Home" href="/" onClick={() => setOpen(false)} />
            <NavItem
              label="Services"
              href="/services"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Prayer Capsule"
              href="/prayer-capsule"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Zion Daily"
              href="/zion-daily"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Work Force"
              href="/work-force"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Humor"
              href="/humor"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Media"
              href="/media"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Deliverance"
              href="/deliverance"
              onClick={() => setOpen(false)}
            />
            <NavItem
              label="Testimonies"
              href="/testimonies"
              onClick={() => setOpen(false)}
            />
            {/* Admin link removed from mobile drawer */}
          </ul>
        </nav>
      </aside>
    </>
  );
}

/* ----------------- helpers ----------------- */

function NavLinks({ onClick }: { onClick: () => void }) {
  const items = [
    ["Home", "/"],
    ["Prayer Capsule", "/prayer-capsule"],
    ["Zion Daily", "/zion-daily"],
    ["Work Force", "/work-force"],
    ["Deliverance", "/deliverance"],
    ["Testimonies", "/testimonies"],
    ["Humor of The Week", "/humor"],
    ["Media", "/media"],
    ["Services", "/services"],
  ] as const;
  return (
    <>
      {items.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className="text-[var(--mz-deep-blue)] hover:text-[var(--mz-primary-blue)] transition"
        >
          {label}
        </Link>
      ))}
    </>
  );
}

function NavItem({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="block rounded-lg px-3 py-3 text-base text-[var(--mz-deep-blue)] hover:bg-black/5"
      >
        {label}
      </Link>
    </li>
  );
}
