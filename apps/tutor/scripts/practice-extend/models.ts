/**
 * Model access for the practice-extension job: credentials, the cost ledger
 * and one JSON-returning call per provider.
 *
 * No database: this file imports the Anthropic SDK and the repo's rate card,
 * nothing else from the app. Credentials are read from two env files, ONLY
 * the named keys, and are never logged or written anywhere.
 */
import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { lookupModelRate } from '../../src/lib/tutor/ai/model-rates';
import { resolveModel } from '../../src/lib/tutor/ai/model-registry';
import { Budget, costUsd, worstCaseUsd, type Rate, type TokenUsage } from './core';

// ── credentials ─────────────────────────────────────────────────────────────

/** Read ONLY `keys` from a dotenv-style file. */
function readEnvKeys(file: string, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || !keys.includes(m[1])) continue;
    out[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

export interface Providers {
  anthropic: Anthropic;
  deepseek: Anthropic;
  models: { generate: string; tiebreak: string; judge: string; haiku: string; deepseek: string };
}

const TUTOR_DIR = path.resolve(__dirname, '..', '..');
const WORKTREE_DIR = path.resolve(TUTOR_DIR, '..', '..');

/**
 * Anthropic key from apps/tutor/.env.local; DeepSeek key, base URL and model
 * id from the fallback-brain entries of <worktree>/.env.local.production.
 * Throws (naming the missing key, never a value) when one is absent.
 */
export function loadProviders(): Providers {
  const a = readEnvKeys(path.join(TUTOR_DIR, '.env.local'), ['ANTHROPIC_API_KEY']);
  const d = readEnvKeys(path.join(WORKTREE_DIR, '.env.local.production'), [
    'TUTOR_MODEL_BRAIN_FALLBACK',
    'TUTOR_MODEL_BRAIN_FALLBACK_API_KEY',
    'TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL',
  ]);
  const missing = [
    !a.ANTHROPIC_API_KEY && 'ANTHROPIC_API_KEY (apps/tutor/.env.local)',
    !d.TUTOR_MODEL_BRAIN_FALLBACK_API_KEY && 'TUTOR_MODEL_BRAIN_FALLBACK_API_KEY (.env.local.production)',
    !d.TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL && 'TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL (.env.local.production)',
  ].filter(Boolean);
  if (missing.length > 0) throw new Error(`missing credential(s): ${missing.join('; ')}`);
  const sonnet = resolveModel('content-gen').model;
  return {
    anthropic: new Anthropic({ apiKey: a.ANTHROPIC_API_KEY, maxRetries: 0 }),
    deepseek: new Anthropic({ apiKey: d.TUTOR_MODEL_BRAIN_FALLBACK_API_KEY, baseURL: d.TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL, maxRetries: 0 }),
    models: {
      generate: sonnet,
      tiebreak: resolveModel('content-verify').model,
      judge: resolveModel('content-verify').model,
      haiku: resolveModel('judge').model,
      deepseek: d.TUTOR_MODEL_BRAIN_FALLBACK || 'deepseek-chat',
    },
  };
}

/**
 * DeepSeek ONLY — for a stage that must not call any other provider
 * (`ingest`). No Anthropic key is read. The `anthropic` client of the result
 * throws on any use, and the base URL must be a deepseek.com host, so a
 * misconfigured entry cannot send the stage's calls elsewhere.
 */
export function loadDeepseekOnly(): Providers {
  const d = readEnvKeys(path.join(WORKTREE_DIR, '.env.local.production'), [
    'TUTOR_MODEL_BRAIN_FALLBACK',
    'TUTOR_MODEL_BRAIN_FALLBACK_API_KEY',
    'TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL',
  ]);
  const missing = [
    !d.TUTOR_MODEL_BRAIN_FALLBACK_API_KEY && 'TUTOR_MODEL_BRAIN_FALLBACK_API_KEY (.env.local.production)',
    !d.TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL && 'TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL (.env.local.production)',
  ].filter(Boolean);
  if (missing.length > 0) throw new Error(`missing credential(s): ${missing.join('; ')}`);
  const host = new URL(d.TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL).hostname;
  if (!/(?:^|\.)deepseek\.com$/.test(host)) throw new Error(`TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL points at "${host}", not at deepseek.com — refusing to call it`);
  const model = d.TUTOR_MODEL_BRAIN_FALLBACK || 'deepseek-chat';
  if (!/^deepseek/.test(model)) throw new Error(`TUTOR_MODEL_BRAIN_FALLBACK is "${model}", not a DeepSeek model — refusing to call it`);
  const refuse = new Proxy({}, {
    get() {
      throw new Error('this stage may call DeepSeek only — an Anthropic call was attempted');
    },
  }) as unknown as Anthropic;
  return {
    anthropic: refuse,
    // authToken null: nothing from the shell's own ANTHROPIC_* variables is sent along.
    deepseek: new Anthropic({ apiKey: d.TUTOR_MODEL_BRAIN_FALLBACK_API_KEY, authToken: null, baseURL: d.TUTOR_MODEL_BRAIN_FALLBACK_BASE_URL, maxRetries: 0 }),
    models: { generate: '', tiebreak: '', judge: '', haiku: '', deepseek: model },
  };
}

export function rateOf(model: string): Rate {
  const r = lookupModelRate(model);
  if (!r) throw new Error(`no rate for model "${model}" in src/lib/tutor/ai/model-rates.ts — refusing to call an unpriced model`);
  return r;
}

// ── ledger ──────────────────────────────────────────────────────────────────

export interface LedgerRow extends TokenUsage {
  at: string;
  stage: string;
  purpose: string;
  ref: string;
  provider: 'anthropic' | 'deepseek';
  model: string;
  costUsd: number;
  ok: boolean;
  note?: string;
}

export function readLedger(file: string): LedgerRow[] {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l) as LedgerRow);
}

