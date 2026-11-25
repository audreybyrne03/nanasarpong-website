import type { MetadataRoute } from "next";

import { getSiteUrl, isProductionDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments should never be indexed.
  if (!isProductionDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
