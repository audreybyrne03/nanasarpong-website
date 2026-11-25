import { BookIcon } from "@sanity/icons/Book";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { CaseIcon } from "@sanity/icons/Case";
import { CommentIcon } from "@sanity/icons/Comment";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HeartIcon } from "@sanity/icons/Heart";
import { MicrophoneIcon } from "@sanity/icons/Microphone";
import { PinIcon } from "@sanity/icons/Pin";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon as TrophyIcon } from "@sanity/icons/Star";
import { defineArrayMember, defineField, defineType } from "sanity";

const orderField = defineField({
  name: "order",
  title: "Sort order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 100,
});

const orderings = [
  { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" as const }] },
];

/** "YYYY", "YYYY-MM" or "YYYY-MM-DD", so partial dates from a CV can be entered as-is. */
const flexibleDate = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    description: "YYYY, YYYY-MM or YYYY-MM-DD",
    validation: (r) => r.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, { name: "date" }),
  });

export const procedure = defineType({
  name: "procedure",
  title: "Procedure",
  type: "document",
  icon: HeartIcon,
  orderings,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: [{ title: "Hip", value: "hip" }, { title: "Knee", value: "knee" }, { title: "Revision & complex", value: "revision" }], layout: "radio" },
    }),
    defineField({ name: "summary", title: "One-line summary", type: "text", rows: 2 }),
    defineField({ name: "highlights", title: "Highlights", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.max(4) }),
    defineField({ name: "body", title: "Page content", type: "blockContent" }),
    defineField({ name: "image", title: "Image (optional)", type: "figure" }),
    defineField({ name: "featured", title: "Show on homepage", type: "boolean", initialValue: true }),
    orderField,
    defineField({ name: "seo", title: "SEO & sharing", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "summary", media: "image" } },
});

export const location = defineType({
  name: "location",
  title: "Office location",
  type: "document",
  icon: PinIcon,
  orderings,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "institution", title: "Sub-heading", type: "string", description: "e.g. Main Campus, Upper East Side" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "bookingUrl", title: "Booking link for this office (optional)", type: "url" }),
    defineField({ name: "mapUrl", title: "Map link", type: "url" }),
    defineField({ name: "note", title: "Note", type: "string", description: "Hours, parking, which days Dr. Sarpong is in clinic…" }),
    defineField({ name: "startDate", title: "Show from", type: "date", description: "Optional. The office appears from this date." }),
    defineField({ name: "endDate", title: "Show until", type: "date", description: "Optional. The office disappears after this date." }),
    orderField,
  ],
  preview: { select: { title: "name", subtitle: "institution" } },
});

export const industryRole = defineType({
  name: "industryRole",
  title: "Industry & advisory role",
  type: "document",
  icon: CaseIcon,
  orderings,
  fields: [
    defineField({ name: "organization", title: "Company / organization", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Advisory board", value: "advisory" },
          { title: "Consulting", value: "consulting" },
          { title: "Product design", value: "design" },
          { title: "Surgeon education", value: "education" },
          { title: "Research collaboration", value: "research" },
          { title: "Innovation committee", value: "committee" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({ name: "years", title: "Years", type: "string", description: "e.g. 2024–" }),
    defineField({ name: "current", title: "Current", type: "boolean", initialValue: true }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "url", title: "Link", type: "url" }),
    defineField({ name: "logo", title: "Logo (optional)", type: "figure" }),
    orderField,
  ],
  preview: { select: { title: "organization", subtitle: "role", media: "logo" } },
});

export const innovationProject = defineType({
  name: "innovationProject",
  title: "Innovation project",
  type: "document",
  icon: BulbOutlineIcon,
  orderings,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4 }),
    defineField({ name: "technologies", title: "Tags", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "status", title: "Status", type: "string", description: "e.g. Active, Completed, Patent pending" }),
    defineField({ name: "partners", title: "Partners (optional)", type: "string" }),
    defineField({ name: "image", title: "Image (optional)", type: "figure" }),
    defineField({ name: "links", title: "Links", type: "array", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "featured", title: "Show on homepage", type: "boolean", initialValue: false }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "status", media: "image" } },
});

