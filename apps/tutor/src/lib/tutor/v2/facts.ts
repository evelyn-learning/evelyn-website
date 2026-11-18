/**
 * Tutor brain v2 — the facts block (design §4.2).
 *
 * The one thing the runtime adds to a turn. Facts only: nothing in here tells
 * the model what to do.
 */
import { renderBoard } from './board';
import { stripBoardBlocks } from './board-inline';
import { TUTOR_V2_CLOSE_ONE_QUESTION, TUTOR_V2_OPENER_FACT, TUTOR_V2_PART_ASK_EVERY, TUTOR_V2_PART_OFFER_ONCE } from '../orchestrator/flags';
import { v2PartAskFacts, v2PlanLabelled } from './part-flow';
import { v2FrameDue } from './part-close';
import { v2HomeworkFacts, v2HomeworkGuardFacts, v2SheetFacts } from './homework-facts';
import { renderGoalStatus, v2PartOfferFacts, v2PassedPartFact, v2UnreachedAtCloseFact } from './plan-map';
import type { V2Session, V2State } from './types';
import { discussionOf, effectiveMinutes, lastReplyNotes, renderThinking } from './discussion';
import { v2WorkingLevelFacts } from './working-level';
import { v2PronunciationFacts, v2TextSoundFacts } from './pronunciation';
import { v2SentenceCardsFacts } from './sentence-cards';
import { v2CardsOwedFacts, v2LearnerSentenceFacts } from './learner-card';
import { v2PracticeAskFacts, v2RetryFacts } from './languages';
import { V2_TIME_UP_MIN, v2CloseOpen, v2PlanContentDone, v2LeftToStopMin, v2LessonTimeLine, v2PartDueFact, v2TimeFlags, v2WrapDue, type V2TimeFlags } from './time-box';
import { v2MorePracticeFacts, v2PracticeFacts, v2StayInPartLine, v2TimeFitFacts } from './time-fit';
import { TUTOR_V2_PRACTICE_ON_PART_PAGE, TUTOR_V2_STAY_IN_PART } from '../orchestrator/flags';
import { v2CloseInviteFacts, v2CloseReopened, v2MoreAskAnswered } from './close-invite';

/** After the tutor chose to keep listening: how long the student stays silent before it is told so (TutorVoiceV2).
 *  At that point silence is no longer open to it: it kept listening twice and the student sat with a blank
 *  indicator for a minute (biology, embed-1794452229126). */
export const V2_WAITED_RECHECK_S = 5;
/** The early silence check after a spoken reply that asked nothing (TutorVoiceV2). Short: a tutor who has
 *  explained something and stopped leaves the student to say "got it" before the lesson moves (AP CS A,
 *  embed-1794440489707; it was 6 s, and the student spoke first). */
export const V2_NO_ASK_RECHECK_S = 2;
/** Minutes left at or below which the time is up (time-box.ts). */
export { V2_TIME_UP_MIN };

export interface V2TurnFacts {
  nowMs: number;
  /** The result of an answer check, when the runtime ran one. */
  answerCheck?: string;
  /** Seconds the student was silent before this turn, when that is why the turn exists. */
  silenceSeconds?: number;
  /** The page was reloaded and the session has just been picked up again (resume.ts). */
  resumed?: boolean;
  /** A draft of this reply was held back, and why (homework-turn.ts). */
  notSent?: string;
  /** What the person has just said, for the notes on how the last reply landed. */
  heard?: string | null;
  /** Their words just now end the session (stop-signal.ts). */
  stopAsked?: boolean;
  /** Their words just now said the level remembered from an earlier lesson does not fit (working-level.ts v2ReopenLevelCheck). */
  levelReopened?: boolean;
  /** Task 7a: the page of this part opened as this reply begins, on the student's yes (part-flow.ts). */
  partOpened?: string;
  /** Task 7a fix round 1, tests only: PART_ASK_EVERY for this turn (default: the flag). */
  partAskEvery?: boolean;
  /** Task 7b, tests only: BOARD_LEARNER_SENTENCE for this turn (default: the flag). */
  learnerCards?: boolean;
  /** Task 7f: the time switches for this turn (default: the flags; turn.ts passes the turn's own). */
  time?: Partial<V2TimeFlags>;
  /** Task 7f C: the practice part in hand is short of its sentences (turn.ts, v2PracticeShort under the part flow). */
  practiceShort?: { index: number; n: number } | null;
  /** Task 7f E: they asked for more practice at the close: given (true) or no time left (false). */
  morePractice?: boolean;
  /** Task 7i (OPTIONAL_AT_ARRIVAL), fix round 1: their words name an optional part left out for time: its name, its minutes, the
   *  minutes left before the session must end, and whether it fits in them. Facts only (permissive): nothing changes on it. */
  droppedAsked?: { label: string; minutes: number; left: number; fits: boolean };
  /** Task 7k (PRACTICE_ON_PART_PAGE): the page in view is another part's page for practice they asked for (turn.ts):
   *  that part's name, the page's heading, the heading of the position's page to return to, and whether the runtime turned
   *  the board to it as this reply begins. */
  partVisit?: { label: string; title: string; back: string; opened: boolean };
  /** Task 7k (CLOSE_REOPENED): after the invitation, their words look like a request for more practice or another part; the
   *  close is reopened after the reply if it does not end the lesson (turn.ts). */
  reopenAsked?: boolean;
  /** Task 7k fix round 1 (I1, ruling b): before the close, their words asked for practice of a part that comes later: its name.
   *  Facts only: nothing opens for it. */
  partAhead?: string;
}

