/**
 * The tutor describes how a word "sounded" — from a transcript.
 *
 * GDI starter session embed-1792276942766 (2026-10-17): 「"last" の音が少し
 * 変わってしまいましたね」 after the recogniser wrote "the rest week", and
 * 「"ear" ではなく "ever" の音でしたが」 after it wrote "ear eaten". The tutor
 * never hears audio; the transcript is the recogniser's guess, and the prompt
 * already says so. The habit persists, so — like the other habits — a
 * per-turn note follows the turn that shows it.
 *
 * Exception: when the STUDENT asked about pronunciation (「英語ではどう言い
 * ますか」「発音は？」), answering is right (the katakana question).
 */
const PRONUNCIATION_CLAIM_RE =
  /(?:の|は)?(?:音|発音)(?:が|は|を|に|で)?[^。]{0,24}?(?:変わ|違っ|違い|出て|ずれ|弱|強|聞こえ|でした|ですね|だった)|聞こえ(?:ました|ます|て)|(?:と|に)聞こえ|\bsound(?:ed|s)?\s+(?:like|a bit|a little|more like)\b|\bpronounc(?:ed|iation)\b|\byou said it like\b/i;

const STUDENT_ASKS_PRONUNCIATION_RE =
  /発音|どう(?:言|読|発音)|音は|\bpronounce|\bpronunciation|\bhow do (?:you|i) say\b|\bsay (?:it|this|that) in english\b/i;

/** Did the tutor describe the sound of the student's speech, unasked? */
export function claimsPronunciation(tutorText: string, studentText: string): boolean {
  if (STUDENT_ASKS_PRONUNCIATION_RE.test(studentText ?? '')) return false;
  return PRONUNCIATION_CLAIM_RE.test(tutorText ?? '');
}

export const PRONUNCIATION_CLAIM_NOTE =
  '[runtime note — not from the student] Your last turn described how a word sounded or was pronounced. You receive text only — the transcript is the recogniser\'s guess, ' +
  'not what the student said. Never describe sounds, pronunciation or "the word you said"; when the transcript shows a wrong-looking word that sounds like the target, ' +
  'treat it as the target and move on. Apply this silently; never mention this note.';
