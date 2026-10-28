"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { Play, ArrowUpRight, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReelCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  aspectOverride?: "9:16" | "16:9" | "auto";
  featured?: boolean;
  className?: string;
  audioMonitorEnabled?: boolean;
}

export function ReelCard({
  project,
  onSelect,
  aspectOverride = "auto",
  featured = false,
  className,
  audioMonitorEnabled = false,
}: ReelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isVertical =
    aspectOverride === "auto"
      ? project.aspectRatio === "9:16"
      : aspectOverride === "9:16";

  const handleMouseEnter = () => {
    setIsHovered(true);

    if (videoRef.current && !videoError) {
      const vid = videoRef.current;
      vid.currentTime = 0;

      if (audioMonitorEnabled) {
        vid.muted = false;
        vid.volume = 0;
        let vol = 0;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = setInterval(() => {
          vol = Math.min(0.7, vol + 0.1);
          if (vid) vid.volume = vol;
          if (vol >= 0.7 && fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
        }, 30);
      } else {
        vid.muted = true;
      }

      vid.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPlaybackProgress(0);

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setPlaybackProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      );
    }
  };

  // Derive editor craft tags
  const craftTags =
    project.editBreakdown && project.editBreakdown.length > 0
      ? project.editBreakdown.slice(0, 3)
      : [
          "AE Expressions",
          "Color Graded 2383",
          "Sound Design 24-Track",
        ];

  return (
    <div
      role="button"
      tabIndex={0}
      data-cursor="play"
      onClick={() => onSelect(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(project);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative bg-[#0a0a0a] border border-white/[0.08] hover:border-white/30 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-500 flex flex-col justify-between select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7FF64]",
        featured && "border-[#D7FF64]/40 bg-[#0d0d0d]",
        className
      )}
    >
      {/* Media Wrapper */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-black flex items-center justify-center",
          isVertical ? "aspect-[9/14] sm:aspect-[9/15]" : "aspect-[16/10]"
        )}
      >
        {/* Poster Image */}
        <img
          src={project.thumbnail}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
            isHovered && videoLoaded && !videoError ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
        />

        {/* 60 FPS Video Decoder Discipline: video decodes only on user hover */}
        {project.videoSrc && !videoError && project.videoSrc.endsWith(".mp4") && (
          <video
            ref={videoRef}
            src={project.videoSrc}
            muted={!audioMonitorEnabled}
            loop
            playsInline
            preload="none"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            onTimeUpdate={handleTimeUpdate}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isHovered && videoLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 group-hover:via-transparent transition-all duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] font-mono z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white/90 border border-white/10 uppercase tracking-wider font-medium text-[10px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
            <span>{project.category}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white/70 border border-white/10 text-[10px]">
            {project.aspectRatio} · {project.duration}
          </span>
        </div>

        {/* Center Hover Play Pill */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
              isHovered
                ? "bg-[#D7FF64] text-[#050505] scale-110 shadow-[0_0_25px_rgba(215,255,100,0.5)]"
                : "bg-black/60 backdrop-blur-md text-white/80 border border-white/15 scale-95 opacity-80 group-hover:opacity-100"
            )}
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>

        {/* Live Audio Waveform & Audio Live Indicator (when audio monitor is on) */}
        {isHovered && audioMonitorEnabled && (
          <div className="absolute top-12 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#D7FF64]/40 text-[#D7FF64] text-[9px] font-mono pointer-events-none">
            <Volume2 className="w-3 h-3 animate-pulse" />
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 h-1.5 bg-[#D7FF64] animate-pulse" />
              <span className="w-0.5 h-2.5 bg-[#D7FF64]" />
              <span className="w-0.5 h-1 bg-[#D7FF64] animate-bounce" />
            </div>
            <span>LIVE AUDIO</span>
          </div>
        )}

        {/* Hover Scrub Playhead Bar across the bottom of the video */}
        {isHovered && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20 pointer-events-none">
            <div
              className="h-full bg-[#D7FF64] shadow-[0_0_8px_#D7FF64] transition-all duration-100"
              style={{ width: `${playbackProgress || 20}%` }}
            />
          </div>
        )}
      </div>

      {/* Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-outfit font-bold text-white uppercase tracking-tight group-hover:text-[#D7FF64] transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-xs text-white/60 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {project.description}
          </p>

          {/* Layer Breakdown Tags on Hover */}
          <div className="mt-3 flex flex-wrap gap-1.5 min-h-[22px]">
            {craftTags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className={cn(
                  "text-[9px] font-mono px-2 py-0.5 rounded border transition-all duration-300 truncate max-w-[170px]",
                  isHovered
                    ? "bg-[#D7FF64]/10 border-[#D7FF64]/30 text-[#D7FF64]"
                    : "bg-white/[0.02] border-white/10 text-white/40"
                )}
              >
                ◆ {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/50">
          <span className="truncate max-w-[140px] text-white/70">{project.clientContext}</span>
          <span className="text-white/80 group-hover:text-[#D7FF64] flex items-center gap-1 font-semibold transition-colors">
            PLAY REEL <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}
