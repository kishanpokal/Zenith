"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09090B] border-t border-white/[0.07] text-[#F4F4F6]" aria-label="Footer">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-white/[0.07]">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/[0.12]">
                  <img
                    src="/brand/Zenith-logo.jpeg"
                    alt="Zenith"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-display font-bold text-base tracking-tight text-white uppercase">
                  ZENITH STUDIO
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>
              <p className="text-xs text-white/60 max-w-sm font-sans leading-relaxed mb-4">
                High-impact video editing for creators and brands. Fast pacing, clean sound, and motion graphics that keep viewers watching.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#121216] border border-white/[0.07] text-[10px] font-mono text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase">AVAILABLE FOR NEW PROJECTS</span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-4 font-semibold">
              NAVIGATION
            </div>
            <ul className="space-y-2.5 text-xs font-mono text-white/60">
              <li>
                <a href="#work" className="hover:text-white transition-colors">01 // Work</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">02 // Services</a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">03 // How It Works</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">04 // Pricing</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">05 // FAQ</a>
              </li>
            </ul>
          </div>

          {/* Disciplines */}
          <div className="md:col-span-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-4 font-semibold">
              WHAT WE DO
            </div>
            <ul className="space-y-2 text-xs font-sans text-white/60">
              <li>Shorts & Reels Editing</li>
              <li>YouTube Longform Videos</li>
              <li>Sound Design & Audio Mix</li>
              <li>Cinematic Color Grading</li>
              <li>Animated Subtitles & Motion Graphics</li>
            </ul>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-4 font-semibold">
              CONTACT
            </div>
            <ul className="space-y-2 text-xs font-mono text-white/60">
              <li>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#D4AF37] transition-colors"
                >
                  WhatsApp Direct ↗
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-white/60 hover:text-white transition-colors truncate block"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="text-white/40 text-[10px] pt-1">
                Global Remote (EST / GMT / IST)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/40">
          <div>
            &copy; {currentYear} ZENITH EDITS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-3">
            <span>PRORES 422 HQ</span>
            <span>·</span>
            <span>4K 60FPS</span>
            <span>·</span>
            <span className="text-[#D4AF37]">LOCKED TIMECODE 24.00</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
