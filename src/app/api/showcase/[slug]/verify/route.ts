import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db";
import { ShowcaseSite, trackShowcaseView } from "@/models";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// POST verify access code and get site data (public)
export async function POST(req: NextRequest, { params }: RouteParams) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json({ error: "Access code required" }, { status: 400 });
    }

    const site = await ShowcaseSite.findOne({ slug });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Check if site is active or purchased
    if (site.status !== "active" && site.status !== "purchased") {
      if (site.status === "expired") {
        return NextResponse.json({
          error: "This demo has expired. Contact us to renew.",
          expired: true
        }, { status: 403 });
      }
      return NextResponse.json({ error: "Site not available" }, { status: 403 });
    }

    // Check expiry
    if (new Date() > new Date(site.expiryDate) && site.status !== "purchased") {
      // Auto-expire the site
      site.status = "expired";
      await site.save();
      return NextResponse.json({
        error: "This demo has expired. Contact us to renew.",
        expired: true
      }, { status: 403 });
    }

    // Verify access code
    if (site.accessCode !== accessCode) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
    }

    // Update access tracking
    site.accessAttempts += 1;
    site.lastAccessAt = new Date();
    await site.save();

    // Track view
    await trackShowcaseView(slug);

    // Return site data (without sensitive fields)
    const siteData = {
      slug: site.slug,
      businessName: site.businessName,
      businessType: site.businessType,
      content: site.content,
      contact: site.contact,
      theme: site.theme,
      enabledTools: site.enabledTools,
      toolLimits: site.toolLimits,
      status: site.status,
      expiryDate: site.expiryDate,
      daysRemaining: Math.max(0, Math.ceil((new Date(site.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
    };

    return NextResponse.json({
      success: true,
      site: siteData
    });
  } catch (error) {
    console.error("Error verifying showcase access:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// GET check if site exists (public, for showing login page)
export async function GET(req: NextRequest, { params }: RouteParams) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const { slug } = await params;

    const site = await ShowcaseSite.findOne({ slug }).select("businessName businessType status theme.logoUrl");

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Return minimal info for login page
    return NextResponse.json({
      exists: true,
      businessName: site.businessName,
      businessType: site.businessType,
      logoUrl: site.theme?.logoUrl,
      status: site.status,
    });
  } catch (error) {
    console.error("Error checking showcase site:", error);
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
