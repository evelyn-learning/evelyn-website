/**
 * Tutor brain v2 — the plan's parts, the board's pages and the part chips move together (Task 7a).
 *
 * Mic test 1 (embed-1794882458629) saw the three disagree: the chips lit the part after the last goal marked ("Your job"
 * green and "Present perfect" lit while the job was still being talked about); a present perfect page held for "shall we
 * go on?" never opened after "yes, we move on", and the part was taught on the job's page; a "Past simple" page opened
 * in a reply still praising a present perfect sentence; pronunciation ran on the conversation's page. One rule, for
 * plans whose every part has an authored name (the only plans whose pages can be told apart by part):
 *   - a part starts with its own page, headed by its name;
 *   - the lit chip is the part whose page is open (a level check, which has no page, while it runs);
 *   - a part is green when the lesson has moved past it after teaching it; the level check when the level is set.
 * And by the product owner's decision (PART_ASK_EVERY), every part change after the level check is asked first, in words
 * that vary through the lesson. Pure: the callers gate (Task 7e: PART_POSITION_KEPT is the default of a parameter).
 */
import type { LessonPlan } from '../lesson-plan/types';
import { stripBoardBlocks } from './board-inline';
import { PART_OFFERS, V2_CLOSING_PAGE, endsAsking } from './part-close';
import { V2_OFFER_SHAPE, v2IsPageOfPart, v2PartNamedIn, v2PartOf } from './plan-map';
import { V2_PART_FRAME_JA, isPartFrame } from './reply-gate';
import type { V2Board, V2State } from './types';
import { TUTOR_V2_PART_POSITION_KEPT } from '../orchestrator/flags';

type View = Pick<V2State, 'board' | 'goals' | 'workingLevel'> & { closed?: boolean };

/** A plan whose every part has an authored name (Tasks 6c/6e gate the same way). */
export function v2PlanLabelled(plan: LessonPlan | null | undefined): plan is LessonPlan {
  return !!plan && plan.segments.length >= 2 && plan.segments.every((seg) => !!v2PartOf(seg).label);
}

/** The part whose page a heading is (its name in the heading), a summary heading the last part's; -1: none. */
export function v2PartOfPage(plan: LessonPlan, title: string): number {
  const i = plan.segments.findIndex((seg) => v2IsPageOfPart(seg, title));
  if (i >= 0) return i;
  return V2_CLOSING_PAGE.test(title) ? plan.segments.length - 1 : -1;
}

const isLevelPart = (plan: LessonPlan, i: number) => !!plan.segments[i] && v2PartOf(plan.segments[i]!).skipWhenLevelKnown;
const paged = (plan: LessonPlan, board: V2Board, i: number) => board.pages.some((pg) => v2PartOfPage(plan, pg.title) === i);

/** The part of the page in view, or of the nearest page before it that is a part's; -1: none.
 *  Task 7e (PART_POSITION_KEPT, `kept`): the furthest part reached instead: the part of the newest part page, a page of a part
 *  already paged being a revisit. A page in view is only where the tutor is looking: `go_to_page` back to "Past simple" for
 *  more examples moved the part in hand back, and the runtime's ask named conversation again (v2audio-7 Tester A T77–T78). */
export function v2OpenPagePart(plan: LessonPlan, board: V2Board, kept: boolean = TUTOR_V2_PART_POSITION_KEPT): number {
  if (kept) {
    const seen = new Set<number>(); let at = -1;
    for (const pg of board.pages) { const k = v2PartOfPage(plan, pg.title); if (k >= 0 && !seen.has(k)) { seen.add(k); at = k; } }
    return at;
  }
  for (let i = Math.min(board.current, board.pages.length - 1); i >= 0; i--) {
    const k = v2PartOfPage(plan, board.pages[i]!.title);
    if (k >= 0) return k;
  }
  return -1;
}

/** The part in hand: the part whose page is open; the level check (no page of its own) once its goal is marked after the
 *  page before it, until the next part's page opens. */
