import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { revalidateSecret } from "@/sanity/lib/token";

/**
 * Re-pull publications from ORCID immediately instead of waiting for the
 * twice-daily refresh. Open in a browser:
 *   https://<site>/api/refresh-publications?secret=<SANITY_REVALIDATE_SECRET>
 */
export async function GET(req: NextRequest) {
  if (!revalidateSecret || req.nextUrl.searchParams.get("secret") !== revalidateSecret) {
    return NextResponse.json({ message: "Invalid or missing secret" }, { status: 401 });
  }
  revalidateTag("orcid", "max");
  return NextResponse.json({ refreshed: true, note: "Publications will be re-fetched from ORCID on the next page view." });
}
