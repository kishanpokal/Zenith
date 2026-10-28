"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-white min-h-screen flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-[#080E1C] border border-white/15 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-black uppercase text-white mb-2">
            System Reset Required
          </h2>
          <p className="text-xs text-[#94A3B8] mb-6 font-sans">
            A critical rendering interruption was caught by the root error boundary.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Studio Engine</span>
          </button>
        </div>
      </body>
    </html>
  );
}
