/**
 * Wolfram Alpha Math Validator
 *
 * Uses Wolfram Alpha's Full Results API to validate and correct
 * mathematical content in whiteboard tool calls.
 *
 * Unlike LLM-based validation, Wolfram is a computational engine
 * that returns exact, correct answers with zero hallucination.
 */

const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID || 'V4466A55LU';
const WOLFRAM_API_URL = 'https://api.wolframalpha.com/v2/query';

interface WolframPod {
  title: string;
  subpods: { plaintext?: string }[];
}

interface WolframResult {
  success: boolean;
  pods: WolframPod[];
}

/**
 * Query Wolfram Alpha and return parsed pods.
 */
async function queryWolfram(input: string): Promise<WolframResult> {
  try {
    const url = `${WOLFRAM_API_URL}?input=${encodeURIComponent(input)}&appid=${WOLFRAM_APP_ID}&output=json&format=plaintext`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) {
      console.error('[Wolfram] API error:', response.status);
      return { success: false, pods: [] };
    }

    const data = await response.json();
    const qr = data.queryresult;

    if (!qr?.success) {
      return { success: false, pods: [] };
    }

    return {
      success: true,
      pods: (qr.pods || []) as WolframPod[],
    };
  } catch (err) {
    console.error('[Wolfram] Query failed:', err);
    return { success: false, pods: [] };
  }
}

/**
 * Extract a specific value from Wolfram pods by searching pod titles and content.
 */
function extractFromPods(pods: WolframPod[], podTitle: string, key?: string): string | null {
  for (const pod of pods) {
    if (pod.title.toLowerCase().includes(podTitle.toLowerCase())) {
      for (const sub of pod.subpods) {
        const text = sub.plaintext || '';
        if (!key) return text;
        // Search for key in multi-line output (e.g., "focus | (1, 0)")
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.toLowerCase().includes(key.toLowerCase())) {
            // Extract value after the | separator
            const parts = line.split('|');
            if (parts.length >= 2) return parts.slice(1).join('|').trim();
            return line.trim();
          }
        }
      }
    }
  }
  return null;
}

/**
 * Parse a point string like "(1, 0)" or "(0, -3) | (0, 3)" into array of {x, y}.
 */
function parsePoints(text: string): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const regex = /\(\s*(-?[\d.]+(?:\/\d+)?)\s*,\s*(-?[\d.]+(?:\/\d+)?)\s*\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    points.push({
      x: evalFraction(match[1]),
      y: evalFraction(match[2]),
    });
  }
  return points;
}

/**
 * Evaluate a fraction string like "16/3" or "-5" to a number.
 */
function evalFraction(s: string): number {
  s = s.trim();
  if (s.includes('/')) {
    const [num, den] = s.split('/');
    return parseFloat(num) / parseFloat(den);
  }
  return parseFloat(s);
}

/**
 * Parse a value that might be "x = -1" or "y = 25/3" to extract the number.
 */
function parseEquationValue(text: string): number | null {
  const match = text.match(/[=]\s*(-?[\d.]+(?:\/\d+)?)/);
  if (match) return evalFraction(match[1]);
  return null;
}

// ── Public API ──

export interface ConicProperties {
  type: 'parabola' | 'ellipse' | 'hyperbola' | 'unknown';
  foci: { x: number; y: number }[];
  vertices: { x: number; y: number }[];
  center?: { x: number; y: number };
  directrix?: { axis: 'x' | 'y'; value: number }[];
  eccentricity?: number;
  semiMajor?: number;
  semiMinor?: number;
}

/**
 * Query Wolfram Alpha for properties of a conic section equation.
 * Returns structured data with computed focus, directrix, etc.
 */
