import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { ShowcaseSite } from '@/models';

// POST - Decline the demo offer
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();

    // Update the site status to 'declined'
    const result = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $set: {
          status: 'declined',
          declinedAt: new Date(),
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

    console.log(`[SHOWCASE_DECLINE] Site ${slug} declined by prospect`);

    return NextResponse.json({
      success: true,
      message: 'Demo declined successfully',
    });
  } catch (error) {
    console.error('[SHOWCASE_DECLINE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to decline demo' },
      { status: 500 }
    );
  }
}
