import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ShowcaseSite } from '@/models';

// GET - Get current tool usage for a showcase site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();

    const site = await ShowcaseSite.findOne({ slug }).select('analytics.toolUsage');

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Convert Map to object if needed
    const toolUsage = site.analytics?.toolUsage instanceof Map
      ? Object.fromEntries(site.analytics.toolUsage)
      : site.analytics?.toolUsage || {};

    return NextResponse.json({
      usage: {
        'test-generator': toolUsage['test-generator'] || 0,
        'homework-helper': toolUsage['homework-helper'] || 0,
        'essay-scorer': toolUsage['essay-scorer'] || 0,
      },
    });
  } catch (error) {
    console.error('[TOOL_USAGE] Error getting usage:', error);
    return NextResponse.json(
      { error: 'Failed to get tool usage' },
      { status: 500 }
    );
  }
}

// POST - Increment tool usage for a showcase site with detailed logging
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { toolId, responseTime, tokensUsed, successful = true, errorMessage } = await request.json();

    if (!toolId) {
      return NextResponse.json({ error: 'toolId is required' }, { status: 400 });
    }

    await connectDB();

    // Increment the specific tool usage and add to API usage log
    const result = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $inc: { [`analytics.toolUsage.${toolId}`]: 1 },
        $push: {
          apiUsageLog: {
            $each: [{
              toolId,
              timestamp: new Date(),
              responseTime,
              tokensUsed,
              successful,
              errorMessage,
            }],
            $slice: -1000, // Keep last 1000 entries per site
          },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Get the updated usage
    const toolUsage = result.analytics?.toolUsage instanceof Map
      ? Object.fromEntries(result.analytics.toolUsage)
      : result.analytics?.toolUsage || {};

    const newUsageCount = toolUsage[toolId] || 1;

    console.log(`[TOOL_USAGE] ${slug} used ${toolId}, count: ${newUsageCount}${responseTime ? `, ${responseTime}ms` : ''}`);

    return NextResponse.json({
      success: true,
      toolId,
      newUsageCount,
    });
  } catch (error) {
    console.error('[TOOL_USAGE] Error tracking usage:', error);
    return NextResponse.json(
      { error: 'Failed to track tool usage' },
      { status: 500 }
    );
  }
}
