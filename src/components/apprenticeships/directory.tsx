"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ApprenticeshipCard } from "@/components/apprenticeships/apprenticeship-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { githubNewIssueUrl } from "@/config/site";
import { useToday } from "@/lib/dates";
import { plural } from "@/lib/format";
import { LEVELS, SECTORS } from "@/lib/taxonomy";
import type { ApprenticeshipSummary } from "@/lib/types";

const SORTS = [
  { value: "deadline", label: "Closing soonest" },
  { value: "salary", label: "Highest salary" },
  { value: "company", label: "Company A to Z" },
];

type Option = { value: string; label: string };

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <Select items={options} value={value} onValueChange={(v) => onChange((v as string | null) ?? options[0].value)}>
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Searchable, filterable list of apprenticeships. Filters live in the URL so
 * results can be shared and survive the back button.
 */
export function Directory({ apprenticeships }: { apprenticeships: ApprenticeshipSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const today = useToday();

  const level = params.get("level") ?? "all";
  const sector = params.get("sector") ?? "all";
  const location = params.get("location") ?? "all";
  const sort = params.get("sort") ?? "deadline";
  const includeClosed = params.get("closed") === "1";

  // The search box updates instantly; the URL catches up after a short pause.
  const [query, setQuery] = useState(params.get("q") ?? "");

  const setParam = (key: string, value: string | null) => {
    // Read the live URL, not the render-time snapshot, so the delayed search
    // update can't undo a filter chosen in the meantime.
    const next = new URLSearchParams(window.location.search);
    if (value === null || value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    const id = setTimeout(() => {
      const current = new URLSearchParams(window.location.search).get("q") ?? "";
      if (current !== query.trim()) setParam("q", query.trim());
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the query should trigger a URL write
  }, [query]);

  const locationOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of apprenticeships) for (const l of o.locations) counts.set(l, (counts.get(l) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([l, n]) => ({ value: l, label: `${l} (${n})` }));
  }, [apprenticeships]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];
    const items = apprenticeships.filter((o) => {
      if (level !== "all" && String(o.level) !== level) return false;
      if (sector !== "all" && !o.sectors.includes(sector as never)) return false;
      if (location !== "all" && !o.locations.includes(location)) return false;
      if (!includeClosed && today && o.closes && o.closes < today) return false;
      if (terms.length === 0) return true;
      const haystack = [o.title, o.company, o.qualification ?? "", ...o.sectors, ...o.locations].join(" ").toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });

    const byCompany = (a: ApprenticeshipSummary, b: ApprenticeshipSummary) =>
      a.company.localeCompare(b.company) || a.title.localeCompare(b.title);
    switch (sort) {
      case "salary":
        return items.sort((a, b) => (b.salary ?? -1) - (a.salary ?? -1) || byCompany(a, b));
      case "company":
        return items.sort(byCompany);
      default: {
        // Open roles with a known deadline first, soonest first; then everything else.
        const key = (o: ApprenticeshipSummary) =>
          o.closes && (!today || o.closes >= today) ? o.closes : "9999-12-31";
        return items.sort((a, b) => key(a).localeCompare(key(b)) || byCompany(a, b));
      }
    }
  }, [apprenticeships, query, level, sector, location, includeClosed, sort, today]);

  const filtersActive = query !== "" || level !== "all" || sector !== "all" || location !== "all";

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company, sector or city"
            aria-label="Search apprenticeships"
            className="h-11 pl-9 text-base md:text-sm"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label="Level"
            value={level}
            onChange={(v) => setParam("level", v)}
            options={[
              { value: "all", label: "All levels" },
              ...LEVELS.map((l) => ({ value: String(l.id), label: `${l.label} (${l.qualification.toLowerCase()})` })),
            ]}
          />
          <FilterSelect
            label="Sector"
            value={sector}
            onChange={(v) => setParam("sector", v)}
            options={[{ value: "all", label: "All sectors" }, ...SECTORS.map((s) => ({ value: s, label: s }))]}
          />
          <FilterSelect
            label="Location"
            value={location}
            onChange={(v) => setParam("location", v)}
            options={[{ value: "all", label: "All locations" }, ...locationOptions]}
          />
          <FilterSelect label="Sort" value={sort} onChange={(v) => setParam("sort", v === "deadline" ? null : v)} options={SORTS} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="include-closed"
              checked={includeClosed}
              onCheckedChange={(checked) => setParam("closed", checked ? "1" : null)}
            />
            <Label htmlFor="include-closed" className="font-normal text-muted-foreground">
              Show closed
            </Label>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {plural(results.length, "apprenticeship", "apprenticeships")}
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">Nothing matches yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a broader search, or tell us about a role we&apos;re missing.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {filtersActive && (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  router.replace(pathname, { scroll: false });
                }}
              >
                <XIcon />
                Clear filters
              </Button>
            )}
            <Button nativeButton={false} render={<a href={githubNewIssueUrl("add-apprenticeship.yml")} target="_blank" rel="noopener noreferrer" />}>
              Suggest an apprenticeship
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((o) => (
            <ApprenticeshipCard key={o.id} apprenticeship={o} />
          ))}
        </div>
      )}
    </div>
  );
}
