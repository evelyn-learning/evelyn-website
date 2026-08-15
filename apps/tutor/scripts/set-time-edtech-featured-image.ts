/**
 * Set featuredImage on the TIME Top EdTech 2026 blog post.
 *
 * RUN ORDER: deploy first (so /blog-images/time-top-edtech-2026.svg
 * is live), THEN run this script. Otherwise the homepage card will
 * broken-image for ~60s while pointing at a missing asset.
 *
 * Usage: npx ts-node -r dotenv/config scripts/set-time-edtech-featured-image.ts dotenv_config_path=.env.local
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = "evelyn-learning-time-top-edtech-2026";
const IMAGE_PATH = "/blog-images/time-top-edtech-2026.svg";

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set.");
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

async function main() {
  await mongoose.connect(MONGODB_URI!);

  const result = await BlogPost.findOneAndUpdate(
    { slug: SLUG },
    { $set: { featuredImage: IMAGE_PATH } },
    { new: true }
  );

  if (!result) {
    console.error(`No post found with slug: ${SLUG}`);
    process.exit(1);
  }

  console.log("Set featuredImage:");
  console.log(`  _id:           ${result._id}`);
  console.log(`  slug:          ${result.get("slug")}`);
  console.log(`  featuredImage: ${result.get("featuredImage")}`);
  console.log("");
  console.log("Cache will refresh within 60s (per export const revalidate = 60).");
  console.log("To force-refresh now: ssh root@84.247.185.169 'pm2 restart evelyn-website'");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
