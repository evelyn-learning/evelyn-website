import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SiteSettings, getSiteSettings } from "@/models";

// GET - Get site settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[ADMIN_SETTINGS] GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    // Get existing settings (or create default)
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    // Update allowed fields
    const allowedFields = [
      "contactEmail",
      "contactPhone",
      "emergencySupport",
      "responseTime",
      "businessHours",
      "offices",
      "demoLink",
      "companyName",
      "companyTagline",
      "companyDescription",
      "differentiators",
      "stats",
      "securityCertifications",
      "securityDescription",
      "lmsPlatforms",
      "integrationCapabilities",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        settings[field] = body[field];
      }
    }

    await settings.save();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[ADMIN_SETTINGS] PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
