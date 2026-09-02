/**
 * Central model registry — the ONE place model selection lives.
 *
 * Every LLM call site resolves its model + client through a named ROLE here
 * instead of a hardcoded model string and a private `new Anthropic(...)`.
 * Per-deployment (= per-tenant: evelynlearning, evelyntutor, crimsora, any
 * future academy tenant) overrides are plain env vars in that deployment's
 * env file, so a tenant flips models without a code change:
 *
 *   TUTOR_MODEL_<ROLE>            model id for one role (dashes → underscores,
 *                                 e.g. TUTOR_MODEL_BRAIN, TUTOR_MODEL_PLANGEN_FAST)
 *   TUTOR_MODEL_<ROLE>_BASE_URL   Anthropic-compatible endpoint for that role
 *                                 (e.g. https://api.deepseek.com/anthropic)
 *   TUTOR_MODEL_<ROLE>_API_KEY    key for that endpoint
 *   TUTOR_MODEL_BASE_URL / TUTOR_MODEL_API_KEY   global fallbacks for the two above
 *
 * Legacy vars (TUTOR_BRAIN_MODEL, BRAINGEN_MODEL, BRAINGEN_VERIFY_MODEL,
 * NOTES_MODEL, TAXONOMY_MODEL) keep working as aliases so existing prod env
 * files are untouched. All defaults below equal the previously hardcoded
 * values — deploying this file changes NOTHING until an env var is set.
 *
 * Server-only (reads env). Rate data lives in the client-safe ./model-rates.
 */
import Anthropic from '@anthropic-ai/sdk';

export type ModelRole =
  | 'brain'            // live voice brain (claude-brain.ts)
  | 'braingen'         // Layer-2 problem generator
  | 'braingen-verify'  // independent fresh-context verifier
  | 'judge'            // end-of-turn groundedness judge
  | 'perception'       // student-utterance intent classifier
  | 'gist'             // question gist / pin extraction
  | 'repair'           // Rule-8 render repair
  | 'recap'            // end-of-session summary (legacy NOTES_MODEL)
  | 'sketch'           // whiteboard doodler
  | 'chat'             // text-chat mode
  | 'classic-engine'   // legacy Deepgram+Claude engine
  | 'validate-tool-call'
  | 'whiteboard-enrich' // generate-whiteboard route
  | 'wolfram-fallback'  // Claude fallback when Wolfram can't parse
  | 'tts-shorten'       // ElevenLabs recovery-line shortener
  | 'homework'          // homework upload extraction (vision)
  | 'grader'            // portal free-response grader
  | 'social-threads'    // portal social-thread extraction
  | 'video-curator'
  | 'plangen-fast'      // lesson-plan text generation / labels / classify / condense
  | 'plangen-vision'    // lesson-plan material vision extraction
  | 'taxonomy'          // taxonomy generation (legacy TAXONOMY_MODEL)
  | 'content-gen'       // offline course-content generation (bank items, batch authoring scripts)
  | 'content-verify'    // offline fresh-context solve-verify gate (problem bank, mock forms)
  | 'notes-pointers';   // topic-notes pointer enrichment (legacy POINTER_GEN_MODEL)

const DEFAULT_MODEL: Record<ModelRole, string> = {
  brain: 'claude-sonnet-4-6', // prod ships claude-sonnet-5 via TUTOR_BRAIN_MODEL
  braingen: 'claude-sonnet-5',
  'braingen-verify': 'claude-sonnet-5',
  judge: 'claude-haiku-4-5-20251001',
  perception: 'claude-haiku-4-5-20251001',
  gist: 'claude-haiku-4-5-20251001',
  repair: 'claude-haiku-4-5-20251001',
  recap: 'claude-haiku-4-5-20251001',
  sketch: 'claude-haiku-4-5-20251001',
  chat: 'claude-sonnet-4-6',
  'classic-engine': 'claude-sonnet-4-6',
  'validate-tool-call': 'claude-sonnet-4-6',
  'whiteboard-enrich': 'claude-sonnet-4-6',
  'wolfram-fallback': 'claude-sonnet-4-6',
  'tts-shorten': 'claude-haiku-4-5-20251001',
  homework: 'claude-sonnet-4-6',
  grader: 'claude-sonnet-4-6',
  'social-threads': 'claude-haiku-4-5-20251001',
  'video-curator': 'claude-sonnet-4-6',
  'plangen-fast': 'claude-haiku-4-5-20251001',
  'plangen-vision': 'claude-sonnet-4-6',
  taxonomy: 'claude-sonnet-5',
  'content-gen': 'claude-sonnet-5',
  'content-verify': 'claude-sonnet-5',
  'notes-pointers': 'claude-opus-5',
};

