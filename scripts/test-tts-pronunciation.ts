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

// contraction guard: y'all must not become why'all
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const out = rewriteForTTS("y'all ready for this?");
  if (out.includes('why')) { console.error('FAIL: contraction guard', out); process.exit(1); }
  console.log('OK — contraction guard');
}

// Live-session regressions 2026-07-07 (session-1783398163983): italic-markdown
// blocking anchors, verb-form gap, capital Y-bar.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('Now the intercept — what do you think *a* represents?', 'Now the intercept, what do you think ay represents?', 'italic-a-represents');
  eq('Did you mean what does *a* represent, the y-intercept?', 'Did you mean what does ay represent, the why-intercept?', 'verb-form-represent');
  eq('Y-bar is the actual average of your data.', 'why-bar is the actual average of your data.', 'capital-y-bar');
  eq('2*3*4 equals 24', '2*3*4 equals 24', 'multiplication-untouched');
  eq('a cat sat on a mat', 'a cat sat on a mat', 'article-untouched');
  console.log('OK — live-session 2026-07-07 regressions');
}

// Live-session regressions 2026-07-09 (portal-9549e3af / portal-abc8df2d):
// derivative notation — "dy" voiced as the word "die", "dy/dx" as
// "die slash dx" — and double-quoted numbers voiced as inches ("6" → "6 inch").
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('So what is dy/dx here?', 'So what is dee why over dee ex here?', 'dy/dx-fraction');
  eq('First find dx/dt and dy/dt.', 'First find dee ex over dee tee and dee why over dee tee.', 'dx/dt-dy/dt');
  eq('Now take dy and divide by dx.', 'Now take dee why and divide by dee ex.', 'bare-dy-dx-tokens');
  eq('d²y/dx² is the second derivative', 'dee squared why over dee ex squared is the second derivative', 'second-derivative');
  eq('The answer is "6" here.', 'The answer is 6 here.', 'quoted-number-no-inches');
  eq('She said "great work" today.', 'She said great work today.', 'quoted-phrase-stripped');
  eq("Don't touch apostrophes.", "Don't touch apostrophes.", 'apostrophe-untouched');
  eq('dying is not a derivative', 'dying is not a derivative', 'dy-inside-word-untouched');
  console.log('OK — live-session 2026-07-09 regressions (derivatives + quotes)');
}

// Live-session regressions 2026-07-10 (session-1783659462609): "=" voiced
// as "equal sign" ("n=12" → "n equal sign 12") and unicode subscripts
// mangled ("T₁" voiced as "T-jash").
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('along with n=12, r=5 into that formula', 'along with n equals 12, r equals 5 into that formula', 'equals-sign-spoken');
  eq('x = 4 is the answer', 'x equals 4 is the answer', 'spaced-equals');
  eq('since r=5 counts after the first term, T₁.', 'since r equals 5 counts after the first term, T 1.', 'unicode-subscript-T1');
  eq('a₀ and a₁ are the coefficients', 'a 0 and a 1 are the coefficients', 'subscript-coefficients');
  console.log('OK — live-session 2026-07-10 regressions (equals + subscripts)');
}

// Live-session regression 2026-07-11: sentence-final vocative comma made
// Cartesia over-pause ("locked in for today <pause> Praveen"). The comma
// before a capitalized sentence-final name is dropped in SPEECH only
// (captions/transcript keep the written comma — this layer never feeds
// them). Openers like "Hey Praveen, I'm Sameer" are untouched: their
// comma sits after the name, not before a name+terminator.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq("That's the full scoreboard locked in for today, Praveen. Five real shortcuts.",
     "That's the full scoreboard locked in for today Praveen. Five real shortcuts.",
     'vocative-comma-period');
  eq('Nice work, Maya!', 'Nice work Maya!', 'vocative-comma-bang');
  eq('Ready to keep going, Arjun?', 'Ready to keep going Arjun?', 'vocative-comma-question');
  eq("Hey Praveen, I'm Sameer.", "Hey Praveen, I'm Sameer.", 'opener-comma-after-name-untouched');
  eq('First, we simplify.', 'First, we simplify.', 'ordinary-clause-comma-untouched');
  eq('Thanks, everyone!', 'Thanks, everyone!', 'lowercase-after-comma-untouched');
  console.log('OK — live-session 2026-07-11 regression (vocative comma)');
}

