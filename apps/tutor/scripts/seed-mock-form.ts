/**
 * Form-lint + verify + seed a mock-exam form (blueprint-backed, full-length
 * exam) from version-controlled JSON into Mongo.
 *
 * Content lives in `src/data/mock-forms/<dir>/{form.json,items.json}`
 * (git = source of truth). `form.json` is `{ formId, examKey, topicIds,
 * label, sections[] }` (status is NOT stored in the file — it's controlled
 * by `--go-live` at seed time); `items.json` is a `SeedableItem[]` array
 * (see src/lib/tutor/mock-exam/fixtures.ts).
 *
 * Mongo bootstrap + verifier pattern MIRROR scripts/seed-problem-bank.ts
 * (read it first) — a fresh-context Sonnet solve per mcq/numeric item as a
 * verify-at-ingest gate, same numeric tolerance + MCQ letter-prefix match.
 * FRQ items skip auto-solve (there's no single right answer to solve for)
 * and are instead checked for a rubric whose part points sum > 0 — both at
 * lint time (hard gate) and again at verify time for symmetry with the
 * mcq/numeric path.
 *
 * Usage:
 *   npm run seed:mock-form -- --form=<dirname> [flags]
 *
 * Flags:
 *   --form=fixture-form-a   REQUIRED. Dir under src/data/mock-forms/.
 *   --dry-run               Lint + verify, but do NOT write to Mongo (no
 *                            Mongo connection at all — item-presence checks
 *                            fall back to items.json only).
 *   --no-verify              Skip the Sonnet verify gate. Items are upserted
 *                            as drafts unverified, but CANNOT go live this
 *                            way — the live gate requires real verification.
 *   --lint-only              Stop after form-lint. No verify, no Mongo, no
 *                            writes.
 *   --go-live                Upsert MockForm with status 'live' instead of
 *                            'draft' — ONLY takes effect when lint passed
 *                            AND every item passed the real Sonnet verify
 *                            gate. Combining --go-live with --no-verify is
 *                            refused (see --force-live-unverified) — that
 *                            combo is exactly how an unverified/wrong answer
 *                            key (e.g. the fx-m2e-1 incident) would ship
 *                            live with zero verification.
 *   --force-live-unverified  Escape hatch: allows --no-verify --go-live to
 *                            publish live anyway. Prints a loud warning at
 *                            the go-live upsert naming the unverified item
 *                            count. Has no effect without both --no-verify
 *                            and --go-live.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { MockForm } from '../src/models/MockForm';
import { ProblemBank } from '../src/models/ProblemBank';
import { resolvePassage } from '../src/lib/tutor/passages/store';
import { getBlueprint, validateBlueprint } from '../src/lib/tutor/mock-exam/blueprints';
import { getModelClient, prepareParams, resolveModel } from '../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../src/lib/tutor/ai/model-rates';

const SOURCE = { name: 'Evelyn (original)' };
const LICENSE = 'internal-original';
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
// Strict numeric-literal check for lint (whole-string match — no trailing
// garbage like "42abc", which Number.isFinite(parseFloat(...)) would accept).
const NUMERIC_ANSWER_RE = /^-?\d+(?:\.\d+)?$/;

interface SeedableItem {
  id: string;
  loId: string;
  topic: string;
  topicId: string;
  difficulty: 1 | 2 | 3 | 4;
  responseFormat: 'mcq' | 'numeric' | 'frq';
  problemText: string;
  choices?: string[];
  answer: string;
  solutionText?: string;
  passageId?: string;
  bankScope: 'mock';
  rubric?: {
    parts: Array<{ criterionId: string; maxPoints: number; scoringCriteria: string; modelResponse: string }>;
  };
}

interface FormModule {
  moduleId: string;
  itemIds: string[];
}
interface FormSection {
  sectionId: string;
  modules: FormModule[];
}
interface FormFile {
  formId: string;
  examKey: string;
  topicIds: string[];
  label: string;
  sections: FormSection[];
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
    form: get('form'),
    dryRun: args.includes('--dry-run'),
    noVerify: args.includes('--no-verify'),
    lintOnly: args.includes('--lint-only'),
    goLive: args.includes('--go-live'),
    forceLiveUnverified: args.includes('--force-live-unverified'),
  };
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

function loadForm(dir: string): { form: FormFile; items: SeedableItem[] } {
  const formPath = path.join(dir, 'form.json');
  const itemsPath = path.join(dir, 'items.json');
  if (!fs.existsSync(formPath)) throw new Error(`form.json not found: ${formPath}`);
  if (!fs.existsSync(itemsPath)) throw new Error(`items.json not found: ${itemsPath}`);
  const form = JSON.parse(fs.readFileSync(formPath, 'utf-8')) as FormFile;
  const items = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));
  if (!Array.isArray(items)) throw new Error('items.json must be a JSON array');
  return { form, items: items as SeedableItem[] };
}

// ---------------------------------------------------------------------------
// Form-lint (always runs; no Mongo needed unless a missing itemId forces a
// Mongo lookup — see checkMongoId below).
// ---------------------------------------------------------------------------

interface LintResult {
  errors: string[];
  warnings: string[];
}

async function lintForm(
  form: FormFile,
  items: SeedableItem[],
  checkMongoId?: (id: string) => Promise<boolean>
): Promise<LintResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Blueprint exists + validateBlueprint clean.
  let bp;
  try {
    bp = getBlueprint(form.examKey);
  } catch (e) {
    errors.push(`blueprint not found for examKey '${form.examKey}': ${(e as Error).message}`);
    return { errors, warnings }; // nothing else can be checked without a blueprint
  }
  validateBlueprint(bp).forEach((p) => errors.push(`blueprint: ${p}`));

  // Per-item shape checks + duplicate-id detection within items.json.
  const itemsById = new Map<string, SeedableItem>();
  const seenItemIds = new Set<string>();
  for (const item of items) {
    if (!item.id) {
      errors.push('item missing id');
      continue;
    }
    if (seenItemIds.has(item.id)) errors.push(`duplicate item id in items.json: ${item.id}`);
    seenItemIds.add(item.id);
    itemsById.set(item.id, item);

    if (item.bankScope !== 'mock') errors.push(`${item.id}: bankScope must be 'mock' (got '${item.bankScope}')`);

    if (item.responseFormat === 'frq') {
      if (!item.rubric || !Array.isArray(item.rubric.parts) || item.rubric.parts.length === 0) {
        errors.push(`${item.id}: frq item missing rubric.parts`);
      } else {
        const sum = item.rubric.parts.reduce((s, p) => s + (p.maxPoints || 0), 0);
        if (!(sum > 0)) errors.push(`${item.id}: frq rubric parts sum to ${sum}, must be > 0`);
      }
    } else if (item.responseFormat === 'mcq') {
      if (!Array.isArray(item.choices) || item.choices.length < 3 || item.choices.length > 5) {
        errors.push(`${item.id}: mcq needs 3-5 choices`);
      } else {
        const idx = LETTERS.indexOf(item.answer);
        if (idx < 0 || idx >= item.choices.length) errors.push(`${item.id}: mcq answer '${item.answer}' out of choice range`);
      }
    } else if (item.responseFormat === 'numeric') {
      // Strict full-string check — parseFloat('42abc') === 42, so a loose
      // Number.isFinite(parseFloat(...)) check silently accepts trailing
      // garbage. Require the whole trimmed string to BE a numeric literal.
      if (!NUMERIC_ANSWER_RE.test(item.answer.trim())) errors.push(`${item.id}: numeric answer '${item.answer}' is not a strict numeric literal`);
    } else {
      errors.push(`${item.id}: unsupported responseFormat '${(item as { responseFormat?: string }).responseFormat}'`);
    }

    if (item.passageId && !resolvePassage(item.passageId)) {
      errors.push(`${item.id}: passageId '${item.passageId}' not in the passage registry`);
    }

    // KaTeX $-digit trap (currency renderer) — warn, don't fail.
    if (/\$(\d)/.test(item.problemText)) warnings.push(`${item.id}: problemText has $<digit> (currency/KaTeX trap)`);
  }

  // Form structure vs blueprint: section/module existence, questionCount
  // parity, itemId resolution (items.json or Mongo), no cross-form dupes.
  const seenFormItemIds = new Set<string>();
  for (const sec of form.sections) {
    const bpSec = bp.sections.find((s) => s.sectionId === sec.sectionId);
    if (!bpSec) {
      errors.push(`section '${sec.sectionId}': not found in blueprint '${form.examKey}'`);
      continue;
    }
    for (const mod of sec.modules) {
      const bpMod = bpSec.modules.find((m) => m.moduleId === mod.moduleId);
      if (!bpMod) {
        errors.push(`${sec.sectionId}/${mod.moduleId}: module not found in blueprint`);
        continue;
      }
      if (mod.itemIds.length !== bpMod.questionCount) {
        errors.push(
          `${sec.sectionId}/${mod.moduleId}: itemIds.length=${mod.itemIds.length} !== blueprint questionCount=${bpMod.questionCount}`
        );
      }
      for (const id of mod.itemIds) {
        if (seenFormItemIds.has(id)) errors.push(`duplicate itemId '${id}' referenced across form modules`);
        seenFormItemIds.add(id);

        if (!itemsById.has(id)) {
          if (checkMongoId) {
            const found = await checkMongoId(id);
            if (!found) errors.push(`${sec.sectionId}/${mod.moduleId}: itemId '${id}' not in items.json and not found in Mongo (bankScope:mock)`);
          } else {
            errors.push(`${sec.sectionId}/${mod.moduleId}: itemId '${id}' not in items.json (no Mongo check in lint-only/dry-run mode)`);
          }
        }
      }
    }
  }

  // Reverse walk (blueprint -> form): the forward walk above only catches
  // form modules that reference a NONEXISTENT blueprint section/module — a
  // form that's simply missing an entire blueprint section/module lint-
  // passes it. Every blueprint section and every blueprint module within it
  // must appear in the form. For adaptive sections this means BOTH the
  // easy-variant and hard-variant modules individually — a form that ships
  // only one branch of an adaptive section is broken (the routed-to variant
  // may never be servable).
  for (const bpSec of bp.sections) {
    const formSec = form.sections.find((s) => s.sectionId === bpSec.sectionId);
    if (!formSec) {
      errors.push(`blueprint section '${bpSec.sectionId}' is missing from the form`);
      continue;
    }
    for (const bpMod of bpSec.modules) {
      const formMod = formSec.modules.find((m) => m.moduleId === bpMod.moduleId);
      if (!formMod) {
        const variantNote = bpMod.variant ? ` (adaptive ${bpMod.variant}-variant module — required alongside its sibling variant)` : '';
        errors.push(`blueprint module '${bpSec.sectionId}/${bpMod.moduleId}'${variantNote} is missing from the form`);
      }
    }
  }

  // ap-composite: each FRQ-bearing section's rubric-point total must equal the
  // curve's final-anchor rawMax, or composite/section scoring silently drifts.
  if (bp.scoring.kind === 'ap-composite') {
    for (const sec of form.sections) {
      const anchors = bp.scoring.curves[sec.sectionId]?.default ?? [];
      if (!anchors.length) continue;
      const sectionItems = sec.modules.flatMap((m) => m.itemIds).map((id) => itemsById.get(id)).filter(Boolean) as SeedableItem[];
      const frqItems = sectionItems.filter((it) => it.responseFormat === 'frq');
      if (!frqItems.length) continue;
      const rubricSum = frqItems.reduce(
        (s, it) => s + (it.rubric?.parts ?? []).reduce((p, part) => p + (part.maxPoints || 0), 0), 0);
      const curveMax = anchors[anchors.length - 1][0];
      if (rubricSum !== curveMax) {
        errors.push(`${sec.sectionId}: FRQ rubric points sum ${rubricSum} != blueprint curve rawMax ${curveMax}`);
      }
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// Verify-at-ingest (independent Sonnet fresh-context solve) — mirrors
// scripts/seed-problem-bank.ts's verifyItem/parseNum/numericMatch. Not
// imported directly: that script doesn't export these helpers, and its
// SeedItem shape/CLI are entangled with the ProblemBank-course flow.
// ---------------------------------------------------------------------------

interface VerifyResult {
  ok: boolean;
  modelAnswer?: string;
  note?: string;
  usageIn?: number;
  usageOut?: number;
}

function parseNum(s: string): number {
  const t = s.trim().replace(/[,$\s]/g, '');
  if (/%$/.test(t)) {
    const n = parseFloat(t);
    return Number.isFinite(n) ? n / 100 : NaN;
  }
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const d = parseFloat(frac[2]);
    return d !== 0 ? parseFloat(frac[1]) / d : NaN;
  }
  return parseFloat(t);
}
function numericMatch(expected: string, got: string): boolean {
  const a = parseNum(got);
  const b = parseNum(expected);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const tol = Math.max(0.01, Math.abs(b) * 0.01);
  return Math.abs(a - b) <= tol;
}

async function verifyItem(anthropic: Anthropic, model: string, item: SeedableItem): Promise<VerifyResult> {
  const isMcq = item.responseFormat === 'mcq';
  const choicesBlock = isMcq ? '\n' + item.choices!.map((c, i) => `${LETTERS[i]}. ${c}`).join('\n') : '';
  const passage = item.passageId ? resolvePassage(item.passageId) : undefined;
  const passageBlock = passage
    ? `Stimulus — ${passage.title} (${passage.author}, ${passage.year}):\n${passage.fullText}\n\n`
    : '';
  const instruction = isMcq
    ? `Solve this ${item.topic} multiple-choice question independently. Respond with ONLY a JSON object: {"answer":"<letter A-E>"}.`
    : `Solve this ${item.topic} question independently. Respond with ONLY a JSON object: {"answer":"<numeric value only, no units>"}.`;

  // Newer body fields (adaptive thinking, output_config.effort) aren't in the
  // installed SDK's types but serialize over the wire — cast to bypass TS.
  const params = {
    model,
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    system:
      `You are an expert ${item.topic} exam grader verifying an answer key. Solve from scratch; do not assume the provided key is correct. Output only the requested JSON.`,
    messages: [{ role: 'user', content: `${instruction}\n\n${passageBlock}Question:\n${item.problemText}${choicesBlock}` }],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = (await anthropic.messages.create(prepareParams('content-verify', params) as any)) as {
    content: Array<{ type: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

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
      const lm = raw.match(/\b([A-E])\b/);
      modelAnswer = lm ? lm[1] : raw.slice(0, 4);
    } else {
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
    usageIn: msg.usage?.input_tokens,
    usageOut: msg.usage?.output_tokens,
  };
}

/** FRQ items skip auto-solve — check the rubric part points sum > 0
 *  instead. (Lint already hard-gates this; re-checked here so the verify
 *  pass has a uniform per-item ok/fail signal for the go-live gate.) */
