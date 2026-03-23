/**
 * Conic Section Validator
 *
 * Deterministic (code-based) validator for conic section graphs.
 * Computes correct focus, directrix, and vertex values using formulas,
 * then fixes the graph data if the AI got them wrong.
 *
 * This is MORE RELIABLE than LLM-based validation because it uses
 * exact math formulas rather than asking another AI to check.
 */

interface GraphFunction {
  latex?: string;
  fn?: string;
  color?: string;
  label?: string;
  domain?: [number, number];
}

interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface GraphData {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  xRange: [number, number];
  yRange: [number, number];
  functions?: GraphFunction[];
  functionsOfY?: GraphFunction[];
  points?: GraphPoint[];
  [key: string]: unknown;
}

/**
 * Detect if a graph contains a conic section and validate/fix its elements.
 */
export function validateConicGraph(data: GraphData): GraphData {
  const allFunctions = [...(data.functions || []), ...(data.functionsOfY || [])];
  const allLabels = allFunctions.map(f => (f.label || f.latex || '').toLowerCase()).join(' ');
  const title = (data.title || '').toLowerCase();
  const combined = title + ' ' + allLabels;

  // Detect conic type from title and function labels
  if (combined.includes('parabola')) {
    return validateParabola(data, combined);
  }
  if (combined.includes('ellipse')) {
    return validateEllipse(data, combined);
  }
  if (combined.includes('hyperbola')) {
    return validateHyperbola(data, combined);
  }

  return data;
}

/**
 * Extract a²,b² from an equation like x²/16 + y²/25 = 1
 */
