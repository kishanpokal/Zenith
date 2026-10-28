"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

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

export function BeforeAfter({
  headline = "SAME FOOTAGE.",
  headlineHighlight = "different impact.",
  subheadline = "Drag the scrubber. Left is raw flat camera log with dead air. Right is the mastered editorial cut.",
  beforeImage = "/images/projects/reel-5.jpg",
  afterImage = "/images/projects/reel-5.jpg",
  beforeLabel = "RAW LOG // CLIP_0042.MOV",
  afterLabel = "FINAL MASTER // KODAK 2383",
  beforeNotice = "DEAD AIR DETECTED: 00:00:02:14",
  footerNote = "Editing isn't adding clutter. It is removing friction from the viewer's attention.",
}: BeforeAfterProps) {
  const [split, setSplit] = useState(50);

  return (
    <section className="py-20 sm:py-28 bg-[#09090B] border-b border-white/[0.07] relative select-none" id="before-after" aria-labelledby="ba-title">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>SC 03 {"//"} RAW VS. FINAL PROOF</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]" id="ba-title">
              {headline} <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                {headlineHighlight}
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/60 font-sans max-w-md leading-relaxed md:text-right">
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
            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-sm bg-[#09090B]/80 backdrop-blur-md border border-white/[0.08] text-[10px] font-mono text-[#D4AF37] font-semibold">
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
            <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-sm bg-[#09090B]/80 backdrop-blur-md border border-white/[0.08] text-[10px] font-mono text-white/50">
              {beforeLabel}
            </div>
            {beforeNotice && (
              <div className="absolute bottom-4 left-4 z-10 px-2 py-0.5 rounded-sm bg-red-950/80 border border-red-500/30 text-[9px] font-mono text-red-300">
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
        <p className="text-center font-mono text-xs text-white/50 mt-6 uppercase tracking-wider">
          {footerNote}
        </p>
      </div>
    </section>
  );
}
