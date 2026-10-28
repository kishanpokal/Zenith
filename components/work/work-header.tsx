"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LayoutGrid, Smartphone, Sparkles, Volume2, VolumeX } from "lucide-react";

export type ViewMode = "grid" | "reels";
export type FormatFilter = "all" | "9:16" | "16:9";

interface WorkHeaderProps {
  categories: string[];
  selectedFilter: string;
  onSelectFilter: (category: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  totalProjects: number;
  categoryCounts?: Record<string, number>;
  audioMonitorEnabled?: boolean;
  onToggleAudioMonitor?: () => void;
  formatFilter?: FormatFilter;
  onChangeFormatFilter?: (format: FormatFilter) => void;
}

export function WorkHeader({
  categories,
  selectedFilter,
  onSelectFilter,
  viewMode,
  onChangeViewMode,
  totalProjects,
  categoryCounts = {},
  audioMonitorEnabled = false,
  onToggleAudioMonitor,
  formatFilter = "all",
  onChangeFormatFilter,
}: WorkHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  return (
    <div ref={containerRef} className="relative mb-10 sm:mb-14">
      {/* TOP EDITORIAL HUD BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.07] text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-white/60 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <strong className="text-white font-semibold">SCENE 01</strong> {"//"} SELECTED ARCHIVE
          </span>
          <span className="text-white/20">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-sm border border-[#D4AF37]/20 font-medium">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>CURATED PORTFOLIO CUTS</span>
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 text-white/30 text-[10px]">
            <span>◆ 24.00 FPS</span>
            <span>· COLOR GRADED</span>
            <span>· 4K PRORES</span>
          </span>
        </div>

        {/* RIGHT METADATA */}
        <div className="flex items-center gap-3">
          {onToggleAudioMonitor && (
            <button
              type="button"
              onClick={onToggleAudioMonitor}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-mono transition-all duration-200 ${
                audioMonitorEnabled
                  ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                  : "bg-[#121216] border-white/[0.07] text-white/60 hover:text-white"
              }`}
              title="Toggle audio monitor"
            >
              {audioMonitorEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-[#D4AF37]" />
                  <span className="font-semibold">AUDIO: LIVE</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-white/50" />
                  <span>AUDIO: MUTED</span>
                </>
              )}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] text-white/50 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-white/80 font-medium uppercase tracking-wider">STUDIO MASTER ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN KINETIC DISPLAY HEADLINE & VIEW SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] mb-2 uppercase tracking-[0.2em]">
            <span>◆ ARCHIVE 01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">SELECTED COMMERCIAL & CREATOR WORK</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0] select-none">
            <div className="overflow-hidden pb-1">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                THE WORK SPEAKS
              </motion.div>
            </div>
            <div className="overflow-hidden pt-1">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-baseline gap-x-4 flex-wrap"
              >
                <span>FOR</span>
                <span className="font-serif italic font-normal text-[#D4AF37] tracking-tight lowercase">
                  itself.
                </span>
              </motion.div>
            </div>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 max-w-xl font-sans leading-relaxed">
            Every frame is calibrated for retention. Zero dead air, surgical match-cutting, bespoke multi-track sound architecture, and kinetic typography.
          </p>
        </div>

        {/* VIEW MODE SWITCHER */}
        <div className="flex items-center gap-1 p-1 rounded-sm bg-[#121216] border border-white/[0.07] self-start lg:self-auto">
          <button
            type="button"
            onClick={() => onChangeViewMode("grid")}
            className={`relative px-3.5 py-1.5 rounded-sm text-[11px] font-mono font-medium uppercase transition-all duration-200 flex items-center gap-2 z-10 ${
              viewMode === "grid"
                ? "bg-[#D4AF37] text-[#09090B] font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Bento Grid</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode("reels")}
            className={`relative px-3.5 py-1.5 rounded-sm text-[11px] font-mono font-medium uppercase transition-all duration-200 flex items-center gap-2 z-10 ${
              viewMode === "reels"
                ? "bg-[#D4AF37] text-[#09090B] font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Reels Feed</span>
          </button>
        </div>
      </div>

      {/* DUAL FILTER CONSOLE: FORMAT TOGGLE & CATEGORY CHIPS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-white/[0.07] pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((category) => {
            const isActive = selectedFilter === category;
            const count = categoryCounts[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectFilter(category)}
                className={`px-3 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-sm"
                    : "text-white/60 hover:text-white bg-[#121216] border border-white/[0.07]"
                }`}
              >
                <span>{category}</span>
                {typeof count === "number" && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-sm font-semibold ${
                      isActive ? "bg-black/20 text-[#09090B]" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Aspect Ratio Format Switcher */}
        {onChangeFormatFilter && (
          <div className="flex items-center gap-1 p-1 rounded-sm bg-[#121216] border border-white/[0.07] text-[10px] font-mono self-start md:self-auto flex-shrink-0">
            <span className="px-2 text-white/40 uppercase">FORMAT:</span>
            <button
              type="button"
              onClick={() => onChangeFormatFilter("all")}
              className={`px-2.5 py-1 rounded-sm transition-all ${
                formatFilter === "all"
                  ? "bg-white text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => onChangeFormatFilter("9:16")}
              className={`px-2.5 py-1 rounded-sm transition-all ${
                formatFilter === "9:16"
                  ? "bg-[#D4AF37] text-[#09090B] font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              9:16 REELS
            </button>
            <button
              type="button"
              onClick={() => onChangeFormatFilter("16:9")}
              className={`px-2.5 py-1 rounded-sm transition-all ${
                formatFilter === "16:9"
                  ? "bg-[#D4AF37] text-[#09090B] font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              16:9 WIDE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
