import Link from "next/link";
import type { ComponentProps } from "react";

import { clean, isExternal } from "@/lib/site";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string };

/** Internal paths use next/link; external URLs open in a new tab. */
export function SmartLink({ href, children, ...rest }: Props) {
  const url = clean(href);
  if (isExternal(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (url.startsWith("mailto:") || url.startsWith("tel:")) {
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={url} {...rest}>
      {children}
    </Link>
  );
}
