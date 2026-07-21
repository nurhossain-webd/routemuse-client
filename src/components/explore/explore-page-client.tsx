"use client";

import { useQuery } from "@tanstack/react-query";
import { Compass, RefreshCw, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ExperienceCard } from "@/components/home/experience-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { ExperienceListData } from "@/types/experience";
import { AdvancedSearchModal } from "./advanced-search-modal";
import { ActiveFilterChips } from "./active-filter-chips";
import { ExploreSearchToolbar } from "./explore-search-toolbar";

const filterKeys = [
  "search",
  "category",
  "location",
  "country",
  "minPrice",
  "maxPrice",
  "minRating",
] as const;

const filterLabels: Record<(typeof filterKeys)[number], string> = {
  search: "Search",
  category: "Category",
  location: "Location",
  country: "Country",
  minPrice: "Min price",
  maxPrice: "Max price",
  minRating: "Rating",
};

const ExperienceSkeleton = () => (
  <div className="min-h-117.5 overflow-hidden rounded-2xl border bg-white">
    <Skeleton className="aspect-4/3 rounded-none" />
    <div className="space-y-4 p-5">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-7" />
      <Skeleton className="h-20" />
      <Skeleton className="mt-7 h-11" />
    </div>
  </div>
);

export function ExplorePageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const values = useMemo(() => new URLSearchParams(paramsString), [paramsString]);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(paramsString);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    const sort = values.get("sort");
    if (sort && sort !== "newest") next.set("sort", sort);
    router.push(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    setAdvancedSearchOpen(false);
  };

  const apiParams = useMemo(() => {
    const allowed = [
      ...filterKeys,
      "sort",
      "page",
    ] as const;
    const result: Record<string, string | number> = { limit: 12 };
    for (const key of allowed) {
      const value = values.get(key);
      if (value) result[key] = value;
    }
    if (!result.sort) result.sort = "newest";
    if (!result.page) result.page = 1;
    return result;
  }, [values]);

  const experiencesQuery = useQuery({
    queryKey: ["experiences", "explore", paramsString],
    queryFn: async () =>
      (
        await api.get<ApiSuccess<ExperienceListData>>("/experiences", {
          params: apiParams,
        })
      ).data.data,
    placeholderData: (previous) => previous,
  });

  const activeFilters = filterKeys.flatMap((key) => {
    const value = values.get(key);
    return value ? [{ key, value, label: filterLabels[key] }] : [];
  });
  const pagination = experiencesQuery.data?.pagination;
  const experiences = experiencesQuery.data?.experiences ?? [];
  const start = pagination && pagination.total > 0
    ? (pagination.page - 1) * pagination.limit + 1
    : 0;
  const end = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  const createPageHref = (page: number) => {
    const next = new URLSearchParams(paramsString);
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    return next.size ? `${pathname}?${next}` : pathname;
  };

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <ResponsiveContainer>
        <PageHeader
          className="border-b-0 pb-0"
          eyebrow="Discover"
          title="Explore travel experiences"
          description="Search the live RouteMuse catalog and narrow it by destination, category, budget, rating, and the order that matters to you."
        />

        <div className="mt-6 space-y-5">
          <ExploreSearchToolbar
            searchValue={values.get("search") ?? ""}
            onSearchChange={(value) => updateParam("search", value)}
            onSearchSubmit={() => updateParam("search", values.get("search") ?? "")}
            sortValue={values.get("sort") ?? "newest"}
            onSortChange={(value) => updateParam("sort", value)}
            activeFilterCount={activeFilters.length}
            onOpenAdvanced={() => setAdvancedSearchOpen(true)}
          />

          {activeFilters.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <ActiveFilterChips
                filters={activeFilters.map(({ key, label, value }) => ({ key, label, value: key === "minRating" ? `${value}+` : value }))}
                onRemove={(key) => updateParam(key, "")}
                onClearAll={clearFilters}
              />
            </div>
          )}

          <section className="min-w-0" aria-label="Experience results">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-navy" aria-live="polite">
                  {experiencesQuery.isLoading
                    ? "Loading experiences…"
                    : pagination
                      ? `Showing ${start}–${end} of ${pagination.total} experiences`
                      : "Experience results"}
                </p>
                {activeFilters.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeFilters.map(({ key, value, label }) => (
                      <Badge key={key} className="gap-1.5 bg-white text-slate-700 ring-1 ring-slate-200">
                        {label}: {key === "minRating" ? `${value}+` : value}
                        <button
                          type="button"
                          onClick={() => updateParam(key, "")}
                          aria-label={`Remove ${label.toLowerCase()} filter`}
                          className="rounded-full p-0.5 hover:bg-slate-100"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="min-h-8 px-2 text-xs font-semibold text-teal hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              {experiencesQuery.isLoading ? (
                <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }, (_, index) => (
                    <ExperienceSkeleton key={index} />
                  ))}
                </div>
              ) : experiencesQuery.isError ? (
                <EmptyState
                  icon={RefreshCw}
                  title="Experiences could not be loaded"
                  description="The API may be unavailable or a filter value may be invalid. Check the fields and try the request again."
                  action={
                    <button
                      type="button"
                      onClick={() => experiencesQuery.refetch()}
                      className="min-h-11 rounded-xl bg-teal px-4 font-semibold text-white"
                    >
                      Retry request
                    </button>
                  }
                />
              ) : experiences.length === 0 ? (
                <EmptyState
                  icon={Compass}
                  title="No experiences match these filters"
                  description="Try a broader destination, a different category, or a wider price and rating range."
                  action={
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="min-h-11 rounded-xl bg-teal px-4 font-semibold text-white"
                    >
                      Clear all filters
                    </button>
                  }
                />
              ) : (
                <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {experiences.map((experience) => (
                    <ExperienceCard key={experience._id} experience={experience} />
                  ))}
                </div>
              )}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  createHref={createPageHref}
                />
              </div>
            )}
          </section>
        </div>
      </ResponsiveContainer>

      <AdvancedSearchModal
        open={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
        values={values}
        onChange={updateParam}
        onSearchChange={(value) => updateParam("search", value)}
        onClear={clearFilters}
      />
    </main>
  );
}
