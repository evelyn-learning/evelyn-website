/** GreenApple T2 figure items — group "alg1". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, fgraph, fOf, pgraph, plin, scatter, dotsOf, near, arr, turnsOf, type Ctx, type Item, type P, type Spec } from './kit';
import { satisfies, type Inequality } from '../../../src/lib/tutor/practice-figure/kinds/shaded-region';

// ── helpers ─────────────────────────────────────────────────────────────────

const nline = (min: number, max: number, extra: P): Spec => S('number_line', { min, max, step: 1, ...extra });
const onLine = (c: Ctx, x: number): boolean => c.txt('nl_contains', { x }) === 'yes';
/** Does the set drawn on the number line equal { x : pred(x) }? Compared at every half unit of the line. */
const sameSetOnLine = (c: Ctx, pred: (x: number) => boolean): boolean => {
  const { min, max } = c.p as { min: number; max: number };
  for (let x = min; x <= max; x += 0.5) if (onLine(c, x) !== pred(x)) return false;
  return true;
};
const intsOnLine = (c: Ctx): number[] => {
  const { min, max } = c.p as { min: number; max: number };
  const out: number[] = [];
  for (let x = Math.ceil(min); x <= max; x++) if (onLine(c, x)) out.push(x);
  return out;
};

const ineq = (a: number, b: number, op: Inequality['op'], cc: number): Inequality => ({ a, b, op, c: cc });
const region = (xRange: [number, number], yRange: [number, number], inequalities: Inequality[], extra: P = {}): Spec =>
  S('shaded_region', { xRange, yRange, xStep: 1, yStep: 1, region: { type: 'inequalities', inequalities }, ...extra });
const specIneqs = (c: Ctx): Inequality[] => (c.p.region as P).inequalities as Inequality[];
/** Does this system shade exactly what the figure's own inequalities shade? Compared at every half-unit point of the plot. */
const sameSystem = (c: Ctx, system: Inequality[]): boolean => {
  const mine = specIneqs(c);
  const [x0, x1] = c.p.xRange as number[]; const [y0, y1] = c.p.yRange as number[];
  for (let x = x0; x <= x1; x += 0.5) for (let y = y0; y <= y1; y += 0.5) {
    if (mine.every((k) => satisfies(k, x, y)) !== system.every((k) => satisfies(k, x, y))) return false;
  }
  return true;
};
const inRegion = (c: Ctx, x: number, y: number): boolean => c.txt('region_contains', { x, y }) === 'yes';

/** Slope and y-intercept of curve i of a function graph, from the checkers. */
const lineOf = (c: Ctx, i: number, x1 = 0, x2 = 2): [number, number] => [c.num('curve_slope', { curve: i, x1, x2 }), c.num('curve_y_intercept', { curve: i })];
const sameLine = (a: [number, number], b: [number, number]): boolean => near(a[0], b[0]) && near(a[1], b[1]);

/** A cloud of dots around y = m·x + b at the given x-values, offset by the given amounts. */
const cloud = (xs: number[], m: number, b: number, off: number[]): number[][] => xs.map((x, i) => [x, Math.round((m * x + b + off[i % off.length]) * 10) / 10]);

// ── items ───────────────────────────────────────────────────────────────────

