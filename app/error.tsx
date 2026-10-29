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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800/80 border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-300 px-2.5 py-1 rounded border border-red-500/30 font-mono">
            Application Error
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-3">
            An Unexpected Error Occurred
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {error.message || "An unexpected issue was encountered in the runtime pipeline. Try refreshing or returning to the main dashboard."}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 text-xs font-bold">
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-600"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Return to Samadhan360 Dashboard</span>
          </Link>
        </div>

        <p className="text-[10px] text-slate-500 font-mono">
          Samadhan360 Enterprise Governance Platform
        </p>
      </div>
    </div>
  );
}
