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
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-white/[0.08]" />
        
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF64]/60" />
          <span>{label}</span>
          {timecode && (
            <>
              <span className="text-white/15">/</span>
              <span className="text-white/20">{timecode}</span>
            </>
          )}
        </div>

        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/[0.08] to-white/[0.08]" />
      </div>
    </div>
  );
}