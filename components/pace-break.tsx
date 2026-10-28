"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Gauge, Scissors, Volume2, Palette } from "lucide-react";
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

  const playheadPercent = useTransform(scrollYProgress, [0, 1], ["4%", "96%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgressRatio(latest);

    const totalFrames = Math.floor(latest * 24 * 60);
    const secs = Math.floor(totalFrames / 60);
    const frames = totalFrames % 60;
    const s = secs < 10 ? `0${secs}` : `${secs}`;
    const f = frames < 10 ? `0${frames}` : `${frames}`;
    setTimecode(`00:00:${s}:${f}`);

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
      className="py-20 sm:py-28 bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="principles"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>SC 02 {"//"} EDITING CRAFT & PHILOSOPHY</span>
              <span className="text-white/20">|</span>
              <span className="text-[#D4AF37] font-semibold">FOUR PILLARS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]">
              EVERY FRAME <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                has a job.
              </span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-1.5">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              TIMELINE SCRUBBER {"//"} 60 FPS
            </span>
            <div className="font-mono text-[#D4AF37] font-semibold text-sm tracking-widest bg-[#121216] px-3 py-1 rounded-sm border border-white/[0.07]">
              {timecode}
            </div>
          </div>
        </div>

        {/* SCROLL-DRIVEN PLAYHEAD SCRUB TRACK */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-[#121216] border border-white/[0.07]">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>PLAYHEAD POSITION</span>
            </span>
            <span className="text-[#D4AF37] font-semibold">
              {Math.round(scrollProgressRatio * 100)}% SCRUBBED
            </span>
          </div>

          <div className="relative h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-[#D4AF37]"
              style={{ width: playheadPercent }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-white/30 mt-2 px-0.5">
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
                  "p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group",
                  isSelected
                    ? "bg-[#D4AF37] text-[#09090B] border-[#D4AF37] font-bold shadow-md scale-[1.01]"
                    : "bg-[#121216] text-white/70 border-white/[0.07] hover:border-white/[0.18]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-[10px] font-mono", isSelected ? "text-[#09090B]/70" : "text-[#D4AF37]")}>
                    {m.index}
                  </span>
                  <TabIcon className="w-3.5 h-3.5" />
                </div>
                <div className="font-display font-bold text-sm uppercase tracking-wider leading-none">
                  {m.label}
                </div>
                <div className={cn("text-[9px] font-mono mt-1 truncate", isSelected ? "text-[#09090B]/75" : "text-white/40")}>
                  {m.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CRAFT STAGE */}
        <div className="rounded-xl bg-[#121216] border border-white/[0.07] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] mb-2 uppercase tracking-widest font-semibold">
                  <Icon className="w-3.5 h-3.5" />
                  <span>PILLAR {cur.index} {"//"} {cur.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight leading-tight mb-2">
                  {cur.headline}{" "}
                  <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                    {cur.highlight}
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto font-sans leading-relaxed mb-6">
                  {cur.oneLiner}
                </p>

                {/* Live Micro-Visualizer */}
                <div className="p-4 sm:p-5 rounded-sm bg-[#09090B] border border-white/[0.07]">
                  {activeTab === 0 && (
                    <div>
                      <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-14 sm:h-16">
                        <defs>
                          <linearGradient id="curveGlowSection" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 70 C 80 70, 140 10, 250 10 C 360 10, 420 70, 500 70 L 500 80 L 0 80 Z"
                          fill="url(#curveGlowSection)"
                        />
                        <path
                          d="M 0 70 C 80 70, 140 10, 250 10 C 360 10, 420 70, 500 70"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="2.5"
                        />
                        <circle cx="250" cy="10" r="4" fill="#D4AF37" />
                      </svg>
                      <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mt-2">
                        <span>0.8s HOOK</span>
                        <span className="text-[#D4AF37] font-semibold">PEAK VELOCITY: 340%</span>
                        <span>EASE-OUT LANDING</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-2 font-mono text-[10px]">
                      <div className="h-7 rounded-sm bg-white/[0.03] border border-white/[0.07] p-1 flex items-center gap-1.5">
                        <span className="w-6 text-white/40 font-bold">V1</span>
                        <div className="h-full rounded-sm bg-white/[0.06] border border-white/[0.08] flex-1 flex items-center justify-center text-white/80">
                          SHOT A (RAW TAKE)
                        </div>
                        <div className="h-full rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex-1 flex items-center justify-center text-[#D4AF37] font-semibold">
                          SHOT B (118% PUNCH-IN)
                        </div>
                      </div>
                      <div className="h-7 rounded-sm bg-white/[0.03] border border-white/[0.07] p-1 flex items-center gap-1.5">
                        <span className="w-6 text-white/40 font-bold">A1</span>
                        <div className="h-full rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex-[1.4] flex items-center justify-center text-[#D4AF37] font-semibold">
                          J-CUT 4-FRAME AUDIO LEAD
                        </div>
                        <div className="h-full rounded-sm bg-white/[0.06] border border-white/[0.08] flex-1 flex items-center justify-center text-white/60">
                          DIALOGUE SYNC
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="flex items-end justify-center gap-1.5 h-14 sm:h-16 px-4">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const h = Math.abs(Math.sin(i * 0.35) * 75 + 15);
                        return (
                          <span
                            key={i}
                            className="flex-1 rounded-t-sm transition-all duration-300"
                            style={{
                              height: `${h}%`,
                              background: i % 2 === 0 ? "#D4AF37" : "#F4F4F6",
                              opacity: 0.8,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div className="flex items-center justify-between gap-4 font-mono text-xs px-2">
                      <div className="p-2.5 rounded-sm bg-white/[0.03] border border-white/[0.07] flex-1 text-center">
                        <span className="text-[9px] text-white/40 block mb-0.5 uppercase">INPUT</span>
                        <span className="text-white/80 font-semibold">FLAT S-LOG3</span>
                      </div>
                      <div className="text-[#D4AF37] font-bold text-base">→</div>
                      <div className="p-2.5 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex-1 text-center">
                        <span className="text-[9px] text-[#D4AF37] block mb-0.5 uppercase font-semibold">GRADED</span>
                        <span className="text-white font-semibold">KODAK 2383 PRINT</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>ACTIVE SPEC: {cur.tag}</span>
                  <span className="text-[#D4AF37]">STAGE {cur.index} / 04</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
