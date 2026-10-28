"use client";

import React, { useState } from "react";
import { craftModules, CraftModule } from "@/data/craft";
import {
  Zap,
  Activity,
  Layers,
  Volume2,
  VolumeX,
  Sliders,
  Scissors,
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function EditingCraft() {
  const [activeTab, setActiveTab] = useState<"pacing" | "storytelling" | "sound" | "clarity">("pacing");

  // State for interactive Pacing demo
  const [pacingMode, setPacingMode] = useState<"raw" | "zenith">("zenith");

  // State for interactive Sound mixer demo
  const [audioTracks, setAudioTracks] = useState({
    voice: true,
    sfx: true,
    music: true,
  });

  // State for interactive Visual Clarity layer demo
  const [layers, setLayers] = useState({
    aroll: true,
    subtitles: true,
    broll: true,
    zoom: true,
  });

  const activeModule = craftModules.find((m) => m.id === activeTab)!;

  return (
    <section id="craft" className="py-24 bg-[#0a0a0a] border-b border-[#1c1c1c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-accent uppercase mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>02 — THE CRAFT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F2] tracking-tighter uppercase font-sans mb-4">
            GOOD EDITING IS FELT.
          </h2>
          <p className="text-base sm:text-lg text-[#A0A09C] leading-relaxed">
            The best cuts don&apos;t announce themselves—they keep the viewer locked in without cognitive friction. Here is how we build high-retention stories.
          </p>
        </div>

        {/* 4 Interactive Principle Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {craftModules.map((m) => {
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveTab(m.id)}
                className={cn(
                  "p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between h-28 relative overflow-hidden",
                  isActive
                    ? "bg-[#141414] border-accent text-[#F5F5F2] shadow-[0_0_20px_rgba(215,255,100,0.12)]"
                    : "bg-[#0d0d0d] border-[#1f1f1f] text-[#8E8E93] hover:border-[#333] hover:text-[#D1D1CB]"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-accent">{m.number}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                </div>

                <div>
                  <div className="text-sm font-black tracking-wider uppercase font-sans">
                    {m.title}
                  </div>
                  <div className="text-[11px] font-mono text-[#8E8E93] line-clamp-1 mt-0.5">
                    {m.quote}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Editorial Module Card */}
        <div className="bg-[#101010] border border-[#222222] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Explanation Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#181818] border border-[#2a2a2a] text-xs font-mono text-accent">
                PRINCIPLE {activeModule.number}
              </span>
              <span className="text-xs font-mono text-[#777] uppercase">
                {activeModule.technicalMetric}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#F5F5F2] uppercase tracking-tight font-sans">
              {activeModule.headline}
            </h3>

            <blockquote className="border-l-2 border-accent pl-4 text-base italic text-[#E5E5E0] font-serif">
              &ldquo;{activeModule.quote}&rdquo;
            </blockquote>

            <p className="text-sm text-[#A0A09C] leading-relaxed">
              {activeModule.description}
            </p>

            {/* Keypoints list */}
            <div className="space-y-2 pt-2 border-t border-[#1f1f1f]">
              {activeModule.keyPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#D1D1CB] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Interactive Demo Column (7 cols) */}
          <div className="lg:col-span-7 bg-[#080808] border border-[#1f1f1f] rounded-xl p-5 sm:p-6 relative min-h-[360px] flex flex-col justify-between">
            {/* Demo Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c] text-xs font-mono text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[#F5F5F2] font-semibold">INTERACTIVE CRAFT MONITOR</span>
              </div>
              <span className="text-accent uppercase">MODE: {activeModule.id}</span>
            </div>

            {/* DEMO 1: PACING - Raw Pauses vs Zenith Ripple Edit */}
            {activeTab === "pacing" && (
              <div className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A0A09C]">Compare Cut Timing:</span>
                  <div className="flex rounded-lg bg-[#141414] p-1 border border-[#222]">
                    <button
                      type="button"
                      onClick={() => setPacingMode("raw")}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-mono transition-colors",
                        pacingMode === "raw" ? "bg-[#252525] text-white font-bold" : "text-[#777]"
                      )}
                    >
                      Raw Recording (4.8s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPacingMode("zenith")}
                      className={cn(
                        "px-3 py-1 rounded text-xs font-mono transition-colors",
                        pacingMode === "zenith" ? "bg-accent text-[#080808] font-bold" : "text-[#777]"
                      )}
                    >
                      Zenith Cut (1.4s)
                    </button>
                  </div>
                </div>

                {/* Timeline Visualizer */}
                <div className="space-y-4">
                  {/* Track 1: Video */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-[#8E8E93]">
                      <span>V1: A-ROLL VIDEO</span>
                      <span className="text-accent">{pacingMode === "raw" ? "Uncut Slack" : "34% Slack Deleted"}</span>
                    </div>

                    <div className="h-10 bg-[#121212] rounded border border-[#222] p-1 flex items-center gap-1 overflow-hidden">
                      {pacingMode === "raw" ? (
                        <>
                          <div className="h-full bg-blue-900/60 rounded px-2 flex items-center text-[10px] font-mono text-white/80 w-1/4">
                            Take 1
                          </div>
                          <div className="h-full bg-red-900/40 border border-red-500/30 rounded px-2 flex items-center text-[10px] font-mono text-red-300 w-1/4">
                            [Pause 1.2s]
                          </div>
                          <div className="h-full bg-blue-900/60 rounded px-2 flex items-center text-[10px] font-mono text-white/80 w-1/4">
                            Correction
                          </div>
                          <div className="h-full bg-red-900/40 border border-red-500/30 rounded px-2 flex items-center text-[10px] font-mono text-red-300 w-1/4">
                            [Breath 0.8s]
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-full bg-accent/20 border border-accent/50 rounded px-2 flex items-center text-[10px] font-mono text-accent font-bold w-1/2">
                            Clean Punch Take
                          </div>
                          <div className="h-full bg-accent/30 border border-accent rounded px-2 flex items-center text-[10px] font-mono text-white font-bold w-1/2">
                            Key Insight Cutaway
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Track 2: Audio Waveform */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-[#8E8E93]">
                      <span>A1: VOICE WAVEFORM</span>
                      <span className="text-white/60">{pacingMode === "raw" ? "Hesitations present" : "Zero-frame ripple"}</span>
                    </div>

                    <div className="h-12 bg-[#121212] rounded border border-[#222] flex items-center justify-center px-4 gap-1">
                      {Array.from({ length: 32 }).map((_, i) => {
                        const isDeadAir = pacingMode === "raw" && (i > 8 && i < 15 || i > 22 && i < 28);
                        const height = isDeadAir ? 4 : ((i * 13) % 28) + 8;
                        return (
                          <div
                            key={i}
                            style={{ height: `${height}px` }}
                            className={cn(
                              "w-1.5 rounded-full transition-all duration-300",
                              isDeadAir
                                ? "bg-red-500/40"
                                : pacingMode === "zenith"
                                ? "bg-accent"
                                : "bg-neutral-600"
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#8E8E93] bg-[#121212] p-3 rounded border border-[#1f1f1f]">
                  <span className="text-accent font-bold">INSIGHT:</span> Eliminating 0.4 seconds of hesitation between ideas increases mobile completion rates by up to 40%.
                </div>
              </div>
            )}

            {/* DEMO 2: STORYTELLING - 3-Act Structure */}
            {activeTab === "storytelling" && (
              <div className="py-6 space-y-5">
                <div className="text-xs font-mono text-[#8E8E93]">
                  The 3-Beat High-Retention Arc:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#121212] p-4 rounded-xl border border-accent/40 relative">
                    <div className="text-[10px] font-mono text-accent font-bold uppercase mb-1">
                      0.0s — 1.5s
                    </div>
                    <div className="text-sm font-bold text-white mb-2">1. THE HOOK</div>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Visual pattern-interrupt, bold statement, and immediate reason to keep watching.
                    </p>
                  </div>

                  <div className="bg-[#121212] p-4 rounded-xl border border-[#222] relative">
                    <div className="text-[10px] font-mono text-[#8E8E93] font-bold uppercase mb-1">
                      1.5s — 25.0s
                    </div>
                    <div className="text-sm font-bold text-white mb-2">2. THE TENSION</div>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Logical breakdown, vector graphs, and B-roll proof points answering the hook.
                    </p>
                  </div>

                  <div className="bg-[#121212] p-4 rounded-xl border border-[#222] relative">
                    <div className="text-[10px] font-mono text-[#8E8E93] font-bold uppercase mb-1">
                      25.0s — 45.0s
                    </div>
                    <div className="text-sm font-bold text-white mb-2">3. THE PAYOFF</div>
                    <p className="text-xs text-[#8E8E93] leading-relaxed">
                      Clear conclusion and seamless transition to save, share, or follow.
                    </p>
                  </div>
                </div>

                {/* Micro progression bar */}
                <div className="bg-[#141414] p-3 rounded-lg border border-[#222] space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#8E8E93]">AUDIENCE ATTENTION CURVE</span>
                    <span className="text-accent font-bold">FLAT RETENTION</span>
                  </div>
                  <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden flex">
                    <div className="w-1/3 bg-accent h-full" />
                    <div className="w-1/3 bg-accent/70 h-full" />
                    <div className="w-1/3 bg-accent/40 h-full" />
                  </div>
                </div>
              </div>
            )}

            {/* DEMO 3: SOUND - Multi-Track Audio Mixer */}
            {activeTab === "sound" && (
              <div className="py-6 space-y-5">
                <div className="text-xs font-mono text-[#8E8E93] flex items-center justify-between">
                  <span>Interactive Audio Bus Mixer:</span>
                  <span className="text-accent">Click to Solo/Mute</span>
                </div>

                <div className="space-y-3">
                  {/* Voice Track */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAudioTracks({ ...audioTracks, voice: !audioTracks.voice })}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          audioTracks.voice ? "bg-accent text-[#080808]" : "bg-[#222] text-[#666]"
                        )}
                        aria-label="Toggle voice track"
                      >
                        {audioTracks.voice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">A1: DIALOGUE</div>
                        <div className="text-[10px] text-[#8E8E93]">EQ + Dynamic De-Esser + Compressor</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-accent">0.0 dB (MASTER)</span>
                  </div>

                  {/* SFX Track */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAudioTracks({ ...audioTracks, sfx: !audioTracks.sfx })}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          audioTracks.sfx ? "bg-accent text-[#080808]" : "bg-[#222] text-[#666]"
                        )}
                        aria-label="Toggle SFX track"
                      >
                        {audioTracks.sfx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">A2: FOLEY &amp; RISERS</div>
                        <div className="text-[10px] text-[#8E8E93]">Paper snaps, tape stops, sub hits</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-white/70">-6.5 dB (PEAK)</span>
                  </div>

                  {/* Music Track */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAudioTracks({ ...audioTracks, music: !audioTracks.music })}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          audioTracks.music ? "bg-accent text-[#080808]" : "bg-[#222] text-[#666]"
                        )}
                        aria-label="Toggle music track"
                      >
                        {audioTracks.music ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">A3: UNDERSCORE MUSIC</div>
                        <div className="text-[10px] text-[#8E8E93]">Sidechain ducking under spoken words</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-accent">-18.0 dB (DUCKED)</span>
                  </div>
                </div>
              </div>
            )}

            {/* DEMO 4: VISUAL CLARITY - Layer Toggles */}
            {activeTab === "clarity" && (
              <div className="py-6 space-y-5">
                <div className="text-xs font-mono text-[#8E8E93]">
                  Toggle Edit Layers to inspect clarity structure:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setLayers({ ...layers, aroll: !layers.aroll })}
                    className={cn(
                      "p-3 rounded-lg border text-left font-mono text-xs transition-colors",
                      layers.aroll ? "bg-[#181818] border-accent text-accent" : "bg-[#101010] border-[#222] text-[#666]"
                    )}
                  >
                    <div className="text-[10px] text-[#8E8E93] mb-1">V1 LAYER</div>
                    <div className="font-bold">Base A-Roll</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayers({ ...layers, subtitles: !layers.subtitles })}
                    className={cn(
                      "p-3 rounded-lg border text-left font-mono text-xs transition-colors",
                      layers.subtitles ? "bg-[#181818] border-accent text-accent" : "bg-[#101010] border-[#222] text-[#666]"
                    )}
                  >
                    <div className="text-[10px] text-[#8E8E93] mb-1">V2 LAYER</div>
                    <div className="font-bold">Kinetic Text</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayers({ ...layers, broll: !layers.broll })}
                    className={cn(
                      "p-3 rounded-lg border text-left font-mono text-xs transition-colors",
                      layers.broll ? "bg-[#181818] border-accent text-accent" : "bg-[#101010] border-[#222] text-[#666]"
                    )}
                  >
                    <div className="text-[10px] text-[#8E8E93] mb-1">V3 LAYER</div>
                    <div className="font-bold">Vector Diagram</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayers({ ...layers, zoom: !layers.zoom })}
                    className={cn(
                      "p-3 rounded-lg border text-left font-mono text-xs transition-colors",
                      layers.zoom ? "bg-[#181818] border-accent text-accent" : "bg-[#101010] border-[#222] text-[#666]"
                    )}
                  >
                    <div className="text-[10px] text-[#8E8E93] mb-1">FX LAYER</div>
                    <div className="font-bold">Punch Zoom</div>
                  </button>
                </div>

                {/* Preview Frame Result */}
                <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#121212] rounded-xl border border-[#222] flex items-center justify-center overflow-hidden p-4">
                  {layers.aroll ? (
                    <div className="text-center space-y-2">
                      <div className="text-xs font-mono text-[#8E8E93]">
                        {layers.zoom ? "[115% Zoom-In Framing Active]" : "[100% Standard Framing]"}
                      </div>
                      {layers.subtitles && (
                        <div className="text-lg sm:text-xl font-black text-white">
                          &ldquo;ATTENTION IS THE <span className="text-accent underline decoration-2">NEW CURRENCY.</span>&rdquo;
                        </div>
                      )}
                      {layers.broll && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#222] text-xs font-mono text-accent">
                          <span>📊 +312% Growth Proof Overlay</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-[#666]">
                      Base A-Roll layer disabled. Turn V1 on to view composition.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Status Ribbon */}
            <div className="pt-3 border-t border-[#1c1c1c] flex items-center justify-between text-[11px] font-mono text-[#8E8E93]">
              <span>STUDIO METHODOLOGY</span>
              <span className="text-accent">ZENITH RETENTION PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
