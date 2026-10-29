"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderGit2, Workflow, Radar, FileCheck2, Sparkles, BadgeCheck, CalendarClock, FileText, BellRing, BarChart3, History, Settings, HelpCircle, PanelLeftClose, Menu, X, ShieldCheck, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const groups = [
  { title: "Workspace", items: [ { label: "Overview", icon: LayoutDashboard, href: "/" }, { label: "Applications", icon: FolderGit2, href: "/applications" }, { label: "Workflow monitor", icon: Workflow, href: "/workflow" } ] },
  { title: "Intelligence suite", items: [ { label: "Deadline risk radar", icon: Radar, href: "/risk-radar" }, { label: "Document checker", icon: FileCheck2, href: "/documents" }, { label: "Next best action", icon: Sparkles, href: "/next-best-action" }, { label: "Compliance passport", icon: BadgeCheck, href: "/institutions" } ] },
  { title: "Governance", items: [ { label: "EVC scheduling", icon: CalendarClock, href: "/evc" }, { label: "Undertakings", icon: FileText, href: "/compliance" }, { label: "Alerts & escalations", icon: BellRing, href: "/notifications" }, { label: "Reports & analytics", icon: BarChart3, href: "/reports" }, { label: "Audit trail", icon: History, href: "/audit-trail" } ] }
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return <>
    <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button>
    {mobileOpen && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={cn("workspace-sidebar", collapsed && "is-collapsed", mobileOpen && "mobile-open")}>
      <div className="sidebar-brand"><Link href="/" className="brand-link" aria-label="Samadhan360 home"><span className="brand-symbol"><ShieldCheck size={25}/></span><span className="sidebar-label"><strong>samadhan<span>360</span></strong><small>APPROVAL & COMPLIANCE</small></span></Link></div>
      <div className="sidebar-cycle sidebar-label"><span className="status-dot"/><span>Academic year <b>2026–27</b></span></div>
      <div className="sidebar-scroll">{groups.map(group => <div className="nav-group" key={group.title}><p className="sidebar-label">{group.title}</p><nav aria-label={group.title}>{group.items.map(item => {const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} title={item.label} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)} className={cn("nav-item", active && "active")}><item.icon size={18}/><span className="sidebar-label">{item.label}</span>{active && <span className="active-indicator sidebar-label"/>}</Link>;})}</nav></div>)}</div>
      <div className="sidebar-bottom"><Link href="/advisor" className="advisor-shortcut" title="AI statutory advisor"><Sparkles size={19}/><span className="sidebar-label"><b>Your regulatory copilot</b><small>Ask the statutory advisor <ArrowUpRight size={12}/></small></span></Link><Link className="nav-item" href="/settings" title="Settings"><Settings size={18}/><span className="sidebar-label">Settings</span></Link><Link className="nav-item" href="/help" title="Help and handbook"><HelpCircle size={18}/><span className="sidebar-label">Help & handbook</span></Link><button className="sidebar-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><PanelLeftClose size={16}/><span className="sidebar-label">Collapse workspace</span></button></div>
    </aside>
  </>;
}
