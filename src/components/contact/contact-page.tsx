"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Textarea } from "@/components/ui/textarea";
import { api, getApiErrorMessage } from "@/lib/api";
const schema = z.object({ name: z.string().trim().min(2, "Enter your name").max(80), email: z.email("Enter a valid email"), subject: z.string().trim().min(3, "Add a subject").max(140), message: z.string().trim().min(10, "Please provide at least 10 characters").max(5000), website: z.string().max(0).optional() });
type Values = z.infer<typeof schema>;
export function ContactPage() { const [serverError, setServerError] = useState(""); const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { website: "" } }); const submit = async (values: Values) => { setServerError(""); try { await api.post("/contact", values); reset(); toast.success("Message received. Thank you for contacting RouteMuse."); } catch (error) { const message = getApiErrorMessage(error); setServerError(message); toast.error(message); } };
return <main className="bg-slate-50 py-12 sm:py-16"><ResponsiveContainer className="grid gap-10"><PageHeader eyebrow="Contact" title="Talk with the RouteMuse team" description="Ask for product help, share feedback, or report an issue with an experience or AI-generated plan."/><div className="grid items-start gap-6 lg:grid-cols-[0.7fr_1.3fr]"><div className="grid gap-4"><Card><Mail className="size-6 text-teal"/><h2 className="mt-4 font-bold text-navy">Email support</h2><a className="mt-2 block text-sm text-teal hover:underline" href="mailto:hello@routemuse.ai">hello@routemuse.ai</a><p className="mt-2 text-sm leading-6 text-slate-600">Or use the form. Messages are stored securely for the RouteMuse team to review; this prototype does not send an automatic email.</p></Card><Card><MapPin className="size-6 text-teal"/><h2 className="mt-4 font-bold text-navy">Product team</h2><p className="mt-2 text-sm text-slate-600">Dhaka, Bangladesh</p></Card></div><Card><h2 className="text-xl font-bold text-navy">Send a message</h2>{isSubmitSuccessful && <p role="status" className="mt-4 rounded-xl bg-teal/10 p-3 text-sm font-medium text-teal">Your message was successfully recorded.</p>}{serverError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{serverError}</p>}<form className="mt-5 grid gap-4" onSubmit={handleSubmit(submit)}><div className="hidden" aria-hidden><Input tabIndex={-1} autoComplete="off" label="Website" {...register("website")}/></div><div className="grid gap-4 sm:grid-cols-2"><Input label="Name" error={errors.name?.message} {...register("name")}/><Input type="email" label="Email" error={errors.email?.message} {...register("email")}/></div><Input label="Subject" error={errors.subject?.message} {...register("subject")}/><Textarea label="Message" rows={7} error={errors.message?.message} {...register("message")}/><Button type="submit" isLoading={isSubmitting}><Send size={17}/>Send message</Button></form></Card></div></ResponsiveContainer></main>; }
