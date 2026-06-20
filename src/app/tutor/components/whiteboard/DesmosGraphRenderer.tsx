'use client';

/**
 * Desmos Graph Renderer
 *
 * Renders mathematical graphs using the Desmos API.
 * Accepts LaTeX expressions directly — no fragile JS expression parsing.
 * Falls back to the legacy Mafs-based GraphRenderer if Desmos isn't loaded.
 */

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import type { GraphData, GraphFunction, GraphFunctionOfY } from '@/lib/knowledge/types';

// Color palette matching our existing design
const COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
];

export interface DesmosGraphRef {
  screenshot: (opts?: { width?: number; height?: number }) => string | null;
}

interface DesmosGraphRendererProps {
  type: string;
  data: GraphData;
  className?: string;
}

/**
 * Promote bare function names to LaTeX backslash form so Desmos doesn't
 * parse them as variable products. Idempotent — already-escaped forms are
 * skipped via the negative lookbehind.
 *
 * Why: the model commonly emits `sin(x)`, `cos(x)`, `pi` as plain text in
 * the `expr` field. In Desmos LaTeX, `sin(x)` is parsed as s·i·n·(x), so
 * the curve renders as nothing. We have to escape these before submission.
 */
function normalizeBareLatex(s: string): string {
  s = s.replace(/(?<!\\)\b(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|log|ln|arcsin|arccos|arctan)\b/g, '\\$1');
  s = s.replace(/(?<!\\)\bsqrt\(([^()]*)\)/g, '\\sqrt{$1}');
  s = s.replace(/(?<!\\)\bpi\b/g, '\\pi');
  s = s.replace(/(?<!\\)\btheta\b/g, '\\theta');
  return s;
}

/**
 * Convert a legacy JS function expression to LaTeX.
 * Handles common patterns from AI-generated expressions.
 */
function jsExprToLatex(expr: string, variable: string = 'x'): string {
  let s = expr.trim();

  // Already looks like LaTeX (contains \frac, \sqrt, etc.)
  if (/\\(?:frac|sqrt|sin|cos|tan|log|ln)/.test(s)) return s;

  // JS Math functions → LaTeX
  s = s.replace(/Math\.sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  s = s.replace(/Math\.sin\(([^)]+)\)/g, '\\sin\\left($1\\right)');
  s = s.replace(/Math\.cos\(([^)]+)\)/g, '\\cos\\left($1\\right)');
  s = s.replace(/Math\.tan\(([^)]+)\)/g, '\\tan\\left($1\\right)');
  s = s.replace(/Math\.log\(([^)]+)\)/g, '\\ln\\left($1\\right)');
  s = s.replace(/Math\.abs\(([^)]+)\)/g, '\\left|$1\\right|');
  s = s.replace(/Math\.PI/g, '\\pi');
  s = s.replace(/Math\.E/g, 'e');

  // ** → ^ for exponents
  s = s.replace(/\*\*/g, '^');

  // x2, x3 pattern → x^2, x^3 (common AI mistake)
  const v = variable;
  s = s.replace(new RegExp(`\\b${v}(\\d)\\b`, 'g'), `${v}^$1`);

  // Explicit * between coefficient and variable: 2*x → 2x (Desmos handles implicit mult)
  s = s.replace(/(\d)\s*\*\s*([a-zA-Z\\])/g, '$1$2');

  // Remove remaining explicit * (Desmos uses implicit multiplication)
  s = s.replace(/\s*\*\s*/g, '');

  // Promote any remaining bare function names (sin, cos, pi, etc.)
  s = normalizeBareLatex(s);

  return s;
}

/**
 * Get LaTeX for a graph function, preferring the latex field, falling back to JS conversion.
 */
function getLatex(fn: GraphFunction | GraphFunctionOfY, variable: string = 'x'): string {
  if (fn.latex) return normalizeBareLatex(fn.latex);
  if (fn.fn) return jsExprToLatex(fn.fn, variable);
  return variable;
}

