// One-off (2026-11-24): add in-body links to the developer portal in four
// existing blog posts that talk about embedding, white-label or cost and had
// no link to it. The posts are Markdown in BlogPost.content.
//
// DRY RUN unless --write. Reads only in dry run.
//
// Usage (from apps/marketing; MONGODB_URI decides which database, and the
// laptop tunnel 127.0.0.1:2710 is PRODUCTION):
//   MONGODB_URI=... npx tsx scripts/add-portal-links-to-posts.ts                         # dry run, prints a diff
//   MONGODB_URI=... npx tsx scripts/add-portal-links-to-posts.ts --write --backup <dir>  # apply
//
// Safety, and why:
// - Each edit names the exact existing text ("before") and what replaces it
//   ("after"). It is refused unless "before" occurs exactly once, so an
//   edited post is never patched in the wrong place.
// - If "after" is already there the edit counts as applied and is skipped,
//   so a second run changes nothing.
// - --write needs --backup <dir>: the four original documents are saved there
//   as JSON before the first write.
// - Any refusal on any post stops the whole run before anything is written.
// - The write sets `content` only, and only if the content is still what was
//   read (so an edit made in the admin in between is not overwritten).
//   Mongoose timestamps bump `updatedAt`, the same as a save in the admin
//   editor (findByIdAndUpdate). That moves the post's sitemap <lastmod> and
//   its Article JSON-LD dateModified, which is right: the post did change.
//   No date is shown on the page from `updatedAt`.
// - Not done here, unlike the admin editor: readingTime is not recomputed
//   (each edit adds about 40 words) and no revalidatePath runs; the post page
//   revalidates itself every 60 seconds.
import fs from "node:fs";
import path from "node:path";
import { connectDB } from "@core/db";
import { BlogPost } from "@/models";

const DOCS = "https://tutor.evelynlearning.com/docs";
const SANDBOX = "https://tutor.evelynlearning.com/sandbox";
const PRICING = "https://tutor.evelynlearning.com/pricing";

interface Edit {
  /** Exact existing text. Must occur exactly once in the post. */
  before: string;
  /** Text appended directly after `before` (same paragraph). */
  append: string;
}

interface PostEdits {
  slug: string;
  edits: Edit[];
}

// Facts in the appended text are the approved list only: hosted tutor with
// voice, live whiteboard and typed chat; one signed link; iframe or mobile
// WebView; white-label; free sandbox with 300 minutes and keys at once; $0.20
// per voice minute, $0.16 per typed minute; packs 500/$100, 2,500/$450,
// 10,000/$1,600. No provider or client names.
const POSTS: PostEdits[] = [
  {
    slug: "best-white-label-ai-tutoring-platform-for-test-prep-companies-a-side-by-side-buyers-guide",
    edits: [
      {
        before:
          "Done right, it's one of the fastest and most cost-effective ways to add a differentiated AI product to your platform.",
        append:
          ` Evelyn Learning's Voice Tutor API is one example: a hosted, white-label AI tutor with voice, a live whiteboard and typed chat that your platform embeds with one signed link, in an iframe or a mobile WebView. The [API docs](${DOCS}) show how it works.`,
      },
      {
        before:
          "the total cost of ownership should factor in content licensing savings (dynamic question generation can eliminate $50,000+ in annual test bank costs) and churn reduction revenue impact.",
        append:
          ` Some vendors publish per-minute prices instead: Evelyn Learning's Voice Tutor API is $0.20 per voice minute and $0.16 per typed minute, with prepaid packs on its [pricing page](${PRICING}) and a [free sandbox](${SANDBOX}) with 300 tutoring minutes.`,
      },
    ],
  },
  {
    slug: "can-i-embed-an-ai-tutor-in-my-existing-lms-a-plain-english-guide-for-edtech-decision-makers",
    edits: [
      {
        before:
          "Most institutions start at level two and move toward level three as confidence and technical capacity grow.",
        append:
          ` Level two can be light work: Evelyn Learning's Voice Tutor API, for example, is a hosted tutor with voice, a live whiteboard and typed chat that your server opens with one signed link inside an iframe. The [API docs](${DOCS}) walk through it.`,
      },
      {
        before: "No slide decks — just the real thing.",
        append:
          ` If your developers would rather try it first, the [free sandbox](${SANDBOX}) gives them keys at once and 300 tutoring minutes, with no card needed.`,
      },
    ],
  },
  {
    slug: "khanmigo-vs-building-a-custom-ai-tutor-what-should-a-school-district-actually-choose",
    edits: [
      {
        before:
          "This approach can deliver the customization districts need while maintaining deployment timelines closer to off-the-shelf solutions.",
        append:
          ` Evelyn Learning's Voice Tutor API is one such tool: a hosted, white-label AI tutor with voice, a live whiteboard and typed chat that a district portal or a vendor's platform embeds with one signed link. The [API docs](${DOCS}) describe the integration.`,
      },
      {
        before:
          "with tools built from the ground up to serve institutional needs, not individual consumers.",
        append:
          ` Technical teams can also try the Voice Tutor API themselves in a [free sandbox](${SANDBOX}) with 300 tutoring minutes.`,
      },
    ],
  },
  {
    slug: "how-much-does-it-cost-to-add-an-ai-voice-tutor-to-your-education-platform-a-real-world-pricing-breakdown",
    edits: [
      {
        before:
          "typically takes 2–4 months and requires 1–2 engineers, bringing development costs to $50,000–$180,000 depending on complexity.",
        append:
          ` At the lightest end, a hosted tutor is embedded with one signed link in an iframe or a mobile WebView; Evelyn Learning's [Voice Tutor API docs](${DOCS}) show that route.`,
      },
      {
        before:
          "the white-label or API integration path delivers 80–90% of the learner experience quality at 20–30% of the cost and time investment.",
        append:
          ` For a published reference point, Evelyn Learning's Voice Tutor API charges $0.20 per voice minute and $0.16 per typed minute, with prepaid packs of 500 minutes for $100, 2,500 minutes for $450 and 10,000 minutes for $1,600 ([API pricing](${PRICING})), and a [free sandbox](${SANDBOX}) with 300 tutoring minutes.`,
      },
    ],
  },
];

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

