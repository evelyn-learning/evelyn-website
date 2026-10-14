/** GreenApple T2 figure items — group "stats-apes". Items: see author-t2-figure-items.ts for the rules. */
import { G, S, arr, dotsOf, falseOne, near, round, sum, type Ctx, type Item, type P, type Spec } from './kit';

// ── helpers ─────────────────────────────────────────────────────────────────

/** Labelled scatter points: [x, y] or [x, y, label] or [x, y, label | '', series]. */
const sc = (points: Array<[number, number] | [number, number, string] | [number, number, string, string]>, params: P): Spec =>
  S('scatter_plot', { points: points.map(([x, y, label, series]) => ({ x, y, ...(label ? { label } : {}), ...(series ? { series } : {}) })), ...params });
/** The points of a scatter plot (optionally one series) with their labels. */
const ptsOf = (c: Ctx, series?: string): Array<{ x: number; y: number; label?: string }> =>
  arr(c.p.points).filter((k) => !series || k.series === series).map((k) => ({ x: k.x as number, y: k.y as number, label: k.label as string | undefined }));
/** Least squares on (x, y) points: slope, intercept, correlation. */
const ls = (pts: number[][]): { m: number; b: number; r: number } => {
  const n = pts.length; const mx = sum(pts.map((q) => q[0])) / n; const my = sum(pts.map((q) => q[1])) / n;
  const sxx = sum(pts.map((q) => (q[0] - mx) ** 2)); const syy = sum(pts.map((q) => (q[1] - my) ** 2)); const sxy = sum(pts.map((q) => (q[0] - mx) * (q[1] - my)));
  return { m: sxy / sxx, b: my - (sxy / sxx) * mx, r: sxy / Math.sqrt(sxx * syy) };
};
/** Residuals (sorted by x) about the least-squares line — or, for a residual plot, the plotted values themselves. */
const resid = (pts: number[][], plotted = false): number[][] => {
  const s = [...pts].sort((p, q) => p[0] - q[0]);
  if (plotted) return s;
  const { m, b } = ls(s);
  return s.map(([x, y]) => [x, y - (m * x + b)]);
};
const thirds = <T,>(xs: T[]): [T[], T[], T[]] => { const k = Math.floor(xs.length / 3); return [xs.slice(0, k), xs.slice(k, xs.length - k), xs.slice(xs.length - k)]; };
const mean = (xs: number[]): number => sum(xs) / xs.length;
const meanAbs = (xs: number[]): number => mean(xs.map(Math.abs));
/** A curved pattern: the residuals of the outer thirds and of the middle third sit on opposite sides, by much more than chance. */
const curvedOf = (rs: number[][]): boolean => { const [a, m, z] = thirds(rs.map((q) => q[1])); return Math.abs(mean([...a, ...z]) - mean(m)) > 0.6 * meanAbs(rs.map((q) => q[1])); };
/** A funnel: the typical size of a residual in the last third is more than 2.5 times that in the first third (or the reverse). */
const funnelOf = (rs: number[][]): boolean => { const [a, , z] = thirds(rs.map((q) => q[1])); const k = meanAbs(z) / meanAbs(a); return k > 2.5 || k < 0.4; };
/** The labelled point with the largest residual about the least-squares line of all the points. */
const outlierOf = (pts: Array<{ x: number; y: number; label?: string }>): { x: number; y: number; label?: string } => {
  const { m, b } = ls(pts.map((q) => [q.x, q.y]));
  return pts.reduce((best, q) => (Math.abs(q.y - (m * q.x + b)) > Math.abs(best.y - (m * best.x + b)) ? q : best));
};

const table = (columns: unknown[], rows: unknown[][], extra: P = {}): Spec => S('data_table', { columns, rows, ...extra });
const web = (nodes: Array<[string, number, number]>, edges: Array<[string, string]>): Spec =>
  S('flow_diagram', { variant: 'web', nodes: nodes.map(([label, col, row]) => ({ id: label, label, col, row })), edges: edges.map(([from, to]) => ({ from, to })) });
const edgesOf = (c: Ctx): Array<{ from: string; to: string }> => arr(c.p.edges).map((e) => ({ from: e.from as string, to: e.to as string }));
/** The first two steps of a trophic cascade after `gone` is removed: a prey eaten by nothing else rises; what that prey eats falls. */
const cascade = (c: Ctx, gone: string): Record<string, 'up' | 'down' | 'same'> => {
  const es = edgesOf(c);
  const out: Record<string, 'up' | 'down' | 'same'> = {};
  for (const n of arr(c.p.nodes)) out[n.id as string] = 'same';
  for (const prey of es.filter((e) => e.to === gone).map((e) => e.from)) {
    if (es.some((e) => e.from === prey && e.to !== gone)) continue;
    out[prey] = 'up';
    for (const food of es.filter((e) => e.to === prey).map((e) => e.from)) out[food] = 'down';
  }
  return out;
};

