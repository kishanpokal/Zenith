"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function WhyZenith() {
  const [activeTab, setActiveTab] = useState<"agency" | "zenith">("zenith");

  return (
    <>
      <section className="why wrap" id="why" aria-labelledby="why-title">
        <header className="sec-head">
          <p className="eyebrow">
            <span className="eyebrow__dot"></span>SC 05 — The Difference
          </p>
          <h2 className="display why__title" id="why-title">
            <span className="ln">
              <span>FREELANCER FLEXIBILITY.</span>
            </span>
            <span className="ln">
              <span className="text-[#D7FF64]">AGENCY-LEVEL EXECUTION.</span>
            </span>
          </h2>
        </header>

        {/* Tab Toggle matching Yash Edits */}
        <div className="why__toggle" role="tablist" aria-label="Compare">
          <button
            role="tab"
            aria-selected={activeTab === "agency"}
            onClick={() => setActiveTab("agency")}
          >
            Traditional agency
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "zenith"}
            onClick={() => setActiveTab("zenith")}
          >
            ZENITH EDITS
          </button>
          <span
            className="why__pill"
            aria-hidden="true"
            style={{
              width: "128px",
              transform: activeTab === "agency" ? "translateX(0px)" : "translateX(160px)",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          ></span>
        </div>

        {/* Comparison Routing Flow */}
        <div className="why__grid" data-focus={activeTab}>
          {/* Agency Column */}
          <div
            className={cn("why__col why__col--agency", activeTab === "agency" && "is-focus")}
          >
            <div className="why__path" aria-hidden="true">
              <span className="node mono">YOU</span>
              <i></i>
              <span className="node mono">ACCOUNT MGR</span>
              <i></i>
              <span className="node mono">PROJECT MGR</span>
              <i></i>
              <span className="node mono">EDITOR ?</span>
              <b className="why__packet"></b>
            </div>
            <h3 className="why__h mono">TRADITIONAL AGENCY</h3>
            <ul className="why__list">
              <li>
                <span>—</span>Account manager in the middle
              </li>
              <li>
                <span>—</span>Multiple handoffs & friction
              </li>
              <li>
                <span>—</span>Random editor assignments
              </li>
              <li>
                <span>—</span>Slower revision cycles
              </li>
            </ul>
          </div>

          <div className="why__vs mono" aria-hidden="true">
            VS
          </div>

          {/* Zenith Direct Column */}
          <div
            className={cn("why__col why__col--yash", activeTab === "zenith" && "is-focus")}
          >
            <div className="why__path why__path--direct" aria-hidden="true">
              <span className="node mono">YOU</span>
              <i></i>
              <span className="node node--y mono">ZENITH EDITS</span>
              <b className="why__packet"></b>
            </div>
            <h3 className="why__h mono">ZENITH EDITS</h3>
            <ul className="why__list">
              <li>
                <span>✓</span>Direct communication on WhatsApp & Frame.io
              </li>
              <li>
                <span>✓</span>Dedicated creative editor on every cut
              </li>
              <li>
                <span>✓</span>Consistent visual & audio brand guidelines
              </li>
              <li>
                <span>✓</span>Rapid 24–48h feedback turnaround
              </li>
              <li>
                <span>✓</span>Surgical quality control before export
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Editor Seam to Pricing */}
      <div className="seam" data-seam="" aria-hidden="true">
        <span className="seam__label mono">SC 06 — PRICING</span>
        <span className="seam__tc mono">00:00:00:00</span>
        <div className="seam__ruler">
          <span className="seam__head"></span>
        </div>
      </div>
    </>
  );
}
