import "server-only";

/**
 * Server-only secrets. Importing this file from a Client Component fails the
 * build, which guarantees these values never reach the browser bundle.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET || "";
