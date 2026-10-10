/**
 * Batch-4 fixtures, part "math" (conic_graph, venn_diagram, probability_tree) —
 * see practice-figure-fixtures-batch4.ts for the conventions.
 */
import type { FigureFixture } from './practice-figure-fixtures';

const conic = (params: Record<string, unknown>) => ({ type: 'conic_graph', params });

export const FIXTURES: FigureFixture[] = [
  // --- conic_graph: circle ---------------------------------------------------
  {
    id: 'conic-circle-simple',
    note: 'simple: a circle off the origin, nothing marked — centre and radius are read from the grid',
    question: 'The circle shown has its centre and four of its points on grid intersections. What is its equation in standard form?',
    alt: 'A circle drawn on a coordinate grid with x and y axes. No points are marked.',
    spec: conic({ xRange: [-4, 8], yRange: [-6, 4], conics: [{ type: 'circle', center: [2, -1], radius: 4 }] }),
  },
  {
    id: 'conic-circle-dense-line-system',
    note: 'dense: a circle, a secant line with a label, both intersection points, the centre with its coordinates and a radius segment with its length',
    question: 'The line and the circle shown meet at two points. What are the coordinates of the two points?',
    alt: 'A circle centred at the origin and a slanted straight line crossing it at two marked points; the centre is named and a radius segment is drawn.',
    spec: conic({
      xRange: [-7, 7], yRange: [-7, 7],
      conics: [{ type: 'circle', center: [0, 0], radius: 5, show: { center: 'value', radius: 'value' } }],
      lines: [{ slope: 1, intercept: 1, label: 'ℓ' }],
      points: [{ x: -4, y: -3, label: 'P' }, { x: 3, y: 4, label: 'Q' }],
    }),
  },
  {
    id: 'conic-circle-blank-radius',
    note: 'the centre is printed, the radius segment carries a "?"',
    question: 'The circle shown passes through grid points. What is the length of the radius marked "?"?',
    alt: 'A circle on a coordinate grid with its centre marked and named, and a radius segment whose length is left blank.',
    spec: conic({ xRange: [-8, 4], yRange: [-3, 7], conics: [{ type: 'circle', center: [-2, 2], radius: 3, show: { center: 'value', radius: 'blank' } }] }),
  },
  // --- conic_graph: ellipse --------------------------------------------------
  {
    id: 'conic-ellipse-simple',
    note: 'simple: a horizontal ellipse centred at the origin, nothing marked',
    question: 'What are the lengths of the major and minor axes of the ellipse shown?',
    alt: 'An ellipse centred at the origin of a coordinate grid, wider than it is tall. No points are marked.',
    spec: conic({ xRange: [-6, 6], yRange: [-4, 4], conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3 }] }),
  },
  {
    id: 'conic-ellipse-dense-all-features',
    note: 'dense: a vertical ellipse off the origin with centre, both vertices, both co-vertices and both foci named with coordinates, and its major axis',
    question: 'The ellipse shown has its centre, vertices, co-vertices and foci marked. What is the distance between its foci?',
    alt: 'A tall ellipse on a coordinate grid with its centre, two vertices, two co-vertices and two foci marked and named with their coordinates, and a dashed line along its major axis.',
    spec: conic({
      xRange: [-6, 8], yRange: [-6, 8],
      conics: [{ type: 'ellipse', center: [1, 1], rx: 3, ry: 5, show: { center: 'value', vertices: 'value', coVertices: 'value', foci: 'value', axis: 'mark' } }],
    }),
  },
  {
    id: 'conic-ellipse-blank-foci',
    note: 'vertices and co-vertices printed, both foci marked with a "?"',
    question: 'The ellipse shown has its vertices and co-vertices labelled. What are the coordinates of the focus F₂?',
    alt: 'A wide ellipse centred at the origin with two vertices and two co-vertices named with their coordinates and two foci marked on the major axis, their coordinates left blank.',
    spec: conic({
      xRange: [-7, 7], yRange: [-5, 5],
      conics: [{ type: 'ellipse', center: [0, 0], rx: 5, ry: 3, show: { vertices: 'value', coVertices: 'value', foci: 'blank' } }],
    }),
  },
  // --- conic_graph: hyperbola ------------------------------------------------
  {
    id: 'conic-hyperbola-simple',
    note: 'simple: a hyperbola opening left and right with its two asymptotes as dashed guides',
    question: 'What are the equations of the asymptotes of the hyperbola shown?',
    alt: 'A hyperbola with two branches opening left and right on a coordinate grid, with two dashed straight lines crossing at the origin that the branches approach.',
    spec: conic({ xRange: [-8, 8], yRange: [-6, 6], conics: [{ type: 'hyperbola', center: [0, 0], a: 2, b: 3, axis: 'x', show: { asymptotes: 'mark' } }] }),
  },
  {
    id: 'conic-hyperbola-dense-vertical-shifted',
    note: 'dense: a hyperbola opening up and down, off the origin: centre, vertices and foci with coordinates (irrational foci printed exactly), asymptotes with equations, the central box',
    question: 'The hyperbola shown has its centre, vertices and foci labelled. What is the value of c, the distance from the centre to each focus?',
    alt: 'A hyperbola with two branches opening up and down, its centre, two vertices and two foci named with coordinates, two dashed asymptotes with their equations and a dashed central rectangle.',
    spec: conic({
      xRange: [-5, 11], yRange: [-7, 9],
      conics: [{ type: 'hyperbola', center: [3, 1], a: 3, b: 2, axis: 'y', show: { center: 'value', vertices: 'value', foci: 'value', asymptotes: 'value', box: 'mark' } }],
    }),
  },
  {
    id: 'conic-hyperbola-blank-asymptote',
    note: 'vertices printed, the asymptotes drawn and each carrying a "?"',
    question: 'The hyperbola shown has vertices (−4, 0) and (4, 0) and the central rectangle drawn. What is the equation of the asymptote with positive slope?',
    alt: 'A hyperbola opening left and right with two named vertices, a dashed central rectangle and two dashed asymptotes whose equations are left blank.',
    spec: conic({
      xRange: [-10, 10], yRange: [-7, 7],
      conics: [{ type: 'hyperbola', center: [0, 0], a: 4, b: 3, axis: 'x', show: { vertices: 'value', asymptotes: 'blank', box: 'mark' } }],
    }),
  },
  // --- conic_graph: parabola -------------------------------------------------
  {
    id: 'conic-parabola-simple',
    note: 'simple: a parabola opening upward with its focus and directrix marked, nothing printed but the names',
    question: 'The parabola shown has focus F and the dashed line as its directrix. What is the equation of the directrix?',
    alt: 'A parabola opening upward with its vertex at the origin, a point named F on its axis above the vertex and a dashed horizontal line below the vertex.',
    spec: conic({ xRange: [-6, 6], yRange: [-4, 6], conics: [{ type: 'parabola', vertex: [0, 0], p: 2, axis: 'y', show: { focus: 'mark', directrix: 'mark' } }] }),
  },
  {
    id: 'conic-parabola-dense-sideways',
    note: 'dense: a parabola opening left, off the origin: vertex and focus with coordinates, directrix with its equation, axis of symmetry, and a labelled point on the curve',
    question: 'For the parabola shown, what is the distance from the point P to the directrix?',
    alt: 'A parabola opening to the left with its vertex and focus named with coordinates, a dashed vertical directrix with its equation, a dotted axis of symmetry and a marked point on the curve.',
    spec: conic({
      xRange: [-9, 7], yRange: [-9, 11],
      conics: [{ type: 'parabola', vertex: [2, 1], p: -2, axis: 'x', show: { vertex: 'value', focus: 'value', directrix: 'value', axis: 'mark' } }],
      points: [{ x: -6, y: 9, label: 'P' }],
    }),
  },
  {
    id: 'conic-parabola-blank-focus',
    note: 'vertex and directrix printed, the focus marked with a "?"',
    question: 'The parabola shown has vertex (1, −2) and directrix y = −5. What are the coordinates of its focus?',
    alt: 'A parabola opening upward with its vertex named with coordinates, a dashed horizontal directrix with its equation, and a marked point on the axis above the vertex whose coordinates are left blank.',
    spec: conic({
      xRange: [-7, 9], yRange: [-7, 7],
      conics: [{ type: 'parabola', vertex: [1, -2], p: 3, axis: 'y', show: { vertex: 'value', focus: 'blank', directrix: 'value' } }],
    }),
  },
  {
    id: 'conic-system-two-conics',
    note: 'two conics in one figure (a circle and a parabola), told apart by dash pattern and a legend; their four intersections marked',
    question: 'The circle and the parabola shown meet at the marked points. How many solutions does the system of their two equations have?',
    alt: 'A circle centred at the origin and an upward-opening parabola on one coordinate grid, drawn in different line styles with a legend, with their crossing points marked.',
    spec: conic({
      xRange: [-8, 8], yRange: [-14, 6],
      conics: [{ type: 'circle', center: [0, 0], radius: 5, label: 'circle' }, { type: 'parabola', vertex: [0, -13], p: 0.25, axis: 'y', label: 'parabola' }],
      points: [{ x: -4, y: 3 }, { x: 4, y: 3 }, { x: -3, y: -4 }, { x: 3, y: -4 }],
    }),
  },
  // --- venn_diagram ----------------------------------------------------------
  {
    id: 'venn-simple-two-sets',
    note: 'simple: two sets, four counts',
    question: 'The Venn diagram shows how many students in a class play soccer and how many play tennis. How many students play soccer or tennis (or both)?',
    alt: 'A Venn diagram of two overlapping circles inside a rectangle, named "Soccer" and "Tennis", with a number in each of the four regions.',
    spec: { type: 'venn_diagram', params: { sets: ['Soccer', 'Tennis'], regions: [{ in: ['Soccer'], value: 12 }, { in: ['Soccer', 'Tennis'], value: 5 }, { in: ['Tennis'], value: 8 }, { in: [], value: 7 }] } },
  },
  {
    id: 'venn-dense-three-sets-shaded',
    note: 'dense: three sets, all eight regions, a universe label, one region hatched',
    question: 'The Venn diagram shows the languages studied by the 60 students of a year group. How many students are in the shaded region?',
    alt: 'A Venn diagram of three overlapping circles inside a rectangle, named "French", "Spanish" and "German", with a number in each of the eight regions; the part common to the first two circles only is hatched.',
    spec: {
      type: 'venn_diagram',
      params: {
        sets: ['French', 'Spanish', 'German'], universeLabel: '60 students',
        regions: [
          { in: ['French'], value: 14 }, { in: ['Spanish'], value: 11 }, { in: ['German'], value: 9 },
          { in: ['French', 'Spanish'], value: 6, shade: true }, { in: ['French', 'German'], value: 4 }, { in: ['Spanish', 'German'], value: 5 },
          { in: ['French', 'Spanish', 'German'], value: 3 }, { in: [], value: 8 },
        ],
      },
    },
  },
  {
    id: 'venn-blank-probability',
    note: 'probabilities, the intersection a "?", the outside region hatched',
    question: 'The Venn diagram shows probabilities for events A and B. What is P(A and B)?',
    alt: 'A Venn diagram of two overlapping circles named "A" and "B" inside a rectangle, with a decimal in three regions and the overlap left blank; the region outside both circles is hatched.',
    spec: { type: 'venn_diagram', params: { sets: ['A', 'B'], values: 'probability', regions: [{ in: ['A'], value: 0.3 }, { in: ['A', 'B'], value: 0.2, show: 'blank' }, { in: ['B'], value: 0.35 }, { in: [], value: 0.15, shade: true }] } },
  },
  // --- probability_tree ------------------------------------------------------
  {
    id: 'tree-simple-two-stage',
    note: 'simple: two stages, decimals on every branch',
    question: 'A bag is chosen and then a ball is drawn, with the probabilities shown. What is the probability of drawing a red ball?',
    alt: 'A probability tree with two branches, "Bag 1" and "Bag 2", each splitting into "Red" and "Blue", with a probability on every branch.',
    spec: {
      type: 'probability_tree',
      params: {
        branches: [
          { label: 'Bag 1', p: 0.4, children: [{ label: 'Red', p: 0.7 }, { label: 'Blue', p: 0.3 }] },
          { label: 'Bag 2', p: 0.6, children: [{ label: 'Red', p: 0.2 }, { label: 'Blue', p: 0.8 }] },
        ],
      },
    },
  },
  {
    id: 'tree-dense-three-stage',
    note: 'dense: three coin tosses — eight leaves with outcomes and path probabilities, stage titles',
    question: 'A biased coin is tossed three times, as shown. What is the probability of exactly two heads?',
    alt: 'A probability tree of three stages, each branch splitting into "H" and "T" with a fraction on it, ending in eight leaves, each with its outcome and a probability.',
    spec: {
      type: 'probability_tree',
      params: {
        stageTitles: ['1st toss', '2nd toss', '3rd toss'], products: 'value',
        branches: ['H', 'T'].map((a) => ({
          label: a, p: a === 'H' ? '2/3' : '1/3',
          children: ['H', 'T'].map((b) => ({
            label: b, p: b === 'H' ? '2/3' : '1/3',
            children: ['H', 'T'].map((c) => ({ label: c, p: c === 'H' ? '2/3' : '1/3', outcome: `${a}${b}${c}` })),
          })),
        })),
      },
    },
  },
  {
    id: 'tree-blank-without-replacement',
    note: 'drawing without replacement: fractions, two branches a "?", one path probability a "?"',
    question: 'Two marbles are drawn without replacement from a bag of 3 red and 5 green marbles, as shown. What probability belongs on the branch marked "?" after a red first draw?',
    alt: 'A probability tree of two stages with branches "R" and "G", fractions on most branches and two branches left blank; one of the four leaves has a blank where its probability would be.',
    spec: {
      type: 'probability_tree',
      params: {
        stageTitles: ['1st draw', '2nd draw'],
        branches: [
          { label: 'R', p: '3/8', children: [{ label: 'R', p: '2/7', show: 'blank', outcome: 'RR', product: 'blank' }, { label: 'G', p: '5/7', outcome: 'RG' }] },
          { label: 'G', p: '5/8', children: [{ label: 'R', p: '3/7', outcome: 'GR' }, { label: 'G', p: '4/7', show: 'blank', outcome: 'GG' }] },
        ],
      },
    },
  },
];
