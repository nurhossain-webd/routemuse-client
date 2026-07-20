import { useId, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label htmlFor={inputId} className="grid gap-2 text-sm font-medium text-navy">
      {label}
      <textarea
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-32 w-full resize-y rounded-xl border bg-white px-3 py-2 text-navy placeholder:text-slate-400",
          error ? "border-red-600" : "border-slate-300",
          className,
        )}
        {...props}
      />
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  );
}
