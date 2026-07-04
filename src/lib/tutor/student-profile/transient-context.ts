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
  'Use the above naturally for rapport and for theming examples — a brief callback or a themed problem when it genuinely fits. Vary which item you draw on; avoid re-using a thread marked recently used. A returning student\'s progress can power a warm opener ("X units in — great pace") but NEVER guilt about pace or time away. Never recite this list, and never mention that any of this information is stored or remembered in notes.';

/** Appended to USAGE_INSTRUCTION only when a lastOpener record renders —
 *  keeps the no-lastOpener output byte-identical to the pre-part-A block.
 *  Generic wording only (the digest itself is data, not instruction). */
const LAST_OPENER_INSTRUCTION =
  'Open THIS session differently from the last opener above — a different kind of opening AND different content/theming; a repeat reads as scripted.';

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
  if (!digest && threads.length === 0 && !lastOpener) return null;

  const lines: string[] = ['<student_context_transient>'];
  if (digest) lines.push(renderProgressLine(digest));
  if (threads.length > 0) {
    lines.push('social threads (light, student-volunteered — for rapport):');
    for (const t of threads) lines.push(renderThreadLine(t));
  }
  if (lastOpener) lines.push(renderLastOpenerLine(lastOpener));
  lines.push('', lastOpener ? `${USAGE_INSTRUCTION} ${LAST_OPENER_INSTRUCTION}` : USAGE_INSTRUCTION);
  lines.push('</student_context_transient>');
  return lines.join('\n');
}
