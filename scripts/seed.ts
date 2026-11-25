/**
 * One-time import of the starter content (content/seed.ts) into Sanity.
 *
 *   npm run seed            # creates documents that don't exist yet (safe to re-run)
 *   npm run seed -- --force # overwrites existing documents with the starter content
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (an Editor token
 * from sanity.io/manage → API → Tokens) in .env.local.
 */
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { join } from "node:path";

import { createClient } from "next-sanity";

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
} from "../content/seed";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const force = process.argv.includes("--force");

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-10-01", useCdn: false });

type Doc = Record<string, unknown> & { _id: string; _type: string };

const key = () => randomUUID().slice(0, 12);

/** Plain text with blank-line paragraphs → Portable Text. */
function blocks(text: string | null | undefined) {
  if (!text) return undefined;
  if (typeof text !== "string") return text;
  return text.split(/\n\s*\n/).map((para) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text: para.trim(), marks: [] }],
  }));
}

/** Add _key (and _type where given) to every item in an array. */
function keyed<T extends object>(items: T[] | null | undefined, type?: string) {
  return items?.map((item) => ({ ...(type ? { _type: type } : {}), ...item, _key: key() }));
}

function strip<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")) as T;
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset}${force ? " (overwriting)" : ""}…`);

  const s = seedSettings;
  const pageIntro = (p: typeof s.aboutPage) => (p ? strip({ _type: "pageIntro", title: p.title, intro: blocks(p.intro as string) }) : undefined);
  const settings: Doc = strip({
    _id: "siteSettings",
    _type: "siteSettings",
    title: s.title,
    tagline: s.tagline,
    description: s.description,
    announcement: s.announcement ? strip({ ...s.announcement, link: s.announcement.link ? { _type: "link", ...s.announcement.link } : undefined }) : undefined,
    hero: s.hero
      ? strip({
          ...s.hero,
          primaryCta: s.hero.primaryCta ? { _type: "link", ...s.hero.primaryCta } : undefined,
          secondaryCta: s.hero.secondaryCta ? { _type: "link", ...s.hero.secondaryCta } : undefined,
        })
      : undefined,
    stats: keyed(s.stats?.map((st) => strip({ ...st, auto: st.auto ?? "none" })), "stat"),
    pillars: keyed(s.pillars, "pillar"),
    sectionTitles: s.sectionTitles,
    appointments: s.appointments ? strip(s.appointments) : undefined,
    contact: s.contact ? strip(s.contact) : undefined,
    orcid: s.orcid ? { ...s.orcid, hiddenIds: s.orcid.hiddenIds ?? [] } : undefined,
    disclosure: s.disclosure ? { text: s.disclosure.text, links: keyed(s.disclosure.links, "link") } : undefined,
    socialLinks: keyed(s.socialLinks, "socialLink"),
    footerNote: s.footerNote,
    medicalDisclaimer: s.medicalDisclaimer,
    aboutPage: pageIntro(s.aboutPage),
    carePage: pageIntro(s.carePage),
    researchPage: pageIntro(s.researchPage),
    innovationPage: pageIntro(s.innovationPage),
    speakingPage: pageIntro(s.speakingPage),
    mediaPage: pageIntro(s.mediaPage),
    appointmentsPage: pageIntro(s.appointmentsPage),
    shareCard: s.shareCard,
  });

  // Portrait: upload the starter image once.
  let portrait: Record<string, unknown> | undefined;
  if (seedProfile.portrait?.localSrc) {
    const asset = await client.assets.upload("image", createReadStream(join(process.cwd(), "public", seedProfile.portrait.localSrc)), {
      filename: "sarpong-portrait.jpg",
    });
    portrait = { _type: "figure", asset: { _type: "reference", _ref: asset._id }, alt: seedProfile.portrait.alt };
  }

  const p = seedProfile;
  const profile: Doc = strip({
    _id: "profile",
    _type: "profile",
    name: p.name,
    credentials: p.credentials,
    role: p.role,
    affiliation: p.affiliation,
    portrait,
    boardCertification: p.boardCertification,
    languages: p.languages,
    shortBio: p.shortBio,
    bio: blocks(p.bio as string),
    specialties: p.specialties,
    mentorship: p.mentorship,
    training: keyed(p.training, "timelineItem"),
    appointments: keyed(p.appointments, "timelineItem"),
    leadership: keyed(p.leadership, "timelineItem"),
    editorial: keyed(p.editorial, "timelineItem"),
    memberships: keyed(p.memberships, "timelineItem"),
    honors: keyed(p.honors, "honor"),
  });

  const docs: Doc[] = [
    settings,
    profile,
    ...seedLocations.map((l, i) => strip({ ...l, _type: "location", order: (i + 1) * 10 }) as Doc),
    ...seedProcedures.map(
      (pr, i) =>
        strip({
          ...pr,
          _type: "procedure",
          slug: { _type: "slug", current: pr.slug },
          body: blocks(pr.body as string),
          order: (i + 1) * 10,
        }) as Doc,
    ),
    ...seedIndustryRoles.map((r, i) => strip({ ...r, _type: "industryRole", order: (i + 1) * 10 }) as Doc),
    ...seedInnovationProjects.map((pr, i) => strip({ ...pr, _type: "innovationProject", links: keyed(pr.links, "link"), order: (i + 1) * 10 }) as Doc),
    ...seedGrants.map((g) => strip({ ...g, _type: "grant" }) as Doc),
    ...seedSpeaking.map((sp) => strip({ ...sp, _type: "speakingItem" }) as Doc),
    ...seedMedia.map((m) => strip({ ...m, _type: "mediaItem" }) as Doc),
    ...seedPublicationEntries.map((pub) => strip({ ...pub, _type: "publication" }) as Doc),
  ];

  const tx = client.transaction();
  for (const doc of docs) {
    if (force) tx.createOrReplace(doc);
    else tx.createIfNotExists(doc);
  }
  await tx.commit();
  console.log(`Done: ${docs.length} documents ${force ? "written" : "created (existing ones left untouched)"}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
