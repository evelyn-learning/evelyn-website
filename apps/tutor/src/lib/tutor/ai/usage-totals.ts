/**
 * Token totals and estimated cost of a tutor session, from its per-call
 * usage entries (2026-10-04).
 *
 * ONE implementation, used by the retail /tutor page (its running figure) and
 * by the session-usage route (the stored figure). The route used to `$set`
 * whatever totals the saving page sent, and a page reload starts the page's
 * entry list empty — so after a mid-session reload the stored
 * `totalInputTokens` / `totalOutputTokens` / `estimatedCost` covered the last
 * sitting only, although the stored `tokenUsage` array still held every call
 * (a session stored $0.1351 with a 126,600-token cache write missing from it).
 * The stored totals are now derived from the stored entries.
 *
 * The arithmetic is the page's own, moved here unchanged — same terms, same
 * order, same 4-decimal rounding — so a single-sitting session stores exactly
 * what it stored before (pinned by scripts/test-usage-totals.ts against a
 * frozen copy of the old loop).
 *
 * Pure, client-safe (plain data + arithmetic; no env, no I/O).
 */
import { MODEL_RATES, lookupModelRate } from './model-rates';

// Pricing per 1M tokens — sourced from the shared rate card (model-rates.ts)
// so every estimate in the app prices from ONE table. Brain turns run the
// prod brain model (Sonnet 5) with the 1h-TTL prompt cache, so cacheWrite
// uses the 1h write rate. This is the FALLBACK for entries that carry no
// model id (greeting/chat/homework + historical records).
const BRAIN_RATE = MODEL_RATES['claude-sonnet-5'];
export const FALLBACK_PRICING = {
  input: BRAIN_RATE.input,
  output: BRAIN_RATE.output,
  cacheRead: BRAIN_RATE.cacheRead ?? BRAIN_RATE.input * 0.1,
  cacheWrite: BRAIN_RATE.cacheWrite1h ?? BRAIN_RATE.input * 2,
};

export const REALTIME_PRICING = {
  // OpenAI Realtime API (voice mode) — GA gpt-realtime rate card
  audioInput: 100.0,   // $100 per 1M audio input tokens
  audioOutput: 200.0,  // $200 per 1M audio output tokens
  textInput: 5.0,      // $5 per 1M text input tokens
  textOutput: 20.0,    // $20 per 1M text output tokens
};

// GPT-Realtime-2 rate card — used only when voiceEngine === 'realtime-2'.
// Audio input is billed at the uncached rate below; the cached portion
// (captured per-turn as inputCachedTokens) is far cheaper at $0.40/1M, so
// the realtime-2 cost figure is a slight OVER-estimate. Compute the cached
// saving post-hoc from the inputCachedTokens totals.
export const REALTIME_2_PRICING = {
  audioInput: 32.0,        // $32 per 1M uncached audio input tokens
  audioInputCached: 0.40,  // $0.40 per 1M cached audio input tokens (post-hoc)
  audioOutput: 64.0,       // $64 per 1M audio output tokens
  textInput: 4.0,          // $4 per 1M text input tokens
  textOutput: 24.0,        // $24 per 1M text output tokens
};

/** One per-call usage entry, as the page holds it (Date timestamp) or as it
 *  is stored / sent (Date or ISO string). */
export interface UsageEntry {
  operation?: unknown;
  inputTokens?: unknown;
  outputTokens?: unknown;
  timestamp?: unknown;
  inputAudioTokens?: unknown;
  outputAudioTokens?: unknown;
  inputTextTokens?: unknown;
  outputTextTokens?: unknown;
  inputCachedTokens?: unknown;
  cacheReadTokens?: unknown;
  cacheCreationTokens?: unknown;
  model?: unknown;
}

export interface UsageTotals {
  /** Billed input volume: input + cache reads + cache writes. */
  totalInputTokens: number;
  totalOutputTokens: number;
  /** USD, rounded to 4 decimals. */
  estimatedCost: number;
}

const n = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function timestampMs(v: unknown): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === 'string' || typeof v === 'number') return new Date(v).getTime();
  return NaN;
}

