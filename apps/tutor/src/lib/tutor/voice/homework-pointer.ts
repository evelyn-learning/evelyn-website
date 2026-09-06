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
  const los = (input.los ?? []).filter((l) => l && l.count > 0 && !!l.title);
  if (!los.length) return null;
  const n = los.reduce((sum, l) => sum + l.count, 0);
  if (n <= 0) return null;
  const titles = los.map((l) => l.title).join(' and ');
  return `I've set ${n} practice question${n === 1 ? '' : 's'} on ${titles} for you — you'll find them under ${locator}.`;
}
