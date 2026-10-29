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
      className="section-editorial bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="capabilities"
      aria-label="Zenith Post-Production Craft"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute inset-0 bg-editorial-grid pointer-events-none opacity-40" />

      <div className="container-editorial relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>EDITING CRAFT & CAPABILITIES</span>
            </div>

            <h2 className="type-section-title text-[#F4F4F6]">
              SURGICAL <br />
              <span className="font-editorial text-[#D4AF37] lowercase">
                craftsmanship.
              </span>
            </h2>
          </div>

          <p className="type-body text-sm max-w-md md:text-right">
            Every frame, sound transient, and color node is engineered with obsessive intention to command viewer retention.
          </p>
        </div>

        {/* 3-Column Architectural Hairline Grid on Laptop, stacked on mobile with 1px dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.07] rounded-xl overflow-hidden mb-10 shadow-xl">
          {[
            {
              num: "01",
              title: "Velocity Pacing",
              subtitle: "NONLINEAR SPEED GRAPHS",
              desc: "Dynamic nonlinear bezier curves mapped to speech cadence. Dead air and micro-hesitations are excised so rhythm never drops.",
              badge: "SPEED RAMPING",
              icon: Gauge,
            },
            {
              num: "02",
              title: "Surgical J-Cuts",
              subtitle: "CONTINUITY & FLOW",
              desc: "Audio leads video by 4 frames to pull viewer attention forward into the next beat before their brain registers the transition.",
              badge: "SUB-FRAME EDIT",
              icon: Scissors,
            },
            {
              num: "03",
              title: "Psycho-Acoustic Mix",
              subtitle: "-14 LUFS TRUE PEAK",
              desc: "Tactile paper snaps, whooshes, and 40Hz sub-bass risers ducked dynamically beneath voice stems for maximum clarity and punch.",
              badge: "PRO AUDIO STEMS",
              icon: Volume2,
            },
          ].map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.num}
                className="bg-[#09090B] p-5 sm:p-6 lg:p-8 flex flex-col justify-between h-full group hover:bg-[#0E0E12] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                      {item.num} {"//"} SPEC
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-[#121216] border border-white/[0.07] text-[9px] font-mono text-white/50">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-sm bg-[#121216] border border-white/[0.08] text-[#D4AF37] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <h3 className="type-card-title text-[#F4F4F6] uppercase">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-[10px] font-mono text-[#D4AF37] mb-2 font-medium">
                    {item.subtitle}
                  </div>

                  <p className="type-body text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>DISCIPLINE 0{idx + 1}</span>
                  <span className="text-[#D4AF37]">STUDIO GRADE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
