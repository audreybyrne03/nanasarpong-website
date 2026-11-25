import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { SmartLink } from "@/components/SmartLink";
import { bookingLink } from "@/lib/booking";
import { buildMetadata } from "@/lib/metadata";
import { clean, DEFAULT_SITE_TITLE, PROCEDURE_CATEGORY_LABELS } from "@/lib/site";
import { getProcedure, getProcedures, getSettings } from "@/sanity/lib/data";

export async function generateStaticParams() {
  return (await getProcedures()).map((p) => ({ slug: clean(p.slug) }));
}

export async function generateMetadata(props: PageProps<"/care/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const [procedure, settings] = await Promise.all([getProcedure(slug), getSettings()]);
  if (!procedure) return { title: "Not found" };
  const title = clean(procedure.seo?.metaTitle) || clean(procedure.title);
  return {
    title,
    ...buildMetadata({
      siteTitle: clean(settings.title) || DEFAULT_SITE_TITLE,
      title,
      description: procedure.seo?.metaDescription || procedure.summary || settings.description,
      path: `/care/${clean(procedure.slug)}`,
    }),
    ...(procedure.seo?.noIndex ? { robots: { index: false } } : {}),
  };
}

export default async function ProcedurePage(props: PageProps<"/care/[slug]">) {
  const { slug } = await props.params;
  const [procedure, procedures, settings] = await Promise.all([getProcedure(slug), getProcedures(), getSettings()]);
  if (!procedure) notFound();
  const booking = bookingLink(settings);
  const others = procedures.filter((p) => p._id !== procedure._id).slice(0, 4);

  return (
    <article>
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pb-20 md:pt-16">
          <p className="text-sm text-paper-text/75">
            <Link href="/care" className="underline decoration-ink-line underline-offset-4 hover:text-paper hover:decoration-copper">Hip & Knee Care</Link>
            {procedure.category && <span> / {PROCEDURE_CATEGORY_LABELS[clean(procedure.category)]}</span>}
          </p>
          <div className="hero-rule mt-5 h-px w-24 bg-copper" aria-hidden />
          <h1 className="mt-8 max-w-[18ch] text-5xl leading-[1.02] md:text-7xl">{procedure.title}</h1>
          {procedure.summary && <p className="mt-6 max-w-[56ch] text-lg text-paper-text/85">{procedure.summary}</p>}
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12 md:px-10 md:py-20">
        <div className="md:col-span-8">
          {procedure.image && <SanityImage image={procedure.image} width={760} sizes="(min-width: 768px) 700px, 100vw" className="mb-10 h-auto w-full" />}
          <RichText value={procedure.body} className="prose-editorial" />
        </div>
        <aside className="space-y-10 md:col-span-4">
          {(procedure.highlights?.length ?? 0) > 0 && (
            <div className="border-t border-ink pt-5">
              <p className="eyebrow text-copper-dark">At a glance</p>
              <ul className="mt-4 space-y-2">
                {procedure.highlights!.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-copper" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-ink p-6 text-paper">
            <p className="font-serif text-2xl leading-snug">Is this the right option for you?</p>
            <p className="mt-2 text-sm text-paper-text/75">Every recommendation starts with a consultation, an examination and a review of your imaging.</p>
            <p className="mt-5">
              <SmartLink href={booking.href} className="btn btn-copper">{booking.label}</SmartLink>
            </p>
          </div>
          {others.length > 0 && (
            <div>
              <p className="eyebrow text-copper-dark">Other procedures</p>
              <ul className="mt-3 space-y-2">
                {others.map((p) => (
                  <li key={p._id}>
                    <Link href={`/care/${clean(p.slug)}`} className="link-quiet">{p.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
