/**
 * Tutor brain v2 — shared types (docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md).
 *
 * v2 is a second turn path beside the v1 brain (voice/claude-brain.ts). The
 * runtime here holds facts and tools; the model decides what to say and do.
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { LessonPlan } from '../lesson-plan/types';
import type { WorkingLevel } from '../level/working-level';
import type { V2PronunciationState } from './pronunciation';

export type GoalStatus = 'not_started' | 'shown' | 'demonstrated' | 'skipped';

/** How far a gap in the student's knowledge has been worked on. */
export type GapStatus = 'found' | 'explained' | 'done_with_help' | 'done_alone';
export interface V2Gap { what: string; status: GapStatus }

/** What does not change during a session. */
export interface V2Session {
  studentName?: string;
  subject: string;
  /** What the lesson is about, in a few words (the plan's topic and title). Chooses the figure tools (tools.ts). */
  topic?: string;
  level: string;
  mode: 'text' | 'voice';
  /** The session's teaching languages, the lesson's own first (`['en', 'ja']`). A second one brings in the
   *  bilingual section of the session part (languages.ts). Absent: one language. */
  languages?: string[];
  /** Minutes the session is meant to last, when there is a box. */
  timeBoxMinutes?: number;
  /** The minute the host's wrap starts, two before the box (partner-pool.ts `poolTimeBox`, the embed page's
   *  `wrap_at_minutes`): from it the facts say to finish the exchange and summarise (time-box.ts). */
  wrapMinutes?: number;
  plan?: LessonPlan;
  /** The teacher the tutor speaks as, when the session names one. `intro` and `background`: the persona's own words on
   *  who it is (TeacherPersonaWire); with a background they are the tutor's persona card (turn.ts v2PersonaCardLines). */
  teacher?: { name: string; nameIsRole?: boolean; style?: string; intro?: string; background?: string };
  /** What the partner's portal knows about the student, one plain fact per line (background.ts). */
  background?: string[];
  /** A free trial or demo lesson: the student may change the topic or the subject. */
  trial?: boolean;
  /** The partner's trials keep the lesson plan (partner-session-options.ts `trialKeepsPlan`): a trial may not
   *  leave it. */
  trialKeepsPlan?: boolean;
  /** The partner's lessons find the learner's working level once and remember it (partner-session-options.ts
   *  `levelCheck`, under TUTOR_WORKING_LEVEL): the `set_working_level` tool and the level in the facts (working-level.ts). */
  levelCheck?: boolean;
  /** The partner's spoken lessons measure pronunciation (partner-session-options.ts `pronunciation`, under
   *  TUTOR_PRONUNCIATION_ASSESS): the `practise_pronunciation` tool and the score in the facts (pronunciation.ts). */
  pronunciation?: boolean;
  /** Homework mode (homework.ts): the session works the student's own homework. Never holds the answer key. */
  homework?: V2HomeworkProblem;
  /** Whole-sheet homework (homework.ts): every problem of the sheet, worked in any order. Never holds a key. */
  homeworkSheet?: V2HomeworkSheet;
}

/** A homework sheet as the tutor may see it: each problem, whether it has a checked key, and its parts' labels. */
export interface V2HomeworkSheet {
  problems: Array<{ n: number; text: string; verified: boolean; parts?: string[]; expected?: string }>;
  noReveal?: boolean;
}

/** One problem of the student's homework sheet, as the tutor may see it: the key stays on the server (homework.ts). */
export interface V2HomeworkProblem {
  text: string;
  /** The problem has a checked answer key; each answer is checked against it and the result is a fact. */
  verified: boolean;
  /** The problem's figure is already on the student's screen beside the chat. */
  hasFigure: boolean;
  /** What happened last time on this problem. */
  priorNote?: string;
  /** Marks an earlier session of this problem confirmed (keyed-verdict.ts). */
  priorConfirmed?: string[];
  /** The labels of the key's parts, to say which are still open. */
  parts?: string[];
  /** The checked final answers, for the tutor to judge by and never to state (Praveen 2026-11-14: as v1 had them). */
  expected?: string;
  /** One checked route to them, step by step, when the key has one. */
  solutionPath?: string[];
  /** The partner's no-reveal rule (no-reveal-ledger-gate.ts): a reply that states a final answer is not sent. */
  noReveal?: boolean;
}

