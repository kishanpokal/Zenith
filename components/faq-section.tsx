"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    num: "01",
    question: "What types of content does Zenith specialize in?",
    answer:
      "We specialize in high-retention commercial reels, talking-head creator videos, documentary essays, podcasts cuts, and kinetic typography trailers. We optimize specifically for ruthless retention across YouTube, Instagram, and TikTok.",
  },
  {
    num: "02",
    question: "How do we transfer raw footage?",
    answer:
      "You can transfer raw camera takes via Google Drive, Dropbox, Aspera, OneDrive, or Frame.io. Simply drop your media and any assets into your dedicated client folder.",
  },
  {
    num: "03",
    question: "Can you match our studio's existing visual style?",
    answer:
      "Yes. Provide 2–3 reference links or existing assets, and we will reverse-engineer the cut pacing, graphic hierarchy, and sound design to match or elevate your exact visual identity.",
  },
  {
    num: "04",
    question: "How do revisions work?",
    answer:
      "We provide timestamped Frame.io / preview links where you can leave pinpoint feedback directly on individual frames. We iterate rapidly until you give picture lock approval.",
  },
  {
    num: "05",
    question: "Do you supply sound effects and licensed music?",
    answer:
      "Yes. Every edit includes a multi-track mix with high-impact Foley effects (whooshes, risers, paper snaps, transients) and licensed commercial background audio.",
  },
  {
    num: "06",
    question: "How fast is the turnaround?",
    answer:
      "Initial cuts are delivered within 24 to 48 hours from footage ingest. We prioritize velocity so your publishing cadence never stalls.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      className="py-20 sm:py-28 bg-[#09090B] border-b border-white/[0.07]"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>SCENE 06 // FAQ</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]" id="faq-title">
              BEFORE WE <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                start.
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/60 max-w-md font-sans leading-relaxed">
            Direct, transparent answers regarding post-production turnaround, revision protocol, and sound architecture.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-white/[0.07] border-y border-white/[0.07] max-w-4xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.num} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full py-6 flex items-center justify-between text-left group gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                      {faq.num}
                    </span>
                    <span className="text-base sm:text-lg font-display font-semibold text-[#F4F4F6] group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                      {faq.question}
                    </span>
                  </div>

                  <span className="w-7 h-7 rounded-sm bg-[#121216] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/70 group-hover:border-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-all">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 pl-10 pr-4 text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-2xl animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const FAQSection = FaqSection;
