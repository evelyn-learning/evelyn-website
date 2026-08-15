/**
 * Unit tests for statement-dollar-sanitizer — the deterministic cleanup
 * that strips a brain-emitted stray `$` glued to prose in a problem
 * statement (R47, session portal-1349716e) while leaving currency `$`s
 * and real `$...$` math delimiters untouched.
 *
 * Run: npm run test:statement-dollars
 */
import { sanitizeStatementDollars } from '../apps/marketing/src/lib/tutor/whiteboard/statement-dollar-sanitizer';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

console.log('\n=== Live bug repro (session portal-1349716e) ===');
{
  const t = 'You have $20. A movie ticket costs $20. A pile of snacks also costs $20. You can only afford one. You choose the movie ticket.$What is the opportunity cost of that choice?';
  const out = sanitizeStatementDollars(t);
  const expected = 'You have $20. A movie ticket costs $20. A pile of snacks also costs $20. You can only afford one. You choose the movie ticket.What is the opportunity cost of that choice?';
  check('stray glued $ dropped, currency $20s intact', out === expected, out);
}

console.log('\n=== Negative pins (untouched) ===');
{
  const t = 'solve $x+2$ please';
  check('"solve $x+2$ please" untouched', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}
{
  const t = 'costs $20';
  check('"costs $20" untouched', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}
{
  const t = 'What is $f(3)$?';
  check('"What is $f(3)$?" untouched', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}

console.log('\n=== Isolated stray dollar ===');
{
  const t = '$What';
  check('"$What" alone (no other $s) dropped', sanitizeStatementDollars(t) === 'What', sanitizeStatementDollars(t));
}

console.log('\n=== Additional coverage ===');
{
  check('empty string passes through', sanitizeStatementDollars('') === '');
}
{
  const t = 'No dollar signs here at all.';
  check('no-$ text untouched (fast path)', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}
{
  const t = 'Maya has $50 and a $15 movie ticket.';
  check('plain currency prose untouched', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}
{
  // A stray glued $ elsewhere in the SAME string as a real, still-ambiguous
  // $...$ pair (letter-glued open with a digit inside, e.g. $f(3)$) must
  // block ALL removals — the (c) global guard is all-or-nothing.
  const t = 'Consider $f(3)$ carefully.$Now think about the next part please.';
  check('global guard: ambiguous $ elsewhere blocks removal', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}
{
  // $ glued to a letter but only ONE prose word in a paired (non-solo)
  // context stays untouched — the stricter 2-word bar applies because a
  // second $ exists to pair with it.
  const t = 'Say $Hello$ to your neighbor.';
  check('paired single-word span untouched (needs partner-aware strictness)', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}
{
  const t = undefined as unknown as string;
  check('undefined input returns empty string', sanitizeStatementDollars(t) === '');
}

console.log('\n=== Review fix: bare quantity digits stay prose (2026-08-11 review) ===');
{
  // FINDING (Important): the original digit test rejected on ANY digit
  // anywhere in the span, which left a large slice of the live bug class
  // unfixed — a math-tutor follow-up question almost always mentions a
  // number. The fix narrows the digit rejection to "digit glued to a math
  // signal char" only; a bare quantity digit elsewhere in prose no longer
  // disqualifies the span.
  const t = 'You choose the movie.$What is 2 times the ticket price?';
  const expected = 'You choose the movie.What is 2 times the ticket price?';
  check('stray $ before a number-bearing follow-up question dropped', sanitizeStatementDollars(t) === expected, sanitizeStatementDollars(t));
}
{
  const t = 'She bought 3 more.$What changed?';
  const expected = 'She bought 3 more.What changed?';
  check('stray $ dropped; digit earlier in the SAME string (outside the span) is irrelevant', sanitizeStatementDollars(t) === expected, sanitizeStatementDollars(t));
}
{
  // NEGATIVE: a digit immediately adjacent to a math signal char (here `=`)
  // must still block removal — this is real math, not a bare quantity.
  const t = 'solve $x=2 please$';
  check('"solve $x=2 please$" untouched (digit adjacent to =)', sanitizeStatementDollars(t) === t, sanitizeStatementDollars(t));
}

console.log(`\n${pass} passed, ${fail} failed\n`);
if (fail > 0) process.exit(1);
