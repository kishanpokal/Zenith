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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-[#09090B]/95 backdrop-blur-xl animate-in fade-in duration-200 select-none h-[100dvh] max-h-[100dvh]"
      onClick={onClose}
    >
      {/* Main Cinema Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${
          isVertical ? "max-w-4xl" : "max-w-6xl"
        } max-h-[96dvh] bg-[#121216] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row`}
      >
        {/* Top Close Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className="w-10 h-10 sm:w-8 sm:h-8 min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 rounded-sm bg-[#09090B]/85 hover:bg-[#18181E] border border-white/[0.12] text-white flex items-center justify-center transition-colors"
              title="Previous project (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="w-10 h-10 sm:w-8 sm:h-8 min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 rounded-sm bg-[#09090B]/85 hover:bg-[#18181E] border border-white/[0.12] text-white flex items-center justify-center transition-colors"
              title="Next project (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 rounded-sm bg-[#09090B]/90 hover:bg-[#18181E] border border-white/[0.15] text-[#D4AF37] sm:text-white flex items-center justify-center transition-colors shadow-lg"
            title="Close viewer (ESC)"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Video Player Column */}
        <div
          className={`w-full ${
            isVertical ? "lg:w-5/12 p-2 sm:p-4" : "lg:w-7/12 p-3 sm:p-6"
          } bg-[#09090B] flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-white/[0.08] overflow-hidden`}
        >
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

        {/* Project Breakdown Details Column */}
        <div
          className={`w-full ${
            isVertical ? "lg:w-7/12" : "lg:w-5/12"
          } p-6 sm:p-8 overflow-y-auto max-h-[50vh] lg:max-h-[92vh] flex flex-col justify-between`}
        >
          <div>
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-[10px] font-mono text-white/70">
                {project.aspectRatio} · {project.duration}
              </span>
              <span className="px-2.5 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.07] text-[10px] font-mono text-white/50">
                STUDIO MASTER
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight mb-2">
              {project.title}
            </h2>

            {project.clientContext && (
              <div className="text-xs font-mono text-white/50 mb-4">
                Client / Brand: <strong className="text-white/90">{project.clientContext}</strong>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6 font-sans">
                {project.description}
              </p>
            )}

            {/* Editing Craft Breakdown */}
            {project.editBreakdown && project.editBreakdown.length > 0 && (
              <div className="space-y-2.5 mb-6">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Editorial Retention Breakdown</span>
                </div>

                <div className="space-y-1.5">
                  {project.editBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/80 bg-[#09090B]/60 p-2.5 rounded-sm border border-white/[0.06]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sound & Pacing Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              <div className="bg-[#09090B]/60 p-3 rounded-sm border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40 uppercase mb-1">
                  <Music className="w-3 h-3 text-[#D4AF37]" />
                  <span>Sound Design</span>
                </div>
                <div className="text-xs text-white/80 leading-snug font-sans">
                  {project.soundDesignNotes || "Multi-track Foley sound architecture"}
                </div>
              </div>

              <div className="bg-[#09090B]/60 p-3 rounded-sm border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40 uppercase mb-1">
                  <Layers className="w-3 h-3 text-[#D4AF37]" />
                  <span>Pacing Cadence</span>
                </div>
                <div className="text-xs text-white/80 leading-snug font-sans">
                  {project.pacingStyle || "1.0s avg cut duration / High velocity"}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action in modal */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-[10px] font-mono text-white/40">
              COMMERCIAL & CREATOR POST-PRODUCTION
            </div>
            <a
              href="#contact"
              onClick={() => {
                onClose();
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Inquire for Similar Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
