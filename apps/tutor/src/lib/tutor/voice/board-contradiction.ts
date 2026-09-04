/**
 * The same arithmetic chain, written correctly on the board and spoken
 * incorrectly in the same turn.
 *
 * portal-9a9b7c09 (2026-09-04): showEquation-11 painted
 * "16 + 9 + 9 + 4 + 144 = 182" at 460.8s while the speech at 451.1s said the
 * total was thirty-eight. The LLM judge caught it at kill severity
 * (judge_advisory_was_kill) and, being advisory-only under Pillar 2b, aired
 * nothing. The board is deterministic ground truth the tutor itself produced,
 * so this comparison can kill where the judge may not.
 *
 * Deliberately exact: an operand chain matches only if the SAME operands
 * appear in the SAME order with the SAME operator. No algebra, no reordering,
 * no partial credit — anything less certain returns ok.
 *
 * Pure module — no side effects, never throws.
 */
import { spokenNumbersToDigits } from '@/lib/tutor/voice/spoken-numbers';

export type BoardContradictionResult =
  | { verdict: 'ok' }
  | { verdict: 'contradiction'; expr: string; boardValue: string; spokenValue: string };

const OK: BoardContradictionResult = { verdict: 'ok' };

const NUM = String.raw`-?\d+(?:\.\d+)?`;
/** "<n> op <n> [op <n>]… = <n>", one operator family, three or more operands. */
const EQN_RE = new RegExp(
  String.raw`(${NUM}\s*([+*])\s*${NUM}(?:\s*\2\s*${NUM})+)\s*=\s*(${NUM})`,
  'g',
);

/** LaTeX and speech punctuation → a bare arithmetic string. */
function flatten(s: string): string {
  return (s ?? '')
    .replace(/\\(?:text|mathrm|label)\s*\{[^}]*\}/g, ' ')
    .replace(/[$\\{}]/g, ' ')
    .replace(/[×·]/g, '*')
    .replace(/−/g, '-')
    .replace(/\bplus\b/gi, '+')
    .replace(/\btimes\b/gi, '*')
    .replace(/—?\s*(?:that'?s|equals|comes out to|gives|is)\s*\*?/gi, ' = ')
    .replace(/\s+/g, ' ')
    .trim();
}

function key(expr: string): string {
  return expr.replace(/\s+/g, '');
}

export function detectBoardContradiction(args: {
  /** Everything the tutor said this turn. */
  turnText: string;
  /** Concatenated render payload text for this turn. */
  renderedText: string;
}): BoardContradictionResult {
  const board = flatten(args.renderedText);
  const spoken = flatten(spokenNumbersToDigits(args.turnText ?? ''));
  if (!board || !spoken) return OK;

  const boardValues = new Map<string, string>();
  EQN_RE.lastIndex = 0;
  for (let m = EQN_RE.exec(board); m !== null; m = EQN_RE.exec(board)) {
    boardValues.set(key(m[1]), m[3]);
  }
  if (boardValues.size === 0) return OK;

  EQN_RE.lastIndex = 0;
  for (let m = EQN_RE.exec(spoken); m !== null; m = EQN_RE.exec(spoken)) {
    const k = key(m[1]);
    const boardValue = boardValues.get(k);
    if (boardValue !== undefined && parseFloat(boardValue) !== parseFloat(m[3])) {
      return { verdict: 'contradiction', expr: m[1], boardValue, spokenValue: m[3] };
    }
  }
  return OK;
}
