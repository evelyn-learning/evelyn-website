import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { LeadSuppression, type ILeadSuppression } from "@/models";

// GET - the most recent suppressions (deleted leads), newest first. Feeds the
// Import tab's "Deleted leads" list; capped at 100 because it is a recovery
// aid, not an audit log.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const docs = await LeadSuppression.find({})
      .sort({ deletedAt: -1 })
      .limit(100)
      .select("_id company deletedAt emails")
      .lean<Pick<ILeadSuppression, "_id" | "company" | "deletedAt" | "emails">[]>();
    return NextResponse.json({
      deleted: docs.map((d) => ({
        _id: String(d._id),
        company: d.company,
        deletedAt: new Date(d.deletedAt).toISOString(),
        emails: d.emails ?? [],
      })),
    });
  } catch (error) {
    console.error("[OUTREACH] deleted leads GET Error:", error);
    return NextResponse.json({ error: "Failed to load deleted leads" }, { status: 500 });
  }
}
