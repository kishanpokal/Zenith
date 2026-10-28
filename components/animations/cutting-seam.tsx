"use client";

import React from "react";

interface CuttingSeamProps {
  label: string;
  timecode?: string;
}

export function CuttingSeam({ label, timecode }: CuttingSeamProps) {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 my-16 sm:my-24 select-none pointer-events-none">
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/[0.07] to-white/[0.07]" />

        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>{label}</span>
          {timecode && (
            <>
              <span className="text-white/20">/</span>
              <span className="text-[#D4AF37]/70">{timecode}</span>
            </>
          )}
        </div>

        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/[0.07] to-white/[0.07]" />
      </div>
    </div>
  );
}
