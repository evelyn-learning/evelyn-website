/**
 * Insert the TIME Top EdTech 2026 announcement blog post.
 *
 * Idempotent: upserts by slug, so re-running updates content in place.
 * Inserts as status="draft". Flip to "published" via /admin/blog/<id>.
 *
 * Usage: npx ts-node -r dotenv/config scripts/seed-time-edtech-blog.ts dotenv_config_path=.env.local
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set. Run with: -r dotenv/config dotenv_config_path=.env.local");
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    featuredImage: String,
    quickAnswer: String,
    category: String,
    tags: [String],
    author: { type: String, default: "Evelyn Learning" },
    status: { type: String, default: "draft" },
    publishedAt: Date,
    metaTitle: String,
    metaDescription: String,
    readingTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

const SLUG = "evelyn-learning-time-top-edtech-2026";

const CONTENT = `We're proud to share that Evelyn Learning has been ranked **#9 out of 250** in the 2026 edition of [TIME's America's Top EdTech Companies](https://time.com/article/2026/04/22/america-top-edtech-companies-2026/), published by TIME in partnership with Statista.

Our top-10 placement puts us alongside Duolingo, Coursera, Grammarly (now Superhuman), ClassDojo, and Udemy — names that have shaped the last decade of education technology.

## The top 10

| Rank | Company | Headquarters | Score |
| ---: | --- | --- | ---: |
| 1 | Duolingo | Pennsylvania | 95.5 |
| 2 | Coursera | California | 91.6 |
| 3 | Superhuman (formerly Grammarly) | California | 88.6 |
| 4 | ClassDojo | California | 88.1 |
| 5 | Udemy | California | 87.3 |
| 6 | Class Technologies | District of Columbia | 87.0 |
| 7 | Frontline | Pennsylvania | 86.7 |
| 8 | Learneo | California | 86.6 |
| **9** | **Evelyn Learning** | **California** | **86.0** |
| 10 | Age of Learning | California | 85.7 |

*Source: TIME & Statista, America's Top EdTech Companies 2026 (published April 22, 2026).*

## What the recognition is

Each year, TIME and Statista conduct one of the most rigorous evaluations of the education technology industry. For the 2026 U.S. list, they analyzed 250 leading EdTech companies using a weighted score based on two dimensions: **financial strength (70%)** and **industry impact (30%)**, measured across product reach, innovation, and educational outcomes.

Evelyn's final score was **86.0 out of 100**, placing us 9th in the country and putting Evelyn in the top 4% of companies evaluated.

Being recognized at this level is a meaningful validation of the work our team has put in over more than a decade.

## What this means to us

When Evelyn Learning was founded in 2013, we made an unusual bet: that the future of education wouldn't be won by the best AI company or by the best content company — but by the one that could do both, deeply.

That bet shaped everything. It's why every person we hire has taught before; why our AI essay scorer doesn't just mark papers, it gives rubric-aligned feedback a teacher would give; why our adaptive learning engines are built on pedagogical frameworks, not just engagement loops.

Being recognized by TIME — and placed among the top 10 EdTech companies in America — validates a simple idea we've been saying for years:

> AI in education only works when it's trained by teachers, designed for educators, and measured by learning outcomes — not engagement metrics.

## Who made this happen

This recognition belongs to:

- **Our 1,000+ subject matter experts and educators** — the people whose pedagogical rigor becomes the training data, the rubrics, and the instructional design behind every product we ship. Teacher DNA isn't a tagline; it's a hiring requirement.
- **Our clients** — publishers, test-prep companies, tutoring businesses, and EdTech platforms who trusted us with their learners and pushed us to build products that actually work in real classrooms. You are the reason 86% of students using Evelyn-developed content report improved scores on standardized tests.
- **Our engineering and AI team** — who proved that world-class AI and deep educational expertise aren't trade-offs. They compound.

## What we're building

Our top-10 placement reflects the products our clients rely on every day — our flagship AI suite:

- **[AI Voice Tutor](/products/voice-tutor)** — natural, conversational AI tutoring built on pedagogical frameworks
- **[Virtual Lab Simulations](/products/virtual-labs)** — interactive, browser-based science and engineering labs
- **[Plagiarism & AI Detection](/products/plagiarism-detection)** — originality and AI-generated content detection for an AI-native classroom
- **[Essay Scoring & Feedback](/products/essay-ai)** — rubric-aligned, teacher-calibrated essay assessment at scale
- **<a href="https://pagevault.us/" target="_blank" rel="noopener noreferrer">PageVault</a>** — secure content management and digital delivery for education

Each of these was built the same way: with educators in the room from day one.

## What's next

Recognition is a milestone, not a destination. A few things we're focused on:

- Expanding our white-label AI product suite so more EdTech platforms can ship outcomes-driven AI without building from scratch
- Deeper partnerships with publishers and test-prep providers adapting to an AI-native learning landscape
- Continued investment in the one thing that matters — measurable learning outcomes

If you're a publisher, an EdTech platform, or an organization rethinking how AI fits into your learning products, **[we'd love to talk →](/contact)**

---

*Evelyn Learning is a California-based AI-powered learning solutions company. Since 2013, we've partnered with publishers, test-prep companies, and EdTech platforms to develop educational content and deploy AI solutions — built by teachers, engineered for outcomes. [Read the full press announcement →](/press/time-top-edtech-2026)*
`;

const POST = {
  title:
    "Evelyn Learning Ranked #9 in TIME's America's Top EdTech Companies of 2026",
  slug: SLUG,
  excerpt:
    "Evelyn Learning has been ranked #9 of 250 in TIME's America's Top EdTech Companies of 2026 — placing us in the top 10 alongside Duolingo, Coursera, Grammarly, Udemy, and ClassDojo.",
  content: CONTENT,
  category: "Industry News",
  tags: ["TIME", "Statista", "Recognition", "EdTech", "AI in Education", "Awards"],
  author: "Evelyn Learning",
  status: "draft" as const,
  publishedAt: new Date("2026-04-22T00:00:00.000Z"),
  metaTitle:
    "Evelyn Learning Ranked #9 in TIME's America's Top EdTech Companies of 2026",
  metaDescription:
    "Evelyn Learning has been ranked #9 of 250 in TIME's America's Top EdTech Companies of 2026 — top 10 alongside Duolingo, Coursera, Grammarly, Udemy, and ClassDojo.",
  readingTime: 4,
};

async function main() {
  const host = MONGODB_URI!.replace(/.*@/, "").replace(/\/.*/, "");
  console.log(`Connecting to MongoDB at ${host} ...`);
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected.");

  const result = await BlogPost.findOneAndUpdate(
    { slug: SLUG },
    { $set: POST },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("");
  console.log("Upserted blog post:");
  console.log(`  _id:      ${result._id}`);
  console.log(`  slug:     ${result.slug}`);
  console.log(`  status:   ${result.status}`);
  console.log(`  category: ${result.category}`);
  console.log(`  publishedAt: ${result.publishedAt?.toISOString()}`);
  console.log("");
  console.log(`Review at: /admin/blog/${result._id}`);
  console.log(`When published, will live at: /blog/${result.slug}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
