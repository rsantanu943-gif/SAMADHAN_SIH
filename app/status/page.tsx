import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Filter, Download } from "lucide-react";
import Link from "next/link";

const JURISDICTIONS = [
  {
    domain: "Federal Security Standard 800-53",
    status: "Verified",
    score: 96,
    owner: "Office of Cyber Assurance",
    lastScan: "Today, 04:30 AM",
  },
  {
    domain: "State Health Records Act (SHRA)",
    status: "Verified",
    score: 92,
    owner: "Health & Human Services",
    lastScan: "Yesterday",
  },
  {
    domain: "Public Infrastructure Telemetry Protocol",
    status: "Flagged",
    score: 68,
    owner: "Transportation Authority",
    lastScan: "2 days ago",
  },
  {
    domain: "Government Clean Air Mandate 2026",
    status: "Pending Review",
    score: 81,
    owner: "Environmental Protection",
    lastScan: "3 days ago",
  },
  {
    domain: "Municipal Financial Transparency Rule",
    status: "Verified",
    score: 99,
    owner: "Comptroller Division",
    lastScan: "4 days ago",
  },
  {
    domain: "Civil Service Equal Opportunity Baseline",
    status: "Verified",
    score: 94,
    owner: "Human Resources Commission",
    lastScan: "1 week ago",
  },
];

export default function StatusPage() {
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
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#8FCDBB]/35 text-[#263B32] px-2.5 py-0.5 rounded border border-[#8FCDBB]">
                      Statutory Baseline
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Jurisdictional Matrix</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight">
                    Institutional Compliance Status
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-1">
                    Multi-state regulatory mandates, compliance thresholds, and certification tracking.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/reports">
                    <Button variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Audit Certificate
                    </Button>
                  </Link>
                  <Link href="/risk-radar">
                    <Button>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Run Instant Scan
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Overall Health Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="surface-card p-6 flex items-start gap-4">
                  <div className="p-3 bg-[#8FCDBB]/35 border border-[#8FCDBB]/60 rounded-xl text-[#263B32]">
                    <CheckCircle2 className="w-6 h-6 text-[#2A6557]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#68776A] uppercase tracking-wider">
                      Mandates Fully Met
                    </p>
                    <p className="font-display text-2xl font-bold text-[#263B32] mt-1 tabular-nums">
                      28 / 31
                    </p>
                    <p className="text-xs text-[#2A6557] font-semibold mt-1">
                      90.3% coverage across all departments
                    </p>
                  </div>
                </div>

                <div className="surface-card p-6 flex items-start gap-4">
                  <div className="p-3 bg-[#F5DDD9] border border-[#E5B8B0] rounded-xl text-[#8C2D25]">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#68776A] uppercase tracking-wider">
                      Active Exceptions
                    </p>
                    <p className="font-display text-2xl font-bold text-[#8C2D25] mt-1 tabular-nums">
                      2 Pending
                    </p>
                    <p className="text-xs text-[#68776A] mt-1">
                      Waivers require executive approval
                    </p>
                  </div>
                </div>

                <div className="surface-card p-6 flex items-start gap-4">
                  <div className="p-3 bg-[#B7C9A8]/45 border border-[#B7C9A8] rounded-xl text-[#263B32]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#68776A] uppercase tracking-wider">
                      Next Mandate Recertification
                    </p>
                    <p className="font-display text-2xl font-bold text-[#263B32] mt-1 tabular-nums">
                      14 Days
                    </p>
                    <p className="text-xs text-[#68776A] mt-1">
                      Quarterly Multi-State Filing
                    </p>
                  </div>
                </div>
              </div>

              {/* Mandates Table */}
              <div className="surface-card overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D5DDCB] bg-[#EAE2D2]/60 flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-lg font-bold text-[#263B32]">
                    Institutional Compliance Matrix
                  </h2>
                  <Link href="/compliance">
                    <Button variant="secondary" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      View Undertakings
                    </Button>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-[#EAE2D2]/80 text-[11px] uppercase font-bold text-[#68776A] tracking-widest">
                      <tr>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Regulatory Standard</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Administering Agency</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB] text-center">Status</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB] text-right">Fidelity Score</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Last Telemetry Scan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DDCB]/60">
                      {JURISDICTIONS.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-[#8FCDBB]/15 transition-colors ${
                            idx % 2 === 1 ? "bg-[#F3EBDD]/45" : "bg-[#FAF8F1]"
                          }`}
                        >
                          <td className="px-6 py-4 font-semibold text-[#263B32]">{row.domain}</td>
                          <td className="px-6 py-4 text-[#68776A]">{row.owner}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge
                              variant={
                                row.status === "Verified"
                                  ? "success"
                                  : row.status === "Flagged"
                                  ? "warning"
                                  : "neutral"
                              }
                            >
                              {row.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-bold font-mono tabular-nums">
                            <span
                              className={
                                row.score >= 90
                                  ? "text-[#2A6557]"
                                  : row.score >= 70
                                  ? "text-[#6B4A1B]"
                                  : "text-[#8C2D25]"
                              }
                            >
                              {row.score}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[#68776A] tabular-nums">
                            {row.lastScan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
