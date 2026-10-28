"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicPreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-[#09090B] flex flex-col items-center justify-center p-8 select-none pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-12 h-12 rounded-full overflow-hidden border border-white/[0.12] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <img
                src="/brand/Zenith-logo.jpeg"
                alt="Zenith Logo"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-center gap-1.5 font-display font-bold tracking-tight text-[#F4F4F6] text-lg uppercase"
            >
              <span>ZENITH</span>
              <span className="text-white/40">STUDIO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            </motion.div>

            <div className="w-32 h-[1px] bg-white/[0.08] overflow-hidden mt-1">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="h-full bg-[#D4AF37]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
