"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Film, Volume2, Sparkles, Scissors, Sliders } from "lucide-react";

export function TimelineScrollTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.3,
  });

  // Playhead percentage across the timeline
  const playheadPercent = useTransform(smoothProgress, [0.1, 0.9], ["0%", "100%"]);
  const playheadValue = useTransform(smoothProgress, [0.1, 0.9], [0, 100]);

  // Dynamic Timecode readout derived from scroll progress
  const [timecodeStr, setTimecodeStr] = useState("00:00:00:00");

  useEffect(() => {
    return playheadValue.on("change", (latest) => {
      const clamped = Math.max(0, Math.min(100, latest));
      const totalFrames = Math.floor((clamped / 100) * 1440); // 60 seconds at 24fps
      const frames = totalFrames % 24;
      const seconds = Math.floor(totalFrames / 24) % 60;
      const minutes = Math.floor(totalFrames / (24 * 60));
      setTimecodeStr(
        `00:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`
      );
    });
  }, [playheadValue]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#09090B] py-16 sm:py-24 border-y border-white/[0.07] overflow-hidden select-none"
      aria-label="Video Editing Timeline Scrubber Transition"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* TOP STATUS CONSOLE */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] text-[#F4F4F6]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>NLE TIMELINE ARCHITECTURE</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-white/40">
              <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>FRAME-ACCURATE CHOREOGRAPHY</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/60">
            <div className="flex items-center gap-2 bg-[#121216] px-3 py-1 rounded-sm border border-white/[0.07] text-[#D4AF37]">
              <span className="text-[10px] text-white/40 uppercase">PLAYHEAD TC:</span>
              <span className="font-bold tracking-wider">{timecodeStr}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-white/40 text-[11px]">
              <span>24.00 FPS</span>
              <span>·</span>
              <span>4K PRORES 422 HQ</span>
            </div>
          </div>
        </div>

        {/* NLE TIMELINE CONSOLE CONTAINER */}
        <div className="relative rounded-xl bg-[#121216] border border-white/[0.07] p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          {/* VIEW FINDER CORNER ACCENTS */}
          <div className="absolute top-2 left-2 text-[#D4AF37]/50 font-mono text-xs pointer-events-none">┌</div>
          <div className="absolute top-2 right-2 text-[#D4AF37]/50 font-mono text-xs pointer-events-none">┐</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37]/50 font-mono text-xs pointer-events-none">└</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37]/50 font-mono text-xs pointer-events-none">┘</div>

          {/* TIMECODE RULER */}
          <div className="relative w-full h-8 mb-4 border-b border-white/[0.07] flex items-end justify-between font-mono text-[10px] text-white/40 px-2 overflow-hidden">
            <span className="relative z-10">00:00:00:00</span>
            <span className="hidden sm:inline relative z-10">00:00:15:00</span>
            <span className="relative z-10">00:00:30:00</span>
            <span className="hidden sm:inline relative z-10">00:00:45:00</span>
            <span className="relative z-10">00:01:00:00</span>

            {/* Micro Tick Marks */}
            <div className="absolute inset-x-0 bottom-0 h-2 flex justify-between pointer-events-none opacity-30">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[1px] ${i % 6 === 0 ? "h-2 bg-white/70" : "h-1 bg-white/30"}`}
                />
              ))}
            </div>
          </div>

          {/* NLE TRACK STACK */}
          <div className="space-y-2.5 relative">
            {/* TRACK V2: MOTION GRAPHICS */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 flex-shrink-0 flex items-center justify-between px-2.5 py-2 rounded-sm bg-[#09090B] border border-white/[0.07] text-[10px] font-mono font-bold text-[#F4F4F6]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>V2 MFX</span>
                </span>
                <span className="text-[9px] text-white/30">KEY</span>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-1.5 h-9">
                <div className="col-span-3 rounded-sm bg-white/[0.03] border border-white/[0.07] px-2 flex items-center text-[10px] font-mono text-white/80 truncate">
                  ◆ AE EXPRESSIONS
                </div>
                <div className="col-span-5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 flex items-center text-[10px] font-mono text-[#D4AF37] truncate">
                  ◆ 3D CAMERA TRACK
                </div>
                <div className="col-span-4 rounded-sm bg-white/[0.03] border border-white/[0.07] px-2 flex items-center text-[10px] font-mono text-white/80 truncate">
                  ◆ KINETIC TYPE
                </div>
              </div>
            </div>

            {/* TRACK V1: PICTURE LOCK */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 flex-shrink-0 flex items-center justify-between px-2.5 py-2 rounded-sm bg-[#09090B] border border-white/[0.07] text-[10px] font-mono font-bold text-[#D4AF37]">
                <span className="flex items-center gap-1.5">
                  <Film className="w-3 h-3 text-[#D4AF37]" />
                  <span>V1 VIDEO</span>
                </span>
                <span className="text-[9px] text-white/30">LOCK</span>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-1.5 h-10">
                <div className="col-span-4 rounded-sm bg-white/[0.04] border border-white/[0.08] px-2.5 flex items-center justify-between text-[10px] font-mono text-[#F4F4F6] truncate">
                  <span className="font-medium truncate">01_TALKING_HEAD.MOV</span>
                  <span className="text-[9px] opacity-70">100%</span>
                </div>
                <div className="col-span-5 rounded-sm bg-white/[0.06] border border-white/[0.12] px-2.5 flex items-center justify-between text-[10px] font-mono text-white truncate">
                  <span className="font-semibold truncate">02_SPEED_RAMP_120FPS</span>
                  <span className="text-[9px] text-[#D4AF37]">4K</span>
                </div>
                <div className="col-span-3 rounded-sm bg-white/[0.04] border border-white/[0.08] px-2.5 flex items-center justify-between text-[10px] font-mono text-[#F4F4F6] truncate">
                  <span className="font-medium truncate">03_DIRECTOR_CUT</span>
                </div>
              </div>
            </div>

            {/* TRACK A1: FOLEY & SFX */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 flex-shrink-0 flex items-center justify-between px-2.5 py-2 rounded-sm bg-[#09090B] border border-white/[0.07] text-[10px] font-mono font-bold text-white/80">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>A1 AUDIO</span>
                </span>
                <span className="text-[9px] text-white/30">-14LU</span>
              </div>

              <div className="flex-1 grid grid-cols-12 gap-1.5 h-9">
                <div className="col-span-3 rounded-sm bg-white/[0.03] border border-white/[0.07] px-2 flex items-center gap-2 text-[10px] font-mono text-white/70 truncate">
                  <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                    <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[#D4AF37]" />
                    <span className="w-0.5 h-1.5 bg-[#D4AF37]" />
                  </div>
                  <span className="truncate">SUB RISER 40Hz</span>
                </div>

                <div className="col-span-4 rounded-sm bg-white/[0.03] border border-white/[0.07] px-2 flex items-center gap-2 text-[10px] font-mono text-white/70 truncate">
                  <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                    <span className="w-0.5 h-3 bg-[#D4AF37] animate-bounce" />
                    <span className="w-0.5 h-1 bg-[#D4AF37]" />
                    <span className="w-0.5 h-2.5 bg-[#D4AF37]" />
                  </div>
                  <span className="truncate">FOLEY & PAPER SNAP</span>
                </div>

                <div className="col-span-5 rounded-sm bg-white/[0.03] border border-white/[0.07] px-2 flex items-center gap-2 text-[10px] font-mono text-white/70 truncate">
                  <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                    <span className="w-0.5 h-2 bg-[#D4AF37]" />
                    <span className="w-0.5 h-3 bg-[#D4AF37] animate-pulse" />
                    <span className="w-0.5 h-2 bg-[#D4AF37]" />
                  </div>
                  <span className="truncate">808 TRANSIENT HIT</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC SCROLL PLAYHEAD BAR */}
            <motion.div
              style={{
                left: playheadPercent,
              }}
              className="absolute -top-10 bottom-0 w-[1px] bg-[#D4AF37] z-30 pointer-events-none shadow-[0_0_8px_rgba(212,175,55,0.6)]"
            >
              {/* Top Playhead Scrub Handle */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#D4AF37] rotate-45 rounded-sm shadow-md flex items-center justify-center">
                <div className="w-1 h-1 bg-[#09090B] rounded-full" />
              </div>
            </motion.div>
          </div>

          {/* BOTTOM RAZOR CUT SEAM */}
          <div className="mt-6 pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-white/50">
              <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase tracking-wider">RAZOR CUT POINT:</span>
              <span className="text-[#D4AF37] font-bold">SPLICE 01 // EDITORIAL ARCHIVE</span>
            </div>

            <div className="flex items-center gap-2 text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="uppercase tracking-widest text-[10px]">SCROLL DOWN TO REVEAL WORK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
