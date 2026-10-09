/**
 * Fixture specs for practice figures — shared by the review gallery
 * (scripts/practice-figure-gallery.ts) and the renderer tests
 * (scripts/test-practice-figure-render.ts).
 *
 * At least two per kind, and on purpose not only the easy case: long labels,
 * negative ranges, steep slopes, poles, many bars, tall dot stacks. Each
 * carries the question it would sit beside, so a reviewer can check the
 * figure ANSWERS the question without STATING the answer.
 */
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';

export interface FigureFixture {
  id: string;
  /** What is awkward about it (shown in the gallery). */
  note: string;
  /** A question the figure would be shown with. */
  question: string;
  alt: string;
  spec: PracticeFigureSpec;
}

export const FIGURE_FIXTURES: FigureFixture[] = [
  // --- function_graph -------------------------------------------------------
  {
    id: 'function-parabola-line',
    note: 'two curves, marked intersections, legend',
    question: 'The graph shows f(x) = x² − 2 and g(x) = x. For which values of x is f(x) = g(x)?',
    alt: 'A coordinate grid from −4 to 4 on x and −4 to 6 on y showing an upward-opening parabola and a straight line through the origin that cross at two points.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-4, 4], yRange: [-4, 6],
        curves: [{ expr: 'x^2 - 2', label: 'f' }, { expr: 'x', label: 'g' }],
        points: [{ x: -1, y: -1 }, { x: 2, y: 2 }],
      },
    },
  },
  {
    id: 'function-rational-asymptotes',
    note: 'vertical pole at x = 2, horizontal asymptote, dashed guides',
    question: 'The graph of a rational function is shown. Write the equations of its asymptotes.',
    alt: 'A graph with two branches of a rational function on a grid from −4 to 8 on x and −6 to 8 on y, with one dashed vertical line and one dashed horizontal line.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-4, 8], yRange: [-6, 8],
        curves: [{ expr: '(x + 1)/(x - 2) + 1' }],
        asymptotes: [{ x: 2 }, { y: 2 }],
      },
    },
  },
  {
    id: 'function-piecewise-endpoints',
    note: 'three pieces, open and closed endpoints, a jump and an isolated point',
    question: 'The graph of the piecewise function h is shown. What is h(1)? What is the limit of h(x) as x approaches 1 from the left?',
    alt: 'A piecewise graph on a grid from −5 to 5: a line segment ending in an open circle, a separate filled point, and a curve starting at a closed circle.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-5, 5], yRange: [-4, 6],
        curves: [
          { expr: 'x + 2', domain: [null, 1], to: 'open' },
          { expr: '0.5*(x - 3)^2 - 2', domain: [1, null], from: 'open', color: '#1d4ed8' },
        ],
        points: [{ x: 1, y: 1 }],
        yLabel: 'h(x)',
      },
    },
  },
  {
    id: 'function-tan-steep',
    note: 'repeated poles, steep slopes, non-integer tick step',
    question: 'The graph shows y = tan(x). How many times does it cross the x-axis between x = −5 and x = 5?',
    alt: 'A graph of a periodic function with repeated vertical breaks on a grid from −5 to 5 on x and −6 to 6 on y.',
    spec: {
      type: 'function_graph',
      params: { xRange: [-5, 5], yRange: [-6, 6], curves: [{ expr: 'tan(x)' }], yStep: 2 },
    },
  },
  {
    id: 'function-sqrt-log-domain',
    note: 'curves defined on part of the range only; LaTeX input; small decimal ranges',
    question: 'Which curve passes through the point (1, 0)?',
    alt: 'Two curves on a grid from −0.5 to 4 on x and −2 to 2.5 on y; one starts at the origin and rises, the other rises steeply from below near the y-axis.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-0.5, 4], yRange: [-2, 2.5],
        curves: [{ expr: '\\sqrt{x}', label: 'curve A' }, { expr: 'ln(x)', label: 'curve B', dashed: true }],
      },
    },
  },
  // --- legibility round, 2026-10-09 (one per fix) -----------------------------
  {
    id: 'fix1-four-curves-dashes',
    note: 'FIX 1 — four curves: a dash pattern each as well as a colour, repeated in the legend; the asymptote stays a thin grey guide',
    question: 'Four graphs A, B, C and D are shown. Which one is the graph of y = |x − 2|?',
    alt: 'Four curves labelled A to D on a grid from −4 to 4 on x and −6 to 6 on y: a rising straight line, a downward parabola, a V shape and an S-shaped cubic, with a dashed horizontal guide line near the bottom.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-4, 4], yRange: [-6, 6],
        curves: [{ expr: 'x/2 + 1', label: 'A' }, { expr: '3 - (x - 1)^2', label: 'B' }, { expr: 'abs(x - 2)', label: 'C' }, { expr: 'x^3 - 3*x', label: 'D' }],
        asymptotes: [{ y: -5, label: 'y = −5' }],
      },
    },
  },
  {
    id: 'fix1-one-function-in-pieces',
    note: 'FIX 1 — g is ONE function with a jump and a hole: both branches in one colour and dash, one legend entry; k is the second curve',
    question: 'The graphs of g and k are shown. For which x is g discontinuous?',
    alt: 'A piecewise curve g in three pieces — a rising segment ending in a filled dot, a lower segment starting at an open circle and ending at an open circle, and a further piece — together with a falling straight line k.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-5, 5], yRange: [-5, 5],
        curves: [
          { expr: 'x + 2', domain: [-5, -1], to: 'closed', label: 'g' },
          { expr: 'x - 2', domain: [-1, 2], from: 'open', to: 'open' },
          { expr: 'x - 2', domain: [2, 5], from: 'open' },
          { expr: '-x/2 + 3', label: 'k' },
        ],
      },
    },
  },
  {
    id: 'fix2-ends-inside-plot',
    note: 'FIX 2 — domains that stop inside the plot: unflagged ends get a filled dot, an excluded end an open circle; the cubic leaves through top and bottom and gets none',
    question: 'The graph of P is drawn for −1 ≤ x ≤ 5. What is the greatest value of P on this interval?',
    alt: 'A parabola P drawn only from x = −1 to x = 5 with a filled dot at each end, a short segment Q from a filled dot to an open circle, and a steep cubic R that runs off the top and bottom of the grid.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-3, 7], yRange: [-4, 9],
        curves: [
          { expr: '(x - 2)^2 - 1', domain: [-1, 5], label: 'P' },
          { expr: '-x/2 - 2', domain: [-2, 2], to: 'open', label: 'Q' },
          { expr: '(x - 5)^3 + 2', domain: [3, 7], label: 'R' },
        ],
      },
    },
  },
  {
    id: 'fix3-points-on-axes',
    note: 'FIX 3 — points at the origin, on both axes, on a gridline crossing and on the border: drawn on top, each on a white ring',
    question: 'Which labelled point is the y-intercept of the line?',
    alt: 'A straight line on a grid from −4 to 4 with five marked points: at the origin, on the x-axis, on the y-axis, on the line, and an open circle on the right border.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-4, 4], yRange: [-4, 4],
        curves: [{ expr: 'x/2 + 2' }],
        points: [{ x: 0, y: 0, label: 'O' }, { x: -4, y: 0, label: 'A' }, { x: 0, y: 2, label: 'B' }, { x: 2, y: 3, label: 'C' }, { x: 4, y: -2, open: true, label: 'D' }, { x: 3, y: 0 }],
      },
    },
  },
  {
    id: 'fix3-motion-vertices-on-border',
    note: 'FIX 3 — vertex dots at the plot corner and on the time axis used to be cut by the clip path',
    question: 'The force–time graph of a push is shown. What is the impulse delivered between t = 0 and t = 8 s?',
    alt: 'A force–time graph that rises from zero to 100 N in 2 s, holds until 6 s and falls back to zero at 8 s, with a dot at each corner.',
    spec: {
      type: 'motion_graph',
      params: { series: [{ points: [[0, 0], [2, 100], [6, 100], [8, 0]] }], showPoints: true, tRange: [0, 10], yRange: [0, 140], tStep: 2, yStep: 20, yLabel: 'Force (N)' },
    },
  },
  {
    id: 'fix4-corner-without-dots',
    note: 'FIX 4 — vertexDots: "ends" on the first series (its corners are what the question asks for); the second series keeps its dots',
    question: 'The velocity–time graph shows a cyclist and a jogger. At what time does the cyclist stop accelerating?',
    alt: 'A velocity–time graph with two lines: the cyclist speeds up, then holds a steady speed, then slows; the jogger moves at one steady lower speed, with a dot at each end.',
    spec: {
      type: 'motion_graph',
      params: {
        quantity: 'velocity', showPoints: true, tRange: [0, 12], yRange: [0, 12],
        series: [
          { label: 'cyclist', points: [[1, 2], [4, 10], [8, 10], [11, 4]], vertexDots: 'ends' },
          { label: 'jogger', points: [[1, 4], [6, 4], [11, 4.5]] },
        ],
      },
    },
  },
  {
    id: 'fix5-pi-ticks',
    note: 'FIX 5 — xTickUnit: "pi", xTickDivisor: 2 — the axis reads −2π … 2π in halves of π, not 1.57, 3.14',
    question: 'The graph of y = 3 cos(x) is shown. What is its period?',
    alt: 'A cosine wave of amplitude 3 on an x-axis marked in multiples of π over 2 from −2π to 2π.',
    spec: {
      type: 'function_graph',
      params: { xRange: [-6.6, 6.6], yRange: [-4, 4], yStep: 1, xTickUnit: 'pi', xTickDivisor: 2, curves: [{ expr: '3*cos(x)', label: 'P' }, { expr: 'sin(2*x)', label: 'Q' }] },
    },
  },
  {
    id: 'fix6-legibility-warnings',
    note: 'FIX 6 — drawn as specified, but checkFigureLegibility reports it: a branch cut to a stub, a point on the border, two labels overlapping',
    question: '(authoring check only — this figure should be sent back)',
    alt: 'A rational function with a branch that barely enters the plot at the right edge, and two labelled points almost on top of each other.',
    spec: {
      type: 'function_graph',
      params: {
        xRange: [-6, 6], yRange: [-0.5, 12],
        curves: [{ expr: '1/(x - 5.8) + 1', label: 'f' }],
        points: [{ x: -6, y: 4, label: 'edge' }, { x: 1, y: 6, label: 'first' }, { x: 1.1, y: 6.2, label: 'second' }],
      },
    },
  },
  // --- motion_graph ---------------------------------------------------------
  {
    id: 'motion-position-piecewise',
    note: 'piecewise-linear x(t) with a rest and a reversal through zero — corners must stay corners',
    question: 'The position–time graph of a cyclist is shown. What is the cyclist’s velocity between t = 5 s and t = 8 s?',
    alt: 'A position–time graph: position rises from 0 to 8 m in 2 s, stays at 8 m until 5 s, then falls in a straight line to −4 m at 8 s.',
    spec: {
      type: 'motion_graph',
      params: { quantity: 'position', series: [{ points: [[0, 0], [2, 8], [5, 8], [8, -4]] }] },
    },
  },
  {
    id: 'motion-velocity-two-objects',
    note: 'two series, negative velocities, legend, long axis label',
    question: 'The velocity–time graph shows two cars. At what time do they have the same velocity?',
    alt: 'A velocity–time graph with two straight lines: one falling from 24 m/s to −12 m/s over 12 s, one rising from −6 m/s to 18 m/s over 12 s.',
    spec: {
      type: 'motion_graph',
      params: {
        quantity: 'velocity',
        yLabel: 'Velocity along the track, east positive (m/s)',
        series: [
          { label: 'Car A', points: [[0, 24], [12, -12]] },
          { label: 'Car B', points: [[0, -6], [12, 18]], dashed: true },
        ],
      },
    },
  },
  {
    id: 'motion-position-smooth',
    note: 'smooth interpolation asked for explicitly (a thrown ball), sample points shown',
    question: 'The graph shows the height of a ball thrown upward. Estimate the time at which the ball is highest.',
    alt: 'A height–time graph shaped like an arch, starting at 2 m, peaking near 22 m, and returning toward the ground after 4 s.',
    spec: {
      type: 'motion_graph',
      params: {
        quantity: 'position', yLabel: 'Height (m)', interpolation: 'smooth', showPoints: true,
        series: [{ points: [[0, 2], [0.5, 10.8], [1, 17.1], [1.5, 21], [2, 22.4], [2.5, 21.4], [3, 17.9], [3.5, 12], [4, 3.6]] }],
      },
    },
  },
  // --- bar_chart ------------------------------------------------------------
  {
    id: 'bar-books-sold',
    note: 'plain case — values are NOT printed over the bars',
    question: 'The bar chart shows books sold each day. How many more books were sold on Friday than on Wednesday?',
    alt: 'A bar chart of books sold on five weekdays, Monday to Friday, with a vertical axis from 0 to 20.',
    spec: {
      type: 'bar_chart',
      params: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [12, 18, 7, 15, 20], yLabel: 'Books sold' },
    },
  },
  {
    id: 'bar-many-long-labels-negative',
    note: 'fourteen bars, long category names (rotated), negative values',
    question: 'The chart shows the change in average temperature for 14 cities. Which city had the largest decrease?',
    alt: 'A bar chart with fourteen cities; some bars rise above zero and some fall below, on an axis from −8 to 6 degrees.',
    spec: {
      type: 'bar_chart',
      params: {
        categories: ['Albuquerque', 'Baton Rouge', 'Charlottesville', 'Des Moines', 'El Paso', 'Fort Lauderdale', 'Grand Rapids', 'Huntington Beach', 'Indianapolis', 'Jacksonville', 'Kansas City', 'Little Rock', 'Minneapolis–Saint Paul', 'North Las Vegas'],
        values: [2.5, -1, 4, -6.5, 3, 5.5, -3, 1, -7.5, 4.5, -2, 0.5, -5, 3.5],
        yLabel: 'Change in average temperature (°C)',
        xLabel: 'City',
      },
    },
  },
  {
    id: 'bar-wrapped-labels-values',
    note: 'two-word labels that wrap; showValues asked for; title asked for',
    question: 'Use the chart to find the mean number of goals per team.',
    alt: 'A bar chart titled Goals scored this season with four teams and the number of goals printed above each bar.',
    spec: {
      type: 'bar_chart',
      params: { title: 'Goals scored this season', categories: ['Red Rovers', 'Blue Comets', 'Green Giants', 'Gold Stars'], values: [34, 41, 27, 38], showValues: true, yLabel: 'Goals' },
    },
  },
  // --- line_plot ------------------------------------------------------------
  {
    id: 'lineplot-pets',
    note: 'integer data with a gap (no dots over 5)',
    question: 'The line plot shows the number of pets in each household on a street. What is the median number of pets?',
    alt: 'A dot plot over a number line from 0 to 6 with stacks of dots of different heights and no dots above 5.',
    spec: { type: 'line_plot', params: { values: [0, 1, 1, 2, 2, 2, 2, 3, 3, 4, 6], xLabel: 'Pets per household' } },
  },
  {
    id: 'lineplot-fractions-tall',
    note: 'quarter-unit data, a tall stack, long axis label that wraps',
    question: 'The line plot shows the lengths of ribbon pieces. How many pieces are longer than 2½ inches?',
    alt: 'A dot plot over a number line from 1 to 4 marked in quarters, with the tallest stack of dots above 2 and a half.',
    spec: {
      type: 'line_plot',
      params: {
        values: [1, 1.25, 1.25, 1.5, 1.75, 2, 2, 2, 2.25, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.75, 3, 3, 3.25, 3.5, 4],
        xLabel: 'Length of each ribbon piece measured to the nearest quarter inch (inches)',
      },
    },
  },
  {
    id: 'lineplot-negative-wide',
    note: 'negative values and a wide range (tick labels thin out)',
    question: 'The line plot shows overnight low temperatures. What is the range of the data?',
    alt: 'A dot plot over a number line from −12 to 9 with dots scattered along it.',
    spec: { type: 'line_plot', params: { values: [-12, -9, -9, -7, -4, -4, -4, -1, 0, 0, 2, 3, 3, 5, 9], xLabel: 'Overnight low (°C)' } },
  },
  // --- scatter_plot ---------------------------------------------------------
  {
    id: 'scatter-study-hours',
    note: 'plain case with a least-squares line; the equation is NOT shown',
    question: 'The scatter plot shows hours studied and test score with a line of best fit. Predict the score of a student who studies 7 hours.',
    alt: 'A scatter plot of test score against hours studied with ten points rising from lower left to upper right and a straight line through them.',
    spec: {
      type: 'scatter_plot',
      params: {
        xLabel: 'Hours studied', yLabel: 'Test score',
        points: [[1, 52], [2, 60], [2.5, 58], [3, 61], [4, 70], [4.5, 68], [5, 78], [6, 80], [6.5, 85], [8, 91]],
        trendLine: true, xRange: [0, 10], yRange: [40, 100],
      },
    },
  },
  {
    id: 'scatter-negative-series-labels',
    note: 'negative ranges on both axes, two named series, point labels near the edges',
    question: 'Which labelled point is an outlier for the coastal stations?',
    alt: 'A scatter plot with two groups of points on axes that run from negative to positive values; three points carry letter labels.',
    spec: {
      type: 'scatter_plot',
      params: {
        xLabel: 'Elevation relative to sea level (m)', yLabel: 'Mean January temperature (°C)',
        points: [
          { x: -40, y: 6, series: 'Coastal' }, { x: -15, y: 5, series: 'Coastal' }, { x: 10, y: 4, series: 'Coastal' }, { x: 55, y: 3, series: 'Coastal' },
          { x: 95, y: -14, series: 'Coastal', label: 'P' },
          { x: 20, y: -3, series: 'Inland' }, { x: 60, y: -6, series: 'Inland' }, { x: 110, y: -9, series: 'Inland', label: 'Q' }, { x: 148, y: -12, series: 'Inland' },
          { x: -48, y: 9, series: 'Coastal', label: 'R' },
        ],
      },
    },
  },
  // --- reaction_coordinate --------------------------------------------------
  {
    id: 'rc-exothermic-catalyst',
    note: 'two humps (with and without a catalyst); Ea and ΔH are read off the axis, not printed',
    question: 'The energy profile shows a reaction with and without a catalyst. By how much does the catalyst lower the activation energy?',
    alt: 'An energy profile with two humps of different heights between a reactant level at 0 and a lower product level, on an energy axis in kJ/mol.',
    spec: {
      type: 'reaction_coordinate',
      params: { productsEnergy: -40, activationEnergies: [60, 35], curveLabels: ['without catalyst', 'with catalyst'] },
    },
  },
  {
    id: 'rc-endothermic-annotated-long-labels',
    note: 'endothermic, long level names, Ea and ΔH arrows asked for (symbols only)',
    question: 'On the energy profile, which arrow represents the enthalpy change of the reaction, and is the reaction endothermic or exothermic?',
    alt: 'An energy profile with one hump; the product level is higher than the reactant level, and two arrows are marked Ea and delta H.',
    spec: {
      type: 'reaction_coordinate',
      params: {
        reactantsEnergy: 20, productsEnergy: 95, activationEnergies: [140],
        reactantLabel: 'CaCO₃(s)', productLabel: 'CaO(s) + CO₂(g)',
        annotate: ['Ea', 'deltaH'],
      },
    },
  },
  {
    id: 'rc-qualitative-values-annotated',
    note: 'no axis numbers (qualitative) but annotated WITH values because the spec asks',
    question: 'The diagram shows the energy profile of a reaction. State the activation energy of the reverse reaction.',
    alt: 'An energy profile with one hump and a product level below the reactant level; arrows are labelled with the activation energy and the enthalpy change.',
    spec: {
      type: 'reaction_coordinate',
      params: { productsEnergy: -92, activationEnergies: [230], showAxisValues: false, annotate: ['Ea', 'deltaH'], annotateValues: true },
    },
  },
  // --- titration_curve ------------------------------------------------------
  {
    id: 'titration-weak-acid',
    note: 'weak acid with strong base; nothing marked — the student reads the equivalence volume',
    question: 'The curve shows 25.0 mL of a weak acid titrated with 0.100 M NaOH. Estimate the pKa of the acid.',
    alt: 'A titration curve of pH against volume of titrant from 0 to 50 mL: it starts near pH 3, rises gently, climbs steeply near 25 mL and levels off above pH 12.',
    spec: {
      type: 'titration_curve',
      params: { analyte: { type: 'weak_acid', concentration: 0.1, volume: 25, pKa: 4.76 }, titrantConcentration: 0.1 },
    },
  },
  {
    id: 'titration-strong-base-marked',
    note: 'falling curve (base titrated with acid), unequal concentrations, equivalence point marked on request',
    question: 'The curve shows 20.0 mL of NaOH titrated with 0.200 M HCl. What is the concentration of the NaOH?',
    alt: 'A titration curve that starts above pH 13, falls steeply near 15 mL of titrant and levels off near pH 1; one point on the steep part is marked.',
    spec: {
      type: 'titration_curve',
      params: { analyte: { type: 'strong_base', concentration: 0.15, volume: 20 }, titrantConcentration: 0.2, mark: ['equivalence'] },
    },
  },
  {
    id: 'titration-weak-base-both-marks',
    note: 'weak base with strong acid; both marks; long custom axis label',
    question: 'The curve shows aqueous ammonia titrated with hydrochloric acid. What is the pH at the half-equivalence point, and what does it tell you?',
    alt: 'A titration curve that starts near pH 11, falls gently through a buffer region, drops steeply near 30 mL and levels off near pH 1.5; two points are marked.',
    spec: {
      type: 'titration_curve',
      params: {
        analyte: { type: 'weak_base', concentration: 0.12, volume: 25, pKb: 4.75 }, titrantConcentration: 0.1,
        mark: ['equivalence', 'half_equivalence'], xLabel: 'Volume of 0.100 mol/L hydrochloric acid added from the burette (mL)',
      },
    },
  },
  // --- slope_field ----------------------------------------------------------
  {
    id: 'slope-x-minus-y',
    note: 'plain case; the expression is NOT printed',
    question: 'The slope field of a differential equation is shown. Which of these could be the equation: dy/dx = x − y, dy/dx = x + y, dy/dx = y − x, dy/dx = xy?',
    alt: 'A slope field on a grid from −4 to 4 in both directions; the short segments are horizontal along a diagonal line and steepen away from it.',
    spec: { type: 'slope_field', params: { expr: 'x - y', xRange: [-4, 4], yRange: [-4, 4] } },
  },
  {
    id: 'slope-x-over-y-vertical',
    note: 'vertical and undefined slopes on y = 0, steep slopes near it, a solution curve through a point',
    question: 'The slope field for dy/dx = −x/y is shown with the solution through (0, 3). Describe the shape of the solution curve.',
    alt: 'A slope field whose segments circle the origin, with one solution curve drawn as an arc through the point (0, 3).',
    spec: {
      type: 'slope_field',
      params: { expr: '-x/y', xRange: [-4, 4], yRange: [-4, 4], solutionThrough: [0, 3], showExpression: true },
    },
  },
  {
    id: 'slope-logistic-fine-grid',
    note: 'non-square ranges, half-unit grid on y, steep growth',
    question: 'The slope field for a population model is shown. For which values of y are the solutions constant?',
    alt: 'A slope field on a grid from 0 to 8 on x and −1 to 4 on y; segments are flat along two horizontal lines and steepest midway between them.',
    spec: {
      type: 'slope_field',
      params: { expr: '2*y*(1 - y/3)', xRange: [0, 8], yRange: [-1, 4], gridStep: [0.5, 0.5], yStep: 1, xLabel: 't' },
    },
  },
  {
    id: 'fix7-slope-field-on-axes',
    note: 'FIX 7 — dy/dx = y: flat segments along the x-axis and steep ones at the top and bottom rows; all inside the plot, none lost under an axis',
    question: 'The slope field for dy/dx = y is shown with the solution through (0, 1). What happens to the solution as x decreases?',
    alt: 'A slope field on a grid from −3 to 3 in both directions whose segments are flat along the x-axis and steepen away from it, with one rising solution curve through the point (0, 1).',
    spec: { type: 'slope_field', params: { expr: 'y', xRange: [-3, 3], yRange: [-3, 3], gridStep: 0.5, solutionThrough: [0, 1] } },
  },
  // --- free_body_diagram ----------------------------------------------------
  {
    id: 'fbd-incline',
    note: 'the board renderer: block on a 30° incline with friction, no magnitudes',
    question: 'The free-body diagram shows a crate at rest on a ramp. Which force balances the component of the weight along the ramp?',
    alt: 'A free-body diagram of a crate on a ramp inclined at 30 degrees with three force arrows: one perpendicular to the ramp, one straight down, and one pointing up the ramp.',
    spec: {
      type: 'free_body_diagram',
      params: {
        object: { shape: 'box', label: 'crate' },
        surface: { type: 'inclined', angle: 30, friction: true },
        forces: [{ name: 'N', direction: 'normal' }, { name: 'W', direction: 'down' }, { name: 'f', direction: 'up-slope' }],
      },
    },
  },
  {
    id: 'fbd-five-forces-magnitudes',
    note: 'five forces with magnitudes and long names, one at an angle, a title',
    question: 'Use the free-body diagram to find the net horizontal force on the sled.',
    alt: 'A free-body diagram of a sled on level ground with five labelled force arrows: up, down, left, right, and one angled up and to the right.',
    spec: {
      type: 'free_body_diagram',
      params: {
        title: 'Forces on the sled',
        object: { shape: 'box', label: 'sled', mass: '12 kg' },
        surface: { type: 'horizontal' },
        forces: [
          { name: 'Normal', magnitude: '98 N', direction: 'up' },
          { name: 'Weight', magnitude: '118 N', direction: 'down' },
          { name: 'Friction', magnitude: '15 N', direction: 'left' },
          { name: 'Push', magnitude: '30 N', direction: 'right' },
          { name: 'Rope tension', magnitude: '40 N', direction: 30 },
        ],
      },
    },
  },
];

