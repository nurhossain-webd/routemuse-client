import type { ReactNode } from "react";
import { Badge } from "./badge";

export function PageHeader({ eyebrow, title, description, actions, className }: { eyebrow?: string; title: string; description: string; actions?: ReactNode; className?: string }) {
  return (
    <header className={`flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between ${className ?? ""}`}>
      <div className="max-w-3xl">
        {eyebrow && <Badge>{eyebrow}</Badge>}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
