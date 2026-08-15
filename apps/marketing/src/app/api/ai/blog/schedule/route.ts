import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { BlogQueue } from "@/models/BlogQueue";
import {
  addToQueue,
  getQueueStats,
  triggerQueueProcessing,
} from "@/lib/services/blog-scheduler";
import { GeneratedBlogPost } from "@/types/blog-generator";

// GET - List scheduled posts and queue stats
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const statsOnly = searchParams.get("statsOnly") === "true";

    await connectDB();

    if (statsOnly) {
      const stats = await getQueueStats();
      return NextResponse.json({
        success: true,
        stats,
      });
    }

    // Get all queue items with optional status filter
    const status = searchParams.get("status");
    const query: Record<string, string> = {};
    if (status && ["pending", "published", "failed"].includes(status)) {
      query.status = status;
    }

    const queue = await BlogQueue.find(query)
      .sort({ scheduledFor: 1 })
      .lean();

    const stats = await getQueueStats();

    return NextResponse.json({
      success: true,
      queue: JSON.parse(JSON.stringify(queue)),
      stats,
    });
  } catch (error) {
    console.error("Schedule queue error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch schedule queue",
      },
      { status: 500 }
    );
  }
}

// POST - Add a post to the schedule queue OR trigger manual processing
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, generatedPost, scheduledFor } = body;

    // Manual queue processing trigger
    if (action === "process") {
      const result = await triggerQueueProcessing();
      return NextResponse.json({
        success: true,
        result,
      });
    }

    // Add to queue
    if (!generatedPost) {
      return NextResponse.json(
        { success: false, error: "Generated post data is required" },
        { status: 400 }
      );
    }

    if (!scheduledFor) {
      return NextResponse.json(
        { success: false, error: "Scheduled date/time is required" },
        { status: 400 }
      );
    }

    const post = generatedPost as GeneratedBlogPost;
    const scheduleDate = new Date(scheduledFor);

    if (isNaN(scheduleDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid scheduled date" },
        { status: 400 }
      );
    }

    if (scheduleDate < new Date()) {
      return NextResponse.json(
        { success: false, error: "Scheduled date must be in the future" },
        { status: 400 }
      );
    }

    const queueItem = await addToQueue(post.title, post, scheduleDate);

    return NextResponse.json(
      {
        success: true,
        scheduled: JSON.parse(JSON.stringify(queueItem)),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Schedule add error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to schedule post",
      },
      { status: 500 }
    );
  }
}
