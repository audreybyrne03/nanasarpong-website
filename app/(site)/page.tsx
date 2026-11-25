import Link from "next/link";

import { PublicationCitation } from "@/components/PublicationCitation";
import { Section } from "@/components/PageHeader";
import { SanityImage } from "@/components/SanityImage";
import { SmartLink } from "@/components/SmartLink";
import { bookingLink } from "@/lib/booking";
import { clean, isActiveWindow, PROCEDURE_CATEGORY_LABELS } from "@/lib/site";
import {
  getIndustryRoles,
  getInnovationProjects,
  getLocations,
  getProcedures,
  getProfile,
  getPublicationCount,
  getPublications,
  getSettings,
  getTestimonials,
} from "@/sanity/lib/data";

function Headline({ text, emphasis }: { text: string; emphasis?: string | null }) {
  const em = clean(emphasis);
  const idx = em ? text.lastIndexOf(em) : -1;
  const before = idx > 0 ? text.slice(0, idx).trimEnd() : text;
  return (
    <h1 className="text-[3.25rem] leading-[0.98] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]">
      <span className="hero-line" style={{ "--line": 0 } as React.CSSProperties}>{before}</span>
      {idx > 0 && (
        <span className="hero-line italic text-copper-light" style={{ "--line": 1 } as React.CSSProperties}>
          {text.slice(idx)}
        </span>
      )}
    </h1>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function HomePage() {
  const [settings, profile, procedures, projects, roles, publications, pubCount, locations, testimonials] = await Promise.all([
    getSettings(),
    getProfile(),
    getProcedures(),
    getInnovationProjects(),
    getIndustryRoles(),
    getPublications(),
    getPublicationCount(),
    getLocations(),
    getTestimonials(),
  ]);
  const booking = bookingLink(settings);
  const hero = settings.hero ?? {};
  const featuredProcedures = procedures.filter((p) => p.featured !== false).slice(0, 6);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const partners = [...new Set(roles.filter((r) => r.current !== false && r.type !== "committee").map((r) => r.organization))];
  const featuredPubs = (() => {
    const picked = publications.filter((p) => p.featured);
    return (picked.length ? picked : publications.filter((p) => p.type === "journal-article")).slice(0, 3);
  })();
  const honors = (profile.honors ?? []).filter((h) => h.featured).slice(0, 5);
  const activeLocations = locations.filter((l) => isActiveWindow(null, l.endDate));
  const closing = (settings.sectionTitles?.closing || "Request a consultation").split("|").map((s) => s.trim());
  let n = 0;

  return (
    <>
      {/* Hero ---------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-10 md:px-10 md:pb-20 md:pt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pt-6">
            {hero.eyebrow && <p className="eyebrow hero-after text-copper-light">{hero.eyebrow}</p>}
            <div className="hero-rule mt-5 h-px w-24 bg-copper" aria-hidden />
            <div className="mt-8">
              <Headline text={hero.headline || `${profile.name}, ${profile.credentials}`} emphasis={hero.emphasis} />
            </div>
            {hero.intro && <p className="hero-after mt-8 max-w-[52ch] text-lg leading-relaxed text-paper-text/85">{hero.intro}</p>}
            <div className="hero-after mt-10 flex flex-wrap gap-3">
              <SmartLink href={hero.primaryCta?.url === "/appointments" ? booking.href : hero.primaryCta?.url || booking.href} className="btn btn-copper">
                {hero.primaryCta?.label || booking.label}
              </SmartLink>
              {hero.secondaryCta?.url && (
                <SmartLink href={hero.secondaryCta.url} className="btn btn-ghost-light">
                  {hero.secondaryCta.label}
                </SmartLink>
              )}
            </div>
          </div>
          <div className="hero-after relative lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="absolute -right-3 -top-3 h-full w-full border border-copper/60" aria-hidden />
              <SanityImage
                image={profile.portrait}
                width={520}
                aspect={4 / 5}
                sizes="(min-width: 1024px) 420px, 90vw"
                className="relative h-auto w-full bg-ink-raised"
                priority
                alt={profile.portrait?.alt || `Portrait of Dr. ${profile.name}`}
              />
            </div>
            <p className="mt-5 text-sm text-paper-text/70">
              <span className="font-serif text-xl text-paper">Dr. {profile.name}</span>
              {profile.credentials && <span className="ml-2">{profile.credentials}</span>}
              {profile.affiliation && <span className="block">{profile.affiliation}</span>}
            </p>
          </div>
        </div>

        {(settings.stats?.length ?? 0) > 0 && (
          <div className="border-t border-ink-line">
            <dl className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3 md:px-10">
              {settings.stats!.map((stat) => (
                <div key={stat.label} className="flex flex-col border-l border-copper/60 pl-5">
                  <dt className="text-sm text-paper-text/70">{stat.label}</dt>
                  <dd className="order-first font-serif text-5xl tabular-nums text-paper">
                    {clean(stat.auto) === "publications" ? `${pubCount}+` : stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {/* Training strip ------------------------------------------------- */}
      {(profile.training?.length ?? 0) > 0 && (
        <section aria-label="Training" className="border-b border-rule">
          <ol className="mx-auto grid max-w-6xl gap-x-px gap-y-6 px-6 py-10 sm:grid-cols-2 md:px-10 lg:grid-cols-3 xl:grid-cols-6">
            {profile.training!.map((t, i) => (
              <li key={i} className="pr-6">
                <p className="text-xs font-medium tabular-nums tracking-[0.08em] text-copper-dark">{t.years}</p>
                <p className="mt-1 font-serif text-lg leading-snug">{t.organization}</p>
                <p className="mt-1 text-sm text-slate">{t.title}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Approach ------------------------------------------------------- */}
      {(settings.pillars?.length ?? 0) > 0 && (
        <Section number={pad(++n)} label="The approach" title={settings.sectionTitles?.approach || "The approach"} id="approach">
          <div className="grid gap-10 md:grid-cols-3">
            {settings.pillars!.map((p, i) => (
              <div key={p.title} className="border-t border-ink pt-6">
                <p className="font-serif text-2xl text-copper-dark">{pad(i + 1)}</p>
                <h3 className="mt-3 text-[1.75rem] leading-tight">{p.title}</h3>
                <p className="mt-3 text-slate">{p.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Procedures ----------------------------------------------------- */}
      {featuredProcedures.length > 0 && (
        <Section
          number={pad(++n)}
          label="Hip & knee care"
          title="Procedures"
          tone="deep"
          id="care"
          action={<Link href="/care" className="link-quiet text-[0.9375rem]">All conditions & procedures →</Link>}
        >
          <ul className="grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
            {featuredProcedures.map((p, i) => (
              <li key={p._id} className="bg-paper">
                <Link href={`/care/${clean(p.slug)}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-white">
                  <span className="flex items-baseline justify-between text-sm text-slate">
                    <span className="tabular-nums text-copper-dark">{pad(i + 1)}</span>
                    {p.category && <span>{PROCEDURE_CATEGORY_LABELS[clean(p.category)]}</span>}
                  </span>
                  <span className="mt-6 font-serif text-[1.75rem] leading-tight">{p.title}</span>
                  {p.summary && <span className="mt-3 flex-1 text-[0.9375rem] text-slate">{p.summary}</span>}
                  <span className="mt-6 text-sm font-medium text-copper-dark">
                    Learn more <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
            {featuredProcedures.length % 3 !== 0 && (
              <li className={`bg-ink text-paper ${featuredProcedures.length % 2 === 0 ? "sm:col-span-2" : "sm:col-span-1"} ${featuredProcedures.length % 3 === 1 ? "lg:col-span-2" : "lg:col-span-1"}`}>
                <SmartLink href={booking.href} className="group flex h-full flex-col justify-between p-7">
                  <span className="font-serif text-[1.75rem] leading-tight">Not sure which option is right for you?</span>
                  <span className="mt-6 text-sm font-medium text-copper-light">
                    {booking.label} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </SmartLink>
              </li>
            )}
          </ul>
        </Section>
      )}

      {/* Innovation ----------------------------------------------------- */}
      {(featuredProjects.length > 0 || partners.length > 0) && (
        <Section
          number={pad(++n)}
          label="Innovation & industry"
          title={settings.sectionTitles?.innovation || undefined}
          tone="ink"
          id="innovation"
          action={<Link href="/innovation" className="text-[0.9375rem] text-paper-text/80 underline decoration-ink-line underline-offset-4 hover:text-paper hover:decoration-copper">Innovation & industry →</Link>}
        >
          <div className="grid gap-10 md:grid-cols-3">
            {featuredProjects.map((p) => (
              <div key={p._id} className="border-t border-ink-line pt-6">
                {(p.technologies?.length ?? 0) > 0 && <p className="text-xs uppercase tracking-[0.12em] text-copper-light">{p.technologies!.slice(0, 2).join(" · ")}</p>}
                <h3 className="mt-3 text-[1.75rem] leading-tight">{p.title}</h3>
                {p.summary && <p className="mt-3 text-paper-text/75">{p.summary}</p>}
              </div>
            ))}
          </div>
          {partners.length > 0 && (
            <div className="mt-14 border-t border-ink-line pt-8">
              <p className="text-sm text-paper-text/60">Advisory and education roles with</p>
              <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3 font-serif text-2xl text-paper/90">
                {partners.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* Research ------------------------------------------------------- */}
      {featuredPubs.length > 0 && (
        <Section
          number={pad(++n)}
          label="Research"
          title={`${pubCount}+ peer-reviewed publications`}
          id="research"
          action={<Link href="/research" className="link-quiet text-[0.9375rem]">All publications →</Link>}
        >
          <ol className="divide-y divide-rule border-y border-rule">
            {featuredPubs.map((p) => (
              <li key={p.id} className="py-7">
                <PublicationCitation pub={p} />
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Recognition ---------------------------------------------------- */}
      {honors.length > 0 && (
        <section aria-label="Recognition" className="border-y border-rule bg-paper-deep">
          <ul className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 md:px-10 lg:grid-cols-5">
            {honors.map((h) => (
              <li key={h.title}>
                <p className="text-xs font-medium tabular-nums tracking-[0.08em] text-copper-dark">{h.year}</p>
                <p className="mt-1 font-serif text-xl leading-snug">{h.title}</p>
                {h.organization && <p className="mt-1 text-sm text-slate">{h.organization}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Testimonials (only shown once consented quotes exist) ---------- */}
      {testimonials.length > 0 && (
        <Section number={pad(++n)} label="Patient voices" id="patients">
          <div className="grid gap-10 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t._id} className="border-t border-ink pt-6">
                <blockquote className="font-serif text-2xl leading-snug">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-slate">
                  {[t.attribution, t.procedure].filter(Boolean).join(" · ")}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* Appointments --------------------------------------------------- */}
      <section className="bg-ink text-paper" aria-labelledby="visit-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-7">
            <p className="eyebrow text-copper-light">Appointments</p>
            <h2 id="visit-title" className="mt-4 text-4xl leading-[1.05] md:text-6xl">
              {closing[0]}
              {closing[1] && <span className="italic text-copper-light"> {closing[1]}</span>}
            </h2>
            {settings.appointments?.note && <p className="mt-6 max-w-[50ch] text-paper-text/80">{settings.appointments.note}</p>}
            <p className="mt-8">
              <SmartLink href={booking.href} className="btn btn-copper">{booking.label}</SmartLink>
            </p>
          </div>
          <ul className="space-y-8 md:col-span-5">
            {activeLocations.map((l) => (
              <li key={l._id} className="border-l border-copper/60 pl-5">
                <p className="font-serif text-2xl">{l.name}</p>
                {l.institution && <p className="text-sm text-paper-text/70">{l.institution}</p>}
                {l.address && <p className="mt-2 whitespace-pre-line text-paper-text/85">{l.address}</p>}
                {l.note && <p className="mt-2 text-sm text-copper-light">{l.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