/** Pre-registry env vars that must keep working (prod env files set these). */
const LEGACY_MODEL_ENV: Partial<Record<ModelRole, string>> = {
  brain: 'TUTOR_BRAIN_MODEL',
  braingen: 'BRAINGEN_MODEL',
  'braingen-verify': 'BRAINGEN_VERIFY_MODEL',
  recap: 'NOTES_MODEL',
  taxonomy: 'TAXONOMY_MODEL',
  'notes-pointers': 'POINTER_GEN_MODEL',
};

function envSuffix(role: ModelRole): string {
  return role.toUpperCase().replace(/-/g, '_');
}

export interface ResolvedModel {
  role: ModelRole;
  model: string;
  baseURL?: string;
  apiKey?: string;
  /** True when the call goes to Anthropic itself (no baseURL override).
   * Anthropic-only request params (thinking, cache_control) are stripped
   * by prepareParams() when this is false. */
  native: boolean;
}

/**
 * Optional per-role FALLBACK provider — used by call sites that implement
 * failover (currently the brain): TUTOR_MODEL_<ROLE>_FALLBACK holds the
 * fallback model id (its presence enables the fallback), with
 * TUTOR_MODEL_<ROLE>_FALLBACK_BASE_URL / _API_KEY for its endpoint.
 * Returns null when unconfigured.
 */
export function resolveFallback(role: ModelRole): ResolvedModel | null {
  const suffix = envSuffix(role);
  const model = process.env[`TUTOR_MODEL_${suffix}_FALLBACK`];
  if (!model) return null;
  const baseURL = process.env[`TUTOR_MODEL_${suffix}_FALLBACK_BASE_URL`] || undefined;
  const apiKey =
    process.env[`TUTOR_MODEL_${suffix}_FALLBACK_API_KEY`] || process.env.ANTHROPIC_API_KEY;
  return { role, model, baseURL, apiKey, native: !baseURL };
}

export function resolveModel(role: ModelRole): ResolvedModel {
  const suffix = envSuffix(role);
  const legacy = LEGACY_MODEL_ENV[role];
  const model =
    process.env[`TUTOR_MODEL_${suffix}`] ||
    (legacy ? process.env[legacy] : undefined) ||
    DEFAULT_MODEL[role];
  const baseURL =
    process.env[`TUTOR_MODEL_${suffix}_BASE_URL`] || process.env.TUTOR_MODEL_BASE_URL || undefined;
  const apiKey =
    process.env[`TUTOR_MODEL_${suffix}_API_KEY`] ||
    process.env.TUTOR_MODEL_API_KEY ||
    process.env.ANTHROPIC_API_KEY;
  return { role, model, baseURL, apiKey, native: !baseURL };
}

// One client per distinct endpoint+key, shared across roles.
const clientCache = new Map<string, Anthropic>();

export interface RoleClient {
  client: Anthropic;
  model: string;
  native: boolean;
}

/**
 * Resolve a role to its configured client + model id. Lazy and memoized —
 * safe to call at module scope in Next (env is loaded first) and inside
 * lazy getters in tsx scripts that dotenv before first use.
 */
export function getModelClient(role: ModelRole): RoleClient {
  return clientFor(resolveModel(role));
}

/** Client for a role's configured fallback provider, or null when none. */
export function getFallbackClient(role: ModelRole): RoleClient | null {
  const resolved = resolveFallback(role);
  return resolved ? clientFor(resolved) : null;
}

function clientFor(resolved: ResolvedModel): RoleClient {
  const cacheKey = `${resolved.baseURL ?? 'anthropic'}|${resolved.apiKey ?? ''}`;
  let client = clientCache.get(cacheKey);
  if (!client) {
    client = new Anthropic({
      apiKey: resolved.apiKey,
      ...(resolved.baseURL ? { baseURL: resolved.baseURL } : {}),
    });
    clientCache.set(cacheKey, client);
  }
  return { client, model: resolved.model, native: resolved.native };
}

/**
 * Make a request body portable across providers: when the role targets a
 * non-Anthropic endpoint, strip Anthropic-only params — `thinking` at the
 * top level and every nested `cache_control` (system blocks, message
 * content blocks, tools). No-op (same reference, zero cost) when native.
 */
export function prepareParams<T>(role: ModelRole, params: T): T {
  if (resolveModel(role).native) return params;
  return stripAnthropicOnly(params, true) as T;
}

/** Same stripping, but for an explicit target (failover call sites pick
 *  primary vs fallback per call, so role-level resolution doesn't apply). */
export function stripAnthropicOnlyParams<T>(params: T): T {
  return stripAnthropicOnly(params, true) as T;
}

function stripAnthropicOnly(value: unknown, topLevel: boolean): unknown {
  if (Array.isArray(value)) return value.map((v) => stripAnthropicOnly(v, false));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === 'cache_control') continue;
      if (topLevel && (k === 'thinking' || k === 'output_config')) continue;
      out[k] = stripAnthropicOnly(v, false);
    }
    return out;
  }
  return value;
}
