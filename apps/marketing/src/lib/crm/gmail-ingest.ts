import { getFullThread } from "@/lib/outreach/gmail";
import { listThreadIds } from "./gmail-list";
import type { Product, TouchOrigin } from "@/lib/outreach/enums";
import { classifyThread, type SkipReason } from "./gmail-classify";
import { upsertLeadWithTouches } from "./upsert-lead";

export interface IngestPageResult {
  nextPageToken?: string;
  scanned: number; kept: number; created: number; updated: number; touchesAdded: number; errors: number;
  skipped: Record<SkipReason, number>;
  samples: { threadId: string; subject: string; participant: string; verdict: string }[];
}

export const sentQuery = (days: number) => `in:sent newer_than:${Math.max(1, Math.floor(days))}d`;
export const labelQuery = () => "label:CRM newer_than:3d";

// Real Gmail/Mongo calls are pulled behind `deps` (defaulting to the real
// implementations) so the scan/classify/tally loop can be unit-tested with
// fakes — this worktree's env points at production Mongo, so no test here
// may touch a real listThreadIds/getFullThread/upsertLeadWithTouches.
export interface IngestGmailDeps {
  listThreadIds: typeof listThreadIds;
  getFullThread: typeof getFullThread;
  upsert: typeof upsertLeadWithTouches;
}

const defaultDeps: IngestGmailDeps = { listThreadIds, getFullThread, upsert: upsertLeadWithTouches };

export async function ingestGmailPage(
  args: {
    account: string; query: string; pageToken?: string; dryRun: boolean; origin: Extract<TouchOrigin, "gmail_import" | "gmail_label">; product?: Product;
  },
  deps: IngestGmailDeps = defaultDeps
): Promise<IngestPageResult> {
  const out: IngestPageResult = {
    scanned: 0, kept: 0, created: 0, updated: 0, touchesAdded: 0, errors: 0,
    skipped: { auto_reply_only: 0, self_notification: 0, internal: 0, machine: 0, empty: 0 }, samples: [],
  };
  const { ids, nextPageToken } = await deps.listThreadIds(args.account, args.query, args.pageToken);
  out.nextPageToken = nextPageToken;

  for (const threadId of ids) {
    out.scanned++;
    let verdict;
    let subject = "";
    try {
      const msgs = await deps.getFullThread(threadId, args.account);
      subject = msgs[0]?.subject ?? "";
      verdict = classifyThread(msgs, args.account);
    } catch (e) {
      console.error(`[CRM] gmail ingest thread ${threadId} failed:`, e instanceof Error ? e.message : e);
      out.errors++;
      continue;
    }
    if (!verdict.keep) {
      out.skipped[verdict.reason]++;
      if (out.samples.length < 30) out.samples.push({ threadId, subject, participant: "", verdict: `skip:${verdict.reason}` });
      continue;
    }
    out.kept++;
    const participant = verdict.identity.email ?? "";
    if (out.samples.length < 30) out.samples.push({ threadId, subject, participant, verdict: verdict.flagReview ? "keep:review" : "keep" });
    if (args.dryRun) continue;
    const touches = verdict.touches.map((t) => ({ ...t, origin: args.origin }));
    const r = await deps.upsert({
      identity: verdict.identity, touches, source: `gmail:${args.account}`, flagReview: verdict.flagReview, product: args.product,
    });
    if (r.created) out.created++; else out.updated++;
    out.touchesAdded += r.added;
  }
  return out;
}
