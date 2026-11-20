"use client";

import { RoleCard } from "@/components/roles/role-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToday } from "@/lib/dates";
import type { RoleSummary } from "@/lib/types";

/** The next few deadlines. Needs today's date, so it fills in after hydration. */
export function ClosingSoon({ roles, limit = 6 }: { roles: RoleSummary[]; limit?: number }) {
  const today = useToday();

  if (!today) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  const upcoming = roles
    .filter((o) => o.closes && o.closes >= today && (!o.opens || o.opens <= today))
    .sort((a, b) => a.closes!.localeCompare(b.closes!))
    .slice(0, limit);

  if (upcoming.length === 0) {
    return <p className="text-sm text-muted-foreground">No published deadlines coming up. Browse everything instead.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {upcoming.map((o) => (
        <RoleCard key={o.id} role={o} />
      ))}
    </div>
  );
}
