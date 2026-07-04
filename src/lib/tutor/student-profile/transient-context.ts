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

export interface TransientContextInput {
  socialMemory?: SocialThread[];
  progressDigest?: ProgressDigest;
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

/**
 * Render the transient context block, or null when there is nothing to
 * render (no digest AND no non-empty thread list).
 */
export function renderTransientContextBlock(input: TransientContextInput): string | null {
  const threads = input.socialMemory ?? [];
  const digest = input.progressDigest;
  if (!digest && threads.length === 0) return null;

  const lines: string[] = ['<student_context_transient>'];
  if (digest) lines.push(renderProgressLine(digest));
  if (threads.length > 0) {
    lines.push('social threads (light, student-volunteered — for rapport):');
    for (const t of threads) lines.push(renderThreadLine(t));
  }
  lines.push('', USAGE_INSTRUCTION);
  lines.push('</student_context_transient>');
  return lines.join('\n');
}
