/**
 * Seed the ProblemBank Mongo collection from version-controlled JSON seed files.
 *
 * Content lives in `src/data/problem-bank/<course>/*.json` (git = source of
 * truth). This script validates each item, runs an INDEPENDENT fresh-context
 * Sonnet solve as a verify-at-ingest gate (the ProblemBank contract requires a
 * verifiedAt/verifierModel stamp), and idempotently upserts verified rows by
 * stable `id`.
 *
 * Items are ORIGINAL, authored for the bank (license 'internal-original') — not
 * scraped or transcribed. See project_ap_stats_content_build (Phase B).
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-problem-bank.ts [flags]
 *
 * Flags:
 *   --course=ap-statistics   Which course dir to seed (default ap-statistics).
 *   --dry-run                Validate + verify, but do NOT write to Mongo.
 *   --no-verify              Skip the Sonnet verify gate (fast re-seed of
 *                            already-verified content). Not recommended for
 *                            first ingest.
 *   --concurrency=6          Parallel verify calls (default 6).
 *   --limit=N                Only process the first N items (smoke test).
 *   --file=u1.json           Only this file within the course dir.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { ProblemBank } from '../src/models/ProblemBank';
import { resolvePassage } from '../src/lib/tutor/passages/store';

const VERIFIER_MODEL = 'claude-sonnet-5';
// Display names for the verify prompt (fall back to the dir name if unlisted).
const COURSE_NAMES: Record<string, string> = {
  'ap-statistics': 'AP Statistics',
  'ap-calculus-bc': 'AP Calculus BC',
  'ap-english-language': 'AP English Language and Composition',
  'ap-us-history': 'AP US History',
  'ap-world-history': 'AP World History: Modern',
  'ap-us-government': 'AP US Government and Politics',
  'digital-sat': 'Digital SAT',
  act: 'ACT',
  'algebra-1': 'Algebra 1',
  'geometry': 'Geometry',
  biology: 'Biology',
  'chemistry': 'Chemistry',
};
// topic/topicId are derived from the --course dir name at upsert (the course
// dir matches the engine topic, e.g. ap-statistics, ap-calculus-bc).
const SOURCE = { name: 'Evelyn (original)' };
const LICENSE = 'internal-original';

interface SeedItem {
  id: string;
  loId: string;
  cedCode: string;
  difficulty: 1 | 2 | 3 | 4;
  responseFormat: 'mcq' | 'numeric';
  problemText: string;
  choices?: string[];
  answer: string;
  hints?: string[];
  passageId?: string;
}

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name: string, dflt?: string): string | undefined => {
    const a = args.find((x) => x.startsWith(`--${name}=`));
    return a ? a.split('=').slice(1).join('=') : dflt;
  };
  return {
    course: get('course', 'ap-statistics')!,
    dryRun: args.includes('--dry-run'),
    noVerify: args.includes('--no-verify'),
    concurrency: parseInt(get('concurrency', '6')!, 10) || 6,
    limit: get('limit') ? parseInt(get('limit')!, 10) : undefined,
    file: get('file'),
  };
}

// ---------------------------------------------------------------------------
// Load + validate
// ---------------------------------------------------------------------------

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function validate(item: SeedItem, seenIds: Set<string>): string[] {
  const errs: string[] = [];
  if (!item.id) errs.push('missing id');
  else if (seenIds.has(item.id)) errs.push(`duplicate id ${item.id}`);
  if (!item.loId) errs.push('missing loId');
  if (!item.cedCode) errs.push('missing cedCode');
  if (![1, 2, 3, 4].includes(item.difficulty)) errs.push(`bad difficulty ${item.difficulty}`);
  if (!item.problemText || item.problemText.trim().length < 10) errs.push('problemText too short');
  if (item.responseFormat === 'mcq') {
    if (!Array.isArray(item.choices) || item.choices.length < 3 || item.choices.length > 5) {
      errs.push('mcq needs 3-5 choices');
    } else {
      const idx = LETTERS.indexOf(item.answer);
      if (idx < 0 || idx >= item.choices.length) errs.push(`mcq answer '${item.answer}' out of choice range`);
    }
  } else if (item.responseFormat === 'numeric') {
    if (!Number.isFinite(parseFloat(item.answer))) errs.push(`numeric answer '${item.answer}' not a number`);
  } else {
    errs.push(`unsupported responseFormat ${(item as { responseFormat?: string }).responseFormat}`);
  }
  if (item.passageId && !resolvePassage(item.passageId)) {
    errs.push(`passageId '${item.passageId}' not in the passage registry`);
  }
  // KaTeX $-digit trap (currency renderer) — warn, don't fail.
  const re = /\$(\d)/;
  if (re.test(item.problemText)) errs.push('WARN problemText has $<digit> (currency/KaTeX trap)');
  return errs;
}

function loadItems(courseDir: string, onlyFile?: string): SeedItem[] {
  const files = fs
    .readdirSync(courseDir)
    .filter((f) => f.endsWith('.json') && (!onlyFile || f === onlyFile))
    .sort();
  const items: SeedItem[] = [];
  for (const f of files) {
    const parsed = JSON.parse(fs.readFileSync(path.join(courseDir, f), 'utf-8'));
    if (!Array.isArray(parsed)) throw new Error(`${f} is not a JSON array`);
    items.push(...parsed);
  }
  return items;
}

// ---------------------------------------------------------------------------
// Verify-at-ingest (independent Sonnet fresh-context solve)
// ---------------------------------------------------------------------------

interface VerifyResult {
  ok: boolean;
  modelAnswer: string;
  note?: string;
}

/** Parse a numeric answer that may be a decimal, a fraction (a/b), or a percent
 *  — so the verifier treats "2/5", "0.4", and "40%" as equal (the model often
 *  returns a fraction where the key is a decimal). */
