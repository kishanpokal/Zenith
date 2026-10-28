"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Scissors, Volume2, Palette, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CraftPillar {
  id: string;
  number: string;
  title: string;
  serifAccent: string;
  tagline: string;
  badge: string;
  icon: any;
}

const PILLARS: CraftPillar[] = [
  {
    id: "pacing",
    number: "01",
    title: "Velocity",
    serifAccent: "pacing.",
    tagline: "Dynamic nonlinear bezier curves mapped to speech cadence. Zero dead seconds.",
    badge: "SPEED GRAPHS",
    icon: Gauge,
  },
  {
    id: "cuts",
    number: "02",
    title: "Surgical",
    serifAccent: "match cuts.",
    tagline: "Audio leads video by 4 frames (J-cut) to pull viewer dopamine forward.",
    badge: "CONTINUITY",
    icon: Scissors,
  },
  {
    id: "sound",
    number: "03",
    title: "Multi-Track",
    serifAccent: "foley sound.",
    tagline: "40Hz sub-bass risers and tactile paper snaps mastered to -14 LUFS loudness.",
    badge: "PSYCHO-ACOUSTICS",
    icon: Volume2,
  },
  {
    id: "color",
    number: "04",
    title: "Kodak 2383",
    serifAccent: "film science.",
    tagline: "Log-to-Rec.709 transform with organic 35mm grain and rich highlight roll-off.",
    badge: "COLOR SCIENCE",
    icon: Palette,
  },
];

