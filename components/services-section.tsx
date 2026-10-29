"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Volume2,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSuite {
  number: string;
  title: string;
  highlight: string;
  tagline: string;
  icon: any;
  software: string;
  tags: string[];
  renderPreview: (isHovered: boolean) => React.ReactNode;
}

export function ServicesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const suites: ServiceSuite[] = [
    {
      number: "01",
      title: "Video",
      highlight: "Editing",
      tagline: "Fast cuts, hook structure, and smooth transitions that eliminate all boring pauses.",
      icon: Scissors,
      software: "Premiere / DaVinci",
      tags: ["Fast Pacing", "Hook Structure", "Zero Dead Air", "Smooth Flow"],
      renderPreview: (isHovered) => (
        <div className="space-y-1.5 font-mono text-[9px] w-full">
          <div className="h-6 rounded-sm bg-white/[0.03] border border-white/[0.07] p-1 flex items-center gap-1">
            <span className="text-white/40 font-bold px-1">VIDEO</span>
            <div className={cn("h-full rounded-sm flex-1 flex items-center justify-center font-bold transition-all duration-300", isHovered ? "bg-[#D4AF37] text-[#09090B]" : "bg-[#D4AF37]/20 text-[#D4AF37]")}>
              0.8s HOOK
            </div>
            <div className="h-full rounded-sm bg-white/[0.06] flex-[2] flex items-center justify-center text-white/70">
              FAST CUTS
            </div>
          </div>
          <div className="h-6 rounded-sm bg-white/[0.03] border border-white/[0.07] p-1 flex items-center gap-1">
            <span className="text-white/40 font-bold px-1">AUDIO</span>
            <div className="h-full rounded-sm bg-[#D4AF37]/15 text-[#D4AF37] flex-[1.4] flex items-center justify-center font-semibold">
              VOICE INTRO
            </div>
            <div className="h-full rounded-sm bg-white/[0.06] flex-[2] flex items-center justify-center text-white/60">
              MUSIC & SFX
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "02",
      title: "Captions &",
      highlight: "Motion",
      tagline: "Eye-catching animated subtitles, on-screen callouts, and clean motion graphics.",
      icon: Sparkles,
      software: "After Effects",
      tags: ["Animated Subtitles", "Custom Graphics", "Popups & Icons", "High Retention"],
      renderPreview: (isHovered) => (
        <div className="h-12 rounded-sm bg-white/[0.02] border border-white/[0.07] flex items-center justify-between px-3 font-mono text-[10px]">
          <span className="text-white/60">STYLE:</span>
          <span className={cn("font-semibold uppercase tracking-wider transition-colors", isHovered ? "text-[#D4AF37]" : "text-white")}>
            BOLD ANIMATED CAPTIONS
          </span>
        </div>
      ),
    },
    {
      number: "03",
      title: "Sound",
      highlight: "Design",
      tagline: "Clear voice audio, punchy sound effects (whooshes, pops, impacts), and balanced music.",
      icon: Volume2,
      software: "Pro Audio Mix",
      tags: ["Voice Clean-up", "Sound Effects", "Background Music", "Balanced Levels"],
      renderPreview: () => (
        <div className="flex items-end justify-center gap-1 h-12 px-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 rounded-t-sm bg-[#D4AF37]"
              style={{
                height: `${Math.abs(Math.sin(i * 0.4) * 80 + 20)}%`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      ),
    },
    {
      number: "04",
      title: "Color",
      highlight: "Grading",
      tagline: "Rich, cinematic color adjustments that make your camera footage look vibrant and professional.",
      icon: Palette,
      software: "DaVinci Resolve",
      tags: ["Cinematic Grade", "Vibrant Colors", "Skin Tone Fix", "4K Export"],
      renderPreview: (isHovered) => (
        <div className="h-12 rounded-sm bg-white/[0.02] border border-white/[0.07] flex items-center justify-between px-3 font-mono text-[10px]">
          <div className="text-center flex-1">
            <span className="text-white/40 block text-[8px]">RAW</span>
            <span className="text-white/70 font-semibold">FLAT CAMERA</span>
          </div>
          <div className={cn("text-xs font-bold px-2 transition-colors", isHovered ? "text-[#D4AF37]" : "text-white/30")}>
            →
          </div>
          <div className="text-center flex-1">
            <span className="text-[#D4AF37] block text-[8px] font-semibold">FINAL</span>
            <span className="text-white font-semibold">CINEMATIC GRADE</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#09090B] relative overflow-hidden border-b border-white/[0.07]" id="services">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>SERVICES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]">
              WHAT WE <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                do.
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/70 font-sans max-w-md leading-relaxed md:text-right">
            Everything you need to turn raw video files into polished, high-performing content.
          </p>
        </div>

        {/* 4 SUITE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suites.map((suite, idx) => {
            const Icon = suite.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={suite.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group p-6 sm:p-8 rounded-xl bg-[#121216] border border-white/[0.07] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                <div>
                  {/* Top Bar: Number & Suite Tool */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                      {suite.number} {"//"} SUITE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-sm bg-[#09090B] border border-white/[0.07] text-[10px] font-mono text-white/50">
                      {suite.software}
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-sm bg-[#09090B] text-[#D4AF37] border border-white/[0.07] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#09090B] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#F4F4F6] uppercase tracking-tight">
                      {suite.title} <span className="text-[#D4AF37]">{suite.highlight}</span>
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-white/65 font-sans leading-relaxed mb-6">
                    {suite.tagline}
                  </p>
                </div>

                {/* Preview & Tags */}
                <div>
                  <div className="mb-4 p-3 rounded-sm bg-[#09090B] border border-white/[0.06]">
                    {suite.renderPreview(isHovered)}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                    {suite.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-sm bg-[#09090B] border border-white/[0.06] text-[9px] font-mono text-white/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
