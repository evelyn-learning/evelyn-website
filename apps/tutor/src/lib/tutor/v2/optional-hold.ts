/**
 * Tutor brain v2 — Task 7x (PART_FIRST_STEP): a part begins with its own first step, and an optional part that was taken is given its
 * time. Mic test 7 (embed-1795100797999, 16.3 min): on "Yes, pronunciation." the line "begin that part in this reply" led the tutor
 * straight to one word, skipping the plan's own opening question (its choice of what to practise); after two tries at that one word it
 * went to the summary with about 2 of the part's 3 minutes left, the summary page's lines being in the facts because the required parts
 * count as done once the optional part is entered.
 *
 *  - The opening question of a part (v2PartOpeningQuestion): the plan's own question for it (`problem`, or the first line of a check's
 *    `question`). The reply that opens the part on their yes asks it and waits (part-flow.ts v2PartAskFacts).
 *  - The optional part taken (v2OptionalHold): not left before V2_OPTIONAL_MIN_ITEMS items and, while it still fits before the session
 *    must end with the parts after it, before half of its own minutes on the part clock, unless the learner asked to stop or move on in
 *    it (state.optionalLeft, recorded by v2NoteOptionalLeave; fix round 1, I2: its own field, read by nothing else). While it holds, the facts carry its line and no summary-page lines.
 *
 * Facts only: no hold, no refusal, nothing of the lesson's position moves on it (the phrase reading only adds a part to optionalLeft,
 * which only lifts this line). Spoken lessons that teach a language with a labelled plan (adaptive.ts v2AdaptOn). Pure, client-safe.
 */
import type { Segment } from '../lesson-plan/types';
import { TUTOR_V2_OPTIONAL_ONE_MORE, TUTOR_V2_PART_FIRST_STEP, TUTOR_V2_PART_YES_CHOICES } from '../orchestrator/flags';
import { v2AdaptOn } from './adaptive';
import { v2PartInHand, v2PartOfPage, v2PartViewed } from './part-flow';
import { v2PartIsOptional, v2PartOf } from './plan-map';
import { V2_HOLD_SLACK_MIN, v2PracticePart } from './time-fit';
import type { V2Session, V2State } from './types';

/** Items an optional part takes at least once it was taken (the 7f practice minimum). */
export const V2_OPTIONAL_MIN_ITEMS = 2;

/** The plan's opening question of a part: its `problem`, or the first line of its `question`; null when it has none. */
export function v2PartOpeningQuestion(seg: Segment | undefined): string | null {
  if (!seg) return null;
  const x = seg as unknown as Record<string, unknown>;
  const q = typeof x.problem === 'string' ? x.problem : typeof x.question === 'string' ? x.question.split('\n')[0]! : '';
  const t = q.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, 400) : null;
}

/** Task 7z (PART_YES_CHOICES): a sentence that offers the part itself as a yes/no ("Would you like to practice your pronunciation?",
 *  "Do you want to try some?"): a question that asks whether they want it, with no "or" (an "or" makes it a choice). */
