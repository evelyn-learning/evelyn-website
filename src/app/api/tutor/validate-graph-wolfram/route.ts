/**
 * Wolfram Alpha Graph Validation API
 *
 * Validates and corrects mathematical graph data using Wolfram Alpha.
 * Replaces LLM-based validation for graphs — deterministic, exact answers.
 *
 * Flow:
 * 1. Extract equation from graph data (LaTeX or labels)
 * 2. Query Wolfram Alpha for properties (focus, directrix, vertices, etc.)
 * 3. Fix the graph data with correct values
 */

import { NextRequest, NextResponse } from 'next/server';

const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID || 'V4466A55LU';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function queryWolfram(input: string): Promise<any> {
  const url = `https://api.wolframalpha.com/v2/query?input=${encodeURIComponent(input)}&appid=${WOLFRAM_APP_ID}&output=json&format=plaintext`;
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) return null;
  const data = await response.json();
  return data.queryresult?.success ? data.queryresult : null;
}

function getPodsText(qr: { pods?: { title: string; subpods: { plaintext?: string }[] }[] }): string {
  if (!qr?.pods) return '';
  return qr.pods.map(p =>
    `${p.title}: ${p.subpods.map(s => s.plaintext || '').join('; ')}`
  ).join('\n');
}

function parsePoints(text: string): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const regex = /\(\s*(-?[\d.]+(?:\/\d+)?)\s*,\s*(-?[\d.]+(?:\/\d+)?)\s*\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    points.push({
      x: evalFrac(match[1]),
      y: evalFrac(match[2]),
    });
  }
  return points;
}

