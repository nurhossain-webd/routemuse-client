"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/context/auth-context";
import { getSafeRedirect } from "@/lib/safe-redirect";

export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const callback = new URLSearchParams(window.location.search).get("next");
      router.replace(getSafeRedirect(callback));
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="grid min-h-[55vh] place-items-center" role="status">
        <span className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <LoaderCircle className="size-5 animate-spin text-teal" aria-hidden />
          Checking your session…
        </span>
      </div>
    );
  }

  return children;
}
