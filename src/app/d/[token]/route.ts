import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead, type ILead } from "@/models";
import { landingPathForSegment } from "@/lib/outreach/segment-landing";

// Public, ungated tracked demo link. Unknown token, DB errors, anything
// unexpected -> 302 to "/", never a 404 or an error page. A valid token
// still 302s to its segment's landing path, not to "/", so this route
// doesn't make token existence *undetectable* — an observer who can compare
// destinations can tell a valid token from an invalid one. What it does
// avoid is a distinguishable *error signal* (a 404/500 vs. a redirect) that
// would make guessing cheap; with 64-bit random tokens, enumeration by
// destination alone isn't practically exploitable. Writes on every request,
// so this route can't be statically optimized.
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com";
  try {
    await connectDB();
    // Cap the stored UA — some clients send multi-KB User-Agent headers, and
    // at 50 stored visits per lead ($slice below) an uncapped header could
    // add hundreds of KB of junk per lead across a lead list.
    const ua = (request.headers.get("user-agent") ?? "").slice(0, 300);
    const lead = await Lead.findOneAndUpdate(
      { demoToken: token },
      { $push: { demoVisits: { $each: [{ at: new Date(), ua }], $slice: -50 } } },
      { new: false }
    ).lean<ILead>();
    const path = lead ? landingPathForSegment(lead.segment) : "/";
    return NextResponse.redirect(new URL(path, base), 302);
  } catch (error) {
    console.error("[DEMO-LINK] Error:", error);
    return NextResponse.redirect(new URL("/", base), 302);
  }
}
