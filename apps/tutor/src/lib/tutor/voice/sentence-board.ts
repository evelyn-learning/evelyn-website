/**
 * Sentence cards for language lessons (2026-10-29).
 *
 * The bilingual prompt orders the brain to write every model / corrected
 * sentence on the board, but live run 1 showed it rarely does (3 of 29 turns).
 * So the client does it itself: when a language-session turn rendered nothing
 * and the tutor QUOTED a sentence, the quoted sentence becomes a `showSentence`
 * card. A quote that repeats most of what the student just said but changes
 * something is a correction — its changed words are highlighted on the card
 * and stressed (uppercased) in the string sent to TTS. Capitals are the stress
 * mechanism because, measured on Cartesia sonic-3, they make the word louder
 * and longer without touching the rest of the sentence (SSML-ish tags garble
 * timing). Display text is never uppercased.
 *
 * Pure: no React, no I/O.
 */
import { dropFillersAndRepeats } from './filler-repeats';
import { isRetryAsk } from './retry-cap';
import { normaliseNumberTokens } from './number-tokens';

/** 'echo' (GDI run 3): the tutor quoting the student's own words back (often
 *  the wrong ones) — never a card, unless the check found the student's
 *  sentence correct and the turn corrects nothing (planSentenceBoard, Task 15
 *  §A): then it is a model card. */
export interface QuotedSentence {
  sentence: string; kind: 'correction' | 'model' | 'echo'; emphasis: string[];
  /** Task 15 §A — why a model card exists when the student's sentence was
   *  checked correct: 'echo' = a quote of the student's own (correct) words,
   *  'checked' = the check's sentence, said unquoted by the tutor;
   *  'affirmed' = (Task 20 §G1) a quote of the student's words the tutor
   *  itself called correct while the check was silent / undecided;
   *  'introduced' = (Task 21 §B1) the tutor's own words after a "say it as a
   *  full sentence:" colon that repeat the student's words;
   *  'levelcheck' = (Task 23 §B2) the student's own answer in a level-check
   *  part, carded whatever the verdict. */
  source?: 'echo' | 'checked' | 'affirmed' | 'introduced' | 'levelcheck' | 'grammar-recast';
  /** Task 21 fix round 1 (m, B2): word positions (0-based, words as the card
   *  splits them) that carry the emphasis — only the edited position is
   *  marked, not every copy of the word. */
  emphasisAt?: number[];
}

export const SENTENCE_BOARD_MAX_PER_TURN = 2;

const MIN_WORDS = 3;
const MAX_EMPHASIS = 4;
const CORRECTION_OVERLAP = 0.5;
/** A quote whose tokens are all the student's is an echo of the student
 *  (Task 18 §D: whatever share of the student's words it covers). */

/** Straight or curly double quotes, Japanese corner brackets 「…」 / 『…』
 *  (GDI run 4: the bilingual tutor quotes corrections that way) and curly
 *  single quotes ‘…’ (an apostrophe ’ followed by a letter — haven’t — does
 *  not close the span); one line at most. */
const QUOTE_RE = /"([^"\n]+)"|“([^”\n]+)”|「([^」\n]+)」|『([^』\n]+)』|‘((?:[^’\n]|’(?=\p{L}))+)’/gu;
/** The inner text of a QUOTE_RE match, whichever quote style matched. */
const quoteInner = (m: RegExpMatchArray): string => m.slice(1).find((g) => g !== undefined) ?? '';
/** Hiragana/katakana, CJK ideographs, Hangul, fullwidth forms. */
const CJK_RE = /[　-ヿ㐀-䶿一-鿿豈-﫿가-힯＀-￯]/;
const LATIN_WORD_RE = /[A-Za-zÀ-ɏ]/;
const TOKEN_RE = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
/** Like TOKEN_RE but a hyphenated compound (front-load) is one word — used
 *  only to pick emphasis words, so "front load" → "front-load" stresses the
 *  compound as a whole. */
const COMPOUND_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
const lowerTok = (w: string) => w.toLowerCase().replace(/’/g, "'");

/** Task 18 §D (GDI run 6: "3" vs "three" made the student's own sentence
 *  look corrected): digits read as number words — 0–20 and the tens 30…90 —
 *  so "3" ≡ "three" and "30" ≡ "thirty". Other numbers stay digits. */
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const TENS_WORDS: Record<number, string> = { 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };
export function numberWordToken(tok: string): string {
  if (!/^\d+$/.test(tok)) return tok;
  const n = Number(tok);
  if (n <= 20) return NUMBER_WORDS[n]!;
  return TENS_WORDS[n] ?? String(n);
}
/** Thousands separators dropped ("1,000" → "1000") before tokenising. */
const dropThousands = (text: string) => (text ?? '').replace(/(\d),(?=\d{3}(?!\d))/g, '$1');

/** Lowercase words, punctuation stripped, apostrophes kept (haven't), digits
 *  as number words. Task 23 §D1: the same normaliseNumberTokens the
 *  correct-retry tokeniser uses ("35" → "thirty" "five", "21" ↔
 *  "twenty-one"), on both sides of every comparison. */
function tokens(text: string): string[] {
  return normaliseNumberTokens((dropThousands(text).match(TOKEN_RE) ?? []).map((t) => t.toLowerCase().replace(/’/g, "'")));
}
/** One display word as comparison tokens (a number may be two: "35"). */
const wordToks = (w: string): string[] => normaliseNumberTokens([lowerTok(w)]);

/** A quoted span that may be a sentence card (trimmed), or null. */
function qualifyingSpan(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/(…|\.\.\.)$/.test(s)) return null;
  if (CJK_RE.test(s)) return null;
  const words = s.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w));
  return words.length >= MIN_WORDS ? s : null;
}

/** Quoted spans ("…", “…”, 「…」, 『…』, ‘…’) of ≥ 3 words made of Latin letters; a span ending in "…"/"..." or containing CJK is ignored; trailing ?/!/. inside the quotes kept. */
export function extractQuotedSentences(text: string): string[] {
  if (!text) return [];
  const out: string[] = [];
  for (const m of text.matchAll(QUOTE_RE)) {
    const span = qualifyingSpan(quoteInner(m));
    if (span) out.push(span);
  }
  return out;
}

/** Task 18 §D: how far before / after a quote its introducing words are read. */
const INTRO_WINDOW = 40;
/** "starting with "Last year, I"" — a sentence STARTER, not a sentence. */
const STARTER_INTRO_RE = /\b(?:starting with|beginning with|start with|begin with|that starts with)\s*[:,]?\s*$/i;
const STARTER_AFTER_RE = /^\s*(?:で|から)始め/;
/** "you said "Customer from USA."" — the student's own words quoted back. */
/*  "you say" only as a report — never the ask "Can you say …" / "to you say".
 *  Fix round 2 (I2): the intro must lead straight into the quote — no sentence
 *  or clause break (. ! ? ; :) and no say / try / repeat / like / use between
 *  them ("You said you sold nine machines, so say "…"" is a correction ask).
 *  A colon right after the intro ("You said: "…"") still counts. */
