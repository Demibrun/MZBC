// src/app/loading.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-28 h-28 relative"
      >
        <Image
          src="/logo.jpg" // make sure your church logo is saved at public/logo.png
          alt="Mount Zion Bible Church Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}
