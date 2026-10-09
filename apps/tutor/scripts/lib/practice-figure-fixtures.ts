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
