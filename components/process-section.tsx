"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, Scissors, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStep {
  num: string;
  phase: string;
  title: string;
  highlight: string;
  tagline: string;
  spec: string;
  icon: any;
}

const STEPS: PipelineStep[] = [
  {
    num: "01",
    phase: "PHASE 01",
    title: "Ingest",
    highlight: "& hook brief.",
    tagline: "Drop raw takes into your private high-speed drive. One quick brief, zero friction.",
    spec: "ASPERA / GOOGLE DRIVE",
    icon: CloudUpload,
  },
  {
    num: "02",
    phase: "PHASE 02",
    title: "The Cut",
    highlight: "& sound architecture.",
    tagline: "Velocity cutting, 24-track Foley beds, dynamic graphics, and Kodak 2383 color science.",
    spec: "DAVINCI RESOLVE / AFTER EFFECTS",
    icon: Scissors,
  },
  {
    num: "03",
    phase: "PHASE 03",
    title: "Master Delivery",
    highlight: "& rapid revision.",
    tagline: "Platform-optimized 4K exports in 24–48 hours. Direct access to your lead editor.",
    spec: "4K PRORES 422 HQ",
    icon: CheckCircle,
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden select-none"
      id="process"
      aria-label="Zenith Post-Production Process"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(215,255,100,0.04)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Minimal Deluxe Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-4 text-xs font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64] animate-pulse" />
              <span>SCENE 03 · THE WORKFLOW</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight text-white leading-none">
              RAW FOOTAGE TO <br />
              <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lg:text-[84px] lowercase tracking-normal">
                ready-to-post.
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/60 max-w-md font-sans leading-relaxed">
            A frictionless 3-stage pipeline. No account managers in between, just direct collaboration with your lead editor.
          </p>
        </div>

        {/* 3 Deluxe Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, idx) => {
            const isCurrent = activeStep === idx;
            const StepIcon = step.icon;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "p-8 rounded-3xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between min-h-[300px]",
                  isCurrent
                    ? "bg-[#0b0b0b] border-[#D7FF64]/50 shadow-[0_0_35px_rgba(215,255,100,0.12)] scale-[1.01]"
                    : "bg-[#080808] border-white/10 hover:border-white/20 hover:bg-[#0c0c0c]"
                )}
              >
                {/* Subtle Glow on Active */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D7FF64]/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Bar: Number & Spec */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className={cn(
                        "text-3xl font-outfit font-black tracking-tight",
                        isCurrent ? "text-[#D7FF64]" : "text-white/30"
                      )}
                    >
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10">
                      {step.phase}
                    </span>
                  </div>

                  {/* Title & Serif Accent */}
                  <h3 className="text-2xl sm:text-3xl font-outfit font-black text-white uppercase tracking-tight leading-snug mb-3">
                    {step.title}{" "}
                    <span className="font-serif italic font-normal text-[#D7FF64] lowercase block sm:inline">
                      {step.highlight}
                    </span>
                  </h3>

                  {/* 1-Sentence Punchy Copy */}
                  <p className="text-sm text-white/70 font-sans font-light leading-relaxed">
                    {step.tagline}
                  </p>
                </div>

                {/* Bottom Spec Badge */}
                <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span className="flex items-center gap-2">
                    <StepIcon className="w-3.5 h-3.5 text-[#D7FF64]" />
                    <span>{step.spec}</span>
                  </span>
                  <span className={cn("transition-transform duration-300", isCurrent ? "translate-x-1 text-[#D7FF64]" : "text-white/20")}>
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Timeline Progress Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D7FF64] animate-pulse" />
            <span className="uppercase tracking-widest text-white/70">STUDIO TURNAROUND:</span>
            <span className="text-[#D7FF64] font-bold">24 TO 48 HOURS</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-white/40">
            <span>UNLIMITED REVISIONS UNTIL PICTURE LOCK</span>
            <span>·</span>
            <span>DIRECT SLACK / WHATSAPP CHANNEL</span>
          </div>
        </div>

      </div>
    </section>
  );
}
