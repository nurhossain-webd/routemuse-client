import { CheckCircle2, Compass, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="grid flex-1 bg-slate-50 lg:grid-cols-[minmax(0,.9fr)_minmax(480px,1.1fr)]">
      <section className="hidden bg-navy p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-teal">
            <Compass className="size-6" />
          </span>
          <p className="mt-8 text-sm font-bold tracking-widest text-amber uppercase">
            RouteMuse AI
          </p>
          <h2 className="mt-3 max-w-lg text-4xl font-bold leading-tight">
            Keep inspiration, planning, and personal preferences in one place.
          </h2>
        </div>
        <ul className="grid gap-4 text-sm text-slate-300">
          <li className="flex gap-3"><CheckCircle2 className="size-5 shrink-0 text-teal" />Save experiences that genuinely fit your trip.</li>
          <li className="flex gap-3"><Sparkles className="size-5 shrink-0 text-amber" />Build editable, constraint-aware AI itineraries.</li>
          <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-teal" />Keep control of your preferences and decisions.</li>
        </ul>
      </section>
      <section className="grid place-items-center px-4 py-12 sm:px-6 lg:py-16">
        <Card className="w-full max-w-md p-7 sm:p-8">
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-teal text-white lg:hidden">
              <Compass />
            </span>
            <h1 className="mt-5 text-2xl font-bold text-navy">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {children}
        </Card>
      </section>
    </main>
  );
}
