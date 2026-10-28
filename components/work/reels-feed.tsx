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
  const reels =
    projects.filter((p) => p.aspectRatio === "9:16").length > 0
      ? projects.filter((p) => p.aspectRatio === "9:16")
      : projects;

  const [activeIndex, setActiveIndex] = useState(0);
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
          <div className="relative w-[280px] sm:w-[320px] aspect-[9/18] rounded-[44px] p-2.5 bg-gradient-to-b from-neutral-800 to-black border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            {/* Top Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2 border border-white/10 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64] animate-pulse" />
            </div>

            {/* Inner Phone Screen */}
            <div
              className="relative w-full h-full rounded-[34px] overflow-hidden bg-black cursor-pointer group"
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
                    <div className="w-14 h-14 rounded-full bg-[#D7FF64] text-[#050505] flex items-center justify-center shadow-2xl scale-95 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Reel Bottom Meta */}
                  <div className="absolute bottom-5 inset-x-4 text-white z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D7FF64] uppercase tracking-wider font-bold mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
                      <span>STUDIO MASTER // 9:16</span>
                    </div>
                    <h4 className="text-sm font-outfit font-bold uppercase line-clamp-1">
                      {activeReel.title}
                    </h4>
                    <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5 font-mono">
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
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-colors"
              aria-label="Previous reel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-white/60">
              {activeIndex + 1} of {reels.length}
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-colors"
              aria-label="Next reel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Active Reel Breakdown & Reel Thumbnail Strip */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#D7FF64]/10 border border-[#D7FF64]/20 text-[#D7FF64] text-xs font-mono font-bold uppercase">
                {activeReel.category}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono">
                {activeReel.duration} · 9:16
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-outfit font-black text-white uppercase tracking-tight">
              {activeReel.title}
            </h3>

            <p className="mt-3 text-sm text-white/70 leading-relaxed font-sans">
              {activeReel.description}
            </p>

            {activeReel.pacingStyle && (
              <div className="mt-6 space-y-2">
                <div className="text-xs font-mono text-[#D7FF64] uppercase tracking-wider font-bold">
                  Retention Strategy & Pacing:
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white/80 font-mono">
                  {activeReel.pacingStyle}
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => onSelectProject(activeReel)}
                className="px-6 py-3 rounded-full bg-[#D7FF64] hover:bg-[#e4ff88] text-[#050505] font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Full Reel Cinema →</span>
              </button>
            </div>
          </div>

          {/* Reel Strip Thumbnails */}
          <div>
            <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
              Select Vertical Edit:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {reels.map((reel, idx) => (
                <button
                  key={reel.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative aspect-[9/14] rounded-xl overflow-hidden border transition-all duration-300",
                    idx === activeIndex
                      ? "border-[#D7FF64] scale-105 shadow-lg shadow-[#D7FF64]/20"
                      : "border-white/10 opacity-60 hover:opacity-100"
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