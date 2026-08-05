import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { OutreachToken } from "@/models";
import { encryptToken } from "@/lib/crypto/token-encryption";
import { verifyOAuthState } from "@/lib/google/oauth-state";
import { getOutreachAccount, getOutreachOAuthClient } from "@/lib/outreach/gmail";

const SUCCESS_PATH = "/admin/outreach";

// See the identical helper + comment in `../auth/route.ts`: behind
// nginx/Cloudflare `req.url` reports `http://` even for an https request, so
// redirect URLs must be built from the configured callback URL's origin, not
// `req.url` directly.
function appBaseUrl(req: NextRequest): string {
  const callback = process.env.GMAIL_OUTREACH_CALLBACK_URL || "";
  try {
    const u = new URL(callback);
    return `${u.protocol}//${u.host}`;
  } catch {
    return new URL(req.url).origin;
  }
}

function errorRedirect(req: NextRequest, code: string) {
  const url = new URL(SUCCESS_PATH, appBaseUrl(req));
  url.searchParams.set("gmail_error", code);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return errorRedirect(req, error);
  if (!code) return errorRedirect(req, "missing_code");

  const stateCheck = verifyOAuthState(state);
  if (!stateCheck.ok) {
    return errorRedirect(req, `state_${stateCheck.reason}`);
  }

  try {
    const client = getOutreachOAuthClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      return errorRedirect(req, "missing_refresh_token");
    }

    // `login_hint` on the consent screen is only a hint — the user can switch
    // accounts there. Verify the account that actually consented matches the
    // configured outreach mailbox before we ever store its refresh token
    // under that name; otherwise the wrong mailbox's token gets labelled as
    // the outreach account (and reply-detection would classify the real
    // operator's own sends as inbound replies).
    client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: client });
    const profile = await gmail.users.getProfile({ userId: "me" });
    const consentedEmail = profile.data.emailAddress?.toLowerCase();
    const account = getOutreachAccount();
    if (!consentedEmail || consentedEmail !== account.toLowerCase()) {
      return errorRedirect(req, "wrong_account");
    }

    await connectDB();
    await OutreachToken.findOneAndUpdate(
      { account },
      {
        $set: {
          account,
          refreshTokenEnc: encryptToken(tokens.refresh_token),
          connectedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    const redirectUrl = new URL(SUCCESS_PATH, appBaseUrl(req));
    redirectUrl.searchParams.set("gmail", "connected");
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "callback_failed";
    console.error("[OUTREACH] Gmail OAuth callback error:", msg);
    return errorRedirect(req, "callback_failed");
  }
}
