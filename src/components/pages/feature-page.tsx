import { Construction } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

export function FeaturePage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <main className="bg-slate-50 py-12 sm:py-16"><ResponsiveContainer className="grid gap-10"><PageHeader eyebrow={eyebrow} title={title} description={description} /><EmptyState icon={Construction} title={`${title} is ready for its feature build`} description="This route and its shared interface foundation are complete. Product-specific workflows will be implemented in the next phase." /></ResponsiveContainer></main>;
}
