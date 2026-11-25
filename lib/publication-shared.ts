/** Client-safe publication helpers (no server-only imports). */

export type PublicationSource = "orcid" | "cv" | "manual";

export interface Publication {
  id: string;
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  type: string;
  doi?: string;
  pmid?: string;
  url?: string;
  summary?: string;
  featured?: boolean;
  source: PublicationSource;
}

export function normalizeDoi(doi: string | null | undefined): string | undefined {
  if (!doi) return undefined;
  const v = doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").toLowerCase();
  return v.startsWith("10.") ? v : undefined;
}

/** Link for a publication: DOI, else PubMed, else whatever URL we have. */
export function publicationHref(p: Pick<Publication, "doi" | "pmid" | "url">): string | undefined {
  if (p.doi) return `https://doi.org/${p.doi}`;
  if (p.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`;
  return p.url || undefined;
}
