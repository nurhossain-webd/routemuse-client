"use client";

import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const interests = {
  Culture: { place: "Kyoto", detail: "Temples before crowds · tea ceremony · local craft" },
  Nature: { place: "Reykjanes", detail: "Geothermal landscapes · coastal trails · geology" },
  Food: { place: "Old Dhaka", detail: "Heritage lanes · guided tastings · riverfront" },
  Adventure: { place: "Patagonia", detail: "Glacier viewpoints · guided hiking · small group" },
} as const;

type Interest = keyof typeof interests;

export function Hero() {
  const [interest, setInterest] = useState<Interest>("Culture");
  const selection = interests[interest];

  return (
    <section className="relative overflow-hidden bg-navy text-white lg:h-[70vh] lg:max-h-[680px]">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_15%_20%,#0f766e_0,transparent_35%),radial-gradient(circle_at_85%_75%,#f59e0b_0,transparent_25%)]" />
      <div className="relative mx-auto grid h-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-10">
        <div className="animate-reveal-up max-w-2xl">
          <Badge className="bg-white/10 text-amber ring-1 ring-white/15">Discover deeply. Plan confidently.</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Your next trip starts with the right experience.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Explore distinctive travel experiences, save what inspires you, and turn your choices into a practical AI-assisted itinerary built around your budget, pace, and interests.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/explore" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal px-5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal/90">Explore Experiences <ArrowRight className="size-4" /></Link>
            <Link href="/planner" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 font-semibold text-white transition hover:bg-white/15"><Sparkles className="size-4 text-amber" />Plan with AI</Link>
          </div>
        </div>

        <div className="animate-gentle-float rounded-2xl border border-white/15 bg-white/95 p-5 text-navy shadow-2xl shadow-black/20 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-teal uppercase">Muse preview</p><h2 className="mt-1 text-xl font-bold">What draws you in?</h2></div><span className="grid size-10 place-items-center rounded-xl bg-amber/20"><Sparkles className="size-5" /></span></div>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose a travel interest">
            {(Object.keys(interests) as Interest[]).map((item) => <button key={item} type="button" onClick={() => setInterest(item)} aria-pressed={interest === item} className={cn("min-h-10 rounded-full border px-3 text-sm font-semibold transition", interest === item ? "border-teal bg-teal text-white" : "border-slate-200 bg-white text-slate-600 hover:border-teal")}>{item}</button>)}
          </div>
          <div className="mt-5 rounded-2xl bg-slate-100 p-4">
            <div className="flex items-center gap-2 text-sm font-bold"><MapPin className="size-4 text-teal" />Suggested starting point</div>
            <p className="mt-3 text-2xl font-bold">{selection.place}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{selection.detail}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-white p-2"><strong className="block text-sm text-navy">3 days</strong>Balanced</div><div className="rounded-xl bg-white p-2"><strong className="block text-sm text-navy">4 stops</strong>Curated</div><div className="rounded-xl bg-white p-2"><strong className="block text-sm text-navy">1 plan</strong>Editable</div></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-slate-50 [clip-path:polygon(0_75%,100%_0,100%_100%,0_100%)]" aria-hidden />
    </section>
  );
}
