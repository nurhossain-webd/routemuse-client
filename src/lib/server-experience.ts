import { cache } from "react";

import type { ApiSuccess } from "@/types/auth";
import type { Experience } from "@/types/experience";

interface ServerExperienceResult {
  status: number;
  experience?: Experience;
}

export const getServerExperience = cache(
  async (slug: string): Promise<ServerExperienceResult> => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

    try {
      const response = await fetch(
        `${apiUrl}/experiences/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );

      if (!response.ok) return { status: response.status };
      const payload = (await response.json()) as ApiSuccess<{
        experience: Experience;
      }>;
      return { status: 200, experience: payload.data.experience };
    } catch {
      return { status: 503 };
    }
  },
);
