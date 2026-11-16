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
import { TUTOR_TTS_SPLIT_QUOTED_SPANS } from '../orchestrator/flags';
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
export function v2LanguagesSection(languages: readonly string[] | undefined, mode: 'text' | 'voice' = 'voice', opts: { pronunciationMeasured?: boolean } = {}): string | null {
  if (!languages || languages.length < 2) return null;
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
    // "you're close" after a correct sentence; the lesson ran out of time before its summary.
    `Correct the one error that matters most for what this part practises, and let the rest go; check the error is really in their words before you name it. At most two tries at one sentence: after the second, say it correctly and go on. A correct sentence is correct: say so, and never call it close.`,
    // v1: sound-alike words ("boat" for bought) were drilled again, and pronunciation was praised from a transcript.
    // Spoken lessons only: typed words come through no recogniser.
    // With measured pronunciation (pronunciation.ts, the partner's `pronunciation` option) the scores in the facts are
    // what they are judged on; never the transcript.
    mode === 'text' ? '' : `Their words reach you through a speech recogniser that hears both languages. It often writes a spoken ${T} word as a sound-alike or in ${S} script: a sound-alike of the target is the target. ${opts.pronunciationMeasured ? 'Their pronunciation reaches you only as a measured score in the facts: comment on it only from such a score, never from the transcript.' : 'You cannot hear their pronunciation: don\'t praise or judge it.'}`,
    ...(SUPPORT_LINES[code] ?? []),
    // Findings case 4: "please stop" got a question and then the next part; "I have to finish" had to be said three times.
    'When they say they want to stop or have to go, that reply is the close: one sentence on what they practised, a goodbye, and end_lesson. No new question, no new exercise.',
  ].filter(Boolean).join('\n');
}

/** What the voice is given for one sentence: a sentence in the support language that quotes a long span of the
 *  target is spoken in parts, each in its own voice language. One part in a one-language session. */
export function v2SpeechParts(sentence: string, languages: readonly string[] | undefined): string[] {
  return splitSentenceForTts(sentence, TUTOR_TTS_SPLIT_QUOTED_SPANS ? languages : undefined).map((p) => p.text);
}
