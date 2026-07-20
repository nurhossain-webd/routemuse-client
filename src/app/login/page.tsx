"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FlaskConical } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnlyRoute } from "@/components/auth/guest-only-route";
import { GoogleCredentialButton } from "@/components/auth/google-credential-button";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { api, getApiErrorMessage } from "@/lib/api";
import { getSafeRedirect } from "@/lib/safe-redirect";
import type { ApiSuccess, AuthResult } from "@/types/auth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password").max(72),
});
type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = getSafeRedirect(searchParams.get("next"));
  const registerHref = `/register?next=${encodeURIComponent(destination)}`;
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
  const demoConfigured = Boolean(demoEmail && demoPassword);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const finishLogin = async (result: AuthResult) => {
    await signIn(result.token, result.user);
    toast.success(`Welcome back, ${result.user.name}`);
    router.replace(destination);
  };

  const localLogin = useMutation({
    mutationFn: async (values: LoginValues) =>
      (await api.post<ApiSuccess<AuthResult>>("/auth/login", values)).data.data,
    onSuccess: finishLogin,
  });
  const googleLogin = useMutation({
    mutationFn: async (idToken: string) =>
      (
        await api.post<ApiSuccess<AuthResult>>("/auth/google", { idToken })
      ).data.data,
    onSuccess: finishLogin,
  });

  const fillDemoCredentials = () => {
    if (!demoEmail || !demoPassword) {
      toast.error("Demo credentials are not configured for this environment");
      return;
    }
    reset({ email: demoEmail, password: demoPassword });
    localLogin.reset();
    setFocus("email");
    toast.success("Demo credentials filled. Select Log in to continue.");
  };

  const serverError = localLogin.isError
    ? getApiErrorMessage(localLogin.error)
    : googleLogin.isError
      ? getApiErrorMessage(googleLogin.error)
      : null;

  return (
    <GuestOnlyRoute>
      <AuthShell
        title="Welcome back"
        description="Log in to plan, save, review, and manage travel experiences."
      >
        {serverError && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {serverError}
          </div>
        )}

        <form
          className="mt-7 grid gap-5"
          onSubmit={handleSubmit((values) => {
            localLogin.reset();
            googleLogin.reset();
            localLogin.mutate(values);
          })}
          noValidate
        >
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            type="submit"
            isLoading={localLogin.isPending}
            disabled={googleLogin.isPending}
          >
            Log in
          </Button>
        </form>

        <button
          type="button"
          onClick={fillDemoCredentials}
          disabled={!demoConfigured || localLogin.isPending}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber/40 bg-amber/10 px-4 text-sm font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FlaskConical className="size-4" /> Use demo account
        </button>
        {!demoConfigured && (
          <p className="mt-2 text-center text-xs text-slate-500">
            Demo login is disabled until public demo variables are configured.
          </p>
        )}

        <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />or continue with
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <GoogleCredentialButton
          disabled={googleLogin.isPending || localLogin.isPending}
          onCredential={(credential) => googleLogin.mutate(credential)}
        />

        <p className="mt-6 text-center text-sm text-slate-600">
          New to RouteMuse?{" "}
          <Link href={registerHref} className="font-semibold text-teal hover:underline">
            Create an account
          </Link>
        </p>
      </AuthShell>
    </GuestOnlyRoute>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[55vh] place-items-center text-slate-600">
          Loading login…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
