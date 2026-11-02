/**
 * Client-spoken opening script (Task 14 §A, GDI run 4: the overview was a
 * kill + retry hiccup on every fresh session — the brain paraphrased it and
 * the required-phrase check rejected the attempt).
 *
 * When a fixed-script plan's FIRST segment carries `metadata.script` (a
 * string), the client speaks that script itself instead of asking the brain
 * for an opener: split into sentences exactly as the brain stream would be
 * (sentence-spacing.ts splitIntoSpokenSentences), each spoken through the
 * normal TTS path, the outline painted, the script kept as a tutor turn, and
 * the pointer moved to the next part with a FACT note — so the brain's first
 * turn (the student's reply) teaches that part.
 *
 * Generic: keyed on plan metadata only. Pure: no React, no I/O.
 */
import type { LessonPlan } from './types';
import { isFixedScriptPlan, initialSegmentId, nextSegmentId } from './fixed-script';
import { splitIntoSpokenSentences } from '../voice/sentence-spacing';

export interface SpokenOpener {
  /** the segment whose script is spoken (the plan's first segment) */
  segmentId: string;
  /** the script as authored (trimmed) — the transcript's tutor turn */
  script: string;
  /** one TTS call each, in order */
  sentences: string[];
  /** where the pointer moves after the script (null ⇒ no advance) */
  next: string | null;
}

/** The plan's spoken opener, or null: not a fixed script, no
 *  `metadata.script` on the first segment, or that segment is not where the
 *  session starts (skipped for a known level). */
export function fixedScriptSpokenOpener(plan: LessonPlan | null | undefined, levelKnown: boolean): SpokenOpener | null {
  if (!plan || !isFixedScriptPlan(plan) || plan.segments.length === 0) return null;
  const first = plan.segments[0];
  const raw = (first.metadata as Record<string, unknown> | undefined)?.script;
  if (typeof raw !== 'string' || !raw.trim()) return null;
  if (initialSegmentId(plan, levelKnown) !== first.id) return null;
  const script = raw.trim();
  const sentences = splitIntoSpokenSentences(script);
  if (sentences.length === 0) return null;
  return { segmentId: first.id, script, sentences, next: nextSegmentId(plan, first.id, levelKnown) };
}

/** The first sentence of the FACT note after the spoken opener (wrapped by
 *  fixedScriptAdvancedNote): the overview is done, the pointer has moved. */
export function spokenOpenerAdvanceLead(opener: SpokenOpener, next: string, kind: string): string {
  const last = opener.sentences[opener.sentences.length - 1] ?? '';
  return `The app has ALREADY spoken the "${opener.segmentId}" part to the student word for word (it ended with "${last}"), and the lesson pointer has ALREADY moved to segment "${next}" (${kind}). The student's next words answer that overview: do not greet again or repeat the overview.`;
}

/**
 * Task 30 fix round 6 (R5-1, run r5 −1…17 s: the first page load after a dev
 * recompile — the lesson-plan fetch had not landed when the queued Start
 * completed, so the tap found no plan: no spoken opener, the bridge line
 * "Hello." and the free-conversation '[start session]' kickoff (a prompt with
 * no plan, in=372) opened with its own Japanese question; the authored
 * overview script was spoken only after the advance guard refused at 13 s).
 * The session's opener never runs without the plan when one is expected:
 * wait (bounded) for the plan, and on a fixed-script plan for the prompt the
 * spoken opener needs. 'now' after OPENER_PLAN_WAIT_MAX_MS whatever the state.
 * Pure.
 */
export const OPENER_PLAN_WAIT_MAX_MS = 4000;
export function proactiveOpenerAllowed(input: {
  /** a lesson plan id is set — a plan is coming */
  planExpected: boolean;
  planLoaded: boolean;
  /** the loaded plan is a fixed script (false while not loaded) */
  fixedScript: boolean;
  /** the fixed-script spoken opener's prompt / profile is ready */
  promptReady: boolean;
  waitedMs: number;
  /** Fix round 7 (U-1): a real student turn was dispatched while the opener
   *  waited — the opener stands down (it would talk over / after their turn);
   *  the brain's reply to that turn carries the opening directive as any first
   *  turn does. */
  studentSpokeDuringWait?: boolean;
}): 'run' | 'wait' | 'stand_down' {
  if (input.studentSpokeDuringWait) return 'stand_down';
  if (input.waitedMs >= OPENER_PLAN_WAIT_MAX_MS) return 'run';
  if (input.planExpected && !input.planLoaded) return 'wait';
  if (input.planLoaded && input.fixedScript && !input.promptReady) return 'wait';
  return 'run';
}
