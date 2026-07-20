import { useId, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface SelectOption { value: string; label: string }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, error, options, placeholder, id, className, ...props }: SelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label htmlFor={inputId} className="grid gap-2 text-sm font-medium text-navy">
      {label}
      <select
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn("min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2", className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  );
}
