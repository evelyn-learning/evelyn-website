/**
 * Batch-5 fixtures, part "fixes-alt" (to-dos c and h — the alt-text helper and
 * the option-letter guard; nothing in the drawing changes) — see
 * practice-figure-fixtures-batch5.ts for the conventions. The `alt` of each is
 * exactly what `describeForAlt` returns for its spec
 * (scripts/practice-extend/figure-core-batch5-alt.test.ts holds that).
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'fix5-c-piecewise-one-function',
    note: 'c: one function drawn in three pieces and a point apart from them — the alt said "three curves"; it now says one function in three pieces',
    question: 'The graph of f is shown. What is f(−2)?',
    alt: 'A graph of one function on a coordinate grid, drawn in three pieces, with one marked point. Printed on it: axis labels "x", "y".',
    spec: { type: 'function_graph', params: { xRange: [-5, 6], yRange: [-3, 5], xStep: 1, yStep: 1, curves: [{ expr: 'x/2 + 2', domain: [-5, -2], to: 'open' }, { expr: 'x/2 + 2', domain: [-2, 2], from: 'open', to: 'closed' }, { expr: 'x - 3', domain: [2, 6], from: 'open' }], points: [{ x: -2, y: 3 }] } },
  },
  {
    id: 'fix5-c-conic-curve-and-line-three-marks',
    note: 'c: an ellipse with its centre and both foci marked, and a vertical line — the alt opened "A curve…" and counted no marked point; it now names the line and counts three',
    question: 'The line shown meets the curve at how many points?',
    alt: 'A curve and a straight line on a coordinate grid, with three marked points. Printed on it: point labels "O", "F₁", "F₂".',
    spec: { type: 'conic_graph', params: { xRange: [-7, 7], yRange: [-5, 5], xStep: 1, yStep: 1, conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { center: 'mark', foci: 'mark' }, names: { center: 'O' } }], lines: [{ x: 6 }] } },
  },
  {
    id: 'fix5-c-tree-branch-probabilities',
    note: 'c: a two-stage tree — the alt read "branch probabilitys"',
    question: 'Using the tree, what is the probability of drawing two red counters?',
    alt: 'A probability tree diagram. Printed on it: branch labels "Red", "Blue"; branch probabilities "3/5", "2/4", "2/5", "3/4", "1/4".',
    spec: { type: 'probability_tree', params: { branches: [{ label: 'Red', p: '3/5', children: [{ label: 'Red', p: '2/4' }, { label: 'Blue', p: '2/4' }] }, { label: 'Blue', p: '2/5', children: [{ label: 'Red', p: '3/4' }, { label: 'Blue', p: '1/4' }] }] } },
  },
  {
    id: 'fix5-h-sequence-single-base-options',
    note: 'h: a coding strand whose question has the options A, C, G, T — `figureLetterClash` now flags them (the figure itself is unchanged)',
    question: 'Which base is at position 4 of the strand shown? (options written as words: adenine, cytosine, guanine, thymine)',
    alt: 'A nucleic-acid sequence written as rows of base letters, with one row. Printed on it: row name "coding"; end labels "5′", "3′"; position numbers "1", "3", "6", "9"; base letters "ATGGCCTGA".',
    spec: { type: 'sequence_strip', params: { rows: [{ seq: 'ATGGCCTGA', name: 'coding' }], numberEvery: 3 } },
  },
];
