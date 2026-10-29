"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { 
  Bell, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  UserCheck, 
  ChevronDown, 
  Building2,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { FlowGuardStore, DEMO_USERS } from "@/lib/flowguard-store";
import { UserRole } from "@/lib/types";

const emptySubscribe = () => () => {};

export function Header() {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifPreview, setShowNotifPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentRole = useSyncExternalStore(
    emptySubscribe,
    () => FlowGuardStore.getCurrentRole(),
    () => "SCRUTINY_OFFICER" as UserRole
  );

  const unreadCount = useSyncExternalStore(
    emptySubscribe,
    () => FlowGuardStore.getNotifications().filter(n => !n.read).length,
    () => 2
  );

  const handleRoleChange = (role: UserRole) => {
    FlowGuardStore.setCurrentRole(role);
    setShowRoleDropdown(false);
    window.location.reload();
  };

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.SCRUTINY_OFFICER;

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Permanent ID (e.g. 1-4029102), App No (APP-2026-102), or Institute..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Action Center & Profile */}
      <div className="flex items-center gap-3">
        {/* Fast Advisor shortcut */}
        <Link 
          href="/advisor"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-slate-900 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>AI Statutory Advisor</span>
          <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1 rounded uppercase">Live</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifPreview(!showNotifPreview)}
            aria-label="Alerts and notifications" 
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifPreview && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-900">Regulatory Risk Alerts</span>
                <Link 
                  href="/notifications" 
                  onClick={() => setShowNotifPreview(false)}
                  className="text-[11px] text-amber-600 font-semibold hover:underline"
                >
                  View All (4)
                </Link>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-red-50 border-l-2 border-red-500 rounded text-slate-800">
                  <p className="font-bold text-red-900 text-[11px]">EVC Stage OVERDUE</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">Oxford Inst. EVC deadline elapsed Oct 24.</p>
                </div>
                <div className="p-2 bg-amber-50 border-l-2 border-amber-500 rounded text-slate-800">
                  <p className="font-bold text-amber-900 text-[11px]">Scrutiny in 2 Days</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">VJTI application requires committee findings.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher (RBAC Evaluation) */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-all text-left border border-slate-200/80 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                {currentRole.replace("_", " ")}
              </p>
            </div>
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 py-1.5 text-xs animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/80">
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  Switch Active Role (RBAC Demo)
                </p>
                <p className="text-[10px] text-slate-500">
                  Test role-based views, permissions, and Next Best Action filters
                </p>
              </div>

              {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                const u = DEMO_USERS[r];
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-start justify-between transition-colors ${
                      isSelected ? "bg-amber-50/70 border-l-2 border-amber-500 text-amber-950 font-bold" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs leading-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.designation}</p>
                      <span className="text-[9px] font-mono text-amber-700 font-bold uppercase">
                        [{r.replace("_", " ")}]
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
