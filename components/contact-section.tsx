"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site-config";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";

interface ContactSectionProps {
  initialPackage?: string;
}

export function ContactSection({ initialPackage }: ContactSectionProps = {}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    volume: initialPackage || "Starter (30 Reels)",
    details: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nSelected Package: ${formData.volume}\nProject Details:\n${formData.details}`
    );
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      className="py-24 sm:py-32 bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-4 text-[10px] font-mono text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>SCENE 07 // INITIATE COLLABORATION</span>
          </div>

          <h2
            id="contact-title"
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0] mb-4"
          >
            YOUR NEXT VIDEOS <br />
            <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
              could look different.
            </span>
          </h2>

          <p className="text-sm text-white/60 font-sans leading-relaxed">
            Ready to elevate your post-production retention? Send a brief directly to our lead editor.
          </p>
        </div>

        {/* WhatsApp Mega Action */}
        <div className="flex justify-center mb-12">
          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>START ON WHATSAPP DIRECT</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Direct Email Inquiry Form */}
        <div className="max-w-xl mx-auto bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.07] text-[10px] font-mono text-white/50">
            <span className="uppercase tracking-wider">PROJECT BRIEF DISPATCH</span>
            <span className="text-[#D4AF37]">RESPONSE WITHIN 6 HOURS</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Rivers"
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@brand.com"
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                Scope / Retainer Level
              </label>
              <select
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
              >
                <option value="Starter (30 Reels)" className="bg-[#121216] text-white">Starter — 30 Reels / mo ($299)</option>
                <option value="Growth (60 Reels)" className="bg-[#121216] text-white">Growth — 60 Reels / mo ($499)</option>
                <option value="Scale (100 Reels)" className="bg-[#121216] text-white">Scale — 100 Reels / mo ($799)</option>
                <option value="Custom Scope" className="bg-[#121216] text-white">Custom Commercial / Single Master Project</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1.5">
                Project Overview & Channels
              </label>
              <textarea
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Describe your current content, reference creators, or raw footage volume..."
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Project Brief ↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
