"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-800/80 border border-red-500/30 p-8 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-300 px-2.5 py-1 rounded border border-red-500/30 font-mono">
              System Error
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-3">
              Root Layout Failure
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              A critical error prevented the application layout from rendering.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
