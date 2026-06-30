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

    // Only start schedulers in production (set ENABLE_BLOG_SCHEDULER=true in production env)
    if (process.env.ENABLE_BLOG_SCHEDULER !== 'true') {
      console.log('[Instrumentation] Blog scheduler disabled (set ENABLE_BLOG_SCHEDULER=true to enable)');
      return;
    }

    // Delay scheduler start to ensure DB is ready
    setTimeout(async () => {
      try {
        // Dynamic import to avoid issues with edge runtime
        const { startAutoBlogScheduler, startBlogScheduler } = await import(
          '@/lib/services/blog-scheduler'
        );
        const { getAutoSettings } = await import(
          '@/lib/services/auto-blog-generator'
        );

        // Start the blog queue scheduler (processes scheduled posts)
        startBlogScheduler('0 * * * *'); // Every hour
        console.log('[Instrumentation] Blog queue scheduler started');

        // Check if auto-blog is enabled and start it
        const settings = await getAutoSettings();
        if (settings.enabled) {
          const result = await startAutoBlogScheduler();
          console.log('[Instrumentation] Auto-blog scheduler:', result.message);
        } else {
          console.log('[Instrumentation] Auto-blog is disabled');
        }
      } catch (error) {
        console.error('[Instrumentation] Failed to start schedulers:', error);
      }
    }, 5000); // 5 second delay for DB connection
  }
}
