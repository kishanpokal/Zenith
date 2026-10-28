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
        isVertical && "max-h-full justify-center"
      )}
    >
      {/* TOP STUDIO TOOLBAR (LUT, Guides, Timecode) */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 px-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* LUT PROFILE SELECTOR */}
          <div className="flex items-center gap-1 bg-[#121216] p-0.5 rounded-sm border border-white/[0.07]">
            <span className="text-white/40 px-1 text-[9px]">LUT:</span>
            {(["kodak", "teal-orange", "s-log", "mono"] as LutMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setLutMode(mode)}
                className={cn(
                  "px-2 py-0.5 rounded-sm uppercase tracking-wider text-[9px] transition-all",
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
              "px-2 py-1 rounded-sm border text-[9px] hidden sm:flex items-center gap-1 transition-all",
              showSafeGuides
                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                : "bg-[#121216] border-white/[0.07] text-white/50 hover:text-white"
            )}
            title="Action Safe Guides"
          >
            <Grid className="w-3 h-3" />
            <span>GUIDES</span>
          </button>
        </div>

        {/* Live SMPTE Timecode */}
        <div className="flex items-center gap-2 bg-[#121216] px-2.5 py-1 rounded-sm border border-white/[0.07] text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/40 hidden sm:inline">TC:</span>
          <span className="text-[#D4AF37] font-semibold">{smpteFrame}</span>
        </div>
      </div>

      {/* MAIN SCREEN CANVAS */}
      <div
        className={cn(
          "relative rounded-xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl transition-all duration-300",
          isVertical
            ? "aspect-[9/16] h-[64dvh] sm:h-[75dvh] max-h-[740px] w-auto max-w-full shrink-0"
            : "w-full max-w-full aspect-[16/9]"
        )}
      >
        {/* VIDEO CONTENT LAYER */}
        <div
          className="w-full h-full relative"
          style={{ filter: getLutFilter() }}
        >
          {youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={title}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={videoSrc}
              poster={thumbnail}
              playsInline
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* PRO SAFE ZONE GUIDES OVERLAY (Action & Title Safe) */}
        {showSafeGuides && (
          <div className="absolute inset-0 pointer-events-none border border-[#D4AF37]/30 m-4 flex flex-col justify-between p-2 z-20">
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
    </div>
  );
}
