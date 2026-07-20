import type { ReactNode } from "react";
import { Badge } from "./badge";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <Badge>{eyebrow}</Badge>}
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
