/**
 * A THIN session is one where nothing was taught: too few real student
 * turns for a summary to say anything true. Live 2026-09-05 (portal-620a92a4):
 * a 5-minute session with ONE student utterance ("should we start the
 * lesson?") got a full narrative summary, and the next session opened with
 * "Last time we looked at how to fairly sample a whole city — today we build
 * on that" — continuity built on a session the student never engaged in.
 *
 * Thin sessions keep their row (duration, LOs touched, cost accounting) but
 * get no summary and are skipped by the "prior sessions" block, so "last
 * time" always refers to a session that actually happened.
 */
export const THIN_SESSION_MIN_STUDENT_TURNS = 3;

const SYNTHETIC_RE = /^\s*\[/;

export function countRealStudentTurns(transcript: Array<{ role: string; text: string }> | undefined | null): number {
  if (!Array.isArray(transcript)) return 0;
  return transcript.filter((r) => r.role === 'student' && typeof r.text === 'string' && r.text.trim() && !SYNTHETIC_RE.test(r.text)).length;
}

export function isThinSession(transcript: Array<{ role: string; text: string }> | undefined | null): boolean {
  return countRealStudentTurns(transcript) < THIN_SESSION_MIN_STUDENT_TURNS;
}
