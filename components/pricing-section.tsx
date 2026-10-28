"use client";

import React from "react";
import { siteConfig } from "@/data/site-config";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  onSelectPackage?: (pkg: string) => void;
}

interface Plan {
  id: string;
  name: string;
  volume: string;
  price: string;
  popular?: boolean;
  tagline: string;
  features: string[];
  ctaText: string;
  whatsappMessage: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "STARTER",
    volume: "30 REELS / MO",
    price: "$299",
    tagline: "For creators establishing momentum and consistent output.",
    features: [
      "30 High-retention vertical reels",
      "Surgical cutting & zero dead air",
      "Dynamic captions & contextual B-roll",
      "Multi-track Foley sound design",
      "Rec.709 color grade · 48h delivery",
    ],
    ctaText: "Start with 30",
    whatsappMessage: "Hi Zenith! I want to start a project with the Starter package (30 reels / $299).",
  },
  {
    id: "growth",
    name: "GROWTH",
    volume: "60 REELS / MO",
    price: "$499",
    popular: true,
    tagline: "For high-growth creators and brands scaling their reach.",
    features: [
      "60 High-retention vertical reels",
      "Advanced kinetic motion design",
      "Psycho-acoustic Foley & 40Hz risers",
      "Kodak 2383 cinematic film print LUT",
      "Priority 24-48h workflow & revisions",
    ],
    ctaText: "Scale with 60",
    whatsappMessage: "Hi Zenith! I want to start a project with the Growth package (60 reels / $499).",
  },
  {
    id: "vip",
    name: "VIP RETAINER",
    volume: "ENTERPRISE VOLUME",
    price: "CUSTOM",
    tagline: "For multi-platform creators and agencies demanding dedicated talent.",
    features: [
      "Short-form reels + YouTube longform",
      "Dedicated lead post-production editor",
      "Custom brand typography & motion assets",
      "Same-day 24h turnaround pipeline",
      "Direct private Slack / WhatsApp sync",
    ],
    ctaText: "Inquire VIP Retainer",
    whatsappMessage: "Hi Zenith! I want to discuss a custom VIP Retainer for my channel/brand.",
  },
];

export function PricingSection({ onSelectPackage }: PricingSectionProps = {}) {
  return (
    <section
      className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden select-none"
      id="pricing"
      aria-label="Zenith Post-Production Investment"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(215,255,100,0.05)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Minimal Deluxe Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-4 text-xs font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64] animate-pulse" />
              <span>SCENE 04 · TRANSPARENT INVESTMENT</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-outfit font-black uppercase tracking-tight text-white leading-none">
              CONTENT ENGINES <br />
              <span className="font-serif italic font-normal text-[#D7FF64] text-5xl sm:text-7xl lg:text-[84px] lowercase tracking-normal">
                scaled.
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/60 max-w-md font-sans leading-relaxed">
            Choose your volume. Zenith handles ingest, editing, sound architecture, and master export with zero friction.
          </p>
        </div>

        {/* 3 Deluxe Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isPop = plan.popular;

            return (
              <div
                key={plan.id}
                className={cn(
                  "p-8 sm:p-10 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between group",
                  isPop
                    ? "bg-[#0b0b0b] border-[#D7FF64]/50 shadow-[0_0_40px_rgba(215,255,100,0.15)] ring-1 ring-[#D7FF64]/40"
                    : "bg-[#080808] border-white/10 hover:border-white/20 hover:bg-[#0c0c0c]"
                )}
              >
                {/* Popular Badge */}
                {isPop && (
                  <div className="absolute -top-3.5 left-8 px-3.5 py-1 rounded-full bg-[#D7FF64] text-[#050505] font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>MOST POPULAR CHOICE</span>
                  </div>
                )}

                <div>
                  {/* Top Bar: Name & Volume */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-outfit font-black text-xl text-white tracking-tight uppercase">
                      {plan.name}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#D7FF64] bg-[#D7FF64]/10 px-3 py-1 rounded-full border border-[#D7FF64]/20 font-bold">
                      {plan.volume}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl sm:text-5xl font-outfit font-black text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price.startsWith("$") && (
                      <span className="text-xs font-mono text-white/40">/ month</span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-white/60 font-sans font-light leading-relaxed mb-8">
                    {plan.tagline}
                  </p>

                  {/* Features List (Short & Crisp) */}
                  <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-8">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                        <div className="w-4 h-4 rounded-full bg-[#D7FF64]/10 border border-[#D7FF64]/30 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#D7FF64]" />
                        </div>
                        <span className="font-sans font-light">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={`${siteConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                    plan.whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300",
                    isPop
                      ? "bg-[#D7FF64] text-[#050505] hover:bg-[#e4ff88] shadow-[0_0_25px_rgba(215,255,100,0.3)] hover:scale-[1.02]"
                      : "bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/15 hover:border-white/30"
                  )}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Value Reassurance */}
        <div className="mt-12 text-center text-xs font-mono text-white/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>✓ NO HIDDEN FEES</span>
          <span>·</span>
          <span>✓ CANCEL OR PAUSE ANYTIME</span>
          <span>·</span>
          <span>✓ 100% SATISFACTION GUARANTEED</span>
        </div>

      </div>
    </section>
  );
}
