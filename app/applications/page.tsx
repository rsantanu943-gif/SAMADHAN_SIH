"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import {
  FlowGuardStore,
  INITIAL_APPLICATIONS,
  INITIAL_INSTITUTIONS,
} from "@/lib/flowguard-store";
import { Application, Institution, Region, WorkflowRoute } from "@/lib/types";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Plus,
  X,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

function ApplicationsListContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [apps, setApps] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [stageFilter, setStageFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchQuery(urlSearch);
  }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstId, setSelectedInstId] = useState(INITIAL_INSTITUTIONS[0]?.id || "");
  const [category, setCategory] = useState("Extension of Approval (EoA) + Intake Increase");
  const [region, setRegion] = useState<Region>("Western");
  const [workflowTemplate, setWorkflowTemplate] = useState<WorkflowRoute>(
    "Standard (Scrutiny + EVC + SAC)"
  );
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    const sync = () => {
      setApps(FlowGuardStore.getApplications());
      setInstitutions(FlowGuardStore.getInstitutions());
    };
    sync();
    return FlowGuardStore.subscribe(sync);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen]);

  const filtered = apps.filter((app) => {
    if (stageFilter !== "All" && app.currentStage !== stageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const inst = institutions.find((i) => i.id === app.institutionId);
      const matches =
        app.applicationNumber.toLowerCase().includes(q) ||
        app.institutionName.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.region.toLowerCase().includes(q) ||
        app.institutionId.toLowerCase().includes(q) ||
        (inst?.permanentId.toLowerCase().includes(q) ?? false);
      if (!matches) return false;
    }
    return true;
  });

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = institutions.find((i) => i.id === selectedInstId) || institutions[0];

    const newApp = FlowGuardStore.createApplication({
      institutionId: inst.id,
      institutionName: inst.name,
      region: region,
      category: category,
      workflowTemplate: workflowTemplate,
    });

    setApps(FlowGuardStore.getApplications());
    setIsModalOpen(false);
    setSuccessToast(`Application ${newApp.applicationNumber} created successfully!`);
    setTimeout(() => setSuccessToast(""), 5000);
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
              {successToast && (
                <div className="bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] text-xs font-bold p-4 rounded-xl flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557]" />
                  <span>{successToast}</span>
                </div>
              )}

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#B7C9A8]/45 text-[#263B32] px-2.5 py-0.5 rounded border border-[#B7C9A8]">
                      Approval Workflow Engine
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Academic Year 2026–27</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Applications Management
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Comprehensive approval lifecycle tracking from scrutiny to EVC, SAC appellate, and final Letter of Approval.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#8FCDBB] hover:bg-[#7DC2AE] text-[#263B32] border border-[#72B7A3] rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lodge Complaint / Application</span>
                  </button>
                  <Link
                    href="/workflow"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs transition-all"
                  >
                    <Workflow className="w-3.5 h-3.5 text-[#8FCDBB]" />
                    <span>Visual Workflow Monitor</span>
                  </Link>
                </div>
              </div>

              {/* Filters */}
              <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex items-center flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-[#68776A] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Application Number, Permanent ID (1-4029102), or Institution..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] pl-9 pr-8 py-2 rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear filter search"
                      className="absolute right-2.5 text-[#68776A] hover:text-[#263B32] p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-[#F3EBDD] border border-[#D5DDCB] px-3 py-2 rounded-lg font-medium text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                  >
                    <option value="All">All Stages</option>
                    <option value="Submission">Submission</option>
                    <option value="Scrutiny">Scrutiny</option>
                    <option value="Deficiencies">Deficiencies</option>
                    <option value="EVC Scheduling">EVC Scheduling</option>
                    <option value="EVC Inspection">EVC Inspection</option>
                    <option value="SAC/SHC Review">SAC/SHC Review</option>
                    <option value="Final Approval">Final Approval</option>
                  </select>
                </div>
              </div>

              {/* Application Records Table */}
              <div className="surface-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-[#EAE2D2]/80 border-b border-[#D5DDCB] text-[#68776A] font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3.5">Application ID</th>
                        <th className="px-4 py-3.5">Institution</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Current Stage</th>
                        <th className="px-4 py-3.5">Deadline</th>
                        <th className="px-4 py-3.5">Risk Level</th>
                        <th className="px-4 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DDCB]/60">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-10 text-center text-[#68776A]">
                            <p className="mb-3">No applications match your current search or stage filter.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery("");
                                setStageFilter("All");
                              }}
                              className="px-3.5 py-1.5 text-xs font-bold bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] rounded-lg cursor-pointer"
                            >
                              Reset Filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((app, idx) => (
                          <tr
                            key={app.id}
                            className={`hover:bg-[#8FCDBB]/15 transition-colors ${
                              idx % 2 === 1 ? "bg-[#F3EBDD]/45" : "bg-[#FAF8F1]"
                            }`}
                          >
                            <td className="px-4 py-3.5 font-mono font-bold text-[#263B32]">
                              {app.applicationNumber}
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-[#263B32] max-w-xs truncate">
                              {app.institutionName}
                            </td>
                            <td className="px-4 py-3.5 text-[#68776A] max-w-xs truncate">{app.category}</td>
                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-[#263B32] bg-[#EAE2D2] border border-[#D5DDCB] px-2.5 py-0.5 rounded text-[11px]">
                                {app.currentStage}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-[#263B32] tabular-nums">{app.deadline}</td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                  app.riskLevel === "Overdue"
                                    ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                                    : app.riskLevel === "High Risk"
                                    ? "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]"
                                    : app.riskLevel === "Attention Required"
                                    ? "bg-[#B7C9A8]/45 text-[#263B32] border-[#B7C9A8]"
                                    : "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                                }`}
                              >
                                {app.riskLevel}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Link
                                href={`/applications/${app.id}`}
                                className="inline-flex items-center gap-1 font-bold text-[#2A6557] hover:text-[#263B32]"
                              >
                                <span>Open</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* Modal for Lodging New Complaint / Application */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#263B32]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F1] rounded-2xl border border-[#D5DDCB] shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#D5DDCB] bg-[#EAE2D2]/60">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2A6557]" />
                <h3 className="font-display font-bold text-[#263B32] text-base">
                  Lodge New Application / Complaint
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="text-[#68776A] hover:text-[#263B32] p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263B32] mb-1">Select Institution</label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] p-2.5 rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.permanentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263B32] mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] p-2.5 rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                >
                  <option value="Western">Western</option>
                  <option value="Northern">Northern</option>
                  <option value="Southern">Southern</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Central">Central</option>
                  <option value="South-Western">South-Western</option>
                  <option value="North-Western">North-Western</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263B32] mb-1">
                  Application / Complaint Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Extension of Approval, Deficiency Rectification..."
                  required
                  className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] p-2.5 rounded-lg text-[#263B32] placeholder:text-[#68776A] focus:outline-none focus:border-[#8FCDBB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263B32] mb-1">Workflow Route</label>
                <select
                  value={workflowTemplate}
                  onChange={(e) => setWorkflowTemplate(e.target.value as WorkflowRoute)}
                  className="w-full text-xs bg-[#F3EBDD] border border-[#D5DDCB] p-2.5 rounded-lg text-[#263B32] focus:outline-none focus:border-[#8FCDBB]"
                >
                  <option value="Standard (Scrutiny + EVC + SAC)">Standard (Scrutiny + EVC + SAC)</option>
                  <option value="Only Scrutiny (Extension of Approval - EoA)">
                    Only Scrutiny (Extension of Approval - EoA)
                  </option>
                  <option value="Only EVC (Special Inspection)">Only EVC (Special Inspection)</option>
                  <option value="EVC + SAC/SHC">EVC + SAC/SHC</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#D5DDCB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#68776A] hover:text-[#263B32] border border-[#D5DDCB] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] rounded-lg shadow-xs cursor-pointer"
                >
                  Submit &amp; Lodge Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-[#F3EBDD] items-center justify-center text-xs text-[#68776A]">
          Loading Applications Registry...
        </div>
      }
    >
      <ApplicationsListContent />
    </Suspense>
  );
}
