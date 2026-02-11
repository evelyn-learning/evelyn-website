import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DemoInteraction } from "@/models";
import { CLIENT_SHOWCASE_IDS } from "@/config/showcaseProducts";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const productIds = CLIENT_SHOWCASE_IDS.map((s) => s.productId);

    // Per-product analytics
    const perProduct = await DemoInteraction.aggregate([
      { $match: { productId: { $in: productIds }, timestamp: { $gte: startDate } } },
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
        },
      },
    ]);

    // Device breakdown per product
    const deviceStats = await DemoInteraction.aggregate([
      { $match: { productId: { $in: productIds }, timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { productId: "$productId", device: "$deviceType" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Location stats per product
    const locationStats = await DemoInteraction.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          timestamp: { $gte: startDate },
          "location.country": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: {
            productId: "$productId",
            country: "$location.country",
            countryCode: "$location.countryCode",
          },
          count: { $sum: 1 },
          cities: { $addToSet: "$location.city" },
        },
      },
      {
        $project: {
          productId: "$_id.productId",
          country: "$_id.country",
          countryCode: "$_id.countryCode",
          count: 1,
          uniqueCities: { $size: "$cities" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent activity with location
    const recentActivity = await DemoInteraction.find({
      productId: { $in: productIds },
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .select("productId productTitle eventType deviceType timestamp location")
      .lean();

    // Build per-product response
    const products = CLIENT_SHOWCASE_IDS.map((showcase) => {
      const stats = perProduct.find((p) => p.productId === showcase.productId) || {
        views: 0,
        tries: 0,
        completes: 0,
        uniqueUsers: 0,
      };

      const devices = deviceStats
        .filter((d) => d._id.productId === showcase.productId)
        .map((d) => ({ device: d._id.device, count: d.count }));

      const locations = locationStats
        .filter((l) => l.productId === showcase.productId)
        .map((l) => ({
          country: l.country,
          countryCode: l.countryCode,
          count: l.count,
          uniqueCities: l.uniqueCities,
        }));

      const activity = recentActivity.filter(
        (a) => a.productId === showcase.productId
      );

      return {
        productId: showcase.productId,
        name: showcase.name,
        url: showcase.url,
        views: stats.views,
        tries: stats.tries,
        completes: stats.completes,
        uniqueUsers: stats.uniqueUsers,
        deviceStats: devices,
        locationStats: locations,
        recentActivity: activity,
      };
    });

    return NextResponse.json({
      products,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[ADMIN_SHOWCASE_ANALYTICS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch showcase analytics" },
      { status: 500 }
    );
  }
}
