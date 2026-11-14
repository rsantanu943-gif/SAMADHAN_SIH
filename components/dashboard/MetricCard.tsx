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
        "bg-[#FAF8F1] border border-[#D5DDCB] p-5 rounded-xl shadow-[0_2px_10px_-3px_rgba(38,59,50,0.06)] flex flex-col justify-between gap-3 transition-all duration-200 hover:border-[#8FCDBB] hover:shadow-[0_10px_24px_-10px_rgba(38,59,50,0.12)]",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-[#68776A] uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-[#EAE2D2]/80 rounded-lg border border-[#D5DDCB]">
          <Icon className="w-4 h-4 text-[#263B32]" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="text-2xl lg:text-3xl font-bold text-[#263B32] tracking-tight tabular-nums">{value}</span>
        {change && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md border",
              trend === "up"
                ? "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]"
                : trend === "down"
                ? "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]"
                : "bg-[#EAE2D2] text-[#263B32] border-[#D5DDCB]"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
