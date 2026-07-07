// scripts/test-tts-pronunciation.ts
// Unit tests for rewriteForTTS() additions: slash-pair whitelist,
// em-dash normalization, math-variable letter respelling.
import assert from 'node:assert';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';

// --- Slash-pair whitelist -----------------------------------------
assert.strictEqual(
  rewriteForTTS('The door opens left/right.'),
  'The door opens left or right.',
  'left/right should read as "left or right"'
);
assert.strictEqual(
  rewriteForTTS('Check the profit/revenue ratio.'),
  'Check the profit/revenue ratio.',
  'profit/revenue is NOT a whitelisted pair — must stay untouched'
);
assert.strictEqual(
  rewriteForTTS('Add 3/4 to the total.'),
  'Add 3/4 to the total.',
  'fractions like 3/4 must never be touched'
);
assert.strictEqual(
  rewriteForTTS('You can go up/down or left/right.'),
  'You can go up or down or left or right.',
  'multiple whitelisted pairs in one sentence'
);
assert.strictEqual(
  rewriteForTTS('Choose true/false for each item.'),
  'Choose true or false for each item.',
  'true/false pair'
);
assert.strictEqual(
  rewriteForTTS('You may add and/or remove terms.'),
  'You may add and or remove terms.',
  'and/or must read as "and or", not "and or or"'
);
assert.strictEqual(
  rewriteForTTS('Pick either/or answer it directly.'),
  'Pick either or answer it directly.',
  'either/or must read as "either or", not "either or or"'
);

// --- Em-dash normalization ------------------------------------------
assert.strictEqual(
  rewriteForTTS("That's a clean session — Praveen — you walked in confident."),
  "That's a clean session, Praveen, you walked in confident.",
  'em-dashes (with surrounding spaces) become commas, no doubling'
);
assert.strictEqual(
  rewriteForTTS('Wait—stop right there.'),
  'Wait, stop right there.',
  'bare em-dash (no surrounding spaces) also becomes a comma'
);

// --- Math-variable letter respelling: Tier 1 ('y', 'b') -------------
assert.strictEqual(
  rewriteForTTS('y squared over 9'),
  'why squared over 9',
  'standalone lowercase y is unconditionally respelled'
);
assert.strictEqual(
  rewriteForTTS('the x-y plane'),
  'the x-why plane',
  'y inside the hyphenated "x-y" token is still standalone per word-boundary rules'
);
assert.strictEqual(
  rewriteForTTS('Solve for b in the equation.'),
  'Solve for bee in the equation.',
  'standalone lowercase b is unconditionally respelled'
);
assert.strictEqual(
  rewriteForTTS('Y squared equals 9.'),
  'why squared equals 9.',
  'capital Y is respelled when followed by a math anchor'
);
assert.strictEqual(
  rewriteForTTS('You should try again.'),
  'You should try again.',
  'capital Y NOT followed by a math anchor (e.g. sentence-initial "You") must stay untouched'
);
assert.strictEqual(
  rewriteForTTS('Grab your book, chapter 4b, and read it.'),
  'Grab your book, chapter 4b, and read it.',
  'b glued to a digit ("4b") has no internal word boundary and must stay untouched'
);

// --- Math-variable letter respelling: Tier 2 ('a', context-anchored) -
assert.strictEqual(
  rewriteForTTS('Here a represents the number of apples.'),
  'Here ay represents the number of apples.',
  '"a represents" anchors the variable reading of a'
);
assert.strictEqual(
  rewriteForTTS('Substitute a, the number of apples, and y, the weight, into the formula.'),
  'Substitute ay, the number of apples, and why, the weight, into the formula.',
  'apposition anchor ("a, the ...") plus tier-1 y in the same sentence'
);
assert.strictEqual(
  rewriteForTTS('A cat sat on a mat.'),
  'A cat sat on a mat.',
  'plain article "a"/"A" must NEVER be rewritten'
);
assert.strictEqual(
  rewriteForTTS('I have a question.'),
  'I have a question.',
  'plain article "a" before an ordinary noun must never be rewritten'
);
assert.strictEqual(
  rewriteForTTS('Find the values of a and b.'),
  'Find the values of ay and bee.',
  '"values of a" anchors a; standalone b is tier-1 unconditional'
);

// --- Existing behavior must still work (regression) -----------------
assert.strictEqual(
  rewriteForTTS('arcsin of x equals theta, and sin of theta equals 1.'),
  'arc sine of x equals theta, and sine of theta equals 1.',
  'trig replacements still apply (sanity check on ordering)'
);
assert.strictEqual(
  rewriteForTTS('\\theta plus \\alpha'),
  'theta plus alpha',
  'greek LaTeX commands still stripped'
);

console.log('OK — tts-pronunciation rewrites validated');
