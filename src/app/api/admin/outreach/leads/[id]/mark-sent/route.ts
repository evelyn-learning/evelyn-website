import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
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

    const result = applyMarkSent(
      { status: lead.status, touches: lead.touches },
      channel as TouchChannel,
      summary || `${channel} outreach sent`,
      new Date()
    );

    lead.touches.push(result.touch);
    lead.status = result.status;
    lead.nextActionAt = result.nextActionAt;

    if (channel === "email" && lead.currentDraft?.gmailThreadId) {
      if (!lead.gmailThreadIds.includes(lead.currentDraft.gmailThreadId)) {
        lead.gmailThreadIds.push(lead.currentDraft.gmailThreadId);
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
