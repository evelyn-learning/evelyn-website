// scripts/test-board-title.ts
// Unit tests for stripLatexForTitle() — the board-page switcher (pill +
// jump-to-page dropdown) renders board titles as plain text, so raw LaTeX
// without $ delimiters leaks through verbatim (live mobile Safari test,
// IMG_7795: "Compute lim_{x→0} (…"). InlineMathText doesn't help here
// because there are no $ delimiters to trigger it — this is a distinct,
// title-only normalizer.
import assert from 'node:assert';
import { stripLatexForTitle } from '../src/lib/tutor/whiteboard/board-title';

// --- Subscript notation ---------------------------------------------
assert.strictEqual(
  stripLatexForTitle('Compute lim_{x→0} (sin x)/x'),
  'Compute lim x→0 (sin x)/x',
  'lim_{x→0} should read as "lim x→0" — braced subscript becomes a space'
);

// --- \frac{a}{b} ------------------------------------------------------
assert.strictEqual(
  stripLatexForTitle('\\frac{a}{b}'),
  'a/b',
  '\\frac{a}{b} should become "a/b"'
);
assert.strictEqual(
  stripLatexForTitle('Simplify \\frac{x+1}{x-1} fully'),
  'Simplify x+1/x-1 fully',
  '\\frac with multi-char numerator/denominator'
);
assert.strictEqual(
  stripLatexForTitle('\\frac{1}{\\frac{2}{3}}'),
  '1/2/3',
  'nested \\frac resolves inside-out'
);

// --- ^ / _ markers (bare, no braces) ---------------------------------
assert.strictEqual(
  stripLatexForTitle('x^2 + y_1'),
  'x 2 + y 1',
  'bare ^ and _ markers become a space before the following token'
);
assert.strictEqual(
  stripLatexForTitle('a^{10} is big'),
  'a 10 is big',
  'braced superscript becomes a space'
);

// --- Other backslash commands ("drop \command names sensibly") ------
assert.strictEqual(
  stripLatexForTitle('\\sqrt{x} plus \\pi'),
  'x plus pi',
  '\\sqrt{x} drops the command name and keeps the braced content; bare \\pi keeps just the word'
);
assert.strictEqual(
  stripLatexForTitle('\\theta and \\alpha'),
  'theta and alpha',
  'Greek letter commands strip the backslash and keep the word'
);

// --- Plain-text titles pass through unchanged -------------------------
assert.strictEqual(
  stripLatexForTitle('Understanding Photosynthesis'),
  'Understanding Photosynthesis',
  'plain-text titles with no LaTeX markers are untouched'
);
assert.strictEqual(
  stripLatexForTitle('The Cold War: 1947-1991'),
  'The Cold War: 1947-1991',
  'punctuation-only titles are untouched'
);

// --- Whitespace collapse ------------------------------------------------
assert.strictEqual(
  stripLatexForTitle('  Compute   the   limit  '),
  'Compute the limit',
  'repeated / leading / trailing whitespace collapses to single spaces, trimmed'
);
assert.strictEqual(
  stripLatexForTitle('lim_{x→0}   (sin x)/x'),
  'lim x→0 (sin x)/x',
  'whitespace introduced by marker stripping is itself collapsed'
);

// --- undefined / empty passthrough --------------------------------------
assert.strictEqual(stripLatexForTitle(undefined), '', 'undefined input returns empty string');
assert.strictEqual(stripLatexForTitle(''), '', 'empty input returns empty string');

console.log('All stripLatexForTitle tests passed.');
