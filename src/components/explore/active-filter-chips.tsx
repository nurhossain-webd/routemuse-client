"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveFilterChip {
  key: string;
  value: string;
  label: string;
}

interface ActiveFilterChipsProps {
  filters: ActiveFilterChip[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({ filters, onRemove, onClearAll }: ActiveFilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map(({ key, label, value }) => (
        <Badge key={key} className="gap-2 rounded-full bg-white px-3 py-2 text-slate-700 ring-1 ring-slate-200">
          <span>{label}: {value}</span>
          <button
            type="button"
            onClick={() => onRemove(key)}
            aria-label={`Remove ${label.toLowerCase()} filter`}
            className="grid h-6 w-6 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-full px-3 py-2 text-sm font-semibold text-teal hover:bg-teal/10"
      >
        Clear all
      </button>
    </div>
  );
}
