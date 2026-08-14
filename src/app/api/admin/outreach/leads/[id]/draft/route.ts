import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Lead, TOUCH_CHANNELS, type TouchChannel } from "@/models";
import { createOutreachDraft, getOutreachGmail } from "@/lib/outreach/gmail";
import { applyDemoLink, demoLinkFor } from "@/lib/outreach/draft-body";

// A googleapis/gaxios error surfaces its HTTP status as either `.status` or
// `.response.status` depending on where in the stack it was thrown. Duck-type
// rather than importing the transitive `gaxios` package directly.
function httpStatusOf(err: unknown): number | undefined {
  if (err && typeof err === "object") {
    const e = err as { status?: number; response?: { status?: number } };
    return e.status ?? e.response?.status;
  }
  return undefined;
}

// POST - (re)write the lead's current draft. For email this creates a real
// Gmail draft (threaded onto the intro by default once one exists); for
// linkedin/form it just stores the copy-button body.
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
    const { channel, subject, body, newThread } = payload ?? {};

    if (!TOUCH_CHANNELS.includes(channel as TouchChannel)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }
    if (typeof body !== "string" || body.trim().length === 0) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    // Resolve the [DEMO_LINK] placeholder the research prompts emit. Applied
    // to every channel, and BEFORE persisting, so the stored body is the one
    // that actually goes out — the console's copy buttons read the same
    // field, and previously handed the operator a body still containing the
    // literal token.
    const resolvedBody = applyDemoLink(
      body,
      demoLinkFor(process.env.NEXT_PUBLIC_SITE_URL || "", lead.demoToken),
    );

    if (channel === "linkedin" || channel === "form") {
      lead.currentDraft = { channel, body: resolvedBody };
      await lead.save();
      return NextResponse.json({ success: true, lead });
    }

    // channel === "email"
    const to = lead.decisionMaker?.email;
    if (!to) {
      return NextResponse.json(
        { error: "Lead has no decision-maker email" },
        { status: 400 }
      );
    }

    try {
      // Reply-by-default (A2): once the lead has a sent thread, every
      // subsequent draft (bump, breakup, ...) threads onto it unless the
      // caller explicitly asks for a fresh thread.
      const threadId =
        lead.gmailThreadIds.length > 0 && newThread !== true
          ? lead.gmailThreadIds[0]
          : undefined;

      // Create the new draft BEFORE touching the old one. If we deleted the
      // old draft first and createOutreachDraft then threw (network blip,
      // quota, the lib's own "no id/threadId" guard), lead.currentDraft
      // would still point at a gmailDraftId that no longer exists in
      // Gmail — the "Open draft in Gmail" link would dangle until the next
      // successful save. Creating first means a failure here leaves the
      // previous draft (and lead.currentDraft) fully intact.
      const { draftId, threadId: resultThreadId } = await createOutreachDraft({
        to,
        subject: typeof subject === "string" ? subject : "",
        body: resolvedBody,
        threadId,
      });

      // Re-draft cleanup: now that the new draft exists, the old one (if
      // any) is safe to remove. A 404 here just means it was already sent
      // or removed by hand — that's fine; any other failure is logged (not
      // swallowed) but doesn't block persisting the new draft, since a
      // stray leftover draft in Gmail is a lesser problem than losing the
      // fresh copy we just successfully created.
      const oldDraftId = lead.currentDraft?.gmailDraftId;
      if (oldDraftId) {
        try {
          const gmail = await getOutreachGmail();
          await gmail.users.drafts.delete({ userId: "me", id: oldDraftId });
        } catch (delErr) {
          if (httpStatusOf(delErr) !== 404) {
            console.error("[OUTREACH] Failed to delete stale Gmail draft:", delErr);
          }
        }
      }

      lead.currentDraft = {
        channel: "email",
        subject: typeof subject === "string" ? subject : "",
        // The RESOLVED body: this field backs the console's copy button as
        // well as the Gmail draft, and the two must not disagree.
        body: resolvedBody,
        gmailDraftId: draftId,
        gmailThreadId: resultThreadId,
      };
      await lead.save();

      const gmailDraftUrl = `https://mail.google.com/mail/u/0/#drafts?compose=${draftId}`;
      return NextResponse.json({ success: true, lead, gmailDraftUrl });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === "GMAIL_NOT_CONNECTED") {
        return NextResponse.json({ error: "GMAIL_NOT_CONNECTED" }, { status: 409 });
      }
      if (/contains CR\/LF/.test(message)) {
        return NextResponse.json({ error: message }, { status: 400 });
      }
      throw err;
    }
  } catch (error) {
    console.error("[OUTREACH] draft Error:", error);
    // This route is admin-only, so it's safe to pass the Gmail API's own
    // error message straight through — that's the difference between
    // "insufficient scope", "invalid_grant" (revoked/expired refresh
    // token), a 403 quota error, a bad threadId, and a TOKEN_ENCRYPTION_KEY
    // rotation all looking identical as an opaque 500 vs. the operator
    // being able to diagnose which one it actually was. Nothing beyond the
    // Gmail API's own error message is exposed here.
    const status = httpStatusOf(error) ?? 500;
    const message = error instanceof Error ? error.message : "Failed to create draft";
    return NextResponse.json({ error: message }, { status });
  }
}
