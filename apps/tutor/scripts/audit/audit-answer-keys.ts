/**
 * Answer-key audit — independently validates every practice item's stored key.
 *
 *   Stage 1  blind solve      (question + options only — NEVER the stored key)
 *   Stage 2  compare          (deterministic first; model judge for the rest)
 *   Stage 3  tie-break solve  (fresh context, deeper thinking) on any non-agreement
 *
 * Works purely from a JSON worklist file. It opens NO database connection and
 * reads NO .env file: the only credential is ANTHROPIC_API_KEY from the process
 * environment. Output is written only under --out. See README.md next to this
 * file for usage.
 *
 *   npx tsx scripts/audit/audit-answer-keys.ts --in <worklist.json> --out <dir> [filters]
 */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { resolveModel } from '../../src/lib/tutor/ai/model-registry';
import { lookupModelRate } from '../../src/lib/tutor/ai/model-rates';
import {
  afterStage2,
  afterTiebreak,
  compareDeterministic,
  compareMcq,
  csvCell,
  keyedLetterOf,
  parseWorklist,
  plannedCalls,
  resolveOptionLetter,
  solverViewOf,
  type Item,
  type JudgeVerdict,
  type Verdict,
} from './compare';
import { buildJudgePrompt, buildReviewPrompt, buildSolverPrompt, type Prompt } from './prompts';

// ── CLI ─────────────────────────────────────────────────────────────────────

interface Args {
  in: string;
  out: string;
  source?: string[];
  course?: string[];
  format?: string[];
  idsFile?: string;
  limit?: number;
  offset: number;
  concurrency: number;
  stage1Only: boolean;
  resume: boolean;
  retryErrors: boolean;
  dryRun: boolean;
  itemTimeoutMs: number;
  tiebreakModel?: string;
  tiebreakEffort: string;
  solveEffort: string;
}

const USAGE = `Usage: npx tsx scripts/audit/audit-answer-keys.ts --in <worklist.json> --out <dir> [options]

  --source a,b        only these sources          --course a,b   only these courses
  --format a,b        only these formats          --ids-file f   only ids listed in f (one per line, or a JSON array)
  --offset N          skip the first N selected   --limit N      process at most N
  --concurrency N     parallel items (default 6)
  --stage1-only       blind solve + deterministic compare only (no judge, no tie-break); results are partial
  --resume / --no-resume   skip items already in <dir>/results.jsonl (default: on)
  --retry-errors      re-run items whose stored verdict is ERROR
  --dry-run           print what would be processed and the estimated model calls; make no calls
  --item-timeout S    per-item timeout in seconds (default 600)
  --solve-effort E    effort for blind solve (default medium)
  --tiebreak-effort E effort for the tie-break solve (default xhigh)
  --tiebreak-model M  model id for the tie-break (default: the content-verify model)`;

