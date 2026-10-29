"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/data/site-config";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import { PricingPlan, formatPlanPrice } from "@/data/pricing";

interface ContactSectionProps {
  initialPackage?: string;
  plans?: PricingPlan[];
  currencySymbol?: string;
}

export function ContactSection({
  initialPackage,
  plans,
  currencySymbol = "$",
}: ContactSectionProps = {}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    volume: initialPackage || "Starter (30 Reels)",
    details: "",
  });

  useEffect(() => {
    if (initialPackage) {
      setFormData((prev) => ({ ...prev, volume: initialPackage }));
    }
  }, [initialPackage]);

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
      className="section-editorial bg-[#09090B] relative overflow-hidden select-none border-b border-white/[0.07]"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container-editorial relative z-10">
        {/* Editorial Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] mb-4 text-[10px] font-mono text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>GET IN TOUCH</span>
          </div>

          <h2
            id="contact-title"
            className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-[#F4F4F6] leading-[1.0] mb-4"
          >
            LET&apos;S MAKE YOUR <br />
            <span className="font-serif italic font-normal text-[#D4AF37] lowercase">
              next great video.
            </span>
          </h2>

          <p className="text-sm text-white/70 font-sans leading-relaxed">
            Ready to upgrade your videos? Message us directly on WhatsApp or send a message below.
          </p>
        </div>

        {/* WhatsApp Mega Action */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 group min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>CHAT ON WHATSAPP</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Direct Email Inquiry Form */}
        <div className="max-w-xl mx-auto bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.07] text-[10px] font-mono text-white/50">
            <span className="uppercase tracking-wider">SEND AN EMAIL</span>
            <span className="text-[#D4AF37]">REPLIES WITHIN A FEW HOURS</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Rivers"
                className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@brand.com"
                className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                Scope / Retainer Level
              </label>
              <select
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer min-h-[48px]"
              >
                {plans && plans.length > 0 ? (
                  plans.map((p) => {
                    const priceFormatted = formatPlanPrice(p.price, currencySymbol);
                    const label = `${p.name} — ${p.volume} (${priceFormatted})`;
                    return (
                      <option key={p.id} value={label} className="bg-[#121216] text-white">
                        {label}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="Starter (30 Reels)" className="bg-[#121216] text-white">
                      Starter — 30 Reels / mo ($299)
                    </option>
                    <option value="Growth (60 Reels)" className="bg-[#121216] text-white">
                      Growth — 60 Reels / mo ($499)
                    </option>
                    <option value="VIP Retainer (Custom)" className="bg-[#121216] text-white">
                      VIP Retainer — Custom Volume (CUSTOM)
                    </option>
                    <option value="Custom Scope" className="bg-[#121216] text-white">
                      Custom Commercial / Single Master Project
                    </option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                Project Overview & Channels
              </label>
              <textarea
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Describe your current content, reference creators, or raw footage volume..."
                className="w-full px-4 py-3 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none min-h-[96px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Mail className="w-4 h-4" />
              <span>Send Project Brief ↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
