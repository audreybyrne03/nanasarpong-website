import { PageHeader, Section } from "@/components/PageHeader";
import { PublicationCitation } from "@/components/PublicationCitation";
import { PublicationsBrowser } from "@/components/PublicationsBrowser";
import { SmartLink } from "@/components/SmartLink";
import { sectionMetadata } from "@/lib/pageMeta";
import { normalizeOrcidId } from "@/lib/orcid";
import { getGrants, getPublicationCount, getPublications, getSettings } from "@/sanity/lib/data";

export const generateMetadata = sectionMetadata("researchPage", "Research & Publications", "/research");

export default async function ResearchPage() {
  const [settings, publications, count, grants] = await Promise.all([getSettings(), getPublications(), getPublicationCount(), getGrants()]);
  const page = settings.researchPage;
  const featured = publications.filter((p) => p.featured);
  const orcid = normalizeOrcidId(settings.orcid?.orcidId);
  const fromOrcid = publications.filter((p) => p.source === "orcid").length;

  return (
    <>
      <PageHeader eyebrow="Research" title={page?.title || "Research & Publications"} intro={page?.intro}>
        <dl className="mt-12 flex flex-wrap gap-x-14 gap-y-6">
          <div className="flex flex-col border-l border-copper/60 pl-5">
            <dt className="text-sm text-paper-text/70">Peer-reviewed publications</dt>
            <dd className="order-first font-serif text-5xl tabular-nums">{count}</dd>
          </div>
          {grants.length > 0 && (
            <div className="flex flex-col border-l border-copper/60 pl-5">
              <dt className="text-sm text-paper-text/70">Research grants</dt>
              <dd className="order-first font-serif text-5xl tabular-nums">{grants.length}</dd>
            </div>
          )}
          {orcid && (
            <div className="flex flex-col justify-end">
              <dt className="sr-only">ORCID</dt>
              <dd>
                <SmartLink href={`https://orcid.org/${orcid}`} className="btn btn-ghost-light">ORCID {orcid}</SmartLink>
              </dd>
            </div>
          )}
        </dl>
      </PageHeader>

      {featured.length > 0 && (
        <Section number="01" label="Selected publications" tone="deep" id="selected">
          <ol className="divide-y divide-rule border-y border-rule">
            {featured.map((p) => (
              <li key={p.id} className="py-7">
                <PublicationCitation pub={p} />
              </li>
            ))}
          </ol>
        </Section>
      )}

      {grants.length > 0 && (
        <Section number={featured.length ? "02" : "01"} label="Funded research" id="grants">
          <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {grants.map((g) => (
              <li key={g._id} className="border-t border-ink pt-5">
                <p className="text-sm tabular-nums text-copper-dark">
                  {g.year}
                  {g.role && <span className="text-slate"> · {g.role}</span>}
                </p>
                <p className="mt-2 font-serif text-xl leading-snug">{g.title}</p>
                <p className="mt-1 text-sm text-slate">
                  {g.funder}
                  {g.showAmount && g.amount ? ` · ${g.amount}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section number={String((featured.length ? 2 : 1) + (grants.length ? 1 : 0)).padStart(2, "0")} label="All publications" tone="deep" id="publications">
        <PublicationsBrowser publications={publications} />
        <p className="mt-10 max-w-[80ch] text-sm text-slate">
          {fromOrcid > 0
            ? "This list updates automatically from ORCID and is supplemented with Dr. Sarpong’s CV."
            : "This list is drawn from Dr. Sarpong’s CV and updates automatically from ORCID."}
          {" "}Links go to the publisher (DOI) or PubMed.
        </p>
      </Section>
    </>
  );
}
