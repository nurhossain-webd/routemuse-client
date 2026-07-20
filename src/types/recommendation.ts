import type { Experience } from "./experience";
export type RecommendationFeedback = "interested" | "not_interested" | "saved" | "opened";
export interface RankedRecommendation { experience: Experience; baseScore: number; matchScore: number; reason: string; scoreFactors: string[] }
export interface RecommendationResult { needsOnboarding: boolean; explanation: string; sessionId: string | null; recommendations: RankedRecommendation[] }