export function v2PartInHand(plan: LessonPlan, state: View, kept: boolean = TUTOR_V2_PART_POSITION_KEPT): number {
  const open = v2OpenPagePart(plan, state.board, kept);
  if (open < 0) return 0;
  const l = open + 1;
  if (l < plan.segments.length && isLevelPart(plan, l) && !paged(plan, state.board, l)) {
    const g = state.goals[plan.segments[l]!.id]?.status;
    if (g && g !== 'skipped') return l;
  }
  return open;
}

/** Which parts are done (green). The level check: the level is set. The part in hand: only once the lesson has closed.
 *  A part before it: taught (its page was open, or it was marked shown or demonstrated); one skipped untaught is not. A
 *  part after it (the tutor turned back): its page was open. A goal mark alone never makes a part green before its page. */
export function v2PartsDone(plan: LessonPlan, state: View, cur: number = v2PartInHand(plan, state)): boolean[] {
  return plan.segments.map((seg, i) => {
    if (isLevelPart(plan, i)) return !!state.workingLevel;
    const g = state.goals[seg.id]?.status;
    const taught = paged(plan, state.board, i) || g === 'shown' || g === 'demonstrated';
    if (i === cur) return !!state.closed && taught;
    if (i < cur) return taught;
    return paged(plan, state.board, i);
  });
}

/** The part after `from` in the plan, past a level check whose level is set; -1: none. */
export function v2NextPart(plan: LessonPlan, state: View, from: number): number {
  for (let i = from + 1; i < plan.segments.length; i++) {
    if (isLevelPart(plan, i) && (state.workingLevel || state.goals[plan.segments[i]!.id]?.status === 'skipped')) continue;
    return i;
  }
  return -1;
}

/** The part a new page opens, and the heading it opens under. A heading that names a part is that part's page. Any other
 *  heading (not the lesson's first page) opens the next part, under that part's name ("Your project" was the conversation
 *  part, and its chip, page and "Next is…" named three things). Null: the opening page, or no part left but the closing one. */
export function v2PageForPart(plan: LessonPlan, state: View, title: string): { index: number; title: string } | null {
  const k = v2PartOfPage(plan, title);
  if (k >= 0) return { index: k, title };
  if (!state.board.pages.length) return null;
  let next = v2NextPart(plan, state, v2PartInHand(plan, state));
  // Final review M5: never a level check (it has no page by design): a check that ended with no level (its budget spent) left
  // it "next", and an unnamed teaching page was retitled "Level check" and lit that chip. The part after it instead.
  while (next >= 0 && isLevelPart(plan, next)) next = v2NextPart(plan, state, next);
  // Never the closing part by elimination: an unnamed page is not taken for the summary (its own rules decide the close).
  return next < 0 || next === plan.segments.length - 1 ? null : { index: next, title: v2PartOf(plan.segments[next]!).label! };
}

/** Whether a page for part `index` is a part change that is asked first: a part other than the one in hand, after the lesson
 *  has begun (the level check, and an opening part before it, go straight on: the ruling for the first teaching part). */
export function v2PartChangeAsked(plan: LessonPlan, state: View, index: number): boolean {
  const cur = v2PartInHand(plan, state);
  if (index === cur) return false;
  return !plan.segments.slice(0, cur + 1).every((seg, i) => seg.kind === 'hook' || isLevelPart(plan, i));
}

const SENTENCES = /(?<=[.!?]["'”’)]*)\s+|(?<=[。！？][」』)）"”]*)\s*/;
const FILLER = '(?:(?:uh|um|er|erm|ah|oh|well|so|okay|ok|hmm)[,.]?\\s+)*';
const GO = new RegExp(`^${FILLER}(?:yes|yeah|yep|yup|ya|sure|ok(?:ay)?|alright|all right|fine|go on|go ahead|carry on|let'?s|let us|no,? let(?:'?s| us) (?:move|go)|move on|we (?:can )?(?:move|go) on|next|continue|ready|i'?m ready|no,? (?:more )?questions?|nope|no,? (?:let'?s|go|move)|please|of course|sounds good|good|great|right|got it|understood)\\b`, 'i');
const QUESTION = new RegExp(`[?？]\\s*$|^${FILLER}(?:(?:yes|yeah)[,.]?\\s+)?(?:what|why|how|when|where|which|who|whose|can|could|would|should|is|are|do|does|did|may|i have (?:a|one) question|i(?:'ve| have) got (?:a|one) question|a question|question|wait|sorry|pardon|excuse me|i don'?t (?:understand|get it|know)|what'?s)\\b|質問|わかりません|分かりません`, 'i');
const GO_JA = /^(?:はい|ええ|うん|お願いします|大丈夫|進みましょう|次へ|次に|いいです|オーケー)/;

