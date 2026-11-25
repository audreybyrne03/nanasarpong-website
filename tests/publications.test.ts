import assert from "node:assert/strict";
import { test } from "node:test";

import { formatAuthorName, normalizeDoi, parseBulkAuthors, parseCrossrefAuthors, parseWorks } from "../lib/orcid";
import { countPeerReviewed, mergePublications } from "../lib/publications";

// Shapes follow the ORCID v3.0 public API and the Crossref REST API.
const works = {
  group: [
    {
      "external-ids": {
        "external-id": [
          { "external-id-type": "doi", "external-id-value": "10.1016/J.ARTH.2019.02.040", "external-id-normalized": { value: "10.1016/j.arth.2019.02.040" }, "external-id-relationship": "self" },
          { "external-id-type": "pmid", "external-id-value": "30890392", "external-id-relationship": "self" },
        ],
      },
      "work-summary": [
        {
          "put-code": 111,
          title: { title: { value: "Conversion Hemiarthroplasty to Total Hip Arthroplasty: A Comparison to Primary and Revision Total Hip Arthroplasty" } },
          "journal-title": { value: "The Journal of Arthroplasty" },
          type: "journal-article",
          "publication-date": { year: { value: "2019" } },
        },
      ],
    },
    {
      "external-ids": { "external-id": [{ "external-id-type": "doi", "external-id-value": "10.9999/new.2027.001", "external-id-relationship": "self" }] },
      "work-summary": [
        {
          "put-code": 222,
          title: { title: { value: "A Brand New Paper Only On ORCID About Mixed Reality" } },
          "journal-title": { value: "Arthroplasty Today" },
          type: "journal-article",
          "publication-date": { year: { value: "2027" } },
        },
      ],
    },
    { "work-summary": [{ "put-code": 333, title: null }] },
  ],
};

test("parses ORCID works", () => {
  const parsed = parseWorks(works);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].doi, "10.1016/j.arth.2019.02.040");
  assert.equal(parsed[0].pmid, "30890392");
  assert.equal(parsed[0].year, 2019);
});

test("author formatting", () => {
  assert.equal(formatAuthorName("Nana O.", "Sarpong"), "Sarpong NO");
  assert.equal(normalizeDoi("https://doi.org/10.1/ABC"), "10.1/abc");
  const bulk = parseBulkAuthors({ bulk: [{ work: { "put-code": 222, contributors: { contributor: [{ "credit-name": { value: "Audrey R. Byrne" } }, { "credit-name": { value: "Nana O. Sarpong" } }] } } }] });
  assert.equal(bulk.get(222), "Byrne AR, Sarpong NO");
  const cr = parseCrossrefAuthors({ message: { items: [{ DOI: "10.9999/NEW.2027.001", author: [{ given: "Nana O", family: "Sarpong" }] }] } });
  assert.equal(cr.get("10.9999/new.2027.001"), "Sarpong NO");
});

test("merges ORCID with CV archive and overrides without duplicates", () => {
  const orcid = parseWorks(works);
  const cvOnly = mergePublications({ orcid: [], entries: [] });
  const merged = mergePublications({
    orcid,
    entries: [
      { _id: "a", doi: "10.9999/new.2027.001", featured: true, summary: "Plain summary" },
      { _id: "b", pmid: "31064724", hidden: true },
      { _id: "c", title: "An In-Press Paper Entered By Hand In Sanity", journal: "JBJS", year: 2027 },
    ],
  });
  // ORCID paper already in the CV is merged, not duplicated; one new ORCID paper + one manual are added; one hidden.
  assert.equal(merged.length, cvOnly.length + 1 + 1 - 1);
  const conversion = merged.filter((p) => p.title.startsWith("Conversion Hemiarthoplasty") || p.title.startsWith("Conversion Hemiarthroplasty"));
  assert.equal(conversion.length, 1);
  assert.equal(conversion[0].source, "orcid");
  assert.equal(conversion[0].pmid, "30890392");
  const fresh = merged.find((p) => p.doi === "10.9999/new.2027.001");
  assert.equal(fresh?.featured, true);
  assert.equal(merged[0].year, 2027);
  assert.ok(countPeerReviewed(merged) >= 80);
});
