"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw,
  Compass
} from "lucide-react";
import { FlowGuardStore } from "@/lib/flowguard-store";

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Compliance Passport",
    desc: "Inspect 360° regulatory profile for VJTI (Permanent ID 1-4029102)",
    href: "/institutions/inst-001"
  },
  {
    step: 2,
    title: "2. Approaching Deadline",
    desc: "Examine APP-2026-AICTE-102 (2 days left, 6 days inactive)",
    href: "/applications/app-001"
  },
  {
    step: 3,
    title: "3. Deadline Risk Radar",
    desc: "View rule-based transparent risk explanation & filter radar",
    href: "/risk-radar"
  },
  {
    step: 4,
    title: "4. Smart Document Checker",
    desc: "Analyze Land Lease OCR suggestions, area norms & expiry flags",
    href: "/documents"
  },
  {
    step: 5,
    title: "5. Next Best Action",
    desc: "Review role-tailored deterministic next action recommendation",
    href: "/next-best-action"
  },
  {
    step: 6,
    title: "6. Workflow Transition",
    desc: "Execute stage action & observe real-time workflow progression",
    href: "/workflow"
  },
  {
    step: 7,
    title: "7. Reminder & Escalation",
    desc: "Inspect automated 30/15/7-day alerts and critical escalations",
    href: "/notifications"
  },
  {
    step: 8,
    title: "8. Immutable Audit Trail",
    desc: "Verify cryptographic SHA-256 logged governance timeline",
    href: "/audit-trail"
  }
];

export function DemoGuideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleReset = () => {
    FlowGuardStore.resetToDefaultDemo();
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Demo workspace · Explore Samadhan360</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="underline hover:text-amber-700 font-bold cursor-pointer"
        >
          Take a guided tour
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white border-b border-amber-500/30 px-6 py-3 shadow-md relative z-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Evaluator Guided Walkthrough
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                Interactive Flow
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Four Core Pillars: Risk Radar • Doc Checker • Next Best Action • Compliance Passport
            </p>
          </div>
        </div>

        {/* Step Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {DEMO_STEPS.map((s) => (
            <Link
              key={s.step}
              href={s.href}
              onClick={() => setActiveStep(s.step)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all border ${
                activeStep === s.step
                  ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm"
                  : "bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
              title={s.desc}
            >
              {activeStep > s.step ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-slate-900/60 flex items-center justify-center text-[9px] font-mono">
                  {s.step}
                </span>
              )}
              <span>{s.title.split(" ")[1]}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            title="Reset database to initial benchmark records"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
