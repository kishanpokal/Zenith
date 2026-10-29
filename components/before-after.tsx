"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Gauge, Volume2, Palette, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BeforeAfterProps {
  headline?: string;
  headlineHighlight?: string;
  subheadline?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeNotice?: string;
  footerNote?: string;
}

const EDITORIAL_PILLARS = [
  {
    index: "01",
    title: "Fast Pacing & Cuts",
    highlight: "Zero Boring Pauses",
    description:
      "We cut out all dead air and awkward pauses. The video moves with energy so viewers stay hooked from the first second to the last.",
    spec: "FAST HOOKS · SMOOTH FLOW",
    icon: Gauge,
  },
  {
    index: "02",
    title: "Sound & Music",
    highlight: "Clear Audio Mix",
    description:
      "Clear voice, punchy sound effects (whooshes, pops, hits), and background music that matches the exact mood of your video.",
    spec: "CLEAN VOICE · IMPACTFUL SOUND EFFECTS",
    icon: Volume2,
  },
  {
    index: "03",
    title: "Color & Captions",
    highlight: "Cinematic Look",
    description:
      "Rich colors that make your camera footage look professional, paired with animated subtitles and graphics that highlight key ideas.",
    spec: "VIBRANT COLOR · ANIMATED CAPTIONS",
    icon: Palette,
  },
];

export function BeforeAfter({
  headline = "SAME FOOTAGE.",
  headlineHighlight = "different impact.",
  subheadline = "Drag the slider to see how raw camera footage transforms into a polished, high-performing video.",
  beforeImage = "/images/projects/reel-5.jpg",
  afterImage = "/images/projects/reel-5.jpg",
  beforeLabel = "RAW FOOTAGE",
  afterLabel = "FINISHED EDIT",
  beforeNotice = "RAW CAMERA TAKE",
  footerNote = "Great editing cuts out the boring parts so only the best moments remain.",
}: BeforeAfterProps) {
  const [split, setSplit] = useState(50);

  return (
    <section className="py-20 sm:py-28 bg-[#09090B] border-b border-white/[0.07] relative select-none" id="before-after" aria-labelledby="ba-title">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 type-timecode text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>BEFORE & AFTER</span>
            </div>

            <h2 className="type-section-title text-[#F4F4F6]" id="ba-title">
              {headline} <br />
              <span className="font-editorial text-[#D4AF37] lowercase">
                {headlineHighlight}
              </span>
            </h2>
          </div>

          <p className="type-body text-sm max-w-md md:text-right">
            {subheadline}
          </p>
        </div>

        {/* Viewer Container */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl">
          {/* FINAL MASTER SIDE */}
          <div className="absolute inset-0 z-0">
            <img
              src={afterImage}
              alt="Finished edit frame"
              className="w-full h-full object-cover"
            />
            {/* Visual Overlays */}
            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-sm bg-[#09090B]/85 backdrop-blur-md border border-white/[0.08] type-timecode text-[#D4AF37] font-semibold">
              {afterLabel}
            </div>
          </div>

          {/* RAW FLAT LOG SIDE */}
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{
              clipPath: `polygon(0% 0%, ${split}% 0%, ${split}% 100%, 0% 100%)`,
            }}
          >
            <img
              src={beforeImage}
              alt="Raw footage frame"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.2) contrast(0.8) brightness(1.15)" }}
            />
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-sm bg-[#09090B]/85 backdrop-blur-md border border-white/[0.08] type-timecode text-white/50">
              {beforeLabel}
            </div>
            {beforeNotice && (
              <div className="absolute bottom-4 left-4 z-10 px-2 py-0.5 rounded-sm bg-red-950/80 border border-red-500/30 type-timecode text-red-300">
                {beforeNotice}
              </div>
            )}
          </div>

          {/* Draggable Hairline Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 w-[1px] bg-[#D4AF37] pointer-events-none shadow-[0_0_10px_rgba(212,175,55,0.6)]"
            style={{ left: `${split}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#121216] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-lg">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Range Input Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={split}
            onChange={(e) => setSplit(parseFloat(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            aria-label="Comparison slider: raw footage versus final edit"
          />
        </div>

        {/* Caption */}
        <p className="text-center type-timecode text-white/50 mt-6 tracking-wider">
          {footerNote}
        </p>

        {/* 3 CORE PILLARS */}
        <div className="mt-16 pt-12 border-t border-white/[0.07]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="type-timecode text-[#D4AF37] mb-2 block">
              OUR EDITING STANDARDS
            </span>
            <h3 className="type-card-title text-[#F4F4F6] text-xl sm:text-2xl uppercase">
              Three core elements of every edit
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EDITORIAL_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.index}
                  className="p-6 sm:p-7 rounded-xl bg-[#121216] border border-white/[0.07] hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-sm bg-[#09090B] border border-white/[0.08] text-[#D4AF37] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="type-timecode text-white/40">
                        PILLAR {pillar.index}
                      </span>
                    </div>

                    <h4 className="type-card-title text-[#F4F4F6] uppercase mb-1">
                      {pillar.title}
                    </h4>
                    <span className="type-timecode text-[#D4AF37] block mb-3 font-semibold">
                      {pillar.highlight}
                    </span>

                    <p className="type-body text-xs sm:text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] type-timecode text-[9px] text-white/40">
                    {pillar.spec}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
