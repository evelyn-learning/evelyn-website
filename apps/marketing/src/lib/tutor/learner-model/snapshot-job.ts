// Learner Snapshot Job
// Nightly freeze of every student's per-LO estimate into LearnerStateSnapshot
// rows — the trend-history substrate `trendOf`
// (src/lib/tutor/learner-model/estimator.ts, Task 9) reads at request time
// to compute the 14-day-ago comparison. Structure mirrors
// src/lib/outreach/reply-watcher.ts.

import cron, { ScheduledTask } from 'node-cron';
import connectDB from '@core/db';
import { LearnerStateProjectionModel, LearnerStateSnapshotModel } from '@/models';

// Scheduler state lives on globalThis, NOT in module scope.
//
// Next compiles instrumentation.ts into a different server bundle from the
// route handlers, so `import('@/lib/tutor/learner-model/snapshot-job')` from
// instrumentation and any future `import ... from
// "@/lib/tutor/learner-model/snapshot-job"` elsewhere resolve to two
// SEPARATE module instances with two separate copies of any module-level
// `let`. With plain module scope the cron started by instrumentation would
// set its own copy while another context reading the same "is it running"
// flag would always see its own, never-started copy — same failure shape as
// the outreach reply watcher, whose console chip reported "Watcher off"
// while the cron was demonstrably running (observed on prod 2026-08-05, see
// that file's header for the full story).
//
// globalThis is per-process, so both bundles share one record. Same
// reasoning as the mongoose connection cache in src/lib/db.ts.
interface SnapshotJobState {
  isJobRunning: boolean;
  jobTask: ScheduledTask | null;
  isSnapshotInProgress: boolean;
}

const SNAPSHOT_JOB_STATE_KEY = Symbol.for('evelyn.learnerModel.snapshotJobState');

function snapshotJobState(): SnapshotJobState {
  const g = globalThis as unknown as Record<symbol, SnapshotJobState | undefined>;
  if (!g[SNAPSHOT_JOB_STATE_KEY]) {
    g[SNAPSHOT_JOB_STATE_KEY] = {
      isJobRunning: false,
      jobTask: null,
      isSnapshotInProgress: false,
    };
  }
  return g[SNAPSHOT_JOB_STATE_KEY];
}

export interface SnapshotRunStats {
  studentsSnapshotted: number;
  errors: number;
}

/** UTC 'YYYY-MM-DD' for `now` — the snapshot's `date` key. */
function dateKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

// Freeze every student's per-LO estimate into one LearnerStateSnapshot row,
// dated `YYYY-MM-DD` (UTC) for `now`. Reads the current
// LearnerStateProjectionModel rows (one row per (student, LO) already
// reflects the latest estimate — see store.ts's recomputeProjection) and
// groups them by studentId; `trial:` students are skipped (appendEvidence
// never writes projections for them in the first place, so this is
// belt-and-braces — the read path treats it as a hard rule, not an
// incidental consequence). Upserts on the unique {studentId, date} pair
// (LearnerStateSnapshot's index — see that model's header on why _id stays a
// plain ObjectId instead of a composite key), so a second run on the same
// day overwrites the same doc rather than duplicating it.
export async function runLearnerSnapshot(now: Date): Promise<SnapshotRunStats> {
  const stats: SnapshotRunStats = { studentsSnapshotted: 0, errors: 0 };

  const st = snapshotJobState();
  if (st.isSnapshotInProgress) {
    console.log('[Learner Snapshot] Snapshot already in progress, skipping this tick');
    return stats;
  }
  st.isSnapshotInProgress = true;

  try {
    await connectDB();

    const date = dateKey(now);
    const projections = await LearnerStateProjectionModel.find({}).lean();

    const byStudent = new Map<string, Array<{ loId: string; estimate: number }>>();
    for (const p of projections) {
      if (p.studentId.startsWith('trial:')) continue;
      if (p.estimate == null) continue;
      const list = byStudent.get(p.studentId) ?? [];
      list.push({ loId: p.loId, estimate: p.estimate });
      byStudent.set(p.studentId, list);
    }

    for (const [studentId, los] of byStudent) {
      try {
        await LearnerStateSnapshotModel.findOneAndUpdate(
          { studentId, date },
          { $set: { studentId, date, los }, $setOnInsert: { createdAt: now, schemaVersion: 1 } },
          { upsert: true },
        );
        stats.studentsSnapshotted++;
      } catch (e) {
        stats.errors++;
        console.error(`[Learner Snapshot] student ${studentId} error:`, e);
      }
    }
  } catch (error) {
    console.error('[Learner Snapshot] Error running snapshot:', error);
  } finally {
    st.isSnapshotInProgress = false;
  }

  return stats;
}

// Start the learner snapshot job
export function startLearnerSnapshotJob(cronExpression: string = '30 3 * * *'): void {
  const st = snapshotJobState();
  if (st.isJobRunning) {
    console.log('[Learner Snapshot] Job is already running');
    return;
  }

  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    console.error(`[Learner Snapshot] Invalid cron expression: ${cronExpression}`);
    return;
  }

  st.jobTask = cron.schedule(cronExpression, async () => {
    console.log(`[Learner Snapshot] Running scheduled snapshot at ${new Date().toISOString()}`);
    const stats = await runLearnerSnapshot(new Date());
    console.log(
      `[Learner Snapshot] Completed: ${stats.studentsSnapshotted} students snapshotted, ${stats.errors} errors`
    );
  });

  st.isJobRunning = true;
  console.log(`[Learner Snapshot] Started with schedule: ${cronExpression}`);
}

// Stop the learner snapshot job
export function stopLearnerSnapshotJob(): void {
  const st = snapshotJobState();
  if (st.jobTask) {
    st.jobTask.stop();
    st.jobTask = null;
    st.isJobRunning = false;
    console.log('[Learner Snapshot] Stopped');
  }
}

// Check job status
export function isLearnerSnapshotJobActive(): boolean {
  return snapshotJobState().isJobRunning;
}
