import Image from "next/image";

import { hasImage, urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

interface Props {
  image?: SanityImageType | null;
  /** Rendered width in CSS pixels at the largest breakpoint. */
  width: number;
  /** Optional fixed aspect ratio (width / height); otherwise the original ratio. */
  aspect?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  alt?: string;
}

/** next/image wrapper for Sanity assets: responsive, blur placeholder, crop/hotspot aware. */
export function SanityImage({ image, width, aspect, sizes, className, priority, alt }: Props) {
  // Starter content: a file in /public, before the image is uploaded to Sanity.
  const local = image?.localSrc && !image.asset ? image : null;
  if (local?.localSrc) {
    const ratio = aspect ?? local.dimensions?.aspectRatio ?? 3 / 2;
    return (
      <Image
        src={local.localSrc}
        width={width}
        height={Math.round(width / ratio)}
        sizes={sizes}
        alt={alt ?? local.alt ?? ""}
        className={`${className ?? ""} object-cover`}
        priority={priority}
      />
    );
  }
  if (!hasImage(image)) return null;

  const ratio = aspect ?? image.dimensions?.aspectRatio ?? 3 / 2;
  const height = Math.round(width / ratio);
  let builder = urlFor(image).width(width * 2);
  if (aspect) builder = builder.height(height * 2).fit("crop");

  return (
    <Image
      src={builder.url()}
      width={width}
      height={height}
      sizes={sizes}
      alt={alt ?? image.alt ?? ""}
      className={className}
      priority={priority}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip ?? undefined}
    />
  );
}
