/**
 * Public Sanity configuration (not secrets: they appear in every browser
 * request to Sanity's CDN).
 *
 * Until NEXT_PUBLIC_SANITY_PROJECT_ID is set, the site renders the starter
 * content in content/seed.ts, so previews work before Sanity is connected.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const isSanityConfigured = Boolean(projectId);

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-01";

/** Path where the embedded Studio is mounted. */
export const studioUrl = "/studio";
