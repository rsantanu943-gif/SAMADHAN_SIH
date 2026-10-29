"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Radar, 
  FileCheck2, 
  Workflow, 
  Sparkles, 
  BadgeCheck, 
  CalendarClock, 
  FileText, 
  BellRing, 
  BarChart3, 
  History, 
  Settings, 
  HelpCircle, 
  ChevronLeft,
  Menu,
  ShieldAlert,
  Building2,
  FolderGit2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const CORE_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Applications", icon: FolderGit2, href: "/applications" },
  { label: "Workflow Monitor", icon: Workflow, href: "/workflow" },
];

const INTELLIGENT_PILLARS = [
  { label: "Deadline Risk Radar", icon: Radar, href: "/risk-radar", badge: "Pillar 1", highlight: true },
  { label: "Smart Document Checker", icon: FileCheck2, href: "/documents", badge: "Pillar 2", highlight: true },
  { label: "Next Best Action", icon: Sparkles, href: "/next-best-action", badge: "Pillar 3", highlight: true },
  { label: "Compliance Passport", icon: BadgeCheck, href: "/institutions", badge: "Pillar 4", highlight: true },
];

const OVERSIGHT_NAV = [
  { label: "EVC Scheduling", icon: CalendarClock, href: "/evc" },
  { label: "Undertakings & Compl.", icon: FileText, href: "/compliance" },
  { label: "Alerts & Escalations", icon: BellRing, href: "/notifications" },
  { label: "Reports & Analytics", icon: BarChart3, href: "/reports" },
  { label: "Immutable Audit Trail", icon: History, href: "/audit-trail" },
  { label: "AI Statutory Advisor", icon: Sparkles, href: "/advisor", isLive: true },
];

const SYSTEM_NAV = [
  { label: "Settings & Config", icon: Settings, href: "/settings" },
  { label: "APH 2026 Handbook", icon: HelpCircle, href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-300 relative select-none shrink-0 z-30",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-sm text-slate-950 font-black text-xs tracking-tighter ring-1 ring-amber-400/30">
              S360
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white tracking-tight text-base group-hover:text-amber-400 transition-colors">
                  Samadhan360
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30 uppercase">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Approval & Compliance</p>
            </div>
          </Link>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
          className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Section Container */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
        {/* Core Management */}
        <div>
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1.5 block">
              Core Navigation
            </span>
          )}
          <nav className="flex flex-col gap-0.5">
            {CORE_NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group",
                    isActive 
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm" 
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  )}
                  title={item.label}
                >
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Four Intelligent Pillars */}
        <div className="bg-slate-800/50 rounded-lg p-1.5 border border-amber-500/20">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 pt-1 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                4 Core Pillars
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 rounded font-mono">
                360
              </span>
            </div>
          )}
          <nav className="flex flex-col gap-0.5">
            {INTELLIGENT_PILLARS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-semibold transition-all group",
                    isActive 
                      ? "bg-amber-500 text-slate-950 shadow-sm font-bold" 
                      : "text-slate-200 hover:bg-slate-700/80 hover:text-white"
                  )}
                  title={item.label}
                >
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-slate-950" : "text-amber-400")} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{item.label}</span>
                      <span className={cn(
                        "text-[9px] px-1 rounded font-mono shrink-0 ml-1",
                        isActive ? "bg-slate-950/20 text-slate-950" : "bg-amber-500/10 text-amber-300"
                      )}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Verification & Operations */}
        <div>
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-1.5 block">
              Workflow & Oversight
            </span>
          )}
          <nav className="flex flex-col gap-0.5">
            {OVERSIGHT_NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group",
                    isActive 
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm" 
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  )}
                  title={item.label}
                >
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400")} />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span>{item.label}</span>
                      {item.isLive && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded uppercase">
                          AI
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Configuration */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex flex-col gap-1">
        {SYSTEM_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <item.icon className="w-4 h-4 text-slate-500 shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {!isCollapsed && (
          <div className="mt-2 px-2 py-1.5 bg-slate-800/40 rounded border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="truncate">Approval Cycle AY 26-27</span>
            <span className="text-emerald-400 font-bold">LIVE</span>
          </div>
        )}
      </div>
    </aside>
  );
}