/** A quoted span at the very start of a reply, in any of the quote pairs a tutor uses: 「…」, 『…』, “…”, "…", ‘…’, '…'. */
// A straight or curly single quote closes only where no letter follows: "'Cause it's late" is not a quote.
const LEADING_QUOTE = /^(?:「[^」]*」|『[^』]*』|“[^”]*”|"[^"]*"|‘[^’]*’(?!\p{L})|'[^']*'(?!\p{L}))/u;
/** Up to four words of `text`, up to its first mark. A run of Japanese has no spaces, so a word is cut at 16 characters. */
const headWords = (text: string) => text.split(/[.,:;!?。、！？\n]/)[0]!.trim().split(/\s+/).filter(Boolean).slice(0, 4).map((w) => w.slice(0, 16)).join(' ');

/** A reply's text, without board blocks and without the system's cut-off marker. */
function replyText(h: V2State['history'][number]): string {
  // A reply cut short carries "[cut off here: …]" (interrupted.ts); that marker is the system's, not the tutor's words,
  // and a reply cut before any word got out has no opener at all (final review M4: the fact quoted "[cut off here").
  return stripBoardBlocks(typeof h.content === 'string' ? h.content : h.content.map((c) => (c.type === 'text' ? c.text : '')).join(' ')).replace(/\[cut off[^\]]*\]/gi, ' ').trim();
}

/** How a reply opened: its words up to the first mark, at most four (D10). A reply that opens on a quote of the student
 *  opens on a frame around it: the quote stands as 「…」 and the words after it are the opener (Task 6c, ruling 4:
 *  「I make cars.」は正しい文です opened 14 of 17 replies in gdi-real-james 4.9–8.7 min, and the fact named the quote,
 *  which differed every time, so the repeat went unseen). */
export function v2OpenerOf(text: string): string {
  const q = text.match(LEADING_QUOTE);
  if (!q) return headWords(text);
  const frame = `${q[0][0]}…${q[0][q[0].length - 1]}`;
  // Marks straight after the quote belong to the frame: 「…」。は… and a bare 「…」。 were missed (fix round 1).
  const after = text.slice(q[0].length);
  const marks = (after.match(/^[\s.,:;!?。、！？]*/)?.[0] ?? '');
  const words = headWords(after.slice(marks.length));
  const glue = marks.replace(/\s+/g, '');
  return `${frame}${glue}${words ? `${/\s$/.test(marks) || (!glue && /^\s/.test(after)) ? ' ' : ''}${words}` : ''}`;
}

const tutorReplies = (history: V2State['history']) => history.filter((h) => h.role === 'assistant' && (typeof h.content === 'string' || h.content.some((c) => c.type === 'text' && c.text.trim())));

/** How the tutor's last reply opened (v2OpenerOf). */
export function v2LastOpener(history: V2State['history']): string {
  const m = tutorReplies(history).pop();
  return m ? v2OpenerOf(replyText(m)) : '';
}

/** The facts line naming the last reply's opening words (D10: "Yes, that's right." opened 50–70% of replies; told in
 *  the constitution, the model moved to "Correct." instead, review I2). When the replies before it opened the same way,
 *  it says how many did, and that a reply reacts to what the student said (Task 6c, ruling 4). Not in a discussion,
 *  which has its own line. */
