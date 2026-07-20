import { ArrowUpRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Experience } from "@/types/experience";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card className="flex h-full min-h-[470px] flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
        {experience.imageUrls[0] ? <Image src={experience.imageUrls[0]} alt={`${experience.title} in ${experience.location}`} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw" className="object-cover transition duration-500 hover:scale-105" /> : <div className="grid h-full place-items-center text-sm text-slate-500">Image unavailable</div>}
        <Badge className="absolute left-3 top-3 bg-white/95 text-teal shadow-sm">{experience.category}</Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-1 text-slate-500"><MapPin className="size-4 text-teal" />{experience.location}, {experience.country}</span><span className="flex items-center gap-1 font-semibold text-navy"><Star className="size-4 fill-amber text-amber" />{experience.ratingCount > 0 ? experience.ratingAverage.toFixed(1) : "New"}</span></div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold text-navy">{experience.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{experience.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5"><p className="text-sm text-slate-500">From <strong className="block text-xl text-navy">${experience.price.toLocaleString()}</strong></p><Link href={`/experiences/${experience.slug}`} className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-teal px-3 text-sm font-semibold text-white hover:bg-teal/90">View Details <ArrowUpRight className="size-4" /></Link></div>
      </div>
    </Card>
  );
}
