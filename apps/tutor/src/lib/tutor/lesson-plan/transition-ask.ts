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

export const TRANSITION_ASK_REASON =
  "The lesson has moved to the next part. Reply to the student's last answer in ONE sentence with no follow-up question about it, then present the new part's card and end with that part's own question.";

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
