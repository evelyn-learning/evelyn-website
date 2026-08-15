import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Webinar } from "@/models";
import { slugify } from "@core/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const webinars = await Webinar.find().sort({ date: -1 }).lean();
  return NextResponse.json(webinars);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  let slug = slugify(body.title);
  const existing = await Webinar.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const webinar = await Webinar.create({ ...body, slug });
  return NextResponse.json(webinar, { status: 201 });
}
