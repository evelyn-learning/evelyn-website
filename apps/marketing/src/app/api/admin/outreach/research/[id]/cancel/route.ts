import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { ResearchJob } from "@/models/ResearchJob";

// POST - cancel a queued/running job. The pipeline re-reads status between
// candidates, so a running job stops at the next candidate boundary;
// already-inserted leads are kept.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const job = await ResearchJob.findOneAndUpdate(
      { _id: id, status: { $in: ["queued", "running"] } },
      { $set: { status: "cancelled" } },
      { new: true }
    );
    if (!job) {
      return NextResponse.json({ error: "Job not found or already finished" }, { status: 409 });
    }
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("[OUTREACH] research cancel Error:", error);
    return NextResponse.json({ error: "Failed to cancel job" }, { status: 500 });
  }
}
