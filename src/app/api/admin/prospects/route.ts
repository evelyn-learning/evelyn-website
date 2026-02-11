import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Prospect, generateProspectSlug, inferBusinessType } from "@/models";

// GET - List all prospects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const prospects = await Prospect.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ prospects });
  } catch (error) {
    console.error("[PROSPECTS] GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch prospects" }, { status: 500 });
  }
}

// POST - Import prospects from Excel data or create single prospect
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Check if this is a bulk import
    if (body.prospects && Array.isArray(body.prospects)) {
      const results = {
        created: 0,
        updated: 0,
        errors: [] as string[],
      };

      for (const prospectData of body.prospects) {
        try {
          const slug = generateProspectSlug(prospectData.instituteName || prospectData["Institute name"]);
          const name = prospectData.instituteName || prospectData["Institute name"];
          const website = prospectData.website || prospectData.Website;
          const services = prospectData.services || prospectData.Services || "";

          const existing = await Prospect.findOne({ slug });

          if (existing) {
            // Update existing
            await Prospect.updateOne(
              { slug },
              {
                $set: {
                  instituteName: name,
                  website: website,
                  location: prospectData.location || prospectData.Location || "",
                  services: services,
                  estimatedSize: prospectData.estimatedSize || prospectData["Estimated size"] || "",
                  techAssessment: prospectData.techAssessment || prospectData["Tech assessment"] || "",
                  potentialSolutions: prospectData.potentialSolutions || prospectData["Potential solutions"] || "",
                  businessType: prospectData.businessType || inferBusinessType(services),
                },
              }
            );
            results.updated++;
          } else {
            // Create new
            await Prospect.create({
              instituteName: name,
              website: website,
              slug: slug,
              location: prospectData.location || prospectData.Location || "",
              services: services,
              estimatedSize: prospectData.estimatedSize || prospectData["Estimated size"] || "",
              techAssessment: prospectData.techAssessment || prospectData["Tech assessment"] || "",
              potentialSolutions: prospectData.potentialSolutions || prospectData["Potential solutions"] || "",
              businessType: prospectData.businessType || inferBusinessType(services),
              status: "new",
              priority: "medium",
            });
            results.created++;
          }
        } catch (err) {
          const error = err as Error;
          results.errors.push(`${prospectData.instituteName || prospectData["Institute name"]}: ${error.message}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Created ${results.created}, updated ${results.updated} prospects`,
        results,
      });
    }

    // Single prospect creation
    const { instituteName, website, businessType, location, services } = body;

    if (!instituteName || !website) {
      return NextResponse.json(
        { error: "instituteName and website are required" },
        { status: 400 }
      );
    }

    const slug = generateProspectSlug(instituteName);

    const existing = await Prospect.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Prospect with this name already exists" },
        { status: 409 }
      );
    }

    const prospect = await Prospect.create({
      instituteName,
      website,
      slug,
      businessType: businessType || inferBusinessType(services || ""),
      location: location || "",
      services: services || "",
      status: "new",
      priority: "medium",
    });

    return NextResponse.json({ success: true, prospect });
  } catch (error) {
    console.error("[PROSPECTS] POST Error:", error);
    return NextResponse.json({ error: "Failed to create prospect" }, { status: 500 });
  }
}

// PUT - Update prospect
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const prospect = await Prospect.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    );

    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, prospect });
  } catch (error) {
    console.error("[PROSPECTS] PUT Error:", error);
    return NextResponse.json({ error: "Failed to update prospect" }, { status: 500 });
  }
}

// DELETE - Delete prospect
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await connectDB();

    const result = await Prospect.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROSPECTS] DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete prospect" }, { status: 500 });
  }
}
