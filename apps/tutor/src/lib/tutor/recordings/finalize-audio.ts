/**
 * Pure decision for the session-audio finalize branch. Exercised by
 * scripts/test-finalize-audio.ts.
 *
 * 2026-08-17 triage: an unload beacon fires finalize=true even for a
 * session that never uploaded a single chunk (portal-96a436f0 and friends)
 * — finalize used to write the meta sidecar and $set hasAudio:true anyway,
 * producing the admin "audio-flag-drift" class (hasAudio:true, nothing on
 * disk). No bytes → no meta, no flag.
 */

export function resolveAudioFinalize(opts: {
  /** Size of the role's .pcm16 file on disk; null when the file doesn't exist. */
  pcmBytes: number | null;
}): { writeMeta: boolean; markHasAudio: boolean } {
  const hasAudio = typeof opts.pcmBytes === 'number' && opts.pcmBytes > 0;
  return { writeMeta: hasAudio, markHasAudio: hasAudio };
}
