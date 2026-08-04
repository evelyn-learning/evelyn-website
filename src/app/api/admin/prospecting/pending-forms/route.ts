import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { ShowcaseSite, ProspectingConfig } from '@/models';

// GET - Get all sites with pending contact forms
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();

    const sites = await ShowcaseSite.find({
      pendingContactForm: true,
    }).select(
      'slug businessName originalWebsiteUrl contactFormUrl contact.email outreachSentAt'
    ).sort({ outreachSentAt: -1 });

    // Get contact form template
    const config = await ProspectingConfig.findOne();
    const template = config?.outreachContactFormTemplate || '';

    return NextResponse.json({
      pendingCount: sites.length,
      sites: sites.map(site => ({
        slug: site.slug,
        businessName: site.businessName,
        contactFormUrl: site.contactFormUrl || site.originalWebsiteUrl,
        contactEmail: site.contact?.email,
        outreachSentAt: site.outreachSentAt,
      })),
      template,
    });
  } catch (error) {
    console.error('[PENDING_FORMS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get pending forms' },
      { status: 500 }
    );
  }
}

// POST - Mark a contact form as filled
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug, notes } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'slug is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const site = await ShowcaseSite.findOneAndUpdate(
      { slug },
      {
        $set: {
          pendingContactForm: false,
          contactFormFilledAt: new Date(),
          outreachNotes: notes || 'Contact form filled',
        },
      },
      { new: true }
    );

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    console.log(`[PENDING_FORMS] Contact form marked as filled for ${slug}`);

    return NextResponse.json({
      success: true,
      slug,
      contactFormFilledAt: site.contactFormFilledAt,
    });
  } catch (error) {
    console.error('[PENDING_FORMS] Error:', error);
    return NextResponse.json(
      { error: 'Failed to mark form as filled' },
      { status: 500 }
    );
  }
}
