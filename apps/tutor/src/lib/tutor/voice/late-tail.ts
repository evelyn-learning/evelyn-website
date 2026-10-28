/**
 * Late tail of the student's own answer — pure decision.
 *
 * GDI session embed-1792346446334 (2026-10-18, 18:09:37): the student said
 * "No, I haven't. でもハワイはあります。I went to Hawaii 6 years ago." — Ink 2
 * closed the turn at the pause, the tutor began its five-sentence reply, and
 * two seconds later the rest arrived: "ハネムーンで行きました。". The
 * classifier called it a continuation ("adding context to their prior answer")
 * and the late fallback still dispatched it as a new turn at prod=speaking,
 * which killed the reply; the tutor then repeated its whole three-item
 * instruction. A short, question-free addendum that lands within seconds of
 * the tutor starting to speak, right after the student's own turn, is the end
 * of that turn — it rides as context on the next brain call and the tutor
 * keeps talking.
 */

/** Measured from the tutor turn's dispatch (brainTurnStartedAtRef): ~1.3 s of
 *  brain latency plus up to ~4 s of speech. */
export const LATE_TAIL_MAX_TUTOR_TURN_MS = 5500;
export const LATE_TAIL_MAX_TOKENS = 12;

export interface LateTailInput {
  /** Classifier verdict for the utterance. */
  verdict: string;
  /** Production state when the final arrived. */
  prodState: string;
  /** Milliseconds since the tutor's current turn was dispatched. */
  tutorTurnMs: number;
  text: string;
}

function tokens(text: string): number {
  const latin = text.match(/[A-Za-z][A-Za-z']*/g)?.length ?? 0;
  const cjk = text.match(/[぀-ヿ㐀-䶿一-鿿]/g)?.length ?? 0;
  // a kana/kanji run of ~3 chars is roughly one word
  return latin + Math.ceil(cjk / 3);
}

export function isLateTail(i: LateTailInput): boolean {
  if (i.verdict !== 'continuation') return false;
  if (i.prodState !== 'speaking') return false;
  if (i.tutorTurnMs > LATE_TAIL_MAX_TUTOR_TURN_MS) return false;
  const t = i.text.trim();
  if (!t || /[?？]\s*$/.test(t)) return false;
  return tokens(t) <= LATE_TAIL_MAX_TOKENS;
}

export function lateTailNote(tail: string): string {
  return (
    `[runtime note — not from the student] Just after your previous turn began, the student added to their earlier answer: ` +
    `"${tail.trim().slice(0, 120)}". Treat it as part of that answer. Acknowledge it in a few words if it matters, ` +
    `do not repeat your previous instruction, and continue from where you were. Apply this silently; never mention this note.`
  );
}
