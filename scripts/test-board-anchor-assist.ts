/**
 * Unit tests for the board-anchor structural assists (re-anchor matching +
 * transformation-arrow detection). The detectors are the fragile part, so the
 * suite leans on NEGATIVE / false-fire cases.
 *
 * Usage: npx tsx scripts/test-board-anchor-assist.ts
 */
import {
  extractAnchorKeywords,
  sentenceIntroducesAnchor,
  detectTransformation,
  buildTransformationLatex,
  detectAnalogy,
} from '../src/lib/tutor/whiteboard/board-anchor-assist';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ── extractAnchorKeywords ──
const eq = extractAnchorKeywords({ action: 'showEquation', label: 'The Master Equation', latex: '\\Delta G = \\Delta H - T\\Delta S' });
check('equation: kind=equation, drops stopword "equation", keeps "master"',
  !!eq && eq.kind === 'equation' && eq.tokens.includes('master') && !eq.tokens.includes('equation'), JSON.stringify(eq));
const fig = extractAnchorKeywords({ action: 'showGraph', data: { title: "Charles's Law: Volume vs Temperature" } });
check('graph: kind=figure, keeps "charles"/"volume"/"temperature"',
  !!fig && fig.kind === 'figure' && fig.tokens.includes('charles') && fig.tokens.includes('volume'), JSON.stringify(fig));
check('showProblem is NOT a discussable anchor', extractAnchorKeywords({ action: 'showProblem', statement: 'x' }) === null);
check('showTable is NOT a discussable anchor', extractAnchorKeywords({ action: 'showTable', rows: [] }) === null);
check('scribble is NOT a discussable anchor', extractAnchorKeywords({ action: 'scribble', target: 'cell' }) === null);

// ── sentenceIntroducesAnchor ──
const masterEq = extractAnchorKeywords({ action: 'showEquation', label: 'The Master Equation' })!;
check('intro: "This one equation — delta G equals…" matches (kind word)',
  sentenceIntroducesAnchor('This one equation — delta G equals delta H minus T times delta S — is the key.', masterEq));
check('intro: hook sentence does NOT match (no kind word / token)',
  !sentenceIntroducesAnchor("Here's a question — iron rusts, but never turns back into shiny iron. Why?", masterEq));
check('intro: "look at the master equation" matches (title token)',
  sentenceIntroducesAnchor('Now look at the master equation up top.', masterEq));
const charles = extractAnchorKeywords({ action: 'showGraph', data: { title: "Charles's Law: Volume vs Temperature" } })!;
check('intro: "let me draw that graph" matches (figure kind word)',
  sentenceIntroducesAnchor('Right, let me draw that graph out.', charles));
check('intro: "equation" word does not falsely match a FIGURE anchor',
  !sentenceIntroducesAnchor('Here is the equation we use.', charles));

// ── spoken-symbol matching (the "speaks the terms, not the word equation" case) ──
const gibbs = extractAnchorKeywords({ action: 'showEquation', label: 'The Master Equation', latex: '\\Delta G = \\Delta H - T\\Delta S' })!;
check('symbols: latex → "delta g"/"delta h"/"delta s"',
  gibbs.symbolTokens.includes('delta g') && gibbs.symbolTokens.includes('delta h') && gibbs.symbolTokens.includes('delta s'), JSON.stringify(gibbs.symbolTokens));
check('intro via symbols: "Think of delta H … and delta S" (2 symbols) matches',
  sentenceIntroducesAnchor('Think of delta H as the energy side and delta S as the chaos side.', gibbs));
check('intro via symbols: single "delta G is negative" (1 symbol) does NOT match',
  !sentenceIntroducesAnchor('So when delta G is negative the reaction is spontaneous.', gibbs));
check('intro: reported case "This one equation — delta G equals…" still matches (kind word)',
  sentenceIntroducesAnchor('This one equation — delta G equals delta H minus T times delta S — predicts direction.', gibbs));
