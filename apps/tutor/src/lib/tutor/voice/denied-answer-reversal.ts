/**
 * Deterministic cross-turn guard: the tutor denied a student's short answer
 * and later asserts that same answer as correct. Exercised by
 * scripts/test-denied-answer-reversal.ts.
 *
 * Why (2026-08-18, portal-a972c7e9, AP Psych): student answered "the
 * central executive"; the tutor opened "Not quite," invented a distinction
 * that doesn't exist, then two turns later said the juggling "belongs to
 * the central executive after all" — and finally revealed "it's the
 * *central executive*" as a fresh fact after the student gave up. The
 * judge flagged both bad turns but advisories dead-end for non-math
 * claims; nothing deterministic covered the cross-turn shape. This guard
 * does, with zero domain knowledge: the contradiction is purely
 * structural — deny X, assert X.
 *
 * Conservative by construction:
 *  - Only SHORT student answers are tracked (≤ 4 content words after
 *    filler stripping) — a denied essay-length claim has too many ways to
 *    partially reappear.
 *  - Only ASSERTION shapes fire ("it's the X", "the answer is X",
 *    "belongs to the X", "X after all", "X is correct/right") — a plain
 *    descriptive mention of X while teaching does not.
 *  - Negated assertions never fire ("it's not the X").
 *  - The denial's own turn is excluded, and entries expire after
 *    MAX_AGE_TURNS student turns.
 */

import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

export interface DeniedAnswer {
  phrase: string;
  turn: number;
}

const DEFAULT_MAX_AGE_TURNS = 6;

const FILLER_RE = /\b(?:uh|um|erm|hmm+|so|like|well|okay|ok|yeah|maybe|probably|i\s+guess|i\s+think|it'?s|the\s+answer\s+is)\b/gi;
const GIVE_UP_RE = /\b(?:don'?t\s+know|not\s+sure|no\s+idea|dunno|idk)\b/i;

function normalize(text: string): string {
  return (text ?? '')
    .toLowerCase()
    .replace(/[*_`"'’‘“”]/g, '')
    .replace(/[^a-z0-9\s/.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A short, answer-like student utterance worth tracking when denied —
 *  null for give-ups, long explanations, or empty residue. */
export function extractDeniableAnswer(utterance: string): string | null {
  const raw = utterance ?? '';
  if (GIVE_UP_RE.test(raw)) return null;
  let s = normalize(raw);
  s = s.replace(FILLER_RE, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/^(?:the|a|an)\s+/, '');
  // normalize keeps '.' for decimals (13.5) — strip a trailing sentence dot.
  s = s.replace(/[.\s]+$/, '');
  if (!s) return null;
  const words = s.split(' ');
  if (words.length > 4) return null;
  return s;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Praise/denial openers a tutor grades with. A reversal in a math session is
 *  almost always "<verdict>. <value>" — portal-9a9b7c09 @763.6s said
 *  "Right. Twelve —" after denying a correct 12 fifteen seconds earlier, and
 *  none of the prose assertion shapes below matched it. */
const VERDICT_OPENER = String.raw`exactly|right|correct|precisely|yes|nice|perfect|that'?s it`;

export function checkDeniedAnswerReversal(args: {
  sentence: string;
  denied: DeniedAnswer[];
  currentTurn: number;
  maxAgeTurns?: number;
  normalizeSpokenWords?: boolean;
}): { verdict: 'ok' } | { verdict: 'reversal'; phrase: string; turn: number } {
  const maxAge = args.maxAgeTurns ?? DEFAULT_MAX_AGE_TURNS;
  const sentence = normalize(
    args.normalizeSpokenWords === true ? spokenNumbersToDigits(args.sentence) : args.sentence,
  );
  if (!sentence) return { verdict: 'ok' };
  for (const d of args.denied) {
    if (!d.phrase) continue;
    if (d.turn >= args.currentTurn) continue;             // the denial's own turn
    if (args.currentTurn - d.turn > maxAge) continue;     // stale — student moved on
    // The stash holds the STUDENT's text (usually digits) and the tutor
    // reverses in words; normalize the phrase the same way as the sentence.
    const phrase = normalize(
      args.normalizeSpokenWords === true ? spokenNumbersToDigits(d.phrase) : d.phrase,
    );
    if (!phrase) continue;
    const p = escapeRe(phrase);
    if (!new RegExp(`\\b${p}\\b`).test(sentence)) continue;
    // Negation anywhere adjacent to the phrase → a denial re-statement, not
    // a reversal ("it's not the central executive").
    if (new RegExp(`\\b(?:not|isn'?t|wasn'?t|instead of|rather than|unlike|never)\\s+(?:the\\s+|a\\s+|an\\s+)?${p}\\b`).test(sentence)) continue;
    const assertion = new RegExp(
      `(?:\\b(?:it'?s|it\\s+is|that'?s|that\\s+is|this\\s+is|the\\s+answer\\s+is|resolution\\s+is|belongs?\\s+to)\\s+(?:the\\s+|a\\s+|an\\s+)?${p}\\b` +
      `|\\b${p}\\s+after\\s+all\\b` +
      `|\\b${p}\\s+(?:is|was)\\s+(?:the\\s+(?:one|answer)|correct|right|exactly\\s+(?:it|right))\\b` +
      // Verdict opener then the value, within the opening clause only:
      // "Right. Twelve —", "Exactly. 12 it is." Anchored at the start so a
      // mid-explanation mention of the value never fires.
      `|^\\s*(?:${VERDICT_OPENER})\\b[\\s.,!—-]*${p}\\b)`,
      'i',
    );
    if (assertion.test(sentence)) {
      return { verdict: 'reversal', phrase: d.phrase, turn: d.turn };
    }
  }
  return { verdict: 'ok' };
}
