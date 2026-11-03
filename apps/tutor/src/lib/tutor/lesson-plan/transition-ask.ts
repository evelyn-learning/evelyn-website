/**
 * Task 24 §C1 (GDI run 12, 962–1051 s): the client's budget advance moved a
 * fixed-script lesson into "Part 7 · Pronunciation" and the transition turn
 * (the one carrying the FACT note) kept the old part's thread — "Did the
 * seminar take place last year, or more recently?" — for three more turns
 * under the pronunciation card.
 *
 * A transition attempt whose closing ask shares fewer than two content
 * tokens with the new part's card statement is asking about something else:
 * the validator kills it once and the retry is told to reply in one sentence
 * and end with the new part's own question.
 *
 * Tokens: Latin letter runs of ≥ 3, lower-cased, minus a stopword list;
 * numbers are ignored. An ask with fewer than two content tokens (a Japanese
 * ask, a short closer) is never flagged, nor one the card contains or whose
 * tokens all appear in the card; a card with fewer than two content tokens
 * gives nothing to check.
 *
 * Pure. Generic: no topic words.
 */
import { lastAskSentence, lastQuestionSentence, turnEndsWithAsk } from '../question-gist-text';
import { withSilentClause, withRetryStyle } from '../voice/output-budget';
import { boardOffersChoices } from '../voice/sentence-board';
import { menuReadInTurn } from './fixed-script';
import { menuNumberAskedIn } from '../voice/menu-pick';

// Task 29 §M (GDI run 16, 749 s, Image 62): the retry opened with the move
// and never answered the student's correction — answer first, then move.
export const TRANSITION_ASK_REASON = withRetryStyle(
  "If the student just corrected you or asked something, answer that first in ONE sentence; the move comes after it. " +
  "The lesson has moved to the next part. Reply to the student's last answer in ONE sentence with no follow-up question about it, then present the new part's card and end with that part's own question. " +
  // Task 38 §B (voice run 19, 433 s: "Your sentence about the … project is
  // correct" praised a reply that did not answer the question asked): an
  // off-topic reply gets a brief acknowledgement, never praise.
  "If that answer did not answer the question you asked, do not praise it or call it correct; acknowledge it briefly (\"Noted.\") and go straight to the new part.");

const STOPWORDS = new Set([
  'the', 'and', 'but', 'for', 'nor', 'yet', 'not', 'are', 'was', 'were', 'has', 'have', 'had', 'been', 'being',
  'did', 'does', 'doing', 'done', 'can', 'could', 'would', 'should', 'will', 'shall', 'may', 'might', 'must',
  'you', 'your', 'yours', 'our', 'ours', 'its', 'they', 'them', 'their', 'she', 'her', 'him', 'his', 'who', 'whom',
  'what', 'which', 'when', 'where', 'why', 'how', 'that', 'this', 'these', 'those', 'there', 'here', 'then', 'than',
  'with', 'from', 'into', 'onto', 'about', 'over', 'under', 'after', 'before', 'again', 'also', 'just', 'only',
  'very', 'some', 'any', 'all', 'each', 'every', 'more', 'most', 'much', 'many', 'other', 'such', 'own', 'same',
  'like', 'please', 'let', 'lets', 'now', 'okay', 'yes', 'one', 'two', 'three', 'four', 'five',
  'tell', 'say', 'try', 'want', 'think', 'know', 'get', 'got', 'make', 'use', 'see', 'give',
]);

