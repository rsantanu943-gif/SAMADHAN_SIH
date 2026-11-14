"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_APPLICATIONS } from "@/lib/flowguard-store";
import { Application, ApplicationStage } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PIPELINE_STAGES: { stage: ApplicationStage; title: string; desc: string }[] = [
  { stage: "Submission", title: "1. Submission", desc: "Digital application upload & fee receipt" },
  { stage: "Scrutiny", title: "2. Scrutiny", desc: "Documentary verification by Scrutiny Panel" },
  { stage: "Deficiencies", title: "Deficiencies", desc: "15-day cure window for institutional rectification" },
  { stage: "EVC Scheduling", title: "3. EVC Schedule", desc: "Expert Committee empanelment & date fixture" },
  { stage: "EVC Inspection", title: "4. EVC Visit", desc: "Geo-tagged physical campus inspection" },
  { stage: "SAC/SHC Review", title: "5. SAC Hearing", desc: "Standing Appellate Review Committee" },
  { stage: "Final Approval", title: "6. LoA Released", desc: "Letter of Approval dispatched & archived" },
];

export default function WorkflowMonitorPage() {
  const [apps, setApps] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [selectedRoute, setSelectedRoute] = useState<string>("All");

  useEffect(() => {
    const sync = () => setApps(FlowGuardStore.getApplications());
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  const filteredApps = apps.filter((app) => {
    if (selectedRoute !== "All" && app.workflowTemplate !== selectedRoute) return false;
    return true;
  });

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
                      Process Surveillance
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">APH 2026 Route Engine</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Workflow Route Monitor
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Visual stage pipelines, automated condition gates, deficiency loops, and real-time application progression.
                  </p>
                </div>

                {/* Route Template Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#68776A]">Processing Route:</span>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="bg-[#FAF8F1] border border-[#D5DDCB] px-3 py-2 rounded-lg font-semibold text-[#263B32] shadow-xs focus:outline-none focus:border-[#8FCDBB]"
                  >
                    <option value="All">All Route Templates</option>
                    <option value="Standard (Scrutiny + EVC + SAC)">Standard (Scrutiny + EVC + SAC)</option>
                    <option value="Only Scrutiny (Extension of Approval - EoA)">
                      Only Scrutiny (EoA Routine)
                    </option>
                    <option value="EVC + SAC/SHC">EVC + SAC/SHC Special</option>
                  </select>
                </div>
              </div>

              {/* Pipeline Stage Columns (Horizontal Kanban) */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {PIPELINE_STAGES.map((col) => {
                  const stageApps = filteredApps.filter((a) => a.currentStage === col.stage);
                  const isDeficiency = col.stage === "Deficiencies";

                  return (
                    <div
                      key={col.stage}
                      className={`w-72 shrink-0 rounded-xl border flex flex-col max-h-[680px] shadow-xs ${
                        isDeficiency
                          ? "bg-[#F5E9D3]/45 border-[#D8B989]"
                          : "bg-[#FAF8F1] border-[#D5DDCB]"
                      }`}
                    >
                      {/* Column Header */}
                      <div className="p-3.5 border-b border-[#D5DDCB] bg-[#EAE2D2]/70 rounded-t-xl">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#263B32] text-xs">{col.title}</h3>
                          <span className="text-[11px] font-mono font-bold bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#D5DDCB] text-[#263B32]">
                            {stageApps.length}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#68776A] mt-0.5 line-clamp-1">{col.desc}</p>
                      </div>

                      {/* Cards Container */}
                      <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                        {stageApps.length === 0 ? (
                          <div className="py-8 text-center text-[11px] text-[#68776A]">
                            No cases in this stage
                          </div>
                        ) : (
                          stageApps.map((app) => (
                            <div
                              key={app.id}
                              className="p-3.5 rounded-xl border border-[#D5DDCB] text-xs space-y-2 transition-all hover:border-[#8FCDBB] hover:shadow-sm bg-[#F3EBDD]/60"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-bold text-[11px] text-[#263B32]">
                                  {app.applicationNumber}
                                </span>
                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                    app.riskLevel === "Overdue"
                                      ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                      : app.riskLevel === "High Risk"
                                      ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                                      : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                                  }`}
                                >
                                  {app.riskLevel}
                                </span>
                              </div>

                              <p className="font-bold text-[#263B32] leading-snug line-clamp-2">
                                {app.institutionName}
                              </p>

                              <div className="flex items-center justify-between text-[10px] text-[#68776A] pt-1.5 border-t border-[#D5DDCB]/70">
                                <span>Due: {app.deadline}</span>
                                <Link
                                  href={`/applications/${app.id}`}
                                  className="font-bold text-[#2A6557] hover:text-[#263B32] flex items-center gap-0.5"
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
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
