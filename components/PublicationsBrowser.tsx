"use client";

import { useDeferredValue, useMemo, useState } from "react";

import type { Publication } from "@/lib/publication-shared";
import { PUBLICATION_TYPE_LABELS } from "@/lib/site";

import { PublicationCitation } from "./PublicationCitation";

const PAGE = 25;

/** Search + type filter over the merged ORCID/CV/Sanity list, grouped by year. */
export function PublicationsBrowser({ publications }: { publications: Publication[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [limit, setLimit] = useState(PAGE);
  const deferred = useDeferredValue(query);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of publications) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [publications]);

  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    return publications.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        (!q || [p.title, p.authors, p.journal, String(p.year ?? "")].some((f) => f?.toLowerCase().includes(q))),
    );
  }, [publications, type, deferred]);

  const shown = filtered.slice(0, limit);
  const groups: { year: string; items: Publication[] }[] = [];
  for (const p of shown) {
    const year = p.year ? String(p.year) : "Undated";
    const last = groups.at(-1);
    if (last?.year === year) last.items.push(p);
    else groups.push({ year, items: [p] });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-rule pb-6 md:flex-row md:items-center md:justify-between">
        <label className="relative block md:w-96">
          <span className="sr-only">Search publications</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="Search by title, journal, co-author or year"
            className="w-full rounded-full border border-rule bg-white/60 px-5 py-2.5 text-[0.9375rem] placeholder:text-slate/70 focus:border-copper focus:outline-none"
          />
        </label>
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
          {[["all", publications.length] as const, ...types].map(([value, count]) => (
            <button
              key={value}
              type="button"
              aria-pressed={type === value}
              onClick={() => {
                setType(value);
                setLimit(PAGE);
              }}
              className="rounded-full border border-rule px-3.5 py-1.5 text-sm transition-colors hover:border-copper aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {value === "all" ? "All" : PUBLICATION_TYPE_LABELS[value] ?? "Other"} <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-slate" aria-live="polite">
        {filtered.length === publications.length ? `${publications.length} publications` : `${filtered.length} of ${publications.length} publications`}
      </p>

      {groups.map((group) => (
        <section key={group.year} className="grid gap-x-10 border-b border-rule py-8 md:grid-cols-12">
          <h3 className="font-serif text-3xl text-copper-dark md:col-span-2">{group.year}</h3>
          <ol className="mt-4 space-y-7 md:col-span-10 md:mt-0">
            {group.items.map((p) => (
              <li key={p.id}>
                <PublicationCitation pub={p} showType />
              </li>
            ))}
          </ol>
        </section>
      ))}

      {filtered.length > limit && (
        <p className="mt-10 text-center">
          <button type="button" onClick={() => setLimit((n) => n + PAGE * 2)} className="btn btn-ghost">
            Show more ({filtered.length - limit} remaining)
          </button>
        </p>
      )}
    </div>
  );
}
