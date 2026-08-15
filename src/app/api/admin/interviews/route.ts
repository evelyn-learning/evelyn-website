import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Interview } from "@/models";
import { slugify } from "@core/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const interviews = await Interview.find().sort({ episode: -1 }).lean();
  return NextResponse.json(interviews);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  let slug = slugify(body.title);
  const existing = await Interview.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const interview = await Interview.create({ ...body, slug });
  return NextResponse.json(interview, { status: 201 });
}
