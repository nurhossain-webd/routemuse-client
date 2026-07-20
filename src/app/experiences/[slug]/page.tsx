import type { Metadata } from "next";
import { ExperienceDetail } from "@/components/experiences/experience-detail";

export const metadata: Metadata = {
  title: "Travel Experience | RouteMuse AI",
  description: "Explore a curated RouteMuse AI travel experience and add it to your itinerary.",
};

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ExperienceDetail slug={slug} />;
}
