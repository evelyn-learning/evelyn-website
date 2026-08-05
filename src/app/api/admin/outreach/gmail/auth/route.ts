import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encodeOAuthState } from "@/lib/google/oauth-state";
import { GMAIL_OUTREACH_SCOPES, getOutreachAccount, getOutreachOAuthClient } from "@/lib/outreach/gmail";

const ERROR_PATH = "/admin/outreach";

// Behind nginx/Cloudflare, `req.url` reports `http://` even when the actual
// request arrived over https — the proxy terminates TLS and forwards plain
// HTTP internally. Building redirect URLs from `req.url` in that setup
// produces an `http://` Location, a downgrade hop. Derive the origin from
// the configured callback URL instead (same pattern as
// `src/app/api/auth/google/callback/route.ts`'s `appBaseUrl()`), falling
// back to `req.url` only when the env var isn't set (e.g. local dev without
// a proxy in front).
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
  const url = new URL(ERROR_PATH, appBaseUrl(req));
  url.searchParams.set("gmail_error", code);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // `encodeOAuthState()` throws when TOKEN_ENCRYPTION_KEY isn't set (see
  // `src/lib/google/oauth-state.ts`'s `getSecret()`) — the same
  // misconfiguration class as a missing GMAIL_OUTREACH_* var. Both belong in
  // one try/catch so a misconfigured box always redirects to
  // `?gmail_error=not_configured` instead of throwing a raw 500 out of this
  // route.
  try {
    const client = getOutreachOAuthClient();
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GMAIL_OUTREACH_SCOPES,
      state: encodeOAuthState(),
      login_hint: getOutreachAccount(),
    });
    return NextResponse.redirect(url);
  } catch (err) {
    console.error(
      "[OUTREACH] Gmail auth route config error:",
      err instanceof Error ? err.message : "unknown"
    );
    return errorRedirect(req, "not_configured");
  }
}