/** Fix round 1 (review I2): a decline or a redirect anywhere in the answer is no go-ahead, whatever it opens with ("Okay,
 *  skip it.", "Let's skip to the summary.", "Please explain that again." were all read as yes). */
const DECLINE = /\b(?:skip|rather not|no,? thanks?|no,? thank you|summary|instead|again|explain|repeat|not (?:now|yet|today)|later|don'?t (?:want|need)|stop)\b|スキップ|飛ばし|やめ|いいえ|結構です|もう一度|説明|まとめ|あとで|後で/i;
/** Asking to go on is a go, not a question ("Can we go on?"). */
const ASKS_TO_GO = new RegExp(`^${FILLER}(?:(?:yes|yeah)[,.]?\\s+)?(?:can|could|shall|may) we (?:go on|move on|continue|start)\\b`, 'i');
/** A bare no, to an ask that offers a question first: no questions, so go on (review M2). */
const BARE_NO = new RegExp(`^${FILLER}(?:no|nope|nah)(?:,? (?:thanks?|thank you|questions?|i'?m (?:fine|good|ok(?:ay)?)))?[.!]*$`, 'i');
/** "No questions." is a go whatever was asked. */
const NO_QUESTIONS = new RegExp(`^${FILLER}(?:no|nope),? (?:more )?questions?\\b`, 'i');
/** A part ask that offers a question first ("Any questions first, or shall we go on?"; final review I4: "…is there anything
 *  you would like to ask first?"). */
const QUESTIONS_FIRST = /\b(?:questions?|ask (?:something|anything)|(?:like|want) to ask)\b|質問/i;
/** Final review I4: "no questions, I'm ready" in the words learners use, to an ask that offers a question first. Mic test 1's
 *  flag 5 shape came back on the runtime's own asks: "No, I'm ready.", "I don't have any questions.", "Nothing.", "No, it's
 *  okay." were read as `other` and 「質問はありません。」 as a question, so the held page never opened. */
const NO_QUESTIONS_READY = new RegExp([
  `^${FILLER}(?:(?:no|nope|nah)[,.!]?\\s+)?(?:i'?m|i am) (?:ready|fine|good|ok(?:ay)?|all right|alright)\\b`,
  `^${FILLER}(?:(?:no|nope|nah)[,.!]?\\s+)?i (?:don'?t|do not|haven'?t got) (?:have )?(?:any|a|one)(?: (?:more |other |further )?questions?)?(?:[,.!]|\\s+(?:thanks?|thank you|now|today|for now|at the moment|right now)|$)`,
  `^${FILLER}(?:(?:no|nope|nah)[,.!]?\\s+)?(?:nothing|none)(?:\\s+(?:really|at all|for now|right now|thanks?|thank you))?(?:[,.!]|$)`,
  `^${FILLER}(?:no|nope|nah)[,.!]?\\s+(?:it'?s|that'?s|it is|that is|all) (?:ok(?:ay)?|fine|all right|alright|good)\\b`,
  `^${FILLER}(?:no|nope|nah)[,.!]?\\s+(?:all good|i'?m good|we can go on|go ahead|please (?:go on|continue))\\b`,
].join('|'), 'i');
const NO_QUESTIONS_READY_JA = /^(?:(?:いいえ|いや|ううん)[、,]?\s*)?(?:(?:特に)?質問は(?:特に)?(?:ありません|ないです|ない|大丈夫です?)|(?:特に)?(?:ありません|ないです)|大丈夫(?:です)?)(?:[。！!、,]|$)/u;
/** …unless the answer goes on to ask for something else ("No, I'm fine, but can you explain that again?"). */
const READY_BUT = /\b(?:but|skip|again|explain|repeat|wait|summary|instead)\b|[?？]|でも|けど|もう一度|説明|スキップ|まとめ/i;

/** The student's answer to "shall we go on, or do you have a question first?": 'go' (yes, let's, no questions), 'question'
 *  (they ask something: answered first, then the move), or 'other' (skip, not now, an answer to something else).
 *  `lastTutor`: the reply they answer; when its last sentence is a part ask that offers a question first, a bare "No." is a go. */
export function v2MoveAnswer(said: string | null, lastTutor: string = ''): 'go' | 'question' | 'other' {
  const s = (said ?? '').trim();
  if (!s) return 'other';
  const last = stripBoardBlocks(lastTutor).split(SENTENCES).map((x) => x.trim()).filter(Boolean).pop() ?? '';
  if (NO_QUESTIONS.test(s)) return 'go';
  // Final review I4: ahead of the decline and question checks (「いいえ」 is a decline word, 「質問」 a question's).
  if ((NO_QUESTIONS_READY.test(s) || NO_QUESTIONS_READY_JA.test(s)) && !READY_BUT.test(s) && last && v2IsPartAsk(last) && QUESTIONS_FIRST.test(last)) return 'go';
  if (BARE_NO.test(s)) return last && v2IsPartAsk(last) && QUESTIONS_FIRST.test(last) ? 'go' : 'other';
  if (DECLINE.test(s)) return 'other';
  if (ASKS_TO_GO.test(s)) return 'go';
  if (QUESTION.test(s)) return 'question';
  return GO.test(s) || GO_JA.test(s) ? 'go' : 'other';
}
/** An unambiguous yes on its own ("Yes.", "Sure, please."): the only go-ahead to a choice offer that does not name the part. */
const BARE_YES = new RegExp(`^${FILLER}(?:yes|yeah|yep|sure|ok(?:ay)?|alright|all right|of course|はい|ええ)(?:,?\\s*(?:please|let'?s do (?:it|that)|i'?d like (?:that|to)|お願いします))?[.!。！]*$`, 'i');
/** A choice offer: the part, or something else ("…, or skip it and go to the summary?"). */
// Fix round 2: not "or do": "…go on, or do you have a question first?" is the part ask, not a choice of parts.
const CHOICE = /\bor (?:skip|go straight|move on|go on|finish|stop|leave|go to|do (?:something|it|that) (?:else|later))\b|それとも(?![^。？?]*質問)|どちら/i;

/** The tutor replies in a history. */
export const v2TutorReplies = (history: V2State['history']) => history.filter((h) => h.role === 'assistant').length;
/** A held page waits this many tutor replies for its yes (a question answered, then asked again); then it lapses. */
export const V2_HELD_PAGE_REPLIES = 3;

/** Fix round 3 (controller ruling): the no-name fallback's only frame. Its subject is the lesson moving on: "shall we / let's /
 *  let us / can we / could we / ready to / would you like to / do you want to" + "go on | move on | continue", bare or "to the
 *  next part/section/topic", ending the clause ("Shall we move on?", "…, or shall we go on?", "Ready to go on, or…"). Not
 *  "Can you go on?" (keep talking), "go on to tell me…", "the next sentence/example/step", "the next part of your answer"
 *  (a yes to those opened the next part's page). In Japanese, the Task 6g frame forms. */
const MOVE_FRAME = /\b(?:shall we|let'?s|let us|can we|could we|(?:are you )?ready to|would you like to|do you want to)\s+(?:go on|move on|continue)(?:\s+to the next (?:part|section|topic) of (?:the|our|today'?s) lesson|\s+to the next (?:part|section|topic))?\s*(?:[,?？]|$|\s+or\b|\s+now\b)/i;
const NOT_THE_LESSON = /\bnext (?:sentence|example|one|question|exercise|word|step|line|item|try)\b|\bpart of your\b/i;
// Task 7c (7a re-review): the runtime's own five asks, word for word, are about moving on ("Do you have a question before we go
// on, or are you ready?" is not in the frame's shape).
const movesOn = (sentence: string) => V2_PART_ASKS.includes(sentence.trim()) || ((MOVE_FRAME.test(sentence) || V2_PART_FRAME_JA.test(sentence)) && !NOT_THE_LESSON.test(sentence));
const asks = (x: string) => /(?:[?？]|か[。．]?)["'」』）)]*\s*$/.test(x);

/** The part whose page is waiting for the student's yes: the page held at the last part change (not lapsed), or a part the
 *  last reply offered by name ("Would you like to practise your pronunciation…?", "Shall we move on to the past simple?")
 *  that has no page yet and is not the part in hand nor the closing part (the close keeps its own rules). A part the
 *  student's words name comes first. Null: none. */
export function v2PendingPart(plan: LessonPlan, state: View & Pick<V2State, 'history' | 'heldPage'>, lastTutor: string, said: string | null): { index: number; title: string } | null {
  const held = state.heldPage;
  // Task 7c fix round 1: a page held unasked (the reply asked something else) waits for its ask; a yes now answers that other
  // question, not a part change.
  if (held && !held.unasked && v2TutorReplies(state.history) - held.at <= V2_HELD_PAGE_REPLIES) {
    const index = plan.segments.findIndex((seg) => seg.id === held.part);
    if (index >= 0 && !paged(plan, state.board, index)) return { index, title: held.title };
  }
  const cur = v2PartInHand(plan, state);
  const sentences = stripBoardBlocks(lastTutor).split(SENTENCES).map((x) => x.trim()).filter(Boolean);
  // Fix round 1 (review I1): a part ask the reply ends on ("Next is the present perfect. Any questions first, or shall we go
  // on?", the model's own or the runtime's after a dropped repeat), with no page held: the part its last two sentences name,
  // else the part after the one in hand. Never the part in hand, one already paged, or the closing part.
  const lastAsk = sentences[sentences.length - 1] ?? '';
  if (lastAsk && v2IsPartAsk(lastAsk)) {
    const two = sentences.slice(-2).join(' ');
    const namedNow = plan.segments.map((seg, i) => ({ seg, i })).filter(({ seg }) => !!v2PartOf(seg).label && v2PartNamedIn(seg, two));
    const others = namedNow.filter(({ i }) => i !== cur);
    // Two parts named ("pronunciation, or shall we move on to the summary?"): only the one their words name.
    const pickNow = others.length > 1 ? others.find(({ seg }) => !!said && v2PartNamedIn(seg, said)) ?? null : others[0] ?? null;
    if (others.length > 1 && !pickNow) return null;
    // Fix rounds 2–3: the part after the one in hand only for a frame about the lesson moving on (movesOn), never for a bare
    // "shall we"/"ready"/"go on": "Shall we try another sentence?", "Can you go on?" are practice asks, and a yes to them
    // opened the next part's page. Otherwise the part comes from the held page or the part named in the ask.
    // Task 7c (7a re-review): a name of the part in hand ("Good, that's your job covered. Any questions first, or shall we go
    // on?") names no part to go to: the frame decides.
    const index = pickNow ? pickNow.i : others.length ? -1 : movesOn(lastAsk) ? v2NextPart(plan, state, cur) : -1;
    if (index >= 0 && index !== cur && index < plan.segments.length - 1 && !paged(plan, state.board, index)) return { index, title: v2PartOf(plan.segments[index]!).label! };
    return null;
  }
  const offers = sentences.filter((x) => asks(x) && V2_OFFER_SHAPE.test(x));
  if (!offers.length) return null;
  const text = offers.join(' ');
  const named = plan.segments.map((seg, i) => ({ seg, i })).filter(({ seg, i }) => i !== cur && i < plan.segments.length - 1 && !paged(plan, state.board, i) && !!v2PartOf(seg).label && v2PartNamedIn(seg, text));
  if (!named.length) return null;
  const theirs = said ? named.find(({ seg }) => v2PartNamedIn(seg, said)) : undefined;
  // Fix round 1 (review I2): to a choice ("…, or skip it and go to the summary?") only their naming the part or a bare yes
  // takes it up.
  if (!theirs && CHOICE.test(text) && !BARE_YES.test((said ?? '').trim())) return null;
  const at = (seg: (typeof named)[number]['seg']) => text.toLowerCase().indexOf((v2PartOf(seg).label ?? '').toLowerCase().split(/\s+/)[0]!.slice(0, 5));
  const pick = theirs ?? [...named].sort((x, y) => at(x.seg) - at(y.seg))[0]!;
  return { index: pick.i, title: v2PartOf(pick.seg).label! };
}

/** A part's name as said in a sentence ("Your job" → "your job"; a name that starts with a proper noun keeps it). */
export function v2PartNameSaid(label: string): string {
  const t = label.trim().replace(/[.:;,]+$/, '');
  return /^[A-Z][a-z]/.test(t) && !/^[A-Z][a-z]+'s\b/.test(t) ? t[0]!.toLowerCase() + t.slice(1) : t;
}

const CLOSES = [(p: string) => `Good, that's ${p} covered.`, (p: string) => `That's ${p} done.`, (p: string) => `Well done, we've finished ${p}.`, (p: string) => `Nice work on ${p}.`, (p: string) => `Okay, ${p} is done.`];
const NEXTS = [(n: string) => `Next is ${n}.`, (n: string) => `Next up is ${n}.`, (n: string) => `Next comes ${n}.`, (n: string) => `Next we have ${n}.`];
/** The asks: each says "go on" or "ready" and offers a question first (part-close.ts PART_OFFERS reads them as the ask). */
export const V2_PART_ASKS = ['Any questions first, or shall we go on?', 'Shall we move on, or is there anything you would like to ask first?', 'Do you have a question before we go on, or are you ready?', 'Ready to go on, or would you like to ask something first?', 'Shall we go on, or do you have a question first?'];

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
const replyText = (h: V2State['history'][number]) => (typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' '));
const tutorSentences = (history: V2State['history']) => history.filter((h) => h.role === 'assistant').flatMap((h) => stripBoardBlocks(replyText(h)).split(SENTENCES)).map((x) => x.trim()).filter(Boolean);

