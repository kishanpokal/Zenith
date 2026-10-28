"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const GLYPHS = "0123456789ABCDEF:/[]";

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
}

export function TextScramble({
  text,
  className = "",
  triggerOnHover = false,
  speed = 28,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScrambling = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling.current) return;
    isScrambling.current = true;

    let iteration = 0;
    const maxIterations = text.length * 2;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "/" || char === ":") return char;
            if (index < iteration / 2) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isScrambling.current = false;
      }

      iteration += 1;
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    scramble();
  }, [scramble]);

  return (
    <span
      className={`font-mono ${className}`}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  );
}
