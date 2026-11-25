import "server-only";

import type { QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { isSanityConfigured, studioUrl } from "../env";
import { client } from "./client";
import { readToken } from "./token";

/** Published content is cached and refreshed at most once a minute. */
const REVALIDATE_SECONDS = 60;

interface FetchOptions {
  query: string;
  params?: QueryParams;
  /** Cache tags, used by /api/revalidate for instant updates on publish. */
  tags?: string[];
}

/**
 * Fetch from Sanity.
 *
 * - Normal visitors get published content, cached with time-based + tag revalidation.
 * - In Draft Mode (enabled from Studio's Presentation tool) it fetches drafts,
 *   uncached, with stega encoding so overlays link back to the Studio.
 * - If Sanity is unreachable, returns `null` so pages render their empty
 *   state rather than failing the build.
 */
export async function sanityFetch<T>({ query, params = {}, tags = [] }: FetchOptions): Promise<T | null> {
  if (!isSanityConfigured) return null;
  const { isEnabled: isDraftMode } = await draftMode();

  try {
    if (isDraftMode && readToken) {
      return await client
        .withConfig({
          token: readToken,
          useCdn: false,
          perspective: "drafts",
          stega: { enabled: true, studioUrl },
        })
        .fetch<T>(query, params, { cache: "no-store" });
    }

    return await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity", ...tags] },
    });
  } catch (error) {
    console.error("[sanity] fetch failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
