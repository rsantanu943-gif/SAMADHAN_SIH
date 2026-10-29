"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Settings, Shield, Bell, Key, Save, CheckCircle2, Sliders } from "lucide-react";

export default function SettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                    System Administration
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Backend Engine Configuration</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Samadhan360 Settings
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 mt-0.5">
                  Configure statutory deadline reminder intervals, OCR tolerance thresholds, and multi-tier escalation channels.
                </p>
              </div>

              <div>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configuration changes saved and synchronized with Samadhan360 Engine.</span>
              </div>
            )}

            {/* Config Sections */}
            <div className="space-y-6 text-xs">
              
              {/* Deadline & Escalation Parameters */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Smart Deadline Risk Radar Parameters
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Advance Warning Notice:</label>
                    <input 
                      type="number" 
                      defaultValue={30} 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Days prior to document expiry</span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">High Risk Threshold:</label>
                    <input 
                      type="number" 
                      defaultValue={3} 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Days prior to scrutiny expiry</span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Inactive Inactivity Alert:</label>
                    <input 
                      type="number" 
                      defaultValue={5} 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Days without committee action</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-600" />
                    <span>Auto-escalate cases to Regional Officer when stage is overdue &gt; 48 hours</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-600" />
                    <span>Send SMS alert to Institution Principal upon Deficiency Notice release</span>
                  </label>
                </div>
              </div>

              {/* Smart Document Checker Settings */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Smart Document Checker & OCR Sensitivity
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Minimum OCR Confidence Score:</label>
                    <input 
                      type="text" 
                      defaultValue="70%" 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Below threshold flags for manual scrutiny</span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Duplicate File Hash Surveillance:</label>
                    <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-semibold">
                      <option>SHA-256 Cross-Regional Matching (Strict)</option>
                      <option>Intra-State Matching Only</option>
                    </select>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Detects identical deeds uploaded in multiple cases</span>
                  </div>
                </div>
              </div>

              {/* RBAC Security & Safeguards */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Key className="w-5 h-5 text-amber-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Role-Based Access Control & Security Policies
                  </h2>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Institutional Administrators are strictly restricted to their authorized permanent ID. Scrutiny and Regional Officers operate within assigned regional boundaries. Direct URL bypasses and client-side privilege escalation are prohibited at the backend gateway.
                </p>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Admin Email Allowlist:</span>
                  <span className="font-mono text-slate-600 font-semibold">Enabled (*@aicte-india.org, rsantanu943@gmail.com)</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
