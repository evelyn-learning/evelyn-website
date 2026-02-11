import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { AITool, DEFAULT_AI_TOOLS } from '@/models';

// GET - List all AI tools
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let tools = await AITool.find({}).sort({ sortOrder: 1, name: 1 });

    // If no tools in database, return defaults
    if (tools.length === 0) {
      tools = DEFAULT_AI_TOOLS.map(t => ({
        ...t,
        _id: t.toolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as typeof tools;
    }

    return NextResponse.json({ tools });
  } catch (error) {
    console.error('[ADMIN_AI_TOOLS] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST - Create new AI tool
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.toolId || !data.name) {
      return NextResponse.json(
        { error: 'toolId and name are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if tool already exists
    const existing = await AITool.findOne({ toolId: data.toolId });
    if (existing) {
      return NextResponse.json(
        { error: 'Tool with this ID already exists' },
        { status: 400 }
      );
    }

    const tool = await AITool.create({
      toolId: data.toolId,
      name: data.name,
      description: data.description || '',
      shortDescription: data.shortDescription || '',
      icon: data.icon || 'Sparkles',
      category: data.category || 'tutoring',
      color: data.color || '#10B981',
      status: data.status || 'coming-soon',
      demoAvailability: data.demoAvailability || 'request-demo',
      demoComponent: data.demoComponent || '',
      isDefault: data.isDefault || false,
      hasImplementation: data.hasImplementation || false,
      isPremium: data.isPremium || false,
      defaultDailyLimit: data.defaultDailyLimit || 10,
      defaultMonthlyLimit: data.defaultMonthlyLimit || 100,
      tokensPerUse: data.tokensPerUse || 500,
      apiModel: data.apiModel || 'gpt-4o-mini',
      systemPrompt: data.systemPrompt || '',
      sortOrder: data.sortOrder || 100,
      compatibleBusinessTypes: data.compatibleBusinessTypes || [],
    });

    console.log(`[ADMIN_AI_TOOLS] Created tool: ${tool.toolId}`);

    return NextResponse.json({ success: true, tool });
  } catch (error) {
    console.error('[ADMIN_AI_TOOLS] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    );
  }
}

// PUT - Update existing AI tool
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.toolId) {
      return NextResponse.json(
        { error: 'toolId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Use upsert so we can update tools that exist only in defaults (not yet in DB)
    const tool = await AITool.findOneAndUpdate(
      { toolId: data.toolId },
      {
        $set: {
          toolId: data.toolId,
          name: data.name,
          description: data.description,
          shortDescription: data.shortDescription,
          icon: data.icon,
          category: data.category,
          color: data.color,
          status: data.status,
          demoAvailability: data.demoAvailability,
          demoComponent: data.demoComponent,
          isDefault: data.isDefault,
          hasImplementation: data.hasImplementation,
          isPremium: data.isPremium,
          defaultDailyLimit: data.defaultDailyLimit,
          defaultMonthlyLimit: data.defaultMonthlyLimit,
          tokensPerUse: data.tokensPerUse,
          apiModel: data.apiModel,
          systemPrompt: data.systemPrompt,
          sortOrder: data.sortOrder,
          compatibleBusinessTypes: data.compatibleBusinessTypes || [],
        },
      },
      { new: true, upsert: true }
    );

    console.log(`[ADMIN_AI_TOOLS] Updated tool: ${tool.toolId}`);

    return NextResponse.json({ success: true, tool });
  } catch (error) {
    console.error('[ADMIN_AI_TOOLS] PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update tool' },
      { status: 500 }
    );
  }
}

// DELETE - Delete AI tool
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');

    if (!toolId) {
      return NextResponse.json(
        { error: 'toolId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await AITool.deleteOne({ toolId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    console.log(`[ADMIN_AI_TOOLS] Deleted tool: ${toolId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_AI_TOOLS] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete tool' },
      { status: 500 }
    );
  }
}