export function v2OpenerFact(session: V2Session, state: V2State, enabled: boolean = TUTOR_V2_OPENER_FACT): string[] {
  if (!enabled || discussionOf(session.plan)) return [];
  const openers = tutorReplies(state.history).map((m) => v2OpenerOf(replyText(m)));
  const opener = openers[openers.length - 1] ?? '';
  if (!opener) return [];
  let run = 1;
  for (let i = openers.length - 2; i >= 0 && openers[i] === opener; i--) run += 1;
  if (run < 2) return [`your last reply opened with "${opener}": open this one differently, or go straight to the content`];
  return [`your last ${run} replies opened with "${opener}": open this one differently. React to what they said and keep the conversation moving; a confirmation only when they were practising the form being taught, and then in other words`];
}

/** The facts line when the part-change ask is not due (part-close.ts v2FrameDue): the next part change names what comes
 *  next and begins it in the same reply. The tutor wrote the frame itself as often as the runtime did ("Are you ready for
 *  that, or do you have a question first?"); told only to drop the question half, it kept asking at every change (Task
 *  6e fix round 1, F1: five times for tester B). `enabled` is the kill switch. */
export function v2QuestionCheckFact(state: V2State, enabled: boolean = TUTOR_V2_PART_OFFER_ONCE): string[] {
  return enabled && !v2FrameDue(state.history) ? ['part changes: the ask whether to go on (or whether they have a question first) is not due at the next one: when this part is done, say so, name what comes next and begin it in the same reply'] : [];
}

/** Task 7a (PART_ASK_EVERY): a spoken teaching lesson (not homework, not a discussion) whose plan parts all have names: every
 *  part change is asked. `enabled` is the kill switch. */
export function v2AskEveryOn(session: V2Session, enabled: boolean = TUTOR_V2_PART_ASK_EVERY): boolean {
  return enabled && session.mode === 'voice' && !session.homework && !session.homeworkSheet && !discussionOf(session.plan) && v2PlanLabelled(session.plan);
}

/** Task 6g (CLOSE_ONE_QUESTION): a reply of this lesson has begun its summary (turn.ts sets summaryBegunAt). */
export function v2SummaryBegun(state: V2State, enabled: boolean = TUTOR_V2_CLOSE_ONE_QUESTION): boolean {
  return enabled && typeof state.summaryBegunAt === 'number' && !state.closed;
}

