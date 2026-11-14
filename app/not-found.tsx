import Link from "next/link";
import { Compass, Home, FolderGit2, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3EBDD] bg-editorial-glow text-[#263B32] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#FAF8F1] border border-[#D5DDCB] p-8 rounded-2xl shadow-[0_12px_32px_-12px_rgba(38,59,50,0.14)] text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B7C9A8]/40 to-[#8FCDBB]/40 border border-[#8FCDBB]/50 flex items-center justify-center mx-auto text-[#263B32]">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#EAE2D2] text-[#263B32] px-2.5 py-1 rounded border border-[#D5DDCB] font-mono">
            404 • Resource Not Found
          </span>
          <h1 className="font-display text-2xl font-bold text-[#263B32] tracking-tight mt-3">
            Requested Record Not Found
          </h1>
          <p className="text-xs text-[#68776A] mt-2 leading-relaxed">
            The application ID, document hash, or administrative route you requested could not be located in the Samadhan360 ledger.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 text-xs font-bold">
          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4 text-[#8FCDBB]" />
            <span>Return to Samadhan360 Dashboard</span>
          </Link>

          <Link
            href="/applications"
            className="w-full py-2.5 px-4 bg-[#EAE2D2] hover:bg-[#D5DDCB]/60 text-[#263B32] rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#D5DDCB]"
          >
            <FolderGit2 className="w-4 h-4 text-[#68776A]" />
            <span>Browse Active Applications</span>
          </Link>

          <Link
            href="/advisor"
            className="w-full py-2.5 px-4 bg-[#8FCDBB]/25 hover:bg-[#8FCDBB]/40 text-[#263B32] rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#8FCDBB]/60"
          >
            <Sparkles className="w-4 h-4 text-[#263B32]" />
            <span>Consult AI Statutory Advisor</span>
          </Link>
        </div>

        <p className="text-[10px] text-[#68776A] font-mono">
          Samadhan360 Enterprise Governance Platform
        </p>
      </div>
    </div>
  );
}
