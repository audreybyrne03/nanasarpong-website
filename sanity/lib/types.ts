import type { PortableTextBlock } from "next-sanity";

/**
 * View types: the shape pages receive, whether the data came from Sanity
 * (see queries.ts projections) or from the bundled starter content in
 * content/seed.ts. Rich text may be Portable Text (Sanity) or a plain string
 * with blank-line paragraphs (starter content).
 */
export type RichValue = PortableTextBlock[] | string;

export interface SanityImage {
  _type?: "image" | "figure";
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  /** Starter content only: a file in /public, used before Sanity has the image. */
  localSrc?: string;
}

export interface Seo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: SanityImage | null;
  noIndex?: boolean | null;
}

export interface PageIntro {
  title?: string | null;
  intro?: RichValue | null;
  seo?: Seo | null;
}

export interface LinkValue {
  label: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle?: string | null;
  label?: string | null;
}

export interface Stat {
  value?: string | null;
  label: string;
  /** "publications" = count computed from the live publication list. */
  auto?: "publications" | "none" | null;
}

export interface Announcement {
  enabled?: boolean | null;
  text?: string | null;
  link?: LinkValue | null;
  showFrom?: string | null;
  showUntil?: string | null;
}

export interface SiteSettings {
  title?: string | null;
  tagline?: string | null;
  description?: string | null;
  announcement?: Announcement | null;
  hero?: {
    eyebrow?: string | null;
    headline?: string | null;
    /** Word(s) in the headline set in italic. */
    emphasis?: string | null;
    intro?: string | null;
    primaryCta?: LinkValue | null;
    secondaryCta?: LinkValue | null;
  } | null;
  stats?: Stat[] | null;
  sectionTitles?: { approach?: string | null; innovation?: string | null; closing?: string | null } | null;
  pillars?: { title: string; text: string }[] | null;
  appointments?: {
    bookingUrl?: string | null;
    bookingLabel?: string | null;
    phone?: string | null;
    note?: string | null;
    insuranceNote?: string | null;
    comingSoonNote?: string | null;
  } | null;
  contact?: {
    officeEmail?: string | null;
    mediaEmail?: string | null;
    industryEmail?: string | null;
  } | null;
  orcid?: {
    orcidId?: string | null;
    includeCvArchive?: boolean | null;
    hiddenIds?: string[] | null;
  } | null;
  disclosure?: {
    text?: string | null;
    links?: LinkValue[] | null;
  } | null;
  socialLinks?: SocialLink[] | null;
  footerNote?: string | null;
  medicalDisclaimer?: string | null;
  aboutPage?: PageIntro | null;
  carePage?: PageIntro | null;
  researchPage?: PageIntro | null;
  innovationPage?: PageIntro | null;
  speakingPage?: PageIntro | null;
  mediaPage?: PageIntro | null;
  appointmentsPage?: PageIntro | null;
  shareCard?: { byline?: string | null; homeTitle?: string | null; homeSubtitle?: string | null } | null;
  ogImage?: SanityImage | null;
}

export type PageKey =
  | "aboutPage"
  | "carePage"
  | "researchPage"
  | "innovationPage"
  | "speakingPage"
  | "mediaPage"
  | "appointmentsPage";

export interface TimelineItem {
  years?: string | null;
  title: string;
  organization?: string | null;
  detail?: string | null;
}

export interface Honor {
  year?: string | null;
  title: string;
  organization?: string | null;
  featured?: boolean | null;
}

export interface Profile {
  name: string;
  credentials?: string | null;
  role?: string | null;
  affiliation?: string | null;
  portrait?: SanityImage | null;
  shortBio?: string | null;
  bio?: RichValue | null;
  specialties?: string[] | null;
  training?: TimelineItem[] | null;
  appointments?: TimelineItem[] | null;
  leadership?: TimelineItem[] | null;
  honors?: Honor[] | null;
  memberships?: TimelineItem[] | null;
  editorial?: TimelineItem[] | null;
  mentorship?: string | null;
  boardCertification?: string | null;
  languages?: string[] | null;
  cvUrl?: string | null;
}

export interface Location {
  _id: string;
  name: string;
  institution?: string | null;
  address?: string | null;
  phone?: string | null;
  bookingUrl?: string | null;
  mapUrl?: string | null;
  note?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Procedure {
  _id: string;
  title: string;
  slug: string;
  category?: string | null;
  summary?: string | null;
  body?: RichValue | null;
  highlights?: string[] | null;
  featured?: boolean | null;
  image?: SanityImage | null;
  seo?: Seo | null;
}

export interface IndustryRole {
  _id: string;
  organization: string;
  role: string;
  type?: string | null;
  years?: string | null;
  current?: boolean | null;
  description?: string | null;
  url?: string | null;
  logo?: SanityImage | null;
}

export interface InnovationProject {
  _id: string;
  title: string;
  summary?: string | null;
  technologies?: string[] | null;
  status?: string | null;
  partners?: string | null;
  image?: SanityImage | null;
  links?: LinkValue[] | null;
  featured?: boolean | null;
}

export interface Grant {
  _id: string;
  title: string;
  funder: string;
  year?: string | null;
  role?: string | null;
  amount?: string | null;
  showAmount?: boolean | null;
}

export interface SpeakingItem {
  _id: string;
  kind?: string | null;
  title: string;
  event?: string | null;
  role?: string | null;
  date?: string | null;
  location?: string | null;
  url?: string | null;
}

export interface MediaItem {
  _id: string;
  title: string;
  outlet?: string | null;
  type?: string | null;
  date?: string | null;
  url?: string | null;
  summary?: string | null;
  image?: SanityImage | null;
  featured?: boolean | null;
}

export interface Testimonial {
  _id: string;
  quote: string;
  attribution?: string | null;
  procedure?: string | null;
}

/** A manual publication or an override for one that comes from ORCID. */
export interface PublicationEntry {
  _id: string;
  title?: string | null;
  doi?: string | null;
  pmid?: string | null;
  authors?: string | null;
  journal?: string | null;
  year?: number | null;
  type?: string | null;
  url?: string | null;
  summary?: string | null;
  featured?: boolean | null;
  hidden?: boolean | null;
}

export interface SitemapData {
  procedures: { slug: string; _updatedAt?: string }[];
  latest?: string | null;
}
