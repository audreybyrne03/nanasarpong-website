import { PageHeader, Section } from "@/components/PageHeader";
import { SmartLink } from "@/components/SmartLink";
import { sectionMetadata } from "@/lib/pageMeta";
import { isActiveWindow, telHref } from "@/lib/site";
import { getLocations, getSettings } from "@/sanity/lib/data";

export const generateMetadata = sectionMetadata("appointmentsPage", "Appointments", "/appointments");

export default async function AppointmentsPage() {
  const [settings, locations] = await Promise.all([getSettings(), getLocations()]);
  const page = settings.appointmentsPage;
  const appt = settings.appointments ?? {};
  const active = locations.filter((l) => isActiveWindow(null, l.endDate));
  const hasBooking = Boolean(appt.bookingUrl || appt.phone);
  const emails = [
    { label: "Office", value: settings.contact?.officeEmail },
    { label: "Media & speaking", value: settings.contact?.mediaEmail },
    { label: "Industry & innovation", value: settings.contact?.industryEmail },
  ].filter((e) => e.value);

  return (
    <>
      <PageHeader eyebrow="Appointments" title={page?.title || "Appointments"} intro={page?.intro}>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {appt.bookingUrl && (
            <SmartLink href={appt.bookingUrl} className="btn btn-copper">{appt.bookingLabel || "Request an appointment"}</SmartLink>
          )}
          {appt.phone && (
            <a href={telHref(appt.phone)} className="btn btn-ghost-light">Call {appt.phone}</a>
          )}
        </div>
        {!hasBooking && appt.comingSoonNote && (
          <p className="mt-8 max-w-[60ch] border-l-2 border-copper pl-4 text-paper-text/85">{appt.comingSoonNote}</p>
        )}
      </PageHeader>

      <Section number="01" label="Where to find Dr. Sarpong" id="locations">
        <ul className="grid gap-10 md:grid-cols-2">
          {active.map((l) => (
            <li key={l._id} className="border-t border-ink pt-6">
              <h2 className="text-3xl">{l.name}</h2>
              {l.institution && <p className="text-slate">{l.institution}</p>}
              {l.address && <p className="mt-4 whitespace-pre-line">{l.address}</p>}
              {l.note && <p className="mt-3 text-sm text-copper-dark">{l.note}</p>}
              <p className="mt-5 flex flex-wrap gap-3 text-sm">
                {l.phone && <a href={telHref(l.phone)} className="btn btn-ghost">{l.phone}</a>}
                {l.bookingUrl && <SmartLink href={l.bookingUrl} className="btn btn-ink">Book at this office</SmartLink>}
                {l.mapUrl && <SmartLink href={l.mapUrl} className="btn btn-ghost">Directions</SmartLink>}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section number="02" label="Before your visit" tone="deep" id="visit">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="border-t border-ink pt-5">
            <h2 className="text-2xl">Bring your imaging</h2>
            <p className="mt-2 text-slate">Recent X-rays or MRIs of the hip or knee, ideally on disc or through a shareable link, plus any operative reports from prior joint surgery.</p>
          </div>
          <div className="border-t border-ink pt-5">
            <h2 className="text-2xl">Insurance</h2>
            <p className="mt-2 text-slate">{appt.insuranceNote || "Please confirm coverage with the office when scheduling."}</p>
          </div>
          <div className="border-t border-ink pt-5">
            <h2 className="text-2xl">Second opinions</h2>
            <p className="mt-2 text-slate">Dr. Sarpong sees patients considering hip or knee replacement and those with a painful or failed prior replacement.</p>
          </div>
        </div>
      </Section>

      <Section number="03" label="Contact" id="contact">
        {emails.length ? (
          <dl className="grid gap-8 md:grid-cols-3">
            {emails.map((e) => (
              <div key={e.label} className="border-t border-ink pt-5">
                <dt className="eyebrow text-copper-dark">{e.label}</dt>
                <dd className="mt-2"><a href={`mailto:${e.value}`} className="link-quiet text-lg">{e.value}</a></dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="max-w-[60ch] text-slate">For appointments, please use the scheduling details above. Media, speaking and industry inquiries can be directed through Dr. Sarpong’s office.</p>
        )}
        <p className="mt-8 max-w-[70ch] text-sm text-slate">Please do not send personal health information by e-mail or through this website. For urgent medical concerns, call 911 or go to the nearest emergency department.</p>
      </Section>
    </>
  );
}