/** Whether two sentences are the same words, or one word apart (a run of Japanese: the same characters, or two apart). */
function nearSame(a: string, b: string): boolean {
  const x = norm(a); const y = norm(b);
  if (!x.length || !y.length) return false;
  if (x.length === 1 && y.length === 1) {
    const p = x[0]!; const q = y[0]!;
    if (p === q) return true;
    return p.length >= 8 && Math.abs(p.length - q.length) <= 2 && editDistance([...p], [...q]) <= 2;
  }
  return x.join(' ') === y.join(' ') || (Math.min(x.length, y.length) >= 4 && editDistance(x, y) <= 1);
}
function editDistance(a: string[], b: string[]): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j]! + 1, row[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = row;
  }
  return prev[b.length]!;
}

/** A sentence asking whether to go on to the next part: the frame (reply-gate.ts isPartFrame, English and Japanese) or an
 *  ask about moving on (PART_OFFERS) that ends as a question. */
export const v2IsPartAsk = (sentence: string) => isPartFrame(sentence) || (endsAsking(sentence) && PART_OFFERS.test(sentence));

/** Whether `sentence` is a part-change ask said before in the lesson word for word, or one word apart. Only such a repeat
 *  is dropped now that every part change is asked (a different ask, in other words, goes out). */
export function v2AskRepeats(sentence: string, history: V2State['history'], plan?: LessonPlan): boolean {
  if (!v2IsPartAsk(sentence.trim())) return false;
  // Fix round 1 (review M1): asks that name different parts are different asks ("…to conversation?" / "…to pronunciation?").
  const names = (x: string) => (plan ? plan.segments.filter((seg) => !!v2PartOf(seg).label && v2PartNamedIn(seg, x)).map((seg) => seg.id).join(',') : '');
  const mine = names(sentence);
  return tutorSentences(history).some((x) => v2IsPartAsk(x) && names(x) === mine && nearSame(x, sentence));
}

