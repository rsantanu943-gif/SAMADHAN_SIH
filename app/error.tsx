"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F3EBDD] bg-editorial-glow text-[#263B32] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#FAF8F1] border border-[#D5DDCB] p-8 rounded-2xl shadow-[0_12px_32px_-12px_rgba(38,59,50,0.14)] text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F5DDD9] border border-[#DFACA5] flex items-center justify-center mx-auto text-[#8C2D25]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F5DDD9] text-[#8C2D25] px-2.5 py-1 rounded border border-[#DFACA5] font-mono">
            Application Error
          </span>
          <h1 className="font-display text-2xl font-bold text-[#263B32] tracking-tight mt-3">
            An Unexpected Error Occurred
          </h1>
          <p className="text-xs text-[#68776A] mt-2 leading-relaxed">
            {error.message || "An unexpected issue was encountered in the runtime pipeline. Try refreshing or returning to the main dashboard."}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 text-xs font-bold">
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#8FCDBB]" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-[#EAE2D2] hover:bg-[#D5DDCB]/60 text-[#263B32] rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#D5DDCB]"
          >
            <Home className="w-4 h-4 text-[#68776A]" />
            <span>Return to Samadhan360 Dashboard</span>
          </Link>
        </div>

        <p className="text-[10px] text-[#68776A] font-mono">
          Samadhan360 Enterprise Governance Platform
        </p>
      </div>
    </div>
  );
}
