import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, isDBConfigured } from "@/lib/db";
import { ShowcaseSite, generateAccessCode, type BusinessType } from "@/models";

// GET all showcase sites (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const businessType = searchParams.get("businessType");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (businessType) query.businessType = businessType;

    const sites = await ShowcaseSite.find(query)
      .sort({ createdAt: -1 })
      .select("-accessCode") // Don't expose access codes in list
      .lean();

    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Error fetching showcase sites:", error);
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 });
  }
}

// POST create new showcase site (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const {
      businessName,
      businessType,
      originalWebsiteUrl,
      content,
      contact,
      theme,
      enabledTools,
      trialDays = 14,
    } = body;

    if (!businessName || !businessType || !originalWebsiteUrl) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, businessType, originalWebsiteUrl" },
        { status: 400 }
      );
    }

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug exists
    const existing = await ShowcaseSite.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: `Site with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    // Generate access code
    const accessCode = generateAccessCode(businessName);

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + trialDays);

    const site = await ShowcaseSite.create({
      slug,
      businessName,
      businessType: businessType as BusinessType,
      originalWebsiteUrl,
      accessCode,
      status: "active",
      expiryDate,
      trialDays,
      content: content || {
        heroTitle: businessName,
        heroSubtitle: "Powered by AI",
        aboutText: "",
        services: [],
        testimonials: [],
        faqs: [],
        blogPosts: [],
      },
      contact: contact || {
        email: "",
        phone: "",
        address: "",
        businessHours: "",
      },
      theme: theme || {
        primaryColor: "#10B981",
        secondaryColor: "#0F766E",
        accentColor: "#F59E0B",
      },
      enabledTools: enabledTools || ["test-generator", "homework-bot", "essay-ai"],
      analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        toolUsage: {},
        viewHistory: [],
      },
    });

    return NextResponse.json({
      site: {
        ...site.toObject(),
        accessCode, // Include access code in creation response
      },
      message: "Showcase site created successfully",
    });
  } catch (error) {
    console.error("Error creating showcase site:", error);
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 });
  }
}
