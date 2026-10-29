"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { AuditLogEntry } from "@/lib/types";
import { 
  Search, 
  ShieldCheck, 
  Calendar,
  X,
  RotateCcw,
  Clock,
  Filter
} from "lucide-react";

export default function AuditTrailPage() {
  const [logs] = useState<AuditLogEntry[]>(() => FlowGuardStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  
  // Date Range state
  const [datePreset, setDatePreset] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    if (preset === "ALL") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "AY_2026_27") {
      setStartDate("2026-04-01");
      setEndDate("2027-03-31");
    } else if (preset === "CURRENT_MONTH") {
      setStartDate("2026-10-01");
      setEndDate("2026-10-31");
    } else if (preset === "PREV_MONTH") {
      setStartDate("2026-09-01");
      setEndDate("2026-09-30");
    }
  };

  const clearDates = () => {
    setDatePreset("ALL");
    setStartDate("");
    setEndDate("");
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActionFilter("All");
    clearDates();
  };

  const filtered = logs.filter((log) => {
    if (actionFilter !== "All" && log.action !== actionFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        log.actorName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Date range filtering
    if (startDate || endDate) {
      const logDateStr = log.timestamp.split(" ")[0]; // "2026-10-28"
      if (startDate && logDateStr < startDate) return false;
      if (endDate && logDateStr > endDate) return false;
    }

    return true;
  });

  const hasActiveFilters = searchQuery !== "" || actionFilter !== "All" || startDate !== "" || endDate !== "";

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
                    Statutory Provenance
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Append-Only Ledger</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Immutable Governance Audit Trail
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Cryptographically hashed, tamper-resistant log of every workflow progression, document verification, and administrative decision.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded font-bold border border-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Ledger Integrity Sealed</span>
                </span>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Search Input */}
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by Actor, Target ID (e.g. APP-2026-102), or Action..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800"
                  />
                </div>

                {/* Event Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Event Type:</span>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="All">All Event Types</option>
                    <option value="STAGE_TRANSITION">Stage Transitions</option>
                    <option value="DOCUMENT_VERIFIED">Document Verifications</option>
                    <option value="DOCUMENT_UPLOAD">Document Uploads</option>
                    <option value="DEADLINE_RISK_RECALCULATION">Risk Radar Recalculations</option>
                    <option value="DEFICIENCY_NOTICE_ISSUED">Deficiency Notices</option>
                  </select>
                </div>
              </div>

              {/* Date Range Filter Strip */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Fiscal Preset Selector */}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Fiscal Timeframe:</span>
                    <select
                      value={datePreset}
                      onChange={(e) => handlePresetChange(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="ALL">All Time</option>
                      <option value="AY_2026_27">Fiscal Year AY 2026-27</option>
                      <option value="CURRENT_MONTH">Current Month (Oct 2026)</option>
                      <option value="PREV_MONTH">Previous Month (Sep 2026)</option>
                      <option value="CUSTOM">Custom Date Range...</option>
                    </select>
                  </div>

                  {/* Start & End Date Inputs */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">From:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setDatePreset("CUSTOM");
                        }}
                        className="bg-transparent text-xs font-mono font-semibold focus:outline-none text-slate-800"
                      />
                    </div>
                    <span className="text-slate-300 font-bold">•</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">To:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setDatePreset("CUSTOM");
                        }}
                        className="bg-transparent text-xs font-mono font-semibold focus:outline-none text-slate-800"
                      />
                    </div>
                    {(startDate || endDate) && (
                      <button
                        onClick={clearDates}
                        className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Clear Date Range"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Summary & Reset */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Showing <strong className="text-slate-900 font-mono">{filtered.length}</strong> of {logs.length} entries
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="flex items-center gap-1 text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Timestamp (IST)</th>
                      <th className="px-4 py-3">Actor & Role</th>
                      <th className="px-4 py-3">Action Type</th>
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Activity Details</th>
                      <th className="px-4 py-3 font-mono">Verification Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                          <p className="font-semibold text-sm text-slate-700">No audit logs match your date or search filters.</p>
                          <p className="text-xs text-slate-500 mt-1">Try expanding your fiscal timeframe or clearing search keywords.</p>
                          <button
                            onClick={resetAllFilters}
                            className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset All Filters</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900 leading-tight">{log.actorName}</p>
                            <span className="text-[9px] font-mono font-bold text-amber-700 uppercase">
                              {log.actorRole}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                            {log.targetId}
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-md leading-relaxed">
                            {log.details}
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                            {log.verifiedHash}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
