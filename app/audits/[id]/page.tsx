import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
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
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auditId = id ? decodeURIComponent(id) : "AUD-2024-002";
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Breadcrumbs & Actions */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Link href="/audits" className="text-sm text-primary flex items-center gap-1 hover:underline font-medium">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Institutional Audit Logs
                </Link>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold text-on-surface tracking-tight">{auditId}: Security Compliance</h1>
                  <Badge variant="warning" className="px-3 py-1">Flagged for Review</Badge>
                </div>
                <p className="text-on-surface-variant">Entity: Transportation Authority | Submitted: Oct 18, 2024</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Report PDF
                </Button>
                <Link href={`/advisor?query=${encodeURIComponent(`Provide a comprehensive remediation plan for audit ${auditId} regarding data security and telemetry vulnerabilities.`)}`}>
                  <Button className="flex items-center gap-1.5 cursor-pointer">
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
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-subtle">
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Audit Executive Summary
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    This audit evaluated the data encryption standards and access control protocols of the Transportation Authority&apos;s regional telemetry gateways. While primary firewall configurations are compliant, the audit flagged a critical vulnerability in the legacy multi-state synchronization module.
                  </p>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="bg-surface-container-low p-4 rounded-md">
                      <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Overall Score</p>
                      <p className="text-2xl font-bold text-primary mt-1">72 / 100</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-md">
                      <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Risk Assessment</p>
                      <p className="text-2xl font-bold text-error mt-1">High Priority</p>
                    </div>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-subtle">
                  <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
                    <h2 className="text-lg font-bold text-on-surface">Verification Checklist</h2>
                  </div>
                  <div className="divide-y divide-outline-variant/50">
                    {[
                      { item: "Data-at-rest encryption protocols", status: "Verified", icon: CheckCircle2, color: "text-green-500" },
                      { item: "Multi-factor authentication (MFA) enforcement", status: "Verified", icon: CheckCircle2, color: "text-green-500" },
                      { item: "Legacy API Gateway Security", status: "Flagged", icon: AlertCircle, color: "text-error" },
                      { item: "Audit Log retention policies", status: "Verified", icon: CheckCircle2, color: "text-green-500" },
                      { item: "Third-party vendor access controls", status: "Pending", icon: Clock, color: "text-outline" },
                    ].map((check, i) => (
                      <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-3">
                          <check.icon className={check.color + " w-5 h-5"} />
                          <span className="text-sm font-medium text-on-surface">{check.item}</span>
                        </div>
                        <Badge variant={check.status === "Verified" ? "success" : check.status === "Flagged" ? "error" : "neutral"}>
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Timeline & Meta */}
              <div className="space-y-8">
                {/* Audit Timeline */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-subtle">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-6 flex items-center gap-2">
                    <HistoryIcon className="w-4 h-4 text-primary" />
                    Review Timeline
                  </h3>
                  <div className="space-y-6">
                    {[
                      { event: "Audit Initiated", date: "Oct 12, 10:24 AM", user: "System", active: false },
                      { event: "Evidence Submission", date: "Oct 14, 02:45 PM", user: "TA Admin", active: false },
                      { event: "Automated Scan Complete", date: "Oct 14, 03:00 PM", user: "Governance AI", active: false },
                      { event: "Manual Review Started", date: "Oct 16, 09:00 AM", user: "S. Jenkins", active: false },
                      { event: "Flagged: Legacy API", date: "Oct 18, 11:30 AM", user: "S. Jenkins", active: true },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== 4 && <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+12px)] bg-outline-variant/30"></div>}
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
                          step.active ? "bg-primary border-primary" : "bg-white border-outline-variant"
                        )}>
                          {step.active && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div className="flex-1 -mt-1">
                          <p className={cn("text-xs font-bold", step.active ? "text-primary" : "text-on-surface")}>{step.event}</p>
                          <p className="text-[10px] text-on-surface-variant">{step.date} • {step.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authority Info */}
                <div className="bg-primary text-white rounded-lg p-6 shadow-lg shadow-primary/20">
                  <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
                  <h3 className="font-bold text-lg leading-tight">Institutional Authority</h3>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    This audit is conducted under Regulatory Protocol 42-B. All findings are binding for the fiscal year 2024-2025.
                  </p>
                  <Button variant="ghost" className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
                    View Legal Context
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
