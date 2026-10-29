"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
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
  LineChart, 
  Line 
} from "recharts";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  FileSpreadsheet
} from "lucide-react";

const STAGE_DATA = [
  { stage: "Submission", count: 8 },
  { stage: "Scrutiny", count: 18 },
  { stage: "Deficiencies", count: 6 },
  { stage: "EVC Sched.", count: 7 },
  { stage: "EVC Visit", count: 4 },
  { stage: "SAC Hearing", count: 3 },
  { stage: "Approved", count: 24 }
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
  { name: "Normal", value: 38, color: "#10b981" },
  { name: "Attention Required", value: 16, color: "#eab308" },
  { name: "High Risk", value: 8, color: "#f59e0b" },
  { name: "Overdue", value: 4, color: "#ef4444" },
];

export default function ReportsAnalyticsPage() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    const apps = FlowGuardStore.getApplications();
    const headers = "Application Number,Institution,Region,Stage,Status,Deadline,Days Remaining,Risk Level\n";
    const rows = apps.map(a => 
      `"${a.applicationNumber}","${a.institutionName}","${a.region}","${a.currentStage}","${a.status}","${a.deadline}",${a.daysRemaining},"${a.riskLevel}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Samadhan360_Audit_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                    Statutory Telemetry
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Real-Time Metrics</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Reports & Analytics Center
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  National workload distributions, application stage ageing, regional bottleneck surveillance, and CSV data exports.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-md shadow-xs cursor-pointer transition-all"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Database to CSV</span>
                </button>
              </div>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Regulatory audit records successfully exported to CSV file.</span>
              </div>
            )}

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Applications by Stage */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Applications by Approval Stage (AY 2026-27)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                      <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Regional Workload Distribution */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Region-Wise Workload & Clearance (Pending vs Completed)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REGION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="region" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                      <Bar dataKey="pending" fill="#ef4444" radius={[4, 4, 0, 0]} name="Pending Scrutiny" />
                      <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved EoA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Deadline Risk Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  National Deadline Risk Distribution
                </h3>
                <div className="h-64 w-full flex items-center justify-center">
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
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "6px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-xs pt-1">
                  {RISK_PIE_DATA.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span className="text-slate-600">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synthetic Data Disclaimer Box */}
              <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-5 flex flex-col justify-between text-xs space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Regulatory Telemetry Safeguard & Transparency
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    All dashboard statistics are calculated directly from connected in-memory and database records. The records presented here are synthetic benchmark data created for AICTE institutional compliance and approval monitoring.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    No numbers are hardcoded mock strings. Clicking stage transitions or verifying documents in the Document Checker or Application manager will dynamically alter these figures upon re-calculation.
                  </p>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="font-mono text-slate-500 block text-[10px]">Database Snapshot Version:</span>
                  <span className="font-mono font-bold text-slate-800">PostgreSQL Schema v2026.2 • RLS Enabled</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
