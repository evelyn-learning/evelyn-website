/**
 * Generalized ProblemBank item generator — parameterized clone of
 * `generate-cphq-items.ts` (that file is the reference implementation and
 * stays untouched; this is its subject-agnostic sibling for future course
 * waves and scripted item generation, e.g. the Task 9 pilot).
 *
 * Any course can hand this script a `{loId, planId, title, description,
 * unit}[]` LOS file and get back `u<unit>.json` files in the exact
 * `SeedItem[]` shape `scripts/seed-problem-bank.ts` validates — so the output
 * feeds directly into the existing verify gate:
 *
 *   npx tsx scripts/seed-problem-bank.ts --course=<course-dir> --dry-run
 *
 * The SYSTEM prompt is pedagogically GENERIC — no subject-specific worked
 * examples baked in (house rule: prompts must be generic, subject enters
 * structurally, never via hardcoded examples). The subject enters only via
 * `--subject-label` (free text, e.g. "Grade 6 Mathematics") and the per-LO
 * grounding pulled from the lesson content itself.
 *
 * Usage:
 *   npx tsx scripts/generate-bank-items.ts \
 *     --los-file <path> --out-dir <path> --ced-prefix <STR> \
 *     --subject-label "<free text>" \
 *     [--items-per-lo 6] [--concurrency 4] [--limit N] [--only-lo <id>] \
 *     [--grounding-from-seeds]
 *
 * Required: --los-file, --out-dir, --ced-prefix, --subject-label.
 * Optional: --items-per-lo (default 6, difficulties cycle 1..4 across the
 * count), --concurrency (default 4), --limit N, --only-lo <id>.
 *
 * --grounding-from-seeds: pull lesson content from the in-repo curated
 * `SEED_PLANS` catalog (via `getLessonPlan`) instead of Mongo — no DB
 * connection needed as long as every LO's planId is a curated seed id. Falls
 * back to the Mongo path automatically for any planId the seed catalog
 * doesn't recognize as long as MONGODB_URI is set.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { LessonPlanModel, toLessonPlan } from '../src/models/LessonPlan';
import type { Segment, LessonPlan } from '../src/lib/tutor/lesson-plan/types';
import { getLessonPlan } from '../src/lib/tutor/lesson-plan/store';
import { getModelClient, prepareParams, resolveModel } from '../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../src/lib/tutor/ai/model-rates';

interface Lo {
  loId: string;
  planId: string;
  title: string;
  description: string;
  unit: number;
}

interface GenItem {
  difficulty: 1 | 2 | 3 | 4;
  problemText: string;
  choices: string[];
  answer: string; // letter A-D
  hints: string[];
}

interface SeedItem {
  id: string;
  loId: string;
  cedCode: string;
  difficulty: 1 | 2 | 3 | 4;
  responseFormat: 'mcq';
  problemText: string;
  choices: string[];
  answer: string;
  hints?: string[];
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface Opts {
  losFile: string;
  outDir: string;
  cedPrefix: string;
  subjectLabel: string;
  itemsPerLo: number;
  concurrency: number;
  limit?: number;
  onlyLo?: string;
  groundingFromSeeds: boolean;
}

function usage(): string {
  return (
    'Usage: npx tsx scripts/generate-bank-items.ts --los-file <path> --out-dir <path> ' +
    '--ced-prefix <STR> --subject-label "<free text>" [--items-per-lo 6] ' +
    '[--concurrency 4] [--limit N] [--only-lo <id>] [--grounding-from-seeds]'
  );
}

function parseArgs(): Opts {
  const args = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const eq = args.find((x) => x.startsWith(`--${name}=`));
    if (eq) return eq.split('=').slice(1).join('=');
    const i = args.indexOf(`--${name}`);
    if (i !== -1 && i + 1 < args.length) return args[i + 1];
    return undefined;
  };
  const losFile = get('los-file');
  const outDir = get('out-dir');
  const cedPrefix = get('ced-prefix');
  const subjectLabel = get('subject-label');
  if (!losFile || !outDir || !cedPrefix || !subjectLabel) {
    console.error(usage());
    console.error('\nMissing required flag(s): ' + [
      !losFile && '--los-file',
      !outDir && '--out-dir',
      !cedPrefix && '--ced-prefix',
      !subjectLabel && '--subject-label',
    ].filter(Boolean).join(', '));
    process.exit(1);
  }
  const itemsPerLoRaw = get('items-per-lo');
  const itemsPerLo = itemsPerLoRaw ? parseInt(itemsPerLoRaw, 10) : 6;
  if (!Number.isInteger(itemsPerLo) || itemsPerLo < 1) {
    console.error(`✗ --items-per-lo must be a positive integer, got '${itemsPerLoRaw}'`);
    process.exit(1);
  }
  const concurrencyRaw = get('concurrency');
  const concurrency = concurrencyRaw ? parseInt(concurrencyRaw, 10) : 4;
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    console.error(`✗ --concurrency must be a positive integer, got '${concurrencyRaw}'`);
    process.exit(1);
  }
  return {
    losFile,
    outDir,
    cedPrefix,
    subjectLabel,
    itemsPerLo,
    concurrency,
    limit: get('limit') ? parseInt(get('limit')!, 10) : undefined,
    onlyLo: get('only-lo'),
    groundingFromSeeds: args.includes('--grounding-from-seeds'),
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    .slice(0, 48);
}

function stripFences(text: string): string {
  const t = text.trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return m ? m[1].trim() : t;
}

// ---------------------------------------------------------------------------
// Grounding: pull the LO's actual teaching content out of its stored plan.
// ---------------------------------------------------------------------------

function extractGrounding(plan: LessonPlan, loId: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let segs = plan.segments.filter((s: Segment) => s.id.startsWith(`${loId}-`));
  // Curated single-LO seed plans don't prefix their segment ids with the LO
  // id at all (see src/lib/tutor/lesson-plan/seeds/*.ts) — if the prefix
  // match finds nothing, fall back to every segment in the plan.
  if (segs.length === 0) segs = plan.segments;
  const parts: string[] = [];
  for (const s of segs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seg = s as any;
    if (seg.kind === 'concept') {
      parts.push(`Concept goal: ${seg.goal}`);
      if (seg.keyIdeas?.length) parts.push(`Key ideas: ${seg.keyIdeas.join('; ')}`);
      if (seg.vocabulary?.length) {
        parts.push(`Vocabulary: ${seg.vocabulary.map((v: { term: string; definition: string }) => `${v.term} — ${v.definition}`).join('; ')}`);
      }
    } else if (seg.kind === 'worked_example') {
      parts.push(`Worked example: ${seg.problem}`);
      if (seg.steps?.length) parts.push(`Steps: ${seg.steps.join(' -> ')}`);
      if (seg.answer) parts.push(`Worked-example answer: ${seg.answer}`);
    } else if (seg.kind === 'try_yourself') {
      parts.push(`Practice prompt: ${seg.problem}`);
      if (seg.expectedAnswer) parts.push(`Expected answer: ${seg.expectedAnswer}`);
    } else if (seg.kind === 'misconception_check') {
      if (seg.goal) parts.push(`Misconception focus: ${seg.goal}`);
    }
  }
  return parts.join('\n');
}

async function fetchGrounding(planId: string, loId: string, fromSeeds: boolean): Promise<string> {
  try {
    if (fromSeeds) {
      const plan = await getLessonPlan(planId);
      if (!plan) return '';
      return extractGrounding(plan, loId);
    }
    const doc = await LessonPlanModel.findById(planId);
    if (!doc) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = toLessonPlan(doc as any);
    return extractGrounding(plan, loId);
  } catch (e) {
    console.log(`  ⚠️  grounding fetch failed for planId=${planId} loId=${loId}: ${(e as Error).message}`);
    return '';
  }
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

const DIFFICULTY_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: 'straightforward recall or direct application of the definition/rule taught, minimal setup',
  2: 'apply the concept to a simple, concrete problem — one step beyond bare recall',
  3: 'multi-step problem requiring the student to combine two or more ideas from the lesson',
  4: 'complex or extension-level problem (multiple steps, or an edge case / less obvious application), still answerable from the lesson content alone',
};

function buildSystem(subjectLabel: string): string {
  return `You are an expert ${subjectLabel} assessment item writer. Write ORIGINAL multiple-choice items that test genuine understanding of the stated learning objective — not just recognition of a keyword. Ground every item in the supplied lesson content so it is answerable from what was taught; never require outside knowledge or trivia the lesson didn't cover. Vary how each item is framed (a short applied scenario, a direct calculation or definition check, a compare/contrast, a spot-the-error) rather than repeating one template across items. Write ORIGINAL items only — never copy or closely paraphrase questions from any real exam, textbook, or published question bank.`;
}

function buildPrompt(lo: Lo, grounding: string, itemsPerLo: number, subjectLabel: string): string {
  const difficulties: Array<1 | 2 | 3 | 4> = Array.from({ length: itemsPerLo }, (_, i) => (((i % 4) + 1) as 1 | 2 | 3 | 4));
  const spec = difficulties
    .map((d, i) => `${i + 1}. difficulty ${d} — ${DIFFICULTY_LABEL[d]}`)
    .join('\n');
  return `Subject: ${subjectLabel}
Learning objective: "${lo.title}"
LO description: ${lo.description}

Lesson content taught for this LO (use this to ground the items — items must be answerable from this content, not require outside knowledge):
${grounding || '(no additional lesson content retrieved — ground items in the LO title/description alone)'}

Write EXACTLY ${itemsPerLo} original multiple-choice items for this LO, one per line below, at the difficulty specified for that position:
${spec}

Each item needs exactly 4 choices (A-D), one clearly correct answer, and 1-2 short hints that nudge without giving away the answer. Choices must not have letter prefixes in the text itself. No item's problemText may be shorter than 2 sentences (or, for a terse computational item, at least one full sentence that fully states what is being asked).

Return ONLY a JSON array of ${itemsPerLo} objects, this exact shape, no markdown fences, no commentary, in the same order as the difficulty list above:
[{"difficulty":1,"problemText":"...","choices":["...","...","...","..."],"answer":"A","hints":["..."]}, ...]`;
}

function validateGenItem(it: GenItem, loId: string): string[] {
  const errs: string[] = [];
  if (![1, 2, 3, 4].includes(it.difficulty)) errs.push(`bad difficulty ${it.difficulty}`);
  if (!it.problemText || it.problemText.trim().length < 10) errs.push('problemText too short');
  if (!Array.isArray(it.choices) || it.choices.length < 3 || it.choices.length > 5) errs.push('needs 3-5 choices');
  else {
    const idx = ['A', 'B', 'C', 'D', 'E'].indexOf(it.answer);
    if (idx < 0 || idx >= it.choices.length) errs.push(`answer '${it.answer}' out of range`);
  }
  if (/\$(\d)/.test(it.problemText || '')) errs.push(`WARN ${loId} problemText has $<digit> (currency/KaTeX trap)`);
  return errs;
}

async function runPool<T, R>(items: T[], concurrency: number, fn: (t: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();
  dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env.local.production') });
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

  if (!resolveModel('content-gen').apiKey) {
    console.error(
      '✗ No API key found for the content-gen role (checked TUTOR_MODEL_CONTENT_GEN_API_KEY, ' +
        'TUTOR_MODEL_API_KEY, and ANTHROPIC_API_KEY — needed for generation).'
    );
    process.exit(1);
  }
  if (!opts.groundingFromSeeds && !process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI not set (needed to fetch plan content for grounding). Use --grounding-from-seeds for curated seed-catalog plans.');
    process.exit(1);
  }
  if (!fs.existsSync(opts.losFile)) {
    console.error(`✗ ${opts.losFile} not found.`);
    process.exit(1);
  }
  const rawLos: Lo[] = JSON.parse(fs.readFileSync(opts.losFile, 'utf-8'));

  // cedCode/slug: <prefix>-U<unit>.<index-within-unit>, computed from the
  // FULL, UNFILTERED file's already-unit-grouped order, synchronously and
  // before --only-lo/--limit filtering and before runPool. This guarantees
  // a given LO always gets the same cedCode/slug regardless of which subset
  // is being (re)generated (--only-lo/--limit) or the completion order of
  // concurrent workers (--concurrency > 1).
  const cedIndexByLoId = new Map<string, number>();
  const slugByLoId = new Map<string, string>();
  {
    const unitCounters: Record<number, number> = {};
    const usedSlugs = new Set<string>();
    for (const lo of rawLos) {
      unitCounters[lo.unit] = (unitCounters[lo.unit] ?? 0) + 1;
      const cedIndex = unitCounters[lo.unit];
      cedIndexByLoId.set(lo.loId, cedIndex);
      let slug = slugify(lo.title);
      if (usedSlugs.has(slug)) slug = `${slug}-${cedIndex}`;
      usedSlugs.add(slug);
      slugByLoId.set(lo.loId, slug);
    }
  }

  let los: Lo[] = rawLos;
  if (opts.onlyLo) los = los.filter((l) => l.loId === opts.onlyLo);
  if (opts.limit) los = los.slice(0, opts.limit);
  console.log(`Generating items for ${los.length} LO(s) [${opts.subjectLabel}]...`);

  if (!opts.groundingFromSeeds) await mongoose.connect(process.env.MONGODB_URI!);
  const { client: anthropic, model } = getModelClient('content-gen');
  const SYSTEM = buildSystem(opts.subjectLabel);

  const rawIdPrefix = slugify(opts.cedPrefix) || 'gen';
  const idPrefix = rawIdPrefix.replace(/-gen$/, '') || 'gen';

  let done = 0;
  let usageIn = 0;
  let usageOut = 0;
  const perLoResults = await runPool(los, opts.concurrency, async (lo) => {
    const cedIndex = cedIndexByLoId.get(lo.loId)!;
    const slug = slugByLoId.get(lo.loId)!;

    const grounding = await fetchGrounding(lo.planId, lo.loId, opts.groundingFromSeeds);
    let items: GenItem[] = [];
    try {
      const params = {
        model,
        max_tokens: 4000,
        system: SYSTEM,
        messages: [{ role: 'user', content: buildPrompt(lo, grounding, opts.itemsPerLo, opts.subjectLabel) }],
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = await anthropic.messages.create(prepareParams('content-gen', params) as any);
      usageIn += msg.usage?.input_tokens ?? 0;
      usageOut += msg.usage?.output_tokens ?? 0;
      const text = msg.content
        .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
        .map((b) => b.text)
        .join('');
      const parsed = JSON.parse(stripFences(text));
      if (!Array.isArray(parsed)) throw new Error('not an array');
      items = parsed as GenItem[];
    } catch (e) {
      console.log(`  ✗ generation FAILED for ${lo.loId} (${lo.title}): ${(e as Error).message}`);
    }

    const seedItems: SeedItem[] = [];
    for (const it of items) {
      const errs = validateGenItem(it, lo.loId).filter((e) => !e.startsWith('WARN'));
      if (errs.length) {
        console.log(`  [FAIL] ${lo.loId} d${it.difficulty}: ${errs.join('; ')}`);
        continue;
      }
      const n = String(seedItems.length + 1).padStart(2, '0');
      seedItems.push({
        id: `${idPrefix}-gen.${slug}.${n}`,
        loId: lo.loId,
        cedCode: `${opts.cedPrefix}-U${lo.unit}.${cedIndex}`,
        difficulty: it.difficulty,
        responseFormat: 'mcq',
        problemText: it.problemText,
        choices: it.choices,
        answer: it.answer,
        hints: it.hints ?? [],
      });
    }
    done++;
    console.log(`  [${done}/${los.length}] ${lo.loId} (${lo.title}) -> ${seedItems.length}/${opts.itemsPerLo} items`);
    return { lo, seedItems };
  });

  // Unconditional: under --grounding-from-seeds, a planId missing from the
  // seed catalog falls back to Mongo via getLessonPlan() (which calls
  // connectDB() itself), so a connection can be open here even though this
  // script never called mongoose.connect() directly. disconnect() is a
  // no-op when nothing is connected (verified against this repo's mongoose
  // 8.24.3: readyState 0, resolves without throwing) so it's always safe.
  await mongoose.disconnect();

  // Group by unit -> u<unit>.json, merging with any existing file content
  // (so --only-lo=<id> targeted regen doesn't clobber the other LOs in that unit).
  fs.mkdirSync(opts.outDir, { recursive: true });
  const byUnit = new Map<number, SeedItem[]>();
  for (const { lo, seedItems } of perLoResults) {
    const file = path.join(opts.outDir, `u${lo.unit}.json`);
    let existing: SeedItem[] = [];
    if (fs.existsSync(file)) {
      try {
        existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
      } catch {
        existing = [];
      }
    }
    if (!byUnit.has(lo.unit)) byUnit.set(lo.unit, existing);
    // Drop any prior items for this LO (regen case), then append fresh ones.
    const filtered = (byUnit.get(lo.unit) ?? []).filter((it) => it.loId !== lo.loId);
    byUnit.set(lo.unit, [...filtered, ...seedItems]);
  }
  for (const [unit, items] of byUnit) {
    const file = path.join(opts.outDir, `u${unit}.json`);
    fs.writeFileSync(file, JSON.stringify(items, null, 2) + '\n');
    console.log(`✓ wrote ${items.length} items -> ${path.relative(process.cwd(), file)}`);
  }

  const totalItems = perLoResults.reduce((s, r) => s + r.seedItems.length, 0);
  const shortLos = perLoResults.filter((r) => r.seedItems.length < opts.itemsPerLo).map((r) => `${r.lo.loId} (${r.seedItems.length})`);
  console.log(`\nDone. ${totalItems} items generated across ${perLoResults.length} LOs.`);
  if (shortLos.length) console.log(`LOs with <${opts.itemsPerLo} items: ${shortLos.join(', ')}`);
  const rate = lookupModelRate(model);
  const cost = rate ? (usageIn / 1e6) * rate.input + (usageOut / 1e6) * rate.output : undefined;
  console.log(
    `Token usage: ${usageIn} in / ${usageOut} out.` +
      (cost !== undefined ? ` Est. generation cost: $${cost.toFixed(3)} (informational)` : ' (no rate row for this model)'),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
