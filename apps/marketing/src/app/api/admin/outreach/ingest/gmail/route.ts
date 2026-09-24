import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isAllowedAccount } from "@/lib/outreach/gmail";
import { GmailRateLimitError, ingestGmailPage, sentQuery } from "@/lib/crm/gmail-ingest";

// Only takes effect on a serverless host (Vercel etc.); this app runs under
// pm2/next start, where the effective request timeout is the nginx proxy's
// read timeout instead. Left in place in case the deployment target changes.
export const maxDuration = 300;

const bodySchema = z.object({
  account: z.string().email(),
  days: z.number().int().min(1).max(3650).optional(),
  query: z.string().max(500).optional(),
  pageToken: z.string().optional(),
  dryRun: z.boolean().optional(),
  // Round 2 §2: open product list — validated for shape, not membership.
  product: z.string().trim().max(60).optional(),
});

// POST - import one page (≤25 threads) of a mailbox's sent folder into leads.
// Dry-run by default: the UI loops on nextPageToken and shows counts/samples
// before the operator runs it for real.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body", issues: parsed.error.issues }, { status: 400 });
  const b = parsed.data;
  if (!isAllowedAccount(b.account)) return NextResponse.json({ error: "Account not allowed" }, { status: 400 });
  try {
    const result = await ingestGmailPage({
      account: b.account.toLowerCase(), query: b.query ?? sentQuery(b.days ?? 365), pageToken: b.pageToken,
      dryRun: b.dryRun ?? true, origin: "gmail_import", product: b.product,
    });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof GmailRateLimitError) {
      return NextResponse.json({ error: "Gmail rate limit — retry shortly", retryAfterMs: e.retryAfterMs }, { status: 429 });
    }
    const msg = e instanceof Error ? e.message : "ingest failed";
    const status = msg === "GMAIL_NOT_CONNECTED" ? 409 : 500;
    console.error("[CRM] gmail ingest error:", msg);
    return NextResponse.json({ error: msg }, { status });
  }
}
