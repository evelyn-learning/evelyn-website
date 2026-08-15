import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Speaker } from "@/models";
import { slugify } from "@core/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const speakers = await Speaker.find().sort({ year: -1, name: 1 }).lean();
  return NextResponse.json(speakers);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await connectDB();

  let slug = slugify(body.name);
  const existing = await Speaker.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const speaker = await Speaker.create({ ...body, slug });
  return NextResponse.json(speaker, { status: 201 });
}
