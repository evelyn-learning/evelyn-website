// src/lib/outreach/research/worker.ts
// Cron worker for lead-research jobs. Structure mirrors
// src/lib/outreach/reply-watcher.ts — including the globalThis state rule
// (instrumentation.ts and route handlers load SEPARATE module instances;
// see reply-watcher.ts:12-26 for the incident writeup).
import cron, { ScheduledTask } from "node-cron";
import { connectDB } from "@core/db";
import { ResearchJob } from "@/models/ResearchJob";
import { processJob } from "./pipeline";
import { realCallModel } from "./claude";

interface WorkerState {
  isWorkerRunning: boolean;
  workerTask: ScheduledTask | null;
  isJobInProgress: boolean;
}

const WORKER_STATE_KEY = Symbol.for("evelyn.outreach.researchWorkerState");

// Lease window for a "running" job. processJob renews claimedAt on every
// candidate (a heartbeat), so this only needs to cover the gap left by a
// crashed/restarted process — not a full job's duration. Kept well above
// one candidate's worst case of ~2-3 min.
const LEASE_MS = 10 * 60 * 1000;

function workerState(): WorkerState {
  const g = globalThis as unknown as Record<symbol, WorkerState | undefined>;
  if (!g[WORKER_STATE_KEY]) {
    g[WORKER_STATE_KEY] = { isWorkerRunning: false, workerTask: null, isJobInProgress: false };
  }
  return g[WORKER_STATE_KEY];
}

// Claim and run at most one job. A "running" job with no in-process run is
// a crash leftover — resume it before touching the queue.
// claimedAt is a LEASE_MS lease, heartbeat-renewed by processJob on every
// candidate: a running job is only re-claimable once the lease has expired,
// so two processes never resume the same job concurrently.
export async function runResearchTick(): Promise<{ ran: boolean; jobId?: string }> {
  const st = workerState();
  if (st.isJobInProgress) return { ran: false };
  st.isJobInProgress = true;
  try {
    await connectDB();
    // Atomically claim a stale running job (expired lease) or a queued job
    let job = await ResearchJob.findOneAndUpdate(
      {
        $or: [
          {
            status: "running",
            $or: [
              { claimedAt: null },
              { claimedAt: { $lt: new Date(Date.now() - LEASE_MS) } }
            ]
          },
          { status: "queued" }
        ]
      },
      { $set: { status: "running", claimedAt: new Date() } },
      { sort: { createdAt: 1 }, new: true }
    );
    if (!job) return { ran: false };
    console.log(`[Research Worker] Processing job ${job._id}`);
    await processJob(String(job._id), { call: realCallModel() });
    return { ran: true, jobId: String(job._id) };
  } catch (e) {
    console.error("[Research Worker] tick error:", e);
    return { ran: false };
  } finally {
    st.isJobInProgress = false;
  }
}

export function startResearchWorker(cronExpression: string = "* * * * *"): void {
  const st = workerState();
  if (st.isWorkerRunning) {
    console.log("[Research Worker] Already running");
    return;
  }
  if (!cron.validate(cronExpression)) {
    console.error(`[Research Worker] Invalid cron expression: ${cronExpression}`);
    return;
  }
  st.workerTask = cron.schedule(cronExpression, async () => {
    const r = await runResearchTick();
    if (r.ran) console.log(`[Research Worker] Finished job ${r.jobId}`);
  });
  st.isWorkerRunning = true;
  console.log(`[Research Worker] Started with schedule: ${cronExpression}`);
}

export function stopResearchWorker(): void {
  const st = workerState();
  if (st.workerTask) {
    st.workerTask.stop();
    st.workerTask = null;
    st.isWorkerRunning = false;
    console.log("[Research Worker] Stopped");
  }
}

export function isResearchWorkerActive(): boolean {
  return workerState().isWorkerRunning;
}