const DesmosGraphRendererInner = forwardRef<DesmosGraphRef, DesmosGraphRendererProps>(
  function DesmosGraphRendererInner({ data, className = '' }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const calculatorRef = useRef<Desmos.Calculator | null>(null);
    const [desmosLoaded, setDesmosLoaded] = useState(!!window.Desmos);

    // Wait for Desmos script to load
    useEffect(() => {
      if (window.Desmos) {
        setDesmosLoaded(true);
        return;
      }
      // Poll for Desmos availability (script loaded via next/script)
      const interval = setInterval(() => {
        if (window.Desmos) {
          setDesmosLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }, []);

    // Initialize calculator
    useEffect(() => {
      if (!desmosLoaded || !containerRef.current || !window.Desmos) return;

      // Destroy previous instance if any
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
      }

      const calculator = window.Desmos.GraphingCalculator(containerRef.current, {
        expressions: false,
        settingsMenu: false,
        zoomButtons: false,
        keypad: false,
        expressionsTopbar: false,
        border: false,
        lockViewport: true,
        links: false,
        images: false,
        folders: false,
        notes: false,
        qwertyKeyboard: false,
        plotImplicits: true,
        plotInequalities: true,
      });

      calculatorRef.current = calculator;

      // Uniform-scale viewport. Desmos (lockViewport + setMathBounds) stretches
      // the requested math box to fill the container, so when the container's
      // pixel aspect ratio doesn't match (xSpan : ySpan) a circle x²+y²=9
      // renders as a wide ellipse (observed 2026-06-20 JEE chord-of-contact
      // session). Pad the SHORTER math axis so (mathWidth : mathHeight) ==
      // (pixelWidth : pixelHeight) → equal units-per-pixel on both axes →
      // circles stay circular and tangents meet at the true angle. Re-apply on
      // resize (e.g. whiteboard fullscreen toggle).
      const container = containerRef.current;
      const applyUniformBounds = () => {
        const w = container.clientWidth, h = container.clientHeight;
        const cx = (data.xRange[0] + data.xRange[1]) / 2;
        const cy = (data.yRange[0] + data.yRange[1]) / 2;
        let xSpan = Math.abs(data.xRange[1] - data.xRange[0]);
        let ySpan = Math.abs(data.yRange[1] - data.yRange[0]);
        if (w > 0 && h > 0 && xSpan > 0 && ySpan > 0) {
          const pxRatio = w / h;
          if (xSpan / ySpan < pxRatio) xSpan = ySpan * pxRatio;
          else ySpan = xSpan / pxRatio;
        }
        calculator.setMathBounds({
          left: cx - xSpan / 2,
          right: cx + xSpan / 2,
          bottom: cy - ySpan / 2,
          top: cy + ySpan / 2,
        });
      };
      applyUniformBounds();
      const resizeObserver = new ResizeObserver(() => applyUniformBounds());
      resizeObserver.observe(container);

      let exprId = 0;

      // Add y=f(x) functions
      for (const fn of (data.functions || [])) {
        const latex = getLatex(fn, 'x');
        const color = fn.color || COLORS[exprId % COLORS.length];
        const id = `fn-${exprId++}`;

        // Build expression — prefix with "y=" if not already an equation
        let exprLatex = latex;
        if (!/[=<>]/.test(exprLatex)) {
          exprLatex = `y = ${exprLatex}`;
        }

        // Add domain restriction if specified
        if (fn.domain) {
          exprLatex += ` \\left\\{${fn.domain[0]} \\le x \\le ${fn.domain[1]}\\right\\}`;
        }

        calculator.setExpression({
          id,
          latex: exprLatex,
          color,
          label: fn.label || '',
          showLabel: !!fn.label,
        });
      }

      // Add x=f(y) functions
      for (const fn of (data.functionsOfY || [])) {
        const latex = getLatex(fn, 'y');
        const color = fn.color || COLORS[exprId % COLORS.length];
        const id = `fny-${exprId++}`;

        // Prefix with "x=" if not already an equation
        let exprLatex = latex;
        if (!/[=<>]/.test(exprLatex)) {
          exprLatex = `x = ${exprLatex}`;
        }

        // Add domain restriction if specified
        if (fn.domain) {
          exprLatex += ` \\left\\{${fn.domain[0]} \\le y \\le ${fn.domain[1]}\\right\\}`;
        }

        calculator.setExpression({
          id,
          latex: exprLatex,
          color,
          label: fn.label || '',
          showLabel: !!fn.label,
        });
      }

      // Add labeled points
      for (const pt of (data.points || [])) {
        const id = `pt-${exprId++}`;
        calculator.setExpression({
          id,
          latex: `(${pt.x}, ${pt.y})`,
          color: pt.color || '#2563eb',
          label: pt.label || '',
          showLabel: !!pt.label,
          pointSize: 9,
        });
      }

      // Add shaded region
      if (data.shadedRegion) {
        const sr = data.shadedRegion;
        const id = `shade-${exprId++}`;
        if (sr.axis === 'x') {
          // Shade between two y=f(x) curves. Use min/max so the
          // brain's `between` order doesn't matter — observed
          // 2026-05-04 AP Calc session, brain emitted
          // between:["2*x","0"] for area under y=2x on [0,3]; if
          // we treat the first entry as the lower bound literally,
          // the constraint "2x ≤ y ≤ 0" is unsatisfiable on [0,3]
          // and Desmos shades nothing.
          const f1 = jsExprToLatex(sr.between[0], 'x');
          const f2 = jsExprToLatex(sr.between[1], 'x');
          calculator.setExpression({
            id,
            latex: `\\min\\left(${f1},${f2}\\right) \\le y \\le \\max\\left(${f1},${f2}\\right) \\left\\{${sr.from} \\le x \\le ${sr.to}\\right\\}`,
            color: sr.color || '#16a34a',
          });
        } else {
          // Shade between two x=f(y) curves. Same min/max guard.
          const f1 = jsExprToLatex(sr.between[0], 'y');
          const f2 = jsExprToLatex(sr.between[1], 'y');
          calculator.setExpression({
            id,
            latex: `\\min\\left(${f1},${f2}\\right) \\le x \\le \\max\\left(${f1},${f2}\\right) \\left\\{${sr.from} \\le y \\le ${sr.to}\\right\\}`,
            color: sr.color || '#16a34a',
          });
        }
      }

      return () => {
        resizeObserver.disconnect();
        calculator.destroy();
        calculatorRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desmosLoaded, JSON.stringify(data)]);

    // Expose screenshot method
    const takeScreenshot = useCallback((opts?: { width?: number; height?: number }): string | null => {
      if (!calculatorRef.current) return null;
      try {
        return calculatorRef.current.screenshot({
          width: opts?.width || 500,
          height: opts?.height || 400,
          targetPixelRatio: 2,
        });
      } catch {
        return null;
      }
    }, []);

    useImperativeHandle(ref, () => ({ screenshot: takeScreenshot }), [takeScreenshot]);

    if (!desmosLoaded) {
      return (
        <div className={`graph-container ${className}`}>
          {data.title && <h4 className="text-center font-medium text-gray-800 mb-2">{data.title}</h4>}
          <div className="flex items-center justify-center h-[300px] bg-gray-50 text-gray-400 text-sm">
            Loading graph...
          </div>
        </div>
      );
    }

    return (
      <div className={`graph-container ${className}`}>
        {data.title && <h4 className="text-center font-medium text-gray-800 mb-2">{data.title}</h4>}
        <div
          ref={containerRef}
          className="w-full"
          // Fixed pixel box; applyUniformBounds() pads the math bounds to this
          // box's aspect ratio so the scale is uniform (circles stay circular).
          style={{ height: 380, maxHeight: 450 }}
        />
        {/* Legend */}
        {(data.functions?.length || 0) + (data.functionsOfY?.length || 0) > 0 && (
          <div className="flex gap-4 justify-center mt-2 flex-wrap">
            {(data.functions || []).filter(f => f.label).map((fn, i) => (
              <div key={`fn-${i}`} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-1 rounded" style={{ backgroundColor: fn.color || COLORS[i % COLORS.length] }} />
                <span>{fn.label}</span>
              </div>
            ))}
            {(data.functionsOfY || []).filter(f => f.label).map((fn, i) => (
              <div key={`fny-${i}`} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-1 rounded" style={{ backgroundColor: fn.color || COLORS[((data.functions?.length || 0) + i) % COLORS.length] }} />
                <span>{fn.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DesmosGraphRendererInner.displayName = 'DesmosGraphRenderer';

export const DesmosGraphRenderer = DesmosGraphRendererInner;
export default DesmosGraphRenderer;
