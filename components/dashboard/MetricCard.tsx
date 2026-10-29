import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  className?: string;
}

export function MetricCard({ title, value, change, trend, icon: Icon, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between gap-3 transition-all duration-200 hover:shadow-sm hover:border-slate-300",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-slate-100/80 rounded-lg border border-slate-200/50">
          <Icon className="w-4 h-4 text-amber-600" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{value}</span>
        {change && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md border",
              trend === "up" ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" : 
              trend === "down" ? "bg-red-50 text-red-700 border-red-200/80" : 
              "bg-slate-100 text-slate-700 border-slate-200"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
