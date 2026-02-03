import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ChatConversation } from "@/models";

// GET - List recent conversations
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    // Get recent conversations with at least one message
    const conversations = await ChatConversation.find({
      "messages.0": { $exists: true },
    })
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    // Return simplified data for the admin view
    const simplifiedConversations = conversations.map((conv) => ({
      _id: conv._id,
      sessionId: conv.sessionId,
      status: conv.status,
      messageCount: conv.messages.length,
      lastMessage:
        conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1].content.slice(0, 100)
          : "",
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    return NextResponse.json(simplifiedConversations);
  } catch (error) {
    console.error("[ADMIN_CHAT_CONVERSATIONS] GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
