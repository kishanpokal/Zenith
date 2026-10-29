"use client";

import React, { useState, useRef } from "react";
import { Project } from "@/data/projects";
import { Play, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
  onSelect: (project: Project) => void;
  aspectRatioOverride?: "16:9" | "9:16" | "auto";
}

export function ProjectCard({
  project,
  index = 0,
  onSelect,
  aspectRatioOverride = "auto",
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    project.thumbnail ||
      (project.youtubeId
        ? `https://i.ytimg.com/vi/${project.youtubeId}/maxresdefault.jpg`
        : "")
  );
  const [hasFallback, setHasFallback] = useState(false);

  const isVertical =
    aspectRatioOverride === "auto"
      ? project.aspectRatio === "9:16"
      : aspectRatioOverride === "9:16";

  const indexStr = String(index + 1).padStart(2, "0");

  const handleImageError = () => {
    if (project.youtubeId && !hasFallback) {
      setHasFallback(true);
      setImgSrc(`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // If YouTube returned 120x90 placeholder
    const img = e.currentTarget;
    if (img.naturalWidth <= 120 && project.youtubeId && !hasFallback) {
      setHasFallback(true);
      setImgSrc(`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#121216] border border-white/[0.07] hover:border-[#D4AF37]/40 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] cursor-pointer shadow-lg select-none"
      aria-label={`View project: ${project.title}`}
      data-cursor="play"
    >
      {/* 1. THUMBNAIL CONTAINER — Pristine & Uncluttered, Never obscured by text */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#09090B]",
          isVertical ? "aspect-[9/16]" : "aspect-video"
        )}
      >
        <img
          src={imgSrc}
          alt={project.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />

        {/* Subtle Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* TOP-RIGHT ONLY: Compact Duration/Format Pill Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 text-[10px] font-mono bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 text-white/90">
          <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
          <span>{project.duration || "02:14"} {"//"} {project.aspectRatio === "9:16" ? "9:16" : "4K"}</span>
        </div>

        {/* CENTER ONLY: Tactile 48px × 48px Frosted-Glass Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border",
              isHovered
                ? "bg-[#D4AF37] text-[#09090B] border-[#D4AF37] scale-110 shadow-[0_0_24px_rgba(212,175,55,0.4)]"
                : "bg-black/50 text-[#F4F4F6] border-white/20 backdrop-blur-md"
            )}
          >
            <Play className={cn("w-4 h-4 fill-current ml-0.5", isHovered ? "text-[#09090B]" : "text-[#D4AF37]")} />
          </div>
        </div>
      </div>

      {/* 2. OUTSIDE EDITORIAL FOOTER STRIP — Moved below thumbnail container */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#121216] border-t border-white/[0.06]">
        <div>
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-white/50 mb-1.5">
            <span className="text-[#D4AF37] font-semibold">{indexStr} {"//"} {project.category}</span>
            {project.clientContext && (
              <span className="text-white/40 truncate max-w-[150px]">{project.clientContext}</span>
            )}
          </div>

          <h3 className="type-card-title text-[#F4F4F6] group-hover:text-[#D4AF37] transition-colors line-clamp-2 uppercase">
            {project.title}
          </h3>
        </div>

        {/* Monospace Footer Status */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06] type-timecode text-white/40">
          <span className="text-[#D4AF37]/90 truncate text-[10px]">
            {project.pacingStyle ? project.pacingStyle.split("/")[0] : "SURGICAL CUTS"}
          </span>
          <span className="flex items-center gap-1 text-white/70 group-hover:text-white transition-colors text-[10px] shrink-0">
            <span>WATCH</span>
            <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
          </span>
        </div>
      </div>
    </div>
  );
}
