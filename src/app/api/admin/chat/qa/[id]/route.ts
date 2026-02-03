import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ChatQA } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT - Update Q&A entry
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { question, answer, keywords, category, enabled } = body;

    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (category !== undefined) updateData.category = category;
    if (enabled !== undefined) updateData.enabled = enabled;

    const qa = await ChatQA.findByIdAndUpdate(id, updateData, { new: true });

    if (!qa) {
      return NextResponse.json(
        { message: "Q&A entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(qa);
  } catch (error) {
    console.error("[ADMIN_CHAT_QA] PUT error:", error);
    return NextResponse.json(
      { message: "Failed to update Q&A entry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete Q&A entry
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await connectDB();

    const qa = await ChatQA.findByIdAndDelete(id);

    if (!qa) {
      return NextResponse.json(
        { message: "Q&A entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Q&A entry deleted" });
  } catch (error) {
    console.error("[ADMIN_CHAT_QA] DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to delete Q&A entry" },
      { status: 500 }
    );
  }
}
