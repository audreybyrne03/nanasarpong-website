import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

const at = (...locations: { title: string; href: string }[]) => defineLocations({ locations });

/** Tells the Presentation tool which page shows each document. */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([{ route: "/care/:slug", filter: `_type == "procedure" && slug.current == $slug` }]),
  locations: {
    siteSettings: defineLocations({ message: "Used across the whole site", tone: "positive", locations: [{ title: "Home", href: "/" }] }),
    profile: at({ title: "About", href: "/about" }, { title: "Home", href: "/" }),
    procedure: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || "Untitled", href: `/care/${doc?.slug}` },
          { title: "Hip & Knee Care", href: "/care" },
        ],
      }),
    }),
    location: at({ title: "Appointments", href: "/appointments" }, { title: "Home", href: "/" }),
    testimonial: at({ title: "Home", href: "/" }),
    publication: at({ title: "Research", href: "/research" }, { title: "Home", href: "/" }),
    grant: at({ title: "Research", href: "/research" }),
    innovationProject: at({ title: "Innovation", href: "/innovation" }, { title: "Home", href: "/" }),
    industryRole: at({ title: "Innovation", href: "/innovation" }),
    speakingItem: at({ title: "Speaking", href: "/speaking" }),
    mediaItem: at({ title: "Media", href: "/media" }, { title: "Home", href: "/" }),
  },
};
