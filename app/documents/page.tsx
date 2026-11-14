"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, INITIAL_DOCUMENTS } from "@/lib/flowguard-store";
import { findDuplicateHashMatches } from "@/lib/compliance";
import { DocumentRecord, DocumentCategory, UserRole } from "@/lib/types";
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  Scan,
  RotateCcw,
} from "lucide-react";

export default function DocumentCheckerPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(
    INITIAL_DOCUMENTS[1] || INITIAL_DOCUMENTS[0] || null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Verification modal state
  const [verificationRemarks, setVerificationRemarks] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // New Upload Simulation state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<DocumentCategory>("Land Lease / Ownership Deed");
  const [newInstId, setNewInstId] = useState("inst-001");
  const [simulatingOcr, setSimulatingOcr] = useState(false);

  const [currentRole, setCurrentRole] = useState<UserRole>("SCRUTINY_OFFICER");

  useEffect(() => {
    const sync = () => {
      const latest = FlowGuardStore.getDocuments();
      setDocuments(latest);
      setCurrentRole(FlowGuardStore.getCurrentRole());
      setSelectedDoc((prev) => (prev ? latest.find((d) => d.id === prev.id) || latest[0] || null : latest[0] || null));
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  useEffect(() => {
    if (!showUploadModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !simulatingOcr) setShowUploadModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showUploadModal, simulatingOcr]);

  const handleVerify = (status: "VERIFIED" | "RETURNED" | "REJECTED") => {
    if (!selectedDoc) return;
    setActionError(null);
    if ((status === "RETURNED" || status === "REJECTED") && !verificationRemarks.trim()) {
      setActionError(
        "Mandatory statutory requirement: A specific observation must be entered in remarks before returning or rejecting a document."
      );
      return;
    }

    const officer = FlowGuardStore.getCurrentUser().name;
    const updated = FlowGuardStore.verifyDocument(
      selectedDoc.id,
      status,
      verificationRemarks || "Verified in compliance with AICTE APH 2026 norms.",
      officer
    );

    if (updated) {
      const refreshed = FlowGuardStore.getDocuments();
      setDocuments(refreshed);
      setSelectedDoc(updated);
      setVerificationRemarks("");
      setActionSuccess(`Document successfully marked as ${status} by ${officer}.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleSimulateUpload = () => {
    setSimulatingOcr(true);
    setTimeout(() => {
      const inst = FlowGuardStore.getInstitutionById(newInstId);
      const created = FlowGuardStore.uploadDocument({
        institutionId: newInstId,
        institutionName: inst?.name || "Institution",
        applicationId: "app-001",
        category: newCategory,
        title: newTitle || `Institutional ${newCategory} - AY 26-27`,
        fileName: `Scanned_${newCategory.replace(/\s+/g, "_")}_Upload.pdf`,
        fileSize: "3.8 MB",
        fileHash: `e3b0c44298fc1c149afbf4c8996fb924${Math.random().toString(36).substring(2, 8)}`,
        issueDate: "2026-01-10",
        expiryDate: "2028-01-09",
        daysToExpiry: 438,
        isExpiringSoon: false,
        isExpired: false,
        extractedMetadata: {
          deedRegistrationNo: `REG/UP/${Math.floor(10000 + Math.random() * 90000)}`,
          surveyPlotNo: "Plot 88B, Industrial Corridor",
          areaAcres: 5.4,
          issuingAuthority: "Competent Revenue Authority",
          notarized: true,
          confidenceScore: 0.94,
        },
        ocrFlags: [
          "Document category matches checklist",
          "Area extracted: 5.40 Acres (Meets minimum 5.0 norm)",
          "Notary seal recognized with 94% confidence",
        ],
        verificationStatus: "PENDING",
      });

      setSimulatingOcr(false);
      setShowUploadModal(false);
      const list = FlowGuardStore.getDocuments();
      setDocuments(list);
      setSelectedDoc(created);
      setActionSuccess("New document uploaded and OCR suggestions synthesized.");
      setTimeout(() => setActionSuccess(null), 4000);
    }, 1000);
  };

  const filteredDocs = documents.filter((doc) => {
    if (categoryFilter !== "All" && doc.category !== categoryFilter) return false;
    if (statusFilter !== "All" && doc.verificationStatus !== statusFilter) return false;
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
                      Pillar 2 • Secure Analysis
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">OCR Assist &amp; Human Sign-Off</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Smart Document Checker
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Automated OCR extraction, missing field flags, land area norms &amp; duplicate hash detection with official human verification.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#8FCDBB]" />
                    <span>Upload &amp; Analyze Document</span>
                  </button>
                </div>
              </div>

              {/* Statutory Safeguards Banner */}
              <div className="bg-[#FAF8F1] border border-[#8FCDBB] rounded-xl p-4 text-xs text-[#263B32] flex items-start gap-2.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#2A6557] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Statutory Verification Safeguard: </span>
                  <span className="text-[#576659]">
                    OCR extractions are decision-support suggestions, not conclusive legal proofs. An institution is never automatically disqualified solely by OCR omission, nor marked compliant merely upon file upload. An authorized Scrutiny Officer must review and sign off.
                  </span>
                </div>
              </div>

              {/* Action Feedback Banners */}
              {actionSuccess && (
                <div className="bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557]" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {actionError && (
                <div className="bg-[#F5DDD9] border border-[#DFACA5] text-[#5E1A14] text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-[#8C2D25]" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Main Split-View Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Document Registry / Queue (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="surface-card p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#263B32] uppercase tracking-wider">
                        Document Queue ({filteredDocs.length})
                      </span>
                      <span className="text-[11px] text-[#68776A] font-mono">v2026 Checklist</span>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 bg-[#F3EBDD] border border-[#D5DDCB] px-2.5 py-1.5 rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="RETURNED">Returned for Correction</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="flex-1 bg-[#F3EBDD] border border-[#D5DDCB] px-2.5 py-1.5 rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                      >
                        <option value="All">All Categories</option>
                        <option value="Land Lease / Ownership Deed">Land Lease Deed</option>
                        <option value="Building Plan & Occupancy Certificate">Building Plan</option>
                        <option value="Fire Safety NOC">Fire Safety NOC</option>
                        <option value="Faculty Cadre & AICTE Pay Scale Undertaking">Faculty Cadre</option>
                      </select>
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                    {filteredDocs.length === 0 ? (
                      <div className="surface-card p-6 text-center text-xs text-[#68776A] space-y-3">
                        <p>No documents match the selected filters.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter("All");
                            setCategoryFilter("All");
                          }}
                          className="px-3 py-1.5 bg-[#F3EBDD] hover:bg-[#EAE2D2] text-[#263B32] font-bold rounded-lg border border-[#D5DDCB] cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      filteredDocs.map((doc) => {
                        const isSelected = selectedDoc?.id === doc.id;

                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setActionError(null);
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#FAF8F1] border-[#8FCDBB] ring-2 ring-[#8FCDBB]/40 shadow-sm"
                              : "bg-[#FAF8F1]/80 border-[#D5DDCB] hover:border-[#B7C9A8] hover:bg-[#FAF8F1]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono text-[#68776A] bg-[#EAE2D2] px-2 py-0.5 rounded border border-[#D5DDCB]">
                              {doc.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
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
                          </div>

                          <h4 className="text-xs font-bold text-[#263B32] mt-2 leading-snug">{doc.title}</h4>
                          <p className="text-[11px] text-[#68776A] truncate mt-0.5">{doc.institutionName}</p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D5DDCB]/60 text-[10px] text-[#68776A]">
                            <span>
                              {doc.fileName} ({doc.fileSize})
                            </span>
                            {doc.isExpiringSoon && (
                              <span className="text-[#7A4E16] font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Expires in {doc.daysToExpiry}d
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                    )}
                  </div>
                </div>

                {/* Right Column: Split Analysis & Verification (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {selectedDoc ? (
                    <div className="surface-card overflow-hidden">
                      {/* Top Doc Details Header */}
                      <div className="p-5 bg-[#263B32] text-[#FAF8F1] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8FCDBB] text-[#263B32] font-mono">
                              {selectedDoc.category}
                            </span>
                            <span className="text-[10px] text-[#EAE2D2]/80 font-mono truncate">
                              SHA: {selectedDoc.fileHash.slice(0, 16)}...
                            </span>
                          </div>
                          <h2 className="font-display text-base lg:text-lg font-bold text-[#FAF8F1] mt-1.5">
                            {selectedDoc.title}
                          </h2>
                          <p className="text-xs text-[#EAE2D2]/80">
                            {selectedDoc.institutionName} • Uploaded {selectedDoc.uploadDate}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block text-xs font-bold uppercase px-2.5 py-1 rounded-md border ${
                              selectedDoc.verificationStatus === "VERIFIED"
                                ? "bg-[#8FCDBB] text-[#263B32] border-[#8FCDBB]"
                                : selectedDoc.verificationStatus === "RETURNED"
                                ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                                : selectedDoc.verificationStatus === "REJECTED"
                                ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                : "bg-[#FAF8F1]/15 text-[#FAF8F1] border-[#FAF8F1]/30"
                            }`}
                          >
                            {selectedDoc.verificationStatus}
                          </span>
                        </div>
                      </div>

                      {/* Split View Comparison */}
                      <div className="p-5 space-y-5">
                        {/* Document Preview Box */}
                        <div className="bg-[#EAE2D2]/60 border border-[#D5DDCB] rounded-xl p-4 relative overflow-hidden text-[#263B32]">
                          <div className="flex items-center justify-between pb-3 border-b border-[#D5DDCB]">
                            <div className="flex items-center gap-2 text-xs font-bold">
                              <Scan className="w-4 h-4 text-[#2A6557]" />
                              <span>Document Facsimile Visualizer</span>
                            </div>
                            <span className="text-[11px] font-mono text-[#68776A]">
                              OCR Engine: Confidence{" "}
                              {(selectedDoc.extractedMetadata.confidenceScore
                                ? selectedDoc.extractedMetadata.confidenceScore * 100
                                : 85
                              ).toFixed(0)}
                              %
                            </span>
                          </div>

                          <div className="mt-3 p-4 bg-[#FAF8F1] border border-[#D5DDCB] rounded-lg text-xs space-y-2 text-[#263B32]">
                            <div className="text-center font-bold uppercase tracking-wider text-[11px] text-[#68776A]">
                              GOVERNMENT OF INDIA / STATE LAND &amp; REVENUE REGISTRATION
                            </div>
                            <div className="text-center font-display font-bold text-sm text-[#263B32]">
                              SUB-REGISTRAR OFFICE • DEED OF REGISTRATION &amp; OCCUPANCY
                            </div>
                            <div className="pt-2 text-[#263B32] leading-relaxed font-sans text-xs space-y-1">
                              <p>
                                <strong>Document Title:</strong> {selectedDoc.title}
                              </p>
                              <p>
                                <strong>Executing Entity:</strong> {selectedDoc.institutionName}
                              </p>
                              <p>
                                <strong>Deed Reg No / Stamp No:</strong>{" "}
                                {selectedDoc.extractedMetadata.deedRegistrationNo || "Unspecified"}
                              </p>
                              <p>
                                <strong>Survey Plot / Location:</strong>{" "}
                                {selectedDoc.extractedMetadata.surveyPlotNo || "Sector / Revenue Survey Area"}
                              </p>
                              <p>
                                <strong>Certified Land Area:</strong>{" "}
                                {selectedDoc.extractedMetadata.areaAcres
                                  ? `${selectedDoc.extractedMetadata.areaAcres} Acres`
                                  : "Field not detected"}
                              </p>
                              <p>
                                <strong>Issuing / Notarizing Authority:</strong>{" "}
                                {selectedDoc.extractedMetadata.issuingAuthority || "Competent Authority"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* OCR Extracted Checklist Metadata */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-[#263B32] uppercase tracking-wider">
                            Extracted Information vs. AICTE Norm Checklist
                          </h4>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                              <span className="text-[10px] text-[#68776A] block">Registration / Deed No</span>
                              <span className="font-mono font-bold text-[#263B32]">
                                {selectedDoc.extractedMetadata.deedRegistrationNo || "Missing"}
                              </span>
                            </div>

                            <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                              <span className="text-[10px] text-[#68776A] block">Extracted Land Area</span>
                              <span
                                className={`font-mono font-bold ${
                                  selectedDoc.extractedMetadata.areaAcres &&
                                  selectedDoc.extractedMetadata.areaAcres < 5.0
                                    ? "text-[#8C2D25]"
                                    : "text-[#2A6557]"
                                }`}
                              >
                                {selectedDoc.extractedMetadata.areaAcres
                                  ? `${selectedDoc.extractedMetadata.areaAcres} Acres`
                                  : "N/A"}
                              </span>
                              {selectedDoc.extractedMetadata.areaAcres &&
                                selectedDoc.extractedMetadata.areaAcres < 5.0 && (
                                  <span className="text-[9px] text-[#8C2D25] block mt-0.5 font-semibold">
                                    Norm: &ge; 5.0 Acres
                                  </span>
                                )}
                            </div>

                            <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                              <span className="text-[10px] text-[#68776A] block">Expiry Date / Term</span>
                              <span
                                className={`font-mono font-bold ${
                                  selectedDoc.isExpiringSoon ? "text-[#7A4E16]" : "text-[#263B32]"
                                }`}
                              >
                                {selectedDoc.expiryDate || "Perpetual / No Expiry"}
                              </span>
                            </div>

                            <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                              <span className="text-[10px] text-[#68776A] block">Notary / Official Seal</span>
                              <span className="font-semibold text-[#263B32]">
                                {selectedDoc.extractedMetadata.notarized
                                  ? "Verified Present"
                                  : "Missing / Unclear"}
                              </span>
                            </div>

                            {(() => {
                              const dupMatches = findDuplicateHashMatches(selectedDoc, documents);
                              const hasDuplicate = dupMatches.length > 0;
                              return (
                                <div
                                  className={`p-3 rounded-lg border ${
                                    hasDuplicate
                                      ? "bg-[#F5DDD9]/70 border-[#DFACA5]"
                                      : "bg-[#F3EBDD] border-[#D5DDCB]"
                                  }`}
                                >
                                  <span className="text-[10px] text-[#68776A] block">
                                    Duplicate File Hash
                                  </span>
                                  {hasDuplicate ? (
                                    <span
                                      className="font-mono text-[10px] text-[#8C2D25] block font-bold"
                                      title={`Matches ${dupMatches.map((m) => `${m.fileName} (${m.institutionName})`).join(", ")}`}
                                    >
                                      Collision Detected ({dupMatches.length} match) —{" "}
                                      {dupMatches[0].institutionName.split(" ")[0]}
                                    </span>
                                  ) : (
                                    <span className="font-mono text-[10px] text-[#2A6557] truncate block font-semibold">
                                      Unique (No match)
                                    </span>
                                  )}
                                </div>
                              );
                            })()}

                            <div className="bg-[#F3EBDD] p-3 rounded-lg border border-[#D5DDCB]">
                              <span className="text-[10px] text-[#68776A] block">OCR Confidence</span>
                              <span className="font-mono font-bold text-[#263B32]">
                                {selectedDoc.extractedMetadata.confidenceScore
                                  ? `${(selectedDoc.extractedMetadata.confidenceScore * 100).toFixed(0)}%`
                                  : "85%"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* OCR Potential Issues & Warnings */}
                        {selectedDoc.ocrFlags.length > 0 && (
                          <div className="p-3.5 bg-[#F5E9D3]/70 border border-[#D8B989] rounded-xl text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-[#7A4E16]">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>
                                Potential Document Inconsistencies &amp; Flags ({selectedDoc.ocrFlags.length})
                              </span>
                            </div>
                            <ul className="list-disc pl-5 space-y-1 text-[#263B32]">
                              {selectedDoc.ocrFlags.map((flag, idx) => (
                                <li key={idx} className="font-medium leading-relaxed">
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Official Verification History */}
                        {selectedDoc.verifiedBy && (
                          <div className="p-3.5 bg-[#EAE2D2]/65 border border-[#D5DDCB] rounded-xl text-xs space-y-1">
                            <div className="font-bold text-[#263B32]">Officer Verification Record:</div>
                            <p className="text-[#68776A]">
                              Recorded by <strong className="text-[#263B32]">{selectedDoc.verifiedBy}</strong> on{" "}
                              {selectedDoc.verifiedAt}
                            </p>
                            <p className="text-[#263B32] italic">&quot;{selectedDoc.verificationRemarks}&quot;</p>
                          </div>
                        )}

                        {/* Human Scrutiny Officer Verification Workflow Controls */}
                        <div className="pt-4 border-t border-[#D5DDCB] space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[#263B32] uppercase tracking-wider">
                              Record Official Scrutiny Decision
                            </h4>
                            <span className="text-[11px] text-[#68776A] font-mono">
                              Acting Role: {currentRole}
                            </span>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-[#263B32] block mb-1.5">
                              Officer Remarks / Deficiency Observation (Mandatory for Return or Rejection):
                            </label>
                            <textarea
                              rows={2}
                              value={verificationRemarks}
                              onChange={(e) => setVerificationRemarks(e.target.value)}
                              placeholder="Enter official scrutiny observation, land deed endorsement notes, or deficiency rationale..."
                              className="w-full text-xs p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => handleVerify("VERIFIED")}
                              className="flex-1 py-2.5 px-3 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#8FCDBB]" />
                              <span>Mark Verified Compliant</span>
                            </button>

                            <button
                              onClick={() => handleVerify("RETURNED")}
                              className="flex-1 py-2.5 px-3 bg-[#B7C9A8] hover:bg-[#A6BA96] text-[#263B32] border border-[#96AD85] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Return for Correction</span>
                            </button>

                            <button
                              onClick={() => handleVerify("REJECTED")}
                              className="py-2.5 px-4 bg-[#8C2D25] hover:bg-[#70221B] text-[#FAF8F1] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject Document</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="surface-card p-12 text-center text-[#68776A] text-xs">
                      Select a document from the queue to inspect OCR suggestions and record official verification.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Upload Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-[#263B32]/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-3">
              <h3 className="font-display text-base font-bold text-[#263B32] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#2A6557]" />
                <span>Upload Institutional Document</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#68776A] hover:text-[#263B32] font-bold cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#263B32] block mb-1">Target Institution:</label>
                <select
                  value={newInstId}
                  onChange={(e) => setNewInstId(e.target.value)}
                  className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                >
                  <option value="inst-001">Veermata Jijabai Technological Institute (VJTI)</option>
                  <option value="inst-003">Oxford Institute of Technology &amp; Management</option>
                  <option value="inst-004">Kalinga School of Pharmacy</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#263B32] block mb-1">Document Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                  className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                >
                  <option value="Land Lease / Ownership Deed">Land Lease / Ownership Deed</option>
                  <option value="Building Plan & Occupancy Certificate">
                    Building Plan &amp; Occupancy Certificate
                  </option>
                  <option value="Fire Safety NOC">Fire Safety NOC</option>
                  <option value="Faculty Cadre & AICTE Pay Scale Undertaking">
                    Faculty Cadre &amp; AICTE Pay Scale Undertaking
                  </option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#263B32] block mb-1">
                  Document Title / File Name:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Registered Land Lease Extension Deed Vol. 2"
                  className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:border-[#8FCDBB]"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-[#B7C9A8] rounded-xl text-center bg-[#F3EBDD]/70 text-[#68776A]">
                <FileText className="w-8 h-8 text-[#2A6557] mx-auto mb-1" />
                <p className="font-bold text-[#263B32]">Select PDF or Scanned TIFF / JPEG</p>
                <p className="text-[10px] text-[#68776A]">
                  Max size 25MB • Automated SHA-256 Hash Computed
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#D5DDCB]">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-2 text-xs text-[#68776A] hover:bg-[#EAE2D2] rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateUpload}
                disabled={simulatingOcr}
                className="px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer"
              >
                {simulatingOcr ? "Analyzing OCR & Signatures..." : "Upload & Analyze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
