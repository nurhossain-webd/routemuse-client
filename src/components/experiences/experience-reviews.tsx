"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { api, getApiErrorMessage } from "@/lib/api";
import type { ApiSuccess } from "@/types/auth";
import type { Experience, ReviewListData } from "@/types/experience";

const reviewFormSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating").max(5),
  comment: z
    .string()
    .trim()
    .min(3, "Write at least 3 characters")
    .max(2_000, "Keep your review under 2,000 characters"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

const getReviewerId = (user: ReviewListData["reviews"][number]["user"]) =>
  typeof user === "string" ? user : user._id;

const getReviewerName = (
  user: ReviewListData["reviews"][number]["user"],
) => (typeof user === "string" ? "RouteMuse traveler" : user.name);

export function ExperienceReviews({ experience }: { experience: Experience }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const reviewsKey = ["experiences", experience._id, "reviews"] as const;
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ReviewFormValues>({
      resolver: zodResolver(reviewFormSchema),
      defaultValues: { rating: 5, comment: "" },
    });

  const reviewsQuery = useQuery({
    queryKey: reviewsKey,
    queryFn: async () => {
      const firstPage = (
        await api.get<ApiSuccess<ReviewListData>>(
          `/experiences/${experience._id}/reviews`,
          { params: { page: 1, limit: 100 } },
        )
      ).data.data;

      if (firstPage.pagination.totalPages <= 1) return firstPage;

      const remainingPages = await Promise.all(
        Array.from(
          { length: firstPage.pagination.totalPages - 1 },
          async (_, index) =>
            (
              await api.get<ApiSuccess<ReviewListData>>(
                `/experiences/${experience._id}/reviews`,
                { params: { page: index + 2, limit: 100 } },
              )
            ).data.data.reviews,
        ),
      );

      return {
        ...firstPage,
        reviews: [firstPage.reviews, ...remainingPages].flat(),
      };
    },
  });

  const hasReviewed =
    Boolean(user) &&
    (reviewsQuery.data?.reviews.some(
      (review) => getReviewerId(review.user) === user?.id,
    ) ?? false);
  const reviews = reviewsQuery.data?.reviews ?? [];

  const reviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) =>
      api.post(`/experiences/${experience._id}/reviews`, values),
    onSuccess: async () => {
      reset();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reviewsKey }),
        queryClient.invalidateQueries({
          queryKey: ["experiences", experience.slug],
        }),
      ]);
      toast.success("Your review has been published");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <section aria-labelledby="reviews-heading" className="border-t pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold tracking-widest text-teal uppercase">
            Traveler feedback
          </p>
          <h2 id="reviews-heading" className="mt-2 text-2xl font-bold text-navy">
            Ratings and reviews
          </h2>
        </div>
        <div className="flex items-center gap-2 text-navy">
          <Star className="size-5 fill-amber text-amber" />
          <strong className="text-xl">
            {experience.ratingCount > 0
              ? experience.ratingAverage.toFixed(1)
              : "New"}
          </strong>
          <span className="text-sm text-slate-500">
            ({experience.ratingCount} reviews)
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <h3 className="font-bold text-navy">Share your experience</h3>
          {!isAuthenticated ? (
            <div className="mt-4 text-sm leading-6 text-slate-600">
              <p>Log in to publish a rating and review.</p>
              <Link
                href={`/login?next=${encodeURIComponent(`/experiences/${experience.slug}`)}`}
                className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-teal px-4 font-semibold text-white"
              >
                Log in to review
              </Link>
            </div>
          ) : hasReviewed ? (
            <div className="mt-4 rounded-xl bg-teal/10 p-4 text-sm leading-6 text-teal">
              You have already reviewed this experience. RouteMuse permits one
              review per traveler.
            </div>
          ) : (
            <form
              className="mt-5 grid gap-4"
              onSubmit={handleSubmit((values) => reviewMutation.mutate(values))}
            >
              <Select
                label="Rating"
                options={[5, 4, 3, 2, 1].map((rating) => ({
                  value: String(rating),
                  label: `${rating} star${rating === 1 ? "" : "s"}`,
                }))}
                error={errors.rating?.message}
                {...register("rating", { valueAsNumber: true })}
              />
              <Textarea
                label="Review"
                placeholder="What was useful, memorable, or important for another traveler to know?"
                error={errors.comment?.message}
                {...register("comment")}
              />
              <Button
                type="submit"
                isLoading={reviewMutation.isPending}
                disabled={reviewsQuery.isLoading || hasReviewed}
              >
                Publish review
              </Button>
            </form>
          )}
        </Card>

        <div>
          {reviewsQuery.isLoading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-36" />
              ))}
            </div>
          ) : reviewsQuery.isError ? (
            <EmptyState
              icon={MessageSquare}
              title="Reviews could not be loaded"
              description="The experience is available, but its reviews could not be retrieved right now."
              action={
                <button
                  type="button"
                  onClick={() => reviewsQuery.refetch()}
                  className="min-h-11 rounded-xl bg-teal px-4 font-semibold text-white"
                >
                  Retry reviews
                </button>
              }
            />
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No reviews yet"
              description="Be the first traveler to share a useful, specific review of this experience."
            />
          ) : (
            <div className="grid gap-4">
              {reviews.slice(0, 8).map((review) => (
                <Card key={review._id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-teal/10 font-bold text-teal">
                        {getReviewerName(review.user).charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-navy">
                          {getReviewerName(review.user)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                          }).format(new Date(review.createdAt))}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-bold text-navy">
                      <Star className="size-4 fill-amber text-amber" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
