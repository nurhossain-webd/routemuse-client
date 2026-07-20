"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { currentUserQueryKey, useCurrentUserQuery } from "@/hooks/use-current-user";
import { api } from "@/lib/api";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  subscribeToAuthToken,
} from "@/lib/auth-token";
import type { User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user?: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = useSyncExternalStore(
    subscribeToAuthToken,
    getAccessToken,
    () => null,
  );
  const isClientReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const currentUser = useCurrentUserQuery(Boolean(token) && isClientReady);

  const signIn = useCallback(
    async (nextToken: string, user?: User) => {
      setAccessToken(nextToken);
      if (user) queryClient.setQueryData(currentUserQueryKey, user);
      else await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
    [queryClient],
  );

  const signOut = useCallback(async () => {
    try {
      if (getAccessToken()) await api.post("/auth/logout");
    } catch (error: unknown) {
      console.warn("Server logout could not be confirmed", error);
    } finally {
      clearAccessToken();
      queryClient.removeQueries({ queryKey: currentUserQueryKey });
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: currentUser.data ?? null,
      token,
      isAuthenticated: Boolean(token && currentUser.data),
      isLoading: !isClientReady || (Boolean(token) && currentUser.isLoading),
      signIn,
      signOut,
    }),
    [currentUser.data, currentUser.isLoading, isClientReady, signIn, signOut, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