// Live-session regression 2026-07-13: "SD" (standard deviation) voiced as
// "South Dakota" by the Cartesia normalizer. Expand the stats acronym while
// preserving GENUINE state abbreviations (year-preceded / comma-preceded).
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('The mean is 100 and the SD is 15.', 'The mean is 100 and the standard deviation is 15.', 'sd-singular');
  eq('The value is 2 SDs above the mean.', 'The value is 2 standard deviations above the mean.', 'sd-plural');
  eq('Wechsler scoring (mean=100, SD=15) is standard.', 'Wechsler scoring (mean equals 100, standard deviation equals 15) is standard.', 'sd-after-number-comma');
  eq('68% within 1 SD; 95% within 2 SD.', '68% within 1 standard deviation; 95% within 2 standard deviation.', 'sd-empirical-rule');
  // Genuine state abbreviation: year-preceded ("1890 SD" = South Dakota,
  // Wounded Knee) must be left for Cartesia to voice as the state.
  eq('the Wounded Knee massacre in 1890 SD ended it.', 'the Wounded Knee massacre in 1890 SD ended it.', 'sd-year-preceded-is-state');
  eq('The band played in Pierre, SD last night.', 'The band played in Pierre, SD last night.', 'sd-comma-preceded-is-state');
  eq('USD is the currency code.', 'USD is the currency code.', 'sd-inside-usd-untouched');
  console.log('OK — live-session 2026-07-13 regression (SD → standard deviation)');
}

// Math notation gaps (2026-07-13 audit): comparison/operator glyphs,
// superscript squared/cubed, degree sign.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('We need p ≤ 0.05 to reject.', 'We need p less than or equal to 0.05 to reject.', 'leq');
  eq('Require n ≥ 30 for the CLT.', 'Require n greater than or equal to 30 for the CLT.', 'geq');
  eq('So 0.167 ≠ 0.20 here.', 'So 0.167 not equal to 0.20 here.', 'neq');
  eq('The mean is 200 ± 2(25).', 'The mean is 200 plus or minus 2(25).', 'plus-minus');
  eq('The area is x² plus y².', 'The area is x squared plus why squared.', 'superscript-squared');
  eq('Volume scales with r³.', 'Volume scales with r cubed.', 'superscript-cubed');
  eq('Wichita, KS is at 38°N.', 'Wichita, KS is at 38 degrees N.', 'degree-latitude');
  eq('Reaction A peaks at 60°C.', 'Reaction A peaks at 60 degrees C.', 'degree-celsius');
  console.log('OK — math notation gaps 2026-07-13 (operators, superscripts, degree)');
}

// Live-session 2026-07-15 regressions: ALL-CAPS emphasis read as initialism
// ("OUT" → "O U T"), and inconsistent coefficient respelling ("a, b, c" →
// "a, bee, c" — our own \bb\b rule).
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('The energy moves OUT of the cell.', 'The energy moves out of the cell.', 'caps-out');
  eq('That is NOT the same thing.', 'That is not the same thing.', 'caps-not');
  eq('EVERY term matters here.', 'every term matters here.', 'caps-every');
  // Known-collision caps stay untouched (chemistry NO, US history US, AD/AS model).
  eq('NO is a signaling molecule.', 'NO is a signaling molecule.', 'caps-no-untouched');
  eq('The US entered the war.', 'The US entered the war.', 'caps-us-untouched');
  eq('Identify the coefficients a, b, c in the quadratic.', 'Identify the coefficients ay, bee, see in the quadratic.', 'abc-list');
  eq('Find a, b, and c first.', 'Find ay, bee, and see first.', 'abc-list-and');
  eq('Then b and c are both negative.', 'Then bee and see are both negative.', 'b-and-c');
  eq('Here c equals 9.', 'Here see equals 9.', 'c-equals');
  console.log('OK — live-session 2026-07-15 regressions (caps emphasis, a/b/c lists)');
}

