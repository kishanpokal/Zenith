"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Gauge, Scissors, Volume2, Palette, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillarMilestone {
  index: string;
  label: string;
  badge: string;
  headline: string;
  highlight: string;
  oneLiner: string;
  tag: string;
  icon: any;
}

const MILESTONES: PillarMilestone[] = [
  {
    index: "01",
    label: "PACE",
    badge: "VELOCITY RAMPS",
    headline: "SPEED GRAPH",
    highlight: "cadence.",
    oneLiner: "Nonlinear bezier curves mapped to speech cadence. Zero dead air.",
    tag: "cubic-bezier(0.16, 1, 0.3, 1)",
    icon: Gauge,
  },
  {
    index: "02",
    label: "RHYTHM",
    badge: "CONTINUITY",
    headline: "SURGICAL",
    highlight: "match cuts.",
    oneLiner: "Audio leads visual by 4 frames to pull viewer attention forward.",
    tag: "J-CUT CONTINUITY",
    icon: Scissors,
  },
  {
    index: "03",
    label: "SOUND",
    badge: "PSYCHO-ACOUSTICS",
    headline: "MULTI-TRACK",
    highlight: "foley design.",
    oneLiner: "40Hz sub-bass risers and tactile transients mastered to -14 LUFS.",
    tag: "32-BIT FLOAT STEREO",
    icon: Volume2,
  },
  {
    index: "04",
    label: "FINISH",
    badge: "COLOR SCIENCE",
    headline: "KODAK 2383",
    highlight: "film print.",
    oneLiner: "Log-to-Rec.709 transform with organic 35mm grain and highlight roll-off.",
    tag: "DAVINCI RESOLVE CST",
    icon: Palette,
  },
];

