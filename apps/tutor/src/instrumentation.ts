/**
 * Next.js Instrumentation
 * This runs once when the server starts
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting...');

    // Warm the tutor catalog index at boot so the first student doesn't wait on
    // the cold-build ("Loading catalog…"): the full-catalog DB read + cell
    // resolution happens here instead of on the first GET. Fire-and-forget,
    // slightly delayed for DB readiness; the route shares this memo, so a
    // request racing the warm-up just awaits the same in-flight build.
    setTimeout(() => {
      void import('@/lib/tutor/lesson-plan/plan-index-cache')
        .then(({ warmPlanIndex }) => warmPlanIndex())
        .catch((err) => console.warn('[Instrumentation] plan-index warm-up failed:', err));
    }, 3000);

    // Learner-model snapshot cron: nightly freeze of every student's per-LO
    // estimate into LearnerStateSnapshot rows, the trend-history substrate
    // the learner-state route reads at request time (set
    // ENABLE_LEARNER_MODEL_SNAPSHOT=true in production env). Independently
    // gated from the blocks above.
    if (process.env.ENABLE_LEARNER_MODEL_SNAPSHOT === 'true') {
      setTimeout(async () => {
        try {
          const { startLearnerSnapshotJob } = await import('@/lib/tutor/learner-model/snapshot-job');
          startLearnerSnapshotJob('30 3 * * *');
        } catch (error) {
          // An uncaught throw here is an unhandled rejection inside a bare
          // setTimeout callback — Node's default terminates the process on
          // that, which puts pm2 into a restart loop. Same shape as the
          // outreach-watcher block above; log and move on instead.
          console.error('[Instrumentation] Failed to start learner-model snapshot job:', error);
        }
      }, 5000); // 5 second delay for DB connection
    } else {
      console.log('[Instrumentation] Learner-model snapshot job disabled (set ENABLE_LEARNER_MODEL_SNAPSHOT=true to enable)');
    }
  }
}
