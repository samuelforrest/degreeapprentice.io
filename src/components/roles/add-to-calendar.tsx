"use client";

import { CalendarPlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deadlineStatus, useToday } from "@/lib/dates";

/** Downloads the role's .ics. Hidden once applications have closed (and until hydrated). */
export function AddToCalendar({ id, opens, closes }: { id: string; opens: string | null; closes: string | null }) {
  const today = useToday();
  if (!today || !(opens || closes)) return null;
  const status = deadlineStatus({ opens, closes }, today);
  if (status.kind === "closed") return null;
  // Already open with no closing date: nothing left worth adding.
  if (status.kind === "open" && !closes) return null;

  return (
    <Button variant="outline" nativeButton={false} render={<a href={`/roles/${id}/calendar.ics`} download />}>
      <CalendarPlusIcon />
      Add {closes ? "deadline" : "opening date"} to calendar
    </Button>
  );
}
