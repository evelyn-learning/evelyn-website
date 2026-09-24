import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead, LeadSuppression } from "@/models";
import { matchQuery } from "@/lib/crm/match-lead";

const bodySchema = z.object({ suppressionId: z.string().min(1).max(64) });

// POST - undo a delete: recreate the lead from its snapshot, then drop the
// tombstone so ingest can reach it again.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "suppressionId is required" }, { status: 400 });

  try {
    await connectDB();
    const doc = await LeadSuppression.findById(parsed.data.suppressionId).catch(() => null);
    if (!doc) return NextResponse.json({ error: "Deleted lead not found" }, { status: 404 });

    const snapshot = { ...((doc.snapshot ?? {}) as Record<string, unknown>) };
    // A fresh document: the old _id may since have been reused by nothing,
    // but re-inserting it would make the restore fail if the operator had
    // already recreated the lead by hand. The timestamps are re-stamped for
    // the same reason.
    delete snapshot._id;
    delete snapshot.__v;
    delete snapshot.createdAt;
    delete snapshot.updatedAt;
    if (!snapshot.company || !snapshot.segment) {
      return NextResponse.json({ error: "Snapshot is not a lead" }, { status: 422 });
    }

    // Idempotency: if a colleague's re-import (or a manual re-entry) already
    // recreated this contact while it sat in Deleted, restoring must not
    // mint a second, duplicate lead — it should just point at the one that
    // already exists and clear the now-stale tombstone.
    const decisionMaker = (snapshot.decisionMaker ?? {}) as { email?: string; linkedinUrl?: string };
    const emails = Array.isArray(snapshot.emails) ? (snapshot.emails as string[]) : [];
    const q = matchQuery({ email: decisionMaker.email || emails[0], linkedinUrl: decisionMaker.linkedinUrl });
    const existing = q ? await Lead.findOne(q) : null;
    if (existing) {
      await doc.deleteOne();
      return NextResponse.json({ leadId: String(existing._id), alreadyExisted: true });
    }

    const lead = await Lead.create(snapshot);
    // Only now: while the tombstone exists the lead is unreachable by ingest,
    // so dropping it last means a failed create leaves the delete intact.
    await doc.deleteOne();
    return NextResponse.json({ leadId: String(lead._id) });
  } catch (error) {
    console.error("[OUTREACH] restore Error:", error);
    return NextResponse.json({ error: "Failed to restore lead" }, { status: 500 });
  }
}
