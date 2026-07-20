import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer } from "../ui/responsive-container";

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-slate-300">
      <ResponsiveContainer className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div><p className="text-lg font-bold text-white">RouteMuse <span className="text-amber">AI</span></p><p className="mt-3 text-sm leading-6">Thoughtful travel discovery and planning, shaped around the way you want to experience the world.</p></div>
        <div><h2 className="font-semibold text-white">Explore</h2><ul className="mt-3 grid gap-2 text-sm"><li><Link className="hover:text-white" href="/">Home</Link></li><li><Link className="hover:text-white" href="/explore">Experiences</Link></li><li><Link className="hover:text-white" href="/about">About</Link></li><li><Link className="hover:text-white" href="/contact">Contact</Link></li></ul></div>
        <div><h2 className="font-semibold text-white">Support</h2><ul className="mt-3 grid gap-2 text-sm"><li><Link className="hover:text-white" href="/help">Help center</Link></li><li><Link className="hover:text-white" href="/privacy">Privacy</Link></li><li><Link className="hover:text-white" href="/terms">Terms</Link></li></ul></div>
        <div><h2 className="font-semibold text-white">Contact</h2><ul className="mt-3 grid gap-3 text-sm"><li><a className="flex gap-2 hover:text-white" href="mailto:hello@routemuse.ai"><Mail className="mt-0.5 size-4 shrink-0" />hello@routemuse.ai</a></li><li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />Dhaka, Bangladesh</li></ul></div>
      </ResponsiveContainer>
      <div className="border-t border-white/10"><ResponsiveContainer className="py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} RouteMuse AI. Built for responsible, memorable travel.</ResponsiveContainer></div>
    </footer>
  );
}
