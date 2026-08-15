/**
 * Flip the TIME Top EdTech 2026 blog post from draft to published.
 *
 * Idempotent.
 *
 * Usage: npx ts-node -r dotenv/config scripts/publish-time-edtech-blog.ts dotenv_config_path=.env.local
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = "evelyn-learning-time-top-edtech-2026";

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set.");
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema(
  { slug: String, status: String, publishedAt: Date },
  { timestamps: true, strict: false }
);
const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

async function main() {
  await mongoose.connect(MONGODB_URI!);
  const result = await BlogPost.findOneAndUpdate(
    { slug: SLUG },
    { $set: { status: "published", publishedAt: new Date("2026-04-22T00:00:00.000Z") } },
    { new: true }
  );
  if (!result) {
    console.error(`No post found with slug: ${SLUG}`);
    process.exit(1);
  }
  console.log("Published:");
  console.log(`  _id:         ${result._id}`);
  console.log(`  slug:        ${result.slug}`);
  console.log(`  status:      ${result.status}`);
  console.log(`  publishedAt: ${result.publishedAt?.toISOString()}`);
  console.log(`  Live at:     /blog/${result.slug}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