/** Append-only JSONL of every model call; the budget starts from its total,
 *  so the cap holds across runs and stages that share the file. */
export class Ledger {
  readonly budget: Budget;
  constructor(
    readonly file: string,
    maxUsd: number,
  ) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const spent = readLedger(file).reduce((s, r) => s + (r.costUsd || 0), 0);
    this.budget = new Budget(maxUsd, spent);
  }
  append(row: LedgerRow): void {
    fs.appendFileSync(this.file, JSON.stringify(row) + '\n');
  }
}

// ── one call ────────────────────────────────────────────────────────────────

export interface CallSpec {
  provider: 'anthropic' | 'deepseek';
  model: string;
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxTokens: number;
  /** Anthropic Sonnet only: adaptive thinking at this effort + schema-enforced JSON. */
  effort?: string;
  /** Anthropic only: mark the system prompt cacheable (many calls share it). */
  cacheSystem?: boolean;
  /** Anthropic only: switch thinking off explicitly (omitting `effort` leaves the model's default). */
  noThinking?: boolean;
  stage: string;
  purpose: string;
  ref: string;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function isRetryable(e: unknown): boolean {
  if (e instanceof Anthropic.RateLimitError || e instanceof Anthropic.APIConnectionError || e instanceof Anthropic.InternalServerError) return true;
  if (e instanceof Anthropic.APIError) return e.status === 408 || e.status === 409 || (e.status ?? 0) >= 500;
  return /overloaded|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up|fetch failed|terminated/i.test(e instanceof Error ? e.message : String(e));
}

/** LaTeX commands whose first letter is a JSON escape character — written
 *  with one backslash inside a JSON string they parse as control characters. */
const LATEX_AFTER_ESCAPE = /(?<!\\)\\(?=(?:frac|dfrac|tfrac|times|theta|tau|tan|tanh|text|textbf|to|top|triangle|beta|bar|begin|binom|boxed|bullet|nu|neq|ne|nabla|not|neg|ni|rho|right|rightarrow|Rightarrow|rangle|rm|forall|flat|underline|uparrow|unit)\b)/g;

export function parseJsonLoose(text: string): Record<string, unknown> {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  const body = s >= 0 && e > s ? t.slice(s, e + 1) : t;
  const attempts = [
    body,
    // a backslash that starts no JSON escape (\alpha, \sqrt, \( …)
    body.replace(/(?<!\\)\\(?!["\\/bfnrtu])/g, '\\\\').replace(LATEX_AFTER_ESCAPE, '\\\\'),
  ];
  let last: unknown;
  for (const a of attempts) {
    try {
      const v = JSON.parse(a);
      if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
    } catch (err) {
      last = err;
    }
  }
  throw new Error(`model reply was not a JSON object: ${String(last).slice(0, 80)}`);
}

function jsonInstruction(schema: Record<string, unknown>): string {
  const keys = Object.keys((schema.properties ?? {}) as Record<string, unknown>);
  return `\n\nReply with ONE JSON object and nothing else — no code fence, no text before or after. Use exactly these keys, in this order: ${keys.join(', ')}. Inside the JSON strings write mathematics in plain text or Unicode symbols, with no backslash commands.`;
}

/** Set once Anthropic rejects schema-enforced output for a model; later calls
 *  for that model ask for JSON in the prompt instead. */
const noStructuredOutput = new Set<string>();

/**
 * One model call that returns a JSON object. Reserves its worst-case cost
 * against the budget BEFORE calling (throws `BudgetExceeded` when it would
 * not fit), and writes the actual tokens and cost to the ledger afterwards.
 */
export async function callJson(p: Providers, ledger: Ledger, spec: CallSpec): Promise<Record<string, unknown>> {
  const rate = rateOf(spec.model);
  const client = spec.provider === 'deepseek' ? p.deepseek : p.anthropic;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const structured = spec.provider === 'anthropic' && !noStructuredOutput.has(spec.model);
    const user = structured ? spec.user : spec.user + jsonInstruction(spec.schema);
    const worst = worstCaseUsd(spec.system.length + user.length + JSON.stringify(spec.schema).length, spec.maxTokens, rate);
    ledger.budget.reserve(worst); // throws BudgetExceeded — never retried
    let booked = false;
    const book = (usage: TokenUsage, ok: boolean, note?: string): void => {
      const actual = costUsd(usage, rate);
      booked = true;
      ledger.budget.settle(worst, actual);
      ledger.append({
        at: new Date().toISOString(), stage: spec.stage, purpose: spec.purpose, ref: spec.ref,
        provider: spec.provider, model: spec.model, ...usage, costUsd: actual, ok, ...(note ? { note } : {}),
      });
    };
    try {
      const params: Record<string, unknown> = {
        model: spec.model,
        max_tokens: spec.maxTokens,
        system: spec.cacheSystem && spec.provider === 'anthropic' ? [{ type: 'text', text: spec.system, cache_control: { type: 'ephemeral' } }] : spec.system,
        messages: [{ role: 'user', content: user }],
      };
      if (structured) {
        params.output_config = { ...(spec.effort ? { effort: spec.effort } : {}), format: { type: 'json_schema', schema: spec.schema } };
        if (spec.noThinking) params.thinking = { type: 'disabled' };
        else if (spec.effort) params.thinking = { type: 'adaptive' };
      }
      const msg = await client.messages.stream(params as unknown as Anthropic.MessageStreamParams, { timeout: 600_000 }).finalMessage();
      const u = msg.usage;
      const usage: TokenUsage = {
        input: u.input_tokens ?? 0,
        output: u.output_tokens ?? 0,
        cacheRead: u.cache_read_input_tokens ?? 0,
        cacheWrite: u.cache_creation_input_tokens ?? 0,
      };
      const text = msg.content.filter((b) => b.type === 'text').map((b) => (b as Anthropic.TextBlock).text).join('');
      if (msg.stop_reason === 'max_tokens') {
        book(usage, false, 'truncated at max_tokens');
        throw new Error(`reply truncated at max_tokens=${spec.maxTokens}`);
      }
      try {
        const parsed = parseJsonLoose(text);
        book(usage, true);
        return parsed;
      } catch (err) {
        book(usage, false, 'reply was not JSON');
        if (attempt >= 2) throw err;
        lastErr = err;
        continue; // one more try for an unparseable reply
      }
    } catch (e) {
      if (!booked) ledger.budget.settle(worst, 0);
      lastErr = e;
      if (structured && e instanceof Anthropic.BadRequestError && /output_config|output_format|json_schema|structured/i.test(e.message)) {
        noStructuredOutput.add(spec.model);
        continue;
      }
      if (/not a JSON object|truncated at max_tokens/.test(e instanceof Error ? e.message : '')) throw e;
      if (!isRetryable(e) || attempt === 5) throw e;
      await sleep(Math.min(30_000, 1500 * 2 ** (attempt - 1)));
    }
  }
  throw lastErr;
}
