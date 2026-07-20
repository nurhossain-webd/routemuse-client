import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";
export const metadata: Metadata = { title: "Contact | RouteMuse AI", description: "Contact RouteMuse AI about product support, feedback, or published travel experiences." };
export default function Page() { return <ContactPage/>; }
