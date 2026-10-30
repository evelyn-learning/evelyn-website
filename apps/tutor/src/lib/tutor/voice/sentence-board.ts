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
   *  full sentence:" colon that repeat the student's words. */
  source?: 'echo' | 'checked' | 'affirmed' | 'introduced';
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
 *  as number words (numberWordToken). */
function tokens(text: string): string[] {
  return (dropThousands(text).match(TOKEN_RE) ?? []).map((t) => numberWordToken(t.toLowerCase().replace(/’/g, "'")));
}

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
  return parts.some((p) => (AFFIRM_EN_RE.test(p) || AFFIRM_JA_RE.test(p)) && !QUALIFIED_PRAISE_RE.test(p));
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
    const a = numberWordToken(lowerTok(words[i - 1]!));
    const b = numberWordToken(lowerTok(words[i]!));
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
    const t = numberWordToken(lowerTok(w));
    if (seen.has(t)) continue;
    if (w.includes('-') ? studentCompounds.has(t) : student.has(t)) continue;
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
};
function recastTokens(text: string): string[] {
  return dropFillersAndRepeats(tokens(text)).map((t) => PRONOUN_CLASS[t] ?? t);
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
  }
  return false;
}

/** Task 21 fix round 1 (I2): cues that a medium-confidence "correct" is not. */
const MEDIUM_CUE_RE = /\bremember to\b|\bdon['’]t forget\b|\badd ["“]|\bthe meaning is clear\b|\bmeaning is clear\b|\bidea is clear\b/i;
/** Fix round 2 (I2 residual): implicit corrections without the exact cue —
 *  "Just remember the article before project.", "In English we usually put an
 *  article there.", "Keep in mind …", "I understand what you mean." */
// Fix round 3: "remember" / "article" only in a correcting frame — "What do
// you remember most about …?" and "Did you write an article about it?" keep the card.
const MEDIUM_CUE_EXTRA_RE = /\b(?:just |please )?remember (?:to|the|that we|,? (?:an?|the) )\b|\bkeep in mind\b|\b(?:an?|the) article (?:before|after|there|here|is missing)\b|\bwe (?:usually|normally|often) (?:say|put|use)\b|\bwhat you mean\b|\bnext time,? (?:say|use|try|add)\b/i;
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
  for (const raw of (tutorText ?? '').split(/(?<=[.!?。！？])\s+/)) {
    if (/["“”「」『』‘]/.test(raw)) continue;
    let sentence = raw.trim().replace(RECAST_LEAD_RE, '');
    if (!sentence) continue;
    sentence = sentence[0]!.toUpperCase() + sentence.slice(1);
    const rawT = dropFillersAndRepeats(tokens(sentence));
    const classed = rawT.map((x) => PRONOUN_CLASS[x] ?? x);
    const edit = oneEditAt(said, classed) ? wholeOneEdit(said, classed) : null;
    if (!edit) continue;
    if (!isCardCandidate(sentence) || CJK_RE.test(sentence)) return null;
    if (AUX_QUESTION_OPENING_RE.test(sentence) || WH_QUESTION_OPENING_RE.test(sentence)) return null;
    const span = qualifyingSpan(sentence);
    if (!span || span.split(/\s+/).filter((w) => LATIN_WORD_RE.test(w)).length < CHECKED_CARD_MIN_WORDS) return null;
    const tok = edit.at >= 0 ? rawT[edit.at] : undefined;
    if (!tok) return { sentence: span, kind: 'correction', emphasis: [] };
    // Fix round 1 (m): the edited POSITION — when the card's words line up
    // one-to-one with the compared tokens, the index is exact.
    const words = span.match(TOKEN_RE) ?? [];
    const aligned = words.length === rawT.length && words.every((w, k) => numberWordToken(lowerTok(w)) === rawT[k]);
    if (aligned) return { sentence: span, kind: 'correction', emphasis: [words[edit.at]!], emphasisAt: [edit.at] };
    const word = (dropThousands(span).match(TOKEN_RE) ?? []).find((w) => numberWordToken(lowerTok(w)) === tok);
    return { sentence: span, kind: 'correction', emphasis: word ? [word] : [] };
  }
  return null;
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
    const toks = words.map((w) => numberWordToken(lowerTok(w)));
    for (let i = 0; i + fragToks.length <= toks.length; i++) {
      if (fragToks.every((x, j) => toks[i + j] === x)) return words.slice(i, i + Math.min(fragToks.length, FRAGMENT_EMPHASIS_MAX));
    }
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
}): QuotedSentence[] {
  if (input.renderedThisTurn) return [];
  const studentCorrect = input.studentCorrect === true;
  const affirmFallback = !studentCorrect && input.affirmFallback === true && !hasCorrectionCue(input.tutorText) && !FIX_FOLLOW_UP_RE.test(input.tutorText ?? '');
  const spans = [
    ...quotedSpansWithContext(input.tutorText).map((q) => ({ ...q, introduced: false })),
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
}): 'draw' | 'skip' | 'rehighlight' | 'reshow' {
  if (input.inThisBatch) return 'skip';
  // Fix round 1 (I3): the CURRENT page first — a model also standing on an
  // earlier page is re-highlighted here, never drawn a second time here.
  if (input.pronunciationModel && input.onCurrentPage) return 'rehighlight';
  if (input.page === null) return 'draw';
  if (!input.pronunciationModel) return 'skip';
  return 'reshow';
}
