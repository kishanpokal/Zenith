"use client";

import React, { useState, useEffect } from "react";
import { Project, projects as fallbackProjects } from "@/data/projects";
import { ReelsFeed } from "@/components/work/reels-feed";
import { Smartphone, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface VerticalReelsSectionProps {
  onSelectProject: (project: Project) => void;
  projects?: Project[];
}

export function VerticalReelsSection({
  onSelectProject,
  projects: initialProjects,
}: VerticalReelsSectionProps) {
  const [allProjects, setAllProjects] = useState<Project[]>(
    initialProjects || fallbackProjects
  );

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setAllProjects(initialProjects);
      return;
    }

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
        // Fallback
      }
    }
    loadProjects();
  }, [initialProjects]);

  const verticalReels = allProjects.filter((p) => p.aspectRatio === "9:16");
  const displayReels = verticalReels.length > 0 ? verticalReels : allProjects;

  return (
    <section
      className="py-16 sm:py-24 bg-[#09090B] border-b border-white/[0.07] relative select-none"
      id="vertical-reels"
      aria-label="9:16 Vertical Reels & Shorts Showcase"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 type-timecode text-white/70">
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>SCENE 03 {"//"} 9:16 VERTICAL ARCHITECTURE</span>
            </div>

            <h2 className="type-section-title text-[#F4F4F6]">
              HIGH-RETENTION <br />
              <span className="font-editorial text-[#D4AF37] lowercase">
                shorts & reels.
              </span>
            </h2>
          </div>

          <div className="max-w-md md:text-right">
            <p className="type-body text-sm leading-relaxed mb-3">
              Engineered for algorithmic velocity across Instagram Reels, YouTube Shorts, and TikTok. Scroll-stopping 0.8s hooks, tactile Foley, and custom kinetic typography.
            </p>
            <div className="inline-flex items-center gap-2 type-timecode text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>{displayReels.length} MASTER REELS AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Reels Feed Component (Swipe on Mobile, Device Mockup on Desktop) */}
        <ReelsFeed
          projects={displayReels}
          onSelectProject={onSelectProject}
        />
      </div>
    </section>
  );
}
