"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { DocumentRecord, DocumentCategory } from "@/lib/types";
import { 
  FileCheck2, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Search, 
  FileText, 
  Scan, 
  Hash, 
  Eye, 
  ExternalLink,
  HelpCircle,
  Building,
  RotateCcw
} from "lucide-react";

export default function DocumentCheckerPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => FlowGuardStore.getDocuments());
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(() => {
    const list = FlowGuardStore.getDocuments();
    return list[1] || list[0] || null;
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Verification modal state
  const [verificationRemarks, setVerificationRemarks] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Upload Simulation state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<DocumentCategory>("Land Lease / Ownership Deed");
  const [newInstId, setNewInstId] = useState("inst-001");
  const [simulatingOcr, setSimulatingOcr] = useState(false);

  const handleVerify = (status: 'VERIFIED' | 'RETURNED' | 'REJECTED') => {
    if (!selectedDoc) return;
    if ((status === 'RETURNED' || status === 'REJECTED') && !verificationRemarks.trim()) {
      alert("Mandatory statutory requirement: A specific reason must be provided when returning or rejecting a document.");
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
          confidenceScore: 0.94
        },
        ocrFlags: [
          "Document category matches checklist",
          "Area extracted: 5.40 Acres (Meets minimum 5.0 norm)",
          "Notary seal recognized with 94% confidence"
        ],
        verificationStatus: "PENDING"
      });

      setSimulatingOcr(false);
      setShowUploadModal(false);
      const list = FlowGuardStore.getDocuments();
      setDocuments(list);
      setSelectedDoc(created);
      setActionSuccess(`New document uploaded and OCR suggestions synthesized.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }, 1200);
  };

  const filteredDocs = documents.filter((doc) => {
    if (categoryFilter !== "All" && doc.category !== categoryFilter) return false;
    if (statusFilter !== "All" && doc.verificationStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!doc.title.toLowerCase().includes(q) && !doc.institutionName.toLowerCase().includes(q)) {
        return false;
      }
    }
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
                    Pillar 2 • Secure Analysis
                  </span>
                  <span className="text-xs text-slate-500 font-mono">OCR Assist & Human Sign-Off</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Smart Document Checker
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Automated OCR extraction, missing field flags, land area norms & duplicate hash detection with official human verification.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md shadow-xs cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Analyze Document</span>
                </button>
              </div>
            </div>

            {/* Statutory Safeguards Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Statutory Verification Safeguard: </span>
                <span>
                  OCR extractions are decision-support suggestions, not conclusive legal proofs. An institution is never automatically disqualified solely by OCR omission, nor marked compliant merely upon file upload. An authorized Scrutiny Officer must review and sign off.
                </span>
              </div>
            </div>

            {/* Action Feedback Banner */}
            {actionSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              </div>
            )}

            {/* Main Split-View Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Document Registry / Queue (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Document Queue ({filteredDocs.length})
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      v2026 Checklist
                    </span>
                  </div>

                  {/* Filter controls */}
                  <div className="flex gap-2 text-xs">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded text-slate-700"
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
                      className="flex-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded text-slate-700"
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
                  {filteredDocs.map((doc) => {
                    const isSelected = selectedDoc?.id === doc.id;
                    const hasIssues = doc.ocrFlags.length > 0;

                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-50/60 border-amber-500 ring-2 ring-amber-400/40 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {doc.category}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            doc.verificationStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-800" :
                            doc.verificationStatus === "RETURNED" ? "bg-amber-100 text-amber-800" :
                            doc.verificationStatus === "REJECTED" ? "bg-red-100 text-red-800" :
                            "bg-slate-200 text-slate-700"
                          }`}>
                            {doc.verificationStatus}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {doc.institutionName}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                          <span>{doc.fileName} ({doc.fileSize})</span>
                          {doc.isExpiringSoon && (
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expires in {doc.daysToExpiry}d
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Split Analysis & Verification (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {selectedDoc ? (
                  <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    
                    {/* Top Doc Details Header */}
                    <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-mono">
                            {selectedDoc.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono truncate">
                            SHA: {selectedDoc.fileHash.slice(0, 16)}...
                          </span>
                        </div>
                        <h2 className="text-sm lg:text-base font-extrabold text-white mt-1">
                          {selectedDoc.title}
                        </h2>
                        <p className="text-xs text-slate-300">
                          {selectedDoc.institutionName} • Uploaded {selectedDoc.uploadDate}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block text-xs font-black uppercase px-2.5 py-1 rounded ${
                          selectedDoc.verificationStatus === "VERIFIED" ? "bg-emerald-500 text-slate-950" :
                          selectedDoc.verificationStatus === "RETURNED" ? "bg-amber-500 text-slate-950" :
                          selectedDoc.verificationStatus === "REJECTED" ? "bg-red-500 text-white" :
                          "bg-slate-700 text-slate-200"
                        }`}>
                          {selectedDoc.verificationStatus}
                        </span>
                      </div>
                    </div>

                    {/* Split View Comparison: Facsimile / Extracted Grid */}
                    <div className="p-5 space-y-5">
                      
                      {/* Document Preview Box (Mock High-Def Facsimile) */}
                      <div className="bg-slate-100 border border-slate-300 rounded-md p-4 relative overflow-hidden text-slate-800">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-300">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Scan className="w-4 h-4 text-amber-600" />
                            <span>Document Facsimile Visualizer</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            OCR Engine: Confidence {(selectedDoc.extractedMetadata.confidenceScore ? selectedDoc.extractedMetadata.confidenceScore * 100 : 85).toFixed(0)}%
                          </span>
                        </div>

                        {/* Facsimile Body Preview */}
                        <div className="mt-3 p-4 bg-amber-50/40 border border-amber-200/60 rounded text-xs space-y-2 font-serif text-slate-900">
                          <div className="text-center font-bold uppercase tracking-wider text-[11px] text-slate-700">
                            GOVERNMENT OF INDIA / STATE LAND & REVENUE REGISTRATION
                          </div>
                          <div className="text-center font-semibold text-xs">
                            SUB-REGISTRAR OFFICE • DEED OF REGISTRATION & OCCUPANCY
                          </div>
                          <div className="pt-2 text-slate-800 leading-relaxed font-sans text-xs">
                            <p>
                              <strong>Document Title:</strong> {selectedDoc.title}
                            </p>
                            <p>
                              <strong>Executing Entity:</strong> {selectedDoc.institutionName}
                            </p>
                            <p>
                              <strong>Deed Reg No / Stamp No:</strong> {selectedDoc.extractedMetadata.deedRegistrationNo || "Unspecified"}
                            </p>
                            <p>
                              <strong>Survey Plot / Location:</strong> {selectedDoc.extractedMetadata.surveyPlotNo || "Sector / Revenue Survey Area"}
                            </p>
                            <p>
                              <strong>Certified Land Area:</strong> {selectedDoc.extractedMetadata.areaAcres ? `${selectedDoc.extractedMetadata.areaAcres} Acres` : "Field not detected"}
                            </p>
                            <p>
                              <strong>Issuing / Notarizing Authority:</strong> {selectedDoc.extractedMetadata.issuingAuthority || "Competent Authority"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* OCR Extracted Checklist Metadata */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Extracted Information vs. AICTE Norm Checklist
                        </h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Registration / Deed No</span>
                            <span className="font-mono font-bold text-slate-900">
                              {selectedDoc.extractedMetadata.deedRegistrationNo || "Missing"}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Extracted Land Area</span>
                            <span className={`font-mono font-bold ${
                              selectedDoc.extractedMetadata.areaAcres && selectedDoc.extractedMetadata.areaAcres < 5.0
                                ? "text-red-600"
                                : "text-emerald-700"
                            }`}>
                              {selectedDoc.extractedMetadata.areaAcres ? `${selectedDoc.extractedMetadata.areaAcres} Acres` : "N/A"}
                            </span>
                            {selectedDoc.extractedMetadata.areaAcres && selectedDoc.extractedMetadata.areaAcres < 5.0 && (
                              <span className="text-[9px] text-red-600 block mt-0.5">Norm: &ge; 5.0 Acres</span>
                            )}
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Expiry Date / Term</span>
                            <span className={`font-mono font-bold ${selectedDoc.isExpiringSoon ? "text-amber-700" : "text-slate-900"}`}>
                              {selectedDoc.expiryDate || "Perpetual / No Expiry"}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Notary / Official Seal</span>
                            <span className="font-semibold text-slate-900">
                              {selectedDoc.extractedMetadata.notarized ? "Verified Present" : "Missing / Unclear"}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Duplicate File Hash</span>
                            <span className="font-mono text-[10px] text-slate-700 truncate block">
                              Unique (No match)
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">OCR Confidence</span>
                            <span className="font-mono font-bold text-slate-900">
                              {selectedDoc.extractedMetadata.confidenceScore ? `${(selectedDoc.extractedMetadata.confidenceScore * 100).toFixed(0)}%` : "85%"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* OCR Potential Issues & Warnings */}
                      {selectedDoc.ocrFlags.length > 0 && (
                        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Potential Document Inconsistencies & Flags ({selectedDoc.ocrFlags.length})</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-amber-900">
                            {selectedDoc.ocrFlags.map((flag, idx) => (
                              <li key={idx} className="font-medium leading-relaxed">{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Official Verification History */}
                      {selectedDoc.verifiedBy && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                          <div className="font-bold text-slate-800">Officer Verification Record:</div>
                          <p className="text-slate-600">
                            Recorded by <strong>{selectedDoc.verifiedBy}</strong> on {selectedDoc.verifiedAt}
                          </p>
                          <p className="text-slate-700 italic">
                            &quot;{selectedDoc.verificationRemarks}&quot;
                          </p>
                        </div>
                      )}

                      {/* Human Scrutiny Officer Verification Workflow Controls */}
                      <div className="pt-4 border-t border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Record Official Scrutiny Decision
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Acting Role: {FlowGuardStore.getCurrentRole()}
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Officer Remarks / Deficiency Observation (Mandatory for Return or Rejection):
                          </label>
                          <textarea
                            rows={2}
                            value={verificationRemarks}
                            onChange={(e) => setVerificationRemarks(e.target.value)}
                            placeholder="Enter official scrutiny observation, land deed endorsement notes, or deficiency rationale..."
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => handleVerify('VERIFIED')}
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Verified Compliant</span>
                          </button>

                          <button
                            onClick={() => handleVerify('RETURNED')}
                            className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Return for Correction</span>
                          </button>

                          <button
                            onClick={() => handleVerify('REJECTED')}
                            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject Document</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center border border-slate-200 rounded-lg text-slate-500 text-xs">
                    Select a document from the queue to inspect OCR suggestions and record official verification.
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Upload Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Upload Institutional Document</span>
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Institution:</label>
                <select 
                  value={newInstId}
                  onChange={(e) => setNewInstId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded text-slate-800"
                >
                  <option value="inst-001">Veermata Jijabai Technological Institute (VJTI)</option>
                  <option value="inst-003">Oxford Institute of Technology & Management</option>
                  <option value="inst-004">Kalinga School of Pharmacy</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Category:</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                  className="w-full p-2 bg-slate-50 border rounded text-slate-800"
                >
                  <option value="Land Lease / Ownership Deed">Land Lease / Ownership Deed</option>
                  <option value="Building Plan & Occupancy Certificate">Building Plan & Occupancy Certificate</option>
                  <option value="Fire Safety NOC">Fire Safety NOC</option>
                  <option value="Faculty Cadre & AICTE Pay Scale Undertaking">Faculty Cadre & AICTE Pay Scale Undertaking</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title / File Name:</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Registered Land Lease Extension Deed Vol. 2"
                  className="w-full p-2 bg-slate-50 border rounded text-slate-800"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50 text-slate-600">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="font-bold text-slate-700">Select PDF or Scanned TIFF / JPEG</p>
                <p className="text-[10px] text-slate-400">Max size 25MB • Automated SHA-256 Hash Computed</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleSimulateUpload}
                disabled={simulatingOcr}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded shadow-xs"
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
