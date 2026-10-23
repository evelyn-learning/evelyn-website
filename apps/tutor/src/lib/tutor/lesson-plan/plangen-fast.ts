/**
 * Request params shared by the 'plangen-fast' callers (enumerate-problems,
 * material-summary, derive-rail-labels, condenseForPipeline in material-extract)
 * and material-classify (own role 'plangen-classify', still Haiku 4.5).
 *
 * 2026-10-23: the role moved from Haiku 4.5 to Haiku 5.5 (same reasoning as the
 * 'plangen' move, generate-from-text.ts `plangenEffort`). Haiku 5.5 rejects a
 * non-default temperature (400) and runs adaptive thinking by default at
 * effort `medium`, with the thinking tokens counted against `max_tokens`. So
 * any model that is NOT Haiku 4.5 gets `output_config.effort: 'low'`, no
 * temperature, and `max_tokens` raised to at least the caller's headroom
 * floor. `TUTOR_PLANGEN_FAST_EFFORT` (low|medium|high) overrides the level on
 * those models; it is ignored on Haiku 4.5 (which rejects `effort`), so the env
 * can never break the classify call that stays there.
 *
 * A Haiku 4.5 model with the env unset returns the caller's old fields
 * unchanged (max_tokens + its old temperature), so the one-env rollback
 * `TUTOR_MODEL_PLANGEN_FAST=claude-haiku-4-5-20251001` restores the exact
 * pre-change request bodies (asserted by scripts/test-plangen-fast-params.ts).
 *
 * Callers read text blocks only, so thinking blocks in the reply are ignored.
 */
import { resolveModel } from '../ai/model-registry';

export type PlangenFastEffort = 'low' | 'medium' | 'high';

/** Thinking headroom: the floor `max_tokens` is raised to on a thinking model
 *  (same 4 000 the 'plangen' Stage-1 raise uses). */
export const PLANGEN_FAST_MIN_MAX_TOKENS = 4000;

export function plangenFastModel(): string {
  return resolveModel('plangen-fast').model;
}

export function plangenFastEffort(
  raw: string | undefined = process.env.TUTOR_PLANGEN_FAST_EFFORT,
  model: string = plangenFastModel(),
): PlangenFastEffort | undefined {
  if (/haiku-4-5/.test(model)) return undefined;
  return raw === 'low' || raw === 'medium' || raw === 'high' ? raw : 'low';
}

export type PlangenFastParams =
  | { max_tokens: number; temperature?: number }
  | { max_tokens: number; output_config: { effort: PlangenFastEffort } };

/**
 * `maxTokens` / `legacyTemperature` are the caller's pre-change values (sent
 * as-is on Haiku 4.5). `minMaxTokens` is the thinking-model floor.
 */
export function plangenFastParams(
  maxTokens: number,
  legacyTemperature: number | undefined,
  opts: { model?: string; minMaxTokens?: number } = {},
): PlangenFastParams {
  const model = opts.model ?? plangenFastModel();
  const effort = plangenFastEffort(undefined, model);
  if (!effort) return legacyTemperature === undefined ? { max_tokens: maxTokens } : { max_tokens: maxTokens, temperature: legacyTemperature };
  return {
    max_tokens: Math.max(maxTokens, opts.minMaxTokens ?? PLANGEN_FAST_MIN_MAX_TOKENS),
    output_config: { effort },
  };
}
