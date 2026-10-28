"use client";

import React, { useState, useRef } from "react";
import { Project } from "@/data/projects";
import { Play, Volume2, VolumeX, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !hasVideoError) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser policy; poster remains visible
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative group">
      {/* Ambient Halo Glow (Inspired by Yash Edits ambient reel lighting) */}
      <div className="absolute -inset-2 rounded-3xl bg-accent/5 group-hover:bg-accent/20 blur-2xl transition-all duration-500 pointer-events-none opacity-40 group-hover:opacity-100" />

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-[#101010] border border-[#222222] group-hover:border-accent/80 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer flex flex-col justify-between shadow-2xl"
        aria-label={`View project: ${project.title}`}
      >
        {/* Media Layer (Video preview + Fallback SVG Poster) */}
        <div className="absolute inset-0 z-0 bg-[#080808]">
        {/* SVG/Poster Image (Always reliable) */}
        <img
          src={project.thumbnail}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
            isHovered && videoLoaded && !hasVideoError ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Muted HTML5 Video Preview for hover */}
        {project.videoSrc && !hasVideoError && (
          <video
            ref={videoRef}
            src={project.videoSrc}
            muted
            loop
            playsInline
            preload="none"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setHasVideoError(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isHovered && videoLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Gradient overlays for editorial text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
      </div>

      {/* Top Header Information */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-accent uppercase font-bold tracking-wider">
          {project.category}
        </span>

        <div className="flex items-center gap-2">
          {project.duration && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/80">
              <Clock className="w-2.5 h-2.5 text-accent" />
              <span>{project.duration}</span>
            </span>
          )}
        </div>
      </div>

      {/* Center Play Button Pill */}
      <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
            isHovered
              ? "bg-accent text-[#080808] scale-110 shadow-[0_0_25px_rgba(215,255,100,0.5)]"
              : "bg-black/60 backdrop-blur-md text-white/90 border border-white/20"
          )}
        >
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </div>
      </div>

      {/* Bottom Metadata & Title */}
      <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/90 to-transparent pt-8">
        <div className="text-[11px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1 line-clamp-1">
          {project.clientContext}
        </div>
        <h3 className="text-lg font-bold text-[#F5F5F2] group-hover:text-accent transition-colors tracking-tight line-clamp-2 mb-2 font-sans">
          {project.title}
        </h3>

        {/* Mini technical tag */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-[#A0A09C]">
          <span className="text-accent">{project.pacingStyle.split("/")[0]}</span>
          <span className="text-white/60 group-hover:text-white transition-colors">WATCH EDIT →</span>
        </div>
      </div>
    </div>
    </div>
  );
}
