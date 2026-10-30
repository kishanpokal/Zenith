"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/data/site-config";
import {
  ArrowUpRight,
  Mail,
  MessageSquare,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
    projectType: initialPackage || "Starter (30 Reels)",
    budget: "$1,000 - $3,000",
    message: "",
    website_honeypot: "", // Bot spam trap
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialPackage) {
      setFormData((prev) => ({ ...prev, projectType: initialPackage }));
    }
  }, [initialPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          data.error ||
            "Unable to deliver message automatically. You can send it directly through your mail app below."
        );
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        "Network connection error. You can click below to open your email client directly."
      );
    }
  };

  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(`Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nSelected Scope: ${formData.projectType}\nEstimated Budget: ${formData.budget}\nProject Details:\n${formData.message}`
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
            Ready to upgrade your videos? Message us directly on WhatsApp or submit your project brief below.
          </p>
        </div>

        {/* Direct Channels: WhatsApp & Phone */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 sm:mb-12">
          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 group min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp ({siteConfig.contact.whatsappDisplay})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <a
            href={siteConfig.contact.phoneUrl || `tel:${siteConfig.contact.whatsappNumber}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-sm bg-[#121216] hover:bg-[#18181E] text-white border border-white/[0.08] hover:border-[#D4AF37]/50 font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 min-h-[48px]"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>Call: {siteConfig.contact.whatsappDisplay}</span>
          </a>
        </div>

        {/* Direct Email Inquiry Form */}
        <div className="max-w-xl mx-auto bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-white/[0.07] text-[10px] font-mono text-white/50">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider text-white/70">SUBMIT PROJECT BRIEF</span>
              <span>·</span>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-[#D4AF37] hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </div>
            <span className="text-[#D4AF37]">REPLIES WITHIN 24 HOURS</span>
          </div>

          {status === "success" ? (
            <div className="text-center py-8 px-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
                PROJECT BRIEF DELIVERED
              </h3>
              <p className="text-sm font-sans text-white/70 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-white font-medium">{formData.name}</span>. Your brief has been sent directly to our lead editor. We&apos;ll review your requirements and reply to <span className="text-[#D4AF37] font-medium">{formData.email}</span> within 24 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setFormData({
                      name: "",
                      email: "",
                      projectType: initialPackage || "Starter (30 Reels)",
                      budget: "$1,000 - $3,000",
                      message: "",
                      website_honeypot: "",
                    });
                  }}
                  className="px-6 py-2.5 rounded-sm bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono uppercase tracking-wider text-white transition-colors"
                >
                  Send Another Brief
                </button>
                <a
                  href={siteConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invisible Bot Honeypot Input */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <label htmlFor="website_honeypot">Website (leave empty)</label>
                <input
                  id="website_honeypot"
                  type="text"
                  name="website_honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_honeypot}
                  onChange={(e) =>
                    setFormData({ ...formData, website_honeypot: e.target.value })
                  }
                />
              </div>

              {status === "error" && (
                <div className="p-3.5 rounded-sm bg-red-500/10 border border-red-500/30 text-xs font-sans text-red-300 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleMailtoFallback}
                      className="text-xs font-mono text-[#D4AF37] underline hover:text-[#F59E0B]"
                    >
                      Click here to send directly via your Mail app ↗
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Rivers"
                  disabled={status === "loading"}
                  className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px] disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@brand.com"
                  disabled={status === "loading"}
                  className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors min-h-[48px] disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                    Scope / Retainer Level
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    disabled={status === "loading"}
                    className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-sm font-sans focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer min-h-[48px] disabled:opacity-50"
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
                        <option value="Commercial / Single Master Cut" className="bg-[#121216] text-white">
                          Commercial / Single Master Cut
                        </option>
                        <option value="YouTube Longform Retainer" className="bg-[#121216] text-white">
                          YouTube Longform Retainer
                        </option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                    Estimated Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    disabled={status === "loading"}
                    className="w-full px-4 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-sm font-sans focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer min-h-[48px] disabled:opacity-50"
                  >
                    <option value="Under $1,000" className="bg-[#121216] text-white">
                      Under $1,000 / month
                    </option>
                    <option value="$1,000 - $3,000" className="bg-[#121216] text-white">
                      $1,000 - $3,000 / month
                    </option>
                    <option value="$3,000 - $5,000" className="bg-[#121216] text-white">
                      $3,000 - $5,000 / month
                    </option>
                    <option value="$5,000+" className="bg-[#121216] text-white">
                      $5,000+ / Custom Retainer
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 uppercase tracking-wider mb-1.5">
                  Project Overview & References
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={status === "loading"}
                  placeholder="Describe your content format, reference channels, or current volume..."
                  className="w-full px-4 py-3 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-base font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none min-h-[96px] disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] disabled:bg-[#D4AF37]/50 text-[#09090B] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[48px] cursor-pointer disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Delivering Brief...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Project Brief ↗</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
