"use client";

import { use, useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import {
  FlowGuardStore,
  INITIAL_INSTITUTIONS,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_EVC_EVENTS,
  INITIAL_UNDERTAKINGS,
  INITIAL_AUDIT_LOGS,
} from "@/lib/flowguard-store";
import { Institution, Application, DocumentRecord, EVCEvent, Undertaking, AuditLogEntry } from "@/lib/types";
import {
  MapPin,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  History,
  FileCheck2,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function InstitutionPassportDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const instId = resolvedParams.id;

  const [institution, setInstitution] = useState<Institution | null>(
    () => INITIAL_INSTITUTIONS.find((i) => i.id === instId || i.permanentId === instId) || null
  );
  const [activeTab, setActiveTab] = useState<
    "APPLICATIONS" | "EVC" | "UNDERTAKINGS" | "DOCUMENTS" | "ALERTS" | "AUDIT"
  >("APPLICATIONS");

  const [instApps, setInstApps] = useState<Application[]>(() =>
    INITIAL_APPLICATIONS.filter((a) => a.institutionId === instId)
  );
  const [instDocs, setInstDocs] = useState<DocumentRecord[]>(() =>
    INITIAL_DOCUMENTS.filter((d) => d.institutionId === instId)
  );
  const [instEVC, setInstEVC] = useState<EVCEvent[]>(() =>
    INITIAL_EVC_EVENTS.filter((e) => e.institutionId === instId)
  );
  const [instUndertakings, setInstUndertakings] = useState<Undertaking[]>(() =>
    INITIAL_UNDERTAKINGS.filter((u) => u.institutionId === instId)
  );
  const [instLogs, setInstLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [checkedStore, setCheckedStore] = useState(false);

  useEffect(() => {
    const sync = () => {
      const found = FlowGuardStore.getInstitutionById(instId) || null;
      setInstitution(found);
      const effectiveId = found?.id || instId;
      setInstApps(FlowGuardStore.getApplications({ institutionId: effectiveId }));
      setInstDocs(FlowGuardStore.getDocuments({ institutionId: effectiveId }));
      setInstEVC(FlowGuardStore.getEVCEvents().filter((e) => e.institutionId === effectiveId));
      setInstUndertakings(
        FlowGuardStore.getUndertakings().filter((u) => u.institutionId === effectiveId)
      );
      setInstLogs(FlowGuardStore.getAuditLogs());
      setCheckedStore(true);
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, [instId]);

  if (!institution) {
    return (
      <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DemoGuideBar />
          <Header />
          <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="surface-card p-8 max-w-md w-full text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-[#8C2D25] mx-auto" />
                <h1 className="font-display text-2xl font-bold text-[#263B32]">
                  {checkedStore ? "Institution Passport Not Found" : "Loading Compliance Passport..."}
                </h1>
                <p className="text-xs text-[#68776A] leading-relaxed">
                  {checkedStore
                    ? `No institutional compliance passport matches identifier "${instId}".`
                    : "Retrieving 360° compliance dossier..."}
                </p>
                <Link
                  href="/institutions"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg"
                >
                  Back to Institutions Directory
                </Link>
              </div>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    );
  }

  const verifiedDocsCount = instDocs.filter((d) => d.verificationStatus === "VERIFIED").length;
  const pendingDocsCount = instDocs.filter((d) => d.verificationStatus !== "VERIFIED").length;
  const overdueCount =
    instApps.filter((a) => a.riskLevel === "Overdue").length +
    instUndertakings.filter((u) => u.status === "Overdue").length;
  const highRiskCount = instApps.filter((a) => a.riskLevel === "High Risk").length;

  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-[#68776A]">
                <Link href="/institutions" className="hover:text-[#263B32] font-medium">
                  Institutions Directory
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-semibold text-[#263B32]">{institution.name}</span>
              </div>

              {/* Institution Passport Hero Banner */}
              <div className="bg-[#263B32] text-[#F3EBDD] rounded-2xl p-6 shadow-md border border-[#8FCDBB]/35">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#8FCDBB] text-[#263B32] text-xs font-bold px-2.5 py-0.5 rounded uppercase font-mono tracking-wider">
                        Permanent ID: {institution.permanentId}
                      </span>
                      <span className="bg-[#FAF8F1]/10 text-[#EAE2D2] text-xs font-semibold px-2.5 py-0.5 rounded border border-[#FAF8F1]/20">
                        {institution.region} Region
                      </span>
                      <span className="bg-[#FAF8F1]/10 text-[#EAE2D2] text-xs font-semibold px-2.5 py-0.5 rounded border border-[#FAF8F1]/20">
                        Est. {institution.establishedYear}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                          institution.status === "Compliant"
                            ? "bg-[#B7C9A8] text-[#263B32]"
                            : institution.status === "Deficiencies Outstanding"
                            ? "bg-[#F5E9D3] text-[#7A4E16]"
                            : "bg-[#F5DDD9] text-[#5E1A14]"
                        }`}
                      >
                        {institution.status}
                      </span>
                    </div>

                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#FAF8F1] tracking-tight">
                      {institution.name}
                    </h1>

                    <p className="text-xs text-[#EAE2D2]/85 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8FCDBB] shrink-0" />
                      <span>{institution.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-[#EAE2D2]/85 pt-1">
                      <span>
                        Authorized Admin:{" "}
                        <strong className="text-[#FAF8F1]">{institution.authorizedAdminName}</strong>
                      </span>
                      <span>
                        Email: <strong className="text-[#8FCDBB]">{institution.authorizedAdminEmail}</strong>
                      </span>
                      <span>
                        Land Area: <strong className="text-[#FAF8F1]">{institution.landAreaAcres} Acres</strong>
                      </span>
                    </div>
                  </div>

                  {/* Score & Health Badge */}
                  <div className="bg-[#FAF8F1]/10 border border-[#8FCDBB]/35 p-4 rounded-xl shrink-0 text-center space-y-1 min-w-[200px]">
                    <span className="text-[10px] uppercase font-bold text-[#EAE2D2]/80 tracking-wider block">
                      Verified Compliance Score
                    </span>
                    <div className="text-3xl font-bold text-[#8FCDBB] tabular-nums">
                      {institution.complianceScore}%
                    </div>
                    <p className="text-[10px] text-[#EAE2D2]/75">
                      Based on verified lease, fire NOC, EVC review &amp; timely submissions
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="surface-card p-3.5">
                  <span className="text-[#68776A] block text-[10px] uppercase font-bold">Applications</span>
                  <span className="text-lg font-bold text-[#263B32] tabular-nums">{instApps.length} Total</span>
                </div>
                <div className="surface-card p-3.5">
                  <span className="text-[#68776A] block text-[10px] uppercase font-bold">Docs Verified</span>
                  <span className="text-lg font-bold text-[#2A6557] tabular-nums">
                    {verifiedDocsCount} Passed
                  </span>
                </div>
                <div className="surface-card p-3.5">
                  <span className="text-[#68776A] block text-[10px] uppercase font-bold">Docs In Review</span>
                  <span className="text-lg font-bold text-[#7A4E16] tabular-nums">
                    {pendingDocsCount} Pending
                  </span>
                </div>
                <div className="surface-card p-3.5">
                  <span className="text-[#68776A] block text-[10px] uppercase font-bold">EVC Inspections</span>
                  <span className="text-lg font-bold text-[#263B32] tabular-nums">{instEVC.length} Events</span>
                </div>
                <div className="surface-card p-3.5">
                  <span className="text-[#68776A] block text-[10px] uppercase font-bold">High Risk</span>
                  <span className="text-lg font-bold text-[#7A4E16] tabular-nums">{highRiskCount} Alerts</span>
                </div>
                <div className="surface-card p-3.5">
                  <span className="text-[#68776A] block text-[10px] uppercase font-bold">Overdue Items</span>
                  <span
                    className={`text-lg font-bold tabular-nums ${
                      overdueCount > 0 ? "text-[#8C2D25]" : "text-[#68776A]"
                    }`}
                  >
                    {overdueCount} Critical
                  </span>
                </div>
              </div>

              {/* Passport Navigation Tabs */}
              <div className="border-b border-[#D5DDCB] flex items-center gap-1 overflow-x-auto text-xs">
                {[
                  { id: "APPLICATIONS", label: "Applications History", count: instApps.length, icon: FileText },
                  { id: "DOCUMENTS", label: "Document Vault", count: instDocs.length, icon: FileCheck2 },
                  { id: "EVC", label: "EVC Inspections", count: instEVC.length, icon: CalendarClock },
                  {
                    id: "UNDERTAKINGS",
                    label: "Undertakings & Norms",
                    count: instUndertakings.length,
                    icon: ShieldCheck,
                  },
                  {
                    id: "ALERTS",
                    label: "Deadline Risk Alerts",
                    count: instApps.filter((a) => a.riskLevel !== "Normal").length,
                    icon: AlertTriangle,
                  },
                  { id: "AUDIT", label: "Activity Trail", count: instLogs.length, icon: History },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? "border-[#263B32] text-[#263B32] bg-[#8FCDBB]/20"
                          : "border-transparent text-[#68776A] hover:text-[#263B32] hover:border-[#B7C9A8]"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isActive
                            ? "bg-[#263B32] text-[#8FCDBB]"
                            : "bg-[#EAE2D2] text-[#68776A]"
                        }`}
                      >
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
                    <div className="surface-card p-8 text-center text-xs text-[#68776A]">
                      No active applications found for this institution.
                    </div>
                  ) : (
                    instApps.map((app) => (
                      <div key={app.id} className="surface-card p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs bg-[#EAE2D2] text-[#263B32] px-2 py-0.5 rounded border border-[#D5DDCB]">
                              {app.applicationNumber}
                            </span>
                            <span className="text-xs font-bold text-[#263B32]">Stage: {app.currentStage}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#8FCDBB]/35 text-[#263B32] border border-[#8FCDBB]">
                              {app.status}
                            </span>
                          </div>
                          <span className="text-xs text-[#68776A]">
                            Academic Year: <strong className="text-[#263B32]">{app.academicYear}</strong>
                          </span>
                        </div>

                        <h4 className="font-display text-base font-bold text-[#263B32]">{app.category}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                          <div>
                            <span className="text-[#68776A] block text-[10px]">Processing Route:</span>
                            <span className="font-semibold text-[#263B32]">{app.workflowTemplate}</span>
                          </div>
                          <div>
                            <span className="text-[#68776A] block text-[10px]">Assigned Officer:</span>
                            <span className="font-semibold text-[#263B32]">{app.assignedOfficerName}</span>
                          </div>
                          <div>
                            <span className="text-[#68776A] block text-[10px]">Statutory Deadline:</span>
                            <span className="font-mono font-bold text-[#263B32]">{app.deadline}</span>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Link
                            href={`/applications/${app.id}`}
                            className="text-xs font-bold text-[#2A6557] hover:text-[#263B32] flex items-center gap-1"
                          >
                            <span>Open Application Workflow &amp; Act</span>
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
                <div className="surface-card overflow-hidden">
                  <div className="p-4 border-b border-[#D5DDCB] bg-[#EAE2D2]/50 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#263B32]">
                      Prescribed Statutory Document Records ({instDocs.length})
                    </h3>
                    <Link
                      href="/documents"
                      className="text-xs font-bold text-[#2A6557] hover:underline flex items-center gap-1"
                    >
                      <span>Launch Smart Document Checker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="divide-y divide-[#D5DDCB]/60 text-xs">
                    {instDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 hover:bg-[#F3EBDD]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#263B32]">{doc.title}</span>
                            <span className="text-[10px] bg-[#EAE2D2] text-[#68776A] px-2 py-0.5 rounded font-mono border border-[#D5DDCB]">
                              {doc.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#68776A]">
                            {doc.fileName} ({doc.fileSize}) • Uploaded {doc.uploadDate}
                          </p>
                          {doc.expiryDate && (
                            <p className="text-[11px] text-[#68776A]">
                              Valid Until: <strong className="font-mono text-[#263B32]">{doc.expiryDate}</strong>
                              {doc.isExpiringSoon && (
                                <span className="text-[#7A4E16] font-bold ml-2">
                                  Expiring Soon ({doc.daysToExpiry}d)
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                              doc.verificationStatus === "VERIFIED"
                                ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                                : doc.verificationStatus === "RETURNED"
                                ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                                : doc.verificationStatus === "REJECTED"
                                ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                : "bg-[#EAE2D2] text-[#263B32] border-[#D5DDCB]"
                            }`}
                          >
                            {doc.verificationStatus}
                          </span>
                          <Link
                            href="/documents"
                            className="px-3 py-1.5 text-xs font-semibold bg-[#F3EBDD] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] rounded-lg"
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
                    <div className="surface-card p-8 text-center text-xs text-[#68776A]">
                      No EVC inspections recorded for this institution.
                    </div>
                  ) : (
                    instEVC.map((evc) => (
                      <div key={evc.id} className="surface-card p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#263B32]">
                            Inspection Mode: {evc.inspectionMode}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#8FCDBB]/35 text-[#263B32] border border-[#8FCDBB]">
                            {evc.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#68776A]">
                          Scheduled Visit Date:{" "}
                          <strong className="font-mono text-[#263B32]">{evc.scheduledDate}</strong> • Geo-Tagging
                          Verified:{" "}
                          <strong className="text-[#263B32]">
                            {evc.geotagVerified ? "Yes (Cryptographically Sealed)" : "Pending"}
                          </strong>
                        </p>
                        <div className="bg-[#F3EBDD] p-3.5 rounded-lg border border-[#D5DDCB] text-xs">
                          <span className="font-bold text-[#263B32] block mb-1">
                            Empaneled Committee Members:
                          </span>
                          <ul className="list-disc pl-5 text-[#68776A] space-y-0.5">
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
                    <div key={u.id} className="surface-card p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#263B32]">{u.title}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            u.status === "Complied"
                              ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                              : u.status === "Overdue"
                              ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                              : "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#68776A]">
                        Mandatory Clause: <span className="font-mono text-[#263B32]">{u.clause}</span>
                      </p>
                      <div className="text-xs flex flex-wrap items-center gap-4 text-[#68776A] pt-1">
                        <span>
                          Deadline: <strong className="font-mono text-[#263B32]">{u.deadline}</strong>
                        </span>
                        <span>
                          Penalty: <span className="text-[#8C2D25] font-semibold">{u.penaltyClause}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Deadline Risk Alerts */}
              {activeTab === "ALERTS" && (
                <div className="space-y-4">
                  {instApps.map((a) => (
                    <div key={a.id} className="surface-card p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#263B32]">{a.applicationNumber}</span>
                        <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-[#F5E9D3] text-[#7A4E16] border border-[#D8B989]">
                          {a.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-[#263B32] font-semibold">{a.riskReason}</p>
                      <p className="text-xs text-[#68776A]">
                        Recommended: <span>{a.recommendedAction}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Audit Trail */}
              {activeTab === "AUDIT" && (
                <div className="surface-card divide-y divide-[#D5DDCB]/60 text-xs">
                  {instLogs.map((log) => (
                    <div key={log.id} className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#263B32]">{log.action}</span>
                        <span className="font-mono text-[10px] text-[#68776A]">{log.timestamp}</span>
                      </div>
                      <p className="text-[#576659]">{log.details}</p>
                      <div className="text-[10px] text-[#68776A] flex flex-wrap items-center gap-3">
                        <span>
                          Actor: {log.actorName} ({log.actorRole})
                        </span>
                        <span>•</span>
                        <span className="font-mono">Hash: {log.verifiedHash}</span>
                      </div>
                    </div>
                  ))}
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
