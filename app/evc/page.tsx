"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_EVC_EVENTS } from "@/lib/flowguard-store";
import { EVCEvent } from "@/lib/types";
import { CheckCircle2, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function EVCSchedulingPage() {
  const [events, setEvents] = useState<EVCEvent[]>(INITIAL_EVC_EVENTS);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [visitDate, setVisitDate] = useState("2026-11-12");
  const [membersInput, setMembersInput] = useState(
    "Prof. K. G. Suresh (IIT Bombay), Dr. R. Raman (NIT Calicut)"
  );
  const [leadAuditor, setLeadAuditor] = useState("Prof. K. G. Suresh");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setEvents(FlowGuardStore.getEVCEvents());
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  useEffect(() => {
    if (!showScheduleModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowScheduleModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showScheduleModal]);

  const handleScheduleSubmit = () => {
    if (!selectedEventId) {
      setModalError("Please select an EVC case to schedule.");
      return;
    }
    setModalError(null);
    const members = membersInput.split(",").map((s) => s.trim());
    const updated = FlowGuardStore.scheduleEVCVisit(selectedEventId, visitDate, members, leadAuditor);
    if (updated) {
      setEvents(FlowGuardStore.getEVCEvents());
      setShowScheduleModal(false);
      setSuccessMsg(
        `EVC Visit scheduled for ${visitDate} with lead auditor ${leadAuditor}. Application updated.`
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    }
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
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#8FCDBB]/35 text-[#263B32] px-2.5 py-0.5 rounded border border-[#8FCDBB]">
                      Inspection Logistics
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">APH 2026 Cl. 5.1</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Expert Visiting Committee (EVC) Scheduling
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Panel empanelment, date fixture, geo-tagged mobile verification, and physical inspection surveillance.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setSelectedEventId(events[0]?.id || "");
                      setModalError(null);
                      setShowScheduleModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#8FCDBB]" />
                    <span>Empanel Committee &amp; Schedule Visit</span>
                  </button>
                </div>
              </div>

              {successMsg && (
                <div className="p-3.5 bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557]" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* EVC Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {events.map((evc) => (
                  <div key={evc.id} className="surface-card-interactive p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#263B32] bg-[#EAE2D2] px-2.5 py-0.5 rounded border border-[#D5DDCB]">
                        {evc.id.toUpperCase()} • {evc.region}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                          evc.status === "Scheduled"
                            ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                            : evc.status === "Awaiting Schedule"
                            ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                            : "bg-[#B7C9A8]/45 text-[#263B32] border-[#B7C9A8]"
                        }`}
                      >
                        {evc.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-[#263B32] leading-snug">
                        {evc.institutionName}
                      </h3>
                      <p className="text-xs text-[#68776A] mt-1">
                        Inspection Mode: <strong className="text-[#263B32]">{evc.inspectionMode}</strong>
                      </p>
                    </div>

                    <div className="bg-[#F3EBDD] p-3.5 rounded-xl border border-[#D5DDCB] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#68776A]">Visit Scheduled Date:</span>
                        <span className="font-mono font-bold text-[#263B32]">{evc.scheduledDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#68776A]">Geo-Tagging Verification:</span>
                        <span className="font-bold text-[#2A6557]">
                          {evc.geotagVerified ? "Verified Active" : "Pending On-Site Sync"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#68776A] block mb-1">Empaneled Committee:</span>
                        <ul className="list-disc pl-5 text-[#263B32] space-y-0.5">
                          {evc.committeeMembers.map((m, mIdx) => (
                            <li key={mIdx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <Link
                        href={`/institutions/${evc.institutionId}`}
                        className="text-xs font-bold text-[#2A6557] hover:underline flex items-center gap-1"
                      >
                        <span>View Institution Dossier</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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

      {/* Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-[#263B32]/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-display text-base font-bold text-[#263B32] border-b border-[#D5DDCB] pb-3">
              Schedule Expert Visiting Committee
            </h3>
            {modalError && (
              <div className="bg-[#F5DDD9] border border-[#DFACA5] text-[#5E1A14] p-2.5 rounded-lg font-semibold">
                {modalError}
              </div>
            )}
            <div>
              <label className="font-semibold text-[#263B32] block mb-1">Select Case:</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32]"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.institutionName} ({e.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-[#263B32] block mb-1">Visit Inspection Date:</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#263B32] block mb-1">Lead Auditor:</label>
              <input
                type="text"
                value={leadAuditor}
                onChange={(e) => setLeadAuditor(e.target.value)}
                className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#263B32] block mb-1">
                Empaneled Members (comma separated):
              </label>
              <input
                type="text"
                value={membersInput}
                onChange={(e) => setMembersInput(e.target.value)}
                className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#D5DDCB]">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-3.5 py-2 text-[#68776A] hover:bg-[#EAE2D2] rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                className="px-4 py-2 bg-[#263B32] hover:bg-[#1D2E27] font-bold text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
