import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <Icon className="mx-auto size-10 text-teal" aria-hidden />
      <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
