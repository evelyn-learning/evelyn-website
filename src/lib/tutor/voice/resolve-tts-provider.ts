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

export type TtsProvider = 'realtime' | 'openai-mini' | 'cartesia';

/**
 * Resolve the effective TTS provider.
 *
 * Priority: `?tts=mini` (urlParam === 'mini') always wins → 'openai-mini',
 * regardless of the env flag. Otherwise, `envFlag === 'cartesia'` →
 * 'cartesia'. Anything else (both unset, env garbage, or a URL param other
 * than 'mini') → 'realtime', matching the pre-Cartesia default exactly.
 */
export function resolveTtsProvider(
  urlParam: string | null | undefined,
  envFlag: string | undefined,
): TtsProvider {
  if (urlParam === 'mini') return 'openai-mini';
  if (envFlag === 'cartesia') return 'cartesia';
  return 'realtime';
}
