import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExperienceDetail } from "@/components/experiences/experience-detail";
import { getServerExperience } from "@/lib/server-experience";

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { experience } = await getServerExperience(slug);

  if (!experience) {
    return {
      title: "Experience unavailable | RouteMuse AI",
      description: "This RouteMuse travel experience is currently unavailable.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${experience.title} | RouteMuse AI`;
  return {
    title,
    description: experience.shortDescription,
    keywords: [
      experience.category,
      experience.location,
      experience.country,
      "travel experience",
    ],
    openGraph: {
      title,
      description: experience.shortDescription,
      type: "article",
      images: experience.imageUrls[0]
        ? [{ url: experience.imageUrls[0], alt: experience.title }]
        : [],
    },
  };
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const result = await getServerExperience(slug);

  if (result.status === 404) notFound();

  return (
    <ExperienceDetail
      slug={slug}
      initialExperience={result.experience}
    />
  );
}
