"use client";

import {
  Bell,
  ChevronDown,
  Compass,
  Grid,
  Home,
  LogOut,
  Menu,
  PlusSquare,
  Search,
  Sparkles,
  User,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/cn";
import { ResponsiveContainer } from "../ui/responsive-container";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/planner", label: "AI Planner", icon: Sparkles },
  { href: "/recommendations", label: "Recommendations", icon: Grid },
];

const authenticatedLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/planner", label: "AI Planner", icon: Sparkles },
  { href: "/items/add", label: "Add Experience", icon: PlusSquare },
  { href: "/items/manage", label: "My Trips", icon: Grid },
  { href: "/dashboard", label: "Dashboard", icon: Grid },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  const logout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut();
    toast.success("You have been logged out");
  };

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm pr-15">
      <ResponsiveContainer className="flex h-20 items-center justify-between gap-4 px-0 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-slate-200/50 transition hover:bg-slate-50">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-teal/10 text-teal shadow-sm shadow-teal/10">
              <Compass className="size-5" />
            </span>
            <span>RouteMuse <span className="text-teal">AI</span></span>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-2 xl:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setProfileOpen(false)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition duration-150",
                  active
                    ? "bg-teal/10 text-teal"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy",
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 xl:inline-flex"
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>

          {isAuthenticated ? (
            <div className="relative hidden xl:flex xl:items-center xl:gap-2">
              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 xl:inline-flex"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute -mt-8 ml-3 inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
                  <User className="size-4" />
                </span>
                <span className="whitespace-nowrap">{user?.name ?? "Profile"}</span>
                <ChevronDown className="size-4 text-slate-600" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 xl:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden rounded-2xl bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal/20 transition hover:bg-teal/90 xl:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-navy xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </ResponsiveContainer>

      {mobileOpen && (
        <nav id="mobile-navigation" className="border-t bg-white px-4 py-5 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 pb-4">
              <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-teal/10 text-teal">
                  <Compass className="size-5" />
                </span>
                RouteMuse AI
              </Link>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-navy" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                <X />
              </button>
            </div>
            <div className="grid gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition",
                      pathname === link.href
                        ? "bg-teal/10 text-teal"
                        : "text-slate-700 hover:bg-white hover:text-navy",
                    )}
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <Icon className="size-4" />
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-700">
                      <User className="size-5" />
                    </span>
                    {user?.name ?? "Profile"}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-3 flex w-full items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 flex min-h-11 items-center justify-center rounded-3xl bg-teal px-4 py-3 text-sm font-semibold text-white hover:bg-teal/90"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
