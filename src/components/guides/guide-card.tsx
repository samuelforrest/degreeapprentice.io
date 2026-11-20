import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { GUIDE_TYPES, type Guide } from "@/lib/guides";
import { cn } from "@/lib/utils";

export function GuideCard({ guide, featured = false }: { guide: Guide; featured?: boolean }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-foreground/15 hover:bg-muted/40",
        featured && "gap-4 p-6 md:p-8",
      )}
    >
      <div className="flex items-center gap-2">
        <Badge variant={featured ? "default" : "secondary"}>{featured ? "Start here" : GUIDE_TYPES[guide.type].label}</Badge>
        <span className="text-xs text-muted-foreground">{guide.readingMinutes} min read</span>
      </div>
      <div className="space-y-1.5">
        <h3
          className={cn(
            "font-semibold leading-snug text-balance transition-colors group-hover:text-primary",
            featured && "text-xl tracking-tight md:text-2xl",
          )}
        >
          {guide.title}
        </h3>
        <p className={cn("text-sm text-muted-foreground", featured && "text-[15px]")}>{guide.description}</p>
      </div>
      <span className="mt-auto flex items-center gap-1 pt-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
        Read {GUIDE_TYPES[guide.type].label.toLowerCase()} <ArrowRightIcon className="size-3.5" aria-hidden />
      </span>
    </Link>
  );
}
