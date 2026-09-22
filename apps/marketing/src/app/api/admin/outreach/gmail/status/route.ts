import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { OutreachToken, type IOutreachToken } from "@/models";
import { getOutreachAccounts } from "@/lib/outreach/gmail";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // `connected: true` only means a token row exists, not that it still
  // works (it may have been revoked, or TOKEN_ENCRYPTION_KEY may have
  // rotated since). Surfacing connectedAt lets the chip show staleness
  // instead of asserting a green status forever.
  const accounts = getOutreachAccounts();
  const docs = await OutreachToken.find({ account: { $in: accounts } }).lean<IOutreachToken[]>();
  const byAccount = new Map(docs.map((d) => [d.account, d]));
  return NextResponse.json({
    connected: byAccount.has(accounts[0]),
    account: accounts[0],
    connectedAt: byAccount.get(accounts[0])?.connectedAt ? new Date(byAccount.get(accounts[0])!.connectedAt).toISOString() : null,
    accounts: accounts.map((a) => ({ account: a, connected: byAccount.has(a), connectedAt: byAccount.get(a)?.connectedAt ? new Date(byAccount.get(a)!.connectedAt).toISOString() : null })),
  });
}
