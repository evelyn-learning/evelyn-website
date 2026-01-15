import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Interview } from "@/models";

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

  const interview = await Interview.findById(id).lean();
  if (!interview) {
    return NextResponse.json({ message: "Interview not found" }, { status: 404 });
  }

  return NextResponse.json(interview);
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

  const interview = await Interview.findByIdAndUpdate(id, body, { new: true });
  if (!interview) {
    return NextResponse.json({ message: "Interview not found" }, { status: 404 });
  }

  return NextResponse.json(interview);
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

  const interview = await Interview.findByIdAndDelete(id);
  if (!interview) {
    return NextResponse.json({ message: "Interview not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Interview deleted" });
}
