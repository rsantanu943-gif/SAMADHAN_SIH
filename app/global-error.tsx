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
      <body className="min-h-screen bg-[#F3EBDD] text-[#263B32] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#FAF8F1] border border-[#D5DDCB] p-8 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#F5DDD9] border border-[#DFACA5] flex items-center justify-center mx-auto text-[#8C2D25]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F5DDD9] text-[#8C2D25] px-2.5 py-1 rounded border border-[#DFACA5] font-mono">
              System Error
            </span>
            <h1 className="text-2xl font-bold text-[#263B32] tracking-tight mt-3">
              Root Layout Failure
            </h1>
            <p className="text-xs text-[#68776A] mt-2 leading-relaxed">
              A critical error prevented the application layout from rendering.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 px-4 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#8FCDBB]" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
