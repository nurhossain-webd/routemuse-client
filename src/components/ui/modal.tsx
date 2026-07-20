"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/60 p-4" role="presentation" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-bold text-navy">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid size-11 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"><X className="size-5" /></button>
        </header>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  );
}
