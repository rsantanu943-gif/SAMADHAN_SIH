"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Application, OverlapRecord } from "@/lib/types";
import { 
  Radar, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  Search, 
  ArrowUpRight, 
  Calendar, 
  Building2, 
  User, 
  RefreshCw,
  Bell,
  HelpCircle,
  FileText,
  Copy,
  Check,
  XCircle,
  Layers
} from "lucide-react";
import Link from "next/link";

export default function RiskRadarPage() {
  const [apps, setApps] = useState<Application[]>(() => FlowGuardStore.getApplications());
  const [overlaps, setOverlaps] = useState<OverlapRecord[]>(() => FlowGuardStore.getOverlaps());
  const [selectedRisk, setSelectedRisk] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [reminderConfigOpen, setReminderConfigOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ id: string; action: 'CONFIRM' | 'DISMISS' } | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setApps(FlowGuardStore.getApplications());
      setOverlaps(FlowGuardStore.getOverlaps());
      setIsRecalculating(false);
    }, 600);
  };

  const handleReviewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;
    const currentUser = FlowGuardStore.getCurrentUser();
    if (reviewModal.action === 'CONFIRM') {
      FlowGuardStore.confirmOverlap(reviewModal.id, reviewRemarks, currentUser.name);
    } else {
      FlowGuardStore.dismissOverlap(reviewModal.id, reviewRemarks, currentUser.name);
    }
    setOverlaps(FlowGuardStore.getOverlaps());
    setReviewModal(null);
    setReviewRemarks("");
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

  // Risk Distribution Counts
  const counts = {
    Overdue: apps.filter(a => a.riskLevel === "Overdue").length,
    HighRisk: apps.filter(a => a.riskLevel === "High Risk").length,
    Attention: apps.filter(a => a.riskLevel === "Attention Required").length,
    Normal: apps.filter(a => a.riskLevel === "Normal").length,
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                    Pillar 1 • Explainable Monitoring
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Rule-Engine v2026.1</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Smart Deadline Risk Radar & Overlap Centre
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Automated scrutiny & compliance timer surveillance with human review for overlapping cases and duplicate records.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setReminderConfigOpen(!reminderConfigOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Configure Escalations</span>
                </button>
                <button
                  onClick={handleRecalculate}
                  disabled={isRecalculating}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md shadow-xs cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? "animate-spin" : ""}`} />
                  <span>{isRecalculating ? "Recalculating..." : "Recalculate Radar"}</span>
                </button>
              </div>
            </div>

            {/* Overlap Centre Panel */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Overlap Centre • Potential Cross-Case Collisions</h2>
                    <p className="text-xs text-slate-600">Review system-flagged duplicate document hashes, land plot collisions, and faculty record overlaps.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                  {overlaps.filter(o => o.status === 'UNREVIEWED').length} Unreviewed Case(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overlaps.map(ovl => (
                  <div key={ovl.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        ovl.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ovl.type.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ovl.status === 'CONFIRMED_OVERLAP' ? 'bg-red-50 text-red-700 border border-red-200' :
                        ovl.status === 'DISMISSED' ? 'bg-slate-200 text-slate-700' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ovl.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-slate-900">{ovl.primaryInstitutionName}</p>
                      <p className="text-slate-600">Matches: <span className="font-semibold text-slate-800">{ovl.targetInstitutionName}</span></p>
                      <p className="text-slate-500 font-mono text-[11px] truncate">
                        <span className="font-sans font-medium text-slate-700">{ovl.matchedField}:</span> {ovl.matchedValue}
                      </p>
                    </div>

                    {ovl.status === 'UNREVIEWED' ? (
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                        <button
                          onClick={() => setReviewModal({ id: ovl.id, action: 'CONFIRM' })}
                          className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm Overlap</span>
                        </button>
                        <button
                          onClick={() => setReviewModal({ id: ovl.id, action: 'DISMISS' })}
                          className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3 h-3 text-slate-600" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                        Reviewed by <span className="font-semibold text-slate-800">{ovl.reviewedBy}</span> on {ovl.reviewedAt}. Remarks: &quot;{ovl.reviewRemarks}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reminder Config Panel (Collapsible) */}
            {reminderConfigOpen && (
              <div className="bg-amber-50/80 border border-amber-300/60 rounded-lg p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                    <Bell className="w-4 h-4 text-amber-700" />
                    Automated Deadline Notification & Escalation Schedule
                  </h3>
                  <button 
                    onClick={() => setReminderConfigOpen(false)}
                    className="text-amber-800 hover:text-amber-950 font-bold"
                  >
                    Close
                  </button>
                </div>
                <p className="text-amber-900/80">
                  Backend timer checks run at 00:00 & 12:00 IST. Transparency guarantee: No score is a black-box heuristic; every alert lists triggering conditions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <p className="font-bold text-slate-800">T-30 Days Notice</p>
                    <p className="text-[11px] text-slate-500 mt-1">Lease expiry & long-lead compliance reminder to Institution Admin.</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <p className="font-bold text-slate-800">T-7 Days Urgency</p>
                    <p className="text-[11px] text-slate-500 mt-1">Direct alert to Scrutiny Officer & RO for approaching deadline.</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <p className="font-bold text-slate-800">T-2 Days Critical</p>
                    <p className="text-[11px] text-slate-500 mt-1">Elevates case to High Risk if inactive &gt; 5 days.</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-amber-200">
                    <p className="font-bold text-red-700">T-0 Overdue Escalation</p>
                    <p className="text-[11px] text-slate-500 mt-1">Immediate dispatch to Bureau Head & Member Secretary.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Category Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => setSelectedRisk(selectedRisk === "Overdue" ? "All" : "Overdue")}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRisk === "Overdue" 
                    ? "bg-red-50 border-red-500 ring-2 ring-red-400" 
                    : "bg-white border-slate-200 hover:border-red-300"
                }`}
              >
                <div className="flex items-center justify-between text-red-600">
                  <span className="text-xs font-bold uppercase tracking-wider">Overdue</span>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">{counts.Overdue}</div>
                <p className="text-[11px] text-slate-500 mt-1">Statutory deadline lapsed; mandatory action incomplete</p>
              </button>

              <button 
                onClick={() => setSelectedRisk(selectedRisk === "High Risk" ? "All" : "High Risk")}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRisk === "High Risk" 
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400" 
                    : "bg-white border-slate-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center justify-between text-amber-600">
                  <span className="text-xs font-bold uppercase tracking-wider">High Risk</span>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">{counts.HighRisk}</div>
                <p className="text-[11px] text-slate-500 mt-1">&le; 3 days remaining or inactive &gt; 5 days</p>
              </button>

              <button 
                onClick={() => setSelectedRisk(selectedRisk === "Attention Required" ? "All" : "Attention Required")}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRisk === "Attention Required" 
                    ? "bg-yellow-50 border-yellow-500 ring-2 ring-yellow-400" 
                    : "bg-white border-slate-200 hover:border-yellow-300"
                }`}
              >
                <div className="flex items-center justify-between text-yellow-600">
                  <span className="text-xs font-bold uppercase tracking-wider">Attention Req.</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">{counts.Attention}</div>
                <p className="text-[11px] text-slate-500 mt-1">&le; 7 days remaining or resubmission pending</p>
              </button>

              <button 
                onClick={() => setSelectedRisk(selectedRisk === "Normal" ? "All" : "Normal")}
                className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedRisk === "Normal" 
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400" 
                    : "bg-white border-slate-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between text-emerald-600">
                  <span className="text-xs font-bold uppercase tracking-wider">Normal</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">{counts.Normal}</div>
                <p className="text-[11px] text-slate-500 mt-1">Sufficient time remaining; on schedule</p>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by App ID, Institute, or Officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Region */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded font-medium text-slate-700"
                >
                  <option value="All">All Regions</option>
                  <option value="Western">Western Region</option>
                  <option value="Northern">Northern Region</option>
                  <option value="Eastern">Eastern Region</option>
                  <option value="South-Western">South-Western Region</option>
                </select>

                {/* Stage */}
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded font-medium text-slate-700"
                >
                  <option value="All">All Stages</option>
                  <option value="Scrutiny">Scrutiny</option>
                  <option value="Deficiencies">Deficiencies</option>
                  <option value="EVC Scheduling">EVC Scheduling</option>
                  <option value="Final Approval">Final Approval</option>
                </select>

                {(selectedRisk !== "All" || selectedRegion !== "All" || selectedStage !== "All" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedRisk("All");
                      setSelectedRegion("All");
                      setSelectedStage("All");
                      setSearchQuery("");
                    }}
                    className="text-amber-700 font-bold hover:underline px-2 py-1"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Radar Case Feed */}
            <div className="space-y-4">
              {filteredApps.length === 0 ? (
                <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
                  No applications match the current filter criteria.
                </div>
              ) : (
                filteredApps.map((app) => {
                  const isOverdue = app.riskLevel === "Overdue";
                  const isHighRisk = app.riskLevel === "High Risk";
                  const isAttention = app.riskLevel === "Attention Required";

                  return (
                    <div 
                      key={app.id}
                      className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        {/* Left Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                              {app.applicationNumber}
                            </span>

                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              isOverdue ? "bg-red-600 text-white" :
                              isHighRisk ? "bg-amber-600 text-white" :
                              isAttention ? "bg-yellow-400 text-slate-950 font-bold" :
                              "bg-emerald-600 text-white"
                            }`}>
                              {app.riskLevel}
                            </span>

                            <span className="text-xs text-slate-600 font-semibold">
                              Stage: <span className="text-slate-900">{app.currentStage}</span>
                            </span>

                            <span className="text-xs text-slate-400">•</span>

                            <span className="text-xs text-slate-600 font-semibold">
                              Region: <span className="text-slate-900">{app.region}</span>
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900">
                            {app.institutionName}
                          </h3>
                          <p className="text-xs text-slate-600">
                            {app.category} • Academic Year {app.academicYear}
                          </p>

                          {/* Transparent Rule-Based Reason */}
                          <div className="mt-3 p-3 bg-slate-50 rounded-md border border-slate-200/80 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Rule-Based Risk Explanation:</span>
                            </div>
                            <p className="text-slate-700 pl-5 leading-relaxed font-medium">
                              {app.riskReason}
                            </p>
                            <div className="pt-1 text-[11px] text-amber-900 pl-5 font-semibold flex items-center gap-1">
                              <span>Recommended Next Action:</span>
                              <span className="font-normal text-slate-800">{app.recommendedAction}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Timing & CTA */}
                        <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-5 space-y-3">
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Configured Deadline:</span>
                              <span className="font-mono font-bold text-slate-800">{app.deadline}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Days Remaining:</span>
                              <span className={`font-mono font-black ${
                                app.daysRemaining < 0 ? "text-red-600" :
                                app.daysRemaining <= 2 ? "text-amber-600" :
                                "text-slate-800"
                              }`}>
                                {app.daysRemaining < 0 ? `${Math.abs(app.daysRemaining)} Days OVERDUE` : `${app.daysRemaining} Days`}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Assigned Officer:</span>
                              <span className="text-slate-800 text-right truncate max-w-[130px] font-medium" title={app.assignedOfficerName}>
                                {app.assignedOfficerName}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <Link 
                              href={`/applications/${app.id}`}
                              className="w-full text-center py-2 px-3 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <span>Act on Case</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>

                            <Link 
                              href={`/institutions/${app.institutionId}`}
                              className="w-full text-center py-1.5 px-3 text-[11px] font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
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
        </main>
      </div>

      {/* Review Remarks Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">
              {reviewModal.action === 'CONFIRM' ? 'Confirm Overlap Flag' : 'Dismiss Overlap Alert'}
            </h3>
            <p className="text-xs text-slate-600">
              Please enter official review remarks for audit logging.
            </p>

            <form onSubmit={handleReviewAction} className="space-y-4">
              <textarea
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="Enter officer review notes..."
                required
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 h-24"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-3.5 py-2 text-xs font-bold text-white rounded shadow-xs ${
                    reviewModal.action === 'CONFIRM' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {reviewModal.action === 'CONFIRM' ? 'Confirm & Log' : 'Dismiss Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

