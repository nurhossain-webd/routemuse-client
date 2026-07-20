import type { Metadata } from "next";
import { Bike, Bot, Camera, ChevronRight, Compass, Footprints, Heart, Map, MessageSquareQuote, ShieldCheck, Sparkles, Star, Utensils, Waves } from "lucide-react";
import Link from "next/link";

import { FeaturedExperiences } from "@/components/home/featured-experiences";
import { Hero } from "@/components/home/hero";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

export const metadata: Metadata = {
  title: "RouteMuse AI | Discover Experiences & Plan Smarter Trips",
  description: "Discover distinctive travel experiences, receive personalized recommendations, and build practical AI-assisted itineraries with RouteMuse AI.",
  keywords: ["travel experiences", "AI trip planner", "personalized travel", "itinerary planner"],
  openGraph: {
    title: "RouteMuse AI — Travel inspiration, intelligently planned",
    description: "Explore distinctive experiences and turn them into a practical, personalized itinerary.",
    type: "website",
  },
};

const categories = [
  { name: "Culture", description: "Heritage, art, and traditions", icon: Camera },
  { name: "Food", description: "Markets, kitchens, and local tables", icon: Utensils },
  { name: "Hiking", description: "Trails with a sense of place", icon: Footprints },
  { name: "Wildlife", description: "Responsible encounters in nature", icon: Compass },
  { name: "Adventure", description: "Active days beyond the familiar", icon: Waves },
  { name: "Cycling", description: "Explore at a human pace", icon: Bike },
];

const faqs = [
  ["What makes RouteMuse different from a booking site?", "RouteMuse starts with experiences and personal fit. It helps you discover what is worth doing, organize your choices, and shape an itinerary; direct booking is not the core product."],
  ["Does the AI make decisions for me?", "No. It proposes an editable plan based on your dates, budget, interests, pace, and saved experiences. You stay in control and can review every suggestion."],
  ["Can I browse without creating an account?", "Yes. Public experiences and their details are open to everyone. An account is needed to save favorites, review experiences, receive recommendations, or create itineraries."],
  ["How are personalized recommendations created?", "Recommendations combine preferences you choose with explicit signals such as favorites, ratings, and itinerary additions. RouteMuse is designed to explain why an experience appears."],
  ["Are AI itineraries guaranteed to be accurate?", "No travel plan should be followed blindly. RouteMuse highlights that AI output needs review, especially for opening hours, transport, weather, entry rules, and safety conditions."],
] as const;

