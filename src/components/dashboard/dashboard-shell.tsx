"use client";

import {
  ArrowLeft,
  Bell,
  Compass,
  LayoutDashboard,
  Map,
  Search,
  Sparkles,
  Star,
  Ticket,
  User,
  UserCircle2,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/cn";

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Trips", icon: Ticket },
  { href: "/planner", label: "AI Planner", icon: Sparkles },
  { href: "/explore", label: "Destinations", icon: Compass },
  { href: "/explore", label: "Saved Places", icon: Star },
  { href: "/planner", label: "Bookings", icon: Map },
  { href: "/dashboard", label: "Reviews", icon: Bell },
  { href: "/help", label: "Community", icon: UserCircle2 },
  { href: "/profile", label: "Settings", icon: Wrench },
];

export function DashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const userName = user?.name ?? "Traveler";

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <Link href="/" className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-3xl bg-teal/10 text-teal shadow-sm shadow-teal/10">
                  <Compass className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">RouteMuse AI</p>
                  <p className="text-sm text-slate-500">Travel dashboard</p>
                </div>
              </div>
            </Link>

              <div className="mt-8 space-y-2">
                {dashboardLinks.map((link) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition",
                        active
                          ? "bg-teal/10 text-teal"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                        <Icon className="size-4" />
                      </span>
                      <span className="whitespace-nowrap">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-3xl bg-teal/10 text-teal">
                  <Sparkles className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">RouteMuse Pro</p>
                  <p className="mt-1 text-sm text-slate-500">Unlock offline maps, price alerts, and AI recommendations.</p>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-teal px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition hover:bg-teal/90"
              >
                Upgrade now
              </Link>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Account</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-700">
                  <User className="size-6" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{userName}</p>
                  <p className="text-sm text-slate-500">Premium Member</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <label htmlFor="dashboard-search" className="sr-only">
                    Search
                  </label>
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                    <Search className="size-5 text-slate-400" />
                    <input
                      id="dashboard-search"
                      type="search"
                      placeholder="Search destinations, trips, or experiences..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/planner"
                    className="inline-flex items-center gap-2 rounded-3xl bg-teal px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition hover:bg-teal/90"
                  >
                    + New Trip
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                    aria-label="Notifications"
                  >
                    <Bell className="size-5" />
                  </button>
                  <Link
                    href="/profile"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-700"
                    aria-label="Profile"
                  >
                    <span className="sr-only">Profile</span>
                    <UserCircle2 className="size-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Welcome back</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {userName}! 👋</h1>
                  <p className="mt-2 text-sm text-slate-600">Here’s what’s happening with your travel plans.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Total Trips</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">7</p>
                    <p className="mt-1 text-sm text-slate-500">2 upcoming</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Saved Places</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">23</p>
                    <p className="mt-1 text-sm text-slate-500">3 new added</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Reviews</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">12</p>
                    <p className="mt-1 text-sm text-slate-500">2 this month</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Countries</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">4</p>
                    <p className="mt-1 text-sm text-slate-500">Explored</p>
                  </div>
                </div>
              </div>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
