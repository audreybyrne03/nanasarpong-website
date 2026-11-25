import { PageHeader, Section } from "@/components/PageHeader";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { SmartLink } from "@/components/SmartLink";
import { sectionMetadata } from "@/lib/pageMeta";
import { getProfile, getSettings } from "@/sanity/lib/data";
import type { TimelineItem } from "@/sanity/lib/types";

export const generateMetadata = sectionMetadata("aboutPage", "About", "/about");

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {items.map((t, i) => (
        <li key={i} className="grid gap-1 py-5 md:grid-cols-12 md:gap-6">
          <p className="text-sm tabular-nums text-copper-dark md:col-span-2 md:pt-1">{t.years}</p>
          <div className="md:col-span-10">
            <p className="font-serif text-xl leading-snug">{t.title}</p>
            {t.organization && <p className="text-slate">{t.organization}</p>}
            {t.detail && <p className="mt-1 text-sm text-slate">{t.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default async function AboutPage() {
  const [profile, settings] = await Promise.all([getProfile(), getSettings()]);
  const page = settings.aboutPage;
  let n = 0;
  const pad = () => String(++n).padStart(2, "0");

  return (
    <>
      <PageHeader eyebrow="About" title={page?.title || `About Dr. ${profile.name}`} intro={page?.intro} />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <aside className="md:col-span-4">
          <SanityImage image={profile.portrait} width={420} aspect={4 / 5} sizes="(min-width: 768px) 360px, 100vw" className="h-auto w-full" alt={profile.portrait?.alt || `Dr. ${profile.name}`} />
          <dl className="mt-8 space-y-5 text-[0.9375rem]">
            {profile.role && (
              <div>
                <dt className="eyebrow text-copper-dark">Specialty</dt>
                <dd className="mt-1">{profile.role}</dd>
              </div>
            )}
            {profile.boardCertification && (
              <div>
                <dt className="eyebrow text-copper-dark">Board certification</dt>
                <dd className="mt-1">{profile.boardCertification}</dd>
              </div>
            )}
            {(profile.languages?.length ?? 0) > 0 && (
              <div>
                <dt className="eyebrow text-copper-dark">Languages</dt>
                <dd className="mt-1">{profile.languages!.join(", ")}</dd>
              </div>
            )}
          </dl>
          {profile.cvUrl && (
            <p className="mt-8">
              <SmartLink href={`${profile.cvUrl}?dl=`} className="btn btn-ghost">Download CV (PDF)</SmartLink>
            </p>
          )}
        </aside>
        <div className="md:col-span-8">
          <RichText value={profile.bio} className="prose-editorial" />
          {(profile.specialties?.length ?? 0) > 0 && (
            <div className="mt-12 border-t border-rule pt-8">
              <h2 className="text-3xl">Clinical focus</h2>
              <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {profile.specialties!.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-copper" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {(profile.training?.length ?? 0) > 0 && (
        <Section number={pad()} label="Education & training" tone="deep" id="training">
          <Timeline items={profile.training!} />
        </Section>
      )}
      {(profile.appointments?.length ?? 0) + (profile.leadership?.length ?? 0) > 0 && (
        <Section number={pad()} label="Appointments & leadership" id="leadership">
          <div className="grid gap-12 lg:grid-cols-2">
            {(profile.appointments?.length ?? 0) > 0 && (
              <div>
                <h2 className="mb-5 text-3xl">Academic & hospital</h2>
                <Timeline items={profile.appointments!} />
              </div>
            )}
            {(profile.leadership?.length ?? 0) > 0 && (
              <div>
                <h2 className="mb-5 text-3xl">Leadership & service</h2>
                <Timeline items={profile.leadership!} />
              </div>
            )}
          </div>
        </Section>
      )}
      {(profile.honors?.length ?? 0) > 0 && (
        <Section number={pad()} label="Honors & awards" tone="deep" id="honors">
          <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {profile.honors!.map((h, i) => (
              <li key={i} className="flex gap-5 border-t border-rule pt-4">
                <span className="w-14 shrink-0 text-sm tabular-nums text-copper-dark">{h.year}</span>
                <span>
                  <span className="block font-serif text-xl leading-snug">{h.title}</span>
                  {h.organization && <span className="text-sm text-slate">{h.organization}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {((profile.editorial?.length ?? 0) > 0 || (profile.memberships?.length ?? 0) > 0 || profile.mentorship) && (
        <Section number={pad()} label="Scholarship & service" id="service">
          <div className="grid gap-12 lg:grid-cols-3">
            {(profile.editorial?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-3xl">Editorial</h2>
                <ul className="mt-5 space-y-3">
                  {profile.editorial!.map((e, i) => (
                    <li key={i}>
                      <span className="block">{e.title}, <em>{e.organization}</em></span>
                      <span className="text-sm text-slate">{e.years}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(profile.memberships?.length ?? 0) > 0 && (
              <div>
                <h2 className="text-3xl">Societies</h2>
                <ul className="mt-5 space-y-3">
                  {profile.memberships!.map((m, i) => (
                    <li key={i}>
                      <span className="block">{m.title}</span>
                      {m.detail && <span className="text-sm text-slate">{m.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.mentorship && (
              <div>
                <h2 className="text-3xl">Teaching & mentorship</h2>
                <p className="mt-5 text-slate">{profile.mentorship}</p>
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
