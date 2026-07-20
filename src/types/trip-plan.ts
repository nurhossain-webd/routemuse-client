export interface SelectedExperience { _id: string; title: string; slug: string; location: string; country: string; price: number; imageUrls: string[] }
export interface ItineraryItem { time: string; title: string; description: string; location: string; experience?: string; durationHours: number; estimatedCost: number }
export interface ItineraryDay { dayNumber: number; date: string; title: string; summary: string; items: ItineraryItem[] }
export interface TripPlan { _id: string; title: string; destination: string; startDate: string; endDate: string; budget: number; groupSize: number; travelStyle: string; interests: string[]; itineraryDays: ItineraryDay[]; selectedExperiences: SelectedExperience[]; estimatedTotal: number; agentExplanation: string; createdAt: string }
export interface PlannerMessage { role: "user" | "assistant"; content: string; createdAt: string }
export interface PlannerConversation { messages: PlannerMessage[] }
export interface PlanDetail { plan: TripPlan; conversation: PlannerConversation | null }
export interface PlanSummary { _id: string; title: string; destination: string; startDate: string; endDate: string; estimatedTotal: number; createdAt: string }
