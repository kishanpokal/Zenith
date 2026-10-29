"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from "framer-motion";
import { Project } from "@/data/projects";
import { Play, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReelStage3DProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  activeIndex: number;
  onChangeIndex: (newIndex: number) => void;
  audioMonitorEnabled?: boolean;
}

export function ReelStage3D({
  projects,
  onSelectProject,
  activeIndex,
  onChangeIndex,
  audioMonitorEnabled = false,
}: ReelStage3DProps) {
  const n = projects.length;
  const safeIndex = ((activeIndex % n) + n) % n;
  const activeProject = projects[safeIndex] || projects[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== "undefined" && window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Mouse tilt physics on the center card (only on desktop >= 1024px)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltSpringX = useSpring(mouseX, { stiffness: 220, damping: 24 });
  const tiltSpringY = useSpring(mouseY, { stiffness: 220, damping: 24 });
  const centerRotateX = useTransform(tiltSpringY, [-0.5, 0.5], [6, -6]);
  const centerRotateY = useTransform(tiltSpringX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleNext = () => {
    onChangeIndex((safeIndex + 1) % n);
  };

  const handlePrev = () => {
    onChangeIndex((safeIndex - 1 + n) % n);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 35;
    const velocityThreshold = 250;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[520px] sm:min-h-[580px] flex flex-col justify-center select-none py-6"
    >
      {/* Ambient Theater Backlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-[140px] mix-blend-screen transition-all duration-700 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={activeProject?.thumbnail}
          alt=""
          className="w-full h-full object-cover scale-150"
        />
      </div>

      {/* Cinema Stage Deck — Heavy 3D perspective transforms only on >= 1024px */}
      <div
        className={cn(
          "relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center",
          isDesktop ? "[perspective:1400px]" : "[perspective:none]"
        )}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Portfolio Cinema Deck"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          className="relative w-[300px] sm:w-[420px] md:w-[500px] aspect-[16/10] cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: isDesktop ? "preserve-3d" : "flat",
          }}
        >
          {projects.map((project, idx) => {
            let offset = (idx - safeIndex) % n;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;

            const isActive = offset === 0;

            let x = 0;
            let z = 0;
            let rotY = 0;
            let scale = 1;
            let opacity = 0;
            let zIndex = 10;
            let visibility: "visible" | "hidden" = "hidden";

            if (offset === 0) {
              x = 0;
              z = 0;
              rotY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 100;
              visibility = "visible";
            } else if (offset === 1) {
              x = isDesktop ? 340 : 260;
              z = isDesktop ? -150 : 0;
              rotY = isDesktop ? -22 : 0;
              scale = 0.85;
              opacity = 0.65;
              zIndex = 90;
              visibility = "visible";
            } else if (offset === -1) {
              x = isDesktop ? -340 : -260;
              z = isDesktop ? -150 : 0;
              rotY = isDesktop ? 22 : 0;
              scale = 0.85;
              opacity = 0.65;
              zIndex = 90;
              visibility = "visible";
            } else if (offset === 2) {
              x = isDesktop ? 600 : 480;
              z = isDesktop ? -280 : 0;
              rotY = isDesktop ? -34 : 0;
              scale = 0.72;
              opacity = 0.3;
              zIndex = 80;
              visibility = "visible";
            } else if (offset === -2) {
              x = isDesktop ? -600 : -480;
              z = isDesktop ? -280 : 0;
              rotY = isDesktop ? 34 : 0;
              scale = 0.72;
              opacity = 0.3;
              zIndex = 80;
              visibility = "visible";
            } else {
              visibility = "hidden";
              opacity = 0;
            }

            return (
              <motion.article
                key={project.id}
                data-cursor="play"
                animate={{
                  x,
                  z,
                  rotateY: rotY,
                  scale,
                  opacity,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none border border-white/10 bg-[#0a0a0a] shadow-2xl transition-shadow duration-500 group",
                  isActive && "border-white/30 ring-1 ring-[#D4AF37]/50 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
                )}
                onClick={() => {
                  if (isActive) {
                    onSelectProject(project);
                  } else {
                    onChangeIndex(idx);
                  }
                }}
                style={{
                  zIndex,
                  visibility,
                  rotateX: isActive && isDesktop ? centerRotateX : 0,
                }}
              >
                <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 pb-5">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Cinematic Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 pointer-events-none" />

                  {/* Top Bar Info */}
                  <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-medium border border-white/10 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span>EDIT {String(idx + 1).padStart(2, "0")}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-mono text-[11px] uppercase font-bold">
                      {project.aspectRatio} · {project.duration}
                    </span>
                  </div>

                  {/* Center Play Button */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#D4AF37] text-[#09090B] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Metadata Info */}
                  <div className="relative z-10">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-lg font-display font-bold text-white uppercase tracking-tight truncate">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-white/70 font-mono mt-0.5 truncate max-w-[260px]">
                          {project.clientContext}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider shrink-0 bg-black/70 px-2.5 py-1 rounded-lg border border-white/10">
                        PLAY →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {/* Carousel HUD Controls & Progress */}
      <div className="flex items-center justify-between max-w-lg mx-auto mt-6 pt-4 border-t border-white/10 px-4">
        <button
          className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#09090B] border border-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
          onClick={handlePrev}
          aria-label="Previous edit"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-xs font-mono font-medium text-white/70">
          <span className="text-[#D4AF37] font-bold text-sm">{String(safeIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/40"> / {String(projects.length).padStart(2, "0")}</span>
        </div>

        <div className="flex-1 max-w-[160px] mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37] transition-all duration-300"
            style={{
              width: `${((safeIndex + 1) / projects.length) * 100}%`,
            }}
          />
        </div>

        <button
          className="w-11 h-11 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#09090B] border border-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-105"
          onClick={handleNext}
          aria-label="Next edit"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* FILMSTRIP THUMBNAIL DOCK (1-Click Jump) */}
      <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-4">
        {projects.map((proj, idx) => {
          const isSelected = idx === safeIndex;
          return (
            <button
              key={proj.id}
              type="button"
              onClick={() => onChangeIndex(idx)}
              className={cn(
                "relative w-14 h-10 rounded-lg overflow-hidden border transition-all duration-300 shrink-0 group",
                isSelected
                  ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/40 scale-110"
                  : "border-white/15 opacity-50 hover:opacity-100 hover:border-white/40"
              )}
            >
              <img
                src={proj.thumbnail}
                alt={proj.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white drop-shadow">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
