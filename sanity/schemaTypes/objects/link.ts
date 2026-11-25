import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Full URL (https://…), an internal path (/research), or mailto:.",
      validation: (rule) =>
        rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "url" } },
});
