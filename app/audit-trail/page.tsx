"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_AUDIT_LOGS } from "@/lib/flowguard-store";
import { AuditLogEntry } from "@/lib/types";
import { Search, ShieldCheck, Calendar, X, RotateCcw } from "lucide-react";

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  useEffect(() => {
    const sync = () => setLogs(FlowGuardStore.getAuditLogs());
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

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

    if (startDate || endDate) {
      const logDateStr = log.timestamp.split(" ")[0];
      if (startDate && logDateStr < startDate) return false;
      if (endDate && logDateStr > endDate) return false;
    }

    return true;
  });

  const hasActiveFilters =
    searchQuery !== "" || actionFilter !== "All" || startDate !== "" || endDate !== "";

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
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#B7C9A8]/45 text-[#263B32] px-2.5 py-0.5 rounded border border-[#B7C9A8]">
                      Statutory Provenance
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Append-Only Ledger</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Immutable Governance Audit Trail
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Cryptographically hashed, tamper-resistant log of every workflow progression, document verification, and administrative decision.
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono bg-[#8FCDBB]/35 text-[#263B32] px-3 py-1.5 rounded-lg font-bold border border-[#8FCDBB] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2A6557]" />
                    <span>Ledger Integrity Sealed</span>
                  </span>
                </div>
              </div>

              {/* Search and Filters Bar */}
              <div className="surface-card p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Search Input */}
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-[#68776A] shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by Actor, Target ID (e.g. APP-2026-102), or Action..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB] transition-all text-[#263B32] placeholder:text-[#68776A]"
                    />
                  </div>

                  {/* Event Type Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#68776A] uppercase">
                      Event Type:
                    </span>
                    <select
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className="bg-[#F3EBDD] border border-[#D5DDCB] px-2.5 py-2 rounded-lg font-medium text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
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
                <div className="pt-3 border-t border-[#D5DDCB] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#2A6557] shrink-0" />
                      <span className="text-[11px] font-semibold text-[#68776A] uppercase">
                        Fiscal Timeframe:
                      </span>
                      <select
                        value={datePreset}
                        onChange={(e) => handlePresetChange(e.target.value)}
                        className="bg-[#F3EBDD] border border-[#D5DDCB] px-2.5 py-1.5 rounded-lg font-medium text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                      >
                        <option value="ALL">All Time</option>
                        <option value="AY_2026_27">Fiscal Year AY 2026-27</option>
                        <option value="CURRENT_MONTH">Current Month (Oct 2026)</option>
                        <option value="PREV_MONTH">Previous Month (Sep 2026)</option>
                        <option value="CUSTOM">Custom Date Range...</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 bg-[#F3EBDD] border border-[#D5DDCB] px-2.5 py-1 rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold uppercase text-[#68776A]">From:</span>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setDatePreset("CUSTOM");
                          }}
                          className="bg-transparent text-xs font-mono font-semibold focus:outline-none text-[#263B32]"
                        />
                      </div>
                      <span className="text-[#D5DDCB] font-bold">•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold uppercase text-[#68776A]">To:</span>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setDatePreset("CUSTOM");
                          }}
                          className="bg-transparent text-xs font-mono font-semibold focus:outline-none text-[#263B32]"
                        />
                      </div>
                      {(startDate || endDate) && (
                        <button
                          onClick={clearDates}
                          className="p-0.5 hover:bg-[#EAE2D2] rounded text-[#68776A] hover:text-[#263B32] transition-colors cursor-pointer"
                          title="Clear Date Range"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#68776A] font-medium">
                      Showing <strong className="text-[#263B32] font-mono">{filtered.length}</strong> of{" "}
                      {logs.length} entries
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={resetAllFilters}
                        className="flex items-center gap-1 text-[11px] text-[#2A6557] font-bold hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Audit Logs Table */}
              <div className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#EAE2D2]/80 border-b border-[#D5DDCB] text-[#68776A] font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3.5">Timestamp (IST)</th>
                        <th className="px-4 py-3.5">Actor &amp; Role</th>
                        <th className="px-4 py-3.5">Action Type</th>
                        <th className="px-4 py-3.5">Target</th>
                        <th className="px-4 py-3.5">Activity Details</th>
                        <th className="px-4 py-3.5 font-mono">Verification Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DDCB]/60">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#68776A]">
                            <p className="font-semibold text-sm text-[#263B32]">
                              No audit logs match your date or search filters.
                            </p>
                            <p className="text-xs text-[#68776A] mt-1">
                              Try expanding your fiscal timeframe or clearing search keywords.
                            </p>
                            <button
                              onClick={resetAllFilters}
                              className="mt-3 px-3 py-1.5 bg-[#EAE2D2] hover:bg-[#D5DDCB] text-[#263B32] text-xs font-bold rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset All Filters</span>
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((log, idx) => (
                          <tr
                            key={log.id}
                            className={`hover:bg-[#8FCDBB]/15 transition-colors ${
                              idx % 2 === 1 ? "bg-[#F3EBDD]/45" : "bg-[#FAF8F1]"
                            }`}
                          >
                            <td className="px-4 py-3 font-mono text-[11px] text-[#68776A] whitespace-nowrap">
                              {log.timestamp}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-[#263B32] leading-tight">{log.actorName}</p>
                              <span className="text-[9px] font-mono font-bold text-[#2A6557] uppercase">
                                {log.actorRole}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-[10px] font-bold bg-[#EAE2D2] text-[#263B32] px-2 py-0.5 rounded border border-[#D5DDCB]">
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-[#263B32]">
                              {log.targetId}
                            </td>
                            <td className="px-4 py-3 text-[#263B32]/90 max-w-md leading-relaxed">
                              {log.details}
                            </td>
                            <td className="px-4 py-3 font-mono text-[10px] text-[#68776A] whitespace-nowrap">
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
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
