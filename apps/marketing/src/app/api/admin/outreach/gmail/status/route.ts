import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { OutreachToken, type IOutreachToken } from "@/models";
import { getOutreachAccount } from "@/lib/outreach/gmail";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const account = getOutreachAccount();
  const doc = await OutreachToken.findOne({ account }).lean<IOutreachToken>();

  // `connected: true` only means a token row exists, not that it still
  // works (it may have been revoked, or TOKEN_ENCRYPTION_KEY may have
  // rotated since). Surfacing connectedAt lets the chip show staleness
  // instead of asserting a green status forever.
  return NextResponse.json({
    connected: !!doc,
    account,
    connectedAt: doc?.connectedAt ? new Date(doc.connectedAt).toISOString() : null,
  });
}
