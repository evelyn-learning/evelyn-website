import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@core/db';
import { ShowcaseSite } from '@/models';

type ActivityAction =
  | 'viewed'
  | 'expanded_banner'
  | 'clicked_contact'
  | 'clicked_schedule'
  | 'keep_demo'
  | 'declined'
  | 'tool_used';

// GET - Get activity log for a showcase site
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;

    await connectDB();

    const site = await ShowcaseSite.findOne({ slug }).select('activityLog');

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({
      activityLog: site.activityLog || [],
    });
  } catch (error) {
    console.error('[ACTIVITY] Error getting activity:', error);
    return NextResponse.json(
      { error: 'Failed to get activity log' },
      { status: 500 }
    );
  }
}

// POST - Log an activity for a showcase site
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    const slug = params.slug;
    const { action, metadata } = await request.json() as {
      action: ActivityAction;
      metadata?: Record<string, unknown>;
    };

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    const validActions: ActivityAction[] = [
      'viewed',
      'expanded_banner',
      'clicked_contact',
      'clicked_schedule',
      'keep_demo',
      'declined',
      'tool_used',
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await connectDB();

    // Add the activity to the log (limit to last 100 entries to prevent bloat)
    const result = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $push: {
          activityLog: {
            $each: [{
              action,
              metadata: metadata || {},
              timestamp: new Date(),
            }],
            $slice: -100, // Keep last 100 activities
          },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    console.log(`[ACTIVITY] ${slug}: ${action}`, metadata || '');

    return NextResponse.json({
      success: true,
      action,
    });
  } catch (error) {
    console.error('[ACTIVITY] Error logging activity:', error);
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}
