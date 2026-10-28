"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { ReelCard } from "@/components/work/reel-card";
import { Play, Sparkles, Music, ArrowUpRight, Sliders, SlidersHorizontal, Volume2, CheckCircle2, Film } from "lucide-react";
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
  // Flagship interactive raw vs graded color grade comparison state
  const [colorGradeMode, setColorGradeMode] = useState<"graded" | "raw">("graded");
  const [isSpotlightHovered, setIsSpotlightHovered] = useState(false);
  const [spotlightProgress, setSpotlightProgress] = useState(0);
  const spotlightVideoRef = useRef<HTMLVideoElement | null>(null);

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center rounded-3xl border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-md">
        <p className="text-white/50 font-mono text-sm">
          No projects found in this category.
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
            className="lg:col-span-8 bg-[#0a0a0a] border border-white/[0.12] hover:border-[#D7FF64]/40 rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 group flex flex-col justify-between relative"
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
                      ? "grayscale(70%) contrast(75%) brightness(115%)"
                      : "none",
                  transition: "filter 0.5s ease",
                }}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                  isSpotlightHovered && spotlightVideoRef.current ? "opacity-0" : "opacity-100"
                )}
              />

              {/* 60 FPS Video Decoder Discipline: MP4 Preview on Hover only */}
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
                        ? "grayscale(70%) contrast(75%) brightness(115%)"
                        : "none",
                    transition: "filter 0.5s ease",
                  }}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                    isSpotlightHovered ? "opacity-100" : "opacity-0"
                  )}
                />
              )}

              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-black/60 pointer-events-none" />

              {/* Top Badges Bar */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between text-xs font-mono z-20">
                <span className="px-3 py-1 rounded-full bg-[#D7FF64] text-[#050505] font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(215,255,100,0.4)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  FLAGSHIP EDITORIAL
                </span>

                <div className="flex items-center gap-2">
                  {/* INTERACTIVE RAW VS GRADED / BREAKDOWN SWITCHER */}
                  <button
                    type="button"
                    onClick={toggleGradeMode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/85 hover:bg-black text-[10px] font-mono border border-white/20 hover:border-[#D7FF64]/60 transition-all backdrop-blur-md shadow-lg"
                    title="Toggle Color Grade Proof"
                  >
                    <Sliders className="w-3 h-3 text-[#D7FF64]" />
                    <span className="text-white/60">GRADE:</span>
                    <span className={colorGradeMode === "graded" ? "text-[#D7FF64] font-bold" : "text-amber-400 font-bold"}>
                      {colorGradeMode === "graded" ? "REC.709 KODAK" : "RAW LOG"}
                    </span>
                  </button>

                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white/90 border border-white/10 text-[11px]">
                    {featuredProject.aspectRatio} · {featuredProject.duration}
                  </span>
                </div>
              </div>

              {/* Large Center Play Pill */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-[#D7FF64] text-[#050505] flex items-center justify-center shadow-[0_0_30px_rgba(215,255,100,0.4)] scale-95 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>

              {/* Bottom Technical Spec Pill */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
                <span className="text-[#D7FF64] font-bold">DIRECTOR&apos;S CUT</span>
                <span className="text-white/30">|</span>
                <span className="text-white/60">4K 60FPS</span>
              </div>

              {/* Bottom Playhead Scrub Indicator */}
              {isSpotlightHovered && (
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/10 z-20 pointer-events-none">
                  <div
                    className="h-full bg-[#D7FF64] shadow-[0_0_10px_#D7FF64] transition-all duration-100"
                    style={{ width: `${spotlightProgress || 25}%` }}
                  />
                </div>
              )}
            </div>

            {/* Spotlight Details */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-[#D7FF64] uppercase tracking-wider font-bold">
                    {featuredProject.clientContext}
                  </span>

                  {/* Audio Equalizer Cue */}
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
                    <Music className="w-3.5 h-3.5 text-[#D7FF64]" />
                    <span>24-STEM SOUND MASTER</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-outfit font-black text-white uppercase group-hover:text-[#D7FF64] transition-colors tracking-tight">
                  {featuredProject.title}
                </h3>

                <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-2xl font-sans">
                  {featuredProject.description}
                </p>

                {/* Layer Breakdown Badges on Flagship Card */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#D7FF64]/10 border border-[#D7FF64]/30 text-[#D7FF64]">
                    ◆ AE SPEED-GRAPH RAMPS
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-white/80">
                    ◆ 3D CAMERA MATCH CUTS
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-white/80">
                    ◆ SUB-BASS 40Hz TRANSIENT DESIGN
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-white/80">
                    ◆ KODAK 2383 FILM LUT
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/50">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D7FF64]" />
                  <span>{featuredProject.soundDesignNotes || "Multi-track Sound Architecture"}</span>
                </span>
                <span className="text-white group-hover:text-[#D7FF64] font-bold flex items-center gap-1 transition-colors">
                  WATCH DIRECTORS CUT <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* 2. FIRST VERTICAL REEL (Spans 4 columns on lg) */}
          {verticalProjects[0] && (
            <motion.div layout key={verticalProjects[0].id} className="lg:col-span-4">
              <ReelCard
                project={verticalProjects[0]}
                onSelect={onSelectProject}
                aspectOverride="9:16"
                className="h-full"
                audioMonitorEnabled={audioMonitorEnabled}
              />
            </motion.div>
          )}

          {/* 3. CRAFT & RIGOR BENTO TILE (Spans 4 columns on lg) */}
          <motion.div
            layout
            className="lg:col-span-4 rounded-3xl bg-[#0a0a0a] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#D7FF64]/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#D7FF64] uppercase tracking-wider mb-4">
                <span className="flex items-center gap-1.5 font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                  STUDIO ARCHITECTURE
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70">
                  FRAME ACCURACY
                </span>
              </div>

              <h4 className="text-3xl sm:text-4xl font-outfit font-black text-white tracking-tight uppercase leading-none">
                SURGICAL <br />
                <span className="text-[#D7FF64]">RHYTHM.</span>
              </h4>

              <p className="mt-3 text-xs text-white/60 leading-relaxed font-sans">
                Every frame serves the narrative arc. Dynamic velocity curves, 32-bit float audio stems, and surgical pattern interrupts crafted without relying on disposable vanity tactics.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Pacing Protocol:</span>
                <span className="text-[#D7FF64] font-bold">Velocity Graph Curves</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Audio Mastering:</span>
                <span className="text-white font-bold">Multi-Stem Mix & Foley</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Grading Pipeline:</span>
                <span className="text-white font-bold">DaVinci / Kodak 2383</span>
              </div>
            </div>
          </motion.div>

          {/* 4. SECOND VERTICAL REEL (Spans 4 columns on lg) */}
          {verticalProjects[1] && (
            <motion.div layout key={verticalProjects[1].id} className="lg:col-span-4">
              <ReelCard
                project={verticalProjects[1]}
                onSelect={onSelectProject}
                aspectOverride="9:16"
                className="h-full"
                audioMonitorEnabled={audioMonitorEnabled}
              />
            </motion.div>
          )}

          {/* 5. REMAINING PROJECTS IN BENTO GRID (Curated) */}
          {remainingProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              className="lg:col-span-4"
            >
              <ReelCard
                project={project}
                onSelect={onSelectProject}
                className="h-full"
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
            {displayFiltered.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ReelCard
                  project={project}
                  onSelect={onSelectProject}
                  className="h-full"
                  audioMonitorEnabled={audioMonitorEnabled}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* VIEW ALL REELS CALLOUT FOR COMPLETE ARCHIVE */}
      {showViewAllCta && (
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D7FF64] uppercase tracking-wider mb-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#D7FF64] shadow-[0_0_8px_#D7FF64] animate-pulse" />
              <span>PRODUCTION VAULT // COMPLETE REPERTOIRE</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-outfit font-black text-white uppercase tracking-tight">
              Looking for specific formats or styles?
            </h4>
            <p className="text-xs sm:text-sm text-white/60 font-sans mt-1 max-w-xl">
              Explore our full uncurated archive with advanced filters for Talking Head, Documentaries, Commercial Reels, and Motion Graphics.
            </p>
          </div>

          <Link
            href="/work"
            className="px-8 py-4 rounded-full bg-[#D7FF64] text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#e4ff88] transition-all duration-300 shadow-[0_0_30px_rgba(215,255,100,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3 whitespace-nowrap group flex-shrink-0"
          >
            <span>EXPLORE FULL ARCHIVE</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