// Task X1 (session portal-236c6e8f): TTS math verbalization + prosody
// smoothing. Bugs: (a) `$...$` LaTeX delimiters reaching TTS raw ("dollar
// a cubed bee circumflex 3 dollar" for $a^3 b^3$); (b) "pi" voiced as
// "pee"; (c) comma-heavy trailing tails ("let's turn it up, then").
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };

  // --- $-delimited math: the live bug's exact shape -------------------
  eq('Let me show you $a^3 b^3$ on the board.',
     'Let me show you a cubed bee cubed on the board.',
     'dollar-delimited-a3b3');
  // E4's own show_problem prompt example ("$x^2 - 4$ when $x = 3$") —
  // caret AND bare "=" both need to gate the $ strip.
  eq('So $x^2 - 4$ when $x = 3$ gives us the answer.',
     'So x squared minus 4 when x equals 3 gives us the answer.',
     'dollar-delimited-e4-prompt-example');
  // A bare "$5" price mention must NEVER be touched — no LaTeX signal
  // char in the content, so the $ gate leaves it alone even though a
  // second "$" appears later in the sentence.
  eq('It costs $5 and shipping is $10.',
     'It costs $5 and shipping is $10.',
     'dollar-price-untouched');

  // --- Exponents: ^2/^3 -> squared/cubed; other -> "to the N" ---------
  eq('The area is x^2 plus y^2.', 'The area is x squared plus why squared.', 'caret-squared');
  eq('Volume scales with r^3.', 'Volume scales with r cubed.', 'caret-cubed');
  eq('Solve for x^n in general.', 'Solve for x to the n in general.', 'caret-to-the-n');
  // Bare (non-braced, non-$-delimited) "+"/"-" inside parens is left as
  // literal text — operator wordification only applies to content we've
  // already confirmed is isolated math (a \frac/\sqrt/^{...}/_{...} brace
  // or a $-gated span); the prompt's own "speak math in words" rule is
  // what keeps ungated prose like this out of the brain's raw output.
  eq('Expand (x+1)^2 fully.', 'Expand (x+1) squared fully.', 'bare-exponent-after-parens');

  // --- Fractions: \frac -> "over" --------------------------------------
  eq('The formula uses \\frac{a}{b}.', 'The formula uses a over bee.', 'frac-over');
  eq('We need \\frac{x+1}{2} here.', 'We need x plus 1 over 2 here.', 'frac-with-plus');

  // --- Subscripts: _1 / _{n+1} -> "sub …" -------------------------------
  eq('The sequence a_1, a_2, a_3 follows.',
     'The sequence a sub 1, a sub 2, a sub 3 follows.',
     'bare-subscript-digits');
  eq('The formula is a_n equals a_1 plus n minus 1 times d.',
     'The formula is a sub n equals a sub 1 plus n minus 1 times d.',
     'bare-subscript-letter');

  // --- Common LaTeX commands: \sqrt, \times, \cdot, \div, \pm --------
  eq('Compute \\sqrt{9} and \\sqrt[3]{27}.',
     'Compute the square root of 9 and the cube root of 27.',
     'sqrt-square-and-cube-root');
  eq('Now try \\sqrt[4]{16}.', 'Now try the 4th root of 16.', 'sqrt-nth-root');
  eq('2 \\times 3 \\cdot 4 \\div 5 \\pm 1',
     '2 times 3 times 4 divided by 5 plus or minus 1',
     'math-operator-commands');

  // --- pi -> "pie" (math-context; whole-token; caps-acronym guarded) ---
  eq('pi is irrational.', 'pie is irrational.', 'pi-lowercase');
  eq('Pi is irrational.', 'Pie is irrational.', 'pi-titlecase');
  eq('\\theta plus \\pi over 2', 'theta plus pie over 2', 'pi-latex-command');
  eq('The spinning wheel landed in the pit.',
     'The spinning wheel landed in the pit.',
     'pi-not-inside-other-words');
  eq('apple pie is great.', 'apple pie is great.', 'pie-word-untouched');
  // ALL-CAPS "PI" is a likely acronym collision (principal investigator /
  // personal information) — deliberately excluded, same style as the
  // existing CAPS_EMPHASIS_WORDS known-collision list.
  eq('PI stands for personal information.',
     'PI stands for personal information.',
     'pi-allcaps-acronym-untouched');

  // --- Prosody: trailing filler-word comma smoothing --------------------
  eq("let's turn it up, then.", "let's turn it up then.", 'trailing-comma-then');
  eq('Ready to keep going, then?', 'Ready to keep going then?', 'trailing-comma-then-question');
  eq("that's the idea, right?", "that's the idea right?", 'trailing-comma-right');
  eq('Nice work, okay!', 'Nice work okay!', 'trailing-comma-okay');
  eq('We should stop, alright.', 'We should stop alright.', 'trailing-comma-alright');
  // Mid-sentence uses of the same words must stay untouched — the rule
  // only fires directly before a sentence terminator.
  eq('Then we simplify the right side.',
     'Then we simplify the right side.',
     'filler-word-mid-sentence-untouched');
  eq('First, we simplify.', 'First, we simplify.', 'ordinary-comma-still-untouched');

  console.log('OK — Task X1 (math verbalization, pi, prosody smoothing)');
}

