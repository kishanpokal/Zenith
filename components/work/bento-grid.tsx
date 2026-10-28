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
  const verticalProjects = projects.filter((p) => p.aspectRatio === "9:16");

  const uncuratedProjects = projects.filter(
    (p) =>
      p.id !== featuredProject.id &&
      p.id !== verticalProjects[0]?.id &&
      p.id !== verticalProjects[1]?.id
  );

  const remainingProjects =
    limit && limit <= 5
      ? limit >= 5
        ? uncuratedProjects.slice(0, 1)
        : []
      : uncuratedProjects;

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

  return (
    <div className="pt-2">
      {isAllWork ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        >
          {/* 1. MASTER FLAGSHIP SHOWREEL SPOTLIGHT (Spans 8 columns on lg) */}
          <motion.div
            layout
            key={featuredProject.id}
            onMouseEnter={handleSpotlightMouseEnter}
            onMouseLeave={handleSpotlightMouseLeave}
            className="lg:col-span-8 bg-[#121216] border border-white/[0.07] hover:border-[#D4AF37]/40 rounded-xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 group flex flex-col justify-between relative"
            onClick={() => onSelectProject(featuredProject)}
            data-cursor="play"
          >
            {/* Visual Media Container with Raw vs Graded Filter */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-black">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-black/30 to-black/60 pointer-events-none" />

              {/* Top Badges Bar */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between text-xs font-mono z-20">
                <span className="px-2.5 py-1 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  FLAGSHIP EDITORIAL
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleGradeMode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-black/80 text-[10px] font-mono border border-white/[0.08] hover:border-[#D4AF37]/50 transition-colors shadow-sm"
                    title="Toggle Color Grade Proof"
                  >
                    <Sliders className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-white/60">GRADE:</span>
                    <span className={colorGradeMode === "graded" ? "text-[#D4AF37] font-semibold" : "text-amber-400 font-semibold"}>
                      {colorGradeMode === "graded" ? "KODAK 2383" : "RAW LOG"}
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

            {/* Spotlight Details */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">
                    {featuredProject.clientContext}
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
                    <Music className="w-3 h-3 text-[#D4AF37]" />
                    <span>MULTI-TRACK SOUND MASTER</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase group-hover:text-[#D4AF37] transition-colors tracking-tight">
                  {featuredProject.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl font-sans">
                  {featuredProject.description}
                </p>

                {/* Layer Breakdown Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37]">
                    ◆ SPEED RAMPS
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/80">
                    ◆ MATCH CUTS
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/80">
                    ◆ TRANSIENT FOLEY
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-white/80">
                    ◆ KODAK 2383
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-white/50">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{featuredProject.soundDesignNotes || "Multi-track Sound Architecture"}</span>
                </span>
                <span className="text-[#F4F4F6] group-hover:text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors">
                  WATCH DIRECTORS CUT <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* 2. FIRST VERTICAL REEL */}
          {verticalProjects[0] && (
            <motion.div layout key={verticalProjects[0].id} className="lg:col-span-4">
              <ReelCard
                project={verticalProjects[0]}
                onSelect={onSelectProject}
                aspectOverride="9:16"
                className="h-full"
                index={1}
                audioMonitorEnabled={audioMonitorEnabled}
              />
            </motion.div>
          )}

          {/* 3. CRAFT & RIGOR BENTO TILE */}
          <motion.div
            layout
            className="lg:col-span-4 rounded-xl bg-[#121216] border border-white/[0.07] p-6 sm:p-7 flex flex-col justify-between shadow-lg relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mb-4">
                <span className="flex items-center gap-1.5 font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  STUDIO ARCHITECTURE
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-[9px] text-white/60">
                  FRAME ACCURACY
                </span>
              </div>

              <h4 className="text-2xl sm:text-3xl font-display font-bold text-[#F4F4F6] tracking-tight uppercase leading-tight">
                SURGICAL <br />
                <span className="text-[#D4AF37]">RHYTHM.</span>
              </h4>

              <p className="mt-3 text-xs text-white/65 leading-relaxed font-sans">
                Every frame serves retention. Dynamic velocity curves, 32-bit float audio stems, and surgical pattern interrupts crafted without vanity gimmicks.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.07] space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Pacing Protocol:</span>
                <span className="text-[#D4AF37] font-semibold">Velocity Graph Curves</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Audio Mastering:</span>
                <span className="text-white font-semibold">Multi-Stem Foley</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Grading Pipeline:</span>
                <span className="text-white font-semibold">DaVinci / Kodak 2383</span>
              </div>
            </div>
          </motion.div>

          {/* 4. SECOND VERTICAL REEL */}
          {verticalProjects[1] && (
            <motion.div layout key={verticalProjects[1].id} className="lg:col-span-4">
              <ReelCard
                project={verticalProjects[1]}
                onSelect={onSelectProject}
                aspectOverride="9:16"
                className="h-full"
                index={2}
                audioMonitorEnabled={audioMonitorEnabled}
              />
            </motion.div>
          )}

          {/* 5. REMAINING PROJECTS IN BENTO GRID */}
          {remainingProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              className="lg:col-span-4"
            >
              <ReelCard
                project={project}
                onSelect={onSelectProject}
                className="h-full"
                index={idx + 3}
                audioMonitorEnabled={audioMonitorEnabled}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Category-filtered Grid */
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayFiltered.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ReelCard
                  project={project}
                  onSelect={onSelectProject}
                  className="h-full"
                  index={idx}
                  audioMonitorEnabled={audioMonitorEnabled}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* VIEW ALL REELS CALLOUT FOR COMPLETE ARCHIVE */}
      {showViewAllCta && (
        <div className="mt-12 sm:mt-16 p-6 sm:p-7 rounded-xl bg-[#121216] border border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mb-2 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>EDITORIAL VAULT // COMPLETE REPERTOIRE</span>
            </div>
            <h4 className="text-lg sm:text-xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight">
              Looking for specific formats or styles?
            </h4>
            <p className="text-xs text-white/60 font-sans mt-1 max-w-xl">
              Explore our full portfolio archive with filters for Commercials, Talking Head, YouTube Longform, and Motion Graphics.
            </p>
          </div>

          <Link
            href="/work"
            className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap group flex-shrink-0"
          >
            <span>EXPLORE FULL ARCHIVE</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
