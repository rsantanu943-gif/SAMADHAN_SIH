"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_APPLICATIONS } from "@/lib/flowguard-store";
import { NextBestActionItem, UserRole } from "@/lib/types";
import { Sparkles, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function NextBestActionPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("SCRUTINY_OFFICER");
  const [actions, setActions] = useState<NextBestActionItem[]>(() =>
    FlowGuardStore.getNextBestActions("SCRUTINY_OFFICER", INITIAL_APPLICATIONS)
  );
  const [roleFilter, setRoleFilter] = useState<"MY_ROLE" | "ALL">("MY_ROLE");

  useEffect(() => {
    const sync = () => {
      const role = FlowGuardStore.getCurrentRole();
      setCurrentRole(role);
      setActions(FlowGuardStore.getNextBestActions(role));
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  const displayedActions = actions.filter((act) => {
    if (roleFilter === "MY_ROLE") {
      return act.isActionableByCurrentRole;
    }
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
                      Pillar 3 • Workflow Intelligence
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">
                      Active Role: {currentRole.replace("_", " ")}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Next Best Action Assistant
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Deterministic, workflow-grounded prescriptive actions based on current stage, deficiencies, and statutory regulations.
                  </p>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-[#EAE2D2] p-1 rounded-xl border border-[#D5DDCB] text-xs shadow-xs">
                  <button
                    onClick={() => setRoleFilter("MY_ROLE")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      roleFilter === "MY_ROLE"
                        ? "bg-[#263B32] text-[#FAF8F1] font-bold shadow-xs"
                        : "text-[#68776A] hover:text-[#263B32]"
                    }`}
                  >
                    My Assigned Tasks ({actions.filter((a) => a.isActionableByCurrentRole).length})
                  </button>
                  <button
                    onClick={() => setRoleFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      roleFilter === "ALL"
                        ? "bg-[#263B32] text-[#FAF8F1] font-bold shadow-xs"
                        : "text-[#68776A] hover:text-[#263B32]"
                    }`}
                  >
                    All Active Queue ({actions.length})
                  </button>
                </div>
              </div>

              {/* Regulatory Safeguard Notice */}
              <div className="bg-[#FAF8F1] border border-[#B7C9A8] rounded-xl p-4 text-xs text-[#263B32] flex items-start gap-2.5 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#2A6557] shrink-0 mt-0.5" />
                <div>
                  <strong>Workflow Determinism Safeguard: </strong>
                  <span className="text-[#576659]">
                    Actions are generated directly from verified database stages and unfulfilled prerequisites. Recommendations provide statutory guidance but cannot independently grant approvals reserved for competent authorities.
                  </span>
                </div>
              </div>

              {/* Action Cards Grid */}
              <div className="space-y-4">
                {displayedActions.length === 0 ? (
                  <div className="surface-card p-12 text-center text-[#68776A] text-xs">
                    <CheckCircle2 className="w-8 h-8 text-[#2A6557] mx-auto mb-2" />
                    <p className="font-bold text-[#263B32] text-sm">
                      No Pending Actions for Role: {currentRole.replace("_", " ")}
                    </p>
                    <p className="text-[#68776A] mt-1">
                      All current tasks assigned to your role are up to date or switch to &quot;All Active Queue&quot;.
                    </p>
                  </div>
                ) : (
                  displayedActions.map((item, idx) => {
                    const isOverdue = item.riskLevel === "Overdue";
                    const isHighRisk = item.riskLevel === "High Risk";

                    return (
                      <div key={idx} className="surface-card-interactive p-5 relative overflow-hidden">
                        <div
                          className={`h-1 absolute top-0 inset-x-0 ${
                            isOverdue
                              ? "bg-[#8C2D25]"
                              : isHighRisk
                              ? "bg-[#D8B989]"
                              : "bg-gradient-to-r from-[#B7C9A8] to-[#8FCDBB]"
                          }`}
                        />
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pt-1">
                          {/* Main Context & Next Action Box */}
                          <div className="space-y-3 flex-1">
                            {/* Badges Bar */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-xs bg-[#EAE2D2] text-[#263B32] px-2 py-0.5 rounded border border-[#D5DDCB]">
                                {item.applicationId}
                              </span>

                              <span className="text-xs font-semibold text-[#68776A] bg-[#F3EBDD] px-2 py-0.5 rounded border border-[#D5DDCB]">
                                Stage: <span className="text-[#263B32] font-bold">{item.stage}</span>
                              </span>

                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                                  isOverdue
                                    ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                    : isHighRisk
                                    ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                                    : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                                }`}
                              >
                                {item.riskLevel}
                              </span>

                              <span className="text-xs text-[#68776A]">
                                Deadline:{" "}
                                <strong className="font-mono text-[#263B32]">{item.deadline}</strong> (
                                {item.daysRemaining < 0
                                  ? `${Math.abs(item.daysRemaining)}d OVERDUE`
                                  : `${item.daysRemaining}d left`}
                                )
                              </span>
                            </div>

                            {/* Institution & Waiting Reason */}
                            <div>
                              <h3 className="font-display text-lg font-bold text-[#263B32]">
                                {item.institutionName}
                              </h3>
                              <p className="text-xs text-[#68776A] mt-0.5 flex flex-wrap items-center gap-1.5">
                                <span className="font-semibold">Why waiting:</span>
                                <span className="text-[#263B32]">{item.waitingReason}</span>
                              </p>
                            </div>

                            {/* Suggested Next Action Hero Highlight */}
                            <div className="p-4 bg-gradient-to-r from-[#F3EBDD] via-[#EAE2D2]/50 to-[#8FCDBB]/15 rounded-xl border border-[#B7C9A8] text-xs space-y-2">
                              <div className="flex items-center gap-1.5 font-bold text-[#263B32]">
                                <Sparkles className="w-4 h-4 text-[#2A6557] shrink-0" />
                                <span className="uppercase tracking-wider text-[11px]">
                                  Recommended Next Action:
                                </span>
                              </div>
                              <p className="text-[#263B32] font-semibold text-sm leading-snug pl-5">
                                {item.suggestedAction}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#68776A] pt-1 pl-5">
                                <span>
                                  Responsible Role:{" "}
                                  <strong className="text-[#263B32]">
                                    {item.responsibleRole.replace("_", " ")}
                                  </strong>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-[#68776A]">
                                  <BookOpen className="w-3.5 h-3.5 text-[#2A6557]" />
                                  Rule: <span className="font-mono text-[#263B32]">{item.ruleCitation}</span>
                                </span>
                              </div>
                            </div>

                            {/* Prerequisites checklist */}
                            <div className="text-xs">
                              <span className="text-[#68776A] font-medium block mb-1.5">
                                Outstanding Prerequisites:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {item.prerequisites.map((p, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="bg-[#F3EBDD] text-[#263B32] px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-[#D5DDCB]"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right CTA column */}
                          <div className="lg:w-56 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#D5DDCB] pt-3 lg:pt-0 lg:pl-5 space-y-3">
                            <div className="text-xs space-y-1">
                              <span className="text-[#68776A] block">Responsible Official:</span>
                              <span className="font-semibold text-[#263B32] block leading-tight">
                                {item.responsibleOfficer}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <Link
                                href={item.linkHref}
                                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                                  item.isActionableByCurrentRole
                                    ? "bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1]"
                                    : "bg-[#8FCDBB] hover:bg-[#7DC2AE] text-[#263B32]"
                                }`}
                              >
                                <span>{item.actionCtaLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>

                              <Link
                                href="/workflow"
                                className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold text-[#263B32] bg-[#F3EBDD] hover:bg-[#EAE2D2] text-center block border border-[#D5DDCB] transition-colors"
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
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
