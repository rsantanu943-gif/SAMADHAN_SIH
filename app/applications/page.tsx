"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { FlowGuardStore } from "@/lib/flowguard-store";
import { Application, Region, WorkflowRoute } from "@/lib/types";
import { 
  FolderGit2, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Building2,
  Workflow,
  Plus,
  X,
  FileCheck
} from "lucide-react";
import Link from "next/link";

export default function ApplicationsListPage() {
  const [apps, setApps] = useState<Application[]>(() => FlowGuardStore.getApplications());
  const [stageFilter, setStageFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [institutions] = useState(() => FlowGuardStore.getInstitutions());
  const [selectedInstId, setSelectedInstId] = useState(institutions[0]?.id || "");
  const [category, setCategory] = useState("Extension of Approval (EoA) + Intake Increase");
  const [region, setRegion] = useState<Region>("Western");
  const [workflowTemplate, setWorkflowTemplate] = useState<WorkflowRoute>("Standard (Scrutiny + EVC + SAC)");
  const [successToast, setSuccessToast] = useState("");

  const filtered = apps.filter((app) => {
    if (stageFilter !== "All" && app.currentStage !== stageFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!app.applicationNumber.toLowerCase().includes(q) && !app.institutionName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = institutions.find(i => i.id === selectedInstId) || institutions[0];
    
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {successToast && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-lg flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                    Approval Workflow Engine
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Academic Year 2026-27</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Applications Management
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Comprehensive approval lifecycle tracking from scrutiny to EVC, SAC appellate, and final Letter of Approval.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Lodge Complaint / Application</span>
                </button>
                <Link
                  href="/workflow"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-md shadow-xs transition-all"
                >
                  <Workflow className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visual Workflow Monitor</span>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Application Number (e.g. APP-2026-102) or Institution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded font-medium text-slate-700"
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
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Application ID</th>
                      <th className="px-4 py-3">Institution</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Current Stage</th>
                      <th className="px-4 py-3">Deadline</th>
                      <th className="px-4 py-3">Risk Level</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-amber-900">
                          {app.applicationNumber}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                          {app.institutionName}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {app.category}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {app.currentStage}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {app.deadline}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            app.riskLevel === "Overdue" ? "bg-red-100 text-red-800" :
                            app.riskLevel === "High Risk" ? "bg-amber-100 text-amber-800" :
                            app.riskLevel === "Attention Required" ? "bg-yellow-100 text-yellow-800" :
                            "bg-emerald-100 text-emerald-800"
                          }`}>
                            {app.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/applications/${app.id}`}
                            className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-900"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modal for Lodging New Complaint / Application */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Lodge New Application / Complaint</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Institution</label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded text-slate-800 focus:ring-1 focus:ring-amber-500"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.permanentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded text-slate-800 focus:ring-1 focus:ring-amber-500"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Application / Complaint Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Extension of Approval, Deficiency Rectification..."
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded text-slate-800 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Workflow Route</label>
                <select
                  value={workflowTemplate}
                  onChange={(e) => setWorkflowTemplate(e.target.value as WorkflowRoute)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded text-slate-800 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Standard (Scrutiny + EVC + SAC)">Standard (Scrutiny + EVC + SAC)</option>
                  <option value="Only Scrutiny (Extension of Approval - EoA)">Only Scrutiny (Extension of Approval - EoA)</option>
                  <option value="Only EVC (Special Inspection)">Only EVC (Special Inspection)</option>
                  <option value="EVC + SAC/SHC">EVC + SAC/SHC</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded shadow-xs"
                >
                  Submit & Lodge Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

