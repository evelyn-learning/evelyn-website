/**
 * Unit tests for the board-anchor structural assists (re-anchor matching +
 * transformation-arrow detection). The detectors are the fragile part, so the
 * suite leans on NEGATIVE / false-fire cases.
 *
 * Usage: npx tsx scripts/test-board-anchor-assist.ts
 */
import {
  anchorWordIndex,
  extractAnchorKeywords,
  sentenceIntroducesAnchor,
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


// ── anchorWordIndex (Task 3.2 word-anchored flush) ──
// Words are the SPOKEN (rewritten-transcript) sentence split on whitespace —
// punctuation stays attached, the matcher normalizes per-word.
const w = (s: string) => s.split(/\s+/).filter(Boolean);
check('wordIdx: earliest kind word ("equation") is the referring index',
  anchorWordIndex(w('Now look at the equation up top.'), masterEq) === 4);
check('wordIdx: punctuation-attached kind word still matches ("equation,")',
  anchorWordIndex(w('Take this equation, right here.'), masterEq) === 2);
check('wordIdx: title token match ("master")',
  anchorWordIndex(w('Now the master rule appears.'), masterEq) === 2);
check('wordIdx: earliest of kind-vs-token wins',
  anchorWordIndex(w('The master version of this equation.'), masterEq) === 1, String(anchorWordIndex(w('The master version of this equation.'), masterEq)));
check('wordIdx: no match → undefined (caller keeps sentence semantics)',
  anchorWordIndex(w("Here's a question about rust."), masterEq) === undefined);
check('wordIdx: figure anchor does not match the word "equation"',
  anchorWordIndex(w('Here is the equation we use.'), charles) === undefined);
check('wordIdx: figure kind word ("graph") matches',
  anchorWordIndex(w('Right, let me draw that graph out.'), charles) === 5);
check('wordIdx: 2+ spoken symbols → FIRST symbol phrase index',
  anchorWordIndex(w('Think of delta H as energy and delta S as chaos.'), gibbs) === 2);
check('wordIdx: single symbol phrase does NOT match (anti-noise, mirrors intro rule)',
  anchorWordIndex(w('So when delta G is negative it goes.'), gibbs) === undefined);
check('wordIdx: empty words → undefined', anchorWordIndex([], masterEq) === undefined);

// detectTransformation / detectAnalogy and their tests were removed with the
// board-anchor AUTO-FIRE path (2026-07-10). The brain owns show_sketch; the
// re-anchor helpers above are the module's remaining purpose.

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
