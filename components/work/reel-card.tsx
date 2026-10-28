"use client";

import React, { useState } from "react";
import { Project } from "@/data/projects";
import { Play, ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReelCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  aspectOverride?: "9:16" | "16:9" | "auto";
  featured?: boolean;
  className?: string;
  audioMonitorEnabled?: boolean;
  index?: number;
}

export function ReelCard({
  project,
  onSelect,
  aspectOverride = "auto",
  featured = false,
  className,
  index = 0,
}: ReelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    project.thumbnail ||
      (project.youtubeId
        ? `https://i.ytimg.com/vi/${project.youtubeId}/maxresdefault.jpg`
        : "")
  );
  const [hasFallback, setHasFallback] = useState(false);

  const isVertical =
    aspectOverride === "auto"
      ? project.aspectRatio === "9:16"
      : aspectOverride === "9:16";

  const handleImageError = () => {
    if (project.youtubeId && !hasFallback) {
      setHasFallback(true);
      setImgSrc(`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
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
        isVertical ? "aspect-[9/16]" : "aspect-[16/9]",
        className
      )}
      aria-label={`View ${project.title}`}
      data-cursor="play"
    >
      {/* THUMBNAIL WITH 600ms GPU-ACCELERATED SCALE */}
      <div className="absolute inset-0 z-0 bg-[#09090B] overflow-hidden">
        <img
          src={imgSrc}
          alt={project.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-black/60 pointer-events-none" />
      </div>

      {/* TOP EDITORIAL HAIRLINE BAR */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between border-b border-white/[0.07] bg-[#09090B]/40 backdrop-blur-md">
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[#D4AF37] font-semibold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-white/20">{"//"}</span>
          <span className="px-2 py-0.5 rounded-sm bg-white/[0.05] border border-white/[0.07] text-white/80 uppercase font-medium">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/60">
          <span className="px-1.5 py-0.5 rounded-sm bg-black/60 border border-white/[0.06]">
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

      {/* CENTER PLAY BADGE — FROSTED GLASS ON MOBILE / GLOW ON HOVER */}
      <div className="relative z-10 my-auto flex items-center justify-center pointer-events-none">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 backdrop-blur-md border",
            isHovered
              ? "bg-[#D4AF37] text-[#09090B] border-[#D4AF37] scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              : "bg-[#09090B]/85 text-[#F4F4F6] border-white/[0.15] shadow-lg"
          )}
        >
          <Play className={cn("w-3.5 h-3.5 fill-current", isHovered ? "text-[#09090B]" : "text-[#D4AF37]")} />
          <span className="type-timecode text-[10px] tracking-wider font-semibold">WATCH EDIT</span>
        </div>
      </div>

      {/* BOTTOM INFO BAR WITH GRADIENT SCRIM */}
      <div className="relative z-10 p-3.5 sm:p-4 bg-gradient-to-t from-[#09090B] via-[#09090B]/95 to-transparent pt-8 border-t border-white/[0.06]">
        {project.clientContext && (
          <div className="type-timecode text-white/40 mb-1 line-clamp-1">
            {project.clientContext}
          </div>
        )}
        <h4 className="text-sm font-display font-semibold text-[#F4F4F6] group-hover:text-[#D4AF37] transition-colors tracking-tight line-clamp-2 uppercase">
          {project.title}
        </h4>
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.06] type-timecode text-white/40">
          <span className="text-[#D4AF37]/90">{project.aspectRatio === "9:16" ? "VERTICAL REEL" : "CINEMATIC 16:9"}</span>
          <span className="flex items-center gap-1 text-white/70 group-hover:text-white transition-colors">
            <span>WATCH</span>
            <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
          </span>
        </div>
      </div>
    </div>
  );
}
