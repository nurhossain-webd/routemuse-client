"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnlyRoute } from "@/components/auth/guest-only-route";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { api, getApiErrorMessage } from "@/lib/api";
import { getSafeRedirect } from "@/lib/safe-redirect";
import type { ApiSuccess, AuthResult } from "@/types/auth";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter at least 2 characters").max(80),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(72, "Password cannot exceed 72 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = getSafeRedirect(searchParams.get("next"));
  const loginHref = `/login?next=${encodeURIComponent(destination)}`;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const finishAuthentication = async (result: AuthResult) => {
    await signIn(result.token, result.user);
    toast.success(`Welcome to RouteMuse, ${result.user.name}`);
    router.replace(destination);
  };

  const registration = useMutation({
    mutationFn: async (values: RegisterValues) =>
      (
        await api.post<ApiSuccess<AuthResult>>("/auth/register", {
          name: values.name,
          email: values.email,
          password: values.password,
        })
      ).data.data,
    onSuccess: finishAuthentication,
  });
  const googleLogin = useMutation({
    mutationFn: async (idToken: string) =>
      (
        await api.post<ApiSuccess<AuthResult>>("/auth/google", { idToken })
      ).data.data,
    onSuccess: finishAuthentication,
  });

  const serverError = registration.isError
    ? getApiErrorMessage(registration.error)
    : googleLogin.isError
      ? getApiErrorMessage(googleLogin.error)
      : null;

  return (
    <GuestOnlyRoute>
      <AuthShell
        title="Create your account"
        description="Start saving experiences and shaping travel plans around what matters to you."
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
            registration.reset();
            googleLogin.reset();
            registration.mutate(values);
          })}
          noValidate
        >
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordField
            label="Confirm password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            isLoading={registration.isPending}
            disabled={googleLogin.isPending}
          >
            Create account
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />or register with
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credential) =>
              credential.credential
                ? googleLogin.mutate(credential.credential)
                : toast.error("Google did not return an ID token")
            }
            onError={() => toast.error("Google registration could not start")}
            useOneTap={false}
          />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href={loginHref} className="font-semibold text-teal hover:underline">
            Log in
          </Link>
        </p>
      </AuthShell>
    </GuestOnlyRoute>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[55vh] place-items-center text-slate-600">
          Loading registration…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
