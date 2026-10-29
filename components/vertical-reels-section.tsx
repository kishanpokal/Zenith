"use client";

import React, { useState, useEffect } from "react";
import { Project, projects as fallbackProjects } from "@/data/projects";
import { ReelsFeed } from "@/components/work/reels-feed";
import { Smartphone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface VerticalReelsSectionProps {
  onSelectProject: (project: Project) => void;
  projects?: Project[];
  retentionReelIds?: string[];
}

export function VerticalReelsSection({
  onSelectProject,
  projects: initialProjects,
  retentionReelIds,
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

  // Strictly select 3 reels chosen by Admin in retentionReelIds, falling back to featured 9:16 reels
  const configuredReels = (retentionReelIds || [])
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p && p.published !== false));

  const fallbackFeaturedReels = allProjects.filter(
    (p) => p.aspectRatio === "9:16" && p.featured && p.published !== false
  );

  const fallbackAllReels = allProjects.filter(
    (p) => p.aspectRatio === "9:16" && p.published !== false
  );

  // Combine and deduplicate, strictly limiting to 3 reels
  const combinedReels: Project[] = [];
  const seenIds = new Set<string>();

  for (const list of [configuredReels, fallbackFeaturedReels, fallbackAllReels]) {
    for (const r of list) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id);
        combinedReels.push(r);
      }
      if (combinedReels.length === 3) break;
    }
    if (combinedReels.length === 3) break;
  }

  const displayReels = combinedReels.length > 0 ? combinedReels : allProjects.slice(0, 3);

  return (
    <section
      className="section-editorial bg-[#09090B] border-b border-white/[0.07] relative select-none"
      id="vertical-reels"
      aria-label="9:16 Vertical Reels & Shorts Showcase"
    >
      <div className="container-editorial relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 type-timecode text-white/70">
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>SHORTS & REELS</span>
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
              Short videos made for Instagram, TikTok, and YouTube Shorts. Strong hooks, animated captions, and sound effects that keep viewers engaged.
            </p>
            <div className="inline-flex items-center gap-2 type-timecode text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>{displayReels.length} FEATURED REELS</span>
            </div>
          </div>
        </div>

        {/* Reels Feed Component (Swipe on Mobile, 3 Centered Phone Mockups on Desktop) */}
        <ReelsFeed
          projects={displayReels}
          onSelectProject={onSelectProject}
        />

        {/* Bottom CTA to View Full Archive */}
        <div className="mt-8 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/60 hover:text-[#D4AF37] transition-colors py-2 px-4 rounded-sm border border-white/[0.08] hover:border-[#D4AF37]/40 bg-[#121216]/60"
          >
            <span>VIEW ALL ARCHIVED WORK</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
