import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@core/db';
import { ProspectingConfig, ShowcaseSite } from '@/models';
import { sendOutreachEmail } from '@/lib/email';

// POST - Send outreach for a showcase site
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { slug, contactEmail, method = 'email' } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'slug is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the showcase site
    const site = await ShowcaseSite.findOne({ slug });
    if (!site) {
      return NextResponse.json(
        { error: 'Showcase site not found' },
        { status: 404 }
      );
    }

    // Use provided email or try to get from site contact
    const recipientEmail = contactEmail || site.contact?.email;
    if (!recipientEmail && method === 'email') {
      return NextResponse.json(
        { error: 'No contact email available for this site' },
        { status: 400 }
      );
    }

    // Get prospecting config for email template
    const config = await ProspectingConfig.findOne();
    const emailTemplate = config?.outreachEmailTemplate || getDefaultEmailTemplate();

    // Build demo URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://evelynlearning.com';
    const demoUrl = `${baseUrl}/showcase/${site.slug}`;

    // Send the email
    if (method === 'email' && recipientEmail) {
      const result = await sendOutreachEmail(emailTemplate, recipientEmail, {
        businessName: site.businessName,
        demoUrl,
        accessCode: site.accessCode,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: `Failed to send email: ${result.error}` },
          { status: 500 }
        );
      }

      // Update site outreach status
      site.outreachMethod = 'email';
      site.outreachSentAt = new Date();
      site.outreachNotes = `Email sent to ${recipientEmail}`;
      await site.save();

      // Update prospecting stats
      if (config) {
        config.totalOutreachSent += 1;
        await config.save();
      }

      console.log('[OUTREACH] Email sent to:', recipientEmail, 'for site:', slug);

      return NextResponse.json({
        success: true,
        method: 'email',
        recipientEmail,
        messageId: result.messageId,
      });
    }

    // If method is 'contact-form', return info for browser automation
    if (method === 'contact-form') {
      const contactFormTemplate = config?.outreachContactFormTemplate || getDefaultContactFormTemplate();

      // Replace variables
      const message = contactFormTemplate
        .replace(/{{businessName}}/g, site.businessName)
        .replace(/{{demoUrl}}/g, demoUrl)
        .replace(/{{accessCode}}/g, site.accessCode);

      // Find contact form URL from candidates
      const candidate = config?.candidates?.find(
        (c: { showcaseSlug?: string }) => c.showcaseSlug === slug
      );

      return NextResponse.json({
        success: true,
        method: 'contact-form',
        message,
        contactFormUrl: candidate?.contactFormUrl || site.originalWebsiteUrl + '/contact',
        siteSlug: slug,
      });
    }

    return NextResponse.json(
      { error: 'Invalid outreach method' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[OUTREACH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send outreach' },
      { status: 500 }
    );
  }
}

// GET - Get outreach status for a site
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'slug is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const site = await ShowcaseSite.findOne({ slug }).select(
      'outreachMethod outreachSentAt outreachNotes contact.email'
    );

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      slug,
      outreachMethod: site.outreachMethod,
      outreachSentAt: site.outreachSentAt,
      outreachNotes: site.outreachNotes,
      contactEmail: site.contact?.email,
    });
  } catch (error) {
    console.error('[OUTREACH] Error getting status:', error);
    return NextResponse.json(
      { error: 'Failed to get outreach status' },
      { status: 500 }
    );
  }
}

function getDefaultEmailTemplate(): string {
  return `Subject: We built you a free website demo - {{businessName}}

Hi there,

I came across {{businessName}} and was impressed by what you're doing for students. I wanted to show you what a modern, AI-powered website could look like for your business.

I've created a free demo website just for you:
{{demoUrl}}

Access Code: {{accessCode}}

This demo includes:
• A modern, mobile-friendly design
• AI-powered chat widget trained on your services
• Staff portal for managing content
• Practice test generator and homework helper tools

The demo is available for 14 days. If you like what you see, we can launch it on your own domain.

No obligation - just wanted to share what's possible!

Best regards,
The Evelyn Learning Team
info@evelynlearning.com
+1 (302) 212-0975`;
}

function getDefaultContactFormTemplate(): string {
  return `Hi! I came across {{businessName}} and created a free demo website to show you what a modern, AI-powered site could look like for your tutoring business.

Check it out here: {{demoUrl}}
Access Code: {{accessCode}}

No strings attached - just thought you might find it interesting!

- Evelyn Learning Team`;
}