export function CraftCapabilities() {
  const [activeTab, setActiveTab] = useState(0);
  const [isColorToggled, setIsColorToggled] = useState(false);

  const cur = PILLARS[activeTab];
  const Icon = cur.icon;

  return (
    <section
      className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden select-none"
      id="capabilities"
      aria-label="Zenith Post-Production Craft"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(215,255,100,0.04)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:36px_36px] pointer-events-none opacity-40" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Minimal Deluxe Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-4 text-xs font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64] animate-pulse" />
              <span>SCENE 02 · CRAFT & CAPABILITIES</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight text-white leading-none">
              SURGICAL <br />
              <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lg:text-[84px] lowercase tracking-normal">
                craftsmanship.
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/60 max-w-md font-sans leading-relaxed">
            Every frame, sound transient, and color node is engineered with obsessive intention to command viewer retention.
          </p>
        </div>

        {/* 4 Minimal Interactive Craft Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {PILLARS.map((p, idx) => {
            const isSelected = activeTab === idx;
            const TabIcon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group",
                  isSelected
                    ? "bg-[#D7FF64] text-[#050505] border-[#D7FF64] font-bold shadow-[0_0_30px_rgba(215,255,100,0.25)] scale-[1.02]"
                    : "bg-white/[0.02] text-white/70 border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("text-xs font-mono font-bold", isSelected ? "text-[#050505]/70" : "text-[#D7FF64]")}>
                    {p.number}
                  </span>
                  <TabIcon className="w-4 h-4" />
                </div>
                <div className="font-outfit font-black text-sm sm:text-base uppercase tracking-wider leading-none">
                  {p.title}
                </div>
                <div className={cn("text-[10px] font-mono mt-1.5 truncate tracking-wider", isSelected ? "text-[#050505]/70" : "text-white/40")}>
                  {p.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Visual Showcase Stage (Deluxe & Interactive) */}
        <div className="rounded-3xl bg-[#090909] border border-white/10 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Corner Brackets */}
          <div className="absolute top-3 left-3 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">┌</div>
          <div className="absolute top-3 right-3 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">┐</div>
          <div className="absolute bottom-3 left-3 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">└</div>
          <div className="absolute bottom-3 right-3 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">┘</div>

          <div className="max-w-3xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D7FF64] mb-3 uppercase tracking-widest font-bold">
                  <Icon className="w-4 h-4" />
                  <span>PILLAR {cur.number} · {cur.badge}</span>
                </div>

                {/* Headline */}
                <h3 className="text-3xl sm:text-5xl font-outfit font-black text-white uppercase tracking-tight leading-none mb-3">
                  {cur.title}{" "}
                  <span className="font-serif italic font-normal text-[#D7FF64] text-4xl sm:text-6xl lowercase">
                    {cur.serifAccent}
                  </span>
                </h3>

                {/* 1-Sentence Punchy Value */}
                <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto font-sans font-light leading-relaxed mb-8">
                  {cur.tagline}
                </p>

                {/* Live Micro-Visualizer */}
                <div className="p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
                  {activeTab === 0 && (
                    <div>
                      <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-20 sm:h-24">
                        <defs>
                          <linearGradient id="craftCurveGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D7FF64" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#D7FF64" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 70 C 90 70, 140 10, 250 10 C 360 10, 410 70, 500 70 L 500 80 L 0 80 Z"
                          fill="url(#craftCurveGlow)"
                        />
                        <path
                          d="M 0 70 C 90 70, 140 10, 250 10 C 360 10, 410 70, 500 70"
                          fill="none"
                          stroke="#D7FF64"
                          strokeWidth="3.5"
                        />
                        <circle cx="250" cy="10" r="5" fill="#D7FF64" />
                      </svg>
                      <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mt-3">
                        <span>0.6s ATTENTION HOOK</span>
                        <span className="text-[#D7FF64] font-bold">PEAK ACCELERATION: 360%</span>
                        <span>SMOOTH LANDING</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-2.5 font-mono text-[10px]">
                      <div className="h-9 rounded-xl bg-white/[0.03] border border-white/10 p-1 flex items-center gap-2">
                        <span className="w-7 text-white/40 font-bold px-1">V1</span>
                        <div className="h-full rounded-lg bg-white/10 border border-white/20 flex-1 flex items-center justify-center text-white/80 font-bold">
                          SHOT A · RAW TAKE
                        </div>
                        <div className="h-full rounded-lg bg-[#D7FF64]/20 border border-[#D7FF64]/40 flex-1 flex items-center justify-center text-[#D7FF64] font-bold">
                          SHOT B · 118% PUNCH-IN
                        </div>
                      </div>
                      <div className="h-9 rounded-xl bg-white/[0.03] border border-white/10 p-1 flex items-center gap-2">
                        <span className="w-7 text-white/40 font-bold px-1">A1</span>
                        <div className="h-full rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex-[1.4] flex items-center justify-center text-[#38BDF8] font-bold">
                          J-CUT 4-FRAME AUDIO LEAD
                        </div>
                        <div className="h-full rounded-lg bg-white/10 border border-white/20 flex-1 flex items-center justify-center text-white/60">
                          DIALOGUE SYNC
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div>
                      <div className="flex items-end justify-center gap-1.5 h-20 sm:h-24 px-4">
                        {Array.from({ length: 36 }).map((_, i) => {
                          const h = Math.abs(Math.sin(i * 0.38) * 80 + 15);
                          return (
                            <span
                              key={i}
                              className="flex-1 rounded-t-sm transition-all duration-300"
                              style={{
                                height: `${h}%`,
                                background:
                                  i % 4 === 0 ? "#D7FF64" : i % 4 === 1 ? "#38BDF8" : "rgba(255,255,255,0.25)",
                                opacity: 0.9,
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mt-3">
                        <span>40Hz SUB RISER</span>
                        <span className="text-[#38BDF8] font-bold">-14 LUFS TRUE PEAK</span>
                        <span>FOLEY TRANSIENTS</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div>
                      <div className="flex items-center justify-between gap-4 font-mono text-xs px-2">
                        <div
                          onClick={() => setIsColorToggled(false)}
                          className={cn(
                            "p-4 rounded-xl border flex-1 text-center cursor-pointer transition-all",
                            !isColorToggled
                              ? "bg-white/10 border-white/30 text-white font-bold"
                              : "bg-white/[0.02] border-white/10 text-white/40"
                          )}
                        >
                          <span className="text-[10px] text-white/40 block mb-1 uppercase">INPUT</span>
                          <span>FLAT S-LOG3</span>
                        </div>
                        <div className="text-[#D7FF64] font-bold text-xl">→</div>
                        <div
                          onClick={() => setIsColorToggled(true)}
                          className={cn(
                            "p-4 rounded-xl border flex-1 text-center cursor-pointer transition-all",
                            isColorToggled
                              ? "bg-[#D7FF64]/15 border-[#D7FF64] text-[#D7FF64] font-bold shadow-[0_0_20px_rgba(215,255,100,0.2)]"
                              : "bg-white/[0.02] border-white/10 text-white/40"
                          )}
                        >
                          <span className="text-[10px] text-[#D7FF64] block mb-1 uppercase font-bold">GRADED</span>
                          <span className="text-white font-bold">KODAK 2383 PRINT</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-3 text-center">
                        Click either node to toggle color science pipeline
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span>DISCIPLINE 0{activeTab + 1} OF 04</span>
                  <span className="text-[#D7FF64] font-bold">24 FPS MASTER CADENCE</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
