"use client";

import React, { useState } from "react";

export function BeforeAfter() {
  const [split, setSplit] = useState(50);

  return (
    <section className="ba wrap" id="before-after" aria-labelledby="ba-title">
      <header className="sec-head sec-head--split">
        <div>
          <p className="eyebrow">
            <span className="eyebrow__dot"></span>SC 03 — Raw vs. final
          </p>
          <h2 className="display" id="ba-title">
            <span className="ln">
              <span>SAME FOOTAGE.</span>
            </span>
            <span className="ln">
              <span>
                DIFFERENT <span className="text-[#D7FF64]">EXPERIENCE.</span>
              </span>
            </span>
          </h2>
        </div>
        <p className="sec-head__copy">
          Drag the playhead. Left is the raw take, right is the finished edit.
        </p>
      </header>

      <div
        className="ba__viewer"
        data-ba=""
        style={{ "--split": `${split}%` } as React.CSSProperties}
      >
        {/* Right / Final Side (Master Color Grade + Captions) */}
        <div className="ba__side ba__side--final">
          <img
            src="/images/projects/reel-5.jpg"
            alt="Finished edit frame"
            className="is-loaded"
          />
          <div className="ba__fx">
            <p className="ba__cap">
              <span>THE</span> <span>DETAIL</span> <span className="is-hl">MATTERS.</span>
            </p>
            <span className="ba__chip mono">CAPTIONS · GRADE · SFX · PACING</span>
          </div>
        </div>

        {/* Left / Raw Side (Flat Log + Dead Air) */}
        <div
          className="ba__side ba__side--raw"
          style={{
            clipPath: `polygon(0% 0%, ${split}% 0%, ${split}% 100%, 0% 100%)`,
          }}
        >
          <img
            src="/images/projects/reel-5.jpg"
            alt="Raw footage frame"
            className="is-loaded"
            style={{ filter: "saturate(0.2) contrast(0.85) brightness(1.15)" }}
          />
          <div className="ba__rawui mono">
            <span>CLIP_0042.MOV</span>
            <span className="ba__dead">DEAD AIR 00:00:02:14</span>
          </div>
        </div>

        {/* Draggable Playhead Divider Bar */}
        <div
          className="ba__handle"
          aria-hidden="true"
          style={{ left: `${split}%` }}
        >
          <span className="ba__knob">
            <svg viewBox="0 0 24 24">
              <path d="M9 6l-5 6 5 6M15 6l5 6-5 6"></path>
            </svg>
          </span>
        </div>

        {/* Badges */}
        <span className="ba__label ba__label--raw mono">RAW</span>
        <span className="ba__label ba__label--final mono">FINAL</span>
        <span className="ba__demo mono" data-ba-demo="">
          DEMO TREATMENT
        </span>

        {/* Range Input for Smooth Dragging & Accessibility */}
        <input
          className="ba__range"
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(e) => setSplit(parseFloat(e.target.value))}
          aria-label="Comparison slider: raw footage versus final edit"
        />
      </div>

      <p className="ba__line">
        Editing isn’t about adding effects. It’s about <em>removing friction</em> from the
        viewer’s experience.
      </p>
    </section>
  );
}
