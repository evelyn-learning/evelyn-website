/**
 * Language drift in a bilingual lesson — pure detectors on the tutor's text.
 *
 * GDI session embed-1792346446334 (2026-10-18): once per-turn runtime notes
 * (all written in English) rode on nearly every turn, the tutor's own
 * instructions and feedback drifted into English — "Now let's move to today's
 * main practice", "ask me back, with ever in there", "That's exactly the
 * pattern" — for an A1 learner being taught in Japanese. One turn even went to
 * romaji: "Last week ni Kyoto ni itta koto arimasu ka?", which the English
 * voice then read out. The session clause already forbids both; these
 * detectors make the next turn name the slip, and LANGUAGE_KEEP_NOTE heads
 * every note-carrying turn so the notes' language stops pulling the reply.
 */

const CJK_RE = /[぀-ヿ㐀-䶿一-鿿]/;
const SENTENCE_SPLIT_RE = /(?<=[。！？])|(?<=[.!?]["”」』)]?)\s+|\n+/;

// Instruction / feedback shapes. A target phrase is a model sentence or a
// question for the student to answer or repeat; these are the tutor talking
// ABOUT the lesson in English, which an A1 learner cannot follow.
const INSTRUCTION_RE =
  /^\W*(?:now\b|let'?s\b|that'?s\b|this (?:is|was|whole)\b|here'?s\b|nice\b|good\b|great\b|well done\b|exactly\b|perfect\b|all (?:three|two|the)\b|ask me\b|try (?:it|that|again|a|the|saying)\b|say it\b|repeat after me\b|thanks for today\b|see you next\b|tell me\b|your turn\b|remember\b|notice\b|so\b|okay,? (?:now|let'?s|so)\b|first\b|next\b|then\b|again,?\b|one more\b)/i;

// Imperatives that sit mid-sentence ("Have you — ask me back, with "ever" in there.").
const INSTRUCTION_ANYWHERE_RE =
  /\bask me (?:back|again|a question|the same)\b|\bsay (?:it|that|this) (?:again|back|once more)\b|\btry (?:it |that |this )?again\b|\bin there\b|\bthat wraps\b|\bwraps up\b|\bis done now\b|\blet'?s (?:try|move|go|do)\b/i;

/** English sentences in the tutor's turn that instruct or give feedback
 *  rather than model a target phrase. */
export function englishInstructionSentences(tutorText: string): string[] {
  const out: string[] = [];
  for (const raw of (tutorText ?? '').split(SENTENCE_SPLIT_RE)) {
    // a leading quoted model sentence does not make the rest of the line a target
    const s = raw.trim().replace(/^["“「『*][^"”」』*]*["”」』*]\s*[—–-]?\s*/, '').trim();
    if (!s || CJK_RE.test(s)) continue;
    if (/^["“「『*]/.test(s)) continue;           // a quoted model sentence
    if (/\?\s*$/.test(s) && !INSTRUCTION_RE.test(s)) continue; // a question for the student
    const words = s.match(/[A-Za-z']+/g) ?? [];
    if (words.length < 3) continue;
    if (INSTRUCTION_RE.test(s) || INSTRUCTION_ANYWHERE_RE.test(s)) out.push(s);
  }
  return out;
}

// Romaji that is not also an English word. Two in one sentence = romaji.
const ROMAJI_TOKENS = new Set([
  'desu', 'deshita', 'masu', 'mashita', 'masen', 'arimasu', 'arimashita', 'imasu', 'ikimashita', 'ikimasu', 'itta', 'iku',
  'koto', 'kudasai', 'onegai', 'onegaishimasu', 'sumimasen', 'arigatou', 'arigato', 'gozaimasu', 'hai', 'iie', 'sou', 'sugoi',
  'nani', 'dare', 'doko', 'itsu', 'naze', 'doushite', 'ikaga', 'watashi', 'anata', 'kyou', 'kinou', 'ashita', 'senshuu',
  'shimasu', 'shimashita', 'shita', 'suru', 'tabeta', 'tabemasu', 'tabemashita', 'nomimashita', 'mita', 'mimashita',
  'ka', 'ne', 'yo', 'ni', 'wo', 'ga', 'wa', 'kara', 'made', 'mo', 'desho', 'deshou', 'dayo', 'dane', 'nee',
]);
// Short particles that ARE common English words are counted only beside a
// longer romaji token ("ni" alone could be a typo; "ni … itta" is Japanese).
const WEAK_ROMAJI = new Set(['ka', 'ne', 'yo', 'ni', 'wo', 'ga', 'wa', 'mo', 'kara', 'made', 'sou', 'hai']);

/** Sentences of the tutor's turn written in romaji. */
export function romajiSentences(tutorText: string): string[] {
  const out: string[] = [];
  for (const raw of (tutorText ?? '').split(SENTENCE_SPLIT_RE)) {
    const s = raw.trim();
    if (!s) continue;
    const words = (s.match(/[A-Za-z]+/g) ?? []).map((w) => w.toLowerCase());
    const hits = words.filter((w) => ROMAJI_TOKENS.has(w));
    const strong = hits.filter((w) => !WEAK_ROMAJI.has(w));
    if (strong.length >= 1 && hits.length >= 2) out.push(s);
  }
  return out;
}

export const ENGLISH_INSTRUCTION_NOTE =
  '[runtime note — not from the student] Your last turn gave instructions or feedback in English sentences. ' +
  'This student is a beginner you have been guiding in their own language: instructions, feedback, transitions and ' +
  'explanations go in that language; English is only for the target phrases the student should hear and say. ' +
  'Apply this silently; never mention this note.';

export const ROMAJI_NOTE =
  '[runtime note — not from the student] Your last turn wrote Japanese in Latin letters (romaji). Never do that: ' +
  'the voice reads romaji as broken English. Japanese is written in Japanese script, English in Latin letters, ' +
  'nothing in between. Apply this silently; never mention this note.';

/** Heads every note-carrying turn in a bilingual session. */
export const LANGUAGE_KEEP_NOTE =
  '[language note — not from the student] The bracketed notes below are runtime instructions written in English. ' +
  'They never change the language you speak: reply in the language you have been using with this student, ' +
  'and keep English for the target phrases only.';
