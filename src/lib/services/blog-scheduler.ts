// Blog Scheduler Service
// Uses node-cron to automatically publish scheduled blog posts

import cron, { ScheduledTask } from "node-cron";
import { connectDB } from "@/lib/db";
import { BlogQueue, IBlogQueue } from "@/models/BlogQueue";
import { BlogPost } from "@/models/BlogPost";
import { slugify } from "@/lib/utils";

// Track scheduler state
let isSchedulerRunning = false;
let scheduledTask: ScheduledTask | null = null;

// Publish a single blog post from the queue
async function publishQueuedPost(queueItem: IBlogQueue): Promise<boolean> {
  try {
    const { generatedPost } = queueItem;

    // Generate unique slug if needed
    let slug = generatedPost.slug;
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create the blog post
    const blogPost = await BlogPost.create({
      title: generatedPost.title,
      slug,
      excerpt: generatedPost.excerpt,
      content: generatedPost.content,
      featuredImage: generatedPost.featuredImage,
      category: generatedPost.category,
      tags: generatedPost.tags,
      author: generatedPost.author || "Evelyn Learning",
      status: "published",
      publishedAt: new Date(),
      metaTitle: generatedPost.metaTitle,
      metaDescription: generatedPost.metaDescription,
      readingTime: generatedPost.readingTime,
    });

    // Update queue item status
    await BlogQueue.findByIdAndUpdate(queueItem._id, {
      status: "published",
      publishedAt: new Date(),
      publishedPostId: blogPost._id.toString(),
    });

    console.log(`[Blog Scheduler] Published: "${generatedPost.title}" (${slug})`);
    return true;
  } catch (error) {
    console.error(`[Blog Scheduler] Failed to publish "${queueItem.title}":`, error);

    // Update queue item with error
    await BlogQueue.findByIdAndUpdate(queueItem._id, {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return false;
  }
}

// Process all due posts in the queue
async function processBlogQueue(): Promise<{
  processed: number;
  published: number;
  failed: number;
}> {
  const stats = { processed: 0, published: 0, failed: 0 };

  try {
    await connectDB();

    // Find all pending posts that are due
    const now = new Date();
    const duePosts = await BlogQueue.find({
      status: "pending",
      scheduledFor: { $lte: now },
    }).sort({ scheduledFor: 1 });

    if (duePosts.length === 0) {
      return stats;
    }

    console.log(`[Blog Scheduler] Found ${duePosts.length} posts due for publishing`);

    for (const post of duePosts) {
      stats.processed++;
      const success = await publishQueuedPost(post);
      if (success) {
        stats.published++;
      } else {
        stats.failed++;
      }
    }
  } catch (error) {
    console.error("[Blog Scheduler] Error processing queue:", error);
  }

  return stats;
}

// Start the scheduler
export function startBlogScheduler(
  cronExpression: string = "0 * * * *" // Default: every hour
): void {
  if (isSchedulerRunning) {
    console.log("[Blog Scheduler] Scheduler is already running");
    return;
  }

  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    console.error(`[Blog Scheduler] Invalid cron expression: ${cronExpression}`);
    return;
  }

  scheduledTask = cron.schedule(cronExpression, async () => {
    console.log(`[Blog Scheduler] Running scheduled check at ${new Date().toISOString()}`);
    const stats = await processBlogQueue();
    if (stats.processed > 0) {
      console.log(
        `[Blog Scheduler] Completed: ${stats.published} published, ${stats.failed} failed`
      );
    }
  });

  isSchedulerRunning = true;
  console.log(`[Blog Scheduler] Started with schedule: ${cronExpression}`);
}

// Stop the scheduler
export function stopBlogScheduler(): void {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    isSchedulerRunning = false;
    console.log("[Blog Scheduler] Stopped");
  }
}

// Check scheduler status
export function isSchedulerActive(): boolean {
  return isSchedulerRunning;
}

// Manually trigger queue processing
export async function triggerQueueProcessing(): Promise<{
  processed: number;
  published: number;
  failed: number;
}> {
  console.log("[Blog Scheduler] Manual queue processing triggered");
  return processBlogQueue();
}

// Add a post to the queue
export async function addToQueue(
  title: string,
  generatedPost: IBlogQueue["generatedPost"],
  scheduledFor: Date
): Promise<IBlogQueue> {
  await connectDB();

  const queueItem = await BlogQueue.create({
    title,
    generatedPost,
    scheduledFor,
    status: "pending",
  });

  console.log(
    `[Blog Scheduler] Added to queue: "${title}" scheduled for ${scheduledFor.toISOString()}`
  );

  return queueItem;
}

// Get queue statistics
export async function getQueueStats(): Promise<{
  pending: number;
  published: number;
  failed: number;
  nextScheduled?: Date;
}> {
  await connectDB();

  const [pending, published, failed] = await Promise.all([
    BlogQueue.countDocuments({ status: "pending" }),
    BlogQueue.countDocuments({ status: "published" }),
    BlogQueue.countDocuments({ status: "failed" }),
  ]);

  // Get next scheduled post
  const nextPost = await BlogQueue.findOne({ status: "pending" })
    .sort({ scheduledFor: 1 })
    .select("scheduledFor");

  return {
    pending,
    published,
    failed,
    nextScheduled: nextPost?.scheduledFor,
  };
}

