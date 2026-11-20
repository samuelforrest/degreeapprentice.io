import { getExportedRoles, toCsv } from "@/lib/export";

// Generated once at build time, like every other page.
export const dynamic = "force-static";

export function GET() {
  return new Response(toCsv(getExportedRoles()), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="roles.csv"',
    },
  });
}
