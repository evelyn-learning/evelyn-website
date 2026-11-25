/**
 * What the tutor's whiteboard draws, grouped for a reader (2026-11-24).
 *
 * This file listed 16 "types" from the first engine (showEquation, showSvgDiagram, clear…) and the two pages
 * that used it gave two different counts. The board the tutor uses today has three sources, and this list is
 * written from them:
 *   - the forms the tutor writes while it talks: InlineKind in src/lib/tutor/v2/board-inline.ts
 *     (INLINE_BOARD_FORMS below repeats that list; scripts/test-portal-seo.ts keeps the two equal);
 *   - figures with a drawing tool of their own: TOOL_FIGURES in src/lib/tutor/v2/figure-catalogue.ts and the
 *     subject tools in src/lib/tutor/v2/tools.ts;
 *   - the catalogue of figures drawn exactly from a few parameters: DIAGRAM_CATALOG in
 *     src/lib/tutor/diagrams/catalog/manifest.ts.
 * Counts are not typed here: data/board-catalogue.ts reads them from the engine.
 *
 * Pure (no imports).
 */

/** The inline board forms, as the engine names them. 'figure' places a catalogue figure and 'page' starts a new
 *  board page; the rest are things a student sees drawn. */
export const INLINE_BOARD_FORMS = [
  'equation', 'note', 'problem', 'table', 'timeline', 'compare', 'steps', 'quote', 'forces', 'numberline', 'graph',
  'cycle', 'web', 'map', 'chart', 'ranks', 'code', 'sketch', 'figure', 'page', 'sentence',
] as const;

export interface BoardItem { name: string; description: string }
export interface BoardGroup { id: 'general' | 'maths' | 'science' | 'humanities' | 'computing'; name: string; summary: string; items: BoardItem[] }

export const boardGroups: BoardGroup[] = [
  {
    id: 'general',
    name: 'Every lesson',
    summary: 'Written as the tutor speaks, at the moment a teacher would pick up the pen.',
    items: [
      { name: 'Equations', description: 'Typeset maths with an optional label, one line or a chain of lines.' },
      { name: 'Notes', description: 'Key points, with maths inline, plain or highlighted.' },
      { name: 'Problems', description: 'The question the student is working on, kept in view.' },
      { name: 'Worked steps', description: 'A solution or a method laid out step by step.' },
      { name: 'Tables', description: 'Rows and columns for data, cases or comparisons.' },
      { name: 'Compare cards', description: 'Two or more things side by side.' },
      { name: 'Quotes', description: 'A line from a text or a source, set apart.' },
      { name: 'Sketches', description: 'A simple labelled drawing for anything no exact figure covers.' },
      { name: 'Pages', description: 'A new board page when the subject changes; earlier pages stay for review.' },
    ],
  },
  {
    id: 'maths',
    name: 'Mathematics',
    summary: 'From counting to calculus and statistics.',
    items: [
      { name: 'Graphs', description: 'Functions, points and inequalities on axes.' },
      { name: 'Number lines', description: 'Positions, intervals and inequality solutions.' },
      { name: 'Geometry', description: 'Triangles, polygons, circles, angles and constructions, exact in proportion; transformations and solids.' },
      { name: 'Fractions and place value', description: 'Fraction bars, tape diagrams, area models, ten-frames and base-ten blocks.' },
      { name: 'Statistics', description: 'Dot plots, histograms, bar charts, box plots, scatterplots with a regression line, normal and other distribution curves.' },
      { name: 'Probability', description: 'Probability trees and Venn diagrams.' },
      { name: 'Trigonometry and calculus', description: 'The unit circle, Riemann sums, slope fields, parametric and polar curves, solids of revolution.' },
      { name: 'Matrices and vectors', description: 'Matrices with row operations, vector addition, 3D axes.' },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    summary: 'Physics, chemistry, biology and earth science.',
    items: [
      { name: 'Forces and motion', description: 'Force diagrams, inclined planes, pulleys, springs, pendulums, projectiles, collisions, energy bars and motion graphs.' },
      { name: 'Circuits', description: 'Series, parallel and mixed circuits drawn from what is connected to what.' },
      { name: 'Waves and optics', description: 'Wave diagrams, standing waves, interference, ray diagrams for lenses and mirrors, refraction.' },
      { name: 'Atoms and molecules', description: 'Molecular structures, Lewis structures, electron configurations, the periodic table, molecular geometry.' },
      { name: 'Reactions', description: 'Balanced equations, reaction-energy curves, titration curves, heating curves, the pH scale.' },
      { name: 'Cells and genetics', description: 'Cells and membranes, mitosis and meiosis, DNA, Punnett squares, pedigrees, cladograms.' },
      { name: 'Body systems and ecology', description: 'The heart, the nephron, the eye and other labelled systems; food webs, energy pyramids, life cycles.' },
      { name: 'Earth and space', description: 'The water and rock cycles, plate boundaries, the layers of the Earth, moon phases, eclipses, seasons, the solar system.' },
    ],
  },
  {
    id: 'humanities',
    name: 'Humanities and languages',
    summary: 'History, geography, civics, economics, reading and writing.',
    items: [
      { name: 'Timelines', description: 'Events in order along a line.' },
      { name: 'Maps', description: 'Places marked on a world or regional map, joined as a route when the lesson follows a journey.' },
      { name: 'Annotated passages', description: 'A poem, passage or source with words highlighted and notes on them.' },
      { name: 'Cycles and cause webs', description: 'Stages that go round, and what leads to what.' },
      { name: 'Rankings and structures', description: 'Levels from the top down, branches of government, argument structure, plot diagrams.' },
      { name: 'Economics graphs', description: 'Supply and demand, production possibilities, aggregate demand and supply, and other standard models.' },
      { name: 'Sentence cards', description: 'One sentence of a language lesson with its stress and meaning marked.' },
    ],
  },
  {
    id: 'computing',
    name: 'Computer science',
    summary: 'Programs and the structures behind them.',
    items: [
      { name: 'Code', description: 'Program code as typed, with its language.' },
      { name: 'Call stacks and recursion trees', description: 'What a program is doing at one moment.' },
      { name: 'Data structures', description: 'Stacks, queues, linked lists, binary trees, graphs and hash tables.' },
      { name: 'Logic', description: 'Truth tables, logic gates, flowcharts and state machines.' },
    ],
  },
];
