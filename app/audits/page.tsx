import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { ComplianceTable } from "@/components/dashboard/ComplianceTable";
import { Button } from "@/components/ui/Button";
import { Plus, ListFilter } from "lucide-react";
import Link from "next/link";

export default function AuditsPage() {
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
                      Regulatory Archive
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Institutional Audits</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight">
                    Institutional Audit Logs
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-1">
                    Full historical record and active status of all regulatory compliance audits.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/audit-trail">
                    <Button variant="secondary">
                      <ListFilter className="w-4 h-4 mr-2" />
                      Immutable Trail
                    </Button>
                  </Link>
                  <Link href="/applications">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Audit Request
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <ComplianceTable />
              </div>

              {/* Additional Audit Specific Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="surface-card p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#68776A]">
                    Submission Success Rate
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="font-display text-2xl font-bold text-[#263B32] tabular-nums">94.2%</span>
                    <span className="text-xs text-[#2A6557] bg-[#8FCDBB]/35 px-2 py-0.5 rounded font-bold mb-0.5">
                      +1.5%
                    </span>
                  </div>
                </div>
                <div className="surface-card p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#68776A]">
                    Avg. Response Time
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="font-display text-2xl font-bold text-[#263B32] tabular-nums">4.2 Days</span>
                    <span className="text-xs text-[#263B32] bg-[#B7C9A8]/45 px-2 py-0.5 rounded font-bold mb-0.5">
                      -0.4d
                    </span>
                  </div>
                </div>
                <div className="surface-card p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#68776A]">
                    Correction Requests
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="font-display text-2xl font-bold text-[#263B32] tabular-nums">18</span>
                    <span className="text-xs text-[#6B4A1B] bg-[#F5E9D3] px-2 py-0.5 rounded font-bold mb-0.5">
                      +2
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
