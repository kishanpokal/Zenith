"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    num: "01",
    question: "What type of content do you edit?",
    answer:
      "We specialize in high-retention short-form video for Instagram Reels, TikTok, and YouTube Shorts. This includes talking-head videos, educational content, podcasts clips, founder breakdowns, and promotional product trailers.",
  },
  {
    num: "02",
    question: "How do I send footage?",
    answer:
      "You can send footage via Google Drive, Dropbox, OneDrive, or Frame.io. Simply upload your raw clips and any branding assets into a shared folder.",
  },
  {
    num: "03",
    question: "Can you match my existing editing style?",
    answer:
      "Yes. Send us 2–3 links of videos you like (yours or other creators), and we will analyze the cut cadence, caption animation, and sound palette to match or elevate that exact look.",
  },
  {
    num: "04",
    question: "Can you create a custom visual style for my brand?",
    answer:
      "Absolutely. We can establish custom font pairings, brand colors, motion graphic badges, and sound effects tailored exclusively to your personal brand.",
  },
  {
    num: "05",
    question: "How do revisions work?",
    answer:
      "You receive review links where you can leave timestamped comments directly on the video frames. We iterate quickly until the cut meets your standard.",
  },
  {
    num: "06",
    question: "Do you source B-roll and sound effects?",
    answer:
      "Yes. We select relevant, high-resolution B-roll, motion graphics, sound effects (whooshes, risers, impacts), and licensed commercial background music.",
  },
  {
    num: "07",
    question: "How quickly can we begin?",
    answer:
      "Immediately. As soon as you select a package and upload your raw footage, we can deliver your first edited cut within 24–48 hours.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq wrap" id="faq" aria-labelledby="faq-title">
      <header className="sec-head sec-head--split">
        <div>
          <p className="eyebrow">
            <span className="eyebrow__dot"></span>SC 07 — FAQ
          </p>
          <h2 className="display" id="faq-title">
            <span className="ln">
              <span>BEFORE</span>
            </span>
            <span className="ln">
              <span>
                WE <span className="txt-blue">START.</span>
              </span>
            </span>
          </h2>
        </div>
        <p className="sec-head__copy">
          Direct answers about the editing, workflow, and expectations.
        </p>
      </header>

      <div className="faq__list" data-faq="">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.num} className={cn("faq__item", isOpen && "is-open")}>
              <button
                className="faq__q"
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
              >
                <span className="faq__n mono">{faq.num}</span>
                <span>{faq.question}</span>
                <span
                  className="faq__ico"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: isOpen ? "#38bdf8" : "#94a3b8",
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div
                  className="faq__a"
                  style={{
                    display: "block",
                    paddingBottom: "24px",
                    color: "#94a3b8",
                    lineHeight: "1.7",
                    fontSize: "15px",
                    maxWidth: "800px",
                  }}
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const FAQSection = FaqSection;