// ── AP Statistics · Residuals and residual plots ────────────────────────────

const CONE_A = 12;
const CONE_B = 3;

export const ITEMS: Item[] = [
  ...G('apstats.residuals', 'Residuals read from a scatterplot and from residual plots', [
    {
      t: 'residual of a labelled point from the drawn line', d: 2, need: 'calc',
      spec: sc([[1, 50], [2, 45], [3, 60], [4, 55], [5, 60], [6, 60, 'P'], [7, 80], [8, 85], [9, 80], [10, 95]], { xRange: [0, 11], yRange: [30, 100], xStep: 1, yStep: 10, xLabel: 'Hours of practice', yLabel: 'Test score', trendLine: { slope: 5, intercept: 40 } }),
      alt: 'A scatterplot of test score against hours of practice for ten students, with a straight regression line rising from left to right; one point is labelled P.',
      q: 'The scatterplot shows test score against hours of practice for ten students, with a regression line drawn. What is the residual (actual minus predicted) for the student marked P?',
      n: '-10',
      calc: ['point_coordinate of P (y) − trend_value at P\'s x', (c) => c.num('point_coordinate', { point: 'P', want: 'y' }) - c.num('trend_value', { x: c.num('point_coordinate', { point: 'P', want: 'x' }) })],
      h: ['The predicted value is the height of the line at the point\'s x-value; the actual value is the height of the point itself.', 'Residual = actual − predicted. Mind the sign: a point below the line has a negative residual.'],
      s: 'Read from the figure: point P is at 6 hours of practice and a score of 60, and the line at 6 hours is at a score of 70, so the predicted score is 70. Residual = actual − predicted = 60 − 70 = −10. P lies below the line: the model overpredicted this student\'s score by 10 points.',
    },
    {
      t: 'actual value worked back from a residual plot and the line', d: 3, need: 'calc',
      spec: sc([[10, 2], [12, -4], [14, 6], [16, 0], [18, -2], [20, -6, 'P'], [22, 4], [24, -2], [26, 6], [28, -4], [30, 0]], { xRange: [5, 35], yRange: [-10, 10], xStep: 5, yStep: 2, xLabel: 'Temperature (°C)', yLabel: 'Residual (cones)' }),
      alt: 'A residual plot of residual (cones) against temperature (°C) for eleven days, the points scattered above and below zero with no pattern; one point is labelled P.',
      q: `A shop regresses the number of ice-cream cones sold in a day (y) on the day's temperature in °C (x) and gets ŷ = ${CONE_A} + ${CONE_B}x. The residual plot for the eleven days is shown. How many cones were actually sold on the day marked P?`,
      n: '66',
      calc: [`ŷ = ${CONE_A} + ${CONE_B}x at P's x (point_coordinate x), plus P's residual (point_coordinate y)`, (c) => CONE_A + CONE_B * c.num('point_coordinate', { point: 'P', want: 'x' }) + c.num('point_coordinate', { point: 'P', want: 'y' })],
      h: ['A residual plot keeps the x-value of each day and puts its residual on the vertical axis.', 'Find the predicted value from the equation at that x, then use residual = actual − predicted to recover the actual value.'],
      s: `Read from the figure: point P is at 20 °C with a residual of −6 cones. Predicted: ŷ = ${CONE_A} + ${CONE_B}(20) = 72 cones. Residual = actual − predicted, so actual = predicted + residual = 72 + (−6) = 66 cones.`,
    },
    {
      t: 'diagnose a funnel-shaped residual plot', d: 3, need: 'reason',
      spec: sc([[10, 1], [20, -1], [30, -2], [40, 2], [50, 3], [60, -3], [70, -4], [80, 4], [90, 5], [100, -6], [110, -5], [120, 6]], { xRange: [0, 140], yRange: [-8, 8], xStep: 20, yStep: 2, xLabel: 'Income (thousands of dollars)', yLabel: 'Residual (hundreds of dollars)' }),
      alt: 'A residual plot of residual (hundreds of dollars) against income (thousands of dollars) for twelve households; the points lie above and below zero at different distances from zero across the plot.',
      q: 'A linear regression predicts a household\'s monthly spending on eating out from its income. The residual plot for twelve households is shown. What does it tell you about the linear model?',
      o: [
        ['The residuals spread out as x increases, so the variation about the line is not constant', 'correct'],
        ['The residuals are scattered randomly in a band of even width, so the model has no problems', 'sees points on both sides of zero and calls it random scatter'],
        ['The residuals follow a U-shaped curve, so the relationship between the variables is curved', 'mistakes the alternating signs for a curved pattern'],
        ['Most residuals are negative, so the line overpredicts nearly every household', 'counts the points below zero without checking'],
      ],
      holds: ['residuals of the spec read as plotted: funnel = typical |residual| of the last third vs the first third; curved = outer thirds vs middle third; share negative', [
        (c) => funnelOf(resid(dotsOf(c), true)) && meanAbs(thirds(resid(dotsOf(c), true))[2].map((q) => q[1])) > meanAbs(thirds(resid(dotsOf(c), true))[0].map((q) => q[1])),
        (c) => !funnelOf(resid(dotsOf(c), true)) && !curvedOf(resid(dotsOf(c), true)),
        (c) => curvedOf(resid(dotsOf(c), true)),
        (c) => dotsOf(c).filter((q) => q[1] < 0).length > 0.75 * dotsOf(c).length,
      ]],
      h: ['Look at how far the points sit from the zero line at the left of the plot and at the right.', 'A residual plot can fail in two ways: a curved pattern, or a spread that changes across x.'],
      s: 'Read from the figure: at the lowest incomes the residuals are within about 200 dollars of zero (1, −1, −2, 2 hundred dollars), but at the highest incomes they reach 500–600 dollars (5, −6, −5, 6 hundred dollars). The points sit evenly on both sides of zero with no curve, but the spread grows from left to right — a funnel shape. The constant-variance condition fails: predictions are much less reliable for high incomes, and a transformation may help.',
    },
  ]),

  // ── AP Statistics · Scatterplots (DUFS) ─────────────────────────────────────
  ...G('apstats.scatterplots', 'Describing scatterplots with DUFS', [
    {
      t: 'direction and form of a bending association', d: 2, need: 'reason',
      spec: sc([[1, 24], [2, 21], [2, 19], [3, 17], [4, 13], [5, 11], [5, 10], [6, 8], [7, 8], [8, 6], [9, 5], [10, 5]], { xRange: [0, 11], yRange: [0, 30], xStep: 1, yStep: 5, xLabel: 'Car age (years)', yLabel: 'Resale value (thousands of dollars)' }),
      alt: 'A scatterplot of resale value in thousands of dollars against car age in years for twelve cars.',
      q: 'The scatterplot shown gives resale value against age for twelve used cars of one model. Which describes the DIRECTION and the FORM of the association?',
      o: [
        ['Negative and curved', 'correct'],
        ['Negative and linear', 'reads the direction but not the bend in the points'],
        ['Positive and curved', 'confuses direction with form: sees a curve and calls it positive'],
        ['Positive and linear', 'reads the direction from the y-axis upward instead of following the points'],
      ],
      holds: ['direction = sign of the least-squares slope of the spec\'s points; form = curved when the least-squares residuals of the outer thirds and the middle third differ systematically', (() => {
        const got = (c: Ctx) => ({ dir: ls(dotsOf(c)).m < 0 ? 'neg' : 'pos', form: curvedOf(resid(dotsOf(c))) ? 'curved' : 'linear' });
        return [['neg', 'curved'], ['neg', 'linear'], ['pos', 'curved'], ['pos', 'linear']].map(([d, f]) => (c: Ctx) => got(c).dir === d && got(c).form === f);
      })()],
      h: ['Direction: as x increases, does y tend to rise or fall?', 'Form: do the points follow a straight path, or does the drop get steeper or flatter as you move right?'],
      s: 'Read from the figure: the value falls from about 24 thousand dollars at 1 year to about 5 thousand dollars at 10 years, so the direction is negative. The drop is steep at first (about 3–4 thousand dollars a year) and flattens later (about 1 thousand dollars a year or less), so the points bend: the form is curved. A curve can fall and be nonlinear at the same time.',
    },
    {
      t: 'compare the strength of two groups on one plot', d: 3, need: 'reason',
      spec: sc([
        [12, 30, '', 'Beach kiosk'], [15, 36, '', 'Beach kiosk'], [18, 40, '', 'Beach kiosk'], [20, 46, '', 'Beach kiosk'], [23, 50, '', 'Beach kiosk'], [25, 56, '', 'Beach kiosk'], [28, 60, '', 'Beach kiosk'], [30, 66, '', 'Beach kiosk'],
        [12, 55, '', 'Town café'], [14, 80, '', 'Town café'], [17, 50, '', 'Town café'], [19, 75, '', 'Town café'], [22, 85, '', 'Town café'], [24, 60, '', 'Town café'], [27, 90, '', 'Town café'], [29, 70, '', 'Town café'],
      ], { xRange: [10, 35], yRange: [20, 100], xStep: 5, yStep: 10, xLabel: 'Temperature (°C)', yLabel: 'Cold drinks sold' }),
      alt: 'A scatterplot of cold drinks sold against temperature in °C for eight days at each of two shops, the Beach kiosk and the Town café, drawn with different marker shapes.',
      q: 'The scatterplot shown gives cold drinks sold against the day\'s temperature on eight days at each of two shops. Which statement compares the two associations correctly?',
      o: [
        ['Both are positive; the Beach kiosk\'s association is stronger', 'correct'],
        ['Both are positive; the Town café\'s association is stronger', 'takes the higher sales to mean a stronger association'],
        ['The Beach kiosk\'s is positive and the Town café\'s is negative', 'reads the café\'s zigzag from one point to the next as a fall'],
        ['Both are positive and equally strong', 'judges strength by the number of points (eight each), not how tightly they follow a line'],
      ],
      holds: ['correlation r of each series of the spec: sign = direction, |r| = strength', (() => {
        const r = (c: Ctx, s: string) => ls(ptsOf(c, s).map((q) => [q.x, q.y])).r;
        const k = (c: Ctx) => r(c, 'Beach kiosk'); const t = (c: Ctx) => r(c, 'Town café');
        return [
          (c: Ctx) => k(c) > 0 && t(c) > 0 && Math.abs(k(c)) > Math.abs(t(c)) + 0.2,
          (c: Ctx) => k(c) > 0 && t(c) > 0 && Math.abs(t(c)) > Math.abs(k(c)),
          (c: Ctx) => k(c) > 0 && t(c) < 0,
          (c: Ctx) => k(c) > 0 && t(c) > 0 && near(Math.abs(k(c)), Math.abs(t(c)), 0.05),
        ];
      })()],
      offGridOk: 'the answer rests on the direction and the tightness of each group of points, not on any one value read off the grid',
      h: ['Direction: for each shop, do sales tend to rise or fall as temperature rises?', 'Strength is how tightly a shop\'s points follow a straight line — not how high they sit on the graph.'],
      s: 'Read from the figure: the Beach kiosk\'s points rise steadily from 30 drinks at 12 °C to 66 drinks at 30 °C, almost on a straight line — strong and positive. The Town café\'s points also tend to rise (from about 50–55 at the cool end to 70–90 at the warm end) but jump up and down a lot — weak to moderate and positive. Both are positive; the Beach kiosk\'s association is stronger.',
    },
    {
      t: 'full DUFS description including where the unusual point is', d: 3, need: 'reason',
      spec: sc([[22, 148], [23, 153], [24, 156], [24, 158], [24, 180], [25, 160], [26, 164], [26, 166], [27, 168], [28, 172], [29, 176], [30, 180], [31, 184]], { xRange: [20, 32], yRange: [140, 190], xStep: 2, yStep: 10, xLabel: 'Foot length (cm)', yLabel: 'Height (cm)' }),
      alt: 'A scatterplot of height in centimetres against foot length in centimetres for thirteen adults.',
      q: 'The scatterplot shown gives height against foot length for thirteen adults. Which description of the scatterplot is correct?',
      o: [
        ['Strong, positive and linear, with an outlier at (24, 180)', 'correct'],
        ['Strong, positive and linear, with an outlier at the far upper right', 'takes the point with the largest x for the outlier, though it follows the trend'],
        ['Strong, negative and linear, with an outlier at (24, 180)', 'reads the direction backwards'],
        ['Weak, positive and curved, with no outlier', 'lets one stray point hide how tightly the rest follow a line'],
      ],
      holds: ['direction = sign of the least-squares slope; strength = |r| of the points other than the one with the largest residual; form = the curvature test on the residuals of those points; outlier = the point with the largest residual', (() => {
        const got = (c: Ctx) => {
          const pts = ptsOf(c); const o = outlierOf(pts); const rest = pts.filter((q) => q !== o).map((q) => [q.x, q.y]);
          const right = pts.reduce((a, q) => (q.x > a.x ? q : a));
          return { neg: ls(rest).m < 0, strong: Math.abs(ls(rest).r) > 0.9, curved: curvedOf(resid(rest)), o, right, big: Math.abs(o.y - (ls(rest).m * o.x + ls(rest).b)) > 4 * meanAbs(resid(rest).map((q) => q[1])) };
        };
        return [
          (c: Ctx) => { const g = got(c); return !g.neg && g.strong && !g.curved && g.big && g.o.x === 24 && g.o.y === 180; },
          (c: Ctx) => { const g = got(c); return !g.neg && g.strong && !g.curved && g.o === g.right; },
          (c: Ctx) => { const g = got(c); return g.neg && g.strong && g.o.x === 24 && g.o.y === 180; },
          (c: Ctx) => { const g = got(c); return !g.neg && !g.strong && g.curved && !g.big; },
        ];
      })()],
      offGridOk: 'the only point whose coordinates the answer names, the outlier (24, 180), sits on grid crossings; the rest is direction, form and strength, read from the overall pattern',
      h: ['Describe four things: the direction, any unusual features, the form and the strength.', 'An outlier is a point far from the pattern of the others — far above or below the trend at its x-value, not simply the point furthest to one side.'],
      s: 'Read from the figure: the points rise from (22, 148) to (31, 184) close to a straight line, so the association is positive, linear and strong. One point, at foot length 24 cm and height 180 cm, sits far above the other points with foot length 24 cm (about 156–158 cm): it is an outlier. The point at the far upper right follows the trend and is not unusual.',
    },
  ]),

  // ── AP Statistics · Categorical data ────────────────────────────────────────
  ...G('apstats.categorical-data', 'Bar charts and frequency tables of one categorical variable', [
    {
      t: 'relative frequency of one category from a bar chart of counts', d: 2, need: 'calc',
      spec: S('bar_chart', { categories: ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Running'], values: [30, 50, 20, 25, 25], xLabel: 'Favourite sport', yLabel: 'Number of students', yMin: 0, yMax: 60, yStep: 10 }),
      alt: 'A bar chart of the number of students choosing each of five favourite sports: Soccer, Basketball, Tennis, Swimming and Running.',
      q: 'Every student in a survey chose one favourite sport; the bar chart shows the counts. What is the relative frequency of Soccer? Give a decimal.',
      n: '0.2',
      calc: ['bar_value(Soccer) ÷ bar_sum (all bars)', (c) => round(c.num('bar_value', { category: 'Soccer' }) / c.num('bar_sum', {}), 6)],
      h: ['A relative frequency is a category\'s count divided by the total count.', 'Add the heights of all the bars to get the number of students surveyed.'],
      s: 'Read from the figure: Soccer 30, Basketball 50, Tennis 20, Swimming 25, Running 25. Total = 30 + 50 + 20 + 25 + 25 = 150 students. Relative frequency of Soccer = 30 ÷ 150 = 0.2.',
    },
    {
      t: 'count in a category whose bar is missing from a percentage chart', d: 3, need: 'calc',
      spec: S('bar_chart', { categories: ['Walk', 'Bike', 'Bus', 'Car'], values: [20, null, 40, 30], xLabel: 'Way to school', yLabel: 'Percent of students', yMin: 0, yMax: 50, yStep: 10 }),
      alt: 'A bar chart of the percent of students using each way to school: Walk, Bike, Bus and Car. The Bike bar is left out and a question mark stands in its place.',
      q: 'The bar chart shows the relative frequency distribution (in percent) of how 400 students get to school; every student chose exactly one way. The bar for Bike is missing. How many of the 400 students bike to school?',
      n: '40',
      calc: ['bar_missing(Bike, total 100) % of 400', (c) => round((c.num('bar_missing', { category: 'Bike', total: 100 }) / 100) * 400, 6)],
      h: ['The percents of all the categories of a relative frequency distribution add to 100%.', 'Find the missing percent first, then take that percent of the number of students.'],
      s: 'Read from the figure: Walk 20%, Bus 40%, Car 30%. The four percents add to 100%, so Bike = 100 − (20 + 40 + 30) = 10%. Number who bike = 10% of 400 = 0.10 × 400 = 40 students.',
    },
    {
      t: 'the false statement about a frequency table', d: 3, need: 'reason',
      spec: table(['Eye colour', 'Number of students'], [['Brown', 90], ['Blue', 60], ['Green', 20], ['Hazel', 30], ['Total', 200]], { rowHeaders: true, totalsRow: true }),
      alt: 'A frequency table of eye colour for a group of students, with a row for each of Brown, Blue, Green and Hazel and a total row.',
      q: 'The frequency table shows the eye colours of a group of students. Which statement is FALSE?',
      o: [
        ['The Brown slice of a pie chart would be over half the circle', 'correct'],
        ['Green eyes make up 10% of the students', 'divides by the number of categories instead of the total'],
        ['Blue and Hazel together make up 45% of the students', 'adds counts but forgets to divide by the total'],
        ['Brown is the most common eye colour in the group', 'compares the wrong rows'],
      ],
      holds: falseOne('each statement tested on the cells of the spec (table_cell, and table_total of the column for the total)', [
        (c) => c.num('table_cell', { row: 'Brown', column: 'Number of students' }) / c.num('table_cell', { row: 'Total', column: 'Number of students' }) > 0.5,
        (c) => near(c.num('table_cell', { row: 'Green', column: 'Number of students' }) / c.num('table_cell', { row: 'Total', column: 'Number of students' }), 0.1),
        (c) => near((c.num('table_cell', { row: 'Blue', column: 'Number of students' }) + c.num('table_cell', { row: 'Hazel', column: 'Number of students' })) / c.num('table_cell', { row: 'Total', column: 'Number of students' }), 0.45),
        (c) => c.txt('table_extreme', { column: 'Number of students', which: 'largest' }) === 'Brown',
      ]),
      h: ['Turn each count into a proportion of the total before judging a statement about percents or pie slices.', 'A pie slice is more than half the circle only when its category is more than 50% of the total.'],
      s: 'Read from the figure: Brown 90, Blue 60, Green 20, Hazel 30, total 200. Green = 20 ÷ 200 = 10% (true). Blue + Hazel = 90 ÷ 200 = 45% (true). Brown, at 90, is the largest count (true). But Brown is 90 ÷ 200 = 45% of the group, less than half, so its pie slice would be less than half the circle: that statement is false.',
    },
  ]),

  // ── AP Statistics · Two categorical variables ───────────────────────────────
  ...G('apstats.two-categorical-relationships', 'Conditional distributions and association', [
    {
      t: 'conditional proportion within a row of a two-way table', d: 2, need: 'calc',
      spec: table(['', 'Good sleep', 'Poor sleep', 'Total'], [['Uses phone', 30, 90, 120], ['No phone', 60, 20, 80], ['Total', 90, 110, 200]], { rowHeaders: true, totalsRow: true, totalsColumn: true, title: 'Phone use at bedtime and sleep quality' }),
      alt: 'A two-way table of 200 students classified by phone use at bedtime (Uses phone, No phone) and sleep quality (Good sleep, Poor sleep), with row and column totals.',
      q: 'The two-way table classifies 200 students by phone use at bedtime and sleep quality. Among the students who use a phone at bedtime, what proportion report poor sleep? Give a decimal.',
      n: '0.75',
      ck: ['table_relative_frequency', { column: 'Poor sleep', givenRow: 'Uses phone' }],
      h: ['"Among the students who use a phone" fixes one row: work inside that row only.', 'Divide the count in the cell you want by that row\'s total, not by the grand total.'],
      s: 'Read from the figure: the Uses phone row has 30 Good sleep, 90 Poor sleep, total 120. The conditional proportion of poor sleep given phone use = 90 ÷ 120 = 0.75. (For comparison, among students with no phone it is 20 ÷ 80 = 0.25 — the conditional distributions differ, so the variables are associated.)',
    },
    {
      t: 'association judged from a grouped bar chart of counts for unequal groups', d: 3, need: 'reason',
      spec: S('bar_chart', { categories: ['Under 30', '30 and over'], series: [{ label: 'Voted', values: [60, 120] }, { label: 'Did not vote', values: [40, 180] }], xLabel: 'Age group', yLabel: 'Number of people', yMin: 0, yMax: 200, yStep: 20 }),
      alt: 'A grouped bar chart of the number of people who voted and who did not vote, in each of two age groups, with a legend for the two bar styles.',
      q: 'A survey asked people in two age groups — the younger group (Under 30) and the older group (30 and over) — whether they voted in an election; the grouped bar chart shows the counts. Which conclusion is correct?',
      o: [
        ['The younger group voted at the higher rate; age and voting are associated', 'correct'],
        ['The older group voted at the higher rate; age and voting are associated', 'compares raw counts of voters across groups of different sizes'],
        ['The younger group voted at the higher rate; age and voting are not associated', 'thinks unequal group sizes rule out an association'],
        ['The two age groups voted at the same rate; there is no association', 'checks only that both groups hold voters and non-voters'],
      ],
      holds: ['voting rate of each age group = bar_value(Voted) ÷ (Voted + Did not vote); associated when the rates differ', (() => {
        const rate = (c: Ctx, g: string) => { const v = c.num('bar_value', { category: g, series: 'Voted' }); return v / (v + c.num('bar_value', { category: g, series: 'Did not vote' })); };
        const assoc = (c: Ctx) => Math.abs(rate(c, 'Under 30') - rate(c, '30 and over')) > 0.05;
        return [
          (c: Ctx) => rate(c, 'Under 30') > rate(c, '30 and over') && assoc(c),
          (c: Ctx) => rate(c, '30 and over') > rate(c, 'Under 30') && assoc(c),
          (c: Ctx) => rate(c, 'Under 30') > rate(c, '30 and over') && !assoc(c),
          (c: Ctx) => near(rate(c, 'Under 30'), rate(c, '30 and over')),
        ];
      })()],
      h: ['The groups are different sizes, so compare proportions, not counts.', 'For each age group, divide the number who voted by the size of that group.'],
      s: 'Read from the figure: Under 30 — 60 voted, 40 did not (100 people); 30 and over — 120 voted, 180 did not (300 people). Voting rates: 60 ÷ 100 = 60% for Under 30 and 120 ÷ 300 = 40% for 30 and over. The conditional distributions differ, so age group and voting are associated, with the younger group voting at the higher rate — even though more people aged 30 and over voted in total.',
    },
    {
      t: 'conditional proportion within a column after finding a missing cell', d: 3, need: 'calc',
      spec: table(['', 'Bus', 'Car', 'Walk', 'Total'], [['Grade 9', 30, 40, '?', 80], ['Grade 12', 25, 45, 30, 100], ['Total', 55, 85, 40, 180]], { rowHeaders: true, totalsRow: true, totalsColumn: true, title: 'Way to school by grade' }),
      alt: 'A two-way table of 180 students classified by grade (Grade 9, Grade 12) and way to school (Bus, Car, Walk), with row and column totals; the cell for Grade 9 students who walk is a question mark.',
      q: 'The two-way table classifies students by grade and the way they get to school; one cell is missing. Among the students who walk, what proportion are in Grade 9? Give a decimal.',
      n: '0.25',
      calc: ['table_missing_cell (Grade 9, Walk) ÷ table_cell (Total, Walk)', (c) => round(c.num('table_missing_cell', { row: 'Grade 9', column: 'Walk' }) / c.num('table_cell', { row: 'Total', column: 'Walk' }), 6)],
      h: ['Use a printed total to find the missing count first.', '"Among the students who walk" fixes one column: divide by that column\'s total.'],
      s: 'Read from the figure: Grade 9 has 30 Bus and 40 Car out of a row total of 80, so 80 − 30 − 40 = 10 Grade 9 students walk (check: the Walk column total is 40 and Grade 12 has 30, so 40 − 30 = 10). Among the 40 students who walk, the proportion in Grade 9 = 10 ÷ 40 = 0.25.',
    },
  ]),

  // ── APES · Food chains and food webs ────────────────────────────────────────
  ...G('apenvsci.food-webs', 'Chains, keystone removal and biomagnification', [
    {
      t: 'count the food chains in a web', d: 2, need: 'calc',
      spec: web([['Hawk', 1, 0], ['Fox', 3, 0], ['Snake', 0, 1], ['Frog', 0, 2], ['Cricket', 0, 3], ['Mouse', 1, 3], ['Rabbit', 3, 3], ['Grass', 1, 4]],
        [['Grass', 'Cricket'], ['Grass', 'Mouse'], ['Grass', 'Rabbit'], ['Cricket', 'Frog'], ['Frog', 'Snake'], ['Mouse', 'Snake'], ['Mouse', 'Fox'], ['Rabbit', 'Fox'], ['Snake', 'Hawk'], ['Rabbit', 'Hawk']]),
      alt: 'A food web of eight organisms joined by arrows that point from the organism eaten to the organism that eats it, with grass at the bottom and hawk and fox at the top.',
      q: 'A food web is made of interconnected food chains. How many different food chains, each running from grass to an organism that nothing in the web eats, does the food web shown contain?',
      n: '5',
      ck: ['flow_chain_count', {}],
      h: ['An arrow points from the organism that is eaten to the organism that eats it.', 'Start at grass and follow every branch of arrows until you reach an organism with no arrow leaving it; count each complete path once.'],
      s: 'Read from the figure: grass is eaten by the cricket, the mouse and the rabbit. The chains are: grass → cricket → frog → snake → hawk; grass → mouse → snake → hawk; grass → mouse → fox; grass → rabbit → fox; grass → rabbit → hawk. That is 5 food chains.',
    },
    {
      t: 'predict the cascade when a predator is removed', d: 3, need: 'reason',
      spec: web([['Wolf', 1, 0], ['Fox', 3, 0], ['Elk', 1, 2], ['Rabbit', 3, 2], ['Willow', 0, 4], ['Grass', 2, 4]],
        [['Willow', 'Elk'], ['Grass', 'Elk'], ['Grass', 'Rabbit'], ['Elk', 'Wolf'], ['Rabbit', 'Fox']]),
      alt: 'A food web of six organisms — wolf, fox, elk, rabbit, willow and grass — joined by arrows that point from the organism eaten to the organism that eats it.',
      q: 'In the food web shown, wolves act as a keystone species. If the wolves are removed, which change is most likely as the effect cascades down the web?',
      o: [
        ['Elk increase and willow declines', 'correct'],
        ['Elk decline and willow increases', 'reads the arrow from elk to wolf backwards, as if elk ate wolves'],
        ['Elk increase and willow increases too', 'thinks removing a predator helps every species below it'],
        ['Rabbits increase and grass declines', 'misreads the arrows: no arrow joins rabbit and wolf'],
      ],
      holds: ['two-step cascade on the spec\'s edges after removing Wolf (a prey eaten by nothing else rises; its food falls)', [
        (c) => cascade(c, 'Wolf').Elk === 'up' && cascade(c, 'Wolf').Willow === 'down',
        (c) => cascade(c, 'Wolf').Elk === 'down' && cascade(c, 'Wolf').Willow === 'up',
        (c) => cascade(c, 'Wolf').Elk === 'up' && cascade(c, 'Wolf').Willow === 'up',
        (c) => cascade(c, 'Wolf').Rabbit === 'up' && cascade(c, 'Wolf').Grass === 'down',
      ]],
      h: ['Find what the wolf eats by the arrows that point INTO the wolf box.', 'Ask what happens to that prey without its predator, and then to what that prey eats.'],
      s: 'Read from the figure: the only arrow into Wolf comes from Elk, and nothing else eats elk. Without wolves, elk numbers rise. Elk eat willow and grass (arrows from Willow and Grass to Elk), so more elk graze more heavily and willow declines — a trophic cascade. No arrow joins rabbit and wolf: rabbits are eaten by foxes only.',
    },
    {
      t: 'concentration at the top predator from a constant magnification factor', d: 3, need: 'calc',
      spec: S('bar_chart', { categories: ['Zooplankton', 'Small fish', 'Large fish', 'Osprey'], values: [4, 12, 36, null], xLabel: 'Organism (food chain order)', yLabel: 'Pesticide (ppm)', yMin: 0, yMax: 120, yStep: 20, showValues: true }),
      alt: 'A bar chart of pesticide concentration in parts per million in four organisms of a lake food chain, from zooplankton to osprey, with each value printed on its bar; the Osprey bar is left out and a question mark stands in its place.',
      q: 'A pesticide biomagnifies along the lake food chain zooplankton → small fish → large fish → osprey, increasing by the same factor at each step. The bar for the osprey is missing. What is the pesticide concentration in the osprey, in ppm?',
      n: '108',
      calc: ['factor = bar_ratio(Small fish, Zooplankton) (checked equal to bar_ratio(Large fish, Small fish)); osprey = bar_value(Large fish) × factor', (c) => {
        const k = c.num('bar_ratio', { a: 'Small fish', b: 'Zooplankton' });
        if (!near(k, c.num('bar_ratio', { a: 'Large fish', b: 'Small fish' }))) throw new Error('the factor is not constant');
        return round(c.num('bar_value', { category: 'Large fish' }) * k, 6);
      }],
      h: ['Divide each concentration by the one before it in the chain to find the factor per step.', 'Apply the same factor once more to go from the large fish to the osprey.'],
      s: 'Read from the figure: zooplankton 4 ppm, small fish 12 ppm, large fish 36 ppm. Factor per step: 12 ÷ 4 = 3 and 36 ÷ 12 = 3. Osprey = 36 × 3 = 108 ppm — 27 times the zooplankton level, because each predator eats many prey and stores the fat-soluble pesticide from all of them.',
    },
  ]),
];
