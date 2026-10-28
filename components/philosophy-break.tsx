"use client";

import React from "react";
import { motion } from "framer-motion";

export function PhilosophyBreak() {
  return (
    <section
      className="relative min-h-[65vh] flex flex-col justify-center items-center text-center px-6 sm:px-12 py-24 sm:py-32 overflow-hidden bg-[#09090B] border-b border-white/[0.07] select-none"
      aria-label="Editing philosophy"
    >
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
            THE ZENITH EDITORIAL STANDARD
          </span>
        </motion.div>

        {/* Lead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-bold uppercase text-lg sm:text-2xl tracking-tight text-white/40 mb-3"
        >
          GOOD EDITING ISN&apos;T ABOUT MORE EFFECTS.
        </motion.p>

        {/* Hero Quote in Luxury Serif Italic */}
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif italic font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F4F4F6] leading-[1.1] tracking-tight max-w-4xl my-3"
        >
          &ldquo;It&apos;s about knowing when the viewer needs <span className="text-[#D4AF37]">something new.</span>&rdquo;
        </motion.blockquote>

        {/* Rhythmic Principles List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs text-white/60 uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">—</span> Every Cut
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">—</span> Every Sound
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-2">
            <span className="text-[#D4AF37]">—</span> Every Hook
          </span>
          <span className="text-white/20">·</span>
          <span className="text-white font-semibold">HAS A REASON.</span>
        </motion.div>
      </div>
    </section>
  );
}
