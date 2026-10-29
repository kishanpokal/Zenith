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

interface SelectedWorkProps {
  onSelectProject?: (project: Project) => void;
}

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
    // If explicitly categorized as Talking Head or Motion Graphics, let those specific tabs handle them
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

export function SelectedWork({ onSelectProject }: SelectedWorkProps = {}) {
  const [allProjects, setAllProjects] = useState<Project[]>(fallbackProjects);
  const [selectedFilter, setSelectedFilter] = useState<string>("All Work");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid"); // Bento Studio default
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [audioMonitorEnabled, setAudioMonitorEnabled] = useState(false);

  const handleProjectSelect = (p: Project) => {
    if (onSelectProject) {
      onSelectProject(p);
    } else {
      setSelectedProject(p);
    }
  };

  // Fetch live projects from API with static fallback
  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAllProjects(data.filter((p: Project) => p.published !== false));
          }
        }
      } catch (err) {
        // Fallback to static DEFAULT_PROJECTS
      }
    }
    fetchLiveProjects();
  }, []);

  // On homepage Selected Work, only show projects marked as featured by Admin
  const featuredProjects = allProjects.filter((p) => p.featured && p.published !== false);
  const baseProjects = featuredProjects.length > 0 ? featuredProjects : allProjects.filter((p) => p.published !== false);

  // Compute category project counts based on featured projects
  const categoryCounts = FILTER_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = baseProjects.filter((p) => matchesCategory(p, cat)).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter projects by category and format
  const filteredProjects = baseProjects.filter((p) => {
    if (formatFilter === "9:16" && p.aspectRatio !== "9:16") return false;
    if (formatFilter === "16:9" && p.aspectRatio !== "16:9") return false;

    return matchesCategory(p, selectedFilter);
  });

  const displayList = filteredProjects;

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
        className="work section-editorial relative overflow-hidden bg-[#09090B] border-b border-white/[0.07]"
        id="work"
        aria-labelledby="work-title"
      >
        <div className="container-editorial relative z-10">
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
              onSelectProject={handleProjectSelect}
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
              onSelectProject={handleProjectSelect}
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
