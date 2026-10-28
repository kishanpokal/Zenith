"use client";

import React from "react";
import { testimonialsConfig } from "@/data/testimonials";
import { MessageSquare, Quote, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  if (!testimonialsConfig.showSection) return null;

  return (
    <section className="py-24 bg-[#080808] border-b border-[#1c1c1c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-accent uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>07 — CLIENT FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F2] tracking-tighter uppercase font-sans mb-4">
            {testimonialsConfig.headline}
          </h2>
          <p className="text-base sm:text-lg text-[#A0A09C] leading-relaxed">
            {testimonialsConfig.subheadline}
          </p>
        </div>

        {/* If verified feedback is available */}
        {testimonialsConfig.hasVerifiedFeedback && testimonialsConfig.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialsConfig.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#101010] border border-[#222222] rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-6 h-6 text-accent mb-4 opacity-70" />
                  <p className="text-sm text-[#F5F5F2] leading-relaxed mb-6 font-normal">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white font-sans">{item.clientName}</div>
                    <div className="text-xs text-[#8E8E93] font-mono">{item.role}</div>
                  </div>
                  {item.verified && (
                    <span className="text-[10px] font-mono text-accent flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Honest, elegant placeholder card explaining Zenith's standard */
          <div className="max-w-3xl mx-auto bg-[#0d0d0d] border border-[#222222] rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#2a2a2a] text-accent flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F2] mb-3 uppercase font-sans">
              VERIFIED CASE STUDIES IN PROGRESS
            </h3>

            <p className="text-xs sm:text-sm text-[#A0A09C] leading-relaxed max-w-xl mx-auto mb-6">
              {testimonialsConfig.placeholderNotice}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-[#262626] text-xs font-mono text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>We prove quality through a single paid test edit before retainers.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
