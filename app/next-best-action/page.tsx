"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { NextBestActionItem, UserRole } from "@/lib/types";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  ShieldAlert, 
  Building2, 
  UserCheck, 
  Filter,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function NextBestActionPage() {
  const [currentRole] = useState<UserRole>(() => FlowGuardStore.getCurrentRole());
  const [actions] = useState<NextBestActionItem[]>(() => FlowGuardStore.getNextBestActions(FlowGuardStore.getCurrentRole()));
  const [roleFilter, setRoleFilter] = useState<"MY_ROLE" | "ALL">("MY_ROLE");

  const displayedActions = actions.filter((act) => {
    if (roleFilter === "MY_ROLE") {
      return act.isActionableByCurrentRole;
    }
    return true;
  });

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
                    Pillar 3 • Workflow Intelligence
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Active Role: {currentRole.replace("_", " ")}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Next Best Action Assistant
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Deterministic, workflow-grounded prescriptive actions based on current stage, deficiencies, and statutory regulations.
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-xs">
                <button
                  onClick={() => setRoleFilter("MY_ROLE")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    roleFilter === "MY_ROLE"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  My Assigned Tasks ({actions.filter(a => a.isActionableByCurrentRole).length})
                </button>
                <button
                  onClick={() => setRoleFilter("ALL")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    roleFilter === "ALL"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Active Queue ({actions.length})
                </button>
              </div>
            </div>

            {/* Regulatory Safeguard Notice */}
            <div className="bg-amber-50/70 border border-amber-300/80 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Workflow Determinism Safeguard: </strong>
                <span>
                  Actions are generated directly from verified database stages and unfulfilled prerequisites. Recommendations provide statutory guidance but cannot independently grant approvals reserved for competent authorities.
                </span>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div className="space-y-4">
              {displayedActions.length === 0 ? (
                <div className="bg-white p-12 text-center border border-slate-200 rounded-lg text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-sm">No Pending Actions for Role: {currentRole.replace("_", " ")}</p>
                  <p className="text-slate-500 mt-1">All current tasks assigned to your role are up to date or switch to &quot;All Active Queue&quot;.</p>
                </div>
              ) : (
                displayedActions.map((item, idx) => {
                  const isOverdue = item.riskLevel === "Overdue";
                  const isHighRisk = item.riskLevel === "High Risk";

                  return (
                    <div 
                      key={idx}
                      className={`bg-white rounded-lg border p-5 shadow-xs transition-all hover:shadow-md ${
                        isOverdue ? "border-l-4 border-l-red-500" :
                        isHighRisk ? "border-l-4 border-l-amber-500" :
                        "border-l-4 border-l-blue-500"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        
                        {/* Main Context & Next Action Box */}
                        <div className="space-y-3 flex-1">
                          
                          {/* Badges Bar */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                              {item.applicationId}
                            </span>

                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              Stage: <span className="text-slate-900">{item.stage}</span>
                            </span>

                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              isOverdue ? "bg-red-600 text-white" :
                              isHighRisk ? "bg-amber-600 text-white" :
                              "bg-blue-600 text-white"
                            }`}>
                              {item.riskLevel}
                            </span>

                            <span className="text-xs text-slate-500">
                              Deadline: <strong className="font-mono text-slate-800">{item.deadline}</strong> ({item.daysRemaining < 0 ? `${Math.abs(item.daysRemaining)}d OVERDUE` : `${item.daysRemaining}d left`})
                            </span>
                          </div>

                          {/* Institution & Waiting Reason */}
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">
                              {item.institutionName}
                            </h3>
                            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                              <span className="font-medium text-slate-500">Why waiting:</span>
                              <span className="text-slate-800">{item.waitingReason}</span>
                            </p>
                          </div>

                          {/* Suggested Next Action Hero Highlight */}
                          <div className="p-3.5 bg-gradient-to-r from-amber-50/90 to-yellow-50/50 rounded-lg border border-amber-300 text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-amber-950">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="uppercase tracking-wider text-[11px]">Recommended Next Action:</span>
                            </div>
                            <p className="text-slate-900 font-semibold text-sm leading-snug pl-5">
                              {item.suggestedAction}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-1 pl-5">
                              <span>Responsible Role: <strong className="text-slate-900">{item.responsibleRole.replace("_", " ")}</strong></span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-600">
                                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                                Rule: <span className="font-mono text-slate-800">{item.ruleCitation}</span>
                              </span>
                            </div>
                          </div>

                          {/* Prerequisites checklist */}
                          <div className="text-xs">
                            <span className="text-slate-500 font-medium block mb-1">Outstanding Prerequisites:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.prerequisites.map((p, pIdx) => (
                                <span key={pIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>

                        {/* Right CTA column */}
                        <div className="lg:w-56 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 pt-3 lg:pt-0 lg:pl-5 space-y-3">
                          <div className="text-xs space-y-1">
                            <span className="text-slate-500 block">Responsible Official:</span>
                            <span className="font-semibold text-slate-900 block leading-tight">
                              {item.responsibleOfficer}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <Link
                              href={item.linkHref}
                              className={`w-full py-2.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                                item.isActionableByCurrentRole
                                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
                                  : "bg-slate-900 hover:bg-slate-800 text-white"
                              }`}
                            >
                              <span>{item.actionCtaLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                              href="/workflow"
                              className="w-full py-1.5 px-3 rounded-md text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-center block border border-slate-200"
                            >
                              Inspect Workflow Graph
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
    </div>
  );
}
