import type { Metadata } from "next";
import { PlannerPage } from "@/components/planner/planner-page";

export const metadata: Metadata = { title: "AI Trip Planner | RouteMuse AI", description: "Generate and refine a grounded day-by-day itinerary around your dates, budget, pace, and interests." };
export default function Page() { return <PlannerPage />; }
