"use client";

import { Compass, LogOut, Menu, Sparkles, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/cn";
import { ResponsiveContainer } from "../ui/responsive-container";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const authenticatedLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/planner", label: "AI Planner" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/experiences/new", label: "Add Experience" },
  { href: "/dashboard/experiences", label: "Manage Experiences" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  const logout = async () => {
    await signOut();
    setMobileOpen(false);
    toast.success("You have been logged out");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <ResponsiveContainer className="flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy" aria-label="RouteMuse AI home">
          <span className="grid size-10 place-items-center rounded-xl bg-teal text-white"><Compass className="size-5" /></span>
          <span>RouteMuse <span className="text-teal">AI</span></span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-navy", pathname === link.href && "bg-teal/10 text-teal")}>{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-navy hover:bg-slate-100"><UserRound className="size-4" />{user?.name ?? "Profile"}</Link>
              <button type="button" onClick={logout} className="grid size-11 place-items-center rounded-xl text-slate-600 hover:bg-slate-100" aria-label="Log out"><LogOut className="size-5" /></button>
            </>
          ) : <Link href="/login" className="inline-flex min-h-11 items-center rounded-xl bg-teal px-4 text-sm font-semibold text-white hover:bg-teal/90">Log in</Link>}
        </div>
        <button type="button" className="grid size-11 place-items-center rounded-xl text-navy hover:bg-slate-100 xl:hidden" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label="Toggle navigation" onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X /> : <Menu />}</button>
      </ResponsiveContainer>
      {mobileOpen && (
        <nav id="mobile-navigation" className="border-t bg-white px-4 py-4 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={cn("rounded-xl px-4 py-3 text-sm font-medium text-slate-700", pathname === link.href && "bg-teal/10 text-teal")}>{link.label}</Link>)}
            {isAuthenticated ? <><Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-700"><UserRound className="size-4" />Profile</Link><button type="button" onClick={logout} className="flex min-h-11 items-center gap-2 rounded-xl px-4 text-left text-sm font-medium text-slate-700"><LogOut className="size-4" />Log out</button></> : <Link href="/login" onClick={() => setMobileOpen(false)} className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal px-4 text-sm font-semibold text-white"><Sparkles className="size-4" />Log in</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