/**
 * Identity of an entry for de-duplication, or null when it has no usable
 * timestamp (such an entry is never treated as a duplicate).
 *
 * The route appends entries with a plain `$push` — nothing keys them — and
 * the page decides what is "new" from a counter, so the same call can be
 * stored twice (a save re-sends an entry an earlier save already sent). A
 * RE-SENT entry is identical to the stored one in every field, its client
 * timestamp included.
 *
 * The key alone cannot tell a re-send from two real calls, though — two
 * calls can share a millisecond and every count, and an entry sent WITHOUT a
 * timestamp is stamped by the schema with the write's millisecond, so three
 * of them in one save are stored with one and the same key. What separates
 * the cases is WHICH SAVE an entry arrived in: see countedUsageEntries.
 */
export function usageEntryKey(e: UsageEntry): string | null {
  const ms = timestampMs(e.timestamp);
  if (!Number.isFinite(ms)) return null;
  return JSON.stringify([
    typeof e.operation === 'string' ? e.operation : '', ms,
    n(e.inputTokens), n(e.outputTokens),
    n(e.inputAudioTokens), n(e.outputAudioTokens), n(e.inputTextTokens), n(e.outputTextTokens),
    n(e.inputCachedTokens), n(e.cacheReadTokens), n(e.cacheCreationTokens),
    typeof e.model === 'string' ? e.model : '',
  ]);
}

/** The entries with repeats of the same key removed (first one kept, order
 *  kept). Non-object entries are dropped. The WHOLE-ARRAY rule: it knows
 *  nothing about saves, so it also merges identical entries that arrived
 *  together. Used for the part of a stored array whose save boundaries are
 *  no longer known; a caller that knows the current batch uses
 *  countedUsageEntries. */
export function dedupeUsageEntries(entries: unknown): UsageEntry[] {
  if (!Array.isArray(entries)) return [];
  const seen = new Set<string>();
  const out: UsageEntry[] = [];
  for (const raw of entries) {
    if (!raw || typeof raw !== 'object') continue;
    const e = raw as UsageEntry;
    const key = usageEntryKey(e);
    if (key !== null) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    out.push(e);
  }
  return out;
}

const hasClientTimestamp = (raw: unknown): boolean =>
  !!raw && typeof raw === 'object' && (raw as UsageEntry).timestamp != null
  && Number.isFinite(timestampMs((raw as UsageEntry).timestamp));

/**
 * The stored entries that count as distinct calls, given the batch THIS
 * request appended (2026-10-04, review 5d).
 *
 * `stored` is the session's `tokenUsage` array as returned by the write that
 * appended `incoming` — so the last `incoming.length` stored entries ARE the
 * incoming batch (a `$push` appends atomically at the tail), and everything
 * before them arrived in earlier (or concurrent, earlier-landing) saves.
 *
 * De-duplication is incoming-versus-stored only:
 *  · an incoming entry is a duplicate only when it carries a CLIENT-supplied
 *    timestamp and an entry identical in every field (that timestamp
 *    included) is already stored from an earlier save — one earlier copy
 *    absorbs one incoming copy;
 *  · entries repeated WITHIN the incoming batch are never duplicates of each
 *    other (two real calls in one millisecond are two calls);
 *  · an incoming entry with no client timestamp is never a duplicate (its
 *    stored timestamp is the schema's default, not an identity).
 *
 * The earlier part of the array is read with the whole-array rule
 * (dedupeUsageEntries): its save boundaries are not stored. KNOWN LIMIT — a
 * same-key pair that arrived together in an EARLIER save reads as one call
 * here; the route's totals are raise-only (`$max`), so the figure that
 * counted both when they arrived is never lowered, but entries added later
 * are summed on top of the lower reading.
 *
 * Concurrent saves: each reconciles against the document its own write
 * returned; whichever lands last has every other save's entries in the
 * earlier part, so a neighbour's re-sent entry is still counted once.
 */
