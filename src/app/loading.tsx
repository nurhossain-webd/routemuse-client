import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
export default function Loading() { return <main className="bg-slate-50 py-16"><ResponsiveContainer><span className="sr-only">Loading page</span><Skeleton className="h-8 w-32" /><Skeleton className="mt-5 h-12 max-w-xl" /><Skeleton className="mt-4 h-6 max-w-2xl" /><div className="mt-10 grid gap-5 md:grid-cols-3">{[1,2,3].map((item) => <Skeleton key={item} className="h-48" />)}</div></ResponsiveContainer></main>; }
