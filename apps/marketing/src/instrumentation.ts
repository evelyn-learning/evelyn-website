/**
 * Next.js Instrumentation
 * This runs once when the server starts
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Server starting...');

    // Only start schedulers in production (set ENABLE_BLOG_SCHEDULER=true in production env)
    if (process.env.ENABLE_BLOG_SCHEDULER !== 'true') {
      console.log('[Instrumentation] Blog scheduler disabled (set ENABLE_BLOG_SCHEDULER=true to enable)');
    } else {
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

    // Reply watcher: polls Gmail threads already recorded on leads for
    // inbound replies (set ENABLE_OUTREACH_WATCHER=true in production env).
    // Independently gated from the blog scheduler above.
    if (process.env.ENABLE_OUTREACH_WATCHER === 'true') {
      setTimeout(async () => {
        try {
          const { startReplyWatcher } = await import('@/lib/outreach/reply-watcher');
          startReplyWatcher('*/15 * * * *');
        } catch (error) {
          // An uncaught throw here is an unhandled rejection inside a bare
          // setTimeout callback — Node's default terminates the process on
          // that, which puts pm2 into a restart loop. Same shape as the
          // blog-scheduler block above; log and move on instead.
          console.error('[Instrumentation] Failed to start outreach reply watcher:', error);
        }
      }, 5000); // 5 second delay for DB connection
    } else {
      console.log('[Instrumentation] Outreach reply watcher disabled (set ENABLE_OUTREACH_WATCHER=true to enable)');
    }

    // Lead-research worker: claims queued ResearchJobs and runs Claude-powered
    // lead research (set ENABLE_LEAD_RESEARCH=true in production env).
    if (process.env.ENABLE_LEAD_RESEARCH === 'true') {
      setTimeout(async () => {
        try {
          const { startResearchWorker } = await import('@/lib/outreach/research/worker');
          startResearchWorker('* * * * *');
        } catch (error) {
          // Same rule as the watcher block above: a throw here is an unhandled
          // rejection in a bare setTimeout — log, never crash the process.
          console.error('[Instrumentation] Failed to start lead-research worker:', error);
        }
      }, 5000);
    } else {
      console.log('[Instrumentation] Lead-research worker disabled (set ENABLE_LEAD_RESEARCH=true to enable)');
    }
  }
}
