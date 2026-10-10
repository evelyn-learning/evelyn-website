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
    note: 'dense: three charges of different sizes (+2, −1, +1), labels, two dashed equipotentials — warns: with three charges the lines bunch, so it is for direction and sign, not for counting lines',
    question: 'Which charge has the greatest magnitude, and how can you tell from the field lines?',
    alt: 'Field lines of three point charges: the most lines leave the charge q1, fewer arrive at q2 and leave q3; two dashed closed curves are equipotentials.',
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
    note: 'dense: a square pyramid on a square prism — hidden edges dashed, the heights of both parts and the slant height labelled — warns: height AND slant height drawn inside one small pyramid crowd',
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

// ---------------------------------------------------------------------------
// Polish round (2026-10-11): one fixture for each weakness an item author and
// an independent reader found in 153 real items, and for the variants nobody
// had opened as a picture. Each `note` says what it reproduces.
// ---------------------------------------------------------------------------
export const POLISH_FIXTURES: FigureFixture[] = [
  {
    id: 'polish-signchart-at-cells-on-guides',
    note: 'a: every value written AT a critical number (0, und, +, − and a "?" box) sits on a dashed guide — the guide must break round each',
    question: 'The sign chart is for f′ and f″. What belongs in the box?',
    alt: 'A sign chart with three critical numbers and two rows of plus and minus signs; under each critical number a zero, "und" or a sign is written, and one of those places holds a question mark.',
    spec: { type: 'sign_chart', params: { critical: [-2, { value: 0, label: '0' }, 3], rows: [{ label: 'f′(x)', signs: ['+', '-', '-', '+'], at: ['0', 'und', '0'] }, { label: 'f″(x)', signs: ['-', '-', '+', '+'], at: ['-', 'und', '+'], blankAt: [2] }] } },
  },
  {
    id: 'polish-vector-four-tip-to-tail',
    note: 'b: four vectors tip to tail with the resultant — four stroke patterns (the fourth is dotted), heads that meet at shared points, and no half-unit gridlines',
    question: 'Each square of the grid is 1 unit. What are the components of the resultant R?',
    alt: 'Four arrows joined tip to tail on a grid numbered in ones, each with its own stroke pattern, and a heavier arrow from the start of the first to the tip of the last.',
    spec: { type: 'vector_diagram', params: { xRange: [-1, 9], yRange: [-1, 7], tipToTail: true, resultant: true, vectors: [{ components: [3, 1], label: 'a' }, { components: [1, 4], label: 'b' }, { components: [3, -2], label: 'c' }, { components: [1, 3], label: 'd' }] } },
  },
  {
    id: 'polish-vector-angle-arc-blank',
    note: 'b / f: an angle arc from the +x direction on two vectors — one with its size, one with a "?" box; vectors that end on one point from different sides',
    question: 'Vector A has magnitude 5 and makes the angle shown with the positive x-axis. What is the angle marked "?" for vector B?',
    alt: 'Two arrows from the origin on a grid numbered in ones. An arc marks the angle each makes with the positive x-direction; one arc is labelled with its size and the other with a question mark.',
    spec: { type: 'vector_diagram', params: { xRange: [-5, 6], yRange: [-1, 6], vectors: [{ head: [4, 3], label: 'A', angle: { label: 'auto' } }, { head: [-3, 3], label: 'B', angle: { label: '?' } }] } },
  },
  {
    id: 'polish-vector-minor-grid-asked',
    note: 'b: `minorGrid: true` brings the half-step lines back (a vector that ends on a half unit)',
    question: 'The lighter gridlines are half a unit apart. What is the y-component of v?',
    alt: 'One arrow from the origin on a grid numbered in ones with lighter lines halfway between; thin dashes run across and then up to its head.',
    spec: { type: 'vector_diagram', params: { xRange: [-1, 5], yRange: [-1, 4], minorGrid: true, vectors: [{ head: [3, 2.5], label: 'v', showComponents: true }] } },
  },
  {
    id: 'polish-function-asymptotes-on-gridlines',
    note: 'c: three asymptotes, every one exactly on a numbered gridline, one of them labelled',
    question: 'The graph of f is shown with its asymptotes (the dashed lines). What is the equation of the horizontal asymptote?',
    alt: 'A graph in three branches on a grid numbered in ones, with two dashed vertical guide lines and one dashed horizontal guide line.',
    spec: { type: 'function_graph', params: { xRange: [-6, 6], yRange: [-6, 6], xStep: 1, yStep: 1, curves: [{ expr: '(2*x^2)/(x^2 - 4) - 1' }], asymptotes: [{ x: -2 }, { x: 2, label: 'x = 2' }, { y: 1 }] } },
  },
  {
    id: 'polish-normal-tail-beyond-2-sigma',
    note: 'd: a tail beyond 2σ and a thin strip far from the mean — small regions that must still read as shaded, each with a firm bound',
    question: 'The shaded tail starts two standard deviations above the mean. About what percent of the values lie in it?',
    alt: 'A normal curve over an axis marked from −3 to 3. The right tail beyond 2 is shaded, and so is a thin strip between −2.5 and −2.',
    spec: { type: 'distribution_curve', params: { axis: 'z', shade: [{ from: 2, to: null }, { from: -2.5, to: -2 }] } },
  },
  {
    id: 'polish-punnett-blank-side-gametes',
    note: 'e: both side gametes blank, next to a rotated side label — the "?" boxes must not run into it',
    question: 'The offspring genotypes are shown. What are the two gametes of the mother?',
    alt: 'A Punnett square with two rows and two columns. The gametes along the top are B and b; the two gametes down the side are replaced by question marks; the four cells hold BB, Bb, Bb and bb.',
    spec: { type: 'punnett_square', params: { top: ['B', 'b'], side: ['B', 'b'], blankSide: [0, 1], topLabel: 'Father  Bb', sideLabel: 'Mother' } },
  },
  {
    id: 'polish-shaded-between-two-parabolas',
    note: 'f: the region between two curves with NO labels — the lower curve is a double line, never a dashed one; two lettered points on top',
    question: 'The region between the two curves is shaded. At which marked point do the curves meet, P or Q?',
    alt: 'Two parabolas on a grid numbered in ones, one opening down drawn as a single line and one opening up drawn as a double line, with the region between them hatched and two points marked P and Q.',
    spec: { type: 'shaded_region', params: { xRange: [-4, 4], yRange: [-2, 8], region: { type: 'between_curves', upper: { expr: '6 - x^2/2' }, lower: { expr: 'x^2/2 + 2' }, from: -2, to: 2 }, points: [{ x: 2, y: 4, label: 'P' }, { x: 0, y: 6, label: 'Q' }] } },
  },
  {
    id: 'polish-shaded-inequalities-test-points',
    note: 'f: a strict (dashed) and a non-strict (solid) boundary with three marked test points — one open, one a "?" label',
    question: 'Which of the marked points are solutions of the system?',
    alt: 'A coordinate grid with one dashed and one solid boundary line and the hatched region between them; three points are marked, two with letters and one with a question mark.',
    spec: { type: 'shaded_region', params: { xRange: [-4, 6], yRange: [-3, 6], region: { type: 'inequalities', inequalities: [{ a: 1, b: 1, op: '<', c: 4 }, { a: -1, b: 2, op: '<=', c: 4 }] }, points: [{ x: 1, y: 1, label: 'A' }, { x: 2, y: 2, label: 'B', open: true }, { x: -2, y: 1, label: '?' }] } },
  },
  {
    id: 'polish-titration-lettered-points',
    note: 'f: four lettered points on a weak-acid curve (buffer region, half-equivalence, equivalence, excess base) — letters only, no numbers',
    question: 'At which lettered point is the solution the best buffer?',
    alt: 'A titration curve of pH against volume of titrant that rises slowly, then steeply, then levels off; four points on it are lettered A, B, C and D from left to right.',
    spec: { type: 'titration_curve', params: { analyte: { type: 'weak_acid', concentration: 0.1, volume: 25, pKa: 4.76 }, titrantConcentration: 0.1, maxVolume: 50, points: [{ volume: 5, label: 'A' }, { volume: 12.5, label: 'B' }, { volume: 25, label: 'C' }, { volume: 40, label: 'D' }] } },
  },
  {
    id: 'polish-ray-convex-mirror-all-labels',
    note: 'j: a convex mirror with every label on (both heights, all three distances, F and C) — labels off the rays, brackets on separate rows',
    question: 'Use the distances shown to find the magnification of the image.',
    alt: 'A ray diagram of a convex mirror: an upright object arrow in front of the mirror, three rays reflecting from it, and a smaller upright dashed image arrow behind it; the object and image heights and the object, image and focal distances are labelled.',
    spec: { type: 'ray_diagram', params: { element: 'convex_mirror', focalLength: 10, objectDistance: 15, objectHeight: 4, show: { objectDistance: 'value', imageDistance: 'value', focalLength: 'value', objectHeight: 'value', imageHeight: 'value' } } },
  },
  {
    id: 'polish-solid-prism-pyramid-heights-only',
    note: 'i: a pyramid on a prism with both heights and the base labelled and no slant — the far-side edges are left out',
    question: 'The solid is a square pyramid on top of a square prism. What is its total volume?',
    alt: 'A square pyramid standing on a square prism. The side of the square base, the height of the prism and the height of the pyramid are each labelled with a length in centimetres.',
    spec: { type: 'solid_3d', params: { solid: 'composite', bottom: 'prism', top: 'pyramid', base: 8, height: 5, topHeight: 6, unit: 'cm' } },
  },
  // --- variants that had never been opened as a picture -----------------------
  {
    id: 'polish-solid-sphere',
    note: 'never viewed: a sphere with its radius',
    question: 'What is the volume of the sphere, in terms of π?',
    alt: 'A sphere with a dashed equator; a radius is drawn from the centre and labelled 6 cm.',
    spec: { type: 'solid_3d', params: { solid: 'sphere', radius: 6, unit: 'cm' } },
  },
  {
    id: 'polish-solid-hemisphere-blank',
    note: 'never viewed: a hemisphere, its radius a "?" box — warns: no dimension carries a number (the stem gives the volume)',
    question: 'The hemisphere has a volume of 144π cm³. What is its radius?',
    alt: 'A hemisphere resting on its flat circular face; a radius is drawn on that face and labelled with a question mark.',
    spec: { type: 'solid_3d', params: { solid: 'hemisphere', radius: 6, unit: 'cm', labels: { radius: '?' } } },
  },
  {
    id: 'polish-solid-prism-plain',
    note: 'never viewed: a plain rectangular prism with three labelled edges',
    question: 'What is the surface area of the rectangular prism?',
    alt: 'A rectangular prism with its length, width and height labelled 10 cm, 4 cm and 6 cm.',
    spec: { type: 'solid_3d', params: { solid: 'prism', length: 10, width: 4, height: 6, unit: 'cm' } },
  },
  {
    id: 'polish-solid-pyramid-slant',
    note: 'never viewed: a plain square pyramid with its height, its slant height (asked for) and its base',
    question: 'What is the lateral surface area of the pyramid?',
    alt: 'A square pyramid. The side of its base, its height and its slant height are labelled.',
    spec: { type: 'solid_3d', params: { solid: 'pyramid', base: 10, height: 12, unit: 'cm', labels: { slant: 'auto' } } },
  },
  {
    id: 'polish-solid-cone-on-cylinder',
    note: 'never viewed: a cone on a cylinder, three labelled dimensions',
    question: 'The solid is a cone on top of a cylinder. What is its volume, in terms of π?',
    alt: 'A cone standing on a cylinder of the same radius. The radius, the height of the cylinder and the height of the cone are labelled.',
    spec: { type: 'solid_3d', params: { solid: 'composite', bottom: 'cylinder', top: 'cone', radius: 3, height: 5, topHeight: 4, unit: 'cm' } },
  },
  {
    id: 'polish-field-wire-side-view',
    note: 'never viewed: a wire in the page carrying current upward — the field symbols on its two sides are hidden only by the key the reader must apply',
    question: 'A long straight wire carries a current up the page. On which side of the wire does the magnetic field point into the page?',
    alt: 'A vertical wire with an arrow showing the current flowing up the page. Circles with a dot fill the region on one side of the wire and circles with a cross the region on the other side; a key says a dot is field out of the page and a cross is field into the page.',
    spec: { type: 'field_diagram', params: { variant: 'wire', view: 'side', current: 'up' } },
  },
  {
    id: 'polish-field-wire-side-view-horizontal-no-field',
    note: 'never viewed: a horizontal wire, current to the left, the field symbols left out (they are the question)',
    question: 'A long straight wire carries a current to the left. What is the direction of the magnetic field at a point above the wire?',
    alt: 'A horizontal wire with an arrow showing the current flowing to the left. Nothing else is drawn.',
    spec: { type: 'field_diagram', params: { variant: 'wire', view: 'side', current: 'left', showField: false } },
  },
  {
    id: 'polish-field-magnetic-in-plane',
    note: 'never viewed: a magnetic field IN the plane of the page (pointing up) with a positive charge moving right; the force (out of the page) is shown',
    question: 'What does the symbol labelled F tell you about the magnetic force on the charge?',
    alt: 'A region of uniform magnetic field shown by parallel arrows pointing up the page, labelled B. A positive charge moves to the right with velocity v; beside it a circle with a dot is labelled F, and a key says a dot means out of the page.',
    spec: { type: 'field_diagram', params: { variant: 'magnetic_force', field: 'up', charge: { sign: '+', velocity: 'right', label: 'q', showForce: true } } },
  },
  {
    id: 'polish-field-magnetic-in-plane-force-in-plane',
    note: 'never viewed: a field out of the page, a negative charge moving up, the force arrow (in the plane) drawn',
    question: 'The force on the charge is shown. Is the charge positive or negative?',
    alt: 'A region of magnetic field out of the page, drawn as dots in circles. A charge with no sign shown moves up the page with velocity v, and a dashed arrow labelled F points to the left.',
    spec: { type: 'field_diagram', params: { variant: 'magnetic_force', field: 'out', charge: { sign: '−', velocity: 'up', showSign: false, showForce: true } } },
  },
];

