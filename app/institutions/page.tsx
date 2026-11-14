"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_INSTITUTIONS } from "@/lib/flowguard-store";
import { Institution } from "@/lib/types";
import { Search, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InstitutionsDirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  useEffect(() => {
    const sync = () => setInstitutions(FlowGuardStore.getInstitutions());
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

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
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#8FCDBB]/35 text-[#263B32] px-2.5 py-0.5 rounded border border-[#8FCDBB]">
                      Pillar 4 • Institutional Registry
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Consolidated 360° Dossiers</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Institution Compliance Passports
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Universal regulatory dossiers linking permanent IDs, statutory lease deeds, EVC history, undertakings, and risk telemetry.
                  </p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-[#68776A]" />
                  <input
                    type="text"
                    placeholder="Search by Institution Name or Permanent ID (e.g. 1-4029102)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg font-medium text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
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
                  <div key={inst.id} className="surface-card-interactive p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold bg-[#EAE2D2] text-[#263B32] px-2.5 py-0.5 rounded border border-[#D5DDCB]">
                          PID: {inst.permanentId}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            inst.status === "Compliant"
                              ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                              : inst.status === "Deficiencies Outstanding"
                              ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                              : inst.status === "High Risk Alert"
                              ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                              : "bg-[#B7C9A8]/45 text-[#263B32] border-[#B7C9A8]"
                          }`}
                        >
                          {inst.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-[#263B32] text-base leading-snug">
                          {inst.name}
                        </h3>
                        <p className="text-xs text-[#68776A] mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#2A6557] shrink-0" />
                          <span className="truncate">
                            {inst.region} Region • Est. {inst.establishedYear}
                          </span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#D5DDCB] text-[11px]">
                        <div>
                          <span className="text-[#68776A] block">Category:</span>
                          <span className="font-semibold text-[#263B32]">{inst.category}</span>
                        </div>
                        <div>
                          <span className="text-[#68776A] block">Land Area:</span>
                          <span className="font-semibold text-[#263B32]">{inst.landAreaAcres} Acres</span>
                        </div>
                        <div>
                          <span className="text-[#68776A] block">Approved Intake:</span>
                          <span className="font-semibold text-[#263B32]">{inst.approvedIntake} Seats</span>
                        </div>
                        <div>
                          <span className="text-[#68776A] block">Comp. Index:</span>
                          <span className="font-bold text-[#2A6557]">{inst.complianceScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#D5DDCB]">
                      <Link
                        href={`/institutions/${inst.id}`}
                        className="w-full py-2.5 px-3 text-xs font-bold rounded-lg bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Open Compliance Passport</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8FCDBB]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
