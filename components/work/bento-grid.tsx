"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { ReelCard } from "@/components/work/reel-card";
import { Play, Sparkles, Music, ArrowUpRight, Sliders, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedFilter: string;
  audioMonitorEnabled?: boolean;
  limit?: number;
  showViewAllCta?: boolean;
}

export function BentoGrid({
  projects,
  onSelectProject,
  selectedFilter,
  audioMonitorEnabled = false,
  limit,
  showViewAllCta = true,
}: BentoGridProps) {
  const [colorGradeMode, setColorGradeMode] = useState<"graded" | "raw">("graded");
  const [isSpotlightHovered, setIsSpotlightHovered] = useState(false);
  const [spotlightProgress, setSpotlightProgress] = useState(0);
  const spotlightVideoRef = useRef<HTMLVideoElement | null>(null);

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center rounded-xl border border-white/[0.07] bg-[#121216]">
        <p className="text-white/50 font-mono text-xs">
          NO PROJECTS REGISTERED IN THIS CATEGORY.
        </p>
      </div>
    );
  }

  const isAllWork = selectedFilter === "All Work";
  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const gridProjects = projects.filter((p) => p.id !== featuredProject.id);
  const displayFiltered = limit ? projects.slice(0, limit) : projects;

  const handleSpotlightMouseEnter = () => {
    setIsSpotlightHovered(true);
    if (spotlightVideoRef.current) {
      spotlightVideoRef.current.currentTime = 0;
      spotlightVideoRef.current.muted = !audioMonitorEnabled;
      spotlightVideoRef.current.play().catch(() => {});
    }
  };

  const handleSpotlightMouseLeave = () => {
    setIsSpotlightHovered(false);
    setSpotlightProgress(0);
    if (spotlightVideoRef.current) {
      spotlightVideoRef.current.pause();
      spotlightVideoRef.current.currentTime = 0;
    }
  };

  const toggleGradeMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setColorGradeMode((prev) => (prev === "graded" ? "raw" : "graded"));
  };

  // Analyze filtered projects for optimal aspect-aware layout (prevents 9:16 reels from becoming monstrously huge)
  const verticalCount = displayFiltered.filter((p) => p.aspectRatio === "9:16").length;
  const isVerticalFeed = verticalCount >= displayFiltered.length / 2;
  const count = displayFiltered.length;

  let containerWidthClass = "w-full";
  let gridColsClass = "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8";
  let cardWrapperClass = "w-full";

  if (isVerticalFeed) {
    if (count === 1) {
      containerWidthClass = "max-w-[340px] mx-auto";
      gridColsClass = "grid grid-cols-1";
      cardWrapperClass = "w-full max-w-[320px] sm:max-w-[340px] mx-auto flex justify-center";
    } else if (count === 2) {
      containerWidthClass = "max-w-[720px] mx-auto";
      gridColsClass = "grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 justify-center";
      cardWrapperClass = "w-full max-w-[320px] sm:max-w-[340px] mx-auto flex justify-center";
    } else if (count === 3) {
      containerWidthClass = "max-w-5xl mx-auto";
      gridColsClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 justify-center";
      cardWrapperClass = "w-full max-w-[320px] sm:max-w-[340px] mx-auto flex justify-center";
    } else {
      containerWidthClass = "w-full";
      gridColsClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 justify-center";
      cardWrapperClass = "w-full max-w-[320px] sm:max-w-[340px] mx-auto flex justify-center";
    }
  } else {
    // 16:9 Landscape / Longform
    if (count === 1) {
      containerWidthClass = "max-w-3xl mx-auto";
      gridColsClass = "grid grid-cols-1";
      cardWrapperClass = "w-full";
    } else if (count === 2) {
      containerWidthClass = "max-w-5xl mx-auto";
      gridColsClass = "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8";
      cardWrapperClass = "w-full";
    } else {
      containerWidthClass = "w-full";
      gridColsClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";
      cardWrapperClass = "w-full";
    }
  }

  return (
    <div className="pt-2">
      {isAllWork ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          {/* 1. MASTER FLAGSHIP SHOWREEL SPOTLIGHT (Spans full width md:col-span-2 lg:col-span-12 with split 7:5 layout) */}
          <motion.div
            layout
            key={featuredProject.id}
            onMouseEnter={handleSpotlightMouseEnter}
            onMouseLeave={handleSpotlightMouseLeave}
            className="md:col-span-2 lg:col-span-12 bg-[#121216] border border-white/[0.07] hover:border-[#D4AF37]/40 rounded-xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 group relative"
            onClick={() => onSelectProject(featuredProject)}
            data-cursor="play"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch h-full">
              {/* Visual Media Container with Raw vs Graded Filter (7 Cols on Laptop) */}
              <div className="lg:col-span-7 relative w-full aspect-[16/9] overflow-hidden bg-black flex items-center">
                {/* Poster Thumbnail */}
                <img
                  src={featuredProject.thumbnail}
                  alt={featuredProject.title}
                  style={{
                    filter:
                      colorGradeMode === "raw"
                        ? "grayscale(60%) contrast(80%) brightness(110%)"
                        : "none",
                    transition: "filter 0.4s ease",
                  }}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
                    isSpotlightHovered && spotlightVideoRef.current ? "opacity-0" : "opacity-100"
                  )}
                />

                {/* 60 FPS Video Preview on Hover if direct MP4 */}
                {featuredProject.videoSrc && featuredProject.videoSrc.endsWith(".mp4") && (
                  <video
                    ref={spotlightVideoRef}
                    src={featuredProject.videoSrc}
                    muted={!audioMonitorEnabled}
                    loop
                    playsInline
                    preload="none"
                    onTimeUpdate={() => {
                      if (spotlightVideoRef.current && spotlightVideoRef.current.duration) {
                        setSpotlightProgress(
                          (spotlightVideoRef.current.currentTime /
                            spotlightVideoRef.current.duration) *
                            100
                        );
                      }
                    }}
                    style={{
                      filter:
                        colorGradeMode === "raw"
                          ? "grayscale(60%) contrast(80%) brightness(110%)"
                          : "none",
                      transition: "filter 0.4s ease",
                    }}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                      isSpotlightHovered ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-black/20 to-black/60 pointer-events-none" />

                {/* Top Badges Bar */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between text-xs font-mono z-20">
                  <span className="px-2.5 py-1 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    FEATURED SPOTLIGHT
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleGradeMode}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-black/80 text-[10px] font-mono border border-white/[0.08] hover:border-[#D4AF37]/50 transition-colors shadow-sm"
                      title="Toggle Color Grade"
                    >
                      <Sliders className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-white/60 hidden sm:inline">COLOR:</span>
                      <span className={colorGradeMode === "graded" ? "text-[#D4AF37] font-semibold" : "text-amber-400 font-semibold"}>
                        {colorGradeMode === "graded" ? "GRADED" : "RAW"}
                      </span>
                    </button>

                    <span className="px-2.5 py-1 rounded-sm bg-black/80 text-white/90 border border-white/[0.08] text-[10px]">
                      {featuredProject.aspectRatio} · {featuredProject.duration}
                    </span>
                  </div>
                </div>

                {/* Center Play Button Pill */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#09090B] flex items-center justify-center shadow-lg scale-95 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Playhead Scrub Indicator */}
                {isSpotlightHovered && (
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20 pointer-events-none">
                    <div
                      className="h-full bg-[#D4AF37] transition-all duration-100"
                      style={{ width: `${spotlightProgress || 25}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Spotlight Details (5 Cols on Laptop) */}
              <div className="lg:col-span-5 p-6 sm:p-7 lg:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.07]">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                      {featuredProject.clientContext}
                    </span>

                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
                      <Music className="w-3 h-3 text-[#D4AF37]" />
                      <span>FULL SOUND DESIGN</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase group-hover:text-[#D4AF37] transition-colors tracking-tight">
                    {featuredProject.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                    {featuredProject.description}
                  </p>

                  {/* Layer Breakdown Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37]">
                      FAST PACING
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/80">
                      SOUND EFFECTS
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/80">
                      ANIMATED CAPTIONS
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/80">
                      COLOR GRADED
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>Pro Sound & Music Mix</span>
                  </span>
                  <span className="text-[#F4F4F6] group-hover:text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors">
                    WATCH VIDEO <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. REMAINING PROJECTS IN BENTO GRID - Clean 3-Column Layout, zero duplicates, no marketing cards */}
          {gridProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              className="w-full max-w-[340px] mx-auto md:max-w-none lg:col-span-4 flex justify-center"
            >
              <ReelCard
                project={project}
                onSelect={onSelectProject}
                className="w-full h-full shadow-xl"
                index={idx + 2}
                audioMonitorEnabled={audioMonitorEnabled}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Category-filtered Grid: Responsive studio grid tailored for vertical/horizontal media */
        <div className={containerWidthClass}>
          <motion.div
            layout
            className={gridColsClass}
          >
            <AnimatePresence mode="popLayout">
              {displayFiltered.map((project, idx) => (
                <motion.div
                  layout
                  key={project.id}
                  className={cardWrapperClass}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ReelCard
                    project={project}
                    onSelect={onSelectProject}
                    className="w-full h-full shadow-2xl"
                    index={idx}
                    audioMonitorEnabled={audioMonitorEnabled}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* VIEW ALL WORK CALLOUT */}
      {showViewAllCta && (
        <div className="mt-12 sm:mt-16 p-6 sm:p-7 rounded-xl bg-[#121216] border border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mb-2 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>FULL PORTFOLIO</span>
            </div>
            <h4 className="text-lg sm:text-xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight">
              Looking for more videos?
            </h4>
            <p className="text-xs text-white/70 font-sans mt-1 max-w-xl">
              Browse all of our work including Reels, Commercials, YouTube videos, and Motion Graphics.
            </p>
          </div>

          <Link
            href="/work"
            className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap group flex-shrink-0"
          >
            <span>VIEW ALL WORK</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