export function countedUsageEntries(input: { stored: unknown; incoming: unknown }): UsageEntry[] {
  const stored: UsageEntry[] = Array.isArray(input?.stored)
    ? input.stored.filter((e): e is UsageEntry => !!e && typeof e === 'object')
    : [];
  const incoming: unknown[] = Array.isArray(input?.incoming) ? input.incoming : [];
  const batchSize = Math.min(incoming.length, stored.length);
  if (batchSize === 0) return dedupeUsageEntries(stored);
  const prior = stored.slice(0, stored.length - batchSize);
  const batch = stored.slice(stored.length - batchSize);
  const sent = incoming.slice(incoming.length - batchSize);

  const earlierCopies = new Map<string, number>();
  for (const e of prior) {
    const key = usageEntryKey(e);
    if (key !== null) earlierCopies.set(key, (earlierCopies.get(key) ?? 0) + 1);
  }
  const out = dedupeUsageEntries(prior);
  batch.forEach((e, i) => {
    const key = hasClientTimestamp(sent[i]) ? usageEntryKey(e) : null;
    const left = key !== null ? (earlierCopies.get(key) ?? 0) : 0;
    if (key !== null && left > 0) { earlierCopies.set(key, left - 1); return; } // a re-send
    out.push(e);
  });
  return out;
}

/**
 * The page's "sent up to here" marker over its usage list: which slice to
 * send now (`from`) and the marker afterwards.
 *
 * The marker is a COUNT into the list, so it is only meaningful while the
 * list keeps growing. The list can be REPLACED by a shorter one (the page
 * re-seeds it with the greeting's entry): a marker left above the new length
 * hid every entry later added below it — they were never sent. A shorter
 * list therefore restarts at 0 (re-sent entries are harmless: the route
 * de-duplicates incoming against stored). A list at or above the marker
 * advances it as before.
 */
export function usageSaveWindow(marker: unknown, listLength: unknown): { from: number; marker: number } {
  const len = typeof listLength === 'number' && Number.isFinite(listLength) && listLength > 0 ? Math.floor(listLength) : 0;
  const m = typeof marker === 'number' && Number.isFinite(marker) && marker > 0 ? Math.floor(marker) : 0;
  return { from: m > len ? 0 : m, marker: len };
}

/** USD cost of ONE entry — the page's per-entry arithmetic, unchanged. */
function entryCost(u: UsageEntry, voiceEngine: unknown): number {
  if (u.operation === 'realtime-response') {
    // OpenAI Realtime: separate audio and text token pricing.
    // realtime-2 has its own (much lower) rate card; every other
    // realtime engine uses the GA gpt-realtime rates. The engine is
    // fixed for the whole session, so voiceEngine is authoritative.
    const rt = voiceEngine === 'realtime-2' ? REALTIME_2_PRICING : REALTIME_PRICING;
    const audioIn = n(u.inputAudioTokens);
    const audioOut = n(u.outputAudioTokens);
    const textIn = n(u.inputTextTokens);
    const textOut = n(u.outputTextTokens);
    // Audio input priced at the uncached rate — for realtime-2 the
    // cached portion (u.inputCachedTokens) is billed far cheaper, so
    // this is a slight over-estimate; derive the saving post-hoc.
    return (audioIn / 1_000_000) * rt.audioInput
         + (audioOut / 1_000_000) * rt.audioOutput
         + (textIn / 1_000_000) * rt.textInput
         + (textOut / 1_000_000) * rt.textOutput;
  }
  // Model-aware pricing (registry era, 2026-08-30): brain-turn entries
  // carry the serving model id from the stream's done event — price the
  // model actually used (Sonnet, DeepSeek, …). Entries without a model
  // (greeting/chat/homework + historical records) fall back to
  // FALLBACK_PRICING.
  const r = lookupModelRate(typeof u.model === 'string' ? u.model : undefined);
  return (n(u.inputTokens) / 1_000_000) * (r?.input ?? FALLBACK_PRICING.input)
       + (n(u.outputTokens) / 1_000_000) * (r?.output ?? FALLBACK_PRICING.output)
       + (n(u.cacheReadTokens) / 1_000_000) * (r ? (r.cacheRead ?? r.input * 0.1) : FALLBACK_PRICING.cacheRead)
       + (n(u.cacheCreationTokens) / 1_000_000) * (r ? (r.cacheWrite1h ?? 0) : FALLBACK_PRICING.cacheWrite);
}

