/**
 * Add the PageVault hyperlink (https://pagevault.us/) to the
 * TIME Top EdTech 2026 blog post. Idempotent.
 *
 * Usage: npx ts-node -r dotenv/config scripts/link-pagevault-blog.ts dotenv_config_path=.env.local
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = "evelyn-learning-time-top-edtech-2026";

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set.");
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

const OLD = `**PageVault** — secure content management and digital delivery for education`;
const NEW = `**<a href="https://pagevault.us/" target="_blank" rel="noopener noreferrer">PageVault</a>** — secure content management and digital delivery for education`;

async function main() {
  await mongoose.connect(MONGODB_URI!);

  const post = await BlogPost.findOne({ slug: SLUG });
  if (!post) {
    console.error(`No post found with slug: ${SLUG}`);
    process.exit(1);
  }

  const content = (post.get("content") as string) || "";
  if (content.includes(NEW)) {
    console.log("PageVault already linked. Nothing to do.");
    await mongoose.disconnect();
    return;
  }
  if (!content.includes(OLD)) {
    console.error("Could not find the PageVault bullet in current content. Aborting.");
    process.exit(1);
  }

  const updated = content.replace(OLD, NEW);
  post.set("content", updated);
  await post.save();

  console.log("Updated PageVault bullet to include link.");
  console.log(`  _id:    ${post._id}`);
  console.log(`  slug:   ${post.get("slug")}`);
  console.log(`  status: ${post.get("status")}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
