import axios from "axios";

import { clearAccessToken, getAccessToken } from "./auth-token";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAccessToken();
    }
    return Promise.reject(error instanceof Error ? error : new Error("API request failed"));
  },
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
};
