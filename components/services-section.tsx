"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Sparkles,
  Volume2,
  Palette,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Activity,
  Sliders
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
      title: "Timeline",
      highlight: "Architecture",
      tagline: "Dynamic speed graphs, surgical trims, and J-cut audio leads that eliminate dead air.",
      icon: Scissors,
      software: "Premiere Pro / DaVinci Cut",
      tags: ["Speed Ramps", "J-Cut Leads", "Zero Dead Air", "Loop Anchors"],
      renderPreview: (isHovered) => (
        <div className="space-y-1.5 font-mono text-[9px] w-full">
          <div className="h-6 rounded bg-white/5 border border-white/10 p-1 flex items-center gap-1">
            <span className="text-white/40 font-bold px-1">V1</span>
            <div className={cn("h-full rounded flex-1 flex items-center justify-center font-bold transition-all duration-300", isHovered ? "bg-[#D7FF64] text-[#050505]" : "bg-[#D7FF64]/20 text-[#D7FF64]")}>
              0.8s HOOK
            </div>
            <div className="h-full rounded bg-white/10 flex-[2] flex items-center justify-center text-white/70">
              A-ROLL CUT
            </div>
          </div>
          <div className="h-6 rounded bg-white/5 border border-white/10 p-1 flex items-center gap-1">
            <span className="text-white/40 font-bold px-1">A1</span>
            <div className="h-full rounded bg-[#38BDF8]/20 text-[#38BDF8] flex-[1.4] flex items-center justify-center font-bold">
              AUDIO LEAD-IN
            </div>
            <div className="h-full rounded bg-white/10 flex-[2] flex items-center justify-center text-white/60">
              VOICE EQ -18dB
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "02",
      title: "Kinetic",
      highlight: "Motion Design",
      tagline: "Custom typography rigs, 3D planar tracking, and explanatory vector interface callouts.",
      icon: Sparkles,
      software: "After Effects / Blender 3D",
      tags: ["Kinetic Captions", "3D Camera Track", "Vector UI", "Film Overlays"],
      renderPreview: (isHovered) => (
        <div className="h-14 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center p-2 w-full">
          <span className="font-outfit font-black text-sm uppercase text-white tracking-tight">
            HOLD ATTENTION <span className={cn("transition-colors duration-300", isHovered ? "text-[#D7FF64] drop-shadow-[0_0_8px_#D7FF64]" : "text-[#38BDF8]")}>TO THE LAST FRAME.</span>
          </span>
          <span className="text-[9px] font-mono text-white/40 mt-0.5">
            +2.5% KERNING // POP-IN ACCELERATION
          </span>
        </div>
      ),
    },
    {
      number: "03",
      title: "Psycho-Acoustic",
      highlight: "Sound Design",
      tagline: "Multi-track Foley beds, vocal de-noising, and 40Hz sub-bass risers mastered to -14 LUFS.",
      icon: Volume2,
      software: "iZotope RX 11 / FabFilter",
      tags: ["24+ Stems", "-14 LUFS Loudness", "Vocal De-Noise", "Sub-Bass Risers"],
      renderPreview: (isHovered) => (
        <div className="h-14 rounded-xl bg-black/40 border border-white/10 flex items-end justify-center gap-1 px-3 py-2 w-full">
          {Array.from({ length: 24 }).map((_, i) => {
            const h = Math.abs(Math.sin(i * 0.45) * 80 + 20);
            return (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-t-sm transition-all duration-200",
                  isHovered ? "bg-[#D7FF64]" : i % 2 === 0 ? "#38BDF8" : "rgba(255,255,255,0.2)"
                )}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
      ),
    },
    {
      number: "04",
      title: "Color Science",
      highlight: "& Film Finishing",
      tagline: "Camera Log-to-Rec.709 color transforms paired with authentic Kodak 2383 35mm grain.",
      icon: Palette,
      software: "DaVinci Resolve Studio",
      tags: ["Rec.709 CST", "Kodak 2383 LUT", "Skin Vector Lock", "35mm Grain"],
      renderPreview: (isHovered) => (
        <div className="h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between p-3 font-mono text-[10px] w-full">
          <div className="text-center flex-1">
            <span className="text-white/40 block text-[8px]">LOG RAW</span>
            <span className="text-white/70 font-bold">FLAT S-LOG3</span>
          </div>
          <div className={cn("text-xs font-bold px-2 transition-colors", isHovered ? "text-[#D7FF64]" : "text-white/30")}>
            →
          </div>
          <div className="text-center flex-1">
            <span className="text-[#D7FF64] block text-[8px] font-bold">GRADED</span>
            <span className="text-white font-bold">KODAK 2383</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#050505] relative overflow-hidden" id="services">
      {/* Subtle Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* SECTION HEADER: MINIMAL & EDITORIAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4 text-xs font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
              <span>SC 03 — CAPABILITIES & CRAFT</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-outfit font-black uppercase tracking-tight text-white leading-none">
              BUILT FOR <br />
              <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lowercase tracking-normal">
                impact.
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/60 font-sans max-w-md leading-relaxed md:text-right">
            Four specialized post-production disciplines. Every project engineered with frame-accurate timeline rigor.
          </p>
        </div>

        {/* 4 CLEAN EDITORIAL SUITE CARDS (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suites.map((suite, idx) => {
            const Icon = suite.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={suite.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group p-6 sm:p-8 rounded-3xl bg-[#090909] border border-white/[0.08] hover:border-[#D7FF64]/50 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#D7FF64]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D7FF64]/10 transition-colors" />

                <div>
                  {/* Top Bar: Number & Suite Tool */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-[#D7FF64] font-bold">
                      {suite.number} · SUITE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/50">
                      {suite.software}
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-[#D7FF64] flex items-center justify-center group-hover:bg-[#D7FF64] group-hover:text-[#050505] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-outfit font-black text-2xl text-white uppercase tracking-tight">
                      {suite.title} <span className="text-[#D7FF64]">{suite.highlight}</span>
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed mb-6">
                    {suite.tagline}
                  </p>
                </div>

                {/* Interactive Dynamic Micro-Visualizer on Hover */}
                <div>
                  <div className="mb-5 p-3 rounded-2xl bg-black/50 border border-white/5 group-hover:border-white/15 transition-colors">
                    {suite.renderPreview(isHovered)}
                  </div>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                    {suite.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono text-white/70"
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
