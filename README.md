# Dr. Nana O. Sarpong — website

Personal practice and academic website for Nana O. Sarpong, MD, MBA (hip & knee replacement, Hospital for Special Surgery). Built with Next.js 16 (App Router, TypeScript, Tailwind v4) and Sanity CMS, deployed on Vercel. Same architecture as `audreybyrne-website`.

Everything routine is edited in the Studio at **`/studio`**, with no code changes. Publications update themselves from ORCID.

## Updating the site (for Dr. Sarpong or a delegate)

| To change… | In the Studio go to |
| --- | --- |
| Booking link, phone, insurance note, contact e-mails | **Site settings → Appointments & contact** |
| The HSS announcement bar (and when it disappears) | **Site settings → Homepage → Announcement bar** |
| Homepage headline, buttons, highlight numbers, pillars | **Site settings → Homepage** |
| Bio, portrait, training, roles, honors, societies, CV PDF | **Profile & bio** |
| Offices (each can auto-appear/disappear by date) | **Office locations** |
| Procedure pages | **Procedures** |
| A new advisory board, consulting or education role | **Industry & advisory roles** |
| Innovation areas (robotics, mixed reality, AI…) | **Innovation projects** |
| Grants | **Research grants** (amounts are hidden unless “Show amount” is ticked) |
| Talks and course faculty | **Talks & courses** (dates in the future show as “Upcoming” automatically) |
| Press, videos, recognition | **Media** |
| Patient quotes | **Patient testimonials** — only shown when “consent on file” is ticked |
| Featuring, hiding or correcting a paper | **Publications** — see below |

Published changes go live within about a minute (instantly if the webhook below is set up).

### Publications (automatic from ORCID)

The Research page merges three sources and removes duplicates (matching on DOI, PubMed ID or title):

1. **ORCID `0000-0002-4574-8966`** — pulled about every 12 hours. *The only thing Dr. Sarpong has to do is keep ORCID current* (ORCID can auto-import from Crossref/PubMed via “Search & link”).
2. **The CV archive** (`content/cv-publications.json`, 83 articles + 8 chapters from the Nov 2026 CV) so older papers show even if they aren’t on ORCID. Can be turned off in *Site settings → Publications*.
3. **Studio → Publications** entries. Enter just a DOI, PMID or exact title of an existing paper to **feature** it (homepage + top of Research), **hide** it, fix a field, or add a plain-language summary. Or fill in the full citation to add something ORCID doesn’t have (in press, chapters).

Author lists come from ORCID, else Crossref; Dr. Sarpong’s name is bolded. To pull from ORCID immediately: `https://<site>/api/refresh-publications?secret=<SANITY_REVALIDATE_SECRET>`.

## First-time setup (Audrey)

1. **GitHub** — push this folder to a new private repo (e.g. `nanosarpong-website`).
2. **Sanity** — create a new project for Dr. Sarpong at sanity.io/manage (free plan is fine). Invite him (and yourself) as members. Under **API → CORS origins** add `http://localhost:3000`, the Vercel URL and the final domain, each with *Allow credentials*.
3. **Seed content** — copy `.env.example` to `.env.local`, fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` and an Editor token in `SANITY_API_WRITE_TOKEN`, then:
   ```bash
   npm install
   npm run seed        # imports the CV-based starter content + portrait (safe to re-run)
   ```
   Delete the write token afterwards.
4. **Vercel** — import the repo. Env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_API_READ_TOKEN` (Viewer, for draft preview), `SANITY_REVALIDATE_SECRET`, and `NEXT_PUBLIC_SITE_URL` (Production only).
5. **Domain (Cloudflare)** — add the domain in Vercel, then in Cloudflare DNS create the records Vercel shows (apex `A` → `76.76.21.21`, `www` `CNAME` → `cname.vercel-dns.com`), **DNS only (grey cloud)**.
6. **Instant updates (optional)** — Sanity → API → Webhooks: URL `https://<site>/api/revalidate`, trigger on create/update/delete, projection `{_type}`, secret = `SANITY_REVALIDATE_SECRET`.

Until step 2 is done the site renders the starter content from `content/seed.ts`, so a Vercel preview works immediately.

## Before launch — content to confirm with Dr. Sarpong

- HSS booking link, appointment phone (212.774.7274, taken from the booking link) and HSS profile are set in Site settings → Appointments; confirm the phone number is the one he wants listed.
- Public contact e-mails (none are published by default; his personal e-mail and mobile from the CV are intentionally left off).
- Procedure page wording (general patient education, written from his CV/clinical profile; he should review).
- Industry roles and disclosure wording; whether to add LinkedIn/Doximity/Instagram links; languages spoken.
- Hero copy and stats.

Private CV details (home address, mobile, NPI/DEA/licence numbers, birthplace) are deliberately not on the site.

## Development

```bash
npm run dev     # http://localhost:3000 and /studio
npm run build
npm test        # ORCID parsing + publication merge tests
npm run lint
```

```
app/(site)/          Public pages: / about care care/[slug] research innovation speaking media appointments
app/studio/          Embedded Sanity Studio
app/api/             draft-mode, revalidate (Sanity webhook), refresh-publications (ORCID)
content/             Starter content from the CV (seed.ts, cv-publications.json, cv-speaking.json)
lib/orcid.ts         ORCID + Crossref fetch (cached 12 h, fails safe)
lib/publications.ts  Merge / de-duplicate / overrides
sanity/              Schemas, queries, Studio structure, data layer (falls back to starter content)
scripts/seed.ts      One-time import into Sanity
```
