import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ShowcaseSite, AITool, DEFAULT_AI_TOOLS } from '@/models';

// GET - Get available and enabled tools for a showcase site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();

    const site = await ShowcaseSite.findOne({ slug }).select(
      'businessType enabledTools toolLimits'
    );

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Get only active tools that have UI implementations
    // Tools without implementations should not be shown in showcase demos
    let allTools = await AITool.find({
      status: 'active',
      hasImplementation: true,
    }).sort({ sortOrder: 1 });

    // If no tools in database, use defaults (filter for those with implementations)
    if (allTools.length === 0) {
      allTools = DEFAULT_AI_TOOLS.filter(t =>
        t.status === 'active' && t.hasImplementation === true
      ).map(t => ({
        ...t,
        _id: t.toolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as typeof allTools;
    }

    // Filter tools by business type compatibility
    const compatibleTools = allTools.filter(tool => {
      const compatibleTypes = tool.compatibleBusinessTypes || [];
      // Empty array means compatible with all
      return compatibleTypes.length === 0 || compatibleTypes.includes(site.businessType);
    });

    // Build response with enabled status
    const enabledToolIds = site.enabledTools || [];
    const toolLimits = site.toolLimits instanceof Map
      ? Object.fromEntries(site.toolLimits)
      : site.toolLimits || {};

    const toolsWithStatus = compatibleTools.map(tool => ({
      toolId: tool.toolId,
      name: tool.name,
      description: tool.description,
      shortDescription: tool.shortDescription,
      icon: tool.icon,
      category: tool.category,
      color: tool.color,
      status: tool.status,
      isPremium: tool.isPremium,
      isEnabled: enabledToolIds.includes(tool.toolId),
      limit: toolLimits[tool.toolId] || tool.defaultDailyLimit,
      defaultLimit: tool.defaultDailyLimit,
    }));

    // Separate enabled and available
    const enabledTools = toolsWithStatus.filter(t => t.isEnabled);
    const availableTools = toolsWithStatus.filter(t => !t.isEnabled);

    return NextResponse.json({
      enabledTools,
      availableTools,
      allTools: toolsWithStatus,
      totalAvailable: compatibleTools.length,
    });
  } catch (error) {
    console.error('[SHOWCASE_TOOLS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get tools' },
      { status: 500 }
    );
  }
}

// PUT - Update enabled tools for a showcase site
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { enabledTools, toolLimits } = await request.json();

    await connectDB();

    const updates: Record<string, unknown> = {};

    if (enabledTools !== undefined) {
      // Validate that all tools exist, are active, and have implementations
      const validToolIds = await AITool.find({
        toolId: { $in: enabledTools },
        status: 'active',
        hasImplementation: true,
      }).distinct('toolId');

      // If no tools in DB, check against defaults
      if (validToolIds.length === 0) {
        const defaultIds = DEFAULT_AI_TOOLS
          .filter(t => t.status === 'active' && t.hasImplementation)
          .map(t => t.toolId);
        updates.enabledTools = enabledTools.filter((id: string) => defaultIds.includes(id));
      } else {
        updates.enabledTools = validToolIds;
      }
    }

    if (toolLimits !== undefined) {
      updates.toolLimits = toolLimits;
    }

    const site = await ShowcaseSite.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    ).select('slug businessName enabledTools toolLimits');

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    console.log(`[SHOWCASE_TOOLS] Updated tools for ${slug}: ${site.enabledTools?.join(', ')}`);

    return NextResponse.json({
      success: true,
      enabledTools: site.enabledTools,
      toolLimits: site.toolLimits,
    });
  } catch (error) {
    console.error('[SHOWCASE_TOOLS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update tools' },
      { status: 500 }
    );
  }
}

// POST - Enable or disable a specific tool
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { toolId, action, limit } = await request.json();

    if (!toolId || !action) {
      return NextResponse.json(
        { error: 'toolId and action are required' },
        { status: 400 }
      );
    }

    await connectDB();

    let update;
    if (action === 'enable') {
      update = {
        $addToSet: { enabledTools: toolId },
        ...(limit !== undefined && {
          $set: { [`toolLimits.${toolId}`]: limit },
        }),
      };
    } else if (action === 'disable') {
      update = {
        $pull: { enabledTools: toolId },
      };
    } else {
      return NextResponse.json(
        { error: 'action must be "enable" or "disable"' },
        { status: 400 }
      );
    }

    const site = await ShowcaseSite.findOneAndUpdate(
      { slug },
      update,
      { new: true }
    ).select('slug enabledTools toolLimits');

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    console.log(`[SHOWCASE_TOOLS] ${action}d ${toolId} for ${slug}`);

    return NextResponse.json({
      success: true,
      toolId,
      action,
      enabledTools: site.enabledTools,
    });
  } catch (error) {
    console.error('[SHOWCASE_TOOLS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    );
  }
}
