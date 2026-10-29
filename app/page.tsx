"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Application, DocumentRecord } from "@/lib/types";
import { 
  Radar, 
  FileCheck2, 
  Sparkles, 
  BadgeCheck, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowUpRight, 
  Download, 
  RefreshCw, 
  Building2, 
  CalendarClock,
  Layers,
  FileText
} from "lucide-react";
import Link from "next/link";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from "recharts";

const TREND_DATA = [
  { month: "May '26", compliance: 84.2, approvals: 14 },
  { month: "Jun '26", compliance: 86.1, approvals: 21 },
  { month: "Jul '26", compliance: 85.5, approvals: 29 },
  { month: "Aug '26", compliance: 88.0, approvals: 34 },
  { month: "Sep '26", compliance: 87.4, approvals: 40 },
  { month: "Oct '26", compliance: 89.2, approvals: 46 }
];

export default function Dashboard() {
  const [apps] = useState<Application[]>(() => FlowGuardStore.getApplications());
  const [docs] = useState<DocumentRecord[]>(() => FlowGuardStore.getDocuments());

  const totalApps = apps.length;
  const underScrutiny = apps.filter(a => a.currentStage === "Scrutiny").length;
  const overdueCount = apps.filter(a => a.riskLevel === "Overdue").length;
  const highRiskCount = apps.filter(a => a.riskLevel === "High Risk").length;
  const expiringDocsCount = docs.filter(d => d.isExpiringSoon).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Hero Banner Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                    Samadhan360 Enterprise
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Institutional Approval & Compliance Platform
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Samadhan360
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Smart Approval & Institutional Compliance Management System with 4 Core Intelligent Pillars.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/reports"
                  className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700 shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Regulatory Reports</span>
                </Link>
                <Link
                  href="/applications"
                  className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md shadow-xs flex items-center gap-1.5"
                >
                  <span>Manage Applications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4 Core Pillars Hero Navigation Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Four Intelligent Innovation Pillars
                </span>
                <span className="text-[11px] text-amber-700 font-bold">
                  Core Evaluation Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Pillar 1 */}
                <Link
                  href="/risk-radar"
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Radar className="w-5 h-5 text-amber-700" />
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                        Pillar 1
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors">
                      Smart Deadline Risk Radar
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Transparent, explainable deadline surveillance identifying approaching stages, inactive records, and expiring leases.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>{highRiskCount} High Risk • {overdueCount} Overdue</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* Pillar 2 */}
                <Link
                  href="/documents"
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                        <FileCheck2 className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
                        Pillar 2
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-800 transition-colors">
                      Smart Document Checker
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      OCR extraction assistant detecting land norm deficits, duplicate file hashes, missing seals, and human verification sign-off.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                    <span>{expiringDocsCount} Expiring Soon • Split View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* Pillar 3 */}
                <Link
                  href="/next-best-action"
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-700" />
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200">
                        Pillar 3
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-800 transition-colors">
                      Next Best Action Assistant
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Deterministic prescriptive suggestions tailored to active officer role, grounded in APH 2026 statutory rules.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                    <span>Workflow Driven • Direct CTA</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                {/* Pillar 4 */}
                <Link
                  href="/institutions"
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <BadgeCheck className="w-5 h-5 text-emerald-700" />
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                        Pillar 4
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                      Compliance Passport
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Consolidated 360° institutional dossier with permanent IDs, lease records, EVC history, undertakings, and audit trail.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>5 Regional Dossiers • 360° View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  Live Operational Metrics
                </span>
                <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                  DEMO DATA • SYNTHETIC REGISTRY
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Applications</span>
                  <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight tabular-nums mt-1">{totalApps}</span>
                  <span className="text-xs text-slate-500 block mt-1">AY 2026-27 Active Cycle</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Under Scrutiny</span>
                  <span className="text-2xl lg:text-3xl font-bold text-sky-700 tracking-tight tabular-nums mt-1">{underScrutiny}</span>
                  <span className="text-xs text-slate-500 block mt-1">Documentary review</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Approaching Deadline</span>
                  <span className="text-2xl lg:text-3xl font-bold text-amber-700 tracking-tight tabular-nums mt-1">{highRiskCount}</span>
                  <span className="text-xs text-slate-500 block mt-1">&le; 3 days remaining</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Overdue Stages</span>
                  <span className={`text-2xl lg:text-3xl font-bold tracking-tight tabular-nums mt-1 ${overdueCount > 0 ? "text-red-600" : "text-slate-400"}`}>
                    {overdueCount}
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">Action lapsed</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">National Avg. Score</span>
                  <span className="text-2xl lg:text-3xl font-bold text-emerald-700 tracking-tight tabular-nums mt-1">89.2%</span>
                  <span className="text-xs text-slate-500 block mt-1">+2.4% over 6 months</span>
                </div>
              </div>
            </div>

            {/* Secondary Grid: Trend Chart & Priority Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Compliance Trend Chart (2 cols) */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Average Institutional Compliance Index (6 Months)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Aggregated monthly institutional compliance scores & completed approvals.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Recharts Live
                  </span>
                </div>

                <div className="h-64 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis domain={[80, 95]} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                      <Line 
                        type="monotone" 
                        dataKey="compliance" 
                        stroke="#0284c7" 
                        strokeWidth={2.5} 
                        name="Avg. Score (%)" 
                        dot={{ r: 4, fill: "#0284c7" }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Priority Action Alerts (1 col) */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-red-200/80 shadow-xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-red-100 pb-2">
                    <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Urgent Risk Items
                    </span>
                    <span className="text-[9px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded font-mono border border-red-200">
                      Priority
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-red-50/70 rounded-lg border border-red-200/80">
                      <p className="font-bold text-red-950">APP-2026-AICTE-088 (Overdue)</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">EVC Scheduling window expired on Oct 24. Action required by EVC Coordinator.</p>
                      <Link href="/applications/app-002" className="text-xs text-red-700 font-bold hover:underline inline-flex items-center gap-1 mt-2">
                        <span>Act on Case</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80">
                      <p className="font-bold text-amber-950">APP-2026-AICTE-102 (2 Days Left)</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">VJTI scrutiny committee findings pending. Inactive for 6 days.</p>
                      <Link href="/applications/app-001" className="text-xs text-amber-800 font-bold hover:underline inline-flex items-center gap-1 mt-2">
                        <span>Conduct Scrutiny</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* AI Statutory Terminal CTA */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 rounded-xl border border-amber-500/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Statutory Advisor
                    </span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500/30">
                      Grounding Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Query the latest AICTE Approval Process Handbook (APH 2026), court rulings, and live Google Search regulatory gazette.
                  </p>
                  <Link
                    href="/advisor"
                    className="w-full py-2 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Launch AI Statutory Advisor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
