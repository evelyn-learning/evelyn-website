/**
 * Batch-4 fixtures, part "fixes-f" (to-dos d and g: the motion-graph border
 * warning; circuit sources with internal resistance or two batteries; the
 * frustum) — see practice-figure-fixtures-batch4.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'fix4-d-motion-starts-on-axis',
    note: 'd: a velocity–time graph that starts at the origin and comes back to rest on the time axis — it used to warn "on the left and bottom border"; a start on the axis is legitimate',
    question: 'The graph shows the velocity of a cart. What is its displacement over the 8 s shown?',
    alt: 'A velocity–time graph made of straight segments: it rises from zero, stays level, and falls back to zero.',
    spec: { type: 'motion_graph', params: { quantity: 'velocity', series: [{ points: [[0, 0], [2, 6], [6, 6], [8, 0]] }], tRange: [0, 10], yRange: [0, 8], tStep: 2, yStep: 2 } },
  },
  {
    id: 'fix4-g-internal-resistance',
    note: 'g: a battery with internal resistance — the cells and a resistor r inside one dashed boundary; a voltmeter across the load reads the terminal voltage',
    question: 'In the circuit shown, what does the voltmeter read?',
    alt: 'A circuit: a battery drawn inside a dashed boundary together with a small resistor, connected to an ammeter and a resistor that has a voltmeter across it. The EMF and the resistances are labelled.',
    spec: { type: 'circuit_diagram', params: { battery: { emf: 12, name: 'ε', internalResistance: 0.5 }, circuit: { series: [{ type: 'ammeter', name: 'A' }, { parallel: [{ type: 'resistor', name: 'R', value: 5.5 }, { type: 'voltmeter', name: 'V' }] }] } } },
  },
  {
    id: 'fix4-g-internal-resistance-blank',
    note: 'g: the internal resistance asked for — "r = ?" inside the dashed boundary, the current printed on its arrow',
    question: 'A current of 1.5 A flows in the circuit shown. What is the internal resistance r of the battery?',
    alt: 'A circuit: a battery inside a dashed boundary with a small resistor whose value is a question mark, connected to one labelled resistor. An arrow shows the current.',
    spec: { type: 'circuit_diagram', params: { battery: { emf: 9, name: 'ε', internalResistance: 1, internalShow: 'blank', current: '1.5 A' }, circuit: { type: 'resistor', name: 'R', value: 5 } } },
  },
  {
    id: 'fix4-g-two-batteries-aiding',
    note: 'g: two batteries in series, + to −, each with its own + and −; two resistors',
    question: 'What is the current in the circuit shown?',
    alt: 'A circuit with two batteries one under the other on the left, connected positive to negative, and two resistors in series. Every part is labelled with its value.',
    spec: { type: 'circuit_diagram', params: { battery: { emf: 9, name: 'ε₁' }, battery2: { emf: 3, name: 'ε₂' }, circuit: { series: [{ type: 'resistor', name: 'R₁', value: 4 }, { type: 'resistor', name: 'R₂', value: 2 }] } } },
  },
  {
    id: 'fix4-g-two-batteries-opposing',
    note: 'g: two batteries opposing (the lower one turned round), both with internal resistance, an ammeter and a load',
    question: 'What does the ammeter read in the circuit shown?',
    alt: 'A circuit with two batteries one under the other, the lower one turned round so that like terminals face each other. Each battery is inside a dashed boundary with a small resistor. An ammeter and a resistor complete the loop.',
    spec: { type: 'circuit_diagram', params: { battery: { emf: 12, name: 'ε₁', internalResistance: 1 }, battery2: { emf: 6, name: 'ε₂', sense: 'opposing', internalResistance: 0.5 }, circuit: { series: [{ type: 'ammeter', name: 'A' }, { type: 'resistor', name: 'R', value: 4.5 }] } } },
  },
  {
    id: 'fix4-g-frustum',
    note: 'g: a frustum of a cone — both radii and the height printed, the slant height a "?"',
    question: 'What is the slant height of the frustum shown?',
    alt: 'A frustum of a cone: a wide circular base, a smaller circular top, a dashed height between their centres and a radius drawn on each circle, each labelled. The slanted side carries a boxed question mark.',
    spec: { type: 'solid_3d', params: { solid: 'frustum', radius: 6, topRadius: 3, height: 4, unit: 'cm', labels: { slant: '?' } } },
  },
  {
    id: 'fix4-g-frustum-bucket',
    note: 'g: a frustum with the larger circle on top (a bucket), all three dimensions printed',
    question: 'What is the volume of the bucket shown, in terms of π?',
    alt: 'A bucket-shaped frustum: a small circular base and a larger circular top, with a dashed height and a radius on each circle, each labelled.',
    spec: { type: 'solid_3d', params: { solid: 'frustum', radius: 2, topRadius: 5, height: 6, unit: 'cm' } },
  },
];
