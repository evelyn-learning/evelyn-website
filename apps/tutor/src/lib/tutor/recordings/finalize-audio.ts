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

/**
 * Client side (useAudioRecorder): does this track get a finalize signal?
 *
 * 2026-10-09 (local end-to-end run): a TEXT session records neither track
 * (the mic is never opened; the silent tutor is not tapped —
 * voice/tutor-audio-capture.ts), yet ending it still sent one finalize
 * signal per track. A track that never uploaded a chunk in this recording
 * attempt has nothing to finalize, so no request is sent for it.
 *
 * `chunksSent` is the track's chunk counter: it advances when an upload is
 * ATTEMPTED, so a track whose uploads were all rejected still finalizes
 * (the server then decides from what is on disk).
 */
export function shouldSendTrackFinalize(opts: { chunksSent: number }): boolean {
  return Number.isFinite(opts.chunksSent) && opts.chunksSent > 0;
}

/**
 * Route side: may this POST create `<TUTOR_AUDIO_DIR>/<sessionId>/`?
 *
 * Only a chunk that carries bytes. The route used to mkdir before looking at
 * the request, so a finalize signal (or an empty chunk) from a session with
 * no audio left an empty directory behind. A finalize never needs the
 * directory: it acts only on a .pcm16 that is already there. Clients running
 * JS cached from before the client-side rule still send those signals — they
 * get the same 200 as before and leave nothing on disk.
 */
export function shouldCreateAudioDir(opts: { finalize: boolean; bodyBytes: number }): boolean {
  return !opts.finalize && opts.bodyBytes > 0;
}
