"use client";

import React, { useState } from "react";
import { CloudUpload, Scissors, CheckCircle } from "lucide-react";
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
    tagline: "Drop raw footage into your private cloud vault. Concise async brief, zero friction.",
    spec: "ASPERA / GOOGLE DRIVE",
    icon: CloudUpload,
  },
  {
    num: "02",
    phase: "PHASE 02",
    title: "The Cut",
    highlight: "& sound architecture.",
    tagline: "Velocity cutting, 12-track Foley beds, kinetic typography, and Kodak 2383 color science.",
    spec: "PREMIERE / AFTER EFFECTS / DAVINCI",
    icon: Scissors,
  },
  {
    num: "03",
    phase: "PHASE 03",
    title: "Master Delivery",
    highlight: "& rapid revision.",
    tagline: "Platform-optimized 4K master exports within 24–48 hours. Direct access to your lead editor.",
    spec: "4K PRORES 422 HQ",
    icon: CheckCircle,
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      className="py-20 sm:py-28 bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="process"
      aria-label="Zenith Post-Production Process"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Minimal Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>SCENE 03 // THE WORKFLOW</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]">
              RAW FOOTAGE TO <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                ready-to-post.
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/60 max-w-md font-sans leading-relaxed">
            A frictionless 3-stage post-production pipeline. No account managers in between, just direct collaboration with your lead editor.
          </p>
        </div>

        {/* 3 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((step, idx) => {
            const isCurrent = activeStep === idx;
            const StepIcon = step.icon;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "p-7 rounded-xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between min-h-[280px]",
                  isCurrent
                    ? "bg-[#121216] border-[#D4AF37]/50 shadow-lg scale-[1.01]"
                    : "bg-[#121216]/60 border-white/[0.07] hover:border-white/[0.15] hover:bg-[#121216]"
                )}
              >
                <div>
                  {/* Top Bar: Number & Spec */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={cn(
                        "text-3xl font-display font-bold tracking-tight",
                        isCurrent ? "text-[#D4AF37]" : "text-white/30"
                      )}
                    >
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-2.5 py-0.5 rounded-sm bg-[#09090B] border border-white/[0.07]">
                      {step.phase}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight leading-snug mb-2">
                    {step.title}{" "}
                    <span className="font-serif italic font-normal text-[#D4AF37] lowercase block sm:inline">
                      {step.highlight}
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 font-sans font-normal leading-relaxed">
                    {step.tagline}
                  </p>
                </div>

                {/* Bottom Spec Badge */}
                <div className="pt-5 mt-5 border-t border-white/[0.07] flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="flex items-center gap-2">
                    <StepIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{step.spec}</span>
                  </span>
                  <span className={cn("transition-transform duration-200", isCurrent ? "translate-x-1 text-[#D4AF37]" : "text-white/20")}>
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Timeline Turnaround Bar */}
        <div className="p-4 rounded-sm bg-[#121216] border border-white/[0.07] flex items-center justify-between text-xs font-mono text-white/50">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="uppercase tracking-widest text-white/70">STUDIO TURNAROUND:</span>
            <span className="text-[#D4AF37] font-semibold">24 TO 48 HOURS</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-white/40 text-[11px]">
            <span>SURGICAL REVISIONS TO PICTURE LOCK</span>
            <span>·</span>
            <span>DIRECT SLACK / WHATSAPP CHANNEL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
