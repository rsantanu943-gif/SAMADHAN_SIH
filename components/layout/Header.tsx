"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sparkles,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { FlowGuardStore, DEMO_USERS, INITIAL_NOTIFICATIONS } from "@/lib/flowguard-store";
import { UserRole, NotificationRecord } from "@/lib/types";

const INITIAL_UNREAD_COUNT = INITIAL_NOTIFICATIONS.filter((n) => !n.read && !n.resolved).length;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifPreview, setShowNotifPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentAlerts, setRecentAlerts] = useState<NotificationRecord[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useSyncExternalStore(
    FlowGuardStore.subscribe,
    () => FlowGuardStore.isAuthenticated(),
    () => true
  );

  const currentRole = useSyncExternalStore(
    FlowGuardStore.subscribe,
    () => FlowGuardStore.getCurrentRole(),
    () => "SCRUTINY_OFFICER" as UserRole
  );

  const unreadCount = useSyncExternalStore(
    FlowGuardStore.subscribe,
    () => FlowGuardStore.getNotifications().filter((n) => !n.read && !n.resolved).length,
    () => INITIAL_UNREAD_COUNT
  );

  useEffect(() => {
    const syncAlerts = () => {
      setRecentAlerts(
        FlowGuardStore.getNotifications()
          .filter((n) => !n.resolved)
          .slice(0, 3)
      );
    };
    syncAlerts();
    const unsub = FlowGuardStore.subscribe(syncAlerts);

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPreview(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowNotifPreview(false);
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      unsub();
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleRoleChange = (role: UserRole) => {
    FlowGuardStore.setCurrentRole(role);
    setShowRoleDropdown(false);
    window.location.reload();
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/applications?search=${encodeURIComponent(q)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearchSubmit();
    } else if (e.key === "Escape") {
      setSearchQuery("");
    }
  };

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.SCRUTINY_OFFICER;
  const isAdvisorActive = pathname === "/advisor";

  return (
    <header className="h-16 border-b border-[#D5DDCB] bg-[#FAF8F1]/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-[0_1px_8px_-2px_rgba(38,59,50,0.06)]">
      {/* Left: Mobile Drawer Button & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl min-w-0">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("samadhan-toggle-mobile-nav"))}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg bg-[#F3EBDD] border border-[#D5DDCB] text-[#263B32] hover:bg-[#EAE2D2] transition-colors shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
          className="relative w-full"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68776A] pointer-events-none" />
          <input
            type="text"
            aria-label="Global registry search"
            placeholder="Search Permanent ID (1-4029102), App No, or Institute..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-8 py-1.5 bg-[#F3EBDD] border border-[#D5DDCB] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8FCDBB]/45 focus:border-[#8FCDBB] transition-all text-[#263B32] placeholder:text-[#68776A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#68776A] hover:text-[#263B32] p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Action Center & Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Fast Advisor shortcut */}
        <Link
          href="/advisor"
          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            isAdvisorActive
              ? "bg-[#263B32] text-[#FAF8F1] border-[#263B32] shadow-sm"
              : "text-[#263B32] bg-gradient-to-r from-[#B7C9A8]/35 to-[#8FCDBB]/35 border-[#8FCDBB]/70 hover:from-[#B7C9A8]/55 hover:to-[#8FCDBB]/55"
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAdvisorActive ? "text-[#8FCDBB]" : "text-[#263B32]"}`} />
          <span>AI Statutory Advisor</span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
              isAdvisorActive ? "bg-[#8FCDBB] text-[#263B32]" : "bg-[#263B32] text-[#FAF8F1]"
            }`}
          >
            Live
          </span>
        </Link>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifPreview(!showNotifPreview);
              setShowRoleDropdown(false);
            }}
            aria-label="Alerts and notifications"
            aria-expanded={showNotifPreview}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F3EBDD]/70 hover:bg-[#EAE2D2] border border-[#D5DDCB] text-[#263B32] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8C2D25] rounded-full ring-2 ring-[#FAF8F1]" />
            )}
          </button>

          {showNotifPreview && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FAF8F1] border border-[#D5DDCB] rounded-xl shadow-[0_14px_34px_-12px_rgba(38,59,50,0.2)] z-50 p-3.5">
              <div className="flex items-center justify-between border-b border-[#D5DDCB] pb-2 mb-2.5">
                <span className="text-xs font-bold text-[#263B32]">Regulatory Risk Alerts</span>
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifPreview(false)}
                  className="text-[11px] text-[#2A6557] font-bold hover:underline"
                >
                  View All ({unreadCount})
                </Link>
              </div>
              <div className="space-y-2 text-xs">
                {recentAlerts.length === 0 ? (
                  <div className="p-3 bg-[#B7C9A8]/20 border border-[#B7C9A8] rounded-lg text-[#263B32] text-center">
                    All regulatory alerts resolved.
                  </div>
                ) : (
                  recentAlerts.map((alert) => (
                    <Link
                      key={alert.id}
                      href="/notifications"
                      onClick={() => setShowNotifPreview(false)}
                      className={`block p-2.5 rounded-lg border transition-colors ${
                        alert.priority === "critical"
                          ? "bg-[#F5DDD9]/65 border-[#DFACA5] hover:bg-[#F5DDD9]"
                          : "bg-[#F5E9D3]/70 border-[#D8B989] hover:bg-[#F5E9D3]"
                      }`}
                    >
                      <p
                        className={`font-bold text-[11px] line-clamp-1 ${
                          alert.priority === "critical" ? "text-[#5E1A14]" : "text-[#7A4E16]"
                        }`}
                      >
                        {alert.title}
                      </p>
                      <p className="text-[10px] text-[#576659] mt-0.5 line-clamp-2">{alert.message}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher or Sign In */}
        <div className="relative pl-2 border-l border-[#D5DDCB]" ref={roleRef}>
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#263B32] hover:bg-[#1D2E27] text-[#FAF8F1] font-bold rounded-lg text-xs shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#8FCDBB]" />
              <span>Portal Sign In</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifPreview(false);
              }}
              aria-expanded={showRoleDropdown}
              className="flex items-center gap-2.5 px-2.5 py-1.5 bg-[#F3EBDD] hover:bg-[#EAE2D2] rounded-lg transition-all text-left border border-[#D5DDCB] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-[#263B32] text-[#8FCDBB] font-bold text-xs flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#263B32] leading-tight">{currentUser.name}</p>
                  <ChevronDown className="w-3 h-3 text-[#68776A]" />
                </div>
                <p className="text-[10px] text-[#2A6557] font-bold uppercase tracking-wider">
                  {currentRole.replace("_", " ")}
                </p>
              </div>
            </button>
          )}

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FAF8F1] border border-[#D5DDCB] rounded-xl shadow-[0_14px_34px_-12px_rgba(38,59,50,0.22)] z-50 py-1.5 text-xs">
              <div className="px-3.5 py-2 border-b border-[#D5DDCB] bg-[#EAE2D2]/50">
                <p className="font-bold text-[#263B32] text-[11px] uppercase tracking-wider">
                  Switch Active Role (RBAC Demo)
                </p>
                <p className="text-[10px] text-[#68776A]">
                  Test role-based views, permissions, and Next Best Action filters
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                  const u = DEMO_USERS[r];
                  const isSelected = currentRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3.5 py-2 hover:bg-[#EAE2D2]/70 flex items-start justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#8FCDBB]/25 text-[#263B32] font-bold border-l-2 border-[#263B32]"
                          : "text-[#263B32]"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-xs leading-tight">{u.name}</p>
                        <p className="text-[10px] text-[#68776A]">{u.designation}</p>
                        <span className="text-[9px] font-mono text-[#2A6557] font-bold uppercase">
                          [{r.replace("_", " ")}]
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2A6557] shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Portal Login & Sign Out Actions */}
              <div className="pt-2 mt-1 border-t border-[#D5DDCB] px-2 space-y-1">
                <Link
                  href="/login"
                  onClick={() => setShowRoleDropdown(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#EAE2D2] text-[#263B32] flex items-center justify-between text-xs font-semibold transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#2A6557]" />
                    <span>Open Login Portal</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#68776A]" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    FlowGuardStore.logout();
                    setShowRoleDropdown(false);
                    window.location.href = "/login";
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#F5DDD9] text-[#8C2D25] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#8C2D25]" />
                  <span>Sign Out of Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
