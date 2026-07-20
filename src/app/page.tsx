import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

export default function Home() {
  return (
    <main className="bg-slate-50 py-20 sm:py-28">
      <ResponsiveContainer>
        <section className="mx-auto max-w-3xl text-center">
          <Badge>Travel with more intention</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-navy sm:text-6xl">Travel inspiration, intelligently planned.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">RouteMuse AI brings memorable experiences and practical planning into one calm, personal workspace.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/explore" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal px-5 font-semibold text-white hover:bg-teal/90">Explore experiences <ArrowRight className="size-4" /></Link><Link href="/about" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 font-semibold text-navy hover:bg-slate-100">How RouteMuse works</Link></div>
        </section>
        <Card className="mx-auto mt-14 flex max-w-2xl items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber/20 text-navy"><Compass /></span><div><h2 className="font-bold text-navy">Foundation ready</h2><p className="mt-1 text-sm leading-6 text-slate-600">The shared navigation, account state, API layer, and design system are in place. The complete landing experience will be built separately.</p></div></Card>
      </ResponsiveContainer>
    </main>
  );
}
