/**
 * Posed-computation grounding (live 2026-09-06, portal-4bbe5d91).
 *
 * The orchestrator substituted the segment's authored card for the brain's
 * improvised problem, but the brain's SPEECH was written for its own problem:
 * "what do you think $-2 \\times (-4)$ comes out to?" while the board showed
 * $8 - 3(2x-4) + 5x$. The student computed the wrong product, asked why, and
 * the tutor affirmed it before correcting itself. Nothing checked that the
 * numbers a posed computation names actually exist in the problem.
 *
 * Rule (subject-free): in a QUESTION sentence that poses `A × B` or `A ÷ B`
 * between two numeric literals, every operand must appear in the grounding
 * texts (active problem statement, the student's utterance, the board
 * summary) with the SAME SIGN and, when the statement's literal is a
 * coefficient ("2x"), the posed operand is only grounded if it is also a
 * coefficient. Addition/subtraction is deliberately out of scope for now —
 * partial sums are routinely posed from earlier steps.
 */
export interface UngroundedComputation { a: string; b: string; op: string; missing: string[] }

interface NumTok { value: string; sign: '+' | '-'; coeff: boolean }

function numericTokens(text: string): NumTok[] {
  const s = (text ?? '').replace(/\\times|\\cdot|×|·/g, '*').replace(/[−–]/g, '-');
  const out: NumTok[] = [];
  // A coefficient is a letter GLUED to the number ("2x"); "2 into" is not.
  const re = /(-?)\s*(\d+(?:\.\d+)?)([a-zA-Z])?(?![a-zA-Z0-9.])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    // A '-' glued or spaced before the number counts as its sign (binary or
    // unary — for distribution semantics both mean "negative multiplier").
    const before = s.slice(0, m.index + m[1].length).replace(/\s+$/, '');
    const sign: '+' | '-' = m[1] === '-' || /-$/.test(before) ? '-' : '+';
    const coeff = !!m[3];
    out.push({ value: m[2], sign, coeff });
  }
  return out;
}

const POSED_RE = /(-?\s*\(?\s*-?\d+(?:\.\d+)?\s*\)?)\s*(?:\\times|×|·|\*|times|multiplied by|÷|\\div|divided by)\s*(\(?\s*-?\d+(?:\.\d+)?\s*\)?)/i;
const QUESTION_RE = /\?\s*$|^\s*(?:what|how much|how many|so what|now what)\b/i;

function parseOperand(raw: string): { value: string; sign: '+' | '-' } {
  const t = raw.replace(/[\s()]/g, '');
  return { value: t.replace(/^-/, ''), sign: t.startsWith('-') ? '-' : '+' };
}

export function findUngroundedComputation(sentence: string, groundingTexts: string[]): UngroundedComputation | null {
  const s = (sentence ?? '').replace(/\$/g, ' ');
  if (!QUESTION_RE.test(s)) return null;
  const m = POSED_RE.exec(s.replace(/\\times|×|·/g, '*'));
  if (!m) return null;
  const grounding = groundingTexts.filter(Boolean).join(' \n ');
  if (!grounding.trim()) return null;
  const toks = numericTokens(grounding);
  const isGrounded = (o: { value: string; sign: '+' | '-' }) =>
    toks.some((t) => t.value === o.value && t.sign === o.sign && !t.coeff);
  const a = parseOperand(m[1]); const b = parseOperand(m[2]);
  const missing: string[] = [];
  if (!isGrounded(a)) missing.push((a.sign === '-' ? '-' : '') + a.value);
  if (!isGrounded(b)) missing.push((b.sign === '-' ? '-' : '') + b.value);
  if (!missing.length) return null;
  return { a: (a.sign === '-' ? '-' : '') + a.value, b: (b.sign === '-' ? '-' : '') + b.value, op: /÷|div/i.test(m[0]) ? '÷' : '×', missing };
}
