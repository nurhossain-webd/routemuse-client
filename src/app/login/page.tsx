"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Compass } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { api, getApiErrorMessage } from "@/lib/api";
import type { ApiSuccess, AuthResult } from "@/types/auth";

const loginSchema = z.object({ email: z.email("Enter a valid email address"), password: z.string().min(1, "Enter your password") });
type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const destination = nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const finishLogin = async (result: AuthResult) => {
    await signIn(result.token, result.user);
    toast.success("Welcome back");
    router.replace(destination);
  };

  const localLogin = useMutation({
    mutationFn: async (values: LoginValues) => (await api.post<ApiSuccess<AuthResult>>("/auth/login", values)).data.data,
    onSuccess: finishLogin,
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const googleLogin = useMutation({
    mutationFn: async (idToken: string) => (await api.post<ApiSuccess<AuthResult>>("/auth/google", { idToken })).data.data,
    onSuccess: finishLogin,
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <main className="grid flex-1 place-items-center bg-slate-50 px-4 py-16">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-teal text-white"><Compass /></span><h1 className="mt-5 text-2xl font-bold text-navy">Welcome back</h1><p className="mt-2 text-sm text-slate-600">Log in to plan, save, and manage your travel experiences.</p></div>
        <form className="mt-7 grid gap-5" onSubmit={handleSubmit((values) => localLogin.mutate(values))}>
          <Input label="Email address" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
          <Button type="submit" isLoading={localLogin.isPending}>Log in</Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-200" />or continue with<span className="h-px flex-1 bg-slate-200" /></div>
        <div className="flex justify-center"><GoogleLogin onSuccess={(credential) => credential.credential ? googleLogin.mutate(credential.credential) : toast.error("Google did not return an ID token")} onError={() => toast.error("Google login could not start")} useOneTap={false} /></div>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="grid min-h-[55vh] place-items-center text-slate-600">Loading login…</div>}><LoginForm /></Suspense>;
}
