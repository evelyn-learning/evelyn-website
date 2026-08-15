/**
 * Fix duplicate blog cover images
 *
 * Finds posts sharing the same Unsplash image and regenerates unique ones.
 * Uses post-specific keywords to ensure variety.
 *
 * Usage: npx tsx scripts/fix-duplicate-blog-images.ts [--dry-run]
 */

import "dotenv/config";
import { config } from "dotenv";
import path from "path";

// Load .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://evelyn:EvelynDB_7493Learn@127.0.0.1:2710/evelyn?replicaSet=rs0&authSource=evelyn";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Posts that need new images — keep first in each group, replace rest
// Each entry has a unique keyword set tailored to the specific post topic
const POSTS_TO_FIX = [
  // GROUP 1: Keep "Data Privacy Revolution (FERPA)" — replace 4:
  {
    slug: "the-rise-of-ai-proctoring-how-remote-exam-monitoring-is-transforming-academic-integrity-and-student-privacy-in-the-digital-age",
    keywords: "exam proctoring remote testing computer webcam",
    style: "professional" as const,
  },
  {
    slug: "the-neuroscience-of-learning-how-brain-based-research-is-revolutionizing-ai-powered-educational-technology-design",
    keywords: "brain neuroscience neural network science research",
    style: "abstract" as const,
  },
  {
    slug: "the-student-mental-health-emergency-how-ai-powered-early-warning-systems-are-saving-lives-through-learning-analytics",
    keywords: "mental health wellness student support counseling",
    style: "illustrative" as const,
  },
  {
    slug: "the-data-privacy-revolution-how-ferpa-gdpr-and-student-data-protection-are-reshaping-edtech-procurement-and-implementation",
    keywords: "data privacy security lock shield protection digital",
    style: "professional" as const,
  },
  // GROUP 2: Keep "Mental Health Crisis in Higher Ed" — replace 4:
  {
    slug: "the-personalized-learning-plateau-why-73-of-adaptive-learning-implementations-fail-to-improve-student-outcomes-and-how-next-generation-ai-is-breaking-through",
    keywords: "personalized learning adaptive student tablet education",
    style: "illustrative" as const,
  },
  {
    slug: "the-micro-credential-revolution-how-digital-badges-are-transforming-higher-educations-value-equation",
    keywords: "digital badge certificate credential achievement award",
    style: "professional" as const,
  },
  {
    slug: "the-hidden-cost-of-edtech-sprawl-how-k-12-districts-are-drowning-in-unused-software-and-what-it-leaders-can-do-about-it",
    keywords: "software applications cluttered desktop screens overwhelm",
    style: "professional" as const,
  },
  {
    slug: "the-remote-learning-report-card-3-years-later-what-data-reveals-about-edtechs-permanent-impact-on-k-12-education",
    keywords: "remote learning video call laptop home children",
    style: "illustrative" as const,
  },
  // GROUP 3: Keep "Assessment Innovation Crisis" — replace 2:
  {
    slug: "the-edtech-data-privacy-crisis-how-student-information-is-being-monetized-and-what-schools-must-do-now",
    keywords: "data monetization surveillance privacy breach hacker",
    style: "abstract" as const,
  },
  {
    slug: "the-partnership-puzzle-why-89-of-school-industry-collaborations-fail-and-how-ai-powered-workforce-alignment-is-creating-sustainable-career-pathways",
    keywords: "business handshake partnership collaboration teamwork",
    style: "professional" as const,
  },
  // GROUP 4: Keep "Gamification Revolution" — replace 1:
  {
    slug: "the-rise-of-micro-learning-why-5-minute-learning-modules-are-revolutionizing-corporate-training",
    keywords: "microlearning mobile phone quick lesson timer five minutes",
    style: "illustrative" as const,
  },
  // GROUP 5: Keep "Hidden Costs of EdTech" — replace 1:
  {
    slug: "the-neuroscience-of-learning-how-ai-powered-adaptive-systems-match-human-brain-patterns-to-optimize-student-retention",
    keywords: "brain scan MRI neural pathways cognitive memory",
    style: "abstract" as const,
  },
  // GROUP 6: Keep "Assessment Revolution" — replace 1:
  {
    slug: "the-great-resignation-meets-education-how-ai-powered-tools-are-attracting-and-retaining-top-teaching-talent",
    keywords: "teacher recruitment hiring retention classroom empty desk",
    style: "professional" as const,
  },
];

interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: { regular: string };
  user: { name: string; username: string };
  links: { download_location: string };
}

async function searchUnsplash(query: string): Promise<UnsplashPhoto | null> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "15");
  url.searchParams.set("order_by", "relevant");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });

  if (!res.ok) {
    console.error(`  Unsplash error: ${res.status} ${await res.text()}`);
    return null;
  }

  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;

  // Pick random from results to avoid getting the same top result
  const idx = Math.floor(Math.random() * Math.min(data.results.length, 10));
  const photo = data.results[idx];

  // Trigger download event (Unsplash TOS compliance)
  await fetch(`${photo.links.download_location}?client_id=${UNSPLASH_ACCESS_KEY}`).catch(() => {});

  return photo;
}

async function uploadToCloudinary(imageUrl: string, slug: string): Promise<string> {
  const safeSlug = slug.slice(0, 50).replace(/[^a-z0-9-]/g, "-");
  const publicId = `blog/${safeSlug}-${Date.now()}`;

  const result = await cloudinary.uploader.upload(imageUrl, {
    public_id: publicId,
    folder: "evelyn-blog",
    resource_type: "image",
    format: "png",
  });

  return result.secure_url;
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  if (!UNSPLASH_ACCESS_KEY) {
    console.error("Missing UNSPLASH_ACCESS_KEY");
    process.exit(1);
  }

  console.log(`\n=== Fix Duplicate Blog Images ${isDryRun ? "(DRY RUN)" : ""} ===\n`);
  console.log(`Posts to fix: ${POSTS_TO_FIX.length}\n`);

  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB\n");

  const db = mongoose.connection.db!;
  const collection = db.collection("blogposts");

  let fixed = 0;
  let failed = 0;

  for (const post of POSTS_TO_FIX) {
    console.log(`Processing: ${post.slug.slice(0, 70)}...`);
    console.log(`  Keywords: ${post.keywords}`);
    console.log(`  Style: ${post.style}`);

    // Find the post
    const doc = await collection.findOne({ slug: post.slug });
    if (!doc) {
      console.log(`  SKIP: Post not found\n`);
      failed++;
      continue;
    }

    console.log(`  Current image: ${doc.featuredImage?.slice(0, 80)}...`);

    if (isDryRun) {
      console.log(`  DRY RUN: Would search Unsplash and update\n`);
      continue;
    }

    // Search Unsplash with unique keywords
    const photo = await searchUnsplash(post.keywords);
    if (!photo) {
      console.log(`  FAIL: No Unsplash results\n`);
      failed++;
      continue;
    }

    console.log(`  Found: "${photo.alt_description || 'untitled'}" by ${photo.user.name}`);

    // Upload to Cloudinary
    const newUrl = await uploadToCloudinary(photo.urls.regular, post.slug);
    console.log(`  Uploaded: ${newUrl.slice(0, 80)}...`);

    // Update MongoDB
    await collection.updateOne(
      { slug: post.slug },
      { $set: { featuredImage: newUrl } }
    );

    console.log(`  UPDATED!\n`);
    fixed++;

    // Rate limit: wait 1s between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== Done ===`);
  console.log(`Fixed: ${fixed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped (dry run): ${isDryRun ? POSTS_TO_FIX.length : 0}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
