import Link from "next/link";
import { Compass, Home, FolderGit2, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-800/80 border border-slate-700/80 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30 font-mono">
            404 • Resource Not Found
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-3">
            Requested Record Not Found
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The application ID, document hash, or administrative route you requested could not be located in the Samadhan360 ledger.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5 text-xs font-bold">
          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Samadhan360 Dashboard</span>
          </Link>

          <Link
            href="/applications"
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-600"
          >
            <FolderGit2 className="w-4 h-4 text-slate-400" />
            <span>Browse Active Applications</span>
          </Link>

          <Link
            href="/advisor"
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center justify-center gap-2 transition-colors border border-amber-500/30"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Consult AI Statutory Advisor</span>
          </Link>
        </div>

        <p className="text-[10px] text-slate-500 font-mono">
          Samadhan360 Enterprise Governance Platform
        </p>
      </div>
    </div>
  );
}
