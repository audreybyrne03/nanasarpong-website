import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

/** Image with required alt text and optional caption/credit. */
export const figure = defineType({
  name: "figure",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for screen readers. Leave blank only if purely decorative.",
      validation: (rule) =>
        rule.custom((alt, ctx) => {
          const parent = ctx.parent as { asset?: unknown } | undefined;
          if (parent?.asset && !alt) return "Alternative text helps visitors using screen readers.";
          return true;
        }).warning(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "credit", title: "Credit", type: "string" }),
  ],
});
