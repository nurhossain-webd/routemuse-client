"use client";

import { Compass, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { ExperienceListData } from "@/types/experience";
import { ExperienceCard } from "./experience-card";

const ExperienceSkeleton = () => <div className="min-h-[470px] overflow-hidden rounded-2xl border bg-white"><Skeleton className="aspect-[4/3] rounded-none" /><div className="space-y-4 p-5"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-7" /><Skeleton className="h-20" /><Skeleton className="mt-8 h-11" /></div></div>;

export function FeaturedExperiences() {
  const query = useQuery({
    queryKey: ["experiences", "featured"],
    queryFn: async () => (await api.get<ApiSuccess<ExperienceListData>>("/experiences", { params: { sort: "rating", page: 1, limit: 4 } })).data.data,
  });

  if (query.isLoading) return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading featured experiences">{[0, 1, 2, 3].map((item) => <ExperienceSkeleton key={item} />)}</div>;
  if (query.isError) return <EmptyState icon={RefreshCw} title="Featured experiences could not be loaded" description="Check that the RouteMuse API is running, then try this section again." action={<button type="button" onClick={() => query.refetch()} className="min-h-11 rounded-xl bg-teal px-4 font-semibold text-white">Try again</button>} />;
  const experiences = query.data?.experiences.slice(0, 4) ?? [];
  if (experiences.length === 0) return <EmptyState icon={Compass} title="Curated experiences are on the way" description="The experience catalog is currently empty. Seed or publish experiences in the API to feature them here." action={<Link href="/explore" className="inline-flex min-h-11 items-center rounded-xl bg-teal px-4 font-semibold text-white">Open Explore</Link>} />;
  return <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">{experiences.map((experience) => <ExperienceCard key={experience._id} experience={experience} />)}</div>;
}
