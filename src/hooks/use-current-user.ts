"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ApiSuccess, User } from "@/types/auth";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export const useCurrentUserQuery = (enabled: boolean) =>
  useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const response = await api.get<ApiSuccess<{ user: User }>>("/auth/me");
      return response.data.data.user;
    },
    enabled,
    retry: false,
    staleTime: 60_000,
  });