export function PaceBreak() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [scrollProgressRatio, setScrollProgressRatio] = useState(0);
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Scroll tracking across the section in viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  // Smooth scroll-driven playhead width: 4% to 96%
  const playheadPercent = useTransform(scrollYProgress, [0, 1], ["4%", "96%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgressRatio(latest);

    // Frame-accurate timecode scrubbing from 00:00:00:00 to 00:00:24:00 (60 fps)
    const totalFrames = Math.floor(latest * 24 * 60);
    const secs = Math.floor(totalFrames / 60);
    const frames = totalFrames % 60;
    const s = secs < 10 ? `0${secs}` : `${secs}`;
    const f = frames < 10 ? `0${frames}` : `${frames}`;
    setTimecode(`00:00:${s}:${f}`);

    // Automatically advance the active milestone with scroll unless user clicked a tab
    if (!isManualOverride) {
      const idx = Math.min(3, Math.floor(latest * 4));
      setActiveTab(idx);
    }
  });

  const cur = MILESTONES[activeTab];
  const Icon = cur.icon;

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden select-none"
      id="principles"
    >
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(215,255,100,0.04)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* SECTION HEADER: MINIMAL & EDITORIAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4 text-xs font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64] animate-pulse" />
              <span>SC 02 — EDITING CRAFT & PHILOSOPHY</span>
              <span className="text-white/20">|</span>
              <span className="text-[#D7FF64] font-bold">FOUR PILLARS</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight text-white leading-none">
              EVERY FRAME <br />
              <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lg:text-[84px] lowercase tracking-normal">
                has a job.
              </span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
              TIMELINE SCRUBBER // 60 FPS
            </span>
            <div className="font-mono text-[#D7FF64] font-bold text-base sm:text-lg tracking-widest bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg">
              {timecode}
            </div>
          </div>
        </div>

        {/* SCROLL-DRIVEN PLAYHEAD SCRUB TRACK */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-2.5">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
              <span>PLAYHEAD SCRUB POSITION</span>
            </span>
            <span className="text-[#D7FF64] font-bold">
              {Math.round(scrollProgressRatio * 100)}% SCRUBBED
            </span>
          </div>

          {/* Dynamic Scroll Progress Rail */}
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-[#D7FF64] shadow-[0_0_12px_#D7FF64]"
              style={{ width: playheadPercent }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-white/30 mt-2 px-1">
            <span>00:00:00 (HOOK)</span>
            <span className="hidden sm:inline">00:00:08 (BUILD)</span>
            <span className="hidden sm:inline">00:00:16 (PAYOFF)</span>
            <span>00:00:24 (LOOP)</span>
          </div>
        </div>

        {/* 4 INTERACTIVE PILLAR SELECTORS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {MILESTONES.map((m, idx) => {
            const isSelected = activeTab === idx;
            const TabIcon = m.icon;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => {
                  setActiveTab(idx);
                  setIsManualOverride(true);
                }}
                className={cn(
                  "p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group",
                  isSelected
                    ? "bg-[#D7FF64] text-[#050505] border-[#D7FF64] font-bold shadow-[0_0_25px_rgba(215,255,100,0.25)] scale-[1.02]"
                    : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-[10px] font-mono", isSelected ? "text-[#050505]/70" : "text-[#D7FF64]")}>
                    {m.index}
                  </span>
                  <TabIcon className="w-3.5 h-3.5" />
                </div>
                <div className="font-outfit font-black text-sm uppercase tracking-wider leading-none">
                  {m.label}
                </div>
                <div className={cn("text-[9px] font-mono mt-1 truncate", isSelected ? "text-[#050505]/70" : "text-white/40")}>
                  {m.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CRAFT STAGE: MINIMAL & VISUAL-FIRST */}
        <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Corner Viewfinder Accents */}
          <div className="absolute top-2 left-2 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">┌</div>
          <div className="absolute top-2 right-2 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">┐</div>
          <div className="absolute bottom-2 left-2 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">└</div>
          <div className="absolute bottom-2 right-2 text-[#D7FF64]/40 font-mono text-xs pointer-events-none">┘</div>

          <div className="max-w-3xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D7FF64] mb-3 uppercase tracking-widest font-bold">
                  <Icon className="w-3.5 h-3.5" />
                  <span>MILESTONE {cur.index} · {cur.badge}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-outfit font-black text-white uppercase tracking-tight leading-none mb-3">
                  {cur.headline}{" "}
                  <span className="font-serif italic font-normal text-[#D7FF64] text-4xl sm:text-6xl lowercase">
                    {cur.highlight}
                  </span>
                </h3>

                <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto font-sans leading-relaxed mb-8">
                  {cur.oneLiner}
                </p>

                {/* Live Micro-Visualizer */}
                <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-white/10">
                  {activeTab === 0 && (
                    <div>
                      <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
                        <defs>
                          <linearGradient id="curveGlowSection" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D7FF64" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#D7FF64" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 70 C 80 70, 140 10, 250 10 C 360 10, 420 70, 500 70 L 500 80 L 0 80 Z"
                          fill="url(#curveGlowSection)"
                        />
                        <path
                          d="M 0 70 C 80 70, 140 10, 250 10 C 360 10, 420 70, 500 70"
                          fill="none"
                          stroke="#D7FF64"
                          strokeWidth="3"
                        />
                        <circle cx="250" cy="10" r="5" fill="#D7FF64" />
                      </svg>
                      <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mt-2">
                        <span>0.8s HOOK</span>
                        <span className="text-[#D7FF64]">PEAK VELOCITY: 340%</span>
                        <span>EASE-OUT LANDING</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-2 font-mono text-[10px]">
                      <div className="h-8 rounded-lg bg-white/[0.04] border border-white/10 p-1 flex items-center gap-1.5">
                        <span className="w-6 text-white/40 font-bold">V1</span>
                        <div className="h-full rounded bg-white/10 border border-white/20 flex-1 flex items-center justify-center text-white/80">
                          SHOT A (RAW TAKE)
                        </div>
                        <div className="h-full rounded bg-[#D7FF64]/20 border border-[#D7FF64]/40 flex-1 flex items-center justify-center text-[#D7FF64] font-bold">
                          SHOT B (118% PUNCH-IN)
                        </div>
                      </div>
                      <div className="h-8 rounded-lg bg-white/[0.04] border border-white/10 p-1 flex items-center gap-1.5">
                        <span className="w-6 text-white/40 font-bold">A1</span>
                        <div className="h-full rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex-[1.4] flex items-center justify-center text-[#38BDF8] font-bold">
                          J-CUT 4-FRAME AUDIO LEAD
                        </div>
                        <div className="h-full rounded bg-white/10 border border-white/20 flex-1 flex items-center justify-center text-white/60">
                          DIALOGUE SYNC
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="flex items-end justify-center gap-1.5 h-16 sm:h-20 px-4">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const h = Math.abs(Math.sin(i * 0.35) * 75 + 15);
                        return (
                          <span
                            key={i}
                            className="flex-1 rounded-t-sm transition-all duration-300"
                            style={{
                              height: `${h}%`,
                              background:
                                i % 3 === 0 ? "#D7FF64" : i % 3 === 1 ? "#38BDF8" : "#F43F5E",
                              opacity: 0.85,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="flex items-center justify-between gap-4 font-mono text-xs px-2">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex-1 text-center">
                        <span className="text-[10px] text-white/40 block mb-0.5 uppercase">INPUT</span>
                        <span className="text-white/80 font-bold">FLAT S-LOG3</span>
                      </div>
                      <div className="text-[#D7FF64] font-bold text-lg">→</div>
                      <div className="p-3 rounded-xl bg-[#D7FF64]/10 border border-[#D7FF64]/30 flex-1 text-center">
                        <span className="text-[10px] text-[#D7FF64] block mb-0.5 uppercase font-bold">GRADED</span>
                        <span className="text-white font-bold">KODAK 2383 PRINT</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>ACTIVE SPEC: {cur.tag}</span>
                  <span className="text-[#D7FF64]">STAGE {cur.index} / 04</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
