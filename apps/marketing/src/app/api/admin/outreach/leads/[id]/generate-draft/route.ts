import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { Lead, TOUCH_CHANNELS, type TouchChannel } from "@/models";
import { getOutreachGmail, httpStatusOf } from "@/lib/outreach/gmail";
import { demoLinkFor } from "@/lib/outreach/draft-body";
import {
  generateDraftParams,
  applyGeneratedDraft,
  type GenerateParsed,
} from "@/lib/outreach/research/generate-draft";
import { realCallModel, callWithToolLoop, extractJson } from "@/lib/outreach/research/claude";
import { priceUsageUsd } from "@/lib/outreach/research/cost";

// POST - have Claude write the lead's next message for the given channel
// (intro/bump/breakup for email, LinkedIn note, contact-form message) from
// the research already on file, and store it in the channel's draft slot.
// An email draft lands WITHOUT Gmail ids — the operator mints the real Gmail
// draft via the existing "Create Gmail draft" button, which owns threading.
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

    const payload = await request.json().catch(() => ({}));
    const { channel } = payload ?? {};
    if (!TOUCH_CHANNELS.includes(channel as TouchChannel)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }

    // Same stale-UI protection as mark-sent: if the lead left the active
    // pipeline after the Today tab loaded (reply detected, killed, parked),
    // refuse before the paid model call rather than clobber the draft that
    // was live when the prospect replied. Staged is allowed — pre-approval
    // drafting is harmless and the Review tab may grow the button later.
    if (!["staged", "approved", "contacted"].includes(lead.status)) {
      return NextResponse.json(
        { error: `Cannot generate a draft for a lead with status "${lead.status}"` },
        { status: 409 }
      );
    }

    let costUsd = 0;
    let parsed: GenerateParsed;
    try {
      const msg = await callWithToolLoop(
        realCallModel(),
        generateDraftParams(lead, channel as TouchChannel),
        (u) => { costUsd += priceUsageUsd(u); }
      );
      parsed = extractJson(msg) as GenerateParsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[OUTREACH] generate-draft model error:", err);
      return NextResponse.json(
        { error: `Draft generation failed: ${message}` },
        { status: 502 }
      );
    }

    const oldDraftId =
      channel === "email" ? lead.currentDraft?.gmailDraftId : undefined;
    const oldThreadId =
      channel === "email" ? lead.currentDraft?.gmailThreadId : undefined;

    const demoLink = demoLinkFor(
      process.env.NEXT_PUBLIC_SITE_URL || "",
      lead.demoToken
    );
    const changed = applyGeneratedDraft(lead, channel as TouchChannel, parsed, demoLink);
    if (!changed) {
      return NextResponse.json(
        { error: "Model returned an empty draft — nothing saved", costUsd },
        { status: 502 }
      );
    }

    // Carry the prior thread pointer forward: it's the only thing mark-sent
    // uses to seed gmailThreadIds (reply-watching + follow-up threading), and
    // the operator may have hand-sent the old minted draft without marking it
    // yet. A dead thread is harmless — the watcher prunes 404 threads.
    if (channel === "email" && oldThreadId && lead.currentDraft) {
      lead.currentDraft.gmailThreadId = oldThreadId;
    }

    await lead.save();

    // Only after the new draft is durably saved is the old minted Gmail
    // draft safe to remove — deleting first would leave the persisted
    // currentDraft pointing at a Gmail draft that no longer exists if the
    // save failed. Tolerances match the draft route's re-draft path (404 =
    // already sent/removed by hand; not-connected = nothing minted).
    if (oldDraftId) {
      try {
        const gmail = await getOutreachGmail();
        await gmail.users.drafts.delete({ userId: "me", id: oldDraftId });
      } catch (delErr) {
        const message = delErr instanceof Error ? delErr.message : "";
        if (httpStatusOf(delErr) !== 404 && message !== "GMAIL_NOT_CONNECTED") {
          console.error("[OUTREACH] Failed to delete stale Gmail draft:", delErr);
        }
      }
    }

    return NextResponse.json({ success: true, lead, costUsd });
  } catch (error) {
    console.error("[OUTREACH] generate-draft Error:", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
