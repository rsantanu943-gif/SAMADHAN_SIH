import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

export function Badge({ children, variant = "neutral", className, ...props }: BadgeProps) {
  const variants = {
    success: "bg-[#8FCDBB]/35 text-[#263B32] border-[#8FCDBB]",
    warning: "bg-[#F5E9D3] text-[#7A4E16] border-[#D8B989]",
    error: "bg-[#F5DDD9] text-[#5E1A14] border-[#DFACA5]",
    info: "bg-[#B7C9A8]/45 text-[#263B32] border-[#B7C9A8]",
    neutral: "bg-[#EAE2D2] text-[#263B32] border-[#D5DDCB]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#8FCDBB] focus:ring-offset-1",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
