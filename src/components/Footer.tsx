"use client";

import { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { SiZoom } from "react-icons/si"; // ✅ Zoom icon

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Prayer Capsule", href: "/prayer-capsule" },
  { label: "Zion Daily", href: "/zion-daily" },
  { label: "Work Force", href: "/work-force" },
  { label: "Humor of the Week", href: "/humor" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Deliverance", href: "/deliverance" },
  { label: "About", href: "/about" },
  { label: "Media", href: "/media" },
];

export default function Footer() {
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
  ];

  function copy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => alert("Copied!"),
      () => alert("Could not copy. Please copy manually.")
    );
  }

  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
        {/* Church Info */}
        <div>
          <div className="font-bold text-[var(--mz-deep-blue)]">
            Mount Zion Bible Church Nigeria
          </div>
          <p className="mt-1 text-sm text-[var(--mz-dark)]/70">
            “Zion, where captives become captains.”
          </p>
          <p className="mt-2 text-sm">
            SMS-only: 0814 859 9942 • mzpmintal@gmail.com
          </p>

          {/* Social Media Logos */}
          <div className="mt-4 flex gap-4">
            <a
              href="https://www.instagram.com/mountzionbiblechurch/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} color="#E4405F" />
            </a>
            <a
              href="https://web.facebook.com/mzpmi"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={24} color="#1877F2" />
            </a>
            <a
              href="https://www.youtube.com/@MountZionPrayerMinistryI-fz9ls/videos"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube size={24} color="#FF0000" />
            </a>
            <a
              href="https://zoom.us/j/54521258889?pwd=06KLX"
              target="_blank"
              rel="noreferrer"
              aria-label="Zoom"
            >
              <SiZoom size={24} color="#2D8CFF" />
            </a>
          </div>

          {/* Give button */}
          <div className="mt-4">
            <button
              onClick={() => setGiveOpen(true)}
              className="text-sm font-semibold text-[var(--mz-deep-blue)] hover:underline"
            >
              Give to the Mission
            </button>
          </div>
        </div>

        {/* Page Links */}
        <nav className="grid grid-cols-2 gap-2 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t py-4 text-center text-xs text-[var(--mz-dark)]/60">
        © {new Date().getFullYear()} Mount Zion Prayer Ministry Int’l — All rights reserved.
      </div>
    </footer>
  );
}
