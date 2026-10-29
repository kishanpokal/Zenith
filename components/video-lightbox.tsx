"use client";

import React, { useEffect } from "react";
import { Project } from "@/data/projects";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Music,
  Scissors,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { CustomVideoStage } from "@/components/cinema-player/custom-video-stage";
import { cn } from "@/lib/utils";

interface VideoLightboxProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function VideoLightbox({ project, onClose, onNext, onPrev }: VideoLightboxProps) {
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  const isVertical = project.aspectRatio === "9:16";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Project playback: ${project.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09090B]/95 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      {/* Pinned High-Contrast [ ✕ CLOSE ] button inside top-right safe area */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2">
        {onPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#121216]/90 hover:bg-[#18181E] border border-white/20 text-white flex items-center justify-center transition-all shadow-xl"
            title="Previous project (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#121216]/90 hover:bg-[#18181E] border border-white/20 text-white flex items-center justify-center transition-all shadow-xl"
            title="Next project (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="h-11 min-w-[44px] min-h-[44px] px-3.5 rounded-full bg-[#121216] hover:bg-[#D4AF37] border border-[#D4AF37]/50 text-[#D4AF37] hover:text-[#09090B] font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xl cursor-pointer"
          title="Close viewer (ESC)"
          aria-label="Close video player"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">CLOSE</span>
        </button>
      </div>

      {/* Adaptive Video Container: Centered 16:9 widescreen or 80dvh 9:16 vertical reel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative transition-all duration-300 my-auto",
          isVertical
            ? "aspect-[9/16] h-[80dvh] max-h-[780px] w-auto mx-auto flex flex-col justify-center"
            : "w-full max-w-5xl aspect-video px-2 sm:px-6"
        )}
      >
        <div className="bg-[#121216] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4">
          <CustomVideoStage
            youtubeId={project.youtubeId}
            videoSrc={project.videoSrc}
            thumbnail={project.thumbnail}
            title={project.title}
            aspectRatio={project.aspectRatio}
            timecode={project.timecode}
            duration={project.duration}
          />
        </div>
      </div>
    </div>
  );
}
