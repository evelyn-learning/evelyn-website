import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ChatConversation } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single conversation with full messages
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await connectDB();

    const conversation = await ChatConversation.findById(id).lean();

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("[ADMIN_CHAT_CONVERSATION] GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
