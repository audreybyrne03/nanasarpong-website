import { Fragment } from "react";

import { publicationHref, type Publication } from "@/lib/publication-shared";
import { PUBLICATION_TYPE_LABELS } from "@/lib/site";

/** Bold Dr. Sarpong's name inside an author list ("Sarpong NO", "Owusu-Sarpong N"). */
function Authors({ authors }: { authors: string }) {
  const parts = authors.split(/((?:Owusu-)?Sarpong,?\s+N(?:\.?\s*O\.?)?|Nana O\.? Sarpong)/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">{part}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function PublicationCitation({ pub, showType = false }: { pub: Publication; showType?: boolean }) {
  const href = publicationHref(pub);
  return (
    <article className="group">
      <h3 className="font-serif text-[1.35rem] leading-snug">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="link-quiet">
            {pub.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          pub.title
        )}
      </h3>
      {pub.authors && (
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-slate">
          <Authors authors={pub.authors} />
        </p>
      )}
      <p className="mt-1 text-[0.9375rem] text-slate">
        {[pub.journal && <em key="j">{pub.journal}</em>, pub.year && <span key="y">{pub.year}</span>]
          .filter(Boolean)
          .map((node, i) => (
            <Fragment key={i}>
              {i > 0 && " · "}
              {node}
            </Fragment>
          ))}
        {showType && pub.type !== "journal-article" && (
          <span className="ml-2 rounded-full border border-rule px-2 py-0.5 text-xs">{PUBLICATION_TYPE_LABELS[pub.type] ?? "Other"}</span>
        )}
        {pub.pmid && (
          <a href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`} target="_blank" rel="noopener noreferrer" className="ml-3 text-sm text-copper-dark hover:underline">
            PubMed<span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </p>
      {pub.summary && <p className="mt-3 max-w-[70ch] border-l-2 border-copper pl-4 text-[0.9375rem]">{pub.summary}</p>}
    </article>
  );
}