/** Content tokens of `text`: Latin letter runs of ≥ 3, lower-cased, no stopwords. */
export function contentTokens(text: string): string[] {
  const out: string[] = [];
  for (const m of (text ?? '').toLowerCase().matchAll(/[a-z]+(?:['’][a-z]+)?/g)) {
    const w = m[0].replace(/['’].*$/, '');
    if (w.length >= 3 && !STOPWORDS.has(w)) out.push(w);
  }
  return out;
}

/** Whether the ask is about something other than the new part's card:
 *  fewer than 2 of its content tokens appear in the card statement. */
export function askOffNewPart(ask: string, cardStatement: string): boolean {
  // Fix round 1 (I-2, m-7): fail toward not killing. An ask with 0–1 content
  // tokens (a Japanese ask, "Ready?", "Which would you like to start with?",
  // "What do you do at work?") is never flagged; an ask the card contains
  // (normalised) or whose content tokens all appear in the card is on-part.
  const askTokens = [...new Set(contentTokens(ask))];
  if (askTokens.length < 2) return false;
  // Task 27 fix round 1 (m-7): on a choice-menu card, a pick question ("Which
  // option would you like to practise?") is the part's own ask.
  if (boardOffersChoices({ statement: cardStatement }) && /\b(?:which|choose|pick|option|options|number)\b/i.test(ask)) return false;
  const card = new Set(contentTokens(cardStatement));
  if (card.size < 2) return false; // nothing to compare against
  const askNorm = latinWords(ask);
  if (askNorm && ` ${latinWords(cardStatement)} `.includes(` ${askNorm} `)) return false;
  let shared = 0;
  for (const t of askTokens) if (card.has(t)) shared += 1;
  if (shared === askTokens.length) return false;
  return shared < 2;
}

/** Lower-cased Latin words, space-joined (the normalised text compare). */
function latinWords(text: string): string {
  return ((text ?? '').toLowerCase().match(/[a-z]+(?:['’][a-z]+)?/g) ?? []).join(' ');
}

/** The attempt's closing ask sentence, or null when it does not end with an
 *  ask (turnEndsWithAsk). */
export function transitionAskSentence(text: string): string | null {
  const t = (text ?? '').trim();
  if (!t || !turnEndsWithAsk(t)) return null;
  const sentences = t.split(/(?<=[。！？.!?])\s*|\n+/).map((x) => x.trim()).filter(Boolean);
  const last = sentences[sentences.length - 1] ?? '';
  if (/[?？]["”’)\]]*\s*$/.test(last)) return lastQuestionSentence(t) ?? last;
  return lastAskSentence(t) ?? last;
}

/** Task 27 §E1 (GDI run 14, 955–958 s): the brain's OWN advance_lesson into
 *  the pronunciation part ended "Can you read the sentence on the board aloud
 *  for me?" — no sentence was on the board and the part's menu was never
 *  asked; the check ran only on the FACT-note turn of a client advance. It
 *  now runs on every turn that moved the segment pointer (any path) into a
 *  part whose card asks something or offers choices; the FACT-note turn as
 *  before. */
export function cardAsksOrOffersChoices(card: string | null | undefined): boolean {
  const c = card ?? '';
  return /[?？]/.test(c) || boardOffersChoices({ statement: c });
}
export function transitionAskCheckDue(input: {
  /** the turn carried a fixed-script FACT note (the client moved the pointer) */
  factNoteDelivered: boolean;
  /** the pointer moved during this turn (the brain's advance_lesson included) */
  advancedThisTurn: boolean;
  fixedScript: boolean;
  /** the new part's card statement ('' = none) */
  card: string;
  /** TUTOR_TRANSITION_ASK_EVERY_ADVANCE */
  everyAdvance?: boolean;
}): boolean {
  if (!input.card) return false;
  if (input.factNoteDelivered) return true;
  return input.everyAdvance !== false && input.fixedScript && input.advancedThisTurn && cardAsksOrOffersChoices(input.card);
}

/**
 * Task 39 §B (voice run 20, 166–172 s): the transition_ask_off_part retry
 * STILL ended with the off-card quiz ("Now, which word would you add after
 * "sold" to finish the sentence?"). On that retry the off-card question
 * sentences are dropped as they stream (offCardAskStripped), and when the
 * retry then ends without the new part's own question the engine speaks the
 * authored card question itself (cardAskEngineFallbackLine) — the Task 33
 * R9-2 engine-spoken-offer mechanism. Flag TUTOR_CARD_ASK_ENGINE_FALLBACK.
 */
const CHUNK_SPLIT_RE = /(?<=[.!?。！？])\s+/;
/** The chunk without its question sentences that are off the new part's card
 *  (askOffNewPart); unchanged when none is. */
export function offCardAskStripped(chunk: string, card: string): string {
  const raw = chunk ?? '';
  if (!card || !/[?？]/.test(raw)) return raw;
  const parts = raw.split(CHUNK_SPLIT_RE);
  const kept = parts.filter((p) => !(/[?？]["”’)\]]*\s*$/.test(p) && askOffNewPart(p, card)));
  return kept.length === parts.length ? raw : kept.join(' ').trim();
}
/** The card's own question to speak: its last question sentence, or the whole
 *  statement for a choice menu; null when the card asks nothing. */
export function cardAskLine(card: string | null | undefined): string | null {
  const c = (card ?? '').trim();
  if (!c) return null;
  if (boardOffersChoices({ statement: c })) return c;
  const q = lastQuestionSentence(c)?.trim();
  return q ? q.replace(/^["“「]\s*/, '') : null;
}
/** The line the engine speaks at the end of a transition_ask_off_part retry
 *  that still ends off the card (or with no ask at all); null otherwise. */
export function cardAskEngineFallbackLine(input: {
  enabled: boolean;
  /** the turn's transition_ask_off_part kill already happened (this is its retry) */
  retried: boolean;
  killed: boolean;
  /** the attempt's kept text */
  text: string;
  /** the new part's card statement */
  card: string;
  /** Fix round 1 (I-2): everything spoken this turn so far (earlier attempts' heard text included) */
  turnSpoken?: string;
}): string | null {
  if (!input.enabled || !input.retried || input.killed || !input.card) return null;
  const line = cardAskLine(input.card);
  if (!line) return null;
  const ask = transitionAskSentence(input.text);
  if (ask && !askOffNewPart(ask, input.card)) return null;
  // Fix round 1 (I-2): the retry (or the turn) already read the menu or asked
  // the card's question somewhere — never spoken twice.
  const spoken = `${input.turnSpoken ?? ''} ${input.text ?? ''}`;
  if (menuReadInTurn(input.card, spoken)) return null;
  if (cardQuestionSpoken(line, spoken)) return null;
  return line;
}
/** Fix round 1 (I-2): a question sentence of `spoken` that is on the card
 *  (askOffNewPart false, ≥ 2 content tokens). */
function cardQuestionSpoken(cardLine: string, spoken: string): boolean {
  const qs = (spoken ?? '').match(/[^.!?。！？\n]{4,}[?？]/g) ?? [];
  return qs.some((q) => contentTokens(q).length >= 2 && !askOffNewPart(q, cardLine));
}

/**
 * Task 42 §D (bot run r36, 941–972 s): the brain advanced into the
 * pronunciation part inside its own turn ("Let's move on to the pronunciation
 * practice now. Please read this sentence aloud: …") and the next turn went
 * straight to a word — the authored choice menu was never presented (the
 * loose menuAskedIn counted "sentence" + "speaking" inside the quoted student
 * sentence). On a part whose card is a choice menu, when neither the entering
 * turn nor the first turn after it presents the menu, the engine appends the
 * authored menu (cardAskLine) to that first turn; and the pronunciation
 * auto-arm stays off until a pick is resolved or the menu-ask cap is reached.
 */
const QUOTED_RE = /"[^"\n]*"|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』/g;
/** The tutor presented the card's menu in its own words: at least two of the
 *  card's choices named, or a numbered-choice ask ("Just tell me the number.",
 *  "どの番号にしますか。") — both outside quoted spans (quoted student text
 *  never counts). Task 42 fix round 1: the ONE menu detector for the
 *  MENU_ASK_CAP counter, the auto-arm release and the entry fallback. */
export function menuPresentedIn(card: string | null | undefined, turnText: string | null | undefined): boolean {
  const c = card ?? '';
  if (!c || !boardOffersChoices({ statement: c })) return false;
  const own = (turnText ?? '').replace(QUOTED_RE, ' ');
  return menuReadInTurn(c, own) || menuNumberAskedIn(own);
}
export function menuEntryFallbackLine(input: {
  enabled: boolean;
  /** the part the menu belongs to is current and was entered on the previous turn */
  pendingForThisPart: boolean;
  /** the entering turn presented the menu */
  enteringPresented: boolean;
  picked: boolean;
  killed: boolean;
  card: string | null | undefined;
  /** everything spoken this turn so far, this attempt's kept text included */
  turnSpoken: string;
}): string | null {
  if (!input.enabled || !input.pendingForThisPart || input.enteringPresented || input.picked || input.killed) return null;
  const card = input.card ?? '';
  if (!boardOffersChoices({ statement: card })) return null;
  if (menuPresentedIn(card, input.turnSpoken)) return null;
  return cardAskLine(card);
}
/** The pronunciation auto-arm waits on a menu part until a pick resolves or
 *  the menu was asked `cap` times. */
export function menuPickPendingSuppressesArm(input: { menuPart: boolean; picked: boolean; menuAsks: number; cap: number }): boolean {
  return input.menuPart && !input.picked && input.menuAsks < input.cap;
}
