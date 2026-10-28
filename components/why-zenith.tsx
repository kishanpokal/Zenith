"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function WhyZenith() {
  const [activeTab, setActiveTab] = useState<"agency" | "zenith">("zenith");

  return (
    <section className="py-20 sm:py-28 bg-[#09090B] border-b border-white/[0.07] relative select-none" id="why" aria-labelledby="why-title">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>SC 05 // THE DIFFERENCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]" id="why-title">
              FREELANCER FLEXIBILITY. <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                agency execution.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-sm bg-[#121216] border border-white/[0.07] text-[11px] font-mono self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("agency")}
              className={cn(
                "px-3 py-1.5 rounded-sm transition-colors",
                activeTab === "agency"
                  ? "bg-white text-black font-bold"
                  : "text-white/60 hover:text-white"
              )}
            >
              Traditional Agency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("zenith")}
              className={cn(
                "px-3 py-1.5 rounded-sm transition-colors",
                activeTab === "zenith"
                  ? "bg-[#D4AF37] text-[#09090B] font-bold"
                  : "text-white/60 hover:text-white"
              )}
            >
              ZENITH DIRECT
            </button>
          </div>
        </div>

        {/* 2-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional Agency */}
          <div
            className={cn(
              "p-6 sm:p-8 rounded-xl border transition-all duration-200 bg-[#121216]/50 border-white/[0.07]",
              activeTab === "agency" && "border-white/30 bg-[#121216]"
            )}
          >
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-4 pb-3 border-b border-white/[0.06]">
              TRADITIONAL AGENCY MODEL
            </div>
            <ul className="space-y-3.5 text-xs font-mono text-white/70">
              <li className="flex items-center gap-2.5">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Account manager and sales reps in the middle</span>
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Multiple handoffs, lag, and miscommunicated briefs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Random junior editor assignments per project</span>
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Slow 5–7 day turnaround on revisions</span>
              </li>
            </ul>
          </div>

          {/* Zenith Direct */}
          <div
            className={cn(
              "p-6 sm:p-8 rounded-xl border transition-all duration-200 bg-[#121216] border-[#D4AF37]/50 shadow-xl",
              activeTab === "zenith" && "ring-1 ring-[#D4AF37]/40"
            )}
          >
            <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mb-4 pb-3 border-b border-white/[0.06] font-semibold">
              ZENITH EDITORIAL PIPELINE
            </div>
            <ul className="space-y-3.5 text-xs font-mono text-white/90">
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Direct async collaboration on WhatsApp & Frame.io</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Dedicated lead creative editor on every cut</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Consistent visual & psychoacoustic brand guidelines</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Surgical 24–48h feedback and delivery turnaround</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
