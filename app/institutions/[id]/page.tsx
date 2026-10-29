"use client";

import { use, useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Institution, Application, DocumentRecord, EVCEvent, Undertaking, AuditLogEntry } from "@/lib/types";
import { 
  BadgeCheck, 
  MapPin, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Building2, 
  User, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  History,
  FileCheck2,
  CalendarClock
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function InstitutionPassportDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const instId = resolvedParams.id;

  const [institution] = useState<Institution | null>(() => FlowGuardStore.getInstitutionById(instId) || null);
  const [activeTab, setActiveTab] = useState<"APPLICATIONS" | "EVC" | "UNDERTAKINGS" | "DOCUMENTS" | "ALERTS" | "AUDIT">("APPLICATIONS");

  const [instApps] = useState<Application[]>(() => FlowGuardStore.getApplications({ institutionId: instId }));
  const [instDocs] = useState<DocumentRecord[]>(() => FlowGuardStore.getDocuments({ institutionId: instId }));
  const [instEVC] = useState<EVCEvent[]>(() => FlowGuardStore.getEVCEvents().filter(e => e.institutionId === instId));
  const [instUndertakings] = useState<Undertaking[]>(() => FlowGuardStore.getUndertakings().filter(u => u.institutionId === instId));
  const [instLogs] = useState<AuditLogEntry[]>(() => FlowGuardStore.getAuditLogs());

  if (!institution) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center text-xs text-slate-500">
        Loading Institution Compliance Passport...
      </div>
    );
  }

  // Summary Metrics calculations
  const verifiedDocsCount = instDocs.filter(d => d.verificationStatus === "VERIFIED").length;
  const pendingDocsCount = instDocs.filter(d => d.verificationStatus !== "VERIFIED").length;
  const overdueCount = instApps.filter(a => a.riskLevel === "Overdue").length + instUndertakings.filter(u => u.status === "Overdue").length;
  const highRiskCount = instApps.filter(a => a.riskLevel === "High Risk").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/institutions" className="hover:text-slate-900">Institutions Directory</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-900">{institution.name}</span>
            </div>

            {/* Institution Passport Hero Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-amber-500/30">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Permanent ID: {institution.permanentId}
                    </span>
                    <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700">
                      {institution.region} Region
                    </span>
                    <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-700">
                      Est. {institution.establishedYear}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      institution.status === "Compliant" ? "bg-emerald-500 text-slate-950" :
                      institution.status === "Deficiencies Outstanding" ? "bg-amber-500 text-slate-950" :
                      "bg-red-500 text-white"
                    }`}>
                      {institution.status}
                    </span>
                  </div>

                  <h1 className="text-xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {institution.name}
                  </h1>

                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{institution.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-1">
                    <span>Authorized Admin: <strong className="text-white">{institution.authorizedAdminName}</strong></span>
                    <span>Email: <strong className="text-amber-300">{institution.authorizedAdminEmail}</strong></span>
                    <span>Land Area: <strong className="text-white">{institution.landAreaAcres} Acres</strong></span>
                  </div>
                </div>

                {/* Score & Health Badge */}
                <div className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-xl shrink-0 text-center space-y-1 min-w-[200px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Verified Compliance Score
                  </span>
                  <div className="text-3xl font-black text-amber-400">
                    {institution.complianceScore}%
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Based on verified lease, fire NOC, EVC review & timely submissions
                  </p>
                </div>

              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Applications</span>
                <span className="text-lg font-black text-slate-900">{instApps.length} Total</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Docs Verified</span>
                <span className="text-lg font-black text-emerald-600">{verifiedDocsCount} Passed</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Docs In Review</span>
                <span className="text-lg font-black text-amber-600">{pendingDocsCount} Pending</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">EVC Inspections</span>
                <span className="text-lg font-black text-slate-900">{instEVC.length} Events</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">High Risk</span>
                <span className="text-lg font-black text-amber-600">{highRiskCount} Alerts</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Overdue Items</span>
                <span className={`text-lg font-black ${overdueCount > 0 ? "text-red-600" : "text-slate-400"}`}>
                  {overdueCount} Critical
                </span>
              </div>
            </div>

            {/* Passport Navigation Tabs */}
            <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs">
              {[
                { id: "APPLICATIONS", label: "Applications History", count: instApps.length, icon: FileText },
                { id: "DOCUMENTS", label: "Document Vault", count: instDocs.length, icon: FileCheck2 },
                { id: "EVC", label: "EVC Inspections", count: instEVC.length, icon: CalendarClock },
                { id: "UNDERTAKINGS", label: "Undertakings & Norms", count: instUndertakings.length, icon: ShieldCheck },
                { id: "ALERTS", label: "Deadline Risk Alerts", count: instApps.filter(a => a.riskLevel !== "Normal").length, icon: AlertTriangle },
                { id: "AUDIT", label: "Activity Trail", count: instLogs.length, icon: History },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive 
                        ? "border-amber-500 text-amber-900 bg-amber-50/50" 
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-amber-200 text-amber-900" : "bg-slate-100 text-slate-600"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Applications */}
            {activeTab === "APPLICATIONS" && (
              <div className="space-y-4">
                {instApps.length === 0 ? (
                  <div className="p-8 bg-white border rounded text-center text-xs text-slate-500">
                    No active applications found for this institution.
                  </div>
                ) : (
                  instApps.map((app) => (
                    <div key={app.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {app.applicationNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-700">Stage: {app.currentStage}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            {app.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          Academic Year: <strong>{app.academicYear}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{app.category}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Processing Route:</span>
                          <span className="font-semibold text-slate-800">{app.workflowTemplate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Assigned Officer:</span>
                          <span className="font-semibold text-slate-800">{app.assignedOfficerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Statutory Deadline:</span>
                          <span className="font-mono font-bold text-slate-800">{app.deadline}</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Link
                          href={`/applications/${app.id}`}
                          className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                        >
                          <span>Open Application Workflow & Act</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Document Vault */}
            {activeTab === "DOCUMENTS" && (
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prescribed Statutory Document Records ({instDocs.length})
                  </h3>
                  <Link 
                    href="/documents"
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    <span>Launch Smart Document Checker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {instDocs.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{doc.title}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                            {doc.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {doc.fileName} ({doc.fileSize}) • Uploaded {doc.uploadDate}
                        </p>
                        {doc.expiryDate && (
                          <p className="text-[11px] text-slate-600">
                            Valid Until: <strong className="font-mono">{doc.expiryDate}</strong>
                            {doc.isExpiringSoon && <span className="text-amber-700 font-bold ml-2">⚠️ Expiring Soon ({doc.daysToExpiry}d)</span>}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          doc.verificationStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-800" :
                          doc.verificationStatus === "RETURNED" ? "bg-amber-100 text-amber-800" :
                          doc.verificationStatus === "REJECTED" ? "bg-red-100 text-red-800" :
                          "bg-slate-200 text-slate-700"
                        }`}>
                          {doc.verificationStatus}
                        </span>
                        <Link 
                          href="/documents"
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded"
                        >
                          Verify in Checker
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: EVC Inspections */}
            {activeTab === "EVC" && (
              <div className="space-y-4">
                {instEVC.length === 0 ? (
                  <div className="p-8 bg-white border rounded text-center text-xs text-slate-500">
                    No EVC inspections recorded for this institution.
                  </div>
                ) : (
                  instEVC.map((evc) => (
                    <div key={evc.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          Inspection Mode: {evc.inspectionMode}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {evc.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Scheduled Visit Date: <strong className="font-mono text-slate-900">{evc.scheduledDate}</strong> • Geo-Tagging Verified: <strong>{evc.geotagVerified ? "Yes (Cryptographically Sealed)" : "Pending"}</strong>
                      </p>
                      <div className="bg-slate-50 p-3 rounded text-xs">
                        <span className="font-bold text-slate-700 block mb-1">Empaneled Committee Members:</span>
                        <ul className="list-disc pl-5 text-slate-600 space-y-0.5">
                          {evc.committeeMembers.map((m, mIdx) => (
                            <li key={mIdx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 4: Undertakings */}
            {activeTab === "UNDERTAKINGS" && (
              <div className="space-y-4">
                {instUndertakings.map((u) => (
                  <div key={u.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{u.title}</h4>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        u.status === "Complied" ? "bg-emerald-100 text-emerald-800" :
                        u.status === "Overdue" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {u.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Mandatory Clause: <span className="font-mono text-slate-800">{u.clause}</span>
                    </p>
                    <div className="text-xs flex items-center gap-4 text-slate-500 pt-1">
                      <span>Deadline: <strong className="font-mono text-slate-800">{u.deadline}</strong></span>
                      <span>Penalty: <span className="text-red-600 font-medium">{u.penaltyClause}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Deadline Risk Alerts */}
            {activeTab === "ALERTS" && (
              <div className="space-y-4">
                {instApps.map((a) => (
                  <div key={a.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">{a.applicationNumber}</span>
                      <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {a.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">{a.riskReason}</p>
                    <p className="text-xs text-slate-500">
                      Recommended: <span>{a.recommendedAction}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Audit Trail */}
            {activeTab === "AUDIT" && (
              <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                {instLogs.map((log) => (
                  <div key={log.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3">
                      <span>Actor: {log.actorName} ({log.actorRole})</span>
                      <span>•</span>
                      <span className="font-mono">Hash: {log.verifiedHash}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
