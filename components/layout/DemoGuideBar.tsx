"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, RotateCcw, Compass } from "lucide-react";
import { FlowGuardStore } from "@/lib/flowguard-store";

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Compliance Passport",
    desc: "Inspect 360° regulatory profile for VJTI (Permanent ID 1-4029102)",
    href: "/institutions/inst-001",
    matchPrefix: "/institutions",
  },
  {
    step: 2,
    title: "2. Approaching Deadline",
    desc: "Examine APP-2026-AICTE-102 (2 days left, 6 days inactive)",
    href: "/applications/app-001",
    matchPrefix: "/applications",
  },
  {
    step: 3,
    title: "3. Deadline Risk Radar",
    desc: "View rule-based transparent risk explanation & filter radar",
    href: "/risk-radar",
    matchPrefix: "/risk-radar",
  },
  {
    step: 4,
    title: "4. Smart Document Checker",
    desc: "Analyze Land Lease OCR suggestions, area norms & expiry flags",
    href: "/documents",
    matchPrefix: "/documents",
  },
  {
    step: 5,
    title: "5. Next Best Action",
    desc: "Review role-tailored deterministic next action recommendation",
    href: "/next-best-action",
    matchPrefix: "/next-best-action",
  },
  {
    step: 6,
    title: "6. Workflow Transition",
    desc: "Execute stage action & observe real-time workflow progression",
    href: "/workflow",
    matchPrefix: "/workflow",
  },
  {
    step: 7,
    title: "7. Reminder & Escalation",
    desc: "Inspect automated 30/15/7-day alerts and critical escalations",
    href: "/notifications",
    matchPrefix: "/notifications",
  },
  {
    step: 8,
    title: "8. Immutable Audit Trail",
    desc: "Verify cryptographic SHA-256 logged governance timeline",
    href: "/audit-trail",
    matchPrefix: "/audit-trail",
  },
];

export function DemoGuideBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [manualStep, setManualStep] = useState<number | null>(null);

  const matchedStep = DEMO_STEPS.find((s) => pathname.startsWith(s.matchPrefix))?.step;
  const activeStep = matchedStep ?? manualStep ?? 1;

  const handleReset = () => {
    FlowGuardStore.resetToDefaultDemo();
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <div className="bg-[#EAE2D2] border-b border-[#D5DDCB] px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-[#263B32]">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8FCDBB] border border-[#263B32]/30" />
          <span>Samadhan360 Guided Evaluator Walkthrough</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="underline hover:text-[#2A6557] font-bold cursor-pointer"
        >
          Open Guided Demo Steps
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#EAE2D2] via-[#F3EBDD] to-[#B7C9A8]/35 text-[#263B32] border-b border-[#D5DDCB] px-4 sm:px-6 py-2 relative z-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#263B32] border border-[#8FCDBB]/40 flex items-center justify-center text-[#8FCDBB] shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#263B32] whitespace-nowrap">
                Evaluator Walkthrough
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-[#8FCDBB]/40 text-[#263B32] font-mono font-semibold px-2 py-0.5 rounded border border-[#8FCDBB]/70 whitespace-nowrap shrink-0">
                Interactive Flow
              </span>
            </div>
          </div>

          <div className="flex xl:hidden items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-[#263B32] hover:bg-[#FAF8F1] bg-[#FAF8F1]/80 px-2 py-1 rounded-md border border-[#D5DDCB] transition-colors cursor-pointer font-medium whitespace-nowrap"
              title="Reset database to initial benchmark records"
            >
              <RotateCcw className="w-3 h-3 text-[#68776A]" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#68776A] hover:text-[#263B32] px-1.5 py-1 font-medium cursor-pointer"
            >
              Hide
            </button>
          </div>
        </div>

        {/* Step Badges */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 xl:pb-0">
          {DEMO_STEPS.map((s) => (
            <Link
              key={s.step}
              href={s.href}
              onClick={() => setManualStep(s.step)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all border ${
                activeStep === s.step
                  ? "bg-[#263B32] text-[#FAF8F1] border-[#263B32] font-bold shadow-xs"
                  : "bg-[#FAF8F1]/90 text-[#263B32] border-[#D5DDCB] hover:bg-[#8FCDBB]/30 hover:border-[#8FCDBB]"
              }`}
              title={s.desc}
            >
              {activeStep > s.step ? (
                <CheckCircle2 className="w-3 h-3 text-[#2A6557]" />
              ) : (
                <span
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono ${
                    activeStep === s.step
                      ? "bg-[#8FCDBB] text-[#263B32]"
                      : "bg-[#EAE2D2] text-[#263B32]"
                  }`}
                >
                  {s.step}
                </span>
              )}
              <span>{s.title.split(" ")[1]}</span>
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-[#263B32] hover:bg-[#FAF8F1] bg-[#FAF8F1]/80 px-2.5 py-1 rounded-md border border-[#D5DDCB] transition-colors cursor-pointer font-medium whitespace-nowrap"
            title="Reset database to initial benchmark records"
          >
            <RotateCcw className="w-3 h-3 text-[#68776A]" />
            <span>Reset Demo</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-xs text-[#68776A] hover:text-[#263B32] px-2 py-1 font-medium cursor-pointer"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
