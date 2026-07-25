/**
 * Task D1b — transient student-context block (tutor-pedagogy initiative).
 *
 * Renders the SESSION-SCOPED slice of the portal's StudentContext — social
 * threads (`ctx.socialMemory`) and the enrollment/progress digest
 * (`ctx.progressDigest`) — into a compact fenced block the brain reads
 * alongside the persisted <student_profile> block.
 *
 * TRANSIENT by design: this data is portal-owned, arrives with the embed
 * token for THIS session only, and is never persisted engine-side (the
 * context-ingest route only echoes socialMemory; see
 * src/app/api/portal/v1/context/route.ts). Parental opt-out / trial are
 * resolved by the ACADEMY into an empty/absent thread list before the data
 * ever reaches us — belt-and-suspenders here: an empty/absent list renders
 * nothing.
 *
 * Pure (no env reads). The flag gate (TUTOR_PEDAGOGY_OPENER) lives at the
 * caller (VoiceTutorRealtime computes this once per mount).
 */

import type { SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';

/**
 * Opener-recency (part A) — a record of the PREVIOUS session's opener so
 * the brain can vary this session's opening instead of repeating it (the
 * warm-resume clause demands "never repeat an opener or the same KIND
 * twice" but had no data until now).
 *  - `kind`: the resolved OpenerKind at seed time ('warm-resume' |
 *    'proactive' | …) — a free string so future kinds don't break the wire.
 *  - `digest`: a short human-readable summary of the opener's CONTENT
 *    (first ~160 chars of the opener turn's tutor text as captured by
 *    VoiceTutorRealtime). Digests longer than
 *    LAST_OPENER_DIGEST_MAX_CHARS are TRUNCATED (not rejected) at render
 *    time — this is boundary data from a live capture, and dropping the
 *    whole avoidance directive over an oversize digest would be worse
 *    than clipping it.
 */
export interface LastOpenerRecord {
  kind: string;
  digest: string;
}

/** Render-time ceiling for `LastOpenerRecord.digest` (see its doc). */
export const LAST_OPENER_DIGEST_MAX_CHARS = 200;

export interface TransientContextInput {
  socialMemory?: SocialThread[];
  progressDigest?: ProgressDigest;
  lastOpener?: LastOpenerRecord;
  /** Prerequisite-readiness summary from the course-start diagnostic
   *  (prose), e.g. "the student scored 62% … Shakier foundations: … Already
   *  solid: …". Same transient carrier semantics as the other fields —
   *  read for THIS session only, never persisted engine-side. A
   *  whitespace-only note is treated as absent. */
  readinessNote?: string;
}

/** `2026-06-20T10:00:00Z` → `2026-06-20`; passes through date-only strings. */
function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function renderProgressLine(d: ProgressDigest): string {
  const parts: string[] = [
    `progress: ${d.unitsCompleted}/${d.unitsTotal} units complete (${Math.round(d.percentComplete)}%)`,
  ];
  if (d.weeksElapsed !== undefined) {
    const w = d.weeksElapsed;
    parts.push(`${w} ${w === 1 ? 'week' : 'weeks'} in`);
  }
  const line = parts.join(', ');
  return d.paceNote ? `${line} — ${d.paceNote}` : line;
}

function renderThreadLine(t: SocialThread): string {
  const kind = t.kind ? `[${t.kind}] ` : '';
  const lastUsed = t.lastReferencedAt ? ` (last used ${dateOnly(t.lastReferencedAt)})` : '';
  return `- ${kind}${t.note}${lastUsed}`;
}

/** Usage guidance for the brain — generic wording only (no topic-specific
 *  teaching examples, per feedback_generic_prompts). */
const USAGE_INSTRUCTION =
  'Use the above naturally for rapport and for theming examples — a brief callback or a themed problem when it genuinely fits. Vary which item you draw on; avoid re-using a thread marked recently used. Progress notes can power a warm mid-session aside ("X units in — great pace") but NEVER guilt about pace or time away — and keep them OUT of the session opener, which belongs to this session\'s content. Never recite this list, and never mention that any of this information is stored or remembered in notes.';

/** Appended to USAGE_INSTRUCTION only when a lastOpener record renders —
 *  keeps the no-lastOpener output byte-identical to the pre-part-A block.
 *  Generic wording only (the digest itself is data, not instruction).
 *  Tuned 2026-07-04 after the first live true-replay: the original
 *  one-liner ("open differently — different kind and content") produced a
 *  reworded copy of the same opener (same callback theme, same puzzle,
 *  colder greeting — judge 2/5). The brain needs (a) the KINDS named so
 *  "different kind" is actionable, (b) an explicit note that authored plan
 *  content may repeat but the WAY IN must not, and (c) warmth declared
 *  non-negotiable so variation isn't traded against it. */
// Round 28 (first-turn verbosity): the kinds list used to lead with
// history-flavored openers (last-session callback, progress arc), which
// pushed returning students' first turns into recap. Kinds are now
// present-session shapes; continuity is a short clause, not the opener.
const LAST_OPENER_INSTRUCTION =
  'Open THIS session with a DIFFERENT KIND of opening than the last one above, anchored in ' +
  "THIS session's content. Opening kinds: a cold intriguing puzzle or claim, a what-if " +
  'scenario, a concrete scenario on the board, or a pointed question — each preceded by ONE ' +
  'short concrete continuity sentence ("last time we did X"). That continuity sentence is NOT ' +
  'itself an opening kind: it never counts as repeating a previous opener, and it never ' +
  'expands into a recap. If the last opener was one of these kinds, pick ANOTHER this time — ' +
  'do not re-run the same move in new words. ' +
  "The lesson's authored problem may be the same; your way IN must not be. Keep it warm either " +
  'way — dropping the greeting or jumping in colder is NOT acceptable variation.';

function renderLastOpenerLine(lo: LastOpenerRecord): string {
  const d = lo.digest.trim();
  const clipped = d.length > LAST_OPENER_DIGEST_MAX_CHARS
    ? `${d.slice(0, LAST_OPENER_DIGEST_MAX_CHARS).trimEnd()}…`
    : d;
  return `last session's opener (do NOT repeat): [${lo.kind}] ${clipped}`;
}

/**
 * Render the transient context block, or null when there is nothing to
 * render (no digest AND no non-empty thread list AND no last-opener
 * record). A lastOpener with an empty/whitespace digest is treated as
 * absent — there is nothing to avoid repeating.
 */
export function renderTransientContextBlock(input: TransientContextInput): string | null {
  const threads = input.socialMemory ?? [];
  const digest = input.progressDigest;
  const lastOpener = input.lastOpener?.digest.trim() ? input.lastOpener : undefined;
  const readiness = input.readinessNote?.trim() ? input.readinessNote.trim() : undefined;
  if (!digest && threads.length === 0 && !lastOpener && !readiness) return null;

  const lines: string[] = ['<student_context_transient>'];
  if (digest) lines.push(renderProgressLine(digest));
  if (threads.length > 0) {
    lines.push('social threads (light, student-volunteered — for rapport):');
    for (const t of threads) lines.push(renderThreadLine(t));
  }
  if (lastOpener) lines.push(renderLastOpenerLine(lastOpener));
  if (readiness) lines.push(`prerequisite readiness (from a diagnostic before this course): ${readiness}`);
  lines.push('', lastOpener ? `${USAGE_INSTRUCTION} ${LAST_OPENER_INSTRUCTION}` : USAGE_INSTRUCTION);
  lines.push('</student_context_transient>');
  return lines.join('\n');
}
