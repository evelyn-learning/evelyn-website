/**
 * TTS provider resolution (Cartesia migration Phase 2, Task 3).
 *
 * Extracted from src/app/tutor/page.tsx's `?tts=` param logic (originally
 * `ttsParam === 'mini' ? 'openai-mini' : 'realtime'`, ~:147) so the
 * decision is unit-testable without mounting the page. Adds the
 * `NEXT_PUBLIC_TUTOR_TTS_ENGINE=cartesia` env flag as a second input,
 * falling BELOW the URL param in priority — the existing `?tts=mini`
 * override behavior is unchanged (flag-off byte-identical requirement,
 * see docs/superpowers/plans/2026-07-06-cartesia-migration-phase2.md
 * Global Constraints).
 *
 * Pure module: zero imports from React/Next — server- and client-safe.
 */

export type TtsProvider = 'realtime' | 'openai-mini' | 'cartesia' | 'silent';

/**
 * Resolve the effective TTS provider.
 *
 * Priority: the URL param always wins over the env flag — `?tts=mini` →
 * 'openai-mini', `?tts=silent` → 'silent' (test mode: no TTS API calls,
 * zero-filled audio buffers client-side), `?tts=cartesia` → 'cartesia'
 * (explicit opt-back-in for live ear-tests when the env default is
 * 'silent'). Otherwise `envFlag === 'cartesia' | 'silent'` decides.
 * Anything else (both unset, env garbage, or an unrecognized URL param)
 * → 'realtime', matching the pre-Cartesia default exactly.
 */
export function resolveTtsProvider(
  urlParam: string | null | undefined,
  envFlag: string | undefined,
): TtsProvider {
  if (urlParam === 'mini') return 'openai-mini';
  if (urlParam === 'silent') return 'silent';
  if (urlParam === 'cartesia') return 'cartesia';
  if (envFlag === 'cartesia') return 'cartesia';
  if (envFlag === 'silent') return 'silent';
  return 'realtime';
}
