import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getGuides } from "@/lib/guides";
import { getRoles } from "@/lib/roles";
import { TESTS } from "@/lib/tests";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/roles"), changeFrequency: "daily", priority: 0.9 },
    ...getRoles().map((o) => ({
      url: url(`/roles/${o.id}`),
      ...(o.lastVerified && { lastModified: o.lastVerified }),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: url("/guides"), changeFrequency: "weekly", priority: 0.8 },
    ...getGuides().map((g) => ({
      url: url(`/guides/${g.slug}`),
      lastModified: g.updated ?? g.published,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: url("/ai"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/cv"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/tests"), changeFrequency: "monthly", priority: 0.8 },
    ...TESTS.map((t) => ({ url: url(`/tests/${t.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...["/about"].map((p) => ({ url: url(p), changeFrequency: "monthly" as const, priority: 0.3 })),
  ];
}