const SAID_INTRO_RE = /\b(?:you said|(?<!\b(?:can|could|would|will|to|please|did|do|does|should|now|then|let)\s+)you say|you just said|you told me)\b[,:]?(?![^"“「『‘]*(?:[.!?;:]|\b(?:say|try|repeat|like|use)\b))[^"“「『‘]*$/i;
const SAID_AFTER_RE = /^\s*(?:と|って)言いました/;
/** A span ending on a bare subject pronoun / article after a comma ("Last week, I"). */
const DANGLING_END_RE = /,\s*(?:I|you|we|they|he|she|it|the|a|an)[.!?]?$/i;

/** Qualifying quoted spans with the text just before (INTRO_WINDOW + 20 chars
 *  of lookbehind context; introWithin) and after each. */
function quotedSpansWithContext(text: string): Array<{ span: string; before: string; after: string; at: number; end: number }> {
  const out: Array<{ span: string; before: string; after: string; at: number; end: number }> = [];
  if (!text) return out;
  for (const m of text.matchAll(QUOTE_RE)) {
    const span = qualifyingSpan(quoteInner(m));
    if (!span) continue;
    const at = m.index ?? 0;
    out.push({ span, before: text.slice(Math.max(0, at - INTRO_WINDOW - 20), at), after: text.slice(at + m[0].length, at + m[0].length + INTRO_WINDOW), at, end: at + m[0].length });
  }
  return out;
}

/** Task 21 §B1 (GDI run 9: 477 / 527 / 571 s — "Let's say it as a full
 *  sentence: I met a customer yesterday." — the brain stopped quoting and
 *  nothing was carded): a sentence introduced by a colon after a say / model
 *  lead and ending the tutor's sentence is a span like a quoted one. Never a
 *  question ("Let's keep moving: when did you …?" fails isCardCandidate), a
 *  quote (the quote path has it) or an instruction ("Try this: Tell me …"). */
// Fix round 1 (I1): "Your sentence is correct: The past simple fits …", "Try
// this: When you meet a customer, smile …", "Say these words again: Apple,
// banana, …" were carded — the lead must PRESENT the sentence and end at the
// colon, and the tail must be a declarative sentence.
// The GDI plan's own correction template ("A more natural way to say this
// is: …") is a presenting lead too.
const COLON_LEAD_RE = /\b(?:say (?:it|this|that|the (?:full |whole )?sentence)(?: (?:once more|again|like this|as a full sentence|in English))?|(?:the|a|your) (?:model|correct(?:ed)? (?:sentence|version|form)|natural (?:way to say it|version)|full sentence) (?:is|would be)|(?:let['’]s )?(?:make|put|say) (?:that|it|this)(?: sentence)? (?:in English|as a full sentence)|in English,? (?:you could|we|you can) say|a more natural way to say (?:this|that|it) is|a (?:better|clearer|more common) way to say (?:this|that|it) is|more naturally,? (?:you (?:could|can|would) say|we say))\s*[:：]\s*$/i;
const COLON_TAIL_OPENER_RE = /^(?:when|if|remember|first|then)\b/i;
/** "Apple, banana, cherry, grape." — ≥ 2 commas with one-word items. */
function isCommaList(span: string): boolean {
  const items = span.replace(/[.!?。！？]+$/, '').split(',').map((x) => x.trim()).filter(Boolean);
  if (items.length < 3) return false;
  return items.filter((x) => x.split(/\s+/).length === 1).length >= 2;
}
const COLON_INSTRUCTION_RE = /^(?:please|let['’]s|tell|say|give|use|try|think|describe|answer|repeat|listen|look|remember|make|start|add|write|read|explain|choose|pick|imagine)\b/i;
const COLON_MIN_WORDS = 4;
function colonIntroducedSpans(text: string): Array<{ span: string; before: string; after: string; at: number; end: number }> {
  const out: Array<{ span: string; before: string; after: string; at: number; end: number }> = [];
  const t = text ?? '';
  for (const m of t.matchAll(/[:：]\s*/g)) {
    const colon = m.index ?? 0;
    const sentStart = Math.max(t.slice(0, colon).search(/[^.!?。！？]*$/), 0);
    if (!COLON_LEAD_RE.test(t.slice(sentStart, colon + m[0].length))) continue;
    const at = colon + m[0].length;
    const tail = /^[^.!?。！？"“「『‘]*[.!?。！？]?/.exec(t.slice(at))?.[0] ?? '';
    const end = at + tail.length;
    // the span ends the tutor sentence: a sentence end or the end of the text
    if (!/[.!?。！？]$/.test(tail) && end < t.length) continue;
    const span = qualifyingSpan(tail);
    if (!span || COLON_INSTRUCTION_RE.test(span) || COLON_TAIL_OPENER_RE.test(span) || isCommaList(span) || /[?？]["”’)]?$/.test(span)) continue;
    if (span.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w)).length < COLON_MIN_WORDS) continue;
    out.push({ span, before: t.slice(Math.max(0, at - INTRO_WINDOW - 20), at), after: t.slice(end, end + INTRO_WINDOW), at, end });
  }
  return out;
}

/** Task 20 §G1 (GDI run 8, 558 s): the tutor's own word that a quoted
 *  SENTENCE is right — "That's a correct sentence", "… is a natural
 *  sentence", "That sentence is complete and clear", 「正しい文」. Fix round 1
 *  (I6): praise of the meaning or of a part ("The meaning is clear.", "The
 *  idea is clear.", 「過去形が正しい」, "That is clear, and nice try.") is not —
 *  a model card of a wrong sentence teaches the error. */
const AFFIRM_EN_RE = /\b(?:that['’]s|is|what) (?:a )?(?:correct|natural|good|great|perfect|nice|clear) sentence\b|\bsentence is (?:correct|complete|clear|natural|right)\b|\bcomplete and clear\b|^\s*(?:yes, )?that['’]s (?:right|correct)[.!]/i;
const AFFIRM_JA_RE = /正しい文|きちんと言え|自然な文|完璧です/;
/** Fix round 1 (I6): a follow-up that fixes something ⇒ no promotion. Fix
 *  round 2 (m5): "but" only counts inside the affirmation window (see
 *  quoteAffirmed), not anywhere in the turn. */
const FIX_FOLLOW_UP_RE = /\blet['’]s fix\b|\bone small fix\b/i;
/** Fix round 2 (m5): "…, but …" / "But …" in the affirmation's own sentence or
 *  the next one takes the praise back. */
const BUT_RE = /^\s*but\b|,\s*but\b/i;
/** Fix round 2 (m6): "a good sentence to start with" praises a draft. */
const QUALIFIED_PRAISE_RE = /\b(?:to start with|to begin with|for now|as a start)\b/i;
/** The text a quote's affirmation may sit in: its own sentence (the quote
 *  text itself left out) and the sentence after it. */
export function quoteAffirmed(text: string, at: number, end: number): boolean {
  const t = text ?? '';
  const lead = t.slice(0, at);
  const leadStart = Math.max(lead.search(/[^.!?。！？]*$/), 0);
  const rest = t.slice(end);
  const sentenceRe = /^[^.!?。！？]*[.!?。！？]?/;
  // The words before the quote in its sentence, then: a quote that ends its
  // own sentence ("…last year.") is followed by the next sentence only;
  // otherwise the rest of the quote's sentence plus the next one.
  const quoteClosesSentence = /[.!?。！？]\s*["”’」』]?\s*$/.test(t.slice(at, end));
  const first = sentenceRe.exec(rest)?.[0] ?? '';
  const second = quoteClosesSentence ? '' : (sentenceRe.exec(rest.slice(first.length).trimStart())?.[0] ?? '');
  const ownSentence = `${lead.slice(leadStart)} ${quoteClosesSentence ? '' : first}`.trim();
  const parts = (quoteClosesSentence ? [ownSentence, first] : [ownSentence, second]).map((x) => x.trim()).filter(Boolean);
  // the sentence after the affirmation window: a "But …" there takes it back too
  const consumed = first.length + (quoteClosesSentence ? 0 : (rest.slice(first.length).length - rest.slice(first.length).trimStart().length) + second.length);
  const after = sentenceRe.exec(rest.slice(consumed).trimStart())?.[0] ?? '';
  if ([...parts, after].some((p) => BUT_RE.test(p))) return false;
  // Task 23 §D1 (GDI run 11, 344 s: 'Good, "I have worked for Nagoya for
  // three years" is correct.'): the quoted sentence itself is the subject of
  // the praise — the quote, then "is correct / right / perfect / natural".
  if (QUOTE_IS_CORRECT_RE.test(rest) && !QUALIFIED_PRAISE_RE.test(first)) return true;
  return parts.some((p) => (AFFIRM_EN_RE.test(p) || AFFIRM_JA_RE.test(p)) && !QUALIFIED_PRAISE_RE.test(p));
}
const QUOTE_IS_CORRECT_RE = /^\s*[,.]?\s*(?:is|was|sounds) (?:(?:exactly|completely|totally|perfectly) )?(?:correct|right|perfect|natural)\b/i;

/** Task 22 §G (GDI run 10, 711 s / 781 s): the turn praises the student's
 *  SENTENCE somewhere — "Your sentence is clear.", "That's a natural
 *  sentence", or a quote of their own words that "fits perfectly" (the caller
 *  checks every quote is the student's). Fix round 1 (I1): never a content
 *  acknowledgement ("That's right.", "That's a clear answer", "That fits
 *  perfectly with your job") — those say nothing about the grammar. Not
 *  qualified ("to start with") and no "but" in it or the sentence after it. */
const SENTENCE_PRAISE_RE = /\b(?:that['’]s|is|what) (?:a )?(?:correct|natural|good|great|perfect|nice|clear) sentence\b|\b(?:your|that|the|this) sentence is (?:correct|complete|clear|natural|right)\b|\bcomplete and clear\b|["”’」']\s*(?:fits|works) perfectly\b/i;
const SENTENCE_PRAISE_JA_RE = /正しい文|自然な文/;
/** Fix round 2 (I3): the praise phrase inside an instruction or a question —
 *  "Make sure your sentence is complete.", "Check that the sentence is
 *  correct.", "Do you think your sentence is correct?" — is no praise. */
const NOT_DECLARATIVE_PRAISE_RE = /[?？]\s*["”’)]?\s*$|^\s*(?:(?:now|so|ok(?:ay)?|good|and|then),?\s+)*(?:make sure|try|check|say|remember|think|look|listen|please)\b|\b(?:make sure|check (?:that|if|whether)|do you think|is it)\b/i;
/** Fix round 2 (I3): a retry ask anywhere in the turn — "Try once more with
 *  the past tense.", "Try again", "say it again", "think about the verb". */
const AFFIRM_RETRY_ASK_RE = /\b(?:try|say it|say that|say the sentence) (?:it )?(?:again|once more|one more time)\b|\btry once more\b|\bthink about\b|\b(?:say|repeat)\b[^.!?。？]*\b(?:once more|again|one more time)\b/i;
export function turnAffirmsStudent(text: string): boolean {
  if (isRetryAsk(text ?? '') || AFFIRM_RETRY_ASK_RE.test(text ?? '')) return false;
  const sentences = (text ?? '').split(/(?<=[.!?。！？])\s*/).map((x) => x.trim()).filter(Boolean);
  return sentences.some((p, i) => (SENTENCE_PRAISE_RE.test(p) || SENTENCE_PRAISE_JA_RE.test(p)) && !QUALIFIED_PRAISE_RE.test(p)
    && !NOT_DECLARATIVE_PRAISE_RE.test(p)
    && !BUT_RE.test(p) && !BUT_RE.test(sentences[i + 1] ?? ''));
}

/** Task 20 §G3 (GDI run 8, 864 s): the student's reply to a hint / more-time
 *  OFFER ("Yes, I would like hint.") is not a sentence to board. Fix round 1
 *  (m1): only when the previous turn's LAST sentence is that offer — a
 *  question about a hint / waiting / time; a turn that GIVES a hint, or says
 *  "take your time" before asking the real question, does not block. */
// Fix round 2 (m1): never a bare "time" ("What time do you usually start work?").
const META_OFFER_RE = /\b(?:hint|more time|a little (?:more )?time|take your time|a moment|shall I wait)\b|ヒント|待ち/i;
export function isMetaOfferTurn(prevTutorText: string | null | undefined): boolean {
  const sentences = (prevTutorText ?? '').split(/(?<=[.!?。！？])\s*/).map((x) => x.trim()).filter(Boolean);
  const last = sentences[sentences.length - 1] ?? '';
  return /[?？]["”’)」]?$/.test(last) && META_OFFER_RE.test(last);
}

/** True when `re` matches `before` with the match starting inside its last
 *  INTRO_WINDOW characters — `before` may be longer so a lookbehind sees the
 *  word ahead of the window ("Can| you say"). */
function introWithin(re: RegExp, before: string): boolean {
  const b = before ?? '';
  const m = re.exec(b);
  return !!m && (m.index ?? 0) >= b.length - INTRO_WINDOW;
}

/** Task 18 §D: a quoted sentence STARTER ("starting with "Last year, I"",
 *  「"Last week, I"で始めて」, or any span ending ", I" / ", the" …) is not a
 *  card. */
export function isSentenceStarter(span: string, before: string, after: string): boolean {
  return introWithin(STARTER_INTRO_RE, before) || STARTER_AFTER_RE.test(after ?? '') || DANGLING_END_RE.test((span ?? '').trim());
}

/** Task 23 §D3 (GDI run 11, 302 s `"I have worked," well.`, 1260 s `"I have
 *  sold" is the right present perfect form`): a quoted sentence STARTER or
 *  FRAGMENT is never a card — it ends with a comma, has fewer than 4 words,
 *  is introduced as a form ("starting with", "using", "the form", "the
 *  verb / tense / phrase / pattern") or is followed by a form comment ("…"
 *  well / correctly / right). "…" is correct still cards. */
const FRAGMENT_MIN_WORDS = 4;
// Fix round 1 (m1): no using / use — "Use "I have worked here since 2020."" is a correction.
const FRAGMENT_INTRO_RE = /\b(?:start(?:ing)? with|begin(?:ning)? with|with the form|the form|the (?:verb|tense|phrase|pattern))\s*[:,]?\s*$/i;
/** Fix round 1 (m1): a trailing comma marks a starter only in a short quote —
 *  a whole sentence quoted with its comma inside (US style) stays a card. */
const FRAGMENT_COMMA_MAX_WORDS = 6;
const CLAUSE_STARTER_OPENING_RE = /^(?:if|when|whenever|because|after|before|although|though|while|since|unless|until|once|as soon as)\b/i;
// Fix round 2 (m1): ", right?" / "correctly?" is a question tag, not a form comment.
const FRAGMENT_AFTER_RE = /^\s*[,.]?\s*(?:well|correctly|right)\b(?!\s*[?？])/i;
export function isQuotedFragment(span: string, before: string, after: string): boolean {
  const s = (span ?? '').trim();
  const words = s.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w)).length;
  if (/,\s*$/.test(s) && words < FRAGMENT_COMMA_MAX_WORDS) return true;
  // Fix round 2 (m4): a comma-ended quote that opens with a subordinator ("If
  // I have more time next year,", "Because …,", "After …,") is a clause
  // STARTER, and one that opens like a question ("Can you send me …,") is no
  // model — neither is carded (only a complete clause gets the "." rewrite).
  if (/,\s*$/.test(s) && (CLAUSE_STARTER_OPENING_RE.test(s) || AUX_QUESTION_OPENING_RE.test(s) || WH_QUESTION_OPENING_RE.test(s))) return true;
  if (words < FRAGMENT_MIN_WORDS) return true;
  if (introWithin(FRAGMENT_INTRO_RE, before)) return true;
  return FRAGMENT_AFTER_RE.test(after ?? '');
}

/** Task 18 §D: the quote is introduced as the student's own words ("you
 *  said …", 「…と言いました」) — an echo, never promoted. */
export function isSaidQuote(before: string, after: string): boolean {
  return introWithin(SAID_INTRO_RE, before) || SAID_AFTER_RE.test(after ?? '');
}

/** `needle` occurs in `hay` as one unbroken run. */
function isContiguousRun(needle: readonly string[], hay: readonly string[]): boolean {
  if (needle.length === 0 || needle.length > hay.length) return false;
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
}

/** Fix round 2 (I1): emphasis for a deletion / reorder correction — the quote
 *  words that do not follow, in the student's words, the word before them in
 *  the quote (they neighbour a deletion or moved), max MAX_EMPHASIS. */
function reorderEmphasis(sentence: string, said: readonly string[]): string[] {
  const pairs = new Set<string>();
  for (let i = 1; i < said.length; i++) pairs.add(`${said[i - 1]} ${said[i]}`);
  const words = dropThousands(sentence).match(TOKEN_RE) ?? [];
  const out: string[] = [];
  for (let i = 1; i < words.length && out.length < MAX_EMPHASIS; i++) {
    const a = wordToks(words[i - 1]!).slice(-1)[0];
    const b = wordToks(words[i]!)[0];
    if (!pairs.has(`${a} ${b}`) && !out.includes(words[i]!)) out.push(words[i]!);
  }
  return out;
}

/**
 * correction ⇔ studentLast present AND |quoteTokens ∩ studentTokens| / |quoteTokens| ≥ 0.5
 * AND at least one quote token is not in studentTokens. emphasis = quote words
 * (original form, deduped, in order) whose token is not in studentTokens, max 4.
 * Otherwise kind 'model', emphasis [].
 */
export function classifyQuotedSentence(sentence: string, studentLast: string | null | undefined): QuotedSentence {
  const model: QuotedSentence = { sentence, kind: 'model', emphasis: [] };
  if (!studentLast || !studentLast.trim()) return model;
  const student = new Set(tokens(studentLast));
  if (student.size === 0) return model;
  const quoteSet = new Set(tokens(sentence));
  if (quoteSet.size === 0) return model;
  let shared = 0;
  for (const t of quoteSet) if (student.has(t)) shared++;
  const novel = quoteSet.size - shared;
  // Task 18 §D (GDI run 6: "I once had got" — the student's wrong fragment
  // quoted inside a correction turn): a quote that is an unbroken run of the
  // student's own words, in the student's order, is an echo — however little
  // of what the student said it covers. Fix round 2 (I1): every token being
  // the student's is NOT enough — "I am agree" → "I agree", "discussed about"
  // → "discussed", "I yesterday went" → "Yesterday I went" delete or reorder
  // the student's words, and those are corrections.
  if (novel === 0) {
    // Fix round 3 (N1): self-repairs and stutters ("to the, to the office",
    // "worked worked", "like, like") collapse first, on both sides (the
    // filler set includes "like", so the quote is filtered the same way).
    const said = dropFillersAndRepeats(tokens(studentLast));
    const quoted = dropFillersAndRepeats(tokens(sentence));
    if (quoted.length === 0 || isContiguousRun(quoted, said)) return { sentence, kind: 'echo', emphasis: [] };
    const emphasis = reorderEmphasis(sentence, said);
    // nothing moved or neighbours a deletion ⇒ still the student's sentence
    if (emphasis.length === 0) return { sentence, kind: 'echo', emphasis: [] };
    return { sentence, kind: 'correction', emphasis };
  }
  if (shared / quoteSet.size < CORRECTION_OVERLAP) return model;
  const emphasis: string[] = [];
  const seen = new Set<string>();
  const studentCompounds = new Set((dropThousands(studentLast).match(COMPOUND_RE) ?? []).map(lowerTok));
  for (const w of dropThousands(sentence).match(COMPOUND_RE) ?? []) {
    const parts = wordToks(w);
    const t = parts.join(' ');
    if (seen.has(t)) continue;
    if (w.includes('-') ? studentCompounds.has(lowerTok(w)) : parts.every((x) => student.has(x))) continue;
    seen.add(t);
    emphasis.push(w);
    if (emphasis.length >= MAX_EMPHASIS) break;
  }
  return { sentence, kind: 'correction', emphasis };
}

const norm = (s: string) => tokens(s).join(' ');

/**
 * Distinct quoted sentences (case-insensitive; a sentence contained in a longer
 * one — "I haven't taken leave" in "I haven't taken leave from work" — is
 * dropped), classified; corrections first, longest first; models after in the
 * order spoken; capped at SENTENCE_BOARD_MAX_PER_TURN. [] when the turn
 * already rendered something.
 */
/** GDI run 3 (2026-10-29): a quoted ASK ("…?") belongs to the question pin,
 *  and a span starting lowercase is a fragment ("for your current company,") —
 *  neither is ever a card. */
export function isCardCandidate(span: string): boolean {
  const s = span.trim();
  if (/\?["”’)]?$/.test(s)) return false;
  return !/^\p{Ll}/u.test(s);
}

/** Task 19 §D: leading hesitations the student opens with ("Um, …") —
 *  stripped with or without a following comma. */
const LEADING_HESITATION_RE = /^\s*(?:uh|um|er|erm|hmm)\b[,.]?\s*/i;
/** Fix round 2 (I3): okay / ok / well / so are words too ("So far, I have…",
 *  "Well over half…") — stripped only when punctuation follows ("So, I…",
 *  "Okay. Um, I…"). */
const LEADING_DISCOURSE_RE = /^\s*(?:okay|ok|well|so)[,.]\s*/i;
/** Hesitations inside the sentence ("I have uh attended") — never words. */
const INNER_HESITATION_RE = /(?<=\s)(?:uh|um|erm|er|hmm)\b[,.]?\s+/gi;
/** A checked card needs at least this many Latin words. */
const CHECKED_CARD_MIN_WORDS = 4;
/** Fix round 4 (m5): a question opening — an auxiliary / modal then a subject
 *  ("Can you repeat…"), or a wh-word then an auxiliary ("What is your job").
 *  A wh-clause ("When I was a student, …", "What I like … is …") is no question. */
const AUX_QUESTION_OPENING_RE = /^(?:can|could|would|will|shall|should|do|does|did|is|are|was|were|have|has|had)\s+(?:you|i|we|they|he|she|it|there|this|that|the|a|an)\b/i;
const WH_QUESTION_OPENING_RE = /^(?:what|why|how|when|where|who|which)\s+(?:is|are|was|were|do|does|did|can|could|would|will|should|have|has)\b/i;
/** Fix round 2 (I4): the precheck's `proposed` is cut at 200 chars — one this
 *  long may end mid-clause. */
const CHECKED_MAX_CHARS = 195;

/** Task 19 §D: the checked student sentence as a card — leading fillers and
 *  inner hesitations removed, a trailing "." ensured; null unless it is ONE
 *  sentence (fix round 2, I4: no internal . ! ? before another word; raw under
 *  195 chars) that passes qualifyingSpan + isCardCandidate with ≥ 4 Latin
 *  words. Fix round 2 (m5): the lowercase-fragment / question guard runs
 *  before capitalising — only a word that followed a stripped filler is
 *  capitalised first (STT lowercases after "Um,"). */
export function cardableStudentSentence(raw: string | null | undefined): string | null {
  let s = (raw ?? '').trim();
  if (s.length >= CHECKED_MAX_CHARS) return null;
  const before = s;
  for (let prev = ''; prev !== s;) {
    prev = s;
    s = s.replace(LEADING_HESITATION_RE, '').replace(LEADING_DISCOURSE_RE, '');
  }
  const stripped = s !== before;
  s = s.replace(INNER_HESITATION_RE, '').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  if (/[.!?]["”’)]?\s+\p{L}/u.test(s)) return null;
  if (stripped || /^i\b/.test(s)) s = s[0]!.toUpperCase() + s.slice(1);
  if (!isCardCandidate(s)) return null;
  // Fix round 3 (m5): a question that lost its "?" ("Can you repeat the
  // question please") is not a model sentence.
  if ((AUX_QUESTION_OPENING_RE.test(s) || WH_QUESTION_OPENING_RE.test(s)) && !/[?？]["”’)]?$/.test(s)) return null;
  if (!/[.!?]["”’)]?$/.test(s)) s = s.replace(/[,;:]+$/, '') + '.';
  const span = qualifyingSpan(s);
  if (!span || !isCardCandidate(span)) return null;
  if (span.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w)).length < CHECKED_CARD_MIN_WORDS) return null;
  return span;
}

/** Fix round 2 (I2): the precheck's "correct" judges the task, not the
 *  grammar — a turn that corrects the student in so many words gets no
 *  checked card. */
const CORRECTION_CUE_RE = /\b(?:small fix|one fix|quick fix|we say|should be|is missing|instead of|fuller form|correct form|not quite|almost right|be careful|the right (?:word|form)|rather than)\b|正しくは|直し|の方が/i;
/** Fix round 4 (I2): the lesson's own correction template ("A more natural
 *  way to say this is: …") and its kin. */
const NATURAL_WAY_CUE_RE = /\b(?:more natural(?:ly)?|a (?:better|clearer|more common) way|natural way to say|way to say (?:this|that|it)|you (?:could|can) (?:also )?say|try saying|we(?:'d| would) say|sounds more natural)\b|自然な言い方|の方が自然/i;
export function hasCorrectionCue(tutorText: string): boolean {
  const t = tutorText ?? '';
  return CORRECTION_CUE_RE.test(t) || NATURAL_WAY_CUE_RE.test(t);
}

/** Fix round 3 (I2): a pronoun flip is not an edit ("I worked …" → "You
 *  worked …" is an echo). Fix round 4 (I1): so is we / us / our / ours ↔ you /
 *  your / yours ("We sell our machines" → "You sell your machines"). */
const PRONOUN_CLASS: Record<string, string> = {
  i: '<pro>', you: '<pro>', me: '<pro>', we: '<pro>', us: '<pro>',
  my: '<poss>', your: '<poss>', our: '<poss>', mine: '<poss2>', yours: '<poss2>', ours: '<poss2>',
  // Task 21 fix round 1 (m): reflexive and it / that flips are not edits either
  myself: '<refl>', yourself: '<refl>', ourselves: '<refl>', yourselves: '<refl>',
  it: '<it>', that: '<it>',
  // Task 23 §D2 (GDI run 11, 399 s): I'm ↔ you're is a person shift, not an
  // edit. (am / are: see personClassTokens — only when they agree.)
  "i'm": '<pro-be>', "you're": '<pro-be>', "we're": '<pro-be>',
};
/** Task 23 fix round 1 (m2): a be-verb is a person shift only when it AGREES
 *  with the pronoun right before it (I am / you are / we are) — "I is" / "I
 *  are" keep their verb, so the fix to "I am" is an edit and gets its card. */
/** Fix round 3 (I1): the be-verb by tense / negation — each class names the
 *  form that agrees with I / you / we. "I" has no one-word negative present
 *  ("am not" is two words), so that slot cannot be written back. */
const BE_FORMS: Record<string, Record<string, string>> = {
  '<be>': { i: 'am', you: 'are', we: 'are' },
  '<bepast>': { i: 'was', you: 'were', we: 'were' },
  '<beneg>': { you: "aren't", we: "aren't" },
  '<bepastneg>': { i: "wasn't", you: "weren't", we: "weren't" },
};
const BE_CLASS_OF: Record<string, string> = {
  am: '<be>', are: '<be>', was: '<bepast>', were: '<bepast>', "aren't": '<beneg>', "wasn't": '<bepastneg>', "weren't": '<bepastneg>',
};
function personClassTokens(toks: readonly string[]): string[] {
  return toks.map((t, k) => {
    // Fix round 3 (I1): past and negative be-forms too ("I was" ↔ "you were").
    const beClass = BE_CLASS_OF[t];
    if (beClass && k > 0 && BE_FORMS[beClass]![toks[k - 1]!] === t) return beClass;
    return PRONOUN_CLASS[t] ?? t;
  });
}
/** Task 23 §D2: the classes that carry the speaker's person (written back
 *  into the student's own form on a recast card). */
const PERSON_CLASSES = new Set(['<pro>', '<poss>', '<poss2>', '<refl>', '<be>', '<bepast>', '<beneg>', '<bepastneg>', '<pro-be>']);
function recastTokens(text: string): string[] {
  return personClassTokens(dropFillersAndRepeats(tokens(text)));
}
/** Length of the run where s (from i) and t (from j) agree. */
function agree(s: string[], i: number, t: string[], j: number): number {
  let n = 0;
  while (i + n < s.length && j + n < t.length && s[i + n] === t[j + n]) n++;
  return n;
}
/** Matched words after an edit (fix round 3: "car parts" for "parts for cars"
 *  is a rephrase, not a fix — the run must carry on for two words). */
const RECAST_TAIL_MIN = 2;
/** Student tokens a recast run spans, the edited one included. */
const RECAST_RUN_MIN = 4;
/** Words before a fix of the student's LAST word ("sell washing machine." →
 *  "sell washing machines"). */
const RECAST_FINAL_HEAD_MIN = 2;

/** True when `t` reproduces a run of the student's tokens `s` with exactly one
 *  edit inside it (one token substituted, inserted or deleted, any stem).
 *  Inside: ≥ 1 matched token before the edit and ≥ 2 after, ≥ 4 student tokens
 *  in all — or a substitution of the student's final token after ≥ 2 matched. */
type RecastEdit = { kind: 'sub' | 'ins' | 'del'; at: number };
function oneEditRun(s: string[], t: string[]): boolean {
  return oneEditAt(s, t) !== null;
}
/** The edit oneEditRun found: `at` = the index in `t` of the substituted /
 *  inserted token (a deletion has no tutor word). */
function oneEditAt(s: string[], t: string[]): RecastEdit | null {
  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < t.length; j++) {
      if (s[i] !== t[j] || (i > 0 && j > 0 && s[i - 1] === t[j - 1])) continue;
      const p = agree(s, i, t, j);
      const si = i + p;
      const tj = j + p;
      if (si < s.length && tj < t.length) {
        const q = agree(s, si + 1, t, tj + 1); // substitution
        if (q >= RECAST_TAIL_MIN && p + 1 + q >= RECAST_RUN_MIN) return { kind: 'sub', at: tj };
        if (si === s.length - 1 && p >= RECAST_FINAL_HEAD_MIN) return { kind: 'sub', at: tj };
      }
      // Fix round 4 (I2): an insertion / deletion right before the student's
      // last word, after ≥ 2 matched, is a fix too ("I work in the sales." →
      // "You work in sales.") — the tail is that last word.
      if (tj < t.length) {
        const q = agree(s, si, t, tj + 1); // insertion
        if (q >= RECAST_TAIL_MIN && p + q >= RECAST_RUN_MIN) return { kind: 'ins', at: tj };
        if (q >= 1 && si + q === s.length && p >= RECAST_FINAL_HEAD_MIN) return { kind: 'ins', at: tj };
      }
      if (si < s.length) {
        const q = agree(s, si + 1, t, tj); // deletion
        if (q >= RECAST_TAIL_MIN && p + 1 + q >= RECAST_RUN_MIN) return { kind: 'del', at: -1 };
        if (q >= 1 && si + 1 + q === s.length && p >= RECAST_FINAL_HEAD_MIN) return { kind: 'del', at: -1 };
      }
    }
  }
  return null;
}

/** Fix round 2 (I2) / fix round 3: an UNQUOTED recast — a tutor sentence that
 *  repeats a run of the student's words with one word fixed ("Oh, you went to
 *  Osaka yesterday" after "I go to Osaka yesterday"; "you sell washing
 *  machines" after "…sell washing machine.") — corrects the sentence without
 *  saying so. A follow-up that only reuses words ("Launching a new product
 *  sounds exciting.") is not one. */
export function recastsStudentSentence(tutorText: string, student: string): boolean {
  const said = recastTokens(student);
  if (said.length === 0) return false;
  for (const sentence of (tutorText ?? '').split(/(?<=[.!?。！？])\s+/)) {
    if (oneEditRun(said, recastTokens(sentence))) return true;
    // Task 23 §D2: a clause that recasts the head of the student's sentence
    // ("You learned how to sell washing machines, and …").
    if (recastClauses(sentence).some((c) => prefixOneEdit(said, recastTokens(c)) !== null)) return true;
  }
  return false;
}

/** Task 23 §D2: the comma clauses of a tutor sentence (lead interjection and
 *  a leading and / but / so dropped) when it has more than one. */
function recastClauses(sentence: string): string[] {
  const parts = (sentence ?? '').trim().replace(RECAST_LEAD_RE, '').split(/\s*[,;]\s*/)
    .map((c) => c.replace(/^(?:and|but|so)\s+/i, '').replace(/[.!?。！？]+$/, '').trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [];
}
/** First index where the two token lists differ (the shorter length if none). */
function firstMismatch(a: readonly string[], b: readonly string[]): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}
/** Task 23 §D2 (GDI run 11, 399 s: "You learned how to sell washing machines,
 *  and you used …" after "I learned how to sell washing machine at Nagoya
 *  during those 3 years."): the tutor clause `t` is the HEAD of the student's
 *  sentence `s` with exactly one edit — two matched tokens after it, or a
 *  substitution of the clause's last token after ≥ 3 matched (the recast
 *  stops at the fixed word). ≥ 4 tokens; the student's sentence goes on. */
function prefixOneEdit(s: string[], t: string[]): RecastEdit | null {
  if (t.length < RECAST_RUN_MIN) return null;
  for (const n of [t.length, t.length - 1, t.length + 1]) {
    if (n >= s.length || n < RECAST_RUN_MIN - 1) continue;
    const head = s.slice(0, n);
    const e = wholeOneEdit(head, t);
    if (!e) continue;
    if (e.kind === 'sub' && !(t.length - e.at - 1 >= RECAST_TAIL_MIN || (e.at === t.length - 1 && e.at >= RECAST_RUN_MIN - 1))) continue;
    if (e.kind === 'ins' && t.length - e.at - 1 < RECAST_TAIL_MIN) continue;
    if (e.kind === 'del' && t.length - firstMismatch(head, t) < RECAST_TAIL_MIN) continue;
    return e;
  }
  return null;
}

/** Task 23 §D2: the recast card keeps the STUDENT's person — every word of
 *  the tutor's sentence in a person class (I / you, my / your, am / are,
 *  I'm / you're …) aligned with a different form of the same class in the
 *  student's words is written back as the student's word ("You learned …" →
 *  "I learned …", "Your company …" → "My company …"). `words` must line up
 *  one-to-one with `rawT`; the edit tells how the two token lists align. */
function writeBackPerson(span: string, rawT: readonly string[], classed: readonly string[], saidRaw: readonly string[], saidClassed: readonly string[], edit: RecastEdit): string | null {
  const del = edit.kind === 'del' ? firstMismatch(saidClassed, classed) : -1;
  const studentIndex = (k: number): number => {
    if (edit.kind === 'ins') return k < edit.at ? k : k === edit.at ? -1 : k - 1;
    if (edit.kind === 'del') return k < del ? k : k + 1;
    return k;
  };
  // Task 23 fix round 1 (I1) / fix round 2 (I1): every person-class word of the
  // tutor's sentence gets the STUDENT's form — the same-class student word at
  // its aligned position, or, for a be-verb slot with none (inserted, or the
  // student's own disagreeing be-verb), the form that agrees with the
  // student's subject right before it (I → am, we / you → are). Anything else
  // cannot be written back: the tutor's sentence as spoken — unless the
  // blocked word IS the edit (the fix itself would show the wrong person):
  // then no card (null).
  const out: Array<string | null> = rawT.map(() => null);
  let blocked = -1;
  for (let j = 0; j < classed.length; j++) {
    if (!PERSON_CLASSES.has(classed[j]!)) continue;
    const sj = studentIndex(j);
    if (sj >= 0 && saidClassed[sj] === classed[j] && saidRaw[sj]) { out[j] = saidRaw[sj]!; continue; }
    const subject = j > 0 ? out[j - 1] : null;
    const agreeing = subject ? BE_FORMS[classed[j]!]?.[subject] : undefined;
    if (agreeing) { out[j] = agreeing; continue; }
    blocked = j;
    break;
  }
  if (blocked >= 0) return edit.at === blocked ? null : span;
  let k = -1;
  return span.replace(TOKEN_RE, (w) => {
    k++;
    const mine = out[k];
    if (!mine || mine === rawT[k]) return w;
    if (mine === 'i' || mine.startsWith("i'")) return 'I' + mine.slice(1);
    return /^\p{Lu}/u.test(w) ? mine[0]!.toUpperCase() + mine.slice(1) : mine;
  });
}

/** Task 21 fix round 1 (I2): cues that a medium-confidence "correct" is not. */
const MEDIUM_CUE_RE = /\bremember to\b|\bdon['’]t forget\b|\badd ["“]|\bthe meaning is clear\b|\bmeaning is clear\b|\bidea is clear\b/i;
/** Fix round 2 (I2 residual): implicit corrections without the exact cue —
 *  "Just remember the article before project.", "In English we usually put an
 *  article there.", "Keep in mind …", "I understand what you mean." */
// Fix round 3: "remember" / "article" only in a correcting frame — "What do
// you remember most about …?" and "Did you write an article about it?" keep the card.
const MEDIUM_CUE_EXTRA_RE = /\b(?:just |please )?remember,? (?:to|the|that we|(?:an?|the) )\b|\bkeep in mind\b|\b(?:an?|the) article (?:before|after|there|here|is missing)\b|\bwe (?:usually|normally|often) (?:say|put|use)\b|\bwhat you mean\b|\bnext time,? (?:say|use|try|add)\b/i;
/** Task 22 §G: every quoted span of the turn (sentence starters aside) is a
 *  run of the student's own words — "the words "work with" fit well",
 *  ""selling" fits perfectly" praise a part of what they said. A quote of
 *  anything else ('Remember to add "a" before "project"', a new model
 *  sentence) ⇒ false. */
function quotesOnlyStudentWords(text: string, student: string): boolean {
  const st = dropFillersAndRepeats(tokens(student));
  for (const m of text.matchAll(QUOTE_RE)) {
    const inner = quoteInner(m).trim();
    if (!inner) continue;
    const at = m.index ?? 0;
    if (/(…|\.\.\.)$/.test(inner)) continue;
    if (isSentenceStarter(inner, text.slice(Math.max(0, at - INTRO_WINDOW - 20), at), text.slice(at + m[0].length, at + m[0].length + INTRO_WINDOW))) continue;
    const q = dropFillersAndRepeats(tokens(inner));
    if (q.length === 0) return false;
    let found = false;
    for (let i = 0; i + q.length <= st.length && !found; i++) found = q.every((x, j) => st[i + j] === x);
    if (!found) return false;
  }
  // Fix round 2 (m5): straight single quotes ('selling') — QUOTE_RE leaves
  // them out (apostrophes); a span opened and closed outside a word counts.
  for (const m of text.matchAll(STRAIGHT_SINGLE_QUOTE_RE)) {
    const q = dropFillersAndRepeats(tokens(m[1] ?? ''));
    if (q.length === 0) continue;
    let found = false;
    for (let i = 0; i + q.length <= st.length && !found; i++) found = q.every((x, j) => st[i + j] === x);
    if (!found) return false;
  }
  return true;
}
const STRAIGHT_SINGLE_QUOTE_RE = /(?<![\p{L}\p{N}])'(\p{L}[^'\n]*?)'(?![\p{L}\p{N}])/gu;

/** Any quoted span (any length) that is not a sentence starter. */
function hasNonStarterQuote(text: string): boolean {
  for (const m of text.matchAll(QUOTE_RE)) {
    const inner = quoteInner(m).trim();
    if (!inner) continue;
    const at = m.index ?? 0;
    if (/(…|\.\.\.)$/.test(inner)) continue;
    if (isSentenceStarter(inner, text.slice(Math.max(0, at - INTRO_WINDOW - 20), at), text.slice(at + m[0].length, at + m[0].length + INTRO_WINDOW))) continue;
    return true;
  }
  return false;
}

/** Task 21 fix round 1 (concern 1, GDI run 9 571 s: a showProblem in the same
 *  turn blocked every card): only the brain's own show_sentence this turn
 *  blocks the client's sentence cards — other renders (show_problem,
 *  handwrite, show_table, tutor_scribble …) do not. */
export function sentenceBoardBlockedByRenders(toolNames: readonly string[]): boolean {
  return toolNames.some((n) => n === 'show_sentence' || n === 'showSentence');
}

/** Task 21 §B2: the WHOLE tutor sentence is the student's with exactly one
 *  edit — a local one-edit run inside a longer rewrite ("you took him around
 *  the company and sold him a washing machine") is several fixes, and a card
 *  marking one of them would mislead. */
function wholeOneEdit(s: string[], t: string[]): RecastEdit | null {
  if (s.length < RECAST_RUN_MIN - 1 || Math.abs(s.length - t.length) > 1) return null;
  let i = 0;
  while (i < s.length && i < t.length && s[i] === t[i]) i++;
  const eq = (a: string[], b: string[]) => a.length === b.length && a.every((x, k) => x === b[k]);
  if (s.length === t.length) return i < s.length && eq(s.slice(i + 1), t.slice(i + 1)) ? { kind: 'sub', at: i } : null;
  if (t.length === s.length + 1) return eq(s.slice(i), t.slice(i + 1)) ? { kind: 'ins', at: i } : null;
  return eq(s.slice(i + 1), t.slice(i)) ? { kind: 'del', at: -1 } : null;
}
/** Task 21 §B2: an interjection the recast card leaves out ("Oh, you went …"). */
const RECAST_LEAD_RE = /^\s*(?:oh|ah|so|yes|right|okay|ok|well|great|good|nice|i see)[,.!]\s*/i;
/** Task 21 §B2 (GDI run 9, 598 s: "Your company gives a lot of health benefits
 *  to its employees." after "…gives lot of…" — the learner expected the
 *  sentence on the board with the fix marked): the first UNQUOTED tutor
 *  sentence that recasts the student's with one edit, as a correction card —
 *  emphasis = the inserted / substituted word (a deletion marks nothing). */
export function recastCorrectionCard(tutorText: string, student: string | null | undefined): QuotedSentence | null {
  const said = recastTokens(student ?? '');
  if (said.length === 0) return null;
  const saidRaw = dropFillersAndRepeats(tokens(student ?? ''));
  for (const raw of (tutorText ?? '').split(/(?<=[.!?。！？])\s+/)) {
    if (/["“”「」『』‘]/.test(raw)) continue;
    let sentence = raw.trim().replace(RECAST_LEAD_RE, '');
    if (!sentence) continue;
    sentence = sentence[0]!.toUpperCase() + sentence.slice(1);
    const rawT = dropFillersAndRepeats(tokens(sentence));
    const classed = personClassTokens(rawT);
    const edit = oneEditAt(said, classed) ? wholeOneEdit(said, classed) : null;
    if (edit) {
      if (!isCardCandidate(sentence) || CJK_RE.test(sentence)) return null;
      if (AUX_QUESTION_OPENING_RE.test(sentence) || WH_QUESTION_OPENING_RE.test(sentence)) return null;
      return recastCard(sentence, rawT, classed, saidRaw, said, edit);
    }
    // Task 23 §D2: a comma clause recasting the head of the student's
    // sentence — never inside a question.
    if (/[?？]["”’)]?\s*$/.test(raw.trim())) continue;
    for (const clause of recastClauses(sentence)) {
      const cT = dropFillersAndRepeats(tokens(clause));
      const cClassed = personClassTokens(cT);
      const cEdit = prefixOneEdit(said, cClassed);
      if (!cEdit) continue;
      let c = clause[0]!.toUpperCase() + clause.slice(1);
      if (!isCardCandidate(c) || CJK_RE.test(c) || AUX_QUESTION_OPENING_RE.test(c) || WH_QUESTION_OPENING_RE.test(c)) continue;
      c = c.replace(/[,;:]+$/, '') + '.';
      const card = recastCard(c, cT, cClassed, saidRaw, said, cEdit);
      if (card) return card;
    }
  }
  return null;
}
/** The recast card of `sentence` (its tokens `rawT` / `classed`, one `edit`
 *  from the student's): person written back (§D2), the edited word marked. */
function recastCard(sentence: string, rawT: readonly string[], classed: readonly string[], saidRaw: readonly string[], said: readonly string[], edit: RecastEdit): QuotedSentence | null {
  const span0 = qualifyingSpan(sentence);
  if (!span0 || span0.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w)).length < CHECKED_CARD_MIN_WORDS) return null;
  // Fix round 1 (m): the edited POSITION — when the card's words line up
  // one-to-one with the compared tokens, the index is exact.
  const words0 = span0.match(TOKEN_RE) ?? [];
  const aligned = words0.length === rawT.length && words0.every((w, k) => wordToks(w).join(' ') === rawT[k]);
  // §D2: written back into the student's person only when aligned (else the
  // tutor's sentence as spoken).
  // Fix round 2 (I1): a person-class / be-verb edit that cannot be written
  // back in the student's person is no card.
  if (!aligned && edit.at >= 0 && (PERSON_CLASSES.has(classed[edit.at] ?? '') || /^(?:am|are|is)$/.test(rawT[edit.at] ?? ''))) return null;
  const span = aligned ? writeBackPerson(span0, rawT, classed, saidRaw, said, edit) : span0;
  if (span === null) return null;
  const tok = edit.at >= 0 ? rawT[edit.at] : undefined;
  if (!tok) return { sentence: span, kind: 'correction', emphasis: [] };
  const words = span.match(TOKEN_RE) ?? [];
  if (aligned) return { sentence: span, kind: 'correction', emphasis: [words[edit.at]!], emphasisAt: [edit.at] };
  const word = (dropThousands(span).match(TOKEN_RE) ?? []).find((w) => wordToks(w).includes(tok));
  return { sentence: span, kind: 'correction', emphasis: word ? [word] : [] };
}

/** Task 21 §B3: a quoted fragment (≥ 2 words) of the checked-correct sentence
 *  praises a part — the card is the whole sentence; the fragment's head (at
 *  most two words, what the praise points at) is its emphasis. */
const FRAGMENT_EMPHASIS_MAX = 2;
function fragmentOfChecked(tutorText: string, checked: string): string[] | null {
  const whole = norm(checked);
  if (!whole) return null;
  for (const m of (tutorText ?? '').matchAll(QUOTE_RE)) {
    const inner = quoteInner(m).trim();
    // only a fragment that would have been carded itself (run 9: "Lots of
    // health benefits") — "helped us identify" mid-sentence never was
    if (!inner || !isCardCandidate(inner) || CJK_RE.test(inner) || /(…|\.\.\.)$/.test(inner)) continue;
    const fragToks = dropFillersAndRepeats(tokens(inner));
    if (fragToks.length < 2) continue;
    const f = fragToks.join(' ');
    if (f === whole || !` ${whole} `.includes(` ${f} `)) continue;
    const words = dropThousands(checked).match(TOKEN_RE) ?? [];
    // Task 23 fix round 1 (m3): the same normaliseNumberTokens as tokens() —
    // a number may be two tokens ("35"), so each token remembers its word.
    const toks: string[] = [];
    const wordOf: number[] = [];
    words.forEach((w, wi) => { for (const t of wordToks(w)) { toks.push(t); wordOf.push(wi); } });
    for (let i = 0; i + fragToks.length <= toks.length; i++) {
      if (!fragToks.every((x, j) => toks[i + j] === x)) continue;
      const first = wordOf[i]!;
      const last = wordOf[i + fragToks.length - 1]!;
      return words.slice(first, Math.min(last + 1, first + FRAGMENT_EMPHASIS_MAX));
    }
  }
  return null;
}

/** Task 23 §E: the tutor's FIRST sentence acknowledges a menu option
 *  ("Option 2, a complete sentence, let's do it.", "You chose option two."). */
const OPTION_ACK_RE = /^\s*Option \d|\boption (?:one|two|three|four)\b/i;
export function acknowledgesOption(tutorText: string | null | undefined): boolean {
  const first = (tutorText ?? '').trim().split(/(?<=[.!?。！？])\s+/)[0] ?? '';
  return OPTION_ACK_RE.test(first);
}
/** Task 23 §E: a board problem that offers choices — the tracked
 *  `hasChoices`, or ≥ 2 list markers "1)" … "9)" / "A)" … "D)" in its
 *  statement ("You can choose: 1) individual words, 2) a complete sentence, …"). */
export function boardOffersChoices(problem: { hasChoices?: boolean; statement?: string } | null | undefined): boolean {
  if (!problem) return false;
  if (problem.hasChoices === true) return true;
  return ((problem.statement ?? '').match(/\b(?:[1-9]|[A-D])\)/g) ?? []).length >= 2;
}

/** Task 23 §B2: the student's level-check answer as a card — each sentence
 *  cleaned like the checked card (fillers out, ≥ 4 Latin words, no question;
 *  cardableStudentSentence), the ones that pass joined in order ("Yes, I
 *  worked with an international customer. I work with customer from USA.").
 *  A spoken answer is the transcript, not the precheck's 200-char cut, so
 *  more than one sentence is fine. null when no sentence passes or any CJK. */
export function levelCheckAnswerCard(studentLast: string | null | undefined): string | null {
  const raw = (studentLast ?? '').trim();
  if (!raw || CJK_RE.test(raw)) return null;
  const parts = raw.split(/(?<=[.!?])\s+(?=\p{L})/u)
    .map((x) => cardableStudentSentence(x))
    .filter((x): x is string => !!x)
    .map((x) => x[0]!.toUpperCase() + x.slice(1));
  return parts.length ? parts.join(' ') : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Task 25 §C2 (GDI run 13, 828 s: `「同僚に相談しました」 is "I asked my
// colleagues for help."` was carded as a correction of the student's
// sentence): a quote that TRANSLATES a span of another script, or is named as
// the English / Japanese of something, is a translation — never a card.
// ─────────────────────────────────────────────────────────────────────────
const TRANSLATION_BRACKET_BEFORE_RES: RegExp[] = [
  /」\s*(?:is|means|=|→|:)\s*$/i,
  /』\s*(?:is|means)\s*$/i,
];
const TRANSLATION_NAMED_BEFORE_RE = /\b(?:in English|in Japanese|translates? (?:to|as)|means)\s*[:,]?\s*$/i;
const TRANSLATION_AFTER_RE = /^\s*(?:in Japanese|in English|is 「|means 「)/i;
/** The quote at [at, end) of `text` translates a quoted span / is named as the
 *  English or Japanese of something (context read inside its own sentence).
 *  The named forms ("in English: "…"", "… in Japanese is …") count only when
 *  the sentence carries another script — "Now let's say that in English:
 *  "I have been a sales manager for four years."" is a model, not a
 *  translation. */
export function isTranslationQuote(text: string, at: number, end: number): boolean {
  const t = text ?? '';
  const head = t.slice(0, at);
  const cut = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '), head.lastIndexOf('。'), head.lastIndexOf('？'), head.lastIndexOf('！'));
  const before = cut >= 0 ? head.slice(cut + 1) : head;
  const tail = t.slice(end);
  const stop = tail.search(/[.!?](?:\s|$)|[。？！]/);
  const afterSentence = stop >= 0 ? tail.slice(0, stop + 1) : tail;
  if (TRANSLATION_BRACKET_BEFORE_RES.some((re) => re.test(before))) return true;
  if (!CJK_RE.test(before) && !CJK_RE.test(afterSentence)) return false;
  return TRANSLATION_NAMED_BEFORE_RE.test(before) || TRANSLATION_AFTER_RE.test(t.slice(end, end + INTRO_WINDOW));
}

// ─────────────────────────────────────────────────────────────────────────
// Task 25 §C1 (GDI run 13, 181 s: student "Yes, customer buy washing machine",
// tutor "Yes, the customer bought the washing machine." — three edits, so the
// one-edit recast missed it and the STUDENT's wrong sentence was carded as a
// checked model): the tutor's first or second sentence restating the
// student's content with grammar fixed is the correction card — whatever the
// precheck said. Fallback after the quoted and one-edit (§B2 / §D2) paths.
// ─────────────────────────────────────────────────────────────────────────
/** Minimum share of the student's content tokens the restatement contains. */
export const GRAMMAR_RECAST_OVERLAP = 0.6;
const GRAMMAR_RECAST_MIN_WORDS = 4;
const GRAMMAR_RECAST_EXTRA_WORDS = 4;
const GRAMMAR_RECAST_MIN_STUDENT_TOKENS = 3;
const GRAMMAR_RECAST_STEM = 4;
const ARTICLE_TOKENS = new Set(['a', 'an', 'the']);
const RECAST_FILLER_TOKENS = new Set(['uh', 'um', 'er', 'erm', 'hmm', 'yes', 'yeah', 'no', 'ok', 'okay', 'well', 'so', 'oh', 'ah', 'right', 'good']);
const GRAMMAR_RECAST_LEAD_RE = /^\s*(?:(?:oh|ah|so|okay|ok|well|great|nice|i see|yes|right|good)[,.!]\s*)+/i;
const GRAMMAR_RECAST_FORM_RE = /\b(?:start(?:ing)? with|begin(?:ning)? with|the form|the (?:verb|tense|phrase|pattern|word))\b/i;
const SECOND_PERSON_RE = /\b(?:you|your|yours|yourself)\b/i;
const sameStem = (a: string, b: string) => a === b || (a.length >= GRAMMAR_RECAST_STEM && b.length >= GRAMMAR_RECAST_STEM && a.slice(0, GRAMMAR_RECAST_STEM) === b.slice(0, GRAMMAR_RECAST_STEM));
const contentTokens = (toks: readonly string[]) => toks.filter((t) => !ARTICLE_TOKENS.has(t) && !RECAST_FILLER_TOKENS.has(t));
/** A recast edits the student's sentence in place: aligned in order (LCS,
 *  same-stem tokens), no gap DROPS two or more of the student's content words
 *  with nothing in their place, and none ADDS two or more new content words
 *  where the student had none ("Selling washing machines made by robots,
 *  that's a clear role." — the head dropped, a comment added — is praise). */
const NUMBER_TOKEN_RE = /^\d+(?:[.,]\d+)?$/;
const isNumberToken = (t: string) => NUMBER_TOKEN_RE.test(t) || NUMBER_WORDS.includes(t) || Object.values(TENS_WORDS).includes(t);
/** Task 25 fix round 1 (I-3): a number token (digits or a number word) on one
 *  side that the other side does not have. */
function numbersDiffer(s: readonly string[], t: readonly string[]): boolean {
  const a = s.filter(isNumberToken), b = t.filter(isNumberToken);
  return a.some((x) => !b.includes(x)) || b.some((x) => !a.includes(x));
}
function editsInPlace(s: readonly string[], t: readonly string[]): boolean {
  const n = s.length, m = t.length;
  const L: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
    L[i]![j] = sameStem(s[i]!, t[j]!) ? L[i + 1]![j + 1]! + 1 : Math.max(L[i + 1]![j]!, L[i]![j + 1]!);
  }
  let i = 0, j = 0, ds = 0, dt = 0;
  // Fix round 1 (I-3): a substitution gap is at most 1:1 (or 1:2 / 2:1 for a
  // split word) — "every day" → "yesterday too" is new content, not a fix.
  const gapOk = () => !((ds >= 2 && dt === 0) || (dt >= 2 && ds === 0) || (ds >= 2 && dt >= 2));
  while (i < n && j < m) {
    if (sameStem(s[i]!, t[j]!)) { if (!gapOk()) return false; ds = 0; dt = 0; i++; j++; }
    else if (L[i + 1]![j]! >= L[i]![j + 1]!) { ds++; i++; }
    else { dt++; j++; }
  }
  ds += n - i; dt += m - j;
  return gapOk();
}
/** The tutor's grammar recast of the student's sentence as a correction card
 *  (emphasis = every tutor word not among the student's words, articles
 *  included), or null. Only the turn's first two sentences; never a question,
 *  a quote, a form / starter comment, CJK, or a person shift to "you". */
export function grammarRecastCard(tutorText: string, student: string | null | undefined): QuotedSentence | null {
  const studentRaw = dropFillersAndRepeats(tokens(student ?? ''));
  const studentContent = contentTokens(studentRaw);
  if (studentContent.length < GRAMMAR_RECAST_MIN_STUDENT_TOKENS) return null;
  const studentWords = (student ?? '').match(TOKEN_RE)?.length ?? 0;
  const sentences = (tutorText ?? '').split(/(?<=[.!?。！？])\s+/).slice(0, 2);
  for (const raw of sentences) {
    const full = raw.trim();
    if (!full || /["“”「」『』‘]/.test(full) || CJK_RE.test(full)) continue;
    if (/[?？]["”’)]?\s*$/.test(full)) continue;
    const core = full.replace(GRAMMAR_RECAST_LEAD_RE, '');
    if (!core || AUX_QUESTION_OPENING_RE.test(core) || WH_QUESTION_OPENING_RE.test(core)) continue;
    if (GRAMMAR_RECAST_FORM_RE.test(core)) continue;
    if (SECOND_PERSON_RE.test(core) && !SECOND_PERSON_RE.test(student ?? '')) continue;
    const coreWords = core.match(TOKEN_RE) ?? [];
    if (coreWords.length < GRAMMAR_RECAST_MIN_WORDS || coreWords.length > studentWords + GRAMMAR_RECAST_EXTRA_WORDS) continue;
    const tutorToks = dropFillersAndRepeats(tokens(core));
    const tutorContent = contentTokens(tutorToks);
    const matched = studentContent.filter((t) => tutorContent.some((u) => sameStem(t, u))).length;
    if (matched / studentContent.length < GRAMMAR_RECAST_OVERLAP) continue;
    if (!editsInPlace(studentContent, tutorContent)) continue;
    // Fix round 1 (I-3): a changed number is a changed fact, not grammar
    // ("five years" → "three years myself").
    if (numbersDiffer(studentContent, tutorContent)) continue;
    const articleInserted = tutorToks.filter((t) => ARTICLE_TOKENS.has(t)).length > studentRaw.filter((t) => ARTICLE_TOKENS.has(t)).length;
    const tokenDiffers = tutorContent.some((u) => !studentContent.includes(u)) || studentContent.some((t) => !tutorContent.includes(t));
    if (!articleInserted && !tokenDiffers) continue;
    if (!isCardCandidate(full)) continue;
    const words = full.match(TOKEN_RE) ?? [];
    const leadWords = (full.slice(0, full.length - core.length).match(TOKEN_RE) ?? []).length;
    const emphasis: string[] = [];
    const emphasisAt: number[] = [];
    words.forEach((w, k) => {
      if (k < leadWords) return;
      if (wordToks(w).some((t) => !studentRaw.includes(t))) { emphasis.push(w); emphasisAt.push(k); }
    });
    if (emphasis.length === 0) continue;
    return { sentence: full, kind: 'correction', emphasis, emphasisAt, source: 'grammar-recast' };
  }
  return null;
}

/**
 * Task 15 §A (GDI run 5): a quote that echoes a sentence the independent check
 * found CORRECT is a model sentence, not the run-3 wrong-words echo — so with
 * `studentCorrect` an 'echo' is kept as a model card (source 'echo'), and the
 * check's own sentence (`checkedSentence`), when the tutor says it word for
 * word without quotes, is added as a model card (source 'checked'). With
 * `studentCorrect` falsy nothing changes.
 */
export function planSentenceBoard(input: {
  /** fix round 1: true only when the brain's own show_sentence ran this turn (sentenceBoardBlockedByRenders) */
  tutorText: string; studentLast: string | null | undefined; renderedThisTurn: boolean;
  /** the independent check found the student's last sentence correct (verdict 'correct', precheckDecides) */
  studentCorrect?: boolean;
  /** the check's `proposed` sentence (what the student's message proposes), when studentCorrect */
  checkedSentence?: string | null;
  /** Task 20 §G1: the check is silent (none) or undecided — the tutor's own
   *  affirmation of a quote ("… is a natural sentence") then promotes it. */
  affirmFallback?: boolean;
  /** Task 20 §G3: the previous tutor turn (a hint / more-time offer ⇒ the
   *  student's reply gets no checked card). */
  prevTutorText?: string | null;
  /** Task 21 §B4: the check found the sentence correct at MEDIUM confidence
   *  (not deciding) — counts for the checked card only, see below. */
  checkedMedium?: boolean;
  /** Task 23 §B2: the current part is the level check (segment metadata
   *  `skipWhenLevelKnown`) — every spoken answer goes on the board. */
  levelCheck?: boolean;
  /** Task 23 §E: the board's current problem offers choices (hasChoices, or
   *  ≥ 2 "1)" / "A)" markers in its statement — boardOffersChoices). */
  choiceMenu?: boolean;
  /** Task 25 §C2: told about each quote skipped as a translation. */
  onQuoteSkipped?: (reason: 'translation', span: string) => void;
  /** Task 27 §A: the turn's record of student sentences already given a
   *  correction card (normalised student sentence) — read and written, so a
   *  second plan call in the same turn sees the first. */
  cardedStudentSentence?: Set<string>;
  /** Task 27 §A: told about each card of the student's sentence dropped
   *  because a correction of it was carded this turn. */
  onSuppressed?: (reason: 'corrected this turn', sentence: string) => void;
}): QuotedSentence[] {
  if (input.renderedThisTurn) return [];
  const studentCorrect = input.studentCorrect === true;
  const affirmFallback = !studentCorrect && input.affirmFallback === true && !hasCorrectionCue(input.tutorText) && !FIX_FOLLOW_UP_RE.test(input.tutorText ?? '');
  const spans = [
    // Task 23 §D3: a quoted starter / fragment is never a card.
    // Fix round 1 (m1): a whole sentence quoted with its comma inside ends in "." on the card.
    // Task 25 §C2: a translation of a quoted span is never a card.
    ...quotedSpansWithContext(input.tutorText).filter((q) => !isQuotedFragment(q.span, q.before, q.after)).filter((q) => {
      if (!isTranslationQuote(input.tutorText, q.at, q.end)) return true;
      input.onQuoteSkipped?.('translation', q.span);
      return false;
    }).map((q) => ({ ...q, span: q.span.replace(/,\s*$/, '.'), introduced: false })),
    ...colonIntroducedSpans(input.tutorText).map((q) => ({ ...q, introduced: true })),
  ].filter((q) => isCardCandidate(q.span) && !isSentenceStarter(q.span, q.before, q.after));
  const distinct: { s: string; n: string; said: boolean; affirmed: boolean; introduced: boolean }[] = [];
  for (const q of spans) {
    const n = norm(q.span);
    const said = isSaidQuote(q.before, q.after);
    const affirmed = !q.introduced && affirmFallback && quoteAffirmed(input.tutorText, q.at, q.end);
    const dup = distinct.find((d) => d.n === n);
    if (dup) { dup.said = dup.said || said; dup.affirmed = dup.affirmed || affirmed; dup.introduced = dup.introduced || q.introduced; continue; }
    if (!n) continue;
    distinct.push({ s: q.span, n, said, affirmed, introduced: q.introduced });
  }
  const kept = distinct.filter((d) => !distinct.some((o) => o !== d && o.n.length > d.n.length && ` ${o.n} `.includes(` ${d.n} `)));
  // Task 18 §D: a quote introduced as the student's words ("you said …") is
  // an echo whatever its overlap, and is never promoted.
  const raw = kept.map((d, i) => ({
    q: d.said ? { sentence: d.s, kind: 'echo' as const, emphasis: [] } : classifyQuotedSentence(d.s, input.studentLast),
    len: d.n.length, i, said: d.said, affirmed: d.affirmed, introduced: d.introduced,
  }));
  // Fix round 1 (I2): a turn that corrects the student's sentence says it was
  // NOT right as it stood (it passed the check "for the task as stated") —
  // no echo promotion, no checked-sentence card; the correction is the card.
  const noCorrection = !raw.some((c) => c.q.kind === 'correction');
  const promote = studentCorrect && noCorrection;
  // Task 20 §G1 (GDI run 8, 558 s: the check was silent, the tutor said
  // "That's a correct sentence" — the echo was filtered): with the check
  // silent / undecided, an echo the tutor itself affirms is a model card.
  const promoteAffirmed = affirmFallback && noCorrection;
  const classified = raw
    .map((c) => (c.q.kind === 'echo' && promote && !c.said ? { ...c, q: { sentence: c.q.sentence, kind: 'model' as const, emphasis: [], source: 'echo' as const } } : c))
    .map((c) => (c.q.kind === 'echo' && promoteAffirmed && c.affirmed && !c.said ? { ...c, q: { sentence: c.q.sentence, kind: 'model' as const, emphasis: [], source: 'affirmed' as const } } : c))
    // Task 21 §B1: the tutor's own "say it as a full sentence: …" of the
    // student's words is the sentence to say — a model card.
    .map((c) => (c.q.kind === 'echo' && c.introduced && !c.said ? { ...c, q: { sentence: c.q.sentence, kind: 'model' as const, emphasis: [], source: 'introduced' as const } } : c))
    .filter((c) => c.q.kind !== 'echo');
  // Task 21 §B2 (GDI run 9, 598 s): an unquoted one-edit recast is the
  // correction — carded unless a quoted correction card already is.
  if (!classified.some((c) => c.q.kind === 'correction')) {
    const recast = recastCorrectionCard(input.tutorText, input.studentLast);
    if (recast && !classified.some((c) => sameSentence(c.q.sentence, recast.sentence))) {
      classified.push({ q: recast, len: norm(recast.sentence).length, i: -1, said: false, affirmed: false, introduced: false });
    }
  }
  // Task 25 §C1 (GDI run 13, 181 s): with no correction carded yet, the
  // tutor's grammar recast of the student's sentence is the correction — and
  // the student's own sentence is then not carded (below), whatever the check.
  let grammarRecast = false;
  if (!classified.some((c) => c.q.kind === 'correction')) {
    const recast = grammarRecastCard(input.tutorText, input.studentLast);
    if (recast && !classified.some((c) => sameSentence(c.q.sentence, recast.sentence))) {
      classified.push({ q: recast, len: norm(recast.sentence).length, i: -1, said: false, affirmed: false, introduced: false });
      grammarRecast = true;
    }
  }
  // Task 21 §B4 (GDI run 9, 693 s: correct at MEDIUM confidence, the tutor
  // neither corrected nor recast — no card): for the checked card only, a
  // medium-confidence "correct" counts when the turn has no correction cue /
  // fix follow-up, plans no correction, and quotes none of the student's words
  // back (an un-affirmed echo is the tutor looking at the wrong sentence —
  // the Task 20 I6 probes).
  // Fix round 1 (I2): 'Remember to add "a" before "project".', "The meaning
  // is clear." carded the wrong sentence — the medium path needs a turn with
  // NO quoted span of any length (a sentence starter "My part was..." aside)
  // and none of the medium cues.
  const mediumChecked = !studentCorrect && input.checkedMedium === true
    && !classified.some((c) => c.q.kind === 'correction')
    && !raw.some((c) => c.q.kind === 'echo')
    && !FIX_FOLLOW_UP_RE.test(input.tutorText ?? '')
    && !MEDIUM_CUE_RE.test(input.tutorText ?? '') && !MEDIUM_CUE_EXTRA_RE.test(input.tutorText ?? '')
    && !hasNonStarterQuote(input.tutorText ?? '');
  // Task 21 §B3 (GDI run 9, 626 s: `"Lots of health benefits" is exactly
  // right` carded the 4-word fragment): a quoted fragment of the checked
  // sentence gives way to the whole sentence, the fragment marked.
  if (promote && input.checkedSentence && !hasCorrectionCue(input.tutorText) && !isMetaOfferTurn(input.prevTutorText)) {
    const checked = cardableStudentSentence(input.checkedSentence);
    const frag = checked && !recastsStudentSentence(input.tutorText, checked) ? fragmentOfChecked(input.tutorText, checked) : null;
    if (checked && frag) {
      for (let k = classified.length - 1; k >= 0; k--) {
        const c = classified[k]!;
        if (c.q.kind === 'model' && sentenceContains(checked, c.q.sentence)) classified.splice(k, 1);
      }
      classified.push({ q: { sentence: checked, kind: 'model', emphasis: frag, source: 'checked' }, len: norm(checked).length, i: kept.length, said: false, affirmed: false, introduced: false });
    }
  }
  // Task 19 §D (GDI run 7): the tutor paraphrased correct sentences ("Creating
  // the slogan was the challenge…") and nothing was carded for six minutes.
  // A correct student sentence goes on the board whether or not the tutor
  // repeats it — no sentenceContains requirement.
  if ((promote || mediumChecked) && input.checkedSentence && !hasCorrectionCue(input.tutorText) && !isMetaOfferTurn(input.prevTutorText)) {
    const checked = cardableStudentSentence(input.checkedSentence);
    if (checked && !recastsStudentSentence(input.tutorText, checked)
      && !classified.some((c) => sameSentence(c.q.sentence, checked))) {
      classified.push({ q: { sentence: checked, kind: 'model', emphasis: [], source: 'checked' }, len: norm(checked).length, i: kept.length, said: false, affirmed: false, introduced: false });
    }
  }
  // Task 22 §G (GDI run 10, 711 s / 781 s / 618 s: precheck none, the tutor
  // said "Your sentence is clear." — no quote, no recast, no card): with the
  // check silent / undecided and nothing else carded, a turn that affirms the
  // student (turnAffirmsStudent) and quotes nothing but the student's own
  // words cards the student's cleaned sentence — source 'affirmed'.
  // Fix round 1 (I1): the implicit-correction cues of the medium path block
  // it too ("Your sentence is clear. Just remember the article before project.").
  if (affirmFallback && classified.length === 0 && input.studentLast
    && !MEDIUM_CUE_RE.test(input.tutorText ?? '') && !MEDIUM_CUE_EXTRA_RE.test(input.tutorText ?? '')
    && turnAffirmsStudent(input.tutorText) && quotesOnlyStudentWords(input.tutorText ?? '', input.studentLast)
    && !isMetaOfferTurn(input.prevTutorText)) {
    let own = cardableStudentSentence(input.studentLast);
    if (own && !CJK_RE.test(own)) {
      own = own[0]!.toUpperCase() + own.slice(1);
      classified.push({ q: { sentence: own, kind: 'model', emphasis: [], source: 'affirmed' }, len: norm(own).length, i: kept.length, said: false, affirmed: true, introduced: false });
    }
  }
  // Task 23 §B2 (GDI run 11, 81 s / 99 s: answers 2 and 3 of the level check
  // were partly correct, unaffirmed and unquoted — no card; the learner wants
  // the questions with their answers on the board): in the level check the
  // student's own answer (≥ 4 Latin words, no question, cleaned like the
  // checked card) is carded whatever the verdict, unless a card already says it.
  if (input.levelCheck === true && input.studentLast && !isMetaOfferTurn(input.prevTutorText)) {
    const own = levelCheckAnswerCard(input.studentLast);
    if (own && !classified.some((c) => sameSentence(c.q.sentence, own))) {
      classified.push({ q: { sentence: own, kind: 'model', emphasis: [], source: 'levelcheck' }, len: norm(own).length, i: kept.length + 1, said: false, affirmed: false, introduced: false });
    }
  }
  // Task 23 §E (GDI run 11, 1063 s: "Yes, practice pronunciation of a
  // complete sentence (option 2)." was checked correct and carded): the
  // answer to a choice menu is a pick, not a sentence to learn — no echo /
  // checked / affirmed / levelcheck card when the board offers choices or the
  // tutor's first sentence acknowledges an option. Corrections and new model
  // sentences (the drill's own sentence) still card.
  if (input.choiceMenu === true || acknowledgesOption(input.tutorText)) {
    // Fix round 1 (m-3): a grammar recast of a menu pick is a pick too — removed with the sourced cards.
    for (let k = classified.length - 1; k >= 0; k--) if (classified[k]!.q.source) classified.splice(k, 1);
  }
  // Task 25 §C1: the grammar recast replaces the student's own sentence.
  // Task 27 §A (GDI run 14, 87 s: the one-edit recast "The customer was from
  // the USA." AND the level-check card "The customer was from USA." under
  // it): ANY correction card of the student's sentence (quoted, recast,
  // grammar recast — here or in an earlier plan call of this turn) replaces
  // the model cards of that same sentence (checked / levelcheck / echo).
  const studentKey = input.studentLast ? norm(input.studentLast) : '';
  const correctedHere = classified.some((c) => c.q.kind === 'correction');
  const correctedEarlier = !!studentKey && input.cardedStudentSentence?.has(studentKey) === true;
  if (grammarRecast || correctedHere || correctedEarlier) {
    for (let k = classified.length - 1; k >= 0; k--) {
      const src = classified[k]!.q.source;
      if (src === 'checked' || src === 'levelcheck' || src === 'echo') {
        if (!grammarRecast) input.onSuppressed?.('corrected this turn', classified[k]!.q.sentence);
        classified.splice(k, 1);
      }
    }
  }
  if (correctedHere && studentKey) input.cardedStudentSentence?.add(studentKey);
  classified.sort((a, b) => {
    const ka = a.q.kind === 'correction' ? 0 : 1;
    const kb = b.q.kind === 'correction' ? 0 : 1;
    if (ka !== kb) return ka - kb;
    if (ka === 0 && a.len !== b.len) return b.len - a.len;
    return a.i - b.i;
  });
  return classified.slice(0, SENTENCE_BOARD_MAX_PER_TURN).map((c) => c.q);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Spoken form: each emphasis word (whole word, case-insensitive, ≥ 2 letters) uppercased inside the sentence. Display text is never changed. */
export function applySpokenEmphasis(sentence: string, emphasis: string[]): string {
  let out = sentence;
  for (const raw of emphasis ?? []) {
    const word = (raw ?? '').trim();
    if ((word.match(/\p{L}/gu) ?? []).length < 2) continue;
    const pattern = escapeRe(word).replace(/['’]/g, "['’]");
    const re = new RegExp(`(?<![\\p{L}\\p{N}'’])${pattern}(?![\\p{L}\\p{N}]|['’][\\p{L}\\p{N}])`, 'giu');
    out = out.replace(re, (m) => m.toUpperCase());
  }
  return out;
}

/**
 * For a spoken tutor sentence: the quoted correction span inside it gets
 * applySpokenEmphasis; everything else untouched (byte-identical). When one
 * sentence quotes several corrections only the LONGEST is stressed — the main
 * correction; stressing every alternative phrasing sounds like shouting.
 */
export function emphasiseSpokenCorrections(spokenSentence: string, studentLast: string | null | undefined): string {
  const span = correctionSpan(spokenSentence, studentLast);
  if (!span) return spokenSentence;
  return spokenSentence.slice(0, span.start) + applySpokenEmphasis(span.inner, span.emphasis) + spokenSentence.slice(span.end);
}

/** The quoted correction a spoken sentence stresses (the longest), or null. */
function correctionSpan(spokenSentence: string, studentLast: string | null | undefined): { start: number; end: number; inner: string; emphasis: string[] } | null {
  if (!spokenSentence || !studentLast || !studentLast.trim()) return null;
  let best: { start: number; end: number; inner: string; emphasis: string[]; len: number } | null = null;
  for (const m of spokenSentence.matchAll(QUOTE_RE)) {
    const inner = quoteInner(m);
    if (!qualifyingSpan(inner)) continue;
    // A quoted sentence starter ("starting with "I have been"") is never a
    // correction to stress (Task 18 fix round 2).
    const at = m.index ?? 0;
    if (isSentenceStarter(inner.trim(), spokenSentence.slice(Math.max(0, at - INTRO_WINDOW - 20), at), spokenSentence.slice(at + m[0].length, at + m[0].length + INTRO_WINDOW))) continue;
    const q = classifyQuotedSentence(inner.trim(), studentLast);
    if (q.kind !== 'correction' || q.emphasis.length === 0) continue;
    const len = norm(inner).length;
    if (!best || len > best.len) {
      const start = (m.index ?? 0) + 1;
      best = { start, end: start + inner.length, inner, emphasis: q.emphasis, len };
    }
  }
  if (best) return best;
  // A sentence splitter that cut at the period inside the quotes leaves an
  // unclosed trailing quote ('… say: "I haven't taken leave from work.').
  const quoteChars = (spokenSentence.match(/"/g) ?? []).length;
  const unclosed = (o: string, c: string) => (spokenSentence.lastIndexOf(o) > spokenSentence.lastIndexOf(c) ? spokenSentence.lastIndexOf(o) : -1);
  const open = quoteChars % 2 === 1 ? spokenSentence.lastIndexOf('"') : Math.max(unclosed('“', '”'), unclosed('「', '」'), unclosed('『', '』'));
  if (open < 0) return null;
  const inner = spokenSentence.slice(open + 1);
  if (!qualifyingSpan(inner)) return null;
  const q = classifyQuotedSentence(inner.trim(), studentLast);
  if (q.kind !== 'correction' || q.emphasis.length === 0) return null;
  return { start: open + 1, end: spokenSentence.length, inner, emphasis: q.emphasis };
}

/**
 * The Cartesia transcript for a display sentence: `rewrite` (rewriteForTTS)
 * FIRST, then the stress. The order matters: rewriteForTTS lowercases
 * all-caps words (a sonic-2-era rule) and strips the double quotes, so the
 * stress is decided on the DISPLAY text (quotes intact) and re-applied to the
 * rewritten text — inside the rewritten quote span when it can be found,
 * else across the sentence. `cards` = the turn's brain show_sentence cards:
 * a sentence that contains a card's sentence gets that card's emphasis.
 * The stress only runs with `opts.emphasisCaps` (TUTOR_SPOKEN_EMPHASIS_CAPS,
 * opt-in); by default the result is `rewrite(raw)`.
 */
export function composeSpokenText(
  raw: string,
  studentLast: string | null | undefined,
  rewrite: (s: string) => string,
  cards: ReadonlyArray<{ sentence: string; emphasis: string[] }> = [],
  opts: { emphasisCaps?: boolean } = {},
): string {
  let out = rewrite(raw);
  // GDI run 8 (2026-10-30): Cartesia spelt the uppercased stress words out
  // letter by letter ("ATTENDING" → "a t t …", "THE" → "day") and the caps
  // added no audible stress — the spoken text is the plain rewrite unless the
  // opt-in TUTOR_SPOKEN_EMPHASIS_CAPS asks for the caps.
  if (!opts.emphasisCaps) return out;
  const span = correctionSpan(raw, studentLast);
  if (span) {
    const at = locateWords(out, span.inner);
    out = at
      ? out.slice(0, at[0]) + applySpokenEmphasis(out.slice(at[0], at[1]), span.emphasis) + out.slice(at[1])
      : applySpokenEmphasis(out, span.emphasis);
  }
  // A brain show_sentence card: at most MAX_EMPHASIS words of ≥ 2 letters,
  // stressed only inside the card's own sentence where the speech says it.
  for (const c of cards) {
    const words = (c.emphasis ?? []).filter((w) => typeof w === 'string' && (w.match(/\p{L}/gu) ?? []).length >= 2).slice(0, MAX_EMPHASIS);
    if (!words.length || !sentenceContains(raw, c.sentence)) continue;
    const at = locateWords(out, c.sentence);
    if (at) out = out.slice(0, at[0]) + applySpokenEmphasis(out.slice(at[0], at[1]), words) + out.slice(at[1]);
  }
  return out;
}

/** [start, end) of `words`' token run inside `text` (case-insensitive, any
 *  punctuation / spacing between words), or null. */
function locateWords(text: string, words: string): [number, number] | null {
  const toks = (words.match(TOKEN_RE) ?? []).map((t) => escapeRe(t).replace(/['’]/g, "['’]"));
  if (!toks.length) return null;
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${toks.join("[^\\p{L}\\p{N}'’]+")}(?![\\p{L}\\p{N}])`, 'iu');
  const m = re.exec(text);
  return m ? [m.index, m.index + m[0].length] : null;
}

/** Task 24 §D (GDI run 12, 54 s: every echo / checked / levelcheck card
 *  painted at the END of the reply — the tutor never says the student's
 *  sentence verbatim, so no narration anchor, so the live anchor): an auto
 *  card's render-sync anchor. The narration anchor when the card's sentence
 *  is spoken; 0 (paint as the reply starts) for a card of the STUDENT's own
 *  sentence nobody spoke; undefined (the live anchor) for a model sentence
 *  nobody spoke. Pure. */
export function autoCardAnchor(fromNarration: number | undefined, studentSentenceCard: boolean): number | undefined {
  if (fromNarration !== undefined) return fromNarration;
  return studentSentenceCard ? 0 : undefined;
}

/** Render-sync anchor for an auto card: the number of spoken sentences that
 *  PRECEDE the one saying `sentence` (render-sync paints a command once that
 *  many sentences have played, i.e. as the card's own sentence starts — "the
 *  tutor writes as it speaks"). undefined when no sentence says it (the card
 *  then anchors to the live sentence count). Falls back to the sentence
 *  holding its first three words (a splitter that cut the quote). */
export function sentenceAnchorIndex(narration: readonly string[], sentence: string): number | undefined {
  let i = narration.findIndex((n) => sentenceContains(n, sentence));
  if (i < 0) {
    const head = tokens(sentence).slice(0, 3).join(' ');
    if (head) i = narration.findIndex((n) => ` ${norm(n)} `.includes(` ${head} `));
  }
  return i >= 0 ? i : undefined;
}

/** True when `text` contains `sentence` word for word (case, punctuation and
 *  spacing ignored) — matches a brain show_sentence card to the spoken
 *  sentence that says it. */
export function sentenceContains(text: string, sentence: string): boolean {
  const s = norm(sentence ?? '');
  return !!s && ` ${norm(text ?? '')} `.includes(` ${s} `);
}

/** True when the current page (everything after the last newPage / clear)
 *  already shows `sentence` as a showSentence card or a handwrite line
 *  (case and punctuation ignored). */
export function sentenceOnCurrentPage(commands: ReadonlyArray<{ action: string } & Record<string, unknown>>, sentence: string): boolean {
  const target = norm(sentence ?? '');
  if (!target) return false;
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') return false;
    if (c.action === 'showSentence') {
      if (typeof c.sentence === 'string' && sameSentence(c.sentence, sentence)) return true;
      continue;
    }
    if (c.action === 'handwrite' && typeof c.text === 'string' && norm(c.text) === target) return true;
  }
  return false;
}

/** Two sentence cards say the same sentence: one contains the other word for
 *  word (case, punctuation and spacing ignored) — "I am a sales manager at my
 *  company" and "I am a sales manager at my company." are one card. */
export function sameSentence(a: string, b: string): boolean {
  return sentenceContains(a, b) || sentenceContains(b, a);
}

/** GDI trial run 2 (2026-10-29): an auto card and the brain's own
 *  show_sentence of the same sentence both stayed on the board. Ids of the
 *  AUTO cards (`autoIds`) on the current page (after the last newPage / clear
 *  in `commands`) that say `sentence` — the brain's card replaces them. */
export function autoSentenceCardsToReplace(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  autoIds: ReadonlySet<string>,
  sentence: string,
): string[] {
  const out: string[] = [];
  if (!autoIds.size || !norm(sentence ?? '')) return out;
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') break;
    if (c.action !== 'showSentence' || typeof c.id !== 'string' || !autoIds.has(c.id)) continue;
    if (typeof c.sentence === 'string' && sameSentence(c.sentence, sentence)) out.push(c.id);
  }
  return out;
}

/** Task 14 §I (GDI run 4: the hook sentence rendered on three pages): the
 *  1-based page (pages = newPage boundaries in the session's command log)
 *  where a showSentence card saying the same sentence (case, punctuation and
 *  spacing ignored — word-for-word equal) already stands, or null. `skipIds`
 *  = cards to ignore (an auto card on the current page that the brain's card
 *  replaces). Earliest page wins. */
export function sentenceOnBoardPage(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  sentence: string,
  skipIds: ReadonlySet<string> = new Set(),
): number | null {
  const target = norm(sentence ?? '');
  if (!target) return null;
  let page = 1;
  const hits: number[] = [];
  for (const c of commands) {
    if (c.action === 'newPage') { page++; continue; }
    // a clear wipes the current page — its cards are no longer on the board
    if (c.action === 'clear') { while (hits.length && hits[hits.length - 1] === page) hits.pop(); continue; }
    if (c.action !== 'showSentence' || typeof c.sentence !== 'string') continue;
    if (typeof c.id === 'string' && skipIds.has(c.id)) continue;
    if (norm(c.sentence) === target) hits.push(page);
  }
  return hits.length ? hits[0] : null;
}

/** Ids of the AUTO sentence cards on the current page (after the last
 *  newPage / clear) — the brain's card of the same sentence replaces them. */
export function autoCardIdsOnCurrentPage(
  commands: ReadonlyArray<{ action: string } & Record<string, unknown>>,
  autoIds: ReadonlySet<string>,
): Set<string> {
  const out = new Set<string>();
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') break;
    if (c.action === 'showSentence' && typeof c.id === 'string' && autoIds.has(c.id)) out.add(c.id);
  }
  return out;
}

/** The 1-based page the next card lands on (pages = newPage boundaries, as
 *  sentenceOnBoardPage numbers them). */
export function currentBoardPage(commands: ReadonlyArray<{ action: string }>): number {
  let page = 1;
  for (const c of commands) if (c.action === 'newPage') page++;
  return page;
}

/** Id of the showSentence card on the CURRENT page (after the last newPage /
 *  clear) saying `sentence` (word-for-word, case / punctuation ignored), or null. */
export function sentenceCardIdOnCurrentPage(commands: ReadonlyArray<{ action: string } & Record<string, unknown>>, sentence: string): string | null {
  const target = norm(sentence ?? '');
  if (!target) return null;
  for (let i = commands.length - 1; i >= 0; i--) {
    const c = commands[i];
    if (c.action === 'newPage' || c.action === 'clear') return null;
    if (c.action === 'showSentence' && typeof c.sentence === 'string' && typeof c.id === 'string' && norm(c.sentence) === target) return c.id;
  }
  return null;
}

/**
 * Task 21 §D3 (GDI run 9, 1014 s: "The model is "…" Listen, then say it
 * once" — the sentence stood on page 9, show_sentence_duplicate_skipped, and
 * the learner "did not see the sentence I needed to speak"): what a duplicate
 * show_sentence does. `page` = where it already stands (sentenceOnBoardPage),
 * null = not a duplicate (drawn). A pronunciation model the learner is asked
 * to repeat is never silently skipped: on the current page it is scrolled to
 * and pulsed ('rehighlight'), on another page it is drawn again ('reshow').
 * Everything else keeps the Task 14 §I skip.
 */
export function duplicateSentenceAction(input: {
  page: number | null; currentPage: number; pronunciationModel: boolean;
  /** fix round 1 (I3): a card saying it already stands on the page the new card would land on */
  onCurrentPage?: boolean;
  /** fix round 1 (m): the same sentence is already being drawn in this batch */
  inThisBatch?: boolean;
  /** Task 25 §D1: the deferred part page opened in this turn (this batch or an earlier batch of the turn) */
  advancedThisTurn?: boolean;
  /** Task 25 §D1: the card is the STUDENT's sentence (isStudentSentenceCard) */
  studentCard?: boolean;
}): 'draw' | 'skip' | 'rehighlight' | 'reshow' {
  if (input.inThisBatch) return 'skip';
  // Task 25 §D1 (GDI run 13, 1026–1044 s: the conversation answer, already on
  // page 7, was re-drawn on the new pronunciation page under its menu card):
  // on the turn that opens a new part, the student's sentence card stays on
  // the part it answered.
  if (input.page !== null && input.advancedThisTurn === true && input.studentCard === true) return 'skip';
  // Fix round 1 (I3): the CURRENT page first — a model also standing on an
  // earlier page is re-highlighted here, never drawn a second time here.
  if (input.pronunciationModel && input.onCurrentPage) return 'rehighlight';
  if (input.page === null) return 'draw';
  if (!input.pronunciationModel) return 'skip';
  return 'reshow';
}

/** Task 23 §A: a card sentence that is the STUDENT's sentence — their own
 *  words (echo), their sentence with a fix (correction), or a one-edit recast
 *  of it — as opposed to a new model sentence. Used to keep a brain
 *  show_sentence of the answer to the part being left in front of that part's
 *  page break. No student turn ⇒ false. */
export function isStudentSentenceCard(sentence: string, studentLast: string | null | undefined): boolean {
  if (!studentLast || !studentLast.trim() || !sentence || !sentence.trim()) return false;
  const kind = classifyQuotedSentence(sentence, studentLast).kind;
  if (kind === 'echo') return true;
  // Task 23 fix round 1 (m5): "correction" is loose (half the words shared) —
  // a NEW model sentence of the next part ("I have worked with international
  // customers for several years." after "Yes, I have worked with an
  // international customer before.") is not the student's. A correction /
  // recast counts only when it is the student's sentence with few edits: a
  // token edit distance of at most a third of the longer sentence.
  const a = recastTokens(studentLast);
  const b = recastTokens(sentence);
  if (a.length === 0 || b.length === 0) return false;
  return tokenEditDistance(a, b) * 3 <= Math.max(a.length, b.length);
}
/** Levenshtein distance over tokens. */
function tokenEditDistance(a: readonly string[], b: readonly string[]): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length]!;
}
