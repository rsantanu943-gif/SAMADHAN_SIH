"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { NotificationRecord } from "@/lib/types";
import { 
  BellRing, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  Building2, 
  Check, 
  Send,
  RotateCcw
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => FlowGuardStore.getNotifications());
  const [priorityFilter, setPriorityFilter] = useState("All");

  const handleAcknowledge = (id: string) => {
    FlowGuardStore.acknowledgeNotification(id);
    setNotifications(FlowGuardStore.getNotifications());
  };

  const handleResolve = (id: string) => {
    FlowGuardStore.resolveNotification(id);
    setNotifications(FlowGuardStore.getNotifications());
  };

  const handleManualEscalation = () => {
    const notif = FlowGuardStore.createNotification({
      type: "ESCALATION",
      priority: "critical",
      title: "Manual Senior Bureau Escalation Triggered",
      message: "Urgent directive issued by Regional Office regarding overdue EVC visit in Northern Region.",
      recipientRole: "BUREAU_OFFICER",
      recipientName: "Smt. Sunita Verma",
      applicationId: "app-002"
    });
    setNotifications(FlowGuardStore.getNotifications());
  };

  const filtered = notifications.filter(n => {
    if (priorityFilter !== "All" && n.priority !== priorityFilter) return false;
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
                    Automated Surveillance
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Backend Scheduler Engine</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Notifications & Escalation Engine
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Scheduled 30/15/7-day deadline warnings, inactive case alerts, and automated multi-tier administrative escalations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualEscalation}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-md shadow-xs cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simulate Bureau Escalation</span>
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Filter by Priority:</span>
              {["All", "critical", "high", "medium", "low"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] transition-colors ${
                    priorityFilter === p
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Notifications Feed */}
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.priority === "critical" ? "border-l-4 border-l-red-600" :
                    item.priority === "high" ? "border-l-4 border-l-amber-500" :
                    "border-l-4 border-l-blue-500"
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded ${
                        item.priority === "critical" ? "bg-red-100 text-red-800" :
                        item.priority === "high" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {item.priority}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {item.createdAt}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Recipient: <strong>{item.recipientName}</strong> ({item.recipientRole})
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                    
                    {item.escalatedTo && (
                      <p className="text-[11px] font-bold text-red-700">
                        Escalated To: {item.escalatedTo}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!item.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}

                    {!item.resolved ? (
                      <button
                        onClick={() => handleResolve(item.id)}
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve Alert</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resolved</span>
                      </span>
                    )}
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
