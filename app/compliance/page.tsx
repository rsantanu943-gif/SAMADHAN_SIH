"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_UNDERTAKINGS } from "@/lib/flowguard-store";
import { Undertaking } from "@/lib/types";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function UndertakingsPage() {
  const [undertakings, setUndertakings] = useState<Undertaking[]>(INITIAL_UNDERTAKINGS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setUndertakings(FlowGuardStore.getUndertakings());
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  const handleMarkComplied = (item: Undertaking) => {
    const actor = FlowGuardStore.getCurrentUser().name;
    const updated = FlowGuardStore.updateUndertakingStatus(item.id, "Complied", actor);
    if (updated) {
      setUndertakings(FlowGuardStore.getUndertakings());
      setActionToast(`Undertaking "${item.title}" verified as Complied by ${actor}.`);
      setTimeout(() => setActionToast(null), 4500);
    }
  };

  const filtered = undertakings.filter((u) => {
    if (statusFilter !== "All" && u.status !== statusFilter) return false;
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
                      Statutory Norms
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Affidavits &amp; Undertakings</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Time-Bound Undertakings &amp; Compliance
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Surveillance of post-approval conditional undertakings, affidavit guarantees, and statutory penalty enforcement.
                  </p>
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#68776A] font-semibold">Filter:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#FAF8F1] border border-[#D5DDCB] px-3 py-2 rounded-lg text-[#263B32] shadow-xs focus:outline-none focus:border-[#8FCDBB]"
                  >
                    <option value="All">All Undertakings</option>
                    <option value="Complied">Complied</option>
                    <option value="Pending Submission">Pending Submission</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {actionToast && (
                <div className="bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557] shrink-0" />
                  <span>{actionToast}</span>
                </div>
              )}

              {/* Undertakings Grid */}
              {filtered.length === 0 ? (
                <div className="surface-card p-8 text-center text-xs text-[#68776A] space-y-3">
                  <p>No undertakings match the selected status filter.</p>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("All")}
                    className="px-3.5 py-1.5 text-xs font-bold bg-[#F3EBDD] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] rounded-lg cursor-pointer"
                  >
                    Show All Undertakings
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {filtered.map((item) => {
                    const isOverdue = item.status === "Overdue";
                    const isComplied = item.status === "Complied";

                    return (
                      <div key={item.id} className="surface-card-interactive p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#263B32] bg-[#EAE2D2] px-2 py-0.5 rounded border border-[#D5DDCB]">
                              {item.id.toUpperCase()}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                isComplied
                                  ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                                  : isOverdue
                                  ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                  : "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <h3 className="font-display text-base font-bold text-[#263B32] leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#68776A] truncate">{item.institutionName}</p>

                          <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB] text-xs space-y-1">
                            <span className="text-[#68776A] block text-[10px]">Statutory Clause:</span>
                            <span className="font-mono text-[#263B32] font-semibold">{item.clause}</span>
                          </div>

                          <div className="text-xs space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-[#68776A]">Compliance Deadline:</span>
                              <span className="font-mono font-bold text-[#263B32]">{item.deadline}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#68776A]">Status Timer:</span>
                              <span
                                className={`font-mono font-bold ${
                                  isComplied
                                    ? "text-[#2A6557]"
                                    : item.daysRemaining < 0
                                    ? "text-[#8C2D25]"
                                    : "text-[#7A4E16]"
                                }`}
                              >
                                {isComplied
                                  ? `Verified${item.resolvedAt ? ` (${item.resolvedAt})` : ""}`
                                  : item.daysRemaining < 0
                                  ? `${Math.abs(item.daysRemaining)}d OVERDUE`
                                  : `${item.daysRemaining}d Left`}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-[#F5DDD9]/60 border border-[#DFACA5] rounded-lg text-[11px] text-[#5E1A14]">
                            <span className="font-bold">Penalty Clause: </span>
                            <span>{item.penaltyClause}</span>
                          </div>
                        </div>

                        <div className="pt-3 mt-4 border-t border-[#D5DDCB] space-y-2.5">
                          {!isComplied && (
                            <button
                              type="button"
                              onClick={() => handleMarkComplied(item)}
                              className="w-full py-2 px-3 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#8FCDBB]" />
                              <span>Mark Complied &amp; Verify</span>
                            </button>
                          )}
                          <Link
                            href={`/institutions/${item.institutionId}`}
                            className="text-xs font-bold text-[#2A6557] hover:underline flex items-center justify-between"
                          >
                            <span>View Compliance Dossier</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
