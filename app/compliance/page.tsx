"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Undertaking } from "@/lib/types";
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Building2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function UndertakingsPage() {
  const [undertakings] = useState<Undertaking[]>(() => FlowGuardStore.getUndertakings());
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = undertakings.filter(u => {
    if (statusFilter !== "All" && u.status !== statusFilter) return false;
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
                    Statutory Norms
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Affidavits & Undertakings</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Time-Bound Undertakings & Compliance
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Surveillance of post-approval conditional undertakings, affidavit guarantees, and statutory penalty enforcement.
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded text-slate-800 shadow-xs"
                >
                  <option value="All">All Undertakings</option>
                  <option value="Complied">Complied</option>
                  <option value="Pending Submission">Pending Submission</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Undertakings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filtered.map((item) => {
                const isOverdue = item.status === "Overdue";
                const isComplied = item.status === "Complied";

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between ${
                      isOverdue ? "border-l-4 border-l-red-500 border-red-200" :
                      isComplied ? "border-l-4 border-l-emerald-500 border-slate-200" :
                      "border-l-4 border-l-amber-500 border-slate-200"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.id.toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          isComplied ? "bg-emerald-100 text-emerald-800" :
                          isOverdue ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-500 truncate">{item.institutionName}</p>

                      <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1">
                        <span className="text-slate-500 block text-[10px]">Statutory Clause:</span>
                        <span className="font-mono text-slate-800 font-semibold">{item.clause}</span>
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Compliance Deadline:</span>
                          <span className="font-mono font-bold text-slate-800">{item.deadline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Status Timer:</span>
                          <span className={`font-mono font-bold ${item.daysRemaining < 0 ? "text-red-600" : "text-amber-700"}`}>
                            {item.daysRemaining < 0 ? `${Math.abs(item.daysRemaining)}d OVERDUE` : `${item.daysRemaining}d Left`}
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-red-50/60 border border-red-200/60 rounded text-[11px] text-red-900">
                        <span className="font-bold">Penalty Clause: </span>
                        <span>{item.penaltyClause}</span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <Link
                        href={`/institutions/${item.institutionId}`}
                        className="text-xs font-bold text-amber-700 hover:underline flex items-center justify-between"
                      >
                        <span>View Compliance Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
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
