import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isReplyWatcherActive, runReplyCheck } from "@/lib/outreach/reply-watcher";

// GET - reply watcher scheduler status
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ active: isReplyWatcherActive() });
}

// POST - manually trigger a reply check (the triggerQueueProcessing escape hatch)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await runReplyCheck();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("[OUTREACH] watcher trigger Error:", error);
    return NextResponse.json({ error: "Failed to run reply check" }, { status: 500 });
  }
}
