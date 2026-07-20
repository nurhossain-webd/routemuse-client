import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "RouteMuse AI",
  description: "Agentic travel experience discovery and planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
