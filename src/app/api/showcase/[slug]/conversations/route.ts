import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ShowcaseSite } from '@/models';

// GET - Fetch all conversations for a site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();
    const site = await ShowcaseSite.findOne(
      { slug },
      { conversations: 1 }
    ).lean() as { conversations?: Array<{ sessionId: string; createdAt: Date; messages: Array<{ role: string; content: string }> }> } | null;

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    // Sort conversations by most recent first
    const conversations = (site.conversations || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    console.error('[CONVERSATIONS_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a conversation
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $pull: {
          conversations: { sessionId },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('[CONVERSATIONS_DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
