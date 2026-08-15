/**
 * WordPress to MongoDB Migration Script
 *
 * This script fetches content from WordPress REST API and imports it into MongoDB.
 *
 * Usage:
 * 1. Set environment variables (MONGODB_URI, WP_BASE_URL)
 * 2. Run: npx ts-node scripts/migrate-wordpress.ts
 */

import mongoose from "mongoose";
import axios from "axios";

// Configuration
const WP_BASE_URL = "https://www.evelynlearning.com/wp-json/wp/v2";
const MONGODB_URI = process.env.MONGODB_URI || "";

// Schemas (inline for standalone script)
const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  featuredImage: String,
  category: String,
  tags: [String],
  author: { type: String, default: "Evelyn Learning" },
  status: { type: String, default: "published" },
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String,
  readingTime: { type: Number, default: 5 },
}, { timestamps: true });

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

// Helper function to strip HTML tags (loops until all tags removed to prevent injection)
function stripHtml(html: string): string {
  let result = html;
  let previous = "";
  // Loop until no more tags are found (prevents incomplete sanitization)
  while (result !== previous) {
    previous = result;
    result = result.replace(/<[^>]*>/g, "");
  }
  return result.trim();
}

// Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = stripHtml(content).split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Fetch all posts from WordPress
async function fetchWPPosts(page = 1, perPage = 100): Promise<any[]> {
  try {
    const response = await axios.get(`${WP_BASE_URL}/posts`, {
      params: {
        page,
        per_page: perPage,
        _embed: true, // Include featured images and categories
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      return []; // No more pages
    }
    throw error;
  }
}

// Fetch all categories
async function fetchWPCategories(): Promise<Map<number, string>> {
  const categories = new Map<number, string>();
  try {
    const response = await axios.get(`${WP_BASE_URL}/categories`, {
      params: { per_page: 100 },
    });
    for (const cat of response.data) {
      categories.set(cat.id, cat.name);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
  return categories;
}

// Main migration function
async function migrateBlogs() {
  console.log("🚀 Starting WordPress migration...\n");

  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Fetch categories first
  const categories = await fetchWPCategories();
  console.log(`📁 Found ${categories.size} categories\n`);

  // Fetch all posts
  let allPosts: any[] = [];
  let page = 1;
  let hasMore = true;

  console.log("📰 Fetching posts from WordPress...");
  while (hasMore) {
    const posts = await fetchWPPosts(page);
    if (posts.length === 0) {
      hasMore = false;
    } else {
      allPosts = allPosts.concat(posts);
      console.log(`   Page ${page}: ${posts.length} posts`);
      page++;
    }
  }

  console.log(`\n📊 Total posts to migrate: ${allPosts.length}\n`);

  // Migrate each post
  let migrated = 0;
  let skipped = 0;

  for (const wpPost of allPosts) {
    try {
      // Check if already exists
      const existing = await BlogPost.findOne({ slug: wpPost.slug });
      if (existing) {
        skipped++;
        continue;
      }

      // Get featured image
      let featuredImage = "";
      if (wpPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
        featuredImage = wpPost._embedded["wp:featuredmedia"][0].source_url;
      }

      // Get category
      let category = "Education";
      if (wpPost.categories?.[0]) {
        category = categories.get(wpPost.categories[0]) || "Education";
      }

      // Get tags
      const tags: string[] = [];
      if (wpPost._embedded?.["wp:term"]?.[1]) {
        for (const tag of wpPost._embedded["wp:term"][1]) {
          tags.push(tag.name);
        }
      }

      // Create blog post
      const blogPost = new BlogPost({
        title: wpPost.title.rendered,
        slug: wpPost.slug,
        excerpt: stripHtml(wpPost.excerpt.rendered).substring(0, 300),
        content: wpPost.content.rendered,
        featuredImage,
        category,
        tags,
        author: "Evelyn Learning",
        status: "published",
        publishedAt: new Date(wpPost.date),
        metaTitle: wpPost.title.rendered,
        metaDescription: stripHtml(wpPost.excerpt.rendered).substring(0, 160),
        readingTime: calculateReadingTime(wpPost.content.rendered),
      });

      await blogPost.save();
      migrated++;
      console.log(`✅ Migrated: ${wpPost.title.rendered.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Error migrating post ${wpPost.slug}:`, error);
    }
  }

  console.log("\n📈 Migration Summary:");
  console.log(`   Migrated: ${migrated}`);
  console.log(`   Skipped (already exists): ${skipped}`);
  console.log(`   Total: ${allPosts.length}`);

  await mongoose.disconnect();
  console.log("\n✅ Migration completed!");
}

// Run migration
migrateBlogs().catch(console.error);
