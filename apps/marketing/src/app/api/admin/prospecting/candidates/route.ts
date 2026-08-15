import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@core/db';
import { ProspectingConfig, ShowcaseSite } from '@/models';

// GET - Get all candidates with filtering
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    await connectDB();

    const config = await ProspectingConfig.findOne();
    if (!config) {
      return NextResponse.json({ candidates: [] });
    }

    let candidates = config.candidates || [];

    if (status && status !== 'all') {
      candidates = candidates.filter((c: { status: string }) => c.status === status);
    }

    // Sort by discoveredAt descending
    candidates.sort((a: { discoveredAt: Date }, b: { discoveredAt: Date }) =>
      new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime()
    );

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('[PROSPECTING] Error getting candidates:', error);
    return NextResponse.json(
      { error: 'Failed to get candidates' },
      { status: 500 }
    );
  }
}

// POST - Add a new candidate
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const candidate = await request.json();

    if (!candidate.businessName || !candidate.websiteUrl) {
      return NextResponse.json(
        { error: 'businessName and websiteUrl are required' },
        { status: 400 }
      );
    }

    await connectDB();

    let config = await ProspectingConfig.findOne();
    if (!config) {
      config = await ProspectingConfig.create({
        seedConcept: '',
        isActive: false,
      });
    }

    // Check if website already exists in candidates
    const existingCandidate = config.candidates.find(
      (c: { websiteUrl: string }) => c.websiteUrl === candidate.websiteUrl
    );
    if (existingCandidate) {
      return NextResponse.json(
        { error: 'Candidate with this website already exists' },
        { status: 409 }
      );
    }

    // Check if showcase already exists for this URL
    const existingShowcase = await ShowcaseSite.findOne({
      originalWebsiteUrl: candidate.websiteUrl,
    });
    if (existingShowcase) {
      return NextResponse.json(
        { error: 'Showcase site already exists for this website' },
        { status: 409 }
      );
    }

    // Add the candidate
    config.candidates.push({
      businessName: candidate.businessName,
      websiteUrl: candidate.websiteUrl,
      location: candidate.location,
      contactEmail: candidate.contactEmail,
      contactPhone: candidate.contactPhone,
      contactFormUrl: candidate.contactFormUrl,
      discoveredAt: new Date(),
      status: 'discovered',
    });

    config.totalDiscovered += 1;
    await config.save();

    console.log('[PROSPECTING] Candidate added:', candidate.businessName);

    return NextResponse.json({
      success: true,
      candidate: config.candidates[config.candidates.length - 1],
    });
  } catch (error) {
    console.error('[PROSPECTING] Error adding candidate:', error);
    return NextResponse.json(
      { error: 'Failed to add candidate' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a candidate
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const websiteUrl = searchParams.get('websiteUrl');

    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'websiteUrl is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const config = await ProspectingConfig.findOne();
    if (!config) {
      return NextResponse.json(
        { error: 'Prospecting config not found' },
        { status: 404 }
      );
    }

    const initialLength = config.candidates.length;
    config.candidates = config.candidates.filter(
      (c: { websiteUrl: string }) => c.websiteUrl !== websiteUrl
    );

    if (config.candidates.length === initialLength) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    await config.save();

    console.log('[PROSPECTING] Candidate removed:', websiteUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PROSPECTING] Error removing candidate:', error);
    return NextResponse.json(
      { error: 'Failed to remove candidate' },
      { status: 500 }
    );
  }
}
