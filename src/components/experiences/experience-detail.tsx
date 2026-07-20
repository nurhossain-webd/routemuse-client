"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";

export function ExperienceDetail({ slug }: { slug: string }) {
  const query = useQuery({
    queryKey: ["experiences", slug],
    queryFn: async () => (await api.get<ApiSuccess<{ experience: Experience }>>(`/experiences/${encodeURIComponent(slug)}`)).data.data.experience,
    retry: false,
  });

  if (query.isLoading) return <ResponsiveContainer className="py-14"><Skeleton className="h-12 max-w-2xl" /><Skeleton className="mt-6 aspect-[16/7]" /><Skeleton className="mt-6 h-36" /></ResponsiveContainer>;
  if (query.isError || !query.data) return <ResponsiveContainer className="py-14"><EmptyState icon={MapPin} title="Experience unavailable" description="This experience could not be loaded. It may have been archived or the API may be unavailable." action={<Link href="/explore" className="inline-flex min-h-11 items-center rounded-xl bg-teal px-4 font-semibold text-white">Back to Explore</Link>} /></ResponsiveContainer>;
  const experience = query.data;
  return <main className="bg-slate-50 py-10 sm:py-14"><ResponsiveContainer><Link href="/explore" className="text-sm font-semibold text-teal hover:underline">← Back to Explore</Link><div className="mt-5 grid gap-8 lg:grid-cols-[1fr_340px]"><div><h1 className="text-3xl font-bold tracking-tight text-navy sm:text-5xl">{experience.title}</h1><div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600"><span className="flex items-center gap-1"><MapPin className="size-4 text-teal" />{experience.location}, {experience.country}</span><span className="flex items-center gap-1"><Clock className="size-4 text-teal" />{experience.durationHours} hours</span><span className="flex items-center gap-1"><Star className="size-4 fill-amber text-amber" />{experience.ratingCount ? experience.ratingAverage.toFixed(1) : "New"}</span></div>{experience.imageUrls[0] && <div className="relative mt-7 aspect-[16/8] overflow-hidden rounded-2xl"><Image src={experience.imageUrls[0]} alt={experience.title} fill priority className="object-cover" /></div>}<p className="mt-7 text-lg leading-8 text-slate-700">{experience.fullDescription}</p><div className="mt-8 grid gap-5 md:grid-cols-2"><Card><h2 className="font-bold text-navy">Highlights</h2><ul className="mt-3 grid gap-2 text-sm text-slate-600">{experience.highlights.map((item) => <li key={item}>✓ {item}</li>)}</ul></Card><Card><h2 className="font-bold text-navy">What&apos;s included</h2><ul className="mt-3 grid gap-2 text-sm text-slate-600">{experience.included.map((item) => <li key={item}>✓ {item}</li>)}</ul></Card></div></div><Card className="h-fit lg:sticky lg:top-24"><p className="text-sm text-slate-500">Experience price</p><p className="mt-1 text-3xl font-bold text-navy">${experience.price.toLocaleString()}</p><p className="mt-3 text-sm leading-6 text-slate-600">Save this experience or include it when you build an AI-assisted itinerary.</p><Link href="/planner" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-teal px-4 font-semibold text-white">Plan with this experience</Link></Card></div></ResponsiveContainer></main>;
}
