import { getFullThread, httpStatusOf } from "@/lib/outreach/gmail";
import { listThreadIds } from "./gmail-list";
import type { Product, TouchOrigin } from "@/lib/outreach/enums";
import { classifyThread, type SkipReason } from "./gmail-classify";
import { upsertLeadWithTouches } from "./upsert-lead";

// The Gmail API's per-user "Units per minute per user" quota is shared by
// every caller of this account's token: a paged CRM import (~25-50
// `threads.get` calls a page) and the reply-watcher cron (`threads.get` per
// tracked thread, every ~15 min) both draw from it. A burst — several import
// pages back-to-back, or an import overlapping a watcher tick — can exhaust
// it mid-page; observed live as page 3's `threads.list` throwing and the
// whole import aborting. `isRateLimitError` recognizes that failure shape so
// callers can back off and retry instead of treating it as a permanent
// per-thread error.
export class GmailRateLimitError extends Error {
  retryAfterMs = 60_000;
  constructor(message = "Gmail rate limit exceeded", options?: ErrorOptions) {
    super(message, options);
    this.name = "GmailRateLimitError";
  }
}

function reasonsOf(err: unknown): string {
  if (!err || typeof err !== "object") return "";
  const e = err as { message?: string; errors?: { reason?: string }[]; response?: { data?: { error?: { message?: string; errors?: { reason?: string }[] } } } };
  const parts: string[] = [];
  if (e.message) parts.push(e.message);
  for (const r of e.errors ?? []) if (r.reason) parts.push(r.reason);
  const nested = e.response?.data?.error;
  if (nested?.message) parts.push(nested.message);
  for (const r of nested?.errors ?? []) if (r.reason) parts.push(r.reason);
  return parts.join(" ");
}

export function isRateLimitError(err: unknown): boolean {
  const status = httpStatusOf(err);
  if (status === 429) return true;
  if (status === 403) {
    return /rateLimitExceeded|userRateLimitExceeded|quotaExceeded|Quota exceeded|rate limit exceeded/i.test(reasonsOf(err));
  }
  return false;
}

const defaultSleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Per-thread fetch retry: up to 4 attempts total on a rate-limit error, with
// exponential backoff (1s, 2s, 4s — the last attempt doesn't wait, since
// there's no 5th try to make) plus a little jitter so a burst of retrying
// pages doesn't re-collide on the same tick. A non-rate-limit error keeps
// today's one-shot behaviour: the caller counts it in `errors` and moves on.
const MAX_THREAD_ATTEMPTS = 4;
async function getFullThreadWithRetry(deps: IngestGmailDeps, threadId: string, account: string) {
  for (let attempt = 1; attempt <= MAX_THREAD_ATTEMPTS; attempt++) {
    try {
      return await deps.getFullThread(threadId, account);
    } catch (e) {
      if (!isRateLimitError(e) || attempt === MAX_THREAD_ATTEMPTS) throw e;
      const backoffMs = 2 ** (attempt - 1) * 1000; // 1000, 2000, 4000
      const jitter = Math.floor(Math.random() * 250);
      await deps.sleep(backoffMs + jitter);
    }
  }
  // Unreachable: the loop above always either returns or throws.
  throw new Error("unreachable");
}

// `listThreadIds` (the page-level `threads.list` call) gets a narrower
// retry: this is what died mid-import live, so one retry after a fixed 2s
// wait is enough to ride out a short burst without stalling the operator's
// UI for a full exponential run. A second failure means the quota is
// genuinely exhausted for now — surface `GmailRateLimitError` so the route
// can tell the UI to back off and retry the whole page later.
async function listThreadIdsWithRetry(deps: IngestGmailDeps, account: string, query: string, pageToken?: string) {
  try {
    return await deps.listThreadIds(account, query, pageToken);
  } catch (e) {
    if (!isRateLimitError(e)) throw e;
    await deps.sleep(2000);
    try {
      return await deps.listThreadIds(account, query, pageToken);
    } catch (e2) {
      if (!isRateLimitError(e2)) throw e2;
      throw new GmailRateLimitError(undefined, { cause: e2 });
    }
  }
}

export interface IngestPageResult {
  nextPageToken?: string;
  scanned: number; kept: number; created: number; updated: number; suppressed: number; touchesAdded: number; errors: number;
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
  sleep: (ms: number) => Promise<void>;
}

const defaultDeps: IngestGmailDeps = { listThreadIds, getFullThread, upsert: upsertLeadWithTouches, sleep: defaultSleep };

export async function ingestGmailPage(
  args: {
    account: string; query: string; pageToken?: string; dryRun: boolean; origin: Extract<TouchOrigin, "gmail_import" | "gmail_label">; product?: Product;
  },
  deps: IngestGmailDeps = defaultDeps
): Promise<IngestPageResult> {
  const out: IngestPageResult = {
    scanned: 0, kept: 0, created: 0, updated: 0, suppressed: 0, touchesAdded: 0, errors: 0,
    skipped: { auto_reply_only: 0, self_notification: 0, internal: 0, machine: 0, empty: 0 }, samples: [],
  };
  const { ids, nextPageToken } = await listThreadIdsWithRetry(deps, args.account, args.query, args.pageToken);
  out.nextPageToken = nextPageToken;

  for (let i = 0; i < ids.length; i++) {
    const threadId = ids[i];
    out.scanned++;
    // Pace consecutive per-thread fetches against the shared per-user
    // quota (also drawn on by the reply-watcher cron); skip the wait before
    // the very first fetch of the page.
    if (i > 0) await deps.sleep(120);
    let verdict;
    let subject = "";
    try {
      const msgs = await getFullThreadWithRetry(deps, threadId, args.account);
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
      gmailThreadIds: [threadId],
    });
    if (r.suppressed) out.suppressed++;
    else if (r.created) out.created++;
    else out.updated++;
    out.touchesAdded += r.added;
  }
  return out;
}
