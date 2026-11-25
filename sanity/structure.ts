import { CogIcon } from "@sanity/icons/Cog";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar, grouped the way Dr. Sarpong (or a delegate) will think
 * about updates: practice details, academic work, and visibility.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
      S.listItem()
        .title("Profile & bio")
        .id("profile")
        .icon(UserIcon)
        .child(S.document().schemaType("profile").documentId("profile").title("Profile & bio")),
      S.divider().title("Practice"),
      S.documentTypeListItem("location").title("Office locations"),
      S.documentTypeListItem("procedure").title("Procedures"),
      S.documentTypeListItem("testimonial").title("Patient testimonials"),
      S.divider().title("Academic & innovation"),
      S.documentTypeListItem("publication").title("Publications (feature / hide / add)"),
      S.documentTypeListItem("grant").title("Research grants"),
      S.documentTypeListItem("innovationProject").title("Innovation projects"),
      S.documentTypeListItem("industryRole").title("Industry & advisory roles"),
      S.divider().title("Visibility"),
      S.documentTypeListItem("speakingItem").title("Talks & courses"),
      S.documentTypeListItem("mediaItem").title("Media"),
    ]);
