"use client";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <main className="grid min-h-[60vh] place-items-center bg-slate-50 px-4 text-center"><div><AlertTriangle className="mx-auto size-12 text-amber" /><h1 className="mt-5 text-3xl font-bold text-navy">Something interrupted the journey</h1><p className="mt-3 text-slate-600">Please try this page again. If the problem continues, contact RouteMuse support.</p><Button className="mt-7" onClick={reset}>Try again</Button></div></main>; }
