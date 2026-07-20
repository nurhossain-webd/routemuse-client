import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Pagination({ page, totalPages, createHref }: { page: number; totalPages: number; createHref: (page: number) => string }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      {page > 1 ? <Link className="inline-flex min-h-11 items-center gap-1 rounded-xl border bg-white px-3 text-sm font-semibold text-navy" href={createHref(page - 1)}><ChevronLeft className="size-4" />Previous</Link> : <span />}
      <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
      {page < totalPages ? <Link className="inline-flex min-h-11 items-center gap-1 rounded-xl border bg-white px-3 text-sm font-semibold text-navy" href={createHref(page + 1)}>Next<ChevronRight className="size-4" /></Link> : <span />}
    </nav>
  );
}
