import "server-only";

import { normalizeDoi } from "./publication-shared";

export { normalizeDoi };

/**
 * Publications from ORCID (https://orcid.org), enriched with author lists from
 * Crossref when ORCID doesn't carry them.
 *
 * Everything here is cached by Next.js for ORCID_REVALIDATE_SECONDS, so the
 * public APIs are called at most a few times a day. New papers that
 * Dr. Sarpong (or a delegate) adds to ORCID appear on the site without any
 * edit to the website. Every request is time-limited and failures return an
 * empty list, so an ORCID outage never breaks the site.
 */

export const ORCID_REVALIDATE_SECONDS = 60 * 60 * 12;
const TIMEOUT_MS = 10_000;
const ORCID_API = "https://pub.orcid.org/v3.0";
const CROSSREF_API = "https://api.crossref.org/works";
const CACHE_TAGS = ["orcid", "sanity"];

export interface OrcidWork {
  putCode: number;
  title: string;
  journal?: string;
  year?: number;
  type?: string;
  doi?: string;
  pmid?: string;
  url?: string;
  authors?: string;
}

type Value<T = string> = { value?: T } | null | undefined;

interface OrcidExternalId {
  "external-id-type"?: string;
  "external-id-value"?: string;
  "external-id-normalized"?: Value;
  "external-id-relationship"?: string;
  "external-id-url"?: Value;
}

interface OrcidSummary {
  "put-code"?: number;
  title?: { title?: Value; subtitle?: Value } | null;
  "journal-title"?: Value;
  type?: string;
  "publication-date"?: { year?: Value; month?: Value } | null;
  "external-ids"?: { "external-id"?: OrcidExternalId[] } | null;
  url?: Value;
}

interface OrcidWorksResponse {
  group?: { "external-ids"?: { "external-id"?: OrcidExternalId[] }; "work-summary"?: OrcidSummary[] }[];
}

interface OrcidBulkResponse {
  bulk?: {
    work?: {
      "put-code"?: number;
      contributors?: { contributor?: { "credit-name"?: Value; "contributor-attributes"?: { "contributor-sequence"?: string } | null }[] } | null;
    };
  }[];
}

interface CrossrefResponse {
  message?: { items?: { DOI?: string; author?: { given?: string; family?: string; name?: string }[] }[] };
}

