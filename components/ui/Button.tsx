import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#263B32] text-[#FAF8F1] hover:bg-[#1D2E27] border border-[#263B32] shadow-xs",
    secondary: "bg-[#FAF8F1] border border-[#D5DDCB] text-[#263B32] hover:bg-[#EAE2D2] shadow-xs",
    destructive: "bg-[#8C2D25] text-[#FAF8F1] hover:bg-[#70221B] border border-[#8C2D25]",
    ghost: "text-[#263B32] hover:bg-[#EAE2D2]",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FCDBB] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
