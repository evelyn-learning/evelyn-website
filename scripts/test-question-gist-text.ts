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
import { stripMarkdownEmphasis, lastQuestionSentence } from '../src/lib/tutor/question-gist-text';

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

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
