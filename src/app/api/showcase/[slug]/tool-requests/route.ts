import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ShowcaseSite } from '@/models';

// GET - Get tool requests for a showcase site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();

    const site = await ShowcaseSite.findOne({ slug }).select('toolRequests businessName');

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({
      requests: site.toolRequests || [],
      count: site.toolRequests?.length || 0,
    });
  } catch (error) {
    console.error('[TOOL_REQUESTS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get tool requests' },
      { status: 500 }
    );
  }
}

// POST - Submit a new tool request
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { toolName, description, useCase } = await request.json();

    if (!toolName || !description) {
      return NextResponse.json(
        { error: 'toolName and description are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const site = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $push: {
          toolRequests: {
            toolName: toolName.trim(),
            description: description.trim(),
            useCase: useCase?.trim(),
            submittedAt: new Date(),
            status: 'pending',
          },
        },
      },
      { new: true }
    ).select('toolRequests businessName');

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const newRequest = site.toolRequests[site.toolRequests.length - 1];

    console.log(`[TOOL_REQUESTS] New request from ${site.businessName}: "${toolName}"`);

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: 'Tool request submitted successfully',
    });
  } catch (error) {
    console.error('[TOOL_REQUESTS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit tool request' },
      { status: 500 }
    );
  }
}
