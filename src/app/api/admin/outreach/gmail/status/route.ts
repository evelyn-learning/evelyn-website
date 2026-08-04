import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { OutreachToken } from "@/models";
import { getOutreachAccount } from "@/lib/outreach/gmail";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const account = getOutreachAccount();
  const doc = await OutreachToken.findOne({ account }).lean();

  return NextResponse.json({ connected: !!doc, account });
}
