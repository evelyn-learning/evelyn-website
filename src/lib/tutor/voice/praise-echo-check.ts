/**
 * Praise-echo check (verdict-detector round, session portal-cb2addf5): the
 * R41 target class where the brain's opener AFFIRMS a value that DISAGREES
 * with what the student actually said out loud — "Right — $2x$." after the
 * student said "three x". `detectPraiseContradiction` (praise-contradiction.ts)
 * catches the brain contradicting ITSELF later in the same turn; this module
 * catches the brain's affirmation contradicting the STUDENT, using the
 * tri-state utterance comparator built in Tasks 1-2.
 *
 * Deliberately thin: `extractPraiseEcho` already scopes the affirmed phrase
 * to compact math-value tokens (no bare praise, no prose phrases), and
 * `matchUtteranceToAnswer` already collapses anything ambiguous to
 * 'unknown'. This module only wires the two together and narrows to the
 * 'disagree' verdict — 'agree' and 'unknown' both resolve to 'ok', so a
 * hedged, unparseable, or genuinely-matching student utterance can never
 * trigger a kill. Pure, no LLM, no side effects, never throws.
 */
import { extractPraiseEcho } from '@/lib/tutor/voice/praise-contradiction';
import { matchUtteranceToAnswer } from '@/lib/tutor/voice/utterance-answer-match';

export interface PraiseEchoResult { verdict: 'ok' | 'false_praise'; affirmed?: string; studentSaid?: string; matchReason?: string }

export function checkPraiseEcho(args: {
  turnTextSoFar: string; studentUtterance: string;
  choices?: Array<{ letter: string; text: string }>;
}): PraiseEchoResult {
  const affirmed = extractPraiseEcho(args.turnTextSoFar);
  if (!affirmed) return { verdict: 'ok' };
  const m = matchUtteranceToAnswer(args.studentUtterance, affirmed, args.choices);
  if (m.verdict === 'disagree') {
    return { verdict: 'false_praise', affirmed, studentSaid: args.studentUtterance, matchReason: m.reason };
  }
  return { verdict: 'ok' };
}
