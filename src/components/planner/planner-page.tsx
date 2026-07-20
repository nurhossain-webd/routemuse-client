"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, ChevronRight, Clock3, MapPin, MessageSquareText, Sparkles, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getApiErrorMessage } from "@/lib/api";
import type { PlanDetail, PlanSummary } from "@/types/trip-plan";

const formSchema = z.object({ destination: z.string().trim().min(2, "Enter a destination"), startDate: z.string().min(1, "Choose a start date"), endDate: z.string().min(1, "Choose an end date"), budget: z.coerce.number().positive("Enter a budget above zero"), groupSize: z.coerce.number().int().min(1).max(50), travelStyle: z.string().min(2), interests: z.string().trim().min(2, "Add at least one interest") }).refine((data) => data.endDate >= data.startDate, { path: ["endDate"], message: "End date must follow start date" });
type FormInput = z.input<typeof formSchema>;
type FormValues = z.infer<typeof formSchema>;
const stages = ["Understanding your preferences", "Finding matching experiences", "Balancing days and budget", "Saving your itinerary"];
const suggestions = ["Make it cheaper", "Add more nature activities", "Reduce walking", "Make the plan family-friendly"];

function Processing() {
  const [stage, setStage] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setStage((value) => Math.min(value + 1, stages.length - 1)), 1500); return () => window.clearInterval(timer); }, []);
  return <Card className="grid gap-4" role="status" aria-live="polite"><div className="flex items-center gap-3"><Sparkles className="animate-pulse text-teal"/><div><p className="font-semibold text-navy">RouteMuse is shaping your trip</p><p className="text-sm text-slate-600">This usually takes a few moments.</p></div></div><ol className="grid gap-2">{stages.map((label, index) => <li key={label} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${index <= stage ? "bg-teal/10 text-teal" : "text-slate-400"}`}>{index < stage ? <Check size={17}/> : <span className="grid size-5 place-items-center rounded-full border text-xs">{index + 1}</span>}{label}</li>)}</ol></Card>;
}

export function PlannerPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>();
  const [instruction, setInstruction] = useState("");
  const [lastInput, setLastInput] = useState<{ current: FormValues | null }>({ current: null });
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(formSchema), defaultValues: { groupSize: 2, travelStyle: "balanced", interests: "culture, food, nature" } });
  const listQuery = useQuery({ queryKey: ["trip-plans"], queryFn: async () => (await api.get<{ data: { plans: PlanSummary[] } }>("/ai/trip-plans")).data.data.plans });
  const detailQuery = useQuery({ queryKey: ["trip-plan", selectedId], enabled: Boolean(selectedId), queryFn: async () => (await api.get<{ data: PlanDetail }>(`/ai/trip-plans/${selectedId}`)).data.data });
  const createMutation = useMutation({ mutationFn: async (values: FormValues) => (await api.post<{ data: PlanDetail }>("/ai/trip-plans", { ...values, interests: values.interests.split(",").map((value) => value.trim()).filter(Boolean) })).data.data,
    onSuccess: (data) => { setSelectedId(data.plan._id); queryClient.setQueryData(["trip-plan", data.plan._id], data); void queryClient.invalidateQueries({ queryKey: ["trip-plans"] }); toast.success("Your trip plan is saved"); },
  });
  const refineMutation = useMutation({ mutationFn: async (value: string) => (await api.post<{ data: PlanDetail }>(`/ai/trip-plans/${selectedId}/refine`, { instruction: value })).data.data,
    onSuccess: (data) => { queryClient.setQueryData(["trip-plan", data.plan._id], data); setInstruction(""); void queryClient.invalidateQueries({ queryKey: ["trip-plans"] }); toast.success("Itinerary updated"); },
  });
  const deleteMutation = useMutation({ mutationFn: async () => api.delete(`/ai/trip-plans/${selectedId}`), onSuccess: () => { setSelectedId(undefined); void queryClient.invalidateQueries({ queryKey: ["trip-plans"] }); toast.success("Trip plan deleted"); } });
  const submit = (values: FormValues) => { setLastInput({ current: values }); createMutation.mutate(values); };
  const detail = detailQuery.data;
  const experienceMap = new Map(detail?.plan.selectedExperiences.map((experience) => [experience._id, experience]));

  return <main className="min-h-screen bg-slate-50 py-10"><ResponsiveContainer className="grid gap-8"><PageHeader eyebrow="Agentic planning" title="AI Trip Planner" description="Turn your dates, budget, pace, and interests into a grounded itinerary using real RouteMuse experiences." />
    <div className="grid items-start gap-6 xl:grid-cols-[360px_1fr]">
      <div className="grid gap-6 xl:sticky xl:top-24">
        <Card><form className="grid gap-4" onSubmit={handleSubmit(submit)}><h2 className="text-xl font-bold text-navy">Plan a new trip</h2><Input label="Destination" placeholder="Kyoto, Japan" error={errors.destination?.message} {...register("destination")}/><div className="grid grid-cols-2 gap-3"><Input type="date" label="Start date" error={errors.startDate?.message} {...register("startDate")}/><Input type="date" label="End date" error={errors.endDate?.message} {...register("endDate")}/></div><div className="grid grid-cols-2 gap-3"><Input type="number" min="1" label="Total budget (USD)" error={errors.budget?.message} {...register("budget")}/><Input type="number" min="1" max="50" label="Travelers" error={errors.groupSize?.message} {...register("groupSize")}/></div><Select label="Travel style" error={errors.travelStyle?.message} {...register("travelStyle")}><option value="balanced">Balanced</option><option value="relaxed">Relaxed</option><option value="adventurous">Adventurous</option><option value="luxury">Luxury</option><option value="budget">Budget-conscious</option></Select><Input label="Interests" placeholder="food, history, hiking" error={errors.interests?.message} {...register("interests")}/><Button type="submit" isLoading={createMutation.isPending}><Sparkles size={17}/>Generate & save plan</Button>{createMutation.isError && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700"><p>{getApiErrorMessage(createMutation.error)}</p><button type="button" className="mt-2 font-semibold underline" onClick={() => lastInput.current && createMutation.mutate(lastInput.current)}>Retry</button></div>}</form></Card>
        <Card className="grid gap-3"><h2 className="font-bold text-navy">Saved plans</h2>{listQuery.isLoading ? <><Skeleton className="h-16"/><Skeleton className="h-16"/></> : listQuery.isError ? <button className="text-left text-sm font-semibold text-teal" onClick={() => void listQuery.refetch()}>Could not load plans. Retry</button> : listQuery.data?.length ? listQuery.data.map((plan) => <button key={plan._id} onClick={() => setSelectedId(plan._id)} className={`flex min-h-14 items-center justify-between rounded-xl border p-3 text-left ${selectedId === plan._id ? "border-teal bg-teal/5" : "border-slate-200"}`}><span><span className="block font-semibold text-navy">{plan.title}</span><span className="text-xs text-slate-500">{plan.destination}</span></span><ChevronRight size={17}/></button>) : <p className="text-sm text-slate-600">Your generated trips will appear here.</p>}</Card>
      </div>
      <div className="grid gap-6">{createMutation.isPending || refineMutation.isPending ? <Processing/> : detailQuery.isLoading ? <><Skeleton className="h-48"/><Skeleton className="h-80"/></> : detailQuery.isError ? <Card><p className="text-red-700">{getApiErrorMessage(detailQuery.error)}</p><Button className="mt-4" onClick={() => void detailQuery.refetch()}>Retry</Button></Card> : detail ? <>
        <Card className="overflow-hidden bg-navy text-white"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="text-sm font-semibold text-amber">Saved itinerary</span><h2 className="mt-2 text-3xl font-bold">{detail.plan.title}</h2><p className="mt-2 text-slate-300">{detail.plan.destination}</p></div><Button variant="danger" onClick={() => { if (window.confirm("Delete this trip plan permanently?")) deleteMutation.mutate(); }} isLoading={deleteMutation.isPending}><Trash2 size={17}/>Delete</Button></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><span className="flex items-center gap-2"><CalendarDays size={18}/>{new Date(detail.plan.startDate).toLocaleDateString()} – {new Date(detail.plan.endDate).toLocaleDateString()}</span><span className="flex items-center gap-2"><Users size={18}/>{detail.plan.groupSize} travelers</span><span className="text-xl font-bold text-amber">${detail.plan.estimatedTotal.toLocaleString()}</span></div></Card>
        <Card><h3 className="text-lg font-bold text-navy">Why this plan fits</h3><p className="mt-2 leading-7 text-slate-600">{detail.plan.agentExplanation}</p><p className="mt-3 text-xs text-slate-500">AI-generated plans may need verification. Prices exclude travel and unlisted expenses.</p></Card>
        <section className="grid gap-4" aria-label="Day-by-day itinerary">{detail.plan.itineraryDays.map((day) => <Card key={`${day.dayNumber}-${day.date}`}><div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-4"><div><span className="text-sm font-bold text-teal">DAY {day.dayNumber} · {new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><h3 className="text-xl font-bold text-navy">{day.title}</h3></div><p className="text-sm text-slate-600">{day.summary}</p></div><div className="mt-4 grid gap-3">{day.items.map((item, index) => { const experience = item.experience ? experienceMap.get(item.experience) : undefined; return <div key={`${item.time}-${index}`} className="grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-[80px_1fr_auto]"><span className="flex items-center gap-1 text-sm font-semibold text-teal"><Clock3 size={15}/>{item.time}</span><div><h4 className="font-bold text-navy">{experience ? <Link className="hover:text-teal hover:underline" href={`/experiences/${experience.slug}`}>{item.title}</Link> : item.title}</h4><p className="mt-1 text-sm text-slate-600">{item.description}</p><span className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13}/>{item.location}</span></div><span className="text-sm font-semibold text-navy">${item.estimatedCost.toLocaleString()}</span></div>; })}</div></Card>)}</section>
        <Card><div className="flex items-center gap-2"><MessageSquareText className="text-teal"/><h3 className="text-lg font-bold text-navy">Refine with your planner</h3></div><div className="mt-4 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setInstruction(suggestion)} className="min-h-10 rounded-full border border-slate-300 px-3 text-sm hover:border-teal hover:text-teal">{suggestion}</button>)}</div><form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); if (instruction.trim().length >= 3) refineMutation.mutate(instruction.trim()); }}><Input aria-label="Refinement instruction" className="sm:min-w-96" placeholder="Replace the museum with an outdoor activity" value={instruction} onChange={(event) => setInstruction(event.target.value)}/><Button type="submit" disabled={instruction.trim().length < 3} isLoading={refineMutation.isPending}>Refine plan</Button></form>{refineMutation.isError && <p className="mt-3 text-sm text-red-700">{getApiErrorMessage(refineMutation.error)}</p>}<div className="mt-6 grid gap-3">{detail.conversation?.messages.map((message, index) => <div key={`${message.createdAt}-${index}`} className={`max-w-[90%] rounded-xl p-3 text-sm ${message.role === "user" ? "ml-auto bg-teal text-white" : "bg-slate-100 text-slate-700"}`}><span className="mb-1 block text-xs font-bold">{message.role === "user" ? "You" : "RouteMuse"}</span>{message.content}</div>)}</div></Card>
      </> : <EmptyState icon={<Sparkles/>} title="Your itinerary starts here" description="Complete the planner form and RouteMuse will combine matching experiences into a day-by-day plan." />}</div>
    </div></ResponsiveContainer></main>;
}
