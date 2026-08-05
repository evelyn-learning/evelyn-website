import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Lead, type ILead } from "@/models";
import { landingPathForSegment } from "@/lib/outreach/segment-landing";

// Public, ungated tracked demo link. Must never leak whether a token exists:
// unknown token, DB errors, anything unexpected -> 302 to "/", never a 404
// or an error page. Writes on every request, so this route can't be
// statically optimized.
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://evelynlearning.com";
  try {
    await connectDB();
    const ua = request.headers.get("user-agent") ?? "";
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
