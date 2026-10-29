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

  return (
    <div className="pt-2 pb-6 flex flex-col items-center w-full">
      {/* MOBILE EXPERIENCE (< md): HORIZONTAL TOUCH-SCROLL SNAP CAROUSEL */}
      <div className="w-full md:hidden">
        {/* Monospace Swipe Hint */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
            <span>← SWIPE REELS →</span>
          </span>
          <span className="type-timecode text-white/50 text-[10px]">
            {reels.length} VERTICAL CUTS
          </span>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 px-4 -mx-4 pb-4 no-scrollbar touch-pan-x">
          {reels.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => onSelectProject(reel)}
              className="w-[72vw] max-w-[270px] shrink-0 snap-center aspect-[9/16] rounded-xl overflow-hidden relative bg-[#121216] border border-white/[0.08] shadow-2xl group cursor-pointer active:scale-[0.98] transition-transform select-none"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50 pointer-events-none" />

              {/* Top Index & Format */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between type-timecode text-white/90 z-10 pointer-events-none">
                <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/10 text-[#D4AF37] font-semibold">
                  0{idx + 1}
                </span>
                <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/10 text-white/80">
                  9:16 · {reel.duration}
                </span>
              </div>

              {/* Center Tactile 48px × 48px Frosted Play Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#D4AF37] shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Metadata Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-[#09090B] via-[#09090B]/95 to-transparent pt-8 border-t border-white/[0.06] z-10 pointer-events-none">
                {reel.clientContext && (
                  <div className="type-timecode text-white/40 mb-0.5 text-[9px] line-clamp-1">
                    {reel.clientContext}
                  </div>
                )}
                <h4 className="text-xs sm:text-sm font-display font-semibold text-[#F4F4F6] line-clamp-1 uppercase">
                  {reel.title}
                </h4>
                <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-white/[0.06] type-timecode text-white/40 text-[9px]">
                  <span className="text-[#D4AF37]">{reel.category}</span>
                  <span className="text-white/70">TAP TO PLAY ↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LAPTOP / DESKTOP EXPERIENCE (>= md): CLEAN 3-COLUMN REELS GRID FOR 3 REELS */}
      <div
        className={cn(
          "hidden md:grid gap-6 w-full",
          reels.length <= 3
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto"
            : "grid-cols-2 lg:grid-cols-4"
        )}
      >
        {reels.map((reel, idx) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            onClick={() => onSelectProject(reel)}
            className="aspect-[9/16] rounded-xl overflow-hidden relative bg-[#121216] border border-white/[0.08] hover:border-[#D4AF37]/50 shadow-xl group cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_50px_rgba(0,0,0,0.9)] select-none"
            data-cursor="play"
          >
            <img
              src={reel.thumbnail}
              alt={reel.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50 pointer-events-none" />

            {/* Top Index & Duration */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between type-timecode text-white/90 z-10 pointer-events-none">
              <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/10 text-[#D4AF37] font-semibold">
                0{idx + 1}
              </span>
              <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/10 text-white/80">
                {reel.duration}
              </span>
            </div>

            {/* Center Frosted Play Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#D4AF37] shadow-lg group-hover:bg-[#D4AF37] group-hover:text-[#09090B] group-hover:border-[#D4AF37] transition-all duration-300">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            {/* Bottom Metadata Info */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#09090B] via-[#09090B]/90 to-transparent pt-8 border-t border-white/[0.06] z-10 pointer-events-none">
              {reel.clientContext && (
                <div className="type-timecode text-white/40 mb-1 text-[9px] line-clamp-1">
                  {reel.clientContext}
                </div>
              )}
              <h4 className="text-sm font-display font-semibold text-[#F4F4F6] line-clamp-1 uppercase group-hover:text-[#D4AF37] transition-colors">
                {reel.title}
              </h4>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.06] type-timecode text-white/40 text-[9px]">
                <span className="text-[#D4AF37]">{reel.category}</span>
                <span className="text-white/70 group-hover:text-white transition-colors">WATCH VIDEO ↗</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
