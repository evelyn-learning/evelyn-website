import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { mongoLedger, monthKey, capForProvider } from "@/lib/outreach/enrich/ledger";
import { apolloProvider } from "@/lib/outreach/enrich/apollo";
import { hunterProvider } from "@/lib/outreach/enrich/hunter";
import { prospeoProvider } from "@/lib/outreach/enrich/prospeo";

const PROVIDERS = [apolloProvider, hunterProvider, prospeoProvider];

// GET - this month's credit usage/cap per enrichment vendor, for the
// console's usage meters.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const month = monthKey();

    const providers = await Promise.all(
      PROVIDERS.map(async (provider) => ({
        provider: provider.name,
        configured: provider.isConfigured(),
        used: await mongoLedger.getUsed(provider.name, month),
        cap: capForProvider(provider.name),
        month,
      }))
    );

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("[OUTREACH] enrich credits Error:", error);
    return NextResponse.json({ error: "Failed to load credit usage" }, { status: 500 });
  }
}
