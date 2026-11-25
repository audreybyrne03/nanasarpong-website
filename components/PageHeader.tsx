import type { RichValue } from "@/sanity/lib/types";

import { RichText } from "./RichText";

/** Navy page masthead used by every section landing page. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: RichValue | null;
  children?: React.ReactNode;
}) {
  return (
    <header className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
        {eyebrow && <p className="eyebrow text-copper-light">{eyebrow}</p>}
        <div className="hero-rule mt-5 h-px w-24 bg-copper" aria-hidden />
        <h1 className="mt-8 max-w-[18ch] text-5xl leading-[1.02] md:text-7xl">{title}</h1>
        {intro && <RichText value={intro} className="prose-on-ink mt-6 max-w-[60ch] text-lg leading-relaxed text-paper-text/85" />}
        {children}
      </div>
    </header>
  );
}

/** Section with a numbered label in the left column, editorial-magazine style. */
export function Section({
  number,
  label,
  title,
  children,
  tone = "paper",
  id,
  action,
}: {
  number?: string;
  label: string;
  title?: string;
  children: React.ReactNode;
  tone?: "paper" | "deep" | "ink";
  id?: string;
  action?: React.ReactNode;
}) {
  const bg = tone === "ink" ? "bg-ink text-paper" : tone === "deep" ? "bg-paper-deep" : "";
  const labelColor = tone === "ink" ? "text-copper-light" : "text-copper-dark";
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={bg}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={`eyebrow ${labelColor}`}>
              {number && <span className="mr-3 tabular-nums">{number}</span>}
              {label}
            </p>
            {title && <h2 id={id ? `${id}-title` : undefined} className="mt-4 max-w-[22ch] text-4xl leading-[1.05] md:text-[3.25rem]">{title}</h2>}
          </div>
          {action}
        </div>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="border-l-2 border-rule pl-4 text-slate">{children}</p>;
}
