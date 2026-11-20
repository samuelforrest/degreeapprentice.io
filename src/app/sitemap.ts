import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getApprenticeships } from "@/lib/apprenticeships";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/roles"), changeFrequency: "daily", priority: 0.9 },
    ...getApprenticeships().map((o) => ({
      url: url(`/roles/${o.id}`),
      ...(o.lastVerified && { lastModified: o.lastVerified }),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...["/about"].map((p) => ({ url: url(p), changeFrequency: "monthly" as const, priority: 0.3 })),
  ];
}
