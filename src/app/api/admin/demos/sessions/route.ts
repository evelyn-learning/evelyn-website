import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DemoSession, DemoInteraction } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    // Session detail mode
    if (sessionId) {
      const demoSession = await DemoSession.findOne({ sessionId });
      if (!demoSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      // Also fetch corresponding DemoInteraction events
      const events = await DemoInteraction.find({ sessionId })
        .sort({ timestamp: 1 })
        .lean();

      return NextResponse.json({
        session: demoSession,
        events,
      });
    }

    // Session list mode
    const productId = searchParams.get("productId");
    const days = parseInt(searchParams.get("days") || "30");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {
      startedAt: { $gte: startDate },
    };
    if (productId) {
      filter.productId = productId;
    }

    const [sessions, total] = await Promise.all([
      DemoSession.find(filter)
        .select("-interactions") // Exclude interactions array for performance
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DemoSession.countDocuments(filter),
    ]);

    // Get distinct product IDs for the filter dropdown
    const products = await DemoSession.aggregate([
      { $match: { startedAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$productId",
          productTitle: { $first: "$productTitle" },
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { sessionCount: -1 } },
    ]);

    return NextResponse.json({
      sessions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products: products.map((p) => ({
        productId: p._id,
        productTitle: p.productTitle,
        sessionCount: p.sessionCount,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_DEMO_SESSIONS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
