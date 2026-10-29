"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    num: "01",
    question: "What types of videos do you edit?",
    answer:
      "We edit short-form Reels, TikToks, YouTube Shorts, podcasts, talking-head videos, and long-form YouTube videos. All videos are edited to keep viewers watching longer.",
  },
  {
    num: "02",
    question: "How do I send my raw video files?",
    answer:
      "You can upload your video files to Google Drive, Dropbox, or OneDrive and share the link with us. It takes less than 2 minutes.",
  },
  {
    num: "03",
    question: "Can you match my brand or channel style?",
    answer:
      "Yes. Share 2–3 links or past videos you like, and we will match your exact font, colors, subtitle style, and cut pacing.",
  },
  {
    num: "04",
    question: "How do revisions work?",
    answer:
      "We send you a private preview link where you can watch the video and leave notes. We make quick edits until you are 100% happy with the final video.",
  },
  {
    num: "05",
    question: "Do you include sound effects and music?",
    answer:
      "Yes. Every video includes sound effects (whooshes, pops, impacts) and clean background music that fits your content without copyright strikes.",
  },
  {
    num: "06",
    question: "How fast is delivery?",
    answer:
      "First cuts are delivered within 24 to 48 hours so you can post consistently without delays.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      className="section-editorial bg-[#09090B] border-b border-white/[0.07]"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="container-editorial">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-3 text-[10px] font-mono text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>FREQUENT QUESTIONS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0]" id="faq-title">
              QUESTIONS & <br />
              <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
                answers.
              </span>
            </h2>
          </div>

          <p className="text-sm text-white/70 max-w-md font-sans leading-relaxed">
            Quick, honest answers about turnaround time, revisions, file transfer, and pricing.
          </p>
        </div>

        {/* Accordion List: Constrained to max-w-3xl for optimal 60-75ch line length */}
        <div className="divide-y divide-white/[0.07] border-y border-white/[0.07] max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.num} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full py-4 sm:py-5 flex items-center justify-between text-left group gap-4 min-h-[52px]"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold shrink-0">
                      {faq.num}
                    </span>
                    <span className="text-sm sm:text-base font-display font-semibold text-[#F4F4F6] group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                      {faq.question}
                    </span>
                  </div>

                  <span className="w-7 h-7 rounded-sm bg-[#121216] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/70 group-hover:border-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-all">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-5 pl-8 sm:pl-10 pr-4 text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-2xl animate-in fade-in duration-200">
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
