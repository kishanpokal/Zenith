"use client";

import React, { useState } from "react";
import { CloudUpload, Scissors, Sparkles, CheckCircle2 } from "lucide-react";
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
    phase: "STEP 01",
    title: "Send",
    highlight: "Footage",
    tagline: "Upload your raw video files to Google Drive or Dropbox with a short note on what you need.",
    spec: "GOOGLE DRIVE / DROPBOX",
    icon: CloudUpload,
  },
  {
    num: "02",
    phase: "STEP 02",
    title: "First",
    highlight: "Cut",
    tagline: "We remove pauses, build a strong hook, and edit the main story so the video flows smoothly.",
    spec: "FAST PACING & FLOW",
    icon: Scissors,
  },
  {
    num: "03",
    phase: "STEP 03",
    title: "Sound &",
    highlight: "Effects",
    tagline: "We add animated captions, sound effects, background music, and vibrant cinematic colors.",
    spec: "CAPTIONS, SFX & COLOR",
    icon: Sparkles,
  },
  {
    num: "04",
    phase: "STEP 04",
    title: "Final",
    highlight: "Delivery",
    tagline: "You get your finished 4K video within 24 to 48 hours, ready to post on your channels.",
    spec: "READY TO POST",
    icon: CheckCircle2,
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      className="section-editorial bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="process"
      aria-label="Zenith Post-Production Process"
    >
      <div className="container-editorial relative z-10">
        {/* Minimal Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 type-timecode text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>HOW IT WORKS</span>
            </div>

            <h2 className="type-section-title text-[#F4F4F6]">
              RAW FOOTAGE TO <br />
              <span className="font-editorial text-[#D4AF37] lowercase">
                ready-to-post.
              </span>
            </h2>
          </div>

          <p className="type-body text-sm max-w-md md:text-right">
            A simple 4-step editing process with direct access to your lead editor.
          </p>
        </div>

        {/* MOBILE VERTICAL TIMELINE (< md): Clean left-border timeline with zero cramped columns */}
        <div className="md:hidden border-l border-white/15 pl-5 space-y-8 mb-10 ml-2">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            return (
              <div key={step.num} className="relative">
                {/* Timeline node */}
                <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#121216] border-2 border-[#D4AF37]" />

                <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-[#D4AF37]">
                  <span className="font-bold">{step.num} {"//"} {step.phase}</span>
                </div>

                <h3 className="type-card-title text-[#F4F4F6] uppercase leading-snug">
                  {step.title} <span className="font-editorial text-[#D4AF37] lowercase">{step.highlight}</span>
                </h3>

                <p className="type-body text-xs leading-relaxed mt-1.5 mb-2.5">
                  {step.tagline}
                </p>

                <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-white/50 bg-[#121216] px-2.5 py-1 rounded-sm border border-white/[0.07]">
                  <StepIcon className="w-3 h-3 text-[#D4AF37]" />
                  <span>{step.spec}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* LAPTOP / DESKTOP 4-STEP HORIZONTAL NLE TIMELINE (>= md) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STEPS.map((step, idx) => {
            const isCurrent = activeStep === idx;
            const StepIcon = step.icon;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "p-6 sm:p-7 rounded-xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between min-h-[290px] shadow-lg",
                  isCurrent
                    ? "bg-[#121216] border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/30 scale-[1.01]"
                    : "bg-[#121216]/60 border-white/[0.07] hover:border-white/[0.18] hover:bg-[#121216]"
                )}
              >
                <div>
                  {/* Top Bar: Number & Spec */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={cn(
                        "text-2xl font-display font-bold tracking-tight",
                        isCurrent ? "text-[#D4AF37]" : "text-white/30"
                      )}
                    >
                      {step.num}
                    </span>
                    <span className="type-timecode text-white/40 px-2 py-0.5 rounded-sm bg-[#09090B] border border-white/[0.07]">
                      {step.phase}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="type-card-title text-[#F4F4F6] uppercase leading-snug mb-1">
                    {step.title}
                  </h3>
                  <span className="font-editorial text-[#D4AF37] text-sm block mb-3 lowercase">
                    {step.highlight}
                  </span>

                  <p className="type-body text-xs leading-relaxed">
                    {step.tagline}
                  </p>
                </div>

                {/* Bottom Spec Badge */}
                <div className="pt-4 mt-5 border-t border-white/[0.07] flex items-center justify-between type-timecode text-white/40">
                  <span className="flex items-center gap-1.5 truncate">
                    <StepIcon className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{step.spec}</span>
                  </span>
                  <span className={cn("transition-transform duration-200 shrink-0 ml-1", isCurrent ? "translate-x-1 text-[#D4AF37]" : "text-white/20")}>
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Timeline Turnaround Bar */}
        <div className="p-4 rounded-sm bg-[#121216] border border-white/[0.07] flex items-center justify-between type-timecode text-white/50">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-white/70">FAST DELIVERY:</span>
            <span className="text-[#D4AF37] font-semibold">24 TO 48 HOURS</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-white/40">
            <span>FAST REVISIONS UNTIL APPROVED</span>
            <span>·</span>
            <span>DIRECT CHAT WITH YOUR EDITOR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
