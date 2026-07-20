"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass, RefreshCw } from "lucide-react";

import { ExperienceCard } from "@/components/home/experience-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";

export function RelatedExperiences({ slug }: { slug: string }) {
  const query = useQuery({
    queryKey: ["experiences", slug, "related"],
    queryFn: async () =>
      (
        await api.get<ApiSuccess<{ experiences: Experience[] }>>(
          `/experiences/${encodeURIComponent(slug)}/related`,
        )
      ).data.data.experiences,
  });
  const experiences = query.data ?? [];

  return (
    <section aria-labelledby="related-heading" className="border-t pt-10">
      <p className="text-sm font-bold tracking-widest text-teal uppercase">
        Keep exploring
      </p>
      <h2 id="related-heading" className="mt-2 text-2xl font-bold text-navy">
        Related experiences
      </h2>
      <div className="mt-6">
        {query.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-[470px]" />
            ))}
          </div>
        ) : query.isError ? (
          <EmptyState
            icon={RefreshCw}
            title="Related experiences could not be loaded"
            description="You can retry this section without leaving the current experience."
            action={
              <button
                type="button"
                onClick={() => query.refetch()}
                className="min-h-11 rounded-xl bg-teal px-4 font-semibold text-white"
              >
                Retry related experiences
              </button>
            }
          />
        ) : experiences.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No related experiences yet"
            description="More experiences in this category or destination will appear here as the catalog grows."
          />
        ) : (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {experiences.slice(0, 4).map((experience) => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
