"use client";

import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/context/auth-context";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
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
