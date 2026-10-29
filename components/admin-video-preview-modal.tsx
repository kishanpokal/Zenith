"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/data/projects";
import {
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Edit3,
  Copy,
  Check,
  Film,
  Clock,
  Music,
  Scissors,
  Sparkles,
  Layers,
  Smartphone,
  Monitor,
} from "lucide-react";

interface AdminVideoPreviewModalProps {
  project: Project | null;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onTogglePublish?: (project: Project) => void;
}

export function AdminVideoPreviewModal({
  project,
  onClose,
  onEdit,
  onTogglePublish,
}: AdminVideoPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const isVertical = project.aspectRatio === "9:16";
  const youtubeUrl = project.youtubeId
    ? `https://www.youtube.com/watch?v=${project.youtubeId}`
    : project.videoSrc;

  const handleCopyLink = () => {
    if (youtubeUrl) {
      navigator.clipboard.writeText(youtubeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-[#121216] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <header className="px-5 py-4 border-b border-white/[0.08] bg-[#09090B]/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight truncate">
                  {project.title}
                </h2>
                <span className="px-2 py-0.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-[9px] font-mono text-[#D4AF37] uppercase">
                  {project.category}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-[9px] font-mono text-white/50 uppercase">
                  {isVertical ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  <span>{project.aspectRatio}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase font-semibold ${
                    project.published !== false
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                  }`}
                >
                  {project.published !== false ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live on Website</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-2.5 h-2.5" />
                      <span>Draft (Admin Only)</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onTogglePublish && (
              <button
                type="button"
                onClick={() => onTogglePublish(project)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase transition-colors border ${
                  project.published !== false
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                }`}
                title="Toggle public visibility"
              >
                {project.published !== false ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide from Public</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Make Public</span>
                  </>
                )}
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#09090B] border border-white/[0.08] hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] text-xs font-mono uppercase transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white/70 hover:text-white text-xs font-mono uppercase transition-colors"
                title="Open directly on YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-sm bg-[#09090B] hover:bg-[#D4AF37] border border-white/[0.08] hover:border-[#D4AF37] text-white/70 hover:text-[#09090B] text-xs font-mono font-bold uppercase transition-all flex items-center gap-1"
              title="Close modal (ESC)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </header>

        {/* MODAL BODY (STUDIO WORKSPACE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* VIDEO MONITOR STAGE (Left Column: 7 or 8 cols for landscape, 6 for portrait) */}
          <div
            className={`w-full flex flex-col items-center justify-center ${
              isVertical ? "lg:col-span-6 xl:col-span-5" : "lg:col-span-8"
            }`}
          >
            <div
              className={`relative w-full rounded-xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl flex items-center justify-center ${
                isVertical
                  ? "aspect-[9/16] max-h-[72vh] max-w-[390px] mx-auto ring-1 ring-white/[0.08]"
                  : "aspect-video w-full"
              }`}
            >
              {project.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : project.videoSrc ? (
                <video
                  src={project.videoSrc}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8 text-white/40 font-mono text-xs">
                  No video source available for this project.
                </div>
              )}
            </div>

            {/* Quick playback info caption below player */}
            <div className="mt-3 flex items-center justify-between w-full max-w-[390px] px-1 text-[11px] font-mono text-white/40">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>STUDIO BROADCAST MONITOR</span>
              </span>
              <span>{project.duration || "0:30"}</span>
            </div>
          </div>

          {/* INSPECTOR & METADATA SUITE (Right Column) */}
          <div
            className={`w-full space-y-4 ${
              isVertical ? "lg:col-span-6 xl:col-span-7" : "lg:col-span-4"
            }`}
          >
            {/* Visibility Callout Card */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                project.published !== false
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {project.published !== false ? (
                  <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider">
                    {project.published !== false ? "Visible to Public" : "Draft / Private Cut"}
                  </p>
                  <p className="text-[11px] text-white/60 font-sans mt-0.5">
                    {project.published !== false
                      ? "Currently displayed on the live portfolio grid."
                      : "Hidden from live visitors. Only visible to you in this admin console."}
                  </p>
                </div>
              </div>

              {onTogglePublish && (
                <button
                  type="button"
                  onClick={() => onTogglePublish(project)}
                  className="px-3 py-1.5 rounded-sm bg-[#09090B] border border-white/[0.1] text-xs font-mono uppercase text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors shrink-0"
                >
                  {project.published !== false ? "Unpublish" : "Publish"}
                </button>
              )}
            </div>

            {/* Project Specs Card */}
            <div className="p-4 rounded-xl bg-[#09090B]/60 border border-white/[0.08] space-y-3">
              <h4 className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Technical Specifications</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Client / Channel</span>
                  <span className="text-white font-semibold">{project.clientContext || "Zenith Studio"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Duration</span>
                  <span className="text-white font-semibold">{project.duration || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Format</span>
                  <span className="text-white font-semibold">{project.aspectRatio === "9:16" ? "9:16 Vertical Reel" : "16:9 Landscape"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Home Featured</span>
                  <span className="text-white font-semibold">{project.featured ? "★ Yes (Showcase)" : "No"}</span>
                </div>
              </div>

              {project.metrics && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] text-white/40 uppercase block font-mono">Specs Tag</span>
                  <span className="text-xs font-mono text-[#D4AF37]">{project.metrics}</span>
                </div>
              )}
            </div>

            {/* Editorial Breakdown Highlights */}
            {project.editBreakdown && project.editBreakdown.length > 0 && (
              <div className="p-4 rounded-xl bg-[#09090B]/60 border border-white/[0.08] space-y-2.5">
                <h4 className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Scissors className="w-3 h-3" />
                  <span>Editorial Highlights & Notes</span>
                </h4>
                <ul className="space-y-1.5 text-xs font-sans text-white/70">
                  {project.editBreakdown.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overview / Editorial Description */}
            {project.description && (
              <div className="p-4 rounded-xl bg-[#09090B]/60 border border-white/[0.08] space-y-2">
                <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#D4AF37]" />
                  <span>Cut Overview</span>
                </h4>
                <p className="text-xs font-sans text-white/70 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Quick Actions Footer Bar */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 rounded-sm bg-[#09090B] border border-white/[0.08] hover:border-[#D4AF37]/50 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white/60" />
                    <span>Copy Video URL</span>
                  </>
                )}
              </button>

              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(project);
                  }}
                  className="py-2 px-4 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Cut</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