export const ITEMS: Item[] = [
  // ═══ One-variable statistics ═══
  ...G('alg1.one-variable-statistics', 'Dot plots and box plots', [
    {
      t: 'read the median from a dot plot', d: 2, need: 'calc',
      spec: S('line_plot', { values: [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 8], xLabel: 'Books read over the summer', step: 1 }),
      alt: 'Each dot stands for one student in a reading club; stacked dots are students who read the same number of books.',
      q: 'The dot plot shows how many books each student in a reading club read over the summer. What is the median number of books? Type your answer as a number.',
      n: '4',
      ck: ['dot_median', {}],
      h: ['Count all the dots to find how many values there are.', 'Count in from the left, dot by dot, to the middle position of the sorted values.'],
      s: 'Read from the figure: 11 dots, at 1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 8. With 11 values the median is the 6th value counted from the left, which is 4. (The tallest stack, 2, is the mode, not the median.)',
    },
    {
      t: 'compare the spreads of two box plots', d: 2, need: 'calc',
      spec: S('box_plot', { plots: [{ label: 'Class P', min: 55, q1: 70, median: 80, q3: 85, max: 95 }, { label: 'Class Q', min: 60, q1: 65, median: 80, q3: 90, max: 100 }], range: [50, 100], step: 5, xLabel: 'Quiz score' }),
      alt: 'The two box plots, for Class P and Class Q, share one numbered axis of quiz scores, and their median lines sit at the same score.',
      q: 'The box plots show the quiz scores of Class P and Class Q. How many points greater is the interquartile range (IQR) of Class Q than the IQR of Class P? Type your answer as a number.',
      n: '10',
      calc: ['IQR of Class Q minus IQR of Class P, each from box_stat', (c) => c.num('box_stat', { plot: 1, stat: 'iqr' }) - c.num('box_stat', { plot: 0, stat: 'iqr' })],
      h: ['The IQR is the width of the box: Q3 minus Q1.', 'Read both ends of each box from the axis, find each IQR, then subtract.'],
      s: 'Read from the figure: Class P’s box runs from 70 to 85, so its IQR is 85 − 70 = 15. Class Q’s box runs from 65 to 90, so its IQR is 90 − 65 = 25. The difference is 25 − 15 = 10 points.',
    },
    {
      t: 'how far an outlier pulls the mean above the median', d: 3, need: 'calc',
      spec: S('line_plot', { values: [2, 4, 4, 6, 6, 6, 8, 8, 10, 26], xLabel: 'Commute time (minutes)', step: 2 }),
      alt: 'Each dot stands for one worker’s commute; most dots sit at the low end and one dot sits far to the right of the rest.',
      q: 'The dot plot shows the commute times of 10 workers. How many minutes greater is the mean commute time than the median commute time? Type your answer as a number.',
      n: '2',
      calc: ['dot_mean minus dot_median', (c) => c.num('dot_mean') - c.num('dot_median')],
      h: ['For the mean, add every plotted value and divide by the number of dots.', 'For the median with an even count, average the two middle values of the sorted list.'],
      s: 'Read from the figure: 2, 4, 4, 6, 6, 6, 8, 8, 10, 26. The sum is 80, so the mean is 80 ÷ 10 = 8. The 5th and 6th values are 6 and 6, so the median is 6. The far-right value of 26 pulls the mean up: 8 − 6 = 2 minutes.',
    },
  ]),

  // ═══ Scatterplots and trend lines ═══
  ...G('alg1.scatterplots-trend-lines', 'Trend lines from a scatterplot', [
    {
      t: 'write the equation of a drawn trend line', d: 2, need: 'reason',
      spec: scatter([[1, 55], [2, 55], [3, 65], [4, 65], [5, 70], [6, 70], [7, 80], [8, 85], [9, 85]], { xLabel: 'Hours of practice', yLabel: 'Test score', xRange: [0, 10], yRange: [40, 100], xStep: 1, yStep: 5, trendLine: { slope: 4, intercept: 50 } }),
      alt: 'Nine dots rise from the lower left to the upper right in a fairly narrow band, and a straight trend line runs through the middle of them, starting at the score axis.',
      q: 'The scatterplot shows hours of practice x and test score y for nine students, with a trend line drawn. Which equation describes the trend line?',
      o: [['y = 4x + 50', 'correct'], ['y = 50x + 4', 'swaps the slope and the y-intercept'], ['y = 0.25x + 50', 'divides the run by the rise'], ['y = 4x + 40', 'takes the bottom of the score axis as the y-intercept']],
      holds: ['slope from trend_slope and y-intercept from trend_value at x = 0, compared with each option', [
        (c) => sameLine([c.num('trend_slope'), c.num('trend_value', { x: 0 })], [4, 50]),
        (c) => sameLine([c.num('trend_slope'), c.num('trend_value', { x: 0 })], [50, 4]),
        (c) => sameLine([c.num('trend_slope'), c.num('trend_value', { x: 0 })], [0.25, 50]),
        (c) => sameLine([c.num('trend_slope'), c.num('trend_value', { x: 0 })], [4, 40]),
      ]],
      h: ['Find where the line meets the vertical axis at x = 0; that height is b.', 'Pick two points where the line crosses gridlines exactly and divide the change in y by the change in x.'],
      s: 'Read from the figure: the line starts at (0, 50) and passes through (5, 70). The slope is (70 − 50) ÷ (5 − 0) = 20 ÷ 5 = 4, and b = 50. The trend line is y = 4x + 50.',
    },
    {
      t: 'interpret the slope of a trend line in context', d: 2, need: 'calc',
      spec: scatter(cloud([52, 56, 60, 64, 68, 72, 76, 80, 84, 88], 3, -120, [8, -10, 6, -6, 12, -8, 4, -12, 9, -5]), { xLabel: 'High temperature (°F)', yLabel: 'Lemonades sold', xRange: [50, 90], yRange: [0, 160], xStep: 10, yStep: 20, trendLine: { slope: 3, intercept: -120 } }),
      alt: 'Ten dots rise from the lower left to the upper right around a straight trend line that crosses the plot.',
      q: 'A stand records the day’s high temperature x and the number of lemonades sold y on ten days, and draws the trend line shown. According to the trend line, about how many more lemonades are sold for each additional degree Fahrenheit? Type your answer as a number.',
      n: '3',
      ck: ['trend_slope', {}],
      h: ['The amount added for each one-unit increase in x is the slope of the line.', 'Find two points where the line crosses gridlines exactly, then divide the rise by the run.'],
      s: 'Read from the figure: the trend line passes through (60, 60) and (80, 120). The slope is (120 − 60) ÷ (80 − 60) = 60 ÷ 20 = 3, so the line predicts about 3 more lemonades for each additional degree.',
    },
    {
      t: 'judge an extrapolated prediction from a trend line', d: 3, need: 'reason',
      spec: scatter([[1, 4], [2, 8], [3, 12], [4, 12], [5, 12], [6, 16], [7, 16], [8, 20]], { xLabel: 'Weeks since planting', yLabel: 'Height (cm)', xRange: [0, 10], yRange: [0, 28], xStep: 1, yStep: 4, trendLine: { slope: 2, intercept: 4 } }),
      alt: 'Eight dots, one for each week a seedling was measured, rise closely along a straight trend line that starts on the height axis.',
      q: 'A student measured a seedling’s height once a week and drew the trend line shown. She uses the trend line to predict the height at week 30. What does the line give, and is that prediction reliable?',
      o: [
        ['64 cm; not reliable (extrapolation)', 'correct'],
        ['64 cm; reliable (a strong trend)', 'trusts an extrapolation because the association is strong'],
        ['60 cm; not reliable (extrapolation)', 'multiplies by the slope and leaves out the y-intercept'],
        ['34 cm; reliable (a strong trend)', 'adds the week number to the y-intercept instead of multiplying by the slope'],
      ],
      holds: ['the trend line’s value at x = 30 (trend_slope and trend_value at 0) and whether 30 lies inside the plotted weeks, compared with each option', ((): Array<(c: Ctx) => boolean> => {
        const pred = (c: Ctx) => c.num('trend_slope') * 30 + c.num('trend_value', { x: 0 });
        const inside = (c: Ctx) => { const xs = dotsOf(c).map((d) => d[0]); return 30 >= Math.min(...xs) && 30 <= Math.max(...xs); };
        return [
          (c) => near(pred(c), 64) && !inside(c),
          (c) => near(pred(c), 64) && inside(c),
          (c) => near(pred(c), 60) && !inside(c),
          (c) => near(pred(c), 34) && inside(c),
        ];
      })()],
      h: ['Read the slope and the y-intercept of the line, then substitute the week number into y = mx + b.', 'Compare the week you are predicting with the weeks the dots actually cover.'],
      s: 'Read from the figure: the line starts at (0, 4) and passes through (2, 8), so its slope is 2 and y = 2x + 4. At x = 30 it gives 2(30) + 4 = 64 cm. But the dots cover only weeks 1 to 8; week 30 is extrapolation, so the prediction is unreliable.',
    },
  ]),

  // ═══ Compound inequalities ═══
  ...G('alg1.compound-inequalities', 'Graphs of compound inequalities', [
    {
      t: 'find the compound inequality whose solution is graphed', d: 3, need: 'reason',
      spec: nline(-6, 7, { intervals: [{ from: -3, to: 4, fromOpen: true, toOpen: false }] }),
      alt: 'A thick segment joins two of the ticks, with an open circle at its left end and a filled circle at its right end.',
      q: 'The number line shows the solution set of one of these compound inequalities. Which one?',
      o: [['−5 < 2x + 1 ≤ 9', 'correct'], ['−5 ≤ 2x + 1 < 9', 'swaps the meanings of the open and the filled circle'], ['−5 < 2x − 1 ≤ 9', 'its solution is −2 < x ≤ 5: the constant is undone with the wrong sign'], ['−5 < −2x + 1 ≤ 9', 'its solution is −4 ≤ x < 3: dividing by a negative flips the signs']],
      holds: ['figure-core checker nl_contains at every half unit of the line, compared with each option’s solution set', [
        (c) => sameSetOnLine(c, (x) => -5 < 2 * x + 1 && 2 * x + 1 <= 9),
        (c) => sameSetOnLine(c, (x) => -5 <= 2 * x + 1 && 2 * x + 1 < 9),
        (c) => sameSetOnLine(c, (x) => -5 < 2 * x - 1 && 2 * x - 1 <= 9),
        (c) => sameSetOnLine(c, (x) => -5 < -2 * x + 1 && -2 * x + 1 <= 9),
      ]],
      h: ['Write the graphed set as a three-part inequality first, using the circles to choose < or ≤.', 'Solve each option on all three parts, and remember that dividing by a negative flips every sign.'],
      s: 'Read from the figure: open circle at −3, filled circle at 4, shaded between, so the set is −3 < x ≤ 4. Solving −5 < 2x + 1 ≤ 9: subtract 1 from all three parts, −6 < 2x ≤ 8, then divide by 2: −3 < x ≤ 4. It matches.',
    },
    {
      t: 'name an OR graph as a compound inequality', d: 2, need: 'reason',
      spec: nline(-6, 7, { intervals: [{ from: null, to: -2, toOpen: true }, { from: 3, to: null, fromOpen: false }] }),
      alt: 'Two thick rays point away from each other: one runs left from an open circle, the other runs right from a filled circle.',
      q: 'Which compound inequality has the solution set graphed on the number line?',
      o: [['x < −2 or x ≥ 3', 'correct'], ['x ≤ −2 or x > 3', 'swaps the meanings of the open and the filled circle'], ['−2 < x ≤ 3', 'describes the unshaded gap between the rays'], ['x < −2 and x ≥ 3', 'uses AND, which keeps only an overlap — and these rays do not overlap']],
      holds: ['figure-core checker nl_contains at every half unit of the line, compared with each option’s set', [
        (c) => sameSetOnLine(c, (x) => x < -2 || x >= 3),
        (c) => sameSetOnLine(c, (x) => x <= -2 || x > 3),
        (c) => sameSetOnLine(c, (x) => x > -2 && x <= 3),
        (c) => sameSetOnLine(c, (x) => x < -2 && x >= 3),
      ]],
      h: ['Two rays pointing away from each other mean a union: the joining word is OR.', 'An open circle goes with < or >, a filled circle with ≤ or ≥.'],
      s: 'Read from the figure: a ray runs left from an open circle at −2 (x < −2) and a ray runs right from a filled circle at 3 (x ≥ 3). Both rays are kept, so it is a union: x < −2 or x ≥ 3.',
    },
    {
      t: 'test values against a graphed AND set', d: 2, need: 'reason',
      spec: nline(-7, 5, { intervals: [{ from: -4, to: 2, fromOpen: false, toOpen: true }] }),
      alt: 'A thick segment joins two of the ticks, with a filled circle at its left end and an open circle at its right end.',
      q: 'The graph shows the solution set of a compound inequality joined by AND. Which value of x is a solution?',
      o: [['x = −4', 'correct'], ['x = 2', 'treats the open circle as included'], ['x = 2.5', 'lies outside the shaded segment, to the right of its open end'], ['x = −5', 'lies outside the shaded segment, to the left of its filled end']],
      holds: ['figure-core checker nl_contains at each option’s value', [(c) => onLine(c, -4), (c) => onLine(c, 2), (c) => onLine(c, 2.5), (c) => onLine(c, -5)]],
      h: ['A value is a solution only if it lies on the shaded part of the line.', 'At an end, a filled circle includes the number and an open circle leaves it out.'],
      s: 'Read from the figure: the segment runs from a filled circle at −4 to an open circle at 2, so −4 ≤ x < 2. The value −4 is included (filled circle). 2 is excluded (open circle), and 2.5 and −5 lie outside the segment.',
    },
  ]),

  // ═══ One-variable inequalities ═══
  ...G('alg1.one-variable-inequalities', 'Graphing inequality solutions', [
    {
      t: 'find the inequality whose solution is graphed', d: 3, need: 'reason',
      spec: nline(-6, 6, { intervals: [{ from: -2, to: null, fromOpen: false }] }),
      alt: 'A thick ray starts at a filled circle on one tick and runs to the right with an arrow.',
      q: 'The number line shows the solution set of one of these inequalities. Which one?',
      o: [['−3x + 4 ≤ 10', 'correct'], ['3x + 4 ≤ 10', 'its solution is x ≤ 2: the coefficient’s sign is dropped'], ['−3x + 4 < 10', 'its solution is x > −2, with an open circle'], ['−3x + 4 ≥ 10', 'its solution is x ≤ −2: matches the graph’s direction without flipping for the negative']],
      holds: ['figure-core checker nl_contains at every half unit of the line, compared with each option’s solution set', [
        (c) => sameSetOnLine(c, (x) => -3 * x + 4 <= 10),
        (c) => sameSetOnLine(c, (x) => 3 * x + 4 <= 10),
        (c) => sameSetOnLine(c, (x) => -3 * x + 4 < 10),
        (c) => sameSetOnLine(c, (x) => -3 * x + 4 >= 10),
      ]],
      h: ['Write the graphed set as an inequality with x on the left, using the circle to choose the symbol.', 'Solve each option; dividing both sides by a negative number reverses the symbol.'],
      s: 'Read from the figure: a filled circle at −2 with shading to the right, so x ≥ −2. Solving −3x + 4 ≤ 10: subtract 4 to get −3x ≤ 6, then divide by −3 and flip: x ≥ −2. It matches.',
    },
    {
      t: 'greatest integer in a graphed solution set', d: 2, need: 'reason',
      spec: nline(-4, 7, { intervals: [{ from: null, to: 3, toOpen: true }] }),
      alt: 'A thick ray starts at an open circle on one tick and runs to the left with an arrow.',
      q: 'The number line shows the solution set of an inequality. What is the greatest integer that is a solution? Type your answer as a number.',
      n: '2',
      calc: ['the greatest integer on the line for which nl_contains says yes', (c) => Math.max(...intsOnLine(c))],
      h: ['Decide whether the number at the circle is itself a solution: open or filled?', 'Then step to the next integer in the shaded direction.'],
      s: 'Read from the figure: an open circle at 3 with shading to the left, so x < 3. The boundary 3 is not a solution (open circle), so the greatest integer that is one is 2.',
    },
    {
      t: 'find the mistake in a student’s graph', d: 2, need: 'reason',
      spec: nline(-8, 4, { intervals: [{ from: -4, to: null, fromOpen: true }] }),
      alt: 'A thick ray starts at an open circle on one tick and runs to the right with an arrow. It is a student’s graph.',
      q: 'A student solved −2x > 8 and drew the graph shown. What is wrong with the graph?',
      o: [['The shading should go left: the solution is x < −4', 'correct'], ['The circle should be filled: the solution is x ≥ −4', 'treats > as ≥'], ['Nothing is wrong: the solution is x > −4', 'forgets to flip the symbol when dividing by a negative'], ['The circle should be at 4: the solution is x < 4', 'drops the negative sign when dividing']],
      holds: ['the true solution x < −4 (from −2x > 8) against the graph read with nl_contains at every half unit: an option holds when its claimed solution is the true one and the graph differs from it in the way it says', ((): Array<(c: Ctx) => boolean> => {
        const truth = (x: number) => -2 * x > 8;
        const sameAsTruth = (f: (x: number) => boolean) => { for (let x = -8; x <= 4; x += 0.5) if (f(x) !== truth(x)) return false; return true; };
        return [
          (c) => sameAsTruth((x) => x < -4) && sameSetOnLine(c, (x) => x > -4),
          (c) => sameAsTruth((x) => x >= -4) && !sameSetOnLine(c, (x) => x >= -4),
          (c) => sameSetOnLine(c, truth),
          (c) => sameAsTruth((x) => x < 4) && !sameSetOnLine(c, (x) => x < 4),
        ];
      })()],
      h: ['Solve −2x > 8 yourself, paying attention to what dividing by a negative does to the symbol.', 'Compare your solution with the circle and the direction of the shading in the graph.'],
      s: 'Read from the figure: an open circle at −4 with shading to the right, which is x > −4. Solving −2x > 8: divide by −2 and flip, x < −4. The circle is right (open, at −4), but the shading should go left.',
    },
  ]),

  // ═══ Relations and functions ═══
  ...G('alg1.relations-functions', 'Domain, range and function notation from graphs', [
    {
      t: 'domain and range of a graphed function', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-4, 5], yRange: [-3, 8], curves: [{ expr: 'x^2 - 2', domain: [-2, 3], from: 'closed', to: 'closed' }] }),
      alt: 'A U-shaped curve is drawn between two filled endpoint dots, one on each side of its lowest point.',
      q: 'What are the domain and the range of the function shown in the graph?',
      o: [['Domain −2 ≤ x ≤ 3; range −2 ≤ y ≤ 7', 'correct'], ['Domain −2 ≤ x ≤ 7; range −2 ≤ y ≤ 3', 'mixes up x-values and y-values'], ['Domain −2 ≤ x ≤ 3; range 2 ≤ y ≤ 7', 'takes the heights of the two endpoints and misses the lowest point'], ['All real numbers; range y ≥ −2', 'ignores the endpoint dots and treats the curve as going on forever']],
      holds: ['domain from the ends of the drawn piece, range from curve_extremum min and max values, compared with each option', ((): Array<(c: Ctx) => boolean> => {
        const dr = (c: Ctx) => { const d = arr(c.p.curves)[0].domain as number[]; return [d[0], d[1], c.num('curve_extremum', { curve: 0, which: 'min', want: 'value' }), c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' })]; };
        const is = (v: number[]) => (c: Ctx) => dr(c).every((x, i) => near(x, v[i]));
        return [is([-2, 3, -2, 7]), is([-2, 7, -2, 3]), is([-2, 3, 2, 7]), (c) => { const d = dr(c); return !Number.isFinite(d[0]) && near(d[2], -2); }];
      })()],
      h: ['Sweep left to right: the x-values the graph covers, from one endpoint to the other, are the domain.', 'Sweep bottom to top: the lowest and the highest points of the graph give the range.'],
      s: 'Read from the figure: the graph runs from the filled dot at (−2, 2) to the filled dot at (3, 7), so the domain is −2 ≤ x ≤ 3. Its lowest point is (0, −2) and its highest is (3, 7), so the range is −2 ≤ y ≤ 7.',
    },
    {
      t: 'evaluate function notation from a graph', d: 2, need: 'calc',
      spec: fgraph({ xRange: [-5, 5], yRange: [-3, 6], curves: plin([[-5, 5], [-2, 2], [2, 2], [5, -1]]) }),
      alt: 'The graph of f is made of three straight pieces: one falling, one level, and one falling again.',
      q: 'The graph of the function f is shown. What is f(−4) + f(1)? Type your answer as a number.',
      n: '6',
      calc: ['curve_value of the piece through x = −4 plus curve_value of the piece through x = 1', (c) => c.num('curve_value', { curve: 0, x: -4 }) + c.num('curve_value', { curve: 1, x: 1 })],
      h: ['f(a) is the output when the input is a: go to x = a on the horizontal axis.', 'From there move up or down to the graph and read its height; do this for each input, then add.'],
      s: 'Read from the figure: at x = −4 the graph is at height 4, so f(−4) = 4. At x = 1 the graph is on the level piece at height 2, so f(1) = 2. f(−4) + f(1) = 4 + 2 = 6.',
    },
    {
      t: 'apply the vertical line test to a graphed relation', d: 3, need: 'reason',
      spec: S('conic_graph', { xRange: [-2, 10], yRange: [-4, 4], xStep: 1, yStep: 1, conics: [{ type: 'parabola', vertex: [0, 0], p: 0.25, axis: 'x' }] }),
      alt: 'One solid curve opens to the right from its turning point at the origin, like a sideways U. Grid points on it include (1, 1), (1, −1), (9, 3) and (9, −3).',
      q: 'The graph shows a relation between x and y. Is y a function of x?',
      o: [['No: the line x = 4 meets the graph at both (4, 2) and (4, −2)', 'correct'], ['No: the line x = 1 meets the graph at both (1, 1) and (1, 2)', 'misreads the graph — those are not both points on it'], ['Yes: each x-value from 0 to 10 is used by the graph', 'checks that inputs are used, not how many outputs each has'], ['Yes: no horizontal line meets the graph twice', 'uses a horizontal line instead of a vertical one']],
      holds: ['the parabola of the spec, (y − k)² = 4p(x − h), tested at the named points, and conic_line_intersections with the line x = 4 added (a variant): y is a function of x only if no vertical line meets the curve twice', ((): Array<(c: Ctx) => boolean> => {
        const on = (c: Ctx, x: number, y: number) => { const k = arr(c.p.conics)[0]; const [h, kk] = k.vertex as number[]; return near((y - kk) ** 2, 4 * (k.p as number) * (x - h)); };
        const twice = (c: Ctx) => c.num('conic_line_intersections', { line: 0, want: 'count' }, { spec: S('conic_graph', { ...c.p, lines: [{ x: 4 }] }), what: 'the vertical line x = 4 added' }) === 2;
        return [(c) => twice(c) && on(c, 4, 2) && on(c, 4, -2), (c) => on(c, 1, 1) && on(c, 1, 2), (c) => !twice(c), (c) => !twice(c)];
      })()],
      h: ['Imagine sliding a vertical line across the graph.', 'If some vertical line meets the graph in more than one point, that input has more than one output.'],
      s: 'Read from the figure: the vertical line x = 4 passes through (4, 2) on the upper half and (4, −2) on the lower half. One input, 4, has two outputs, so the relation fails the vertical line test and y is not a function of x.',
    },
  ]),

  // ═══ Slope-intercept form ═══
  ...G('alg1.slope-intercept-form', 'Reading m and b from a graph', [
    {
      t: 'write y = mx + b from a graphed line', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-5, 5], yRange: [-3, 6], curves: [{ expr: '-2x/3 + 2' }] }),
      alt: 'One straight line falls from left to right, crossing both axes.',
      q: 'Which equation describes the line graphed?',
      o: [['y = −(2/3)x + 2', 'correct'], ['y = −(3/2)x + 2', 'divides the run by the rise'], ['y = (2/3)x + 2', 'misses that the line falls, so the slope is negative'], ['y = −(2/3)x + 3', 'uses where the line crosses the x-axis as b']],
      holds: ['slope from curve_slope between x = 0 and x = 3 and b from curve_y_intercept, compared with each option', [
        (c) => sameLine(lineOf(c, 0, 0, 3), [-2 / 3, 2]), (c) => sameLine(lineOf(c, 0, 0, 3), [-3 / 2, 2]), (c) => sameLine(lineOf(c, 0, 0, 3), [2 / 3, 2]), (c) => sameLine(lineOf(c, 0, 0, 3), [-2 / 3, 3]),
      ]],
      h: ['b is where the line crosses the y-axis, not the x-axis.', 'Count the rise and the run between two points the line passes through exactly; a line that falls has a negative slope.'],
      s: 'Read from the figure: the line crosses the y-axis at (0, 2), so b = 2, and it passes through (3, 0). From (0, 2) to (3, 0) it goes down 2 while going right 3, so m = −2/3. The equation is y = −(2/3)x + 2.',
    },
    {
      t: 'read the rate from a graphed cost line', d: 2, need: 'calc',
      spec: pgraph('Months of membership', 'Total cost ($)', [0, 8], 1, [0, 250], 25, [{ expr: '25x + 50' }]),
      alt: 'A straight line rises from a point on the cost axis as the number of months increases.',
      q: 'The graph shows the total cost of a climbing-gym membership against the number of months. By how many dollars does the total cost rise for each additional month? Type your answer as a number.',
      n: '25',
      ck: ['curve_slope', { curve: 0, x1: 0, x2: 4 }],
      h: ['The amount added per month is the slope m of the line.', 'Read the cost at two whole numbers of months, then divide the change in cost by the change in months.'],
      s: 'Read from the figure: at 0 months the cost is 50 dollars and at 4 months it is 150 dollars. The slope is (150 − 50) ÷ (4 − 0) = 100 ÷ 4 = 25, so the cost rises 25 dollars per month (the 50 is the starting fee).',
    },
    {
      t: 'compare the slopes and intercepts of two lines', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-4, 5], yRange: [-5, 7], curves: [{ expr: '2x - 1', label: 'p' }, { expr: 'x/2 + 3', label: 'q' }] }),
      alt: 'Two straight lines, p and q, both rise from left to right and cross each other.',
      q: 'Lines p and q are graphed. Which statement compares their slopes m and their y-intercepts b correctly?',
      o: [['p has the greater m, and q has the greater b', 'correct'], ['q has the greater m, and q has the greater b', 'judges steepness by which line is higher on the y-axis'], ['p has the greater m, and p has the greater b', 'reads b from where the lines meet the x-axis or the top of the plot'], ['p and q have the same m', 'thinks two crossing lines must share a slope']],
      holds: ['slopes from curve_slope (x = 0 to 2) and intercepts from curve_y_intercept of both lines', ((): Array<(c: Ctx) => boolean> => {
        const v = (c: Ctx) => { const p = lineOf(c, 0); const q = lineOf(c, 1); return { mp: p[0], bp: p[1], mq: q[0], bq: q[1] }; };
        return [(c) => { const k = v(c); return k.mp > k.mq && k.bq > k.bp; }, (c) => { const k = v(c); return k.mq > k.mp && k.bq > k.bp; }, (c) => { const k = v(c); return k.mp > k.mq && k.bp > k.bq; }, (c) => { const k = v(c); return near(k.mp, k.mq); }];
      })()],
      h: ['For each line, count the rise over a run of 1 or 2 to compare steepness.', 'Read where each line crosses the y-axis to compare b.'],
      s: 'Read from the figure: p crosses the y-axis at (0, −1) and rises 2 for every 1 to the right, so m = 2 and b = −1. q crosses at (0, 3) and rises 1 for every 2 to the right, so m = 1/2 and b = 3. p has the greater slope; q has the greater y-intercept.',
    },
  ]),

  // ═══ Systems word problems & systems of inequalities ═══
  ...G('alg1.systems-applications', 'Graphing systems of inequalities', [
    {
      t: 'pick the marked point in the overlap', d: 2, need: 'reason',
      spec: region([-2, 6], [-3, 6], [ineq(-1, 1, '>=', -1), ineq(1, 1, '<', 5)], { points: [{ x: 1, y: 2, label: 'P' }, { x: 3, y: 2, label: 'Q' }, { x: 2, y: -2, label: 'R' }, { x: 4, y: 4, label: 'S' }] }),
      alt: 'The region where the two shadings overlap is hatched; one boundary line is solid and the other is dashed. Four points, P, Q, R and S, are marked.',
      q: 'The hatched region is the solution set of a system of two linear inequalities, with its boundary lines drawn. Which marked point is a solution of the system?',
      o: [['P', 'correct'], ['Q', 'lies on the dashed boundary, which is not part of the solution'], ['R', 'lies below the solid boundary, outside the overlap'], ['S', 'lies above the dashed boundary, outside the overlap']],
      holds: ['figure-core checker region_contains at each marked point', [(c) => inRegion(c, 1, 2), (c) => inRegion(c, 3, 2), (c) => inRegion(c, 2, -2), (c) => inRegion(c, 4, 4)]],
      h: ['A solution must lie in the region where all the shadings overlap.', 'A point on a dashed boundary does not count; a point on a solid boundary does.'],
      s: 'Read from the figure: P (1, 2) lies inside the hatched overlap. Q (3, 2) sits exactly on the dashed line, which is excluded. R (2, −2) is below the solid line and S (4, 4) is above the dashed line, both outside. Only P is a solution.',
    },
    {
      t: 'greatest whole-number amount allowed by the constraints', d: 2, need: 'calc',
      spec: S('shaded_region', { xRange: [0, 7], yRange: [0, 8], xStep: 1, yStep: 1, xLabel: 'Trays of muffins, x', yLabel: 'Trays of cookies, y', region: { type: 'inequalities', inequalities: [ineq(1, 0, '>=', 0), ineq(0, 1, '>=', 0), ineq(1, 1, '<=', 6), ineq(2, 1, '<=', 8)] } }),
      alt: 'The hatched region is a four-sided shape in the corner of the first quadrant, bounded by the two axes and two solid slanted lines of different steepness.',
      q: 'A club bakes x trays of muffins and y trays of cookies. The hatched region in the graph shows every combination that meets both its oven-time limit and its tray limit. If the club bakes 1 tray of muffins, what is the greatest number of trays of cookies it can bake? Type your answer as a number.',
      n: '5',
      calc: ['the greatest whole y with region_contains (1, y) = yes', (c) => { let best = -1; for (let y = 0; y <= 8; y++) if (inRegion(c, 1, y)) best = y; return best; }],
      h: ['Go to x = 1 and move straight up through the hatched region.', 'Stop at the lowest boundary line you meet above that point; every constraint must hold at once.'],
      s: 'Read from the figure: at x = 1, the steeper line is at y = 6 and the other solid line is at y = 5. The region lies below both, so it stops at the lower one, y = 5. The point (1, 5) is on a solid boundary, so it counts: 5 trays of cookies.',
    },
    {
      t: 'find the missing inequality of a graphed system', d: 3, need: 'reason',
      spec: region([-3, 7], [-4, 7], [ineq(1, 1, '<=', 6), ineq(-1, 1, '>', -2)]),
      alt: 'The hatched region is the overlap of two half-planes; one boundary line falls from left to right and is solid, the other rises and is dashed.',
      q: 'The hatched region in the graph is the solution set of the system x + y ≤ 6 and one more inequality. Which is the other inequality?',
      o: [['y > x − 2', 'correct'], ['y ≥ x − 2', 'misses that the rising boundary is dashed'], ['y < x − 2', 'shades the wrong side of the rising line'], ['y > −x − 2', 'gives the rising line a negative slope']],
      holds: ['the region shaded by x + y ≤ 6 with each option, compared with the figure’s own inequalities at every half-unit point', [
        (c) => sameSystem(c, [ineq(1, 1, '<=', 6), ineq(-1, 1, '>', -2)]),
        (c) => sameSystem(c, [ineq(1, 1, '<=', 6), ineq(-1, 1, '>=', -2)]),
        (c) => sameSystem(c, [ineq(1, 1, '<=', 6), ineq(-1, 1, '<', -2)]),
        (c) => sameSystem(c, [ineq(1, 1, '<=', 6), ineq(1, 1, '>', -2)]),
      ]],
      h: ['The falling solid line is x + y ≤ 6; read the slope and y-intercept of the other boundary line.', 'Check whether that line is dashed or solid, and which side of it is hatched.'],
      s: 'Read from the figure: the rising line crosses the y-axis at (0, −2) and passes through (2, 0), so it is y = x − 2. It is dashed (strict), and the hatching lies above it, so the other inequality is y > x − 2.',
    },
  ]),

  // ═══ Systems by graphing ═══
  ...G('alg1.systems-by-graphing', 'Reading and classifying graphed systems', [
    {
      t: 'read the solution of a graphed system', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-4, 5], yRange: [-4, 6], curves: [{ expr: '2x - 3', label: 'p' }, { expr: '-x + 3', label: 'q' }] }),
      alt: 'Two straight lines, p and q, are drawn on one set of axes: p rises and q falls, and they cross once.',
      q: 'Lines p and q are the graphs of the two equations of a system. What is the solution of the system?',
      o: [['(2, 1)', 'correct'], ['(1, 2)', 'writes the coordinates in the order (y, x)'], ['(0, 3)', 'gives where q crosses the y-axis'], ['(3, 0)', 'gives where q crosses the x-axis']],
      holds: ['curves_intersection of p and q (x, then y), compared with each option', ((): Array<(c: Ctx) => boolean> => {
        const pt = (c: Ctx) => [c.num('curves_intersection', { a: 0, b: 1, want: 'only' }), c.num('curves_intersection', { a: 0, b: 1, want: 'y' })];
        const is = (x: number, y: number) => (c: Ctx) => { const [a, b] = pt(c); return near(a, x) && near(b, y); };
        return [is(2, 1), is(1, 2), is(0, 3), is(3, 0)];
      })()],
      h: ['The solution of a system is the point that lies on both lines.', 'Read across to the x-coordinate first, then up or down to the y-coordinate.'],
      s: 'Read from the figure: the lines cross at x = 2, y = 1, so the solution is (2, 1). Check: in y = 2x − 3, 2(2) − 3 = 1, and in y = −x + 3, −2 + 3 = 1. The point works in both equations.',
    },
    {
      t: 'choose a second equation that gives infinitely many solutions', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-3, 6], yRange: [-3, 6], curves: [{ expr: '-x + 4', label: 'p' }] }),
      alt: 'One straight line, p, falls from left to right and crosses both axes.',
      q: 'Line p is graphed. Which equation, paired with line p, makes a system with infinitely many solutions?',
      o: [['2x + 2y = 8', 'correct'], ['x + y = 6', 'has the same slope but a different y-intercept: parallel, no solution'], ['y = x + 4', 'shares only the y-intercept: the lines cross once'], ['2x + y = 8', 'divides only some terms by 2: it is y = −2x + 8, which crosses p once']],
      holds: ['slope and y-intercept of p from curve_slope and curve_y_intercept, compared with each option solved for y', ((): Array<(c: Ctx) => boolean> => {
        const opts: Array<[number, number]> = [[-1, 4], [-1, 6], [1, 4], [-2, 8]];
        return opts.map((o) => (c: Ctx) => sameLine(lineOf(c, 0), o));
      })()],
      h: ['Read the slope and the y-intercept of p from the graph.', 'Solve each option for y; infinitely many solutions means the same slope AND the same y-intercept.'],
      s: 'Read from the figure: p crosses the y-axis at (0, 4) and falls 1 for each 1 to the right, so p is y = −x + 4. Solving 2x + 2y = 8 for y: 2y = −2x + 8, y = −x + 4 — the same line, so infinitely many solutions.',
    },
    {
      t: 'pick the pair of graphed lines with no solution', d: 2, need: 'reason',
      spec: fgraph({ xRange: [-5, 5], yRange: [-5, 6], curves: [{ expr: 'x + 2', label: 'p' }, { expr: '-2x + 1', label: 'q' }, { expr: 'x - 3', label: 'r' }] }),
      alt: 'Three straight lines, p, q and r, are drawn on one set of axes; q falls from left to right while p and r rise.',
      q: 'Lines p, q and r are graphed. Which two of them form a system of equations with no solution?',
      o: [['p and r', 'correct'], ['p and q', 'p rises and q falls, so these two cross'], ['q and r', 'q and r have different slopes, so they cross'], ['No pair of them', 'misses that two of the lines have the same slope']],
      holds: ['slopes (curve_slope) and y-intercepts (curve_y_intercept): no solution = same slope, different y-intercept', ((): Array<(c: Ctx) => boolean> => {
        const none = (c: Ctx, i: number, j: number) => { const a = lineOf(c, i); const b = lineOf(c, j); return near(a[0], b[0]) && !near(a[1], b[1]); };
        return [(c) => none(c, 0, 2), (c) => none(c, 0, 1), (c) => none(c, 1, 2), (c) => !none(c, 0, 1) && !none(c, 0, 2) && !none(c, 1, 2)];
      })()],
      h: ['A system has no solution when its two lines are parallel and never meet.', 'Compare the slopes of the lines by counting rise over run for each.'],
      s: 'Read from the figure: p rises 1 for each 1 to the right from (0, 2); r rises 1 for each 1 to the right from (0, −3); q falls 2 for each 1 from (0, 1). p and r have the same slope and different y-intercepts, so they are parallel: no solution.',
    },
  ]),

  // ═══ Quadratic graphs & vertex form ═══
  ...G('alg1.quadratic-graphs-vertex', 'Vertex and axis from a parabola', [
    {
      t: 'match a graphed parabola to its vertex form', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-6, 4], yRange: [-5, 6], curves: [{ expr: '0.5*(x + 1)^2 - 4' }] }),
      alt: 'A parabola opening upward is drawn; its lowest point and several other points of it fall on grid crossings.',
      q: 'Which equation describes the parabola shown in the graph?',
      o: [['y = (1/2)(x + 1)² − 4', 'correct'], ['y = (1/2)(x − 1)² − 4', 'falls for the sign-of-h trap'], ['y = (x + 1)² − 4', 'ignores the width: this one rises 1 per step of 1 from the vertex, not 1/2'], ['y = 2(x + 1)² − 4', 'inverts the width factor']],
      holds: ['the drawn curve (its own expression) compared with each option at every half unit of the plot', ((): Array<(c: Ctx) => boolean> => {
        const fns: Array<(x: number) => number> = [(x) => 0.5 * (x + 1) ** 2 - 4, (x) => 0.5 * (x - 1) ** 2 - 4, (x) => (x + 1) ** 2 - 4, (x) => 2 * (x + 1) ** 2 - 4];
        return fns.map((g) => (c: Ctx) => { const f = fOf(c); for (let x = -6; x <= 4; x += 0.5) if (!near(f(x), g(x), 1e-9)) return false; return near(c.num('curve_extremum', { curve: 0, which: 'min', want: 'x' }), -1); });
      })()],
      h: ['Read the vertex (h, k) from the lowest point; remember that y = a(x − h)² + k subtracts h.', 'To find a, step 2 to the right of the vertex and see how far the graph has risen: a × 2² equals that rise.'],
      s: 'Read from the figure: the vertex is (−1, −4), so y = a(x + 1)² − 4. The graph passes through (1, −2): 2 to the right of the vertex it is 2 higher, so a × 2² = 2 and a = 1/2. The equation is y = (1/2)(x + 1)² − 4.',
    },
    {
      t: 'read the maximum height in context', d: 2, need: 'reason',
      spec: pgraph('Time (s)', 'Height (m)', [0, 5], 1, [0, 30], 5, [{ expr: '-5*(x - 2)^2 + 25', domain: [0, 4.236], from: 'none', to: 'none' }]),
      alt: 'A downward-opening arch starts on the height axis above the ground, rises to a highest point and comes back down to the ground.',
      q: 'The graph shows the height of a ball, in meters, t seconds after it is thrown upward. What is the greatest height the ball reaches, in meters? Type your answer as a number.',
      n: '25',
      ck: ['curve_extremum', { curve: 0, which: 'max', want: 'value' }],
      h: ['The highest point of a parabola that opens down is its vertex.', 'The question asks HOW HIGH, so it wants the vertex’s height, not the time at which it happens.'],
      s: 'Read from the figure: the highest point of the arch is at t = 2 seconds, at a height of 25 meters. The vertex (2, 25) is a maximum because the parabola opens down, so the greatest height is 25 m.',
    },
    {
      t: 'find the false statement about a parabola', d: 3, need: 'reason',
      spec: fgraph({ xRange: [-2, 6], yRange: [-6, 5], curves: [{ expr: '-1*(x - 2)^2 + 3' }] }),
      alt: 'A parabola opening downward is drawn; its turning point falls on a grid crossing and it crosses the y-axis on a gridline.',
      q: 'Which statement about the parabola shown in the graph is FALSE?',
      o: [['The vertex (2, 3) is the minimum point of the graph', 'correct'], ['The axis of symmetry is the line x = 2', 'true: the vertical mirror line passes through the vertex'], ['The graph crosses the y-axis at (0, −1)', 'true: read where the curve meets the y-axis'], ['The greatest value of the function is 3', 'true: the parabola opens down, so the vertex is the highest point']],
      holds: falseOne_(),
      h: ['Decide first whether the parabola opens up or down.', 'Then test each statement against the vertex, the mirror line and the y-axis crossing you read from the graph.'],
      s: 'Read from the figure: the parabola opens down with vertex (2, 3), crossing the y-axis at (0, −1). Its axis is x = 2, and its greatest value is 3. Because it opens down, (2, 3) is the MAXIMUM, not the minimum, so that statement is false.',
    },
  ]),
];

/** The four statements about y = −(x − 2)² + 3, judged on the drawn curve; an option answers the question when its statement is false. */
function falseOne_(): [string, Array<(c: Ctx) => boolean>] {
  const turn = (c: Ctx) => turnsOf(fOf(c), -2, 6);
  const truths: Array<(c: Ctx) => boolean> = [
    (c) => turn(c).some((t) => t.kind === 'min' && near(t.x, 2) && near(t.y, 3)),
    (c) => near(c.num('curve_extremum', { curve: 0, which: 'max', want: 'x' }), 2) && turn(c).length === 1,
    (c) => near(c.num('curve_y_intercept', { curve: 0 }), -1),
    (c) => near(c.num('curve_extremum', { curve: 0, which: 'max', want: 'value' }), 3),
  ];
  return ['turning points of the drawn curve (turnsOf), curve_extremum and curve_y_intercept; an option answers the question when its statement is false', truths.map((f) => (c: Ctx) => !f(c))];
}
