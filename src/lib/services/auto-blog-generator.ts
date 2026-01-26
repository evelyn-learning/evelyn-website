// Auto Blog Generator Service
// Intelligently decides all parameters and generates blog posts automatically

import Anthropic from "@anthropic-ai/sdk";
import { connectDB } from "@/lib/db";
import { AutoBlogSettings, IAutoBlogSettings, RecentGeneration } from "@/models/AutoBlogSettings";
import { BlogPost } from "@/models/BlogPost";
import { generateBlogPost } from "./blog-generator";
import { generateAndSaveBlogImage } from "./image-service";
import {
  BlogCategory,
  BlogTone,
  BlogLength,
  TargetMarket,
  ImageStyle,
  BLOG_CATEGORIES,
  GeneratedBlogPost,
} from "@/types/blog-generator";
import { getAIContext, KNOWLEDGE_BASE } from "./knowledge-base";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// All available options
const ALL_CATEGORIES = BLOG_CATEGORIES;
const ALL_MARKETS: TargetMarket[] = ["k12", "higher-ed", "corporate", "publishers", "general"];
const ALL_TONES: BlogTone[] = ["professional", "educational", "engaging", "thought-leadership"];
const ALL_LENGTHS: BlogLength[] = ["short", "medium", "long"];
const ALL_IMAGE_STYLES: ImageStyle[] = ["professional", "illustrative", "abstract"];

// Cron expressions for interval types
export const INTERVAL_CRON_EXPRESSIONS: Record<string, string> = {
  hourly: "0 * * * *",
  daily: "0 9 * * *", // 9 AM daily
  every2days: "0 9 */2 * *", // 9 AM every 2 days
  every3days: "0 9 */3 * *", // 9 AM every 3 days
  weekly: "0 9 * * 1", // 9 AM every Monday
};

// Interface for AI-decided parameters
interface AutoBlogParameters {
  topic: string;
  category: BlogCategory;
  targetMarket: TargetMarket;
  tone: BlogTone;
  length: BlogLength;
  keywords: string[];
  imageStyle: ImageStyle;
  reasoning: string;
}

// Get or create settings (singleton pattern)
export async function getAutoSettings(): Promise<IAutoBlogSettings> {
  await connectDB();

  let settings = await AutoBlogSettings.findOne();

  if (!settings) {
    settings = await AutoBlogSettings.create({
      enabled: false,
      intervalType: "daily",
      autoPublish: false,
      recentGenerations: [],
      maxRecentToTrack: 10,
      totalGenerated: 0,
    });
  }

  return settings;
}

// Update settings
export async function updateAutoSettings(
  updates: Partial<IAutoBlogSettings>
): Promise<IAutoBlogSettings> {
  await connectDB();

  const settings = await getAutoSettings();

  Object.assign(settings, updates);
  await settings.save();

  return settings;
}

// Get recent topics from both auto-generations and published posts
async function getRecentTopics(limit: number = 20): Promise<string[]> {
  await connectDB();

  // Get from settings
  const settings = await getAutoSettings();
  const autoTopics = settings.recentGenerations.map((r) => r.topic);

  // Get from published posts
  const recentPosts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("title")
    .lean();

  const publishedTopics = recentPosts.map((p) => p.title);

  // Combine and dedupe
  return [...new Set([...autoTopics, ...publishedTopics])].slice(0, limit);
}

