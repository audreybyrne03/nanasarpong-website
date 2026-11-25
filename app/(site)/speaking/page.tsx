import { EmptyNote, PageHeader, Section } from "@/components/PageHeader";
import { SmartLink } from "@/components/SmartLink";
import { sectionMetadata } from "@/lib/pageMeta";
import { clean, formatDate, isUpcoming, SPEAKING_KIND_LABELS } from "@/lib/site";
import { getProfile, getSettings, getSpeaking } from "@/sanity/lib/data";
import type { SpeakingItem } from "@/sanity/lib/types";

export const generateMetadata = sectionMetadata("speakingPage", "Speaking & Education", "/speaking");

function Item({ item }: { item: SpeakingItem }) {
  return (
    <li className="grid gap-1 py-5 md:grid-cols-12 md:gap-6">
      <p className="text-sm tabular-nums text-copper-dark md:col-span-2 md:pt-1">{formatDate(item.date, "month")}</p>
      <div className="md:col-span-7">
        <p className="font-serif text-xl leading-snug">
          {item.url ? <SmartLink href={item.url} className="link-quiet">{item.title}</SmartLink> : item.title}
        </p>
        {item.event && <p className="text-slate">{item.event}</p>}
      </div>
      <div className="text-sm text-slate md:col-span-3 md:text-right">
        {item.role && <p className="text-ink">{item.role}</p>}
        {item.location && <p>{item.location}</p>}
      </div>
    </li>
  );
}

export default async function SpeakingPage() {
  const [settings, items, profile] = await Promise.all([getSettings(), getSpeaking(), getProfile()]);
  const page = settings.speakingPage;
  const sorted = [...items].sort((a, b) => (clean(b.date) ?? "").localeCompare(clean(a.date) ?? ""));
  const upcoming = sorted.filter((i) => isUpcoming(i.date)).reverse();
  const past = sorted.filter((i) => !isUpcoming(i.date));
  const courses = past.filter((i) => clean(i.kind) === "course");
  const talks = past.filter((i) => clean(i.kind) !== "course");
  const email = settings.contact?.mediaEmail;
  let n = 0;
  const pad = () => String(++n).padStart(2, "0");

  return (
    <>
      <PageHeader eyebrow="Speaking" title={page?.title || "Speaking & Education"} intro={page?.intro}>
        <p className="mt-10">
          {email ? (
            <SmartLink href={`mailto:${email}?subject=Speaking%20request`} className="btn btn-copper">Invite Dr. Sarpong to speak</SmartLink>
          ) : (
            <SmartLink href="/appointments#contact" className="btn btn-ghost-light">Speaking requests</SmartLink>
          )}
        </p>
      </PageHeader>

      <Section number={pad()} label="Upcoming" id="upcoming">
        {upcoming.length ? (
          <ol className="divide-y divide-rule border-y border-rule">{upcoming.map((i) => <Item key={i._id} item={i} />)}</ol>
        ) : (
          <EmptyNote>New engagements will be listed here.</EmptyNote>
        )}
      </Section>
      {talks.length > 0 && (
        <Section number={pad()} label="Invited lectures & panels" tone="deep" id="lectures">
          <ol className="divide-y divide-rule border-y border-rule">{talks.map((i) => <Item key={i._id} item={i} />)}</ol>
        </Section>
      )}
      {courses.length > 0 && (
        <Section number={pad()} label={SPEAKING_KIND_LABELS.course} id="courses">
          <ol className="divide-y divide-rule border-y border-rule">{courses.map((i) => <Item key={i._id} item={i} />)}</ol>
        </Section>
      )}
      {profile.mentorship && (
        <Section number={pad()} label="Teaching & mentorship" tone="ink" id="teaching">
          <p className="max-w-[60ch] font-serif text-3xl leading-snug">{profile.mentorship}</p>
        </Section>
      )}
    </>
  );
}
