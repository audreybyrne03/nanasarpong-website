import "server-only";

import type { QueryParams } from "next-sanity";

import { isSanityConfigured } from "../env";
import { client } from "./client";

/**
 * Published-only fetch for contexts without a request (generateStaticParams,
 * sitemap, robots). Never throws.
 */
export async function fetchPublished<T>(query: string, params: QueryParams = {}, tags: string[] = []): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client
      .withConfig({ stega: false })
      .fetch<T>(query, params, { next: { revalidate: 60, tags: ["sanity", ...tags] } });
  } catch (error) {
    console.error("[sanity] published fetch failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
