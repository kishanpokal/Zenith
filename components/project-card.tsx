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
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#121216] border border-white/[0.07] hover:border-[#D4AF37]/40 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] cursor-pointer shadow-lg select-none",
        isVertical ? "aspect-[9/16]" : "aspect-[16/9]"
      )}
      aria-label={`View project: ${project.title}`}
      data-cursor="play"
    >
      {/* BACKGROUND THUMBNAIL CONTAINER WITH 600ms GPU-ACCELERATED SCALE */}
      <div className="absolute inset-0 z-0 bg-[#09090B] overflow-hidden">
        <img
          src={imgSrc}
          alt={project.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />

        {/* Editorial Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-black/60 pointer-events-none" />
      </div>

      {/* TOP EDITORIAL HAIRLINE BAR */}
      <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between border-b border-white/[0.07] bg-[#09090B]/40 backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-[#D4AF37] font-semibold">{indexStr}</span>
          <span className="text-white/20">{"//"}</span>
          <span className="px-2 py-0.5 rounded-sm bg-white/[0.05] border border-white/[0.07] text-white/80 uppercase font-medium tracking-wider">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-white/60">
          <span className="px-1.5 py-0.5 rounded-sm bg-black/50 border border-white/[0.06]">
            {project.aspectRatio}
          </span>
          {project.duration && (
            <span className="flex items-center gap-1 text-white/50">
              <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>{project.duration}</span>
            </span>
          )}
        </div>
      </div>

      {/* CENTER PLAY BADGE ON HOVER */}
      <div className="relative z-10 my-auto flex items-center justify-center pointer-events-none">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            isHovered
              ? "bg-[#D4AF37] text-[#09090B] scale-110 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              : "bg-[#09090B]/70 text-white/80 border border-white/[0.12] backdrop-blur-sm"
          )}
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </div>
      </div>

      {/* BOTTOM METADATA & TITLE */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-[#09090B] via-[#09090B]/90 to-transparent pt-6 border-t border-white/[0.06]">
        {project.clientContext && (
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1 line-clamp-1">
            {project.clientContext}
          </div>
        )}
        <h3 className="text-sm sm:text-base font-display font-semibold text-[#F4F4F6] group-hover:text-[#D4AF37] transition-colors tracking-tight line-clamp-2 uppercase">
          {project.title}
        </h3>

        {/* Footer Monospace Status */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/[0.06] text-[10px] font-mono text-white/40">
          <span className="text-[#D4AF37]/80 truncate">
            {project.pacingStyle ? project.pacingStyle.split("/")[0] : "SURGICAL CUTS"}
          </span>
          <span className="flex items-center gap-1 text-white/60 group-hover:text-white transition-colors">
            <span>WATCH</span>
            <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
          </span>
        </div>
      </div>
    </div>
  );
}