/** The line in place of a held page, or after a repeated ask that was dropped: one line on the part just done, the next part
 *  by name, and the ask, never in the words of an earlier one in the lesson. `named`: the reply already named the next
 *  part, so only the ask. `done`: the part just done (none: no closing words). */
export function v2PartAskLine(o: { next: string; done?: string; named: boolean; history: V2State['history'] }): string {
  const said = new Set(tutorSentences(o.history).map((x) => norm(x).join(' ')));
  const fresh = (x: string) => !said.has(norm(x).join(' '));
  const before = tutorSentences(o.history).filter((x) => v2IsPartAsk(x)).length;
  const pick = <T,>(xs: T[], make: (x: T) => string): string => {
    for (let k = 0; k < xs.length; k++) { const s = make(xs[(before + k) % xs.length]!); if (fresh(s)) return s; }
    return make(xs[before % xs.length]!);
  };
  const ask = pick(V2_PART_ASKS, (x) => x);
  if (o.named) return ask;
  const next = v2PartNameSaid(o.next);
  const lead = /[?？]$/.test(next) ? `Next: ${next}` : pick(NEXTS, (f) => f(next));
  const close = o.done ? pick(CLOSES, (f) => f(v2PartNameSaid(o.done!))) : '';
  return [close, lead, ask].filter(Boolean).join(' ');
}

