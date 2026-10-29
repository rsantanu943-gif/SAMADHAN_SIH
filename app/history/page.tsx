import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { History, GitCommit, FileCheck, ShieldAlert, ArrowDownToLine } from "lucide-react";

const REVISIONS = [
  { rev: "REV-2026.10-09", action: "Remediation Policy Approved", entity: "Public Health Dept", user: "Sarah Jenkins (CCO)", date: "Oct 28, 2026 09:15 AM", type: "Approval" },
  { rev: "REV-2026.10-08", action: "Telemetry Port Vulnerability Logged", entity: "Transportation Authority", user: "Marcus Chen", date: "Oct 27, 2026 04:30 PM", type: "Security" },
  { rev: "REV-2026.10-07", action: "Environmental Certificate Filed", entity: "Water Utility", user: "David Thorne", date: "Oct 26, 2026 11:20 AM", type: "Certification" },
  { rev: "REV-2026.10-06", action: "Audit Criteria Updated (v4.2)", entity: "Comptroller Division", user: "Elena Rodriguez", date: "Oct 25, 2026 02:40 PM", type: "Governance" },
  { rev: "REV-2026.10-05", action: "Data Privacy Exemption Revoked", entity: "Social Services", user: "Sarah Jenkins (CCO)", date: "Oct 24, 2026 10:00 AM", type: "Compliance" },
];

export default function HistoryPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-on-surface tracking-tight">Institutional Revision History</h1>
                <p className="text-on-surface-variant mt-1">Cryptographic immutable audit trail of policy updates, status changes, and sign-offs.</p>
              </div>
              <Button variant="secondary">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Export Ledger
              </Button>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-subtle">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-on-surface">Compliance Ledger Events</h2>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">Chain ID: CIVIC-LEDGER-MAINNET-01</span>
              </div>

              <div className="divide-y divide-outline-variant/50">
                {REVISIONS.map((item) => (
                  <div key={item.rev} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-surface-container rounded-md">
                        <GitCommit className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-primary">{item.rev}</span>
                          <span className="text-sm font-semibold text-on-surface">{item.action}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {item.entity} • Signed by <span className="font-medium text-on-surface">{item.user}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="neutral">{item.type}</Badge>
                      <span className="text-xs text-on-surface-variant tabular-nums font-mono">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
