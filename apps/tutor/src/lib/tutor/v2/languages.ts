/**
 * Tutor brain v2 — a session taught in two languages.
 *
 * `V2Session.languages` lists the session's teaching languages, the lesson's own first (`['en', 'ja']`). With a
 * second one, the session part gets the section below: the principles of v1's bilingual clause
 * (ai/system-prompt-builder.ts buildBilingualClause), cut to the ones that matter, each with the failure it
 * prevents. It is written for "target language + support language"; lines for one support language are keyed on
 * its code, never on a partner.
 *
 * The voice client speaks a sentence that quotes a long span of the other language in parts, each in its own
 * voice language (voice/tts-language.ts splitSentenceForTts).
 */
import type Anthropic from '@anthropic-ai/sdk';
import { TUTOR_TTS_SPLIT_QUOTED_SPANS, TUTOR_V2_CHECK_MISHEARD, TUTOR_V2_PRACTICE_VERDICT, TUTOR_V2_RETRY_COUNT } from '../orchestrator/flags';
import { languageNameOf } from '../voice/language-request';
import { splitSentenceForTts } from '../voice/tts-language';

/** Lines for one support language, by its code. */
const SUPPORT_LINES: Record<string, string[]> = {
  ja: [
    // v1 (buildBilingualClause): a word-for-word or plain-form Japanese reads as rude or machine-made to an adult learner.
    'Japanese is natural and polite (です/ます), the way a kind teacher speaks, not a word-for-word translation.',
    // v1: romaji is Latin script, so the English voice reads it aloud and it sounds wrong; English in katakana
    // ("アイ・プレイド・ゴルフ") teaches a sound that is not English.
    'Write Japanese in Japanese script, never romaji: romaji is read aloud by the English voice. Write English in Latin letters, never katakana, even when the recogniser shows their English in katakana.',
  ],
};

/** The session part's section for a session with a second teaching language, or null when there is none. */
export function v2LanguagesSection(languages: readonly string[] | undefined, mode: 'text' | 'voice' = 'voice', opts: { pronunciationMeasured?: boolean; practiceVerdict?: boolean; checkMisheard?: boolean } = {}): string | null {
  if (!languages || languages.length < 2) return null;
  opts = { practiceVerdict: TUTOR_V2_PRACTICE_VERDICT, checkMisheard: TUTOR_V2_CHECK_MISHEARD, ...opts };
  const T = languageNameOf(languages[0]!);
  const code = languages[1]!.toLowerCase().split(/[-_]/)[0]!;
  const S = languageNameOf(code);
  return [
    'TWO LANGUAGES',
    // v1 Rule 5 told bilingual learners "each session sticks to one language", and a Japanese reply was taken for a misrecognition.
    `${T} is the language of this lesson and the one the student practises; ${S} is their own language, and is for help. A reply from them in ${S} is real speech: understand it and answer it.`,
    // A language partner's brief: beginners and lower-intermediate learners get help in their language, others little.
    // An advanced learner answered in Japanese hears less English. The rungs are the working levels
    // (level/working-level.ts), so a level set or remembered by the level check (v2/working-level.ts) decides the
    // amount; intermediate covers the brief's lower-intermediate learners, so it gets explanations in the support language
    // too (ruling 11-15, task 4a review M2), kept short so the lesson stays in the target language.
    `How much ${S} follows their working level. Beginner: the most help: explanations, instructions and corrections in ${S}, the practice in ${T}. Intermediate: explanations in ${S} when they help, a sentence or two, then straight back to ${T}. Advanced: little: ${T} throughout, with ${S} only when they ask. Until it is known, judge it by how they speak, not by any label.`,
    // v1 live session (findings 2026-11-15): after "Could you explain that in Japanese?" nearly every reply stayed in long Japanese grammar explanations.
    `${S} help is short: a sentence or two, then back to ${T} in the same reply, ending on something for them to say in ${T}. When they ask for an explanation in ${S}, that explanation is in ${S}; the lesson does not switch to ${S} after it. When they ask you to speak ${T}, keep to ${T} until they ask otherwise.`,
    // v1: model-and-repeat drills; the partner asks for natural conversation in which the learner speaks.
    `They produce the ${T}: ask them to build the sentence themselves, give a hint (the first word, the verb form) only when they are stuck, and say the model sentence only after they have tried. Repeating after you is not practice.`,
    // Findings case 12: a correction and a retry on nearly every answer, one sentence tried four times, wrong corrections,
    // "you're close" after a correct sentence; the lesson ran out of time before its summary. On v2 (Task 6, D5) the chains
    // went on: upper-int t13–t21, one sentence tried four times for four different errors, nearly every answer corrected.
    opts.practiceVerdict === false
      ? 'Correct the one error that matters most in each answer, for what this part practises, and let the rest go: small slips that leave the meaning clear pass without comment, more of them the lower their working level. Check the error is really in their words before you name it. At most two tries at one sentence: after the second, say the correct sentence yourself and go on to the next thing. A correct sentence is correct: say so, and never call it close.'
      : 'Correct the one error that matters most in each answer, for what this part practises, and let the rest go: in free conversation, small slips that leave the meaning clear pass without comment, more of them the lower their working level. Check the error is really in their words before you name it. A correct sentence is correct: say so, and never call it close.',
    // Task 6c, ruling 1: "small slips pass" and "right only when right" met on a practice sentence, and the slip won:
    // "I have worked here for eleven year", the retry after a correction, was called right (gdi-real-josh t≈4.3,
    // gdi-real-t2 t≈4.3 "the current company"). Fix round 1 (I2): a fix "that does not count as a try" let the retries
    // run on: tester A was asked for "I met…" about seven times (v2audio RESULTS.md). One error, one retry, two tries.
    opts.practiceVerdict === false ? '' : `A sentence they produce as practice (a retry after your correction, or their answer to a practice question on the point this part teaches) is right only when it is fully right; still correct only one error in it. When the error is in the form this part teaches: name it and ask them to say the sentence once more. At most two tries at one sentence: after the second, say the correct sentence yourself and go on to the next thing. When the only error is a slip outside that form: don't call the sentence right; give the fix in one short clause ("One small thing: we say '…'.") and go on, with no retry asked for.`,
    // Task 6, D3 (case 7): "that's right" on "eleven year" (b1 t21), the corrected form quoted as if they had said it
    // (b1 t33), "helped" credited to a learner who never said it (real-run-A t31).
    `Say a sentence is right only when their words are right. When you quote them, quote what they actually said; the corrected version is yours, said as yours ("you said …; we say …"), never put in their mouth.`,
    // v1: sound-alike words ("boat" for bought) were drilled again, and pronunciation was praised from a transcript.
    // Spoken lessons only: typed words come through no recogniser.
    // With measured pronunciation (pronunciation.ts, the partner's `pronunciation` option) the scores in the facts are
    // what they are judged on; never the transcript.
    mode === 'text' ? '' : `Their words reach you through a speech recogniser that hears both languages. It often writes a spoken ${T} word as a sound-alike or in ${S} script: a sound-alike of the target is the target. ${opts.pronunciationMeasured ? 'Their pronunciation reaches you only as a measured score in the facts: comment on it only from such a score, never from the transcript.' : 'You cannot hear their pronunciation: don\'t praise or judge it.'}`,
    // Task 6e (v2audio tester B): "my role" heard as "my lover" got a correction built on it, and "I met someone" heard as
    // "I met some" was called correct.
    mode === 'text' || !opts.checkMisheard ? '' : 'When a word in their sentence makes little sense where it stands, or one seems to be missing, the recogniser may have misheard: ask "Did you say …?" with the word you think they said, before you correct the sentence or call it right.',
    ...(SUPPORT_LINES[code] ?? []),
    // Findings case 4: "please stop" got a question and then the next part; "I have to finish" had to be said three times.
    'When they say they want to stop or have to go, that reply is the close: one sentence on what they practised, a goodbye, and end_lesson. No new question, no new exercise.',
  ].filter(Boolean).join('\n');
}

