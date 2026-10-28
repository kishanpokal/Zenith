"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site-config";
import { extractYouTubeId } from "@/data/projects";
import { Play, ArrowDown, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { SplitTextReveal } from "@/components/animations/scroll-reveal";

interface HeroSectionProps {
  onOpenShowreelModal?: () => void;
  featuredThumbnail?: string;
  featuredTitle?: string;
  videoUrl?: string;
  headline?: string;
  headlineHighlight?: string;
  subheadline?: string;
}

export function HeroSection({
  onOpenShowreelModal,
  featuredThumbnail,
  featuredTitle,
  videoUrl,
  headline = "WE EDIT FOR",
  headlineHighlight = "RETENTION.",
  subheadline = "High-impact commercial and creator post-production engineered for ruthless retention. Surgical cut pacing, 12-track Foley sound design, and razor-sharp kinetic typography.",
}: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeVideoUrl =
    videoUrl || siteConfig.brand.heroReelVideoUrl || "https://youtube.com/shorts/m7DlpUFC5cs";
  const youtubeId = extractYouTubeId(activeVideoUrl) || "m7DlpUFC5cs";
  const isDirectMp4 = activeVideoUrl && (activeVideoUrl.endsWith(".mp4") || activeVideoUrl.includes(".mp4?"));

  // Subtle 3D tilt physics for the stage mockup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 120, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const reelRotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4]);
  const reelRotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: nextMuted ? "mute" : "unMute",
          args: [],
        }),
        "*"
      );
    }
  };

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("work");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col justify-center overflow-hidden bg-[#09090B] pt-28 sm:pt-36 pb-16 sm:pb-24 border-b border-white/[0.07]"
      id="top"
      aria-label="Zenith Studio Hero"
    >
      {/* Architectural Editorial Grid Lines */}
      <div className="absolute inset-0 bg-editorial-grid pointer-events-none opacity-60" />

      {/* Subtle Warm Amber ambient vignette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Top Monospace Metadata Hairline Bar */}
        <div className="mb-10 pb-4 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F4F4F6]">
              ZENITH EDITORIAL ARCHITECTURE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] tracking-wider text-white/40">
            <span>INDEX 01 // SHOWCASE</span>
            <span>·</span>
            <span>COLOR GRADED KODAK 2383</span>
            <span>·</span>
            <span className="text-[#D4AF37]">4K PRORES 422</span>
          </div>
        </div>

        {/* 2-Column Hero Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Kinetic Typography & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-[#F4F4F6] select-none text-display-xl">
              <SplitTextReveal
                lines={[headline, headlineHighlight]}
                lineClassName="text-[#F4F4F6]"
                delay={0.1}
                stagger={0.08}
              />
            </h1>

            <p className="mt-8 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed font-sans font-normal">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenShowreelModal}
                className="text-xs tracking-widest uppercase font-semibold flex items-center gap-3 px-7 py-3.5 rounded-sm bg-[#D4AF37] text-[#09090B] hover:bg-[#F59E0B] transition-all duration-200 shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                data-cursor="play"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Showreel</span>
              </button>

              <a
                href="#work"
                onClick={scrollToWork}
                className="text-xs tracking-widest uppercase font-medium flex items-center gap-2.5 px-6 py-3.5 rounded-sm border border-white/[0.08] bg-[#121216] text-[#F4F4F6] hover:bg-[#18181E] hover:border-white/[0.18] transition-all duration-200"
              >
                <span>Selected Work</span>
                <ArrowDown className="w-3.5 h-3.5 text-white/50" />
              </a>
            </div>

            {/* Technical Metadata Row */}
            <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-white/50">
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>FRAME-ACCURATE TIMING</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>MULTI-TRACK SOUND DESIGN</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>COLOR HARMONY</span>
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Showreel Preview Stage */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <motion.div
              style={{
                rotateX: reelRotateX,
                rotateY: reelRotateY,
                transformPerspective: 1200,
              }}
              onClick={onOpenShowreelModal}
              className="relative z-10 w-[280px] sm:w-[320px] aspect-[9/16] rounded-2xl p-2 bg-[#121216] border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] cursor-pointer group select-none transition-all duration-300 hover:border-[#D4AF37]/50"
              role="button"
              tabIndex={0}
              aria-label="Zenith Featured Reel preview — click to play"
              data-cursor="play"
            >
              {/* Inner Video Container */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
                  {isDirectMp4 ? (
                    <video
                      src={activeVideoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <iframe
                      ref={iframeRef}
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
                      title="Zenith Featured Reel"
                      className="w-full h-full object-cover scale-[1.32] pointer-events-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  )}
                </div>

                {/* Editorial Vignette & Hairline Frame */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[10px] font-mono text-white/90 z-20 pointer-events-none">
                  <span className="flex items-center gap-1.5 font-bold bg-[#09090B]/80 px-2.5 py-1 rounded-sm border border-white/[0.08]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    REC · 4K 60
                  </span>
                  <span className="bg-[#09090B]/80 px-2.5 py-1 rounded-sm border border-white/[0.08] text-[#D4AF37] font-semibold">
                    REEL 01
                  </span>
                </div>

                {/* Bottom Sound / Expand Pill */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20">
                  <button
                    type="button"
                    onClick={toggleSound}
                    className="px-2.5 py-1 rounded-sm bg-[#09090B]/85 border border-white/[0.08] text-white/90 text-[10px] font-mono flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3 h-3 text-white/50" />
                        <span>Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-[#D4AF37] font-semibold">Sound On</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#D4AF37] bg-[#09090B]/85 px-2 py-1 rounded-sm border border-white/[0.08]">
                    <span>[ EXPAND ]</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
