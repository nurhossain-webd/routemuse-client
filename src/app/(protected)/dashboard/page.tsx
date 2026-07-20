import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
export const metadata: Metadata = { title: "Dashboard | RouteMuse AI", description: "Review your RouteMuse planning, favorites, creator activity, and travel interests." };
export default function Page() { return <DashboardPage/>; }
