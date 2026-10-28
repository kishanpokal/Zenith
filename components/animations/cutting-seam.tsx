"use client";

import React from "react";

interface CuttingSeamProps {
  label: string;
  timecode?: string;
  className?: string;
}

export function CuttingSeam({ label, timecode, className = "" }: CuttingSeamProps) {
  return (
    <div className={`relative w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 my-12 sm:my-20 select-none pointer-events-none ${className}`}>
      <div className="flex items-center gap-4">
        {/* Left Hairline with Ticks */}
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-white/[0.08] relative">
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-white/20" />
        </div>

        {/* Center Editorial Metadata Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.07] font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>{label}</span>
          {timecode && (
            <>
              <span className="text-white/20">|</span>
              <span className="text-[#D4AF37] font-semibold">{timecode}</span>
            </>
          )}
        </div>

        {/* Right Hairline with Ticks */}
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/[0.08] to-white/[0.08] relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2 bg-white/20" />
        </div>
      </div>
    </div>
  );
}
