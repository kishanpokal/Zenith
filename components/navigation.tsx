"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { TextScramble } from "@/components/animations/text-scramble";

interface NavigationProps {
  onOpenContact?: () => void;
}

export function Navigation({ onOpenContact }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
      window.location.href = `/${href}`;
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.07] py-3 shadow-2xl"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* BRAND MARK (LEFT) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Zenith — Studio Home"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/[0.12] group-hover:border-[#D4AF37] transition-colors">
              <img
                src="/brand/Zenith-logo.jpeg"
                alt="Zenith"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 font-display font-bold tracking-tight text-[#F4F4F6] text-sm uppercase">
              <span>ZENITH</span>
              <span className="text-white/40 group-hover:text-white transition-colors">STUDIO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)] ml-0.5" />
            </div>
          </Link>

          {/* SECTION ANCHORS (CENTER) */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-white/60">
            <a
              href="#work"
              onClick={(e) => handleLinkClick(e, "#work")}
              className="hover:text-[#F4F4F6] transition-colors"
            >
              Work
            </a>
            <a
              href="#services"
              onClick={(e) => handleLinkClick(e, "#services")}
              className="hover:text-[#F4F4F6] transition-colors"
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => handleLinkClick(e, "#process")}
              className="hover:text-[#F4F4F6] transition-colors"
            >
              Process
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleLinkClick(e, "#pricing")}
              className="hover:text-[#F4F4F6] transition-colors"
            >
              Investment
            </a>
            <a
              href="#faq"
              onClick={(e) => handleLinkClick(e, "#faq")}
              className="hover:text-[#F4F4F6] transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* RIGHT: AVAILABILITY STATUS PILL & CTA */}
          <div className="flex items-center gap-3">
            {/* Availability Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121216] border border-white/[0.07] text-[10px] font-mono text-white/80 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-widest uppercase">AVAILABLE FOR SELECT PROJECTS</span>
            </div>

            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#121216] hover:bg-[#18181E] text-[#F4F4F6] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[11px] font-mono font-medium uppercase tracking-wider transition-all duration-200 group"
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm bg-[#121216] text-[#F4F4F6] border border-white/[0.07]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090B]/98 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden">
          <div className="flex flex-col gap-6 text-left max-w-md mx-auto w-full">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              DIRECTORY
            </div>

            {[
              { label: "01 // SELECTED WORK", href: "#work" },
              { label: "02 // CAPABILITIES", href: "#services" },
              { label: "03 // EDITORIAL PIPELINE", href: "#process" },
              { label: "04 // INVESTMENT", href: "#pricing" },
              { label: "05 // INQUIRIES", href: "#faq" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-2xl font-display font-bold text-[#F4F4F6] hover:text-[#D4AF37] transition-colors uppercase tracking-tight"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-6 mt-4 border-t border-white/[0.07] flex flex-col gap-3">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 text-center rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-sans text-xs uppercase tracking-wider"
              >
                Start Direct WhatsApp Inquiry ↗
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="w-full py-3 text-center rounded-sm bg-[#121216] text-white/70 font-mono text-xs border border-white/[0.07]"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
