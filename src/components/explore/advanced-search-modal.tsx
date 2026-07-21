"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExploreFilters } from "./explore-filters";

interface AdvancedSearchModalProps {
  open: boolean;
  onClose: () => void;
  values: URLSearchParams;
  onChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function AdvancedSearchModal({
  open,
  onClose,
  values,
  onChange,
  onSearchChange,
  onClear,
}: AdvancedSearchModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusableElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      trapFocus(event);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-navy/60 px-4 py-6 sm:px-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        ref={containerRef}
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-4xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-slate-500">Advanced Search</p>
            <h2 className="text-xl font-bold text-navy">Refine your results</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl text-slate-600 transition hover:bg-slate-100"
            aria-label="Close advanced search"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-164px)] overflow-y-auto px-6 py-6">
          <ExploreFilters
            values={values}
            onChange={onChange}
            onSearchChange={onSearchChange}
            onClear={onClear}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <Button type="button" variant="outline" onClick={onClear} className="w-full sm:w-auto">
            Reset Filters
          </Button>
          <Button type="button" variant="primary" onClick={onClose} className="w-full sm:w-auto">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