function parseArgs(argv: string[]): Args {
  const a: Args = {
    in: '', out: '', offset: 0, concurrency: 6, stage1Only: false, resume: true, retryErrors: false,
    dryRun: false, itemTimeoutMs: 600_000, tiebreakEffort: 'xhigh', solveEffort: 'medium',
  };
  const list = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean);
  const int = (flag: string, v: string) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0) throw new Error(`${flag} needs a non-negative integer`);
    return n;
  };
  for (let i = 0; i < argv.length; i++) {
    const f = argv[i];
    const val = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${f} needs a value`);
      return v;
    };
    switch (f) {
      case '--in': a.in = val(); break;
      case '--out': a.out = val(); break;
      case '--source': a.source = list(val()); break;
      case '--course': a.course = list(val()); break;
      case '--format': a.format = list(val()); break;
      case '--ids-file': a.idsFile = val(); break;
      case '--limit': a.limit = int(f, val()); break;
      case '--offset': a.offset = int(f, val()); break;
      case '--concurrency': a.concurrency = Math.max(1, int(f, val())); break;
      case '--stage1-only': a.stage1Only = true; break;
      case '--resume': a.resume = true; break;
      case '--no-resume': a.resume = false; break;
      case '--retry-errors': a.retryErrors = true; break;
      case '--dry-run': a.dryRun = true; break;
      case '--item-timeout': a.itemTimeoutMs = int(f, val()) * 1000; break;
      case '--solve-effort': a.solveEffort = val(); break;
      case '--tiebreak-effort': a.tiebreakEffort = val(); break;
      case '--tiebreak-model': a.tiebreakModel = val(); break;
      case '-h': case '--help': console.log(USAGE); process.exit(0);
      default: throw new Error(`unknown argument: ${f}`);
    }
  }
  if (!a.in || !a.out) throw new Error('--in and --out are required');
  return a;
}

// ── records ─────────────────────────────────────────────────────────────────

interface Usage { calls: number; input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number }
const zeroUsage = (): Usage => ({ calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, costUsd: 0 });
function addUsage(into: Usage, u: Usage) {
  into.calls += u.calls; into.input += u.input; into.output += u.output;
  into.cacheRead += u.cacheRead; into.cacheWrite += u.cacheWrite; into.costUsd += u.costUsd;
}

interface SolveOut {
  illPosed: boolean;
  illPosedReason: string;
  /** Values/conventions the solver had to assume because the question omits them. */
  assumptions: string;
  option: string | null;
  answer: string;
  justification: string;
}
interface CompareOut { verdict: JudgeVerdict; method: string; reason: string }

interface ResultRecord {
  id: string;
  course: string;
  source: string;
  format: string;
  question: string;
  storedKey: string | null;
  /** MCQ only: the option the key resolves to, e.g. "B) x = 2 or x = -12". */
  keyedOption?: string | null;
  verdict: Verdict | null; // null only on --stage1-only partial records
  partial?: boolean;
  path: string; // which stages ran, e.g. "solve>judge>tiebreak"
  tiebreakOutcome?: string;
  blind?: SolveOut;
  compare?: CompareOut;
  tiebreak?: SolveOut & { vsKey?: CompareOut; vsBlind?: CompareOut };
  review?: { verdict: 'OK' | 'PROBLEM'; problemIn: string; reason: string; rubricAvailable: boolean };
  reason: string;
  usage: Usage;
  models: { solve: string; judge: string; tiebreak: string };
  ms: number;
  at: string;
}

// ── model calls ─────────────────────────────────────────────────────────────

class NonRetryable extends Error {}

function isRetryable(e: unknown): boolean {
  if (e instanceof NonRetryable) return false;
  if (e instanceof Anthropic.APIUserAbortError) return false;
  if (e instanceof Anthropic.RateLimitError) return true;
  if (e instanceof Anthropic.APIConnectionError) return true; // includes timeouts
  if (e instanceof Anthropic.InternalServerError) return true; // 5xx incl. 529 overloaded
  if (e instanceof Anthropic.APIError) return e.status === 408 || e.status === 409 || (e.status ?? 0) >= 500;
  const msg = e instanceof Error ? e.message : String(e);
  return /overloaded|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up|fetch failed|terminated/i.test(msg);
}

function retryAfterMs(e: unknown): number | null {
  if (!(e instanceof Anthropic.APIError)) return null;
  const h = e.headers as unknown;
  let raw: string | null | undefined;
  if (h && typeof (h as Headers).get === 'function') raw = (h as Headers).get('retry-after');
  else if (h && typeof h === 'object') raw = (h as Record<string, string>)['retry-after'];
  const s = raw ? Number(raw) : NaN;
  return Number.isFinite(s) && s > 0 ? Math.min(s, 120) * 1000 : null;
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(new Error('aborted')); }, { once: true });
  });

function parseJsonLoose(text: string): Record<string, unknown> {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(t);
  } catch {
    const s = t.indexOf('{');
    const e = t.lastIndexOf('}');
    if (s >= 0 && e > s) return JSON.parse(t.slice(s, e + 1));
    throw new NonRetryable(`model reply was not JSON: ${t.slice(0, 120)}`);
  }
}

interface CallOpts { model: string; effort: string; maxTokens: number; signal: AbortSignal; usage: Usage }

const MAX_ATTEMPTS = 6;

async function callJson(client: Anthropic, prompt: Prompt, o: CallOpts): Promise<Record<string, unknown>> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (o.signal.aborted) throw new Error('item timed out');
    try {
      // Streamed so a long thinking pass cannot hit an idle HTTP timeout.
      const stream = client.messages.stream(
        {
          model: o.model,
          max_tokens: o.maxTokens,
          system: prompt.system,
          messages: [{ role: 'user', content: prompt.user }],
          thinking: { type: 'adaptive' },
          output_config: { effort: o.effort, format: { type: 'json_schema', schema: prompt.schema } },
        } as unknown as Anthropic.MessageStreamParams,
        { signal: o.signal },
      );
      const msg = await stream.finalMessage();
      const u = msg.usage;
      const rate = lookupModelRate(o.model);
      const call: Usage = {
        calls: 1,
        input: u.input_tokens ?? 0,
        output: u.output_tokens ?? 0,
        cacheRead: u.cache_read_input_tokens ?? 0,
        cacheWrite: u.cache_creation_input_tokens ?? 0,
        costUsd: 0,
      };
      if (rate) {
        call.costUsd =
          (call.input * rate.input + call.output * rate.output +
            call.cacheRead * (rate.cacheRead ?? rate.input * 0.1) +
            call.cacheWrite * (rate.cacheWrite5m ?? rate.input * 1.25)) / 1e6;
      }
      addUsage(o.usage, call);
      if (msg.stop_reason === 'refusal') throw new NonRetryable('model declined the request (stop_reason=refusal)');
      if (msg.stop_reason === 'max_tokens') throw new NonRetryable(`reply truncated at max_tokens=${o.maxTokens}`);
      const text = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
      if (!text.trim()) throw new NonRetryable(`empty reply (stop_reason=${msg.stop_reason})`);
      return parseJsonLoose(text);
    } catch (e) {
      lastErr = e;
      if (o.signal.aborted) throw new Error('item timed out');
      if (!isRetryable(e) || attempt === MAX_ATTEMPTS) throw e;
      const backoff = retryAfterMs(e) ?? Math.min(60_000, 1500 * 2 ** (attempt - 1)) * (0.75 + Math.random() * 0.5);
      await sleep(backoff, o.signal).catch(() => undefined);
    }
  }
  throw lastErr;
}

// ── the per-item pipeline ───────────────────────────────────────────────────

interface Ctx {
  client: Anthropic;
  models: { solve: string; judge: string; tiebreak: string };
  args: Args;
}

const MAX_TOKENS = { solve: 16000, solveFrq: 24000, judge: 8000, review: 8000, tiebreak: 48000 };

async function solve(ctx: Ctx, item: Item, strong: boolean, signal: AbortSignal, usage: Usage): Promise<SolveOut> {
  // solverViewOf drops the key and every `correct` flag — the ONLY thing a solver sees.
  const view = solverViewOf(item);
  const r = await callJson(ctx.client, buildSolverPrompt(view), {
    model: strong ? ctx.models.tiebreak : ctx.models.solve,
    effort: strong ? ctx.args.tiebreakEffort : ctx.args.solveEffort,
    maxTokens: strong ? MAX_TOKENS.tiebreak : item.format === 'frq' ? MAX_TOKENS.solveFrq : MAX_TOKENS.solve,
    signal,
    usage,
  });
  const illPosed = r.ill_posed === true;
  const answer = String(r.final_answer ?? '').trim();
  let option: string | null = null;
  if (view.options.length > 0 && !illPosed) {
    option = resolveOptionLetter(String(r.chosen_option ?? ''), view.options) ?? resolveOptionLetter(answer, view.options);
  }
  return {
    illPosed,
    illPosedReason: String(r.ill_posed_reason ?? '').trim(),
    assumptions: String(r.assumptions ?? '').trim().replace(/^(?:none|n\/a|no assumptions?)\.?$/i, ''),
    option,
    answer,
    justification: String(r.justification ?? '').trim(),
  };
}

async function judge(ctx: Ctx, question: string, a1: string, a2: string, signal: AbortSignal, usage: Usage): Promise<CompareOut> {
  const r = await callJson(ctx.client, buildJudgePrompt(question, a1, a2), {
    model: ctx.models.judge, effort: 'low', maxTokens: MAX_TOKENS.judge, signal, usage,
  });
  const v = String(r.verdict ?? '');
  const verdict: JudgeVerdict = v === 'SAME' || v === 'DIFFERENT' || v === 'KEY_INCOMPLETE' ? v : 'CANNOT_JUDGE';
  return { verdict, method: 'judge', reason: String(r.reason ?? '').trim() };
}

/** Deterministic first; model judge for 'unknown' (skipped when allowJudge is false). */
async function compareAnswers(
  ctx: Ctx, item: Item, reference: string, candidate: string, allowJudge: boolean, signal: AbortSignal, usage: Usage,
): Promise<CompareOut | null> {
  const d = compareDeterministic(reference, candidate);
  if (d.result === 'same') return { verdict: 'SAME', method: d.method, reason: d.reason };
  if (d.result === 'different') return { verdict: 'DIFFERENT', method: d.method, reason: d.reason };
  if (!allowJudge) return null;
  return judge(ctx, item.question, reference, candidate, signal, usage);
}

const mcqCompare = (keyLetter: string | null, s: SolveOut): CompareOut => {
  const c = compareMcq(keyLetter, s.option);
  return { verdict: c.result === 'same' ? 'SAME' : c.result === 'different' ? 'DIFFERENT' : 'CANNOT_JUDGE', method: 'mcq', reason: c.reason };
};

const describeSolve = (s: SolveOut) =>
  (s.illPosed ? `ILL-POSED: ${s.illPosedReason}` : s.option ? `${s.option}) ${s.answer}` : s.answer) +
  (s.assumptions ? ` {assumed: ${s.assumptions}}` : '');

async function auditItem(ctx: Ctx, item: Item, signal: AbortSignal, prior?: ResultRecord): Promise<ResultRecord> {
  const t0 = Date.now();
  const usage = zeroUsage();
  const isMcq = item.choices.length > 0;
  const keyed = isMcq ? keyedLetterOf(item) : null;
  const keyedChoice = keyed?.letter ? item.choices.find((c) => c.letter === keyed.letter) : undefined;
  const rec: ResultRecord = {
    id: item.id, course: item.course, source: item.source, format: item.format, question: item.question,
    storedKey: item.key,
    ...(isMcq ? { keyedOption: keyedChoice ? `${keyedChoice.letter}) ${keyedChoice.text}` : null } : {}),
    verdict: null, path: '', reason: '', usage, models: ctx.models, ms: 0, at: '',
  };
  const steps: string[] = [];
  const finish = (verdict: Verdict | null, reason: string): ResultRecord => {
    rec.verdict = verdict;
    rec.reason = reason;
    rec.path = steps.join('>');
    rec.ms = Date.now() - t0;
    rec.at = new Date().toISOString();
    if (prior?.usage) addUsage(rec.usage, prior.usage); // partial record's stage-1 spend
    return rec;
  };

  // ── no expected answer at all: review instead of solve ──
  if (item.key === null && !keyedChoice) {
    if (isMcq) return finish('NEEDS_HUMAN', 'multiple-choice item with no key and no option flagged correct');
    steps.push('review');
    const r = await callJson(ctx.client, buildReviewPrompt(item.question, item.rubric), {
      model: ctx.models.judge, effort: 'medium', maxTokens: MAX_TOKENS.review, signal, usage,
    });
    const problem = String(r.verdict) === 'PROBLEM';
    const problemIn = String(r.problem_in ?? '');
    rec.review = { verdict: problem ? 'PROBLEM' : 'OK', problemIn, reason: String(r.reason ?? '').trim(), rubricAvailable: item.rubric !== null };
    const note = item.rubric === null ? ' [rubric not in worklist — question reviewed alone]' : '';
    if (!problem) return finish('KEY_OK', `no expected answer; review OK: ${rec.review.reason}${note}`);
    return finish(problemIn === 'question' || item.rubric === null ? 'ILL_POSED' : 'NEEDS_HUMAN', `review PROBLEM (${problemIn || 'question'}): ${rec.review.reason}${note}`);
  }

  // ── Stage 1: blind solve (reused from a --stage1-only partial record) ──
  let blind: SolveOut;
  if (prior?.partial && prior.blind) {
    blind = prior.blind;
    steps.push('solve(reused)');
  } else {
    steps.push('solve');
    blind = await solve(ctx, item, false, signal, usage);
  }
  rec.blind = blind;

  if (isMcq && (!keyed?.letter || keyed.conflict)) {
    return finish('NEEDS_HUMAN', `stored key is unusable: ${keyed?.conflict ?? `"${item.key}" matches no option`}; blind solver: ${describeSolve(blind)}`);
  }
  const key = item.key ?? keyedChoice?.text ?? '';

  // ── Stage 2: compare ──
  let cmp: CompareOut | null = null;
  if (!blind.illPosed) {
    if (isMcq) cmp = mcqCompare(keyed!.letter, blind);
    else {
      cmp = await compareAnswers(ctx, item, key, blind.answer, !ctx.args.stage1Only, signal, usage);
      if (cmp?.method === 'judge') steps.push('judge');
    }
    if (cmp) rec.compare = cmp;
  }

  if (ctx.args.stage1Only) {
    if (cmp?.verdict === 'SAME') return finish('KEY_OK', `blind solve agrees (${cmp.method}): ${cmp.reason}`);
    rec.partial = true;
    return finish(null, blind.illPosed ? `stage 1 only — blind solver says ill-posed: ${blind.illPosedReason}` : `stage 1 only — not settled: ${cmp?.reason ?? 'needs the judge'}`);
  }

  const next = afterStage2(blind.illPosed, cmp?.verdict ?? 'CANNOT_JUDGE');
  if (next === 'KEY_OK') return finish('KEY_OK', `blind solve agrees (${cmp!.method}): ${cmp!.reason}`);
  if (next === 'KEY_INCOMPLETE') return finish('KEY_INCOMPLETE', cmp!.reason);

  // ── Stage 3: independent tie-break solve ──
  steps.push('tiebreak');
  const tb = await solve(ctx, item, true, signal, usage);
  rec.tiebreak = { ...tb };
  let vsKey: CompareOut | undefined;
  let vsBlind: CompareOut | undefined;
  if (!tb.illPosed) {
    if (isMcq) vsKey = mcqCompare(keyed!.letter, tb);
    else {
      vsKey = (await compareAnswers(ctx, item, key, tb.answer, true, signal, usage))!;
      if (vsKey.method === 'judge') steps.push('judge');
    }
    rec.tiebreak.vsKey = vsKey;
    const settled = vsKey.verdict === 'SAME' || vsKey.verdict === 'KEY_INCOMPLETE';
    if (!settled && !blind.illPosed) {
      if (isMcq) vsBlind = mcqCompare(blind.option, tb);
      else {
        vsBlind = (await compareAnswers(ctx, item, blind.answer, tb.answer, true, signal, usage))!;
        if (vsBlind.method === 'judge') steps.push('judge');
      }
      rec.tiebreak.vsBlind = vsBlind;
    }
  }
  const out = afterTiebreak({ blindIllPosed: blind.illPosed, tiebreakIllPosed: tb.illPosed, vsKey: vsKey?.verdict, vsBlind: vsBlind?.verdict,
    solverAssumed: !!(blind.assumptions || tb.assumptions),
  });
  rec.tiebreakOutcome = out.outcome;
  const first = blind.illPosed ? `blind solver: ill-posed (${blind.illPosedReason})` : `blind solver: ${describeSolve(blind)} [${cmp?.verdict}: ${cmp?.reason}]`;
  const third = tb.illPosed ? `tie-break: ill-posed (${tb.illPosedReason})` : `tie-break: ${describeSolve(tb)} [vs key ${vsKey?.verdict}: ${vsKey?.reason}${vsBlind ? `; vs blind ${vsBlind.verdict}` : ''}]`;
  return finish(out.verdict, `${out.outcome} — ${first}; ${third}`);
}

// ── output ──────────────────────────────────────────────────────────────────

function loadResults(file: string): Map<string, ResultRecord> {
  const map = new Map<string, ResultRecord>();
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line) as ResultRecord;
      if (r && typeof r.id === 'string') map.set(r.id, r); // last record per id wins
    } catch {
      /* a torn final line from a crash — ignore it; the item is simply re-run */
    }
  }
  return map;
}

function tally(records: ResultRecord[], field: 'course' | 'source' | 'format') {
  const out: Record<string, Record<string, number>> = {};
  for (const r of records) {
    const k = r[field] || '(none)';
    const v = r.verdict ?? 'PARTIAL';
    (out[k] ??= {})[v] = (out[k][v] ?? 0) + 1;
  }
  return out;
}

function writeSummary(outDir: string, results: Map<string, ResultRecord>, extra: Record<string, unknown>) {
  const records = [...results.values()];
  const byVerdict: Record<string, number> = {};
  const total = zeroUsage();
  for (const r of records) {
    const v = r.verdict ?? 'PARTIAL';
    byVerdict[v] = (byVerdict[v] ?? 0) + 1;
    if (r.usage) addUsage(total, r.usage);
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    items: records.length,
    byVerdict,
    solverErredButKeyOk: records.filter((r) => r.tiebreakOutcome === 'KEY_OK_SOLVER_ERRED').length,
    byCourse: tally(records, 'course'),
    bySource: tally(records, 'source'),
    byFormat: tally(records, 'format'),
    usage: {
      note: 'cumulative over every record in results.jsonl (all runs into this directory); output tokens include thinking',
      modelCalls: total.calls,
      inputTokens: total.input,
      outputTokens: total.output,
      cacheReadTokens: total.cacheRead,
      cacheWriteTokens: total.cacheWrite,
      estimatedCostUsd: Number(total.costUsd.toFixed(4)),
    },
    ...extra,
  };
  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

  const header = ['id', 'course', 'source', 'format', 'question', 'stored_key', 'blind_answer', 'tiebreak_answer', 'verdict', 'reason'];
  const rows = records
    .filter((r) => r.verdict !== 'KEY_OK')
    .map((r) =>
      [
        r.id, r.course, r.source, r.format, r.question,
        r.keyedOption ?? r.storedKey ?? '(none — rubric-graded)',
        r.blind ? describeSolve(r.blind) : '',
        r.tiebreak ? describeSolve(r.tiebreak) : '',
        r.verdict ?? 'PARTIAL', r.reason,
      ].map(csvCell).join(','),
    );
  fs.writeFileSync(path.join(outDir, 'flagged.csv'), [header.join(','), ...rows].join('\n') + '\n');
  return summary;
}

// ── main ────────────────────────────────────────────────────────────────────

async function main() {
  let args: Args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`${(e as Error).message}\n\n${USAGE}`);
    process.exit(2);
  }

  const verify = resolveModel('content-verify');
  const models = { solve: verify.model, judge: verify.model, tiebreak: args.tiebreakModel || verify.model };
  console.log(`models: blind solve = ${models.solve} (adaptive thinking, effort ${args.solveEffort}) · judge/review = ${models.judge} (effort low/medium) · tie-break = ${models.tiebreak} (adaptive thinking, effort ${args.tiebreakEffort})`);
  for (const m of new Set(Object.values(models))) {
    const r = lookupModelRate(m);
    console.log(r ? `prices: ${m} = $${r.input}/MTok input, $${r.output}/MTok output (src/lib/tutor/ai/model-rates.ts)` : `prices: ${m} = UNKNOWN (cost will read $0)`);
  }
  if (!verify.native) console.warn('warning: content-verify resolves to a non-Anthropic endpoint; thinking / structured output may not be honoured');

  // ── select ──
  const all = parseWorklist(JSON.parse(fs.readFileSync(args.in, 'utf8')));
  let selected = all;
  if (args.idsFile) {
    const raw = fs.readFileSync(args.idsFile, 'utf8').trim();
    const ids: string[] = raw.startsWith('[') ? JSON.parse(raw) : raw.split('\n').map((s) => s.trim()).filter(Boolean);
    const want = new Set(ids);
    selected = selected.filter((it) => want.has(it.id));
    const have = new Set(selected.map((it) => it.id));
    const missing = ids.filter((id) => !have.has(id));
    if (missing.length) console.warn(`warning: ${missing.length} id(s) from --ids-file are not in the worklist, e.g. ${missing.slice(0, 3).join(', ')}`);
  }
  if (args.source) selected = selected.filter((it) => args.source!.includes(it.source));
  if (args.course) selected = selected.filter((it) => args.course!.includes(it.course));
  if (args.format) selected = selected.filter((it) => args.format!.includes(it.format));
  selected = selected.slice(args.offset, args.limit !== undefined ? args.offset + args.limit : undefined);

  const outDir = path.resolve(args.out);
  const resultsFile = path.join(outDir, 'results.jsonl');
  const existing = args.resume ? loadResults(resultsFile) : new Map<string, ResultRecord>();
  const isDone = (it: Item) => {
    const r = existing.get(it.id);
    if (!r) return false;
    if (r.verdict === 'ERROR') return !args.retryErrors;
    if (r.partial) return args.stage1Only; // a full run finishes partial records
    return true;
  };
  const todo = selected.filter((it) => !isDone(it));

  // ── plan ──
  const kinds: Record<string, number> = {};
  let minCalls = 0;
  let unusableMcqKeys = 0;
  for (const it of todo) {
    const p = plannedCalls(it, args.stage1Only);
    kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
    minCalls += p.min;
    if (it.choices.length > 0) {
      const k = keyedLetterOf(it);
      if (!k.letter || k.conflict) unusableMcqKeys++;
    }
  }
  const solvable = todo.length - (kinds.review ?? 0);
  // Planning assumptions (see README): ~12 % of solvable items reach the tie-break
  // (1 solve + ~1.5 judge calls for non-MCQ), ~35 % of numeric items need the judge.
  const estCalls = args.stage1Only
    ? minCalls
    : Math.round(minCalls + (kinds.numeric ?? 0) * 0.35 + solvable * 0.12 * 1 + ((kinds.numeric ?? 0) + (kinds.text ?? 0)) * 0.12 * 1.5);
  console.log(`worklist: ${all.length} items · selected: ${selected.length} · already done (resume): ${selected.length - todo.length} · to process: ${todo.length}`);
  console.log(`to process by kind: ${JSON.stringify(kinds)}${unusableMcqKeys ? ` · MCQ items whose key resolves to no option / conflicts: ${unusableMcqKeys}` : ''}`);
  console.log(`model calls: minimum ${minCalls}, estimated ${estCalls}${args.stage1Only ? ' (stage 1 only)' : ' (assumes 12% tie-breaks, 35% of numeric items needing the judge)'}`);

  if (args.dryRun) {
    const by = (f: 'source' | 'format' | 'course') => {
      const c: Record<string, number> = {};
      for (const it of todo) c[it[f]] = (c[it[f]] ?? 0) + 1;
      return JSON.stringify(c);
    };
    console.log(`by source: ${by('source')}\nby format: ${by('format')}\nby course: ${by('course')}`);
    for (const it of todo.slice(0, 10)) console.log(`  ${it.id}  [${it.source}/${it.format}]  ${it.question.replace(/\s+/g, ' ').slice(0, 80)}`);
    if (todo.length > 10) console.log(`  … and ${todo.length - 10} more`);
    console.log('dry run: no model calls made, nothing written.');
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set in the environment (this script does not read .env files).');
    process.exit(2);
  }
  fs.mkdirSync(outDir, { recursive: true });
  if (!args.resume && fs.existsSync(resultsFile)) fs.renameSync(resultsFile, `${resultsFile}.${Date.now()}.bak`);

  // maxRetries 0: retries/backoff are handled in callJson so the per-item timeout stays in charge.
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0, timeout: args.itemTimeoutMs });
  const ctx: Ctx = { client, models, args };

  let stopping = false;
  process.on('SIGINT', () => {
    if (stopping) {
      console.error('\nsecond Ctrl-C — exiting now (results.jsonl is intact; summary not rewritten).');
      process.exit(130);
    }
    stopping = true;
    console.error('\nCtrl-C — finishing in-flight items, then writing the summary. Press again to exit immediately.');
  });

  const fd = fs.openSync(resultsFile, 'a');
  const started = Date.now();
  const runUsage = zeroUsage();
  const runVerdicts: Record<string, number> = {};
  let done = 0;
  let cursor = 0;

  async function worker() {
    while (!stopping) {
      const item = todo[cursor++];
      if (!item) return;
      const prior = existing.get(item.id);
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), args.itemTimeoutMs);
      let rec: ResultRecord;
      const t0 = Date.now();
      try {
        rec = await auditItem(ctx, item, ac.signal, prior?.partial ? prior : undefined);
      } catch (e) {
        // One bad item never stops the run.
        const msg = ac.signal.aborted ? `timed out after ${args.itemTimeoutMs / 1000}s` : e instanceof Error ? e.message : String(e);
        rec = {
          id: item.id, course: item.course, source: item.source, format: item.format, question: item.question,
          storedKey: item.key, verdict: 'ERROR', path: 'error', reason: msg.slice(0, 500),
          usage: zeroUsage(), models, ms: Date.now() - t0, at: new Date().toISOString(),
        };
      } finally {
        clearTimeout(timer);
      }
      fs.writeSync(fd, JSON.stringify(rec) + '\n');
      fs.fsyncSync(fd); // on disk before the next item — a crash loses nothing
      existing.set(rec.id, rec);
      addUsage(runUsage, rec.usage);
      const v = rec.verdict ?? 'PARTIAL';
      runVerdicts[v] = (runVerdicts[v] ?? 0) + 1;
      done++;
      if (v !== 'KEY_OK') console.log(`  [${v}] ${rec.id} — ${rec.reason.replace(/\s+/g, ' ').slice(0, 200)}`);
      if (done % 10 === 0 || done === todo.length) {
        const el = (Date.now() - started) / 1000;
        console.log(`progress ${done}/${todo.length} · ${el.toFixed(0)}s · ${runUsage.calls} calls · $${runUsage.costUsd.toFixed(3)} · ${JSON.stringify(runVerdicts)}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(args.concurrency, todo.length) }, () => worker()));
  fs.closeSync(fd);

  const wallSeconds = Number(((Date.now() - started) / 1000).toFixed(1));
  const rates: Record<string, unknown> = {};
  for (const m of new Set(Object.values(models))) rates[m] = lookupModelRate(m) ?? null;
  const summary = writeSummary(outDir, loadResults(resultsFile), {
    models: { ...models, solveEffort: args.solveEffort, tiebreakEffort: args.tiebreakEffort },
    pricesUsdPerMTok: rates,
    thisRun: {
      processed: done,
      interrupted: stopping,
      wallSeconds,
      concurrency: args.concurrency,
      byVerdict: runVerdicts,
      modelCalls: runUsage.calls,
      inputTokens: runUsage.input,
      outputTokens: runUsage.output,
      estimatedCostUsd: Number(runUsage.costUsd.toFixed(4)),
    },
  });
  console.log(`\n${stopping ? 'interrupted' : 'done'}: ${done} items in ${wallSeconds}s · ${runUsage.calls} calls · ${runUsage.input} in / ${runUsage.output} out tokens · est. $${runUsage.costUsd.toFixed(3)}`);
  console.log(`verdicts (all results in ${outDir}): ${JSON.stringify(summary.byVerdict)}`);
  console.log(`wrote results.jsonl, summary.json, flagged.csv under ${outDir}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.stack ?? e.message : e);
  process.exit(1);
});