function evalFrac(s: string): number {
  s = s.trim();
  if (s.includes('/')) {
    const [n, d] = s.split('/');
    return parseFloat(n) / parseFloat(d);
  }
  return parseFloat(s);
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Extract the main equation from graph data.
 */
function extractEquation(data: GraphData): string | null {
  // Check functions and functionsOfY for equation-like LaTeX
  const allFns = [...(data.functions || []), ...(data.functionsOfY || [])];
  for (const fn of allFns) {
    const latex = fn.latex || '';
    // Look for equations (contains =)
    if (latex.includes('=')) {
      // Clean LaTeX for Wolfram: \frac{x^2}{16} → x^2/16
      let eq = latex
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\left|\\right/g, '')
        .replace(/\\\\/g, '')
        .replace(/\\cdot/g, '*');
      return eq;
    }
    // Implicit equation from label
    const label = fn.label || '';
    const eqMatch = label.match(/:\s*(.+)/);
    if (eqMatch) {
      return eqMatch[1].trim()
        .replace(/²/g, '^2')
        .replace(/³/g, '^3');
    }
  }

  // Try title
  const titleMatch = (data.title || '').match(/(?:of|:)\s*(.+)/i);
  if (titleMatch) {
    return titleMatch[1].trim().replace(/²/g, '^2');
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { graphData } = await request.json();
    if (!graphData) {
      return NextResponse.json({ corrected: false, data: graphData });
    }

    const equation = extractEquation(graphData as GraphData);
    if (!equation) {
      console.log('[WolframValidate] Could not extract equation from graph data');
      return NextResponse.json({ corrected: false, data: graphData });
    }

    console.log('[WolframValidate] Extracted equation:', equation);

    // Query Wolfram for properties
    const qr = await queryWolfram(`properties of ${equation}`);
    if (!qr) {
      console.log('[WolframValidate] Wolfram query failed');
      return NextResponse.json({ corrected: false, data: graphData });
    }

    const podsText = getPodsText(qr);
    console.log('[WolframValidate] Wolfram response:', podsText.slice(0, 500));

    // Parse Wolfram results
    const fociLine = podsText.split('\n').find(l => /foc/i.test(l));
    const vertexLine = podsText.split('\n').find(l => /vert/i.test(l));
    const centerLine = podsText.split('\n').find(l => /center/i.test(l));
    const directrixLine = podsText.split('\n').find(l => /directrix/i.test(l));
    const eccLine = podsText.split('\n').find(l => /eccentricity/i.test(l));
    const semiMajorLine = podsText.split('\n').find(l => /semimajor/i.test(l));
    const figureLine = podsText.split('\n').find(l => /Geometric figure/i.test(l));

    const conicType = figureLine?.includes('parabola') ? 'parabola'
      : figureLine?.includes('ellipse') ? 'ellipse'
      : figureLine?.includes('hyperbola') ? 'hyperbola'
      : null;

    if (!conicType) {
      // Not a conic section — can't validate further
      return NextResponse.json({ corrected: false, data: graphData });
    }

    // Build corrected graph data
    const result: GraphData = { ...graphData };
    const points: GraphPoint[] = [];
    let functions = [...(result.functions || [])];
    let functionsOfY = [...(result.functionsOfY || [])];

    // Keep the main curve function(s), remove existing directrix/focus entries
    functions = functions.filter(f => !(f.label || '').toLowerCase().includes('directrix'));
    functionsOfY = functionsOfY.filter(f => !(f.label || '').toLowerCase().includes('directrix'));

    // Keep non-focus/vertex/center points
    const existingPoints = (result.points || []).filter(p => {
      const label = (p.label || '').toLowerCase();
      return !label.includes('focus') && !label.includes('vertex') && !label.includes('center');
    });
    points.push(...existingPoints);

    // Add foci from Wolfram
    if (fociLine) {
      const foci = parsePoints(fociLine);
      for (const f of foci) {
        points.push({ x: r2(f.x), y: r2(f.y), label: `Focus (${r2(f.x)}, ${r2(f.y)})`, color: '#dc2626' });
      }
    }

    // Add vertices from Wolfram
    if (vertexLine) {
      const verts = parsePoints(vertexLine);
      for (const v of verts) {
        points.push({ x: r2(v.x), y: r2(v.y), label: `Vertex (${r2(v.x)}, ${r2(v.y)})`, color: '#2563eb' });
      }
    }

    // Add center
    if (centerLine) {
      const centers = parsePoints(centerLine);
      if (centers.length > 0) {
        points.push({ x: r2(centers[0].x), y: r2(centers[0].y), label: `Center (${r2(centers[0].x)}, ${r2(centers[0].y)})`, color: '#16a34a' });
      }
    }

    // Add directrix
    if (directrixLine) {
      // Parse "x = -1" or "y = 25/3"
      const xMatch = directrixLine.match(/x\s*=\s*(-?[\d.]+(?:\/\d+)?)/);
      const yMatch = directrixLine.match(/y\s*=\s*(-?[\d.]+(?:\/\d+)?)/);
      if (xMatch) {
        const val = evalFrac(xMatch[1]);
        functionsOfY.push({ latex: String(r2(val)), color: '#dc2626', label: `Directrix x = ${r2(val)}` });
      } else if (yMatch) {
        const val = evalFrac(yMatch[1]);
        functions.push({ latex: String(r2(val)), color: '#dc2626', label: `Directrix y = ${r2(val)}` });
      }
    }

    // For ellipse/hyperbola without directrix from Wolfram, compute from eccentricity
    if (!directrixLine && eccLine && semiMajorLine) {
      // Parse eccentricity — Wolfram formats like "sqrt(3)/2≈0.866025" or "3/5 = 0.6"
      const eccApproxMatch = eccLine.match(/[≈=]\s*(\d+\.\d+)/);
      const semiMatch = semiMajorLine.match(/(\d+(?:\.\d+)?)/);
      if (eccApproxMatch && semiMatch) {
        const e = parseFloat(eccApproxMatch[1]);
        const a = parseFloat(semiMatch[1]);
        if (e > 0) {
          const dirVal = r2(a / e);
          // Determine axis from foci
          const foci = fociLine ? parsePoints(fociLine) : [];
          const fociOnY = foci.length > 0 && foci[0].x === 0 && foci[0].y !== 0;

          if (fociOnY) {
            // Horizontal directrix lines
            functions.push({ latex: String(dirVal), color: '#dc2626', label: `Directrix y = ${dirVal}` });
            functions.push({ latex: String(-dirVal), color: '#dc2626', label: `Directrix y = ${-dirVal}` });
          } else {
            // Vertical directrix lines
            functionsOfY.push({ latex: String(dirVal), color: '#dc2626', label: `Directrix x = ${dirVal}` });
            functionsOfY.push({ latex: String(-dirVal), color: '#dc2626', label: `Directrix x = ${-dirVal}` });
          }

          // Expand viewport to show directrices
          if (fociOnY) {
            if (result.yRange[1] < dirVal + 1) result.yRange = [-(dirVal + 2), dirVal + 2];
          } else {
            if (result.xRange[1] < dirVal + 1) result.xRange = [-(dirVal + 2), dirVal + 2];
          }
        }
      }
    }

    result.points = points;
    result.functions = functions;
    result.functionsOfY = functionsOfY;

    const issues: string[] = [];
    if (JSON.stringify(result.points) !== JSON.stringify(graphData.points)) issues.push('Fixed focus/vertex/center positions');
    if (JSON.stringify(result.functions) !== JSON.stringify(graphData.functions)) issues.push('Fixed directrix lines (functions array)');
    if (JSON.stringify(result.functionsOfY) !== JSON.stringify(graphData.functionsOfY)) issues.push('Fixed directrix lines (functionsOfY array)');

    console.log('[WolframValidate] Issues found:', issues);

    return NextResponse.json({
      corrected: issues.length > 0,
      data: result,
      issues,
    });
  } catch (error) {
    console.error('[WolframValidate] Error:', error);
    return NextResponse.json({ corrected: false, data: null });
  }
}
