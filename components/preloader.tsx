"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicPreloader() {
  const [progress, setProgress] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    // Check if client has already seen preloader in this session
    if (typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("zenith_preloader_shown");
      if (alreadyShown) {
        setIsComplete(true);
        setHasCheckedSession(true);
        return;
      }
      setHasCheckedSession(true);
    }

    const duration = 1400; // 1.4 seconds fast and snappy
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(rawPct);

      if (rawPct >= 100) {
        clearInterval(interval);
        // Trigger razor cut split
        setIsSplitting(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("zenith_preloader_shown", "true");
        }
        setTimeout(() => {
          setIsComplete(true);
        }, 650);
      }
    }, 24);

    return () => clearInterval(interval);
  }, []);

  if (!hasCheckedSession || isComplete) {
    return null;
  }

  // Calculate SMPTE timecode at 24fps from progress (0 to 48 frames = 00:00:02:00)
  const totalFrames = Math.floor((progress / 100) * 48);
  const seconds = Math.floor(totalFrames / 24);
  const frames = totalFrames % 24;
  const smpte = `00:00:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;

  // NLE Status readout based on progress
  let statusText = "[ INGESTING RAW FOOTAGE... ]";
  if (progress >= 35 && progress < 70) {
    statusText = "[ SYNCING TIME-CODE & AUDIO WAVEFORMS... ]";
  } else if (progress >= 70 && progress < 98) {
    statusText = "[ APPLYING COLOR GRADE: ZENITH_OBSIDIAN.CUBE ]";
  } else if (progress >= 98) {
    statusText = "[ TIMELINE LOCKED // READY FOR PLAYBACK ]";
  }

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none select-none overflow-hidden">
      {/* TOP LETTERBOX HALF */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isSplitting ? "-100%" : 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 inset-x-0 h-1/2 bg-[#09090B] border-b border-white/[0.06] flex flex-col justify-between p-6 sm:p-10 pointer-events-auto"
      >
        {/* Top Camera Viewfinder Header */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest">
          {/* Top Left: Corner Bracket + REC indicator */}
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37] text-sm select-none">┌</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#121216] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold uppercase tracking-widest text-[10px]">
                REC ●
              </span>
            </div>
            <span className="text-white/40 hidden sm:inline">TC_SYNC_LOCKED</span>
          </div>

          {/* Top Right: Corner Bracket + Technical Camera Specs */}
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-[10px] hidden sm:inline">
              24.000 FPS {"//"} 4K DCI {"//"} REC.709
            </span>
            <span className="text-[#D4AF37] text-sm select-none">┐</span>
          </div>
        </div>

        {/* Center Top Brand Anchor */}
        <div className="text-center pb-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.3em] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>STUDIO POST-PRODUCTION PIPELINE</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4F4F6] tracking-tight uppercase">
            ZENITH <span className="font-serif italic font-normal text-[#D4AF37] lowercase">editorial.</span>
          </h1>
        </div>
      </motion.div>

      {/* BOTTOM LETTERBOX HALF */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isSplitting ? "100%" : 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 inset-x-0 h-1/2 bg-[#09090B] border-t border-white/[0.06] flex flex-col justify-between p-6 sm:p-10 pointer-events-auto"
      >
        {/* Center Bottom SMPTE Timecode Counter */}
        <div className="text-center pt-2">
          <div className="font-mono text-3xl sm:text-5xl font-bold tracking-wider text-[#F4F4F6] tabular-nums mb-1">
            {smpte}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] flex items-center justify-center gap-2">
            <span>TIMELINE HEAD</span>
            <span className="text-white/20">|</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Bottom Viewfinder Footer + NLE Timeline Scrubber */}
        <div className="space-y-4">
          {/* Status Message Readout */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span className="text-[#D4AF37] font-semibold tracking-wider">
              {statusText}
            </span>
            <span className="hidden sm:inline text-white/30">
              FRAME_ACCURATE // PRORES 422 HQ
            </span>
          </div>

          {/* Timeline Track with Playhead & Ticks */}
          <div className="relative p-2 rounded-sm bg-[#121216] border border-white/[0.08]">
            {/* Tick Marks Layer */}
            <div className="flex justify-between items-center px-1 mb-1.5 opacity-30">
              {Array.from({ length: 25 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-[1px] bg-white ${i % 6 === 0 ? "h-2.5 bg-[#D4AF37]" : "h-1"}`}
                />
              ))}
            </div>

            {/* Playhead Track */}
            <div className="relative h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Corner Viewfinder Crop Brackets */}
          <div className="flex items-center justify-between text-sm text-[#D4AF37] select-none pt-1">
            <span>└</span>
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">
              ACTION SAFE // 90%
            </span>
            <span>┘</span>
          </div>
        </div>
      </motion.div>

      {/* RAZOR CUT HORIZONTAL FLASH SEAM (Triggered on 100%) */}
      <AnimatePresence>
        {isSplitting && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: [1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,1)] z-50 origin-center"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
