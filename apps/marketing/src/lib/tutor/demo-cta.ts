/**
 * Task E2 (pedagogy, flag NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER) — the demo
 * session-end enrol CTA decision, split out as a pure helper so the gating
 * (flag on + demo + session actually ended) is unit-testable outside the
 * page (scripts/test-demo-cta.ts, npm run test:pedagogy-e2).
 *
 * Design (locked): the TUTOR never sells — the close directive in
 * formatLessonPlanContext's demo branch keeps the goodbye warm and
 * in-character. The PAGE owns the conversion conversation, and only on the
 * end surface, only for demo (logged-out) sessions, only behind the flag.
 *
 * Pure, no I/O, no env reads — the caller passes the resolved flag value
 * (page-level TUTOR_PEDAGOGY_OPENER const) so flag-off renders are
 * byte-identical by construction.
 */
export function shouldShowDemoCta(args: {
  /** The resolved NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER flag value. */
  flagOn: boolean;
  /** Authenticated student id, if any — presence means NOT a demo. */
  studentId?: string | null;
  /** True only on the session-end (summary) surface. */
  sessionEnded: boolean;
}): boolean {
  return args.flagOn && !args.studentId && args.sessionEnded;
}
