"use client";

import { use, useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import {
  FlowGuardStore,
  INITIAL_APPLICATIONS,
  INITIAL_DOCUMENTS,
} from "@/lib/flowguard-store";
import { Application, DocumentRecord, ApplicationStage } from "@/lib/types";
import {
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Building2,
  ShieldCheck,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const appId = resolvedParams.id;

  const [application, setApplication] = useState<Application | null>(
    () => INITIAL_APPLICATIONS.find((a) => a.id === appId || a.applicationNumber === appId) || null
  );
  const [associatedDocs, setAssociatedDocs] = useState<DocumentRecord[]>(() =>
    INITIAL_DOCUMENTS.filter((d) => d.applicationId === appId)
  );
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [checkedStore, setCheckedStore] = useState(false);

  // Deficiency Modal State
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [deficiencyReason, setDeficiencyReason] = useState("");
  const [deficiencyError, setDeficiencyError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setApplication(FlowGuardStore.getApplicationById(appId) || null);
      setAssociatedDocs(FlowGuardStore.getDocuments({ applicationId: appId }));
      setCheckedStore(true);
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, [appId]);

  useEffect(() => {
    if (!showDeficiencyModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDeficiencyModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showDeficiencyModal]);

  if (!application) {
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
                  {checkedStore ? "Application Not Found" : "Loading Application..."}
                </h1>
                <p className="text-xs text-[#68776A] leading-relaxed">
                  {checkedStore
                    ? `No application dossier matches identifier "${appId}".`
                    : "Retrieving regulatory dossier from store..."}
                </p>
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg"
                >
                  Back to Applications Directory
                </Link>
              </div>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    );
  }

  const currentUser = FlowGuardStore.getCurrentUser();

  const handleAdvanceStage = (nextStage: ApplicationStage, nextStatus: any, remarks: string) => {
    const updated = FlowGuardStore.updateApplicationStage(
      application.id,
      nextStage,
      nextStatus,
      currentUser.name,
      remarks
    );

    if (updated) {
      setApplication({ ...updated });
      setActionSuccess(
        `Workflow advanced to [${nextStage}] with status [${nextStatus}]. Action logged to immutable audit trail.`
      );
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const handleReturnDeficiencies = () => {
    if (!deficiencyReason.trim()) {
      setDeficiencyError("Statutory requirement: Please enter specific deficiency observations.");
      return;
    }
    setDeficiencyError(null);

    const updated = FlowGuardStore.returnForDeficiencies(
      application.id,
      [deficiencyReason],
      currentUser.name
    );

    if (updated) {
      setApplication({ ...updated });
      setShowDeficiencyModal(false);
      setDeficiencyReason("");
      setActionSuccess(
        "Application returned to Institution with deficiency notice. 15-day cure timer initiated."
      );
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const handleResubmit = () => {
    const updated = FlowGuardStore.resubmitApplication(application.id, currentUser.name);
    if (updated) {
      setApplication({ ...updated });
      setActionSuccess(
        "Corrective compliance documents resubmitted by Institution. Scrutiny re-verification active."
      );
      setTimeout(() => setActionSuccess(null), 5000);
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
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-[#68776A]">
                <Link href="/applications" className="hover:text-[#263B32] font-medium">
                  Applications
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-semibold text-[#263B32]">{application.applicationNumber}</span>
              </div>

              {/* Action Feedback Banner */}
              {actionSuccess && (
                <div className="bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557] shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Application Overview Hero */}
              <div className="surface-card p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#EAE2D2] text-[#263B32] px-2.5 py-0.5 rounded border border-[#D5DDCB]">
                        {application.applicationNumber}
                      </span>
                      <span className="text-xs font-bold text-[#263B32] bg-[#F3EBDD] px-2.5 py-0.5 rounded border border-[#D5DDCB]">
                        Stage: {application.currentStage}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-[#B7C9A8]/45 text-[#263B32] border border-[#B7C9A8]">
                        {application.status}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${
                          application.riskLevel === "Overdue"
                            ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                            : application.riskLevel === "High Risk"
                            ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                            : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                        }`}
                      >
                        {application.riskLevel}
                      </span>
                    </div>

                    <h1 className="font-display text-xl lg:text-2xl font-bold text-[#263B32] tracking-tight pt-1">
                      {application.category}
                    </h1>

                    <p className="text-xs text-[#68776A]">
                      Institution: <strong className="text-[#263B32]">{application.institutionName}</strong> (
                      {application.region} Region) • Academic Year {application.academicYear}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/institutions/${application.institutionId}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#263B32] bg-[#F3EBDD] hover:bg-[#EAE2D2] rounded-lg border border-[#D5DDCB] transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#2A6557]" />
                      <span>View Compliance Passport</span>
                    </Link>
                  </div>
                </div>

                {/* Timing & Assignment Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#D5DDCB] text-xs">
                  <div>
                    <span className="text-[#68776A] block text-[10px] uppercase font-bold">
                      Configured Deadline
                    </span>
                    <span className="font-mono font-bold text-[#263B32]">{application.deadline}</span>
                  </div>
                  <div>
                    <span className="text-[#68776A] block text-[10px] uppercase font-bold">Time Remaining</span>
                    <span
                      className={`font-mono font-bold ${
                        application.daysRemaining < 0 ? "text-[#8C2D25]" : "text-[#7A4E16]"
                      }`}
                    >
                      {application.daysRemaining < 0
                        ? `${Math.abs(application.daysRemaining)} Days Overdue`
                        : `${application.daysRemaining} Days Left`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#68776A] block text-[10px] uppercase font-bold">Assigned Officer</span>
                    <span className="font-semibold text-[#263B32]">{application.assignedOfficerName}</span>
                  </div>
                  <div>
                    <span className="text-[#68776A] block text-[10px] uppercase font-bold">Processing Route</span>
                    <span className="font-semibold text-[#263B32]">{application.workflowTemplate}</span>
                  </div>
                </div>
              </div>

              {/* Next Best Action Assistant Card */}
              <div className="bg-gradient-to-br from-[#FAF8F1] via-[#F3EBDD] to-[#8FCDBB]/20 border border-[#8FCDBB] rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#263B32]">
                    <Sparkles className="w-4 h-4 text-[#2A6557]" />
                    <span>Next Best Action Recommendation</span>
                  </div>
                  <span className="text-[10px] font-mono bg-[#B7C9A8]/45 text-[#263B32] border border-[#B7C9A8] px-2 py-0.5 rounded font-bold">
                    Rule-Engine v2026.1
                  </span>
                </div>

                <p className="text-sm font-bold text-[#263B32] leading-snug">
                  {application.recommendedAction}
                </p>

                <p className="text-xs text-[#576659]">
                  <strong className="text-[#263B32]">Why Waiting:</strong> {application.riskReason}
                </p>

                {/* Action Controls based on Current Stage */}
                <div className="pt-3 border-t border-[#D5DDCB] flex flex-wrap items-center gap-3">
                  {application.currentStage === "Scrutiny" && (
                    <>
                      <button
                        onClick={() =>
                          handleAdvanceStage(
                            "EVC Scheduling",
                            "Awaiting EVC",
                            "Scrutiny Committee approved all mandatory documents."
                          )
                        }
                        className="px-4 py-2.5 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#8FCDBB]" />
                        <span>Approve Scrutiny &amp; Advance to EVC Scheduling</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeficiencyError(null);
                          setShowDeficiencyModal(true);
                        }}
                        className="px-4 py-2.5 bg-[#B7C9A8] hover:bg-[#A6BA96] text-[#263B32] border border-[#96AD85] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Raise Deficiencies &amp; Return to Institution</span>
                      </button>
                    </>
                  )}

                  {application.currentStage === "Deficiencies" && (
                    <button
                      onClick={handleResubmit}
                      className="px-4 py-2.5 bg-[#8FCDBB] hover:bg-[#7DC2AE] text-[#263B32] border border-[#72B7A3] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Institution Action: Resubmit Corrected Compliance Evidence</span>
                    </button>
                  )}

                  {application.currentStage === "EVC Scheduling" && (
                    <button
                      onClick={() =>
                        handleAdvanceStage(
                          "EVC Inspection",
                          "Awaiting EVC",
                          "Expert Visiting Committee dates and panel confirmed."
                        )
                      }
                      className="px-4 py-2.5 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CalendarClock className="w-4 h-4 text-[#8FCDBB]" />
                      <span>Confirm EVC Committee Schedule</span>
                    </button>
                  )}

                  {application.currentStage === "EVC Inspection" && (
                    <button
                      onClick={() =>
                        handleAdvanceStage(
                          "SAC/SHC Review",
                          "SAC Hearing",
                          "EVC Geo-Tagged Inspection completed. Observations submitted."
                        )
                      }
                      className="px-4 py-2.5 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#8FCDBB]" />
                      <span>Submit EVC Findings &amp; Refer to SAC</span>
                    </button>
                  )}

                  {application.currentStage === "SAC/SHC Review" && (
                    <button
                      onClick={() =>
                        handleAdvanceStage(
                          "Final Approval",
                          "Approved",
                          "Standing Appellate Committee concurred with institutional approval."
                        )
                      }
                      className="px-4 py-2.5 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#8FCDBB]" />
                      <span>Issue Letter of Approval (LoA)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Associated Prescribed Documents */}
              <div className="surface-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-3">
                  <h3 className="text-xs font-bold text-[#263B32] uppercase tracking-wider">
                    Associated Prescribed Documents ({associatedDocs.length})
                  </h3>
                  <Link href="/documents" className="text-xs font-bold text-[#2A6557] hover:underline">
                    Open Smart Document Checker
                  </Link>
                </div>

                <div className="divide-y divide-[#D5DDCB]/60 text-xs">
                  {associatedDocs.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#263B32]">{doc.title}</p>
                        <p className="text-[11px] text-[#68776A]">
                          {doc.category} • {doc.fileName} ({doc.fileSize})
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          doc.verificationStatus === "VERIFIED"
                            ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                            : doc.verificationStatus === "RETURNED"
                            ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                            : "bg-[#EAE2D2] text-[#263B32] border-[#D5DDCB]"
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Deficiency Modal */}
      {showDeficiencyModal && (
        <div className="fixed inset-0 bg-[#263B32]/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-3">
              <h3 className="font-display text-base font-bold text-[#263B32] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#7A4E16]" />
                <span>Return for Deficiencies with Mandatory Rationale</span>
              </h3>
              <button
                onClick={() => setShowDeficiencyModal(false)}
                aria-label="Close modal"
                className="text-[#68776A] hover:text-[#263B32] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {deficiencyError && (
              <div className="bg-[#F5DDD9] border border-[#DFACA5] text-[#5E1A14] text-xs p-2.5 rounded-lg font-semibold">
                {deficiencyError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <p className="text-[#68776A]">
                Under AICTE Approval Process Handbook Cl. 4.5, returning an application requires specific factual deficiency observations. The institution will have 15 days to cure before final consideration.
              </p>
              <div>
                <label className="font-semibold text-[#263B32] block mb-1">
                  Deficiency Observations (Mandatory):
                </label>
                <textarea
                  rows={4}
                  value={deficiencyReason}
                  onChange={(e) => setDeficiencyReason(e.target.value)}
                  placeholder="e.g. Land Lease deed expires within 30 days without registered renewal agreement; Fire safety clearance NOC missing Form B municipal seal..."
                  className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#D5DDCB]">
              <button
                onClick={() => setShowDeficiencyModal(false)}
                className="px-3.5 py-2 text-xs text-[#68776A] hover:bg-[#EAE2D2] rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnDeficiencies}
                className="px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer"
              >
                Submit Deficiency Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
