"use client";

import React, { useState, useEffect } from "react";
import { projects as fallbackProjects, Project } from "@/data/projects";
import { VideoLightbox } from "@/components/video-lightbox";
import { WorkHeader, ViewMode, FormatFilter } from "@/components/work/work-header";
import { BentoGrid } from "@/components/work/bento-grid";
import { ReelsFeed } from "@/components/work/reels-feed";

const FILTER_CATEGORIES = [
  "All Work",
  "Shorts & Reels",
  "YouTube Longform",
  "Talking Head",
  "Motion Graphics",
];

export function SelectedWork() {
  const [allProjects, setAllProjects] = useState<Project[]>(fallbackProjects);
  const [selectedFilter, setSelectedFilter] = useState<string>("All Work");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid"); // Bento Studio default
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [audioMonitorEnabled, setAudioMonitorEnabled] = useState(false);

  // Fetch live projects from API with static fallback
  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllProjects(data.filter((p: Project) => p.published !== false));
          }
        }
      } catch (err) {
        // Fallback to static DEFAULT_PROJECTS
      }
    }
    fetchLiveProjects();
  }, []);

  // Compute category project counts
  const categoryCounts = FILTER_CATEGORIES.reduce((acc, cat) => {
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

  // Filter projects by category and format
  const filteredProjects = allProjects.filter((p) => {
    if (formatFilter === "9:16" && p.aspectRatio !== "9:16") return false;
    if (formatFilter === "16:9" && p.aspectRatio !== "16:9") return false;

    if (selectedFilter === "All Work") return true;
    if (selectedFilter === "Shorts & Reels") return p.aspectRatio === "9:16";
    if (selectedFilter === "YouTube Longform") return p.aspectRatio === "16:9";
    return p.category === selectedFilter;
  });

  const displayList = filteredProjects.length > 0 ? filteredProjects : allProjects;

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % displayList.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, displayList.length]);

  return (
    <>
      <section
        className="work pt-6 sm:pt-10 pb-20 sm:pb-28 relative overflow-hidden bg-[#050505]"
        id="work"
        aria-labelledby="work-title"
      >
        {/* Subtle Ambient Film Glow Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(rgba(215,255,100,0.15)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="work__pin max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          {/* Studio Header (Timecode, Eyebrow, Title, Filter Pills, View Switcher, Audio Monitor) */}
          <WorkHeader
            categories={FILTER_CATEGORIES}
            selectedFilter={selectedFilter}
            onSelectFilter={(cat) => {
              setSelectedFilter(cat);
              setActiveIndex(0);
            }}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            totalProjects={displayList.length}
            categoryCounts={categoryCounts}
            audioMonitorEnabled={audioMonitorEnabled}
            onToggleAudioMonitor={() => setAudioMonitorEnabled((prev) => !prev)}
            formatFilter={formatFilter}
            onChangeFormatFilter={setFormatFilter}
          />

          {/* VIEW MODE A: ASYMMETRIC BENTO STUDIO GRID (Flagship Curated 4-5 Reels) */}
          {viewMode === "grid" && (
            <BentoGrid
              projects={displayList}
              onSelectProject={setSelectedProject}
              selectedFilter={selectedFilter}
              audioMonitorEnabled={audioMonitorEnabled}
              limit={5}
              showViewAllCta={true}
            />
          )}

          {/* VIEW MODE B: IMMERSIVE 9:16 SMARTPHONE REELS FEED */}
          {viewMode === "reels" && (
            <ReelsFeed
              projects={displayList}
              onSelectProject={setSelectedProject}
            />
          )}
        </div>
      </section>

      {/* Fullscreen Cinema Video Lightbox (Director's Cut Mode) */}
      {selectedProject && (
        <VideoLightbox
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNext={() => {
            const curIdx = displayList.findIndex((p) => p.id === selectedProject.id);
            if (curIdx !== -1) {
              const nextIdx = (curIdx + 1) % displayList.length;
              setSelectedProject(displayList[nextIdx]);
            }
          }}
          onPrev={() => {
            const curIdx = displayList.findIndex((p) => p.id === selectedProject.id);
            if (curIdx !== -1) {
              const prevIdx = (curIdx - 1 + displayList.length) % displayList.length;
              setSelectedProject(displayList[prevIdx]);
            }
          }}
        />
      )}
    </>
  );
}
