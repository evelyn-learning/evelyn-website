import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { ChatQA } from "@/models";

// GET - List all Q&A entries
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const qaEntries = await ChatQA.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(qaEntries);
  } catch (error) {
    console.error("[ADMIN_CHAT_QA] GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch Q&A entries" },
      { status: 500 }
    );
  }
}

// POST - Create new Q&A entry
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answer, keywords, category } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const qa = await ChatQA.create({
      question,
      answer,
      keywords: keywords || [],
      category: category || "general",
      enabled: true,
    });

    return NextResponse.json(qa, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_CHAT_QA] POST error:", error);
    return NextResponse.json(
      { message: "Failed to create Q&A entry" },
      { status: 500 }
    );
  }
}
