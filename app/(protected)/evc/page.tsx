"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { EVCEvent } from "@/lib/types";
import { 
  CalendarClock, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Plus, 
  Search,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function EVCSchedulingPage() {
  const [events, setEvents] = useState<EVCEvent[]>(() => FlowGuardStore.getEVCEvents());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [visitDate, setVisitDate] = useState("2026-11-12");
  const [membersInput, setMembersInput] = useState("Prof. K. G. Suresh (IIT Bombay), Dr. R. Raman (NIT Calicut)");
  const [leadAuditor, setLeadAuditor] = useState("Prof. K. G. Suresh");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleScheduleSubmit = () => {
    if (!selectedEventId) {
      alert("Please select an EVC case to schedule.");
      return;
    }
    const members = membersInput.split(",").map(s => s.trim());
    const updated = FlowGuardStore.scheduleEVCVisit(selectedEventId, visitDate, members, leadAuditor);
    if (updated) {
      setEvents(FlowGuardStore.getEVCEvents());
      setShowScheduleModal(false);
      setSuccessMsg(`EVC Visit scheduled for ${visitDate} with lead auditor ${leadAuditor}. Application updated.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

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
                    Inspection Logistics
                  </span>
                  <span className="text-xs text-slate-500 font-mono">APH 2026 Cl. 5.1</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Expert Visiting Committee (EVC) Scheduling
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Panel empanelment, date fixture, geo-tagged mobile verification, and physical inspection surveillance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEventId(events[0]?.id || "");
                    setShowScheduleModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Empanel Committee & Schedule Visit</span>
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* EVC Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {events.map((evc) => (
                <div key={evc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {evc.id.toUpperCase()} • {evc.region}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      evc.status === "Scheduled" ? "bg-emerald-100 text-emerald-800" :
                      evc.status === "Awaiting Schedule" ? "bg-amber-100 text-amber-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {evc.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{evc.institutionName}</h3>
                    <p className="text-xs text-slate-500 mt-1">Inspection Mode: <strong>{evc.inspectionMode}</strong></p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Visit Scheduled Date:</span>
                      <span className="font-mono font-bold text-slate-900">{evc.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Geo-Tagging Verification:</span>
                      <span className="font-bold text-emerald-700">
                        {evc.geotagVerified ? "Verified Active" : "Pending On-Site Sync"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Empaneled Committee:</span>
                      <ul className="list-disc pl-5 text-slate-700 space-y-0.5">
                        {evc.committeeMembers.map((m, mIdx) => (
                          <li key={mIdx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link
                      href={`/institutions/${evc.institutionId}`}
                      className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                    >
                      <span>View Institution Dossier</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Schedule Expert Visiting Committee
            </h3>
            <div>
              <label className="font-semibold block mb-1">Select Case:</label>
              <select 
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded text-slate-800"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.institutionName} ({e.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Visit Inspection Date:</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Lead Auditor:</label>
              <input
                type="text"
                value={leadAuditor}
                onChange={(e) => setLeadAuditor(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Empaneled Members (comma separated):</label>
              <input
                type="text"
                value={membersInput}
                onChange={(e) => setMembersInput(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded text-slate-800"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                className="px-4 py-1.5 bg-amber-500 font-bold text-slate-950 rounded shadow-xs"
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
