"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import {
  FlowGuardStore,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_INSTITUTIONS,
} from "@/lib/flowguard-store";
import { calculateAverageScore } from "@/lib/compliance";
import { Application, DocumentRecord, Institution } from "@/lib/types";
import {
  Radar,
  FileCheck2,
  Sparkles,
  BadgeCheck,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Download,
  Layers,
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
} from "recharts";

const TREND_DATA = [
  { month: "May '26", compliance: 84.2, approvals: 14 },
  { month: "Jun '26", compliance: 86.1, approvals: 21 },
  { month: "Jul '26", compliance: 85.5, approvals: 29 },
  { month: "Aug '26", compliance: 88.0, approvals: 34 },
  { month: "Sep '26", compliance: 87.4, approvals: 40 },
  { month: "Oct '26", compliance: 89.2, approvals: 46 },
];

const emptySubscribe = () => () => {};

export default function Dashboard() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [apps, setApps] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [docs, setDocs] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);

  useEffect(() => {
    const sync = () => {
      setApps(FlowGuardStore.getApplications());
      setDocs(FlowGuardStore.getDocuments());
      setInstitutions(FlowGuardStore.getInstitutions());
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  const totalApps = apps.length;
  const underScrutiny = apps.filter((a) => a.currentStage === "Scrutiny").length;
  const overdueCount = apps.filter((a) => a.riskLevel === "Overdue").length;
  const highRiskCount = apps.filter((a) => a.riskLevel === "High Risk").length;
  const expiringDocsCount = docs.filter((d) => d.isExpiringSoon).length;
  const nationalAvgScore = calculateAverageScore(
    institutions.map((i) => ({ score: i.complianceScore }))
  );
  const urgentApps = apps
    .filter((a) => a.riskLevel === "Overdue" || a.riskLevel === "High Risk")
    .slice(0, 3);

  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Hero Banner Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#D5DDCB] pb-6 relative">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#263B32] text-[#8FCDBB] px-2.5 py-0.5 rounded font-mono border border-[#8FCDBB]/30">
                      Samadhan360 Enterprise
                    </span>
                    <span className="text-xs text-[#68776A] font-semibold">
                      Institutional Approval &amp; Compliance Platform
                    </span>
                  </div>
                  <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#263B32] tracking-tight mt-2">
                    Samadhan360
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-1 max-w-2xl">
                    Smart Approval &amp; Institutional Compliance Management System powered by four integrated statutory surveillance pillars.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/reports"
                    className="px-4 py-2 text-xs font-semibold bg-[#FAF8F1] border border-[#D5DDCB] rounded-lg hover:bg-[#EAE2D2] text-[#263B32] shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#68776A]" />
                    <span>Regulatory Reports</span>
                  </Link>
                  <Link
                    href="/applications"
                    className="px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs flex items-center gap-1.5 transition-all border border-[#263B32]"
                  >
                    <span>Manage Applications</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8FCDBB]" />
                  </Link>
                </div>
              </div>

              {/* 4 Core Pillars Hero Navigation Cards */}
              <section>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#263B32] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2A6557]" />
                    Four Intelligent Innovation Pillars
                  </span>
                  <span className="text-[11px] text-[#68776A] font-semibold">
                    Core Evaluation Architecture
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pillar 1 */}
                  <Link
                    href="/risk-radar"
                    className="surface-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B7C9A8] to-[#8FCDBB] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-[#EAE2D2] border border-[#D5DDCB] text-[#263B32] flex items-center justify-center group-hover:bg-[#8FCDBB]/35 transition-colors">
                          <Radar className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#B7C9A8]/40 text-[#263B32] px-2 py-0.5 rounded border border-[#B7C9A8]">
                          Pillar 1
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#263B32] text-base group-hover:text-[#2A6557] transition-colors">
                        Smart Deadline Risk Radar
                      </h3>
                      <p className="text-xs text-[#68776A] leading-relaxed">
                        Transparent, explainable deadline surveillance identifying approaching stages, inactive records, and expiring leases.
                      </p>
                    </div>
                    <div className="pt-3 mt-4 border-t border-[#D5DDCB] flex items-center justify-between text-xs font-bold text-[#263B32]">
                      <span>{highRiskCount} High Risk • {overdueCount} Overdue</span>
                      <ArrowUpRight className="w-4 h-4 text-[#2A6557] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Pillar 2 */}
                  <Link
                    href="/documents"
                    className="surface-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8FCDBB] to-[#B7C9A8] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-[#8FCDBB]/25 border border-[#8FCDBB]/60 text-[#263B32] flex items-center justify-center group-hover:bg-[#8FCDBB]/45 transition-colors">
                          <FileCheck2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#8FCDBB]/35 text-[#263B32] px-2 py-0.5 rounded border border-[#8FCDBB]">
                          Pillar 2
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#263B32] text-base group-hover:text-[#2A6557] transition-colors">
                        Smart Document Checker
                      </h3>
                      <p className="text-xs text-[#68776A] leading-relaxed">
                        OCR extraction assistant detecting land norm deficits, duplicate file hashes, missing seals, and human verification sign-off.
                      </p>
                    </div>
                    <div className="pt-3 mt-4 border-t border-[#D5DDCB] flex items-center justify-between text-xs font-bold text-[#263B32]">
                      <span>{expiringDocsCount} Expiring Soon • Split View</span>
                      <ArrowUpRight className="w-4 h-4 text-[#2A6557] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Pillar 3 */}
                  <Link
                    href="/next-best-action"
                    className="surface-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B7C9A8] to-[#8FCDBB] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-[#B7C9A8]/35 border border-[#B7C9A8] text-[#263B32] flex items-center justify-center group-hover:bg-[#B7C9A8]/60 transition-colors">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#B7C9A8]/40 text-[#263B32] px-2 py-0.5 rounded border border-[#B7C9A8]">
                          Pillar 3
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#263B32] text-base group-hover:text-[#2A6557] transition-colors">
                        Next Best Action Assistant
                      </h3>
                      <p className="text-xs text-[#68776A] leading-relaxed">
                        Deterministic prescriptive suggestions tailored to active officer role, grounded in APH 2026 statutory rules.
                      </p>
                    </div>
                    <div className="pt-3 mt-4 border-t border-[#D5DDCB] flex items-center justify-between text-xs font-bold text-[#263B32]">
                      <span>Workflow Driven • Direct CTA</span>
                      <ArrowUpRight className="w-4 h-4 text-[#2A6557] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>

                  {/* Pillar 4 */}
                  <Link
                    href="/institutions"
                    className="surface-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8FCDBB] to-[#B7C9A8] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-[#8FCDBB]/25 border border-[#8FCDBB]/60 text-[#263B32] flex items-center justify-center group-hover:bg-[#8FCDBB]/45 transition-colors">
                          <BadgeCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#8FCDBB]/35 text-[#263B32] px-2 py-0.5 rounded border border-[#8FCDBB]">
                          Pillar 4
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-[#263B32] text-base group-hover:text-[#2A6557] transition-colors">
                        Compliance Passport
                      </h3>
                      <p className="text-xs text-[#68776A] leading-relaxed">
                        Consolidated 360° institutional dossier with permanent IDs, lease records, EVC history, undertakings, and audit trail.
                      </p>
                    </div>
                    <div className="pt-3 mt-4 border-t border-[#D5DDCB] flex items-center justify-between text-xs font-bold text-[#263B32]">
                      <span>5 Regional Dossiers • 360° View</span>
                      <ArrowUpRight className="w-4 h-4 text-[#2A6557] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </section>

              {/* Quick Metrics Cards */}
              <section>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#263B32] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#2A6557]" />
                    Live Operational Metrics
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] px-2.5 py-0.5 rounded font-mono">
                    DEMO DATA • SYNTHETIC REGISTRY
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-[#68776A] uppercase tracking-wider block">
                      Total Applications
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight tabular-nums mt-1">
                      {totalApps}
                    </span>
                    <span className="text-xs text-[#68776A] block mt-1">AY 2026–27 Active Cycle</span>
                  </div>

                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-[#68776A] uppercase tracking-wider block">
                      Under Scrutiny
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold text-[#2A6557] tracking-tight tabular-nums mt-1">
                      {underScrutiny}
                    </span>
                    <span className="text-xs text-[#68776A] block mt-1">Documentary review</span>
                  </div>

                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-[#68776A] uppercase tracking-wider block">
                      Approaching Deadline
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold text-[#7A4E16] tracking-tight tabular-nums mt-1">
                      {highRiskCount}
                    </span>
                    <span className="text-xs text-[#68776A] block mt-1">&le; 3 days remaining</span>
                  </div>

                  <div className="surface-card p-5 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-[#68776A] uppercase tracking-wider block">
                      Overdue Stages
                    </span>
                    <span
                      className={`text-2xl lg:text-3xl font-bold tracking-tight tabular-nums mt-1 ${
                        overdueCount > 0 ? "text-[#8C2D25]" : "text-[#68776A]"
                      }`}
                    >
                      {overdueCount}
                    </span>
                    <span className="text-xs text-[#68776A] block mt-1">Action lapsed</span>
                  </div>

                  <div className="surface-card p-5 flex flex-col justify-between col-span-2 lg:col-span-1 bg-gradient-to-br from-[#FAF8F1] to-[#8FCDBB]/15">
                    <span className="text-xs font-semibold text-[#68776A] uppercase tracking-wider block">
                      National Avg. Score
                    </span>
                    <span className="text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight tabular-nums mt-1">
                      {nationalAvgScore.toFixed(1)}%
                    </span>
                    <span className="text-xs text-[#2A6557] font-semibold block mt-1">
                      Across {institutions.length} dossiers
                    </span>
                  </div>
                </div>
              </section>

              {/* Secondary Grid: Trend Chart & Priority Action Items */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compliance Trend Chart (2 cols) */}
                <div className="lg:col-span-2 surface-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-3.5">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#263B32] tracking-tight">
                        Average Institutional Compliance Index (6 Months)
                      </h3>
                      <p className="text-xs text-[#68776A] mt-0.5">
                        Aggregated monthly institutional compliance scores &amp; completed approvals.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-semibold bg-[#8FCDBB]/30 text-[#263B32] px-2.5 py-0.5 rounded border border-[#8FCDBB]">
                      Recharts Live
                    </span>
                  </div>

                  <div className="h-64 w-full pt-1">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D5DDCB" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#68776A" }} axisLine={{ stroke: "#D5DDCB" }} tickLine={false} />
                          <YAxis domain={[80, 95]} tick={{ fontSize: 11, fill: "#68776A" }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              fontSize: "12px",
                              borderRadius: "10px",
                              border: "1px solid #D5DDCB",
                              backgroundColor: "#FAF8F1",
                              color: "#263B32",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="compliance"
                            stroke="#263B32"
                            strokeWidth={2.5}
                            name="Avg. Score (%)"
                            dot={{ r: 4, fill: "#8FCDBB", stroke: "#263B32", strokeWidth: 1.5 }}
                            activeDot={{ r: 6, fill: "#263B32", stroke: "#8FCDBB", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#F3EBDD]/60 border border-[#D5DDCB] rounded-lg text-xs text-[#68776A] font-mono">
                        Loading compliance trajectory chart...
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority Action Alerts (1 col) */}
                <div className="space-y-4">
                  <div className="surface-card p-5 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-2.5">
                      <span className="text-xs font-bold text-[#263B32] uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#8C2D25]" />
                        Urgent Risk Items
                      </span>
                      <span className="text-[10px] bg-[#F5DDD9] text-[#5E1A14] font-bold px-2 py-0.5 rounded font-mono border border-[#DFACA5]">
                        Priority
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {urgentApps.length === 0 ? (
                        <div className="p-4 bg-[#B7C9A8]/25 rounded-lg border border-[#B7C9A8] text-[#263B32] text-center">
                          All urgent statutory deadlines cleared.
                        </div>
                      ) : (
                        urgentApps.map((app) => {
                          const isOverdue = app.riskLevel === "Overdue";
                          return (
                            <div
                              key={app.id}
                              className={`p-3 rounded-lg border ${
                                isOverdue
                                  ? "bg-[#F5DDD9]/55 border-[#DFACA5]"
                                  : "bg-[#F5E9D3]/60 border-[#D8B989]"
                              }`}
                            >
                              <p className={`font-bold ${isOverdue ? "text-[#5E1A14]" : "text-[#7A4E16]"}`}>
                                {app.applicationNumber} ({isOverdue ? "Overdue" : `${app.daysRemaining} Days Left`})
                              </p>
                              <p className="text-xs text-[#68776A] mt-1 leading-relaxed line-clamp-2">
                                {app.riskReason}
                              </p>
                              <Link
                                href={`/applications/${app.id}`}
                                className={`text-xs font-bold hover:underline inline-flex items-center gap-1 mt-2 ${
                                  isOverdue ? "text-[#8C2D25]" : "text-[#7A4E16]"
                                }`}
                              >
                                <span>{isOverdue ? "Act on Case" : "Conduct Scrutiny"}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* AI Statutory Terminal CTA */}
                  <div className="bg-[#263B32] text-[#F3EBDD] p-5 rounded-xl border border-[#8FCDBB]/35 shadow-[0_10px_28px_-12px_rgba(38,59,50,0.4)] space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8FCDBB] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Statutory Advisor
                      </span>
                      <span className="text-[10px] bg-[#8FCDBB]/20 text-[#8FCDBB] font-mono px-2 py-0.5 rounded border border-[#8FCDBB]/30">
                        Grounding Live
                      </span>
                    </div>
                    <p className="text-xs text-[#EAE2D2]/85 leading-relaxed">
                      Query the latest AICTE Approval Process Handbook (APH 2026), court rulings, and live Google Search regulatory gazette.
                    </p>
                    <Link
                      href="/advisor"
                      className="w-full py-2.5 px-3 text-xs font-bold bg-[#8FCDBB] hover:bg-[#7DC2AE] text-[#263B32] rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Launch AI Statutory Advisor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
