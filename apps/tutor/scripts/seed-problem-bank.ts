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
 *   --batch                  Run the verify gate via the Anthropic Message
 *                            Batches API (50% of per-token rate) instead of
 *                            live concurrent calls. Submits all items as one
 *                            batch, polls every 30s (batches can take up to
 *                            24h, though minutes is typical). Requires the
 *                            content-verify role to target the Anthropic API
 *                            directly (no _BASE_URL override).
 *   --concurrency=6          Parallel verify calls (default 6, ignored with
 *                            --batch).
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
import { getModelClient, prepareParams, resolveModel } from '../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../src/lib/tutor/ai/model-rates';

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
  'grade-7-math': 'Grade 7 Math',
  'grade-7-ela': 'Grade 7 English Language Arts',
  'grade-7-life-science': 'Grade 7 Science',
  'grade-7-world-geography': 'Grade 7 World Geography',
  'grade-6-math': 'Grade 6 Math',
  'grade-6-ela': 'Grade 6 English Language Arts',
  'grade-6-earth-space-science': 'Grade 6 Science',
  'grade-6-world-geography': 'Grade 6 World Geography',
  'grade-8-math': 'Grade 8 Math',
  'grade-8-ela': 'Grade 8 English Language Arts',
  'grade-8-physical-science': 'Grade 8 Science',
  'grade-8-world-geography': 'Grade 8 World Geography',
  biology: 'Biology',
  'chemistry': 'Chemistry',
  'hs-english': 'HS English',
  'world-history': 'World History',
  cphq: 'CPHQ (Healthcare Quality)',
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
    batch: args.includes('--batch'),
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
  usageIn?: number;
  usageOut?: number;
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

/** Build the (already prepareParams()-passed) messages.create() params for
 *  the independent verify solve of one item. Shared by the sequential path
 *  (create() called directly) and the --batch path (wrapped into a
 *  BatchCreateParams.Request). */
function buildVerifyParams(model: string, item: SeedItem, courseName: string) {
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
    model,
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    system:
      `You are an expert ${courseName} exam grader verifying an answer key. Solve from scratch; do not assume the provided key is correct. Output only the requested JSON.`,
    messages: [{ role: 'user', content: `${instruction}\n\n${passageBlock}Question:\n${item.problemText}${choicesBlock}` }],
  };
  return prepareParams('content-verify', params);
}

/** Parse the raw text response for one item into a verdict: JSON-extraction
 *  first, then a letter/number fallback from prose, then compare against the
 *  answer key. Shared by the sequential and --batch paths. */
function parseVerdict(item: SeedItem, rawText: string): VerifyResult {
  const isMcq = item.responseFormat === 'mcq';
  const raw = rawText.trim();
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
  return {
    ok,
    modelAnswer,
    note: fell ? 'unparsed→fallback' : undefined,
  };
}

