import { stripBoardBlocks } from './board-inline';
import { TUTOR_V2_PART_OFFER_ONCE } from '../orchestrator/flags';
import type { V2State } from './types';
import { isPartFrame } from './reply-gate';
/**
 * Tutor brain v2 — a part is closed before the next is opened.
 *
 * The student answers, the tutor says "Yes, 8 volts", and in the same breath a new page turns and a new
 * subject begins: three sessions running, the student called that flip abrupt and asked to be told what comes
 * next and asked whether they have a question first (AP Physics, embed-1794496967839, embed-1794500923861).
 * Asking the tutor to do so in its instructions did not hold. So the runtime holds the page: a reply that
 * turns to a new page the student has not been asked about ends there, with the offer in its place, and the
 * page opens in the next reply once they have answered.
 */
/** A page heading that closes a lesson (D1): its summary or recap. */
export const V2_CLOSING_PAGE = /\b(?:summary|summing up|sum up|recap|wrap(?:[- ]?up)?|round[- ]?up|conclusion|key (?:points|takeaways))\b|まとめ|振り返り/i;

const words = (x: string) => x.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
const SMALL = new Set(['and', 'the', 'of', 'in', 'on', 'for', 'to', 'with', 'an', 'vs', 'or', 'at', 'by', 'is', 'are', 'why', 'how', 'what']);
/** The words of a page heading that carry its subject. */
export const headingWords = (title: string) => [...new Set(words(title).filter((w) => !SMALL.has(w)))];
/** Whether `text` names the part a heading stands for: at least half the heading's words are in it. */
export function namesPart(title: string, text: string): boolean {
  const want = headingWords(title); if (!want.length) return false;
  const have = words(text);
  return want.filter((w) => have.some((x) => x === w || (w.length >= 5 && x.startsWith(w.slice(0, 5))))).length >= Math.ceil(want.length / 2);
}
/** The student is steering: asking for something, or asking to go on. */
// Narrow on purpose: "let's take a look at this" and "how many grams comes from its molar mass" were read as steering,
// and two new pages opened straight after an answer (chemistry, embed-1794512595935).
const STEERS = /\b(?:move on|go on|go ahead|carry on|keep going|continue|skip (?:this|that|it)|next (?:one|question|problem|topic|part|section|thing)|another (?:one|problem|question|example|reaction)|some other|something else|a different|(?:can|could|will|would) (?:you|we) (?:give|do|try|move|go|show|have|start)|give me (?:a|an|another|one|some)|let'?s (?:move|go on|do another|try another|start))\b/i;
/** The tutor's last reply left the way open: it offered what comes next, or checked in. */
const OFFERS = /\b(?:next is|next up|ready|shall we|any questions?|a question first|make sense|with me|is that clear|all clear|so far|sound good)\b/i;
/** Task 6g (PART_OFFER_ONCE): the same, in Japanese (「次に進みますか、それとも先に質問がありますか？」). */
const OFFERS_JA = /(?:次|先)に進|進んでも|に進みますか|に進みましょうか|質問(?:が|は)(?:あります|ありません)か/;
const offers = (text: string, ja: boolean = TUTOR_V2_PART_OFFER_ONCE) => OFFERS.test(text) || (ja && OFFERS_JA.test(text));

/** Whether a sentence ends as a question. With `secondLanguage`, a question in the support language counts too: a
 *  bilingual ask ends on its Japanese ("…Shall we go on to the present perfect now? 次に現在完了を学びます。進んでも
 *  いいですか。"), which ends in か。, and the page was held and the same permission asked again (Task 6e, v2audio tester A
 *  turns 24 → 26). */
export function endsAsking(sentence: string, secondLanguage: boolean = TUTOR_V2_PART_OFFER_ONCE): boolean {
  return /\?["')\]]*$/.test(sentence) || (secondLanguage && /(?:[?？]|か[。．]?)["')\]」』]*\s*$/.test(sentence));
}

/** The tutor's last reply ended by asking whether to go on (or checking in), and the student has answered. */
export function leftOpen(lastTutor: string, studentSaid: string | null): boolean {
  const sentences = stripBoardBlocks(lastTutor).split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
  return !!studentSaid && endsAsking(sentences[sentences.length - 1] ?? '') && offers(sentences.slice(-2).join(' '));
}

export interface PartTurn { title: string; studentSaid: string | null; lastTutor: string; pagesOpen: number }
/** May this reply turn to a new page headed `title` now? */
export function mayOpenPart(t: PartTurn): boolean {
  if (t.pagesOpen <= 1) return true; // the lesson is only beginning
  const student = t.studentSaid ?? '';
  if (student && (STEERS.test(student) || namesPart(t.title, student))) return true;
  const sentences = stripBoardBlocks(t.lastTutor).split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
  const last = sentences[sentences.length - 1] ?? '';
  return endsAsking(last) && student !== '' && (offers(sentences.slice(-2).join(' ')) || namesPart(t.title, t.lastTutor));
}
const QUESTION_CHECK = /\b(?:a question first|any questions?(?! about)|questions? (?:before|so far))\b/i;
const replyText = (h: V2State['history'][number]) => (typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
/** Whether the last part change already asked whether they have a question: one of the tutor's replies from the one
 *  just before the current part's page block on. "Next is X. Shall we go on, or do you have a question first?" came
 *  2–3 times a run (Task 6e, v2audio RESULTS.md finding 6); the question check is for once in a while, never two part
 *  changes running. */
export function v2QuestionCheckRecent(history: V2State['history']): boolean {
  const replies = history.filter((h) => h.role === 'assistant').map(replyText).filter((x) => x.trim());
  let page = -1;
  for (let i = replies.length - 1; i >= 0; i--) if (/<board\s+page\b/.test(replies[i]!)) { page = i; break; }
  if (page < 0) return false;
  return replies.slice(Math.max(0, page - 1)).some((x) => QUESTION_CHECK.test(stripBoardBlocks(x)));
}

/** What the tutor says in place of the held page. `named`: the reply had already said what the next part is.
 *  `askQuestion` false: the last part change asked whether they had a question, so this one only asks to go on. */
export function partOffer(title: string, named: boolean, askQuestion: boolean = true): string {
  const ask = askQuestion ? 'Shall we go on, or do you have a question first?' : 'Shall we go on?';
  if (named) return ask;
  const t = title.trim().replace(/[.:;,]+$/, '');
  const lower = /^[A-Z][a-z]/.test(t) && !/^[A-Z][a-z]+'s\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
  // A part headed by a question is named as one: "Next is which one matches?." was said (demo check, 2026-11-13).
  return /[?？]$/.test(t) ? `Next: ${lower} ${ask}` : `Next is ${lower}. ${ask}`;
}

/** The most part-change frames a lesson hears (Task 6e fix round 1, F1). */
export const V2_MAX_PART_FRAMES = 2;
/** A frame sentence: asking whether to go on, alone or with "or do you have a question first?" ("any questions so far?"
 *  in the middle of a part is a check-in, not a frame: fix round 2, minor a). */
/** Task 6g (PART_OFFER_ONCE): a Japanese frame counts as one, and Japanese sentences are cut after 。！？ with no space
 *  after them ("…ここまでです。次に進みますか、それとも先に質問がありますか？" was one piece, and tester A heard a frame at
 *  two part changes running, v2audio-6f). */
const SENTENCE_CUT = /(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/;
const hasFrame = (text: string, ja: boolean = TUTOR_V2_PART_OFFER_ONCE) => stripBoardBlocks(text).split(ja ? SENTENCE_CUT : /(?<=[.!?。！？])\s+/).some((x) => isPartFrame(x.trim(), ja));
const PAGE_BLOCK = /<board\s+page\b/;
/** Whether this lesson may ask at a part change whether to go on (and whether they have a question first): fewer than
 *  V2_MAX_PART_FRAMES asked so far, and none at the last part change. The frame came at every part change, by the model
 *  as often as by the runtime: tester B heard it five times, gdi-real-josh at two changes running (v2audio-6e finding C).
 *  Only frames said at a part change count (fix round 2, minor a): a frame followed by the opening of a page that is not
 *  the lesson's first, with no other frame between ("Shall we start?" before the first page is the opening), or the
 *  last frame with no page after it yet, whose change is happening now. Fix round 3 (P1): the page need not come in the
 *  very next reply: a student who answers the frame with a question gets the page one reply later, and that frame
 *  escaped both the budget and "asked at the last change". */
export function v2FrameDue(history: V2State['history']): boolean {
  const replies = history.filter((h) => h.role === 'assistant').map(replyText).filter((x) => x.trim());
  const n = replies.length;
  const isPage = (i: number) => PAGE_BLOCK.test(replies[i]!);
  const firstPage = replies.findIndex((r) => PAGE_BLOCK.test(r));
  /** The page a frame at `i` led to: the next reply that opens one (-1: none yet), or null when another frame came first. */
  const ledTo = (i: number): number | null => {
    for (let j = i + 1; j < n; j++) { if (isPage(j)) return j; if (hasFrame(replies[j]!)) return null; }
    return -1;
  };
  const changes: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!hasFrame(replies[i]!)) continue;
    const j = ledTo(i);
    if (j === null || j === firstPage) continue;
    changes.push(j);
  }
  if (changes.length >= V2_MAX_PART_FRAMES) return false;
  let page = -1;
  for (let i = n - 1; i >= 0; i--) if (isPage(i)) { page = i; break; }
  // A frame still waiting for its page (-1), or the frame that led to the last page opened: the last change asked it.
  return !changes.includes(-1) && !(page >= 0 && changes.includes(page));
}