/** The paragraph (text between blank lines) that contains `index`. */
function paragraphAt(text: string, index: number): string {
  const start = text.lastIndexOf("\n", index) + 1;
  const endRaw = text.indexOf("\n", index);
  return text.slice(start, endRaw === -1 ? text.length : endRaw);
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

const write = process.argv.includes("--write");
const backupDir = argValue("--backup");

(async () => {
  if (write && !backupDir) {
    console.error("REFUSED: --write needs --backup <dir> (the originals are saved there first).");
    process.exit(2);
  }
  const target = (process.env.MONGODB_URI || "").replace(/\/\/[^@/]*@/, "//<credentials>@");
  console.log(`Mode: ${write ? "WRITE" : "DRY RUN (nothing is written)"}`);
  console.log(`Database: ${target || "(MONGODB_URI not set)"}`);
  await connectDB();

  const plans: Array<{ id: unknown; slug: string; original: Record<string, unknown>; before: string; after: string; applied: number }> = [];
  const refusals: string[] = [];

  for (const post of POSTS) {
    const doc = await BlogPost.findOne({ slug: post.slug }).lean<Record<string, unknown> & { _id: unknown; content: string; title: string; updatedAt: Date }>();
    console.log(`\n${"=".repeat(100)}\nPOST  ${post.slug}`);
    if (!doc) {
      refusals.push(`${post.slug}: post not found`);
      console.log("  REFUSED: post not found");
      continue;
    }
    console.log(`TITLE ${doc.title}`);
    console.log(`       updatedAt now ${new Date(doc.updatedAt).toISOString()}, content ${doc.content.length} chars`);

    let content = doc.content;
    let applied = 0;
    post.edits.forEach((edit, n) => {
      const label = `  edit ${n + 1}/${post.edits.length}`;
      const after = edit.before + edit.append;
      if (count(content, after) === 1) {
        console.log(`${label}: already applied, skipped`);
        return;
      }
      const found = count(content, edit.before);
      if (found !== 1) {
        refusals.push(`${post.slug} edit ${n + 1}: "before" text found ${found} times, need exactly 1`);
        console.log(`${label}: REFUSED, "before" text found ${found} times (need exactly 1)`);
        return;
      }
      const at = content.indexOf(edit.before);
      const oldParagraph = paragraphAt(content, at);
      content = content.replace(edit.before, after);
      const newParagraph = paragraphAt(content, at);
      applied++;
      console.log(`${label}:`);
      console.log(`  - ${oldParagraph}`);
      console.log(`  + ${newParagraph}`);
      console.log(`    (added ${edit.append.length} chars)`);
    });
    console.log(`  content: ${doc.content.length} -> ${content.length} chars, ${applied} edit(s) to apply`);
    plans.push({ id: doc._id, slug: post.slug, original: doc, before: doc.content, after: content, applied });
  }

  console.log(`\n${"=".repeat(100)}`);
  if (refusals.length > 0) {
    console.log(`REFUSED, nothing written. ${refusals.length} problem(s):`);
    refusals.forEach((r) => console.log(`  - ${r}`));
    process.exit(1);
  }
  const pending = plans.filter((p) => p.applied > 0);
  if (!write) {
    console.log(`DRY RUN complete: ${pending.length} post(s) would change, ${plans.length - pending.length} already done. Nothing was written.`);
    process.exit(0);
  }

  // Backup first: all four originals, changed or not, one JSON file each.
  const dir = path.resolve(backupDir as string);
  fs.mkdirSync(dir, { recursive: true });
  for (const plan of plans) {
    const file = path.join(dir, `${plan.slug}.json`);
    fs.writeFileSync(file, JSON.stringify(plan.original, null, 2));
    console.log(`backup  ${file}`);
  }

  for (const plan of pending) {
    // The content condition is the guard against an edit made since the read.
    const result = await BlogPost.updateOne({ _id: plan.id, content: plan.before }, { $set: { content: plan.after } });
    if (result.modifiedCount !== 1) {
      console.error(`STOPPED at ${plan.slug}: the post changed since it was read; not written. Earlier posts in this run were written; the backup has the originals.`);
      process.exit(1);
    }
    console.log(`written ${plan.slug}`);
  }
  console.log(`WRITE complete: ${pending.length} post(s) updated.`);
  process.exit(0);
})().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