function verifyFrqItem(item: SeedableItem): VerifyResult {
  const sum = (item.rubric?.parts ?? []).reduce((s, p) => s + (p.maxPoints || 0), 0);
  return { ok: sum > 0, note: 'frq: rubric-points check (no auto-solve)' };
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
  if (!opts.form) {
    console.error('✗ --form=<dirname> is required (e.g. --form=fixture-form-a)');
    process.exit(1);
  }
  // The live gate's intent is "live requires lint clean AND every item
  // verified". --no-verify --go-live would otherwise promote a form to
  // 'live' with ZERO verification behind a generic banner — that exact
  // combo is how a wrong answer key (fx-m2e-1) shipped live locally before
  // a real verify run caught it. Refuse it unless explicitly forced.
  if (opts.noVerify && opts.goLive && !opts.forceLiveUnverified) {
    console.error(
      "✗ --no-verify --go-live refused: this would publish a form 'live' with zero verification.\n" +
        '  Pick one:\n' +
        '    - drop --go-live (seeds/updates as status=draft, no gate)\n' +
        '    - drop --no-verify (runs the real Sonnet verify gate; live iff every item passes)\n' +
        '    - add --force-live-unverified (publishes live anyway; prints a loud unverified-item warning)'
    );
    process.exit(1);
  }
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

  const formDir = path.join(__dirname, '..', 'src', 'data', 'mock-forms', opts.form);
  if (!fs.existsSync(formDir)) {
    console.error(`✗ form dir not found: ${formDir}`);
    process.exit(1);
  }

  const { form, items } = loadForm(formDir);
  console.log(`Loaded form '${form.formId}' (examKey=${form.examKey}) with ${items.length} items from ${opts.form}`);

  // Mongo is needed only when we're actually going to write (i.e. not
  // --lint-only and not --dry-run). When connected, the lint's missing-item
  // check also consults ProblemBank (bankScope:'mock'), not just items.json.
  const mongoNeeded = !opts.lintOnly && !opts.dryRun;
  let checkMongoId: ((id: string) => Promise<boolean>) | undefined;
  if (mongoNeeded) {
    if (!process.env.MONGODB_URI) {
      console.error('✗ MONGODB_URI not set. Use --dry-run or --lint-only to lint without a DB.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Bank = ProblemBank as any;
    checkMongoId = async (id: string) => !!(await Bank.findOne({ id, bankScope: 'mock' }).lean());
  }

  // --- Form-lint (always) ---
  const { errors, warnings } = await lintForm(form, items, checkMongoId);
  console.log(`\nForm-lint: ${errors.length} error(s), ${warnings.length} warning(s).`);
  warnings.forEach((w) => console.log(`  [warn] ${w}`));
  errors.forEach((e) => console.log(`  [FAIL] ${e}`));

  if (errors.length) {
    console.error(`\n✗ Form-lint failed. Fix before seeding.`);
    if (mongoNeeded) await mongoose.disconnect();
    process.exit(1);
  }
  console.log('✓ Form-lint passed.');

  if (opts.lintOnly) {
    console.log('\n--lint-only: stopping here (no verify, no writes).');
    if (mongoNeeded) await mongoose.disconnect();
    return;
  }

  // --- Verify (unless --no-verify) ---
  // allVerified specifically means "every item passed the REAL Sonnet
  // verify gate" — with --no-verify nothing was actually verified, so this
  // stays false (the live gate below requires --force-live-unverified to
  // publish anyway; see the early --no-verify/--go-live guard above).
  let allVerified = true;
  let verifiedItems: SeedableItem[] = items;
  let verifierModelUsed = 'unverified';
  if (opts.noVerify) {
    console.log('\n⚠️  --no-verify: skipping the Sonnet verify gate (items are NOT verified; upserted as unverified drafts).');
    allVerified = false;
  } else {
    if (!resolveModel('content-verify').apiKey) {
      console.error(
        '✗ No API key found for the content-verify role (checked TUTOR_MODEL_CONTENT_VERIFY_API_KEY, ' +
          'TUTOR_MODEL_API_KEY, and ANTHROPIC_API_KEY — needed for the verify gate). Use --no-verify to skip.'
      );
      if (mongoNeeded) await mongoose.disconnect();
      process.exit(1);
    }
    const { client: anthropic, model: verifierModel } = getModelClient('content-verify');
    verifierModelUsed = verifierModel;
    console.log(`\nVerifying ${items.length} items via ${verifierModel}...`);
    let done = 0;
    let usageIn = 0;
    let usageOut = 0;
    const verdicts = await runPool(items, 6, async (item) => {
      let r: VerifyResult;
      try {
        r = item.responseFormat === 'frq' ? verifyFrqItem(item) : await verifyItem(anthropic, verifierModel, item);
      } catch (e) {
        r = { ok: false, note: `ERROR ${(e as Error).message}` };
      }
      done++;
      usageIn += r.usageIn ?? 0;
      usageOut += r.usageOut ?? 0;
      if (!r.ok) {
        console.log(
          `  ✗ MISMATCH ${item.id}${r.modelAnswer !== undefined ? `: key='${item.answer}' model='${r.modelAnswer}'` : ''}${r.note ? ' (' + r.note + ')' : ''}`
        );
      }
      if (done % 10 === 0) console.log(`  ...${done}/${items.length}`);
      return r;
    });
    const failed = items.filter((_, i) => !verdicts[i].ok);
    verifiedItems = items.filter((_, i) => verdicts[i].ok);
    allVerified = failed.length === 0;
    console.log(`\nVerify: ${verifiedItems.length}/${items.length} passed, ${failed.length} rejected.`);
    if (failed.length) {
      console.log('Rejected ids (excluded from upsert — review the answer keys/rubrics):');
      failed.forEach((it) => console.log(`  - ${it.id}`));
    }
    const rate = lookupModelRate(verifierModel);
    const cost = rate ? (usageIn / 1e6) * rate.input + (usageOut / 1e6) * rate.output : undefined;
    console.log(
      `Token usage: ${usageIn} in / ${usageOut} out.` +
        (cost !== undefined ? ` Est. verify cost: $${cost.toFixed(3)} (informational)` : ' (no rate row for this model)'),
    );
  }

  // --- Upsert (skipped for --dry-run) ---
  // Live requires lint clean (already enforced above) AND every item really
  // verified, OR the explicit --force-live-unverified override (only
  // reachable at all when --no-verify was combined with it, per the early
  // guard — --force-live-unverified does not override a genuine verify
  // FAILURE when real verification ran).
  const forcedLive = opts.goLive && opts.noVerify && opts.forceLiveUnverified;
  const targetStatus: 'draft' | 'live' = (opts.goLive && allVerified) || forcedLive ? 'live' : 'draft';
  if (opts.dryRun) {
    console.log(
      `\n[dry-run] Would upsert ${verifiedItems.length}/${items.length} items + form '${form.formId}' (status=${targetStatus}). No DB write.`
    );
    return;
  }

  const verifiedAt = new Date();
  const verifierModel = opts.noVerify ? 'unverified' : verifierModelUsed;
  // Mongoose models here are exported as a `models.X || model(...)` union —
  // cast for calls (matches seed-problem-bank.ts).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Bank = ProblemBank as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Form = MockForm as any;

  let upserted = 0;
  for (const item of verifiedItems) {
    await Bank.updateOne(
      { id: item.id },
      {
        $set: {
          id: item.id,
          topic: item.topic,
          topicId: item.topicId,
          loId: item.loId,
          difficulty: item.difficulty,
          responseFormat: item.responseFormat,
          problemText: item.problemText,
          answer: item.answer,
          choices: item.choices ?? [],
          solutionText: item.solutionText,
          passageId: item.passageId,
          rubric: item.rubric,
          bankScope: 'mock',
          source: SOURCE,
          license: LICENSE,
          verifiedAt,
          verifierModel,
        },
      },
      { upsert: true }
    );
    upserted++;
  }
  console.log(`✓ Upserted ${upserted} item(s) into ProblemBank (bankScope=mock).`);

  if (targetStatus === 'live' && forcedLive) {
    console.log(
      `\n🚨🚨🚨 FORCING '${form.formId}' LIVE WITH ${verifiedItems.length} UNVERIFIED ITEM(S) 🚨🚨🚨\n` +
        '   --force-live-unverified was set: the Sonnet verify gate did NOT run for these items.\n' +
        '   This is exactly how the fx-m2e-1 wrong-answer-key incident happened. Confirm this is intentional.'
    );
  }

  await Form.updateOne(
    { formId: form.formId },
    {
      $set: {
        formId: form.formId,
        examKey: form.examKey,
        topicIds: form.topicIds,
        label: form.label,
        status: targetStatus,
        sections: form.sections,
      },
    },
    { upsert: true }
  );
  const liveNote =
    opts.goLive && targetStatus === 'draft'
      ? ' (requested --go-live but not all items passed real verification — left as draft; use --force-live-unverified with --no-verify to override)'
      : forcedLive
        ? ' (FORCED live via --force-live-unverified — unverified)'
        : '';
  console.log(`✓ Upserted MockForm '${form.formId}' with status='${targetStatus}'.${liveNote}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
