import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead } from "@/models";
import { applyApprove, applyKill } from "@/lib/outreach/lead-transitions";

// Cap on one request's selection. The Review queue is a human worklist, not
// a bulk-import surface: an "approve all" over 200 leads is far more likely
// to be a mistake than an intent, and each approval mints a demo token and
// puts a lead in front of a real prospect.
const MAX_IDS = 200;

// POST - apply approve/kill to many leads in one call.
//
// The console's Review tab does this per selection. Doing it client-side as
// N sequential PATCHes meant N round-trips (each followed by a full
// lead-list refetch) and no story for a partial failure — the operator would
// be left guessing which of 19 leads actually moved. Here the per-lead
// outcome is reported explicitly.
//
// Not a transaction: leads are independent documents and a half-applied
// batch is recoverable (the skipped ones are named in the response and
// remain in the queue). Each lead is saved on its own so one bad document
// can't roll back the rest.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, ids } = body ?? {};

    if (action !== "approve" && action !== "kill") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids is required" }, { status: 400 });
    }
    if (!ids.every((id) => typeof id === "string")) {
      return NextResponse.json({ error: "ids must be strings" }, { status: 400 });
    }
    if (ids.length > MAX_IDS) {
      return NextResponse.json(
        { error: `Too many leads in one request (max ${MAX_IDS})` },
        { status: 400 }
      );
    }

    await connectDB();

    const now = new Date();
    const mintToken = () => randomBytes(8).toString("base64url");
    const updated: string[] = [];
    const skipped: { id: string; reason: string }[] = [];

    // Dedupe: the same id twice would otherwise be loaded twice, and the
    // second pass would report its own first pass as "not staged".
    for (const id of [...new Set(ids as string[])]) {
      const lead = await Lead.findById(id).catch(() => null);
      if (!lead) {
        skipped.push({ id, reason: "not found" });
        continue;
      }

      const res =
        action === "approve" ? applyApprove(lead, now, mintToken) : applyKill(lead);
      if (!res.ok) {
        skipped.push({ id, reason: res.reason });
        continue;
      }

      try {
        await lead.save();
        updated.push(id);
      } catch (err) {
        console.error(`[OUTREACH] bulk ${action} failed to save ${id}:`, err);
        skipped.push({ id, reason: "save failed" });
      }
    }

    return NextResponse.json({ success: true, action, updated, skipped });
  } catch (error) {
    console.error("[OUTREACH] bulk Error:", error);
    return NextResponse.json({ error: "Bulk update failed" }, { status: 500 });
  }
}