/**
 * Batch 1 (2026-10-09) — three per new kind: one simple, one dense or
 * awkward, one with a blank "?" (its id contains "blank"). A note that says
 * "warns" marks a fixture kept to show a legibility warning.
 */
export const BATCH1_FIXTURES: FigureFixture[] = [
  // --- unit_circle ----------------------------------------------------------
  {
    id: 'unit-circle-one-angle',
    note: 'one angle in degrees with its radius, arc and reference triangle; no coordinates',
    question: 'The terminal side of the angle shown meets the unit circle at P. What is the reference angle?',
    alt: 'A unit circle on x and y axes with one radius drawn into the second quadrant, an arc from the positive x-axis marking the angle, and a dashed vertical from the point to the x-axis.',
    spec: { type: 'unit_circle', params: { angles: [{ degrees: 150, arc: true, triangle: true, name: 'P' }] } },
  },
  {
    id: 'unit-circle-dense-radians',
    note: 'eight angles in radians, every point with exact coordinates, quadrant names',
    question: 'Use the unit circle to find sin(5π/4).',
    alt: 'A unit circle with eight marked points, one every 45 degrees, each labelled with its angle in radians and its exact coordinates; the four quadrants are numbered.',
    spec: { type: 'unit_circle', params: { quadrantLabels: true, angles: [0, 1, 2, 3, 4, 5, 6, 7].map((k) => ({ pi: [k, 4], coords: 'show' })) } },
  },
  {
    id: 'unit-circle-blank-coordinate',
    note: 'the y-coordinate of one point is the blank; a second point is complete',
    question: 'The point at 7π/6 is shown with its y-coordinate missing. What is the missing value?',
    alt: 'A unit circle with two marked points: one in the first quadrant with both coordinates printed, and one in the third quadrant whose y-coordinate is replaced by a question mark.',
    spec: { type: 'unit_circle', params: { angles: [{ pi: [1, 3], coords: 'show' }, { pi: [7, 6], coords: 'blank_y', arc: true }] } },
  },
  // --- vector_diagram -------------------------------------------------------
  {
    id: 'vector-two-from-origin',
    note: 'two labelled vectors from the origin on an integer grid',
    question: 'What are the components of vector b?',
    alt: 'A coordinate grid with two arrows from the origin, labelled a and b, one pointing up and to the right and one pointing down and to the right.',
    spec: { type: 'vector_diagram', params: { xRange: [-1, 7], yRange: [-3, 5], vectors: [{ head: [3, 4], label: 'a' }, { head: [5, -2], label: 'b' }] } },
  },
  {
    id: 'vector-tip-to-tail-resultant',
    note: 'three vectors tip to tail with component dashes on one and the resultant drawn',
    question: 'The three displacements are added tip to tail. What is the magnitude of the resultant R?',
    alt: 'A coordinate grid with three arrows joined tip to tail and a heavier arrow from the start of the first to the end of the last, labelled R.',
    spec: { type: 'vector_diagram', params: { xRange: [-1, 9], yRange: [-1, 8], tipToTail: true, resultant: true, vectors: [{ components: [4, 1], label: 'u', showComponents: true }, { components: [1, 4], label: 'v' }, { components: [3, -2], label: 'w' }] } },
  },
  {
    id: 'vector-blank-resultant-label',
    note: 'two forces by magnitude and direction; the resultant is drawn but its label is "?"',
    question: 'Forces F₁ and F₂ act at the origin. What are the components of the resultant marked "?"',
    alt: 'A coordinate grid in newtons with two arrows from the origin labelled F1 and F2 and a third heavier arrow labelled with a question mark.',
    spec: { type: 'vector_diagram', params: { xRange: [-6, 6], yRange: [-2, 8], xLabel: 'x (N)', yLabel: 'y (N)', resultant: { label: '?' }, vectors: [{ magnitude: 5, direction: 90, label: 'F₁' }, { head: [-4, 2], label: 'F₂' }] } },
  },
  // --- free_body_diagram_v2 -------------------------------------------------
  {
    id: 'fbd2-four-forces-to-scale',
    note: 'four forces with sizes; arrow lengths proportional',
    question: 'What is the net horizontal force on the crate?',
    alt: 'A free-body diagram of a crate on level ground with four labelled force arrows pointing up, down, right and left, each with its size in newtons.',
    spec: { type: 'free_body_diagram_v2', params: { object: { shape: 'box', label: 'crate' }, surface: true, forces: [{ label: 'N', direction: 'up', magnitude: 60 }, { label: 'W', direction: 'down', magnitude: 60 }, { label: 'F', direction: 'right', magnitude: 45 }, { label: 'f', direction: 'left', magnitude: 20 }] } },
  },
  {
    id: 'fbd2-six-forces-incline',
    note: 'six forces on a 25° incline, long names, an angled rope with its angle arc, tilted axes; equal lengths',
    question: 'Which forces have a component along the incline?',
    alt: 'A free-body diagram of a block on a ramp inclined at 25 degrees with six labelled force arrows, one of them a rope pulling up and to the right, and a small pair of axes tilted along the ramp.',
    spec: {
      type: 'free_body_diagram_v2',
      params: {
        object: { shape: 'block' }, incline: { angle: 25 }, axes: 'incline', lengths: 'equal',
        forces: [
          { label: 'Normal', direction: 'normal' }, { label: 'Weight', direction: 'down' }, { label: 'Friction', direction: 'down-slope' },
          { label: 'Push', direction: 'up-slope' }, { label: 'Rope tension', direction: 70, showAngle: true, angleFrom: 'horizontal' }, { label: 'Drag', direction: 180 },
        ],
      },
    },
  },
  {
    id: 'fbd2-blank-missing-force',
    note: 'a hanging mass in equilibrium: one force is the blank; equal lengths so the picture does not give it away',
    question: 'The sign hangs at rest. What is the size of the force marked "?"',
    alt: 'A free-body diagram of a dot with three force arrows: two pointing up and outward at angles, one labelled with its size and one with a question mark, and one pointing straight down labelled with its size.',
    spec: {
      type: 'free_body_diagram_v2',
      params: {
        object: { shape: 'dot', label: 'sign' }, lengths: 'equal',
        forces: [{ label: 'T₁', direction: 30, magnitude: 80, showAngle: true }, { label: '?', direction: 150, showAngle: true }, { label: 'W', direction: 'down', magnitude: 80 }],
      },
    },
  },
  // --- shaded_region --------------------------------------------------------
  {
    id: 'shaded-under-line',
    note: 'area under a straight line between two bounds, integer vertices',
    question: 'What is the area of the shaded region?',
    alt: 'A coordinate grid with a rising straight line and the region between the line and the x-axis hatched from x = 1 to x = 5.',
    spec: { type: 'shaded_region', params: { xRange: [-1, 7], yRange: [-1, 7], region: { type: 'under_curve', expr: '0.5*x + 2', from: 1, to: 5 } } },
  },
  {
    id: 'shaded-between-parabola-line',
    note: 'region between a parabola and a line, both labelled, intersections marked',
    question: 'The shaded region is bounded by f and g. Between which x-values does it lie?',
    alt: 'A coordinate grid with a downward-opening parabola and a rising straight line that cross at two marked points; the region between them is hatched.',
    spec: { type: 'shaded_region', params: { xRange: [-4, 4], yRange: [-4, 6], region: { type: 'between_curves', upper: { expr: '4 - x^2', label: 'f' }, lower: { expr: 'x + 2', label: 'g' }, from: -2, to: 1, markIntersections: true } } },
  },
  {
    id: 'shaded-inequalities-blank-label',
    note: 'four linear inequalities (one strict, dashed); corner points marked, open on the dashed line; the legend names three of them and leaves one as "?"',
    question: 'Three of the four inequalities of the system are named in the key. Which inequality is the one marked "?"',
    alt: 'A coordinate grid with four boundary lines, one of them dashed, and the hatched region they enclose; its corner points are marked and a key names three of the lines.',
    spec: {
      type: 'shaded_region',
      params: {
        xRange: [-1, 9], yRange: [-1, 9],
        region: { type: 'inequalities', markVertices: true, inequalities: [{ a: 1, b: 1, op: '<=', c: 8, label: 'x + y ≤ 8' }, { a: 1, b: -1, op: '<', c: 2, label: '?' }, { a: 1, b: 0, op: '>=', c: 0, label: 'x ≥ 0' }, { a: 0, b: 1, op: '>=', c: 1, label: 'y ≥ 1' }] },
      },
    },
  },
  // --- number_line ----------------------------------------------------------
  {
    id: 'numberline-compound-inequality',
    note: 'one bounded interval, open on the left and closed on the right',
    question: 'Which inequality has the solution set shown?',
    alt: 'A number line from −6 to 6 with a thick segment from −3 to 4, an open circle at −3 and a filled circle at 4.',
    spec: { type: 'number_line', params: { min: -6, max: 6, step: 1, intervals: [{ from: -3, to: 4, fromOpen: true }] } },
  },
  {
    id: 'numberline-fractions-rays-points',
    note: 'quarter ticks labelled as fractions, a ray each way, an isolated point with a label',
    question: 'Write the set shown in interval notation.',
    alt: 'A number line from −1 to 2 with ticks every quarter labelled as fractions, a ray to the left ending in a filled circle, a ray to the right starting at an open circle, and one labelled point between them.',
    spec: { type: 'number_line', params: { min: -1, max: 2, denominator: 4, intervals: [{ from: null, to: -0.5 }, { from: 1.25, to: null, fromOpen: true }], points: [{ x: 0.5, label: 'P' }] } },
  },
  {
    id: 'numberline-blank-unlabelled-ticks',
    note: 'only two ticks are numbered; the marked point is the blank',
    question: 'What number is at the point marked "?"',
    alt: 'A number line with evenly spaced ticks of which only 0 and 1 are numbered, and one marked point to the left of 0 labelled with a question mark.',
    spec: { type: 'number_line', params: { min: -1, max: 2, step: 1, minorStep: 0.2, labelOnly: [0, 1], points: [{ x: -0.6, label: '?' }] } },
  },
  // --- sign_chart -----------------------------------------------------------
  {
    id: 'signchart-first-derivative',
    note: 'one row, two critical numbers',
    question: 'The sign chart of f′ is shown. At which x does f have a local minimum?',
    alt: 'A sign chart with one row for the first derivative: positive, then negative, then positive across two critical numbers where it is zero.',
    spec: { type: 'sign_chart', params: { critical: [-2, 3], rows: [{ label: 'f′(x)', signs: ['+', '-', '+'], at: ['0', '0'] }] } },
  },
  {
    id: 'signchart-three-rows-five-critical',
    note: 'three rows, five critical numbers including a fraction label and an undefined value',
    question: 'On which interval is f both decreasing and concave up?',
    alt: 'A sign chart with rows for f, its first derivative and its second derivative across five critical numbers, with zeros and one undefined value marked.',
    spec: {
      type: 'sign_chart',
      params: {
        critical: [-3, -1, { value: 0.5, label: '1/2' }, 2, 4],
        rows: [
          { label: 'f(x)', signs: ['-', '+', '+', '-', '-', '+'], at: ['0', '', 'und', '0', '0'] },
          { label: 'f′(x)', signs: ['+', '+', '-', '-', '+', '+'], at: ['', '0', 'und', '', '0'] },
          { label: 'f″(x)', signs: ['-', '-', '-', '+', '+', '+'], at: ['', '', 'und', '0', ''] },
        ],
      },
    },
  },
  {
    id: 'signchart-blank-cell',
    note: 'two rows; one sign and one value at a critical number are the blanks',
    question: 'f′ changes sign at x = 1 as shown. What sign belongs in the blank cell of the f′ row?',
    alt: 'A sign chart with rows for the first and second derivative across three critical numbers; one cell of the first-derivative row and one value at a critical number are replaced by question marks.',
    spec: { type: 'sign_chart', params: { critical: [-2, 1, 5], rows: [{ label: 'f′(x)', signs: ['-', '+', '-', '+'], at: ['0', '0', '0'], blankSigns: [2] }, { label: 'f″(x)', signs: ['+', '-', '-', '+'], at: ['', 'und', '0'], blankAt: [1] }] } },
  },
  // --- distribution_curve ---------------------------------------------------
  {
    id: 'normal-z-between',
    note: 'standard normal, z axis, shaded between −1 and 2; no area printed',
    question: 'About what proportion of the distribution is shaded? Use the 68–95–99.7 rule.',
    alt: 'A bell curve over a z axis from −3 to 3 with the region between z = −1 and z = 2 hatched.',
    spec: { type: 'distribution_curve', params: { axis: 'z', shade: [{ from: -1, to: 2 }], xLabel: 'z' } },
  },
  {
    id: 'normal-x-two-tails-area',
    note: 'x axis with mean 500 and σ 100, both tails shaded at non-tick bounds, areas printed',
    question: 'What total proportion of scores lies in the two shaded tails?',
    alt: 'A bell curve over an axis of test scores centred on 500 with both tails hatched, the left below 350 and the right above 650, each with its area printed.',
    spec: { type: 'distribution_curve', params: { mean: 500, sd: 100, shade: [{ from: null, to: 350 }, { from: 650, to: null }], showArea: true, xLabel: 'Test score', title: 'SAT section scores' } },
  },
  {
    id: 'normal-blank-bound',
    note: 'no numbers on the axis (σ ticks only); the right-tail bound is the blank "?"',
    question: 'The shaded right tail holds 2.5 % of the distribution. What value belongs at the "?"',
    alt: 'A bell curve over an axis with a tick at every standard deviation and no numbers, with the right tail hatched from a bound marked with a question mark.',
    spec: { type: 'distribution_curve', params: { mean: 70, sd: 5, axis: 'none', shade: [{ from: 79.8, to: null, label: '?' }], xLabel: 'Height (in), mean 70, σ = 5' } },
  },
  // --- histogram ------------------------------------------------------------
  {
    id: 'histogram-masses',
    note: 'five bins, labelled axes, no counts printed',
    question: 'How many apples have a mass of at least 120 g?',
    alt: 'A histogram of apple masses in five classes of width 10 grams from 100 to 150, with frequencies read from the vertical axis.',
    spec: { type: 'histogram', params: { binStart: 100, binWidth: 10, counts: [3, 7, 12, 6, 2], xLabel: 'Mass (g)', yLabel: 'Number of apples' } },
  },
  {
    id: 'histogram-dense-decimals',
    note: 'fourteen bins of width 0.5, an empty bin, long axis labels, a title',
    question: 'Which class is the modal class?',
    alt: 'A histogram of reaction times with fourteen classes of width half a second, one of them empty.',
    spec: { type: 'histogram', params: { title: 'Reaction times of 120 volunteers', binStart: 0, binWidth: 0.5, counts: [1, 4, 9, 15, 22, 19, 16, 12, 9, 0, 6, 4, 2, 1], xLabel: 'Reaction time (seconds)', yLabel: 'Number of volunteers' } },
  },
  {
    id: 'histogram-blank-bin',
    note: 'counts printed above the bars; one bin is the blank "?" (the total is in the question)',
    question: 'The 20 students of a class took a quiz. How many scored at least 10 but less than 15?',
    alt: 'A histogram of quiz scores in four classes of width 5 with the count printed above three bars and a question mark in place of the third bar.',
    spec: { type: 'histogram', params: { binStart: 0, binWidth: 5, counts: [2, 5, 9, 4], showCounts: true, blankBins: [2], xLabel: 'Score', yLabel: 'Number of students' } },
  },
  // --- box_plot -------------------------------------------------------------
  {
    id: 'boxplot-single',
    note: 'one box plot on a numbered axis',
    question: 'What is the interquartile range of the data?',
    alt: 'A box plot over a number line from 0 to 40 with whiskers, a box and a median line.',
    spec: { type: 'box_plot', params: { plots: [{ min: 4, q1: 12, median: 18, q3: 26, max: 36 }], range: [0, 40], step: 4, xLabel: 'Minutes' } },
  },
  {
    id: 'boxplot-four-stacked-outliers',
    note: 'four stacked box plots with long labels and outliers on both sides',
    question: 'Which class has the greatest median score?',
    alt: 'Four box plots stacked over one axis of scores from 20 to 100, labelled by class, two of them with outlier dots.',
    spec: {
      type: 'box_plot',
      params: {
        range: [20, 100], step: 10, xLabel: 'Score (%)',
        plots: [
          { label: 'Period 1', min: 45, q1: 60, median: 70, q3: 80, max: 95, outliers: [25] },
          { label: 'Period 2', min: 40, q1: 55, median: 65, q3: 70, max: 85 },
          { label: 'Period 3', min: 50, q1: 65, median: 75, q3: 85, max: 90, outliers: [30, 35] },
          { label: 'Period 4', min: 35, q1: 50, median: 60, q3: 75, max: 90 },
        ],
      },
    },
  },
  {
    id: 'boxplot-blank-compare-two',
    note: 'two box plots; one label is the blank "?" (the question asks which data set it is)',
    question: 'One box plot shows City A. Which city could the plot marked "?" show: one with a median daily high of 55, 60 or 70 °F?',
    alt: 'Two box plots over one axis of temperatures from 40 to 90, one labelled City A and one labelled with a question mark.',
    spec: { type: 'box_plot', params: { range: [40, 90], step: 10, xLabel: 'Daily high (°F)', plots: [{ label: 'City A', min: 45, q1: 55, median: 60, q3: 70, max: 85 }, { label: '?', min: 50, q1: 65, median: 70, q3: 75, max: 80 }] } },
  },
  // --- polar_complex --------------------------------------------------------
  {
    id: 'complex-two-points',
    note: 'complex plane with two labelled numbers',
    question: 'What is z + w?',
    alt: 'A complex plane with real and imaginary axes from −6 to 6 and two labelled points, z in the first quadrant and w in the second.',
    spec: { type: 'polar_complex', params: { plane: 'complex', range: 6, points: [{ re: 3, im: 4, label: 'z' }, { re: -2, im: 1, label: 'w' }] } },
  },
  {
    id: 'polar-rose-dense-grid',
    note: 'polar grid with rays every 15° (labelled every 30°), a four-petal rose and two points',
    question: 'The graph of a polar curve is shown. What is the greatest value of r on the curve?',
    alt: 'A polar grid with circles at r = 1 to 4 and rays every 15 degrees, a four-petalled rose curve, and two labelled points.',
    spec: { type: 'polar_complex', params: { plane: 'polar', rMax: 4, angleStep: 15, curve: { expr: '4*cos(2*theta)' }, points: [{ r: 2, theta: 60, label: 'A' }, { r: 3, theta: 225, label: 'B' }] } },
  },
  {
    id: 'complex-blank-modulus-argument',
    note: 'modulus segment, argument arc labelled θ, dashed projections; the point label is the blank',
    question: 'The complex number marked "?" is shown with its modulus and argument θ. What is its modulus?',
    alt: 'A complex plane with one point in the second quadrant joined to the origin, an arc from the positive real axis labelled theta, dashed lines to both axes, and a question mark as the point label.',
    spec: { type: 'polar_complex', params: { plane: 'complex', range: 6, points: [{ re: -3, im: 4, label: '?', showModulus: true, showArgument: true, argumentLabel: 'θ', projections: true }] } },
  },
  // --- punnett_square -------------------------------------------------------
  {
    id: 'punnett-monohybrid',
    note: '2 × 2 cross with parent labels',
    question: 'What fraction of the offspring are expected to be heterozygous?',
    alt: 'A two-by-two Punnett square for a cross of two heterozygous parents, with the gametes A and a along the top and the side.',
    spec: { type: 'punnett_square', params: { top: ['A', 'a'], side: ['A', 'a'], topLabel: 'Father (Aa)', sideLabel: 'Mother (Aa)' } },
  },
  {
    id: 'punnett-dihybrid-phenotypes',
    note: '4 × 4 dihybrid cross with four phenotype classes hatched and a legend',
    question: 'What is the expected phenotype ratio of the offspring?',
    alt: 'A four-by-four Punnett square for a dihybrid cross with sixteen genotypes, hatched in four styles by phenotype with a legend.',
    spec: {
      type: 'punnett_square',
      params: {
        top: ['RY', 'Ry', 'rY', 'ry'], side: ['RY', 'Ry', 'rY', 'ry'], topLabel: 'RrYy', sideLabel: 'RrYy',
        phenotypes: [
          { label: 'round, yellow', genotypes: ['RRYY', 'RRYy', 'RrYY', 'RrYy'] }, { label: 'round, green', genotypes: ['RRyy', 'Rryy'] },
          { label: 'wrinkled, yellow', genotypes: ['rrYY', 'rrYy'] }, { label: 'wrinkled, green', genotypes: ['rryy'] },
        ],
      },
    },
  },
  {
    id: 'punnett-blank-gamete-and-cell',
    note: 'X-linked cross with explicit cells; one gamete header and one cell are blanks',
    question: 'What genotype belongs in the blank cell of the Punnett square?',
    alt: 'A two-by-two Punnett square for an X-linked cross in which one gamete on the top edge and one cell are replaced by question marks.',
    spec: { type: 'punnett_square', params: { top: ['Xᴬ', 'Y'], side: ['Xᴬ', 'Xᵃ'], cells: [['XᴬXᴬ', 'XᴬY'], ['XᴬXᵃ', 'XᵃY']], blankTop: [1], blankCells: [[1, 1]], topLabel: 'Father', sideLabel: 'Mother' } },
  },
  // --- pedigree -------------------------------------------------------------
  {
    id: 'pedigree-two-generations',
    note: 'two unaffected parents with three children, one affected',
    question: 'Individual II-3 is affected and neither parent is. Is the trait more likely dominant or recessive?',
    alt: 'A two-generation pedigree: an unaffected couple with three children, the third of whom, a daughter, is affected.',
    spec: { type: 'pedigree', params: { individuals: [{ id: 'f', sex: 'M' }, { id: 'm', sex: 'F' }, { id: 'c1', sex: 'M', father: 'f', mother: 'm' }, { id: 'c2', sex: 'F', father: 'f', mother: 'm' }, { id: 'c3', sex: 'F', father: 'f', mother: 'm', affected: true }] } },
  },
  {
    id: 'pedigree-three-generations-14',
    note: 'three generations, fourteen individuals, two married-in partners, carriers shown',
    question: 'The pedigree shows an X-linked recessive trait. What is the probability that a son of III-2 is affected?',
    alt: 'A three-generation pedigree of fourteen individuals with affected males in every generation and three females marked as carriers.',
    spec: {
      type: 'pedigree',
      params: {
        individuals: [
          { id: 'g1', sex: 'M', affected: true }, { id: 'g2', sex: 'F' },
          { id: 'a', sex: 'F', father: 'g1', mother: 'g2', carrier: true }, { id: 'ah', sex: 'M' },
          { id: 'b', sex: 'M', father: 'g1', mother: 'g2' },
          { id: 'c', sex: 'F', father: 'g1', mother: 'g2', carrier: true }, { id: 'ch', sex: 'M' },
          { id: 'a1', sex: 'M', father: 'ah', mother: 'a', affected: true }, { id: 'a2', sex: 'F', father: 'ah', mother: 'a', carrier: true }, { id: 'a3', sex: 'M', father: 'ah', mother: 'a' },
          { id: 'c1', sex: 'F', father: 'ch', mother: 'c' }, { id: 'c2', sex: 'M', father: 'ch', mother: 'c', affected: true }, { id: 'c3', sex: 'M', father: 'ch', mother: 'c' }, { id: 'c4', sex: 'F', father: 'ch', mother: 'c' },
        ],
      },
    },
  },
  {
    id: 'pedigree-blank-unknown-individual',
    note: 'two families joined by a marriage in generation II; the status of one grandchild is the blank "?"',
    question: 'The trait is autosomal recessive. What is the probability that individual III-2 is affected?',
    alt: 'A three-generation pedigree in which two sets of grandparents each have children, one child from each family marry, and one of their three children is drawn with a question mark.',
    spec: {
      type: 'pedigree',
      params: {
        individuals: [
          { id: 'p1', sex: 'M' }, { id: 'p2', sex: 'F', affected: true }, { id: 'q1', sex: 'M', affected: true }, { id: 'q2', sex: 'F' },
          { id: 'x1', sex: 'F', father: 'p1', mother: 'p2' }, { id: 'x2', sex: 'M', father: 'p1', mother: 'p2' },
          { id: 'y1', sex: 'F', father: 'q1', mother: 'q2' }, { id: 'y2', sex: 'M', father: 'q1', mother: 'q2' },
          { id: 'k1', sex: 'F', father: 'x2', mother: 'y1', affected: true }, { id: 'k2', sex: 'M', father: 'x2', mother: 'y1', unknown: true }, { id: 'k3', sex: 'F', father: 'x2', mother: 'y1' },
        ],
      },
    },
  },
];

