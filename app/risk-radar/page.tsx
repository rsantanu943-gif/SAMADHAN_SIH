"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import {
  FlowGuardStore,
  INITIAL_APPLICATIONS,
  INITIAL_OVERLAPS,
} from "@/lib/flowguard-store";
import { Application, OverlapRecord } from "@/lib/types";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Search,
  ArrowUpRight,
  RefreshCw,
  Bell,
  HelpCircle,
  Check,
  XCircle,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function RiskRadarPage() {
  const [apps, setApps] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [overlaps, setOverlaps] = useState<OverlapRecord[]>(INITIAL_OVERLAPS);
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [reminderConfigOpen, setReminderConfigOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ id: string; action: "CONFIRM" | "DISMISS" } | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");

  useEffect(() => {
    const sync = () => {
      setApps(FlowGuardStore.getApplications());
      setOverlaps(FlowGuardStore.getOverlaps());
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  useEffect(() => {
    if (!reviewModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReviewModal(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reviewModal]);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      const latestApps = FlowGuardStore.getApplications();
      const latestOverlaps = FlowGuardStore.getOverlaps();
      setApps(latestApps);
      setOverlaps(latestOverlaps);
      setIsRecalculating(false);
      setStatusMessage(
        `Risk Radar & Overlap rules recalculated across ${latestApps.length} applications and ${latestOverlaps.length} cross-case collisions.`
      );
      setTimeout(() => setStatusMessage(null), 5000);
    }, 500);
  };

  const handleReviewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;
    const currentUser = FlowGuardStore.getCurrentUser();
    if (reviewModal.action === "CONFIRM") {
      FlowGuardStore.confirmOverlap(reviewModal.id, reviewRemarks, currentUser.name);
      setStatusMessage("Overlap flagged and logged to immutable audit ledger.");
    } else {
      FlowGuardStore.dismissOverlap(reviewModal.id, reviewRemarks, currentUser.name);
      setStatusMessage("Overlap alert dismissed and logged to immutable audit ledger.");
    }
    setOverlaps(FlowGuardStore.getOverlaps());
    setReviewModal(null);
    setReviewRemarks("");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredApps = apps.filter((app) => {
    if (selectedRisk !== "All" && app.riskLevel !== selectedRisk) return false;
    if (selectedRegion !== "All" && app.region !== selectedRegion) return false;
    if (selectedStage !== "All" && app.currentStage !== selectedStage) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        app.applicationNumber.toLowerCase().includes(q) ||
        app.institutionName.toLowerCase().includes(q) ||
        app.assignedOfficerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const counts = {
    Overdue: apps.filter((a) => a.riskLevel === "Overdue").length,
    HighRisk: apps.filter((a) => a.riskLevel === "High Risk").length,
    Attention: apps.filter((a) => a.riskLevel === "Attention Required").length,
    Normal: apps.filter((a) => a.riskLevel === "Normal").length,
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
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#B7C9A8]/45 text-[#263B32] px-2.5 py-0.5 rounded border border-[#B7C9A8]">
                      Pillar 1 • Explainable Monitoring
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Rule-Engine v2026.1</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Smart Deadline Risk Radar &amp; Overlap Centre
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Automated scrutiny &amp; compliance timer surveillance with human review for overlapping cases and duplicate records.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setReminderConfigOpen(!reminderConfigOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#FAF8F1] border border-[#D5DDCB] rounded-lg hover:bg-[#EAE2D2] text-[#263B32] shadow-xs cursor-pointer transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#2A6557]" />
                    <span>Configure Escalations</span>
                  </button>
                  <button
                    onClick={handleRecalculate}
                    disabled={isRecalculating}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#8FCDBB] ${isRecalculating ? "animate-spin" : ""}`} />
                    <span>{isRecalculating ? "Recalculating..." : "Recalculate Radar"}</span>
                  </button>
                </div>
              </div>

              {statusMessage && (
                <div className="bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557] shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Overlap Centre Panel */}
              <div className="surface-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D5DDCB] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#EAE2D2] border border-[#D5DDCB]">
                      <Layers className="w-4 h-4 text-[#263B32]" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-[#263B32]">
                        Overlap Centre • Potential Cross-Case Collisions
                      </h2>
                      <p className="text-xs text-[#68776A]">
                        Review system-flagged duplicate document hashes, land plot collisions, and faculty record overlaps.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#263B32] bg-[#EAE2D2] border border-[#D5DDCB] px-2.5 py-1 rounded-md">
                    {overlaps.filter((o) => o.status === "UNREVIEWED").length} Unreviewed Case(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {overlaps.map((ovl) => (
                    <div
                      key={ovl.id}
                      className="p-4 rounded-xl border border-[#D5DDCB] bg-[#F3EBDD]/65 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            ovl.severity === "CRITICAL"
                              ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                              : "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                          }`}
                        >
                          {ovl.type.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            ovl.status === "CONFIRMED_OVERLAP"
                              ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                              : ovl.status === "DISMISSED"
                              ? "bg-[#EAE2D2] text-[#68776A] border-[#D5DDCB]"
                              : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                          }`}
                        >
                          {ovl.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-[#263B32] text-sm">{ovl.primaryInstitutionName}</p>
                        <p className="text-[#68776A]">
                          Matches: <span className="font-semibold text-[#263B32]">{ovl.targetInstitutionName}</span>
                        </p>
                        <p className="text-[#68776A] font-mono text-[11px] truncate">
                          <span className="font-sans font-semibold text-[#263B32]">{ovl.matchedField}:</span>{" "}
                          {ovl.matchedValue}
                        </p>
                      </div>

                      {ovl.status === "UNREVIEWED" ? (
                        <div className="pt-2.5 flex items-center gap-2 border-t border-[#D5DDCB]">
                          <button
                            onClick={() => setReviewModal({ id: ovl.id, action: "CONFIRM" })}
                            className="flex-1 py-1.5 bg-[#8C2D25] hover:bg-[#70221B] text-[#FAF8F1] font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirm Overlap</span>
                          </button>
                          <button
                            onClick={() => setReviewModal({ id: ovl.id, action: "DISMISS" })}
                            className="flex-1 py-1.5 bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <XCircle className="w-3 h-3 text-[#68776A]" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-[#D5DDCB] text-[11px] text-[#68776A]">
                          Reviewed by <span className="font-semibold text-[#263B32]">{ovl.reviewedBy}</span> on{" "}
                          {ovl.reviewedAt}. Remarks: &quot;{ovl.reviewRemarks}&quot;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminder Config Panel (Collapsible) */}
              {reminderConfigOpen && (
                <div className="bg-[#FAF8F1] border border-[#8FCDBB] rounded-xl p-5 text-xs space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#263B32] flex items-center gap-1.5 text-sm">
                      <Bell className="w-4 h-4 text-[#2A6557]" />
                      Automated Deadline Notification &amp; Escalation Schedule
                    </h3>
                    <button
                      onClick={() => setReminderConfigOpen(false)}
                      className="text-[#263B32] hover:underline font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-[#68776A]">
                    Backend timer checks run at 00:00 &amp; 12:00 IST. Transparency guarantee: No score is a black-box heuristic; every alert lists triggering conditions.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                      <p className="font-bold text-[#263B32]">T-30 Days Notice</p>
                      <p className="text-[11px] text-[#68776A] mt-1">
                        Lease expiry &amp; long-lead compliance reminder to Institution Admin.
                      </p>
                    </div>
                    <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                      <p className="font-bold text-[#263B32]">T-7 Days Urgency</p>
                      <p className="text-[11px] text-[#68776A] mt-1">
                        Direct alert to Scrutiny Officer &amp; RO for approaching deadline.
                      </p>
                    </div>
                    <div className="bg-[#F5E9D3]/70 p-3 rounded-lg border border-[#D8B989]">
                      <p className="font-bold text-[#7A4E16]">T-2 Days Critical</p>
                      <p className="text-[11px] text-[#68776A] mt-1">
                        Elevates case to High Risk if inactive &gt; 5 days.
                      </p>
                    </div>
                    <div className="bg-[#F5DDD9]/70 p-3 rounded-lg border border-[#DFACA5]">
                      <p className="font-bold text-[#8C2D25]">T-0 Overdue Escalation</p>
                      <p className="text-[11px] text-[#68776A] mt-1">
                        Immediate dispatch to Bureau Head &amp; Member Secretary.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Category Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setSelectedRisk(selectedRisk === "Overdue" ? "All" : "Overdue")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRisk === "Overdue"
                      ? "bg-[#F5DDD9] border-[#8C2D25] ring-2 ring-[#8C2D25]/30"
                      : "bg-[#FAF8F1] border-[#D5DDCB] hover:border-[#DFACA5]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#8C2D25]">
                    <span className="text-xs font-bold uppercase tracking-wider">Overdue</span>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#263B32] tabular-nums">{counts.Overdue}</div>
                  <p className="text-[11px] text-[#68776A] mt-1">
                    Statutory deadline lapsed; mandatory action incomplete
                  </p>
                </button>

                <button
                  onClick={() => setSelectedRisk(selectedRisk === "High Risk" ? "All" : "High Risk")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRisk === "High Risk"
                      ? "bg-[#F5E9D3] border-[#7A4E16] ring-2 ring-[#7A4E16]/25"
                      : "bg-[#FAF8F1] border-[#D5DDCB] hover:border-[#D8B989]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#7A4E16]">
                    <span className="text-xs font-bold uppercase tracking-wider">High Risk</span>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#263B32] tabular-nums">{counts.HighRisk}</div>
                  <p className="text-[11px] text-[#68776A] mt-1">
                    &le; 3 days remaining or inactive &gt; 5 days
                  </p>
                </button>

                <button
                  onClick={() =>
                    setSelectedRisk(selectedRisk === "Attention Required" ? "All" : "Attention Required")
                  }
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRisk === "Attention Required"
                      ? "bg-[#B7C9A8]/45 border-[#263B32] ring-2 ring-[#B7C9A8]"
                      : "bg-[#FAF8F1] border-[#D5DDCB] hover:border-[#B7C9A8]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#263B32]">
                    <span className="text-xs font-bold uppercase tracking-wider">Attention Req.</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#263B32] tabular-nums">{counts.Attention}</div>
                  <p className="text-[11px] text-[#68776A] mt-1">
                    &le; 7 days remaining or resubmission pending
                  </p>
                </button>

                <button
                  onClick={() => setSelectedRisk(selectedRisk === "Normal" ? "All" : "Normal")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRisk === "Normal"
                      ? "bg-[#8FCDBB]/35 border-[#2A6557] ring-2 ring-[#8FCDBB]"
                      : "bg-[#FAF8F1] border-[#D5DDCB] hover:border-[#8FCDBB]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[#2A6557]">
                    <span className="text-xs font-bold uppercase tracking-wider">Normal</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#263B32] tabular-nums">{counts.Normal}</div>
                  <p className="text-[11px] text-[#68776A] mt-1">Sufficient time remaining; on schedule</p>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-[#68776A]" />
                  <input
                    type="text"
                    placeholder="Filter by App ID, Institute, or Officer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg font-medium text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                  >
                    <option value="All">All Regions</option>
                    <option value="Western">Western Region</option>
                    <option value="Northern">Northern Region</option>
                    <option value="Eastern">Eastern Region</option>
                    <option value="South-Western">South-Western Region</option>
                  </select>

                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg font-medium text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                  >
                    <option value="All">All Stages</option>
                    <option value="Scrutiny">Scrutiny</option>
                    <option value="Deficiencies">Deficiencies</option>
                    <option value="EVC Scheduling">EVC Scheduling</option>
                    <option value="Final Approval">Final Approval</option>
                  </select>

                  {(selectedRisk !== "All" ||
                    selectedRegion !== "All" ||
                    selectedStage !== "All" ||
                    searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedRisk("All");
                        setSelectedRegion("All");
                        setSelectedStage("All");
                        setSearchQuery("");
                      }}
                      className="text-[#2A6557] font-bold hover:underline px-2 py-1 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Radar Case Feed */}
              <div className="space-y-4">
                {filteredApps.length === 0 ? (
                  <div className="surface-card p-8 text-center text-[#68776A] text-xs space-y-3">
                    <p>No applications match the current filter criteria.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRisk("All");
                        setSelectedRegion("All");
                        setSelectedStage("All");
                        setSearchQuery("");
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold bg-[#F3EBDD] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] rounded-lg cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredApps.map((app) => {
                    const isOverdue = app.riskLevel === "Overdue";
                    const isHighRisk = app.riskLevel === "High Risk";
                    const isAttention = app.riskLevel === "Attention Required";

                    return (
                      <div key={app.id} className="surface-card-interactive p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          {/* Left Details */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#263B32] bg-[#EAE2D2] px-2.5 py-0.5 rounded border border-[#D5DDCB]">
                                {app.applicationNumber}
                              </span>

                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                                  isOverdue
                                    ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                    : isHighRisk
                                    ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                                    : isAttention
                                    ? "bg-[#B7C9A8]/45 text-[#263B32] border-[#B7C9A8]"
                                    : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                                }`}
                              >
                                {app.riskLevel}
                              </span>

                              <span className="text-xs text-[#68776A] font-semibold">
                                Stage: <span className="text-[#263B32]">{app.currentStage}</span>
                              </span>

                              <span className="text-xs text-[#D5DDCB]">•</span>

                              <span className="text-xs text-[#68776A] font-semibold">
                                Region: <span className="text-[#263B32]">{app.region}</span>
                              </span>
                            </div>

                            <h3 className="font-display text-lg font-bold text-[#263B32]">
                              {app.institutionName}
                            </h3>
                            <p className="text-xs text-[#68776A]">
                              {app.category} • Academic Year {app.academicYear}
                            </p>

                            {/* Transparent Rule-Based Reason */}
                            <div className="mt-3 p-3.5 bg-[#F3EBDD] rounded-lg border border-[#D5DDCB] text-xs space-y-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-[#263B32]">
                                <HelpCircle className="w-3.5 h-3.5 text-[#2A6557] shrink-0" />
                                <span>Rule-Based Risk Explanation:</span>
                              </div>
                              <p className="text-[#263B32]/90 pl-5 leading-relaxed font-medium">
                                {app.riskReason}
                              </p>
                              <div className="pt-1 text-[11px] text-[#2A6557] pl-5 font-semibold flex flex-wrap items-center gap-1">
                                <span>Recommended Next Action:</span>
                                <span className="font-normal text-[#263B32]">{app.recommendedAction}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Timing & CTA */}
                          <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#D5DDCB] pt-3 lg:pt-0 lg:pl-5 space-y-3">
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[#68776A]">Configured Deadline:</span>
                                <span className="font-mono font-bold text-[#263B32]">{app.deadline}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#68776A]">Days Remaining:</span>
                                <span
                                  className={`font-mono font-bold ${
                                    app.daysRemaining < 0
                                      ? "text-[#8C2D25]"
                                      : app.daysRemaining <= 2
                                      ? "text-[#7A4E16]"
                                      : "text-[#263B32]"
                                  }`}
                                >
                                  {app.daysRemaining < 0
                                    ? `${Math.abs(app.daysRemaining)} Days OVERDUE`
                                    : `${app.daysRemaining} Days`}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[#68776A]">Assigned Officer:</span>
                                <span
                                  className="text-[#263B32] text-right truncate max-w-[130px] font-medium"
                                  title={app.assignedOfficerName}
                                >
                                  {app.assignedOfficerName}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <Link
                                href={`/applications/${app.id}`}
                                className="w-full text-center py-2 px-3 text-xs font-bold rounded-lg bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <span>Act on Case</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#8FCDBB]" />
                              </Link>

                              <Link
                                href={`/institutions/${app.institutionId}`}
                                className="w-full text-center py-1.5 px-3 text-[11px] font-semibold rounded-lg bg-[#F3EBDD] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] transition-colors"
                              >
                                View Compliance Passport
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Review Remarks Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-[#263B32]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F1] rounded-2xl border border-[#D5DDCB] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-[#263B32] text-lg">
              {reviewModal.action === "CONFIRM" ? "Confirm Overlap Flag" : "Dismiss Overlap Alert"}
            </h3>
            <p className="text-xs text-[#68776A]">
              Please enter official review remarks for audit logging.
            </p>

            <form onSubmit={handleReviewAction} className="space-y-4">
              <textarea
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="Enter officer review notes..."
                required
                className="w-full text-xs p-3 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB] h-24"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#68776A] hover:text-[#263B32] border border-[#D5DDCB] rounded-lg bg-[#FAF8F1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer ${
                    reviewModal.action === "CONFIRM"
                      ? "bg-[#8C2D25] hover:bg-[#70221B]"
                      : "bg-[#263B32] hover:bg-[#1D2E27]"
                  }`}
                >
                  {reviewModal.action === "CONFIRM" ? "Confirm & Log" : "Dismiss Alert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
