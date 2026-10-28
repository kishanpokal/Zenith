"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site-config";

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
    <section className="final" id="contact" aria-labelledby="final-title">
      <div className="final__pin">
        {/* Floating 3D Clip Frames in Background */}
        <div className="final__frames" aria-hidden="true">
          <figure
            className="final__f"
            style={{
              left: "6%",
              top: "12%",
              transform: "rotate(-6deg)",
              opacity: 0.35,
            }}
          >
            <img src="/images/projects/reel-6.jpg" alt="" />
          </figure>
          <figure
            className="final__f"
            style={{
              right: "8%",
              top: "14%",
              transform: "rotate(5deg)",
              opacity: 0.35,
            }}
          >
            <img src="/images/projects/reel-7.jpg" alt="" />
          </figure>
          <figure
            className="final__f"
            style={{
              left: "10%",
              bottom: "10%",
              transform: "rotate(4deg)",
              opacity: 0.35,
            }}
          >
            <img src="/images/projects/reel-8.jpg" alt="" />
          </figure>
          <figure
            className="final__f"
            style={{
              right: "12%",
              bottom: "12%",
              transform: "rotate(-4deg)",
              opacity: 0.35,
            }}
          >
            <img src="/images/projects/reel-9.jpg" alt="" />
          </figure>
        </div>

        {/* Pre-text */}
        <div className="final__pre" aria-hidden="true" style={{ textAlign: "center" }}>
          <p
            style={{
              letterSpacing: "0.3em",
              marginBottom: "0.4rem",
              color: "#94a3b8",
              fontFamily: "var(--mono)",
              fontSize: "12px",
            }}
          >
            YOU’VE SEEN THE WORK.
          </p>
          <p
            style={{
              letterSpacing: "0.3em",
              marginBottom: "0.4rem",
              color: "#94a3b8",
              fontFamily: "var(--mono)",
              fontSize: "12px",
            }}
          >
            YOU KNOW THE PROCESS.
          </p>
          <p
            style={{
              letterSpacing: "0.3em",
              marginBottom: "2.5rem",
              color: "#94a3b8",
              fontFamily: "var(--mono)",
              fontSize: "12px",
            }}
          >
            NOW LET’S BUILD <span className="text-[#D7FF64]">YOURS.</span>
          </p>
        </div>

        {/* Climax Display Headline */}
        <div
          className="final__main"
          style={{
            textAlign: "center",
            maxWidth: "960px",
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          <h2 className="display final__title" id="final-title" style={{ marginBottom: "3rem" }}>
            <span className="ln">
              <span>YOUR NEXT</span>
            </span>
            <span className="ln">
              <span className="text-[#D7FF64]">30 VIDEOS</span>
            </span>
            <span className="ln">
              <span>COULD LOOK</span>
            </span>
            <span className="ln">
              <span>VERY DIFFERENT.</span>
            </span>
          </h2>

          {/* Yash Edits Signature Mega Button */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
            <a
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mega"
              data-cursor="go"
            >
              <span className="mega__glow" aria-hidden="true"></span>
              <span className="mega__text">WORK WITH ZENITH EDITS</span>
              <span className="mega__arrow" aria-hidden="true">
                <span>↗</span>
                <span>↗</span>
              </span>
            </a>
          </div>

          <p className="final__alt mono" style={{ marginBottom: "4rem" }}>
            <span>OR REACH OUT DIRECTLY — </span>
            <a
              className="link"
              href={siteConfig.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#D7FF64", textDecoration: "underline" }}
            >
              WhatsApp Us Direct ↗
            </a>
          </p>

          {/* Quick Direct Email Form */}
          <div
            style={{
              background: "rgba(10, 18, 40, 0.75)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "24px",
              padding: "clamp(24px, 4vw, 44px)",
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "left",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>
              <span className="eyebrow__dot"></span>Direct Inquiry
            </p>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
              <div>
                <label
                  className="mono"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "6px",
                  }}
                >
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Rivers"
                  style={{
                    width: "100%",
                    background: "#030712",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  className="mono"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "6px",
                  }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  style={{
                    width: "100%",
                    background: "#030712",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  className="mono"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "6px",
                  }}
                >
                  DESIRED VOLUME
                </label>
                <select
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  style={{
                    width: "100%",
                    background: "#030712",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="Starter (30 Reels)">Starter — 30 Reels / mo ($299)</option>
                  <option value="Growth (60 Reels)">Growth — 60 Reels / mo ($499)</option>
                  <option value="Scale (100 Reels)">Scale — 100 Reels / mo ($799)</option>
                  <option value="Custom Scope">Custom Scope / Single Project</option>
                </select>
              </div>

              <div>
                <label
                  className="mono"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginBottom: "6px",
                  }}
                >
                  PROJECT OVERVIEW / GOALS
                </label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Tell us about your content, posting frequency, or channels..."
                  style={{
                    width: "100%",
                    background: "#030712",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                style={{ width: "100%", marginTop: "8px" }}
              >
                <span>Send Project Brief ↗</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
