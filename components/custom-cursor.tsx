"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<"default" | "hover" | "play" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorEl) {
        const type = cursorEl.getAttribute("data-cursor");
        if (type === "play") {
          setCursorState("play");
          return;
        }
        if (type === "drag") {
          setCursorState("drag");
          return;
        }
        if (type === "hover" || type === "go") {
          setCursorState("hover");
          return;
        }
      }

      if (target.closest("button, a, input, select, textarea, [role='button']")) {
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono text-[10px] font-black uppercase tracking-wider select-none"
      style={{
        x: springX,
        y: springY,
      }}
    >
      {/* Outer morphing ring */}
      <motion.div
        animate={{
          width:
            cursorState === "play"
              ? 64
              : cursorState === "drag"
              ? 54
              : cursorState === "hover"
              ? 38
              : 12,
          height:
            cursorState === "play"
              ? 64
              : cursorState === "drag"
              ? 54
              : cursorState === "hover"
              ? 38
              : 12,
          backgroundColor:
            cursorState === "play"
              ? "#D7FF64"
              : cursorState === "drag"
              ? "rgba(215, 255, 100, 0.9)"
              : cursorState === "hover"
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(255, 255, 255, 0.8)",
          borderColor:
            cursorState === "hover" ? "rgba(215, 255, 100, 0.6)" : "transparent",
          boxShadow:
            cursorState === "play"
              ? "0 0 25px rgba(215, 255, 100, 0.6)"
              : cursorState === "default"
              ? "0 0 8px rgba(215, 255, 100, 0.4)"
              : "none",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 25 }}
        className="rounded-full flex items-center justify-center text-[#050505] border"
      >
        {cursorState === "play" && (
          <span className="text-[#050505] font-black tracking-widest text-[9px] flex items-center gap-1">
            ▶ PLAY
          </span>
        )}
        {cursorState === "drag" && (
          <span className="text-[#050505] font-bold text-[9px]">
            ← →
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
