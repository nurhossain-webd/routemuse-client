"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/auth-context";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
          mutations: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "google-oauth-not-configured"
        }
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" closeButton />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
