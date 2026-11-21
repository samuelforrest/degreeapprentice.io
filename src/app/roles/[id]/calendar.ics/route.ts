import { hasCalendarDates, roleCalendar } from "@/lib/ics";
import { getRole, getRoles } from "@/lib/roles";

// One .ics per role with published dates, generated at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getRoles()
    .filter(hasCalendarDates)
    .map((o) => ({ id: o.id }));
}

export async function GET(_request: Request, { params }: RouteContext<"/roles/[id]/calendar.ics">) {
  const { id } = await params;
  const o = getRole(id);
  if (!o || !hasCalendarDates(o)) return new Response("Not found", { status: 404 });

  return new Response(roleCalendar(o), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${id}.ics"`,
    },
  });
}
