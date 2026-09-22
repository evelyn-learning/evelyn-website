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

// The OAuth redirect URI registered with Google
// (`GMAIL_OUTREACH_CALLBACK_URL`) is on `www`; the admin session cookie is
// host-only on `NEXTAUTH_URL`'s origin (the apex). Google always redirects
// the browser back to the registered `www` host, so that request carries no
// session cookie and the check below would 401 an operator who is, in fact,
// logged in. `sessionOrigin` is where that cookie lives.
function sessionOrigin(req: NextRequest): string {
  return new URL(process.env.NEXTAUTH_URL ?? req.nextUrl.origin).origin;
}

function errorRedirect(req: NextRequest, code: string) {
  const url = new URL(SUCCESS_PATH, sessionOrigin(req));
  url.searchParams.set("gmail_error", code);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  // Same-path bounce to the session host, BEFORE the session check. If this
  // request arrived on a different origin than the one holding the admin
  // cookie (the `www` vs. apex split above), redirect the browser to the
  // identical callback URL — same path, same `code`/`state`/`error` query
  // params — on the session host, and return immediately without touching
  // the session check. On the session host the origins match, so this
  // branch is skipped and the request falls through to the (unchanged)
  // session check below — 401 if genuinely unauthenticated, exactly as
  // today. No loop: the second pass always has matching origins. The OAuth
  // `state`'s TTL comfortably covers this one extra redirect hop, and the
  // token exchange below is server-side and still uses the `www`
  // `redirect_uri` registered with Google — this bounce only moves the
  // browser, not the exchange.
  const here = req.nextUrl.origin;
  const there = sessionOrigin(req);
  if (here !== there) {
    return NextResponse.redirect(there + req.nextUrl.pathname + req.nextUrl.search, 302);
  }

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
      return errorRedirect(req, "wrong_account");
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

    const redirectUrl = new URL(SUCCESS_PATH, sessionOrigin(req));
    redirectUrl.searchParams.set("gmail", "connected");
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "callback_failed";
    console.error("[OUTREACH] Gmail OAuth callback error:", msg);
    return errorRedirect(req, "callback_failed");
  }
}
