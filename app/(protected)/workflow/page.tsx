"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Application, ApplicationStage } from "@/lib/types";
import { 
  Workflow, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Building2,
  GitBranch,
  Layers
} from "lucide-react";
import Link from "next/link";

const PIPELINE_STAGES: { stage: ApplicationStage; title: string; desc: string }[] = [
  { stage: "Submission", title: "1. Submission", desc: "Digital application upload & fee receipt" },
  { stage: "Scrutiny", title: "2. Scrutiny", desc: "Documentary verification by Scrutiny Panel" },
  { stage: "Deficiencies", title: "Deficiencies", desc: "15-day cure window for institutional rectification" },
  { stage: "EVC Scheduling", title: "3. EVC Schedule", desc: "Expert Committee empanelment & date fixture" },
  { stage: "EVC Inspection", title: "4. EVC Visit", desc: "Geo-tagged physical campus inspection" },
  { stage: "SAC/SHC Review", title: "5. SAC Hearing", desc: "Standing Appellate Review Committee" },
  { stage: "Final Approval", title: "6. LoA Released", desc: "Letter of Approval dispatched & archived" }
];

export default function WorkflowMonitorPage() {
  const [apps] = useState<Application[]>(() => FlowGuardStore.getApplications());
  const [selectedRoute, setSelectedRoute] = useState<string>("All");

  const filteredApps = apps.filter(app => {
    if (selectedRoute !== "All" && app.workflowTemplate !== selectedRoute) return false;
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
                    Process Surveillance
                  </span>
                  <span className="text-xs text-slate-500 font-mono">APH 2026 Route Engine</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Workflow Route Monitor
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Visual stage pipelines, automated condition gates, deficiency loops, and real-time application progression.
                </p>
              </div>

              {/* Route Template Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Processing Route:</span>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="bg-white border border-slate-300 px-3 py-1.5 rounded-md font-semibold text-slate-800 shadow-xs"
                >
                  <option value="All">All Route Templates</option>
                  <option value="Standard (Scrutiny + EVC + SAC)">Standard (Scrutiny + EVC + SAC)</option>
                  <option value="Only Scrutiny (Extension of Approval - EoA)">Only Scrutiny (EoA Routine)</option>
                  <option value="EVC + SAC/SHC">EVC + SAC/SHC Special</option>
                </select>
              </div>
            </div>

            {/* Pipeline Stage Columns (Horizontal Kanban) */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {PIPELINE_STAGES.map((col) => {
                const stageApps = filteredApps.filter(a => a.currentStage === col.stage);
                const isDeficiency = col.stage === "Deficiencies";

                return (
                  <div
                    key={col.stage}
                    className={`w-72 shrink-0 rounded-xl border flex flex-col max-h-[680px] shadow-xs ${
                      isDeficiency 
                        ? "bg-amber-50/50 border-amber-300" 
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {/* Column Header */}
                    <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-xs">
                          {col.title}
                        </h3>
                        <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {stageApps.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{col.desc}</p>
                    </div>

                    {/* Cards Container */}
                    <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                      {stageApps.length === 0 ? (
                        <div className="py-8 text-center text-[11px] text-slate-400">
                          No cases in this stage
                        </div>
                      ) : (
                        stageApps.map((app) => (
                          <div
                            key={app.id}
                            className={`p-3 rounded-lg border text-xs space-y-2 transition-all hover:shadow-md bg-white ${
                              app.riskLevel === "Overdue" ? "border-l-4 border-l-red-500 border-red-200" :
                              app.riskLevel === "High Risk" ? "border-l-4 border-l-amber-500 border-amber-200" :
                              "border-l-4 border-l-blue-500 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-[11px] text-slate-900">
                                {app.applicationNumber}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                app.riskLevel === "Overdue" ? "bg-red-100 text-red-800" :
                                app.riskLevel === "High Risk" ? "bg-amber-100 text-amber-800" :
                                "bg-slate-100 text-slate-700"
                              }`}>
                                {app.riskLevel}
                              </span>
                            </div>

                            <p className="font-bold text-slate-800 leading-snug line-clamp-2">
                              {app.institutionName}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                              <span>Due: {app.deadline}</span>
                              <Link
                                href={`/applications/${app.id}`}
                                className="font-bold text-amber-700 hover:text-amber-900 flex items-center gap-0.5"
                              >
                                <span>Act</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
