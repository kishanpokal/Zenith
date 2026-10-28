"use client";

import React from "react";
import Link from "next/link";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="w-full max-w-lg bg-[#080E1C] border border-white/15 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Background Film Grain and SMPTE Color Bars */}
        <div className="absolute top-0 inset-x-0 h-2 flex">
          <span className="flex-1 bg-neutral-200" />
          <span className="flex-1 bg-yellow-400" />
          <span className="flex-1 bg-cyan-400" />
          <span className="flex-1 bg-emerald-400" />
          <span className="flex-1 bg-fuchsia-400" />
          <span className="flex-1 bg-red-500" />
          <span className="flex-1 bg-blue-600" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto mt-2 mb-6">
          <Film className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>404 · MISSING CLIP</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">
          Off-Line Media
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-8 font-sans max-w-sm mx-auto">
          The requested reel or project sequence does not exist or has been archived from the timeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-white/40 flex items-center justify-between">
          <span>TC: 00:04:04:00</span>
          <span>ZENITH POST-PRODUCTION</span>
        </div>
      </div>
    </div>
  );
}
