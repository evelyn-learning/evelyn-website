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
