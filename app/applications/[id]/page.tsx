"use client";

import { use, useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Application, DocumentRecord, ApplicationStage } from "@/lib/types";
import { 
  FolderGit2, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  CalendarClock
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const appId = resolvedParams.id;

  const [application, setApplication] = useState<Application | null>(() => FlowGuardStore.getApplicationById(appId) || null);
  const [associatedDocs] = useState<DocumentRecord[]>(() => FlowGuardStore.getDocuments({ applicationId: appId }));
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Deficiency Modal State
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [deficiencyReason, setDeficiencyReason] = useState("");

  if (!application) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center text-xs text-slate-500">
        Loading Application details...
      </div>
    );
  }

  const currentUser = FlowGuardStore.getCurrentUser();
  const currentRole = FlowGuardStore.getCurrentRole();

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
      setActionSuccess(`Workflow advanced to [${nextStage}] with status [${nextStatus}]. Action logged to immutable audit trail.`);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const handleReturnDeficiencies = () => {
    if (!deficiencyReason.trim()) {
      alert("Statutory requirement: Please enter specific deficiency observations.");
      return;
    }

    const updated = FlowGuardStore.returnForDeficiencies(
      application.id,
      [deficiencyReason],
      currentUser.name
    );

    if (updated) {
      setApplication({ ...updated });
      setShowDeficiencyModal(false);
      setDeficiencyReason("");
      setActionSuccess(`Application returned to Institution with deficiency notice. 15-day cure timer initiated.`);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const handleResubmit = () => {
    const updated = FlowGuardStore.resubmitApplication(application.id, currentUser.name);
    if (updated) {
      setApplication({ ...updated });
      setActionSuccess(`Corrective compliance documents resubmitted by Institution. Scrutiny re-verification active.`);
      setTimeout(() => setActionSuccess(null), 5000);
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

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/applications" className="hover:text-slate-900">Applications</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-900">{application.applicationNumber}</span>
            </div>

            {/* Action Feedback Banner */}
            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-4 py-3 rounded-lg flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Application Overview Hero */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded border border-amber-200">
                      {application.applicationNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      Stage: {application.currentStage}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {application.status}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      application.riskLevel === "Overdue" ? "bg-red-100 text-red-800" :
                      application.riskLevel === "High Risk" ? "bg-amber-100 text-amber-800" :
                      "bg-emerald-100 text-emerald-800"
                    }`}>
                      {application.riskLevel}
                    </span>
                  </div>

                  <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight mt-2">
                    {application.category}
                  </h1>

                  <p className="text-xs text-slate-600">
                    Institution: <strong>{application.institutionName}</strong> ({application.region} Region) • Academic Year {application.academicYear}
                  </p>
                </div>

                <div className="text-right">
                  <Link
                    href={`/institutions/${application.institutionId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Compliance Passport</span>
                  </Link>
                </div>
              </div>

              {/* Timing & Assignment Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Configured Deadline</span>
                  <span className="font-mono font-bold text-slate-800">{application.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Remaining</span>
                  <span className={`font-mono font-black ${application.daysRemaining < 0 ? "text-red-600" : "text-amber-600"}`}>
                    {application.daysRemaining < 0 ? `${Math.abs(application.daysRemaining)} Days Overdue` : `${application.daysRemaining} Days Left`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Officer</span>
                  <span className="font-semibold text-slate-800">{application.assignedOfficerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Processing Route</span>
                  <span className="font-semibold text-slate-800">{application.workflowTemplate}</span>
                </div>
              </div>
            </div>

            {/* Next Best Action Assistant Card */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Next Best Action Recommendation</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold">
                  Rule-Engine v2026.1
                </span>
              </div>

              <p className="text-sm font-bold text-slate-900 leading-snug">
                {application.recommendedAction}
              </p>

              <p className="text-xs text-slate-600">
                <strong>Why Waiting:</strong> {application.riskReason}
              </p>

              {/* Action Controls based on Current Stage & Role */}
              <div className="pt-3 border-t border-amber-200 flex flex-wrap items-center gap-3">
                {application.currentStage === "Scrutiny" && (
                  <>
                    <button
                      onClick={() => handleAdvanceStage("EVC Scheduling", "Awaiting EVC", "Scrutiny Committee approved all mandatory documents.")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Scrutiny & Advance to EVC Scheduling</span>
                    </button>

                    <button
                      onClick={() => setShowDeficiencyModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Raise Deficiencies & Return to Institution</span>
                    </button>
                  </>
                )}

                {application.currentStage === "Deficiencies" && (
                  <button
                    onClick={handleResubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Institution Action: Resubmit Corrected Compliance Evidence</span>
                  </button>
                )}

                {application.currentStage === "EVC Scheduling" && (
                  <button
                    onClick={() => handleAdvanceStage("EVC Inspection", "Awaiting EVC", "Expert Visiting Committee dates and panel confirmed.")}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CalendarClock className="w-4 h-4 text-amber-400" />
                    <span>Confirm EVC Committee Schedule</span>
                  </button>
                )}

                {application.currentStage === "EVC Inspection" && (
                  <button
                    onClick={() => handleAdvanceStage("SAC/SHC Review", "SAC Hearing", "EVC Geo-Tagged Inspection completed. Observations submitted.")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit EVC Findings & Refer to SAC</span>
                  </button>
                )}

                {application.currentStage === "SAC/SHC Review" && (
                  <button
                    onClick={() => handleAdvanceStage("Final Approval", "Approved", "Standing Appellate Committee concurred with institutional approval.")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Issue Letter of Approval (LoA)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Associated Prescribed Documents */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Associated Prescribed Documents ({associatedDocs.length})
                </h3>
                <Link
                  href="/documents"
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  Open Smart Document Checker
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {associatedDocs.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">{doc.category} • {doc.fileName} ({doc.fileSize})</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      doc.verificationStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-800" :
                      doc.verificationStatus === "RETURNED" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {doc.verificationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Deficiency Modal */}
      {showDeficiencyModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Return for Deficiencies with Mandatory Rationale</span>
              </h3>
              <button 
                onClick={() => setShowDeficiencyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Under AICTE Approval Process Handbook Cl. 4.5, returning an application requires specific factual deficiency observations. The institution will have 15 days to cure before final consideration.
              </p>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Deficiency Observations (Mandatory):
                </label>
                <textarea
                  rows={4}
                  value={deficiencyReason}
                  onChange={(e) => setDeficiencyReason(e.target.value)}
                  placeholder="e.g. Land Lease deed expires within 30 days without registered renewal agreement; Fire safety clearance NOC missing Form B municipal seal..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowDeficiencyModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnDeficiencies}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded shadow-xs"
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
