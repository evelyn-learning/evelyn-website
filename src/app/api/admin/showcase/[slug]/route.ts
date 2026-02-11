import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ShowcaseSite, Prospect } from "@/models";

// DELETE - Remove a showcase site
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    await connectDB();

    // Delete the showcase
    const result = await ShowcaseSite.deleteOne({ slug });

    // Clear the reference from the prospect
    await Prospect.updateOne(
      { showcaseSlug: slug },
      {
        $unset: {
          showcaseSiteId: "",
          showcaseSlug: "",
          showcaseAccessCode: "",
        },
        $set: {
          status: "scraped", // Reset status to allow re-generation
        },
      }
    );

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Showcase deleted",
    });
  } catch (error) {
    console.error("[SHOWCASE] Delete Error:", error);
    return NextResponse.json(
      { error: `Failed to delete showcase: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// GET - Get showcase details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    await connectDB();

    const showcase = await ShowcaseSite.findOne({ slug });

    if (!showcase) {
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ showcase });
  } catch (error) {
    console.error("[SHOWCASE] Get Error:", error);
    return NextResponse.json(
      { error: `Failed to get showcase: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
