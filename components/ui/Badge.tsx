import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

export function Badge({ children, variant = "neutral", className, ...props }: BadgeProps) {
  const variants = {
    success: "bg-secondary-container text-on-secondary-container border-secondary/20",
    warning: "bg-orange-100 text-orange-900 border-orange-200",
    error: "bg-error-container text-on-error-container border-error/20",
    info: "bg-primary-container text-on-primary-container border-primary/20",
    neutral: "bg-surface-container text-on-surface border-outline/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
