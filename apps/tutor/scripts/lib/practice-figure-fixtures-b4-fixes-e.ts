/**
 * Batch-4 fixtures, part "fixes-e" — see practice-figure-fixtures-batch4.ts for the conventions.
 * The to-dos a (molecular_structure), c (bar_magnet) and e (field_diagram, unequal charges): each
 * fixture reproduces what the independent reads complained about.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const F = (id: string, x: number, y: number) => ({ id, el: 'F', x, y, lonePairs: 3 });
const water = (origin: [number, number], flip: boolean, partial = true) => ({
  origin,
  atoms: [
    { id: 'O', el: 'O', x: 0, y: 0, lonePairs: 2, ...(partial ? { partial: '-' } : {}) },
    { id: 'H1', el: 'H', from: 'O', angle: flip ? 232 : 52 },
    { id: 'H2', el: 'H', from: 'O', angle: flip ? 128 : 308 },
  ],
  bonds: [{ a: 'O', b: 'H1' }, { a: 'O', b: 'H2' }],
});
const chain = (label: string, atoms: Array<[string, number]>) => ({
  label,
  atoms: atoms.map(([el, h], i) => ({ id: `a${i}`, el, x: i, y: 0, ...(h ? { h } : {}) })),
  bonds: atoms.slice(1).map((_, i) => ({ a: `a${i}`, b: `a${i + 1}` })),
});

export const FIXTURES: FigureFixture[] = [
  {
    id: 'fix4-a-xenon-lone-pairs',
    note: 'a: XeF₄ and XeF₂ — the lone pairs on xenon stand apart as pairs (opposite corners of the square; two clear pairs above and one below the line), none against a bond',
    question: 'Lewis structures of two xenon fluorides are shown. How many lone pairs of electrons are on the xenon atom in each?',
    alt: 'Two Lewis structures side by side: a xenon atom bonded to four fluorine atoms in a cross, and a xenon atom between two fluorine atoms in a line. Dots in pairs mark the lone pairs on every atom.',
    spec: {
      type: 'molecular_structure',
      params: {
        molecules: [
          { center: 'Xe', atoms: [{ id: 'Xe', el: 'Xe', x: 0, y: 0, lonePairs: 2 }, F('F1', -1.2, 0), F('F2', 1.2, 0), F('F3', 0, 1.2), F('F4', 0, -1.2)], bonds: [{ a: 'Xe', b: 'F1' }, { a: 'Xe', b: 'F2' }, { a: 'Xe', b: 'F3' }, { a: 'Xe', b: 'F4' }] },
          { center: 'Xe', atoms: [{ id: 'Xe', el: 'Xe', x: 0, y: 0, lonePairs: 3 }, F('F1', -1.3, 0), F('F2', 1.3, 0)], bonds: [{ a: 'Xe', b: 'F1' }, { a: 'Xe', b: 'F2' }] },
        ],
      },
    },
  },
  {
    id: 'fix4-a-t-shaped-lone-pairs',
    note: 'a: ClF₃ drawn T-shaped — both lone pairs of chlorine on the open side, each a separate pair clear of the bonds',
    question: 'The Lewis structure of ClF₃ is shown. What is the electron-domain geometry around the chlorine atom?',
    alt: 'A Lewis structure: a chlorine atom bonded to three fluorine atoms, two in a line with it and one above. Dots in pairs mark the lone pairs on every atom.',
    spec: { type: 'molecular_structure', params: { molecules: [{ center: 'Cl', atoms: [{ id: 'Cl', el: 'Cl', x: 0, y: 0, lonePairs: 2 }, F('F1', -1.3, 0), F('F2', 1.3, 0), F('F3', 0, 1.3)], bonds: [{ a: 'Cl', b: 'F1' }, { a: 'Cl', b: 'F2' }, { a: 'Cl', b: 'F3' }] }] } },
  },
  {
    id: 'fix4-a-hbond-labels',
    note: 'a: three water molecules and two dotted lines, each with its own label ("1", "2") beside it — one joins H to O, the other H to H',
    question: 'Three water molecules are shown with two dotted lines, 1 and 2. Which dotted line represents a hydrogen bond?',
    alt: 'Three bent water molecules. One dotted line, numbered, joins a hydrogen atom of one molecule to the oxygen atom of another; a second numbered dotted line joins two hydrogen atoms of different molecules.',
    spec: {
      type: 'molecular_structure',
      params: {
        arrangement: 'shared',
        molecules: [water([0, 0], false), water([2.75, -0.95], true), water([3.1, 1.75], true)],
        hbonds: [{ from: { mol: 0, atom: 'H2' }, to: { mol: 1, atom: 'O' }, label: '1' }, { from: { mol: 0, atom: 'H1' }, to: { mol: 2, atom: 'H1' }, label: '2' }],
      },
    },
  },
  {
    id: 'fix4-a-three-condensed',
    note: 'a: three condensed formulas — set two to a row and one below, so every bond is a line and none is squeezed to a hyphen between two written groups',
    question: 'Condensed structural formulas of three compounds, X, Y and Z, are shown. Which compound can form hydrogen bonds between its own molecules?',
    alt: 'Three condensed structural formulas with letters under them: a two-carbon chain ending in an OH group, two CH₃ groups joined through an oxygen atom, and a three-carbon chain.',
    spec: { type: 'molecular_structure', params: { molecules: [chain('X', [['C', 3], ['C', 2], ['O', 1]]), chain('Y', [['C', 3], ['O', 0], ['C', 3]]), chain('Z', [['C', 3], ['C', 2], ['C', 3]])] } },
  },
  {
    id: 'fix4-c-magnet-five-points',
    note: 'c: one bar magnet with five marked points (the cap was three)',
    question: 'Five points are marked in the field of a bar magnet. At which two points does the field point in the same direction as at point K?',
    alt: 'A bar magnet with its halves marked N and S and curved field lines with arrowheads. Five points are marked round it, each with a letter.',
    spec: { type: 'field_diagram', params: { variant: 'bar_magnet', magnets: [{ north: 'right' }], points: [{ x: 0, y: 1.75, label: 'K' }, { x: 0, y: -1.75, label: 'L' }, { x: 2.55, y: 0, label: 'M' }, { x: -2.55, y: 0, label: 'R' }, { x: 2.3, y: 1.5, label: 'T' }] } },
  },
  {
    id: 'fix4-c-magnet-blank-interaction',
    note: 'c: two magnets, no field lines — the poles of one are printed, the other\'s are "?" boxes, and a force arrow over each shows that they repel: that fixes the blank poles',
    question: 'Two bar magnets push each other apart, as the force arrows show. Which end of the right-hand magnet is its north pole?',
    alt: 'Two bar magnets end to end. The halves of the left-hand magnet are marked S and N; the halves of the right-hand magnet are boxed question marks. An arrow labelled F over each magnet points away from the other magnet.',
    spec: { type: 'field_diagram', params: { variant: 'bar_magnet', magnets: [{ north: 'right' }, { north: 'left', poles: 'blank' }], lines: false, showInteraction: true } },
  },
  {
    id: 'fix4-e-unequal-null-region',
    note: 'e: +3q and −q at four lines per unit — lines of the larger charge now pass through the region beyond the point of zero field (it used to be empty); twelve lines on the larger charge, four on the smaller',
    question: 'The field lines of two point charges are shown. What is the ratio of the magnitude of the left-hand charge to that of the right-hand charge?',
    alt: 'Field lines round a positive charge on the left and a negative charge to its right. Some lines run from one charge to the other; the rest leave the positive charge, and two of them pass round the negative charge and carry on to the right-hand edge.',
    spec: { type: 'field_diagram', params: { variant: 'point_charges', charges: [{ x: -3, y: 0, q: 3 }, { x: 0, y: 0, q: -1 }], xRange: [-6, 6], yRange: [-3.6, 3.6], linesPerUnit: 4 } },
  },
  {
    id: 'fix4-e-unequal-negative-larger',
    note: 'e: the larger charge negative and on the right (−3q, +q): lines arriving from the left-hand edge pass round the small charge, through the region beyond the point of zero field',
    question: 'The field lines of two point charges are shown. Which charge has the larger magnitude, and what is its sign?',
    alt: 'Field lines round a positive charge on the left and a negative charge on the right. Lines leave the positive charge and end on the negative one; more lines arrive at the negative charge from the edges of the figure, two of them from the left-hand edge.',
    spec: { type: 'field_diagram', params: { variant: 'point_charges', charges: [{ x: 2, y: 0, q: -3 }, { x: 0, y: 0, q: 1 }], xRange: [-6, 5], yRange: [-3.6, 3.6], linesPerUnit: 4 } },
  },
];
