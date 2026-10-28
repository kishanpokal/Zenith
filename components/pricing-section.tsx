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
    tagline: "For creators establishing momentum and weekly output.",
    features: [
      "30 High-retention vertical reels",
      "Surgical cut cadence & zero dead air",
      "Dynamic typography & contextual B-roll",
      "Multi-track Foley sound architecture",
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
    tagline: "For scaling creators demanding maximum narrative velocity.",
    features: [
      "60 High-retention vertical reels",
      "Advanced kinetic vector motion design",
      "Psycho-acoustic Foley & 40Hz sub risers",
      "Kodak 2383 cinematic film print LUT",
      "Priority 24-48h turnaround & revisions",
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
      "Short-form reels + YouTube longform cuts",
      "Dedicated lead post-production editor",
      "Custom brand typography & vector assets",
      "Same-day 24h turnaround pipeline",
      "Direct private Slack / WhatsApp channel",
    ],
    ctaText: "Inquire VIP Retainer",
    whatsappMessage: "Hi Zenith! I want to discuss a custom VIP Retainer for my channel/brand.",
  },
];

export function PricingSection({ onSelectPackage }: PricingSectionProps = {}) {
  return (
    <section
      className="py-20 sm:py-28 bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="pricing"
      aria-label="Zenith Post-Production Investment"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>SC 04 // INVESTMENT TIERS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]">
              CONTENT ENGINES <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                scaled.
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/60 max-w-md font-sans leading-relaxed md:text-right">
            Choose your volume. Zenith manages ingest, cutting, sound design, and master export with zero friction.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isPop = plan.popular;

            return (
              <div
                key={plan.id}
                className={cn(
                  "p-7 sm:p-8 rounded-xl border transition-all duration-200 relative flex flex-col justify-between group",
                  isPop
                    ? "bg-[#121216] border-[#D4AF37]/50 shadow-xl ring-1 ring-[#D4AF37]/40"
                    : "bg-[#121216]/60 border-white/[0.07] hover:border-white/[0.18]"
                )}
              >
                {/* Popular Badge */}
                {isPop && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-sm bg-[#D4AF37] text-[#09090B] font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 fill-current" />
                    <span>RECOMMENDED CHOICE</span>
                  </div>
                )}

                <div>
                  {/* Top Bar: Name & Volume */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-bold text-lg text-[#F4F4F6] tracking-tight uppercase">
                      {plan.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-sm border border-[#D4AF37]/20 font-semibold">
                      {plan.volume}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl sm:text-4xl font-display font-bold text-[#F4F4F6] tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price.startsWith("$") && (
                      <span className="text-[10px] font-mono text-white/40">/ month</span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-white/60 font-sans leading-relaxed mb-6">
                    {plan.tagline}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-5 border-t border-white/[0.07] mb-6">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-white/80">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="font-sans font-normal">{feat}</span>
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
                    "w-full py-3 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors",
                    isPop
                      ? "bg-[#D4AF37] text-[#09090B] hover:bg-[#F59E0B] shadow-sm"
                      : "bg-[#09090B] text-white hover:bg-[#18181E] border border-white/[0.08]"
                  )}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Value Reassurance */}
        <div className="mt-12 text-center text-[10px] font-mono text-white/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
