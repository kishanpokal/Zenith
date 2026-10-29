"use client";

import React from "react";
import { testimonialsConfig } from "@/data/testimonials";
import { MessageSquare, Quote, Sparkles, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  if (!testimonialsConfig.showSection) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#09090B] border-b border-white/[0.07] relative">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CLIENT REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-[#F4F4F6] tracking-tight uppercase leading-[1.0] mb-4">
            {testimonialsConfig.headline}
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
            {testimonialsConfig.subheadline}
          </p>
        </div>

        {/* If verified feedback is available */}
        {testimonialsConfig.hasVerifiedFeedback && testimonialsConfig.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialsConfig.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-5 h-5 text-[#D4AF37] mb-4 opacity-75" />
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 font-normal font-sans">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-display font-semibold text-white uppercase">{item.clientName}</div>
                    <div className="text-[10px] text-white/40 font-mono">{item.role}</div>
                  </div>
                  {item.verified && (
                    <span className="text-[10px] font-mono text-[#D4AF37] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-[#121216] border border-white/[0.07] rounded-xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
            <div className="w-10 h-10 rounded-full bg-[#09090B] border border-white/[0.08] text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-4 h-4" />
            </div>

            <h3 className="text-base sm:text-lg font-display font-bold text-[#F4F4F6] mb-2 uppercase">
              VERIFIED CLIENT AUDITS IN PROGRESS
            </h3>

            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-lg mx-auto mb-6 font-sans">
              {testimonialsConfig.placeholderNotice}
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#09090B] border border-white/[0.07] text-[10px] font-mono text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>We prove quality through a single paid test cut before retainers.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
