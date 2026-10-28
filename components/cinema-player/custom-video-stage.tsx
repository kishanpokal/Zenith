"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Flame,
  ZoomIn,
  Grid,
  Sparkles,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface CustomVideoStageProps {
  youtubeId?: string;
  videoSrc?: string;
  thumbnail: string;
  title: string;
  aspectRatio: "9:16" | "16:9";
  timecode?: string;
  duration?: string;
  onChapterChange?: (chapterIndex: number) => void;
}

type LutMode = "kodak" | "teal-orange" | "s-log" | "mono";

const CHAPTERS = [
  { label: "The 3s Hook", pct: 0, seconds: 0 },
  { label: "Pattern Break", pct: 25, seconds: 8 },
  { label: "Kinetic Build", pct: 55, seconds: 18 },
  { label: "Payoff & CTA", pct: 85, seconds: 28 },
];

export function CustomVideoStage({
  youtubeId,
  videoSrc,
  thumbnail,
  title,
  aspectRatio,
  timecode: initialTimecode = "00:00:35:00",
  duration: durationText = "0:35",
}: CustomVideoStageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(35);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [lutMode, setLutMode] = useState<LutMode>("kodak");
  const [isZoomPunch, setIsZoomPunch] = useState(false);
  const [showSafeGuides, setShowSafeGuides] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [centerIconState, setCenterIconState] = useState<"play" | "pause" | null>(null);
  const [smpteFrame, setSmpteFrame] = useState("00:00:00:00");
  const [hasFiredConfetti, setHasFiredConfetti] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isVertical = aspectRatio === "9:16";

  // Parse duration text like "0:35" or "1:15" to seconds
  useEffect(() => {
    if (durationText) {
      const parts = durationText.split(":").map(Number);
      if (parts.length === 2) {
        setTotalDuration(parts[0] * 60 + parts[1]);
      }
    }
  }, [durationText]);

  // Send postMessage command to YouTube iframe
  const sendYtCommand = useCallback((func: string, args: (string | number | boolean)[] = []) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    }
  }, []);

  // Show center pop icon on state change
  const triggerCenterIcon = (type: "play" | "pause") => {
    setCenterIconState(type);
    setTimeout(() => setCenterIconState(null), 700);
  };

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (youtubeId) {
      if (isPlaying) {
        sendYtCommand("pauseVideo");
        setIsPlaying(false);
        triggerCenterIcon("pause");
      } else {
        sendYtCommand("playVideo");
        setIsPlaying(true);
        triggerCenterIcon("play");
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        triggerCenterIcon("pause");
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        triggerCenterIcon("play");
      }
    }
  }, [isPlaying, youtubeId, sendYtCommand]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (youtubeId) {
      sendYtCommand(nextMuted ? "mute" : "unMute");
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  }, [isMuted, youtubeId, sendYtCommand]);

  // Change playback speed
  const changeSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (youtubeId) {
      sendYtCommand("setPlaybackRate", [speed]);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Seek to specific second
  const seekTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, totalDuration));
    setCurrentTime(clamped);
    setProgress((clamped / totalDuration) * 100);

    if (youtubeId) {
      sendYtCommand("seekTo", [clamped, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  // Simulated live SMPTE timecode ticker when playing
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = (prev + delta * playbackRate) % totalDuration;
          setProgress((next / totalDuration) * 100);

          // Calculate SMPTE HH:MM:SS:FF at 30fps
          const fps = 30;
          const totalSecs = Math.floor(next);
          const frames = Math.floor((next % 1) * fps);
          const s = totalSecs % 60;
          const m = Math.floor(totalSecs / 60) % 60;
          const h = Math.floor(totalSecs / 3600);
          const pad = (n: number) => n.toString().padStart(2, "0");
          setSmpteFrame(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`);

          return next;
        });
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackRate, totalDuration]);

  // Cycle LUT profile
  const cycleLut = () => {
    const modes: LutMode[] = ["kodak", "teal-orange", "s-log", "mono"];
    const next = modes[(modes.indexOf(lutMode) + 1) % modes.length];
    setLutMode(next);
  };

  // Trigger celebration confetti
  const triggerConfetti = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x, y },
      colors: ["#38bdf8", "#D7FF64", "#ffffff", "#2563eb"],
    });
    setHasFiredConfetti(true);
  };

  // Auto-hide controls when idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  // Get CSS filter based on LUT mode
  const getLutFilter = () => {
    switch (lutMode) {
      case "s-log":
        return "grayscale(45%) contrast(75%) brightness(115%)";
      case "teal-orange":
        return "contrast(115%) saturate(135%) hue-rotate(-10deg)";
      case "mono":
        return "grayscale(100%) contrast(130%) brightness(95%)";
      case "kodak":
      default:
        return "contrast(106%) saturate(110%) brightness(102%)";
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex flex-col items-center select-none"
    >
      {/* Dynamic Ambient Neon Backlight that pulses with video */}
      <div
        className={cn(
          "absolute -inset-4 sm:-inset-8 rounded-3xl blur-3xl opacity-35 pointer-events-none transition-all duration-700 -z-10",
          isPlaying ? "animate-pulse" : "opacity-20"
        )}
        style={{
          background:
            lutMode === "teal-orange"
              ? "radial-gradient(circle, #f97316 0%, #06b6d4 50%, transparent 75%)"
              : lutMode === "s-log"
              ? "radial-gradient(circle, #94a3b8 0%, #334155 50%, transparent 75%)"
              : "radial-gradient(circle, #38bdf8 0%, #2563eb 45%, #D7FF64 75%, transparent 85%)",
        }}
      />

      {/* TOP STUDIO TOOLBAR (LUT, Zoom, Guides, Timecode) */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 px-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* LUT Profile Button */}
          <button
            type="button"
            onClick={cycleLut}
            className="px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white/90 flex items-center gap-1.5 transition-all"
            title="Cycle Color Grade (HotKey: B)"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span className="font-bold text-cyan-300">
              LUT: {lutMode.toUpperCase()}
            </span>
          </button>

          {/* Zoom Punch Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomPunch(!isZoomPunch)}
            className={cn(
              "px-2.5 py-1 rounded-md border text-[10px] flex items-center gap-1 transition-all",
              isZoomPunch
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                : "bg-white/[0.06] border-white/15 text-white/70 hover:text-white"
            )}
            title="Toggle 125% Punch Zoom"
          >
            <ZoomIn className="w-3 h-3" />
            <span>{isZoomPunch ? "125% PUNCH" : "100% FIT"}</span>
          </button>

          {/* Safe Zone Grid Toggle */}
          <button
            type="button"
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            className={cn(
              "px-2 py-1 rounded-md border text-[10px] hidden sm:flex items-center gap-1 transition-all",
              showSafeGuides
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-white/[0.06] border-white/15 text-white/50 hover:text-white"
            )}
            title="Action Safe Guides"
          >
            <Grid className="w-3 h-3" />
            <span>GUIDES</span>
          </button>
        </div>

        {/* Live SMPTE Timecode */}
        <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/40 hidden sm:inline">TC:</span>
          <span className="text-cyan-400 font-semibold">{smpteFrame}</span>
        </div>
      </div>

      {/* MAIN SCREEN CANVAS */}
      <div
        onClick={togglePlay}
        className={cn(
          "relative w-full rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl cursor-pointer group transition-transform duration-300",
          isVertical ? "max-w-[340px] aspect-[9/16]" : "max-w-full aspect-[16/9]"
        )}
      >
        {/* VIDEO CONTENT LAYER */}
        <div
          className={cn(
            "w-full h-full transition-transform duration-500",
            isZoomPunch && "scale-125"
          )}
          style={{ filter: getLutFilter() }}
        >
          {youtubeId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=${
                isMuted ? 1 : 0
              }&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`}
              title={title}
              className="w-full h-full object-cover scale-[1.08] pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={thumbnail}
              playsInline
              autoPlay
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* PRO SAFE ZONE GUIDES OVERLAY (Action & Title Safe) */}
        {showSafeGuides && (
          <div className="absolute inset-0 pointer-events-none border border-[#D7FF64]/30 m-4 flex flex-col justify-between p-2">
            <div className="flex justify-between text-[8px] font-mono text-[#D7FF64]/60">
              <span>90% ACTION SAFE</span>
              <span>80% TITLE SAFE</span>
            </div>
            <div className="border border-dashed border-[#D7FF64]/20 m-2 flex-1 flex items-center justify-center">
              <span className="text-[#D7FF64]/30 font-mono text-xs">+</span>
            </div>
            <div className="text-[8px] font-mono text-[#D7FF64]/60 text-right">
              CENTERED
            </div>
          </div>
        )}

        {/* TOP STATUS HUD (Live REC + Resolution + Pacing Badge) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[9px] font-mono text-white/90 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>REC · 4K 60FPS</span>
            </span>
            <span className="bg-[#D7FF64]/20 text-[#D7FF64] border border-[#D7FF64]/30 px-2 py-0.5 rounded-full backdrop-blur-md font-bold">
              SURGICAL CUTS
            </span>
          </div>

          <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md text-white/70">
            {aspectRatio}
          </span>
        </div>

        {/* KINETIC CENTER PLAY / PAUSE POP INDICATOR */}
        {centerIconState && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-black/80 border border-[#D7FF64]/50 flex items-center justify-center text-[#D7FF64] shadow-[0_0_30px_rgba(215,255,100,0.3)] backdrop-blur-md">
              {centerIconState === "play" ? (
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              ) : (
                <Pause className="w-8 h-8 fill-current" />
              )}
            </div>
          </div>
        )}

        {/* BOTTOM TIMELINE CONSOLE & CUSTOM SCRUBBER */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-2 z-20 transition-opacity duration-300",
            showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* CUSTOM GLOW SCRUBBER TRACK WITH EMBEDDED CHAPTER DOTS */}
          <div className="relative group/scrubber py-1 cursor-pointer">
            <div
              className="relative w-full h-1.5 hover:h-2.5 rounded-full bg-white/20 transition-all overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                seekTo(pct * totalDuration);
              }}
            >
              {/* Play Progress Fill */}
              <div
                className="h-full bg-[#D7FF64] rounded-full shadow-[0_0_12px_rgba(215,255,100,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Glowing Scrubber Playhead Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#D7FF64] shadow-[0_0_10px_#D7FF64] pointer-events-none transition-[left] duration-75"
              style={{ left: `${progress}%` }}
            />

            {/* Embedded Chapter Markers along Scrubber */}
            {CHAPTERS.map((ch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  seekTo(ch.seconds);
                }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 border border-black hover:scale-150 transition-transform"
                style={{ left: `${ch.pct}%` }}
                title={`${ch.label} (${formatTime(ch.seconds)})`}
              />
            ))}
          </div>

          {/* PLAYBACK CONTROLS ROW */}
          <div className="flex items-center justify-between text-xs font-mono text-white/90 gap-2">
            {/* Left Controls: Play, Mute, Time, Visualizer */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#D7FF64]" />
                )}
              </button>

              <span className="text-[11px] text-white/70">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>

              {/* Real-Time Audio Frequency Spectrum Bars */}
              <div className="hidden sm:flex items-center gap-[2px] h-3 px-1.5 rounded bg-black/40 border border-white/10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-[2px] rounded-full bg-[#D7FF64] transition-all",
                      isPlaying ? "animate-pulse" : "opacity-30"
                    )}
                    style={{
                      height: isPlaying ? `${((i * 13) % 80) + 20}%` : "30%",
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Controls: Speed pills, Flame Reaction */}
            <div className="flex items-center gap-1.5">
              {/* Speed Switcher */}
              <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 border border-white/10 text-[10px]">
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => changeSpeed(spd)}
                    className={cn(
                      "px-1.5 py-0.5 rounded font-bold transition-colors",
                      playbackRate === spd
                        ? "bg-[#D7FF64] text-black font-black"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Fire Edit Reaction with Confetti */}
              <button
                type="button"
                onClick={triggerConfetti}
                className={cn(
                  "p-1.5 rounded-lg border transition-all flex items-center gap-1",
                  hasFiredConfetti
                    ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                    : "bg-white/10 border-white/15 text-white/80 hover:text-amber-300"
                )}
                title="Rate this edit"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK RETENTION CHAPTER JUMP BUTTONS */}
      <div className="w-full mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
        {CHAPTERS.map((ch, idx) => {
          const isActive =
            currentTime >= ch.seconds &&
            (idx === CHAPTERS.length - 1 || currentTime < CHAPTERS[idx + 1].seconds);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => seekTo(ch.seconds)}
              className={cn(
                "px-2 py-1.5 rounded-lg border text-left transition-all truncate",
                isActive
                  ? "bg-[#D7FF64] text-[#050505] font-black border-[#D7FF64] shadow-[0_0_12px_rgba(215,255,100,0.3)]"
                  : "bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:bg-white/[0.08]"
              )}
            >
              <div className="truncate font-semibold">{ch.label}</div>
              <div className="opacity-60 text-[9px]">{formatTime(ch.seconds)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
