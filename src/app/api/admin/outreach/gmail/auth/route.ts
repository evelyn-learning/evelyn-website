import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encodeOAuthState } from "@/lib/google/oauth-state";
import { GMAIL_OUTREACH_SCOPES, getOutreachAccount, getOutreachOAuthClient } from "@/lib/outreach/gmail";

const ERROR_PATH = "/admin/outreach";

function errorRedirect(req: NextRequest, code: string) {
  const url = new URL(ERROR_PATH, req.url);
  url.searchParams.set("gmail_error", code);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let client;
  try {
    client = getOutreachOAuthClient();
  } catch (err) {
    console.error(
      "[OUTREACH] Gmail auth route config error:",
      err instanceof Error ? err.message : "unknown"
    );
    return errorRedirect(req, "not_configured");
  }

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_OUTREACH_SCOPES,
    state: encodeOAuthState(),
    login_hint: getOutreachAccount(),
  });

  return NextResponse.redirect(url);
}
