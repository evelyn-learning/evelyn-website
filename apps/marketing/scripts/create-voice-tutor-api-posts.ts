// One-off (2026-11-24): insert three hand-written blog posts about the Voice
// Tutor API as DRAFTS, from the Markdown files in content-drafts/2026-11-24/.
// The Markdown file is the single source: front matter gives the fields, the
// rest is BlogPost.content.
//
// DRY RUN unless --write. Reads only in dry run.
//
// Usage (from apps/marketing; MONGODB_URI decides which database, and the
// laptop tunnel 127.0.0.1:2710 is PRODUCTION):
//   MONGODB_URI=... npx tsx scripts/create-voice-tutor-api-posts.ts                    # dry run: prints each post's fields
//   MONGODB_URI=... npx tsx scripts/create-voice-tutor-api-posts.ts --write            # insert the three drafts
//   MONGODB_URI=... npx tsx scripts/create-voice-tutor-api-posts.ts --publish <slug>   # dry run of publishing one draft
//   MONGODB_URI=... npx tsx scripts/create-voice-tutor-api-posts.ts --publish <slug> --write
//
// What it mirrors, and why:
// - Fields and defaults are the ones the auto-blog writer saves for a draft
//   (src/lib/services/auto-blog-generator.ts): title, slug, excerpt, content,
//   quickAnswer, category, tags, author "Evelyn Learning", status "draft",
//   metaTitle, metaDescription, readingTime, and no publishedAt.
// - slug = slugify(title) and readingTime = getReadingTime(content), the same
//   helpers the admin editor uses (@core/utils). The slug in the front matter
//   must equal slugify(title): the three posts link to each other by slug.
// - Unlike the admin editor and the writer, a slug that already exists is
//   REFUSED, not suffixed with a timestamp: a suffixed slug would break those
//   links. One refusal stops the run before anything is inserted.
// - ctaProduct "voice-tutor" makes the voice-tutor CTA box show under the post
//   (src/app/blog/[slug]/page.tsx). Beacon normally sets that field.
// - No featuredImage: the writer generates and uploads one, and this script
//   uploads nothing. Add one in the admin editor before publishing if wanted;
//   the pages render without it.
// - --publish does what the admin editor's save does when status goes from
//   draft to published: status "published" and publishedAt = now (Mongoose
//   bumps updatedAt). The editor also calls revalidatePath for "/", "/blog"
//   and the post; a script cannot. The post page and the homepage revalidate
//   every 60 seconds and the sitemap is dynamic, so the post shows within
//   about a minute. Publish all three together: they link to each other, and a
//   link to an unpublished post is a 404.
import fs from "node:fs";
import path from "node:path";
import { connectDB } from "@core/db";
import { slugify, getReadingTime } from "@core/utils";
import { BlogPost } from "@/models";
import { BLOG_CATEGORIES } from "@/types/blog-generator";
import { isCtaProduct } from "@/lib/blog/beacon-flags";

const DRAFTS_DIR = path.resolve(__dirname, "../content-drafts/2026-11-24");
const FILES = [
  "01-ai-tutor-api-embed-with-one-signed-link.md",
  "02-ai-voice-tutor-api-pricing-worked-through.md",
  "03-build-vs-buy-voice-tutor-with-whiteboard.md",
];

interface Draft {
  file: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  quickAnswer: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft";
  metaTitle: string;
  metaDescription: string;
  readingTime: number;
  ctaProduct: string;
}

