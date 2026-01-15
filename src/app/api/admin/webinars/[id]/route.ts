import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Webinar } from "@/models";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const webinar = await Webinar.findById(id).lean();
  if (!webinar) {
    return NextResponse.json({ message: "Webinar not found" }, { status: 404 });
  }

  return NextResponse.json(webinar);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  await connectDB();

  const webinar = await Webinar.findByIdAndUpdate(id, body, { new: true });
  if (!webinar) {
    return NextResponse.json({ message: "Webinar not found" }, { status: 404 });
  }

  return NextResponse.json(webinar);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const webinar = await Webinar.findByIdAndDelete(id);
  if (!webinar) {
    return NextResponse.json({ message: "Webinar not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Webinar deleted" });
}