/** Final review I5: whether a reply names a part for its ask: every word of the part's name (plan-map.ts v2PartNamedIn) in
 *  the reply's last two sentences. Half the words anywhere counted "Perfect, that is exactly right!" as naming Present
 *  perfect, "joins the past and now" as Past simple, "Good job!" as Your job, and the ask went out with no name. */
export function v2PartNamedLate(seg: LessonPlan['segments'][number], text: string): boolean {
  return v2PartNamedIn(seg, stripBoardBlocks(text).split(SENTENCES).map((x) => x.trim()).filter(Boolean).slice(-2).join(' '));
}

/** Task 7e (HELD_PART_RELEASE): the part of a page held for an ask that was asked (not unasked), not lapsed and not opened;
 *  -1: none. */
export function v2HeldPartWaiting(plan: LessonPlan, state: View & Pick<V2State, 'heldPage' | 'history'>): number {
  const h = state.heldPage;
  if (!h || h.unasked || v2TutorReplies(state.history) - h.at > V2_HELD_PAGE_REPLIES) return -1;
  const i = plan.segments.findIndex((s) => s.id === h.part);
  return i >= 0 && !paged(plan, state.board, i) ? i : -1;
}

/** Task 7c fix round 1: a page held unasked is still owed its ask: not lapsed and not opened. */
export function v2HeldPageOwed(plan: LessonPlan, state: View & Pick<V2State, 'heldPage' | 'history'>): boolean {
  const h = state.heldPage;
  if (!h?.unasked || v2TutorReplies(state.history) - h.at > V2_HELD_PAGE_REPLIES) return false;
  const i = plan.segments.findIndex((s) => s.id === h.part);
  return i >= 0 && !paged(plan, state.board, i);
}

