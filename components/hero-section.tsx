"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site-config";
import { extractYouTubeId } from "@/data/projects";
import { Play, Volume2, VolumeX, ArrowDown, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onOpenShowreelModal?: () => void;
  featuredThumbnail?: string;
  featuredTitle?: string;
  videoUrl?: string;
}

export function HeroSection({
  onOpenShowreelModal,
  featuredThumbnail,
  featuredTitle,
  videoUrl,
}: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeVideoUrl =
    videoUrl || siteConfig.brand.heroReelVideoUrl || "https://youtube.com/shorts/m7DlpUFC5cs";
  const youtubeId = extractYouTubeId(activeVideoUrl) || "m7DlpUFC5cs";
  const isDirectMp4 = activeVideoUrl && (activeVideoUrl.endsWith(".mp4") || activeVideoUrl.includes(".mp4?"));

  // 3D Mouse Parallax & Physics Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 140, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const reelRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const reelRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

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
      className="relative flex flex-col justify-center overflow-hidden bg-[#050505] pt-28 sm:pt-32 pb-8 sm:pb-10"
      id="top"
      aria-label="Zenith Studio Hero"
    >
      {/* Deluxe Ambient Lighting: Subtle soft radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(215,255,100,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center">
        
        {/* Status Eyebrow */}
        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D7FF64] shadow-[0_0_12px_#D7FF64] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/80">
              ZENITH EDITS · ACCEPTING SELECT CREATORS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 font-mono text-xs tracking-wider text-white/40">
            <span>HIGH-RETENTION POST-PRODUCTION</span>
            <span>·</span>
            <span>4K PRORES NATIVE</span>
          </div>
        </div>

        {/* 2-Column Luxury Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Monumental Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <h1 className="text-white select-none">
              <span className="block font-outfit font-black text-5xl sm:text-7xl md:text-8xl lg:text-[92px] leading-[0.92] tracking-[-0.04em] uppercase">
                WE EDIT FOR
              </span>
              <span className="block font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl lg:text-[104px] text-[#D7FF64] leading-[0.94] tracking-[-0.02em] mt-1">
                retention.
              </span>
            </h1>

            {/* Clean, punchy 1-sentence value statement — zero clutter */}
            <p className="mt-8 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed font-sans font-light">
              High-impact short-form post-production engineered for visionary creators and modern brands.
              Surgical pacing, multi-track Foley sound design, and visuals that hold attention to the last frame.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenShowreelModal}
                className="text-xs sm:text-sm tracking-widest uppercase font-bold flex items-center gap-3 px-8 py-4 rounded-full bg-[#D7FF64] text-[#050505] hover:bg-[#e6ff8f] transition-all duration-300 shadow-[0_0_35px_rgba(215,255,100,0.35)] hover:scale-[1.03] active:scale-[0.98] group"
                data-cursor="play"
              >
                <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-125" />
                <span>Watch Showreel</span>
              </button>

              <a
                href="#work"
                onClick={scrollToWork}
                className="text-xs sm:text-sm tracking-widest uppercase font-semibold flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 backdrop-blur-md"
              >
                <span>Explore Work</span>
                <ArrowDown className="w-4 h-4 text-white/60" />
              </a>
            </div>

            {/* Studio Production Standards */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-white/50">
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
                <span>SURGICAL PACING</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
                <span>MULTI-TRACK FOLEY</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
                <span>COLOR GRADE 2383</span>
              </span>
            </div>

          </div>

          {/* Right Column: 3D Floating Phone Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Subtle Backlight Glow */}
            <div className="absolute w-[340px] h-[480px] bg-[#D7FF64]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* 3D Tilted Phone Frame */}
            <motion.div
              style={{
                rotateX: reelRotateX,
                rotateY: reelRotateY,
                transformPerspective: 1200,
              }}
              onClick={toggleSound}
              className="relative z-10 w-[270px] sm:w-[310px] aspect-[9/16] rounded-[44px] p-2.5 bg-gradient-to-b from-white/20 via-white/5 to-white/10 border border-white/20 shadow-[0_25px_80px_-10px_rgba(0,0,0,0.95)] cursor-pointer group select-none ring-1 ring-white/10 transition-transform duration-300"
              role="region"
              aria-label="Zenith Featured Reel preview"
            >
              {/* Inner Screen */}
              <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black">
                
                {/* Video Layer */}
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

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between text-[10px] font-mono text-white/90 z-20 pointer-events-none">
                  <span className="flex items-center gap-1.5 font-bold bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    REC · 4K 60
                  </span>
                  <span className="bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 text-[#D7FF64] font-bold">
                    REEL 01
                  </span>
                </div>

                {/* Sound Toggle Pill */}
                <div className="absolute bottom-5 inset-x-5 flex items-center justify-between z-20 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono flex items-center gap-2 pointer-events-auto">
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-white/50" />
                        <span className="text-[11px]">Click for sound</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#D7FF64]" />
                        <span className="text-[11px] text-[#D7FF64] font-bold">Audio live</span>
                      </>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-white/40 bg-black/60 px-2 py-1 rounded-md border border-white/10">
                    48kHz
                  </span>
                </div>

              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
