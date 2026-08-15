/**
 * Unit tests for the Q-pin gist text helpers (Task X8).
 *
 * Regression: the Haiku gist producer (/api/tutor/question-gist)
 * sometimes wraps part of its restated question in markdown emphasis
 * (single-star italics / double-star bold). InlineMathText — the pin's
 * renderer — only special-cases $...$ math, so unstripped emphasis showed
 * literal asterisks ("*in order to*") in the live app. stripMarkdownEmphasis()
 * fixes both the primary (LLM) gist path and the client-derived
 * lastQuestionSentence() fallback, which shares the same helper.
 *
 * Run: npx tsx scripts/test-question-gist-text.ts
 */
import { stripMarkdownEmphasis, lastQuestionSentence, parseGistReply } from '../src/lib/tutor/question-gist-text';

let pass = 0;
let fail = 0;

function check(name: string, got: unknown, want: unknown) {
  const ok = got === want;
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${ok ? '' : `  — got: ${JSON.stringify(got)}  want: ${JSON.stringify(want)}`}`);
  if (ok) pass++; else fail++;
}

// --- stripMarkdownEmphasis --------------------------------------------
check(
  'single-asterisk italic stripped',
  stripMarkdownEmphasis('What do you need to solve *in order to* isolate x?'),
  'What do you need to solve in order to isolate x?',
);
check(
  'double-asterisk bold stripped',
  stripMarkdownEmphasis('What is the **first step** here?'),
  'What is the first step here?',
);
check(
  'multiple emphasis spans in one string',
  stripMarkdownEmphasis('Is *a* or *b* the coefficient?'),
  'Is a or b the coefficient?',
);
check(
  'bare multiplication untouched (no content between adjacent stars)',
  stripMarkdownEmphasis('2*3*4 equals 24'),
  '2*3*4 equals 24',
);
check(
  'plain text with no asterisks untouched',
  stripMarkdownEmphasis('What is the slope of this line?'),
  'What is the slope of this line?',
);

// X8 review (I2): the emphasis-strip regex ate asterisks INSIDE $...$ math
// spans — "$x*y*z$" (literal multiplication inside math delimiters) lost
// its asterisks and became "$xyz$". Fix: split on $...$ spans first, strip
// emphasis only outside them, then reassemble.
check(
  'math span with literal asterisks preserved untouched',
  stripMarkdownEmphasis('$x*y*z$'),
  '$x*y*z$',
);
check(
  'emphasis outside math still stripped',
  stripMarkdownEmphasis('*in order to* isolate the variable'),
  'in order to isolate the variable',
);
check(
  'mixed sentence: math preserved, surrounding emphasis stripped',
  stripMarkdownEmphasis('Solve $x*y*z$ using *substitution* to isolate x.'),
  'Solve $x*y*z$ using substitution to isolate x.',
);
check(
  'two math spans with an emphasis span between them',
  stripMarkdownEmphasis('Compare $a*b$ and *carefully* $c*d$ here.'),
  'Compare $a*b$ and carefully $c*d$ here.',
);

// --- lastQuestionSentence (fallback path) ------------------------------
check(
  'fallback strips emphasis before extracting the question',
  lastQuestionSentence('First we isolate x. What do you need to do *in order to* isolate x?'),
  'What do you need to do in order to isolate x?',
);
check(
  'fallback returns the LAST question sentence, complete',
  lastQuestionSentence('Is it 4? No wait, is it *actually* 9?'),
  'No wait, is it actually 9?',
);
check(
  'fallback returns null when there is no question',
  lastQuestionSentence('This turn has no question mark at all.'),
  null,
);
check(
  'fallback returns null when the only question is too long to pin',
  lastQuestionSentence(`${'x'.repeat(221)}?`),
  null,
);

// --- parseGistReply (Task Y2: route's Haiku-reply → gist decision) ----
// This is the pure seam the route handler defers to. It only sees the
// model's own text — the distinction between "deliberate NONE" (handled
// here, resolves to null) and "internal failure" (never reaches this
// function; the route returns non-200 instead) lives one layer up.
check(
  'deliberate NONE verdict resolves to null',
  parseGistReply('NONE'),
  null,
);
check(
  'ordinary question passes through trimmed',
  parseGistReply('  What is the slope of this line?  '),
  'What is the slope of this line?',
);
check(
  'over-length reply (>200 chars) resolves to null',
  parseGistReply(`${'x'.repeat(201)}?`),
  null,
);
check(
  'empty string resolves to null',
  parseGistReply(''),
  null,
);
check(
  'whitespace-only string resolves to null',
  parseGistReply('   '),
  null,
);
check(
  'choice prompt (not literal NONE) passes through',
  parseGistReply('Want another at this level, something harder, or move on?'),
  'Want another at this level, something harder, or move on?',
);

// R33 (session-1784830146734): model meta-commentary leaked into the pin.
check(
  'NONE with trailing annotation is still NONE',
  parseGistReply("NONE\n(This is a follow-up prompt asking the student to elaborate on reasoning they've already started, not a standalone question the tutor is posing.)"),
  null,
);
check(
  'parenthetical-only reply is meta → null',
  parseGistReply('(The turn poses no question.)'),
  null,
);
check(
  'self-correction keeps only the final question',
  parseGistReply('What is the first step?\nWait — let me rephrase to match the teaching context:\nIs $f(x) = \\cos(x) - x$ continuous on $[0, \\pi/2]$?'),
  'Is $f(x) = \\cos(x) - x$ continuous on $[0, \\pi/2]$?',
);
check(
  'same-line rephrase preamble cut through the colon',
  parseGistReply('Let me rephrase that: Is the function continuous on the interval?'),
  'Is the function continuous on the interval?',
);
check(
  'two-question single-line reply keeps the last',
  parseGistReply('Ready to try? What sign does $f(0.5)$ have?'),
  'What sign does $f(0.5)$ have?',
);
check(
  'clean single question still passes verbatim',
  parseGistReply('Is $f(x)$ continuous on $[0, 2]$?'),
  'Is $f(x)$ continuous on $[0, 2]$?',
);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
