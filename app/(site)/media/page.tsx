import { EmptyNote, PageHeader, Section } from "@/components/PageHeader";
import { SanityImage } from "@/components/SanityImage";
import { SmartLink } from "@/components/SmartLink";
import { sectionMetadata } from "@/lib/pageMeta";
import { clean, formatDate, MEDIA_TYPE_LABELS } from "@/lib/site";
import { getMedia, getSettings } from "@/sanity/lib/data";

export const generateMetadata = sectionMetadata("mediaPage", "Media", "/media");

export default async function MediaPage() {
  const [settings, items] = await Promise.all([getSettings(), getMedia()]);
  const page = settings.mediaPage;
  const email = settings.contact?.mediaEmail;

  return (
    <>
      <PageHeader eyebrow="Media" title={page?.title || "Media"} intro={page?.intro} />
      <Section number="01" label="Features, video & recognition" id="media">
        {items.length ? (
          <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <li key={m._id} className="border-t border-ink pt-5">
                {m.image && <SanityImage image={m.image} width={420} aspect={16 / 9} sizes="(min-width: 1024px) 360px, 100vw" className="mb-4 h-auto w-full" />}
                <p className="text-sm text-slate">
                  <span className="text-copper-dark">{MEDIA_TYPE_LABELS[clean(m.type) ?? ""] ?? "Media"}</span>
                  {m.outlet && ` · ${m.outlet}`}
                  {m.date && ` · ${formatDate(m.date, "month")}`}
                </p>
                <h2 className="mt-2 text-2xl leading-snug">
                  {m.url ? <SmartLink href={m.url} className="link-quiet">{m.title}</SmartLink> : m.title}
                </h2>
                {m.summary && <p className="mt-2 text-[0.9375rem] text-slate">{m.summary}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote>Media features will appear here.</EmptyNote>
        )}
      </Section>
      <Section number="02" label="Press inquiries" tone="deep" id="press">
        <p className="max-w-[60ch] text-lg">
          Dr. Sarpong comments on joint replacement, surgical technology and artificial intelligence, health equity, and the business of medicine.
        </p>
        <p className="mt-6">
          {email ? (
            <SmartLink href={`mailto:${email}?subject=Media%20inquiry`} className="btn btn-ink">E-mail a media request</SmartLink>
          ) : (
            <SmartLink href="/appointments#contact" className="btn btn-ghost">Contact</SmartLink>
          )}
        </p>
      </Section>
    </>
  );
}
