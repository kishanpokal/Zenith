"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgressBar } from "@/components/scroll-progress";
import { VideoLightbox } from "@/components/video-lightbox";
import { ReelCard } from "@/components/work/reel-card";
import { projects as fallbackProjects, Project, ProjectCategory } from "@/data/projects";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Volume2,
  VolumeX,
  ArrowLeft,
  X,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_CATEGORIES: ProjectCategory[] = [
  "All Work",
  "Shorts & Reels",
  "YouTube Longform",
  "Talking Head",
  "Business & Education",
  "Promotional",
  "Motion Graphics",
];

export default function WorkArchivePage() {
  const [allProjects, setAllProjects] = useState<Project[]>(fallbackProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Work");
  const [formatFilter, setFormatFilter] = useState<"all" | "9:16" | "16:9">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "title" | "duration">("featured");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [audioMonitorEnabled, setAudioMonitorEnabled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Fetch live projects from API with static fallback
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllProjects(data.filter((p: Project) => p.published !== false));
          }
        }
      } catch (err) {
        // Fallback to static
      }
    }
    loadProjects();
  }, []);

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    return ALL_CATEGORIES.reduce((acc, cat) => {
      if (cat === "All Work") {
        acc[cat] = allProjects.length;
      } else if (cat === "Shorts & Reels") {
        acc[cat] = allProjects.filter((p) => p.aspectRatio === "9:16").length;
      } else if (cat === "YouTube Longform") {
        acc[cat] = allProjects.filter((p) => p.aspectRatio === "16:9").length;
      } else {
        acc[cat] = allProjects.filter((p) => p.category === cat).length;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [allProjects]);

  // Filter and Sort Pipeline
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((p) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchClient = p.clientContext.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTags = p.editBreakdown?.some((tag) => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchClient && !matchCategory && !matchTags) {
            return false;
          }
        }

        // Format Filter
        if (formatFilter === "9:16" && p.aspectRatio !== "9:16") return false;
        if (formatFilter === "16:9" && p.aspectRatio !== "16:9") return false;

        // Category Filter
        if (selectedCategory === "All Work") return true;
        if (selectedCategory === "Shorts & Reels") return p.aspectRatio === "9:16";
        if (selectedCategory === "YouTube Longform") return p.aspectRatio === "16:9";
        return p.category === selectedCategory;
      })
      .sort((a, b) => {
        if (sortBy === "duration") {
          return a.duration.localeCompare(b.duration);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return (a.order || 0) - (b.order || 0);
      });
  }, [allProjects, searchQuery, formatFilter, selectedCategory, sortBy]);

  const paginatedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <SmoothScroll>
      <ScrollProgressBar />

      <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D7FF64] selection:text-[#050505]">
        <Navigation />

        {/* HERO ARCHIVE HEADER */}
        <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 relative overflow-hidden border-b border-white/[0.08]">
          {/* Ambient Lighting Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(215,255,100,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
            {/* Top Breadcrumb & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-[#D7FF64] transition-colors uppercase tracking-wider group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>BACK TO STUDIO OVERVIEW</span>
              </Link>

              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <span className="w-2 h-2 rounded-full bg-[#D7FF64] animate-pulse" />
                <span>COMPLETE VAULT // DIRECTORS CUT ARCHIVE</span>
              </div>
            </div>

            {/* Master Headline */}
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 font-mono text-xs text-[#D7FF64] uppercase tracking-widest mb-3">
                <span>◆ SCENE 01 // PRODUCTION ARCHIVE</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40">HIGH-RETENTION POST-PRODUCTION</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight text-white leading-[0.98]">
                THE COMPLETE <br />
                <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lg:text-[84px] lowercase tracking-normal">
                  archive.
                </span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl font-sans leading-relaxed">
                Filter through our comprehensive catalog of commercial showreels, high-velocity talking head reels,
                documentary essays, and kinetic typography. Engineered for creators and brands demanding cinematic pacing, visceral sound design, and narrative clarity.
              </p>
            </div>

            {/* Studio Technical Specifications */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
              <div>
                <div className="font-outfit font-black text-2xl text-white">4K UHD</div>
                <div className="font-mono text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Master Output</div>
              </div>
              <div>
                <div className="font-outfit font-black text-2xl text-[#D7FF64]">REC.709</div>
                <div className="font-mono text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Color Workflow</div>
              </div>
              <div>
                <div className="font-outfit font-black text-2xl text-white">32-BIT</div>
                <div className="font-mono text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Audio Fidelity</div>
              </div>
              <div>
                <div className="font-outfit font-black text-2xl text-white">PRO EDIT</div>
                <div className="font-mono text-[11px] text-white/50 uppercase tracking-wider mt-0.5">Premiere & AE</div>
              </div>
            </div>
          </div>
        </section>

        {/* ADVANCED FILTERING & SEARCH CONSOLE */}
        <section className="py-8 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.08] sticky top-16 z-30">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
            
            {/* SEARCH BAR & CONTROLS ROW */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-5">
              
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12);
                  }}
                  placeholder="Search reels by title, creator, style, sound..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white/[0.04] border border-white/15 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-[#D7FF64] focus:ring-1 focus:ring-[#D7FF64] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Right Utility Controls */}
              <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
                {/* Audio Monitor Toggle */}
                <button
                  type="button"
                  onClick={() => setAudioMonitorEnabled((prev) => !prev)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-mono transition-all duration-300 ${
                    audioMonitorEnabled
                      ? "bg-[#D7FF64]/15 border-[#D7FF64] text-[#D7FF64] shadow-[0_0_15px_rgba(215,255,100,0.25)]"
                      : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                  title="Toggle studio audio monitor on hover previews"
                >
                  {audioMonitorEnabled ? (
                    <>
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

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-white/70">
                  <span className="text-white/40 text-[11px] uppercase">SORT:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white focus:outline-none text-xs font-mono cursor-pointer"
                  >
                    <option value="featured" className="bg-[#0e0e0e] text-white">Featured</option>
                    <option value="title" className="bg-[#0e0e0e] text-white">Title (A-Z)</option>
                    <option value="duration" className="bg-[#0e0e0e] text-white">Duration</option>
                  </select>
                </div>

                {/* Format Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setFormatFilter("all")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      formatFilter === "all"
                        ? "bg-white text-black font-bold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    ALL
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatFilter("9:16")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      formatFilter === "9:16"
                        ? "bg-[#D7FF64] text-black font-bold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    9:16 REELS
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatFilter("16:9")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      formatFilter === "16:9"
                        ? "bg-[#D7FF64] text-black font-bold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    16:9 WIDE
                  </button>
                </div>
              </div>
            </div>

            {/* CATEGORY TABS ROW */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {ALL_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(12);
                    }}
                    className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? "text-[#050505] font-black"
                        : "text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="archiveActiveFilter"
                        className="absolute inset-0 bg-[#D7FF64] rounded-full shadow-[0_0_15px_rgba(215,255,100,0.3)]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
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

          </div>
        </section>

        {/* RESULTS FEED SECTION */}
        <section className="py-16 sm:py-20 relative">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
            
            {/* Status bar */}
            <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-8 pb-3 border-b border-white/[0.08]">
              <div>
                SHOWING <span className="text-[#D7FF64] font-bold">{paginatedProjects.length}</span> OF{" "}
                <span className="text-white font-bold">{filteredProjects.length}</span> AVAILABLE CUTS
                {searchQuery && <span> FOR &quot;{searchQuery}&quot;</span>}
              </div>

              {(searchQuery || selectedCategory !== "All Work" || formatFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Work");
                    setFormatFilter("all");
                  }}
                  className="text-white/40 hover:text-[#D7FF64] transition-colors underline"
                >
                  RESET FILTERS
                </button>
              )}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="py-24 text-center rounded-3xl border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-md">
                <p className="text-white/50 font-mono text-sm">
                  No projects match your current filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Work");
                    setFormatFilter("all");
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-[#D7FF64] hover:text-black transition-all text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProjects.map((project) => (
                  <ReelCard
                    key={project.id}
                    project={project}
                    onSelect={setSelectedProject}
                    audioMonitorEnabled={audioMonitorEnabled}
                    className="h-full"
                  />
                ))}
              </div>
            )}

            {/* Load More Pagination */}
            {hasMore && (
              <div className="mt-16 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  className="px-8 py-4 rounded-full bg-white/[0.05] hover:bg-[#D7FF64] hover:text-[#050505] border border-white/15 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 group"
                >
                  <span>LOAD MORE EDITS ({filteredProjects.length - visibleCount} REMAINING)</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Fullscreen Cinema Video Lightbox */}
        {selectedProject && (
          <VideoLightbox
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNext={() => {
              const curIdx = filteredProjects.findIndex((p) => p.id === selectedProject.id);
              if (curIdx !== -1) {
                const nextIdx = (curIdx + 1) % filteredProjects.length;
                setSelectedProject(filteredProjects[nextIdx]);
              }
            }}
            onPrev={() => {
              const curIdx = filteredProjects.findIndex((p) => p.id === selectedProject.id);
              if (curIdx !== -1) {
                const prevIdx = (curIdx - 1 + filteredProjects.length) % filteredProjects.length;
                setSelectedProject(filteredProjects[prevIdx]);
              }
            }}
          />
        )}

        <Footer />
      </main>
    </SmoothScroll>
  );
}
