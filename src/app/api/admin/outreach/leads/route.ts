import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead } from "@/models";

// GET - List leads with optional status/segment/due filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const segment = searchParams.get("segment");

    const query: Record<string, unknown> = {};
    if (status) query.status = { $in: status.split(",") };
    if (segment) query.segment = segment;
    if (searchParams.get("due") === "1") {
      query.nextActionAt = { $lte: new Date() };
      query.status = { $in: ["approved", "contacted"] };
    }

    const leads = await Lead.find(query)
      .sort({ nextActionAt: 1, updatedAt: -1 })
      .lean();

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[OUTREACH] GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