/** Front matter is `key: value` lines between the first two `---` lines. */
function readDraft(file: string): Draft {
  const raw = fs.readFileSync(path.join(DRAFTS_DIR, file), "utf8");
  if (!raw.startsWith("---\n")) throw new Error(`${file}: no front matter`);
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) throw new Error(`${file}: front matter not closed`);
  const meta: Record<string, string> = {};
  for (const line of raw.slice(4, end).split("\n")) {
    const at = line.indexOf(": ");
    if (at === -1) throw new Error(`${file}: bad front matter line: ${line}`);
    meta[line.slice(0, at)] = line.slice(at + 2).trim();
  }
  const content = raw.slice(end + 5).trim() + "\n";
  const need = ["title", "slug", "excerpt", "quickAnswer", "category", "tags", "metaTitle", "metaDescription", "ctaProduct"];
  for (const key of need) if (!meta[key]) throw new Error(`${file}: front matter is missing "${key}"`);

  const problems: string[] = [];
  if (slugify(meta.title) !== meta.slug) problems.push(`slug "${meta.slug}" is not slugify(title) "${slugify(meta.title)}"`);
  if (!(BLOG_CATEGORIES as readonly string[]).includes(meta.category)) problems.push(`category "${meta.category}" is not one of the blog's categories`);
  if (!isCtaProduct(meta.ctaProduct)) problems.push(`ctaProduct "${meta.ctaProduct}" is not valid`);
  // The page renders the title itself and strips a leading H1; the blog's posts carry none.
  if (/^# /m.test(content.replace(/```[\s\S]*?```/g, ""))) problems.push("content has an H1");
  // The blog's rule for new copy: no em or en dashes.
  if (/[–—]/.test(content + meta.excerpt + meta.quickAnswer + meta.metaDescription)) problems.push("contains an em or en dash");
  if (problems.length) throw new Error(`${file}: ${problems.join("; ")}`);

  return {
    file,
    title: meta.title,
    slug: meta.slug,
    excerpt: meta.excerpt,
    content,
    quickAnswer: meta.quickAnswer,
    category: meta.category,
    tags: meta.tags.split(",").map((t) => t.trim()).filter(Boolean),
    author: "Evelyn Learning",
    status: "draft",
    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription,
    readingTime: getReadingTime(content),
    ctaProduct: meta.ctaProduct,
  };
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

/** Links in the body: internal blog links must point at a post that exists (or one of these drafts). */
function blogLinks(content: string): string[] {
  return [...content.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((m) => m[1]);
}

const write = process.argv.includes("--write");
const publishSlug = argValue("--publish");

async function publish(slug: string, drafts: Draft[]) {
  if (!drafts.some((d) => d.slug === slug)) {
    console.log(`REFUSED: "${slug}" is not one of this script's three posts.`);
    process.exit(1);
  }
  const post = await BlogPost.findOne({ slug }).lean<{ _id: unknown; title: string; status: string; publishedAt?: Date; featuredImage?: string; content: string }>();
  if (!post) {
    console.log(`REFUSED: no post with slug "${slug}". Insert the drafts first (--write).`);
    process.exit(1);
  }
  if (post.status === "published") {
    console.log(`Nothing to do: "${slug}" is already published (publishedAt ${post.publishedAt ? new Date(post.publishedAt).toISOString() : "unset"}).`);
    process.exit(0);
  }
  console.log(`PUBLISH ${slug}`);
  console.log(`  title         ${post.title}`);
  console.log(`  status        ${post.status} -> published`);
  console.log(`  publishedAt   (unset) -> now`);
  console.log(`  featuredImage ${post.featuredImage || "(none; the pages render without it)"}`);
  for (const target of new Set(blogLinks(post.content))) {
    const other = await BlogPost.findOne({ slug: target }).select("status").lean<{ status: string }>();
    if (!other) console.log(`  WARNING: links to /blog/${target}, which does not exist`);
    else if (other.status !== "published") console.log(`  NOTE: links to /blog/${target}, which is still a draft (404 until it is published)`);
  }
  if (!write) {
    console.log("DRY RUN: nothing was written. Add --write to publish.");
    process.exit(0);
  }
  // Same change as the admin editor's save; the status condition keeps a second run from moving publishedAt.
  const result = await BlogPost.updateOne({ _id: post._id, status: "draft" }, { $set: { status: "published", publishedAt: new Date() } });
  console.log(result.modifiedCount === 1
    ? `PUBLISHED. Live at /blog/${slug} within about a minute (page revalidation is 60 seconds; no revalidatePath from a script).`
    : "Not changed: the post is no longer a draft.");
  process.exit(result.modifiedCount === 1 ? 0 : 1);
}

(async () => {
  const drafts = FILES.map(readDraft);
  const target = (process.env.MONGODB_URI || "").replace(/\/\/[^@/]*@/, "//<credentials>@");
  console.log(`Mode: ${write ? "WRITE" : "DRY RUN (nothing is written)"}`);
  console.log(`Database: ${target || "(MONGODB_URI not set)"}`);
  await connectDB();

  if (publishSlug) return publish(publishSlug, drafts);

  const refusals: string[] = [];
  const ownSlugs = new Set(drafts.map((d) => d.slug));
  for (const d of drafts) {
    console.log(`\n${"=".repeat(100)}\nFILE            ${d.file}`);
    const { content, file, ...fields } = d;
    void file;
    for (const [key, value] of Object.entries(fields)) {
      console.log(`${key.padEnd(15)} ${Array.isArray(value) ? value.join(" | ") : value}`);
    }
    const words = content.trim().split(/\s+/).length;
    const h2 = content.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3));
    console.log(`${"content".padEnd(15)} ${content.length} chars, ${words} words, ${h2.length} H2 headings`);
    h2.forEach((h) => console.log(`${"".padEnd(15)}   ## ${h}`));
    console.log(`${"lengths".padEnd(15)} metaTitle ${d.metaTitle.length}, metaDescription ${d.metaDescription.length}, excerpt ${d.excerpt.length}, quickAnswer ${d.quickAnswer.length}`);
    console.log(`${"not set".padEnd(15)} featuredImage, publishedAt, noindex, beaconLocked`);

    for (const linked of new Set(blogLinks(content))) {
      if (ownSlugs.has(linked)) continue;
      const other = await BlogPost.findOne({ slug: linked }).select("status").lean<{ status: string }>();
      if (!other || other.status !== "published") refusals.push(`${d.slug}: links to /blog/${linked}, which is ${other ? "not published" : "missing"}`);
    }
    const existing = await BlogPost.findOne({ slug: d.slug }).select("status").lean<{ status: string }>();
    if (existing) {
      refusals.push(`${d.slug}: a post with this slug already exists (${existing.status})`);
      console.log(`${"slug check".padEnd(15)} REFUSED: already exists (${existing.status})`);
    } else {
      console.log(`${"slug check".padEnd(15)} free`);
    }
  }

  console.log(`\n${"=".repeat(100)}`);
  if (refusals.length > 0) {
    console.log(`REFUSED, nothing inserted. ${refusals.length} problem(s):`);
    refusals.forEach((r) => console.log(`  - ${r}`));
    process.exit(1);
  }
  if (!write) {
    console.log(`DRY RUN complete: ${drafts.length} draft(s) would be inserted. Nothing was written.`);
    process.exit(0);
  }
  for (const d of drafts) {
    const { file, ...doc } = d;
    void file;
    const created = await BlogPost.create(doc);
    console.log(`inserted draft ${created.slug} (_id ${created._id})`);
  }
  console.log(`WRITE complete: ${drafts.length} draft(s) inserted. They are in /admin/blog as drafts and are not public.`);
  process.exit(0);
})().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
