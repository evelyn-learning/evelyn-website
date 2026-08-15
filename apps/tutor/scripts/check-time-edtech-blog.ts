/**
 * Verify the TIME blog post exists in the DB and is queryable
 * the same way the public page queries it.
 */
import mongoose from "mongoose";

const SLUG = "evelyn-learning-time-top-edtech-2026";
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("no uri"); process.exit(1); }

const BlogPostSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("DB:", mongoose.connection.name);
  console.log("Host:", mongoose.connection.host);

  const exact = await BlogPost.findOne({ slug: SLUG, status: "published" }).lean();
  console.log("\nfindOne({ slug, status: published }):", exact ? "FOUND" : "NOT FOUND");
  if (exact) {
    const e = exact as Record<string, unknown>;
    console.log("  _id:        ", e._id);
    console.log("  title:      ", e.title);
    console.log("  status:     ", e.status);
    console.log("  publishedAt:", e.publishedAt);
  }

  const drafts = await BlogPost.find({ slug: SLUG }).lean();
  console.log("\nAll docs with this slug:", drafts.length);
  drafts.forEach((d) => {
    const dd = d as Record<string, unknown>;
    console.log(`  status=${dd.status}  _id=${dd._id}`);
  });

  const totalPublished = await BlogPost.countDocuments({ status: "published" });
  console.log("\nTotal published posts in DB:", totalPublished);

  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
