"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Globe2,
  MapPin,
  RefreshCw,
  Star,
  Tag,
  UserRound,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";
import { ExperienceActions } from "./experience-actions";
import { ExperienceGallery } from "./experience-gallery";
import { ExperienceReviews } from "./experience-reviews";
import { RelatedExperiences } from "./related-experiences";

interface ExperienceDetailProps {
  slug: string;
  initialExperience?: Experience;
}

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(value));

export function ExperienceDetail({
  slug,
  initialExperience,
}: ExperienceDetailProps) {
  const query = useQuery({
    queryKey: ["experiences", slug],
    queryFn: async () =>
      (
        await api.get<ApiSuccess<{ experience: Experience }>>(
          `/experiences/${encodeURIComponent(slug)}`,
        )
      ).data.data.experience,
    initialData: initialExperience,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    retry: false,
  });

  if (query.isLoading) {
    return (
      <ResponsiveContainer className="py-12">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-6 h-14 max-w-3xl" />
        <Skeleton className="mt-7 aspect-[16/8]" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </ResponsiveContainer>
    );
  }

  if (query.isError || !query.data) {
    const notFound = axios.isAxiosError(query.error) && query.error.response?.status === 404;
    return (
      <ResponsiveContainer className="py-14">
        <EmptyState
          icon={notFound ? MapPin : RefreshCw}
          title={notFound ? "Experience not found" : "Experience could not be loaded"}
          description={
            notFound
              ? "This experience may have been archived or the link may be incorrect."
              : "The RouteMuse API could not return this experience. Retry the request or continue exploring."
          }
          action={
            <div className="flex flex-wrap justify-center gap-3">
              {!notFound && (
                <button
                  type="button"
                  onClick={() => query.refetch()}
                  className="min-h-11 rounded-xl bg-teal px-4 font-semibold text-white"
                >
                  Retry request
                </button>
              )}
              <Link
                href="/explore"
                className="inline-flex min-h-11 items-center rounded-xl border bg-white px-4 font-semibold text-navy"
              >
                Back to Explore
              </Link>
            </div>
          }
        />
      </ResponsiveContainer>
    );
  }

  const experience = query.data;
  const creator =
    typeof experience.creator === "object" ? experience.creator : undefined;

  return (
    <main className="bg-slate-50 py-8 sm:py-12">
      <ResponsiveContainer className="grid gap-10">
        <Link
          href="/explore"
          className="w-fit text-sm font-semibold text-teal hover:underline"
        >
          ← Back to Explore
        </Link>

        <ExperienceGallery
          key={experience.slug}
          images={experience.imageUrls}
          title={experience.title}
        />

        <section
          aria-labelledby="experience-title"
          className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <div>
            <Badge>{experience.category}</Badge>
            <h1
              id="experience-title"
              className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-5xl"
            >
              {experience.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              {experience.shortDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-teal" />
                {experience.location}, {experience.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal" />
                {experience.durationHours} hours
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber text-amber" />
                {experience.ratingCount > 0
                  ? `${experience.ratingAverage.toFixed(1)} (${experience.ratingCount})`
                  : "Not yet rated"}
              </span>
            </div>
          </div>

          <Card className="lg:sticky lg:top-24">
            <p className="text-sm text-slate-500">Experience price</p>
            <p className="mt-1 text-3xl font-bold text-navy">
              ${experience.price.toLocaleString()}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Save this experience or carry it into an editable AI-assisted plan.
            </p>
            <div className="mt-6">
              <ExperienceActions experience={experience} />
            </div>
          </Card>
        </section>

        <section aria-labelledby="overview-heading" className="border-t pt-10">
          <p className="text-sm font-bold tracking-widest text-teal uppercase">
            The experience
          </p>
          <h2 id="overview-heading" className="mt-2 text-2xl font-bold text-navy">
            Full overview
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-700">
            {experience.fullDescription}
          </p>
        </section>

        <section aria-labelledby="highlights-heading" className="border-t pt-10">
          <h2 id="highlights-heading" className="text-2xl font-bold text-navy">
            Highlights
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experience.highlights.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border bg-white p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" />
                <span className="text-sm leading-6 text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="inclusions-heading"
          className="grid gap-5 border-t pt-10 md:grid-cols-2"
        >
          <Card>
            <h2 id="inclusions-heading" className="text-xl font-bold text-navy">
              What&apos;s included
            </h2>
            <ul className="mt-5 grid gap-3">
              {experience.included.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="size-5 shrink-0 text-teal" /> {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-navy">What&apos;s excluded</h2>
            {experience.excluded.length > 0 ? (
              <ul className="mt-5 grid gap-3">
                {experience.excluded.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-700">
                    <XCircle className="size-5 shrink-0 text-slate-400" /> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-slate-600">
                No exclusions have been specified by the creator.
              </p>
            )}
          </Card>
        </section>

        <section aria-labelledby="information-heading" className="border-t pt-10">
          <h2 id="information-heading" className="text-2xl font-bold text-navy">
            Key information
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Category", value: experience.category, icon: Tag },
              { label: "Location", value: experience.location, icon: MapPin },
              { label: "Country", value: experience.country, icon: Globe2 },
              {
                label: "Duration",
                value: `${experience.durationHours} hours`,
                icon: Clock,
              },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="p-5">
                <Icon className="size-6 text-teal" />
                <p className="mt-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-navy">{value}</p>
              </Card>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="availability-heading"
          className="grid gap-5 border-t pt-10 md:grid-cols-[1fr_1.2fr]"
        >
          <div>
            <p className="text-sm font-bold tracking-widest text-teal uppercase">
              Plan ahead
            </p>
            <h2 id="availability-heading" className="mt-2 text-2xl font-bold text-navy">
              Availability dates
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Availability indicates the creator&apos;s current operating window.
              Confirm exact schedules before travel.
            </p>
          </div>
          <Card className="grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarDays className="size-6 shrink-0 text-teal" />
              <div><p className="text-xs text-slate-500 uppercase">Available from</p><p className="mt-1 font-semibold text-navy">{formatDate(experience.availableFrom)}</p></div>
            </div>
            <div className="flex gap-3">
              <CalendarDays className="size-6 shrink-0 text-teal" />
              <div><p className="text-xs text-slate-500 uppercase">Available through</p><p className="mt-1 font-semibold text-navy">{formatDate(experience.availableTo)}</p></div>
            </div>
          </Card>
        </section>

        <section aria-labelledby="creator-heading" className="border-t pt-10">
          <Card className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
              <UserRound className="size-7" />
            </span>
            <div>
              <p className="text-xs font-bold tracking-widest text-teal uppercase">
                Experience creator
              </p>
              <h2 id="creator-heading" className="mt-1 text-xl font-bold text-navy">
                {creator?.name ?? "RouteMuse community creator"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Published this experience for travelers to discover and plan.
              </p>
            </div>
          </Card>
        </section>

        <ExperienceReviews experience={experience} />
        <RelatedExperiences slug={experience.slug} />
      </ResponsiveContainer>
    </main>
  );
}
