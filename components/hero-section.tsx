"use client";

import React, { useRef } from "react";
import { siteConfig } from "@/data/site-config";
import { extractYouTubeId } from "@/data/projects";
import { Play, ArrowDown, Sparkles } from "lucide-react";
import { SplitTextReveal } from "@/components/animations/scroll-reveal";
import { CustomVideoStage } from "@/components/cinema-player/custom-video-stage";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onOpenShowreelModal?: () => void;
  featuredThumbnail?: string;
  featuredTitle?: string;
  videoUrl?: string;
  headline?: string;
  headlineHighlight?: string;
  subheadline?: string;
  aspectRatio?: "9:16" | "16:9";
}

export function HeroSection({
  onOpenShowreelModal,
  featuredThumbnail,
  featuredTitle = "Motion-1",
  videoUrl,
  headline = "WE EDIT FOR",
  headlineHighlight = "RETENTION.",
  subheadline = "High-impact video editing for creators and brands. Fast cuts, clean sound, and motion graphics that keep viewers watching.",
  aspectRatio = "9:16",
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  const activeVideoUrl =
    videoUrl || siteConfig.brand.heroReelVideoUrl || "https://youtube.com/shorts/ASX9EFdHez0";
  const youtubeId = extractYouTubeId(activeVideoUrl) || "ASX9EFdHez0";
  const isDirectMp4 = activeVideoUrl && (activeVideoUrl.endsWith(".mp4") || activeVideoUrl.includes(".mp4?"));
  const isVertical = aspectRatio === "9:16";

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("work");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col justify-center overflow-hidden bg-[#09090B] pt-24 lg:pt-28 pb-14 sm:pb-20 min-h-[calc(100dvh-4rem)] border-b border-white/[0.07]"
      id="top"
      aria-label="Zenith Studio Hero"
    >
      {/* Architectural Editorial Grid Lines */}
      <div className="absolute inset-0 bg-editorial-grid pointer-events-none opacity-60" />

      {/* Subtle Warm Amber ambient vignette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="relative z-10 w-full container-editorial my-auto">
        {/* Dynamic Hero Layout: 9:16 Vertical Reel vs. 16:9 Widescreen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center">
          {/* Left Column: Kinetic Typography & Value Proposition (7 Cols for Reel, 5 for Widescreen) */}
          <div className={cn(isVertical ? "lg:col-span-7" : "lg:col-span-5", "flex flex-col justify-center")}>
            {/* Editorial Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#121216] border border-white/[0.07] mb-4 sm:mb-5 self-start shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="type-timecode text-[#F4F4F6] text-[10px]">
                VIDEO EDITING STUDIO
              </span>
            </div>

            <h1 className="text-[#F4F4F6] select-none text-[clamp(2.1rem,3.6vw,4.25rem)] font-display font-bold uppercase tracking-tight leading-[0.98]">
              <SplitTextReveal
                lines={[headline, headlineHighlight]}
                lineClassName="text-[#F4F4F6]"
                delay={0.1}
                stagger={0.08}
              />
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/70 max-w-lg font-sans leading-relaxed">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onOpenShowreelModal}
                className="text-xs tracking-widest uppercase font-semibold flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#D4AF37] text-[#09090B] hover:bg-[#F59E0B] transition-all duration-200 shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
                data-cursor="play"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isVertical ? "Watch Featured Reel" : "Watch Showreel"}</span>
              </button>

              <a
                href="#work"
                onClick={scrollToWork}
                className="text-xs tracking-widest uppercase font-medium flex items-center gap-2 px-5 py-3.5 rounded-sm border border-white/[0.08] bg-[#121216] text-[#F4F4F6] hover:bg-[#18181E] hover:border-white/[0.18] transition-all duration-200 min-h-[44px]"
              >
                <span>Selected Work</span>
                <ArrowDown className="w-3.5 h-3.5 text-white/50" />
              </a>
            </div>

            {/* Technical Metadata Row */}
            <div className="mt-6 sm:mt-8 pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-x-4 gap-y-2 type-timecode text-white/50 text-[10px]">
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>FAST PACING</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>PRO SOUND</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>CLEAN COLOR</span>
              </span>
              <span className="text-white/20">/</span>
              <span className="text-[#D4AF37]/90">
                <span>4K QUALITY</span>
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Reel / Showreel Preview Stage */}
          <div className={cn(isVertical ? "lg:col-span-5" : "lg:col-span-7", "flex flex-col items-center justify-center relative w-full mt-4 lg:mt-0")}>
            <div className={cn("w-full mx-auto relative", isVertical ? "max-w-[320px] sm:max-w-[340px] xl:max-w-[360px]" : "max-w-2xl")}>
              {/* Subtle gold backlight glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent rounded-2xl blur-xl opacity-60 pointer-events-none" />

              <div className="shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] relative">
                <CustomVideoStage
                  youtubeId={youtubeId}
                  videoSrc={isDirectMp4 ? activeVideoUrl : undefined}
                  thumbnail={featuredThumbnail || "/images/projects/project-1.svg"}
                  title={featuredTitle}
                  aspectRatio={aspectRatio}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
