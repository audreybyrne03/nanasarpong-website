import Link from "next/link";

/** Fallback for URLs that don't match any route. */
export default function GlobalNotFound() {
  return (
    <div className="flex flex-1 flex-col bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-24 md:px-10 md:py-32">
        <div className="mb-10 h-px w-24 bg-copper" aria-hidden />
        <h1 className="text-5xl md:text-7xl">Page not found</h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-paper-text/85">
          This page doesn’t exist or may have moved. Check the address, or return to the homepage.
        </p>
        <p className="mt-10">
          <Link href="/" className="btn btn-copper">Go to the homepage</Link>
        </p>
      </div>
    </div>
  );
}