// Use AI to decide the best parameters for the next blog post
async function decideParameters(
  settings: IAutoBlogSettings
): Promise<AutoBlogParameters> {
  const recentGenerations = settings.recentGenerations || [];
  const recentTopics = await getRecentTopics(20);

  // Build context about recent activity
  const recentCategoriesUsed = recentGenerations.slice(0, 5).map((r) => r.category);
  const recentMarketsUsed = recentGenerations.slice(0, 5).map((r) => r.targetMarket);
  const recentTonesUsed = recentGenerations.slice(0, 5).map((r) => r.tone);

  // Determine available options (use preferences if set, otherwise all)
  const availableCategories = settings.preferredCategories?.length
    ? settings.preferredCategories
    : ALL_CATEGORIES;
  const availableMarkets = settings.preferredMarkets?.length
    ? settings.preferredMarkets
    : ALL_MARKETS;
  const availableTones = settings.preferredTones?.length
    ? settings.preferredTones
    : ALL_TONES;
  const availableLengths = settings.preferredLength
    ? [settings.preferredLength]
    : ALL_LENGTHS;
  const availableImageStyles = settings.preferredImageStyle
    ? [settings.preferredImageStyle]
    : ALL_IMAGE_STYLES;

  const companyContext = getAIContext();

  const prompt = `You are a content strategist for Evelyn Learning, deciding what blog post to generate next.

## Company Context
${companyContext}

## Available Options
Categories: ${availableCategories.join(", ")}
Target Markets: ${availableMarkets.join(", ")}
Tones: ${availableTones.join(", ")}
Lengths: ${availableLengths.join(", ")}
Image Styles: ${availableImageStyles.join(", ")}

## Recent Activity (avoid repetition)
Recent categories used: ${recentCategoriesUsed.join(", ") || "none"}
Recent markets targeted: ${recentMarketsUsed.join(", ") || "none"}
Recent tones used: ${recentTonesUsed.join(", ") || "none"}

## Topics Already Covered (DO NOT repeat these or similar topics)
${recentTopics.slice(0, 15).map((t) => `- ${t}`).join("\n") || "No recent topics"}

## Your Task
Decide the parameters for the next blog post. Consider:
1. VARIETY: Choose different category, market, and tone from recent ones when possible
2. RELEVANCE: Pick a timely, valuable topic for the education industry
3. UNIQUENESS: The topic must be distinctly different from recent topics
4. SEO VALUE: Consider what topics people are searching for in education/EdTech

Respond with a JSON object:
{
  "topic": "A specific, compelling blog topic title",
  "category": "One of the available categories",
  "targetMarket": "One of the available markets",
  "tone": "One of the available tones",
  "length": "One of the available lengths",
  "keywords": ["3-5", "SEO", "keywords"],
  "imageStyle": "One of the available image styles",
  "reasoning": "Brief explanation of why you chose these parameters"
}

Important: Return ONLY valid JSON, no additional text.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in AI response");
  }

  let responseText = textContent.text.trim();

  // Clean up markdown code blocks if present
  if (responseText.startsWith("```json")) {
    responseText = responseText.slice(7);
  } else if (responseText.startsWith("```")) {
    responseText = responseText.slice(3);
  }
  if (responseText.endsWith("```")) {
    responseText = responseText.slice(0, -3);
  }
  responseText = responseText.trim();

  try {
    const params = JSON.parse(responseText) as AutoBlogParameters;

    // Validate and sanitize
    if (!availableCategories.includes(params.category as BlogCategory)) {
      params.category = availableCategories[0] as BlogCategory;
    }
    if (!availableMarkets.includes(params.targetMarket)) {
      params.targetMarket = availableMarkets[0];
    }
    if (!availableTones.includes(params.tone)) {
      params.tone = availableTones[0];
    }
    if (!availableLengths.includes(params.length)) {
      params.length = availableLengths[0];
    }
    if (!availableImageStyles.includes(params.imageStyle)) {
      params.imageStyle = availableImageStyles[0];
    }

    return params;
  } catch (error) {
    console.error("Failed to parse AI parameters:", responseText);
    throw new Error("Failed to parse AI-decided parameters");
  }
}

// Record a generation in the history
async function recordGeneration(
  settings: IAutoBlogSettings,
  params: AutoBlogParameters
): Promise<void> {
  const newGeneration: RecentGeneration = {
    category: params.category,
    targetMarket: params.targetMarket,
    topic: params.topic,
    tone: params.tone,
    generatedAt: new Date(),
  };

  // Add to front of array
  settings.recentGenerations.unshift(newGeneration);

  // Trim to max
  if (settings.recentGenerations.length > settings.maxRecentToTrack) {
    settings.recentGenerations = settings.recentGenerations.slice(
      0,
      settings.maxRecentToTrack
    );
  }

  settings.totalGenerated += 1;
  settings.lastGeneratedAt = new Date();
  settings.lastError = undefined;

  await settings.save();
}

