"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Institution } from "@/lib/types";
import { 
  BadgeCheck, 
  Search, 
  Building2, 
  ExternalLink, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function InstitutionsDirectoryPage() {
  const [institutions] = useState<Institution[]>(() => FlowGuardStore.getInstitutions());
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  const filtered = institutions.filter((inst) => {
    if (regionFilter !== "All" && inst.region !== regionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!inst.name.toLowerCase().includes(q) && !inst.permanentId.toLowerCase().includes(q)) {
        return false;
      }
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
                    Pillar 4 • Institutional Registry
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Consolidated 360° Dossiers</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Institution Compliance Passports
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Universal regulatory dossiers linking permanent IDs, statutory lease deeds, EVC history, undertakings, and risk telemetry.
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Institution Name or Permanent ID (e.g. 1-4029102)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded font-medium text-slate-700"
                >
                  <option value="All">All Regions</option>
                  <option value="Western">Western Region</option>
                  <option value="Northern">Northern Region</option>
                  <option value="Eastern">Eastern Region</option>
                  <option value="South-Western">South-Western Region</option>
                </select>
              </div>
            </div>

            {/* Institution Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((inst) => (
                <div 
                  key={inst.id}
                  className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        PID: {inst.permanentId}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        inst.status === "Compliant" ? "bg-emerald-100 text-emerald-800" :
                        inst.status === "Deficiencies Outstanding" ? "bg-amber-100 text-amber-800" :
                        inst.status === "High Risk Alert" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {inst.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {inst.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inst.region} Region • Est. {inst.establishedYear}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Category:</span>
                        <span className="font-semibold text-slate-700">{inst.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Land Area:</span>
                        <span className="font-semibold text-slate-700">{inst.landAreaAcres} Acres</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Approved Intake:</span>
                        <span className="font-semibold text-slate-700">{inst.approvedIntake} Seats</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Comp. Index:</span>
                        <span className="font-bold text-emerald-700">{inst.complianceScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      href={`/institutions/${inst.id}`}
                      className="w-full py-2 px-3 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Open Compliance Passport</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