/** The facts lines for part changes in a spoken lesson whose parts all have names (PART_ASK_EVERY). `opened`: the part whose
 *  page opened as this reply begins, on their yes. */
export function v2PartAskFacts(plan: LessonPlan, state: View & Pick<V2State, 'heldPage' | 'history'>, opened?: string): string[] {
  const lines = ['part changes: at every change to the next plan part after the level check, close the part just done in one short line that says what was done, name the next part by its plan name in the ask itself ("Next is <its name>. …"), and ask whether they have a question first or would like to go on; never in the same words as an earlier ask in this lesson. Begin the next part only after they answer: its page opens then. Not before the summary or the close: going into the summary is not asked this way'];
  if (opened) lines.push(`they said yes to going on: the "${opened}" page is open now, headed by the part's name; begin that part in this reply, and do not open its page again`);
  else if (state.heldPage?.unasked && v2HeldPageOwed(plan, state)) lines.push(`part change owed: the "${state.heldPage.title}" page is waiting, and they have not been asked yet. Answer what they said first, then, in this reply, ask in one short line whether they have a question or would like to go on to ${v2PartNameSaid(state.heldPage.title)}, naming it`);
  else if (state.heldPage && v2TutorReplies(state.history) - state.heldPage.at <= V2_HELD_PAGE_REPLIES && !paged(plan, state.board, plan.segments.findIndex((s) => s.id === state.heldPage!.part))) lines.push(`part change waiting: they were asked whether to go on to the ${state.heldPage.title} part. If they asked something, answer it first and then ask again, in one short line in new words, whether to go on`);
  return lines;
}
