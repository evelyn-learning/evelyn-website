import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { DemoInteraction } from "@/models";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get overall stats
    const [totalViews, totalTries, totalCompletes, uniqueSessions] = await Promise.all([
      DemoInteraction.countDocuments({ eventType: "view", timestamp: { $gte: startDate } }),
      DemoInteraction.countDocuments({ eventType: "try", timestamp: { $gte: startDate } }),
      DemoInteraction.countDocuments({ eventType: "complete", timestamp: { $gte: startDate } }),
      DemoInteraction.distinct("sessionId", { timestamp: { $gte: startDate } }),
    ]);

    // Get top demos by views
    const topDemos = await DemoInteraction.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: "$productId",
          productTitle: { $first: "$productTitle" },
          views: { $sum: { $cond: [{ $eq: ["$eventType", "view"] }, 1, 0] } },
          tries: { $sum: { $cond: [{ $eq: ["$eventType", "try"] }, 1, 0] } },
          completes: { $sum: { $cond: [{ $eq: ["$eventType", "complete"] }, 1, 0] } },
          uniqueSessions: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          productId: "$_id",
          productTitle: 1,
          views: 1,
          tries: 1,
          completes: 1,
          uniqueUsers: { $size: "$uniqueSessions" },
          conversionRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $multiply: [{ $divide: ["$tries", "$views"] }, 100] },
            ],
          },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 20 },
    ]);

    // Get daily stats for chart
    const dailyStats = await DemoInteraction.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            eventType: "$eventType",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Transform daily stats into chart-friendly format
    const dailyMap = new Map<string, { views: number; tries: number; completes: number }>();
    dailyStats.forEach((stat) => {
      const date = stat._id.date;
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { views: 0, tries: 0, completes: 0 });
      }
      const entry = dailyMap.get(date)!;
      if (stat._id.eventType === "view") entry.views = stat.count;
      if (stat._id.eventType === "try") entry.tries = stat.count;
      if (stat._id.eventType === "complete") entry.completes = stat.count;
    });

    const dailyChart = Array.from(dailyMap.entries()).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    // Get device breakdown
    const deviceStats = await DemoInteraction.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activity (include location data)
    const recentActivity = await DemoInteraction.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .select("productId productTitle eventType deviceType timestamp location")
      .lean();

    // Get location breakdown (top countries)
    const locationStats = await DemoInteraction.aggregate([
      { $match: { timestamp: { $gte: startDate }, "location.country": { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            country: "$location.country",
            countryCode: "$location.countryCode",
          },
          count: { $sum: 1 },
          cities: { $addToSet: "$location.city" },
        },
      },
      {
        $project: {
          country: "$_id.country",
          countryCode: "$_id.countryCode",
          count: 1,
          uniqueCities: { $size: "$cities" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      summary: {
        totalViews,
        totalTries,
        totalCompletes,
        uniqueUsers: uniqueSessions.length,
        overallConversionRate: totalViews > 0 ? ((totalTries / totalViews) * 100).toFixed(1) : 0,
      },
      topDemos,
      dailyChart,
      deviceStats: deviceStats.map((d) => ({ device: d._id, count: d.count })),
      locationStats: locationStats.map((l) => ({
        country: l.country,
        countryCode: l.countryCode,
        count: l.count,
        uniqueCities: l.uniqueCities,
      })),
      recentActivity,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[ADMIN_DEMOS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
