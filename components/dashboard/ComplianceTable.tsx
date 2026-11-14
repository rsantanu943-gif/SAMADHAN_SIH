"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { MoreHorizontal, ExternalLink, Filter, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AUDIT_RECORDS } from "@/lib/compliance";

const PAGE_SIZE = 5;

export function ComplianceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFilterDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredData = AUDIT_RECORDS.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedData = filteredData.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-[#FAF8F1] border border-[#D5DDCB] rounded-xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(38,59,50,0.06)]">
      <div className="px-5 py-4 border-b border-[#D5DDCB] flex flex-wrap justify-between items-center bg-[#EAE2D2]/50 gap-3 relative">
        <h3 className="font-display text-base font-bold text-[#263B32] tracking-tight">Recent Compliance Audits</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68776A]" />
            <input
              type="text"
              placeholder="Search audits..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-4 py-1.5 text-xs border border-[#D5DDCB] rounded-lg bg-[#F3EBDD] focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/40 focus:border-[#8FCDBB] w-60 text-[#263B32] placeholder:text-[#68776A] transition-all"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="text-xs bg-[#FAF8F1] border-[#D5DDCB] text-[#263B32] hover:bg-[#EAE2D2]"
            >
              <Filter className="w-3.5 h-3.5 mr-1.5 text-[#68776A]" />
              {statusFilter === "All" ? "Filter Status" : statusFilter}
              <ChevronDown className="w-3.5 h-3.5 ml-1.5 opacity-60" />
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-[#FAF8F1] border border-[#D5DDCB] rounded-lg shadow-xl z-20 py-1 text-xs">
                {["All", "Verified", "Flagged", "Pending Review", "Non-Compliant"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                      setPage(1);
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-2 hover:bg-[#EAE2D2]/70 transition-colors font-medium cursor-pointer",
                      statusFilter === status
                        ? "text-[#263B32] font-bold bg-[#8FCDBB]/30"
                        : "text-[#263B32]"
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
          <thead className="bg-[#EAE2D2]/70 border-b border-[#D5DDCB] text-[#68776A] font-semibold uppercase tracking-wider text-[11px] sticky top-0">
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
          <tbody className="divide-y divide-[#D5DDCB]/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[#68776A]">
                  <p className="mb-3">No compliance records match your search criteria.</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("All");
                      setPage(1);
                    }}
                  >
                    Reset Filters
                  </Button>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "hover:bg-[#8FCDBB]/15 transition-colors group",
                    index % 2 === 1 ? "bg-[#F3EBDD]/45" : "bg-[#FAF8F1]"
                  )}
                >
                  <td className="px-5 py-3 font-mono font-bold text-[#263B32]">
                    <Link href={`/audits/${row.id}`} className="hover:text-[#2A6557] hover:underline flex items-center gap-1.5">
                      {row.id}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#68776A]" />
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#263B32]">{row.entity}</td>
                  <td className="px-5 py-3 text-[#68776A]">{row.type}</td>
                  <td className="px-5 py-3 text-center">
                    <Badge
                      variant={
                        row.status === "Verified"
                          ? "success"
                          : row.status === "Flagged"
                          ? "warning"
                          : row.status === "Non-Compliant"
                          ? "error"
                          : "neutral"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 tabular-nums font-mono text-[#68776A]">{row.date}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-bold">
                    <span
                      className={cn(
                        row.score > 90
                          ? "text-[#2A6557]"
                          : row.score > 75
                          ? "text-[#263B32]"
                          : "text-[#8C2D25]"
                      )}
                    >
                      {row.score}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/audits/${row.id}`}
                      className="p-1 inline-flex hover:bg-[#EAE2D2] rounded-md text-[#68776A] hover:text-[#263B32] transition-colors"
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
      <div className="px-5 py-3 border-t border-[#D5DDCB] flex justify-between items-center bg-[#EAE2D2]/50">
        <span className="text-xs text-[#68776A] font-medium">
          Showing {paginatedData.length} of {filteredData.length} matching records (Page {safePage} of {totalPages})
        </span>
        <div className="flex gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            className="px-2.5 h-7 text-xs"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="px-2.5 h-7 text-xs"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
