import { stegaClean } from "next-sanity";

export const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/care", label: "Hip & Knee Care" },
  { href: "/research", label: "Research" },
  { href: "/innovation", label: "Innovation" },
  { href: "/speaking", label: "Speaking" },
  { href: "/media", label: "Media" },
] as const;

/** Fallback only for the site title before Site settings are filled in. */
export const DEFAULT_SITE_TITLE = "Nana O. Sarpong, MD, MBA";

/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in Vercel for production;
 * preview deployments fall back to their own Vercel URL.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Only production should be indexed; previews are noindex. */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
}

/** Strip Sanity stega markers before using a value for logic, dates or URLs. */
export const clean = <T>(value: T): T => stegaClean(value) as T;

/** Parses YYYY, YYYY-MM or YYYY-MM-DD as a local calendar date. */
export function parseDate(value: string | null | undefined): Date | null {
  const v = clean(value);
  if (!v) return null;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(v);
  const date = m ? new Date(Number(m[1]), Number(m[2] ?? 1) - 1, Number(m[3] ?? 1), 12) : new Date(v);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | null | undefined, style: "long" | "month" | "year" = "long"): string {
  const v = clean(value);
  const date = parseDate(v);
  if (!date || !v) return "";
  // A value with no day ("2026-05") is shown as a month even when "long" is asked for.
  const effective = style === "long" && /^\d{4}-\d{2}$/.test(v) ? "month" : style === "long" && /^\d{4}$/.test(v) ? "year" : style;
  if (effective === "year") return String(date.getFullYear());
  return date.toLocaleDateString(
    "en-US",
    effective === "month" ? { year: "numeric", month: "long" } : { year: "numeric", month: "long", day: "numeric" },
  );
}

/** True if a dated item is today or later (by calendar month for YYYY-MM values). */
export function isUpcoming(value: string | null | undefined, now = new Date()): boolean {
  const v = clean(value);
  const date = parseDate(v);
  if (!date || !v) return false;
  if (/^\d{4}-\d{2}$/.test(v)) {
    return date.getFullYear() > now.getFullYear() || (date.getFullYear() === now.getFullYear() && date.getMonth() >= now.getMonth());
  }
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date >= today;
}

/** Is a date window (either end optional) active today? */
export function isActiveWindow(start?: string | null, end?: string | null, now = new Date()): boolean {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s && s.getTime() > now.getTime()) return false;
  if (e) {
    const endOfDay = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59);
    if (endOfDay.getTime() < now.getTime()) return false;
  }
  return true;
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//.test(clean(url));
}

export function telHref(phone: string): string {
  return `tel:${clean(phone).replace(/[^\d+]/g, "")}`;
}

export const PROCEDURE_CATEGORY_LABELS: Record<string, string> = {
  hip: "Hip",
  knee: "Knee",
  revision: "Revision & complex",
};

export const INDUSTRY_TYPE_LABELS: Record<string, string> = {
  advisory: "Advisory board",
  consulting: "Consulting",
  design: "Product design",
  education: "Surgeon education",
  research: "Research collaboration",
  committee: "Innovation committee",
  other: "Collaboration",
};

export const SPEAKING_KIND_LABELS: Record<string, string> = {
  course: "Course faculty",
  lecture: "Invited lecture",
  "grand-rounds": "Grand rounds",
  panel: "Panel",
  webinar: "Webinar",
  podium: "Podium presentation",
  media: "Podcast / media",
  other: "Talk",
};

export const MEDIA_TYPE_LABELS: Record<string, string> = {
  video: "Video",
  news: "News",
  feature: "Feature",
  podcast: "Podcast",
  award: "Recognition",
  other: "Media",
};

export const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  "journal-article": "Journal article",
  review: "Review",
  editorial: "Commentary & editorial",
  "book-chapter": "Book chapter",
  "conference-abstract": "Conference abstract",
  other: "Other",
};

export const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  doximity: "Doximity",
  orcid: "ORCID",
  "google-scholar": "Google Scholar",
  researchgate: "ResearchGate",
  pubmed: "PubMed",
  vumedi: "VuMedi",
  website: "Website",
  other: "Link",
};

/** Display label for a profile link: custom label, else the platform name. */
export function socialLabel(link: { label?: string | null; platform?: string | null }): string {
  return link.label || SOCIAL_PLATFORM_LABELS[clean(link.platform) ?? ""] || "Link";
}
