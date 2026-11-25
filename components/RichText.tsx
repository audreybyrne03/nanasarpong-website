import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

import { SanityImage } from "./SanityImage";
import { SmartLink } from "./SmartLink";

const components: PortableTextComponents = {
  types: {
    figure: ({ value }: { value: SanityImageType }) => (
      <figure>
        <SanityImage image={value} width={760} sizes="(min-width: 768px) 760px, 100vw" className="h-auto w-full" />
        {(value.caption || value.credit) && (
          <figcaption className="mt-3 font-sans text-sm leading-snug text-slate">
            {value.caption}
            {value.caption && value.credit ? " " : null}
            {value.credit && <span className="text-slate/80">Credit: {value.credit}</span>}
          </figcaption>
        )}
      </figure>
    ),
  },
  marks: {
    link: ({ value, children }) => (value?.href ? <SmartLink href={value.href}>{children}</SmartLink> : <>{children}</>),
    sup: ({ children }) => <sup>{children}</sup>,
    sub: ({ children }) => <sub>{children}</sub>,
  },
};

/**
 * Renders Portable Text from Sanity, or a plain string (starter content) with
 * blank lines between paragraphs.
 */
export function RichText({ value, className }: { value?: PortableTextBlock[] | string | null; className?: string }) {
  if (!value?.length) return null;
  if (typeof value === "string") {
    return (
      <div className={className}>
        {value.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>{para.trim()}</p>
        ))}
      </div>
    );
  }
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}

export function hasRichText(value?: PortableTextBlock[] | string | null): boolean {
  return Boolean(value?.length);
}
