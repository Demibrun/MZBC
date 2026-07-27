"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--mz-border)] bg-white/92 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Brand */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="MZBC"
              width={36}
              height={36}
              priority
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--mz-primary-blue)]/20"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold leading-tight text-[var(--mz-deep-blue)] md:text-base">
                Mount Zion Bible Church
              </span>
              <span className="hidden text-xs font-medium text-[var(--mz-dark)]/55 sm:block">
                Prayer Ministry International
              </span>
            </span>
          </Link>

          {/* Desktop (lg+) */}
          <nav className="hidden items-center gap-1 text-[var(--mz-dark)] lg:flex">
            <NavLinks activePath={pathname} onClick={() => {}} />
            {/* Admin link removed from public header */}
          </nav>

          {/* Burger (mobile + tablet) */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-[var(--mz-border)] bg-white lg:hidden"
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
        className={`fixed inset-0 z-40 bg-[var(--mz-deep-blue)]/45 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in Drawer (mobile/tablet) */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[86%] max-w-[360px] bg-white
          transform transition-transform duration-300 lg:hidden
          border-l border-[var(--mz-border)]
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          // Gold/Blue interchangeable accent: ring + outer glow
          boxShadow:
            "0 0 0 2px var(--mz-gold), 0 10px 30px rgba(30,109,227,.25)",
        }}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--mz-border)] px-4">
          <span className="font-semibold text-[var(--mz-deep-blue)]">MZBC</span>
          <button
            onClick={() => setOpen(false)}
            className="relative rounded-md p-2 text-transparent hover:bg-black/5 after:text-[var(--mz-deep-blue)] after:content-['x']"
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
          </ul>
        </nav>
      </aside>
    </>
  );
}

/* ----------------- helpers ----------------- */

function NavLinks({
  activePath,
  onClick,
}: {
  activePath: string;
  onClick: () => void;
}) {
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
          className={`rounded-md px-2.5 py-2 text-sm font-medium transition ${
            activePath === href
              ? "bg-[var(--mz-primary-blue)]/10 text-[var(--mz-primary-blue)]"
              : "text-[var(--mz-deep-blue)] hover:bg-slate-100 hover:text-[var(--mz-primary-blue)]"
          }`}
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
