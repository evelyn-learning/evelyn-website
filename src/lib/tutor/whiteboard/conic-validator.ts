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
 * Extract a²,b² from an equation like x²/16 + y²/25 = 1.
 * Also extracts shifted-center (h, k) when the form is
 * (x-h)²/a² + (y-k)²/b² = 1. h/k default to 0 if absent.
 */
function extractABSquared(combined: string): { a2: number; b2: number; orientation: 'horizontal' | 'vertical'; h: number; k: number } | null {
  // Centred-at-origin patterns first.
  const originPatterns = [
    /x[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*[+\-]\s*y[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/,
    /\\frac\{x\^2\}\{(\d+(?:\.\d+)?)\}.*\\frac\{y\^2\}\{(\d+(?:\.\d+)?)\}/,
  ];
  for (const pattern of originPatterns) {
    const match = combined.match(pattern);
    if (match) {
      const a2 = parseFloat(match[1]);
      const b2 = parseFloat(match[2]);
      const orientation = b2 > a2 ? 'vertical' : 'horizontal';
      return { a2, b2, orientation, h: 0, k: 0 };
    }
  }
  // Shifted-centre pattern: (x-h)²/a² + (y-k)²/b² = 1 (or − for hyperbola).
  // Capture h and k. Tolerates +/- sign before h/k and missing parens.
  const shifted = combined.match(
    /\(\s*x\s*([+\-])\s*(\d+(?:\.\d+)?)\s*\)\s*[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*[+\-]\s*\(\s*y\s*([+\-])\s*(\d+(?:\.\d+)?)\s*\)\s*[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/,
  );
  if (shifted) {
    // (x ± hVal) means h = ∓hVal: (x - h) → h = +hVal; (x + h) → h = -hVal.
    const hSign = shifted[1] === '-' ? 1 : -1;
    const h = hSign * parseFloat(shifted[2]);
    const a2 = parseFloat(shifted[3]);
    const kSign = shifted[4] === '-' ? 1 : -1;
    const k = kSign * parseFloat(shifted[5]);
    const b2 = parseFloat(shifted[6]);
    const orientation = b2 > a2 ? 'vertical' : 'horizontal';
    return { a2, b2, orientation, h, k };
  }
  return null;
}

function validateParabola(data: GraphData, combined: string): GraphData {
  const result = { ...data };

  // ────────────────────────────────────────────────────────────────
  // Gate 1 — only auto-correct if the brain ALREADY signaled intent
  // to show focus or directrix. The 2026-05-01 SAT-math session
  // (Tutor_Session_sat_math_calc_2026-05-01) drew y = x² - 4x + 3
  // to teach roots & vertex. Nobody asked for the directrix; the
  // validator pattern-matched "y = x²" as a substring and auto-
  // injected "Directrix y = -0.25" (using vertex (0,0) — wrong,
  // the real vertex is (2, -1) so the real directrix is y = -1.25).
  // Strict opt-in: validate ONLY when a directrix or focus label is
  // already present in the input data.
  const inputLabels = [
    ...(data.functions || []),
    ...(data.functionsOfY || []),
    ...(data.points || []),
  ].map((it) => (it.label || (it as { latex?: string }).latex || '')).join(' ').toLowerCase();
  const brainAskedForFocusOrDirectrix =
    inputLabels.includes('directrix') || inputLabels.includes('focus');
  if (!brainAskedForFocusOrDirectrix) return data;

  // Detect parabola form. Two recognised forms:
  //   y² = 4px          (horizontal, vertex at origin)
  //   y = ax² + bx + c  (vertical, vertex at (h, k) with h = -b/2a)
  let p: number | null = null;
  let h = 0;
  let k = 0;
  let form: 'horizontal' | 'vertical' = 'horizontal';

  // y² = 4px → horizontal parabola, vertex at origin.
  const hMatch = combined.match(/y[²^2]*\s*=\s*(\d+(?:\.\d+)?)x(?!\d)/);
  if (hMatch) {
    const coeff = parseFloat(hMatch[1]);
    p = coeff / 4;
    form = 'horizontal';
  }

  // y = ax² + bx + c → vertical parabola. Tolerate a==1 (omitted) or
  // any positive coefficient. Captures b and c so we can shift the
  // vertex correctly. Without this, "y = x² - 4x + 3" was treated as
  // the canonical y = x² with vertex (0, 0).
  if (!p) {
    // REQUIRE the squared form (² or ^2) — without it, plain
    // y = ax was being misidentified as a parabola.
    const vMatch = combined.match(
      /y\s*=\s*(-?\d*(?:\.\d+)?)\s*x(?:²|\^2)\s*([+\-]\s*\d+(?:\.\d+)?\s*)?x?\s*([+\-]\s*\d+(?:\.\d+)?)?/i,
    );
    if (vMatch) {
      const aRaw = vMatch[1];
      const a = aRaw === '' || aRaw === '-' ? (aRaw === '-' ? -1 : 1) : parseFloat(aRaw);
      const bRaw = vMatch[2];
      const b = bRaw ? parseFloat(bRaw.replace(/\s+/g, '')) : 0;
      const cRaw = vMatch[3];
      const c = cRaw ? parseFloat(cRaw.replace(/\s+/g, '')) : 0;
      if (Number.isFinite(a) && a !== 0) {
        h = -b / (2 * a);
        k = c - (b * b) / (4 * a);
        p = 1 / (4 * a);
        form = 'vertical';
      }
    }
  }

  if (p === null) return data;

  // Ensure focus and directrix are present and correct
  const points = [...(data.points || [])];
  const functions = [...(data.functions || [])];
  const functionsOfY = [...(data.functionsOfY || [])];

  if (form === 'horizontal') {
    // Focus at (p, 0), directrix at x = -p (vertex at origin only)
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
    // Vertical parabola y = a(x-h)² + k. Focus at (h, k+p),
    // directrix at y = k - p.
    const focusY = k + p;
    const directrixY = k - p;
    ensurePoint(points, h, focusY, `Focus (${round(h)}, ${round(focusY)})`, '#dc2626');
    ensurePoint(points, h, k, `Vertex (${round(h)}, ${round(k)})`, '#16a34a');

    removeByLabel(functions, 'directrix');
    removeByLabel(functionsOfY, 'directrix');
    functions.push({
      latex: String(directrixY),
      color: '#dc2626',
      label: `Directrix y = ${round(directrixY)}`,
    });

    if (result.yRange[0] > directrixY - 1) result.yRange = [directrixY - 2, result.yRange[1]];
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

  // Opt-in gate (matches the parabola validator): only auto-correct
  // when the brain ALREADY signaled intent to render foci/directrices.
  // Otherwise we'd inject geometric content into a graph that was
  // meant to teach only the ellipse's shape.
  const inputLabels = [
    ...(data.functions || []),
    ...(data.functionsOfY || []),
    ...(data.points || []),
  ].map((it) => (it.label || (it as { latex?: string }).latex || '')).join(' ').toLowerCase();
  const wantsFociDirectrix =
    inputLabels.includes('directrix') || inputLabels.includes('focus');
  if (!wantsFociDirectrix) return data;

  const { a2, b2, orientation, h, k } = ab;

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
    // Major axis is vertical: foci at (h, k ± c), directrices at y = k ± b²/c
    ensurePoint(points, h, k, `Center (${round(h)}, ${round(k)})`, '#16a34a');
    ensurePoint(points, h, k + c, `Focus (${round(h)}, ${round(k + c)})`, '#dc2626');
    ensurePoint(points, h, k - c, `Focus (${round(h)}, ${round(k - c)})`, '#dc2626');

    // Directrices only when c > 0 (i.e. not a circle a² = b²).
    // Without this guard, b²/0 = ∞ and we'd render Infinity-labelled lines.
    if (c > 1e-9) {
      const offset = b2 / c;
      const dirYHigh = k + offset;
      const dirYLow = k - offset;
      functions.push({
        latex: String(round(dirYHigh)),
        color: '#dc2626',
        label: `Directrix y = ${round(dirYHigh)}`,
      });
      functions.push({
        latex: String(round(dirYLow)),
        color: '#dc2626',
        label: `Directrix y = ${round(dirYLow)}`,
      });
      // Ensure viewport shows directrices
      if (result.yRange[1] < dirYHigh + 1) result.yRange = [result.yRange[0], dirYHigh + 2];
      if (result.yRange[0] > dirYLow - 1) result.yRange = [dirYLow - 2, result.yRange[1]];
    }
  } else {
    // Major axis is horizontal: foci at (h ± c, k), directrices at x = h ± a²/c
    ensurePoint(points, h, k, `Center (${round(h)}, ${round(k)})`, '#16a34a');
    ensurePoint(points, h + c, k, `Focus (${round(h + c)}, ${round(k)})`, '#dc2626');
    ensurePoint(points, h - c, k, `Focus (${round(h - c)}, ${round(k)})`, '#dc2626');

    if (c > 1e-9) {
      const offset = a2 / c;
      const dirXHigh = h + offset;
      const dirXLow = h - offset;
      functionsOfY.push({
        latex: String(round(dirXHigh)),
        color: '#dc2626',
        label: `Directrix x = ${round(dirXHigh)}`,
      });
      functionsOfY.push({
        latex: String(round(dirXLow)),
        color: '#dc2626',
        label: `Directrix x = ${round(dirXLow)}`,
      });
      if (result.xRange[1] < dirXHigh + 1) result.xRange = [result.xRange[0], dirXHigh + 2];
      if (result.xRange[0] > dirXLow - 1) result.xRange = [dirXLow - 2, result.xRange[1]];
    }
  }

  result.points = points;
  result.functions = functions;
  result.functionsOfY = functionsOfY;
  return result;
}

function validateHyperbola(data: GraphData, combined: string): GraphData {
  const result = { ...data };

  // Opt-in gate. Same reasoning as the parabola/ellipse validators.
  const inputLabels = [
    ...(data.functions || []),
    ...(data.functionsOfY || []),
    ...(data.points || []),
  ].map((it) => (it.label || (it as { latex?: string }).latex || '')).join(' ').toLowerCase();
  const wantsFociDirectrix =
    inputLabels.includes('directrix') || inputLabels.includes('focus');
  if (!wantsFociDirectrix) return data;

  // Try shifted-centre form first: (x-h)²/a² − (y-k)²/b² = 1, etc.
  let h = 0;
  let k = 0;
  let a2: number | null = null;
  let b2: number | null = null;
  let isHorizontal = true;

  const shiftedH = combined.match(
    /\(\s*x\s*([+\-])\s*(\d+(?:\.\d+)?)\s*\)\s*[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*-\s*\(\s*y\s*([+\-])\s*(\d+(?:\.\d+)?)\s*\)\s*[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/,
  );
  const shiftedV = combined.match(
    /\(\s*y\s*([+\-])\s*(\d+(?:\.\d+)?)\s*\)\s*[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*-\s*\(\s*x\s*([+\-])\s*(\d+(?:\.\d+)?)\s*\)\s*[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/,
  );
  if (shiftedH) {
    h = (shiftedH[1] === '-' ? 1 : -1) * parseFloat(shiftedH[2]);
    a2 = parseFloat(shiftedH[3]);
    k = (shiftedH[4] === '-' ? 1 : -1) * parseFloat(shiftedH[5]);
    b2 = parseFloat(shiftedH[6]);
    isHorizontal = true;
  } else if (shiftedV) {
    k = (shiftedV[1] === '-' ? 1 : -1) * parseFloat(shiftedV[2]);
    b2 = parseFloat(shiftedV[3]);
    h = (shiftedV[4] === '-' ? 1 : -1) * parseFloat(shiftedV[5]);
    a2 = parseFloat(shiftedV[6]);
    isHorizontal = false;
  } else {
    // Origin-centred fallback: x²/a² - y²/b² = 1 (horizontal)
    // or y²/b² - x²/a² = 1 (vertical).
    const hMatch = combined.match(/x[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*-\s*y[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/);
    const vMatch = combined.match(/y[²^2]*\s*\/\s*(\d+(?:\.\d+)?)\s*-\s*x[²^2]*\s*\/\s*(\d+(?:\.\d+)?)/);
    if (hMatch) {
      a2 = parseFloat(hMatch[1]);
      b2 = parseFloat(hMatch[2]);
      isHorizontal = true;
    } else if (vMatch) {
      // Vertical: first denom is b², second is a².
      b2 = parseFloat(vMatch[1]);
      a2 = parseFloat(vMatch[2]);
      isHorizontal = false;
    }
  }
  if (a2 === null || b2 === null || !Number.isFinite(a2) || !Number.isFinite(b2) || a2 <= 0 || b2 <= 0) return data;

  const c = Math.sqrt(a2 + b2); // always > 0 for true hyperbola

  const points = [...(data.points || [])];
  const functions = [...(data.functions || [])];
  const functionsOfY = [...(data.functionsOfY || [])];

  removeByLabel(functions, 'directrix');
  removeByLabel(functionsOfY, 'directrix');

  if (isHorizontal) {
    // Foci at (h ± c, k), directrices at x = h ± a²/c
    ensurePoint(points, h, k, `Center (${round(h)}, ${round(k)})`, '#16a34a');
    ensurePoint(points, h + c, k, `Focus (${round(h + c)}, ${round(k)})`, '#dc2626');
    ensurePoint(points, h - c, k, `Focus (${round(h - c)}, ${round(k)})`, '#dc2626');

    if (c > 1e-9) {
      const offset = a2 / c;
      const dirHigh = h + offset;
      const dirLow = h - offset;
      functionsOfY.push({ latex: String(round(dirHigh)), color: '#dc2626', label: `Directrix x = ${round(dirHigh)}` });
      functionsOfY.push({ latex: String(round(dirLow)), color: '#dc2626', label: `Directrix x = ${round(dirLow)}` });
      const xMin = h - c - 2;
      const xMax = h + c + 2;
      if (result.xRange[1] < xMax) result.xRange = [Math.min(result.xRange[0], xMin), xMax];
      if (result.xRange[0] > xMin) result.xRange = [xMin, Math.max(result.xRange[1], xMax)];
    }
  } else {
    // Foci at (h, k ± c), directrices at y = k ± b²/c
    ensurePoint(points, h, k, `Center (${round(h)}, ${round(k)})`, '#16a34a');
    ensurePoint(points, h, k + c, `Focus (${round(h)}, ${round(k + c)})`, '#dc2626');
    ensurePoint(points, h, k - c, `Focus (${round(h)}, ${round(k - c)})`, '#dc2626');

    if (c > 1e-9) {
      const offset = b2 / c;
      const dirHigh = k + offset;
      const dirLow = k - offset;
      functions.push({ latex: String(round(dirHigh)), color: '#dc2626', label: `Directrix y = ${round(dirHigh)}` });
      functions.push({ latex: String(round(dirLow)), color: '#dc2626', label: `Directrix y = ${round(dirLow)}` });
      const yMin = k - c - 2;
      const yMax = k + c + 2;
      if (result.yRange[1] < yMax) result.yRange = [Math.min(result.yRange[0], yMin), yMax];
      if (result.yRange[0] > yMin) result.yRange = [yMin, Math.max(result.yRange[1], yMax)];
    }
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
