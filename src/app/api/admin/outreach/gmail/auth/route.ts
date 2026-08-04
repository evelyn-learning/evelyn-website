import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { encodeOAuthState } from "@/lib/google/oauth-state";
import { GMAIL_OUTREACH_SCOPES, getOutreachAccount, getOutreachOAuthClient } from "@/lib/outreach/gmail";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getOutreachOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_OUTREACH_SCOPES,
    state: encodeOAuthState(),
    login_hint: getOutreachAccount(),
  });

  return NextResponse.redirect(url);
}
