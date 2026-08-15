import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@core/db';
import { ShowcaseSite } from '@/models';

interface ToolRequestWithSite {
  _id: string;
  toolName: string;
  description: string;
  useCase?: string;
  submittedAt: Date;
  status: string;
  adminNotes?: string;
  site: {
    slug: string;
    businessName: string;
    businessType: string;
  };
}

// GET - Get all tool requests across all showcase sites
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filter by status
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get all sites with tool requests
    const sites = await ShowcaseSite.find({
      'toolRequests.0': { $exists: true }, // Has at least one request
    }).select('slug businessName businessType toolRequests');

    // Flatten and combine with site info
    const allRequests: ToolRequestWithSite[] = [];

    for (const site of sites) {
      for (const req of site.toolRequests || []) {
        if (!status || req.status === status) {
          allRequests.push({
            _id: req._id?.toString() || '',
            toolName: req.toolName,
            description: req.description,
            useCase: req.useCase,
            submittedAt: req.submittedAt,
            status: req.status,
            adminNotes: req.adminNotes,
            site: {
              slug: site.slug,
              businessName: site.businessName,
              businessType: site.businessType,
            },
          });
        }
      }
    }

    // Sort by date (newest first)
    allRequests.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Aggregate stats
    const stats = {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === 'pending').length,
      reviewed: allRequests.filter(r => r.status === 'reviewed').length,
      planned: allRequests.filter(r => r.status === 'planned').length,
      declined: allRequests.filter(r => r.status === 'declined').length,
    };

    // Group by tool name to see popular requests
    const popularRequests = allRequests.reduce((acc, req) => {
      const key = req.toolName.toLowerCase().trim();
      if (!acc[key]) {
        acc[key] = { name: req.toolName, count: 0, requests: [] as typeof allRequests };
      }
      acc[key].count++;
      acc[key].requests.push(req);
      return acc;
    }, {} as Record<string, { name: string; count: number; requests: ToolRequestWithSite[] }>);

    const topRequests = Object.values(popularRequests)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      requests: allRequests.slice(0, limit),
      stats,
      topRequests,
      hasMore: allRequests.length > limit,
    });
  } catch (error) {
    console.error('[TOOL_REQUESTS_ADMIN] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool requests' },
      { status: 500 }
    );
  }
}

// PUT - Update a tool request status
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();

    const { slug, requestId, status, adminNotes } = await request.json();

    if (!slug || !requestId || !status) {
      return NextResponse.json(
        { error: 'slug, requestId, and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'reviewed', 'planned', 'declined'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const site = await ShowcaseSite.findOneAndUpdate(
      { slug, 'toolRequests._id': requestId },
      {
        $set: {
          'toolRequests.$.status': status,
          ...(adminNotes !== undefined && { 'toolRequests.$.adminNotes': adminNotes }),
        },
      },
      { new: true }
    ).select('toolRequests');

    if (!site) {
      return NextResponse.json(
        { error: 'Site or request not found' },
        { status: 404 }
      );
    }

    const updatedRequest = site.toolRequests.find(
      (r: { _id: { toString: () => string } }) => r._id.toString() === requestId
    );

    console.log(`[TOOL_REQUESTS_ADMIN] Updated request ${requestId} to ${status}`);

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error('[TOOL_REQUESTS_ADMIN] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update tool request' },
      { status: 500 }
    );
  }
}
