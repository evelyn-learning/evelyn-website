// Reply Watcher Service
// Polls Gmail threads already recorded on leads (never the wider inbox) for
// inbound replies, and flips the lead to "replied" when one is found.
// Structure mirrors src/lib/services/blog-scheduler.ts.

import cron, { ScheduledTask } from "node-cron";
import { connectDB } from "@/lib/db";
import { Lead, type ITouch } from "@/models";
import { getThreadMessages, getOutreachAccount } from "./gmail";
import { findInboundReply } from "./reply-detect";

// Scheduler state lives on globalThis, NOT in module scope.
//
// Next compiles instrumentation.ts into a different server bundle from the
// route handlers, so `import('@/lib/outreach/reply-watcher')` from
// instrumentation and `import ... from "@/lib/outreach/reply-watcher"` in
// src/app/api/admin/outreach/watcher/route.ts resolve to two SEPARATE module
// instances with two separate copies of any module-level `let`. With plain
// module scope the cron started by instrumentation set its own copy, while the
// route read a copy that was always null — so the console's chip reported
// "Watcher off" while the cron was demonstrably running every 15 minutes
// (observed on prod 2026-08-05), and the overlap guard could not see a run
// started by the other context.
//
// globalThis is per-process, so both bundles share one record. Same reasoning
// as the mongoose connection cache in src/lib/db.ts.
interface WatcherState {
  isWatcherRunning: boolean;
  watcherTask: ScheduledTask | null;
  isCheckInProgress: boolean;
}

const WATCHER_STATE_KEY = Symbol.for("evelyn.outreach.replyWatcherState");

function watcherState(): WatcherState {
  const g = globalThis as unknown as Record<symbol, WatcherState | undefined>;
  if (!g[WATCHER_STATE_KEY]) {
    g[WATCHER_STATE_KEY] = {
      isWatcherRunning: false,
      watcherTask: null,
      isCheckInProgress: false,
    };
  }
  return g[WATCHER_STATE_KEY];
}

export interface ReplyCheckStats {
  checkedThreads: number;
  repliesFound: number;
  errors: number;
}

// Check all leads with recorded Gmail threads for inbound replies.
// ONLY polls thread IDs already recorded on a lead — never lists or
// searches the wider inbox. "parked" leads are included: a lead can still
// reply late to the breakup email.
export async function runReplyCheck(): Promise<ReplyCheckStats> {
  const stats: ReplyCheckStats = { checkedThreads: 0, repliesFound: 0, errors: 0 };

  const st = watcherState();
  if (st.isCheckInProgress) {
    console.log("[Reply Watcher] Check already in progress, skipping this tick");
    return stats;
  }
  st.isCheckInProgress = true;

  try {
    await connectDB();

    const leads = await Lead.find({
      status: { $in: ["contacted", "parked"] },
      gmailThreadIds: { $exists: true, $ne: [] },
    });

    const self = getOutreachAccount();

    for (const lead of leads) {
      for (const threadId of lead.gmailThreadIds) {
        try {
          stats.checkedThreads++;
          const messages = await getThreadMessages(threadId);
          const known = new Set(
            lead.touches.map((t: ITouch) => t.gmailMessageId).filter(Boolean)
          );
          const reply = findInboundReply(
            messages.filter((m) => !known.has(m.id)),
            self
          );
          if (reply) {
            lead.status = "replied";
            lead.nextActionAt = null;
            lead.touches.push({
              at: new Date(),
              channel: "email",
              direction: "inbound",
              summary: `Reply from ${reply.from}: ${reply.snippet.slice(0, 140)}`,
              gmailMessageId: reply.gmailMessageId,
            });
            await lead.save();
            stats.repliesFound++;
            break; // this lead is done; stop scanning its other threads
          }
        } catch (e) {
          if (e instanceof Error && e.message === "GMAIL_NOT_CONNECTED") {
            console.error("[Reply Watcher] GMAIL_NOT_CONNECTED — skipping remaining threads");
            return stats;
          }
          stats.errors++;
          console.error(`[Reply Watcher] thread ${threadId} error:`, e);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === "GMAIL_NOT_CONNECTED") {
      console.error("[Reply Watcher] GMAIL_NOT_CONNECTED — skipping this run");
    } else {
      console.error("[Reply Watcher] Error running reply check:", error);
    }
  } finally {
    st.isCheckInProgress = false;
  }

  return stats;
}

// Start the reply watcher
export function startReplyWatcher(cronExpression: string = "*/15 * * * *"): void {
  const st = watcherState();
  if (st.isWatcherRunning) {
    console.log("[Reply Watcher] Watcher is already running");
    return;
  }

  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    console.error(`[Reply Watcher] Invalid cron expression: ${cronExpression}`);
    return;
  }

  st.watcherTask = cron.schedule(cronExpression, async () => {
    console.log(`[Reply Watcher] Running scheduled check at ${new Date().toISOString()}`);
    const stats = await runReplyCheck();
    if (stats.checkedThreads > 0 || stats.errors > 0) {
      console.log(
        `[Reply Watcher] Completed: ${stats.checkedThreads} checked, ${stats.repliesFound} replies found, ${stats.errors} errors`
      );
    }
  });

  st.isWatcherRunning = true;
  console.log(`[Reply Watcher] Started with schedule: ${cronExpression}`);
}

// Stop the reply watcher
export function stopReplyWatcher(): void {
  const st = watcherState();
  if (st.watcherTask) {
    st.watcherTask.stop();
    st.watcherTask = null;
    st.isWatcherRunning = false;
    console.log("[Reply Watcher] Stopped");
  }
}

// Check watcher status
export function isReplyWatcherActive(): boolean {
  return watcherState().isWatcherRunning;
}
