import cvArchive from "@/content/cv-publications.json";
import type { PublicationEntry } from "@/sanity/lib/types";

import type { OrcidWork } from "./orcid";
import { normalizeDoi, type Publication } from "./publication-shared";

export { publicationHref, type Publication, type PublicationSource } from "./publication-shared";

/**
 * One merged, de-duplicated publication list, built from three sources:
 *
 *  1. ORCID — automatic; anything added to the ORCID record appears here.
 *  2. CV archive — content/cv-publications.json, parsed from the CV, so older
 *     papers show even if they were never added to ORCID. (Can be switched off
 *     in Site settings → Publications.)
 *  3. Sanity "Publications" entries — add items ORCID doesn't have (in-press
 *     papers, chapters), or match an existing paper by DOI / PMID / title to
 *     feature it, hide it, fix a field, or add a plain-language summary.
 */

interface CvPublication {
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  pmid?: string;
  doi?: string;
  type?: string;
}

const KNOWN_TYPES = new Set(["journal-article", "review", "editorial", "book-chapter", "conference-abstract", "other"]);

function mapType(type: string | null | undefined): string {
  const t = (type ?? "").toLowerCase();
  if (KNOWN_TYPES.has(t)) return t;
  if (t.startsWith("conference")) return "conference-abstract";
  if (t === "book" || t === "edited-book") return "book-chapter";
  return t ? "other" : "journal-article";
}

/** Lower-case alphanumerics, first 90 chars: tolerant of punctuation/case differences. */
export function titleKey(title: string | null | undefined): string {
  return (title ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 90);
}

function keysOf(p: { doi?: string | null; pmid?: string | null; title?: string | null }): string[] {
  const keys: string[] = [];
  const doi = normalizeDoi(p.doi);
  if (doi) keys.push(`doi:${doi}`);
  if (p.pmid) keys.push(`pmid:${String(p.pmid).replace(/\D/g, "")}`);
  const t = titleKey(p.title);
  if (t.length >= 20) keys.push(`title:${t}`);
  return keys;
}

export function mergePublications({
  orcid,
  entries,
  includeCvArchive = true,
  hiddenIds = [],
}: {
  orcid: OrcidWork[];
  entries: PublicationEntry[];
  includeCvArchive?: boolean;
  hiddenIds?: string[];
}): Publication[] {
  const list: Publication[] = [];
  const index = new Map<string, Publication>();

  const register = (pub: Publication) => {
    for (const key of keysOf(pub)) if (!index.has(key)) index.set(key, pub);
  };
  const find = (p: { doi?: string | null; pmid?: string | null; title?: string | null }) => {
    for (const key of keysOf(p)) {
      const hit = index.get(key);
      if (hit) return hit;
    }
    return undefined;
  };
  const add = (pub: Publication) => {
    const existing = find(pub);
    if (existing) {
      // Fill gaps in the existing record (e.g. a PMID from the CV, a DOI from ORCID).
      existing.doi ??= pub.doi;
      existing.pmid ??= pub.pmid;
      existing.authors ??= pub.authors;
      existing.journal ??= pub.journal;
      existing.year ??= pub.year;
      register(existing);
      return;
    }
    list.push(pub);
    register(pub);
  };

  for (const w of orcid) {
    add({
      id: `orcid-${w.putCode}`,
      title: w.title,
      authors: w.authors,
      journal: w.journal,
      year: w.year,
      type: mapType(w.type),
      doi: w.doi,
      pmid: w.pmid,
      url: w.url,
      source: "orcid",
    });
  }

  if (includeCvArchive) {
    (cvArchive as CvPublication[]).forEach((c, i) =>
      add({
        id: `cv-${i + 1}`,
        title: c.title,
        authors: c.authors,
        journal: c.journal,
        year: c.year,
        type: mapType(c.type),
        doi: normalizeDoi(c.doi),
        pmid: c.pmid,
        source: "cv",
      }),
    );
  }

  const hidden = new Set<Publication>();
  for (const e of entries) {
    const match = find(e);
    if (match) {
      if (e.hidden) hidden.add(match);
      if (e.title) match.title = e.title;
      if (e.authors) match.authors = e.authors;
      if (e.journal) match.journal = e.journal;
      if (e.year) match.year = e.year;
      if (e.type) match.type = mapType(e.type);
      if (e.url) match.url = e.url;
      if (e.summary) match.summary = e.summary;
      if (e.featured != null) match.featured = e.featured;
      match.doi ??= normalizeDoi(e.doi);
      match.pmid ??= e.pmid ?? undefined;
      continue;
    }
    if (e.hidden || !e.title) continue;
    add({
      id: `manual-${e._id}`,
      title: e.title,
      authors: e.authors ?? undefined,
      journal: e.journal ?? undefined,
      year: e.year ?? undefined,
      type: mapType(e.type),
      doi: normalizeDoi(e.doi),
      pmid: e.pmid ?? undefined,
      url: e.url ?? undefined,
      summary: e.summary ?? undefined,
      featured: e.featured ?? undefined,
      source: "manual",
    });
  }

  for (const id of hiddenIds) {
    const match = find(id.startsWith("10.") ? { doi: id } : /^\d+$/.test(id) ? { pmid: id } : { title: id });
    if (match) hidden.add(match);
  }

  return list
    .filter((p) => !hidden.has(p))
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title));
}

/** Peer-reviewed count used for the homepage stat (articles, reviews, commentaries; not chapters/abstracts). */
export function countPeerReviewed(pubs: Publication[]): number {
  return pubs.filter((p) => p.type === "journal-article" || p.type === "review" || p.type === "editorial").length;
}
