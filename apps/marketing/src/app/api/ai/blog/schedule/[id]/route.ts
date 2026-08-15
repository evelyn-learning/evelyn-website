import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  updateScheduledPost,
  deleteScheduledPost,
  retryFailedPost,
} from "@/lib/services/blog-scheduler";
import { connectDB } from "@core/db";
import { BlogQueue } from "@/models/BlogQueue";

// GET - Get a single scheduled post
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const queueItem = await BlogQueue.findById(id).lean();

    if (!queueItem) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduled: JSON.parse(JSON.stringify(queueItem)),
    });
  } catch (error) {
    console.error("Get scheduled post error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch scheduled post",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a scheduled post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { action, scheduledFor, generatedPost, title } = body;

    // Handle retry action for failed posts
    if (action === "retry") {
      const updated = await retryFailedPost(id);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Scheduled post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        scheduled: JSON.parse(JSON.stringify(updated)),
      });
    }

    // Build updates object
    const updates: Record<string, unknown> = {};

    if (scheduledFor) {
      const scheduleDate = new Date(scheduledFor);
      if (isNaN(scheduleDate.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid scheduled date" },
          { status: 400 }
        );
      }
      updates.scheduledFor = scheduleDate;
    }

    if (generatedPost) {
      updates.generatedPost = generatedPost;
    }

    if (title) {
      updates.title = title;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No updates provided" },
        { status: 400 }
      );
    }

    const updated = await updateScheduledPost(id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      scheduled: JSON.parse(JSON.stringify(updated)),
    });
  } catch (error) {
    console.error("Update scheduled post error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update scheduled post",
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove a scheduled post from the queue
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteScheduledPost(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Scheduled post removed from queue",
    });
  } catch (error) {
    console.error("Delete scheduled post error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete scheduled post",
      },
      { status: 500 }
    );
  }
}
