"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { MoreHorizontal, ExternalLink, Filter, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const MOCK_DATA = [
  { id: "AUD-2024-001", entity: "Public Health Dept", type: "Financial Audit", status: "Verified", date: "2024-10-15", score: 98 },
  { id: "AUD-2024-002", entity: "Transp. Authority", type: "Security Compliance", status: "Flagged", date: "2024-10-18", score: 72 },
  { id: "AUD-2024-003", entity: "Housing Bureau", type: "Environmental Audit", status: "Pending Review", date: "2024-10-20", score: 85 },
  { id: "AUD-2024-004", entity: "Social Services", type: "Data Privacy", status: "Verified", date: "2024-10-21", score: 94 },
  { id: "AUD-2024-005", entity: "Edu. Commission", type: "Regulatory Review", status: "Non-Compliant", date: "2024-10-22", score: 45 },
  { id: "AUD-2024-006", entity: "Water Utility", type: "Infrastructure", status: "Verified", date: "2024-10-23", score: 91 },
  { id: "AUD-2024-007", entity: "Labor Office", type: "Employment Standards", status: "Pending Review", date: "2024-10-24", score: 88 },
];

export function ComplianceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredData = MOCK_DATA.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50/70 gap-3 relative">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Compliance Audits</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search audits..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-60 text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>
          <div className="relative">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              {statusFilter === "All" ? "Filter Status" : statusFilter}
              <ChevronDown className="w-3.5 h-3.5 ml-1.5 opacity-60" />
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1 text-xs">
                {["All", "Verified", "Flagged", "Pending Review", "Non-Compliant"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors font-medium cursor-pointer",
                      statusFilter === status ? "text-amber-700 font-bold bg-amber-50/80" : "text-slate-700"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] sticky top-0">
            <tr>
              <th className="px-5 py-3">Audit ID</th>
              <th className="px-5 py-3">Institutional Entity</th>
              <th className="px-5 py-3">Audit Domain</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3">Submission Date</th>
              <th className="px-5 py-3 text-right">Comp. Score</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                  No compliance records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-3 font-mono font-bold text-slate-900">
                    <Link href={`/audits/${row.id}`} className="hover:text-amber-700 hover:underline flex items-center gap-1.5">
                      {row.id}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{row.entity}</td>
                  <td className="px-5 py-3 text-slate-600">{row.type}</td>
                  <td className="px-5 py-3 text-center">
                    <Badge 
                      variant={
                        row.status === "Verified" ? "success" : 
                        row.status === "Flagged" ? "warning" : 
                        row.status === "Non-Compliant" ? "error" : "neutral"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 tabular-nums font-mono text-slate-600">{row.date}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-bold">
                    <span className={cn(
                      row.score > 90 ? "text-emerald-700" : row.score > 75 ? "text-sky-700" : "text-red-700"
                    )}>
                      {row.score}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link 
                      href={`/audits/${row.id}`}
                      className="p-1 inline-flex hover:bg-slate-200/70 rounded-md text-slate-400 hover:text-slate-900 transition-colors"
                      title="View Details"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-slate-200 flex justify-between items-center bg-slate-50/70">
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredData.length} of {MOCK_DATA.length} compliance records
        </span>
        <div className="flex gap-1">
          <Button variant="secondary" size="sm" className="px-2.5 h-7 text-xs bg-white border-slate-200" disabled>Prev</Button>
          <Button variant="secondary" size="sm" className="px-2.5 h-7 text-xs bg-white border-slate-200" disabled>Next</Button>
        </div>
      </div>
    </div>

  );
}
