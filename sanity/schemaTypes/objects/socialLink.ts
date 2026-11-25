import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

export const SOCIAL_PLATFORMS = [
  { title: "Instagram", value: "instagram" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "X", value: "x" },
  { title: "YouTube", value: "youtube" },
  { title: "Doximity", value: "doximity" },
  { title: "VuMedi", value: "vumedi" },
  { title: "ORCID", value: "orcid" },
  { title: "Google Scholar", value: "google-scholar" },
  { title: "ResearchGate", value: "researchgate" },
  { title: "PubMed", value: "pubmed" },
  { title: "Website", value: "website" },
  { title: "Other", value: "other" },
] as const;

/** A profile link shown in the footer and on the Contact page. */
export const socialLink = defineType({
  name: "socialLink",
  title: "Profile link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: [...SOCIAL_PLATFORMS], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "handle",
      title: "Handle",
      type: "string",
      description: "Optional, e.g. @username. Shown beside the link on the Contact page.",
    }),
    defineField({
      name: "label",
      title: "Custom label",
      type: "string",
      description: "Optional. Defaults to the platform name.",
    }),
  ],
  preview: {
    select: { platform: "platform", label: "label", handle: "handle", url: "url" },
    prepare: ({ platform, label, handle, url }) => ({
      title: label || SOCIAL_PLATFORMS.find((p) => p.value === platform)?.title || "Link",
      subtitle: handle || url,
    }),
  },
});