check('symbols: hook sentence (no symbols, no kind word) does NOT match',
  !sentenceIntroducesAnchor("Here's a question — iron rusts but never turns back into iron. Why?", gibbs));

// ── detectTransformation: positives (real Console examples) ──
const t1 = detectTransformation('turning carbon dioxide and water back into glucose and oxygen');
check('xform: "turning A back into B" → CO2+water / glucose+oxygen',
  !!t1 && t1.from === 'carbon dioxide and water' && t1.to === 'glucose and oxygen', JSON.stringify(t1));
const t2 = detectTransformation('Solid iron turns into iron oxide over time.');
check('xform: "A turns into B" → solid iron / iron oxide',
  !!t2 && t2.from === 'solid iron' && t2.to === 'iron oxide', JSON.stringify(t2));
const t3 = detectTransformation('converting glucose into carbon dioxide');
check('xform: "converting A into B"', !!t3 && t3.from === 'glucose' && t3.to === 'carbon dioxide', JSON.stringify(t3));
const t4 = detectTransformation('one solid becomes countless particles spread through the solution');
check('xform: "A becomes B" (multi-word B) → solid / countless particles',
  !!t4 && t4.from === 'solid' && t4.to === 'countless particles', JSON.stringify(t4));
const t5 = detectTransformation('1 intact glass becomes hundreds of fragments');
check('xform: "A becomes B" → intact glass / hundreds of fragments',
  !!t5 && t5.from === 'intact glass' && t5.to === 'hundreds of fragments', JSON.stringify(t5));
check('xform latex: A → B', buildTransformationLatex({ from: 'iron', to: 'iron oxide' }) === '\\text{iron} \\rightarrow \\text{iron oxide}');

// ── detectTransformation: NEGATIVES / false-fire guards ──
check('xform neg: "delta S becomes negative" (sign, not entity)', detectTransformation('So delta S becomes negative for rusting.') === null);
check('xform neg: "it becomes clear" (figurative)', detectTransformation('Once you see it, it becomes clear.') === null);
check('xform neg: "turns out" not a transformation', detectTransformation('It turns out the answer is 42.') === null);
check('xform neg: no transformation phrasing', detectTransformation('A ball at the top of a hill rolls down to lower energy.') === null);
check('xform neg: empty', detectTransformation('') === null);
check('xform neg: "becomes spontaneous" (state word)', detectTransformation('At high temperature the reaction becomes spontaneous.') === null);
check('xform neg: "becomes favorable" (single-word adjective B, not in blocklist)', detectTransformation('The reaction becomes favorable at high T.') === null);
check('xform neg: "becomes more negative" (figurative)', detectTransformation('Subtracting makes delta G become more negative.') === null);
check('xform neg: same entity both sides', detectTransformation('turning water into water') === null);

// ── detectAnalogy: positives (the SKETCH-under-fire cases) ──
const a1 = detectAnalogy('Imagine a ball rolling down a hill to the bottom.');
check('analogy: "imagine a ball rolling down a hill" → concept',
  !!a1 && /ball rolling down a hill/i.test(a1.concept), JSON.stringify(a1));
const a2 = detectAnalogy("Think of it like water flowing downhill through a pipe.");
check('analogy: "think of it like water flowing downhill" → concept',
  !!a2 && /water flowing downhill/i.test(a2.concept), JSON.stringify(a2));
const a3 = detectAnalogy("It's just like a glass shattering into pieces.");
check('analogy: "it\'s just like a glass shattering" → concept',
  !!a3 && /glass shattering/i.test(a3.concept), JSON.stringify(a3));
const a4 = detectAnalogy('Picture gas molecules spreading out across a room.');
check('analogy: "picture gas molecules spreading out" → concept',
  !!a4 && /gas molecules spreading out/i.test(a4.concept), JSON.stringify(a4));
