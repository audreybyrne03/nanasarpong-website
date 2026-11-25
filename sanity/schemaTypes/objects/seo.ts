import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO & sharing",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Shown in browser tabs and search results. Leave blank to use the page title.",
      validation: (rule) => rule.max(70).warning("Search engines usually truncate titles over 70 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "One or two sentences for search results and link previews.",
      validation: (rule) => rule.max(160).warning("Aim for 160 characters or fewer."),
    }),
    defineField({
      name: "ogImage",
      title: "Custom sharing image",
      type: "image",
      description: "Optional. A branded preview card is generated automatically; upload an image here only to replace it. 1200×630.",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