function parseNum(s: string): number {
  const t = s.trim().replace(/[,$\s]/g, '');
  if (/%$/.test(t)) { const n = parseFloat(t); return Number.isFinite(n) ? n / 100 : NaN; }
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) { const d = parseFloat(frac[2]); return d !== 0 ? parseFloat(frac[1]) / d : NaN; }
  return parseFloat(t);
}
function numericMatch(expected: string, got: string): boolean {
  const a = parseNum(got);
  const b = parseNum(expected);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const tol = Math.max(0.01, Math.abs(b) * 0.01);
  return Math.abs(a - b) <= tol;
}

async function verifyItem(anthropic: Anthropic, item: SeedItem, courseName: string): Promise<VerifyResult> {
  const isMcq = item.responseFormat === 'mcq';
  const choicesBlock = isMcq
    ? '\n' + item.choices!.map((c, i) => `${LETTERS[i]}. ${c}`).join('\n')
    : '';
  // Passage-based items (humanities courses) can't be solved from the stem
  // alone — feed the verifier the same stimulus the student sees.
  const passage = item.passageId ? resolvePassage(item.passageId) : undefined;
  const passageBlock = passage
    ? `Stimulus — ${passage.title} (${passage.author}, ${passage.year}):\n${passage.fullText}\n\n`
    : '';
  const instruction = isMcq
    ? `Solve this ${courseName} multiple-choice question independently. Respond with ONLY a JSON object: {"answer":"<letter A-E>"}.`
    : `Solve this ${courseName} question independently. Respond with ONLY a JSON object: {"answer":"<numeric value only, no units>"}.`;

  // Newer body fields (adaptive thinking, output_config.effort) aren't in the
  // installed SDK's types but serialize over the wire — cast to bypass TS.
  const params = {
    model: VERIFIER_MODEL,
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    system:
      `You are an expert ${courseName} exam grader verifying an answer key. Solve from scratch; do not assume the provided key is correct. Output only the requested JSON.`,
    messages: [{ role: 'user', content: `${instruction}\n\n${passageBlock}Question:\n${item.problemText}${choicesBlock}` }],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = (await anthropic.messages.create(params as any)) as { content: Array<{ type: string; text?: string }> };

  const textBlock = msg.content.find((b) => b.type === 'text');
  const raw = textBlock && textBlock.text ? textBlock.text.trim() : '';
  const jsonMatch = raw.match(/\{[^}]*"answer"\s*:\s*"([^"]*)"[^}]*\}/);
  let modelAnswer: string;
  let fell = false;
  if (jsonMatch) {
    modelAnswer = jsonMatch[1].trim();
  } else {
    fell = true;
    if (isMcq) {
      // First standalone A-E letter in the prose.
      const lm = raw.match(/\b([A-E])\b/);
      modelAnswer = lm ? lm[1] : raw.slice(0, 4);
    } else {
      // First numeric token in the prose.
      const nm = raw.match(/-?\d+(?:\.\d+)?/);
      modelAnswer = nm ? nm[0] : raw.slice(0, 12);
    }
  }

  const ok = isMcq
    ? modelAnswer.toUpperCase().startsWith(item.answer.toUpperCase())
    : numericMatch(item.answer, modelAnswer);
  return { ok, modelAnswer, note: fell ? 'unparsed→fallback' : undefined };
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
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

  const courseDir = path.join(__dirname, '..', 'src', 'data', 'problem-bank', opts.course);
  if (!fs.existsSync(courseDir)) {
    console.error(`✗ course dir not found: ${courseDir}`);
    process.exit(1);
  }

  let items = loadItems(courseDir, opts.file);
  if (opts.limit) items = items.slice(0, opts.limit);
  console.log(`Loaded ${items.length} items from ${opts.course}${opts.file ? '/' + opts.file : ''}`);

  // Validate.
  const seen = new Set<string>();
  let hardErrors = 0;
  for (const item of items) {
    const errs = validate(item, seen);
    seen.add(item.id);
    const hard = errs.filter((e) => !e.startsWith('WARN'));
    if (errs.length) console.log(`  [${hard.length ? 'FAIL' : 'warn'}] ${item.id}: ${errs.join('; ')}`);
    hardErrors += hard.length;
  }
  if (hardErrors) {
    console.error(`\n✗ ${hardErrors} validation error(s). Fix before seeding.`);
    process.exit(1);
  }
  const byFmt = items.reduce((a, it) => ((a[it.responseFormat] = (a[it.responseFormat] || 0) + 1), a), {} as Record<string, number>);
  console.log(`Validation OK. Formats: ${JSON.stringify(byFmt)}`);

  // Verify.
  let verified = items;
  if (opts.noVerify) {
    console.log('⚠️  --no-verify: skipping the Sonnet verify gate.');
  } else {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('✗ ANTHROPIC_API_KEY not set (needed for the verify gate). Use --no-verify to skip.');
      process.exit(1);
    }
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const courseName = COURSE_NAMES[opts.course] ?? opts.course;
    console.log(`\nVerifying ${items.length} items via ${VERIFIER_MODEL} (concurrency ${opts.concurrency})...`);
    let done = 0;
    const verdicts = await runPool(items, opts.concurrency, async (item) => {
      let r: VerifyResult;
      try {
        r = await verifyItem(anthropic, item, courseName);
      } catch (e) {
        r = { ok: false, modelAnswer: '', note: `ERROR ${(e as Error).message}` };
      }
      done++;
      if (!r.ok) console.log(`  ✗ MISMATCH ${item.id}: key='${item.answer}' model='${r.modelAnswer}'${r.note ? ' (' + r.note + ')' : ''}`);
      if (done % 10 === 0) console.log(`  ...${done}/${items.length}`);
      return r;
    });
    const failed = items.filter((_, i) => !verdicts[i].ok);
    verified = items.filter((_, i) => verdicts[i].ok);
    console.log(`\nVerify: ${verified.length}/${items.length} passed, ${failed.length} rejected.`);
    if (failed.length) {
      console.log('Rejected ids (excluded from upsert — review the answer keys):');
      failed.forEach((it) => console.log(`  - ${it.id}`));
    }
  }

  // Upsert.
  if (opts.dryRun) {
    console.log(`\n[dry-run] Would upsert ${verified.length} verified items. No DB write.`);
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI not set. Use --dry-run to validate/verify without a DB.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const verifiedAt = new Date();
  const verifierModel = opts.noVerify ? 'unverified' : VERIFIER_MODEL;
  let up = 0;
  // ProblemBank is exported as a `models.X || model(...)` union — cast for calls.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Bank = ProblemBank as any;
  for (const item of verified) {
    await Bank.updateOne(
      { id: item.id },
      {
        $set: {
          id: item.id,
          topic: opts.course,
          topicId: opts.course,
          loId: item.loId,
          cedCode: item.cedCode,
          passageId: item.passageId,
          difficulty: item.difficulty,
          problemText: item.problemText,
          answer: item.answer,
          responseFormat: item.responseFormat,
          choices: item.choices ?? [],
          hints: item.hints ?? [],
          source: SOURCE,
          license: LICENSE,
          verifiedAt,
          verifierModel,
        },
      },
      { upsert: true },
    );
    up++;
  }
  await mongoose.disconnect();
  console.log(`\n✓ Upserted ${up} items into ProblemBank (topic=${opts.course}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
