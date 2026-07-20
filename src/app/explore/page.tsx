import type { Metadata } from "next";
import { Suspense } from "react";

import { ExplorePageClient } from "@/components/explore/explore-page-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Explore Travel Experiences | RouteMuse AI",
  description:
    "Search and filter curated travel experiences by category, destination, price, rating, and more.",
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="h-10 max-w-md" />
          <Skeleton className="mt-4 h-6 max-w-2xl" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
            <Skeleton className="hidden h-[620px] lg:block" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-[470px]" />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <ExplorePageClient />
    </Suspense>
  );
}
