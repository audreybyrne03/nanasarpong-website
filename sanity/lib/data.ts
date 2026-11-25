import "server-only";

import { cache } from "react";

import {
  seedGrants,
  seedIndustryRoles,
  seedInnovationProjects,
  seedLocations,
  seedMedia,
  seedProcedures,
  seedProfile,
  seedPublicationEntries,
  seedSettings,
  seedSpeaking,
  seedTestimonials,
} from "@/content/seed";
import { fetchOrcidWorks } from "@/lib/orcid";
import { countPeerReviewed, mergePublications, type Publication } from "@/lib/publications";

import { isSanityConfigured } from "../env";
import { sanityFetch } from "./fetch";
import * as Q from "./queries";
import type {
  Grant,
  IndustryRole,
  InnovationProject,
  Location,
  MediaItem,
  Procedure,
  Profile,
  PublicationEntry,
  SiteSettings,
  SpeakingItem,
  Testimonial,
} from "./types";

/**
 * Every page reads content through these helpers.
 *
 * With Sanity connected, content comes from Sanity. Before that (or if Sanity
 * is unreachable) the starter content from content/seed.ts is used, so the
 * site is never blank. Each helper is deduplicated per request.
 */
function load<T>(query: string, tags: string[], fallback: T, params?: Record<string, string>) {
  return async (): Promise<T> => {
    if (!isSanityConfigured) return fallback;
    const result = await sanityFetch<T>({ query, tags, params });
    return result ?? fallback;
  };
}

export const getSettings = cache(load<SiteSettings>(Q.SETTINGS_QUERY, ["siteSettings"], seedSettings));
export const getProfile = cache(load<Profile>(Q.PROFILE_QUERY, ["profile"], seedProfile));
export const getLocations = cache(load<Location[]>(Q.LOCATIONS_QUERY, ["location"], seedLocations));
export const getProcedures = cache(load<Procedure[]>(Q.PROCEDURES_QUERY, ["procedure"], seedProcedures));
export const getIndustryRoles = cache(load<IndustryRole[]>(Q.INDUSTRY_QUERY, ["industryRole"], seedIndustryRoles));
export const getInnovationProjects = cache(load<InnovationProject[]>(Q.INNOVATION_QUERY, ["innovationProject"], seedInnovationProjects));
export const getGrants = cache(load<Grant[]>(Q.GRANTS_QUERY, ["grant"], seedGrants));
export const getSpeaking = cache(load<SpeakingItem[]>(Q.SPEAKING_QUERY, ["speakingItem"], seedSpeaking));
export const getMedia = cache(load<MediaItem[]>(Q.MEDIA_QUERY, ["mediaItem"], seedMedia));
export const getTestimonials = cache(load<Testimonial[]>(Q.TESTIMONIALS_QUERY, ["testimonial"], seedTestimonials));
const getPublicationEntries = cache(load<PublicationEntry[]>(Q.PUBLICATION_ENTRIES_QUERY, ["publication"], seedPublicationEntries));

export const getProcedure = cache(async (slug: string): Promise<Procedure | null> => {
  if (!isSanityConfigured) return seedProcedures.find((p) => p.slug === slug) ?? null;
  const result = await sanityFetch<Procedure>({ query: Q.PROCEDURE_QUERY, params: { slug }, tags: ["procedure"] });
  return result ?? seedProcedures.find((p) => p.slug === slug) ?? null;
});

/** ORCID + CV archive + Sanity overrides, merged and de-duplicated. */
export const getPublications = cache(async (): Promise<Publication[]> => {
  const [settings, entries] = await Promise.all([getSettings(), getPublicationEntries()]);
  const orcid = await fetchOrcidWorks(settings.orcid?.orcidId ?? seedSettings.orcid?.orcidId);
  return mergePublications({
    orcid,
    entries,
    includeCvArchive: settings.orcid?.includeCvArchive ?? true,
    hiddenIds: settings.orcid?.hiddenIds ?? [],
  });
});

export const getPublicationCount = cache(async () => countPeerReviewed(await getPublications()));
