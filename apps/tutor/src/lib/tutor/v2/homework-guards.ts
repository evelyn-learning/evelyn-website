/**
 * Tutor brain v2 — the homework reply checks that plain code can make (GAC brain-model comparison, 2026-11-14).
 *
 * Haiku, Sonnet and Opus made the same accuracy mistakes on the 13-subject campaign, so a bigger model was not
 * the fix and a second model judging the first was ruled out (Praveen, 2026-11-15). Each check here reads only
 * what the server already knows (the answer check, the tutor's last question, the student's words) and the
 * draft's own sentences. A draft that fails one is written again once, as the no-reveal guard does
 * (homework-turn.ts); a second draft that still fails is repaired by these same rules.
 *   1. Verdict first: when the answer check decided this message, the reply says so at its start.
 *   2. Non-answers: a bare "yes" or a stray number to a question that asks for something else gets no credit.
 *   3. Own questions: the result the tutor worked out for the student's own question is withheld like the key.
 *   4. Recaps: a part the student only guessed is never credited with working or a realisation.
 */

/** The last question in a tutor reply: its last sentence that ends in "?". */
export function lastQuestionOf(text: string): string {
  const qs = String(text ?? '').split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => /\?\s*$/.test(s));
  return qs.at(-1) ?? '';
}

const BARE_ASSENT = /^\s*(?:yes|yeah|yep|yup|ya|ok(?:ay)?|sure|no|nope|right)\s*[.!]*\s*$/i;
/** A number alone, with at most a short unit ("9", "-2.5", "3/4", "400 J"). */
const BARE_NUMBER = /^\s*[-−]?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*\d+)?\s*(?:[a-zA-Z%°]{1,4})?\s*[.!]*\s*$/;
const WH = /(?:^|[,;:]\s*|\b(?:so|now|then|and|but|ok(?:ay)?|good)\b[,\s]+)(?:what|which|where|why|how|who|when)\b/i;
/** A question that asks for a number. */
const ASKS_QUANTITY = new RegExp([
  String.raw`\bhow (?:many|much|long|far|fast|high|big|old|often)\b`,
  String.raw`\b(?:value|number|total|sum|product|difference|quotient|result|answer|limit|area|perimeter|volume|mass|speed|velocity|distance|percent(?:age)?|probability|ratio|rate|slope|length|measure|degrees?|moles?|grams?|coefficient|subscript|exponent|power|denominator|numerator|count|amount)\b`,
  String.raw`\bwhat (?:do|did|would|will) (?:you|we) get\b`,
  String.raw`\b(?:come to|equals?|work out|calculate|compute|evaluate|simplif(?:y|ies))\b`,
  String.raw`\d\s*[-+×x*/÷^]\s*\d`,
  String.raw`=\s*\?`,
].join('|'), 'i');

export interface NonAnswer { said: string; question: string }

/**
 * The student's message does not answer the tutor's last question: a bare yes/no to a what/which/where/why/how
 * question, or a bare number to such a question that does not ask for a number ("What do you notice?" → "6").
 * Null when it may be an answer, or when there was no such question.
 */
export function nonAnswer(studentSaid: string | null, lastTutor: string): NonAnswer | null {
  const said = String(studentSaid ?? '').trim();
  const question = lastQuestionOf(lastTutor);
  if (!said || !question || !WH.test(question)) return null;
  if (BARE_ASSENT.test(said)) return { said, question };
  if (BARE_NUMBER.test(said) && !ASKS_QUANTITY.test(question)) return { said, question };
  return null;
}

const firstSentences = (text: string, n: number) => String(text ?? '').split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean).slice(0, n);
export const sentencesOf = (text: string) => String(text ?? '').split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter(Boolean);

