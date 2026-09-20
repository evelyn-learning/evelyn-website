/**
 * The homework pointer sentence — the ONE line the runtime speaks when a
 * session's homework was actually finalized.
 *
 * Why the client says it and not the brain (fix round 1, 2026-09-07): on the
 * production Claude-brain path the tool_result is resolved server-side, so the
 * close tool's "what was assigned" note never reaches the model — a brain
 * asked to announce homework would be guessing at the count and the location.
 * The runtime knows both, exactly, and only after the finalize returned. Pure:
 * no React, no I/O, so the wording is testable without a session.
 */
export interface HomeworkPointerInput {
  los: Array<{ loId: string; title: string; count: number }>;
  locator?: string;
}

/** Null ⇒ nothing may be said: no locator to send them to, or nothing assigned. */
export function buildHomeworkPointerSentence(input: HomeworkPointerInput): string | null {
  const locator = (input.locator ?? '').trim();
  if (!locator) return null;
  // SPOKEN-locator normalization (final review, 2026-09-07 — Critical). Every
  // TTS route runs `rewriteForTTS`, and tts-pronunciation.ts carries an
  // unconditional `{ pattern: /·/g, replacement: ' times ' }` rule (it exists
  // for products like N·m). So "Unit 2 · Practice" was SPOKEN as "Unit 2 times
  // Practice" — the one sentence whose whole job is to tell the student where
  // to look. Separators become commas here, in the sentence that is spoken;
  // the RENDERED action pin (action-pin-text.ts) keeps the middot, because it
  // is read with the eyes and never passes through TTS.
  const spokenLocator = locator.replace(/\s*[·×÷|›»–—]\s*/g, ', ');
  const los = (input.los ?? []).filter((l) => l && l.count > 0 && !!l.title);
  if (!los.length) return null;
  const n = los.reduce((sum, l) => sum + l.count, 0);
  if (n <= 0) return null;
  const titles = los.map((l) => l.title).join(' and ');
  // Wording note (fix round 3): "…are waiting under X" is deliberate. The
  // announce gate's classifier (isHomeworkAnnouncement) matches a practice
  // noun followed by a waiting/assigned verb — phrasing the pointer that way
  // means a model that echoes it verbatim is caught by the EXISTING rules,
  // with no widening of a classifier that must not fire on ordinary
  // in-session speech ("I've set a practice problem on the board").
  return `I've set ${n} practice question${n === 1 ? '' : 's'} on ${titles} for you — ${n === 1 ? "it's" : "they're"} waiting under ${spokenLocator}.`;
}
