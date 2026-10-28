"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { Lock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer__top wrap">
        <div className="footer__brand">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <img
              src="/brand/Zenith-logo.jpeg"
              alt="Zenith Logo"
              className="w-8 h-8 rounded-full object-cover border border-[rgba(148,163,184,0.3)] shadow-[0_0_12px_rgba(37,99,255,0.4)]"
            />
            <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.04em", color: "#ffffff" }}>
              ZENITH EDITS
            </span>
          </div>
          <p className="footer__role">Premium Short-Form Video Editing Studio</p>
          <p className="footer__state mono">
            <span className="eyebrow__dot"></span>Available for select creator & brand partnerships
          </p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <a href="#work" className="link">
            WORK
          </a>
          <a href="#services" className="link">
            SERVICES
          </a>
          <a href="#process" className="link">
            PROCESS
          </a>
          <a href="#pricing" className="link">
            PRICING
          </a>
          <a href="#faq" className="link">
            FAQ
          </a>
          <a
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            CONTACT
          </a>
        </nav>

        <div className="footer__social">
          <a
            className="link"
            href={siteConfig.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ↗
          </a>
        </div>
      </div>

      <div className="footer__map wrap">
        <div>
          <p>Disciplines</p>
          <ul>
            <li>Short-form video editing</li>
            <li>Instagram Reels editing</li>
            <li>TikTok video editing</li>
            <li>YouTube Shorts editing</li>
            <li>Talking-head retention editing</li>
            <li>Motion graphics & kinetic captions</li>
          </ul>
        </div>

        <div>
          <p>Who It’s For</p>
          <ul>
            <li>Content creators & YouTubers</li>
            <li>Coaches & educators</li>
            <li>High-growth founders & CEOs</li>
            <li>Personal brands & executives</li>
            <li>Media agencies (white-label)</li>
          </ul>
        </div>

        <div>
          <p>Navigation</p>
          <ul>
            <li>
              <a href="#work">Selected Work</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#process">Process Pipeline</a>
            </li>
            <li>
              <a href="#pricing">Pricing Packages</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <p>Direct Contact</p>
          <ul>
            <li>
              <a href={siteConfig.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp: Direct Chat ↗
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            </li>
            <li>Timezone: Global Remote (EST / GMT / IST)</li>
          </ul>
        </div>
      </div>

      <div
        className="wrap"
        style={{
          borderTop: "1px solid rgba(148, 163, 184, 0.12)",
          paddingTop: "24px",
          paddingBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "#64748b",
          fontFamily: "var(--mono)",
        }}
      >
        <span>&copy; {currentYear} ZENITH EDITS. ALL RIGHTS RESERVED.</span>
        <span>REC 60FPS • 1080x1920 NATIVE • 00:00:00:00</span>
      </div>
    </footer>
  );
}
