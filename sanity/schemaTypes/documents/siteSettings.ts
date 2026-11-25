import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const PAGES = [
  ["aboutPage", "About page"],
  ["carePage", "Hip & Knee Care page"],
  ["researchPage", "Research page"],
  ["innovationPage", "Innovation page"],
  ["speakingPage", "Speaking page"],
  ["mediaPage", "Media page"],
  ["appointmentsPage", "Appointments page"],
] as const;

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "home", title: "Homepage", default: true },
    { name: "practice", title: "Appointments & contact" },
    { name: "publications", title: "Publications (ORCID)" },
    { name: "pages", title: "Page intros" },
    { name: "general", title: "General & SEO" },
  ],
  fields: [
    // --- General ---------------------------------------------------------
    defineField({ name: "title", title: "Site title", type: "string", group: "general", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "general" }),
    defineField({
      name: "description",
      title: "Default description",
      type: "text",
      rows: 3,
      group: "general",
      description: "Used by search engines and link previews when a page has no description of its own.",
    }),
    defineField({ name: "socialLinks", title: "Profile links", type: "array", group: "general", of: [defineArrayMember({ type: "socialLink" })] }),
    defineField({ name: "footerNote", title: "Footer note", type: "string", group: "general" }),
    defineField({ name: "medicalDisclaimer", title: "Medical disclaimer (footer)", type: "text", rows: 3, group: "general" }),
    defineField({
      name: "shareCard",
      title: "Link preview cards",
      type: "object",
      group: "general",
      options: { collapsible: true },
      fields: [
        defineField({ name: "byline", title: "Byline", type: "string" }),
        defineField({ name: "homeTitle", title: "Homepage card title", type: "string" }),
        defineField({ name: "homeSubtitle", title: "Homepage card subtitle", type: "string" }),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Homepage sharing image (optional)",
      type: "image",
      group: "general",
      description: "Replaces the automatically generated homepage card. 1200×630.",
    }),

    // --- Homepage --------------------------------------------------------
    defineField({
      name: "announcement",
      title: "Announcement bar",
      type: "object",
      group: "home",
      description: "A thin banner across the top of every page — e.g. the move to HSS. It shows only between the dates you set.",
      options: { collapsible: true },
      fields: [
        defineField({ name: "enabled", title: "Show announcement", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "link", title: "Link (optional)", type: "link" }),
        defineField({ name: "showFrom", title: "Show from", type: "date" }),
        defineField({ name: "showUntil", title: "Show until", type: "date" }),
      ],
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", title: "Small line above the headline", type: "string" }),
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({
          name: "emphasis",
          title: "Italic words",
          type: "string",
          description: "Optional: words from the end of the headline to set in italic, typed exactly as in the headline.",
        }),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
        defineField({ name: "primaryCta", title: "Primary button", type: "link" }),
        defineField({ name: "secondaryCta", title: "Secondary button", type: "link" }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Highlight numbers",
      type: "array",
      group: "home",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "auto",
              title: "Value",
              type: "string",
              initialValue: "none",
              options: {
                list: [
                  { title: "Type it in", value: "none" },
                  { title: "Automatic: number of peer-reviewed publications", value: "publications" },
                ],
                layout: "radio",
              },
            }),
            defineField({ name: "value", title: "Number or short text", type: "string", hidden: ({ parent }) => parent?.auto === "publications" }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label", auto: "auto" }, prepare: ({ title, subtitle, auto }) => ({ title: auto === "publications" ? "(auto)" : title, subtitle }) },
        }),
      ],
    }),
    defineField({
      name: "pillars",
      title: "“The approach” — three short pillars",
      type: "array",
      group: "home",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "pillar",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),

    defineField({
      name: "sectionTitles",
      title: "Homepage section headings",
      type: "object",
      group: "home",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "approach", title: "“The approach” heading", type: "string" }),
        defineField({ name: "innovation", title: "Innovation heading", type: "string" }),
        defineField({ name: "closing", title: "Closing appointment heading", type: "string", description: "Last word(s) after a “|” are set in italic, e.g. Ready to move | without pain?" }),
      ],
    }),

    // --- Appointments & contact ------------------------------------------
    defineField({
      name: "appointments",
      title: "Appointments",
      type: "object",
      group: "practice",
      fields: [
        defineField({
          name: "bookingUrl",
          title: "Online booking link",
          type: "url",
          description: "The HSS scheduling or profile page. Every “Request an appointment” button uses this. Leave blank to send visitors to the Appointments page.",
        }),
        defineField({ name: "bookingLabel", title: "Booking button label", type: "string" }),
        defineField({ name: "phone", title: "Appointment phone", type: "string" }),
        defineField({ name: "note", title: "Short note", type: "text", rows: 2 }),
        defineField({ name: "comingSoonNote", title: "Shown while no booking link or phone is set", type: "text", rows: 2 }),
        defineField({ name: "insuranceNote", title: "Insurance note", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact e-mails",
      type: "object",
      group: "practice",
      description: "Optional. Only filled-in addresses are shown. Patients are always pointed to the office rather than e-mail.",
      fields: [
        defineField({ name: "officeEmail", title: "Office / general", type: "email" }),
        defineField({ name: "mediaEmail", title: "Media & speaking requests", type: "email" }),
        defineField({ name: "industryEmail", title: "Industry & innovation inquiries", type: "email" }),
      ],
    }),
    defineField({
      name: "disclosure",
      title: "Industry disclosure statement",
      type: "object",
      group: "practice",
      fields: [
        defineField({ name: "text", title: "Statement", type: "text", rows: 4 }),
        defineField({ name: "links", title: "Links", type: "array", of: [defineArrayMember({ type: "link" })] }),
      ],
    }),

    // --- Publications ----------------------------------------------------
    defineField({
      name: "orcid",
      title: "ORCID publication sync",
      type: "object",
      group: "publications",
      description:
        "Publications are pulled automatically from ORCID about twice a day. To feature, hide or correct a paper, or to add one that isn’t on ORCID, use “Publications” in the sidebar.",
      fields: [
        defineField({
          name: "orcidId",
          title: "ORCID iD",
          type: "string",
          validation: (r) => r.regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/i, { name: "ORCID iD" }).warning(),
        }),
        defineField({
          name: "includeCvArchive",
          title: "Also include publications from the CV",
          type: "boolean",
          initialValue: true,
          description: "Keeps older papers that aren’t on ORCID. Duplicates are merged automatically.",
        }),
        defineField({
          name: "hiddenIds",
          title: "Hide these (DOI, PMID or exact title)",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),

    // --- Page intros -----------------------------------------------------
    ...PAGES.map(([name, title]) => defineField({ name, title, type: "pageIntro", group: "pages" })),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
