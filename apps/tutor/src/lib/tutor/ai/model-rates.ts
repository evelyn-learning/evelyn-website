/**
 * Shared per-model rate card ($ per 1M tokens). Client-safe: plain data, no
 * env access — importable from both server routes and client components so
 * every cost estimate in the app prices from ONE table.
 *
 * Rates verified 2026-08-30 against the Anthropic price list. Cache rates
 * follow Anthropic's multipliers: read = 0.1× input, 5m write = 1.25×,
 * 1h write = 2×. Non-Anthropic rows carry only what their provider bills.
 */
export interface ModelRate {
  input: number;
  output: number;
  cacheRead?: number;
  cacheWrite5m?: number;
  cacheWrite1h?: number;
}

export const MODEL_RATES: Record<string, ModelRate> = {
  // Current Anthropic models
  'claude-sonnet-5': { input: 2, output: 10, cacheRead: 0.2, cacheWrite5m: 2.5, cacheWrite1h: 4 },
  'claude-sonnet-4-6': { input: 3, output: 15, cacheRead: 0.3, cacheWrite5m: 3.75, cacheWrite1h: 6 },
  'claude-haiku-4-5': { input: 1, output: 5, cacheRead: 0.1, cacheWrite5m: 1.25, cacheWrite1h: 2 },
  'claude-haiku-4-5-20251001': { input: 1, output: 5, cacheRead: 0.1, cacheWrite5m: 1.25, cacheWrite1h: 2 },
  'claude-opus-5': { input: 5, output: 25, cacheRead: 0.5, cacheWrite5m: 6.25, cacheWrite1h: 10 },
  // Non-Anthropic candidates (priced so a provider swap keeps dashboards honest)
  'deepseek-chat': { input: 0.21, output: 0.32, cacheRead: 0.021 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  // Historical rows — price sessions recorded on old models; keep.
  'claude-sonnet-4-20250514': { input: 3, output: 15 },
  'claude-sonnet-4-5-20250929': { input: 3, output: 15 },
  'claude-haiku-3-5-20241022': { input: 0.8, output: 4 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
};

/** Exact match first, then longest key-prefix match (handles date-suffixed ids). */
export function lookupModelRate(model: string | undefined): ModelRate | undefined {
  if (!model) return undefined;
  if (MODEL_RATES[model]) return MODEL_RATES[model];
  let best: string | undefined;
  for (const key of Object.keys(MODEL_RATES)) {
    if (model.startsWith(key) && (!best || key.length > best.length)) best = key;
  }
  return best ? MODEL_RATES[best] : undefined;
}
