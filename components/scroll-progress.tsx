"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);
  const [timecode, setTimecode] = useState("00:00:00:00");

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const pct = Math.round(latest * 100);
      setPercent(pct);

      // Map 0-100% to a 60-second editorial sequence at 24fps
      const totalFrames = Math.floor(latest * 1440);
      const frames = totalFrames % 24;
      const seconds = Math.floor(totalFrames / 24) % 60;
      const minutes = Math.floor(totalFrames / (24 * 60));

      const mm = String(minutes).padStart(2, "0");
      const ss = String(seconds).padStart(2, "0");
      const ff = String(frames).padStart(2, "0");
      setTimecode(`00:${mm}:${ss}:${ff}`);
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* 1px Editorial Playhead Scrubber at very top */}
      <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none select-none">
        <div className="w-full h-[1px] bg-white/[0.08] relative">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-[#D4AF37] origin-left shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            style={{ scaleX, right: 0 }}
          />
        </div>
      </div>

      {/* Live NLE Timeline Transport Monitor (Bottom Right - Never overlaps Header/CTA) */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-none select-none hidden lg:flex items-center">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[#121216]/95 backdrop-blur-md border border-white/[0.08] shadow-2xl text-[10px] font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-white/40">TC:</span>
          <span className="text-[#F4F4F6] font-semibold">{timecode}</span>
          <span className="text-white/20">|</span>
          <span className="text-[#D4AF37] font-semibold">{percent}%</span>
        </div>
      </div>
    </>
  );
}
