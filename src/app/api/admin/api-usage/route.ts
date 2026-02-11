import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ShowcaseSite } from '@/models';

interface APIUsageEntry {
  toolId: string;
  timestamp: Date;
  responseTime?: number;
  tokensUsed?: number;
  successful: boolean;
  errorMessage?: string;
}

// GET - Get aggregated API usage statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug'); // Optional: filter by specific site
    const days = parseInt(searchParams.get('days') || '30'); // Default: last 30 days

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    // Build query
    const query: Record<string, unknown> = {};
    if (slug) {
      query.slug = slug;
    }

    // Get all sites with their API usage
    const sites = await ShowcaseSite.find(query).select(
      'slug businessName status analytics.toolUsage apiUsageLog'
    );

    // Aggregate statistics
    let totalCalls = 0;
    let totalTokens = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;
    let successfulCalls = 0;
    let failedCalls = 0;

    const toolBreakdown: Record<string, number> = {
      'test-generator': 0,
      'homework-helper': 0,
      'essay-scorer': 0,
    };

    const dailyUsage: Record<string, number> = {};
    const perSiteUsage: Array<{
      slug: string;
      businessName: string;
      status: string;
      totalCalls: number;
      toolUsage: Record<string, number>;
      recentCalls: number;
      avgResponseTime?: number;
    }> = [];

    for (const site of sites) {
      const toolUsage = site.analytics?.toolUsage instanceof Map
        ? Object.fromEntries(site.analytics.toolUsage)
        : site.analytics?.toolUsage || {};

      const siteTotalCalls = Object.values(toolUsage).reduce((sum: number, val) => sum + (val as number), 0);
      totalCalls += siteTotalCalls;

      // Tool breakdown
      for (const [tool, count] of Object.entries(toolUsage)) {
        if (toolBreakdown[tool] !== undefined) {
          toolBreakdown[tool] += count as number;
        }
      }

      // Process API usage log for recent data
      let siteRecentCalls = 0;
      let siteResponseTimeSum = 0;
      let siteResponseTimeCount = 0;

      if (site.apiUsageLog && Array.isArray(site.apiUsageLog)) {
        for (const entry of site.apiUsageLog as APIUsageEntry[]) {
          const entryDate = new Date(entry.timestamp);
          if (entryDate >= dateThreshold) {
            siteRecentCalls++;

            if (entry.successful) {
              successfulCalls++;
            } else {
              failedCalls++;
            }

            if (entry.responseTime) {
              totalResponseTime += entry.responseTime;
              responseTimeCount++;
              siteResponseTimeSum += entry.responseTime;
              siteResponseTimeCount++;
            }

            if (entry.tokensUsed) {
              totalTokens += entry.tokensUsed;
            }

            // Daily breakdown
            const dayKey = entryDate.toISOString().split('T')[0];
            dailyUsage[dayKey] = (dailyUsage[dayKey] || 0) + 1;
          }
        }
      }

      perSiteUsage.push({
        slug: site.slug,
        businessName: site.businessName,
        status: site.status,
        totalCalls: siteTotalCalls,
        toolUsage,
        recentCalls: siteRecentCalls,
        avgResponseTime: siteResponseTimeCount > 0
          ? Math.round(siteResponseTimeSum / siteResponseTimeCount)
          : undefined,
      });
    }

    // Sort by total calls descending
    perSiteUsage.sort((a, b) => b.totalCalls - a.totalCalls);

    // Format daily usage for chart
    const dailyUsageArray = Object.entries(dailyUsage)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      summary: {
        totalSites: sites.length,
        totalCalls,
        totalTokens,
        avgResponseTime: responseTimeCount > 0
          ? Math.round(totalResponseTime / responseTimeCount)
          : null,
        successRate: totalCalls > 0
          ? Math.round((successfulCalls / (successfulCalls + failedCalls)) * 100)
          : 100,
        period: `Last ${days} days`,
      },
      toolBreakdown,
      dailyUsage: dailyUsageArray,
      perSiteUsage: perSiteUsage.slice(0, 20), // Top 20 sites
    });
  } catch (error) {
    console.error('[API_USAGE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get API usage statistics' },
      { status: 500 }
    );
  }
}
