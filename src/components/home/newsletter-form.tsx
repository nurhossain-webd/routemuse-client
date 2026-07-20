"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const newsletterSchema = z.object({ email: z.email("Enter a valid email address") });
type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  const submit = async ({ email }: NewsletterValues) => {
    await Promise.resolve();
    setSubmittedEmail(email);
    reset();
  };

  if (submittedEmail) {
    return <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 text-left" role="status"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber" /><div><p className="font-semibold text-white">You&apos;re on the RouteMuse list.</p><p className="mt-1 text-sm text-slate-300">We&apos;ll send product updates to {submittedEmail}. No booking spam.</p></div></div>;
  }

  return <form onSubmit={handleSubmit(submit)} className="grid gap-3 sm:grid-cols-[1fr_auto]" noValidate><Input aria-label="Email address" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} className="border-white/20 bg-white text-navy" {...register("email")} /><Button type="submit" variant="secondary" isLoading={isSubmitting} className="self-start"><Send className="size-4" />Join updates</Button></form>;
}
