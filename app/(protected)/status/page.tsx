import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Filter, Download } from "lucide-react";

const JURISDICTIONS = [
  { domain: "Federal Security Standard 800-53", status: "Verified", score: 96, owner: "Office of Cyber Assurance", lastScan: "Today, 04:30 AM" },
  { domain: "State Health Records Act (SHRA)", status: "Verified", score: 92, owner: "Health & Human Services", lastScan: "Yesterday" },
  { domain: "Public Infrastructure Telemetry Protocol", status: "Flagged", score: 68, owner: "Transportation Authority", lastScan: "2 days ago" },
  { domain: "Government Clean Air Mandate 2026", status: "Pending Review", score: 81, owner: "Environmental Protection", lastScan: "3 days ago" },
  { domain: "Municipal Financial Transparency Rule", status: "Verified", score: 99, owner: "Comptroller Division", lastScan: "4 days ago" },
  { domain: "Civil Service Equal Opportunity Baseline", status: "Verified", score: 94, owner: "Human Resources Commission", lastScan: "1 week ago" },
];

export default function StatusPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-on-surface tracking-tight">Institutional Compliance Status</h1>
                <p className="text-on-surface-variant mt-1">Multi-state regulatory mandates, compliance thresholds, and certification tracking.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Audit Certificate
                </Button>
                <Button>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Run Instant Scan
                </Button>
              </div>
            </div>

            {/* Overall Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-subtle flex items-start gap-4">
                <div className="p-3 bg-secondary-container/40 rounded-lg text-secondary">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider">Mandates Fully Met</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">28 / 31</p>
                  <p className="text-xs text-secondary font-medium mt-1">90.3% coverage across all departments</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-subtle flex items-start gap-4">
                <div className="p-3 bg-error-container/40 rounded-lg text-error">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider">Active Exceptions</p>
                  <p className="text-2xl font-bold text-error mt-1">2 Pending</p>
                  <p className="text-xs text-on-surface-variant mt-1">Waivers require executive approval</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-subtle flex items-start gap-4">
                <div className="p-3 bg-primary-container/30 rounded-lg text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider">Next Mandate Recertification</p>
                  <p className="text-2xl font-bold text-on-surface mt-1">14 Days</p>
                  <p className="text-xs text-on-surface-variant mt-1">Quarterly Multi-State Filing</p>
                </div>
              </div>
            </div>

            {/* Mandates Table */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-subtle">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <h2 className="text-lg font-bold text-on-surface">Institutional Compliance Matrix</h2>
                <Button variant="secondary" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Standard
                </Button>
              </div>

              <table className="w-full text-sm text-left">
                <thead className="bg-surface-container-low text-[11px] uppercase font-bold text-outline tracking-widest">
                  <tr>
                    <th className="px-6 py-3 border-b border-outline-variant">Regulatory Standard</th>
                    <th className="px-6 py-3 border-b border-outline-variant">Administering Agency</th>
                    <th className="px-6 py-3 border-b border-outline-variant text-center">Status</th>
                    <th className="px-6 py-3 border-b border-outline-variant text-right">Fidelity Score</th>
                    <th className="px-6 py-3 border-b border-outline-variant">Last Telemetry Scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {JURISDICTIONS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-semibold text-on-surface">{row.domain}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{row.owner}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={row.status === "Verified" ? "success" : row.status === "Flagged" ? "warning" : "neutral"}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-bold tabular-nums">
                        <span className={row.score >= 90 ? "text-green-600" : row.score >= 70 ? "text-orange-600" : "text-red-600"}>
                          {row.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant tabular-nums">{row.lastScan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