/**
 * Totals and cost of a list of usage entries.
 *
 * `dedupe` (default true) counts a repeated entry once — what the server
 * wants for a stored array. The page passes `dedupe: false` for its own
 * in-memory list, which is exactly its previous sum.
 */
export function computeUsageTotals(
  entries: unknown,
  voiceEngine?: unknown,
  opts: { dedupe?: boolean } = {},
): UsageTotals {
  const list: UsageEntry[] = opts.dedupe === false
    ? (Array.isArray(entries) ? entries.filter((e): e is UsageEntry => !!e && typeof e === 'object') : [])
    : dedupeUsageEntries(entries);
  let totalIn = 0;
  let totalOut = 0;
  let cost = 0;
  for (const u of list) {
    // Cache buckets count toward billed input volume (brain turns; zero elsewhere).
    totalIn += n(u.inputTokens) + n(u.cacheReadTokens) + n(u.cacheCreationTokens);
    totalOut += n(u.outputTokens);
    cost += entryCost(u, voiceEngine);
  }
  return { totalInputTokens: totalIn, totalOutputTokens: totalOut, estimatedCost: Math.round(cost * 10000) / 10000 };
}

/**
 * After a session-usage write: the totals the document SHOULD hold where what
 * it holds is behind its own `tokenUsage` entries, else null.
 *
 * The route appends this request's entries and `$max`es the saving page's own
 * totals in one write; the page only knows its own sitting, so after a reload
 * (or with two tabs) the stored totals are below the sum of the stored
 * entries. The route re-derives the sum from the document its own write
 * returned — which already contains the entries appended in that same write,
 * and any a concurrent save appended before it — and raises the stored
 * figures to it with `$max` (the same shape as durationBehindSpans).
 *
 * Only ever RAISES, per field. Entries are only appended, so the sum only
 * grows: whichever save lands last sees every entry and has the last word,
 * whatever the interleaving. A stored figure ABOVE the sum is left alone — it
 * is the page's own running total, which can legitimately be ahead of the
 * array (an append lost to a failed save is in the page's total but not in
 * the array), and a session whose client never sends entries (the embed)
 * has nothing to derive from: null.
 */
export function usageTotalsBehind(
  doc: { tokenUsage?: unknown; voiceEngine?: unknown; totalInputTokens?: unknown; totalOutputTokens?: unknown; estimatedCost?: unknown } | null | undefined,
  /** `incoming`: the entries THIS request appended (the tail of
   *  `doc.tokenUsage`), so duplicates are judged incoming-vs-stored and never
   *  within the batch (countedUsageEntries). Omitted ⇒ the whole-array rule. */
  opts: { incoming?: unknown } = {},
): Partial<UsageTotals> | null {
  const entries = opts.incoming !== undefined
    ? countedUsageEntries({ stored: doc?.tokenUsage, incoming: opts.incoming })
    : dedupeUsageEntries(doc?.tokenUsage);
  if (entries.length === 0) return null;
  const sum = computeUsageTotals(entries, doc?.voiceEngine, { dedupe: false });
  const behind: Partial<UsageTotals> = {};
  const stored = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : -Infinity);
  if (stored(doc?.totalInputTokens) < sum.totalInputTokens) behind.totalInputTokens = sum.totalInputTokens;
  if (stored(doc?.totalOutputTokens) < sum.totalOutputTokens) behind.totalOutputTokens = sum.totalOutputTokens;
  if (stored(doc?.estimatedCost) < sum.estimatedCost) behind.estimatedCost = sum.estimatedCost;
  return Object.keys(behind).length > 0 ? behind : null;
}

/** The saving page's own totals, as `$max` operands: only finite,
 *  non-negative numbers (anything else is ignored, never stored). */
export function clientTotalsMax(body: { totalInputTokens?: unknown; totalOutputTokens?: unknown; estimatedCost?: unknown } | null | undefined): Partial<UsageTotals> {
  const b = body ?? {};
  const out: Partial<UsageTotals> = {};
  const ok = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  if (ok(b.totalInputTokens)) out.totalInputTokens = b.totalInputTokens;
  if (ok(b.totalOutputTokens)) out.totalOutputTokens = b.totalOutputTokens;
  if (ok(b.estimatedCost)) out.estimatedCost = b.estimatedCost;
  return out;
}
