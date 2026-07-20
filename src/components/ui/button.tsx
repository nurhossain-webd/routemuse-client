import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-teal text-white hover:bg-teal/90",
  secondary: "bg-amber text-navy hover:bg-amber/90",
  outline: "border border-slate-300 bg-white text-navy hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-navy",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

export function Button({
  className,
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Please wait…" : children}
    </button>
  );
}
