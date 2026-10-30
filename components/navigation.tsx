"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { TextScramble } from "@/components/animations/text-scramble";

interface NavigationProps {
  onOpenContact?: () => void;
  isLightboxOpen?: boolean;
}

export function Navigation({ onOpenContact, isLightboxOpen = false }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactInView, setIsContactInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Hide sticky mobile action bar when near or inside #contact section
  useEffect(() => {
    const contactEl = document.getElementById("contact");
    if (!contactEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(contactEl);
    return () => observer.disconnect();
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

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#work");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 h-14 lg:h-16 flex items-center backdrop-blur-md bg-[#09090B]/80 border-b border-white/[0.07]",
          isScrolled && "bg-[#09090B]/95 border-white/[0.09] shadow-2xl"
        )}
      >
        <div className="container-editorial flex items-center justify-between h-full w-full">
          {/* BRAND MARK (LEFT) */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Zenith — Studio Home"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/[0.12] group-hover:border-[#D4AF37] transition-colors">
              <img
                src="/brand/zenith-badge.png"
                alt="Zenith Video Editing Studio Logo"
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
              className="hover:text-[#F4F4F6] transition-colors py-2"
            >
              Work
            </a>
            <a
              href="#services"
              onClick={(e) => handleLinkClick(e, "#services")}
              className="hover:text-[#F4F4F6] transition-colors py-2"
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => handleLinkClick(e, "#process")}
              className="hover:text-[#F4F4F6] transition-colors py-2"
            >
              Process
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleLinkClick(e, "#pricing")}
              className="hover:text-[#F4F4F6] transition-colors py-2"
            >
              Investment
            </a>
            <a
              href="#faq"
              onClick={(e) => handleLinkClick(e, "#faq")}
              className="hover:text-[#F4F4F6] transition-colors py-2"
            >
              FAQ
            </a>
          </nav>

          {/* RIGHT: AVAILABILITY STATUS PILL & CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Availability Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121216] border border-white/[0.07] text-[10px] font-mono text-white/80 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-widest uppercase">AVAILABLE FOR PROJECTS</span>
            </div>

            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#121216] hover:bg-[#18181E] text-[#F4F4F6] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[11px] font-mono font-medium uppercase tracking-wider transition-all duration-200 group"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm bg-[#121216] text-[#F4F4F6] border border-white/[0.07] min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors hover:border-[#D4AF37]/50"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FLOATING BOTTOM ACTION BAR (Auto-hides when lightbox, menu, or #contact is visible) */}
      {!isLightboxOpen && !mobileMenuOpen && !isContactInView && (
        <div className="md:hidden fixed bottom-4 inset-x-4 z-40 flex items-center gap-2 p-1 rounded-full bg-[#121216]/90 backdrop-blur-xl border border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-3 duration-300 h-12">
          <a
            href="#work"
            onClick={scrollToWork}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[#F4F4F6] type-timecode text-[11px] font-semibold tracking-wider transition-colors select-none"
          >
            <span className="text-[#D4AF37]">▶</span>
            <span>Watch Work</span>
          </a>

          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 h-10 px-4 rounded-full bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] type-timecode text-[11px] font-bold tracking-wider transition-colors shadow-md select-none"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* MOBILE MENU DRAWER — Full screen overlay with large editorial links */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090B]/95 backdrop-blur-xl flex flex-col justify-center px-6 sm:px-8 md:hidden overflow-y-auto">
          <div className="flex flex-col gap-5 text-left max-w-md mx-auto w-full pt-16 pb-8">
            <div className="type-timecode text-[#D4AF37] mb-1 flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              DIRECTORY
            </div>

            {[
              { label: "01 // SELECTED WORK", href: "#work" },
              { label: "02 // 9:16 VERTICAL REELS", href: "#vertical-reels" },
              { label: "03 // EDITING CRAFT & PROOF", href: "#before-after" },
              { label: "04 // CAPABILITIES", href: "#services" },
              { label: "05 // PIPELINE", href: "#process" },
              { label: "06 // INVESTMENT", href: "#pricing" },
              { label: "07 // INQUIRIES", href: "#faq" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] hover:text-[#D4AF37] transition-colors uppercase tracking-tight min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-5 mt-2 border-t border-white/[0.07] flex flex-col gap-3">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 flex items-center justify-center rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-sans text-xs uppercase tracking-wider min-h-[48px]"
              >
                Start Direct WhatsApp Inquiry ↗
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="w-full h-11 flex items-center justify-center rounded-sm bg-[#121216] text-white/70 font-mono text-xs border border-white/[0.07] min-h-[44px]"
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
