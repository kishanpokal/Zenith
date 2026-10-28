"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";

interface NavigationProps {
  onOpenContact?: () => void;
}

export function Navigation({ onOpenContact }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
      window.location.href = `/${href}`;
      return;
    }
    window.location.href = href;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* LOGO */}
          <a
            href="#top"
            onClick={(e) => handleLinkClick(e, "#top")}
            className="flex items-center gap-3 group"
            aria-label="ZENITH EDITS — back to top"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-[#D7FF64] transition-colors">
              <img
                src="/brand/Zenith-logo.jpeg"
                alt="Zenith Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5 font-outfit font-black tracking-tight text-white text-base">
              <span>ZENITH</span>
              <span className="text-white/50 group-hover:text-white transition-colors">EDITS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64] shadow-[0_0_8px_#D7FF64] animate-pulse ml-0.5" />
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-white/60">
            <a
              href="#work"
              onClick={(e) => handleLinkClick(e, "#work")}
              className="hover:text-white transition-colors"
            >
              Work
            </a>
            <a
              href="#services"
              onClick={(e) => handleLinkClick(e, "#services")}
              className="hover:text-white transition-colors"
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => handleLinkClick(e, "#process")}
              className="hover:text-white transition-colors"
            >
              Process
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleLinkClick(e, "#pricing")}
              className="hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => handleLinkClick(e, "#faq")}
              className="hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* CTA & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 hover:border-[#D7FF64]/50 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 group"
            >
              <span>Start Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D7FF64] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Mobile Burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-white border border-white/10"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden">
          <div className="flex flex-col gap-6 text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-[#D7FF64] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]" />
              NAVIGATION
            </div>

            {[
              { label: "01 Work", href: "#work" },
              { label: "02 Services", href: "#services" },
              { label: "03 Process", href: "#process" },
              { label: "04 Pricing", href: "#pricing" },
              { label: "05 FAQ", href: "#faq" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-3xl font-outfit font-black text-white hover:text-[#D7FF64] transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-8 mt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 text-center rounded-xl bg-[#D7FF64] text-[#050505] font-black font-outfit text-sm uppercase tracking-wider"
              >
                Start a project on WhatsApp ↗
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="w-full py-3 text-center rounded-xl bg-white/5 text-white/70 font-mono text-xs"
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