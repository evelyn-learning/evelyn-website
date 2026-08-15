/**
 * Generate the CPHQ ProblemBank item seed files (Option A demo prep).
 *
 * CPHQ (Healthcare Quality) is a generated white-label course: 37 LOs living
 * as `los[]` entries inside runtime-generated LessonPlan documents (ids like
 * `gen-<uuid>`), NOT in the curated seed-plan catalog. There is no existing
 * `apps/marketing/src/data/problem-bank/cphq/` corpus to hand-author against, so this script
 * calls the model to draft 4 original MCQ items per LO, grounded in the LO's
 * own title/description AND the stored plan's actual teaching content (the
 * concept/worked-example/try-yourself segments for that LO) — so items are
 * answerable from the lesson the student just took.
 *
 * Output: `apps/marketing/src/data/problem-bank/cphq/u<unit>.json` files in the exact
 * SeedItem[] shape `scripts/seed-problem-bank.ts` expects (see that script's
 * `SeedItem` interface + `apps/marketing/src/data/problem-bank/ap-psychology/_AUTHORING.md`
 * for the schema this mirrors). Run the real ingest afterward with:
 *
 *   npx tsx scripts/seed-problem-bank.ts --course=cphq
 *
 * Usage:
 *   npx tsx scripts/generate-cphq-items.ts [--limit=N] [--concurrency=4]
 *   npx tsx scripts/generate-cphq-items.ts --lo=<loId>   # regenerate one LO
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { LessonPlanModel, toLessonPlan } from '../apps/marketing/src/models/LessonPlan';
import type { Segment } from '../apps/marketing/src/lib/tutor/lesson-plan/types';

const MODEL = 'claude-sonnet-5';
const OUT_DIR = path.join(__dirname, '..', 'src', 'data', 'problem-bank', 'cphq');
const LOS_FILE = path.join(__dirname, '..', '.cphq-los.json');
const DIFFICULTIES: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

interface CphqLo {
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

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const a = args.find((x) => x.startsWith(`--${name}=`));
    return a ? a.split('=').slice(1).join('=') : undefined;
  };
  return {
    limit: get('limit') ? parseInt(get('limit')!, 10) : undefined,
    concurrency: get('concurrency') ? parseInt(get('concurrency')!, 10) : 4,
    onlyLo: get('lo'),
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

async function fetchGrounding(planId: string, loId: string): Promise<string> {
  try {
    const doc = await LessonPlanModel.findById(planId);
    if (!doc) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = toLessonPlan(doc as any);
    const segs = plan.segments.filter((s: Segment) => s.id.startsWith(`${loId}-`));
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
  } catch (e) {
    console.log(`  ⚠️  grounding fetch failed for planId=${planId} loId=${loId}: ${(e as Error).message}`);
    return '';
  }
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

const SYSTEM = `You are an expert CPHQ (Certified Professional in Healthcare Quality) exam item writer. CPHQ items are scenario-based multiple-choice questions styled after the real NAHQ CPHQ exam: a short realistic healthcare-quality vignette (a hospital, a quality team, a data finding, an incident) followed by a question that requires applying a specific concept to that scenario. Write ORIGINAL items only — never copy or closely paraphrase any real exam question. Ground every item in the supplied lesson content so it is answerable from what was taught.`;

function buildPrompt(lo: CphqLo, grounding: string): string {
  return `Learning objective: "${lo.title}"
LO description: ${lo.description}

Lesson content taught for this LO (use this to ground the items — items must be answerable from this content, not require outside CPHQ trivia):
${grounding || '(no additional lesson content retrieved — ground items in the LO title/description alone)'}

Write EXACTLY 4 original CPHQ-style multiple-choice items for this LO, one at each difficulty level:
- difficulty 1: straightforward recall/definition, light scenario framing
- difficulty 2: apply the concept to a simple realistic scenario
- difficulty 3: multi-step scenario requiring the test-taker to weigh 2+ considerations
- difficulty 4: complex, extension-grade scenario (ambiguous or competing priorities), still answerable from the lesson content

Each item needs exactly 4 choices (A-D), one clearly correct answer, and 1-2 short hints that nudge without giving away the answer. Choices must not have letter prefixes in the text itself. No item may be shorter than 2 sentences of scenario/stem.

Return ONLY a JSON array of 4 objects, this exact shape, no markdown fences, no commentary:
[{"difficulty":1,"problemText":"...","choices":["...","...","...","..."],"answer":"A","hints":["..."]}, ...]`;
}

async function generateForLo(anthropic: Anthropic, lo: CphqLo, grounding: string): Promise<GenItem[]> {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    messages: [{ role: 'user', content: buildPrompt(lo, grounding) }],
  });
  const text = msg.content
    .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
    .map((b) => b.text)
    .join('');
  const parsed = JSON.parse(stripFences(text));
  if (!Array.isArray(parsed)) throw new Error('model did not return a JSON array');
  return parsed as GenItem[];
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
  dotenv.config({ path: path.join(__dirname, '..', '.env.local.production') });
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('✗ ANTHROPIC_API_KEY not set.');
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI not set (needed to fetch plan content for grounding).');
    process.exit(1);
  }
  if (!fs.existsSync(LOS_FILE)) {
    console.error(`✗ ${LOS_FILE} not found.`);
    process.exit(1);
  }
  let los: CphqLo[] = JSON.parse(fs.readFileSync(LOS_FILE, 'utf-8'));
  if (opts.onlyLo) los = los.filter((l) => l.loId === opts.onlyLo);
  if (opts.limit) los = los.slice(0, opts.limit);
  console.log(`Generating items for ${los.length} CPHQ LO(s)...`);

  await mongoose.connect(process.env.MONGODB_URI);
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // cedCode: CPHQ-U<unit>.<index-within-unit>, computed from the file's
  // already-unit-grouped order.
  const unitCounters: Record<number, number> = {};
  const usedSlugs = new Set<string>();

  let done = 0;
  let usageIn = 0;
  let usageOut = 0;
  const perLoResults = await runPool(los, opts.concurrency, async (lo) => {
    unitCounters[lo.unit] = (unitCounters[lo.unit] ?? 0) + 1;
    const cedIndex = unitCounters[lo.unit];
    let slug = slugify(lo.title);
    if (usedSlugs.has(slug)) slug = `${slug}-${cedIndex}`;
    usedSlugs.add(slug);

    const grounding = await fetchGrounding(lo.planId, lo.loId);
    let items: GenItem[] = [];
    try {
      const msg = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4000,
        system: SYSTEM,
        messages: [{ role: 'user', content: buildPrompt(lo, grounding) }],
      });
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
        id: `cphq-gen.${slug}.${n}`,
        loId: lo.loId,
        cedCode: `CPHQ-U${lo.unit}.${cedIndex}`,
        difficulty: it.difficulty,
        responseFormat: 'mcq',
        problemText: it.problemText,
        choices: it.choices,
        answer: it.answer,
        hints: it.hints ?? [],
      });
    }
    done++;
    console.log(`  [${done}/${los.length}] ${lo.loId} (${lo.title}) -> ${seedItems.length}/${DIFFICULTIES.length} items`);
    return { lo, seedItems };
  });

  await mongoose.disconnect();

  // Group by unit -> u<unit>.json, merging with any existing file content
  // (so --lo=<id> targeted regen doesn't clobber the other LOs in that unit).
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const byUnit = new Map<number, SeedItem[]>();
  for (const { lo, seedItems } of perLoResults) {
    const file = path.join(OUT_DIR, `u${lo.unit}.json`);
    let existing: SeedItem[] = [];
    if (fs.existsSync(file)) {
      try {
        existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
      } catch {
        existing = [];
      }
    }
    const bucket = byUnit.get(lo.unit) ?? existing;
    if (!byUnit.has(lo.unit)) byUnit.set(lo.unit, existing);
    // Drop any prior items for this LO (regen case), then append fresh ones.
    const filtered = (byUnit.get(lo.unit) ?? []).filter((it) => it.loId !== lo.loId);
    byUnit.set(lo.unit, [...filtered, ...seedItems]);
    void bucket;
  }
  for (const [unit, items] of byUnit) {
    const file = path.join(OUT_DIR, `u${unit}.json`);
    fs.writeFileSync(file, JSON.stringify(items, null, 2) + '\n');
    console.log(`✓ wrote ${items.length} items -> ${path.relative(process.cwd(), file)}`);
  }

  const totalItems = perLoResults.reduce((s, r) => s + r.seedItems.length, 0);
  const shortLos = perLoResults.filter((r) => r.seedItems.length < 4).map((r) => `${r.lo.loId} (${r.seedItems.length})`);
  console.log(`\nDone. ${totalItems} items generated across ${perLoResults.length} LOs.`);
  if (shortLos.length) console.log(`LOs with <4 items: ${shortLos.join(', ')}`);
  // Rough cost estimate — Sonnet 5 intro pricing through 2026-08-31 is
  // $2/$10 per Mtok in/out (standard $3/$15 after) — informational only.
  const costEstimate = (usageIn / 1_000_000) * 2 + (usageOut / 1_000_000) * 10;
  console.log(`Token usage: ${usageIn} in / ${usageOut} out. Est. generation cost: $${costEstimate.toFixed(3)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
