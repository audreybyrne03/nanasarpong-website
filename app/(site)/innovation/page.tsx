import { PageHeader, Section } from "@/components/PageHeader";
import { SanityImage } from "@/components/SanityImage";
import { SmartLink } from "@/components/SmartLink";
import { sectionMetadata } from "@/lib/pageMeta";
import { clean, INDUSTRY_TYPE_LABELS } from "@/lib/site";
import { getIndustryRoles, getInnovationProjects, getSettings } from "@/sanity/lib/data";

export const generateMetadata = sectionMetadata("innovationPage", "Innovation & Industry", "/innovation");

export default async function InnovationPage() {
  const [settings, projects, roles] = await Promise.all([getSettings(), getInnovationProjects(), getIndustryRoles()]);
  const page = settings.innovationPage;
  const current = roles.filter((r) => r.current !== false);
  const past = roles.filter((r) => r.current === false);
  const email = settings.contact?.industryEmail;

  return (
    <>
      <PageHeader eyebrow="Innovation" title={page?.title || "Innovation & Industry"} intro={page?.intro} />

      {projects.length > 0 && (
        <Section number="01" label="Areas of innovation" id="projects">
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
            {projects.map((p, i) => (
              <article key={p._id} className="border-t border-ink pt-6">
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="font-serif text-2xl text-copper-dark">{String(i + 1).padStart(2, "0")}</span>
                  {p.status && <span className="rounded-full border border-rule px-3 py-0.5 text-slate">{p.status}</span>}
                </div>
                {p.image && <SanityImage image={p.image} width={560} aspect={16 / 9} sizes="(min-width: 768px) 520px, 100vw" className="mt-4 h-auto w-full" />}
                <h2 className="mt-4 text-[2rem] leading-tight">{p.title}</h2>
                {p.summary && <p className="mt-3 text-slate">{p.summary}</p>}
                {p.partners && <p className="mt-3 text-sm"><span className="text-slate">With </span>{p.partners}</p>}
                {(p.technologies?.length ?? 0) > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.technologies!.map((t) => (
                      <li key={t} className="rounded-full bg-paper-deep px-3 py-1 text-sm">{t}</li>
                    ))}
                  </ul>
                )}
                {(p.links?.length ?? 0) > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-4 text-sm">
                    {p.links!.map((l) => (
                      <li key={l.url}><SmartLink href={l.url} className="link-quiet">{l.label} →</SmartLink></li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      {roles.length > 0 && (
        <Section number="02" label="Industry & advisory roles" tone="ink" id="industry">
          <ul className="divide-y divide-ink-line border-y border-ink-line">
            {[...current, ...past].map((r) => (
              <li key={r._id} className="grid gap-2 py-6 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-4">
                  <p className="font-serif text-2xl">
                    {r.url ? <SmartLink href={r.url} className="hover:text-copper-light">{r.organization}</SmartLink> : r.organization}
                  </p>
                  <p className="text-sm text-paper-text/60">
                    {[r.type && INDUSTRY_TYPE_LABELS[clean(r.type)], r.years].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <p className="text-paper">{r.role}</p>
                  {r.description && <p className="mt-1 text-paper-text/70">{r.description}</p>}
                </div>
              </li>
            ))}
          </ul>
          {settings.disclosure?.text && (
            <div className="mt-10 max-w-[80ch] text-sm text-paper-text/70">
              <p>{settings.disclosure.text}</p>
              {(settings.disclosure.links?.length ?? 0) > 0 && (
                <p className="mt-2 flex flex-wrap gap-4">
                  {settings.disclosure.links!.map((l) => (
                    <SmartLink key={l.url} href={l.url} className="text-copper-light underline underline-offset-4">{l.label}</SmartLink>
                  ))}
                </p>
              )}
            </div>
          )}
        </Section>
      )}

      <Section number="03" label="Collaborate" id="collaborate">
        <div className="grid gap-8 md:grid-cols-12">
          <h2 className="text-4xl leading-tight md:col-span-7">Industry, startup and research partnerships</h2>
          <div className="md:col-span-5">
            <p className="text-slate">
              Dr. Sarpong welcomes conversations about surgeon advisory work, product development, clinical research and surgeon education in hip and knee arthroplasty.
            </p>
            <p className="mt-6">
              {email ? (
                <SmartLink href={`mailto:${email}`} className="btn btn-ink">Get in touch</SmartLink>
              ) : (
                <SmartLink href="/appointments#contact" className="btn btn-ink">Contact</SmartLink>
              )}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