export async function getConicProperties(equation: string): Promise<ConicProperties | null> {
  // Query for properties
  const result = await queryWolfram(`properties of ${equation}`);
  if (!result.success) return null;

  const props: ConicProperties = {
    type: 'unknown',
    foci: [],
    vertices: [],
  };

  // Detect type
  const figureText = extractFromPods(result.pods, 'Geometric figure');
  if (figureText) {
    if (figureText.includes('parabola')) props.type = 'parabola';
    else if (figureText.includes('ellipse')) props.type = 'ellipse';
    else if (figureText.includes('hyperbola')) props.type = 'hyperbola';
  }

  // Extract properties from the Properties pod
  const propsText = extractFromPods(result.pods, 'Properties') ||
    extractFromPods(result.pods, 'Properties of parabola') ||
    extractFromPods(result.pods, 'Result');

  if (propsText) {
    // Parse foci
    const fociLine = propsText.split('\n').find(l => l.toLowerCase().includes('foc'));
    if (fociLine) {
      props.foci = parsePoints(fociLine);
    }

    // Parse vertices
    const vertexLine = propsText.split('\n').find(l => l.toLowerCase().includes('vert'));
    if (vertexLine) {
      props.vertices = parsePoints(vertexLine);
    }

    // Parse center
    const centerLine = propsText.split('\n').find(l => l.toLowerCase().includes('center'));
    if (centerLine) {
      const pts = parsePoints(centerLine);
      if (pts.length > 0) props.center = pts[0];
    }

    // Parse eccentricity
    const eccLine = propsText.split('\n').find(l => l.toLowerCase().includes('eccentricity'));
    if (eccLine) {
      const match = eccLine.match(/(\d+(?:\.\d+)?(?:\/\d+)?)\s*(?:=\s*(\d+(?:\.\d+)?))?/);
      if (match) {
        props.eccentricity = match[2] ? parseFloat(match[2]) : evalFraction(match[1]);
      }
    }

    // Parse semi-axis lengths
    const semiMajorLine = propsText.split('\n').find(l => l.toLowerCase().includes('semimajor'));
    if (semiMajorLine) {
      const match = semiMajorLine.match(/(\d+(?:\.\d+)?)/);
      if (match) props.semiMajor = parseFloat(match[1]);
    }
    const semiMinorLine = propsText.split('\n').find(l => l.toLowerCase().includes('semiminor'));
    if (semiMinorLine) {
      const match = semiMinorLine.match(/(\d+(?:\.\d+)?)/);
      if (match) props.semiMinor = parseFloat(match[1]);
    }

    // Parse directrix (parabolas have it directly)
    const directrixLine = propsText.split('\n').find(l => l.toLowerCase().includes('directrix'));
    if (directrixLine) {
      const val = parseEquationValue(directrixLine);
      if (val !== null) {
        const axis = directrixLine.includes('x =') ? 'x' : 'y';
        props.directrix = [{ axis, value: val }];
      }
    }
  }

  // For ellipses/hyperbolas, compute directrix from eccentricity and semi-axes
  // (Wolfram doesn't always return directrix for these)
  if (!props.directrix && props.eccentricity && props.eccentricity > 0) {
    if (props.type === 'ellipse' && props.semiMajor) {
      const a = props.semiMajor;
      const e = props.eccentricity;
      const dirVal = a / e;
      // Determine axis from foci positions
      const fociOnY = props.foci.length > 0 && props.foci[0].x === 0 && props.foci[0].y !== 0;
      const axis = fociOnY ? 'y' : 'x';
      props.directrix = [
        { axis, value: Math.round(dirVal * 100) / 100 },
        { axis, value: Math.round(-dirVal * 100) / 100 },
      ];
    }
    if (props.type === 'hyperbola' && props.foci.length >= 2) {
      const c = Math.abs(props.foci[0].x !== 0 ? props.foci[0].x : props.foci[0].y);
      const e = props.eccentricity;
      const dirVal = c / (e * e); // a²/c = (c/e)²/c = c/e² ... actually a = c/e, so a²/c = c/e²
      // Simpler: a = c/e, directrix = a/e = c/e²
      const a = c / e;
      const correctDir = a / e; // = a²/c
      const fociOnY = props.foci[0].x === 0;
      const axis = fociOnY ? 'y' : 'x';
      props.directrix = [
        { axis, value: Math.round(correctDir * 100) / 100 },
        { axis, value: Math.round(-correctDir * 100) / 100 },
      ];
    }
  }

  // Also query for directrix explicitly for parabolas
  if (props.type === 'parabola' && !props.directrix) {
    const dirResult = await queryWolfram(`directrix of ${equation}`);
    if (dirResult.success) {
      const dirText = extractFromPods(dirResult.pods, 'Properties of parabola', 'directrix') ||
        extractFromPods(dirResult.pods, 'Result');
      if (dirText) {
        const val = parseEquationValue(dirText);
        if (val !== null) {
          const axis = dirText.includes('x =') || dirText.includes('x=') ? 'x' : 'y';
          props.directrix = [{ axis, value: val }];
        }
      }
    }
  }

  console.log('[Wolfram] Conic properties for', equation, ':', JSON.stringify(props));
  return props;
}
