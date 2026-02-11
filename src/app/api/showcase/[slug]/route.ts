import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, isDBConfigured } from "@/lib/db";
import { ShowcaseSite, ProspectingConfig } from "@/models";
import { sendOutreachEmail } from "@/lib/email";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET single showcase site (admin gets full data, includes access code)
export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const { slug } = await params;

    const site = await ShowcaseSite.findOne({ slug });
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error("Error fetching showcase site:", error);
    return NextResponse.json({ error: "Failed to fetch site" }, { status: 500 });
  }
}

// PUT update showcase site (admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();

    // Get current site to check for status change
    const currentSite = await ShowcaseSite.findOne({ slug });
    if (!currentSite) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const previousStatus = currentSite.status;
    const newStatus = body.status;

    // Fields that can be updated
    const allowedUpdates = [
      "businessName",
      "businessType",
      "originalWebsiteUrl",
      "status",
      "expiryDate",
      "content",
      "contact",
      "theme",
      "branding",
      "pages",
      "tagline",
      "enabledTools",
      "toolLimits",
      "outreachMethod",
      "outreachSentAt",
      "outreachNotes",
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const site = await ShowcaseSite.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    );

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Auto-outreach when activating a draft
    let outreachResult = null;
    if (previousStatus === 'draft' && newStatus === 'active') {
      console.log(`[SHOWCASE] Status changed from draft to active for ${slug}, triggering outreach...`);

      // Get prospecting config for template and check auto-outreach setting
      const config = await ProspectingConfig.findOne();

      // Find contact email - try site contact or candidate record
      let contactEmail = site.contact?.email;
      if (!contactEmail && config?.candidates) {
        const candidate = config.candidates.find(
          (c: { showcaseSlug?: string }) => c.showcaseSlug === slug
        );
        if (candidate?.contactEmail) {
          contactEmail = candidate.contactEmail;
        }
      }

      if (contactEmail && config?.outreachEmailTemplate) {
        // Send outreach email
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://evelynlearning.com';
        const demoUrl = `${baseUrl}/showcase/${site.slug}`;

        const result = await sendOutreachEmail(
          config.outreachEmailTemplate,
          contactEmail,
          {
            businessName: site.businessName,
            demoUrl,
            accessCode: site.accessCode,
          }
        );

        if (result.success) {
          // Find contact form URL from candidate record
          let contactFormUrl = site.originalWebsiteUrl;
          if (config?.candidates) {
            const candidate = config.candidates.find(
              (c: { showcaseSlug?: string; contactFormUrl?: string }) => c.showcaseSlug === slug
            );
            if (candidate?.contactFormUrl) {
              contactFormUrl = candidate.contactFormUrl;
            }
          }

          // Update outreach status and flag contact form as pending
          await ShowcaseSite.findOneAndUpdate(
            { slug },
            {
              $set: {
                outreachMethod: 'email',
                outreachSentAt: new Date(),
                outreachNotes: `Auto-sent to ${contactEmail} on activation`,
                pendingContactForm: true, // Flag for contact form filling
                contactFormUrl: contactFormUrl,
              },
            }
          );

          // Update prospecting stats
          if (config) {
            config.totalOutreachSent += 1;
            await config.save();
          }

          outreachResult = {
            success: true,
            method: 'email',
            recipientEmail: contactEmail,
            pendingContactForm: true,
            contactFormUrl: contactFormUrl,
          };

          console.log(`[SHOWCASE] Outreach email sent to ${contactEmail} for ${slug}, contact form pending`);
        } else {
          outreachResult = {
            success: false,
            error: result.error,
          };
          console.error(`[SHOWCASE] Failed to send outreach email: ${result.error}`);
        }
      } else {
        console.log(`[SHOWCASE] No contact email found for ${slug}, skipping outreach`);
      }
    }

    return NextResponse.json({
      site,
      message: "Site updated successfully",
      outreach: outreachResult,
    });
  } catch (error) {
    console.error("Error updating showcase site:", error);
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 });
  }
}

// DELETE showcase site (admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const { slug } = await params;

    const site = await ShowcaseSite.findOneAndDelete({ slug });
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Error deleting showcase site:", error);
    return NextResponse.json({ error: "Failed to delete site" }, { status: 500 });
  }
}