async function verifyItem(anthropic: Anthropic, model: string, item: SeedItem, courseName: string): Promise<VerifyResult> {
  const params = buildVerifyParams(model, item, courseName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = (await anthropic.messages.create(params as any)) as {
    content: Array<{ type: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const textBlock = msg.content.find((b) => b.type === 'text');
  const raw = textBlock && textBlock.text ? textBlock.text.trim() : '';
  const verdict = parseVerdict(item, raw);
  return {
    ...verdict,
    usageIn: msg.usage?.input_tokens,
    usageOut: msg.usage?.output_tokens,
  };
}

interface BatchVerifyOutcome {
  verdicts: VerifyResult[];
  usageIn: number;
  usageOut: number;
  batchId: string;
  wallClockMs: number;
}

/** Verify-at-ingest via the Anthropic Message Batches API (50% of the
 *  per-token live rate). Submits every item as one batch, polls every 30s
 *  (batches can take up to 24h to complete, though minutes is typical),
 *  then reconciles results — which arrive in ANY order — by `custom_id`. */
async function runBatchVerify(
  anthropic: Anthropic,
  verifierModel: string,
  items: SeedItem[],
  courseName: string,
): Promise<BatchVerifyOutcome> {
  const start = Date.now();
  // ProblemBank ids (e.g. "cphq-gen.quality-program....01") contain dots,
  // which fail the Batches API's custom_id pattern (^[a-zA-Z0-9_-]{1,64}$).
  // Use the array index as custom_id instead — results are still matched
  // back to items via this map, never by the order they arrive in.
  const batch = await anthropic.messages.batches.create({
    requests: items.map((item, i) => ({
      custom_id: String(i),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params: buildVerifyParams(verifierModel, item, courseName) as any,
    })),
  });
  console.log(`Batch ${batch.id} submitted (${items.length} requests). Polling every 30s (batches can take up to 24h — minutes is typical)...`);

  let status = batch;
  while (status.processing_status !== 'ended') {
    await new Promise((r) => setTimeout(r, 30_000));
    status = await anthropic.messages.batches.retrieve(batch.id);
    const elapsedMin = ((Date.now() - start) / 60_000).toFixed(1);
    console.log(`  …${status.processing_status} (${elapsedMin}m elapsed)`);
  }

  const byId = new Map<string, VerifyResult>();
  let usageIn = 0;
  let usageOut = 0;
  for await (const entry of await anthropic.messages.batches.results(batch.id)) {
    const idx = Number(entry.custom_id);
    const item = Number.isInteger(idx) ? items[idx] : undefined;
    if (!item) continue; // custom_id is always a valid index — defensive only.
    if (entry.result.type === 'succeeded') {
      const msg = entry.result.message;
      const textBlock = msg.content.find((b) => b.type === 'text') as { type: 'text'; text: string } | undefined;
      usageIn += msg.usage?.input_tokens ?? 0;
      usageOut += msg.usage?.output_tokens ?? 0;
      byId.set(entry.custom_id, parseVerdict(item, textBlock?.text?.trim() ?? ''));
    } else {
      byId.set(entry.custom_id, { ok: false, modelAnswer: '', note: `batch ${entry.result.type}` });
    }
  }
  const verdicts = items.map((_, i) => byId.get(String(i)) ?? { ok: false, modelAnswer: '', note: 'missing from batch results' });
  return { verdicts, usageIn, usageOut, batchId: batch.id, wallClockMs: Date.now() - start };
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
  let verifierModelUsed = 'unverified';
  if (opts.noVerify) {
    console.log('⚠️  --no-verify: skipping the Sonnet verify gate.');
  } else {
    if (!resolveModel('content-verify').apiKey) {
      console.error(
        '✗ No API key found for the content-verify role (checked TUTOR_MODEL_CONTENT_VERIFY_API_KEY, ' +
          'TUTOR_MODEL_API_KEY, and ANTHROPIC_API_KEY — needed for the verify gate). Use --no-verify to skip.'
      );
      process.exit(1);
    }
    if (opts.batch && !resolveModel('content-verify').native) {
      console.error('✗ --batch requires the Anthropic API (no _BASE_URL override)');
      process.exit(1);
    }
    const { client: anthropic, model: verifierModel } = getModelClient('content-verify');
    verifierModelUsed = verifierModel;
    const courseName = COURSE_NAMES[opts.course] ?? opts.course;
    let usageIn = 0;
    let usageOut = 0;
    let verdicts: VerifyResult[];
    let batchDiscount = false;
    if (opts.batch) {
      console.log(`\nVerifying ${items.length} items via ${verifierModel} using the Message Batches API (50% rate)...`);
      const outcome = await runBatchVerify(anthropic, verifierModel, items, courseName);
      verdicts = outcome.verdicts;
      usageIn = outcome.usageIn;
      usageOut = outcome.usageOut;
      batchDiscount = true;
      const wallClockMin = (outcome.wallClockMs / 60_000).toFixed(1);
      console.log(`Batch ${outcome.batchId} ended after ${wallClockMin}m.`);
      verdicts.forEach((r, i) => {
        if (!r.ok) console.log(`  ✗ MISMATCH ${items[i].id}: key='${items[i].answer}' model='${r.modelAnswer}'${r.note ? ' (' + r.note + ')' : ''}`);
      });
    } else {
      console.log(`\nVerifying ${items.length} items via ${verifierModel} (concurrency ${opts.concurrency})...`);
      let done = 0;
      verdicts = await runPool(items, opts.concurrency, async (item) => {
        let r: VerifyResult;
        try {
          r = await verifyItem(anthropic, verifierModel, item, courseName);
        } catch (e) {
          r = { ok: false, modelAnswer: '', note: `ERROR ${(e as Error).message}` };
        }
        done++;
        usageIn += r.usageIn ?? 0;
        usageOut += r.usageOut ?? 0;
        if (!r.ok) console.log(`  ✗ MISMATCH ${item.id}: key='${item.answer}' model='${r.modelAnswer}'${r.note ? ' (' + r.note + ')' : ''}`);
        if (done % 10 === 0) console.log(`  ...${done}/${items.length}`);
        return r;
      });
    }
    const failed = items.filter((_, i) => !verdicts[i].ok);
    verified = items.filter((_, i) => verdicts[i].ok);
    console.log(`\nVerify: ${verified.length}/${items.length} passed, ${failed.length} rejected.`);
    if (failed.length) {
      console.log('Rejected ids (excluded from upsert — review the answer keys):');
      failed.forEach((it) => console.log(`  - ${it.id}`));
    }
    const rate = lookupModelRate(verifierModel);
    let cost = rate ? (usageIn / 1e6) * rate.input + (usageOut / 1e6) * rate.output : undefined;
    if (cost !== undefined && batchDiscount) cost *= 0.5;
    console.log(
      `Token usage: ${usageIn} in / ${usageOut} out.` +
        (cost !== undefined
          ? ` Est. verify cost: $${cost.toFixed(3)} (informational${batchDiscount ? ', × 0.5 batch discount' : ''})`
          : ' (no rate row for this model)'),
    );
  }

  // Upsert.
  if (opts.dryRun) {
    console.log(`\nDRY RUN — nothing upserted (${verified.length} verified item(s) would have been upserted).`);
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.error('✗ MONGODB_URI not set. Use --dry-run to validate/verify without a DB.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const verifiedAt = new Date();
  const verifierModel = opts.noVerify ? 'unverified' : verifierModelUsed;
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
