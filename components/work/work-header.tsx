"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Layers, LayoutGrid, Smartphone, Volume2, VolumeX, SlidersHorizontal, MonitorPlay, Sparkles } from "lucide-react";

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

  // Kinetic skew & chromatic shift linked to Lenis scroll velocity
  const [scrollSkew, setScrollSkew] = useState(0);
  const [chromaShift, setChromaShift] = useState(0);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const handleScrollVelocity = () => {
      if (!active) return;
      const lenis = (window as any).__lenis;
      let velocity = 0;

      if (lenis && typeof lenis.velocity === "number") {
        velocity = lenis.velocity;
      } else {
        const curY = window.scrollY;
        velocity = (curY - lastScrollY.current) * 0.5;
        lastScrollY.current = curY;
      }

      // Clamp subtle kinetic skew between -4deg and 4deg
      const targetSkew = Math.max(-4, Math.min(4, velocity * 0.15));
      const targetChroma = Math.max(-3, Math.min(3, velocity * 0.1));

      // Ease back smoothly
      setScrollSkew((prev) => prev + (targetSkew - prev) * 0.2);
      setChromaShift((prev) => prev + (targetChroma - prev) * 0.2);

      rafId.current = requestAnimationFrame(handleScrollVelocity);
    };

    rafId.current = requestAnimationFrame(handleScrollVelocity);

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mb-10 sm:mb-14">
      {/* BROADCAST VIEWFINDER CORNER BRACKETS */}
      <div className="absolute -top-3 -left-3 text-[#D7FF64]/50 font-mono text-sm pointer-events-none select-none">
        ┌
      </div>
      <div className="absolute -top-3 -right-3 text-[#D7FF64]/50 font-mono text-sm pointer-events-none select-none">
        ┐
      </div>
      <div className="absolute -bottom-3 -left-3 text-[#D7FF64]/50 font-mono text-sm pointer-events-none select-none">
        └
      </div>
      <div className="absolute -bottom-3 -right-3 text-[#D7FF64]/50 font-mono text-sm pointer-events-none select-none">
        ┘
      </div>

      {/* TOP BROADCAST HUD BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-white/60 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#D7FF64] shadow-[0_0_8px_#D7FF64] animate-pulse" />
            <strong className="text-white">SCENE 01</strong> · SELECTED ARCHIVE
          </span>
          <span className="text-white/20">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[#D7FF64] bg-[#D7FF64]/10 px-2.5 py-0.5 rounded-full border border-[#D7FF64]/20 font-bold">
            <Sparkles className="w-3 h-3 text-[#D7FF64]" />
            <span>CURATED DIRECTORS CUTS</span>
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 text-white/30 text-[10px]">
            <span>◆ 24.00 FPS</span>
            <span>· REC.709</span>
            <span>· 180° SHUTTER</span>
          </span>
        </div>

        {/* RIGHT METADATA & GLOBAL AUDIO MONITOR TOGGLE */}
        <div className="flex items-center gap-3">
          {onToggleAudioMonitor && (
            <button
              type="button"
              onClick={onToggleAudioMonitor}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-mono transition-all duration-300 ${
                audioMonitorEnabled
                  ? "bg-[#D7FF64]/15 border-[#D7FF64] text-[#D7FF64] shadow-[0_0_15px_rgba(215,255,100,0.25)]"
                  : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
              title="Toggle studio audio monitor on hover previews"
            >
              {audioMonitorEnabled ? (
                <>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-[#D7FF64] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[#D7FF64]" />
                    <span className="w-0.5 h-1.5 bg-[#D7FF64] animate-pulse" />
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-[#D7FF64]" />
                  <span className="font-bold">AUDIO: LIVE</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-white/50" />
                  <span>AUDIO: MUTED</span>
                </>
              )}
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-white/50 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
            <span className="text-white/80 font-bold uppercase tracking-wider">STUDIO MASTER ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN KINETIC DISPLAY HEADLINE & VIEW SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          {/* Keyframe Diamond indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#D7FF64] mb-2 uppercase tracking-widest">
            <span>◆ KEYFRAME 01</span>
            <span className="text-white/20">/</span>
            <span className="text-white/40">MASTER PORTFOLIO REEL</span>
          </div>

          {/* Kinetic AE Graph-Eased Clip-Path Headline */}
          <h2
            style={{
              transform: `skewX(${scrollSkew.toFixed(2)}deg)`,
              textShadow:
                Math.abs(chromaShift) > 0.3
                  ? `${chromaShift.toFixed(1)}px 0 0 rgba(215,255,100,0.7), -${chromaShift.toFixed(1)}px 0 0 rgba(255,60,60,0.6)`
                  : "none",
              transition: "transform 0.1s ease-out, text-shadow 0.1s ease-out",
            }}
            className="text-4xl sm:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight text-white leading-[0.98] select-none"
          >
            {/* Line 1: Clip-path slide reveal */}
            <div className="overflow-hidden pb-1">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1], // AE speed-graph easing
                }}
              >
                THE WORK SPEAKS
              </motion.div>
            </div>

            {/* Line 2 with Instrument Serif Italic Accent */}
            <div className="overflow-hidden pt-1">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-baseline gap-x-4 flex-wrap"
              >
                <span>FOR</span>
                <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lg:text-[84px] tracking-tight lowercase">
                  itself.
                </span>
              </motion.div>
            </div>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-white/60 max-w-xl font-sans leading-relaxed">
            Every frame is timed to subconscious dopamine cycles.
            Zero dead air, surgical match-cutting, bespoke Foley sound architecture, and high-retention motion design.
          </p>
        </div>

        {/* VIEW MODE SWITCHER */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0e0e0e] border border-white/10 shadow-lg self-start lg:self-auto backdrop-blur-md">
          <button
            type="button"
            onClick={() => onChangeViewMode("grid")}
            className={`relative px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-300 flex items-center gap-2 z-10 ${
              viewMode === "grid"
                ? "text-[#050505]"
                : "text-white/60 hover:text-white"
            }`}
          >
            {viewMode === "grid" && (
              <motion.div
                layoutId="activeViewPill"
                className="absolute inset-0 bg-[#D7FF64] rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <LayoutGrid className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Bento Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode("reels")}
            className={`relative px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-300 flex items-center gap-2 z-10 ${
              viewMode === "reels"
                ? "text-[#050505]"
                : "text-white/60 hover:text-white"
            }`}
          >
            {viewMode === "reels" && (
              <motion.div
                layoutId="activeViewPill"
                className="absolute inset-0 bg-[#D7FF64] rounded-xl shadow-md"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <Smartphone className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Reels Feed</span>
          </button>
        </div>
      </div>

      {/* DUAL FILTER CONSOLE: FORMAT TOGGLE & CATEGORY CHIPS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-white/[0.08] pb-4">
        
        {/* Category Pills with Item Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((category) => {
            const isActive = selectedFilter === category;
            const count = categoryCounts[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectFilter(category)}
                className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? "text-[#050505] font-black"
                    : "text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-[#D7FF64] rounded-full shadow-[0_0_15px_rgba(215,255,100,0.3)]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
                {typeof count === "number" && (
                  <span
                    className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-black/20 text-[#050505]" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Aspect Ratio Format Switcher (All / 9:16 Vertical / 16:9 Horizontal) */}
        {onChangeFormatFilter && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-mono self-start md:self-auto flex-shrink-0">
            <span className="px-2 text-white/40 uppercase text-[10px]">FORMAT:</span>
            <button
              type="button"
              onClick={() => onChangeFormatFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                formatFilter === "all"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => onChangeFormatFilter("9:16")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                formatFilter === "9:16"
                  ? "bg-[#D7FF64] text-black font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              9:16 REELS
            </button>
            <button
              type="button"
              onClick={() => onChangeFormatFilter("16:9")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                formatFilter === "16:9"
                  ? "bg-[#D7FF64] text-black font-bold shadow-sm"
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