const OPENS_WITH_CREDIT = /^\W*(?:yes|yep|yeah|right|correct|exactly|spot on|perfect|well done|that's (?:right|correct|it)|that is (?:right|correct))\b/i;
const CREDITS = /\b(?:is|was|'s) (?:right|correct)\b|\bmatches\b|\byou got it\b/i;

/** The sentence gives credit: opens with "Yes"/"Right"/…, or says something "is right" / "matches". */
export function givesCredit(sentence: string): boolean {
  return OPENS_WITH_CREDIT.test(sentence) || CREDITS.test(sentence);
}

/** Check 2: the reply's first sentence credits a message that answered nothing. */
export function creditsNonAnswer(spoken: string): boolean {
  const first = firstSentences(spoken, 1)[0] ?? '';
  return givesCredit(first);
}

const POSITIVE = /\b(?:yes|yep|yeah|right|correct|exactly|spot on|that's it|well done|matches|you got it|perfect|nice work|good work|great work)\b/i;
const NEGATIVE = /\b(?:not quite|not right|not correct|incorrect|isn'?t (?:right|correct|quite)|wrong|doesn'?t (?:match|work|give|hold)|does not|close|almost|look again|check (?:that|this|your|the)|slip|mistake|error|not the)\b|^\W*no\b/i;

/**
 * Check 1: the answer check decided this message, and the reply does not say so at its start (in its first two
 * sentences). All correct: a word of credit, and it does not open on a denial. Any wrong: a word that says so.
 * A mix: either. Returns what the draft lacks, or null.
 */
export function verdictMissing(spoken: string, verdicts: ReadonlyArray<'correct' | 'incorrect'>): 'correct' | 'incorrect' | 'mixed' | null {
  if (!verdicts.length) return null;
  const head = firstSentences(spoken, 2).join(' ');
  const right = verdicts.every((v) => v === 'correct');
  const wrong = verdicts.every((v) => v === 'incorrect');
  if (right) return POSITIVE.test(head) && !/^\W*(?:not quite|no\b)/i.test(head) ? null : 'correct';
  if (wrong) return NEGATIVE.test(head) ? null : 'incorrect';
  return POSITIVE.test(head) || NEGATIVE.test(head) ? null : 'mixed';
}

/** The words that offer a value tentatively, and "I don't know" before them. */
const HEDGE_WORDS = /\b(?:i don'?t know|not sure|idk|um+|uh+|hmm+|maybe|perhaps|probably|i (?:think|guess)|is it|could it be|would it be|might it be)\b[,.\s]*/gi;
/** Words that show working or a reason. */
const REASONING = /\b(?:because|since|so|then|therefore|thus|gives?|giving|got|get|divid\w*|multipl\w*|subtract\w*|add\w*|distribut\w*|factor\w*|plug\w*|substitut\w*|cancel\w*|times|means|from)\b|=.*=/i;

/**
 * Check 4 input: the message offers its answer as a bare guess, with no working or reason ("I don't know,
 * maybe y = -2?", "maybe C6H12O6?"). A hedge that carries its reason ("maybe 400, because it's 10% twice") is
 * not a guess, and neither is a plain answer stated outright.
 */
export function isGuess(message: string): boolean {
  const m = String(message ?? '').trim().replace(/^(?:for\s*)?\(?[a-z]\)\s*:?\s*/i, '');
  const tentative = new RegExp(HEDGE_WORDS.source, 'i').test(m) || /\?\s*$/.test(m);
  const rest = m.replace(HEDGE_WORDS, ' ').replace(/[?!,]+|\.(?=\s|$)/g, ' ').trim();
  if (!tentative || !rest) return false;
  return rest.split(/\s+/).length <= 6 && !REASONING.test(rest);
}

/** A sentence that credits the student with working, a method or a realisation. */
const CREDITS_REASONING = /\b(?:once you|after you|when you (?:saw|noticed|reali[sz]ed|thought|looked|pictured|rechecked|caught|spotted|worked)|you (?:worked out|figured out|explained|reasoned|reali[sz]ed|noticed|saw|spotted|caught|fixed|derived|showed|proved|handled|distributed|converted|factored|cancell?ed|applied|used|solved|reached|found|got there by|pictured)|by (?:finding|working|using|noticing|multiplying|dividing|checking)|yourself|on your own|with clean steps)\b/i;

/** Values compared as written: spaces, case, minus signs and subscripts aside. */
export const valueKey = (s: string) => String(s ?? '').toLowerCase()
  .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
  .replace(/[−–]/g, '-').replace(/[\s$\\{}]/g, '').replace(/^[a-z]\w*(?:\([a-z]\))?=/, '');

export interface GuessedPart { label: string; value: string }

/**
 * Check 4: the sentences of a reply that credit working or a realisation for a part the student only guessed.
 * A sentence is about a guessed part when it names the part ("(b)", "part b") or its value; when every
 * confirmed part was a guess, any such credit is about one.
 */
export function unearnedCredit(spoken: string, guessed: ReadonlyArray<GuessedPart>, allGuessed: boolean): string[] {
  if (!guessed.length) return [];
  return sentencesOf(spoken).filter((s) => {
    if (!CREDITS_REASONING.test(s)) return false;
    if (allGuessed) return true;
    const key = valueKey(s);
    return guessed.some((g) => (g.label && new RegExp(`\\(${g.label}\\)|\\bpart ${g.label}\\b`, 'i').test(s)) || (valueKey(g.value).length >= 1 && key.includes(valueKey(g.value))));
  });
}

/** Why each failed check's draft was not sent (the facts' "not sent" line). */
export const V2_HOMEWORK_GUARD_REASONS = {
  verdict: (v: 'correct' | 'incorrect' | 'mixed') => `the answer check decided the student's answer (${v === 'mixed' ? 'part right, part not' : v === 'correct' ? 'it is right' : 'it is not right'}), and the reply did not say so first. Open with that verdict in plain words, then go on.`,
  nonAnswer: (n: NonAnswer) => `it gave credit to "${n.said.slice(0, 40)}", which does not answer your question "${n.question.slice(0, 160)}". Give it no credit and no "yes": ask what they mean, or ask the question again in other words.`,
  recap: (sentences: string[]) => `it credited the student with working or a realisation they never showed ("${sentences[0].slice(0, 160)}"). They only guessed that part: say they got it, not how, and credit only what they wrote.`,
  own: 'it stated the result of the student\'s own question before they had written it. They must reach it themselves: give them the next smallest step.',
} as const;

/** The verdict said in front of a second draft that still lacks it. */
export const V2_VERDICT_OPENERS = { correct: 'That\'s right.', incorrect: 'Not quite.', mixed: '' } as const;

/**
 * Check 3: the text states the result the tutor worked out for the student's own question. A number is read
 * as the key's numbers are (whole-answer-reveal.ts); a formula or expression ("CH4", "x = -9") by its written
 * form, subscripts and spacing aside. Words the question itself contains are never a hit.
 */
export function statesOwnResult(text: string, own: { q: string; a: string }, read: (text: string, value: string, given: string) => boolean): boolean {
  if (read(text, own.a, own.q)) return true;
  const k = valueKey(own.a);
  return k.length >= 2 && /[a-z]/.test(k) && /\d|[=^/]/.test(k) && valueKey(text).includes(k) && !valueKey(own.q).includes(k);
}
