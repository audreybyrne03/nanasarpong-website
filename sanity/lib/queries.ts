import { defineQuery } from "next-sanity";

/** Image fields with the metadata next/image needs (blur placeholder, ratio). */
const IMAGE = `{ ..., "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions }`;

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{ ..., ogImage${IMAGE} }`);

export const PROFILE_QUERY = defineQuery(
  `*[_id == "profile"][0]{ ..., portrait${IMAGE}, "cvUrl": cv.asset->url }`,
);

export const LOCATIONS_QUERY = defineQuery(`*[_type == "location"] | order(order asc, name asc)`);

const PROCEDURE_FIELDS = `_id, title, "slug": slug.current, category, summary, highlights, featured, image${IMAGE}`;

export const PROCEDURES_QUERY = defineQuery(`*[_type == "procedure" && defined(slug.current)] | order(order asc, title asc){ ${PROCEDURE_FIELDS} }`);

export const PROCEDURE_QUERY = defineQuery(
  `*[_type == "procedure" && slug.current == $slug][0]{ ${PROCEDURE_FIELDS}, body, seo }`,
);

export const PROCEDURE_SLUGS_QUERY = defineQuery(`*[_type == "procedure" && defined(slug.current)]{ "slug": slug.current }`);

export const INDUSTRY_QUERY = defineQuery(`*[_type == "industryRole"] | order(current desc, order asc){ ..., logo${IMAGE} }`);

export const INNOVATION_QUERY = defineQuery(`*[_type == "innovationProject"] | order(order asc){ ..., image${IMAGE} }`);

export const GRANTS_QUERY = defineQuery(`*[_type == "grant"] | order(year desc, title asc)`);

export const SPEAKING_QUERY = defineQuery(`*[_type == "speakingItem"] | order(date desc)`);

export const MEDIA_QUERY = defineQuery(`*[_type == "mediaItem"] | order(date desc){ ..., image${IMAGE} }`);

export const TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial" && consent == true] | order(order asc)`);

export const PUBLICATION_ENTRIES_QUERY = defineQuery(`*[_type == "publication"]`);

export const SITEMAP_QUERY = defineQuery(`{
  "procedures": *[_type == "procedure" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "latest": *[!(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt
}`);
