import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Users, Mail, Shield, MoreVertical, Plus } from "lucide-react";

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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-on-surface tracking-tight">Institutional Teams</h1>
                <p className="text-on-surface-variant mt-1">Manage personnel, roles, and access permissions across compliance departments.</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {TEAMS.map((team) => (
                <div key={team.name} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-subtle">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-container/30 rounded-md">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <button className="text-outline hover:text-on-surface">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-on-surface">{team.name}</h3>
                  <div className="flex items-center gap-2 mt-4 text-xs text-on-surface-variant">
                    <Users className="w-3.5 h-3.5" />
                    <span>{team.members} Members</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/30">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Team Lead</p>
                    <p className="text-sm font-medium text-on-surface mt-1">{team.lead}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-subtle">
               <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h2 className="text-lg font-bold text-on-surface">Personnel Directory</h2>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Active Only</Button>
                    <Button variant="secondary" size="sm">Export Directory</Button>
                  </div>
               </div>
               <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low text-[11px] uppercase font-bold text-outline tracking-widest">
                    <tr>
                      <th className="px-6 py-3 border-b border-outline-variant">Name</th>
                      <th className="px-6 py-3 border-b border-outline-variant">Institutional Role</th>
                      <th className="px-6 py-3 border-b border-outline-variant">Primary Team</th>
                      <th className="px-6 py-3 border-b border-outline-variant">Status</th>
                      <th className="px-6 py-3 border-b border-outline-variant w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50">
                    {USERS.map((user, i) => (
                      <tr key={i} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{user.name}</p>
                              <p className="text-[10px] text-on-surface-variant">ID: EMP-00{i+1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{user.role}</td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral">{user.team}</Badge>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                user.status === "Active" ? "bg-green-500" : "bg-orange-400"
                              )}></div>
                              <span className="text-xs font-medium">{user.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <button className="p-1 hover:bg-surface-container rounded-md text-outline">
                              <Mail className="w-4 h-4" />
                           </button>
                        </td>
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
