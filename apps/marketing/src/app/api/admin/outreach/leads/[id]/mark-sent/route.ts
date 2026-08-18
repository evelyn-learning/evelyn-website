import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead, TOUCH_CHANNELS, type TouchChannel } from "@/models";
import { applyMarkSent } from "@/lib/outreach/cadence";

// POST - mark a per-channel outbound touch as sent, advancing the cadence
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await request.json();
    const { channel, summary } = body ?? {};

    if (!TOUCH_CHANNELS.includes(channel as TouchChannel)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }

    // applyMarkSent() only reads lead.status to decide the *next* status —
    // it doesn't validate that mark-sent is a legal action from the
    // CURRENT status. Without this guard, calling mark-sent on a
    // replied/call_booked/dead lead silently flips it back to "contacted"
    // (a fresh outbound touch on a lead that's already replied or is dead).
    // Matches what the UI already enforces (Today tab only surfaces
    // approved/contacted leads).
    if (lead.status !== "approved" && lead.status !== "contacted") {
      return NextResponse.json(
        { error: `Cannot mark sent for a lead with status "${lead.status}"` },
        { status: 400 }
      );
    }

    const result = applyMarkSent(
      { status: lead.status, touches: lead.touches },
      channel as TouchChannel,
      summary || `${channel} outreach sent`,
      new Date()
    );

    lead.touches.push(result.touch);
    lead.status = result.status;
    lead.nextActionAt = result.nextActionAt;

    // An email send always consumes the draft slot — a generated draft has
    // no Gmail ids (the operator copies it into their own client), and
    // leaving it in place would both block the next step's "Generate" button
    // and re-offer this step's copy as the follow-up. The thread id is
    // seeded only when a real Gmail draft was minted.
    if (channel === "email" && lead.currentDraft) {
      const threadId = lead.currentDraft.gmailThreadId;
      if (threadId && !lead.gmailThreadIds.includes(threadId)) {
        lead.gmailThreadIds.push(threadId);
      }
      lead.currentDraft = null;
    }

    await lead.save();
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[OUTREACH] mark-sent Error:", error);
    return NextResponse.json({ error: "Failed to mark sent" }, { status: 500 });
  }
}
