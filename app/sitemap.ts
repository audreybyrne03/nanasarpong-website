import type { MetadataRoute } from "next";

import { seedProcedures } from "@/content/seed";
import { clean, getSiteUrl, NAV_ITEMS } from "@/lib/site";
import { fetchPublished } from "@/sanity/lib/published";
import { SITEMAP_QUERY } from "@/sanity/lib/queries";
import type { SitemapData } from "@/sanity/lib/types";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await fetchPublished<SitemapData>(SITEMAP_QUERY, {}, ["procedure"]);
  const lastModified = data?.latest ? new Date(data.latest) : undefined;
  const procedures = data?.procedures ?? seedProcedures.map((p) => ({ slug: p.slug }));

  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...[...NAV_ITEMS, { href: "/appointments" }].map((item) => ({
      url: `${base}${item.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...procedures.map((p) => ({
      url: `${base}/care/${clean(p.slug)}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