export function normalizeOrcidId(id: string | null | undefined): string | null {
  const m = /(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/i.exec(id ?? "");
  return m ? m[1].toUpperCase() : null;
}

async function getJson<T>(url: string, revalidate = ORCID_REVALIDATE_SECONDS): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "physician-website (ORCID publication sync)" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate, tags: CACHE_TAGS },
    });
    if (!res.ok) {
      console.error(`[orcid] ${res.status} from ${new URL(url).host}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error("[orcid] request failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** "Nana O. Sarpong" → "Sarpong NO" (the citation style used across the site). */
export function formatAuthorName(given: string | undefined, family: string | undefined): string {
  const fam = (family ?? "").trim();
  const initials = (given ?? "")
    .split(/[\s.-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return [fam, initials].filter(Boolean).join(" ");
}

function creditNameToCitation(name: string): string {
  const trimmed = name.trim();
  if (/^[^,]+,\s*[A-Z]{1,3}$/.test(trimmed) || /^\S+\s[A-Z]{1,3}$/.test(trimmed)) return trimmed.replace(",", "");
  if (trimmed.includes(",")) {
    const [family, given] = trimmed.split(",", 2);
    return formatAuthorName(given, family);
  }
  const parts = trimmed.split(/\s+/);
  const family = parts.pop();
  return formatAuthorName(parts.join(" "), family);
}

function pickIds(ids: OrcidExternalId[] = []) {
  let doi: string | undefined;
  let pmid: string | undefined;
  for (const id of ids) {
    if (id["external-id-relationship"] && id["external-id-relationship"] !== "self") continue;
    const type = id["external-id-type"]?.toLowerCase();
    const value = id["external-id-normalized"]?.value || id["external-id-value"];
    if (!value) continue;
    if (type === "doi" && !doi) doi = normalizeDoi(value);
    if (type === "pmid" && !pmid) pmid = value.replace(/\D/g, "") || undefined;
  }
  return { doi, pmid };
}

export function parseWorks(data: OrcidWorksResponse | null): OrcidWork[] {
  const works: OrcidWork[] = [];
  for (const group of data?.group ?? []) {
    const summary = group["work-summary"]?.[0];
    const title = summary?.title?.title?.value?.trim();
    if (!summary || !title || summary["put-code"] == null) continue;
    const fromGroup = pickIds(group["external-ids"]?.["external-id"]);
    const fromSummary = pickIds(summary["external-ids"]?.["external-id"]);
    const year = Number(summary["publication-date"]?.year?.value);
    const subtitle = summary.title?.subtitle?.value?.trim();
    works.push({
      putCode: summary["put-code"],
      title: subtitle ? `${title}: ${subtitle}` : title,
      journal: summary["journal-title"]?.value?.trim() || undefined,
      year: Number.isFinite(year) && year > 1900 ? year : undefined,
      type: summary.type?.toLowerCase(),
      doi: fromGroup.doi ?? fromSummary.doi,
      pmid: fromGroup.pmid ?? fromSummary.pmid,
      url: summary.url?.value || undefined,
    });
  }
  return works;
}

export function parseBulkAuthors(data: OrcidBulkResponse | null): Map<number, string> {
  const map = new Map<number, string>();
  for (const item of data?.bulk ?? []) {
    const work = item.work;
    const names = (work?.contributors?.contributor ?? [])
      .map((c) => c["credit-name"]?.value)
      .filter((n): n is string => Boolean(n?.trim()))
      .map(creditNameToCitation);
    if (work?.["put-code"] != null && names.length) map.set(work["put-code"], names.join(", "));
  }
  return map;
}

export function parseCrossrefAuthors(data: CrossrefResponse | null): Map<string, string> {
  const map = new Map<string, string>();
  for (const item of data?.message?.items ?? []) {
    const doi = normalizeDoi(item.DOI);
    const names = (item.author ?? [])
      .map((a) => (a.family ? formatAuthorName(a.given, a.family) : a.name))
      .filter((n): n is string => Boolean(n));
    if (doi && names.length) map.set(doi, names.join(", "));
  }
  return map;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** All works on an ORCID record, with author lists where they can be found. */
export async function fetchOrcidWorks(orcidId: string | null | undefined): Promise<OrcidWork[]> {
  const id = normalizeOrcidId(orcidId);
  if (!id) return [];

  const works = parseWorks(await getJson<OrcidWorksResponse>(`${ORCID_API}/${id}/works`));
  if (!works.length) return works;

  // 1. Contributor lists stored on ORCID itself (bulk endpoint: up to 100 per call).
  const bulk = await Promise.all(
    chunk(works.map((w) => w.putCode), 100).map((codes) =>
      getJson<OrcidBulkResponse>(`${ORCID_API}/${id}/works/${codes.join(",")}`),
    ),
  );
  for (const result of bulk) {
    const authors = parseBulkAuthors(result);
    for (const work of works) work.authors ??= authors.get(work.putCode);
  }

  // 2. Crossref fills in authors for anything with a DOI that ORCID lacks.
  const missing = works.filter((w) => !w.authors && w.doi).map((w) => w.doi as string);
  const crossref = await Promise.all(
    chunk(missing, 40).map((dois) =>
      getJson<CrossrefResponse>(
        `${CROSSREF_API}?rows=100&select=DOI,author&filter=${dois.map((d) => `doi:${encodeURIComponent(d)}`).join(",")}`,
      ),
    ),
  );
  for (const result of crossref) {
    const authors = parseCrossrefAuthors(result);
    for (const work of works) if (!work.authors && work.doi) work.authors = authors.get(work.doi);
  }

  return works;
}
