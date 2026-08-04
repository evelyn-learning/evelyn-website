import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { ProspectingConfig } from '@/models';

// GET - Get prospecting configuration
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();

    let config = await ProspectingConfig.findOne();
    if (!config) {
      config = await ProspectingConfig.create({
        seedConcept: '',
        isActive: false,
      });
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error('[PROSPECTING] Error getting config:', error);
    return NextResponse.json(
      { error: 'Failed to get prospecting config' },
      { status: 500 }
    );
  }
}

// PUT - Update prospecting configuration
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const updates = await request.json();

    await connectDB();

    let config = await ProspectingConfig.findOne();
    if (!config) {
      config = await ProspectingConfig.create({
        seedConcept: '',
        isActive: false,
      });
    }

    // Update allowed fields
    const allowedFields = [
      'seedConcept',
      'maxDrafts',
      'isActive',
      'businessTypes',
      'outreachEmailTemplate',
      'outreachContactFormTemplate',
      'autoOutreachOnActivate',
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        config[field] = updates[field];
      }
    }

    await config.save();

    console.log('[PROSPECTING] Config updated:', {
      seedConcept: config.seedConcept,
      isActive: config.isActive,
      maxDrafts: config.maxDrafts,
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error('[PROSPECTING] Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update prospecting config' },
      { status: 500 }
    );
  }
}