FIGURE_FIXTURES.push(...POLISH_FIXTURES);

// ---------------------------------------------------------------------------
// Batch 3 (2026-10-12): molecular_structure, gel_electrophoresis (with its
// amplification_plot variant), bio_schematic, schematic_map, the bar-magnet
// variant of field_diagram — three or more per kind or variant (a simple one,
// a dense one, one with a "?" blank) — and one fixture per fix a–f of the
// third round (ids `fix3-…`).
// ---------------------------------------------------------------------------
const O2 = { el: 'O', lonePairs: 2 };
const O3 = { el: 'O', lonePairs: 3 };
/** One resonance form of the carbonate ion: the C=O is on oxygen `dbl`. */
const carbonate = (label: string, dbl: number) => ({
  label,
  layout: { type: 'trigonal_planar', center: 'C', around: ['O1', 'O2', 'O3'] },
  atoms: [{ id: 'C', el: 'C', lonePairs: 0 }, ...[1, 2, 3].map((k) => ({ id: `O${k}`, ...(k === dbl ? O2 : O3) }))],
  bonds: [1, 2, 3].map((k) => ({ a: 'C', b: `O${k}`, order: k === dbl ? 2 : 1 })),
});
const water = (origin: [number, number], flip: boolean) => ({
  origin,
  atoms: [
    { id: 'O', el: 'O', x: 0, y: 0, lonePairs: 2, partial: '-' },
    { id: 'H1', el: 'H', from: 'O', angle: flip ? 232 : 52, partial: '+' },
    { id: 'H2', el: 'H', from: 'O', angle: flip ? 128 : 308, partial: flip ? undefined : '+' },
  ],
  bonds: [{ a: 'O', b: 'H1' }, { a: 'O', b: 'H2' }],
});

