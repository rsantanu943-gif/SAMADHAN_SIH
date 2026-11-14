import Link from "next/link";
import { ShieldCheck, Sparkles, Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 bg-[#263B32] text-[#F3EBDD] border-t border-[#8FCDBB]/25 px-6 lg:px-8 py-7">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#B7C9A8] to-[#8FCDBB] text-[#263B32] font-black text-[11px] flex items-center justify-center tracking-tight">
              S360
            </div>
            <span className="font-display font-bold text-base text-[#FAF8F1] tracking-tight">
              Samadhan360
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#8FCDBB]/15 text-[#8FCDBB] border border-[#8FCDBB]/30">
              AY 2026–27
            </span>
          </div>
          <p className="text-xs text-[#EAE2D2]/80 max-w-xl leading-relaxed">
            Smart Approval &amp; Institutional Compliance Management System • Statutory Governance, Risk Radar &amp; Immutable Audit Architecture.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
          <Link
            href="/risk-radar"
            className="text-[#EAE2D2]/85 hover:text-[#8FCDBB] transition-colors flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-[#8FCDBB]" />
            <span>Risk Radar</span>
          </Link>
          <Link
            href="/documents"
            className="text-[#EAE2D2]/85 hover:text-[#8FCDBB] transition-colors"
          >
            Document Checker
          </Link>
          <Link
            href="/advisor"
            className="text-[#EAE2D2]/85 hover:text-[#8FCDBB] transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8FCDBB]" />
            <span>AI Advisor</span>
          </Link>
          <Link
            href="/help"
            className="text-[#EAE2D2]/85 hover:text-[#8FCDBB] transition-colors"
          >
            APH 2026 Handbook
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#B7C9A8] pl-2 border-l border-[#8FCDBB]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8FCDBB]" />
            <span>SHA-256 Verified</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
