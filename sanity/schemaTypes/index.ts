import type { SchemaTypeDefinition } from "sanity";

import {
  grant,
  industryRole,
  innovationProject,
  location,
  mediaItem,
  procedure,
  publication,
  speakingItem,
  testimonial,
} from "./documents/collections";
import { profile } from "./documents/profile";
import { siteSettings } from "./documents/siteSettings";
import { blockContent, simpleText } from "./objects/blockContent";
import { figure } from "./objects/figure";
import { link } from "./objects/link";
import { pageIntro } from "./objects/pageIntro";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  profile,
  // Collections
  location,
  procedure,
  publication,
  grant,
  innovationProject,
  industryRole,
  speakingItem,
  mediaItem,
  testimonial,
  // Objects
  seo,
  figure,
  link,
  socialLink,
  pageIntro,
  blockContent,
  simpleText,
];

/** Document types that should only ever have one instance. */
export const singletonTypes = new Set(["siteSettings", "profile"]);
