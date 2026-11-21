import { site } from "@/config/site";
import { getExportedRoles } from "@/lib/export";

// Generated once at build time, like every other page.
export const dynamic = "force-static";

export function GET() {
  const roles = getExportedRoles();
  return Response.json({
    name: site.name,
    source: site.repoUrl,
    licence: "AGPL-3.0-only",
    generatedAt: new Date().toISOString(),
    count: roles.length,
    roles,
  });
}