const a5 = detectAnalogy('The entropy is high, like marbles scattering all over the floor.');
check('analogy: bare "like X scattering" (motion verb) fires',
  !!a5 && /marbles scattering/i.test(a5.concept), JSON.stringify(a5));

// ── detectAnalogy: NEGATIVES / false-fire guards ──
check('analogy neg: "imagine you have 5 apples" (word-problem / 2nd person)',
  detectAnalogy('Imagine you have 5 apples and give away 2.') === null);
check('analogy neg: "think of it as a function" (abstract head)',
  detectAnalogy('Think of it as a function that maps x to y.') === null);
check('analogy neg: "imagine a number between 1 and 10" (abstract head)',
  detectAnalogy('Imagine a number between 1 and 10.') === null);
check('analogy neg: bare "like the last example" (no motion verb)',
  detectAnalogy('This works like the last example we did.') === null);
check('analogy neg: "like I said" (no motion verb)',
  detectAnalogy('So, like I said, the answer is four.') === null);
check('analogy neg: empty', detectAnalogy('') === null);
check('analogy neg: plain statement, no cue',
  detectAnalogy('The reaction is spontaneous at high temperature.') === null);

// ── "picture/imagine as a SPEECH VERB" false positive (2026-06-23 ear-test) ──
// "let me pull up a quick picture for that" must NOT yield "for that"; detection
// should fall through to the REAL later cue in the same narration.
const fp1 = detectAnalogy('Good question. Let me pull up a quick picture for that. The unit is amperes. Think of it like water in a pipe: current is how much water flows past a cross-section per second.');
check('analogy: skips "picture for that", finds "water in a pipe"',
  !!fp1 && /water in a pipe/i.test(fp1.concept), JSON.stringify(fp1));
check('analogy neg: "pull up a picture for that" alone → null (no real analogy)',
  detectAnalogy('Let me pull up a quick picture for that.') === null);
check('analogy neg: "take a look at this" → null (function-word head)',
  detectAnalogy('Take a look at this on the board.') === null);
check('analogy: "Picture a crowded hallway" still fires (real imperative)',
  !!detectAnalogy('Picture a crowded hallway with students rushing through a door.'));

// ── detectAnalogy: DECLARATIVE imagery (2026-06-23 ear-test phrasings, no cue word) ──
const d1 = detectAnalogy('A glass shattering is a perfect example -- fragments scatter everywhere.');
check('analogy decl: "A glass shattering is a perfect example" → glass shattering',
  !!d1 && /glass shattering/i.test(d1.concept), JSON.stringify(d1));
const d2 = detectAnalogy('When does delta S go positive? A glass shattering, for instance.');
check('analogy decl: standalone "a glass shattering" fires',
  !!d2 && /glass shattering/i.test(d2.concept), JSON.stringify(d2));
const d3 = detectAnalogy('Take the iron rusting — it spreads atoms into a more disordered oxide.');
check('analogy decl: "take the iron rusting" → iron rusting',
  !!d3 && /iron rusting/i.test(d3.concept), JSON.stringify(d3));
const d4 = detectAnalogy('Ice melting is a classic example of entropy increasing.');
check('analogy decl: "Ice melting is a classic example" fires',
  !!d4 && /melting/i.test(d4.concept), JSON.stringify(d4));

// ── declarative NEGATIVES (must not over-fire on abstract / non-physical) ──
check('analogy decl neg: "a function mapping x to y" (abstract head + non-physical gerund)',
  detectAnalogy('Consider a function mapping x to y.') === null);
check('analogy decl neg: "a reaction releasing energy" (releasing not physical-gerund)',
  detectAnalogy('We have a reaction releasing energy here.') === null);
check('analogy decl neg: "delta G is a good measure" (not "... example")',
  detectAnalogy('Delta G is a good measure of spontaneity.') === null);
check('analogy decl neg: "take the derivative" (abstract head)',
  detectAnalogy('Now take the derivative of both sides.') === null);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