// Task X8: roman numerals in document citations ("Article I" → "Article
// one"), legal case-name "v." ("McCulloch v. Maryland" → "... versus ..."),
// and (separately, tested in scripts/test-question-gist-text.ts) the Q-pin
// markdown-emphasis leak.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };

  // --- Roman numerals: keyword-gated conversion ------------------------
  eq('Article I establishes the legislative branch.',
     'Article one establishes the legislative branch.',
     'article-1');
  eq('Article II covers the executive branch.',
     'Article two covers the executive branch.',
     'article-2');
  eq('Article III sets up the judiciary.',
     'Article three sets up the judiciary.',
     'article-3');
  eq('Title IX bans sex discrimination in education.',
     'Title nine bans sex discrimination in education.',
     'title-9');
  eq('Section IV outlines succession.',
     'Section four outlines succession.',
     'section-4');
  eq('Amendment XIV guarantees equal protection.',
     'Amendment fourteen guarantees equal protection.',
     'amendment-14');
  eq('Amendment XIX gave women the vote.',
     'Amendment nineteen gave women the vote.',
     'amendment-19');
  eq('Amendment XX changed the inauguration date.',
     'Amendment twenty changed the inauguration date.',
     'amendment-20');
  eq('Chapter VII deals with collective security.',
     'Chapter seven deals with collective security.',
     'chapter-7');
  eq('Act III begins the climax.',
     'Act three begins the climax.',
     'act-3');
  eq('Part VI of the reading is due Friday.',
     'Part six of the reading is due Friday.',
     'part-6');
  // Bare pronoun "I" — NEVER touched (no citation keyword precedes it).
  eq('I think the answer is 4.', 'I think the answer is 4.', 'bare-pronoun-i-untouched');
  eq('Do you know what I mean?', 'Do you know what I mean?', 'bare-pronoun-i-mid-sentence');
  // Documented edge case: once the keyword gates it, ANY following word
  // still reads as the document sense — "Article I said" is grammatically
  // implausible as "Article, I said", so this is intentionally converted.
  eq('Article I says Congress holds legislative power.',
     'Article one says Congress holds legislative power.',
     'article-followed-by-verb-still-document-sense');

  // --- Legal "v." case names --------------------------------------------
  eq('McCulloch v. Maryland established implied powers.',
     'McCulloch versus Maryland established implied powers.',
     'mcculloch-v-maryland');
  eq('Marbury v. Madison created judicial review.',
     'Marbury versus Madison created judicial review.',
     'marbury-v-madison');
  eq('Brown v. Board of Education ended segregation.',
     'Brown versus Board of Education ended segregation.',
     'brown-v-board');
  eq('The United States v. Nixon case limited executive privilege.',
     'The United States versus Nixon case limited executive privilege.',
     'united-states-v-nixon-multiword-left-side');
  // Not gated: lowercase left side ("v." as some other abbreviation) is
  // left untouched — the shape requires a capitalized word on both sides.
  eq('see page 5 v. page 6 for the comparison.',
     'see page 5 v. page 6 for the comparison.',
     'lowercase-v-untouched');

  console.log('OK — Task X8 (roman numeral citations, legal "v.")');
}
