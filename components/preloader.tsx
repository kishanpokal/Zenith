"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicPreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If already seen, bypass immediately
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("zenith_preloader_seen");
      if (hasSeen) {
        setLoading(false);
        return;
      }
    }

    const timer = setTimeout(() => {
      setLoading(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("zenith_preloader_seen", "true");
      }
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-8 select-none pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(215,255,100,0.2)]"
            >
              <img
                src="/brand/Zenith-logo.jpeg"
                alt="Zenith Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex items-center gap-2 font-outfit font-black tracking-tight text-white text-xl"
            >
              <span>ZENITH</span>
              <span className="text-white/40">EDITS</span>
              <span className="w-2 h-2 rounded-full bg-[#D7FF64] animate-pulse" />
            </motion.div>

            <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                className="h-full bg-[#D7FF64]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}