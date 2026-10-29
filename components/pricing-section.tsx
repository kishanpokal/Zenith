"use client";

import React from "react";
import { siteConfig } from "@/data/site-config";
import { Check, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PricingSettings,
  DEFAULT_PRICING_SETTINGS,
  formatPlanPrice,
} from "@/data/pricing";

interface PricingSectionProps {
  onSelectPackage?: (pkg: string) => void;
  pricingSettings?: PricingSettings;
}

export function PricingSection({
  onSelectPackage,
  pricingSettings,
}: PricingSectionProps = {}) {
  const config = pricingSettings || DEFAULT_PRICING_SETTINGS;
  const currencySymbol = config.currencySymbol || "$";
  const plans =
    config.plans && config.plans.length > 0
      ? config.plans
      : DEFAULT_PRICING_SETTINGS.plans;

  return (
    <section
      className="section-editorial bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="pricing"
      aria-label="Zenith Post-Production Investment"
    >
      <div className="container-editorial relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>PACKAGES & PRICING</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]">
              {config.headline || "SIMPLE PRICING."} <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                {config.headlineHighlight || "zero guesswork."}
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/70 max-w-md font-sans leading-relaxed md:text-right">
            {config.subheadline ||
              "Choose a package that fits your publishing schedule. No surprise fees."}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          className={cn(
            "grid gap-6 sm:gap-8 items-stretch",
            plans.length === 1 && "grid-cols-1 max-w-md mx-auto",
            plans.length === 2 && "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto",
            plans.length >= 3 && "grid-cols-1 lg:grid-cols-3"
          )}
        >
          {plans.map((plan) => {
            const isPop = !!plan.popular;
            const displayPrice = formatPlanPrice(plan.price, currencySymbol);
            const isCustom = /^custom$/i.test((plan.price || "").trim());
            const cadence =
              plan.cadence !== undefined && plan.cadence !== null
                ? plan.cadence
                : isCustom
                ? ""
                : "/ month";

            // If a custom whatsappMessage is set, ensure any old hardcoded price prefix matches displayPrice
            let whatsappMsg =
              plan.whatsappMessage ||
              `Hi Zenith! I want to start a project with the ${plan.name} package (${plan.volume} / ${displayPrice}).`;
            if (currencySymbol !== "$" && whatsappMsg.includes("$")) {
              whatsappMsg = whatsappMsg.replace(
                /\$[0-9,.]+/g,
                displayPrice
              );
            }

            return (
              <div
                key={plan.id}
                className={cn(
                  "p-6 xl:p-8 rounded-xl border transition-all duration-200 relative flex flex-col justify-between group h-full",
                  isPop
                    ? "bg-[#121216] border-[#D4AF37] shadow-xl ring-1 ring-[#D4AF37]/50"
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

                <div className="flex-1 flex flex-col">
                  {/* Top Bar: Name & Volume */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-bold text-lg text-[#F4F4F6] tracking-tight uppercase">
                      {plan.name}
                    </span>
                    {plan.volume && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-sm border border-[#D4AF37]/20 font-semibold">
                        {plan.volume}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl sm:text-4xl font-display font-bold text-[#F4F4F6] tracking-tight">
                      {displayPrice}
                    </span>
                    {cadence && (
                      <span className="text-[10px] font-mono text-white/40">
                        {cadence}
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  {plan.tagline && (
                    <p className="text-xs text-white/60 font-sans leading-relaxed mb-6">
                      {plan.tagline}
                    </p>
                  )}

                  {/* Features List with flex-1 so CTA buttons align across cards */}
                  <div className="space-y-2.5 pt-5 border-t border-white/[0.07] mb-6 flex-1">
                    {plan.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-xs text-white/80"
                      >
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="font-sans font-normal">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                {(() => {
                  const whatsappBase = siteConfig.contact.whatsappNumber
                    ? `https://wa.me/${siteConfig.contact.whatsappNumber}`
                    : siteConfig.contact.whatsappUrl.split("?")[0];
                  const planWhatsAppUrl = `${whatsappBase}?text=${encodeURIComponent(
                    whatsappMsg
                  )}`;

                  return (
                    <a
                      href={planWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onSelectPackage?.(plan.name)}
                      className={cn(
                        "w-full py-3 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors min-h-[44px]",
                        isPop
                          ? "bg-[#D4AF37] text-[#09090B] hover:bg-[#F59E0B] shadow-sm"
                          : "bg-[#09090B] text-white hover:bg-[#18181E] border border-white/[0.08]"
                      )}
                    >
                      <span>{plan.ctaText || "Discuss your project"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  );
                })()}
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
