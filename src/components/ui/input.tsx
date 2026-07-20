import { useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  return (
    <label htmlFor={inputId} className="grid gap-2 text-sm font-medium text-navy">
      {label}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-navy placeholder:text-slate-400",
          error ? "border-red-600" : "border-slate-300",
          className,
        )}
        {...props}
      />
      {error && <span id={errorId} className="text-sm text-red-700">{error}</span>}
    </label>
  );
}