// Main function: Generate a blog post automatically
export async function generateAutoBlogPost(): Promise<{
  success: boolean;
  post?: GeneratedBlogPost;
  params?: AutoBlogParameters;
  published?: boolean;
  error?: string;
}> {
  try {
    await connectDB();

    const settings = await getAutoSettings();

    if (!settings.enabled) {
      return { success: false, error: "Auto blog generation is disabled" };
    }

    console.log("[Auto Blog] Starting automatic blog generation...");

    // Step 1: AI decides parameters
    console.log("[Auto Blog] AI deciding parameters...");
    const params = await decideParameters(settings);
    console.log(`[Auto Blog] Parameters decided:`, {
      topic: params.topic,
      category: params.category,
      targetMarket: params.targetMarket,
      tone: params.tone,
    });

    // Step 2: Generate the blog post
    console.log("[Auto Blog] Generating blog content...");
    const generatedPost = await generateBlogPost({
      topic: params.topic,
      category: params.category,
      targetMarket: params.targetMarket,
      tone: params.tone,
      length: params.length,
      aiProvider: "claude",
      keywords: params.keywords,
      includeProductMention: true,
    });

    // Step 3: Generate featured image
    console.log("[Auto Blog] Generating featured image...");
    try {
      const imageResult = await generateAndSaveBlogImage(
        generatedPost.title,
        generatedPost.content,
        params.imageStyle
      );
      generatedPost.featuredImage = imageResult.localUrl;
      console.log("[Auto Blog] Image generated:", imageResult.localUrl);
    } catch (imgError) {
      console.error("[Auto Blog] Image generation failed:", imgError);
      // Continue without image
    }

    // Step 4: Publish or save as draft
    let published = false;
    if (settings.autoPublish) {
      console.log("[Auto Blog] Publishing post...");

      // Check for slug uniqueness
      let slug = generatedPost.slug;
      const existingPost = await BlogPost.findOne({ slug });
      if (existingPost) {
        slug = `${slug}-${Date.now()}`;
      }

      await BlogPost.create({
        title: generatedPost.title,
        slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        featuredImage: generatedPost.featuredImage,
        category: generatedPost.category,
        tags: generatedPost.tags,
        author: generatedPost.author,
        status: "published",
        publishedAt: new Date(),
        metaTitle: generatedPost.metaTitle,
        metaDescription: generatedPost.metaDescription,
        readingTime: generatedPost.readingTime,
      });

      published = true;
      console.log("[Auto Blog] Post published:", slug);
    } else {
      console.log("[Auto Blog] Saving as draft...");

      let slug = generatedPost.slug;
      const existingPost = await BlogPost.findOne({ slug });
      if (existingPost) {
        slug = `${slug}-${Date.now()}`;
      }

      await BlogPost.create({
        title: generatedPost.title,
        slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        featuredImage: generatedPost.featuredImage,
        category: generatedPost.category,
        tags: generatedPost.tags,
        author: generatedPost.author,
        status: "draft",
        metaTitle: generatedPost.metaTitle,
        metaDescription: generatedPost.metaDescription,
        readingTime: generatedPost.readingTime,
      });

      console.log("[Auto Blog] Draft saved:", slug);
    }

    // Step 5: Record this generation
    await recordGeneration(settings, params);

    console.log("[Auto Blog] Generation complete!");

    return {
      success: true,
      post: generatedPost,
      params,
      published,
    };
  } catch (error) {
    console.error("[Auto Blog] Generation failed:", error);

    // Record the error
    try {
      const settings = await getAutoSettings();
      settings.lastError = error instanceof Error ? error.message : "Unknown error";
      await settings.save();
    } catch (e) {
      console.error("[Auto Blog] Failed to save error:", e);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get the cron expression for current settings
export function getCronExpression(settings: IAutoBlogSettings): string {
  if (settings.intervalType === "custom" && settings.customCronExpression) {
    return settings.customCronExpression;
  }
  return INTERVAL_CRON_EXPRESSIONS[settings.intervalType] || INTERVAL_CRON_EXPRESSIONS.daily;
}
