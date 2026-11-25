import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";

import { revalidateSecret } from "@/sanity/lib/token";

/**
 * Optional Sanity webhook target. When configured, published changes appear
 * on the site immediately instead of within ~60 seconds.
 * The request signature is verified with SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  if (!revalidateSecret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, revalidateSecret, true);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    revalidateTag("sanity", "max");
    if (body?._type) revalidateTag(body._type, "max");

    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (error) {
    console.error("[revalidate]", error);
    return NextResponse.json({ message: "Could not parse webhook body" }, { status: 400 });
  }
}