export const grant = defineType({
  name: "grant",
  title: "Research grant",
  type: "document",
  icon: TrophyIcon,
  orderings: [{ title: "Year, newest first", name: "yearDesc", by: [{ field: "year", direction: "desc" }] }],
  fields: [
    defineField({ name: "title", title: "Project title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "funder", title: "Funder", type: "string", validation: (r) => r.required() }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string", description: "e.g. Principal Investigator" }),
    defineField({ name: "amount", title: "Amount", type: "string" }),
    defineField({ name: "showAmount", title: "Show amount on the website", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "funder", year: "year" }, prepare: ({ title, subtitle, year }) => ({ title, subtitle: [year, subtitle].filter(Boolean).join(" · ") }) },
});

export const speakingItem = defineType({
  name: "speakingItem",
  title: "Talk / course",
  type: "document",
  icon: MicrophoneIcon,
  orderings: [{ title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  fields: [
    defineField({ name: "title", title: "Talk or course title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      initialValue: "lecture",
      options: {
        list: [
          { title: "Course faculty", value: "course" },
          { title: "Invited lecture", value: "lecture" },
          { title: "Grand rounds", value: "grand-rounds" },
          { title: "Panel", value: "panel" },
          { title: "Webinar", value: "webinar" },
          { title: "Podium presentation", value: "podium" },
          { title: "Podcast / media", value: "media" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({ name: "event", title: "Meeting / host", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string", description: "e.g. Faculty, Course Co-Chair, Panelist, Moderator" }),
    flexibleDate("date", "Date"),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "url", title: "Link (optional)", type: "url" }),
  ],
  preview: { select: { title: "title", subtitle: "event", date: "date" }, prepare: ({ title, subtitle, date }) => ({ title, subtitle: [date, subtitle].filter(Boolean).join(" · ") }) },
});

export const mediaItem = defineType({
  name: "mediaItem",
  title: "Media item",
  type: "document",
  icon: PlayIcon,
  orderings: [{ title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "outlet", title: "Outlet", type: "string" }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "News", value: "news" },
          { title: "Feature", value: "feature" },
          { title: "Podcast", value: "podcast" },
          { title: "Recognition", value: "award" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    flexibleDate("date", "Date"),
    defineField({ name: "url", title: "Link", type: "url" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image (optional)", type: "figure" }),
    defineField({ name: "featured", title: "Show on homepage", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "outlet", media: "image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Patient testimonial",
  type: "document",
  icon: CommentIcon,
  orderings,
  fields: [
    defineField({
      name: "consent",
      title: "Written patient consent to publish is on file",
      type: "boolean",
      initialValue: false,
      description: "Required. Testimonials are only shown on the site when this is ticked.",
      validation: (r) => r.custom((v) => (v ? true : "Confirm consent before publishing a testimonial.")),
    }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (r) => r.required().max(400) }),
    defineField({ name: "attribution", title: "Attribution", type: "string", description: "e.g. “J.M., age 62” — avoid full names unless the patient asked for it." }),
    defineField({ name: "procedure", title: "Procedure", type: "string" }),
    orderField,
  ],
  preview: { select: { title: "quote", subtitle: "attribution" } },
});

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  icon: BookIcon,
  description:
    "Most publications come from ORCID automatically. Use this to add one that isn’t on ORCID, or — by entering the same DOI, PMID or exact title — to feature, hide or correct one that is.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "doi", title: "DOI", type: "string", description: "e.g. 10.1016/j.arth.2024.01.001" }),
    defineField({ name: "pmid", title: "PubMed ID", type: "string" }),
    defineField({ name: "featured", title: "Featured (shown on homepage and at the top of Research)", type: "boolean" }),
    defineField({ name: "hidden", title: "Hide from the website", type: "boolean", initialValue: false }),
    defineField({ name: "summary", title: "Plain-language summary (optional)", type: "text", rows: 3 }),
    defineField({ name: "authors", title: "Authors", type: "string", description: "Only needed for papers not on ORCID, e.g. Smith J, Sarpong NO" }),
    defineField({ name: "journal", title: "Journal / book", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Journal article", value: "journal-article" },
          { title: "Review", value: "review" },
          { title: "Commentary / editorial", value: "editorial" },
          { title: "Book chapter", value: "book-chapter" },
          { title: "Conference abstract", value: "conference-abstract" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({ name: "url", title: "Link (if no DOI/PMID)", type: "url" }),
  ],
  validation: (r) => r.custom((doc) => (doc?.title || doc?.doi || doc?.pmid ? true : "Enter a title, DOI or PubMed ID.")),
  preview: {
    select: { title: "title", doi: "doi", pmid: "pmid", featured: "featured", hidden: "hidden" },
    prepare: ({ title, doi, pmid, featured, hidden }) => ({
      title: `${hidden ? "(hidden) " : featured ? "★ " : ""}${title || doi || pmid}`,
      subtitle: doi || (pmid ? `PMID ${pmid}` : "Manual entry"),
      media: DocumentTextIcon,
    }),
  },
});