/** Homework mode's record (homework.ts). Optional: other sessions have none. */
export interface V2HomeworkState {
  /** Marks confirmed correct so far, earlier sessions' included (`part:<l>`, `value:<l>=<name>`). */
  confirmed: string[];
  /** Every part of the problem is confirmed correct. */
  done?: boolean;
  /** The history length when the problem was completed: the reply of that turn does not end the session. */
  doneAt?: number;
  /** Whole-sheet homework: the problem in play, the history index its messages start at, the problems solved
   *  (by number) and the marks confirmed on each. */
  sheet?: { current: number; since: number; solved: number[]; confirmed: Record<string, string[]> };
  /** Parts confirmed from a bare guess, with no working (homework-guards.ts check 4): a recap never credits how.
   *  Whole-sheet labels carry their problem ("3:b"). */
  guessed?: Array<{ label: string; value: string }>;
  /** Results the tutor worked out, privately, for the student's own questions (note_own_answer): withheld
   *  like the key until the student writes them (check 3). */
  own?: Array<{ q: string; a: string }>;
}

export interface V2BoardItem { id: string; tool: string; summary: string; /** The content alone, normalised, for spotting repeats (board.ts). */ core?: string; /** A graph keeps what it plots, so a later graph on the same page can be drawn as one picture with it (turn.ts). */ args?: Record<string, unknown> }
export interface V2BoardPage { title: string; items: V2BoardItem[] }
export interface V2Board { pages: V2BoardPage[]; current: number }

/** What a board tool call did. Goes back to the model as the tool result and stays in the history. */
export interface V2BoardOutcome { painted: boolean; detail: string; /** The item already on the page in view that this call repeats. */ pointAt?: string }

