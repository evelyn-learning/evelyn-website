import { NextResponse } from "next/server";
import { connectDB } from "@core/db";
import { getSiteSettings } from "@/models";

// GET - Get public site settings (contact info only)
export async function GET() {
  try {
    await connectDB();
    const settings = await getSiteSettings();

    // Return only public contact information
    return NextResponse.json({
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      companyName: settings.companyName,
    });
  } catch (error) {
    console.error("[PUBLIC_SETTINGS] GET error:", error);
    // Return defaults if DB fails
    return NextResponse.json({
      contactEmail: "info@evelynlearning.com",
      contactPhone: "+1 (302) 212-0975",
      companyName: "Evelyn Learning",
    });
  }
}
