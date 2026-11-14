import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { History, GitCommit, ArrowDownToLine } from "lucide-react";
import Link from "next/link";

const REVISIONS = [
  {
    rev: "REV-2026.10-09",
    action: "Remediation Policy Approved",
    entity: "Public Health Dept",
    user: "Sarah Jenkins (CCO)",
    date: "Oct 28, 2026 09:15 AM",
    type: "Approval",
  },
  {
    rev: "REV-2026.10-08",
    action: "Telemetry Port Vulnerability Logged",
    entity: "Transportation Authority",
    user: "Marcus Chen",
    date: "Oct 27, 2026 04:30 PM",
    type: "Security",
  },
  {
    rev: "REV-2026.10-07",
    action: "Environmental Certificate Filed",
    entity: "Water Utility",
    user: "David Thorne",
    date: "Oct 26, 2026 11:20 AM",
    type: "Certification",
  },
  {
    rev: "REV-2026.10-06",
    action: "Audit Criteria Updated (v4.2)",
    entity: "Comptroller Division",
    user: "Elena Rodriguez",
    date: "Oct 25, 2026 02:40 PM",
    type: "Governance",
  },
  {
    rev: "REV-2026.10-05",
    action: "Data Privacy Exemption Revoked",
    entity: "Social Services",
    user: "Sarah Jenkins (CCO)",
    date: "Oct 24, 2026 10:00 AM",
    type: "Compliance",
  },
];

export default function HistoryPage() {
  return (
    <div className="flex h-screen bg-[#F3EBDD] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoGuideBar />
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#F3EBDD] bg-editorial-glow flex flex-col">
          <div className="flex-1 p-5 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DDCB] pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#B7C9A8]/45 text-[#263B32] px-2.5 py-0.5 rounded border border-[#B7C9A8]">
                      Ledger Provenance
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Revision Stream</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight">
                    Institutional Revision History
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-1">
                    Cryptographic immutable audit trail of policy updates, status changes, and sign-offs.
                  </p>
                </div>
                <Link href="/audit-trail">
                  <Button variant="secondary">
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Export Ledger
                  </Button>
                </Link>
              </div>

              <div className="surface-card overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D5DDCB] bg-[#EAE2D2]/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-[#2A6557]" />
                    <h2 className="font-display text-lg font-bold text-[#263B32]">
                      Compliance Ledger Events
                    </h2>
                  </div>
                  <span className="text-xs text-[#263B32] bg-[#FAF8F1] px-2.5 py-1 rounded border border-[#D5DDCB] font-mono">
                    Chain ID: CIVIC-LEDGER-MAINNET-01
                  </span>
                </div>

                <div className="divide-y divide-[#D5DDCB]/60">
                  {REVISIONS.map((item, idx) => (
                    <div
                      key={item.rev}
                      className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#8FCDBB]/15 transition-colors ${
                        idx % 2 === 1 ? "bg-[#F3EBDD]/40" : "bg-[#FAF8F1]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-[#EAE2D2] border border-[#D5DDCB] rounded-lg shrink-0">
                          <GitCommit className="w-4 h-4 text-[#263B32]" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#2A6557]">
                              {item.rev}
                            </span>
                            <span className="text-sm font-semibold text-[#263B32]">
                              {item.action}
                            </span>
                          </div>
                          <p className="text-xs text-[#68776A] mt-0.5">
                            {item.entity} • Signed by{" "}
                            <span className="font-semibold text-[#263B32]">{item.user}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <Badge variant="neutral">{item.type}</Badge>
                        <span className="text-xs text-[#68776A] tabular-nums font-mono">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
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
