/**
 * Download WordPress Images Script
 *
 * Downloads all images from WordPress and saves them locally.
 * Updates MongoDB to use local image paths.
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const MONGODB_URI = process.env.MONGODB_URI || "";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images", "blog");

// Schema for blog posts
const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  featuredImage: String,
  category: String,
  tags: [String],
  author: String,
  status: String,
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String,
  readingTime: Number,
}, { timestamps: true });

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

// Download a single image
async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || url.startsWith("/")) {
      resolve(false);
      return;
    }

    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        fs.unlinkSync(filepath);
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(true);
      });
    }).on("error", () => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      resolve(false);
    });
  });
}

// Extract filename from URL
function getFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return path.basename(pathname);
  } catch {
    return "";
  }
}

// Extract all image URLs from HTML content
function extractImageUrls(content: string): string[] {
  const regex = /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)/gi;
  const matches = content.match(regex) || [];
  return [...new Set(matches)];
}

async function downloadAllImages() {
  console.log("🚀 Starting image download...\n");

  // Create images directory
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.log(`📁 Created directory: ${IMAGES_DIR}\n`);
  }

  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Get all blog posts
  const posts = await BlogPost.find({});
  console.log(`📊 Found ${posts.length} posts to process\n`);

  const downloadedImages = new Map<string, string>();
  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const post of posts) {
    console.log(`\n📝 Processing: ${post.title?.substring(0, 50)}...`);

    // Collect all image URLs from this post
    const imageUrls: string[] = [];

    // Featured image
    if (post.featuredImage && post.featuredImage.startsWith("http")) {
      imageUrls.push(post.featuredImage);
    }

    // Images in content
    if (post.content) {
      const contentImages = extractImageUrls(post.content);
      imageUrls.push(...contentImages);
    }

    // Download each image
    for (const imageUrl of imageUrls) {
      // Skip if already downloaded
      if (downloadedImages.has(imageUrl)) {
        continue;
      }

      const filename = getFilename(imageUrl);
      if (!filename) {
        continue;
      }

      // Create unique filename with timestamp to avoid collisions
      const ext = path.extname(filename);
      const base = path.basename(filename, ext);
      const uniqueFilename = `${base}-${Date.now()}${ext}`;
      const localPath = path.join(IMAGES_DIR, uniqueFilename);
      const publicPath = `/images/blog/${uniqueFilename}`;

      // Check if already exists locally
      if (fs.existsSync(localPath)) {
        downloadedImages.set(imageUrl, publicPath);
        totalSkipped++;
        continue;
      }

      // Download
      const success = await downloadImage(imageUrl, localPath);
      if (success) {
        downloadedImages.set(imageUrl, publicPath);
        totalDownloaded++;
        console.log(`   ✅ Downloaded: ${filename}`);
      } else {
        totalFailed++;
        console.log(`   ❌ Failed: ${filename}`);
      }

      // Small delay to be nice to the server
      await new Promise(r => setTimeout(r, 100));
    }

    // Update post with local image paths
    let updatedContent = post.content || "";
    let updatedFeaturedImage = post.featuredImage || "";

    for (const [originalUrl, localPath] of downloadedImages) {
      if (updatedFeaturedImage === originalUrl) {
        updatedFeaturedImage = localPath;
      }
      updatedContent = updatedContent.split(originalUrl).join(localPath);
    }

    // Save updated post
    if (updatedContent !== post.content || updatedFeaturedImage !== post.featuredImage) {
      await BlogPost.updateOne(
        { _id: post._id },
        {
          $set: {
            content: updatedContent,
            featuredImage: updatedFeaturedImage
          }
        }
      );
    }
  }

  console.log("\n\n📈 Download Summary:");
  console.log(`   Downloaded: ${totalDownloaded}`);
  console.log(`   Skipped (cached): ${totalSkipped}`);
  console.log(`   Failed: ${totalFailed}`);
  console.log(`   Total unique images: ${downloadedImages.size}`);

  await mongoose.disconnect();
  console.log("\n✅ Image download completed!");
}

downloadAllImages().catch(console.error);
