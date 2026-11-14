import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { getAuditRecordById } from "@/lib/compliance";
import {
  ChevronLeft,
  Download,
  Share2,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  History as HistoryIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auditId = id ? decodeURIComponent(id) : "AUD-2024-002";
  const record = getAuditRecordById(auditId);

  if (!record) {
    return (
      <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DemoGuideBar />
          <Header />
          <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
            <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
              <div className="surface-card p-8 max-w-md w-full text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-[#8C2D25] mx-auto" />
                <h1 className="font-display text-2xl font-bold text-[#263B32]">
                  Audit Record Not Found
                </h1>
                <p className="text-xs text-[#68776A] leading-relaxed">
                  No statutory audit dossier matches reference ID <span className="font-mono font-bold text-[#263B32]">{auditId}</span>.
                </p>
                <Link href="/audits" className="inline-block">
                  <Button>Back to Institutional Audits</Button>
                </Link>
              </div>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    );
  }

  const badgeVariant =
    record.status === "Verified"
      ? "success"
      : record.status === "Flagged"
      ? "warning"
      : record.status === "Non-Compliant"
      ? "error"
      : "neutral";

  const riskLabel =
    record.score >= 90
      ? "Low Risk"
      : record.score >= 75
      ? "Moderate Priority"
      : "High Priority";

  const isLowScore = record.score < 75;

  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Breadcrumbs & Actions */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div className="space-y-2">
                  <Link
                    href="/audits"
                    className="text-xs text-[#2A6557] flex items-center gap-1 hover:underline font-bold uppercase tracking-wider"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Institutional Audit Logs
                  </Link>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight">
                      {record.id}: {record.type}
                    </h1>
                    <Badge variant={badgeVariant} className="px-3 py-1">
                      {record.status}
                    </Badge>
                  </div>
                  <p className="text-xs lg:text-sm text-[#68776A]">
                    Entity: {record.entity} <span className="mx-1.5 text-[#D5DDCB]">•</span> Submitted: {record.date}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/notifications">
                    <Button variant="secondary">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </Link>
                  <Link href="/reports">
                    <Button variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Report PDF
                    </Button>
                  </Link>
                  <Link
                    href={`/advisor?query=${encodeURIComponent(
                      `Provide a comprehensive remediation plan for audit ${record.id} (${record.entity}) regarding ${record.type} (Score ${record.score}%).`
                    )}`}
                  >
                    <Button className="flex items-center gap-1.5 cursor-pointer bg-[#8FCDBB] text-[#263B32] hover:bg-[#7DC2AE] border border-[#72B7A3]">
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Remediation Analysis
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Executive Summary */}
                  <div className="surface-card p-6">
                    <h2 className="font-display text-lg font-bold text-[#263B32] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#2A6557]" />
                      Audit Executive Summary
                    </h2>
                    <p className="text-sm text-[#263B32]/85 leading-relaxed">
                      {record.summary}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                      <div className="bg-[#F3EBDD] border border-[#D5DDCB] p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-[#68776A] uppercase tracking-wider">
                          Overall Score
                        </p>
                        <p className="font-display text-2xl font-bold text-[#263B32] mt-1 tabular-nums">
                          {record.score} / 100
                        </p>
                      </div>
                      <div
                        className={cn(
                          "p-4 rounded-xl border",
                          isLowScore
                            ? "bg-[#F5DDD9]/60 border-[#E5B8B0]"
                            : "bg-[#B7C9A8]/25 border-[#B7C9A8]"
                        )}
                      >
                        <p
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            isLowScore ? "text-[#8C2D25]" : "text-[#2A6557]"
                          )}
                        >
                          Risk Assessment
                        </p>
                        <p
                          className={cn(
                            "font-display text-2xl font-bold mt-1",
                            isLowScore ? "text-[#8C2D25]" : "text-[#263B32]"
                          )}
                        >
                          {riskLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Audit Checklist */}
                  <div className="surface-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#D5DDCB] bg-[#EAE2D2]/60">
                      <h2 className="font-display text-lg font-bold text-[#263B32]">
                        Verification Checklist
                      </h2>
                    </div>
                    <div className="divide-y divide-[#D5DDCB]/60">
                      {[
                        {
                          item: "Data-at-rest encryption protocols",
                          status: "Verified",
                          icon: CheckCircle2,
                          color: "text-[#2A6557]",
                        },
                        {
                          item: "Multi-factor authentication (MFA) enforcement",
                          status: "Verified",
                          icon: CheckCircle2,
                          color: "text-[#2A6557]",
                        },
                        {
                          item: "Legacy API Gateway Security",
                          status: "Flagged",
                          icon: AlertCircle,
                          color: "text-[#8C2D25]",
                        },
                        {
                          item: "Audit Log retention policies",
                          status: "Verified",
                          icon: CheckCircle2,
                          color: "text-[#2A6557]",
                        },
                        {
                          item: "Third-party vendor access controls",
                          status: "Pending",
                          icon: Clock,
                          color: "text-[#68776A]",
                        },
                      ].map((check, i) => (
                        <div
                          key={i}
                          className={cn(
                            "px-6 py-4 flex items-center justify-between hover:bg-[#8FCDBB]/15 transition-colors",
                            i % 2 === 1 ? "bg-[#F3EBDD]/40" : "bg-[#FAF8F1]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <check.icon className={cn(check.color, "w-5 h-5 shrink-0")} />
                            <span className="text-sm font-medium text-[#263B32]">{check.item}</span>
                          </div>
                          <Badge
                            variant={
                              check.status === "Verified"
                                ? "success"
                                : check.status === "Flagged"
                                ? "error"
                                : "neutral"
                            }
                          >
                            {check.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Timeline & Meta */}
                <div className="space-y-6">
                  {/* Audit Timeline */}
                  <div className="surface-card p-6">
                    <h3 className="text-xs font-bold text-[#263B32] uppercase tracking-widest mb-6 flex items-center gap-2">
                      <HistoryIcon className="w-4 h-4 text-[#2A6557]" />
                      Review Timeline
                    </h3>
                    <div className="space-y-6">
                      {[
                        { event: "Audit Initiated", date: "Oct 12, 10:24 AM", user: "System", active: false },
                        { event: "Evidence Submission", date: "Oct 14, 02:45 PM", user: "TA Admin", active: false },
                        {
                          event: "Automated Scan Complete",
                          date: "Oct 14, 03:00 PM",
                          user: "Governance AI",
                          active: false,
                        },
                        { event: "Manual Review Started", date: "Oct 16, 09:00 AM", user: "S. Jenkins", active: false },
                        { event: "Flagged: Legacy API", date: "Oct 18, 11:30 AM", user: "S. Jenkins", active: true },
                      ].map((step, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {i !== 4 && (
                            <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+12px)] bg-[#D5DDCB]"></div>
                          )}
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
                              step.active
                                ? "bg-[#263B32] border-[#8FCDBB]"
                                : "bg-[#FAF8F1] border-[#B7C9A8]"
                            )}
                          >
                            {step.active && <div className="w-2 h-2 bg-[#8FCDBB] rounded-full"></div>}
                          </div>
                          <div className="flex-1 -mt-0.5">
                            <p
                              className={cn(
                                "text-xs font-bold",
                                step.active ? "text-[#263B32]" : "text-[#263B32]/85"
                              )}
                            >
                              {step.event}
                            </p>
                            <p className="text-[11px] text-[#68776A] mt-0.5">
                              {step.date} • {step.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Authority Info */}
                  <div className="bg-[#263B32] text-[#F3EBDD] rounded-xl p-6 border border-[#8FCDBB]/30 shadow-md">
                    <ShieldCheck className="w-8 h-8 mb-4 text-[#8FCDBB]" />
                    <h3 className="font-display font-bold text-lg text-[#FAF8F1] leading-tight">
                      Institutional Authority
                    </h3>
                    <p className="text-xs text-[#EAE2D2]/85 mt-2 leading-relaxed">
                      This audit is conducted under Regulatory Protocol 42-B. All findings are binding for the fiscal year 2024–2025.
                    </p>
                    <Link href="/help" className="block mt-4">
                      <Button
                        variant="ghost"
                        className="w-full bg-[#8FCDBB]/15 hover:bg-[#8FCDBB]/25 text-[#FAF8F1] border border-[#8FCDBB]/30 text-xs"
                      >
                        View Legal Context
                      </Button>
                    </Link>
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