/** Two replies are tries at one sentence when most of the shorter one's words are in the other. */
const RETRY_OVERLAP = 0.6;
const RETRY_MIN_WORDS = 3;
const wordsIn = (t: string) => t.toLowerCase().replace(/’/g, "'").match(/[\p{L}\p{N}]+(?:'[\p{L}]+)*/gu) ?? [];
function sameSentence(a: string, b: string): boolean {
  const x = new Set(wordsIn(a)); const y = new Set(wordsIn(b));
  const [small, big] = x.size <= y.size ? [x, y] : [y, x];
  if (small.size < RETRY_MIN_WORDS) return false;
  return [...small].filter((w) => big.has(w)).length / small.size >= RETRY_OVERLAP;
}
const isOwnWords = (m: Anthropic.MessageParam) => m.role === 'user' && (typeof m.content === 'string' ? !m.content.startsWith('[') : m.content.some((b) => b.type === 'text' && !b.text.startsWith('[')));
const ownText = (m: Anthropic.MessageParam) => (typeof m.content === 'string' ? m.content : m.content.map((b) => (b.type === 'text' ? b.text : '')).join(' '));

/** The facts line that counts tries at one sentence (D5, Task 6: upper-int t13–t21, one sentence tried four times):
 *  their words just now, and the replies of theirs straight before, that are the same sentence again. From the second
 *  try on, the correct sentence comes next. Lessons with a second teaching language only. `enabled` is the kill switch. */
export function v2RetryFacts(languages: readonly string[] | undefined, history: Anthropic.MessageParam[], heard: string | null | undefined, enabled: boolean = TUTOR_V2_RETRY_COUNT): string[] {
  if (!enabled || !languages || languages.length < 2 || !heard || heard.trim().startsWith('[')) return [];
  const before = history.filter(isOwnWords).map(ownText);
  let tries = 1; let cur = heard;
  for (let i = before.length - 1; i >= 0 && sameSentence(before[i]!, cur); i--) { tries += 1; cur = before[i]!; }
  if (tries < 2) return [];
  return [`tries: their words just now are try ${tries} at the sentence they said just before. If it still has an error, say the correct sentence yourself now and go on to the next thing; no further try at it`];
}

/** What the voice is given for one sentence: a sentence in the support language that quotes a long span of the
 *  target is spoken in parts, each in its own voice language. One part in a one-language session. */
export function v2SpeechParts(sentence: string, languages: readonly string[] | undefined): string[] {
  return splitSentenceForTts(sentence, TUTOR_TTS_SPLIT_QUOTED_SPANS ? languages : undefined).map((p) => p.text);
}
