"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_NOTIFICATIONS } from "@/lib/flowguard-store";
import { NotificationRecord } from "@/lib/types";
import { CheckCircle2, Check, Send } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(INITIAL_NOTIFICATIONS);
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const sync = () => setNotifications(FlowGuardStore.getNotifications());
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  const handleAcknowledge = (id: string) => {
    FlowGuardStore.acknowledgeNotification(id);
    setNotifications(FlowGuardStore.getNotifications());
  };

  const handleResolve = (id: string) => {
    FlowGuardStore.resolveNotification(id);
    setNotifications(FlowGuardStore.getNotifications());
  };

  const handleManualEscalation = () => {
    FlowGuardStore.createNotification({
      type: "ESCALATION",
      priority: "critical",
      title: "Manual Senior Bureau Escalation Triggered",
      message:
        "Urgent directive issued by Regional Office regarding overdue EVC visit in Northern Region.",
      recipientRole: "BUREAU_OFFICER",
      recipientName: "Smt. Sunita Verma",
      applicationId: "app-002",
    });
    setNotifications(FlowGuardStore.getNotifications());
  };

  const filtered = notifications.filter((n) => {
    if (priorityFilter !== "All" && n.priority !== priorityFilter) return false;
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
                      Automated Surveillance
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Backend Scheduler Engine</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Notifications &amp; Escalation Engine
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Scheduled 30/15/7-day deadline warnings, inactive case alerts, and automated multi-tier administrative escalations.
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleManualEscalation}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#8C2D25] hover:bg-[#70221B] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simulate Bureau Escalation</span>
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#68776A]">Filter by Priority:</span>
                {["All", "critical", "high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[10px] transition-colors cursor-pointer border ${
                      priorityFilter === p
                        ? "bg-[#263B32] text-[#FAF8F1] border-[#263B32]"
                        : "bg-[#FAF8F1] text-[#263B32] border-[#D5DDCB] hover:bg-[#EAE2D2]"
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
                    className="surface-card-interactive p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                            item.priority === "critical"
                              ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                              : item.priority === "high"
                              ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                              : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                          }`}
                        >
                          {item.priority}
                        </span>
                        <span className="font-mono text-[10px] text-[#68776A]">{item.createdAt}</span>
                        <span className="text-[10px] text-[#68776A]">
                          Recipient: <strong className="text-[#263B32]">{item.recipientName}</strong> (
                          {item.recipientRole})
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-[#263B32] text-base">{item.title}</h3>
                      <p className="text-xs text-[#576659] leading-relaxed">{item.message}</p>

                      {item.escalatedTo && (
                        <p className="text-[11px] font-bold text-[#8C2D25]">
                          Escalated To: {item.escalatedTo}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!item.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(item.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-[#F3EBDD] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] rounded-lg cursor-pointer transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {!item.resolved ? (
                        <button
                          onClick={() => handleResolve(item.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5 text-[#8FCDBB]" />
                          <span>Resolve Alert</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#2A6557] flex items-center gap-1 bg-[#8FCDBB]/25 px-2.5 py-1 rounded-lg border border-[#8FCDBB]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Resolved</span>
                        </span>
                      )}
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
