import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ProspectingConfig } from '@/models';

// GET - Get prospecting configuration
export async function GET() {
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
