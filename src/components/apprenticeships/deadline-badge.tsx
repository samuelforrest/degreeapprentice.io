"use client";

import { Badge } from "@/components/ui/badge";
import { deadlineStatus, useToday } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** "Closes in 3 days" / "Opens 1 Feb 2027" / "Closed". Renders nothing until hydrated. */
export function DeadlineBadge({
  opens,
  closes,
  rolling,
  className,
}: {
  opens: string | null;
  closes: string | null;
  rolling: boolean;
  className?: string;
}) {
  const today = useToday();
  if (!today) return null;
  const status = deadlineStatus({ opens, closes }, today);

  switch (status.kind) {
    case "closed":
      return (
        <Badge variant="secondary" className={cn("text-muted-foreground", className)}>
          Closed
        </Badge>
      );
    case "not-open":
      return (
        <Badge variant="outline" className={className}>
          Opens {formatDate(status.opens)}
        </Badge>
      );
    case "open": {
      const { daysLeft } = status;
      if (daysLeft === null) {
        return (
          <Badge variant="outline" className={cn("border-success/40 text-success", className)}>
            Open{rolling ? " · rolling" : ""}
          </Badge>
        );
      }
      const urgent = daysLeft <= 7;
      return (
        <Badge
          variant="outline"
          className={cn(urgent ? "border-warning/50 text-warning" : "border-success/40 text-success", className)}
        >
          {daysLeft === 0 ? "Closes today" : daysLeft === 1 ? "Closes tomorrow" : `Closes in ${daysLeft} days`}
        </Badge>
      );
    }
    case "unknown":
      return rolling ? (
        <Badge variant="outline" className={className}>
          Rolling
        </Badge>
      ) : null;
  }
}
