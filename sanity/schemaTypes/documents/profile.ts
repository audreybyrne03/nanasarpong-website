import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Reusable "years · title · organization" row used for training, roles, editorial work. */
const timeline = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "array",
    description,
    of: [
      defineArrayMember({
        type: "object",
        name: "timelineItem",
        fields: [
          defineField({ name: "years", title: "Years", type: "string", description: "e.g. 2021–2022 or 2026–" }),
          defineField({ name: "title", title: "Title / role", type: "string", validation: (r) => r.required() }),
          defineField({ name: "organization", title: "Organization", type: "string" }),
          defineField({ name: "detail", title: "Detail (optional)", type: "string" }),
        ],
        preview: { select: { title: "title", subtitle: "organization", years: "years" }, prepare: ({ title, subtitle, years }) => ({ title, subtitle: [years, subtitle].filter(Boolean).join(" · ") }) },
      }),
    ],
  });

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "bio", title: "Biography" },
    { name: "career", title: "Training & roles" },
    { name: "recognition", title: "Honors & societies" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({ name: "credentials", title: "Degrees", type: "string", group: "basics", description: "Shown exactly as typed, e.g. MD, MBA" }),
    defineField({ name: "role", title: "Role", type: "string", group: "basics" }),
    defineField({ name: "affiliation", title: "Current affiliation", type: "string", group: "basics" }),
    defineField({ name: "portrait", title: "Portrait", type: "figure", group: "basics" }),
    defineField({ name: "boardCertification", title: "Board certification", type: "string", group: "basics" }),
    defineField({ name: "languages", title: "Languages spoken", type: "array", group: "basics", of: [defineArrayMember({ type: "string" })] }),
    defineField({
      name: "cv",
      title: "CV (PDF, optional)",
      type: "file",
      group: "basics",
      options: { accept: "application/pdf" },
      description: "If uploaded, a “Download CV” link appears on the About page. Remove personal contact details before uploading.",
    }),
    defineField({ name: "shortBio", title: "Short bio", type: "text", rows: 3, group: "bio", description: "Two or three sentences for the homepage." }),
    defineField({ name: "bio", title: "Full biography", type: "blockContent", group: "bio" }),
    defineField({ name: "specialties", title: "Clinical focus", type: "array", group: "bio", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "mentorship", title: "Teaching & mentorship statement", type: "text", rows: 3, group: "bio" }),
    timeline("training", "Education & training", "Shown as the timeline on the homepage and About page, oldest first."),
    timeline("appointments", "Academic & hospital appointments"),
    timeline("leadership", "Leadership & service"),
    timeline("editorial", "Editorial roles"),
    timeline("memberships", "Professional societies"),
    defineField({
      name: "honors",
      title: "Honors & awards",
      type: "array",
      group: "recognition",
      description: "Tick “Featured” to show an honor in the homepage recognition strip.",
      of: [
        defineArrayMember({
          type: "object",
          name: "honor",
          fields: [
            defineField({ name: "year", title: "Year", type: "string" }),
            defineField({ name: "title", title: "Honor", type: "string", validation: (r) => r.required() }),
            defineField({ name: "organization", title: "Awarded by", type: "string" }),
            defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "title", subtitle: "organization", year: "year", featured: "featured" }, prepare: ({ title, subtitle, year, featured }) => ({ title: `${featured ? "★ " : ""}${title}`, subtitle: [year, subtitle].filter(Boolean).join(" · ") }) },
        }),
      ],
    }),
  ].map((field) => {
    // Put the timeline arrays into their tabs.
    if (["training", "appointments", "leadership", "editorial"].includes(field.name)) return { ...field, group: "career" };
    if (field.name === "memberships") return { ...field, group: "recognition" };
    return field;
  }),
  preview: { select: { title: "name", subtitle: "role", media: "portrait" } },
});
