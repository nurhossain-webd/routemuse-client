import type { Metadata } from "next";
import { HelpPage } from "@/components/help/help-page";
export const metadata: Metadata = { title: "Help | RouteMuse AI", description: "Find answers about RouteMuse discovery, accounts, AI planning, recommendations, and safety." };
export default function Page() { return <HelpPage/>; }
