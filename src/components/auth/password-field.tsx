"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type InputHTMLAttributes } from "react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function PasswordField({
  label,
  error,
  id,
  className,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <label htmlFor={inputId} className="grid gap-2 text-sm font-medium text-navy">
      {label}
      <span className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-11 w-full rounded-xl border bg-white px-3 py-2 pr-12 text-navy placeholder:text-slate-400 ${error ? "border-red-600" : "border-slate-300"} ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-0 top-0 grid size-11 place-items-center rounded-xl text-slate-500 hover:text-navy"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </span>
      {error && (
        <span id={errorId} className="text-sm font-normal text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}
