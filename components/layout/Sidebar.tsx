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
  FolderGit2,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import { FlowGuardStore, DEMO_USERS } from "@/lib/flowguard-store";

const CORE_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Applications", icon: FolderGit2, href: "/applications" },
  { label: "Workflow Monitor", icon: Workflow, href: "/workflow" },
];

const INTELLIGENT_PILLARS = [
  { label: "Deadline Risk Radar", icon: Radar, href: "/risk-radar", badge: "P1" },
  { label: "Smart Document Checker", icon: FileCheck2, href: "/documents", badge: "P2" },
  { label: "Next Best Action", icon: Sparkles, href: "/next-best-action", badge: "P3" },
  { label: "Compliance Passport", icon: BadgeCheck, href: "/institutions", badge: "P4" },
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
  { label: "Regulatory Login", icon: LogIn, href: "/login" },
];

const emptyServerSnapshot = () => DEMO_USERS.SCRUTINY_OFFICER;

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUser = useSyncExternalStore(
    FlowGuardStore.subscribe,
    () => FlowGuardStore.getCurrentUser(),
    emptyServerSnapshot
  );

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("samadhan-toggle-mobile-nav", handleToggle);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("samadhan-toggle-mobile-nav", handleToggle);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navContent = (isMobileDrawer: boolean) => {
    const collapsed = isMobileDrawer ? false : isCollapsed;
    return (
      <aside
        className={cn(
          "h-full bg-[#FAF8F1] text-[#263B32] border-r border-[#D5DDCB] flex flex-col transition-all duration-300 relative select-none shrink-0",
          collapsed ? "w-20" : "w-[280px]"
        )}
      >
        {/* Brand Header */}
        <div className="px-4 py-3.5 border-b border-[#D5DDCB] flex items-center justify-between bg-gradient-to-b from-[#FAF8F1] to-[#F3EBDD]/60">
          {!collapsed && (
            <Link
              href="/"
              onClick={() => isMobileDrawer && setMobileOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#263B32] via-[#2A493D] to-[#1D2E27] rounded-lg flex items-center justify-center shadow-sm text-[#8FCDBB] font-bold text-xs tracking-tighter ring-1 ring-[#8FCDBB]/40">
                S360
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-[#263B32] tracking-tight text-base group-hover:text-[#2A6557] transition-colors">
                    Samadhan360
                  </span>
                  <span className="text-[9px] bg-[#8FCDBB]/35 text-[#263B32] font-bold px-1.5 py-0.5 rounded border border-[#8FCDBB]/60 uppercase tracking-wide">
                    Gov
                  </span>
                </div>
                <p className="text-[10px] text-[#68776A] font-medium">Approval &amp; Compliance</p>
              </div>
            </Link>
          )}

          {isMobileDrawer ? (
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="p-1.5 hover:bg-[#EAE2D2] rounded-md text-[#68776A] hover:text-[#263B32] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={collapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
              className="p-1.5 hover:bg-[#EAE2D2] rounded-md text-[#68776A] hover:text-[#263B32] transition-colors cursor-pointer"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Nav Section Container */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-5">
          {/* Core Management */}
          <div>
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#68776A] px-3 mb-1.5 block">
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
                    onClick={() => isMobileDrawer && setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-[#8FCDBB]/40 to-[#B7C9A8]/30 text-[#263B32] font-bold border border-[#8FCDBB]/70 shadow-[0_2px_10px_-3px_rgba(38,59,50,0.12)]"
                        : "text-[#263B32]/80 hover:bg-[#EAE2D2]/80 hover:text-[#263B32] border border-transparent"
                    )}
                    title={item.label}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#263B32]" />
                    )}
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-[#263B32]" : "text-[#68776A] group-hover:text-[#263B32]"
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Four Intelligent Pillars */}
          <div className="bg-gradient-to-br from-[#F3EBDD] via-[#EAE2D2]/70 to-[#B7C9A8]/20 rounded-xl p-2 border border-[#D5DDCB]">
            {!collapsed && (
              <div className="flex items-center justify-between px-2 pt-0.5 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#263B32] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2A6557]" />
                  4 Core Pillars
                </span>
                <span className="text-[9px] bg-[#FAF8F1] text-[#263B32] px-1.5 py-0.5 rounded font-mono border border-[#D5DDCB]">
                  360°
                </span>
              </div>
            )}
            <nav className="flex flex-col gap-0.5">
              {INTELLIGENT_PILLARS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobileDrawer && setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all group",
                      isActive
                        ? "bg-[#263B32] text-[#FAF8F1] shadow-sm font-bold"
                        : "text-[#263B32] hover:bg-[#FAF8F1] border border-transparent hover:border-[#D5DDCB]"
                    )}
                    title={item.label}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-[#8FCDBB]" : "text-[#2A6557]"
                      )}
                    />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1",
                            isActive
                              ? "bg-[#8FCDBB]/20 text-[#8FCDBB]"
                              : "bg-[#B7C9A8]/45 text-[#263B32]"
                          )}
                        >
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
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#68776A] px-3 mb-1.5 block">
                Workflow &amp; Oversight
              </span>
            )}
            <nav className="flex flex-col gap-0.5">
              {OVERSIGHT_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobileDrawer && setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative",
                      isActive
                        ? "bg-gradient-to-r from-[#8FCDBB]/40 to-[#B7C9A8]/30 text-[#263B32] font-bold border border-[#8FCDBB]/70"
                        : "text-[#263B32]/80 hover:bg-[#EAE2D2]/80 hover:text-[#263B32] border border-transparent"
                    )}
                    title={item.label}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#263B32]" />
                    )}
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-[#263B32]" : "text-[#68776A] group-hover:text-[#263B32]"
                      )}
                    />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>{item.label}</span>
                        {item.isLive && (
                          <span className="text-[9px] bg-[#8FCDBB]/45 text-[#263B32] border border-[#8FCDBB] font-bold px-1.5 py-0.5 rounded uppercase">
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

        {/* Bottom Session & Configuration */}
        <div className="p-3 border-t border-[#D5DDCB] bg-[#EAE2D2]/65 flex flex-col gap-2">
          {!collapsed ? (
            <div className="p-2 bg-[#FAF8F1] rounded-lg border border-[#D5DDCB] flex items-center justify-between">
              <Link
                href="/login"
                onClick={() => isMobileDrawer && setMobileOpen(false)}
                className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity"
                title="Switch Account / Login"
              >
                <div className="w-7 h-7 rounded-md bg-[#263B32] text-[#8FCDBB] font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#263B32] truncate leading-tight">{currentUser.name}</p>
                  <p className="text-[9px] font-mono text-[#68776A] uppercase truncate">
                    {currentUser.role.replace("_", " ")}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => {
                  FlowGuardStore.logout();
                  window.location.href = "/login";
                }}
                title="Sign Out of Session"
                aria-label="Sign Out of Session"
                className="p-1.5 hover:bg-[#F5DDD9] text-[#68776A] hover:text-[#8C2D25] rounded transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                href="/login"
                title={`Active: ${currentUser.name} (${currentUser.role})`}
                className="w-8 h-8 rounded-md bg-[#263B32] text-[#8FCDBB] font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-[#8FCDBB]"
              >
                {currentUser.name.charAt(0)}
              </Link>
            </div>
          )}

          {SYSTEM_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobileDrawer && setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[#FAF8F1] text-[#263B32] font-bold border border-[#D5DDCB]"
                    : "text-[#68776A] hover:bg-[#FAF8F1] hover:text-[#263B32]"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {!collapsed && (
            <div className="px-2.5 py-1.5 bg-[#FAF8F1]/80 rounded-md border border-[#D5DDCB] text-[10px] text-[#68776A] flex items-center justify-between">
              <span className="truncate font-medium">Approval Cycle AY 26–27</span>
              <span className="text-[#263B32] bg-[#B7C9A8]/45 px-1.5 py-0.5 rounded font-bold">SECURED</span>
            </div>
          )}
        </div>
      </aside>
    );
  };

  return (
    <>
      {/* Desktop Static Sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0 z-30 shrink-0">
        {navContent(false)}
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#263B32]/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full shadow-2xl">
            {navContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
