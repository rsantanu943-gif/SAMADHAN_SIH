"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { FlowGuardStore, DEFAULT_ENGINE_SETTINGS } from "@/lib/flowguard-store";
import { EngineSettings } from "@/lib/types";
import { Bell, Key, Save, CheckCircle2, Sliders, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<EngineSettings>(DEFAULT_ENGINE_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setSettings(FlowGuardStore.getSettings());
    queueMicrotask(sync);
    return FlowGuardStore.subscribe(sync);
  }, []);

  const handleSave = () => {
    FlowGuardStore.saveSettings(settings);
    setSavedSuccess("Configuration changes saved and synchronized with Samadhan360 Engine.");
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  const handleReset = () => {
    const defaults = FlowGuardStore.resetSettings();
    setSettings(defaults);
    setSavedSuccess("Configuration restored to baseline statutory defaults.");
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-[#B7C9A8]/45 text-[#263B32] px-2.5 py-0.5 rounded border border-[#B7C9A8]">
                      System Administration
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">
                      Backend Engine Configuration
                    </span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight mt-1.5">
                    Samadhan360 Settings
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-0.5">
                    Configure statutory deadline reminder intervals, OCR tolerance thresholds, and multi-tier escalation channels.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-2 bg-[#FAF8F1] hover:bg-[#EAE2D2] text-[#263B32] border border-[#D5DDCB] font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#68776A]" />
                    <span>Restore Defaults</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4 text-[#8FCDBB]" />
                    <span>Save Configuration</span>
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3.5 bg-[#8FCDBB]/30 border border-[#8FCDBB] text-[#263B32] rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2A6557] shrink-0" />
                  <span>{savedSuccess}</span>
                </div>
              )}

              {/* Config Sections */}
              <div className="space-y-6 text-xs">
                {/* Deadline & Escalation Parameters */}
                <div className="surface-card p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#D5DDCB] pb-3">
                    <Bell className="w-5 h-5 text-[#2A6557]" />
                    <h2 className="text-sm font-bold text-[#263B32] uppercase tracking-wider">
                      Smart Deadline Risk Radar Parameters
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="advance-warning-days" className="font-semibold text-[#263B32] block mb-1.5">
                        Advance Warning Notice:
                      </label>
                      <input
                        id="advance-warning-days"
                        type="number"
                        min={1}
                        max={365}
                        value={settings.advanceWarningDays}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            advanceWarningDays: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                        className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] font-mono font-bold focus:outline-none focus:border-[#8FCDBB]"
                      />
                      <span className="text-[10px] text-[#68776A] mt-1 block">
                        Days prior to document expiry
                      </span>
                    </div>

                    <div>
                      <label htmlFor="high-risk-days" className="font-semibold text-[#263B32] block mb-1.5">
                        High Risk Threshold:
                      </label>
                      <input
                        id="high-risk-days"
                        type="number"
                        min={1}
                        max={60}
                        value={settings.highRiskThresholdDays}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            highRiskThresholdDays: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                        className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] font-mono font-bold focus:outline-none focus:border-[#8FCDBB]"
                      />
                      <span className="text-[10px] text-[#68776A] mt-1 block">
                        Days prior to scrutiny expiry
                      </span>
                    </div>

                    <div>
                      <label htmlFor="inactivity-alert-days" className="font-semibold text-[#263B32] block mb-1.5">
                        Inactive Inactivity Alert:
                      </label>
                      <input
                        id="inactivity-alert-days"
                        type="number"
                        min={1}
                        max={60}
                        value={settings.inactivityAlertDays}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            inactivityAlertDays: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                        className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] font-mono font-bold focus:outline-none focus:border-[#8FCDBB]"
                      />
                      <span className="text-[10px] text-[#68776A] mt-1 block">
                        Days without committee action
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#263B32]">
                      <input
                        type="checkbox"
                        checked={settings.autoEscalateOverdue48h}
                        onChange={(e) =>
                          setSettings((s) => ({ ...s, autoEscalateOverdue48h: e.target.checked }))
                        }
                        className="rounded border-[#D5DDCB] text-[#263B32] accent-[#263B32]"
                      />
                      <span>
                        Auto-escalate cases to Regional Officer when stage is overdue &gt; 48 hours
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#263B32]">
                      <input
                        type="checkbox"
                        checked={settings.sendSmsDeficiencyAlert}
                        onChange={(e) =>
                          setSettings((s) => ({ ...s, sendSmsDeficiencyAlert: e.target.checked }))
                        }
                        className="rounded border-[#D5DDCB] text-[#263B32] accent-[#263B32]"
                      />
                      <span>
                        Send SMS alert to Institution Principal upon Deficiency Notice release
                      </span>
                    </label>
                  </div>
                </div>

                {/* Smart Document Checker Settings */}
                <div className="surface-card p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#D5DDCB] pb-3">
                    <Sliders className="w-5 h-5 text-[#2A6557]" />
                    <h2 className="text-sm font-bold text-[#263B32] uppercase tracking-wider">
                      Smart Document Checker &amp; OCR Sensitivity
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="min-ocr-score" className="font-semibold text-[#263B32] block mb-1.5">
                        Minimum OCR Confidence Score (%):
                      </label>
                      <input
                        id="min-ocr-score"
                        type="number"
                        min={10}
                        max={100}
                        value={settings.minOcrConfidencePercent}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            minOcrConfidencePercent: Math.min(
                              100,
                              Math.max(10, Number(e.target.value) || 50)
                            ),
                          }))
                        }
                        className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] font-mono font-bold focus:outline-none focus:border-[#8FCDBB]"
                      />
                      <span className="text-[10px] text-[#68776A] mt-1 block">
                        Below threshold flags for manual scrutiny
                      </span>
                    </div>

                    <div>
                      <label htmlFor="duplicate-hash-mode" className="font-semibold text-[#263B32] block mb-1.5">
                        Duplicate File Hash Surveillance:
                      </label>
                      <select
                        id="duplicate-hash-mode"
                        value={settings.duplicateHashMode}
                        onChange={(e) =>
                          setSettings((s) => ({
                            ...s,
                            duplicateHashMode: e.target.value as EngineSettings["duplicateHashMode"],
                          }))
                        }
                        className="w-full p-2.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-[#263B32] font-semibold focus:outline-none focus:border-[#8FCDBB]"
                      >
                        <option value="STRICT_CROSS_REGIONAL">
                          SHA-256 Cross-Regional Matching (Strict)
                        </option>
                        <option value="INTRA_STATE_ONLY">Intra-State Matching Only</option>
                      </select>
                      <span className="text-[10px] text-[#68776A] mt-1 block">
                        Detects identical deeds uploaded in multiple cases
                      </span>
                    </div>
                  </div>
                </div>

                {/* RBAC Security & Safeguards */}
                <div className="surface-card p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#D5DDCB] pb-3">
                    <Key className="w-5 h-5 text-[#2A6557]" />
                    <h2 className="text-sm font-bold text-[#263B32] uppercase tracking-wider">
                      Role-Based Access Control &amp; Security Policies
                    </h2>
                  </div>

                  <p className="text-[#576659] leading-relaxed">
                    Institutional Administrators are strictly restricted to their authorized permanent ID. Scrutiny and Regional Officers operate within assigned regional boundaries. Direct URL bypasses and client-side privilege escalation are prohibited at the backend gateway.
                  </p>

                  <div className="p-3.5 bg-[#F3EBDD] rounded-lg border border-[#D5DDCB] flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[#263B32]">Admin Email Allowlist:</span>
                    <span className="font-mono text-[#2A6557] font-semibold">
                      Enabled (*@aicte-india.org, rsantanu943@gmail.com)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
