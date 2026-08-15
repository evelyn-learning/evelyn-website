/**
 * Quick-action detection — shared by TranscriptView (chips under the latest
 * tutor bubble) and the SessionStage "quick actions" layer (Direction 4), so
 * both surfaces show the SAME tap-able prompts from one source of truth.
 *
 * Pure: given the transcript, decide which quick-answer (yes/no, true/false)
 * and pacing (I'm stuck, Skip ahead) chips apply to the latest finalized
 * tutor turn. The long bracketed directives are brain-facing instructions
 * (stripped from the visible chat by TranscriptView) — keep them here so the
 * two surfaces can never drift.
 */
import type { TranscriptEntry } from '@/lib/tutor/types';

export type QuickAnswerKind = 'yes-no' | 'true-false' | 'open';

/** Find the trailing question in a tutor turn. Returns {body, question} or
 *  null when there's no clean trailing question. (Mirrors the SentenceBuffer
 *  boundary heuristic.) */
export function splitTrailingQuestion(text: string): { body: string; question: string } | null {
  if (!text) return null;
  const trimmed = text.trimEnd();
  const lastQ = trimmed.lastIndexOf('?');
  if (lastQ < 0) return null;
  const tail = trimmed.slice(lastQ + 1).trim();
  if (tail.length > 8) return null;
  let qStart = 0;
  const boundaryRe = /(?<!\b[A-Z])[.!?][)\]'"’”]*(?:\s+(?=[A-Z])|(?=[A-Z]))/g;
  const boundaries = [...trimmed.slice(0, lastQ).matchAll(boundaryRe)];
  const lastBoundary = boundaries[boundaries.length - 1];
  if (lastBoundary) qStart = lastBoundary.index! + lastBoundary[0].length;
  const body = trimmed.slice(0, qStart).trimEnd();
  const question = trimmed.slice(qStart, lastQ + 1).trim() + (tail ? ' ' + tail : '');
  if (question.length < 6) return null;
  if (!body) return null;
  return { body, question };
}

/** Continuation / wrap-up question ("Ready for the next one?") — gates the
 *  I'm-stuck chip (no active problem to be stuck on). */
export function isContinuationQuestion(question: string): boolean {
  if (!question) return false;
  const q = question.trim();
  if (!q.endsWith('?')) return false;
  return /\b(?:ready (?:to|for)|want to|should we|shall we|on to the|move on|got it|next one|keep going|keep drilling|wrap up|done for now|good for now|all set|that's enough|more practice)\b[^?]{0,80}\?\s*$/i.test(q);
}

/** Classify the trailing question for quick-answer buttons. */
export function classifyQuestionForQuickAnswer(question: string): QuickAnswerKind {
  if (!question) return 'open';
  const q = question.trim().toLowerCase();
  if (/\btrue or false\b/.test(q) || /\bright or wrong\b/.test(q) || /\bcorrect or incorrect\b/.test(q)) return 'true-false';
  if (q.length > 140) return 'open';
  const politeImperative = /^(can|could|will|would|do|did|does|are|is|have|has)\s+(you|i)\s+(tell|explain|describe|show|give|find|name|list|state|write|solve|calculate|compute|figure|work|think|recall|remember|identify|expand|simplify|derive|estimate|guess)\b/;
  if (politeImperative.test(q)) return 'open';
  const yesNoStart = /^(does|did|do|is|are|was|were|will|would|can|could|should|shall|may|might|have|has|had|want|ready|sure|got|see|make sense|makes sense)\b/;
  if (yesNoStart.test(q)) return 'yes-no';
  if (/\b(want to|ready to|shall we|how about|wanna)\b.+\?$/.test(q)) return 'yes-no';
  if (/\bmake[s]? sense\?$/.test(q)) return 'yes-no';
  return 'open';
}

// Brain-facing directives (stripped from the visible chat). Keep verbatim in
// sync with the intent documented in TranscriptView.
export const STUCK_TEXT =
  "I'm stuck on this — can you break it down? [I'm-stuck-button-clicked: walk me through this Socratically. Ask me ONE first sub-question and WAIT for my answer. Do NOT reveal the final answer or any computed value in this turn. Do NOT say 'Exactly' or affirm anything until I actually answer something.]";
export const SKIP_TEXT =
  "Let's skip this and move on. [Skip-button-clicked: advance ONE segment by calling advance_lesson({to: 'next'}) — this moves to the IMMEDIATELY next segment in plan order, which is usually the next beat of the SAME LO (concept → worked_example → try_yourself). Briefly introduce that next segment — a sentence or two plus at most ONE anchor visual, not its full set of cards/formulas (a Skip is brisk navigation, not a re-teach; extra renders are capped and dropped). Do NOT skip multiple segments. Do NOT jump to a different LO unless the next segment in plan order is in fact the next LO's first segment. The student did NOT answer your prior question — Skip is a navigation action, not an answer. Do NOT say 'Exactly', 'Right', 'Correct', or any affirmation word. Do NOT fabricate the expected answer as if the student had given it. Do NOT ask for clarification, just advance.]";

export interface QuickAction {
  label: string;
  text: string;
  tone: 'answer' | 'stuck' | 'skip';
}

/** Compute the quick-action chips that apply to the latest finalized tutor
 *  turn (or [] when none). Same gating as TranscriptView's chip row. */
export function getQuickActions(
  transcript: TranscriptEntry[],
  opts: { enablePacing: boolean },
): QuickAction[] {
  const vis = transcript.filter((e) => !e.historyOnly);
  let latest: TranscriptEntry | null = null;
  let respondedAfter = false;
  for (let i = vis.length - 1; i >= 0; i--) {
    const e = vis[i];
    if (e.role === 'tutor' && !e.streaming) { latest = e; break; }
    if (e.role === 'student') respondedAfter = true;
  }
  if (!latest || respondedAfter) return [];
  const split = splitTrailingQuestion(latest.text);
  const kind = split ? classifyQuestionForQuickAnswer(split.question) : 'open';
  const tutorTurns = vis.reduce((n, e) => n + (e.role === 'tutor' && !e.streaming ? 1 : 0), 0);
  const pacingAllowed = opts.enablePacing && tutorTurns >= 2;

  const actions: QuickAction[] = [];
  if (kind === 'yes-no') {
    actions.push({ label: 'Yes', text: 'Yes', tone: 'answer' }, { label: 'No', text: 'No', tone: 'answer' }, { label: 'Not sure', text: "I'm not sure", tone: 'answer' });
  } else if (kind === 'true-false') {
    actions.push({ label: 'True', text: 'True', tone: 'answer' }, { label: 'False', text: 'False', tone: 'answer' }, { label: 'Not sure', text: "I'm not sure", tone: 'answer' });
  }
  if (pacingAllowed) {
    if (split && !isContinuationQuestion(split.question)) actions.push({ label: "I'm stuck", text: STUCK_TEXT, tone: 'stuck' });
    actions.push({ label: 'Skip ahead', text: SKIP_TEXT, tone: 'skip' });
  }
  return actions;
}
