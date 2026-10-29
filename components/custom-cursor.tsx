"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "play" | "watch">("default");
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for fluid responsiveness
  const springX = useSpring(mouseX, { stiffness: 600, damping: 35 });
  const springY = useSpring(mouseY, { stiffness: 600, damping: 35 });

  useEffect(() => {
    // Disable completely on touch / mobile devices
    if (typeof window === "undefined") return;
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorEl) {
        const type = cursorEl.getAttribute("data-cursor");
        if (type === "play") {
          setCursorState("play");
          return;
        }
        if (type === "watch") {
          setCursorState("watch");
          return;
        }
        if (type === "hover") {
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  const isVideoBadge = cursorState === "play" || cursorState === "watch";

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono select-none"
      style={{
        x: springX,
        y: springY,
      }}
    >
      <motion.div
        animate={{
          opacity: cursorState === "hover" ? 0 : 1,
          scale: cursorState === "hover" ? 0.3 : 1,
          width: isVideoBadge ? 110 : 6,
          height: isVideoBadge ? 36 : 6,
          borderRadius: 999,
          backgroundColor: isVideoBadge
            ? "rgba(18, 18, 22, 0.92)"
            : "#D4AF37",
          borderColor: isVideoBadge
            ? "rgba(212, 175, 55, 0.5)"
            : "rgba(212, 175, 55, 0)",
          backdropFilter: isVideoBadge ? "blur(12px)" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
        className="flex items-center justify-center border overflow-hidden shadow-xl"
      >
        {isVideoBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5 px-3 text-[10px] tracking-widest text-[#F4F4F6] font-semibold whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>{cursorState === "play" ? "PLAY REEL" : "WATCH"}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
