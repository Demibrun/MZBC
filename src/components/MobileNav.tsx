"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: Props) {
  // lock scroll while menu is open
  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay – lighter and slightly blurred for better legibility */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in white sheet */}
          <motion.aside
            className="fixed right-0 top-0 z-[90] h-full w-[84%] max-w-[360px] bg-white shadow-2xl ring-1 ring-black/10"
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <span className="font-semibold text-[var(--mz-deep-blue)]">
                Mount Zion Bible Church
              </span>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--mz-primary-blue)]"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="px-5 py-4 text-[var(--mz-dark)]">
              <ul className="space-y-1">
                {[
                  ["Home", "/"],
                  ["Services", "/services"],
                  ["Prayer Capsule", "/prayer-capsule"],
                  ["Zion Daily", "/zion-daily"],
                  ["Work Force", "/work-force"],
                  ["Media", "/media"],
                  ["About", "/about"],
                  ["Deliverance", "/deliverance"],
                  ["Admin", "/admin"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-[var(--mz-sky-50)] hover:text-[var(--mz-deep-blue)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