/** Everything that changes during a session. The model's own note is the only lesson memory beside the history. */
export interface V2State {
  history: Anthropic.MessageParam[];
  note: string;
  /** `at`: when the goal was last marked, so the part in hand can be told from one left open earlier (progress.ts). */
  goals: Record<string, { status: GoalStatus; why?: string; at?: number }>;
  /** Gaps the tutor has found in what the student knows, with how far each has been worked on. Optional: older states have none. */
  gaps?: V2Gap[];
  board: V2Board;
  /** How many of the tutor's replies in a row have painted nothing on the board. Optional: older states have none. */
  repliesSinceBoard?: number;
  /** Board blocks of the last reply that were not painted, and why. Shown once in the next turn's facts. */
  boardProblems?: string[];
  /** Discussion sessions (discussion.ts): the person's position, what they have weighed, and how it has moved. */
  thinking?: {
    position: string; weighed: string[]; shifts: string[];
    /** A student or experience of their own they brought in; the conversation works from it. */
    example?: string;
    /** How many complications the tutor has brought in (a rare move: two or three a conversation). */
    complications?: number;
    /** The time they said they have, in minutes, when they said so. The clock runs to it. */
    theirMinutes?: number;
    /** The tutor's last reply brought in a complication (cleared each turn): never two in a row. */
    justComplicated?: boolean;
    /** The direction they named, once they have. */
    direction?: string;
  };
  /** Discussion sessions: the direction the person chose to explore next, given with end_lesson. */
  nextDirection?: string;
  startedAtMs: number;
  closed: boolean;
  closeSummary?: string;
  homework?: V2HomeworkState;
  /** Level-check sessions (working-level.ts): the learner's working level, remembered from an earlier lesson or
   *  set in this one. Optional: other sessions have none. */
  workingLevel?: V2WorkingLevel;
  /** Pronunciation sessions (pronunciation.ts): the armed reply, its score once in, and what it asked for. */
  pronunciation?: V2PronunciationState;
  /** Sentence-card sessions (sentence-cards.ts): the learner's sentences as the tutor's cards corrected them, the most
   *  recent last. Listed in the facts for the summary. */
  correctedSentences?: string[];
  /** Spoken lessons with a plan (turn.ts, Task 6g): when a reply began the lesson's summary (its closing page opened, or
   *  its words said the summary had begun). From then on no new practice is asked for or offered. Optional: older states
   *  and other sessions have none. */
  summaryBegunAt?: number;
  /** Task 7a (PART_PAGE_CHIP), spoken lessons whose plan parts all have names: the page of the next part, held while the
   *  student is asked whether to go on (`title`: the part's name; `part`: its goal id; `at`: the tutor replies in the
   *  history when it was held). It opens on their yes, whether or not the reply writes it again. Task 7c fix round 1
   *  (`unasked`): held at a reply that already asked something else, so not yet asked about: no yes opens it; the next
   *  reply asks (the facts say so, and the runtime asks when that reply asks nothing). */
  heldPage?: { title: string; part: string; at: number; unasked?: true };
  /** Task 7d (CLOSE_INVITES_QUESTIONS), spoken plan-led second-language lessons: when the learner was invited to ask
   *  questions before the close (close-invite.ts). From then on the close is never refused for the invitation. */
  closeInvitedAt?: number;
  /** Task 7f B (TIME_NO_SQUEEZE), timed plan-led lessons: the plan parts left out for time (optional parts, last first, until
   *  the rest fits the box), decided once when the first teaching part opens; `told` once a reply has named them to the
   *  learner (or the facts have asked twice); `shown`: the turns the facts asked. Carried to the next session (memory.ts). */
  timeFit?: { dropped: string[]; told?: true; shown?: number };
  /** Task 7f C (PART_MIN_PRACTICE), spoken labelled-plan lessons: practice sentences of their own the learner has said, per
   *  plan part id. */
  practiceSaid?: Record<string, number>;
  /** Task 7f C: the parts in which the learner asked to move on (their part closes without the practice count). */
  moveOnAsked?: string[];
  /** Task 7g (CARD_EVERY_SENTENCE), spoken two-language lessons: the sentences of the learner's last practice answer that the
   *  last reply put on no sentence card. Shown once in the next turn's facts. */
  cardsOwed?: string[];
}

/** A working level and where it came from: an earlier lesson (may be revised once, case 11) or this lesson (final). */
export interface V2WorkingLevel { level: WorkingLevel; from: 'earlier_lesson' | 'this_lesson' }

export interface V2ToolCall {
  id: string; name: string; args: Record<string, unknown>; outcome: string;
  /** Board calls: the opening words of the sentence this item appears with (tools.ts SAY_WITH). */
  sayWith?: string;
  /** Written inline in the reply (board-inline.ts): it belongs with the words that follow it. */
  inline?: boolean;
  /** The id of an earlier board item this one takes the place of (a graph redrawn with more on it). */
  replaces?: string;
  /** Added after the reply for words said before it turned the page: it belongs on the page before (turn.ts). */
  beforeTurn?: boolean;
  /** Added after the reply for a sentence said earlier in it: the item of this reply it goes above (turn.ts). */
  before?: string;
  /** On a page turn: the student was asked whether to go on and said yes; the page turns as the reply begins. */
  agreed?: boolean;
  /** On a page turn: items written just before it, with no words between, that belong on the new page. */
  carries?: string[];
  /** Not painted: it repeats this item on the page in view, and the board scrolls back to it. */
  pointsAt?: string;
}

export interface V2TurnResult {
  /** What the tutor says this turn, in order. */
  spoken: string;
  toolCalls: V2ToolCall[];
  /** Board items the board check withdrew after they were sent (what each showed). */
  withdrawn?: string[];
  state: V2State;
  /** `model` is the model that answered: the session's cost is priced from it. */
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number; model?: string };
  /** Milliseconds to the first text of the reply, and for the whole turn. */
  firstTextMs: number | null;
  totalMs: number;
  modelCalls: number;
}

export function newV2State(nowMs: number = Date.now()): V2State {
  return { history: [], note: '', goals: {}, board: { pages: [], current: -1 }, startedAtMs: nowMs, closed: false };
}
