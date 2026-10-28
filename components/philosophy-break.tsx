"use client";

import React from "react";
import { motion } from "framer-motion";

export function PhilosophyBreak() {
  return (
    <section
      className="relative min-h-[75vh] flex flex-col justify-center items-center text-center px-6 sm:px-12 py-24 sm:py-32 overflow-hidden bg-[#050505] select-none"
      aria-label="Editing philosophy"
    >
      {/* Ambient Glow */}
      <div className="absolute w-[600px] h-[300px] bg-[#D7FF64]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/70">
            THE ZENITH EDITORIAL STANDARD
          </span>
        </motion.div>

        {/* Lead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-outfit font-black uppercase text-xl sm:text-3xl md:text-4xl tracking-tight text-white/40 mb-4"
        >
          GOOD EDITING ISN’T ABOUT MORE EFFECTS.
        </motion.p>

        {/* Hero Quote in Luxury Serif Italic */}
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif italic font-normal text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.08] tracking-tight max-w-4xl my-4"
        >
          “It’s about knowing when the viewer needs <span className="text-[#D7FF64]">something new.</span>”
        </motion.blockquote>

        {/* Rhythmic Principles List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs sm:text-sm text-white/60 uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <span className="text-[#D7FF64]">—</span> Every Cut
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-2">
            <span className="text-[#D7FF64]">—</span> Every Sound
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-2">
            <span className="text-[#D7FF64]">—</span> Every Hook
          </span>
          <span className="text-white/20">·</span>
          <span className="text-white font-bold">HAS A REASON.</span>
        </motion.div>
      </div>
    </section>
  );
}