"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { api, getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";

interface FavoriteRecord {
  _id: string;
  experience: Experience | string | null;
}

export function ExperienceActions({ experience }: { experience: Experience }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const favoritesKey = ["users", "me", "favorites"] as const;

  const favoritesQuery = useQuery({
    queryKey: favoritesKey,
    queryFn: async () =>
      (
        await api.get<ApiSuccess<{ favorites: FavoriteRecord[] }>>(
          "/users/me/favorites",
        )
      ).data.data.favorites,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const isFavorite =
    favoritesQuery.data?.some((favorite) => {
      if (typeof favorite.experience === "string") {
        return favorite.experience === experience._id;
      }
      return favorite.experience?._id === experience._id;
    }) ?? false;

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await api.delete(`/experiences/${experience._id}/favorite`);
      } else {
        await api.post(`/experiences/${experience._id}/favorite`);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: favoritesKey });
      toast.success(
        isFavorite ? "Experience removed from favorites" : "Experience saved",
      );
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleFavorite = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    favoriteMutation.mutate();
  };

  return (
    <div className="grid gap-3">
      <Button
        type="button"
        variant={isFavorite ? "secondary" : "outline"}
        isLoading={favoriteMutation.isPending || authLoading}
        onClick={handleFavorite}
        aria-pressed={isFavorite}
        className="w-full"
      >
        <Heart
          className={cn("size-4", isFavorite && "fill-current")}
          aria-hidden
        />
        {isFavorite ? "Saved to Favorites" : "Save Experience"}
      </Button>
      <Link
        href="/planner"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 font-semibold text-white hover:bg-teal/90"
      >
        <Sparkles className="size-4 text-amber" /> Add to AI Plan
      </Link>
    </div>
  );
}