// Get all pending posts
export async function getPendingPosts(): Promise<IBlogQueue[]> {
  await connectDB();
  return BlogQueue.find({ status: "pending" }).sort({ scheduledFor: 1 });
}

// Update a scheduled post
export async function updateScheduledPost(
  id: string,
  updates: Partial<Pick<IBlogQueue, "scheduledFor" | "generatedPost" | "title">>
): Promise<IBlogQueue | null> {
  await connectDB();
  return BlogQueue.findByIdAndUpdate(id, updates, { new: true });
}

// Delete a scheduled post
export async function deleteScheduledPost(id: string): Promise<boolean> {
  await connectDB();
  const result = await BlogQueue.findByIdAndDelete(id);
  return !!result;
}

// Retry a failed post
export async function retryFailedPost(id: string): Promise<IBlogQueue | null> {
  await connectDB();
  return BlogQueue.findByIdAndUpdate(
    id,
    {
      status: "pending",
      error: null,
      scheduledFor: new Date(), // Retry immediately
    },
    { new: true }
  );
}

// Predefined cron schedules
export const CRON_SCHEDULES = {
  everyMinute: "* * * * *", // For testing
  everyHour: "0 * * * *",
  everyDay9AM: "0 9 * * *",
  everyDay12PM: "0 12 * * *",
  everyWeekdayMorning: "0 9 * * 1-5",
  twiceDaily: "0 9,15 * * *",
  mondayWednesdayFriday: "0 10 * * 1,3,5",
  weekly: "0 10 * * 1", // Every Monday at 10am
};

// ============================================
// AUTO BLOG GENERATOR SCHEDULER
// ============================================

import {
  generateAutoBlogPost,
  getAutoSettings,
  getCronExpression,
} from "./auto-blog-generator";

// Track auto-blog scheduler state separately
let isAutoBlogSchedulerRunning = false;
let autoBlogScheduledTask: ScheduledTask | null = null;

// Start the auto blog generator scheduler
export async function startAutoBlogScheduler(): Promise<{
  success: boolean;
  message: string;
  cronExpression?: string;
}> {
  try {
    const settings = await getAutoSettings();

    if (!settings.enabled) {
      return { success: false, message: "Auto blog generation is disabled" };
    }

    if (isAutoBlogSchedulerRunning) {
      // Stop existing scheduler before restarting
      stopAutoBlogScheduler();
    }

    const cronExpression = getCronExpression(settings);

    if (!cron.validate(cronExpression)) {
      return {
        success: false,
        message: `Invalid cron expression: ${cronExpression}`,
      };
    }

    autoBlogScheduledTask = cron.schedule(cronExpression, async () => {
      console.log(
        `[Auto Blog Scheduler] Running auto generation at ${new Date().toISOString()}`
      );

      // Re-check if still enabled before generating
      const currentSettings = await getAutoSettings();
      if (!currentSettings.enabled) {
        console.log("[Auto Blog Scheduler] Disabled, skipping generation");
        return;
      }

      const result = await generateAutoBlogPost();

      if (result.success) {
        console.log(
          `[Auto Blog Scheduler] Generated: "${result.post?.title}" (${
            result.published ? "published" : "draft"
          })`
        );
      } else {
        console.error(`[Auto Blog Scheduler] Failed: ${result.error}`);
      }
    });

    isAutoBlogSchedulerRunning = true;
    console.log(
      `[Auto Blog Scheduler] Started with schedule: ${cronExpression}`
    );

    return {
      success: true,
      message: `Auto blog scheduler started`,
      cronExpression,
    };
  } catch (error) {
    console.error("[Auto Blog Scheduler] Failed to start:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to start scheduler",
    };
  }
}

// Stop the auto blog scheduler
export function stopAutoBlogScheduler(): void {
  if (autoBlogScheduledTask) {
    autoBlogScheduledTask.stop();
    autoBlogScheduledTask = null;
    isAutoBlogSchedulerRunning = false;
    console.log("[Auto Blog Scheduler] Stopped");
  }
}

// Check if auto blog scheduler is running
export function isAutoBlogSchedulerActive(): boolean {
  return isAutoBlogSchedulerRunning;
}

// Manually trigger auto blog generation
export async function triggerAutoBlogGeneration(): Promise<{
  success: boolean;
  post?: {
    title: string;
    slug: string;
    category: string;
    targetMarket: string;
  };
  published?: boolean;
  error?: string;
}> {
  console.log("[Auto Blog] Manual generation triggered");

  const result = await generateAutoBlogPost();

  if (result.success && result.post) {
    return {
      success: true,
      post: {
        title: result.post.title,
        slug: result.post.slug,
        category: result.post.category,
        targetMarket: result.params?.targetMarket || "general",
      },
      published: result.published,
    };
  }

  return {
    success: false,
    error: result.error,
  };
}
