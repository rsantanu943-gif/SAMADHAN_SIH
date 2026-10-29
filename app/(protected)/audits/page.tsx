import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ComplianceTable } from "@/components/dashboard/ComplianceTable";
import { Button } from "@/components/ui/Button";
import { Plus, Filter, Download, ListFilter } from "lucide-react";

export default function AuditsPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-on-surface tracking-tight">Institutional Audit Logs</h1>
                <p className="text-on-surface-variant mt-1">Full historical record and active status of all regulatory compliance audits.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary">
                  <ListFilter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Audit Request
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ComplianceTable />
            </div>
            
            {/* Additional Audit Specific Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Submission Success Rate</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-2xl font-bold text-on-surface">94.2%</span>
                    <span className="text-xs text-green-600 font-bold mb-1">+1.5%</span>
                  </div>
               </div>
               <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Avg. Response Time</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-2xl font-bold text-on-surface">4.2 Days</span>
                    <span className="text-xs text-blue-600 font-bold mb-1">-0.4d</span>
                  </div>
               </div>
               <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Correction Requests</p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-2xl font-bold text-on-surface">18</span>
                    <span className="text-xs text-orange-600 font-bold mb-1">+2</span>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
