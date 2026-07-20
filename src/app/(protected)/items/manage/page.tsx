"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getApiErrorMessage } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";

const mineQueryKey = ["experiences", "mine"] as const;

const formatCreatedDate = (value?: string): string =>
  value
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "Recently";

export default function ManageItemsPage() {
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null);

  const experiencesQuery = useQuery({
    queryKey: mineQueryKey,
    queryFn: async () =>
      (
        await api.get<ApiSuccess<{ experiences: Experience[] }>>(
          "/experiences/mine",
        )
      ).data.data.experiences,
  });

  const deleteExperience = useMutation({
    mutationFn: async (experienceId: string) => {
      await api.delete(`/experiences/${experienceId}`);
    },
    onSuccess: async () => {
      setPendingDelete(null);
      await queryClient.invalidateQueries({ queryKey: mineQueryKey });
      await queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast.success("Experience deleted");
    },
  });

  const experiences = experiencesQuery.data ?? [];
  const deletionError = deleteExperience.isError
    ? getApiErrorMessage(deleteExperience.error)
    : null;

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <ResponsiveContainer className="grid gap-9">
        <PageHeader
          eyebrow="Creator tools"
          title="Manage Experiences"
          description="View and maintain the travel experiences published from your account."
          actions={
            <Link
              href="/items/add"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal px-4 text-sm font-semibold text-white"
            >
              <Plus className="size-4" /> Add Experience
            </Link>
          }
        />

        {experiencesQuery.isLoading ? (
          <ManageLoading />
        ) : experiencesQuery.isError ? (
          <EmptyState
            icon={Trash2}
            title="Your experiences could not be loaded"
            description="The API could not return your creator catalog. Retry without leaving this page."
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
            icon={MapPin}
            title="You have not published an experience yet"
            description="Create your first detailed travel experience and it will appear here for ongoing management."
            action={
              <Link
                href="/items/add"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal px-4 font-semibold text-white"
              >
                <Plus className="size-4" /> Add your first experience
              </Link>
            }
          />
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Showing all {experiences.length} of your experiences. The current
              endpoint does not paginate creator results.
            </p>
            <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-card)] md:block">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-100 text-xs tracking-wider text-slate-600 uppercase">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Experience</th>
                    <th className="px-5 py-4 font-semibold">Location</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Created</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {experiences.map((experience) => (
                    <tr key={experience._id} className="align-top hover:bg-slate-50">
                      <td className="max-w-xs px-5 py-4">
                        <p className="font-semibold text-navy">{experience.title}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {experience.shortDescription}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {experience.location}, {experience.country}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-navy">
                        ${experience.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          className={
                            experience.status === "archived"
                              ? "bg-slate-200 text-slate-700"
                              : undefined
                          }
                        >
                          {experience.status ?? "published"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatCreatedDate(experience.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/experiences/${experience.slug}`}
                            className="grid size-11 place-items-center rounded-xl border bg-white text-teal hover:bg-teal/5"
                            aria-label={`View ${experience.title}`}
                          >
                            <Eye className="size-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              deleteExperience.reset();
                              setPendingDelete(experience);
                            }}
                            className="grid size-11 place-items-center rounded-xl border border-red-200 bg-white text-red-700 hover:bg-red-50"
                            aria-label={`Delete ${experience.title}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {experiences.map((experience) => (
                <Card key={experience._id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge>{experience.status ?? "published"}</Badge>
                      <h2 className="mt-3 text-lg font-bold text-navy">
                        {experience.title}
                      </h2>
                    </div>
                    <p className="font-bold text-navy">
                      ${experience.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {experience.shortDescription}
                  </p>
                  <p className="mt-3 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="size-4 text-teal" /> {experience.location},{" "}
                    {experience.country}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      href={`/experiences/${experience.slug}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-white text-sm font-semibold text-navy"
                    >
                      <Eye className="size-4" /> View
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        deleteExperience.reset();
                        setPendingDelete(experience);
                      }}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-700"
                    >
                      <Trash2 className="size-4" /> Delete
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </ResponsiveContainer>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => {
          if (!deleteExperience.isPending) setPendingDelete(null);
        }}
        title="Delete experience?"
      >
        <p className="text-sm leading-6 text-slate-600">
          {pendingDelete
            ? `“${pendingDelete.title}” and its reviews, favorites, and interaction history will be permanently deleted.`
            : "This experience will be permanently deleted."}
        </p>
        {deletionError && (
          <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
            {deletionError}
          </div>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPendingDelete(null)}
            disabled={deleteExperience.isPending}
          >
            Keep experience
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={deleteExperience.isPending}
            onClick={() => {
              if (pendingDelete) deleteExperience.mutate(pendingDelete._id);
            }}
          >
            Delete permanently
          </Button>
        </div>
      </Modal>
    </main>
  );
}

function ManageLoading() {
  return (
    <div>
      <div className="hidden overflow-hidden rounded-2xl border bg-white md:block">
        <Skeleton className="h-14 rounded-none" />
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="grid grid-cols-6 gap-5 border-t p-5">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:hidden">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-64" />
        ))}
      </div>
    </div>
  );
}
