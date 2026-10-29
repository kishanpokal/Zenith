"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sliders,
  Grid,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomVideoStageProps {
  youtubeId?: string;
  videoSrc?: string;
  thumbnail: string;
  title: string;
  aspectRatio: "9:16" | "16:9";
  timecode?: string;
  duration?: string;
  onChapterChange?: (chapterIndex: number) => void;
}

type LutMode = "kodak" | "teal-orange" | "s-log" | "mono";

export function CustomVideoStage({
  youtubeId,
  videoSrc,
  thumbnail,
  title,
  aspectRatio,
  timecode: initialTimecode = "00:00:35:00",
  duration: durationText = "0:35",
}: CustomVideoStageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [lutMode, setLutMode] = useState<LutMode>("kodak");
  const [showSafeGuides, setShowSafeGuides] = useState(false);
  const [smpteFrame, setSmpteFrame] = useState("00:00:00:00");

  const containerRef = useRef<HTMLDivElement>(null);
  const isVertical = aspectRatio === "9:16";

  // Simulate SMPTE frame counter progression
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 1440;
      const ff = frame % 24;
      const ss = Math.floor(frame / 24) % 60;
      const mm = Math.floor(frame / (24 * 60));
      setSmpteFrame(
        `00:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`
      );
    }, 41); // ~24fps

    return () => clearInterval(interval);
  }, []);

  const getLutFilter = () => {
    switch (lutMode) {
      case "s-log":
        return "grayscale(35%) contrast(80%) brightness(110%)";
      case "teal-orange":
        return "contrast(110%) saturate(120%) hue-rotate(-5deg)";
      case "mono":
        return "grayscale(100%) contrast(120%)";
      case "kodak":
      default:
        return "none";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex flex-col items-center select-none",
        isVertical ? "max-w-[320px] sm:max-w-[340px] xl:max-w-[360px] mx-auto" : "max-w-full"
      )}
    >
      {/* TOP STUDIO TOOLBAR (LUT, Guides, Timecode) */}
      <div className="w-full flex items-center justify-between gap-1.5 mb-2 px-1 text-[10px] font-mono">
        <div className="flex items-center gap-1 flex-wrap">
          {/* LUT PROFILE SELECTOR */}
          <div className="flex items-center gap-0.5 bg-[#121216] p-0.5 rounded-sm border border-white/[0.07]">
            <span className="text-white/40 px-1 text-[8px] sm:text-[9px]">LUT:</span>
            {(["kodak", "teal-orange", "s-log", "mono"] as LutMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLutMode(mode)}
                className={cn(
                  "px-1.5 sm:px-2 py-0.5 rounded-sm uppercase tracking-wider text-[8px] sm:text-[9px] transition-all",
                  lutMode === mode
                    ? "bg-[#D4AF37] text-[#09090B] font-bold"
                    : "text-white/50 hover:text-white"
                )}
              >
                {mode === "teal-orange" ? "CINE" : mode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Safe Zone Grid Toggle */}
          <button
            type="button"
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            className={cn(
              "px-1.5 py-0.5 rounded-sm border text-[8px] sm:text-[9px] flex items-center gap-1 transition-all",
              showSafeGuides
                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                : "bg-[#121216] border-white/[0.07] text-white/50 hover:text-white"
            )}
            title="Action Safe Guides"
          >
            <Grid className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">GUIDES</span>
          </button>
        </div>

        {/* Live SMPTE Timecode */}
        <div className="flex items-center gap-1.5 bg-[#121216] px-2 py-0.5 rounded-sm border border-white/[0.07] text-white/90 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/40 hidden sm:inline text-[9px]">TC:</span>
          <span className="text-[#D4AF37] font-semibold text-[9px] sm:text-[10px]">{smpteFrame}</span>
        </div>
      </div>

      {/* MAIN SCREEN CANVAS */}
      <div
        className={cn(
          "relative overflow-hidden bg-black border border-white/[0.08] shadow-2xl transition-all duration-300 w-full",
          isVertical
            ? "aspect-[9/16] rounded-t-xl"
            : "aspect-video rounded-t-xl"
        )}
      >
        {/* VIDEO CONTENT LAYER */}
        <div
          className="w-full h-full relative"
          style={{ filter: getLutFilter() }}
        >
          {youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&playsinline=1`}
              title={title}
              className="w-full h-full border-0 absolute inset-0 object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={videoSrc}
              poster={thumbnail}
              playsInline
              autoPlay
              muted
              loop
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* PRO SAFE ZONE GUIDES OVERLAY (Action & Title Safe) */}
        {showSafeGuides && (
          <div className="absolute inset-0 pointer-events-none border border-[#D4AF37]/30 m-3 sm:m-4 flex flex-col justify-between p-2 z-20">
            <div className="flex justify-between text-[8px] font-mono text-[#D4AF37]/70">
              <span>90% ACTION SAFE</span>
              <span>80% TITLE SAFE</span>
            </div>
            <div className="border border-dashed border-[#D4AF37]/20 m-2 flex-1 flex items-center justify-center">
              <span className="text-[#D4AF37]/40 font-mono text-xs">+</span>
            </div>
            <div className="text-[8px] font-mono text-[#D4AF37]/70 text-right">
              CENTERED
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SLIM TIMECODE & STATUS BAR (36px height max) */}
      <div className="w-full h-8 max-h-[36px] bg-[#121216] border border-white/[0.08] border-t-0 rounded-b-xl px-3 flex items-center justify-between text-[10px] font-mono text-white/60">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-white/80 font-medium truncate uppercase text-[9px] sm:text-[10px]">{title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#D4AF37] font-semibold tracking-wider font-mono text-[9px] sm:text-[10px]">
            {isVertical ? "9:16 REEL" : "4K UHD"}
          </span>
          <span className="px-1.5 py-0.5 rounded-sm bg-white/[0.06] text-white/70 text-[9px] hidden sm:inline">
            {isVertical ? "4K 60FPS" : "4K"}
          </span>
        </div>
      </div>
    </div>
  );
}