export default function Home() {
  return (
    <main>
      <Hero />

      <section className="bg-slate-50 py-16 sm:py-20">
        <ResponsiveContainer>
          <PageHeader eyebrow="Find your pace" title="Popular ways to experience a place" description="Start with the kind of day you want, then narrow by destination, price, duration, and rating." />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, description, icon: Icon }) => <Link key={name} href={`/explore?category=${encodeURIComponent(name)}`} className="group flex min-h-28 items-center gap-4 rounded-2xl border bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:border-teal"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal transition group-hover:bg-teal group-hover:text-white"><Icon className="size-6" /></span><span><strong className="block text-navy">{name}</strong><span className="mt-1 block text-sm text-slate-600">{description}</span></span><ChevronRight className="ml-auto size-5 text-slate-400 group-hover:text-teal" /></Link>)}
          </div>
        </ResponsiveContainer>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <ResponsiveContainer>
          <PageHeader eyebrow="Curated now" title="Featured experiences" description="Highly rated and newly published experiences from the RouteMuse catalog, loaded directly from the live API." actions={<Link href="/explore" className="inline-flex min-h-11 items-center gap-1 rounded-xl border bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50">View all <ChevronRight className="size-4" /></Link>} />
          <div className="mt-9"><FeaturedExperiences /></div>
        </ResponsiveContainer>
      </section>

      <section className="bg-slate-100 py-16 sm:py-20">
        <ResponsiveContainer>
          <PageHeader eyebrow="AI planner" title="From scattered ideas to one coherent trip" description="RouteMuse turns your preferences and saved experiences into a clear itinerary you can inspect, adjust, and keep." />
          <div className="relative mt-10 grid gap-5 lg:grid-cols-3">
            {[
              { step: "01", title: "Share the shape of your trip", text: "Add dates, budget, pace, interests, accessibility needs, and places already on your list.", icon: Map },
              { step: "02", title: "Muse assembles the route", text: "The planner searches compatible experiences, checks constraints, and arranges a practical day-by-day sequence.", icon: Bot },
              { step: "03", title: "Review and make it yours", text: "See the rationale, move or remove activities, and save a version that matches how you actually travel.", icon: Sparkles },
            ].map(({ step, title, text, icon: Icon }) => <Card key={step} className="relative"><span className="text-sm font-bold text-amber">STEP {step}</span><Icon className="mt-5 size-8 text-teal" /><h3 className="mt-4 text-xl font-bold text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></Card>)}
          </div>
          <div className="mt-8 text-center"><Link href="/planner" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-teal px-5 font-semibold text-white hover:bg-teal/90"><Sparkles className="size-4" />Start planning</Link></div>
        </ResponsiveContainer>
      </section>

      <section className="bg-navy py-14 text-white">
        <ResponsiveContainer className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[ ["9", "discovery filters"], ["6", "preference signals"], ["4", "planning inputs"], ["100%", "editable itineraries"] ].map(([value, label]) => <div key={label}><strong className="text-3xl font-bold text-amber sm:text-4xl">{value}</strong><p className="mt-2 text-sm text-slate-300">{label}</p></div>)}
        </ResponsiveContainer>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <ResponsiveContainer className="grid items-center gap-10 lg:grid-cols-2">
          <div><Badge>Personal to you</Badge><h2 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Recommendations that explain why they fit</h2><p className="mt-4 text-base leading-7 text-slate-600">RouteMuse uses preferences you control and signals you deliberately create. Every recommendation is designed to show its connection to your interests—not simply ask you to trust an algorithm.</p><Link href="/recommendations" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-teal px-5 font-semibold text-white">See your recommendations <ChevronRight className="size-4" /></Link></div>
          <Card className="relative overflow-hidden bg-slate-50 p-5 sm:p-7"><div className="absolute right-0 top-0 size-36 rounded-full bg-amber/15 blur-3xl" /><div className="relative flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-teal uppercase">92% match preview</p><h3 className="mt-2 text-xl font-bold text-navy">Srimangal Tea Gardens Cycling Day</h3></div><Heart className="size-6 text-teal" /></div><div className="relative mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-3 text-sm"><ShieldCheck className="size-5 text-teal" /><strong className="mt-2 block">Budget fit</strong><span className="text-slate-500">Within your range</span></div><div className="rounded-xl bg-white p-3 text-sm"><Bike className="size-5 text-teal" /><strong className="mt-2 block">Style fit</strong><span className="text-slate-500">Active and local</span></div><div className="rounded-xl bg-white p-3 text-sm"><Star className="size-5 text-amber" /><strong className="mt-2 block">Interest fit</strong><span className="text-slate-500">Nature + culture</span></div></div><p className="relative mt-5 rounded-xl border border-teal/15 bg-teal/5 p-4 text-sm leading-6 text-slate-700"><strong className="text-teal">Why this appears:</strong> You prefer cycling, quieter destinations, locally guided activities, and full-day experiences below $75.</p></Card>
        </ResponsiveContainer>
      </section>

      <section className="bg-slate-100 py-16 sm:py-20">
        <ResponsiveContainer><PageHeader eyebrow="Product feedback" title="What thoughtful travelers want RouteMuse to solve" description="These product-testing themes focus on concrete planning problems—not vague promises about effortless travel." /><div className="mt-9 grid gap-5 lg:grid-cols-3">{[
          ["“I want recommendations to tell me why they match—not just fill a feed with popular places.”", "Personalization review", "Frequent solo traveler"],
          ["“My plans break when every day is packed. Showing pace and travel time makes an itinerary feel usable.”", "Itinerary review", "Family trip organizer"],
          ["“Starting with experiences helps me understand a destination before I start comparing hotels and transport.”", "Discovery review", "Culture-focused traveler"],
        ].map(([quote, context, role]) => <Card key={context}><MessageSquareQuote className="size-7 text-teal" /><blockquote className="mt-5 text-base leading-7 text-navy">{quote}</blockquote><p className="mt-5 text-sm font-semibold text-teal">{context}</p><p className="text-xs text-slate-500">{role}</p></Card>)}</div></ResponsiveContainer>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <ResponsiveContainer className="max-w-4xl"><PageHeader eyebrow="Questions, answered" title="Plan with clarity" description="A few practical details about discovery, personalization, and AI-assisted planning." /><div className="mt-8 divide-y rounded-2xl border bg-white px-5 sm:px-7">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">{question}<span className="text-xl text-teal transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></ResponsiveContainer>
      </section>

      <section className="bg-teal py-16 text-white sm:py-20">
        <ResponsiveContainer className="grid items-center gap-8 lg:grid-cols-[1fr_.8fr]"><div><p className="text-sm font-bold tracking-widest text-amber uppercase">Stay close to the journey</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">New experiences and better planning tools, in one useful email.</h2><p className="mt-4 max-w-2xl leading-7 text-teal-50">Join for product updates, newly curated routes, and practical notes on using AI without losing the human side of travel.</p></div><NewsletterForm /></ResponsiveContainer>
      </section>
    </main>
  );
}
