import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@core/db';
import { AITool, DEFAULT_AI_TOOLS } from '@/models';

// POST - Seed default AI tools
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const toolData of DEFAULT_AI_TOOLS) {
      try {
        const existing = await AITool.findOne({ toolId: toolData.toolId });
        
        if (existing) {
          // Update existing tool with new defaults (preserve usage count and user customizations)
          await AITool.updateOne(
            { toolId: toolData.toolId },
            {
              $set: {
                name: toolData.name,
                description: toolData.description,
                shortDescription: toolData.shortDescription,
                icon: toolData.icon,
                category: toolData.category,
                color: toolData.color,
                status: toolData.status,
                demoAvailability: toolData.demoAvailability || 'live-demo',
                demoComponent: toolData.demoComponent || '',
                isDefault: toolData.isDefault,
                hasImplementation: toolData.hasImplementation,
                defaultDailyLimit: toolData.defaultDailyLimit,
                defaultMonthlyLimit: toolData.defaultMonthlyLimit,
                tokensPerUse: toolData.tokensPerUse,
                apiModel: toolData.apiModel,
                sortOrder: toolData.sortOrder,
                compatibleBusinessTypes: toolData.compatibleBusinessTypes,
              },
            }
          );
          results.updated++;
        } else {
          // Create new tool
          await AITool.create({
            ...toolData,
            totalUsageCount: 0,
          });
          results.created++;
        }
      } catch (err) {
        const error = err as Error;
        results.errors.push(`${toolData.toolId}: ${error.message}`);
      }
    }

    console.log(`[ADMIN_AI_TOOLS] Seeded tools - Created: ${results.created}, Updated: ${results.updated}`);

    return NextResponse.json({
      success: true,
      message: `Created ${results.created} tools, updated ${results.updated} tools`,
      results,
    });
  } catch (error) {
    console.error('[ADMIN_AI_TOOLS] Seed Error:', error);
    return NextResponse.json(
      { error: 'Failed to seed tools' },
      { status: 500 }
    );
  }
}
