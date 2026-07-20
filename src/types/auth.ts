export interface TravelPreferences {
  preferredCategories: string[];
  preferredLocations: string[];
  budgetMin?: number;
  budgetMax?: number;
  travelStyle?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "user" | "admin";
  authProvider: "local" | "google";
  travelPreferences: TravelPreferences;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface AuthResult {
  token: string;
  user: User;
}
