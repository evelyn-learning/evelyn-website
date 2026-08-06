import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ResearchJob } from "@/models/ResearchJob";
import { LEAD_SEGMENTS } from "@/lib/outreach/enums";
import { isResearchWorkerActive } from "@/lib/outreach/research/worker";

// GET - worker status + active job + recent jobs
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const active = await ResearchJob.findOne({ status: { $in: ["queued", "running"] } })
      .sort({ createdAt: 1 });
    const recent = await ResearchJob.find({ status: { $nin: ["queued", "running"] } })
      .sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ workerActive: isResearchWorkerActive(), active, recent });
  } catch (error) {
    console.error("[OUTREACH] research GET Error:", error);
    return NextResponse.json({ error: "Failed to load research jobs" }, { status: 500 });
  }
}

// POST - create a research job (one active at a time)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { segment, niche = "", region = "", count } = body ?? {};
    if (!LEAD_SEGMENTS.includes(segment)) {
      return NextResponse.json({ error: "Invalid segment" }, { status: 400 });
    }
    const n = Number(count);
    if (!Number.isInteger(n) || n < 1 || n > 25) {
      return NextResponse.json({ error: "count must be an integer 1-25" }, { status: 400 });
    }
    await connectDB();
    const existing = await ResearchJob.findOne({ status: { $in: ["queued", "running"] } });
    if (existing) {
      return NextResponse.json(
        { error: "A research job is already queued or running" }, { status: 409 }
      );
    }
    const job = await ResearchJob.create({
      segment, niche: String(niche).slice(0, 200), region: String(region).slice(0, 200), count: n,
    });
    // Optimistic post-create check: the pre-create findOne above is a fast
    // path, not a lock, so two concurrent POSTs can both pass it and both
    // create a job (TOCTOU). Close the race here with a deterministic
    // tiebreak: ObjectIds order by creation time, so of two racers, each
    // looks for an active rival with a *smaller* _id. The later job always
    // finds the earlier one and deletes itself; the earlier job's own _id
    // is the smallest, so it finds nothing and survives. Exactly one job
    // remains regardless of how many requests race.
    const rival = await ResearchJob.findOne({
      _id: { $lt: job._id },
      status: { $in: ["queued", "running"] },
    });
    if (rival) {
      await ResearchJob.deleteOne({ _id: job._id });
      return NextResponse.json(
        { error: "A research job is already queued or running" }, { status: 409 }
      );
    }
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("[OUTREACH] research POST Error:", error);
    return NextResponse.json({ error: "Failed to create research job" }, { status: 500 });
  }
}
