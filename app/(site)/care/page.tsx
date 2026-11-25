import Link from "next/link";

import { PageHeader, Section } from "@/components/PageHeader";
import { sectionMetadata } from "@/lib/pageMeta";
import { clean, PROCEDURE_CATEGORY_LABELS } from "@/lib/site";
import { getProcedures, getSettings } from "@/sanity/lib/data";

export const generateMetadata = sectionMetadata("carePage", "Hip & Knee Care", "/care");

export default async function CarePage() {
  const [settings, procedures] = await Promise.all([getSettings(), getProcedures()]);
  const page = settings.carePage;
  const groups = Object.entries(PROCEDURE_CATEGORY_LABELS)
    .map(([key, label]) => ({ key, label, items: procedures.filter((p) => clean(p.category) === key) }))
    .filter((g) => g.items.length);
  const other = procedures.filter((p) => !p.category || !PROCEDURE_CATEGORY_LABELS[clean(p.category)]);
  if (other.length) groups.push({ key: "other", label: "Other", items: other });

  return (
    <>
      <PageHeader eyebrow="Patients" title={page?.title || "Hip & Knee Care"} intro={page?.intro} />
      {groups.map((g, gi) => (
        <Section key={g.key} number={String(gi + 1).padStart(2, "0")} label={g.label} tone={gi % 2 ? "deep" : "paper"} id={g.key}>
          <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {g.items.map((p) => (
              <li key={p._id} className="border-t border-ink pt-6">
                <Link href={`/care/${clean(p.slug)}`} className="group block">
                  <h2 className="text-[2rem] leading-tight group-hover:text-copper-dark">{p.title}</h2>
                  {p.summary && <p className="mt-3 text-slate">{p.summary}</p>}
                  {(p.highlights?.length ?? 0) > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.highlights!.map((h) => (
                        <li key={h} className="rounded-full border border-rule px-3 py-1 text-sm">{h}</li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-5 inline-block text-sm font-medium text-copper-dark">
                    Read more <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
