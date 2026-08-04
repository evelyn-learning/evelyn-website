import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { OutreachToken } from "@/models";
import { encryptToken } from "@/lib/crypto/token-encryption";
import { verifyOAuthState } from "@/lib/google/oauth-state";
import { getOutreachAccount, getOutreachOAuthClient } from "@/lib/outreach/gmail";

const SUCCESS_PATH = "/admin/outreach";

function errorRedirect(req: NextRequest, code: string) {
  const url = new URL(SUCCESS_PATH, req.url);
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

    await connectDB();

    const account = getOutreachAccount();
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

    const redirectUrl = new URL(SUCCESS_PATH, req.url);
    redirectUrl.searchParams.set("gmail", "connected");
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "callback_failed";
    console.error("[OUTREACH] Gmail OAuth callback error:", msg);
    return errorRedirect(req, "callback_failed");
  }
}
