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
// Round-30 note: variable-'a' now emits capital "A" (Cartesia read "ay"
// with an article-'a' vowel live) — pins updated from the old "ay" form.
assert.strictEqual(
  rewriteForTTS('Here a represents the number of apples.'),
  'Here A represents the number of apples.',
  '"a represents" anchors the variable reading of a'
);
assert.strictEqual(
  rewriteForTTS('Substitute a, the number of apples, and y, the weight, into the formula.'),
  'Substitute A, the number of apples, and why, the weight, into the formula.',
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
  'Find the values of A and bee.',
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
  eq('Now the intercept — what do you think *a* represents?', 'Now the intercept, what do you think A represents?', 'italic-a-represents');
  eq('Did you mean what does *a* represent, the y-intercept?', 'Did you mean what does A represent, the why-intercept?', 'verb-form-represent');
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
  // Live-session 2026-07-16 (session-1784194326500, student named "baby"):
  // the brain quote-wrapped the lowercase name — `Hey, "baby"!` — which the
  // capitalized-bare-name rule can't see. Quoted single word before a
  // terminator is a vocative regardless of case: drop comma AND quotes.
  eq('Hey, "baby"! Basics sound perfect.', 'Hey baby! Basics sound perfect.', 'vocative-quoted-lowercase');
  eq('Nice work, "Maya"!', 'Nice work Maya!', 'vocative-quoted-capitalized');
  // (Double quotes are always stripped for speech by the long-standing
  // global rule — the guard here is that the mid-sentence COMMA survives
  // when the quoted word is not terminator-adjacent.)
  eq('Remember, "slope" means steepness.', 'Remember, slope means steepness.', 'quoted-word-not-sentence-final-keeps-comma');
  console.log('OK — live-session 2026-07-16 regression (quoted vocative)');
  // 2026-07-19: name-aware vocative — with the session's studentName
  // threaded in, ANY comma directly before the name drops, whatever the
  // case/quoting, sentence-final or bracketed mid-sentence. Shape rules
  // above stay as the net for sessions with no name.
  const eqN = (inp, name, want, label) => {
    const got = rewriteForTTS(inp, { studentName: name });
    if (got !== want) { console.error(`FAIL ${label}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eqN('Nice work, baby.', 'baby', 'Nice work baby.', 'name-bare-lowercase');
  eqN('Hey, "baby"! Basics sound perfect.', 'baby', 'Hey baby! Basics sound perfect.', 'name-quoted-lowercase');
  eqN('Okay, baby, let\'s go.', 'baby', 'Okay baby, let\'s go.', 'name-mid-sentence-vocative');
  eqN('Ready to keep going, ROKON?', 'Rokon', 'Ready to keep going ROKON?', 'name-case-insensitive');
  // A name that is also a common word must not eat clause commas when the
  // word is doing its ordinary grammatical job (followed by a word).
  eqN('Yes, will you try the next one?', 'will', 'Yes, will you try the next one?', 'name-homograph-clause-comma-kept');
  eqN('Thanks, everyone!', 'baby', 'Thanks, everyone!', 'name-other-word-untouched');
  console.log('OK — 2026-07-19 name-aware vocative comma');
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
  // Physics-coverage round (2026-07-18) upgraded °C to speak the scale name
  // (was "60 degrees C") — pin deliberately updated.
  eq('Reaction A peaks at 60°C.', 'Reaction A peaks at 60 degrees Celsius.', 'degree-celsius');
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
     // Round-19: 'a' before cubed/squared with a math continuation is the
     // VARIABLE (was pinned as the bare article pre-19 — the exact
     // mispronunciation reported live 2026-07-17).
     'Let me show you A cubed bee cubed on the board.',
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
  // Round 28 (b7a6872e): variables inside math are letter-spelled, so the
  // 'a' numerator speaks "ay" like every other bare math letter — the old
  // 'a over bee' expectation predates that rule.
  eq('The formula uses \\frac{a}{b}.', 'The formula uses A over bee.', 'frac-over');
  eq('We need \\frac{x+1}{2} here.', 'We need x plus 1 over 2 here.', 'frac-with-plus');

  // --- Subscripts: _1 / _{n+1} -> "sub …" -------------------------------
  eq('The sequence a_1, a_2, a_3 follows.',
     'The sequence a 1, a 2, a 3 follows.',
     'bare-subscript-digits');
  eq('The formula is a_n equals a_1 plus n minus 1 times d.',
     'The formula is a sub n equals a 1 plus n minus 1 times d.',
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

// Agenda round 4: sub-question labels "part a" spoken as the letter NAME
// ("part ay"), not the article/schwa. Uses the file's phonetic respelling
// idiom (a→ay, b→bee, …). Letters a–h only; "partial" and similar never match.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  // Agenda round 5: 'a' emits the capital GLYPH 'A' (phonetic 'ay' was voiced
  // as the word "aye"); b–h keep their respellings.
  eq('Now do part a.', 'Now do part A.', 'part-a');
  eq('Look at part (b) next.', 'Look at part bee next.', 'part-paren-b');
  eq('Part c asks for the slope.', 'Part see asks for the slope.', 'Part-c-capitalized');
  eq('Try part d then part e.', 'Try part dee then part ee.', 'part-d-and-part-e');
  eq('Both parts f and g.', 'Both parts ef and g.', 'parts-f-plural');
  eq('Answer question h now.', 'Answer question aitch now.', 'question-h');
  // Non-matches: "partial" (no space after "part") stays a word; a letter
  // outside a–h (roman-numeral / citation territory) is left alone.
  eq('The partial derivative here.', 'The partial derivative here.', 'partial-untouched');
  // Bare "a" as the ARTICLE must never rewrite (round-4 tightening): a fresh
  // noun phrase follows, not a label continuation.
  eq('For the most part a student sees this.', 'For the most part a student sees this.', 'article-a-prose');
  eq('They question a witness.', 'They question a witness.', 'article-a-witness');
  // …but label-shaped continuations still do.
  // (the pipeline's dash rule later renders the em dash as a comma pause)
  eq("Let's start with part a — what expression?", "Let's start with part A, what expression?", 'part-a-dash');
  eq('Part a asks for the setup.', 'Part A asks for the setup.', 'part-a-verb');
  eq('Try part a of the problem.', 'Try part A of the problem.', 'part-a-of');

  console.log('OK — Agenda round 4 (part-letter TTS)');
}

// X8 review (C1): case-insensitivity broke the never-bare-I invariant.
// ROMAN_NUMERAL_RE used to run with the 'gi' flag, so a LOWERCASE
// keyword-shaped word immediately before a bare "I" (the pronoun) matched
// the citation pattern and converted it — "The section I wrote" became
// "the section one wrote" (verified live). Fix: the keyword must match its
// literal Title-Case spelling (or an explicit ALL-CAPS variant) — no
// blanket case-insensitivity.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };

  // The exact live false-positive: lowercase "section" + bare "I" (pronoun)
  // must NEVER be treated as a citation.
  eq('The section I wrote needs edits.',
     'The section I wrote needs edits.',
     'c1-lowercase-section-bare-i-untouched');
  eq("Let's part I guess.",
     "Let's part I guess.",
     'c1-lowercase-part-bare-i-untouched');
  eq('the amendment I mentioned earlier is important.',
     'the amendment I mentioned earlier is important.',
     'c1-lowercase-amendment-bare-i-untouched');
  // Title-Case keyword still converts (existing behavior preserved).
  eq('Article I establishes the legislative branch.',
     'Article one establishes the legislative branch.',
     'c1-titlecase-still-converts');
  // ALL-CAPS keyword variant: explicitly supported and tested (documented
  // choice — convert, matching the shape of a genuine all-caps citation
  // rather than case-insensitive matching of arbitrary case).
  eq('ARTICLE II covers the executive branch.',
     'ARTICLE two covers the executive branch.',
     'c1-allcaps-keyword-converts');
  eq('AMENDMENT XIV guarantees equal protection.',
     'AMENDMENT fourteen guarantees equal protection.',
     'c1-allcaps-amendment-converts');
  // Mixed / lowercase keyword spellings other than Title-Case or ALL-CAPS
  // are NOT converted — only the two explicit shapes are supported.
  eq('aRTICLE II covers the executive branch.',
     'aRTICLE II covers the executive branch.',
     'c1-mixed-case-keyword-untouched');

  console.log('OK — X8 review C1 (capitalized roman-numeral gate)');
}

// X8 review (I1): elided-keyword lists. "Amendment I, II, and III" only
// converted the first numeral (I) — II and III, in the same comma/and
// list, were left unconverted. Fix: convert CONTINUATION numerals in the
// same list too (II..XX only — a bare continuation "I" is NEVER converted,
// since it's indistinguishable from the pronoun).
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };

  eq('Amendment I, II, and III were ratified together.',
     'Amendment one, two, and three were ratified together.',
     'i1-elided-list-converts-continuations');
  eq('Article I, II, III, and IV set up the three branches and elections.',
     'Article one, two, three, and four set up the three branches and elections.',
     'i1-elided-list-four-items');
  eq('Section IV and V cover succession and vacancies.',
     'Section four and five cover succession and vacancies.',
     'i1-elided-list-no-oxford-comma');
  // Documented choice: a bare "I" is NEVER treated as a continuation
  // numeral (pronoun ambiguity) — the list-continuation scan stops there,
  // even though it costs the (rare) numerals after it.
  eq('Article II, I, and III were debated at length.',
     'Article two, I, and III were debated at length.',
     'i1-bare-i-continuation-never-converts');

  console.log('OK — X8 review I1 (elided roman-numeral list continuations)');
}

// Task Y3: bare minus between math operands ("2 - 2" spoken with the minus
// SKIPPED — live bug) and unicode superscript exponents beyond ²/³ ("a²"
// voiced as "a square"/"a two" — X1 only handled caret "^2", not the unicode
// glyph outside a $-gated span).
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };

  // --- (a) Bare minus: spaced hyphen between numeric/variable operands ---
  eq('2 - 2 is 0.', '2 minus 2 is 0.', 'bare-minus-digits');
  eq('x - 4 is negative if x is small.', 'x minus 4 is negative if x is small.', 'bare-minus-var-digit');
  eq('4 - x could be negative.', '4 minus x could be negative.', 'bare-minus-digit-var');
  eq('n - 1 terms remain.', 'n minus 1 terms remain.', 'bare-minus-letter-digit');
  eq('12.5 - 3.25 is the difference.', '12.5 minus 3.25 is the difference.', 'bare-minus-decimals');
  // Composes with tier-1 letter respelling (y -> why) — the minus rewrite
  // runs before ALL_REPLACEMENTS, so both standalone y's still get respelled.
  eq('Solve y - 2 for y.', 'Solve why minus 2 for why.', 'bare-minus-composes-with-y-respelling');
  // Chained operators in one sentence.
  eq('2 - 2 - 2 is negative 2.', '2 minus 2 minus 2 is negative 2.', 'bare-minus-chained');

  // Hyphenated words (no surrounding spaces) must NEVER be touched.
  eq('That is a well-known fact.', 'That is a well-known fact.', 'hyphenated-word-untouched');
  eq('This is a state-of-the-art method.', 'This is a state-of-the-art method.', 'multi-hyphen-word-untouched');

  // Unspaced numeric ranges ("3-5") are ambiguous with no space signal —
  // documented decision: leave untouched (could be a page/date range, not
  // necessarily subtraction).
  eq('Read pages 3-5 tonight.', 'Read pages 3-5 tonight.', 'unspaced-range-untouched-ambiguous');
  // Documented tradeoff: a SPACED hyphen between two numeric operands is
  // still converted even when the surrounding prose reads as a range — the
  // brief's call is that a spaced hyphen between operands is the STRONGEST
  // signal available and outweighs the range reading (accepted, rare case).
  eq('Read pages 3 - 5 tonight.', 'Read pages 3 minus 5 tonight.', 'spaced-range-still-converts-documented-tradeoff');

  // Prose dashes between ordinary words (not numeric/single-letter operands)
  // must never be touched, spaced or not — the operand-shape gate alone
  // rules these out without any extra prose-detection.
  eq('The plan - which was risky - failed anyway.',
     'The plan - which was risky - failed anyway.',
     'prose-dash-between-words-untouched');

  // Em-dash prose (already handled by EMDASH_REPLACEMENTS, a different
  // unicode glyph) is unaffected by the new bare-minus rule.
  eq("That's a clean session — Praveen — you walked in confident.",
     "That's a clean session, Praveen, you walked in confident.",
     'emdash-prose-still-comma-not-minus');

  // --- (b) Unicode superscript exponents ---------------------------------
  eq('Compute a² for this problem.', 'Compute a squared for this problem.', 'unicode-superscript-2-squared');
  eq('Volume scales with x³.', 'Volume scales with x cubed.', 'unicode-superscript-3-cubed');
  // Other single superscript digits (not 2/3) -> "to the N".
  eq('Solve for x⁴.', 'Solve for x to the 4.', 'unicode-superscript-4-to-the-n');
  eq('T⁰ equals 1.', 'T to the 0 equals 1.', 'unicode-superscript-0-to-the-n');
  eq('Find x⁵ next.', 'Find x to the 5 next.', 'unicode-superscript-5-to-the-n');
  eq('Then x⁹ appears.', 'Then x to the 9 appears.', 'unicode-superscript-9-to-the-n');
  // Multi-digit superscript RUNS read as one number, not digit-by-digit —
  // "to the 12", never "to the 1 squared" or "to the 1 to the 2".
  eq('x¹² is large.', 'x to the 12 is large.', 'unicode-superscript-run-to-the-12');
  eq('r²¹ is even larger.', 'r to the 21 is even larger.', 'unicode-superscript-run-to-the-21');
  // Standalone superscript ¹ (exponent 1, not part of a run) -> "to the 1".
  eq('x¹ is just x.', 'x to the 1 is just x.', 'unicode-superscript-1-to-the-n');

  console.log('OK — Task Y3 (bare minus between operands, unicode superscript exponents)');
}

// Task Y3 review findings (round14-chips-qpin-pace):
//  1. Footnote superscripts ("document¹", "citizens²" — common in
//     history/lit excerpts) were misread as exponents.
//  2. Year ranges ("1941 - 1945") were misread as subtraction — a live
//     regression in a history-heavy catalog.
//  3. Single-letter chains ("A - B - C") read more like an enumerated list
//     than subtraction.
{
  const { rewriteForTTS } = require('../src/lib/tutor/voice/tts-pronunciation');
  const eq = (inp, want, name) => {
    const got = rewriteForTTS(inp);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };

  // --- (1) Footnote superscripts: gated on the preceding character's shape
  // A superscript directly after a MULTI-LETTER word is a footnote marker,
  // not an exponent — must stay untouched.
  eq('The document¹ argues for federalism.',
     'The document¹ argues for federalism.',
     'footnote-after-multiletter-word-untouched');
  eq('All citizens² deserve equal protection.',
     'All citizens² deserve equal protection.',
     'footnote-after-plural-word-untouched');
  // A superscript after a single-letter variable, a bare digit, or a
  // closing paren/bracket still converts — those are the genuine exponent
  // shapes ("m²" is a unit — "m" is a single letter, so it converts, and
  // that's the correct reading).
  eq('Compute x² for this problem.', 'Compute x squared for this problem.', 'single-letter-var-still-converts');
  eq('The area is m² of floor space.', 'The area is m squared of floor space.', 'single-letter-unit-still-converts');
  eq('Expand (x+1)² fully.', 'Expand (x+1) squared fully.', 'closing-paren-still-converts');
  eq('The value 5² is 25.', 'The value 5 squared is 25.', 'digit-anchor-still-converts');

  // --- (2) Year ranges: exclude the minus conversion when BOTH operands
  // are 4-digit numbers (year-like) — the hyphen is left for TTS to read as
  // a natural pause/range.
  eq('The war lasted from 1941 - 1945.',
     'The war lasted from 1941 - 1945.',
     'year-range-untouched');
  eq('2 - 2 is 0.', '2 minus 2 is 0.', 'non-year-digits-still-convert');
  eq('x - 4 is negative if x is small.', 'x minus 4 is negative if x is small.', 'letter-digit-still-converts');
  eq('400 - 40 is 360.', '400 minus 40 is 360.', 'mixed-digit-count-still-converts');
  // 2-digit pair (e.g. exam scores) is NOT year-shaped — still converts,
  // documented accepted call per the brief.
  eq('21 - 14 is 7.', '21 minus 14 is 7.', 'two-digit-pair-still-converts');

  // --- (3) Single-letter chains: 3+ single-letter operands chained read as
  // an enumerated list, not subtraction — left untouched. A numeric chain
  // ("2 - 2 - 2", tested above) is unaffected — this guard only fires when
  // ALL chained operands are single letters.
  eq('Compare A - B - C as your options.',
     'Compare A - B - C as your options.',
     'single-letter-chain-untouched');

  console.log('OK — Task Y3 review findings (footnote superscripts, year ranges, letter chains)');
}

// --- Round-15 Issue 4 (2026-07-16): unspaced minus inside $...$ ---------
// Live AP Calc session: "$(x-2)$" reached Cartesia raw — the $ gate only
// fired on ^ _ \ = signal chars, and the prose bare-minus rule requires
// spaces on both sides. A $-span with an operator BETWEEN operand-shaped
// tokens is math: strip the $ AND wordify the minus.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('Factor $(x-2)$ completely.',
     'Factor (x minus 2) completely.',
     'dollar-unspaced-minus-parens');
  eq('The root of $x-2$ is at 2.',
     'The root of x minus 2 is at 2.',
     'dollar-unspaced-minus-bare');
  eq('Now $x+3$ shifts left.',
     'Now x plus 3 shifts left.',
     'dollar-unspaced-plus');
  // The pre-fix cases must keep working.
  eq('So $x = 3$ still works.',
     'So x equals 3 still works.',
     'dollar-equals-regression');
  // Currency guard: no operand-operator-operand inside → untouched.
  eq('It costs $5 and shipping is $10.',
     'It costs $5 and shipping is $10.',
     'currency-still-untouched');

  console.log('OK — Round-15 Issue 4 ($-span unspaced minus)');
}

// --- Round-15 Issue 5 (2026-07-16): element symbols read as words -------
// Live AP Psych neuron lesson: "Na"/"Na+" voiced as the word "nah". No
// chemistry handling existed in the TTS layer. Guarded expansions in
// rewriteDomainAcronyms, mirroring the SD → "standard deviation" precedent:
// bare K is NEVER touched (vitamin K, grade K, "$5K"); K only expands with
// a charge sign. Case-sensitive on purpose.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('Na+ floods into the cell.',
     'sodium floods into the cell.',
     'na-plus-expands');
  eq('The Na channels open first.',
     'The sodium channels open first.',
     'bare-na-expands');
  eq('K+ flows out to repolarize.',
     'potassium flows out to repolarize.',
     'k-plus-expands');
  eq('Vitamin K helps clotting.',
     'Vitamin K helps clotting.',
     'bare-k-untouched');
  eq('The Na-K pump restores the gradient.',
     'The sodium potassium pump restores the gradient.',
     'na-k-pump-expands');
  eq('Nathan asked about the sodium channel.',
     'Nathan asked about the sodium channel.',
     'word-boundary-guard');

  console.log('OK — Round-15 Issue 5 (element symbols)');
}

// --- Round-16 Issue 3 (2026-07-17): single-letter $x$ spans ------------
// Live AP Calc conjugate turn: "numerator's just $x$, denominator's
// $x(x+4)$" — "$x$" has no signal char and no operand-op-operand shape,
// so the gate left it and Cartesia spoke the dollar signs. A paired
// $<single letter>$ is essentially never currency — unwrap it.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq("The numerator's just $x$, so cancel it.",
     "The numerator's just x, so cancel it.",
     'single-letter-var-unwraps');
  eq('Watch the $n$ in the exponent.',
     'Watch the n in the exponent.',
     'single-letter-n-unwraps');
  // Currency must still survive.
  eq('It costs $5 and shipping is $10.',
     'It costs $5 and shipping is $10.',
     'currency-still-untouched-r16');

  console.log('OK — Round-16 Issue 3 (single-letter $x$ spans)');
}

// --- Round-19 (2026-07-17): 'a' before squared/cubed is the variable -----
// Live: "Now — a squared minus b squared is exactly…" spoke 'a' as the
// article. squared/cubed followed by a math continuation anchors it.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('Now, a squared minus b squared is exactly that pattern.',
     'Now, A squared minus bee squared is exactly that pattern.',
     'a-squared-minus-anchors');
  eq('So a cubed b cubed factors nicely.',
     'So A cubed bee cubed factors nicely.',
     'a-cubed-letter-anchors');
  // The article must survive when "squared" is an adjective.
  eq('Draw a squared grid on the paper.',
     'Draw a squared grid on the paper.',
     'a-squared-adjective-untouched');

  console.log('OK — Round-19 (a-before-squared variable respell)');
}

// --- Round-19b (2026-07-17): user stress-test cases for 'a' respell -----
// Four grammatically unambiguous variable-'a' shapes that the anchor
// whitelist missed. Each is impossible as an English article ("a is",
// "the a", "a when", sentence-final "over a"), so anchoring them cannot
// corrupt prose.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('a squared can be taken common from the expression.',
     'A squared can be taken common from the expression.',
     'a-squared-verb-continuation');
  eq('a is a variable in the expression.',
     'A is a variable in the expression.',
     'a-is-a-variable (second a stays the article)');
  eq('the a in the expression is a variable.',
     'the A in the expression is a variable.',
     'the-a-is-the-variable (second a stays)');
  eq('only a when divided by b gives b over a.',
     'only A when divided by bee gives bee over A.',
     'a-when + sentence-final over-a');
  // Article guards must survive.
  eq('Draw a squared grid on the paper.',
     'Draw a squared grid on the paper.',
     'adjective-squared-still-article');
  eq('He walked over a bridge to think.',
     'He walked over a bridge to think.',
     'over-a-noun-still-article');

  console.log('OK — Round-19b (a-variable stress cases)');
}

// --- Round-20 (2026-07-17): $-span math-by-default + in-span respelling --
// Design debate outcome: the brain DECLARES pronunciation intent by
// wrapping spoken math in $...$ (the convention it already uses on cards).
// The TTS gate flips to math-by-default for paired spans — the only
// exclusion is the currency pairing-artifact shape (digit-led inner with
// prose words and no math signal). Inside a span, ambiguity doesn't exist
// by construction: single letters ARE variables and respell
// unconditionally (a→ay, b→bee, y→why, d→dee; capitals too).
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  // Every heuristic-net letter, declared:
  eq('Watch how $a$ behaves here.', 'Watch how A behaves here.', 'span-a');
  eq('Now $b$ carries the sign.', 'Now bee carries the sign.', 'span-b');
  eq('And $y$ is the output.', 'And why is the output.', 'span-y');
  eq('Angle $A$ is bigger than angle $B$.', 'Angle A is bigger than angle bee.', 'span-capitals');
  eq('So $a^2 - b^2$ factors as a difference of squares.',
     'So A squared minus bee squared factors as a difference of squares.',
     'span-expression-multi-letter');
  // The lurking derivative leak: rewriteDerivatives used to run BEFORE the
  // $-gate, leaving "dee why over dee ex" inside dollars with no signal.
  eq('Compute $dy/dx$ for this curve.', 'Compute dee why over dee ex for this curve.', 'span-derivative-no-leak');
  eq('Here $d$ is the differential.', 'Here dee is the differential.', 'span-d');
  // Flip default: even a signal-less wrapped word sheds its dollars —
  // never spoken as "dollar".
  eq('The $profit$ term drops out.', 'The profit term drops out.', 'span-flip-default-strips');
  // Currency pairing-artifacts stay untouched (the ONLY exclusion):
  eq('It costs $5 and shipping is $10.', 'It costs $5 and shipping is $10.', 'currency-classic');
  eq('Choose between $5 and $8 per seat.', 'Choose between $5 and $8 per seat.', 'currency-between');
  // Un-wrapped prose still rides the heuristic net (unchanged):
  eq('Now, a squared minus b squared is exactly that pattern.',
     'Now, A squared minus bee squared is exactly that pattern.',
     'unwrapped-net-still-works');

  console.log('OK — Round-20 ($-span math-by-default + in-span respell)');
}

// --- Round-21 (2026-07-17, session portal-83b4bb89): complex declared spans
// Rule 3b made the brain wrap heavily; the verbalizer met \lim, \to, \dfrac
// and left raw LaTeX in speech ("\\lim sub x\\to ay [f(x) plus g(x)]").
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('if $\\lim_{x\\to a} f(x) = L$, what should $\\lim_{x\\to a} [f(x) + g(x)]$ equal?',
     'if the limit as x approaches A of f of x equals L, what should the limit as x approaches A of f of x plus jee of x equal?',
     'lim-sum-law-span');
  eq('what do you think $\\lim_{x\\to a} [c \\cdot f(x)]$ should equal?',
     'what do you think the limit as x approaches A of c times f of x should equal?',
     'lim-constant-multiple-span');
  eq('the quotient becomes $\\dfrac{5 \\cdot 6}{5}$.',
     'the quotient becomes 5 times 6 over 5.',
     'dfrac-span');
  eq('we want $\\lim_{x\\to 2} \\dfrac{f(x)\\cdot g(x)}{g(x) - 1}$.',
     'we want the limit as x approaches 2 of f of x times jee of x over jee of x minus 1.',
     'lim-dfrac-composite-span');
  eq('Quotient works only when $M \\neq 0$.',
     'Quotient works only when M not equal to 0.',
     'neq-regression');
  // Missing space after a sentence-joining period ("…$L \cdot M$.Same…").
  eq('the product of the limits — $L \\cdot M$.Same pattern every time.',
     'the product of the limits, L times M. Same pattern every time.',
     'period-capital-space');

  console.log('OK — Round-21 (lim/dfrac/f-of-x verbalization)');
}

// --- Round-22 (2026-07-17, sessions portal-cbd93b08 / portal-b35f5553) --
// In-span variable PRODUCTS: "ab" spoken as in "cab"; adjacent paren
// groups "(x+2)(x-2)" spoken with no operator between them.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('using $a^3 - b^3 = (a-b)(a^2+ab+b^2)$ here.',
     'using A cubed minus bee cubed equals (A minus bee) times (A squared plus A bee plus bee squared) here.',
     'ab-product-splits');
  eq('factor as $(x+2)(x-2)$ first.',
     'factor as (x plus 2) times (x minus 2) first.',
     'adjacent-parens-times');
  eq('the term $xy$ appears twice.',
     'the term x why appears twice.',
     'xy-product-splits');
  // Known words/functions inside spans must NOT split.
  eq('so $\\sin x$ stays put.', 'so sine x stays put.', 'sin-not-split');

  console.log('OK — Round-22 (variable products + adjacent parens)');
}

// --- Round-23 (2026-07-18, session portal-6b84012b) --------------------
// Primes and function-inverse notation. User heard "fe"/"fef"/"fe-x" for
// $f'(x)$ (apostrophe breaks the f( function-application match, span goes
// to Cartesia raw), "fe-one" for $f'(1)$, "ha-one" for $h'(1)$, and
// "f to the minus one two" for $f^{-1}(2)$ (general exponent rule — right
// for x^{-1}, wrong for a function letter).
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq("the derivative $f'(x)$ gives the slope.",
     'the derivative f prime of x gives the slope.',
     'f-prime-of-x');
  eq("evaluate $h'(1)$ directly.",
     'evaluate h prime of 1 directly.',
     'h-prime-of-1');
  eq("that gives $f^{-1}(2)$ here.",
     'that gives f inverse of 2 here.',
     'f-inverse-of-2');
  eq('write $f^{-1}$ first.',
     'write f inverse first.',
     'bare-f-inverse');
  eq("concavity via $f''(x)$ here.",
     'concavity via f double prime of x here.',
     'f-double-prime-of-x');
  // The exact transcript formula: nested inverse inside a prime's argument
  // inside a \dfrac denominator.
  eq("so $h'(1) = \\dfrac{1}{f'(f^{-1}(2))}$ by the formula.",
     'so h prime of 1 equals 1 over f prime of f inverse of 2 by the formula.',
     'nested-inverse-prime-dfrac');
  eq("and $h'(x) = \\dfrac{1}{1+x^2}$ follows.",
     'and h prime of x equals 1 over 1 plus x squared follows.',
     'h-prime-formula');
  // Guards: non-function bases keep the exponent reading; plain function
  // application still reads "of"; prose contractions are untouched.
  eq('but $x^{-1}$ means the reciprocal.',
     'but x to the minus 1 means the reciprocal.',
     'x-to-the-minus-1-kept');
  eq('so $h(x)$ still reads naturally.',
     'so h of x still reads naturally.',
     'h-of-x-still-works');
  eq("I'm sure you don't mind, let's go.",
     "I'm sure you don't mind, let's go.",
     'contractions-untouched');

  console.log('OK — Round-23 (primes + function inverses)');
}

// --- Round-25 (2026-07-18, sessions portal-ef9e8eff / portal-551f475c) --
// The in-span variable-product splitter shredded words OTHER rules emit:
// du → rewriteDerivatives "dee you" → splitter doesn't know "you" →
// "dee why o u" (heard live); $x - \mu$ → "mu" → "m u" (heard live).
// Every VAR_SPOKEN output and short Greek name must be split-proof.
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('the integral of $u^5 \\, du$ now.',
     'the integral of u to the 5 dee you now.',
     'du-dee-you');
  eq('so $\\int u^5 \\, du$ becomes that.',
     'so the integral of u to the 5 dee you becomes that.',
     'integral-du');
  eq('What is $x - \\mu$ here?',
     'What is x minus mu here?',
     'mu-not-split');
  eq('then $dv = e^x \\, dx$ works.',
     'then dee vee equals e to the x dee ex works.',
     'dv-dee-vee');
  eq('so $\\phi$ appears in the golden ratio.',
     'so phi appears in the golden ratio.',
     'phi-not-split');

  console.log('OK — Round-25 (spelled-letter + short-Greek split guards)');
}

// --- Round 28: mechanism slashes, WWI/WWII, dotted initialisms,
// unspaced superscript minus, chunker abbreviation guard --------------
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  // Mechanism-token alternatives (live: "slash" voiced in orgo session).
  eq('Is it SN1/SN2 or E1/E2 here?', 'Is it SN1 or SN2 or E1 or E2 here?', 'sn1-sn2-slash');
  eq('SN1/SN2/E1/E2 all compete.', 'SN1 or SN2 or E1 or E2 all compete.', 'mechanism-chain');
  eq('The cis/trans isomers differ.', 'The cis or trans isomers differ.', 'cis-trans-pair');
  eq('Compare the acid/base behavior.', 'Compare the acid or base behavior.', 'acid-base-pair');
  // Negative guards: fractions, ratios, dates untouched.
  eq('Add 9/11 to your history notes.', 'Add 9/11 to your history notes.', 'date-slash-untouched');
  eq('The P/E ratio matters.', 'The P/E ratio matters.', 'pe-ratio-untouched');
  // WWI / WWII word forms and roman citation form.
  eq('WWI started in 1914, WWII in 1939.', 'World War One started in 1914, World War Two in 1939.', 'wwi-wwii');
  eq('WW1 and WW2 reshaped Europe.', 'World War One and World War Two reshaped Europe.', 'ww1-ww2-digit');
  eq('World War I ended in 1918.', 'World War one ended in 1918.', 'world-war-roman-i');
  eq('World War II followed.', 'World War two followed.', 'world-war-roman-ii');
  eq('The war I fought was different.', 'The war I fought was different.', 'war-pronoun-guard');
  // Dotted initialisms: internal periods must not read as sentence ends.
  eq('The U.S. economy grew.', 'The U S economy grew.', 'us-mid-sentence');
  eq('She moved to Washington, D.C. last year.', 'She moved to Washington, D C last year.', 'dc-mid-sentence');
  eq('They visited the U.S. Britain came later.', 'They visited the U S. Britain came later.', 'us-sentence-final-keeps-period');
  eq('Meet me at 9 a.m. tomorrow.', 'Meet me at 9 AM tomorrow.', 'am-expansion');
  eq('The U.S.S.R. dissolved in 1991.', 'The U S S R dissolved in 1991.', 'ussr');
  eq('John F. Kennedy won in 1960.', 'John F. Kennedy won in 1960.', 'middle-initial-untouched');
  eq('So the answer is option B. Try the next one.', 'So the answer is option B. Try the next one.', 'single-letter-sentence-untouched');
  // Unspaced superscript minus (sibling of the audit residual).
  eq('Factor x²-4 now.', 'Factor x squared minus 4 now.', 'unspaced-sup-minus');
  eq('Read pages 3-5 tonight.', 'Read pages 3-5 tonight.', 'plain-range-untouched');
  // Idempotence (T4 convention) on the new outputs.
  eq('SN1 or SN2 or E1 or E2 all compete.', 'SN1 or SN2 or E1 or E2 all compete.', 'mechanism-idempotent');
  eq('The U S economy grew.', 'The U S economy grew.', 'us-idempotent');
  eq('World War One started in 1914.', 'World War One started in 1914.', 'wwi-idempotent');
  console.log('OK — Round-28 (mechanism slashes, WWI, dotted initialisms, unspaced sup-minus)');
}

// --- Round 28: SentenceBuffer must not split dotted abbreviations ----
{
  // Dynamic import keeps claude-brain (client-heavy module) out of the
  // top-level import graph unless this section runs.
  void (async () => {
    const { SentenceBuffer } = await import('../src/lib/tutor/voice/claude-brain');
    const feed = (text: string): string[] => {
      const sb = new SentenceBuffer();
      const out = sb.push(text);
      const tail = sb.flush();
      if (tail) out.push(tail);
      return out;
    };
    const expectSentences = (input: string, want: string[], name: string) => {
      const got = feed(input);
      if (JSON.stringify(got) !== JSON.stringify(want)) {
        console.error(`FAIL ${name}:\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`);
        process.exit(1);
      }
    };
    expectSentences(
      'The capital city we are discussing is Washington, D.C. It became the center of power.',
      ['The capital city we are discussing is Washington, D.C. It became the center of power.'],
      'chunker-dc-no-split',
    );
    expectSentences(
      'The meeting starts at about nine a.m. Everyone should be there on time.',
      ['The meeting starts at about nine a.m. Everyone should be there on time.'],
      'chunker-am-no-split',
    );
    expectSentences(
      'The U.S. entered the war in 1917. That changed everything for the allies.',
      ['The U.S. entered the war in 1917.', 'That changed everything for the allies.'],
      'chunker-us-real-boundary-still-splits',
    );
    expectSentences(
      'This first sentence is long enough to split. This second one is too, clearly.',
      ['This first sentence is long enough to split.', 'This second one is too, clearly.'],
      'chunker-normal-split-unaffected',
    );
    console.log('OK — Round-28 (SentenceBuffer dotted-abbreviation guard)');
  })();
}

// --- Round 29: coeff abbreviation ------------------------------------
{
  const eq = (input: string, want: string, name: string) => {
    const got = rewriteForTTS(input);
    if (got !== want) { console.error(`FAIL ${name}:\n  got:  ${got}\n  want: ${want}`); process.exit(1); }
  };
  eq('The leading coeff tells you the direction.', 'The leading coefficient tells you the direction.', 'coeff-expansion');
  eq('Compare the coeffs of x here.', 'Compare the coefficients of x here.', 'coeffs-plural');
  eq('The coefficient stays put.', 'The coefficient stays put.', 'coefficient-idempotent');
  console.log('OK — Round-29 (coeff)');
}
