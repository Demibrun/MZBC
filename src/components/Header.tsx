'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  // close menu on hash change / navigation
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="relative mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-bold text-[var(--mz-deep-blue)]">
          Mount Zion Bible Church
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-5 text-sm">
          <a href="#about" className="hover:text-[var(--mz-primary-blue)]">About</a>
          <a href="#services" className="hover:text-[var(--mz-primary-blue)]">Services</a>
          <a href="#media" className="hover:text-[var(--mz-primary-blue)]">Media</a>
          <a href="#visit" className="hover:text-[var(--mz-primary-blue)]">Visit</a>
          <a href="#contact" className="hover:text-[var(--mz-primary-blue)]">Contact</a>
          <Link href="/admin" className="text-[var(--mz-primary-blue)] font-medium">Admin</Link>
        </nav>

        {/* Burger */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-black/10"
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-black transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-black transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-black transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>

        {/* Mobile drawer — absolute so it doesn't push content; only rendered when open */}
        {open && (
          <div className="absolute left-0 right-0 top-full md:hidden">
            <nav className="mt-2 rounded-xl border bg-white shadow-md p-3 grid gap-2 text-sm">
              <a onClick={() => setOpen(false)} href="#about" className="py-2">About</a>
              <a onClick={() => setOpen(false)} href="#services" className="py-2">Services</a>
              <a onClick={() => setOpen(false)} href="#media" className="py-2">Media</a>
              <a onClick={() => setOpen(false)} href="#visit" className="py-2">Visit</a>
              <a onClick={() => setOpen(false)} href="#contact" className="py-2">Contact</a>
              <Link onClick={() => setOpen(false)} href="/admin" className="py-2">Admin</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