export function renderFacts(session: V2Session, state: V2State, f: V2TurnFacts): string {
  const usedMin = Math.max(0, Math.round((f.nowMs - state.startedAtMs) / 60000));
  const discussion = !!discussionOf(session.plan);
  // A discussion runs to the time the person said they have, when that is shorter (replay round 6: "about eight
  // minutes" ran to 10.4).
  const box = discussion ? effectiveMinutes(session.timeBoxMinutes, state.thinking) : session.timeBoxMinutes;
  const left = box ? box - (f.nowMs - state.startedAtMs) / 60000 : 0;
  // Task 7f: the time switches; "the time is up" at the box plus the margin for a taught lesson (F); the close by content (D).
  const tf = v2TimeFlags(f.time);
  const leftStop = discussion ? left : v2LeftToStopMin(session, state, f.nowMs, tf.overrun);
  const closeOpen = !discussion && !!session.timeBoxMinutes && v2CloseOpen(session, state, f.nowMs, tf.closeByContent);
  // Task 6g: the summary has begun (turn.ts): "time for more" no longer stands (gdi-real-james, v2audio-6f: the review began,
  // and the next two replies offered more practice).
  const summaryBegun = v2SummaryBegun(state);
  // Task 7f E (fix round 4): their words look like a request for more practice and there is time for it: this turn's facts
  // allow it, and carry no line that presses toward the close (the summary-begun line, the time line's close, "end the lesson
  // in this reply"). Nothing is enforced: the model decides from what the learner means.
  const morePracticeAllowed = !discussion && f.morePractice === true;
  // Task 7k (CLOSE_REOPENED): the close was reopened and no ask given since: nothing presses toward the close.
  const reopened = !discussion && v2CloseReopened(state);
  // Fix round 1 (I2): this turn answers the ask "more, or finish?" (close-invite.ts): no goodbye pressed either.
  const moreAsked = !discussion && v2MoreAskAnswered(state);
  // Task 7i (STAY_IN_PART): ahead of the plan in a required practice part, the time line says to go on with it. Not once the
  // close is open, the summary has begun, or more practice was asked for at the close.
  const stay = !discussion && !session.homework && !session.homeworkSheet && !closeOpen && !summaryBegun && !morePracticeAllowed ? v2StayInPartLine(session, state, f.nowMs) : null;
  const lines = [
    // A discussion runs 8–12 minutes and may close early once the person has chosen where to go next: the teaching
    // line's "time for more, not at its close" would hold it open.
    discussion ? `time: ${usedMin} min used${box ? ` of about ${box}${box !== session.timeBoxMinutes ? ' (the time they said they have)' : ''}; ${left > box * 0.4 ? `about ${Math.round(left)} left: plenty of time, not yet time to reflect or close unless they ask` : left > 4 ? `about ${Math.round(left)} left` : left > V2_TIME_UP_MIN ? `about ${Math.round(left)} left: time to reflect and choose a direction` : 'the time is up'}` : ''}` :
    // What is left, said outright: with only "22 used of 30" the tutor said goodbye, was refused the close, and
    // took the goodbye back in the same breath (embed-1794593747478, embed-1794595194384).
    // Homework: a solved problem does not go on spending the student's minutes.
    session.homework || session.homeworkSheet
      ? `time: ${usedMin} min used${session.timeBoxMinutes ? ` of about ${session.timeBoxMinutes}; ${left > V2_TIME_UP_MIN ? `about ${Math.round(left)} left` : 'the time is up'}` : ''}; the session ends when ${session.homeworkSheet ? 'the sheet' : 'this problem'} is done`
      // Past the host's wrap minute the wrap is said here, a fact for the next reply: spoken into the lesson by the client
      // on v1, it cut into the menu the tutor was reading (tester-2, time-box.ts).
      // Task 7f E (fix round 4): in a turn whose facts allow more practice, the time line carries no "then summary" or
      // "the close is near": only what is left before the session must end.
      : `time: ${usedMin} min used${session.timeBoxMinutes ? ` of about ${session.timeBoxMinutes}; ${morePracticeAllowed ? `about ${Math.max(1, Math.floor(leftStop))} minutes before the session must end` : v2LessonTimeLine(session, state, f.nowMs, { summaryBegun, closeOpen, tf })}` : ''}${stay ? `; ${stay}` : ''}`,
    `board:\n  ${renderBoard(state.board)}`,
  ];
  if ((state.repliesSinceBoard ?? 0) >= 1) lines.push(`board last written on: ${state.repliesSinceBoard} ${state.repliesSinceBoard === 1 ? 'reply' : 'replies'} ago`);
  if (state.boardProblems?.length) lines.push(`not painted in your last reply:\n${state.boardProblems.map((x) => `  - ${x}`).join('\n')}`);
  if (session.homework) lines.push(...v2HomeworkFacts(session.homework, state.homework));
  else if (session.homeworkSheet) lines.push(...v2SheetFacts(session.homeworkSheet, state.homework?.sheet));
  if (session.homework || session.homeworkSheet) lines.push(...v2HomeworkGuardFacts(state.homework));
  else if (session.plan) {
    lines.push(`plan: ${renderGoalStatus(session.plan, state.goals)}`);
    // A part the lesson went past is offered before the summary; not when the close comes first (plan-map.ts, Task 6c).
    const closing = !!f.stopAsked || (!!session.timeBoxMinutes && leftStop <= V2_TIME_UP_MIN) || v2WrapDue(session, (f.nowMs - state.startedAtMs) / 60000, undefined, tf.closeByContent);
    const passed = discussion ? [] : v2PassedPartFact(session.plan, state, closing);
    lines.push(...passed);
    // Near or at the close, a part not reached is offered in one line or named in the summary as next time (Task 6e);
    // not beside the passed-part line, which already says to offer it.
    // Task 7f D: near the close = the close is open (content done or the wrap minute), not the box's last fifth.
    // The required parts done is near too: an optional part not reached is then offered before the summary.
    const near = tf.closeByContent ? closeOpen || (!!session.timeBoxMinutes && v2PlanContentDone(session.plan, state, true)) : !!session.timeBoxMinutes && left <= session.timeBoxMinutes * 0.2;
    if (!discussion && !passed.length) lines.push(...v2UnreachedAtCloseFact(session.plan, state, closing || summaryBegun ? 'closing' : near ? 'near' : null));
    // Task 6g: an optional part offered and not taken up is offered at most once more (tester A: four offers in nine turns).
    if (!discussion) lines.push(...v2PartOfferFacts(session.plan, state));
    if (!discussion && summaryBegun && !morePracticeAllowed && !reopened && !moreAsked && !f.partVisit) lines.push('the summary has begun: from here, no new practice, exercise or offer of more practice unless they ask for it. Answer what they say and bring the lesson to its close');
    // Task 6e fix round 1 (F4): tester B was asked about a question or the summary in two turns running.
    if (!discussion && TUTOR_V2_CLOSE_ONE_QUESTION && (closing || near) && !state.closed) lines.push('at the close: at most one question in a reply, never one you asked in your last reply, and nothing after a goodbye');
    // Task 7d (CLOSE_INVITES_QUESTIONS): the summary reply ends by inviting their questions, and the lesson ends on their answer.
    if (!discussion && !(morePracticeAllowed && typeof state.closeInvitedAt === 'number')) lines.push(...v2CloseInviteFacts(session, state, { nowMs: f.nowMs, stopAsked: !!f.stopAsked, closeByContent: tf.closeByContent, overrun: tf.overrun }));
    // Task 7f B: the parts left out for time; C: the practice the part in hand still needs; E: more practice asked for at the close.
    if (!discussion) lines.push(...v2TimeFitFacts(session, state, tf.noSqueeze, f.nowMs));
    // Task 7i (OPTIONAL_AT_ARRIVAL), fix round 1: their words name a part left out for time. Permissive: the model reads their meaning.
    if (!discussion && f.droppedAsked) { const d = f.droppedAsked; const left = Math.max(0, Math.floor(d.left)); lines.push(d.fits
      ? `they mentioned the ${d.label} part, left out for time. If they are asking to do it now: there are about ${left} minutes before the session must end and it takes about ${d.minutes}, so you may take it up now (its page first), keeping the summary short; if they mean something else (a refusal, next time, a remark about it), it stays for next time`
      : `they mentioned the ${d.label} part, left out for time. There are about ${left} minutes before the session must end, not enough for it (about ${d.minutes}): if they are asking for it, say so plainly in one short sentence; it stays for next time`); }
    if (!discussion && f.practiceShort && session.plan) lines.push(...v2PracticeFacts(session.plan, f.practiceShort));
    if (!discussion && f.morePractice !== undefined) lines.push(...v2MorePracticeFacts(f.morePractice, leftStop, reopened || !!f.reopenAsked));
    // Task 7k (PRACTICE_ON_PART_PAGE): practice of another part runs on that part's page, and the board returns after it.
    if (!discussion && f.partVisit) { const v = f.partVisit; lines.push(`practice on another part's page: ${v.opened ? `they asked for practice of the ${v.label} part, and the board has turned to its page "${v.title}" as this reply begins` : `the board shows the "${v.title}" page (the ${v.label} part) for practice they asked for`}. This practice's cards go on this page. When that practice is over, turn back to the "${v.back}" page with its page block before you go on; until then stay on this page`); }
    else if (!discussion && f.partAhead) lines.push(`they asked to practise the ${f.partAhead} part, which comes later in the lesson: say so briefly, or help with it in place on this page, and go on with the part in hand (no page for it now)`);
    else if (!discussion && TUTOR_V2_PRACTICE_ON_PART_PAGE && f.morePractice === true && v2PlanLabelled(session.plan)) lines.push('if the practice they ask for is of one of the lesson\'s parts other than the page in view, write that part\'s page block first (a page it already has turns back to it), so its cards go on its page; when it is over, turn back to the page in view now');
  }
  // Where the parts' minutes put the lesson now, so it paces itself to the box (time-box.ts).
  const partDue = v2PartDueFact(session, state, f.nowMs, !!session.timeBoxMinutes && leftStop <= V2_TIME_UP_MIN, undefined, tf.noSqueeze);
  if (partDue) lines.push(partDue);
  // The working level, every turn, so the language, questions and corrections stay at it (working-level.ts).
  lines.push(...v2WorkingLevelFacts(session, state, f.heard, { reopened: f.levelReopened }));
  // A measured score, or that there is none: the only ground for a word on how they sounded (pronunciation.ts).
  lines.push(...v2PronunciationFacts(session, state, f.heard));
  // A typed language lesson: nothing is heard, so nothing is said about how it sounded (pronunciation.ts).
  lines.push(...v2TextSoundFacts(session));
  // Tries at one sentence, counted: at the second the correct sentence comes next (languages.ts).
  if (!session.homework && !session.homeworkSheet && !discussion) lines.push(...v2RetryFacts(session.languages, state.history, f.heard));
  // Asks for one practice sentence, counted; a bare yes is no try (Task 6e fix round 1, F2).
  if (!session.homework && !session.homeworkSheet && !discussion) lines.push(...v2PracticeAskFacts(session.languages, state.history, f.heard));
  // The learner's corrected sentences, for the summary's sentence cards (sentence-cards.ts).
  lines.push(...v2SentenceCardsFacts(session, state));
  // Task 7b (BOARD_LEARNER_SENTENCE): their words just now were a sentence: it goes on the board as it should be (learner-card.ts).
  if (!summaryBegun || f.partVisit) lines.push(...v2LearnerSentenceFacts(session, state, f.heard, f.learnerCards));
  // Task 7g (CARD_EVERY_SENTENCE): sentences of their last answer the last reply left off the board.
  if ((!summaryBegun || f.partVisit) && !state.closed) lines.push(...v2CardsOwedFacts(state));
  // How the last reply opened, so the next does not open the same way (D10).
  lines.push(...v2OpenerFact(session, state));
  // The question check at a part change, once in a while (Task 6e); at every part change in a spoken lesson whose plan parts
  // all have names (Task 7a, PART_ASK_EVERY).
  if (session.plan && !discussion && v2AskEveryOn(session, f.partAskEvery)) lines.push(...v2PartAskFacts(session.plan, state, f.partOpened));
  else if (session.plan && !discussion) lines.push(...v2QuestionCheckFact(state));
  lines.push(`your note: ${state.note.trim() || '(empty — nothing written yet)'}`);
  const thinking = discussion ? renderThinking(state.thinking) : '';
  if (thinking) lines.push(thinking);
  const lastNotes = discussion ? lastReplyNotes(state.history, session.mode === 'voice', f.heard) : [];
  if (lastNotes.length) lines.push(`your last reply: ${lastNotes.join('; ')}`);
  // Said once in the prompt, the length and the opener drift back within a few turns (live test 2, 2026-11-15: replies of
  // 55–75 words, asked to repeat twice); a line in every turn's facts holds them.
  if (discussion && session.mode === 'voice' && state.history.length) lines.push('this reply is heard, not read: one idea in under 40 words (longer only to tell a case), opening on substance, never on "That\'s" or a word about what they said');
  if (state.gaps?.length) {
    const label: Record<string, string> = { found: 'found, not yet worked on', explained: 'explained to them, not yet done by them', done_with_help: 'they did one with help, not yet alone', done_alone: 'they did one alone' };
    lines.push(`gaps you have recorded:\n${state.gaps.map((g) => `  - ${g.what}: ${label[g.status] ?? g.status}`).join('\n')}`);
  }
  // Task 7i (STAY_IN_PART): sentences of the last reply they did not hear (a barge-in cut them, interrupted.ts trimToSpoken).
  if (TUTOR_V2_STAY_IN_PART && !discussion && state.unheard?.length && !state.closed) lines.push(`not heard: they spoke over your last reply, and these sentences of it did not reach them: ${state.unheard.map((x) => `"${x}"`).join(' ')}. If it still fits after what they said, say again what they need of it (a question they did not hear is asked again)`);
  if (f.stopAsked) lines.push('the student\'s words just now asked to end the session');
  if (f.answerCheck) lines.push(`answer check: ${f.answerCheck}`);
  if (f.notSent) lines.push(`your first draft of this reply was not sent (the student never saw it: do not mention it): ${f.notSent}`);
  if (f.silenceSeconds) lines.push(Math.round(f.silenceSeconds) === V2_NO_ASK_RECHECK_S
    ? `your last reply has finished and it ended on a statement: no question, and nothing for them to do. They are waiting for you to go on`
    : Math.round(f.silenceSeconds) === V2_WAITED_RECHECK_S
    ? `you kept listening after the student's last words, and they have said nothing more for ${V2_WAITED_RECHECK_S} seconds: they had finished. Take what they said as their answer and reply to it now`
    : `the student has said nothing for ${Math.round(f.silenceSeconds)} seconds`);
  return `<facts>\n${lines.join('\n')}\n</facts>`;
}
