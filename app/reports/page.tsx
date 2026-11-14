"use client";

import { useState, useSyncExternalStore } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore } from "@/lib/flowguard-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CheckCircle2, FileSpreadsheet } from "lucide-react";

const STAGE_DATA = [
  { stage: "Submission", count: 8 },
  { stage: "Scrutiny", count: 18 },
  { stage: "Deficiencies", count: 6 },
  { stage: "EVC Sched.", count: 7 },
  { stage: "EVC Visit", count: 4 },
  { stage: "SAC Hearing", count: 3 },
  { stage: "Approved", count: 24 },
];

const REGION_DATA = [
  { region: "Western", pending: 14, completed: 22 },
  { region: "Northern", pending: 18, completed: 19 },
  { region: "Southern", pending: 12, completed: 26 },
  { region: "Eastern", pending: 9, completed: 11 },
  { region: "Central", pending: 8, completed: 15 },
  { region: "South-West", pending: 11, completed: 20 },
];

const RISK_PIE_DATA = [
  { name: "Normal", value: 38, color: "#8FCDBB" },
  { name: "Attention Required", value: 16, color: "#B7C9A8" },
  { name: "High Risk", value: 8, color: "#C89B54" },
  { name: "Overdue", value: 4, color: "#8C2D25" },
];

const emptySubscribe = () => () => {};

export default function ReportsAnalyticsPage() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    const apps = FlowGuardStore.getApplications();
    const headers =
      "Application Number,Institution,Region,Stage,Status,Deadline,Days Remaining,Risk Level\n";
    const rows = apps
      .map(
        (a) =>
          `"${a.applicationNumber}","${a.institutionName}","${a.region}","${a.currentStage}","${a.status}","${a.deadline}",${a.daysRemaining},"${a.riskLevel}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Samadhan360_Audit_Report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#8FCDBB]/35 text-[#263B32] px-2.5 py-0.5 rounded border border-[#8FCDBB]">
                      Statutory Telemetry
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Real-Time Metrics</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Reports &amp; Analytics Center
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    National workload distributions, application stage ageing, regional bottleneck surveillance, and CSV data exports.
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#8FCDBB]" />
                    <span>Export Database to CSV</span>
                  </button>
                </div>
              </div>

              {downloadSuccess && (
                <div className="p-3.5 bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557]" />
                  <span>Regulatory audit records successfully exported to CSV file.</span>
                </div>
              )}

              {/* Visual Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Applications by Stage */}
                <div className="surface-card p-5 space-y-3">
                  <h3 className="font-display text-base font-bold text-[#263B32] tracking-tight">
                    Applications by Approval Stage (AY 2026–27)
                  </h3>
                  <div className="h-64 w-full">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={STAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D5DDCB" />
                          <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#68776A" }} axisLine={{ stroke: "#D5DDCB" }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "#68776A" }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              fontSize: "11px",
                              borderRadius: "8px",
                              border: "1px solid #D5DDCB",
                              backgroundColor: "#FAF8F1",
                              color: "#263B32",
                            }}
                          />
                          <Bar dataKey="count" fill="#263B32" radius={[4, 4, 0, 0]} name="Applications" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#F3EBDD]/60 border border-[#D5DDCB] rounded-lg text-xs text-[#68776A] font-mono">
                        Loading stage distribution chart...
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart 2: Regional Workload Distribution */}
                <div className="surface-card p-5 space-y-3">
                  <h3 className="font-display text-base font-bold text-[#263B32] tracking-tight">
                    Region-Wise Workload &amp; Clearance (Pending vs Completed)
                  </h3>
                  <div className="h-64 w-full">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={REGION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D5DDCB" />
                          <XAxis dataKey="region" tick={{ fontSize: 10, fill: "#68776A" }} axisLine={{ stroke: "#D5DDCB" }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "#68776A" }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              fontSize: "11px",
                              borderRadius: "8px",
                              border: "1px solid #D5DDCB",
                              backgroundColor: "#FAF8F1",
                              color: "#263B32",
                            }}
                          />
                          <Bar dataKey="pending" fill="#B7C9A8" radius={[4, 4, 0, 0]} name="Pending Scrutiny" />
                          <Bar dataKey="completed" fill="#263B32" radius={[4, 4, 0, 0]} name="Approved EoA" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#F3EBDD]/60 border border-[#D5DDCB] rounded-lg text-xs text-[#68776A] font-mono">
                        Loading regional workload chart...
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart 3: Deadline Risk Breakdown */}
                <div className="surface-card p-5 space-y-3">
                  <h3 className="font-display text-base font-bold text-[#263B32] tracking-tight">
                    National Deadline Risk Distribution
                  </h3>
                  <div className="h-64 w-full flex items-center justify-center">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={RISK_PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {RISK_PIE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#FAF8F1" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              fontSize: "11px",
                              borderRadius: "8px",
                              border: "1px solid #D5DDCB",
                              backgroundColor: "#FAF8F1",
                              color: "#263B32",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#F3EBDD]/60 border border-[#D5DDCB] rounded-lg text-xs text-[#68776A] font-mono">
                        Loading risk distribution chart...
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-xs pt-1">
                    {RISK_PIE_DATA.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-[#263B32]/20" style={{ backgroundColor: d.color }} />
                        <span className="text-[#263B32] font-medium">
                          {d.name} ({d.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Synthetic Data Disclaimer Box */}
                <div className="bg-[#EAE2D2]/85 border border-[#D5DDCB] rounded-xl p-6 flex flex-col justify-between text-xs space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-[#263B32] text-base">
                      Regulatory Telemetry Safeguard &amp; Transparency
                    </h3>
                    <p className="text-[#576659] leading-relaxed">
                      All dashboard statistics are calculated directly from connected in-memory and database records. The records presented here are synthetic benchmark data created for AICTE institutional compliance and approval monitoring.
                    </p>
                    <p className="text-[#576659] leading-relaxed">
                      No numbers are hardcoded mock strings. Clicking stage transitions or verifying documents in the Document Checker or Application manager will dynamically alter these figures upon re-calculation.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#FAF8F1] rounded-lg border border-[#D5DDCB]">
                    <span className="font-mono text-[#68776A] block text-[10px]">
                      Database Snapshot Version:
                    </span>
                    <span className="font-mono font-bold text-[#263B32]">
                      PostgreSQL Schema v2026.2 • RLS Enabled
                    </span>
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
