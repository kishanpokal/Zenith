"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReelsFeedProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function ReelsFeed({ projects, onSelectProject }: ReelsFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (projects.length === 0) {
    return (
      <div className="py-20 text-center rounded-xl border border-white/[0.07] bg-[#121216] max-w-lg mx-auto p-8">
        <p className="text-white/50 font-mono text-xs uppercase tracking-wider">
          NO REELS REGISTERED IN THIS VIEW.
        </p>
      </div>
    );
  }

  const reels =
    projects.filter((p) => p.aspectRatio === "9:16").length > 0
      ? projects.filter((p) => p.aspectRatio === "9:16")
      : projects;

  const activeReel = reels[activeIndex] || reels[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reels.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  return (
    <div className="pt-4 pb-12 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Interactive Mobile Phone Mockup Device */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-[280px] sm:w-[320px] aspect-[9/18] rounded-[36px] p-2 bg-[#121216] border border-white/[0.08] shadow-2xl backdrop-blur-xl">
            {/* Top Camera Notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-black rounded-full z-30 flex items-center justify-end px-2 border border-white/[0.08] pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            </div>

            {/* Inner Phone Screen */}
            <div
              className="relative w-full h-full rounded-[28px] overflow-hidden bg-black cursor-pointer group"
              onClick={() => onSelectProject(activeReel)}
              data-cursor="play"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReel.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={activeReel.thumbnail}
                    alt={activeReel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-[#D4AF37] text-[#09090B] flex items-center justify-center shadow-lg scale-95 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Reel Bottom Meta */}
                  <div className="absolute bottom-5 inset-x-4 text-white z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span>STUDIO MASTER // 9:16</span>
                    </div>
                    <h4 className="text-sm font-display font-bold uppercase line-clamp-1">
                      {activeReel.title}
                    </h4>
                    <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5 font-mono">
                      {activeReel.clientContext}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Scrub Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-sm bg-[#121216] hover:bg-[#18181E] border border-white/[0.08] text-white flex items-center justify-center transition-colors"
              aria-label="Previous reel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-white/60">
              {activeIndex + 1} of {reels.length}
            </span>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-sm bg-[#121216] hover:bg-[#18181E] border border-white/[0.08] text-white flex items-center justify-center transition-colors"
              aria-label="Next reel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Active Reel Breakdown & Reel Thumbnail Strip */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[10px] font-mono font-bold uppercase">
                {activeReel.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/60 text-[10px] font-mono">
                {activeReel.duration} · 9:16
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight">
              {activeReel.title}
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              {activeReel.description}
            </p>

            {activeReel.pacingStyle && (
              <div className="mt-5 space-y-2">
                <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                  Retention Strategy & Pacing:
                </div>
                <div className="p-3 rounded-sm bg-[#09090B]/60 border border-white/[0.06] text-xs text-white/80 font-mono">
                  {activeReel.pacingStyle}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between">
              <button
                onClick={() => onSelectProject(activeReel)}
                className="px-5 py-2.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Full Reel Cinema →</span>
              </button>
            </div>
          </div>

          {/* Reel Strip Thumbnails */}
          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-2.5">
              Select Vertical Edit:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {reels.map((reel, idx) => (
                <button
                  key={reel.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative aspect-[9/14] rounded-sm overflow-hidden border transition-all duration-200",
                    idx === activeIndex
                      ? "border-[#D4AF37] shadow-sm"
                      : "border-white/[0.08] opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
