import {
  ArrowRightIcon,
  GitPullRequestIcon,
  HeartHandshakeIcon,
  LayersIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";

import { ClosingSoon } from "@/components/apprenticeships/closing-soon";
import { SectorIcon } from "@/components/apprenticeships/sector-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApprenticeships, toSummary } from "@/lib/apprenticeships";
import { SECTORS } from "@/lib/taxonomy";

const PROMISES = [
  {
    icon: ShieldCheckIcon,
    title: "Free for students, forever",
    body: "No paywall, no premium tier, no sign-up. We never sell your data.",
  },
  {
    icon: LayersIcon,
    title: "Everything in one place",
    body: "Every Level 6 and 7 degree apprenticeship in the UK, with salaries, deadlines and entry requirements.",
  },
  {
    icon: GitPullRequestIcon,
    title: "Open data, checked by people",
    body: "Every listing links to its official source and shows when it was last verified.",
  },
];

export default function HomePage() {
  const apprenticeships = getApprenticeships();
  // Send the browser only the next 50 deadlines as of this build; it then picks
  // the ones still open today. Keeps the home page small as listings grow.
  const buildDay = new Date().toISOString().slice(0, 10);
  const upcoming = apprenticeships
    .filter((o) => o.closes && o.closes >= buildDay)
    .sort((a, b) => a.closes!.localeCompare(b.closes!))
    .slice(0, 50)
    .map(toSummary);
  // Sectors with listings, biggest first.
  const sectors = SECTORS.map((name) => ({
    name,
    count: apprenticeships.filter((o) => o.sectors.includes(name)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-16">
      <section className="mx-auto max-w-3xl space-y-8 pt-8 text-center md:pt-16">
        <div className="space-y-5">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:border-foreground/15 hover:text-foreground"
          >
            <HeartHandshakeIcon className="size-3.5 text-primary" aria-hidden />
            Open source &amp; free
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            The most complete and reliable degree apprenticeship site
          </h1>
        </div>

        <div className="space-y-4">
          <form action="/roles" role="search" className="relative mx-auto max-w-2xl">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              name="q"
              type="search"
              placeholder="Search roles, companies or cities"
              aria-label="Search apprenticeships"
              className="h-16 rounded-2xl bg-card pr-32 pl-14 text-lg shadow-lg shadow-black/20 md:text-lg"
            />
            <Button type="submit" size="lg" className="absolute top-1/2 right-3 h-10 -translate-y-1/2 px-5">
              Search
            </Button>
          </form>

        </div>
      </section>

      <section aria-labelledby="sectors" className="space-y-4">
        <h2 id="sectors" className="text-xl font-semibold tracking-tight">
          Browse by sector
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <Link
              key={s.name}
              href={`/roles?sector=${encodeURIComponent(s.name)}`}
              className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 transition-colors hover:border-foreground/15 hover:bg-muted/40"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-hover:text-primary">
                <SectorIcon sector={s.name} className="size-4" />
              </span>
              <span className="flex-1 font-medium transition-colors group-hover:text-primary">{s.name}</span>
              <span className="text-sm text-muted-foreground tabular-nums">{s.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="closing" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="closing" className="text-xl font-semibold tracking-tight">
            Closing soon
          </h2>
          <Link
            href="/roles"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRightIcon className="size-4" />
          </Link>
        </div>
        <ClosingSoon apprenticeships={upcoming} />
      </section>

      <section className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-3 md:p-10">
        {PROMISES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="space-y-2">
            <Icon className="size-5 text-primary" aria-hidden />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Know a role we&apos;re missing?
        </h2>
        <p className="text-muted-foreground">
          Anyone can add or correct a listing, with no coding needed.
          That&apos;s how the directory stays complete and accurate.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button nativeButton={false} render={<Link href="/about#contribute" />}>
            Add an apprenticeship
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/roles" />}
          >
            Browse apprenticeships
          </Button>
        </div>
      </section>
    </div>
  );
}
