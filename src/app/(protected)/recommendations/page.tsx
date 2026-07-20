import type { Metadata } from "next";
import { RecommendationsPage } from "@/components/recommendations/recommendations-page";
export const metadata: Metadata = { title: "Recommendations | RouteMuse AI", description: "Personalized travel experiences ranked from your preferences and RouteMuse activity." };
export default function Page() { return <RecommendationsPage/>; }
