// scripts/test-equation-label-dedup.ts
import { strict as assert } from 'node:assert';
import { normalizeEquationLabel, decideLabelDuplicate, type SeenEquationLabel } from '../src/lib/tutor/whiteboard/equation-label-dedup';

const seen = (over: Partial<SeenEquationLabel> = {}): SeenEquationLabel => ({
  originalLabel: 'Final answer', originalLatex: 'x = 5', latexNormalized: 'x=5',
  signature: 'sig-x5', pageKey: 'Solving for x', ...over,
});

// normalization: decorations stripped, case/space folded
assert.equal(normalizeEquationLabel('Step 1: Sum ✓'), 'step 1: sum');
assert.equal(normalizeEquationLabel('  Final Answer (corrected) '), 'final answer');
assert.equal(normalizeEquationLabel('Fresh equation (2)'), 'fresh equation');

// first sighting registers
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=5', seen: undefined, currentPageKey: 'p1', priorOnBoard: false }), { kind: 'register' });

// identical latex re-emit passes through (other dedups own it)
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=5', seen: seen(), currentPageKey: 'Solving for x', priorOnBoard: true }), { kind: 'pass' });

// SAME page, prior still on the board, different latex ⇒ reject with a reason naming both
const r = decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=11', seen: seen(), currentPageKey: 'Solving for x', priorOnBoard: true });
assert.equal(r.kind, 'reject');
if (r.kind === 'reject') {
  assert.match(r.reason, /Final answer/);
  assert.match(r.reason, /distinct label/i);
}

// DIFFERENT page ⇒ a fresh artefact: register (the live-check-3 class)
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=11', seen: seen(), currentPageKey: 'Isolating the x term', priorOnBoard: true }), { kind: 'register' });

// prior was killed/retracted (not on the board any more) ⇒ register
assert.deepEqual(decideLabelDuplicate({ normalizedLabel: 'final answer', normalizedLatex: 'x=11', seen: seen(), currentPageKey: 'Solving for x', priorOnBoard: false }), { kind: 'register' });

console.log('equation-label-dedup: all assertions passed');