FIGURE_FIXTURES.push(...BATCH1_FIXTURES);

// ---------------------------------------------------------------------------
// Batch 2 (2026-10-09): three per kind — a simple one, a dense or awkward one,
// and one with "?" blanks (its id says "blank").
// ---------------------------------------------------------------------------
export const BATCH2_FIXTURES: FigureFixture[] = [
  // --- circuit_diagram ------------------------------------------------------
  {
    id: 'circuit-series-two-resistors',
    note: 'one loop: battery, switch, two resistors in series, an ammeter',
    question: 'What is the reading on the ammeter when the switch is closed?',
    alt: 'A circuit with a 12 volt battery, a closed switch, a 4 ohm resistor, a 2 ohm resistor and an ammeter in one loop.',
    spec: { type: 'circuit_diagram', params: { battery: { emf: 12 }, circuit: { series: [{ type: 'switch', name: 'S' }, { type: 'resistor', name: 'R₁', value: 4 }, { type: 'resistor', name: 'R₂', value: 2 }, { type: 'ammeter' }] } } },
  },
  {
    id: 'circuit-combination-eight-components',
    note: 'dense: series resistor, a three-branch parallel group with a switch and a nested series pair, a voltmeter across a resistor, an ammeter on the return wire',
    question: 'With the switch closed, what is the equivalent resistance of the circuit?',
    alt: 'A circuit with a 24 volt battery, a resistor in series with three parallel branches, a resistor with a voltmeter across it, and an ammeter.',
    spec: {
      type: 'circuit_diagram',
      params: {
        battery: { emf: 24, name: 'ε', current: 'I' },
        circuit: { series: [
          { type: 'resistor', name: 'R₁', value: 2 },
          { parallel: [{ type: 'resistor', name: 'R₂', value: 12 }, { series: [{ type: 'switch', name: 'S', closed: false }, { type: 'resistor', name: 'R₃', value: 6 }] }, { type: 'bulb', name: 'B', value: 4, show: 'name' }] },
          { parallel: [{ type: 'resistor', name: 'R₄', value: 3 }, { type: 'voltmeter' }] },
          { type: 'ammeter', name: 'A', show: 'none' },
        ] },
      },
    },
  },
  {
    id: 'circuit-blank-parallel-bulbs',
    note: 'three identical bulbs (one in series with a parallel pair) and a capacitor branch; the battery EMF and one current are blanks',
    question: 'Bulbs A, B and C are identical. Rank the bulbs by brightness.',
    alt: 'A circuit in which bulb A is in series with bulbs B and C, which are in parallel with each other; the battery voltage is replaced by a question mark.',
    spec: {
      type: 'circuit_diagram',
      params: {
        battery: { emf: 9, show: 'blank', current: '?' },
        circuit: { series: [{ type: 'bulb', name: 'A', value: 6, show: 'name' }, { parallel: [{ type: 'bulb', name: 'B', value: 6, show: 'name' }, { type: 'bulb', name: 'C', value: 6, show: 'name', current: 'I₂' }, { type: 'capacitor', name: 'C₁', value: 10, show: 'blank' }] }] },
      },
    },
  },
  // --- phylogenetic_tree ----------------------------------------------------
  {
    id: 'phylo-five-vertebrates',
    note: 'five tips, an outgroup, four derived traits named on the branches',
    question: 'According to the cladogram, which trait is shared by the frog, the lizard and the mouse but not by the trout?',
    alt: 'A cladogram of lamprey, trout, frog, lizard and mouse with four tick marks for derived traits along the branches.',
    spec: {
      type: 'phylogenetic_tree',
      params: {
        outgroup: 'Lamprey',
        tree: { children: ['Lamprey', { traits: ['jaws'], children: ['Trout', { traits: ['four limbs'], children: ['Frog', { traits: ['amniotic egg'], children: ['Lizard', { name: 'Mouse', traits: ['hair'] }] }] }] }] },
      },
    },
  },
  {
    id: 'phylo-nine-taxa-labelled-nodes',
    note: 'dense: nine tips, six labelled internal nodes, a three-way split, traits listed in a key',
    question: 'Which labelled node represents the most recent common ancestor of the crocodile and the sparrow?',
    alt: 'A cladogram of nine animals with internal nodes labelled A to F and numbered trait marks explained in a key below the tree.',
    spec: {
      type: 'phylogenetic_tree',
      params: {
        traitStyle: 'key',
        tree: { node: 'A', children: [
          'Shark',
          { node: 'B', traits: ['bony skeleton'], children: [
            'Salmon',
            { node: 'C', traits: ['four limbs'], children: [
              'Salamander',
              { node: 'D', traits: ['amniotic egg'], children: [
                { node: 'E', traits: ['hair', 'mammary glands'], children: ['Platypus', 'Kangaroo', 'Human'] },
                { node: 'F', children: ['Turtle', { children: ['Crocodile', { name: 'Sparrow', traits: ['feathers'] }] }] },
              ] },
            ] },
          ] },
        ] },
      },
    },
  },
  {
    id: 'phylo-blank-tip-and-trait',
    note: 'six plants; one tip and one trait are blanks',
    question: 'Which group of plants belongs at the tip marked "?" — it has vascular tissue and seeds but no flowers?',
    alt: 'A cladogram of six plant groups in which one tip label and one trait label are replaced by question marks.',
    spec: {
      type: 'phylogenetic_tree',
      params: {
        tree: { children: ['Green algae', { traits: ['embryo'], children: ['Mosses', { traits: ['vascular tissue'], children: ['Ferns', { traits: [{ label: 'seeds', blank: true }], children: [{ name: 'Conifers', blank: true }, { traits: ['flowers'], children: ['Monocots', 'Eudicots'] }] }] }] }] },
      },
    },
  },
  // --- geometric_figure -----------------------------------------------------
  {
    id: 'geometry-right-triangle',
    note: 'a right triangle from its sides: two sides and one angle labelled, a right-angle mark',
    question: 'In right triangle ABC, what is the length of side AC?',
    alt: 'A right triangle ABC with the right angle at B, a base of 12 centimetres and a vertical side of 5 centimetres; the side AC is labelled x.',
    spec: { type: 'geometric_figure', params: { shape: 'triangle', sides: [5, 13, 12], unit: 'cm', sideLabels: ['auto', 'x', 'auto'], angleLabels: ['θ', null, null] } },
  },
  {
    id: 'geometry-circle-chords-tangent',
    note: 'dense: a circle with a radius, three chords, a tangent to an external point, an inscribed angle, a central angle, a hatched sector and a heavy arc',
    question: 'O is the centre of the circle and PT is tangent to the circle at T. What is the measure of angle ACB?',
    alt: 'A circle with centre O, points A, B, C, D and T on it, a hatched sector AOB with a central angle of 80 degrees, chords from C to A and to B and from A to D, and a tangent line from T to an outside point P.',
    spec: {
      type: 'geometric_figure',
      params: {
        shape: 'circle', radius: 5, unit: 'cm',
        points: [{ name: 'A', at: 20 }, { name: 'B', at: 100 }, { name: 'C', at: 215 }, { name: 'D', at: 255 }, { name: 'T', at: 320 }],
        radii: [{ to: 'T', label: 'auto' }],
        chords: [{ from: 'C', to: 'A' }, { from: 'C', to: 'B' }, { from: 'A', to: 'D' }],
        angles: [{ vertex: 'center', from: 'A', to: 'B', label: 'auto' }, { vertex: 'C', from: 'A', to: 'B', label: 'x' }],
        sector: { from: 'A', to: 'B' },
        tangent: { at: 'T', length: 6, end: 'P', label: 'auto' },
      },
    },
  },
  {
    id: 'geometry-blank-parallel-lines',
    note: 'parallel lines and a transversal: one angle given, one an expression, one a blank',
    question: 'Lines ℓ and m are parallel. What is the measure of the angle marked "?"',
    alt: 'Two parallel horizontal lines cut by a slanted transversal, with one angle labelled 115 degrees, one labelled 2x plus 5 degrees and one replaced by a question mark.',
    spec: { type: 'geometric_figure', params: { shape: 'parallel_lines', angle: 65, labels: { 1: 'auto', 4: '2x + 5°', 7: '?' } } },
  },
  {
    id: 'geometry-blank-similar-triangles',
    note: 'two similar triangles at one scale, the second rotated; one side of the second is a blank; drawn not to scale by request',
    question: 'Triangle ABC is similar to triangle DEF. What is the length of side DF?',
    alt: 'Two similar triangles: ABC with sides 6, 8 and 9, and a larger triangle DEF with one side 12 and one side replaced by a question mark.',
    spec: {
      type: 'geometric_figure',
      params: { shape: 'similar_triangles', sides: [6, 8, 9], scale: 1.5, rotate: 25, sideLabels: [['auto', 'auto', 'auto'], [null, '?', '13.5']], angleLabels: [['α', 'β', null], ['α', 'β', null]], notToScale: true },
    },
  },
  {
    id: 'geometry-polygon-isosceles-trapezoid',
    note: 'a polygon from coordinates: equal-side ticks, a right-angled corner would be marked; side and angle labels',
    question: 'What is the perimeter of the isosceles trapezoid?',
    alt: 'An isosceles trapezoid ABCD with a base of 14, a top of 8 and two equal slanted sides of 5 marked with single ticks; one base angle is labelled.',
    spec: { type: 'geometric_figure', params: { shape: 'polygon', points: [[0, 0], [14, 0], [11, 4], [3, 4]], sideLabels: ['auto', 'auto', 'auto', null], ticks: [0, 1, 0, 1], angleLabels: ['auto', null, null, null] } },
  },
  // --- ray_diagram ----------------------------------------------------------
  {
    id: 'ray-converging-lens-real-image',
    note: 'converging lens, object beyond 2F: three principal rays, a real inverted image, object distance and focal length given',
    question: 'How far from the lens does the image form?',
    alt: 'A ray diagram of a converging lens with an upright object arrow 30 centimetres to its left, three rays meeting at an inverted image on the right, and focal points marked on both sides.',
    spec: { type: 'ray_diagram', params: { element: 'converging_lens', focalLength: 10, objectDistance: 30, objectHeight: 4, show: { objectDistance: 'value', focalLength: 'value' } } },
  },
  {
    id: 'ray-concave-mirror-virtual-image',
    note: 'awkward: object inside the focal point of a concave mirror — rays traced back (dashed) to an enlarged virtual image behind the mirror; every distance and both heights printed',
    question: 'Is the image formed by the mirror real or virtual, and is it upright or inverted?',
    alt: 'A ray diagram of a concave mirror with the object between the focal point and the mirror; dashed lines behind the mirror meet at a larger upright image.',
    spec: { type: 'ray_diagram', params: { element: 'concave_mirror', focalLength: 12, objectDistance: 6, objectHeight: 3, show: { objectDistance: 'value', imageDistance: 'value', focalLength: 'value', objectHeight: 'value', imageHeight: 'value' } } },
  },
  {
    id: 'ray-blank-diverging-lens',
    note: 'diverging lens with rays 1 and 2 only; the image distance is a blank',
    question: 'What is the image distance for this diverging lens?',
    alt: 'A ray diagram of a diverging lens with an object 20 centimetres to its left and a smaller upright virtual image on the same side; the image distance is replaced by a question mark.',
    spec: { type: 'ray_diagram', params: { element: 'diverging_lens', focalLength: 20, objectDistance: 20, objectHeight: 8, rays: [1, 2], show: { objectDistance: 'value', imageDistance: 'blank', focalLength: 'value' } } },
  },
  {
    id: 'ray-blank-refraction-interface',
    note: 'plane interface: incident, reflected and refracted rays; the refraction angle and the lower index are blanks',
    question: 'A ray of light passes from air into a liquid as shown. What is the refractive index of the liquid?',
    alt: 'A ray of light strikes a horizontal boundary between air and a liquid at 50 degrees to the normal; a reflected ray and a refracted ray bent toward the normal are shown, with the refraction angle given as 35 degrees and the index of the liquid replaced by a question mark.',
    spec: { type: 'ray_diagram', params: { element: 'interface', n1: 1, n2: 1.336, incidentAngle: 50, media: ['air', 'liquid'], reflected: true, show: { n2: 'blank' }, angleLabels: { incident: 'auto', reflected: 'θr', refracted: 'auto' } } },
  },
  // --- field_diagram --------------------------------------------------------
  {
    id: 'field-dipole',
    note: 'two equal and opposite point charges: eight lines each, a marked point P',
    question: 'What is the direction of the electric field at point P?',
    alt: 'Electric field lines running from a positive charge on the left to a negative charge on the right, with a point P marked midway between them and above.',
    spec: { type: 'field_diagram', params: { variant: 'point_charges', charges: [{ x: -2, y: 0, q: 1 }, { x: 2, y: 0, q: -1 }], points: [{ x: 0, y: 1.6, label: 'P' }] } },
  },
  {
    id: 'field-three-charges-equipotentials',
    note: 'dense: three charges of different sizes (+2, −1, +1), labels, two dashed equipotentials',
    question: 'Which charge has the greatest magnitude, and how can you tell from the field lines?',
    alt: 'Field lines of three point charges: twelve lines leave the charge q1, six arrive at q2 and six leave q3; two dashed closed curves are equipotentials.',
    spec: {
      type: 'field_diagram',
      params: { variant: 'point_charges', linesPerUnit: 6, charges: [{ x: -3, y: -1, q: 2, label: 'q₁' }, { x: 2, y: -1.5, q: -1, label: 'q₂' }, { x: 1, y: 2.5, q: 1, label: 'q₃' }], xRange: [-7, 6], yRange: [-5.5, 5.5], equipotentials: [[-3, 0.4], [1, 3.6]] },
    },
  },
  {
    id: 'field-blank-unknown-charges',
    note: 'two charges whose signs are not shown (the lines and their arrowheads fix them); the label of one is a blank',
    question: 'The field lines of two point charges are shown. The charge on the left is +3 nC. What is the charge on the right?',
    alt: 'Field lines leave an unmarked charge on the left, twelve in all, and four of them end on a smaller unmarked charge on the right, whose label is a question mark.',
    spec: { type: 'field_diagram', params: { variant: 'point_charges', linesPerUnit: 4, charges: [{ x: -2, y: 0, q: 3, showSign: false, label: '+3 nC' }, { x: 2.5, y: 0, q: -1, showSign: false, label: '?' }], xRange: [-6.5, 6.5], yRange: [-4.6, 4.6] } },
  },
  {
    id: 'field-uniform-plates-electron',
    note: 'uniform field between charged plates, an electron between them, plate separation and voltage printed; the force arrow is not shown',
    question: 'What is the direction of the electric force on the electron?',
    alt: 'Two horizontal parallel plates, the upper one positive and the lower one negative, with field arrows pointing down between them and an electron between the plates.',
    spec: { type: 'field_diagram', params: { variant: 'uniform', direction: 'down', separation: { value: 2, unit: 'cm' }, voltage: { value: 120 }, charge: { sign: '−', label: 'e⁻' } } },
  },
  {
    id: 'field-magnetic-force-negative-charge',
    note: 'a negative charge moving right in a field into the page; the force arrow is hidden (it is the question)',
    question: 'What is the direction of the magnetic force on the charge?',
    alt: 'A region of magnetic field directed into the page, drawn as crosses in circles, with a negative charge moving to the right.',
    spec: { type: 'field_diagram', params: { variant: 'magnetic_force', field: 'into', charge: { sign: '−', velocity: 'right', label: 'q' } } },
  },
  {
    id: 'field-wire-cross-section',
    note: 'a wire seen end-on carrying current out of the page: three rings with arrowheads, a point P to its right',
    question: 'What is the direction of the magnetic field at point P?',
    alt: 'A wire seen end-on with current out of the page, surrounded by three circular field lines with counter-clockwise arrowheads, and a point P to the right of the wire.',
    spec: { type: 'field_diagram', params: { variant: 'wire', view: 'cross_section', current: 'out', point: { side: 'right' } } },
  },
  // --- flow_diagram ---------------------------------------------------------
  {
    id: 'flow-chain-cellular-respiration',
    note: 'a process chain of four boxes with a label on every arrow',
    question: 'In which stage shown is most of the ATP produced?',
    alt: 'Four boxes joined by arrows: glucose, then pyruvate, then acetyl-CoA, then carbon dioxide and water, with the arrows labelled glycolysis, link reaction and Krebs cycle.',
    spec: { type: 'flow_diagram', params: { variant: 'chain', nodes: [{ id: 'g', label: 'Glucose' }, { id: 'p', label: 'Pyruvate' }, { id: 'a', label: 'Acetyl-CoA' }, { id: 'c', label: 'CO₂ + H₂O' }], steps: ['glycolysis', 'link reaction', 'Krebs cycle'] } },
  },
  {
    id: 'flow-food-web-nine',
    note: 'dense: a food web of nine organisms on a three-column grid with thirteen arrows',
    question: 'Which organism in the food web is both a secondary and a tertiary consumer?',
    alt: 'A food web: grass, shrubs and algae at the bottom; grasshopper, rabbit and small fish above them; frog and snake above those; and a hawk at the top, joined by arrows that point from each organism to what eats it.',
    spec: {
      type: 'flow_diagram',
      params: {
        variant: 'web',
        nodes: [
          { id: 'hawk', label: 'Hawk', col: 1, row: 0 },
          { id: 'snake', label: 'Snake', col: 0, row: 1 }, { id: 'frog', label: 'Frog', col: 2, row: 1 },
          { id: 'hopper', label: 'Grasshopper', col: 0, row: 2 }, { id: 'rabbit', label: 'Rabbit', col: 1, row: 2 }, { id: 'fish', label: 'Small fish', col: 2, row: 2 },
          { id: 'grass', label: 'Grass', col: 0, row: 3 }, { id: 'shrub', label: 'Shrubs', col: 1, row: 3 }, { id: 'algae', label: 'Algae', col: 2, row: 3 },
        ],
        edges: [
          { from: 'grass', to: 'hopper' }, { from: 'grass', to: 'rabbit' }, { from: 'shrub', to: 'rabbit' }, { from: 'shrub', to: 'hopper' }, { from: 'algae', to: 'fish' },
          { from: 'hopper', to: 'snake' }, { from: 'hopper', to: 'frog' }, { from: 'rabbit', to: 'snake' }, { from: 'rabbit', to: 'hawk' }, { from: 'fish', to: 'frog' },
          { from: 'frog', to: 'snake' }, { from: 'snake', to: 'hawk' }, { from: 'frog', to: 'hawk' },
        ],
      },
    },
  },
  {
    id: 'flow-blank-feedback-loop',
    note: 'a feedback loop of four boxes with + / − on the arrows; one box and one sign are blanks',
    question: 'Body temperature rises above the set point. What goes in the box marked "?", and is this loop positive or negative feedback?',
    alt: 'A loop of four boxes joined by arrows carrying plus and minus signs: body temperature, hypothalamus, a box with a question mark, and heat loss; one arrow carries a question mark instead of a sign.',
    spec: {
      type: 'flow_diagram',
      params: { variant: 'cycle', nodes: [{ id: 't', label: 'Body temperature' }, { id: 'h', label: 'Hypothalamus signal' }, { id: 's', label: 'Sweating', blank: true }, { id: 'l', label: 'Heat loss' }], steps: [{ sign: '+' }, { sign: '+' }, { sign: '+' }, { sign: '−', blank: true }] },
    },
  },
  {
    id: 'flow-blank-energy-pyramid',
    note: 'an energy pyramid of four trophic levels; the energy at the third level is a blank',
    question: 'About 10 % of the energy at one trophic level passes to the next. How much energy is available to the secondary consumers?',
    alt: 'A pyramid of four stacked bars, widest at the bottom: producers with 50 000 kilojoules, primary consumers with 5 000, secondary consumers with a question mark and tertiary consumers with 50.',
    spec: { type: 'flow_diagram', params: { variant: 'pyramid', unit: 'kJ', transferPercent: 10, levels: [{ label: 'Producers', value: 50000 }, { label: 'Primary consumers', value: 5000 }, { label: 'Secondary consumers', value: 500, show: 'blank' }, { label: 'Tertiary consumers', value: 50 }] } },
  },
  // --- solid_3d -------------------------------------------------------------
  {
    id: 'solid-cylinder',
    note: 'a cylinder with its radius and height labelled; the back of the base is dashed',
    question: 'What is the volume of the cylinder, in terms of π?',
    alt: 'A cylinder with a radius of 3 centimetres marked on its top face and a height of 8 centimetres.',
    spec: { type: 'solid_3d', params: { solid: 'cylinder', radius: 3, height: 8, unit: 'cm' } },
  },
  {
    id: 'solid-composite-prism-pyramid',
    note: 'dense: a square pyramid on a square prism — hidden edges dashed, the heights of both parts and the slant height labelled',
    question: 'What is the total volume of the solid?',
    alt: 'A solid made of a square-based box 6 metres wide and 4 metres high with a pyramid 4 metres high on top; the slant height of the pyramid is labelled 5 metres.',
    spec: { type: 'solid_3d', params: { solid: 'composite', bottom: 'prism', top: 'pyramid', base: 6, height: 4, topHeight: 4, unit: 'm', labels: { slant: 'auto' } } },
  },
  {
    id: 'solid-blank-cone-slant',
    note: 'a cone with radius and height given; the slant height is a blank',
    question: 'What is the slant height of the cone?',
    alt: 'A cone with a base radius of 5 centimetres and a height of 12 centimetres; its slant height is replaced by a question mark.',
    spec: { type: 'solid_3d', params: { solid: 'cone', radius: 5, height: 12, unit: 'cm', labels: { slant: '?' } } },
  },
  {
    id: 'solid-triangular-prism',
    note: 'a triangular prism: the height of the triangular face dashed with its right-angle mark',
    question: 'What is the volume of the triangular prism?',
    alt: 'A triangular prism whose triangular face has a base of 6 inches and a height of 4 inches, and whose length is 10 inches.',
    spec: { type: 'solid_3d', params: { solid: 'triangular_prism', base: 6, height: 4, length: 10, unit: 'in' } },
  },
  {
    id: 'solid-silo-cylinder-hemisphere',
    note: 'a hemisphere on a cylinder, the radius written as an expression',
    question: 'A silo is a cylinder with a hemisphere on top. Write its volume in terms of r.',
    alt: 'A cylinder with a dome on top; the radius of the base is labelled r and the height of the cylinder 3r.',
    spec: { type: 'solid_3d', params: { solid: 'composite', bottom: 'cylinder', top: 'hemisphere', radius: 2, height: 6, labels: { radius: 'r', height: '3r' }, notToScale: true } },
  },
  {
    id: 'solid-revolution-washer',
    note: 'solid of revolution about the x-axis: the region between y = √x and y = x² hatched, its mirror image dashed, one washer strip',
    question: 'The region between the two curves is revolved about the x-axis. What is the volume of the solid, in terms of π?',
    alt: 'A graph of two curves that meet at the origin and at the point 1, 1, with the region between them hatched, a thin vertical strip in the region, and the mirror image of the region drawn dashed below the x-axis.',
    spec: { type: 'solid_3d', params: { solid: 'revolution', axis: 'x', outer: { poly: [0, 1], sqrt: true, label: 'y = √x' }, inner: { poly: [0, 0, 1], label: 'y = x²' }, from: 0, to: 1, xStep: 0.5, yStep: 0.5 } },
  },
  // --- spectrum -------------------------------------------------------------
  {
    id: 'spectrum-mass-copper',
    note: 'a mass spectrum with two isotope peaks on a numbered abundance axis',
    question: 'The mass spectrum of an element is shown. What is its average atomic mass?',
    alt: 'A mass spectrum with a bar at 63 reaching about 69 percent and a bar at 65 reaching about 31 percent.',
    spec: { type: 'spectrum', params: { variant: 'mass', peaks: [{ mz: 63, abundance: 69.2 }, { mz: 65, abundance: 30.8 }], xRange: [60, 68], yMax: 80, yStep: 10 } },
  },
  {
    id: 'spectrum-pes-sodium',
    note: 'awkward: a photoelectron spectrum over four decades of binding energy (axis increases to the left), four peaks of heights 2, 2, 6, 1, two of them close together',
    question: 'The photoelectron spectrum of an element is shown. Which element is it?',
    alt: 'A photoelectron spectrum with peaks at binding energies of 104, 6.84, 3.67 and 0.50 megajoules per mole and relative heights of 2, 2, 6 and 1.',
    spec: { type: 'spectrum', params: { variant: 'pes', peaks: [{ energy: 104, electrons: 2 }, { energy: 6.84, electrons: 2 }, { energy: 3.67, electrons: 6 }, { energy: 0.5, electrons: 1 }] } },
  },
  {
    id: 'spectrum-blank-mass-magnesium',
    note: 'three isotope peaks with labels; the label of the middle one is a blank',
    question: 'Which isotope gives the peak marked "?"',
    alt: 'A mass spectrum with a tall bar at 24, and two short bars at 25 and 26; the first and third are labelled magnesium-24 and magnesium-26 and the second carries a question mark.',
    spec: { type: 'spectrum', params: { variant: 'mass', peaks: [{ mz: 24, abundance: 79, label: '²⁴Mg' }, { mz: 25, abundance: 10, label: '?' }, { mz: 26, abundance: 11, label: '²⁶Mg' }], xRange: [22, 28], yMax: 100, yStep: 20 } },
  },
  {
    id: 'spectrum-lines-unknown-mixture',
    note: 'four line spectra over one wavelength axis: an unknown and three reference elements; one absorption strip',
    question: 'Which of the elements are present in the unknown sample?',
    alt: 'Four line spectra from 400 to 700 nanometres: an unknown sample with seven lines, hydrogen with four lines, helium with five lines, and sodium as an absorption spectrum with one line.',
    spec: {
      type: 'spectrum',
      params: { variant: 'lines', rows: [
        { label: 'Unknown', lines: [410, 434, 486, 656, 589, 447, 502] },
        { label: 'Hydrogen', lines: [410, 434, 486, 656] },
        { label: 'Helium', lines: [447, 471, 502, 588, 668] },
        { label: 'Sodium (absorption)', lines: [589], kind: 'absorption' },
      ] },
    },
  },
  {
    id: 'spectrum-absorbance-calibration',
    note: "a Beer's-law calibration line with five points and a dashed level line at the sample's absorbance (not dropped to the axis)",
    question: 'A sample of the same dye has the absorbance shown by the dashed line. What is its concentration?',
    alt: 'A straight calibration line through the origin on a grid of absorbance against concentration, with five points on it and a dashed horizontal line at an absorbance of 0.6.',
    spec: { type: 'spectrum', params: { variant: 'absorbance', slope: 1.5, xMax: 0.5, xStep: 0.1, yMax: 0.8, yStep: 0.1, points: [[0.1, 0.15], [0.2, 0.3], [0.3, 0.45], [0.4, 0.6], [0.5, 0.75]], sample: { absorbance: 0.6 }, xLabel: 'Concentration (mmol/L)' } },
  },
];

FIGURE_FIXTURES.push(...BATCH2_FIXTURES);