export const BATCH3_FIXTURES: FigureFixture[] = [
  // --- molecular_structure ---------------------------------------------------
  {
    id: 'mol-lewis-water',
    note: 'simple: a bent molecule from the named layout, two lone pairs on the central atom',
    question: 'The Lewis structure of a molecule is shown. How many lone pairs of electrons are on the central atom?',
    alt: 'A Lewis structure: a central oxygen atom bonded to two hydrogen atoms in a bent shape, with pairs of dots on the oxygen.',
    spec: { type: 'molecular_structure', params: { molecules: [{ layout: { type: 'bent', center: 'O', around: ['H1', 'H2'] }, atoms: [{ id: 'O', el: 'O', lonePairs: 2 }, { id: 'H1', el: 'H' }, { id: 'H2', el: 'H' }], bonds: [{ a: 'O', b: 'H1' }, { a: 'O', b: 'H2' }] }] } },
  },
  {
    id: 'mol-dense-resonance-carbonate',
    note: 'dense: three resonance structures side by side with double-headed arrows, eight lone pairs and two formal charges on each',
    question: 'Three resonance structures of the carbonate ion are shown. What is the average carbon–oxygen bond order?',
    alt: 'Three Lewis structures joined by double-headed arrows. Each has a central carbon bonded to three oxygen atoms, one by a double bond, with lone pairs and minus signs on the singly bonded oxygens.',
    spec: { type: 'molecular_structure', params: { between: 'resonance', molecules: [carbonate('I', 1), carbonate('II', 2), carbonate('III', 3)] } },
  },
  {
    id: 'mol-blank-formal-charge-candidates',
    note: 'two candidate Lewis structures of the cyanate ion; one formal charge is a "?" box and one bond order is asked for',
    question: 'Two possible Lewis structures of the cyanate ion, OCN⁻, are shown. What formal charge belongs in the box on structure I?',
    alt: 'Two Lewis structures labelled I and II, each a row of oxygen, carbon and nitrogen atoms with lone pairs. In one a formal charge is replaced by a boxed question mark.',
    spec: {
      type: 'molecular_structure',
      params: {
        molecules: [
          { label: 'I', layout: { type: 'linear', center: 'C', around: ['O', 'N'] }, atoms: [{ id: 'O', el: 'O', lonePairs: 3, show: { charge: 'blank' } }, { id: 'C', el: 'C', lonePairs: 0 }, { id: 'N', el: 'N', lonePairs: 1 }], bonds: [{ a: 'O', b: 'C', order: 1 }, { a: 'C', b: 'N', order: 3 }] },
          { label: 'II', layout: { type: 'linear', center: 'C', around: ['O', 'N'] }, atoms: [{ id: 'O', el: 'O', lonePairs: 2 }, { id: 'C', el: 'C', lonePairs: 0 }, { id: 'N', el: 'N', lonePairs: 2 }], bonds: [{ a: 'O', b: 'C', order: 2 }, { a: 'C', b: 'N', order: 2 }] },
        ],
      },
    },
  },
  {
    id: 'mol-tetrahedral-wedge-dash',
    note: 'a tetrahedral centre with a wedge and a dashed bond; three lone pairs on each halogen (dense round the lower right)',
    question: 'The structure of a molecule is shown; the wedge points toward the viewer and the dashed bond away. What is the molecular geometry round the carbon atom?',
    alt: 'A carbon atom bonded to hydrogen, fluorine, chlorine and bromine: two bonds are plain lines, one is a solid wedge and one a dashed wedge. The halogens carry lone pairs.',
    spec: { type: 'molecular_structure', params: { molecules: [{ center: 'C', layout: { type: 'tetrahedral', center: 'C', around: ['H', 'F', 'Cl', 'Br'] }, atoms: [{ id: 'C', el: 'C', lonePairs: 0 }, { id: 'H', el: 'H' }, { id: 'F', el: 'F', lonePairs: 3 }, { id: 'Cl', el: 'Cl', lonePairs: 3 }, { id: 'Br', el: 'Br', lonePairs: 3 }], bonds: [{ a: 'C', b: 'H' }, { a: 'C', b: 'F' }, { a: 'C', b: 'Cl' }, { a: 'C', b: 'Br' }] }] } },
  },
  {
    id: 'mol-skeletal-functional-groups',
    note: 'a skeletal structure (carbons are the unlabelled corners) with heteroatom labels and two functional groups outlined and lettered',
    question: 'The skeletal structure of a molecule is shown with two groups outlined. Which functional group is outlined and marked Y?',
    alt: 'A zig-zag skeletal structure of three carbons. One end carries a double-bonded O and an OH inside a dashed outline marked Y; the middle carbon carries an NH₂ inside a dashed outline marked X.',
    spec: {
      type: 'molecular_structure',
      params: {
        molecules: [{
          skeletal: true,
          layout: { type: 'chain', atoms: ['C3', 'C2', 'C1'] },
          atoms: [
            { id: 'C3', el: 'C' }, { id: 'C2', el: 'C' }, { id: 'C1', el: 'C' },
            { id: 'N', el: 'N', h: 2, from: 'C2', angle: 90 },
            { id: 'O1', el: 'O', from: 'C1', angle: 270 },
            { id: 'O2', el: 'O', h: 1, from: 'C1', angle: 30 },
          ],
          bonds: [{ a: 'C3', b: 'C2' }, { a: 'C2', b: 'C1' }, { a: 'C2', b: 'N' }, { a: 'C1', b: 'O1', order: 2 }, { a: 'C1', b: 'O2' }],
          highlight: [{ atoms: ['N'], label: 'X' }, { atoms: ['C1', 'O1', 'O2'], label: 'Y' }],
        }],
      },
    },
  },
  {
    id: 'mol-hbond-water-pair',
    note: 'two molecules in one frame: partial charges, a bond dipole arrow and a dotted hydrogen bond between them',
    question: 'Two water molecules are shown. Between which two atoms is the dotted line drawn, and what kind of attraction does it represent?',
    alt: 'Two bent water molecules with δ+ on hydrogen atoms and δ− on the oxygen atoms. A dotted line joins a hydrogen of one molecule to the oxygen of the other, and a crossed arrow lies along one O–H bond.',
    spec: { type: 'molecular_structure', params: { arrangement: 'shared', molecules: [{ ...water([0, 0], false), bonds: [{ a: 'O', b: 'H1', dipole: 'to_a' }, { a: 'O', b: 'H2' }] }, water([2.75, -0.95], true)], hbonds: [{ from: { mol: 0, atom: 'H2' }, to: { mol: 1, atom: 'O' } }] } },
  },
  // --- gel_electrophoresis ---------------------------------------------------
  {
    id: 'gel-simple-pcr-presence',
    note: 'simple: a ladder and three PCR lanes — a band is there or it is not',
    question: 'A PCR test for a 500 bp target gives the gel shown. Which lanes contain the target DNA?',
    alt: 'A gel with a size ladder and three sample lanes numbered one to three. Some lanes hold a single band and one holds none.',
    spec: { type: 'gel_electrophoresis', params: { ladder: { sizes: [1000, 750, 500, 250, 100] }, lanes: [{ label: '1', bands: [500] }, { label: '2', bands: [] }, { label: '3', bands: [500] }] } },
  },
  {
    id: 'gel-dense-paternity-six-lanes',
    note: 'dense: an eight-band ladder and six lanes of two to four bands, some thick',
    question: 'The gel shows DNA profiles of a mother, her child and four possible fathers (F1–F4). Which man could be the father?',
    alt: 'A gel with a size ladder and six lanes labelled Mother, Child, F1, F2, F3 and F4, each holding several bands at different heights.',
    spec: {
      type: 'gel_electrophoresis',
      params: {
        ladder: { sizes: [3000, 2000, 1500, 1000, 700, 500, 300, 200], unit: 'bp' },
        lanes: [
          { label: 'Mother', bands: [2000, 1000, 500] }, { label: 'Child', bands: [2000, { size: 700, thick: 2 }, 500, 300] },
          { label: 'F1', bands: [1500, 1000, 200] }, { label: 'F2', bands: [3000, 700, 300] },
          { label: 'F3', bands: [1500, 700, 500] }, { label: 'F4', bands: [2000, 300, 200] },
        ],
      },
    },
  },
  {
    id: 'gel-blank-ladder-label',
    note: 'a digest of a plasmid: one ladder label and one lane label are "?" boxes; the band level with the hidden ladder band is the one asked about',
    question: 'A plasmid is cut with one enzyme and run beside a ladder. The lower band of lane 2 is level with the ladder band marked "?". The ladder is evenly spaced on this gel between 2 kb and 0.5 kb in three steps. What size is that band?',
    alt: 'A gel with a ladder whose sizes are printed in kilobases except one, which is a boxed question mark, and two sample lanes, one of them labelled with a boxed question mark.',
    spec: { type: 'gel_electrophoresis', params: { ladder: { sizes: [4, 2, 1, 0.5], unit: 'kb', blank: [1] }, lanes: [{ label: 'uncut', bands: [{ size: 3, thick: 3 }] }, { label: '?', bands: [2, 1] }] } },
  },
  {
    id: 'amp-two-samples',
    note: 'simple: two qPCR curves crossing the threshold on whole cycles',
    question: 'The amplification plot shows two samples. At which cycle does sample S1 cross the threshold?',
    alt: 'An amplification plot of fluorescence against cycle number with two S-shaped curves and a dashed horizontal threshold line.',
    spec: { type: 'gel_electrophoresis', params: { variant: 'amplification_plot', samples: [{ label: 'S1', ct: 18 }, { label: 'S2', ct: 23 }] } },
  },
  {
    id: 'amp-dense-four-samples',
    note: 'dense: four curves, one of them a no-template control that never rises',
    question: 'Four reactions were run. How many times more target DNA did sample P start with than sample R?',
    alt: 'An amplification plot with four curves, three S-shaped and one flat along the baseline, and a dashed threshold line.',
    spec: { type: 'gel_electrophoresis', params: { variant: 'amplification_plot', cycles: 40, samples: [{ label: 'P', ct: 15 }, { label: 'Q', ct: 20 }, { label: 'R', ct: 25 }, { label: 'NTC', ct: null }] } },
  },
  {
    id: 'amp-blank-sample-name',
    note: 'the name of one sample is a "?" box in the legend (which patient sample is it?)',
    question: 'A standard with a known amount of virus crosses the threshold at cycle 20. The curve marked "?" is from a patient. Does the patient sample hold more or less virus than the standard?',
    alt: 'An amplification plot with two S-shaped curves and a dashed threshold line. One curve is named in the legend; the other is marked with a boxed question mark.',
    spec: { type: 'gel_electrophoresis', params: { variant: 'amplification_plot', cycles: 35, samples: [{ label: 'Standard', ct: 20 }, { label: '?', ct: 26 }] } },
  },
  // --- bio_schematic ---------------------------------------------------------
  {
    id: 'bio-cell-animal-lettered',
    note: 'simple: an animal cell with five lettered organelles',
    question: 'The diagram is a schematic of an animal cell. Which letter marks the organelle where most ATP is made?',
    alt: 'A schematic animal cell: a rounded outline holding a large circle with a dark spot, an oval with a zig-zag inside, a stack of curved lines, folded bands with dots, and small circles, each joined by a line to a letter.',
    spec: { type: 'bio_schematic', params: { variant: 'cell', cellType: 'animal', organelles: [{ type: 'nucleus', label: 'P' }, { type: 'mitochondrion', label: 'Q' }, { type: 'golgi', label: 'R' }, { type: 'rough_er', label: 'S' }, { type: 'lysosome', label: 'T' }] } },
  },
  {
    id: 'bio-cell-plant-dense',
    note: 'dense: a plant cell with nine lettered parts, wall and membrane included',
    question: 'The diagram is a schematic of a plant cell. Which two lettered structures would NOT be found in an animal cell?',
    alt: 'A schematic plant cell: a double rectangular outline holding a nucleus, a large empty vacuole, ovals with stacked bars, an oval with a zig-zag, a stack of curved lines, folded bands and dots, each joined by a line to a number.',
    spec: { type: 'bio_schematic', params: { variant: 'cell', cellType: 'plant', organelles: [{ type: 'cell_wall', label: '1' }, { type: 'cell_membrane', label: '2' }, { type: 'nucleus', label: '3' }, { type: 'central_vacuole', label: '4' }, { type: 'chloroplast', label: '5' }, { type: 'mitochondrion', label: '6' }, { type: 'golgi', label: '7' }, { type: 'rough_er', label: '8' }, { type: 'ribosomes', label: '9' }] } },
  },
  {
    id: 'bio-cell-blank-label',
    note: 'named labels with one "?" box (name the organelle)',
    question: 'In the schematic cell, what is the organelle marked with the question mark?',
    alt: 'A schematic animal cell with its nucleus and mitochondrion named; a third structure, a stack of curved lines, is marked with a boxed question mark.',
    spec: { type: 'bio_schematic', params: { variant: 'cell', cellType: 'animal', organelles: [{ type: 'nucleus', label: 'nucleus' }, { type: 'mitochondrion', label: 'mitochondrion' }, { type: 'golgi', label: '?' }, { type: 'smooth_er' }] } },
  },
  {
    id: 'bio-membrane-channel-gradient',
    note: 'simple: a bilayer with one channel and a solute at 12 dots outside, 3 inside',
    question: 'The diagram shows a cell membrane with a channel protein. The dots are molecules of a solute. In which direction is the net movement of the solute?',
    alt: 'A membrane cross-section: two rows of phospholipids with a channel through them. Many dots lie on the side labelled outside the cell and few on the side labelled inside the cell.',
    spec: { type: 'bio_schematic', params: { variant: 'membrane', proteins: [{ type: 'channel' }], solutes: [{ outside: 12, inside: 3, through: 0 }] } },
  },
  {
    id: 'bio-membrane-dense-pump-carrier-labels',
    note: 'dense: channel, carrier, pump with its ATP marker, a peripheral protein, a carbohydrate chain, cholesterol; two solutes with arrows; five lettered parts',
    question: 'In the membrane shown, solute 2 (squares) crosses through the protein marked with ATP. Is its transport active or passive?',
    alt: 'A membrane cross-section with three proteins through the bilayer, one of them marked ATP, a small protein on the inner surface and a branched chain on the outer surface. Dots and squares lie on both sides in different numbers, arrows run through two proteins, and five parts are lettered.',
    spec: {
      type: 'bio_schematic',
      params: {
        variant: 'membrane',
        proteins: [{ type: 'channel' }, { type: 'carrier', carbohydrate: true }, { type: 'pump' }, { type: 'peripheral' }],
        cholesterol: true,
        solutes: [{ name: 'solute 1', outside: 10, inside: 2, through: 0, arrow: 'in' }, { name: 'solute 2', outside: 9, inside: 3, through: 2, arrow: 'out', shape: 'square' }],
        labels: [{ target: 'head', label: 'P' }, { target: 'tails', label: 'Q' }, { target: 'carbohydrate', label: 'R' }, { target: 'peripheral', label: 'S' }, { target: 'cholesterol', label: 'T' }],
      },
    },
  },
  {
    id: 'bio-membrane-blank-part-label',
    note: 'named parts with one "?" box on the carbohydrate chain; no solutes',
    question: 'The diagram shows the fluid mosaic model of a membrane. What kind of molecule is the part marked with the question mark?',
    alt: 'A membrane cross-section with a phospholipid and a protein named; a branched chain on the outer surface is marked with a boxed question mark.',
    spec: { type: 'bio_schematic', params: { variant: 'membrane', proteins: [{ type: 'carrier', carbohydrate: true }, { type: 'peripheral' }], labels: [{ target: 'head', label: 'phospholipid' }, { target: 'carrier', label: 'protein' }, { target: 'carbohydrate', label: '?' }] } },
  },
  {
    id: 'bio-division-mitosis-strip',
    note: 'simple: three cells of a 2n = 4 mitosis in a row, lettered',
    question: 'Three stages of mitosis in a cell with 2n = 4 are shown, not in order. Which cell is in metaphase?',
    alt: 'Three schematic cells lettered X, Y and Z holding stick chromosomes: in one they are scattered, in one lined up across the middle, in one pulled apart toward the two ends.',
    spec: { type: 'bio_schematic', params: { variant: 'division', n: 2, cells: [{ stage: 'anaphase', label: 'X' }, { stage: 'prophase', label: 'Y' }, { stage: 'metaphase', label: 'Z' }] } },
  },
  {
    id: 'bio-division-meiosis-dense',
    note: 'dense: four cells of a 2n = 6 meiosis in a two-by-two grid — pairs side by side, pairs separating, single file, chromatids separating',
    question: 'Four stages of meiosis in a cell with 2n = 6 are shown. In which cell are homologous chromosomes being separated?',
    alt: 'Four schematic cells numbered one to four holding stick chromosomes, some filled and some outlined: paired side by side across the middle, pairs pulled apart, a single file across the middle, and single sticks pulled apart.',
    spec: { type: 'bio_schematic', params: { variant: 'division', n: 3, cells: [{ stage: 'metaphase_I', label: '1' }, { stage: 'anaphase_I', label: '2' }, { stage: 'metaphase_II', label: '3' }, { stage: 'anaphase_II', label: '4' }] } },
  },
  {
    id: 'bio-division-blank-stage-name',
    note: 'named stages with one "?" box',
    question: 'Two stages of mitosis are shown. Name the stage marked with the question mark.',
    alt: 'Two schematic cells holding stick chromosomes. One is named; the other, in which the cell is pinched in the middle with a group of chromosomes at each end, is marked with a boxed question mark.',
    spec: { type: 'bio_schematic', params: { variant: 'division', n: 2, cells: [{ stage: 'metaphase', label: 'metaphase' }, { stage: 'telophase', label: '?' }] } },
  },
  {
    id: 'bio-compartments-mitochondrion',
    note: 'simple: a mitochondrion as nested boxes, H⁺ shown by dot density, ATP synthase in the inner membrane',
    question: 'The box diagram shows a mitochondrion during cellular respiration; each dot is one H⁺ ion. Which labelled space has the higher H⁺ concentration?',
    alt: 'A box diagram of a mitochondrion: an outer box, a band between it and an inner box, and the inner box. The spaces are named, and dots are scattered in them in different numbers. A key says each dot is a hydrogen ion.',
    spec: { type: 'bio_schematic', params: { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', ions: 18 }, { id: 'matrix', ions: 4 }], synthase: true } },
  },
  {
    id: 'bio-compartments-chloroplast-dense',
    note: 'dense: a chloroplast with lettered spaces, pH printed instead of dots, the synthase and its flow arrow',
    question: 'The box diagram shows a chloroplast in the light. Through the enzyme shown, H⁺ ions flow from space Y to space X. Which space is the thylakoid lumen?',
    alt: 'A box diagram of a chloroplast: an outer box holding a lettered space and a flattened inner box with another lettered space. Each space has a pH printed in it, and an arrow runs through a knob-shaped enzyme in the inner box\'s wall.',
    spec: { type: 'bio_schematic', params: { variant: 'compartments', organelle: 'chloroplast', spaces: [{ id: 'stroma', label: 'X', pH: 8 }, { id: 'thylakoid_lumen', label: 'Y', pH: 5 }], synthase: true, showFlow: true } },
  },
  {
    id: 'bio-compartments-blank-space',
    note: 'one space is named, the other is a "?" box',
    question: 'The box diagram shows a mitochondrion; each dot is one H⁺ ion. Name the space marked with the question mark.',
    alt: 'A box diagram of a mitochondrion with dots scattered thickly in the band between its two boxes and thinly in the inner box. The inner box is named; the band is marked with a boxed question mark.',
    spec: { type: 'bio_schematic', params: { variant: 'compartments', organelle: 'mitochondrion', spaces: [{ id: 'intermembrane_space', label: '?', ions: 16 }, { id: 'matrix', ions: 3 }] } },
  },
  // --- schematic_map ---------------------------------------------------------
  {
    id: 'map-islands-simple',
    note: 'simple: a mainland and two islands on a grid, three markers, a scale bar and a north arrow',
    question: 'On the schematic map each grid square is 50 km across. How far is site Q from site P?',
    alt: 'A schematic map on a grid: a mainland along the left edge and two islands to its right, with three marked sites, a scale bar and a north arrow.',
    spec: {
      type: 'schematic_map',
      params: {
        grid: { cols: 12, rows: 8 }, scale: { squares: 2, length: 100, unit: 'km' },
        regions: [
          { label: 'Mainland', points: [[0, 0], [3, 0], [4, 3], [3, 6], [3, 8], [0, 8]] },
          { label: 'Isla Norte', points: [[7, 5], [10, 5], [10, 7], [8, 7]] },
          { label: 'Isla Sur', points: [[6, 1], [8, 1], [9, 3], [7, 3]] },
        ],
        markers: [{ x: 2, y: 4, label: 'P' }, { x: 8, y: 4, label: 'Q' }, { x: 8, y: 2, label: 'R' }],
      },
    },
  },
  {
    id: 'map-dense-choropleth-arrows',
    note: 'dense: five regions hatched by value with a legend, four markers, two dispersal arrows',
    question: 'The map shows the number of finch species on each island and two colonisation routes. Which island has the most species?',
    alt: 'A schematic map of a mainland and four islands, each filled with a hatch pattern of a different density explained in a legend, with marked sites, two arrows between land masses, a scale bar and a north arrow.',
    spec: {
      type: 'schematic_map',
      params: {
        grid: { cols: 14, rows: 9 }, scale: { squares: 2, length: 200, unit: 'km' },
        legend: { title: 'Finch species' },
        regions: [
          { label: 'Mainland', points: [[0, 0], [3, 0], [3, 9], [0, 9]], value: 12 },
          { label: 'P', points: [[5, 6], [7, 6], [7, 8], [5, 8]], value: 6 },
          { label: 'Q', points: [[5, 1], [7, 1], [8, 3], [6, 4], [5, 3]], value: 6 },
          { label: 'R', points: [[9, 4], [11, 4], [11, 6], [9, 6]], value: 3 },
          { label: 'S', points: [[12, 1], [14, 1], [14, 3], [12, 3]], value: 1 },
        ],
        markers: [{ x: 2, y: 5, label: 'W' }, { x: 6, y: 7, label: 'X' }, { x: 10, y: 5, label: 'Y' }, { x: 13, y: 2, label: 'Z' }],
        arrows: [{ from: [3, 7], to: [5, 7] }, { from: [7, 7], to: [9, 5.5], dashed: true }],
      },
    },
  },
  {
    id: 'map-blank-region-label',
    note: 'one region label is a "?" box; an ocean current arrow with its name',
    question: 'A warm current flows as shown. The island marked "?" lies due east of site K. Which site is on it?',
    alt: 'A schematic map with a mainland and two islands, one of them marked with a boxed question mark, three marked sites, a labelled arrow, a scale bar and a north arrow.',
    spec: {
      type: 'schematic_map',
      params: {
        grid: { cols: 12, rows: 8 }, scale: { squares: 3, length: 300, unit: 'km' },
        regions: [
          { label: 'Mainland', points: [[0, 0], [2, 0], [3, 4], [2, 8], [0, 8]] },
          { label: '?', points: [[7, 3], [10, 3], [10, 5], [7, 5]] },
          { label: 'Tern I.', points: [[5, 6], [7, 6], [7, 7.5], [5, 7.5]] },
        ],
        markers: [{ x: 1, y: 4, label: 'K' }, { x: 9, y: 4, label: 'L' }, { x: 6, y: 7, label: 'M' }],
        arrows: [{ from: [4, 1], to: [10, 1.5], label: 'current' }],
      },
    },
  },
  // --- field_diagram: bar magnet ---------------------------------------------
  {
    id: 'magnet-single-field-lines',
    note: 'simple: one bar magnet, poles named, field lines with arrowheads, one marked point',
    question: 'The diagram shows the magnetic field of a bar magnet. What is the direction of the field at point P?',
    alt: 'A bar magnet with its two halves marked N and S and curved field lines with arrowheads looping from one end to the other. A point P is marked above the middle of the magnet.',
    spec: { type: 'field_diagram', params: { variant: 'bar_magnet', magnets: [{ north: 'right' }], points: [{ x: 0, y: 1.75, label: 'P' }] } },
  },
  {
    id: 'magnet-dense-two-magnets-compasses',
    note: 'dense: two magnets end to end with like poles facing, and three compasses (one needle hidden)',
    question: 'Two bar magnets are placed end to end as shown. Which way does the needle of compass 3 point?',
    alt: 'Two bar magnets end to end, each half marked N or S, with field lines that bend away from each other in the gap. Three small compasses are numbered; two show a needle and one is empty.',
    spec: { type: 'field_diagram', params: { variant: 'bar_magnet', magnets: [{ north: 'right' }, { north: 'left' }], compasses: [{ x: 0, y: 1.5, label: '1' }, { x: -4.05, y: 0, label: '2' }, { x: 0, y: -1.5, label: '3', needle: false }] } },
  },
  {
    id: 'magnet-blank-poles',
    note: 'the poles are "?" boxes: the arrowheads on the lines fix which end is north',
    question: 'The field lines of a bar magnet are shown. Which end of the magnet is its north pole?',
    alt: 'A bar magnet whose two halves are each marked with a boxed question mark, with curved field lines carrying arrowheads from its left end round to its right end.',
    spec: { type: 'field_diagram', params: { variant: 'bar_magnet', magnets: [{ north: 'left', poles: 'blank' }] } },
  },
  // --- the fixes of the third round ------------------------------------------
  {
    id: 'fix3-ray-diverging-abs-f',
    note: 'a: a diverging lens with its focal length shown — printed as a magnitude, "|f| = 12 cm", so it cannot contradict a stem that says f is negative',
    question: 'A diverging lens has a focal length of −12 cm. An object stands 24 cm from it. Where is the image?',
    alt: 'A ray diagram of a diverging lens with an object arrow on the left; brackets under the axis give the object distance and the size of the focal length.',
    spec: { type: 'ray_diagram', params: { element: 'diverging_lens', focalLength: 12, objectDistance: 24, objectHeight: 6, rays: 'none', showImage: false, show: { objectDistance: 'value', focalLength: 'value' } } },
  },
  {
    id: 'fix3-field-unequal-charges-labels',
    note: 'b: +3q and −q with three marked points — the smaller charge has lines on every side, and no line runs into a point label',
    question: 'In the field diagram shown, the charge on the left has three times the magnitude of the charge on the right. At which marked point is the net electric field zero?',
    alt: 'Field lines round two point charges of unequal size, with three marked points on the line through them.',
    spec: { type: 'field_diagram', params: { variant: 'point_charges', charges: [{ x: -3, y: 0, q: 3 }, { x: 0, y: 0, q: -1 }], xRange: [-6, 6], yRange: [-3.6, 3.6], linesPerUnit: 4, arrows: false, points: [{ x: -4.8, y: 0, label: 'P' }, { x: -1.5, y: 0, label: 'Q' }, { x: 4.098076211353317, y: 0, label: 'R' }] } },
  },
  {
    id: 'fix3-phylo-numerals',
    note: 'c: node labels given as letters are printed as numerals, so they cannot be taken for the option letters A–D',
    question: 'Which numbered node is the most recent common ancestor of the frog and the mouse?',
    alt: 'A branching tree of five animals with three numbered nodes.',
    spec: { type: 'phylogenetic_tree', params: { letterLabels: 'numerals', tree: { node: 'A', children: ['Lamprey', { node: 'B', children: ['Trout', { node: 'C', children: ['Frog', { children: ['Lizard', 'Mouse'] }] }] }] } } },
  },
  {
    id: 'fix3-geometry-theta-inside',
    note: 'd: θ at the narrow top vertex of a 6–8–10 triangle is set inside the triangle, between its sides',
    question: 'In the right triangle shown, what is θ to the nearest tenth of a degree?',
    alt: 'A right triangle with its sides labelled and the angle at its top vertex marked θ.',
    spec: { type: 'geometric_figure', params: { shape: 'triangle', points: [[0, 0], [6, 0], [0, 8]], vertices: null, sideLabels: ['10', '8', '6'], angleLabels: [null, null, 'θ'] } },
  },
  {
    id: 'fix3-similar-no-vertices',
    note: 'd: two similar triangles with `vertices: null` — no vertex letters at all',
    question: 'The two triangles are similar. What is x?',
    alt: 'Two similar triangles side by side with some side lengths labelled and one side labelled x; the corners are not named.',
    spec: { type: 'geometric_figure', params: { shape: 'similar_triangles', sides: [6, 8, 10], scale: 1.5, vertices: null, sideLabels: [['6', '8', '10'], ['9', 'x', null]] } },
  },
  {
    id: 'fix3-nested-similar-lamp-post',
    note: 'd: nested similar triangles — a lamp post, a person and the tip of the shadow, with a "?" on the post',
    question: 'A person 1.8 m tall stands 4 m from a lamp post and casts a shadow 2 m long, as shown. How tall is the lamp post?',
    alt: 'A right triangle with a vertical segment inside it parallel to its upright side, cutting off a smaller triangle at the right-hand corner. Lengths are marked along the base and on the inner segment; the upright side is marked with a boxed question mark.',
    spec: { type: 'geometric_figure', params: { shape: 'similar_triangles', nested: true, sides: [Math.hypot(5.4, 6), 5.4, 6], scale: 1 / 3, unit: 'm', vertices: null, sideLabels: [[null, '?', null], [null, '1.8 m', '2 m']], restLabels: ['4 m', null] } },
  },
  {
    id: 'fix3-interface-tir',
    note: 'e: past the critical angle with `refracted: false` and no reflected ray — the incident ray alone, nothing drawn beyond the interface',
    question: 'A ray in glass (n = 1.50) meets the surface with air at 50° to the normal, as shown. What happens to the ray at the surface?',
    alt: 'A ray in the upper medium, labelled glass, meets a horizontal boundary with air at an angle to the dashed normal. No ray is drawn beyond the boundary.',
    spec: { type: 'ray_diagram', params: { element: 'interface', n1: 1.5, n2: 1, incidentAngle: 50, media: ['glass', 'air'], refracted: false } },
  },
  {
    id: 'fix3-pes-third-period',
    note: 'f: sulfur — the 2s and 2p peaks are closer than a 1.5 energy ratio; drawn on a tightened axis with narrower peaks so they stand apart',
    question: 'The photoelectron spectrum of an element is shown. Which element is it?',
    alt: 'A photoelectron spectrum with five peaks of different heights on a logarithmic binding-energy axis that increases to the left.',
    spec: { type: 'spectrum', params: { variant: 'pes', peaks: [{ energy: 239, electrons: 2 }, { energy: 22.7, electrons: 2 }, { energy: 16.5, electrons: 6 }, { energy: 2.05, electrons: 2 }, { energy: 1.0, electrons: 4 }] } },
  },
  {
    id: 'fix3-wire-arrowhead',
    note: 'b: the current arrowhead on a wire in the page is one solid shape (no white stroke inside it)',
    question: 'A long straight wire carries a current to the right. What is the direction of the magnetic field at a point in the page directly below the wire?',
    alt: 'A horizontal wire with an arrowhead showing the current flowing to the right. Nothing else is drawn.',
    spec: { type: 'field_diagram', params: { variant: 'wire', view: 'side', current: 'right', showField: false } },
  },
];

FIGURE_FIXTURES.push(...BATCH3_FIXTURES);
