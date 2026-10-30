"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgressBar } from "@/components/scroll-progress";
import { VideoLightbox } from "@/components/video-lightbox";
import { ReelCard } from "@/components/work/reel-card";
import { Project, ProjectCategory } from "@/data/projects";
import {
  Search,
  ArrowLeft,
  X,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

const ALL_CATEGORIES: ProjectCategory[] = [
  "All Work",
  "Shorts & Reels",
  "YouTube Longform",
  "Talking Head",
  "Business & Education",
  "Promotional",
  "Motion Graphics",
];

function matchesCategory(project: Project, category: string): boolean {
  if (category === "All Work") return true;

  const cat = (project.category || "").toLowerCase().trim();
  const title = (project.title || "").toLowerCase();
  const desc = (project.description || "").toLowerCase();

  if (category === "Talking Head") {
    return (
      cat === "talking head" ||
      cat.includes("talking") ||
      cat.includes("podcast") ||
      title.includes("talking head") ||
      title.includes("podcast") ||
      desc.includes("talking head") ||
      desc.includes("podcast")
    );
  }

  if (category === "Motion Graphics") {
    return (
      cat === "motion graphics" ||
      cat.includes("motion") ||
      cat.includes("vfx") ||
      cat.includes("animation") ||
      title.includes("motion") ||
      desc.includes("motion graphics") ||
      desc.includes("animation")
    );
  }

  if (category === "YouTube Longform") {
    if (cat === "talking head" || cat === "motion graphics") return false;
    return (
      cat === "youtube longform" ||
      cat === "longform" ||
      cat === "commercial" ||
      cat === "documentary" ||
      (project.aspectRatio === "16:9" && !cat.includes("short"))
    );
  }

  if (category === "Shorts & Reels") {
    if (
      cat === "talking head" ||
      cat.includes("talking") ||
      cat.includes("podcast") ||
      cat === "motion graphics" ||
      cat.includes("motion") ||
      title.includes("talking head") ||
      title.includes("podcast") ||
      title.includes("motion")
    ) {
      return false;
    }

    return (
      cat === "shorts & reels" ||
      cat === "short-form / reel" ||
      cat === "reel" ||
      cat === "shorts" ||
      project.aspectRatio === "9:16"
    );
  }

  return cat === category.toLowerCase().trim();
}

interface WorkArchiveClientProps {
  initialProjects: Project[];
}

export function WorkArchiveClient({ initialProjects }: WorkArchiveClientProps) {
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Work");
  const [formatFilter, setFormatFilter] = useState<"all" | "9:16" | "16:9">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "title" | "duration">("featured");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [audioMonitorEnabled, setAudioMonitorEnabled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync state if initialProjects change
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setAllProjects(initialProjects);
    }
  }, [initialProjects]);

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    return ALL_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = allProjects.filter((p) => matchesCategory(p, cat)).length;
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
        return matchesCategory(p, selectedCategory);
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

      <main className="min-h-screen bg-[#09090B] text-[#F4F4F6] selection:bg-[#D4AF37] selection:text-[#09090B]">
        <Navigation />

        {/* HERO ARCHIVE HEADER */}
        <section className="pt-24 lg:pt-28 pb-10 sm:pb-14 relative overflow-hidden border-b border-white/[0.07]">
          <div className="container-editorial relative z-10">
            {/* Top Breadcrumb & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-[#D4AF37] transition-colors uppercase tracking-wider group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>BACK TO STUDIO OVERVIEW</span>
              </Link>

              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>COMPLETE EDITORIAL ARCHIVE</span>
              </div>
            </div>

            {/* Master Headline */}
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] mb-3">
                <span>◆ ARCHIVE 01 // PRODUCTION VAULT</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40">HIGH-RETENTION POST-PRODUCTION</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]">
                THE COMPLETE <br />
                <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                  archive.
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl font-sans leading-relaxed">
                Explore our full catalog of commercial showreels, talking head reels,
                documentary cuts, and motion design. Engineered for high retention and narrative impact.
              </p>
            </div>

            {/* Studio Technical Specifications */}
            <div className="mt-8 pt-6 border-t border-white/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl">
              <div>
                <div className="font-display font-bold text-lg sm:text-xl text-white">4K UHD</div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Master Output</div>
              </div>
              <div>
                <div className="font-display font-bold text-lg sm:text-xl text-[#D4AF37]">REC.709</div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Color Profile</div>
              </div>
              <div>
                <div className="font-display font-bold text-lg sm:text-xl text-white">32-BIT</div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Audio Stems</div>
              </div>
              <div>
                <div className="font-display font-bold text-lg sm:text-xl text-white">PRO EDIT</div>
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Premiere & AE</div>
              </div>
            </div>
          </div>
        </section>

        {/* ADVANCED FILTERING & SEARCH CONSOLE */}
        <section className="py-4 bg-[#09090B]/95 backdrop-blur-md border-b border-white/[0.07] sticky top-14 lg:top-16 z-30">
          <div className="container-editorial">
            {/* SEARCH BAR & CONTROLS ROW */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-3">
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
                  placeholder="Search projects by title, client, category..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-sm bg-[#121216] border border-white/[0.08] text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-[#D4AF37] transition-colors"
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
                {/* Audio Monitor Toggle */}
                <button
                  type="button"
                  onClick={() => setAudioMonitorEnabled((prev) => !prev)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-mono transition-all duration-200 ${
                    audioMonitorEnabled
                      ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                      : "bg-[#121216] border-white/[0.07] text-white/60 hover:text-white"
                  }`}
                  title="Toggle audio monitor"
                >
                  {audioMonitorEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-semibold">AUDIO: LIVE</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-white/50" />
                      <span>AUDIO: MUTED</span>
                    </>
                  )}
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#121216] border border-white/[0.07] text-[10px] font-mono text-white/70">
                  <span className="text-white/40 uppercase">SORT:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-white focus:outline-none text-[10px] font-mono cursor-pointer"
                  >
                    <option value="featured" className="bg-[#121216] text-white">Featured</option>
                    <option value="title" className="bg-[#121216] text-white">Title (A-Z)</option>
                    <option value="duration" className="bg-[#121216] text-white">Duration</option>
                  </select>
                </div>

                {/* Format Toggle */}
                <div className="flex items-center gap-1 p-0.5 rounded-sm bg-[#121216] border border-white/[0.07] text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setFormatFilter("all")}
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
                    onClick={() => setFormatFilter("9:16")}
                    className={`px-2.5 py-1 rounded-sm transition-all ${
                      formatFilter === "9:16"
                        ? "bg-[#D4AF37] text-[#09090B] font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    9:16
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatFilter("16:9")}
                    className={`px-2.5 py-1 rounded-sm transition-all ${
                      formatFilter === "16:9"
                        ? "bg-[#D4AF37] text-[#09090B] font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    16:9
                  </button>
                </div>
              </div>
            </div>

            {/* CATEGORY TABS ROW */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap touch-pan-x">
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
                    className={`px-3 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-2 shrink-0 ${
                      isActive
                        ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-sm"
                        : "text-white/60 hover:text-white bg-[#121216] border border-white/[0.07]"
                    }`}
                  >
                    <span>{cat}</span>
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
          </div>
        </section>

        {/* RESULTS FEED SECTION */}
        <section className="section-editorial relative">
          <div className="container-editorial">
            {/* Status bar */}
            <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-8 pb-3 border-b border-white/[0.07]">
              <div>
                SHOWING <span className="text-[#D4AF37] font-semibold">{paginatedProjects.length}</span> OF{" "}
                <span className="text-white font-semibold">{filteredProjects.length}</span> ARCHIVE CUTS
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
                  className="text-white/40 hover:text-[#D4AF37] transition-colors"
                >
                  RESET FILTERS
                </button>
              )}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="py-24 text-center rounded-xl border border-white/[0.07] bg-[#121216]">
                <p className="text-white/50 font-mono text-xs">
                  NO PROJECTS MATCH YOUR CURRENT CRITERIA.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Work");
                    setFormatFilter("all");
                  }}
                  className="mt-4 px-5 py-2 rounded-sm bg-[#D4AF37] text-[#09090B] font-mono text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProjects.map((project, idx) => (
                  <ReelCard
                    key={project.id}
                    project={project}
                    onSelect={setSelectedProject}
                    audioMonitorEnabled={audioMonitorEnabled}
                    index={idx}
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
                  className="px-6 py-3 rounded-sm bg-[#121216] hover:bg-[#18181E] hover:border-[#D4AF37]/50 border border-white/[0.08] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 group"
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