function extractABSquared(combined: string): { a2: number; b2: number; orientation: 'horizontal' | 'vertical' } | null {
  // Try patterns like x²/16 + y²/25, x^2/4 + y^2/9, etc.
  const patterns = [
    /x[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*[+\-]\s*y[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/,
    /\\frac\{x\^2\}\{(\d+(?:\.\d+)?)\}.*\\frac\{y\^2\}\{(\d+(?:\.\d+)?)\}/,
  ];

  for (const pattern of patterns) {
    const match = combined.match(pattern);
    if (match) {
      const a2 = parseFloat(match[1]);
      const b2 = parseFloat(match[2]);
      // For ellipse: major axis is on the axis with the larger denominator
      const orientation = b2 > a2 ? 'vertical' : 'horizontal';
      return { a2, b2, orientation };
    }
  }

  return null;
}

function validateParabola(data: GraphData, combined: string): GraphData {
  const result = { ...data };

  // Detect parabola form: y² = 4px or y = x²
  let p: number | null = null;
  let form: 'horizontal' | 'vertical' = 'horizontal';

  // y² = 4px → horizontal parabola
  const hMatch = combined.match(/y[²^2]*\s*=\s*(\d+(?:\.\d+)?)x/);
  if (hMatch) {
    const coeff = parseFloat(hMatch[1]);
    p = coeff / 4;
    form = 'horizontal';
  }

  // y = x² → vertical parabola (p = 1/4)
  if (!p && (combined.includes('y = x²') || combined.includes('y=x^2') || combined.includes('y = x^2'))) {
    p = 0.25;
    form = 'vertical';
  }

  if (!p) return data;

  // Ensure focus and directrix are present and correct
  const points = [...(data.points || [])];
  const functions = [...(data.functions || [])];
  const functionsOfY = [...(data.functionsOfY || [])];

  if (form === 'horizontal') {
    // Focus at (p, 0), directrix at x = -p
    ensurePoint(points, p, 0, `Focus (${round(p)}, 0)`, '#dc2626');
    ensurePoint(points, 0, 0, 'Vertex (0, 0)', '#16a34a');

    // Directrix: vertical line at x = -p → goes in functionsOfY
    removeByLabel(functions, 'directrix');
    removeByLabel(functionsOfY, 'directrix');
    functionsOfY.push({
      latex: String(-p),
      color: '#dc2626',
      label: `Directrix x = ${round(-p)}`,
    });

    // Ensure viewport shows directrix
    if (result.xRange[0] > -p - 1) result.xRange = [-p - 2, result.xRange[1]];
  } else {
    // Focus at (0, p), directrix at y = -p
    ensurePoint(points, 0, p, `Focus (0, ${round(p)})`, '#dc2626');
    ensurePoint(points, 0, 0, 'Vertex (0, 0)', '#16a34a');

    // Directrix: horizontal line at y = -p → goes in functions
    removeByLabel(functions, 'directrix');
    removeByLabel(functionsOfY, 'directrix');
    functions.push({
      latex: String(-p),
      color: '#dc2626',
      label: `Directrix y = ${round(-p)}`,
    });

    if (result.yRange[0] > -p - 1) result.yRange = [-p - 2, result.yRange[1]];
  }

  result.points = points;
  result.functions = functions;
  result.functionsOfY = functionsOfY;
  return result;
}

function validateEllipse(data: GraphData, combined: string): GraphData {
  const result = { ...data };
  const ab = extractABSquared(combined);
  if (!ab) return data;

  const { a2, b2, orientation } = ab;
  const a = Math.sqrt(a2);
  const b = Math.sqrt(b2);

  // c² = |a² - b²| for ellipse (c² = larger² - smaller²)
  const larger2 = Math.max(a2, b2);
  const smaller2 = Math.min(a2, b2);
  const c = Math.sqrt(larger2 - smaller2);

  const points = [...(data.points || [])];
  const functions = [...(data.functions || [])];
  const functionsOfY = [...(data.functionsOfY || [])];

  // Remove any existing directrix/focus entries that might be wrong
  removeByLabel(functions, 'directrix');
  removeByLabel(functionsOfY, 'directrix');

  if (orientation === 'vertical') {
    // Major axis is y-axis: foci at (0, ±c), directrices at y = ±b²/c
    ensurePoint(points, 0, 0, 'Center (0, 0)', '#16a34a');
    ensurePoint(points, 0, c, `Focus (0, ${round(c)})`, '#dc2626');
    ensurePoint(points, 0, -c, `Focus (0, ${round(-c)})`, '#dc2626');

    // Directrices: HORIZONTAL lines at y = ±b²/c → goes in functions
    const directrixY = b2 / c;
    functions.push({
      latex: String(round(directrixY)),
      color: '#dc2626',
      label: `Directrix y = ${round(directrixY)}`,
    });
    functions.push({
      latex: String(round(-directrixY)),
      color: '#dc2626',
      label: `Directrix y = ${round(-directrixY)}`,
    });

    // Ensure viewport shows directrices
    if (result.yRange[1] < directrixY + 1) result.yRange = [result.yRange[0], directrixY + 2];
    if (result.yRange[0] > -directrixY - 1) result.yRange = [-directrixY - 2, result.yRange[1]];
  } else {
    // Major axis is x-axis: foci at (±c, 0), directrices at x = ±a²/c
    ensurePoint(points, 0, 0, 'Center (0, 0)', '#16a34a');
    ensurePoint(points, c, 0, `Focus (${round(c)}, 0)`, '#dc2626');
    ensurePoint(points, -c, 0, `Focus (${round(-c)}, 0)`, '#dc2626');

    // Directrices: VERTICAL lines at x = ±a²/c → goes in functionsOfY
    const directrixX = a2 / c;
    functionsOfY.push({
      latex: String(round(directrixX)),
      color: '#dc2626',
      label: `Directrix x = ${round(directrixX)}`,
    });
    functionsOfY.push({
      latex: String(round(-directrixX)),
      color: '#dc2626',
      label: `Directrix x = ${round(-directrixX)}`,
    });

    if (result.xRange[1] < directrixX + 1) result.xRange = [result.xRange[0], directrixX + 2];
    if (result.xRange[0] > -directrixX - 1) result.xRange = [-directrixX - 2, result.xRange[1]];
  }

  result.points = points;
  result.functions = functions;
  result.functionsOfY = functionsOfY;
  return result;
}

function validateHyperbola(data: GraphData, combined: string): GraphData {
  const result = { ...data };

  // x²/a² - y²/b² = 1 (horizontal) or y²/b² - x²/a² = 1 (vertical)
  const hMatch = combined.match(/x[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*-\s*y[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/);
  const vMatch = combined.match(/y[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*-\s*x[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/);

  if (!hMatch && !vMatch) return data;

  const isHorizontal = !!hMatch;
  const match = hMatch || vMatch;
  if (!match) return data;

  const denom1 = parseFloat(match[1]); // a² for horizontal, b² for vertical
  const denom2 = parseFloat(match[2]); // b² for horizontal, a² for vertical

  const a2 = isHorizontal ? denom1 : denom2;
  const b2 = isHorizontal ? denom2 : denom1;
  const a = Math.sqrt(a2);
  const c = Math.sqrt(a2 + b2); // c² = a² + b² for hyperbola

  const points = [...(data.points || [])];
  const functions = [...(data.functions || [])];
  const functionsOfY = [...(data.functionsOfY || [])];

  removeByLabel(functions, 'directrix');
  removeByLabel(functionsOfY, 'directrix');

  // Directrix = ±a²/c
  const directrixVal = a2 / c;

  if (isHorizontal) {
    // Foci at (±c, 0), directrices at x = ±a²/c (vertical lines)
    ensurePoint(points, 0, 0, 'Center (0, 0)', '#16a34a');
    ensurePoint(points, c, 0, `Focus (${round(c)}, 0)`, '#dc2626');
    ensurePoint(points, -c, 0, `Focus (${round(-c)}, 0)`, '#dc2626');

    functionsOfY.push({
      latex: String(round(directrixVal)),
      color: '#dc2626',
      label: `Directrix x = ${round(directrixVal)}`,
    });
    functionsOfY.push({
      latex: String(round(-directrixVal)),
      color: '#dc2626',
      label: `Directrix x = ${round(-directrixVal)}`,
    });

    if (result.xRange[1] < c + 2) result.xRange = [-(c + 2), c + 2];
  } else {
    // Foci at (0, ±c), directrices at y = ±b²/c (horizontal lines)
    const b = Math.sqrt(b2);
    ensurePoint(points, 0, 0, 'Center (0, 0)', '#16a34a');
    ensurePoint(points, 0, c, `Focus (0, ${round(c)})`, '#dc2626');
    ensurePoint(points, 0, -c, `Focus (0, ${round(-c)})`, '#dc2626');

    const dirY = b2 / c;
    functions.push({
      latex: String(round(dirY)),
      color: '#dc2626',
      label: `Directrix y = ${round(dirY)}`,
    });
    functions.push({
      latex: String(round(-dirY)),
      color: '#dc2626',
      label: `Directrix y = ${round(-dirY)}`,
    });

    if (result.yRange[1] < c + 2) result.yRange = [-(c + 2), c + 2];
  }

  result.points = points;
  result.functions = functions;
  result.functionsOfY = functionsOfY;
  return result;
}

// ── Helpers ──

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function ensurePoint(points: GraphPoint[], x: number, y: number, label: string, color: string): void {
  // Remove any existing point close to this position
  const threshold = 0.5;
  for (let i = points.length - 1; i >= 0; i--) {
    if (Math.abs(points[i].x - x) < threshold && Math.abs(points[i].y - y) < threshold) {
      points.splice(i, 1);
    }
  }
  points.push({ x: round(x), y: round(y), label, color });
}

function removeByLabel(fns: GraphFunction[], keyword: string): void {
  const lower = keyword.toLowerCase();
  for (let i = fns.length - 1; i >= 0; i--) {
    if ((fns[i].label || '').toLowerCase().includes(lower)) {
      fns.splice(i, 1);
    }
  }
}