const YES_NO_OFFER = /^(?:(?:so|now|okay|ok|great|good)[,!.]?\s+)?(?:would you like|do you want|would you care|do you wish|are you ready|shall we|should we|can we|could we)\b[^?]*\?["'”’)]*$/i;
/** Task 7z (PART_YES_CHOICES): the plan's opening question split at a leading yes/no offer of the part: the offer and the choices that
 *  follow it. Null when it does not lead with such an offer, or nothing follows it. A phrase test that only informs a facts line. */
export function v2PartYesChoices(question: string): { offer: string; choices: string } | null {
  const parts = question.replace(/\s+/g, ' ').trim().split(/(?<=[.?!])\s+/).filter(Boolean);
  let k = 0;
  while (k < parts.length && YES_NO_OFFER.test(parts[k]!) && !/\bor\b/i.test(parts[k]!)) k += 1;
  if (k === 0 || k >= parts.length) return null;
  return { offer: parts.slice(0, k).join(' '), choices: parts.slice(k).join(' ') };
}

/** The line of a part opened on their yes (part-flow.ts v2PartAskFacts): its own first step from the plan, asked and waited for.
 *  Task 7z (PART_YES_CHOICES, `yesChoices`): when the question leads with a yes/no offer of the part and choices follow, they already
 *  said yes: the line gives the choices only, and the card holds them (mic test 8, embed-1795115593161, T89–T91). */
export function v2PartFirstStepLine(opened: string, question: string, yesChoices: boolean = TUTOR_V2_PART_YES_CHOICES): string {
  const split = yesChoices ? v2PartYesChoices(question) : null;
  if (split) return `they said yes to going on: the "${opened}" page is open now, headed by the part's name. They have already said yes to this part, so do not ask again whether they want it (the plan's "${split.offer}" is answered). Begin it in this reply: say in a few words that you are starting it, then give its choices from the plan: "${split.choices}". Put those choices on its question card (a <board problem> block holding the choices, not the yes/no question), and wait for their answer: no item, exercise or question of your own before it. Do not open its page again`;
  return `they said yes to going on: the "${opened}" page is open now, headed by the part's name. Begin that part in this reply with its own first step from the plan: its opening question is "${question}". Ask THAT question in this reply (after at most the short introduction the plan's note gives), in its words or close to them with every choice it offers, and wait for their answer: no item, exercise or question of your own before it. Do not open its page again`;
}

export interface V2OptionalHold { label: string; items: number; minItems: number; halfLeft: number | null }

/** Their words in the optional part ask to leave it: stop, skip, the summary, move on, enough, or a bare no (to "one more item?"). */
const LEAVE = /\b(?:move on|skip|(?:the )?summary|wrap (?:it )?up|that'?s enough|enough for (?:now|today)|stop|finish|no more)\b|次に進|スキップ|まとめ|終わり|やめ/i;
const BARE_NO = /^(?:(?:uh|um|er|hmm)[,.]?\s*)*(?:no|nope|nah)(?:[,.!]?\s*(?:thanks?|thank you|that'?s (?:ok(?:ay)?|fine|enough)))?[.!]*$|^(?:いいえ|大丈夫です|結構です)[。！!]*$/i;

/** Before the facts (mutates `state`): their words just now in the optional part in hand ask to leave it: the part is recorded in
 *  `optionalLeft` (the hold's line lifts; nothing else reads it). `stopAsked`: their words end the session. */
export function v2NoteOptionalLeave(session: V2Session, state: V2State, said: string | null | undefined, stopAsked: boolean, enabled: boolean = TUTOR_V2_PART_FIRST_STEP): void {
  if (!enabled || !said || !v2AdaptOn(session) || state.closed) return;
  const plan = session.plan!;
  if (v2PartViewed(plan, state) >= 0) return;
  const seg = plan.segments[v2PartInHand(plan, state)];
  if (!seg || !v2PartIsOptional(seg) || (state.optionalLeft ?? []).includes(seg.id)) return;
  const words = said.trim();
  if (stopAsked || LEAVE.test(words) || BARE_NO.test(words)) state.optionalLeft = [...(state.optionalLeft ?? []), seg.id].slice(-20);
}

/** The optional part taken and in hand, as the hold reads it: its name, items done, the minutes left of its first half (null: past it,
 *  or it no longer fits), and the minutes left of its own (null: not known, or it no longer fits). Null: no such part, they asked to leave
 *  it, the summary has begun. */
function optionalInHand(session: V2Session, state: V2State, nowMs: number, marginMin: number): (V2OptionalHold & { ownLeft: number | null }) | null {
  const plan = session.plan; const box = session.timeBoxMinutes;
  if (!plan || !box || !v2AdaptOn(session) || state.closed || typeof state.summaryBegunAt === 'number') return null;
  if (v2PartViewed(plan, state) >= 0) return null;
  const cur = v2PartInHand(plan, state); const seg = plan.segments[cur];
  if (!seg || cur >= plan.segments.length - 1 || !v2PartIsOptional(seg) || state.timeFit?.dropped.includes(seg.id) || state.goals[seg.id]?.status === 'skipped' || (state.optionalLeft ?? []).includes(seg.id) || (state.moveOnAsked ?? []).includes(seg.id)) return null;
  // A part of their own sentences counts them (7f); any other (pronunciation: words and read-aloud lines) counts the different items
  // carded on its page (the runtime cards each item armed, and a repeat of one is no new card).
  const items = v2PracticePart(plan, cur) ? state.practiceSaid?.[seg.id] ?? 0 : new Set(state.board.pages.filter((pg) => v2PartOfPage(plan, pg.title) === cur)
    .flatMap((pg) => pg.items.filter((it) => it.tool === 'show_sentence').map((it) => (it.core ?? it.summary).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()))).size;
  const own = v2PartOf(seg).minutes;
  let halfLeft: number | null = null; let ownLeft: number | null = null;
  if (own && state.partStart?.part === seg.id) {
    const lessonUsed = (nowMs - state.startedAtMs) / 60000;
    const usedIn = Math.max(0, (nowMs - state.partStart.at) / 60000);
    const after = plan.segments.slice(cur + 1).filter((x) => !v2PartIsOptional(x) && state.goals[x.id]?.status !== 'skipped' && !state.timeFit?.dropped.includes(x.id)).reduce((t, x) => t + (v2PartOf(x).minutes ?? 0), 0);
    const fits = lessonUsed + Math.max(0, own - usedIn) + after <= box + marginMin - V2_HOLD_SLACK_MIN + 1e-9;
    if (fits && usedIn < own / 2) halfLeft = own / 2 - usedIn;
    if (fits && usedIn < own) ownLeft = own - usedIn;
  }
  return { label: v2PartOf(seg).label ?? seg.id, items, minItems: V2_OPTIONAL_MIN_ITEMS, halfLeft, ownLeft };
}

/** The optional part taken and in hand, while it is held: its name, items done, and the minutes left of its first half (null when
 *  only the item minimum holds it). Null: no such part, it is done by both rules, they asked to leave it, the summary has begun. */
export function v2OptionalHold(session: V2Session, state: V2State, nowMs: number, marginMin: number, enabled: boolean = TUTOR_V2_PART_FIRST_STEP): V2OptionalHold | null {
  if (!enabled) return null;
  const h = optionalInHand(session, state, nowMs, marginMin);
  if (!h || (h.items >= V2_OPTIONAL_MIN_ITEMS && h.halfLeft === null)) return null;
  return { label: h.label, items: h.items, minItems: h.minItems, halfLeft: h.halfLeft };
}

/** Task 7z (OPTIONAL_ONE_MORE): the optional part taken, its hold lifted (its items and half its minutes done), with minutes of its own
 *  still left and fitting: its name and those minutes. Null otherwise (also while held: the hold's line says it). Facts only. */
export function v2OptionalOneMore(session: V2Session, state: V2State, nowMs: number, marginMin: number, enabled: boolean = TUTOR_V2_OPTIONAL_ONE_MORE && TUTOR_V2_PART_FIRST_STEP): { label: string; left: number } | null {
  if (!enabled) return null;
  const h = optionalInHand(session, state, nowMs, marginMin);
  if (!h || h.items < V2_OPTIONAL_MIN_ITEMS || h.halfLeft !== null || h.ownLeft === null) return null;
  return { label: h.label, left: h.ownLeft };
}

/** Task 7z (OPTIONAL_ONE_MORE): the time line's addition then. */
export function v2OptionalOneMoreLine(o: { label: string; left: number }): string {
  return `the optional ${o.label} part has had its items and still has about ${Math.max(1, Math.round(o.left))} minute${Math.round(o.left) > 1 ? 's' : ''} of its own: after the result of an item, ask whether they would like one more or to move on, and leave it only after their answer (at once if they ask to stop or move on)`;
}

/** The time line's addition while the optional part is held. */
export function v2OptionalHoldLine(h: V2OptionalHold): string {
  const why = [h.items < h.minItems ? `${h.items} of at least ${h.minItems} items done` : '', h.halfLeft !== null ? `about ${Math.max(1, Math.round(h.halfLeft))} more minute${Math.round(h.halfLeft) > 1 ? 's' : ''} of its time before it may close` : ''].filter(Boolean).join('; ');
  return `the optional ${h.label} part was taken and is not done (${why}): stay with it. ${h.items < h.minItems ? 'After a result, go on to a new item' : 'After a result, ask whether they want one more item or the summary, and on "one more" give a new item'}. No summary page yet; leave it sooner only if they ask to stop, skip or move on`;
}
