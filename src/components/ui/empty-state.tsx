import type { LucideIcon } from "lucide-react";
import { isValidElement, type ReactElement, type ReactNode } from "react";

export function EmptyState({ icon, title, description, action }: { icon: LucideIcon | ReactElement; title: string; description: string; action?: ReactNode }) {
  const renderedIcon = isValidElement(icon) ? icon : (() => { const Icon = icon; return <Icon className="mx-auto size-10 text-teal" aria-hidden />; })();
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto grid size-10 place-items-center text-teal">{renderedIcon}</div>
      <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
