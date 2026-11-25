import { defineField, defineType } from "sanity";

/** Heading + intro copy for a section landing page (Research, Publications, …). */
export const pageIntro = defineType({
  name: "pageIntro",
  title: "Page introduction",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: "title", title: "Page title", type: "string" }),
    defineField({ name: "intro", title: "Introduction", type: "simpleText" }),
    defineField({ name: "seo", title: "SEO & sharing", type: "seo" }),
  ],
});
