"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Project, getYouTubeEmbedUrl } from "@/data/projects";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Layers,
  Sparkles,
  Scissors,
  Music,
  ExternalLink,
  Flame,
  Clock,
  Share2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomVideoStage } from "@/components/cinema-player/custom-video-stage";

interface VideoLightboxProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function VideoLightbox({ project, onClose, onNext, onPrev }: VideoLightboxProps) {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isRawGrade, setIsRawGrade] = useState(false); // Before/After LUT Grade Toggle
  const [activeChapter, setActiveChapter] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Timeline retention chapters
  const chapters = [
    { label: "The 3s Hook", time: "00:00", seconds: 0 },
    { label: "Pattern Interrupt", time: "00:08", seconds: 8 },
    { label: "Kinetic Montage", time: "00:18", seconds: 18 },
    { label: "Climax & Payoff", time: "00:28", seconds: 28 },
  ];

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Lock background scroll & handle pro editor hotkeys (J-K-L, Space, M, B, Esc)
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
      if (e.key === "b" || e.key === "B") {
        setIsRawGrade((prev) => !prev);
      }
      if (e.key === "j" || e.key === "J") {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
        }
      }
      if (e.key === "l" || e.key === "L") {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(videoRef.current.duration || 100, videoRef.current.currentTime + 5);
        }
      }
      if (e.key === "k" || e.key === "K") {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, onNext, onPrev, togglePlay, toggleMute]);

  if (!project) return null;

  const isYouTube = project.videoType === "youtube" || !!project.youtubeId;
  const isVertical = project.aspectRatio === "9:16";

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
      // Update chapter highlighting
      if (cur >= 28) setActiveChapter(3);
      else if (cur >= 18) setActiveChapter(2);
      else if (cur >= 8) setActiveChapter(1);
      else setActiveChapter(0);
    }
  };

  const jumpToChapter = (seconds: number, index: number) => {
    setActiveChapter(index);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Project playback: ${project.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Ambient Backlight matching project */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] rounded-full blur-[140px] transition-all duration-700"
          style={{
            backgroundImage: `radial-gradient(circle, #D7FF64 0%, #38bdf8 45%, transparent 75%)`,
          }}
        />
      </div>

      {/* Main Cinema Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${
          isVertical ? "max-w-4xl" : "max-w-6xl"
        } max-h-[92vh] bg-[#070B14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row`}
      >
        {/* Navigation & Close Top Controls */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous edit"
              className="p-2.5 rounded-full bg-black/70 hover:bg-white/15 border border-white/15 text-white/90 hover:text-[#D7FF64] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Next edit"
              className="p-2.5 rounded-full bg-black/70 hover:bg-white/15 border border-white/15 text-white/90 hover:text-[#D7FF64] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cinema player"
            className="p-2.5 rounded-full bg-black/70 hover:bg-white/15 border border-white/15 text-white/90 hover:text-[#D7FF64] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Column */}
        <div
          className={`w-full ${
            isVertical ? "lg:w-5/12" : "lg:w-7/12"
          } bg-black/90 flex flex-col items-center justify-center relative p-3 sm:p-5 border-b lg:border-b-0 lg:border-r border-white/10`}
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
              <span className="px-2.5 py-1 rounded bg-[#D7FF64]/10 border border-[#D7FF64]/20 text-[11px] font-mono font-bold text-[#D7FF64] uppercase">
                {project.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-[#94A3B8]">
                {project.aspectRatio} · {project.duration}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-[#D7FF64] font-semibold">
                STUDIO MASTER
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2 font-sans">
              {project.title}
            </h2>

            <div className="text-xs font-mono text-[#94A3B8] mb-4">
              Creator / Client: <strong className="text-white">{project.clientContext}</strong>
            </div>

            {/* Editorial Overview */}
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Sound Architecture Stems */}
            <div className="mb-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#D7FF64] flex items-center gap-2 mb-2">
                <Music className="w-3.5 h-3.5" />
                <span>Audio Architecture Stems</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/90">
                  Voice EQ: Clean -18dB Duck
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/90">
                  SFX: 12 Layered Foley
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/90">
                  Sub-Bass Riser Impact
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/90">
                  Vinyl Tape Stop
                </span>
              </div>
            </div>

            {/* Editing Craft Breakdown */}
            {project.editBreakdown && project.editBreakdown.length > 0 && (
              <div className="space-y-3 mb-6">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#D7FF64] flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Editorial Retention Craft</span>
                </div>

                <div className="space-y-2">
                  {project.editBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-[#E2E8F0] bg-[#0E1626] p-2.5 rounded-xl border border-white/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D7FF64] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sound & Pacing Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-[#0E1626] p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#94A3B8] uppercase mb-1">
                  <Music className="w-3 h-3 text-[#D7FF64]" />
                  <span>Sound Design</span>
                </div>
                <div className="text-xs text-white leading-snug">
                  {project.soundDesignNotes || "Layered cinematic audio with impact transients"}
                </div>
              </div>

              <div className="bg-[#0E1626] p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#94A3B8] uppercase mb-1">
                  <Layers className="w-3 h-3 text-[#D7FF64]" />
                  <span>Pacing Cadence</span>
                </div>
                <div className="text-xs text-white leading-snug">
                  {project.pacingStyle || "High-velocity retention cadence"}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action in modal */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-[#94A3B8]">
              Ready for this standard of editing?
            </div>
            <a
              href="#contact"
              onClick={() => {
                onClose();
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2.5 rounded-full bg-[#D7FF64] hover:bg-[#c6f052] text-[#030712] font-black text-xs uppercase tracking-wider text-center transition-all shadow-lg shadow-[#D7FF64]/20"
            >
              Inquire About Similar Edit →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
