import { clean, getSiteUrl, isActiveWindow } from "@/lib/site";
import { hasImage, urlFor } from "@/sanity/lib/image";
import type { Location, Profile, SiteSettings } from "@/sanity/lib/types";

/**
 * schema.org Physician data for search engines (helps Google show the right
 * name, specialty, hospital, phone and profile links). Rendered on the homepage.
 */
export function PhysicianJsonLd({ settings, profile, locations }: { settings: SiteSettings; profile: Profile; locations: Location[] }) {
  const url = getSiteUrl();
  const sameAs = [
    clean(settings.appointments?.profileUrl),
    ...(settings.socialLinks ?? []).map((l) => clean(l.url)),
  ].filter((v, i, a): v is string => Boolean(v) && a.indexOf(v) === i);

  const addresses = locations
    .filter((l) => isActiveWindow(null, l.endDate) && l.address)
    .map((l) => {
      const [street, cityLine] = clean(l.address)!.split("\n");
      const m = /^(.*),\s*([A-Z]{2})\s+(\d{5})/.exec(cityLine ?? "");
      return {
        "@type": "PostalAddress",
        streetAddress: street,
        ...(m ? { addressLocality: m[1], addressRegion: m[2], postalCode: m[3] } : {}),
        addressCountry: "US",
      };
    });

  const portrait = profile.portrait;
  const localSrc = portrait?.localSrc;
  const portraitUrl = hasImage(portrait) ? urlFor(portrait).width(800).url() : localSrc ? `${url}${localSrc}` : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${url}/#physician`,
    name: `Dr. ${clean(profile.name)}${profile.credentials ? `, ${clean(profile.credentials)}` : ""}`,
    url,
    description: clean(settings.description) || undefined,
    medicalSpecialty: "Orthopedic",
    image: portraitUrl,
    telephone: clean(settings.appointments?.phone) || undefined,
    address: addresses.length === 1 ? addresses[0] : addresses.length ? addresses : undefined,
    hospitalAffiliation: { "@type": "Hospital", name: "Hospital for Special Surgery", url: "https://www.hss.edu" },
    knowsAbout: profile.specialties?.map(clean) ?? undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output; "<" escaped so content can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
