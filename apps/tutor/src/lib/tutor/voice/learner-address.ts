/**
 * The tutor talks ABOUT the student instead of TO them.
 *
 * GDI starter session embed-1792261973710 (2026-10-17): three tutor turns
 * said 「学生が言った内容を確認しますね」, 「学生自身の質問を一つ作ってみて
 * ください」, 「今度は学生の番です」 — "the student" in the third person, to
 * the student. The runtime notes and the lesson plan both say "the student",
 * and the brain carried the word into speech. A beginner hears a teacher
 * narrating a process, not a conversation.
 *
 * Deterministic half: when a delivered tutor turn refers to 学生 / "the
 * student" / "the learner", the next brain turn gets a note to address the
 * learner directly. Compounds that are ordinary nouns (留学生, 大学生, 学生時代,
 * 学生証) do not count — a lesson about student life says those legitimately.
 */

// 学生 not inside 留学生 / 小学生 / 中学生 / 大学生 / 学生時代 / 学生服 /
// 学生証 / 学生割引 / 学生寮 / 学生さん (a third person who is a student).
const THIRD_PERSON_JA_RE = /(?<![留小中大])学生(?![時服証割寮さ])/;
// English: "the student", "the learner" spoken to the learner.
const THIRD_PERSON_EN_RE = /\bthe\s+(?:student|learner)(?:'s)?\b/i;

/** Does this tutor turn refer to the learner in the third person? */
export function refersToLearnerInThirdPerson(tutorText: string): boolean {
  const t = tutorText ?? '';
  return THIRD_PERSON_JA_RE.test(t) || THIRD_PERSON_EN_RE.test(t);
}

export const LEARNER_ADDRESS_NOTE =
  '[runtime note — not from the student] Your last turn spoke about "the student" (学生) in the third person. ' +
  'You are talking TO them: address them directly (あなた, or their name), say "you said" not "the student said", ' +
  'and never narrate your checking or your plan for them. Apply this silently; never mention this note.';
