import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead } from "@/models";
import { LEAD_SEGMENTS, PRODUCTS } from "@/lib/outreach/enums";
import { mergeOptionValues } from "@/lib/crm/console-helpers";

// GET - the values the Pipeline's Product/Segment dropdowns offer: the seed
// lists plus every distinct value already on a lead (round-2 §2). Cheap
// enough to re-fetch after every inline save, which is how a brand-new
// "Other…" value becomes available on every other row.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const [products, segments] = await Promise.all([
      Lead.distinct("product") as Promise<(string | null)[]>,
      Lead.distinct("segment") as Promise<(string | null)[]>,
    ]);
    return NextResponse.json({
      products: mergeOptionValues(PRODUCTS, products),
      segments: mergeOptionValues(LEAD_SEGMENTS, segments),
    });
  } catch (error) {
    console.error("[OUTREACH] options GET Error:", error);
    return NextResponse.json({ error: "Failed to load options" }, { status: 500 });
  }
}
