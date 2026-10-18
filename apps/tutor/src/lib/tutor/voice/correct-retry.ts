/**
 * A checked-correct answer that the tutor asked for again.
 *
 * GDI starter session embed-1792261973710 (2026-10-17): the tutor said aloud
 * "make a sentence about last week — a place you went, anything"; the student
 * said "I went to Nagoya last week."; the independent check found it correct
 * for the question asked; the tutor replied 「でも、今回の問題は「岐阜」でした。
 * もう一度、"Gifu" を使って言ってみてください」 — grading against the card's
 * example, not against what it had asked. The before-display kill reads only
 * the opening stance, and this reply opened with praise; the rejection came
 * two sentences later, after the praise had been spoken.
 *
 * Deterministic half, after the turn: the check said CORRECT (deciding, for
 * the question asked or the problem itself) and the delivered turn asked the
 * student to say it again — the next brain turn gets a note to credit the
 * earlier answer and not ask for it again.
 */
import { precheckDecides, type PublicVerdictPrecheck } from './verdict-precheck-shared';
import { isRetryAsk } from './retry-cap';

/** Did this delivered turn re-ask for an answer the check found correct? */
export function reAskedCheckedCorrect(p: PublicVerdictPrecheck | null | undefined, tutorText: string): boolean {
  if (!precheckDecides(p)) return false;
  if (p.verdict !== 'correct' || p.answers === 'other_part' || p.answers === 'neither') return false;
  return isRetryAsk(tutorText);
}

export const CORRECT_RETRY_NOTE =
  '[runtime note — not from the student] An independent check found the student\'s previous answer CORRECT for the task as you stated it aloud, ' +
  'yet your last turn asked them to say it again or to use a different word. The task is what you SAID, not the example on the card. ' +
  'In this turn: whatever they say now, tell them plainly that their earlier sentence was right too, do not ask for it again, ' +
  'and move to the next item. Apply this silently; never mention this note.';

/** Lower-cased Latin words of a text, as a single space-joined string. */
function latinSentence(text: string): string {
  return (text.match(/[A-Za-z][A-Za-z']*/g) ?? []).map((w) => w.toLowerCase()).join(' ');
}

/**
 * 2026-10-18 (GDI embed-1792338502233, turn 6): the student said "I went to
 * the office yesterday" correctly and the tutor replied 「Nice. 言ってみましょう。
 * I went to the office yesterday. — 完璧です」 — asked for a sentence it was
 * about to praise. No verdict precheck was involved, so reAskedCheckedCorrect
 * could not see it. This catches the shape directly: a repeat-ask whose text
 * contains the student's own last English sentence (four words or more).
 */
// A plain "say it" ask — 言ってみましょう / 言ってみてください / repeat after me —
// without the もう一度 that isRetryAsk needs: the live turn had none.
const SAY_IT_ASK_RE =
  /言(?:って|い)(?:み(?:ましょう|てください|て)|ましょう)|繰り返し|リピート|\brepeat after me\b|\bsay (?:it|this|that)\b|\btry saying\b/;

export function reAskedOwnSentence(studentText: string, tutorText: string): boolean {
  if (!isRetryAsk(tutorText) && !SAY_IT_ASK_RE.test(tutorText ?? '')) return false;
  const said = latinSentence(studentText ?? '');
  if (said.split(' ').filter(Boolean).length < 3) return false;
  return latinSentence(tutorText ?? '').includes(said);
}

export const OWN_SENTENCE_RETRY_NOTE =
  '[runtime note — not from the student] Your last turn asked the student to say a sentence they had JUST said, in those words. ' +
  'A sentence they already produced is done: confirm it in one short clause and move to the next item. ' +
  'Never ask for a repeat of something that was right. Apply this silently; never mention this note.';

/** English questions of a tutor turn, normalised: lower-cased Latin words,
 *  with a trailing "too" dropped so "Have you ever eaten sushi, too?" and
 *  "Have you ever eaten sushi?" are the same question. */
export function englishQuestions(tutorText: string): string[] {
  const out: string[] = [];
  for (const raw of (tutorText ?? '').split(/(?<=[。！？.!?])\s+|\n+/)) {
    const s = raw.trim();
    if (!/[?？]\s*$/.test(s)) continue;
    const words = (s.match(/[A-Za-z][A-Za-z']*/g) ?? []).map((w) => w.toLowerCase());
    if (words.length < 3) continue;
    if (words[words.length - 1] === 'too') words.pop();
    out.push(words.join(' '));
  }
  return out;
}

/** Did the student's turn carry an answer (any English, a yes/no, or a
 *  Japanese sentence)? */
function carriesAnswer(studentText: string): boolean {
  const t = studentText ?? '';
  if ((t.match(/[A-Za-z][A-Za-z']*/g) ?? []).length >= 2) return true;
  if (/\b(?:yes|no|yeah|nope)\b/i.test(t)) return true;
  if (/^[\s、。]*(?:はい|いいえ|うん|ええ|ないです|あります)/.test(t)) return true;
  // a Japanese sentence, not a filler (えっと / えーと / あの / うーん)
  const cjk = (t.match(/[\u3040-\u30FF\u4E00-\u9FFF]/g) ?? []).join('');
  return cjk.length >= 3 && !/^(?:え+っ?と+|あの+|うー*ん|ん+|はい|えー+)$/.test(cjk);
}

/**
 * 2026-10-18 (GDI embed-1792346446334): "Have you ever eaten sushi?" was asked
 * three times after a correct "Yes, I have." — a three-word answer under the
 * own-sentence floor, and the return-question loop (student asks it back, the
 * tutor answers and asks the student again). The same English question in two
 * consecutive tutor turns, with an answer from the student in between, is a
 * re-ask of a finished question.
 */
export function reAskedAnsweredQuestion(prevTutorText: string, studentText: string, tutorText: string): string | null {
  if (!carriesAnswer(studentText)) return null;
  const before = new Set(englishQuestions(prevTutorText));
  if (before.size === 0) return null;
  for (const q of englishQuestions(tutorText)) if (before.has(q)) return q;
  return null;
}

export const REASKED_QUESTION_NOTE =
  '[runtime note — not from the student] Your last turn asked the same English question you had asked the turn before, ' +
  'and the student had already answered it. A question that was answered is finished — also when the student asks it back ' +
  'to you: answer it yourself in one sentence and move to the next item. Do not ask it again. Apply this silently; never mention this note.';

