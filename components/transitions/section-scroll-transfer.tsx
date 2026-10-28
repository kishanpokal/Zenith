"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Scissors, Film } from "lucide-react";

interface SectionScrollTransferProps {
  fromChapter: string;
  toChapter: string;
  fromTimecode?: string;
  toTimecode?: string;
  subtle?: boolean;
}

export function SectionScrollTransfer({
  fromChapter,
  toChapter,
  fromTimecode = "00:00:15:00",
  toTimecode = "00:00:30:00",
  subtle = false,
}: SectionScrollTransferProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  const playheadPercent = useTransform(smoothProgress, [0.15, 0.85], ["0%", "100%"]);
  const playheadNumber = useTransform(smoothProgress, [0.15, 0.85], [0, 100]);
  const flareScaleX = useTransform(smoothProgress, [0.35, 0.5, 0.65], [0.2, 1, 0.2]);
  const flareOpacity = useTransform(smoothProgress, [0.35, 0.5, 0.65], [0.05, 0.45, 0.05]);

  const [activeFrame, setActiveFrame] = useState(fromTimecode);

  useEffect(() => {
    return playheadNumber.on("change", (latest) => {
      const clamped = Math.max(0, Math.min(100, latest));
      const frameVal = Math.floor((clamped / 100) * 120);
      const sec = Math.floor(frameVal / 24);
      const rem = frameVal % 24;
      const secStr = String(sec).padStart(2, "0");
      const remStr = String(rem).padStart(2, "0");
      setActiveFrame(`00:00:${secStr}:${remStr}`);
    });
  }, [playheadNumber]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full py-10 sm:py-14 overflow-hidden select-none ${
        subtle ? "opacity-90" : ""
      }`}
      aria-hidden="true"
    >
      {/* Ambient optical flare in center on scroll pass */}
      <motion.div
        style={{
          scaleX: flareScaleX,
          opacity: flareOpacity,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent blur-sm pointer-events-none"
      />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-white/40 mb-3 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="text-white/60">{fromChapter}</span>
          </div>

          <div className="flex items-center gap-2 font-bold text-[#D4AF37]">
            <Film className="w-3.5 h-3.5 opacity-70" />
            <span>PLAYHEAD · {activeFrame}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/60">{toChapter}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
          </div>
        </div>

        {/* Cinematic Razor Scrub Track */}
        <div className="relative h-[1px] w-full bg-white/[0.07] overflow-visible">
          {/* Active progress fill */}
          <motion.div
            style={{ width: playheadPercent }}
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-white/10 via-[#D4AF37]/50 to-[#D4AF37]"
          />

          {/* Scrub Needle */}
          <motion.div
            style={{ left: playheadPercent }}
            className="absolute -top-2.5 -translate-x-1/2 w-5 h-5 flex items-center justify-center pointer-events-none"
          >
            <div className="w-3 h-3 rotate-45 rounded-sm bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.6)] border border-white/80 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#09090B]" />
            </div>
            {/* Vertical laser seam beam */}
            <div className="absolute top-3 w-[1px] h-5 bg-[#D4AF37]/60" />
          </motion.div>
        </div>

        {/* Micro Tick Marks */}
        <div className="flex justify-between items-center text-[9px] font-mono text-white/20 mt-2 px-0.5">
          <span>00:00</span>
          <span className="hidden sm:inline">24 FPS LOCK</span>
          <span className="flex items-center gap-1 text-[#D4AF37]/60">
            <Scissors className="w-2.5 h-2.5" />
            <span>SEAM CUT</span>
          </span>
          <span className="hidden sm:inline">PRORES 422</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
