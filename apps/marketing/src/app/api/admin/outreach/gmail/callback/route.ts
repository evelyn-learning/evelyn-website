import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { OutreachToken } from "@/models";
import { encryptToken } from "@/lib/crypto/token-encryption";
import { verifyOAuthState } from "@/lib/google/oauth-state";
import { getOutreachOAuthClient, isAllowedAccount } from "@/lib/outreach/gmail";

const SUCCESS_PATH = "/admin/outreach";

// Behind nginx/Cloudflare (and under pm2 `next start` without `-H`, no
// trustHostHeader), `req.url`/`req.nextUrl.origin` reports the internal
// proxy target, not the public hostname — observed in this deployment as
// literally `http://n`. A redirect Location built from that is unusable, so
// this never reads `req.nextUrl.origin`. Instead: `NEXTAUTH_URL`'s origin
// (where the admin session cookie lives) first, falling back to
// `GMAIL_OUTREACH_CALLBACK_URL`'s origin (the OAuth redirect URI registered
// with Google) if `NEXTAUTH_URL` isn't set. If neither env is configured,
// there is no safe origin to redirect to at all — callers must fall back to
// a JSON 500 instead of building a `Location` header from garbage.
//
// Production now points `GMAIL_OUTREACH_CALLBACK_URL` at the same host as
// `NEXTAUTH_URL` (the apex), so Google's redirect back to this route already
// arrives on the session host — no same-path bounce is needed or attempted
// here.
function sessionOrigin(): string | null {
  const raw = process.env.NEXTAUTH_URL || process.env.GMAIL_OUTREACH_CALLBACK_URL || "";
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

function notConfigured() {
  return NextResponse.json({ error: "not_configured" }, { status: 500 });
}

function errorRedirect(origin: string, code: string) {
  const url = new URL(SUCCESS_PATH, origin);
  url.searchParams.set("gmail_error", code);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const origin = sessionOrigin();
  if (!origin) return notConfigured();

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return errorRedirect(origin, error);
  if (!code) return errorRedirect(origin, "missing_code");

  const stateCheck = verifyOAuthState(state);
  if (!stateCheck.ok) {
    return errorRedirect(origin, `state_${stateCheck.reason}`);
  }

  try {
    const client = getOutreachOAuthClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      return errorRedirect(origin, "missing_refresh_token");
    }

    // `login_hint` on the consent screen is only a hint — the user can switch
    // accounts there. Verify the account that actually consented is one of
    // the allowed outreach mailboxes before we ever store its refresh token
    // under that name; otherwise an arbitrary mailbox's token gets labelled
    // as an outreach account (and reply-detection would classify the real
    // operator's own sends as inbound replies).
    client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: client });
    const profile = await gmail.users.getProfile({ userId: "me" });
    const consentedEmail = profile.data.emailAddress?.toLowerCase();
    if (!consentedEmail || !isAllowedAccount(consentedEmail)) {
      return errorRedirect(origin, "wrong_account");
    }
    const account = consentedEmail;

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

    const redirectUrl = new URL(SUCCESS_PATH, origin);
    redirectUrl.searchParams.set("gmail", "connected");
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "callback_failed";
    console.error("[OUTREACH] Gmail OAuth callback error:", msg);
    return errorRedirect(origin, "callback_failed");
  }
}
