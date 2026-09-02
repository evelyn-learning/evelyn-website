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
 *     [--grounding-from-seeds] [--ms-conventions] \
 *     [--difficulty-spread 1,2,2,3,3,4]
 *
 * Required: --los-file, --out-dir, --ced-prefix, --subject-label.
 * Optional: --items-per-lo (default 6, difficulties cycle 1..4 across the
 * count unless --difficulty-spread is given), --concurrency (default 4),
 * --limit N, --only-lo <id>.
 *
 * --difficulty-spread <comma-list>: explicit per-item difficulty sequence
 * (integers 1-4), replacing the default 1..4 modulo cycle. Length MUST equal
 * --items-per-lo (validated before any API calls). Works with or without
 * --ms-conventions.
 *
 * --ms-conventions: switches output to the shipped Grade-7 bank convention —
 * item id `<lowercased-ced-prefix>-<slug>-NNN` (3-digit ordinal, no "gen"
 * segment), cedCode `<PREFIX>-<unit>.<topicIndex>` (no "U"), and exactly 2
 * hints per item. Without this flag, output is byte-identical to prior
 * behavior.
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
  msConventions: boolean;
  difficultySpread?: Array<1 | 2 | 3 | 4>;
  scopeNote?: string;
}

function usage(): string {
  return (
    'Usage: npx tsx scripts/generate-bank-items.ts --los-file <path> --out-dir <path> ' +
    '--ced-prefix <STR> --subject-label "<free text>" [--items-per-lo 6] ' +
    '[--concurrency 4] [--limit N] [--only-lo <id>] [--grounding-from-seeds] ' +
    '[--ms-conventions] [--difficulty-spread 1,2,2,3,3,4] [--scope-note-file <path>]'
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

  const difficultySpreadRaw = get('difficulty-spread');
  let difficultySpread: Array<1 | 2 | 3 | 4> | undefined;
  if (difficultySpreadRaw !== undefined) {
    const parts = difficultySpreadRaw.split(',').map((s) => s.trim());
    const nums = parts.map((p) => Number(p));
    const allValidInts = nums.every((n) => Number.isInteger(n) && n >= 1 && n <= 4);
    if (!allValidInts) {
      console.error(
        `✗ --difficulty-spread must be a comma-separated list of integers 1-4, got '${difficultySpreadRaw}'`
      );
      process.exit(1);
    }
    if (nums.length !== itemsPerLo) {
      console.error(
        `✗ --difficulty-spread has ${nums.length} value(s) but --items-per-lo is ${itemsPerLo} — lengths must match. Got '${difficultySpreadRaw}'`
      );
      process.exit(1);
    }
    difficultySpread = nums as Array<1 | 2 | 3 | 4>;
  }

  const scopeNoteFile = get('scope-note-file');
  let scopeNote: string | undefined;
  if (scopeNoteFile !== undefined) {
    if (!fs.existsSync(scopeNoteFile)) {
      console.error(`✗ --scope-note-file ${scopeNoteFile} not found.`);
      process.exit(1);
    }
    scopeNote = fs.readFileSync(scopeNoteFile, 'utf-8').trim();
    if (!scopeNote) {
      console.error(`✗ --scope-note-file ${scopeNoteFile} is empty.`);
      process.exit(1);
    }
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
    msConventions: args.includes('--ms-conventions'),
    difficultySpread,
    scopeNote,
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
  return `You are an expert ${subjectLabel} assessment item writer. Write ORIGINAL multiple-choice items that test genuine understanding of the stated learning objective — not just recognition of a keyword. Ground every item in the supplied lesson content so it is answerable from what was taught; never require outside knowledge or trivia the lesson didn't cover. Vary how each item is framed (a short applied scenario, a direct calculation or definition check, a compare/contrast, a spot-the-error) rather than repeating one template across items. Write ORIGINAL items only — never copy or closely paraphrase questions from any real exam, textbook, or published question bank.

ANSWER-CUE DISCIPLINE. A test-wise student must not be able to find the answer from the SHAPE of the choices instead of the content. Two habits give the answer away and you must avoid both:
1. Length. Write the four choices of an item to a SIMILAR LENGTH: no choice should be more than about a quarter longer than the shortest one. Count roughly as you write. If the correct answer needs to state a full reason, computation, or definition, then EVERY distractor states a full reason, computation, or definition too — a wrong one. Reach the match by making the distractors as substantive as the key, never by padding them with filler and never by trimming the key until it is vague. Before you emit an item, compare its four choices: if the correct one is clearly the longest, rewrite the other three to carry the same weight.
2. Position. Place each item's correct answer at the letter you are told to use for that item. Distribute is not enough — obey the specified letter exactly.
Every distractor must be a claim a student could actually believe, wrong for a nameable reason. No joke options, no throwaway near-duplicates, and no choice that refers to another choice by letter or position (no "both A and B", no "none of the above").`;
}

function computeDifficulties(itemsPerLo: number, spread?: Array<1 | 2 | 3 | 4>): Array<1 | 2 | 3 | 4> {
  if (spread) return spread;
  return Array.from({ length: itemsPerLo }, (_, i) => (((i % 4) + 1) as 1 | 2 | 3 | 4));
}

function buildPrompt(
  lo: Lo,
  grounding: string,
  difficulties: Array<1 | 2 | 3 | 4>,
  subjectLabel: string,
  exactlyTwoHints: boolean,
  scopeNote?: string,
  answerLetters?: string[],
): string {
  const itemsPerLo = difficulties.length;
  const spec = difficulties
    .map((d, i) =>
      answerLetters
        ? `${i + 1}. difficulty ${d} — ${DIFFICULTY_LABEL[d]} — correct answer MUST be choice ${answerLetters[i]}`
        : `${i + 1}. difficulty ${d} — ${DIFFICULTY_LABEL[d]}`,
    )
    .join('\n');
  const hintsInstruction = exactlyTwoHints ? 'exactly 2 short hints' : '1-2 short hints';
  // The course's boundary. This lives in each seed file's SCOPE GUARD doc
  // comment, which is a TypeScript comment and therefore reaches nothing —
  // not the LessonPlan object, not `extractGrounding`, not this prompt. Item
  // generation would otherwise see only the LO description and the lesson
  // segments, neither of which states what the course deliberately withholds,
  // so items could freely reach into the grade above. Placed LAST, next to
  // the output instruction, because a constraint buried above the lesson
  // content reads as background rather than as a rule for what to write.
  const scopeSection = scopeNote
    ? `Course scope boundary — these topics are deliberately reserved for later grades and MUST NOT appear in any item, distractor, or hint, even when the lesson content above brushes against them. Stay at the depth the lesson itself teaches:
${scopeNote}

`
    : '';
  return `Subject: ${subjectLabel}
Learning objective: "${lo.title}"
LO description: ${lo.description}

Lesson content taught for this LO (use this to ground the items — items must be answerable from this content, not require outside knowledge):
${grounding || '(no additional lesson content retrieved — ground items in the LO title/description alone)'}

Write EXACTLY ${itemsPerLo} original multiple-choice items for this LO, one per line below, at the difficulty specified for that position:
${spec}

Each item needs exactly 4 choices (A-D), one clearly correct answer, and ${hintsInstruction} that nudge without giving away the answer. Choices must not have letter prefixes in the text itself. No item's problemText may be shorter than 2 sentences (or, for a terse computational item, at least one full sentence that fully states what is being asked).

${scopeSection}Return ONLY a JSON array of ${itemsPerLo} objects, this exact shape, no markdown fences, no commentary, in the same order as the difficulty list above:
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

/** Items whose correct choice is strictly longest by more than `slack`
 *  characters. That margin is the tell: a key two characters longer than its
 *  nearest rival is a tie, one thirty characters longer is a signpost. */
function answerCueOffenders(items: GenItem[], slack = 10): number[] {
  const out: number[] = [];
  items.forEach((it, i) => {
    const idx = ['A', 'B', 'C', 'D'].indexOf(it.answer);
    if (idx < 0 || !Array.isArray(it.choices) || idx >= it.choices.length) return;
    const kl = it.choices[idx].length;
    const others = it.choices.filter((_, j) => j !== idx).map((c) => c.length);
    if (others.length && kl > Math.max(...others) + slack) out.push(i);
  });
  return out;
}

/** Second pass over the items a model cannot get right by instruction alone.
 *  Three rounds of prompt tuning moved the "key is longest" rate 61.9% ->
 *  57.1% -> 52.4% against a 25% chance baseline, while the median winning
 *  margin went UP (25 -> 32 chars) — i.e. the wording changed nothing and the
 *  movement was noise. So the fix is mechanical: hand the offending items back
 *  and ask for LONGER DISTRACTORS, never a shorter key. Shortening the key is
 *  what turns a length tell into an inverted length tell; the seeds of this
 *  same wave were repaired the same way, twice, independently. */
async function repairAnswerCues(
  anthropic: Anthropic,
  model: string,
  system: string,
  items: GenItem[],
  offenders: number[],
): Promise<{ items: GenItem[]; usageIn: number; usageOut: number }> {
  const payload = offenders.map((i) => ({ index: i, ...items[i] }));
  const prompt = `Each item below has a giveaway: its correct choice is visibly longer than the other three, so a student can pick it without understanding the question.

Rewrite ONLY the three incorrect choices of each item so that all four choices carry comparable weight and length. Rules:
- Do NOT change problemText, hints, difficulty, answer, or the text of the correct choice.
- Do NOT shorten the correct choice. Lengthen the distractors instead, by making each state its full (wrong) reasoning, computation, or definition — the same job the correct choice does.
- Every distractor must stay genuinely WRONG and remain a mistake a student could actually make. Never add filler words to pad length.
- Keep the correct answer at the same letter it is now.

${JSON.stringify(payload, null, 2)}

Return ONLY a JSON array of the same objects with the same "index" fields and the rewritten "choices" arrays, no markdown fences, no commentary.`;
  const params = { model, max_tokens: 4000, system, messages: [{ role: 'user', content: prompt }] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = await anthropic.messages.create(prepareParams('content-gen', params) as any);
  const text = msg.content
    .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
    .map((b) => b.text)
    .join('');
  const next = items.slice();
  try {
    const parsed = JSON.parse(stripFences(text));
    if (!Array.isArray(parsed)) throw new Error('not an array');
    for (const row of parsed as Array<{ index: number; choices: string[]; answer?: string }>) {
      const i = row.index;
      if (!Number.isInteger(i) || i < 0 || i >= next.length) continue;
      if (!Array.isArray(row.choices) || row.choices.length !== next[i].choices.length) continue;
      const idx = ['A', 'B', 'C', 'D'].indexOf(next[i].answer);
      // The key must survive the rewrite untouched, or the repair has quietly
      // changed what the item asks. Reject the row rather than trust it.
      if (idx < 0 || row.choices[idx] !== next[i].choices[idx]) continue;
      next[i] = { ...next[i], choices: row.choices };
    }
  } catch {
    /* keep the originals — a failed repair must never lose items */
  }
  return { items: next, usageIn: msg.usage?.input_tokens ?? 0, usageOut: msg.usage?.output_tokens ?? 0 };
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
  console.log(
    opts.scopeNote
      ? `Scope boundary: ${opts.scopeNote.length} chars from --scope-note-file (in every prompt).`
      : 'Scope boundary: NONE — items are bounded only by the LO description and lesson content.',
  );

  if (!opts.groundingFromSeeds) await mongoose.connect(process.env.MONGODB_URI!);
  const { client: anthropic, model } = getModelClient('content-gen');
  const SYSTEM = buildSystem(opts.subjectLabel);

  const rawIdPrefix = slugify(opts.cedPrefix) || 'gen';
  const idPrefix = rawIdPrefix.replace(/-gen$/, '') || 'gen';
  // --ms-conventions id prefix: lowercased ced-prefix with trailing dashes
  // stripped (slugify already does both) and NO "-gen" segment stripping —
  // there is no "gen" segment in this template to begin with.
  const msIdPrefix = rawIdPrefix;

  let done = 0;
  let usageIn = 0;
  let usageOut = 0;
  const perLoResults = await runPool(los, opts.concurrency, async (lo) => {
    const cedIndex = cedIndexByLoId.get(lo.loId)!;
    const slug = slugByLoId.get(lo.loId)!;

    const grounding = await fetchGrounding(lo.planId, lo.loId, opts.groundingFromSeeds);
    const difficulties = computeDifficulties(opts.itemsPerLo, opts.difficultySpread);
    // Target answer letters, rotated by (unit + topic index + item ordinal) —
    // the same rule the lesson seeds use for their in-lesson practice, so one
    // course does not carry two different answer-position conventions. Left
    // undefined without --ms-conventions to keep prior behavior byte-identical.
    const answerLetters = opts.msConventions
      ? difficulties.map((_, i) => ['A', 'B', 'C', 'D'][(lo.unit + cedIndex + i) % 4])
      : undefined;
    let items: GenItem[] = [];
    try {
      const params = {
        model,
        max_tokens: 4000,
        system: SYSTEM,
        messages: [
          {
            role: 'user',
            content: buildPrompt(lo, grounding, difficulties, opts.subjectLabel, opts.msConventions, opts.scopeNote, answerLetters),
          },
        ],
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

    if (opts.msConventions && items.length) {
      const offenders = answerCueOffenders(items);
      if (offenders.length) {
        try {
          const r = await repairAnswerCues(anthropic, model, SYSTEM, items, offenders);
          usageIn += r.usageIn;
          usageOut += r.usageOut;
          const before = offenders.length;
          const after = answerCueOffenders(r.items).length;
          items = r.items;
          console.log(`  ~ ${lo.loId}: answer-cue repair ${before} -> ${after} item(s) with an over-long key`);
        } catch (e) {
          console.log(`  ⚠️  ${lo.loId}: answer-cue repair failed (${(e as Error).message}) — keeping originals`);
        }
      }
    }

    const seedItems: SeedItem[] = [];
    for (let idx = 0; idx < items.length; idx++) {
      const it = items[idx];
      const errs = validateGenItem(it, lo.loId).filter((e) => !e.startsWith('WARN'));
      if (errs.length) {
        console.log(`  [FAIL] ${lo.loId} d${it.difficulty}: ${errs.join('; ')}`);
        continue;
      }
      const nDigits = opts.msConventions ? 3 : 2;
      const n = String(seedItems.length + 1).padStart(nDigits, '0');
      // When an explicit spread is given, stamp difficulty from the intended
      // per-position (authored slot) sequence rather than trusting the
      // model's echoed value — each kept item's difficulty is truthful to
      // the slot it was generated for. This does NOT guarantee the output
      // sequence matches --difficulty-spread exactly: a dropped item (failed
      // validation) leaves a gap at its slot rather than pulling later
      // difficulties forward, so a run with drops can end up short one or
      // more spread values. That's by design — label/content truth is
      // preserved over spread completeness, and problem-bank-gap-manifest.ts
      // is what catches the resulting shortfall and forces an LO regen.
      const difficulty = opts.difficultySpread ? (difficulties[idx] ?? it.difficulty) : it.difficulty;
      let hints = it.hints ?? [];
      if (opts.msConventions) hints = hints.slice(0, 2);
      seedItems.push({
        id: opts.msConventions ? `${msIdPrefix}-${slug}-${n}` : `${idPrefix}-gen.${slug}.${n}`,
        loId: lo.loId,
        cedCode: opts.msConventions
          ? `${opts.cedPrefix}-${lo.unit}.${cedIndex}`
          : `${opts.cedPrefix}-U${lo.unit}.${cedIndex}`,
        difficulty,
        responseFormat: 'mcq',
        problemText: it.problemText,
        choices: it.choices,
        answer: it.answer,
        hints,
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

  // Answer-cue diagnostic. A model left to itself puts the key at A or B and
  // makes it the longest choice — a measured 61.9% longest and ZERO D across a
  // 42-item pilot, which is a bank answerable from the shape of the choices.
  // Printed every run, because a defect nobody measures is a defect nobody
  // sees: the numbers below are the only place this surfaces.
  {
    const all = perLoResults.flatMap((r) => r.seedItems);
    const pos: Record<string, number> = {};
    let longest = 0;
    let shortest = 0;
    let n = 0;
    for (const it of all) {
      const choices = (it as { choices?: string[] }).choices ?? [];
      const ans = (it as { answer?: string }).answer ?? '';
      const idx = ['A', 'B', 'C', 'D'].indexOf(ans);
      if (idx < 0 || idx >= choices.length) continue;
      n++;
      pos[ans] = (pos[ans] ?? 0) + 1;
      const kl = choices[idx].length;
      const others = choices.filter((_, j) => j !== idx).map((c) => c.length);
      if (others.length && kl > Math.max(...others)) longest++;
      if (others.length && kl < Math.min(...others)) shortest++;
    }
    if (n) {
      const spread = ['A', 'B', 'C', 'D'].map((l) => `${l}:${pos[l] ?? 0}`).join(' ');
      const pct = ((longest / n) * 100).toFixed(1);
      const pctS = ((shortest / n) * 100).toFixed(1);
      console.log(`\nAnswer-cue check over ${n} item(s):`);
      console.log(`  key position     ${spread}   (even spread = ${(n / 4).toFixed(1)} each)`);
      console.log(`  key longest      ${longest}/${n} = ${pct}%   (chance 25%)`);
      console.log(`  key shortest     ${shortest}/${n} = ${pctS}%   (chance 25%)`);
      // Both directions matter. Repairing a length tell by lengthening
      // distractors can overshoot into "the shortest answer is always right",
      // which is the same tell inverted and just as exploitable.
      if (longest / n > 0.4) console.log('  ⚠️  key is longest far above chance — the bank is guessable by length.');
      if (shortest / n > 0.4) console.log('  ⚠️  key is shortest far above chance — the length tell has been INVERTED, not removed.');
    }
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
