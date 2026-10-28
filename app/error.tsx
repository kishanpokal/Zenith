"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Studio Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="w-full max-w-md bg-[#080E1C] border border-white/15 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest mb-1">
          STUDIO ENGINE INTERRUPTION
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
          Playback Stalled
        </h2>
        <p className="text-xs text-[#94A3B8] leading-relaxed mb-6 font-sans">
          An unexpected interruption occurred in the timeline rendering engine. You can reset the stage or return to the top of the portfolio.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stage</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
