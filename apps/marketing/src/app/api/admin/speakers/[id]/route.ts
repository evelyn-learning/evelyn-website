import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Speaker } from "@/models";

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

  const speaker = await Speaker.findById(id).lean();
  if (!speaker) {
    return NextResponse.json({ message: "Speaker not found" }, { status: 404 });
  }

  return NextResponse.json(speaker);
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

  const speaker = await Speaker.findByIdAndUpdate(id, body, { new: true });
  if (!speaker) {
    return NextResponse.json({ message: "Speaker not found" }, { status: 404 });
  }

  return NextResponse.json(speaker);
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

  const speaker = await Speaker.findByIdAndDelete(id);
  if (!speaker) {
    return NextResponse.json({ message: "Speaker not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Speaker deleted" });
}
