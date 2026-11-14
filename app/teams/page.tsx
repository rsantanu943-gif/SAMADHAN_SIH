import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoGuideBar } from "@/components/layout/DemoGuideBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Users, Mail, Shield, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";

const TEAMS = [
  { name: "Executive Governance", members: 4, lead: "Sarah Jenkins" },
  { name: "Legal & Regulatory", members: 12, lead: "David Thorne" },
  { name: "Data Security Unit", members: 8, lead: "Elena Rodriguez" },
  { name: "Field Auditors", members: 24, lead: "Marcus Chen" },
];

const USERS = [
  { name: "Sarah Jenkins", role: "Chief Compliance Officer", team: "Executive", status: "Active" },
  { name: "David Thorne", role: "Lead Legal Auditor", team: "Legal", status: "Active" },
  { name: "Elena Rodriguez", role: "Security Director", team: "Security", status: "In Meeting" },
  { name: "Marcus Chen", role: "Audit Coordinator", team: "Field", status: "Active" },
  { name: "James Wilson", role: "Junior Auditor", team: "Field", status: "On Site" },
];

export default function TeamsPage() {
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
                      RBAC Governance
                    </span>
                    <span className="text-xs text-[#68776A] font-mono">Council &amp; Bureau</span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight">
                    Institutional Teams
                  </h1>
                  <p className="text-xs lg:text-sm text-[#68776A] mt-1">
                    Manage personnel, roles, and access permissions across compliance departments.
                  </p>
                </div>
                <Link href="/settings">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAMS.map((team) => (
                  <div key={team.name} className="surface-card-interactive p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-[#B7C9A8]/40 border border-[#B7C9A8] rounded-lg">
                        <Shield className="w-5 h-5 text-[#263B32]" />
                      </div>
                      <Link
                        href="/settings"
                        aria-label={`Manage ${team.name}`}
                        className="text-[#68776A] hover:text-[#263B32] p-1 rounded hover:bg-[#EAE2D2] transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </div>
                    <h3 className="font-display font-bold text-[#263B32] text-base">{team.name}</h3>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[#68776A]">
                      <Users className="w-3.5 h-3.5 text-[#2A6557]" />
                      <span>{team.members} Members</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#D5DDCB]">
                      <p className="text-[10px] font-bold text-[#68776A] uppercase tracking-wider">
                        Team Lead
                      </p>
                      <p className="text-sm font-semibold text-[#263B32] mt-1">{team.lead}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="surface-card overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D5DDCB] bg-[#EAE2D2]/60 flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-lg font-bold text-[#263B32]">
                    Personnel Directory
                  </h2>
                  <div className="flex gap-2">
                    <Link href="/evc">
                      <Button variant="secondary" size="sm">
                        EVC Assignments
                      </Button>
                    </Link>
                    <Link href="/reports">
                      <Button variant="secondary" size="sm">
                        Export Directory
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-[#EAE2D2]/80 text-[11px] uppercase font-bold text-[#68776A] tracking-widest">
                      <tr>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Name</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Institutional Role</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Primary Team</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB]">Status</th>
                        <th className="px-6 py-3.5 border-b border-[#D5DDCB] w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DDCB]/60">
                      {USERS.map((user, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-[#8FCDBB]/15 transition-colors ${
                            i % 2 === 1 ? "bg-[#F3EBDD]/45" : "bg-[#FAF8F1]"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#B7C9A8]/50 border border-[#B7C9A8] flex items-center justify-center font-bold text-xs text-[#263B32]">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-bold text-[#263B32]">{user.name}</p>
                                <p className="text-[10px] font-mono text-[#68776A]">
                                  ID: EMP-00{i + 1}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#68776A]">{user.role}</td>
                          <td className="px-6 py-4">
                            <Badge variant="neutral">{user.team}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  user.status === "Active" ? "bg-[#2A6557]" : "bg-[#8FCDBB]"
                                )}
                              ></div>
                              <span className="text-xs font-medium text-[#263B32]">
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href="/notifications"
                              aria-label={`Message ${user.name}`}
                              className="p-1.5 inline-flex hover:bg-[#EAE2D2] rounded-md text-[#68776A] hover:text-[#263B32] transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                            </Link>
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
