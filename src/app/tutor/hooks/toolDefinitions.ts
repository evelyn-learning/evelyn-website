/**
 * Shared Tool Definitions for AI Voice Tutor
 *
 * Defines all whiteboard tools in a neutral format that can be converted
 * to OpenAI Realtime or Google Gemini function calling schemas.
 * This prevents duplicating ~300 lines of tool definitions across hooks.
 */

import type { WhiteboardCommand, ShadedRegion } from '@/lib/knowledge/types';
import { getGeometryStepKindsDescriptionTail } from '@/lib/tutor/diagrams/geometry-solver';
import { deepStripWbEmphasis, stripInlineMathForInk } from '@/lib/tutor/whiteboard/wb-emphasis-strip';

export interface ToolParameter {
  type: string;
  description?: string;
  enum?: Array<string | number>;
  items?: ToolParameter | { type: string; properties?: Record<string, ToolParameter>; required?: string[] };
  properties?: Record<string, ToolParameter>;
  required?: string[];
  /** JSON Schema bounds — passed through to Anthropic's input_schema and
   *  enforced server-side. Useful for arrays where structured cardinality
   *  matters (e.g. signalsObserved minItems=1, studentQuotes maxItems=2). */
  minItems?: number;
  maxItems?: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required: string[];
  };
}

/** SmoothDraw Phase 3: on-board ink notes. DEFAULT ON since the
 *  2026-07-11 live legibility gate passed — `near` resolves through the
 *  catalog and notes render on-board via InkNotesOverlay unless
 *  explicitly turned off. `NEXT_PUBLIC_TUTOR_INK_NOTES=off` is the
 *  no-deploy rollback lever (same precedent as the noise-nag kill
 *  switch): flip the env var and redeploy to fall back to a no-notes
 *  board, no code change required. Read at CALL time (not module init)
 *  so unit tests can toggle process.env; in the browser bundle Next.js
 *  inlines the env var, making this a constant. */
export function inkNotesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TUTOR_INK_NOTES !== 'off';
}

/** SmoothDraw P4: hand-drawn link arrows. DEFAULT ON since the 2026-07-11
 *  user feel gate passed — `tutor_link` is offered to the brain and arrows
 *  render on-board unless explicitly turned off.
 *  `NEXT_PUBLIC_TUTOR_LINKS=off` is the no-deploy rollback lever (same
 *  precedent as ink-notes' kill switch): flip the env var and redeploy to
 *  fall back to no-arrows, no code change required. Read at CALL time (not
 *  module init) so unit tests can toggle process.env; in the browser bundle
 *  Next.js inlines the env var, making this a constant. */
export function linksEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TUTOR_LINKS !== 'off';
}

/**
 * All whiteboard tools available to the AI tutor.
 * These are the canonical definitions — convert to platform-specific
 * format using toOpenAITools() or toGeminiTools().
 *
 * NOTE on the `tutor_link` entry below: unlike `linksEnabled()`'s other
 * call sites (checked fresh per call), the conditional spread here runs
 * ONCE at module-init time — this array is a module-scope const. In the
 * browser bundle Next.js inlines NEXT_PUBLIC_* env vars at build time, so
 * that's already a compile-time constant; server-side, process.env is
 * read once when the module first loads and does not change within a
 * running process. Both give the same effective answer as a call-time
 * read here would, so this is not a staleness risk — just noting the
 * asymmetry with the flag-off check inside mapFunctionCallToCommand,
 * which IS evaluated per call (and is what actually protects against a
 * stale brain still emitting tutor_link after a mid-session flag flip).
 */
export const WHITEBOARD_TOOLS: ToolDefinition[] = [
  {
    name: 'show_equation',
    description: 'Display an equation on the whiteboard. You MUST call this whenever you mention ANY equation, formula, or mathematical relationship in your speech. Always show equations visually — never just say them without also displaying them. CRITICAL: `latex` MUST be the actual mathematical expression in LaTeX (e.g., "x = 5 + 3", "F = m \\cdot a", "\\frac{1}{2}mv^2"). NEVER pass placeholder text like "The equation", "Equation", "Formula", or English prose as `latex` — it renders as broken plain text. Emit the call ONCE with the final latex; do not stage a draft call followed by a corrected one.',
    parameters: {
      type: 'object',
      properties: {
        latex: { type: 'string', description: 'The equation in LaTeX format. Must contain math (digits, operators, variables), NOT English placeholder text.' },
        label: { type: 'string', description: 'A short descriptive label shown above the equation (e.g., "Newton\'s 2nd Law", "Balance solved"). If the label itself contains math, wrap it in inline $…$ (e.g. "Tangent at $(\\sqrt{5}, 4/3)$") — rendered with KaTeX; never unicode math.' },
        expectedAnswer: { type: 'string', description: 'ONLY when this card poses a PROBLEM the student will now attempt (e.g. rendering a student-brought problem as an equation card): the bare final answer you derived. NEVER shown to the student — the runtime strips it, independently solves the active problem, and pins your answer for consistent grading when it verifies. Omit for ordinary equation/step cards.' },
      },
      required: ['latex'],
    },
  },
  {
    name: 'show_function_graph',
    description: 'Plot mathematical functions, curves, points, and shaded regions on a coordinate plane. When plotting THE CURRENT PROBLEM (the student said "this problem" / "the one we just did"), the expression must satisfy the problem\'s stated conditions — DERIVE it and VERIFY before emitting: compute f\' at every point you label a max/min (must be 0) and f\'\' at every labeled inflection (must be 0). A generic look-alike curve whose labeled features are false for its own expression is worse than no graph. LaTeX-style expressions for `expr` (use `functions` for y=f(x), `functionsOfY` for x=f(y)). For a POLAR curve r=f(θ) use show_diagram(type: "polar_graph") instead — `functions`/`functionsOfY` are Cartesian only; never convert a polar curve to a Cartesian-implicit form and put it in `functions` (an `expr` that references y is not y=f(x) and renders wrong). `points` marks a spot ON a plotted curve — always pair it with a `functions`/`functionsOfY` entry in the same call; a `points`-only call with no function renders two floating labeled dots with no curve or visible axes. For bare (x, y) data with no function to plot, use `show_scatter_plot` instead.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        xLabel: { type: 'string' },
        yLabel: { type: 'string' },
        xRange: { type: 'array', items: { type: 'number' }, description: 'Visible x-axis range [min, max].' },
        yRange: { type: 'array', items: { type: 'number' }, description: 'Visible y-axis range [min, max].' },
        functions: {
          type: 'array',
          description: 'y=f(x) functions or implicit equations.',
          items: {
            type: 'object',
            properties: {
              expr: { type: 'string', description: 'LaTeX expression in x (e.g. "e^{-1.5(x-3)}", "\\frac{x}{2}"). NEVER JavaScript syntax — no Math.exp/Math.sqrt/**; a JS expression cannot be plotted and the curve silently vanishes while its legend entry remains.' },
              color: { type: 'string' },
              label: { type: 'string' },
              domain: { type: 'array', items: { type: 'number' } },
            },
            required: ['expr', 'label'],
          },
        },
        functionsOfY: {
          type: 'array',
          description: 'x=f(y) functions, including vertical lines (expr is a constant).',
          items: {
            type: 'object',
            properties: {
              expr: { type: 'string', description: 'LaTeX expression in y.' },
              color: { type: 'string' },
              label: { type: 'string' },
              domain: { type: 'array', items: { type: 'number' } },
            },
            required: ['expr', 'label'],
          },
        },
        points: {
          type: 'array',
          description: 'Labeled points. Intersection points must satisfy ALL plotted equations — verified by validator.',
          items: {
            type: 'object',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              label: { type: 'string' },
              color: { type: 'string' },
            },
            required: ['x', 'y'],
          },
        },
        shadedRegion: {
          type: 'object',
          description: 'Shade area between two curves (or between a curve and the axis baseline). For "area UNDER y = f(x) from a to b" pass between=["f(x)", "0"] — the "0" is the x-axis. CRITICAL: between MUST be an array of EXACTLY TWO expressions. If you want area under a curve to the x-axis, pass "0" as the second bound; do not omit it.',
          properties: {
            axis: { type: 'string', enum: ['x', 'y'] },
            between: { type: 'array', items: { type: 'string' }, description: 'Two LaTeX expressions naming the upper and lower (or left/right) bounds. For area-under-curve: ["f(x)", "0"].' },
            from: { type: 'number' },
            to: { type: 'number' },
            color: { type: 'string' },
            opacity: { type: 'number' },
          },
          required: ['axis', 'between', 'from', 'to'],
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'new_page',
    description: 'DEPRECATED for layout — do NOT call this to organize content. The runtime lays out whiteboard pages automatically (it groups one topic together and starts fresh pages on its own). Calling new_page per concept/figure/problem fragments the board. Just emit your show_* content directly.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short title for this page.' },
      },
      required: ['title'],
    },
  },
  {
    name: 'go_to_page',
    description: 'Navigate the whiteboard back to a previously created page. PREFER addressing by `page` number — the `Page N:` handle from the whiteboard map (<whiteboard_state>). `title` still works as a fallback when you do not have the number.',
    parameters: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'The page number to navigate to (the `Page N` handle from the whiteboard map). Preferred over title.' },
        title: { type: 'string', description: 'The title of the page to navigate to (fallback when you do not have the page number).' },
      },
      required: [],
    },
  },
  {
    name: 'show_code',
    description: 'Display a code snippet on the whiteboard. You MUST call this whenever you discuss programming code.',
    parameters: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'The code to display. Use \\n for newlines.' },
        language: { type: 'string', description: 'Programming language (e.g., java, python)' },
        label: { type: 'string', description: 'A short label/title for the code snippet' },
      },
      required: ['code', 'language'],
    },
  },
  {
    name: 'show_table',
    description: 'Display a table on the whiteboard.',
    parameters: {
      type: 'object',
      properties: {
        headers: { type: 'array', items: { type: 'string' }, description: 'Column headers' },
        rows: { type: 'array', items: { type: 'array', items: { type: 'string' } }, description: 'Table rows' },
      },
      required: ['headers', 'rows'],
    },
  },
  {
    name: 'show_molecule',
    description: 'Display a chemical structure using an interactive chemistry editor. Auto-detects three kinds of compound from the input: (a) MOLECULAR (default — organic molecules, functional groups, ordinary covalent compounds — pass standard SMILES like "CCO" / "c1ccccc1" / "CC(=O)O"); (b) HYDRATE (a salt with water of crystallization — pass formula-with-dot like "CuSO4·5H2O" or "MgSO4·7H2O"; the runtime expands `·nH2O` into `n` water molecules drawn inline beside the primary structure); (c) IONIC (binary ionic compounds like "NaCl", "MgCl2", or bracketed-ion SMILES like "[Na+].[Cl-]"; the runtime renders the ions in the editor AND draws an inline SVG unit-cell lattice diagram below). Override auto-detection with `mode` if needed.',
    parameters: {
      type: 'object',
      properties: {
        smiles: { type: 'string', description: 'SMILES, formula, or hydrate notation. Examples: "CCO" (ethanol, molecular), "c1ccccc1" (benzene), "CuSO4·5H2O" (copper sulfate pentahydrate), "[Na+].[Cl-]" or "NaCl" (ionic).' },
        title: { type: 'string', description: 'Title/name of the compound' },
        description: { type: 'string', description: 'What to notice about this structure' },
        interactive: { type: 'boolean', description: 'Allow student to edit the structure (default: false)' },
        mode: { type: 'string', enum: ['auto', 'molecular', 'hydrate', 'ionic'], description: 'Override auto-detection (default "auto"). Use when the auto-detector picks wrong — rare in practice.' },
      },
      required: ['smiles', 'title'],
    },
  },
  {
    name: 'show_number_line',
    description: 'Display a number line with points, intervals, and hops. NOT for statistical plots — a boxplot/dotplot/histogram goes through show_stats, never dots on a number line.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        min: { type: 'number', description: 'Left bound' },
        max: { type: 'number', description: 'Right bound' },
        step: { type: 'number', description: 'Tick mark interval' },
        points: { type: 'array', items: { type: 'object', properties: { value: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' }, style: { type: 'string', enum: ['filled', 'open'] } }, required: ['value'] } },
        intervals: { type: 'array', items: { type: 'object', properties: { from: { type: 'number' }, to: { type: 'number' }, fromInclusive: { type: 'boolean' }, toInclusive: { type: 'boolean' }, color: { type: 'string' }, label: { type: 'string' } }, required: ['from', 'to'] } },
        segments: { type: 'array', items: { type: 'object', properties: { from: { type: 'number' }, to: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' }, arc: { type: 'boolean' } }, required: ['from', 'to'] } },
        fractionTicks: { type: 'object', properties: { denominator: { type: 'number' }, showLabels: { type: 'boolean' } } },
      },
      required: ['min', 'max'],
    },
  },
  {
    name: 'show_geometry',
    description: 'Geometric figures: labeled points, segments, polygons, circles, and angle markers. Polygons need a `polygons` entry (sequence of point ids); circles need a `circles` entry (center id + radius). Omit `angle.label` to let the renderer auto-compute the measure. CRITICAL: never embed coordinate numbers in `point.label` (write "A", not "A(3, 7)") — set `showCoords: true` and the renderer will append the (x, y) tuple from the actual numeric coords. Same for segment lengths: write `label: "chord AB"` and `showLength: true` instead of "AB = √20" — the renderer computes the length so it can never disagree with the geometry. NOT for tabular content: a table structure / grid of cells (two-way table, frequency table, comparison grid) must be rendered with show_table, never sketched here — a geometry call with no real figure primitives is rejected. NOT for statistical plots either: boxplots/histograms/dotplots go through show_stats, never as labeled geometry points.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        points: { type: 'array', description: 'Named points with coordinates. `label` is the display NAME ONLY (e.g. "A", "O") — do not write coordinates into it. Set `showCoords: true` to have the renderer append "(x, y)" from the actual numeric x/y.', items: { type: 'object', properties: { id: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' }, showCoords: { type: 'boolean' }, color: { type: 'string' } }, required: ['id', 'x', 'y'] } },
        segments: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, style: { type: 'string', enum: ['solid', 'dashed', 'dotted'] }, color: { type: 'string' }, label: { type: 'string', description: 'Free-form name (e.g. "chord AB", "altitude h"). Do not put numeric lengths here — use showLength.' }, showLength: { type: 'boolean', description: 'When true, the renderer appends the actual computed length, formatted exactly (e.g. "√20" or "4").' }, tickMarks: { type: 'number' } }, required: ['from', 'to'] } },
        polygons: { type: 'array', items: { type: 'object', properties: { vertices: { type: 'array', items: { type: 'string' } }, fill: { type: 'string' }, stroke: { type: 'string' }, label: { type: 'string' } }, required: ['vertices'] } },
        circles: { type: 'array', items: { type: 'object', properties: { center: { type: 'string' }, radius: { type: 'number' }, style: { type: 'string', enum: ['solid', 'dashed'] }, color: { type: 'string' } }, required: ['center', 'radius'] } },
        angles: { type: 'array', items: { type: 'object', properties: { vertex: { type: 'string' }, from: { type: 'string' }, to: { type: 'string' }, label: { type: 'string' }, style: { type: 'string', enum: ['arc', 'square'] }, color: { type: 'string' } }, required: ['vertex', 'from', 'to'] } },
        showGrid: { type: 'boolean' },
        showAxes: { type: 'boolean' },
      },
      required: ['points'],
    },
  },
  {
    name: 'show_geometry_constructed',
    description: 'Geometric figures expressed as constructions: GIVENS (raw points/circles/segments/lines/polygons, by id) plus STEPS (derived objects referenced by id). The renderer solves coordinates exactly, so you never do the arithmetic. PREFER this over show_geometry whenever the figure has a construction description. The full step catalog and field cheatsheet lives in the system prompt under <geometry_constructions>.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        given: {
          type: 'array',
          description: 'Raw objects with explicit data: { id, kind: "point"|"circle"|"segment"|"line"|"polygon", ...kind-specific fields }. point: { x, y }. circle: { center: pointId, radius }. segment: { from, to }. line: { through: [pointA_id, pointB_id] }. polygon: { vertices: [pointId, ...] }.',
          items: { type: 'object' },
        },
        steps: {
          type: 'array',
          description: 'Construction steps. Each: { id, kind, label?, ...args }. Common step kinds with shapes: segment: { kind: "segment", from: pointId, to: pointId, label?: string } — arbitrary line segment between two named points (use for individual polygon edges). polygon: { kind: "polygon", vertices: [id1, id2, ...] } — arbitrary polygon defined by named vertices (use for any non-regular polygon). polygon_regular: { kind: "polygon_regular", on: circleId, sides, rotation? } — inscribes a REGULAR n-gon (all sides equal) in an existing circle; requires both `on` and `sides`; do NOT use for non-regular polygons. chord: { kind: "chord", on: circleId, length: { ratio: 0.25, of: "diameter" }, direction: "horizontal", position: "top" }. radius: { kind: "radius", on: circleId, to: { angle: 60 } } or { to: pointId }. tangent_at: { kind: "tangent_at", on: circleId|conicId, point: pointId, length?: number } — tangent line at a point lying ON a circle OR conic (ellipse/parabola/hyperbola); the point MUST be on the curve. For a tangent at a point on a conic, ALWAYS use this — never hand-place tangent endpoints or a raw segment (the solver computes the exact tangent line). perpendicular_bisector: { kind: "perpendicular_bisector", of: segmentId | { from, to } }. intersect: { kind: "intersect", of: [aId, bId], prefer?: "first"|"second", secondId?: string } — also handles line∩conic (a line/segment meeting an ellipse/parabola/hyperbola). common_tangent: { kind: "common_tangent", of: [circleId, circleId], which?: "external"|"internal"|"both", length? } — the common tangent line(s) of TWO circles, each with its two points of tangency (do NOT hand-place them). tangent_with_slope: { kind: "tangent_with_slope", on: circleId|conicId, slope: m, which?: "first"|"second"|"both", length? } — the tangent line(s) of a GIVEN slope m to a circle / ellipse / hyperbola (two) or parabola (one), with the exact point(s) of tangency (use for "the tangent to the parabola of slope 2" instead of hand-computing). triangle_center: { kind: "triangle_center", vertices: [a,b,c], type: "centroid"|"incenter"|"circumcenter"|"orthocenter" }. latus_rectum: { kind: "latus_rectum", conic: conicId, which?: "first"|"second"|"both" } — the focal chord(s) perpendicular to the axis of an existing conic. chord_of_contact: { kind: "chord_of_contact", conic: conicId|circleId, external: pointId } — from an external point to an existing conic OR circle, draws BOTH tangent lines, the two points of tangency, AND the chord joining them (the complete construction; do NOT hand-place tangent points or a bare chord line). For tangents from an external point to a conic/circle, use chord_of_contact (or tangents_from_external with on: conicId|circleId) instead of computing the touch points yourself. For an existing conic (its foci / vertices / directrices / asymptotes), use the derive-from-conic kinds conic_foci / conic_vertices / conic_directrix / conic_asymptotes with conic: conicId — do NOT hand-place those points or segments (the solver computes exact positions). To DRAW the conic curve itself, use ellipse: { kind: "ellipse", center: pointId, a: semiMajor, b: semiMinor, rotation?: deg } (x²/a²+y²/b²=1), parabola: { kind: "parabola", vertex: pointId, focalLength: a, opens: "right"|"left"|"up"|"down" } (y²=4ax), or hyperbola: { kind: "hyperbola", center: pointId, a: transverse, b: conjugate, rotation?: deg } (x²/a²−y²/b²=1) — NEVER approximate a conic with kind:"circle" (a circle of radius a draws the wrong shape for an ellipse/hyperbola).' + getGeometryStepKindsDescriptionTail(),
          items: { type: 'object' },
        },
        display: {
          type: 'object',
          properties: {
            grid: { type: 'boolean' },
            axes: { type: 'boolean' },
            viewRange: { type: 'object', properties: { x: { type: 'array', items: { type: 'number' } }, y: { type: 'array', items: { type: 'number' } } } },
            showCoords: { type: 'array', description: 'Point ids whose label should display "(x, y)".', items: { type: 'string' } },
            showLength: { type: 'array', description: 'Segment ids whose label should display the computed length.', items: { type: 'string' } },
            labels: { type: 'object', description: 'Override default label text per id.' },
            colors: { type: 'object', description: 'Override default color per id.' },
            dashed: { type: 'array', description: 'Segment ids to render dashed.', items: { type: 'string' } },
          },
        },
      },
      required: [],
    },
  },
  {
    name: 'show_unit_circle',
    description: '⚠️ DEPRECATED — prefer show_diagram(type: "unit_circle", params: { angleDegrees, showSinCos?, showRadians?, title? }) for the catalog-dispatched unit circle with full scribble + handwrite support. Display the unit circle with angle markers, reference triangles, and trig coordinates.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        highlightAngles: { type: 'array', items: { type: 'object', properties: { angle: { type: 'number' }, color: { type: 'string' }, showTriangle: { type: 'boolean' }, showCoords: { type: 'boolean' }, label: { type: 'string' } }, required: ['angle'] } },
        showAllStandard: { type: 'boolean' },
        showRadians: { type: 'boolean' },
        showDegrees: { type: 'boolean' },
        showArc: { type: 'object', properties: { from: { type: 'number' }, to: { type: 'number' }, color: { type: 'string' }, label: { type: 'string' } } },
      },
      required: [],
    },
  },
  {
    name: 'show_fraction_bar',
    description: 'Display fraction visualizations as bars, pie charts, or area grids.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        items: { type: 'array', items: { type: 'object', properties: { numerator: { type: 'number' }, denominator: { type: 'number' }, label: { type: 'string' }, highlightColor: { type: 'string' }, style: { type: 'string', enum: ['bar', 'circle', 'grid'] } }, required: ['numerator', 'denominator'] } },
        layout: { type: 'string', enum: ['vertical', 'horizontal'] },
        showComparison: { type: 'boolean' },
      },
      required: ['items'],
    },
  },
  {
    name: 'show_tree',
    description: 'Tree diagram (probability, factor, decision). Each child is an edge wrapper `{ label, probability?, node }` — the subtree lives under `node`. Leaves have `children: []` or omit children. Set `type: "probability"` for probability trees.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['probability', 'factor', 'decision', 'generic'] },
        root: { type: 'object', description: 'Recursive tree node: { label, value?, color?, children?: [{ label, probability?, node: TreeNode }] }. A child is an EDGE ({label, probability?, node}), not a bare node.' },
        showLeafProbabilities: { type: 'boolean' },
        direction: { type: 'string', enum: ['top-down', 'left-right'] },
      },
      required: ['root'],
    },
  },
  {
    name: 'show_venn_diagram',
    description: '2- or 3-set Venn diagram. Region keys (exact): 2-set uses "onlyA","onlyB","intersection","neither"; 3-set uses "onlyA","onlyB","onlyC","AB","AC","BC","ABC","neither". Sets map by declaration order (sets[0]=A). Region values: { value?: string, highlight?: boolean, items?: string[] }.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        sets: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, color: { type: 'string' } }, required: ['label'] } },
        regions: { type: 'object', description: 'Keys: 2-set → onlyA|onlyB|intersection|neither; 3-set → onlyA|onlyB|onlyC|AB|AC|BC|ABC|neither. Each value is {value?: string, highlight?: boolean, items?: string[]}.' },
        universalLabel: { type: 'string' },
      },
      required: ['sets', 'regions'],
    },
  },
  {
    name: 'show_matrix',
    description: 'Display a matrix with brackets, augmented lines, and row operations.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
        brackets: { type: 'string', enum: ['square', 'round', 'pipes', 'double-pipes'] },
        augmented: { type: 'number' },
        rowLabels: { type: 'array', items: { type: 'string' } },
        colLabels: { type: 'array', items: { type: 'string' } },
        rowOperations: { type: 'array', items: { type: 'object', properties: { description: { type: 'string' }, targetRow: { type: 'number' } } } },
        resultMatrix: { type: 'object', properties: { rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } }, brackets: { type: 'string' } } },
        operatorSymbol: { type: 'string' },
      },
      required: ['rows'],
    },
  },
  {
    name: 'show_try_yourself',
    description: 'Hand off a small problem for the student to try right now. Different from show_problem — this is mid-explanation, the student is expected to answer in the next turn (voice, scribble on the whiteboard, upload a picture of work, or tap an MCQ choice). Use this when you\'ve just explained a concept and want to check if it landed BEFORE moving on. Provide expectedAnswer so the engine can verify; provide hints in escalating order. Choose responseFormat="mcq" with choices for tap-to-answer; "frq" for free response; "numeric" for a single number.',
    parameters: {
      type: 'object',
      properties: {
        problem: { type: 'string', description: 'The problem the student should attempt. Keep short — 1-2 sentences.' },
        expectedAnswer: { type: 'string', description: 'The correct answer. The engine matches student responses against this.' },
        responseFormat: { type: 'string', enum: ['mcq', 'frq', 'numeric'] },
        choices: {
          type: 'array',
          description: 'Required when responseFormat="mcq". 2-4 options, exactly one correct.',
          items: { type: 'object', properties: { id: { type: 'string' }, text: { type: 'string' }, correct: { type: 'boolean' } }, required: ['id', 'text'] },
        },
        hints: {
          type: 'array',
          description: 'Hints in escalating specificity. The engine reveals them on demand.',
          items: { type: 'string' },
        },
        title: { type: 'string', description: 'Optional short header, e.g. "Your turn."' },
      },
      required: ['problem'],
    },
  },
  {
    name: 'show_segment_card',
    description: 'Render the CURRENT or a NAMED lesson-plan segment\'s authored problem / question card. Pass only the segment id; the runtime pulls the exact authored text from the lesson plan and renders it. Use this whenever the active lesson plan has authored content (try_yourself, worked_example, misconception_check, extension) — it is impossible for the rendered card to drift from the script with this tool, so prefer it over `show_problem` for any authored segment. Falls back to no-op if the segment id is unknown or the segment has no authored card.',
    parameters: {
      type: 'object',
      properties: {
        segmentId: { type: 'string', description: 'Stable id from the active lesson plan, e.g. "try-1", "worked-2".' },
      },
      required: ['segmentId'],
    },
  },
  {
    name: 'show_problem',
    description: 'Free-form problem card. Use ONLY when no authored segment exists for the problem you want to render — for any active lesson plan segment with authored text, prefer `show_segment_card({ segmentId })` so the card cannot drift from the script. `statement` carries the full problem text; `format` selects the presentation (multiple-choice cards require `answerChoices`).',
    parameters: {
      type: 'object',
      properties: {
        statement: { type: 'string', description: 'The full problem text as a single non-empty string. Wrap any math in inline single-dollar LaTeX ($x^2/9 + y^2/4 = 1$) — the card renders $…$ spans with KaTeX so the math matches the equation cards around it. Never use unicode math (x², √5) or display blocks (\\[…\\]); prose outside $…$ stays plain text.' },
        format: { type: 'string', enum: ['multiple-choice', 'grid-in', 'free-response', 'short-answer', 'true-false'], description: 'Problem format. The renderer currently distinguishes "grid-in" (numeric input grid) from everything else (which is rendered identically based on `answerChoices` presence). Use the correct value for semantic clarity even though the visual rendering is the same outside of grid-in.' },
        answerChoices: {
          type: 'array',
          description: 'Required when format is "multiple-choice".',
          items: { type: 'object', properties: { letter: { type: 'string' }, text: { type: 'string' } }, required: ['letter', 'text'] },
        },
        title: { type: 'string' },
        givens: {
          type: 'array',
          description: 'Named given quantities shown under the statement.',
          items: { type: 'object', properties: { symbol: { type: 'string' }, value: { type: 'string' }, unit: { type: 'string' } }, required: ['symbol', 'value'] },
        },
        source: { type: 'string', description: 'Test/exam provenance tag (e.g. test name + section).' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
        expectedAnswer: { type: 'string', description: 'REQUIRED whenever YOU authored this problem (improvised / off-the-bank) or the student brought it and you derived its answer: the bare final answer only (e.g. "1/32" or "B"). NEVER shown to the student — the runtime strips it before rendering, independently solves the problem fresh-context, and when your answer verifies, pins it so grading stays consistent for the whole attempt. Omit ONLY when quoting generate_problem\'s canonicalText verbatim (that answer is already verified).' },
      },
      required: ['statement', 'format'],
    },
  },
  {
    name: 'show_diagram',
    description: 'Structured diagrams from the catalog. Pick a kind that fits the concept; the solver validates params and the renderer draws. Do not invent kinds — only use the listed enum. Legacy kinds (circular-path, pipe-flow, fluid-flow, continuity) remain supported. There is NO boxplot kind here: a boxplot / dotplot / five-number-summary visual goes through show_stats (type: "boxplot"), NEVER a number_line with quartile-labeled dots — an improvised number-line "boxplot" lacks the box/whisker/outlier chrome and misteaches the concept (live failure, 2026-07-25).',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            // Catalog kinds
            'number_line', 'equation_balance', 'tape_diagram', 'fraction_comparison',
            'area_model', 'pie_chart', 'bar_chart', 'line_plot',
            'balance_scale', 'lever', 'pulley_system', 'inclined_plane', 'spring_mass',
            'pendulum', 'simple_circuit', 'wave_diagram', 'ray_diagram_lens',
            'ray_diagram_mirror', 'vector_addition',
            'electron_configuration', 'orbital_diagram', 'periodic_table_highlight',
            'punnett_square', 'life_cycle', 'water_cycle', 'rock_cycle', 'body_system',
            'phases_of_moon', 'solar_system', 'earth_layers', 'eclipse_diagram',
            'seasons_diagram', 'plate_tectonics',
            'geologic_cross_section', 'hr_diagram', 'volcano_cross_section', 'atmosphere_layers',
            'flowchart_simple', 'state_machine', 'binary_tree', 'truth_table', 'logic_gate',
            'unit_circle', 'transformation', 'inequality_graph',
            'sentence_diagram', 'argument_structure', 'historical_timeline',
            'government_branches',
            'comparison_table', 't_chart', 'kwl_chart', 'frayer_model', 'hierarchy_pyramid',
            // Phase 9 — economics
            'production_possibilities', 'business_cycle', 'aggregate_demand_supply',
            'money_market', 'loanable_funds', 'phillips_curve', 'foreign_exchange_market',
            // Phase 10 — calculus (AP Calc BC)
            'riemann_sum', 'slope_field', 'parametric_curve', 'polar_graph', 'taylor_polynomial_overlay',
            // Phase 11 — statistics (AP Statistics)
            'histogram', 'normal_curve', 'scatterplot_regression',
            // Phase 12 — environmental / demographic (AP Env Sci, AP Human Geo, AP Macro)
            'population_pyramid', 'climate_diagram',
            // Phase 13 — biogeochemical cycles + labeled anatomy (AP Env Sci, AP Psych/Bio)
            'nutrient_cycle', 'neuron_diagram', 'brain_regions',
            // Phase 14 — conic sections
            'conic_sections',
            // Phase 15 — 3D / spatial figures
            'solid_of_revolution', 'solid_3d', 'vectors_3d', 'vsepr_geometry', 'field_lines', 'phase_diagram',
            'heart_diagram', 'photosynthesis', 'cellular_respiration',
            // Phase 17 — wavefront / 2D wave patterns
            'doppler_effect', 'standing_wave', 'interference_pattern',
            // Phase 18 — cell biology / genetics
            'mitosis', 'meiosis', 'dna_replication', 'cell_membrane',
            // Phase 19 — chemistry
            'bohr_model', 'galvanic_cell', 'titration_curve', 'crystal_lattice',
            // Phase 20 — nuclear / electromagnetism / kinematics
            'nuclear_decay', 'em_induction', 'magnetic_field_current', 'projectile_motion',
            // Phase 20 — bio anatomy / physiology
            'leaf_cross_section', 'nephron', 'digestive_system', 'circulatory_system',
            // Phase 22 — computer science (data structures + algorithms)
            'data_structure', 'graph_diagram', 'hash_table', 'recursion_tree',
            // Phase 23 — molecular / cell biology (life science, Biology, AP Bio)
            'protein_synthesis', 'enzyme_action', 'cell_cycle', 'gene_expression',
            // Phase 25 — elementary-math manipulatives (K-3)
            'clock_face', 'ten_frame', 'base_ten_blocks',
            // Phase 26 — microeconomics
            'supply_demand', 'circular_flow',
            // Phase 27 — biology (respiratory / botany / ecology)
            'respiratory_system', 'flower_structure', 'energy_pyramid',
            // Phase 28 — advanced math (Argand) + ELA (Freytag)
            'complex_plane', 'plot_diagram',
            // Phase 29 — biology (sense-organ cross-sections)
            'eye_cross_section', 'ear_cross_section',
            // Phase 30 — chemistry (pH scale)
            'ph_scale',
            // Phase 31 — microeconomics
            'game_theory_matrix', 'elasticity', 'comparative_advantage',
            // Phase 32 — coordinate grid (math) + rhetorical triangle (ELA)
            'coordinate_grid', 'rhetorical_triangle',
            // Phase 33 — sorting steps (CS) + Lorenz curve (econ) + character web (ELA)
            'sorting_steps', 'lorenz_curve', 'character_web',
            // Legacy kinds (existing behavior)
            'circular-path', 'pipe-flow', 'fluid-flow', 'continuity',
          ],
        },
        params: {
          type: 'object',
          description: 'Kind-specific parameters. The solver for each kind validates these — see the catalog block in the system context for each kind\'s schema.',
        },
      },
      required: ['type', 'params'],
    },
  },
  // show_sketch — rough hand-drawn doodle for visual/spatial analogies.
  // Gated on TUTOR_SKETCH (server-side): the tool only exists for the brain
  // when the flag is on, so A/B + rollback are a server-restart away. See
  // project_tutor_sketch_capability.
  ...((process.env.TUTOR_SKETCH === 'true'
    ? [{
        name: 'show_sketch',
        description:
          "Draw a quick, rough HAND-DRAWN doodle to make a real-world ANALOGY or concrete mental image click — the kind a teacher scribbles on a whiteboard to build intuition for an abstract idea. You describe WHAT to draw in one line; the system draws it. This tool CANNOT render math accurately — it is freehand and approximate. Do NOT use it for any curve, function, graph, plotted relationship, data trend, or exact geometric figure: those go to show_function_graph / show_geometry / show_diagram, which draw them precisely. It also cannot draw a 3D solid or a sliced solid (a cone, a sliced cone), or a detailed labeled diagram (a neuron, the brain, a cell): use the matching show_diagram catalog kind instead (e.g. conic_sections for the sliced-cone figure, neuron_diagram, brain_regions). It is ALSO wrong for a physics/technical figure with a canonical form — wavefronts / the Doppler effect, interference, standing waves, field lines, a spring-mass or pulley system, a ray diagram, a circuit: those have precise show_diagram catalog kinds (e.g. doppler_effect, interference_pattern, standing_wave, wave_diagram, field_lines, ray_diagram_lens, spring_mass) that draw them correctly; a freehand scribble of them reads as a blob. And do not sketch a SPECIFIC real object that must be recognizable (a roller coaster, a car, a microscope, an animal). A doodled mathematical or technical figure is wrong and misleads the student. Reach for show_sketch only when the depiction is illustrative intuition or a real-world analogy, not a precise or canonical figure. BEWARE the analogy that is secretly a GRAPH: if the picture you want reduces to a curve plus straight lines whose SLOPES carry the meaning — a hiker's trail with an average-slope line (Mean Value Theorem), a hill with a tangent, height/speed/anything vs time or distance — that is a function graph wearing a costume. Draw it with show_function_graph (label the curve and lines in friendly words, e.g. 'the trail', 'average slope') so the slopes are actually true; a freehand version of it is exactly the misleading math doodle this tool forbids.",
        parameters: {
          type: 'object',
          properties: {
            concept: {
              type: 'string',
              description:
                'One vivid line describing the drawing, e.g. "a ball rolling down a curved hill to its lowest, most stable resting point".',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Short text labels to place on the doodle, e.g. ["high energy","stable"]. Optional.',
            },
            title: {
              type: 'string',
              description: 'Short caption / figure title (also used to evolve the same sketch in place). Optional.',
            },
          },
          required: ['concept'],
        },
      }]
    : []) as ToolDefinition[]),
  // show_image was removed 2026-04-30 — brain hallucinated URLs
  // (notably plausible-looking Wikimedia paths that don't exist),
  // and prompt-side "only use URLs you're confident exist" guidance
  // didn't constrain the model. Use show_diagram, show_geometry,
  // show_cell_diagram, etc. — the catalog of structured renderers
  // covers the legitimate "I want a real image here" cases without
  // letting the brain author URLs.
  {
    name: 'show_solution',
    description: 'GATE — READ FIRST: Reserved for walk-through mode AFTER the student has insisted on being walked through TWICE within the same problem (see Rule 4 and "Socratic Method First" in the system prompt). On a FIRST "show me the steps" / "walk me through it" / "just show me how" / "show me the calculation" / "explain how you got that" request, do NOT call this tool. Instead: acknowledge warmly, ensure the setup is on the board, and ask ONE guiding question about the first step ("What formula would you start with?"). Then wait. Calling show_solution on a first ask — even when the student says "show me the steps" — is a documented teaching failure that strips the student of their own thinking. Only after a SECOND insistence ("no, just walk me through it", "I said show me, don\'t ask") may you call this tool. Once the gate is satisfied: displays a structured multi-step solution card with numbered steps. Each step has a description and optionally an equation, substitution, result, and short explanation.',
    parameters: {
      type: 'object',
      properties: {
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              stepNumber: { type: 'number' },
              description: { type: 'string', description: 'What is being done in this step, in plain words.' },
              equation: { type: 'string', description: 'Primary equation for this step in LaTeX.' },
              substitution: { type: 'string', description: 'Equation with values substituted in, LaTeX.' },
              result: { type: 'string', description: 'Result of this step, LaTeX.' },
              explanation: { type: 'string', description: 'Optional short "why" sentence.' },
            },
            required: ['stepNumber', 'description'],
          },
        },
      },
      required: ['steps'],
    },
  },
  {
    name: 'show_worked_example',
    description: 'Display a complete worked example with an optional problem statement, a walkthrough of numbered steps (each with what the tutor says and an optional check question), and optional key takeaways. Use this for canonical examples the student can review — e.g. "Let me show you one fully worked example, then you try a similar one."',
    parameters: {
      type: 'object',
      properties: {
        example: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            problem: {
              type: 'object',
              properties: { statement: { type: 'string', description: 'Problem text. Wrap any math in inline single-dollar LaTeX ($…$) — rendered with KaTeX; never unicode math or display blocks.' } },
              required: ['statement'],
            },
            walkthrough: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  step: { type: 'number' },
                  tutorSays: { type: 'string' },
                  checkQuestion: { type: 'string' },
                },
                required: ['step', 'tutorSays'],
              },
            },
            keyTakeaways: { type: 'array', items: { type: 'string' } },
          },
          required: ['walkthrough'],
        },
      },
      required: ['example'],
    },
  },
  {
    name: 'highlight',
    description: 'Display a short highlight / note card — a boxed message for emphasis or a gentle warning. Use sparingly, for "key idea" callouts or cautions like "watch the sign here".',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The message to highlight.' },
        style: { type: 'string', enum: ['highlight', 'warning', 'note'], description: 'Visual style — highlight (yellow), warning (red), note (gray).' },
      },
      required: ['text'],
    },
  },
  {
    name: 'annotate',
    description: 'Add a standalone text card to the whiteboard — a labeled note or brief commentary. Different from highlight: annotate is for running commentary while you solve; highlight is for key-idea callouts.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The annotation text.' },
        style: { type: 'string', enum: ['default', 'highlight', 'warning'] },
      },
      required: ['text'],
    },
  },
  {
    name: 'draw_vector',
    description: 'Single labeled vector arrow from one coordinate to another. For multiple vectors or full physics diagrams, use show_vector or show_free_body_diagram instead.',
    parameters: {
      type: 'object',
      properties: {
        from: {
          type: 'object',
          properties: { x: { type: 'number' }, y: { type: 'number' } },
          required: ['x', 'y'],
        },
        to: {
          type: 'object',
          properties: { x: { type: 'number' }, y: { type: 'number' } },
          required: ['x', 'y'],
        },
        label: { type: 'string' },
        color: { type: 'string' },
      },
      required: ['from', 'to'],
    },
  },
  {
    name: 'clear',
    description: 'Clear the whiteboard and return to the first page. Use sparingly — the runtime already lays out pages automatically (you do not need to manage pages). Only clear when the board is genuinely cluttered AND the student explicitly asks for a fresh start.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'show_timeline',
    description: '⚠️ DEPRECATED — prefer `show_diagram(type: "historical_timeline", params: { events: [{date, label, description?, color?}], title? })`. The catalog version registers each event as a scribbleable feature so tutor_scribble can mark a specific event. This legacy tool stays for backward-compat only — do NOT pick it for new emissions. Horizontal timeline of dated events. Numeric / parseable date strings auto-space by year (supports BCE via negative years or "500 BCE"); unparseable strings fall back to even spacing. `category` color-groups events.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', description: 'Freeform date string, e.g. "1776", "1492 CE", "500 BCE", "Jan 1, 1776".' },
              title: { type: 'string', description: 'Short event name — keep under ~5 words for readability.' },
              description: { type: 'string', description: 'Optional longer note. Currently not rendered on the timeline itself; reserved for future detail panel.' },
              category: { type: 'string', description: 'Optional bucket label for color-grouping related events (e.g. "Wars", "Treaties", "Inventions").' },
              color: { type: 'string', description: 'Optional explicit color override.' },
            },
            required: ['date', 'title'],
          },
        },
      },
      required: ['events'],
    },
  },
  {
    name: 'show_map',
    description: 'Display a map with real country outlines (Natural Earth) and pins at specific cities / states. ALWAYS pass `lat` and `lon` (real latitude/longitude) on each pin — the renderer projects them onto the active preset automatically, so Cairo, Paris, Houston, etc. land on the correct country. Only fall back to `x`/`y` (0–100 normalized) for abstract labels that have no real lat/lon.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        background: {
          type: 'string',
          enum: ['blank', 'world', 'north-america', 'south-america', 'europe', 'asia', 'africa', 'australia', 'usa', 'india', 'china', 'middle-east', 'mediterranean'],
          description: 'Choose the preset whose bounding box contains the cities you want to show.',
        },
        pins: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              lat: { type: 'number', description: 'Real latitude (preferred). Positive = north.' },
              lon: { type: 'number', description: 'Real longitude (preferred). Positive = east.' },
              x: { type: 'number', description: 'Fallback: 0–100 normalized x. Ignored when lat/lon are set.' },
              y: { type: 'number', description: 'Fallback: 0–100 normalized y.' },
              label: { type: 'string' },
              color: { type: 'string' },
            },
            required: ['label'],
          },
        },
        regions: {
          type: 'array',
          description: 'Optional highlighted areas — use `points` ("x,y x,y x,y") in the 0–100 system for polygon regions, or `path` for raw SVG path data in the underlying 600x400 coordinate system.',
          items: {
            type: 'object',
            properties: {
              points: { type: 'string' },
              path: { type: 'string' },
              label: { type: 'string' },
              color: { type: 'string' },
            },
          },
        },
        caption: { type: 'string' },
      },
      required: [],
    },
  },
  {
    name: 'show_circuit',
    description: 'Schematic circuit diagram from a netlist of components. Each component has type, from-node, to-node, and optional value/unit/label. The renderer auto-places nodes and draws IEEE symbols. NETLIST CONVENTION: components in parallel between the SAME two terminals must reference the SAME two node names. If R1 and R2 are wired in parallel across the battery, all four endpoint references (R1.from, R1.to, R2.from, R2.to) must be drawn from the same pair of node strings as the battery — otherwise the renderer treats the branches as separate disconnected sub-circuits. Use a single node string per electrical junction; do NOT invent fresh node names for each branch.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        components: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['resistor', 'capacitor', 'inductor', 'battery', 'wire', 'switch-open', 'switch-closed', 'bulb', 'voltmeter', 'ammeter', 'galvanometer', 'ground'],
              },
              from: { type: 'string' },
              to: { type: 'string' },
              value: { type: 'string', description: 'Numeric magnitude only (no units).' },
              unit: { type: 'string', description: 'Unit symbol only.' },
              label: { type: 'string', description: 'Variable name only — do NOT include the value or unit.' },
            },
            required: ['type', 'from', 'to'],
          },
        },
        showNodes: { type: 'boolean' },
      },
      required: ['components'],
    },
  },
  {
    name: 'show_lewis',
    description: '2D Lewis dot structure: atoms with lone-pair dots, bonds (single/double/triple), and optional formal charges. Atom coordinates are in a 0–100 normalized space. For 3D molecular models from SMILES, use show_molecule instead.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        formula: { type: 'string', description: 'Molecular formula shown above the structure (e.g., "H2O", "CO2").' },
        atoms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Unique identifier used by bonds.' },
              element: { type: 'string', description: 'Element symbol with optional charge, e.g. "C", "O", "N", "H", "Na+", "Cl-".' },
              x: { type: 'number', description: '0–100.' },
              y: { type: 'number', description: '0–100.' },
              lonePairs: { type: 'number', description: 'Number of lone pairs to draw (e.g. 2 for oxygen in water, 1 for nitrogen in ammonia).' },
              formalCharge: { type: 'number', description: 'Formal charge, e.g. +1, -1, +2.' },
            },
            required: ['id', 'element', 'x', 'y'],
          },
        },
        bonds: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string', description: 'Atom id.' },
              to: { type: 'string', description: 'Atom id.' },
              order: { type: 'number', enum: [1, 2, 3], description: 'Bond order: 1 = single, 2 = double, 3 = triple.' },
              style: { type: 'string', enum: ['solid', 'dashed', 'wedge', 'dash-wedge'] },
            },
            required: ['from', 'to', 'order'],
          },
        },
        geometry: { type: 'string', description: 'Optional geometry label shown below, e.g. "bent", "trigonal planar", "tetrahedral".' },
      },
      required: ['atoms'],
    },
  },
  {
    name: 'show_early_math',
    description: 'K-2 / K-5 visual primitives — pick `kind` from: place_value (base-10 blocks: hundreds/tens/ones), ten_frame (5×2 dot grid for early number sense), array (rows×cols dots for multiplication intro), skip_count (number line with hop arcs), bar_model (Singapore-style tape diagram for word problems). One tool, five shapes; all share a small-canvas, large-font, picture-heavy register appropriate for K-2 / K-5. Pick this over the dense math tools when the student is in the lower grades or the concept is being introduced for the first time.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['place_value', 'ten_frame', 'array', 'skip_count', 'bar_model'] },
        title: { type: 'string', description: 'Optional short header.' },
        // place_value
        hundreds: { type: 'number' },
        tens: { type: 'number' },
        ones: { type: 'number' },
        showCount: { type: 'boolean' },
        // ten_frame
        count: { type: 'number', description: 'For ten_frame: how many cells to fill (0–total).' },
        total: { type: 'number', description: 'For ten_frame: total cells (default 10).' },
        // array
        rows: { type: 'number' },
        cols: { type: 'number' },
        showProduct: { type: 'boolean' },
        // skip_count
        from: { type: 'number' },
        step: { type: 'number' },
        stops: { type: 'number' },
        maxLabel: { type: 'number' },
        // bar_model — `value` accepts number or string ("?"); leave the
        // schema loose since JSON Schema's mixed-type form is rejected by
        // some tool runtimes and the renderer tolerates either at runtime.
        whole: { type: 'object', properties: { value: { type: 'string' }, label: { type: 'string' } } },
        parts: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' }, label: { type: 'string' }, color: { type: 'string' } } } },
        question: { type: 'string' },
      },
      required: ['kind'],
    },
  },
  {
    name: 'show_phonics',
    description: 'Phonics visualizations for K-2 reading: sound_out (each grapheme in a colored box), syllables (word split with break dots, optional stressed syllable), blend (word with leading consonant cluster underlined). Pick `kind` and pass the relevant fields. Color-coding: vowels red, consonants blue, digraphs purple, silent letters gray.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['sound_out', 'syllables', 'blend'] },
        title: { type: 'string' },
        word: { type: 'string', description: 'Whole word — used by sound_out and blend.' },
        graphemes: {
          type: 'array',
          description: 'For sound_out: ordered list of orthographic units. A digraph like "ch" is one entry. Defaults to one entry per character.',
          items: { type: 'object', properties: { text: { type: 'string' }, type: { type: 'string', enum: ['consonant', 'vowel', 'digraph', 'silent'] } } },
        },
        phonetic: { type: 'string', description: 'Optional IPA-ish transcription shown below for sound_out.' },
        syllables: { type: 'array', description: 'For syllables: ["but", "ter", "fly"].', items: { type: 'string' } },
        stressed: { type: 'number', description: 'For syllables: 0-based index of the stressed syllable.' },
        cluster: { type: 'string', description: 'For blend: the consonant cluster to highlight, e.g. "st".' },
        clusterStart: { type: 'number', description: 'For blend: where the cluster starts in the word (default = first occurrence).' },
      },
      required: ['kind'],
    },
  },
  {
    name: 'show_graphic_organizer',
    description: 'ELA / writing graphic organizers: story_map (character/setting/problem/solution), kwl (Know/Want/Learned columns), t_chart (two columns with headers), sequence (horizontal arrow chain of steps), cause_effect (cause boxes → arrows → effect boxes). One tool, five layouts.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['story_map', 'kwl', 't_chart', 'sequence', 'cause_effect'] },
        title: { type: 'string' },
        // story_map
        character: { type: 'string' },
        setting: { type: 'string' },
        problem: { type: 'string' },
        solution: { type: 'string' },
        // kwl
        know: { type: 'array', items: { type: 'string' } },
        want: { type: 'array', items: { type: 'string' } },
        learned: { type: 'array', items: { type: 'string' } },
        // t_chart
        leftHeader: { type: 'string' },
        rightHeader: { type: 'string' },
        leftItems: { type: 'array', items: { type: 'string' } },
        rightItems: { type: 'array', items: { type: 'string' } },
        // sequence
        steps: { type: 'array', items: { type: 'string' } },
        // cause_effect
        causes: { type: 'array', items: { type: 'string' } },
        effects: { type: 'array', items: { type: 'string' } },
      },
      required: ['kind'],
    },
  },
  {
    name: 'show_labeled_image',
    description: 'A real photograph. Different from the synthesized-diagram tools (cell_diagram, dna, ray_diagram, etc.) — those draw schematic vector art; this shows an actual photograph. Use ONLY for concepts where a real photo carries information a diagram can\'t (e.g., a real flower, a place, a piece of lab apparatus, a historical artifact, an animal in its habitat).\n\nDO NOT use for diagrams, schematic illustrations, anatomical figures, molecular structures, microscopic structures, or anything that would normally be DRAWN rather than PHOTOGRAPHED. Stock-photo search providers return literal-keyword matches for queries like "phospholipid bilayer diagram" or "cell membrane anatomy" — the top result is usually a random photo of a person whose alt text happened to contain the keyword. For those cases use show_diagram, show_svg_diagram, or one of the synthesized-diagram tools. If the desired visual is conceptual / schematic rather than photographic, DO NOT call show_labeled_image at all.\n\nIMPORTANT — how the image is sourced:\n- STRONGLY PREFER `query`: a short visual-content phrase describing the PHOTOGRAPHED subject ("monarch butterfly on flower", "great wall of china", "wolves in forest"). The server resolves the query against Unsplash → Pixabay → Pexels.\n- Use `src` (legacy) ONLY when you have a known-good public URL — e.g., a NASA images-assets URL or a partner-supplied photo. NEVER guess a URL: hallucinated photo IDs may load but show unrelated images.\n- Provide one of `query` OR `src`. If both are present, `query` wins.\n- The server rejects queries that contain diagram-shaped words ("diagram", "schematic", "labeled", "anatomy", "structure of", "bilayer", etc.). If your query needs those words you wanted a diagram tool, not this one.\n- The server drops the call silently when the query returns no relevant image; your spoken narration alone carries the moment.\n\nIMPORTANT — callouts:\n- ONLY provide `callouts` when using `src` with a KNOWN image (e.g., a specific NASA photo you can reason about). You can place x/y percent coordinates on a known image; you cannot on a `query`-resolved image because you have not seen it.\n- DO NOT provide `callouts` when using `query`. The server will strip them. Your verbal narration should describe what the picture shows in general terms; do not reference specific positions ("on the left", "at the bottom") since those depend on the resolved image.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        query: {
          type: 'string',
          description: 'Short visual-content phrase the server will search for (e.g. "monarch butterfly on flower", "great wall of china", "human heart anatomy"). Focus on the depicted subject, not the lesson topic. Prefer this over `src`.',
        },
        src: {
          type: 'string',
          description: 'Legacy: public image URL (https). Use ONLY when you have a known-good URL (e.g., NASA images-assets, partner asset). DO NOT guess Unsplash/Pixabay URLs — use `query` instead.',
        },
        alt: { type: 'string', description: 'Alt text — required.' },
        credit: { type: 'string', description: 'Attribution / credit shown below the image. Optional when using `query` — the server fills it from the provider\'s metadata.' },
        callouts: {
          type: 'array',
          description: 'Labels to overlay. Each callout has x/y as percentages of the image dimensions.',
          items: {
            type: 'object',
            properties: {
              x: { type: 'number', description: '0-100 percent of image width.' },
              y: { type: 'number', description: '0-100 percent of image height.' },
              text: { type: 'string', description: 'Short label.' },
              caption: { type: 'string', description: 'Optional longer caption shown smaller below the label.' },
              color: { type: 'string' },
            },
            required: ['x', 'y', 'text'],
          },
        },
      },
      required: ['alt'],
    },
  },
  {
    name: 'show_solved_example',
    description: 'A standalone worked-example artifact — different from show_solution (conversational step narration) and show_problem (problem only). Pedagogically: "Example 1" boxes that the student studies BEFORE attempting a try-yourself. Includes problem, ordered steps with optional reasoning, boxed final answer, and an optional "key idea" takeaway.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        problem: { type: 'string', description: 'The problem statement. Inline LaTeX `$...$` supported.' },
        steps: {
          type: 'array',
          description: 'Ordered solution steps.',
          items: {
            type: 'object',
            properties: {
              expression: { type: 'string', description: 'The math / action for this step.' },
              reason: { type: 'string', description: 'Optional one-line reasoning shown to the right.' },
            },
            required: ['expression'],
          },
        },
        answer: { type: 'string', description: 'Final answer, shown boxed.' },
        keyIdea: { type: 'string', description: 'Optional one-line takeaway / "what you should remember".' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      },
      required: ['problem', 'steps', 'answer'],
    },
  },
  {
    name: 'show_quiz',
    description: 'A small embedded quiz (1-5 items) the student works through on their own with auto-scoring. Different from show_problem (single problem, brain-driven) and show_try_yourself (mid-explanation hand-off). Use at end-of-segment or end-of-session to check retention. Items can mix mcq / frq / numeric formats.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Unique within the quiz. Used as the choice id for mcq.' },
              question: { type: 'string' },
              format: { type: 'string', enum: ['mcq', 'frq', 'numeric'] },
              choices: {
                type: 'array',
                description: 'For mcq. Exactly one should have correct: true.',
                items: {
                  type: 'object',
                  properties: { id: { type: 'string' }, text: { type: 'string' }, correct: { type: 'boolean' } },
                  required: ['id', 'text'],
                },
              },
              expectedAnswer: { type: 'string', description: 'For frq / numeric.' },
              tolerance: { type: 'number', description: 'For numeric, default 0.01.' },
              explanation: { type: 'string', description: 'Shown after submit.' },
            },
            required: ['id', 'question', 'format'],
          },
        },
        immediate: { type: 'boolean', description: 'Grade as student answers vs. require a Submit click.' },
      },
      required: ['items'],
    },
  },
  {
    name: 'show_writing_frame',
    description: 'Writing scaffolds: sentence_stems (numbered list of starter prompts on dashed lines), paragraph_frame (topic-sentence + 3 details + closing labelled boxes), five_paragraph (intro/body1/body2/body3/conclusion stack with thesis & topic-sentence hints). The student writes in the blanks; the brain reads via the existing extract-homework path.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['sentence_stems', 'paragraph_frame', 'five_paragraph'] },
        title: { type: 'string' },
        stems: { type: 'array', description: 'For sentence_stems: list of starter phrases.', items: { type: 'string' } },
        topicSentenceHint: { type: 'string' },
        detailHints: { type: 'array', items: { type: 'string' } },
        closingHint: { type: 'string' },
        thesisHint: { type: 'string' },
        bodyTopics: { type: 'array', description: 'For five_paragraph: 1-3 topic-sentence hints for the body paragraphs.', items: { type: 'string' } },
      },
      required: ['kind'],
    },
  },
  {
    name: 'show_run_code',
    description: 'Run code against tests in a sandbox and render pass/fail per test plus captured stdout. Two languages supported: JavaScript (default — runs server-side via node:vm with `tests[]` of {input, expected}) and Python (set `language: "python"` — runs IN THE STUDENT\'S BROWSER via Pyodide; numpy/pandas/sympy preloaded; tests are `test_*` functions embedded in the source itself, pytest-style). First Python use in a session triggers a one-time ~7-15 MB download (cached afterward). 5-15 second timeout cap.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        code: { type: 'string', description: 'The code to run. JS: must define a top-level function named "solve" unless `entry` overrides it. Python: include any pytest-style test functions inline (e.g. `def test_add(): assert add(2,3) == 5`); the runtime discovers and runs every top-level callable named `test_*`.' },
        entry: { type: 'string', description: 'JS only: function name to invoke per test (default "solve"). Ignored for Python.' },
        language: { type: 'string', enum: ['javascript', 'js', 'python', 'py', 'python3'], description: 'Default "javascript". Set to "python" to use the in-browser Pyodide sandbox.' },
        tests: {
          type: 'array',
          description: 'JS only — test cases. Empty array runs the code once with no tests (useful for "see what this prints"). For Python, embed `test_*` functions in `code` instead.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Test name shown to the student.' },
              input: { type: 'array', description: 'Positional args passed to the entry function.' },
              expected: { type: 'string', description: 'Expected return value (deep-equality compared). Pass any JSON-serializable value; the schema is loose-string here for compatibility but runtime accepts the value as-is.' },
            },
          },
        },
        timeoutMs: { type: 'number', description: 'Max execution time in ms. JS capped to 5000; Python capped to 15000.' },
      },
      required: ['code'],
    },
  },
  {
    name: 'show_dimensional_check',
    description: 'Render a physics formula or expression with DETERMINISTIC dimensional verification. Two modes: (a) pass `formula` like "F = m·a" — both sides parsed, dimensions compared, mismatch flagged ("M·L·T⁻² ≠ M·L"); (b) pass `expression` like "m v² / r" + `expectedUnit` like "N" — expression parsed, computed dimensions compared against the named unit. PREFER THIS over writing a formula into show_equation when there\'s any chance of a units mistake — forgetting a square ("KE = m·v"), missing a denominator ("F = m·v"), confusing energy and power, etc. Recognized symbols include the standard physics letters (m, v, a, F, E, K, U, p, P, q, V, R, ω, …). Recognized units include SI base + N, J, W, Pa, Hz, V, Ω, m/s, m/s².',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        formula: { type: 'string', description: 'Mode A: a formula with "=", e.g. "F = m·a", "T = 2π√(L/g)".' },
        expression: { type: 'string', description: 'Mode B: a single expression to check against expectedUnit.' },
        expectedUnit: { type: 'string', description: 'Mode B: target unit name from the recognized set (N, J, W, Pa, Hz, V, Ω, m/s, m/s², s, m, kg, A, C).' },
        note: { type: 'string', description: 'Optional one-line note shown below.' },
      },
      required: [],
    },
  },
  {
    name: 'show_balanced_equation',
    description: 'Render a chemical equation balanced DETERMINISTICALLY. You provide the unbalanced equation as a string ("Fe + O2 -> Fe2O3" or "C3H8 + O2 -> CO2 + H2O" — coefficients ignored / recomputed). The solver parses formulas (parentheses + subscripts supported), builds the conservation matrix, and computes smallest positive-integer coefficients. Output is the balanced equation rendered with subscripts. PREFER THIS over writing balanced equations into show_equation by hand — the brain frequently miscounts atoms in non-trivial reactions (combustion of larger hydrocarbons, redox, etc.). Errors propagate cleanly: if the equation is structurally unbalanceable (different elements on each side, missing terms), the solver throws a specific message the brain can react to.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Optional header, defaults to "Balanced equation".' },
        equation: { type: 'string', description: 'Unbalanced (or partially balanced) equation. Use " -> ", " → ", or " = " between reactants and products. Existing coefficients are stripped.' },
        reactionType: { type: 'string', description: 'Optional category label shown below: "synthesis", "decomposition", "single replacement", "double replacement", "combustion", "redox", "neutralization".' },
        note: { type: 'string', description: 'Optional follow-up note shown below the equation.' },
      },
      required: ['equation'],
    },
  },
  {
    name: 'show_lewis_constructed',
    description: 'PREFER THIS over show_lewis whenever you can describe the molecule by atoms + bonds (which is most of the time). You declare atoms by element, bonds by atom-id pair + order; the solver places atoms via auto-layout, derives lone-pair counts from valence (no need to count electrons yourself), and validates octet/duet rules. The brain is freed from coordinate placement and electron arithmetic — both are documented frequent failure modes. Reserve show_lewis for cases where you need explicit pixel control (resonance arrows mid-structure, expanded octets you want to assert manually, etc.).',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        formula: { type: 'string', description: 'Molecular formula shown above the structure (e.g., "H2O", "CO2"). Optional but pedagogically useful.' },
        geometry: { type: 'string', description: 'Optional VSEPR label, e.g. "bent", "trigonal planar", "tetrahedral".' },
        atoms: {
          type: 'array',
          description: 'Atoms in the molecule. Element is the standard symbol (H, He, Li-Ar, K, Ca, Br, Kr, I, Xe). formalCharge optional (+1, -1, etc.). x/y override auto-layout in the rare case you want to.',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              element: { type: 'string' },
              formalCharge: { type: 'number' },
              x: { type: 'number' },
              y: { type: 'number' },
              lonePairs: { type: 'number', description: 'Override the solver-computed lone-pair count. Almost always omit this.' },
            },
            required: ['id', 'element'],
          },
        },
        bonds: {
          type: 'array',
          description: 'Bonds. order ∈ {1, 2, 3} for single/double/triple.',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'string' },
              order: { type: 'number', enum: [1, 2, 3] },
              style: { type: 'string', enum: ['solid', 'dashed', 'wedge', 'dash-wedge'] },
            },
            required: ['from', 'to', 'order'],
          },
        },
        layout: {
          type: 'string',
          enum: ['auto', 'linear', 'trigonal', 'tetrahedral', 'tetrahedral-around'],
          description: '"auto" picks a sensible shape from the bond graph (default). "linear" for CO2-like; "trigonal" for BF3-like; "tetrahedral-around" needs centerAtomId.',
        },
        centerAtomId: { type: 'string', description: 'Required for layout="tetrahedral-around"; ignored otherwise.' },
        skipValidation: { type: 'boolean', description: 'Skip octet/duet checks. Use only for radicals or expanded octets.' },
      },
      required: ['atoms', 'bonds'],
    },
  },
  {
    name: 'show_periodic_table',
    description: 'Full periodic table (118 elements, standard group/period layout, colored by category). Highlight options: `highlight` (specific symbols), `highlightGroup` (column 1–18), `highlightPeriod` (row 1–7), `highlightCategory` (all of one category). `showMass` adds atomic masses.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        highlight: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              symbol: { type: 'string', description: 'Element symbol e.g. "Na", "Cl", "Fe".' },
              color: { type: 'string' },
              note: { type: 'string', description: 'Short note shown in a list below the table.' },
            },
            required: ['symbol'],
          },
        },
        highlightGroup: { type: 'number', description: 'Highlight a full group (column 1–18).' },
        highlightPeriod: { type: 'number', description: 'Highlight a full period (row 1–7).' },
        highlightCategory: {
          type: 'string',
          enum: ['alkali', 'alkaline-earth', 'transition', 'post-transition', 'metalloid', 'reactive-nonmetal', 'halogen', 'noble-gas', 'lanthanide', 'actinide'],
        },
        showMass: { type: 'boolean', description: 'Show atomic mass on each tile. Default false for readability.' },
      },
      required: [],
    },
  },
  {
    name: 'show_annotated_passage',
    description: 'Reading passage with line numbers, highlighted text spans, and margin notes. Pass `passage` as one string (split on newlines) or pre-split `lines`. Highlights reference text by line number + substring; margin notes attach to a line number.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        source: { type: 'string', description: 'Author + work attribution, e.g. "Frankenstein, Mary Shelley, Chapter 5".' },
        passage: { type: 'string', description: 'Full passage text. Will be split on newlines.' },
        lines: { type: 'array', items: { type: 'string' }, description: 'Alternative to `passage` — already-split lines.' },
        startLineNumber: { type: 'number', description: 'First line number shown (default 1). Useful when quoting from a larger work.' },
        highlights: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              line: { type: 'number', description: '1-based line number.' },
              text: { type: 'string', description: 'Substring to highlight within that line. The first occurrence is highlighted.' },
              color: { type: 'string', description: 'CSS color — e.g. "#fef08a" (yellow), "#bae6fd" (blue), "#bbf7d0" (green).' },
              note: { type: 'string', description: 'Optional short note explaining why this is highlighted; shown in a notes list below the passage.' },
            },
            required: ['line', 'text'],
          },
        },
        marginNotes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              line: { type: 'number' },
              text: { type: 'string' },
            },
            required: ['line', 'text'],
          },
        },
      },
      required: [],
    },
  },
  {
    name: 'show_passage',
    description: 'Put a quote, definition, or short passage ON THE BOARD instead of speaking it in full. Use this whenever you quote a source, give a definition, or reference a passage in ela/ss: call show_passage with the exact text, then SPEAK only your analytical point about it — never read the passage aloud in full. Simpler than show_annotated_passage (no line numbers/margin notes) — use this for a quote/definition; use show_annotated_passage for line-by-line close-reading annotation. `text` may contain inline $…$ math (rare — e.g. a math-adjacent definition).',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Optional short header, e.g. "Key term" or "From the text".' },
        source: { type: 'string', description: 'Attribution, e.g. "Frankenstein, Mary Shelley, Chapter 5" or "Federalist No. 10".' },
        text: { type: 'string', description: 'The passage/quote/definition text, written out in full. Required — this is what renders on the board.' },
        highlights: {
          type: 'array',
          description: 'Exact substrings of `text` to emphasize (first occurrence of each is highlighted). Optional.',
          items: { type: 'string' },
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'show_call_stack',
    description: 'Call-stack visualization. `frames` lists the oldest frame first (bottom, usually `main`) and the newest call last (top). Each frame shows its signature, argument bindings, locals, and optionally the executing line. `returnValue` marks a frame about to return.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        frames: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              function: { type: 'string', description: 'Frame label, e.g. "factorial(3)" or "main()".' },
              args: { type: 'object', description: 'Map of argument name → value (value can be string or number).' },
              locals: { type: 'object', description: 'Map of local variable name → value.' },
              currentLine: { type: 'number' },
              returnValue: { type: 'string', description: 'Shown as "return <value>" at the bottom of the frame.' },
              highlight: { type: 'boolean', description: 'Mark this frame as the active one.' },
            },
            required: ['function'],
          },
        },
        finalReturn: { type: 'string', description: 'Shown above the top frame as "returns X ↑" — useful when showing the final return value bubbling up.' },
      },
      required: ['frames'],
    },
  },
  {
    name: 'show_flowchart',
    description: '⚠️ DEPRECATED — prefer show_diagram(type: "flowchart_simple", params: { nodes, edges, title? }) for the catalog-dispatched flowchart with full scribble + handwrite support. Flowchart for algorithms or branching procedures. Node shapes: start/end (pills), process (rectangle), decision (diamond), io (parallelogram). Edges connect nodes by id; decision-node outgoing edges should be labeled (e.g. "yes" / "no"). Provide explicit x,y coordinates for any flowchart with branching or loops; without coordinates the layout is a straight top-down chain.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string', enum: ['start', 'end', 'process', 'decision', 'io'] },
              label: { type: 'string' },
              x: { type: 'number' },
              y: { type: 'number' },
            },
            required: ['id', 'type', 'label'],
          },
        },
        edges: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              from: { type: 'string' },
              to: { type: 'string' },
              label: { type: 'string' },
            },
            required: ['from', 'to'],
          },
        },
        layout: { type: 'string', enum: ['top-down', 'left-right'] },
      },
      required: ['nodes'],
    },
  },
  {
    name: 'show_manipulative',
    description: 'Elementary-math visual manipulative. Three types: base-10 (place-value blocks), ten-frame (counters in a 2×5 grid), area-model (partitioned rectangle for multiplication).',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['base-10', 'ten-frame', 'area-model'] },
        base10: {
          type: 'object',
          description: 'Required when type is "base-10". Place-value counts.',
          properties: {
            ones: { type: 'number' },
            tens: { type: 'number' },
            hundreds: { type: 'number' },
            thousands: { type: 'number' },
            showTotal: { type: 'boolean' },
          },
        },
        tenFrame: {
          type: 'object',
          description: 'Required when type is "ten-frame".',
          properties: {
            count: { type: 'number', description: '0–20.' },
            color: { type: 'string' },
            label: { type: 'string' },
          },
          required: ['count'],
        },
        areaModel: {
          type: 'object',
          description: 'Required when type is "area-model". Partitioned rectangle from rows × cols.',
          properties: {
            rows: { type: 'array', items: { type: 'number' } },
            cols: { type: 'array', items: { type: 'number' } },
            showProducts: { type: 'boolean' },
            showSum: { type: 'boolean' },
            rowLabel: { type: 'string' },
            colLabel: { type: 'string' },
          },
          required: ['rows', 'cols'],
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'show_stats',
    description: 'Statistical charts: histogram, boxplot, dotplot, bar, pie, distribution curve, or scatter (with optional regression line). This is the ONLY tool for statistical plots — NEVER hand-build a boxplot/histogram/dotplot out of show_geometry points or show_number_line marks; those improvised plots clip their labels and lack the box/whisker/outlier chrome (live failure, round 29). For a boxplot pass `type: "boxplot"` with the `boxplot.datasets` five-number summary + `outliers`, `showValues: true`. For `type: "histogram"`, give EITHER `bins` (pre-binned: array of [lowerEdge, upperEdge, count] — use this when you have bin frequencies, which is the usual case for a described histogram) OR raw `data: [numbers]`; set `showCounts: true` to label each bar with its count. Do NOT describe a histogram in speech without also drawing it. For `type: "distribution"`, provide `distribution.family`, `distribution.params`, and `distribution.shade` for a shaded probability region; `distribution.probabilityLabel` writes the computed probability inside the shaded region. For `type: "scatter"` (or "scatterplot" / "scatterplot_regression"), provide `points: [{x,y}]`; the LSRL is auto-computed when `showTrendLine` is true (default). Provide `regression`, `rValue`, `rSquared`, or `equationLabel` to override or annotate.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['histogram', 'boxplot', 'dotplot', 'bar', 'pie', 'distribution', 'scatter', 'scatterplot', 'scatterplot_regression'] },
        data: { type: 'array', items: { type: 'number' } },
        bins: { type: 'array', description: 'Pre-binned histogram: each entry is [lowerEdge, upperEdge, count]. Preferred over `data` for a described histogram.', items: { type: 'array', items: { type: 'number' } } },
        showCounts: { type: 'boolean', description: 'Label each histogram bar with its count.' },
        binWidth: { type: 'number' },
        xLabel: { type: 'string' },
        yLabel: { type: 'string' },
        points: { type: 'array', description: 'Bivariate data for scatter*: array of {x, y, label?}', items: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' } }, required: ['x', 'y'] } },
        regression: { type: 'object', description: 'Pre-computed LSRL coefficients for scatter*; omit to auto-compute from points.', properties: { slope: { type: 'number' }, intercept: { type: 'number' } }, required: ['slope', 'intercept'] },
        showTrendLine: { type: 'boolean', description: 'Draw LSRL through scatter points (default true).' },
        rValue: { type: 'number', description: 'Pearson r for scatter (auto-computed if regression is given).' },
        rSquared: { type: 'number' },
        equationLabel: { type: 'string', description: 'Equation label for scatter, e.g. "ŷ = 2.1 + 1.3x"' },
        highlightPoint: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' } }, required: ['x', 'y'] },
        showResiduals: { type: 'boolean', description: 'Draw vertical residual segments from each scatter point to the LSRL.' },
        boxplot: { type: 'object', properties: { datasets: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, min: { type: 'number' }, q1: { type: 'number' }, median: { type: 'number' }, q3: { type: 'number' }, max: { type: 'number' }, outliers: { type: 'array', items: { type: 'number' } }, color: { type: 'string' } }, required: ['label', 'min', 'q1', 'median', 'q3', 'max'] } }, showValues: { type: 'boolean' } } },
        bar: { type: 'object', properties: { categories: { type: 'array', items: { type: 'string' } }, values: { type: 'array', items: { type: 'number' } }, colors: { type: 'array', items: { type: 'string' } } } },
        pie: { type: 'object', properties: { slices: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'number' }, color: { type: 'string' } }, required: ['label', 'value'] } }, showPercentages: { type: 'boolean' } } },
        distribution: {
          type: 'object',
          description: 'Required when type is "distribution". Specifies the continuous PDF and the region to shade for inference problems.',
          properties: {
            family: { type: 'string', enum: ['normal', 't', 'chi-square', 'F'] },
            params: {
              type: 'object',
              description: 'Distribution parameters. Normal: {mean, sd}. t: {df}. chi-square: {df}. F: {df1, df2}.',
              properties: {
                mean: { type: 'number' },
                sd: { type: 'number' },
                df: { type: 'number' },
                df1: { type: 'number' },
                df2: { type: 'number' },
              },
            },
            shade: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['less', 'greater', 'between', 'outside'] },
                a: { type: 'number', description: 'Lower boundary (or the single boundary for less/greater).' },
                b: { type: 'number', description: 'Upper boundary (for between/outside).' },
                color: { type: 'string' },
              },
              required: ['type'],
            },
            showMean: { type: 'boolean' },
            probabilityLabel: { type: 'string', description: 'Short text drawn inside the shaded region — e.g. "p = 0.025", "α = 0.05", "P(Z > 1.96)".' },
          },
          required: ['family'],
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'show_collision',
    description: 'Before/after collision diagram with masses and velocity vectors. Use for momentum conservation lessons. Each body is a filled circle sized by mass with a velocity arrow scaled to speed.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        dimension: { type: 'string', enum: ['1D', '2D'], description: 'Default "1D" uses signed `velocity` per body. "2D" uses `vx` and `vy` instead.' },
        type: { type: 'string', enum: ['elastic', 'inelastic', 'perfectly-inelastic'] },
        before: {
          type: 'array',
          description: 'Bodies in their pre-collision state.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              mass: { type: 'number' },
              velocity: { type: 'number', description: '1D signed velocity (positive = right).' },
              vx: { type: 'number' },
              vy: { type: 'number', description: 'Positive = up.' },
              color: { type: 'string' },
            },
          },
        },
        after: {
          type: 'array',
          description: 'Bodies after the collision. For perfectly-inelastic, pass either a single combined body or the pre-collision list with the combined velocity on each — the renderer merges them.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              mass: { type: 'number' },
              velocity: { type: 'number' },
              vx: { type: 'number' },
              vy: { type: 'number' },
              color: { type: 'string' },
            },
          },
        },
        momentumAnnotation: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['before', 'after'],
    },
  },
  {
    name: 'show_reaction_coordinate',
    description: 'Reaction-coordinate (energy-profile) diagram: reactants baseline, activation-energy hump(s), products baseline. Supports multi-curve overlay for catalyst comparisons.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        reactants_energy: { type: 'number', description: 'Reference level. Default 0.' },
        products_energy: { type: 'number', description: 'Negative = exothermic, positive = endothermic.' },
        activation_energies: {
          type: 'array',
          description: 'One per curve.',
          items: { type: 'number' },
        },
        curve_labels: {
          type: 'array',
          items: { type: 'string' },
        },
        reactant_label: { type: 'string' },
        product_label: { type: 'string' },
        units: { type: 'string', description: 'Default "kJ/mol".' },
      },
      required: ['products_energy', 'activation_energies'],
    },
  },
  {
    name: 'show_energy_bars',
    description: 'MECHANICS ONLY. Stacked bar chart of MECHANICAL energy at labeled positions in a physics scenario (a falling ball, a pendulum, a block on a spring, a roller coaster). Each position is one column; the renderer auto-draws a dashed total-energy line when all columns sum to the same total.\n\nThe rendered legend is FIXED to kinetic/gravitational mechanics — the bars are labelled "KE (kinetic)", "PE (gravitational)", "PE (spring)", "Thermal (lost)" — and you CANNOT see or change those labels. So do NOT reach for this tool to depict any other kind of energy: light/radiant, chemical (photosynthesis, respiration, combustion, bond energy), electrical, nuclear, or sound. Putting sunlight into `ke` and stored sugar into `pe` renders a kinetic-vs-gravitational chart for a biology lesson, and the student sees a legend that contradicts everything you are saying. For an energy-FLOW narrative across a process (sunlight → sugar, fuel → heat → work), use `show_diagram` (e.g. the `photosynthesis` kind, or `flowchart_simple` for a generic process chain) instead.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        positions: {
          type: 'array',
          description: 'One column per position. At least one of ke/pe/spring/thermal must be non-zero on each position.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              ke: { type: 'number', description: 'Kinetic energy.' },
              pe: { type: 'number', description: 'Gravitational potential energy.' },
              spring: { type: 'number', description: 'Elastic / spring PE.' },
              thermal: { type: 'number', description: 'Energy dissipated as heat / friction.' },
            },
            required: ['label'],
          },
        },
        yAxisLabel: { type: 'string' },
        showTotalLine: { type: 'boolean' },
        notes: { type: 'string' },
      },
      required: ['positions'],
    },
  },
  {
    name: 'show_free_body_diagram',
    description: 'Free-body diagram with force vectors. Force `direction` accepts cardinals (up/down/left/right/up-left/etc.), slope-relative tokens for inclines (normal/up-slope/down-slope/into-surface), or a numeric angle in degrees as a string (math convention, CCW from +x). Set `surface.angle` for inclined-plane problems. Force colors auto-assign from the force name.\n\nFBD CONVENTIONS — follow these or the diagram is wrong:\n1. On an inclined plane, choose ONE weight representation per diagram: EITHER show the full weight W (direction "down", magnitude "mg"), OR show its components W_parallel (direction "down-slope", magnitude "mg sinθ") + W_perp (direction "into-surface", magnitude "mg cosθ"). Drawing both on the same diagram double-counts weight and produces overlapping arrows. To teach decomposition, emit two separate diagrams in sequence: first the W-only FBD, then a second FBD with the components (the runtime lays them out — do not call new_page).\n2. Do not name a weight component "F_app". F_app is a separate applied/push/pull force. The down-slope component of weight is W_parallel with magnitude mg sinθ, NOT F_app.\n3. For connected-body / pulley problems: FIRST show the physical setup with `show_diagram` type "pulley_system" picking the correct `mode`:\n   - `mode: "atwood"` — two masses hanging on opposite sides of a single overhead pulley.\n   - `mode: "table-pulley"` — one block on a horizontal table, second block hanging off the edge over a pulley.\n   - `mode: "incline-pulley"` — one block on a ramp, rope goes up the slope and over a pulley at the top, second block hanging on the far side. Pass `inclineAngle` (degrees, default 30).\n   - `mode: "block-tackle"` (default) is ONLY for single-load mechanical-advantage block-and-tackle. Do NOT use it for any two-mass / connected-body setup.\n   In all connected-body modes pass `leftSide: { label, weight? }` and `rightSide: { label, weight? }` (or `loads: [...]`) for the two bodies. THEN draw one FBD per body as separate `show_free_body_diagram` calls (one per body) — the runtime lays them out; do NOT call new_page.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short diagram title shown above the figure.' },
        object: {
          type: 'object',
          description: 'The body being analyzed.',
          properties: {
            shape: { type: 'string', enum: ['box', 'circle', 'person'], description: 'Default: "box".' },
            label: { type: 'string', description: 'Short label drawn inside the object (e.g. "M", "m₁").' },
            mass: { type: 'string', description: 'Mass string drawn inside the object if no label is given (e.g. "5 kg").' },
          },
        },
        surface: {
          type: 'object',
          description: 'Support surface the object rests on.',
          properties: {
            type: { type: 'string', enum: ['horizontal', 'inclined', 'vertical', 'none'], description: 'Default: "horizontal". Use "none" for a free-floating or hanging object.' },
            angle: { type: 'number', description: 'Degrees above horizontal. Required when type is "inclined".' },
            friction: { type: 'boolean', description: 'When true, adds a "μ (friction)" annotation near the surface.' },
          },
          required: ['type'],
        },
        forces: {
          type: 'array',
          description: 'Force vectors radiating from the object\'s center.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Short force name (e.g. "W", "N", "F_app", "f_k", "T"). Drives auto-coloring.' },
              magnitude: { type: 'string', description: 'Optional magnitude label (e.g. "mg", "20 N"). Rendered as "<name> = <magnitude>".' },
              direction: { type: 'string', description: 'Named direction ("up"/"down"/"left"/"right"/"up-left"/"up-right"/"down-left"/"down-right"/"normal"/"up-slope"/"down-slope"/"into-surface"), a numeric angle in degrees (math convention, CCW from +x; "45" or "-135"), or a natural-language phrase ("30 below horizontal", "45 above horizontal", "30 below horizontal toward left").' },
              color: { type: 'string', description: 'Optional color override — hex (e.g. "#dc2626"). Defaults by name convention.' },
              scale: { type: 'number', description: 'Optional length multiplier (1.0 = default). Use larger for dominant forces, smaller for weak ones.' },
            },
            required: ['name', 'direction'],
          },
        },
        notes: { type: 'string', description: 'Short caption shown below the diagram (e.g. "Frictionless", "Constant velocity").' },
      },
      required: ['object', 'forces'],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Tier-1 structured tools (batch shipped 2026-04-22)
  // ══════════════════════════════════════════════════════════════════════════

  {
    name: 'show_coordinate_plane',
    description: '2D coordinate plane with axes, gridlines, and any combination of labeled points, line segments, and vectors from origin. Always renders axes + ticks. For polygon-focused figures (triangles, circles, angle measures) use show_geometry instead.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        xRange: { type: 'array', items: { type: 'number' }, description: '[min, max] for the x-axis. Default [-10, 10].' },
        yRange: { type: 'array', items: { type: 'number' }, description: '[min, max] for the y-axis. Default [-10, 10].' },
        xLabel: { type: 'string' },
        yLabel: { type: 'string' },
        showGrid: { type: 'boolean' },
        points: { type: 'array', items: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' } }, required: ['x', 'y'] } },
        segments: { type: 'array', items: { type: 'object', properties: { from: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } }, required: ['x', 'y'] }, to: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } }, required: ['x', 'y'] }, label: { type: 'string' }, color: { type: 'string' }, dashed: { type: 'boolean' }, arrow: { type: 'boolean' } }, required: ['from', 'to'] } },
        vectors: { type: 'array', items: { type: 'object', properties: { from: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } } }, to: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } }, required: ['x', 'y'] }, label: { type: 'string' }, color: { type: 'string' } }, required: ['to'] } },
        notes: { type: 'string' },
      },
      required: [],
    },
  },

  {
    name: 'show_scatter_plot',
    description: 'Display a scatter plot of (x, y) data points, optionally with a least-squares linear regression line + R². USE THIS for correlation / regression lessons, bivariate data, or visualizing experimental measurements.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        xLabel: { type: 'string' },
        yLabel: { type: 'string' },
        points: { type: 'array', items: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' }, series: { type: 'string' } }, required: ['x', 'y'] } },
        xRange: { type: 'array', items: { type: 'number' } },
        yRange: { type: 'array', items: { type: 'number' } },
        showTrendLine: { type: 'boolean', description: 'Compute + plot least-squares regression line with R².' },
        trendLineEquation: { type: 'string', description: 'Override the computed equation string.' },
        notes: { type: 'string' },
      },
      required: ['points'],
    },
  },

  {
    name: 'show_cycle_diagram',
    description: '⚠️ DEPRECATED — prefer `show_diagram(type: "water_cycle" | "life_cycle" | "rock_cycle", params: { stages: [{label, description?, color?}], title? })`. The catalog version registers each stage as a scribbleable feature with semantic slug aliases (e.g. "stage-precipitation"). This legacy tool stays for backward-compat only — do NOT pick it for new emissions. Display stages of a cyclic process arranged around a circle.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        stages: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, description: { type: 'string' }, color: { type: 'string' }, icon: { type: 'string', description: 'Single emoji or unicode symbol shown inside the stage node.' } }, required: ['label'] } },
        clockwise: { type: 'boolean', description: 'Default true.' },
        notes: { type: 'string' },
      },
      required: ['stages'],
    },
  },

  {
    name: 'show_concept_map',
    description: 'Display a concept map / mind map: labeled nodes connected by labeled edges. Auto-lays out nodes using BFS from the first (or level-0) node when explicit x,y omitted. USE THIS for vocabulary webs, brainstorming, theme maps, cross-topic links.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        nodes: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' }, x: { type: 'number', description: '0-100 normalized x (optional).' }, y: { type: 'number' }, color: { type: 'string' }, level: { type: 'number', description: 'Set level 0 on the root for auto-layout.' } }, required: ['id', 'label'] } },
        edges: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, label: { type: 'string' }, directed: { type: 'boolean' }, color: { type: 'string' } }, required: ['from', 'to'] } },
        notes: { type: 'string' },
      },
      required: ['nodes'],
    },
  },

  {
    name: 'show_motion_diagram',
    description: 'Plot position / velocity / acceleration vs time. Each series is stacked in its own sub-panel with a shared time axis. USE THIS for kinematics lessons instead of show_function_graph when you want x(t), v(t), a(t) side-by-side.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        timeLabel: { type: 'string' },
        series: { type: 'array', items: { type: 'object', properties: { kind: { type: 'string', enum: ['position', 'velocity', 'acceleration'] }, points: { type: 'array', items: { type: 'object', properties: { t: { type: 'number' }, value: { type: 'number' } }, required: ['t', 'value'] } }, label: { type: 'string' }, color: { type: 'string' }, yLabel: { type: 'string' } }, required: ['kind', 'points'] } },
        notes: { type: 'string' },
      },
      required: ['series'],
    },
  },

  {
    name: 'show_projectile_motion',
    description: 'Plot projectile trajectory y(x) with decomposed v0 components, angle arc, max-height and range annotations. USE THIS for projectile problems instead of show_function_graph.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        v0: { type: 'number', description: 'Initial speed.' },
        angle: { type: 'number', description: 'Launch angle from horizontal (degrees).' },
        y0: { type: 'number', description: 'Launch height (default 0).' },
        g: { type: 'number', description: 'Gravity (default 9.8).' },
        showComponents: { type: 'boolean' },
        sampleCount: { type: 'number' },
        speedUnit: { type: 'string' },
        distanceUnit: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['v0', 'angle'],
    },
  },

  {
    name: 'show_simple_machine',
    description: 'Display a labeled schematic of a simple machine with effort, load, and mechanical-advantage annotation. Types: lever (class-1/2/3), pulley (fixed/movable/compound), inclined-plane, wedge. USE THIS for mechanical-advantage lessons.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['lever', 'pulley', 'inclined-plane', 'wedge'] },
        variant: { type: 'string', enum: ['class-1', 'class-2', 'class-3', 'fixed', 'movable', 'compound'] },
        effort: { type: 'number' },
        load: { type: 'number' },
        effortArm: { type: 'number', description: 'Lever only — distance from fulcrum to effort.' },
        loadArm: { type: 'number' },
        angle: { type: 'number', description: 'Inclined plane / wedge angle (degrees).' },
        length: { type: 'number' },
        height: { type: 'number' },
        ropes: { type: 'number', description: 'Pulley only — number of supporting ropes.' },
        unit: { type: 'string', description: 'Force unit label (default "N").' },
        notes: { type: 'string' },
      },
      required: ['type'],
    },
  },

  {
    name: 'show_pendulum',
    description: 'Display a simple pendulum swept to ±amplitude, with derived T = 2π √(L/g) readout. USE THIS for SHM intro and pendulum-period problems.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        length: { type: 'number', description: 'String length in meters.' },
        amplitude: { type: 'number', description: 'Amplitude angle in degrees.' },
        mass: { type: 'number', description: 'Bob mass in kg (label only).' },
        g: { type: 'number', description: 'Default 9.8.' },
        showArc: { type: 'boolean' },
        notes: { type: 'string' },
      },
      required: ['length', 'amplitude'],
    },
  },

  {
    name: 'show_spring_mass',
    description: 'Spring-mass system. Two modes: (A) Single-mass — pass k, mass, displacement; renders one spring anchored to a wall with derived ω and T. (B) Chain — pass `elements[]` as a left-to-right sequence of wall / spring / mass pieces; use this for any multi-spring or multi-mass setup.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        elements: {
          type: 'array',
          description: 'Chain mode. Left-to-right sequence. Takes priority over the single-mass fields below.',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['wall', 'spring', 'mass'] },
              k: { type: 'number', description: 'Spring constant in N/m. Required when type="spring".' },
              mass: { type: 'number', description: 'Mass in kg. Required when type="mass".' },
              displacement: { type: 'number', description: 'Displacement from equilibrium (m).' },
              naturalLength: { type: 'number', description: 'Spring natural length (m). Default 1.' },
              label: { type: 'string' },
            },
            required: ['type'],
          },
        },
        k: { type: 'number', description: 'Single-mass mode: spring constant (N/m).' },
        mass: { type: 'number', description: 'Single-mass mode: mass (kg).' },
        displacement: { type: 'number', description: 'Single-mass mode: displacement from equilibrium (m). Negative = compressed.' },
        naturalLength: { type: 'number' },
        orientation: { type: 'string', enum: ['horizontal', 'vertical'] },
        notes: { type: 'string' },
      },
      required: [],
    },
  },

  {
    name: 'show_ray_diagram',
    description: 'Thin-lens or spherical-mirror ray diagram with object, image, focal points, principal rays, and thin-lens equation readout. USE THIS for optics.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['converging', 'diverging', 'concave-mirror', 'convex-mirror'] },
        focalLength: { type: 'number', description: 'cm; positive for converging / concave-mirror, negative for diverging / convex-mirror (sign auto-corrected by type).' },
        objectDistance: { type: 'number', description: 'cm, positive in front of the optical element.' },
        objectHeight: { type: 'number', description: 'cm (default 2).' },
        showLabels: { type: 'boolean' },
        notes: { type: 'string' },
      },
      required: ['type', 'focalLength', 'objectDistance'],
    },
  },

  {
    name: 'show_wave',
    description: 'Sinusoidal wave with labeled λ (wavelength), A (amplitude), and optional frequency. Can overlay a second wave + their superposition for interference / beats / phase lessons. USE THIS for any wave visualization.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        wave: { type: 'object', properties: { amplitude: { type: 'number' }, wavelength: { type: 'number' }, phase: { type: 'number', description: 'Degrees; 0 = starts at origin going up.' }, color: { type: 'string' }, label: { type: 'string' } }, required: ['amplitude', 'wavelength'] },
        secondary: { type: 'object', properties: { amplitude: { type: 'number' }, wavelength: { type: 'number' }, phase: { type: 'number' }, color: { type: 'string' }, label: { type: 'string' } } },
        showSuperposition: { type: 'boolean', description: 'Overlay the sum of wave + secondary for interference demos.' },
        frequency: { type: 'number', description: 'Shown as f = … Hz; T = 1/f also displayed.' },
        showAnnotations: { type: 'boolean', description: 'Toggle λ and A labels (default true).' },
        xLabel: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['wave'],
    },
  },

  {
    name: 'show_vector',
    description: 'Draw one or more 2D vectors with magnitude + direction labels, optional resultant sum, component decomposition, and tip-to-tail or from-origin layout. USE THIS for vector-addition lessons in physics or precalc.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        vectors: { type: 'array', items: { type: 'object', properties: { magnitude: { type: 'number' }, direction: { type: 'number', description: 'Degrees; 0°=East, 90°=North.' }, label: { type: 'string' }, color: { type: 'string' } }, required: ['magnitude', 'direction'] } },
        layout: { type: 'string', enum: ['from-origin', 'tip-to-tail'] },
        showResultant: { type: 'boolean' },
        resultantLabel: { type: 'string' },
        showComponents: { type: 'boolean' },
        showAxes: { type: 'boolean' },
        notes: { type: 'string' },
      },
      required: ['vectors'],
    },
  },

  {
    name: 'show_orbital_diagram',
    description: '⚠️ DEPRECATED — prefer `show_diagram(type: "orbital_diagram", params: { element, title? })`. The catalog version registers each shell row as a scribbleable feature so tutor_scribble can mark a specific shell ("2p", "3d", etc.). This legacy tool stays for backward-compat only — do NOT pick it for new emissions. Electron configuration box-and-arrow notation following Aufbau, Pauli, Hund.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        element: { type: 'string', description: 'Element symbol (case-sensitive, e.g. "Fe"). Atomic number is looked up.' },
        configuration: { type: 'array', items: { type: 'object', properties: { subshell: { type: 'string', description: 'e.g. "3d"' }, electrons: { type: 'number' } }, required: ['subshell', 'electrons'] } },
        condensed: { type: 'boolean', description: 'Prefix with the nearest noble-gas core (e.g. [Ar] 4s2 3d6).' },
        notes: { type: 'string' },
      },
      required: [],
    },
  },

  {
    name: 'show_pedigree',
    description: 'Pedigree chart with standard genetics notation. Individuals are placed by `generation` (1 = top) and `position` (0-based left-to-right). Marriages link pairs; `children` records parent → offspring relationships.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        individuals: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, sex: { type: 'string', enum: ['male', 'female', 'unknown'] }, status: { type: 'string', enum: ['unaffected', 'affected', 'carrier', 'deceased'] }, label: { type: 'string' }, generation: { type: 'number', description: '1-based Roman-numeral generation (1 = I at top).' }, position: { type: 'number', description: '0-based left-to-right within that generation.' } }, required: ['id', 'sex', 'generation', 'position'] } },
        marriages: { type: 'array', items: { type: 'object', properties: { pair: { type: 'array', items: { type: 'string' } }, consanguineous: { type: 'boolean' } }, required: ['pair'] } },
        children: { type: 'array', items: { type: 'object', properties: { parents: { type: 'array', items: { type: 'string' } }, childId: { type: 'string' } }, required: ['parents', 'childId'] } },
        legend: { type: 'array', items: { type: 'string' } },
        notes: { type: 'string' },
      },
      required: ['individuals'],
    },
  },

  {
    name: 'show_punnett',
    description: '⚠️ DEPRECATED — prefer `show_diagram(type: "punnett_square", params: { parentA, parentB, title? })`. The catalog version registers each cell + gamete + parent label as a scribbleable feature so tutor_scribble can mark a specific cell ("BB", "Bb", "bb"). This legacy tool stays for backward-compat only — do NOT pick it for new emissions. Punnett-square cross. The catalog version supports monohybrid only; for dihybrid (RrYy × Rryy) keep using this legacy tool.',
    parameters: {
      type: 'object',
      properties: {
        parent1: { type: 'string', description: 'Parent 1 genotype, e.g. "Pp", "RrYy".' },
        parent2: { type: 'string', description: 'Parent 2 genotype, e.g. "pp", "rrYy".' },
        title: { type: 'string' },
        trait: { type: 'string', description: 'Optional trait name (e.g. "Pea height", "Flower color").' },
        showPhenotypeRatio: { type: 'boolean', description: 'Default true.' },
      },
      required: ['parent1', 'parent2'],
    },
  },

  {
    name: 'show_cell_diagram',
    description: 'Schematic of an animal or plant cell with labeled organelles (nucleus, mitochondria, ribosomes, ER, Golgi; plant adds chloroplast, vacuole, cell wall). USE THIS for cell biology intro.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['animal', 'plant'] },
        highlight: { type: 'array', items: { type: 'object', properties: { organelle: { type: 'string', description: 'One of: nucleus, mitochondria, ribosomes, er, golgi, chloroplast, vacuole, cell-wall.' }, note: { type: 'string' }, color: { type: 'string' } }, required: ['organelle'] } },
        notes: { type: 'string' },
      },
      required: ['type'],
    },
  },

  {
    name: 'show_dna',
    description: 'DNA double helix (default) or straight base-pair ladder with A-T / G-C complementary pairs. Base-pair mode accepts a 5\'→3\' sequence and auto-complements the antisense strand; optional mRNA row below shows transcription. USE THIS for DNA structure / replication / transcription lessons.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        mode: { type: 'string', enum: ['helix', 'base-pairs'] },
        sequence: { type: 'string', description: 'Top strand 5\'→3\' for base-pairs mode (e.g. "ATGCATGC").' },
        complement: { type: 'string', description: 'Override the auto-computed complementary strand.' },
        mrna: { type: 'string', description: 'If provided (or empty string for auto-transcribe), show an mRNA row beneath the DNA.' },
        rungs: { type: 'number', description: 'helix mode: number of base-pair rungs (default 12).' },
        notes: { type: 'string' },
      },
      required: [],
    },
  },

  {
    name: 'show_food_web',
    description: 'Ecological food web: labeled species nodes placed at their trophic level (1=producers, 2=primary, 3=secondary, 4=tertiary, 5=apex) with directed arrows prey → predator (direction of energy flow). USE THIS for ecology lessons.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        species: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' }, level: { type: 'number', description: '1 = producer, 2 = primary consumer, 3 = secondary, 4 = tertiary, 5 = apex predator.' }, color: { type: 'string' }, icon: { type: 'string' } }, required: ['id', 'label', 'level'] } },
        edges: { type: 'array', items: { type: 'object', properties: { from: { type: 'string', description: 'Prey id.' }, to: { type: 'string', description: 'Predator id.' } }, required: ['from', 'to'] } },
        showLevelLabels: { type: 'boolean' },
        notes: { type: 'string' },
      },
      required: ['species', 'edges'],
    },
  },

  {
    name: 'tutor_scribble',
    description: 'Draw the student\'s attention to a feature already on the whiteboard. Overlay only — does NOT redraw. Default behavior: places a small ✓ tick mark just past the feature\'s right edge. Use sparingly — one or two per turn.\n\nHOW TO ADDRESS:\n  Pass a single `target` string naming the feature. The client resolves it deterministically against the catalog of features every show_* tool registered. Use the exact feature name from the `features` array you received in the show_*\'s tool_result (e.g. "point-a", "object", "mass-1", "force-weight", "stage-precipitation"). Natural-language variants also work ("A", "vertex A", "the object"). If the feature can\'t be resolved, the tool_result returns the current feature catalog — retry with one of those names.\n\nOPTIONAL `page` (number): when the same feature name appears on more than one page (e.g. an earlier page AND a recent one), pass the `Page N` number from the whiteboard map to disambiguate — resolution is scoped to that page first. If the name is not on that page it falls back to the whole board, so a wrong number never drops the mark.\n\nIf you provide a `label`, it appears in the page\'s annotation strip below the rendered items as "{feature} → {label}" — NOT on the diagram itself. Keep labels short.\n\nDo not use this for new content or for unlabeled spots. If you need to mark something that was never drawn, render it first with a show_* tool.',
    parameters: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'The feature to mark. Use a name from the `features` array in a prior show_* tool_result (e.g. "point-a", "object", "mass-1"). Natural-language variants like "vertex A" also resolve — the client maps them to the canonical name.' },
        page: { type: 'number', description: 'Optional. The `Page N` number from the whiteboard map — scopes resolution to that page first (disambiguates a feature name that repeats across pages). Falls back to the whole board if not found there.' },
        shape: { type: 'string', enum: ['tick', 'highlight'], description: 'tick = small ✓ next to the feature (default); highlight = semi-transparent fill over the feature\'s region. Defaults to "tick" when omitted.' },
        color: { type: 'string', description: 'CSS color. Defaults to blue (#3b82f6).' },
        label: { type: 'string', description: 'Optional short text that appears in the page\'s annotation strip below the diagram as "{feature} → {label}". Keep short.' },
      },
      required: ['target'],
    },
  },

  ...(linksEnabled() ? [{
    name: 'tutor_link',
    description: 'Draw a hand-drawn arrow between two things already on the board — for connections, causation, and "this leads to that" moments. Both endpoints use the same target grammar as tutor_scribble (feature or item names visible on the board). Optional short label rides the arrow. Both endpoints must already be rendered; if either cannot be found the arrow is skipped silently, so only reference things you can see in the board state.',
    parameters: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Source feature/item (same grammar as tutor_scribble target).' },
        to: { type: 'string', description: 'Destination feature/item. The arrowhead lands here.' },
        label: { type: 'string', description: 'Optional ≤6-word label, hand-written beside the arrow.' },
        color: { type: 'string', description: 'CSS color. Defaults to amber (#a16207).' },
      },
      required: ['from', 'to'],
    },
  } satisfies ToolDefinition] : []),

  {
    name: 'list_whiteboard_features',
    description: 'Look up the authoritative list of feature names currently on the whiteboard. Call this if you want to scribble but the original show_* tool_results have rolled out of your context. Returns every feature across every rendered item, with the exact names to pass as `target` in tutor_scribble. (To see a COLLAPSED page\'s detail, navigate to it with go_to_page — it expands once you are viewing it.)',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Optional — limit to one item\'s features. Omit to get every feature currently on the whiteboard.' },
      },
      required: [],
    },
  },

  {
    name: 'tutor_scroll_whiteboard',
    description: 'Bring an item into the student\'s view. Use when you want to reference something that may be off-screen or on a previous page. No redraw; pure view change.\n\nPass `target` as the feature name — same string you would pass to tutor_scribble. The client resolves it deterministically against the session catalog and switches page + scrolls to that item in one call. OPTIONAL `page` (number): pass the `Page N` map handle to scope resolution to that page first (disambiguates a name that repeats across pages); falls back to the whole board if not found there. Reserved values: "top" / "bottom" scroll the edges of the current page (rarely needed — auto-scroll already shows the latest item). Iframe-backed items (graphs, molecules) are scroll-only — this is the ONLY way to reference them.',
    parameters: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Feature name (e.g. "the graph", "vertex A", "the molecule") OR reserved keyword "top" / "bottom" to scroll the current page edges.' },
        page: { type: 'number', description: 'Optional. The `Page N` number from the whiteboard map — scopes resolution to that page first. Falls back to the whole board if not found there.' },
      },
      required: ['target'],
    },
  },
  {
    name: 'tutor_handwrite',
    description: 'Write a short hand-written note. With `near`, the note lands on the board beside its target; without it, in the margin. ≤80 chars. Use for short reminders ("Legislative makes laws"), capturing student wording verbatim ("you said: free elections"), inline definitions, or short causation notes ("Because particles are spread out, gases compress easily"). Distinct from `annotate` (a boxed text card on the board) and `tutor_scribble` (which marks an EXISTING feature on the diagram).\n\nWrite full self-contained sentences ("Legislative makes laws"), not fragments ("makes laws"). Without `near`, notes collect in the page margin in emission order. Use sparingly — 1-2 handwrites per turn at most. Notes reset on each new_page.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The full self-contained note text. Plain text only; LaTeX / markdown does not render.' },
        color: { type: 'string', description: 'CSS color for the note. Defaults to amber ("#a16207"). Use green for affirmation, red for warnings.' },
        near: { type: 'string', description: 'Optional: the feature or item this note is about (same target grammar as tutor_scribble). When provided, the note is hand-written on the board BESIDE that target at a position the runtime computes — never overlapping content. Omit for a general note (margin).' },
      },
      required: ['text'],
    },
  },
  // ─── Lesson-plan control (only meaningful when <lesson_plan> is present) ──
  {
    name: 'advance_lesson',
    description: 'Move to a different segment of the active lesson plan. Call this when the current segment\'s goal is met and you want to proceed (`to: "next"`), to revisit a previous one (`to: "previous"`), or to branch to a specific segment by id. Use `to: "free"` when the student clearly wants to leave the planned track for something this plan does not cover (a request to study a different concept that no segment addresses, or to set the plan aside): it releases the plan position so you can teach freely without the lesson scaffolding pulling you back to a stale segment. After releasing, just teach what they asked; later, `to: "next"` resumes the plan where they left it, or branch by an explicit segment id to re-enter at a chosen point. Do NOT use `"free"` for in-plan navigation, for a different plan within the same topic (that is a separate plan-swap action), or merely because the student got something wrong. Use sparingly — staying in the current segment until its goal is achieved is the default.',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: '"next" | "previous" | "free" | "<segmentId>" — destination ("free" releases the plan position for off-plan teaching).' },
        reason: { type: 'string', description: 'Brief why (for telemetry). E.g. "student answered try-1 correctly".' },
      },
      required: ['to'],
    },
  },
  {
    name: 'confirm_plan_los',
    description: 'Commit the student\'s pick from a picker segment. Fire this ONLY when the active plan\'s current segment is a picker (its `goal` field describes presenting a list and capturing a pick) AND the student has clearly named which LOs they want. Pass the picked LO ids in the order the student gave them. The orchestrator will expand those LOs into full teaching segments and the next turn will start from the first expanded segment. Do NOT fire this for any other purpose — it is specific to the picker hand-off.',
    parameters: {
      type: 'object',
      properties: {
        pickedLoIds: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          description: 'Ordered list of LO ids the student picked (from the picker segment\'s keyIdeas — the "lo-1", "lo-2", etc. prefixes).',
        },
      },
      required: ['pickedLoIds'],
    },
  },
  {
    name: 'propose_plan_swap',
    description: 'Switch to a different lesson plan WITHIN the session\'s configured subject + topic. Use this when the student asks to study a different sub-topic / LO / chapter inside the same topic AND there is reason to believe a better-fitting plan exists (curated catalog or generated from earlier freestyle text). The orchestrator handles the lookup: it first searches the curated catalog for a plan matching the new sub-topic, and falls back to generating one from the student\'s message if no curated match exists. Do NOT use propose_plan_swap for off-topic requests (different subject) — refer to Rule 7. Do NOT use it for in-plan navigation — that\'s advance_lesson. Fires silently from the student\'s POV; the orchestrator will inject a "Plan changed → <title>" notice into the chat and update the progress strip. After firing, continue speaking normally — the new plan\'s first segment becomes active on the NEXT turn.',
    parameters: {
      type: 'object',
      properties: {
        targetSubTopic: { type: 'string', description: 'Short plain-English label (3-8 words) for the sub-topic / LO the student wants to switch to. Used by the orchestrator to search the catalog and (if needed) seed plan generation.' },
        reason: { type: 'string', description: 'Brief telemetry note: what the student said or what segment was completed that motivated the swap.' },
      },
      required: ['targetSubTopic'],
    },
  },
  {
    name: 'record_gap',
    description: 'Record a learning gap on a learning objective from THIS lesson plan. Fires silently — the student does not hear or see this. Populates the student\'s persistent profile, feeds back into future sessions, and surfaces between sessions as a "weak areas" practice section. Fire when the student\'s error reveals a genuine misconception or missing piece — not a slip, mishearing, or one-off calculation error they self-corrected. FIRE WHEN: (a) the student gets a problem wrong and the wrong reasoning shows real misunderstanding of the LO, (b) the student verbally states they don\'t understand a concept tied to the current LO, (c) the student couldn\'t recover after a hint, (d) the student made the same kind of error twice within the segment. DO NOT FIRE ON: a single wrong answer the student self-corrected; misheard / mistyped responses; questions about the wording of the problem; mid-thought hesitation that resolves on its own. Per session, fire at most once per (loId, distinct issue) pair. **CROSS-SESSION RE-FIRE:** if a gap already exists in `<student_profile>` for this LO and the student re-demonstrates the same misconception in THIS session, DO fire `record_gap` again — re-firing across sessions is how the system promotes a candidate gap to "confirmed" status (the store layer merges signals and increments the session count). Re-firing is encouraged, not duplicate. Use `flag_prerequisite_gap` instead when the missing piece is a foundational concept this plan does NOT itself teach.',
    parameters: {
      type: 'object',
      properties: {
        loId: { type: 'string', description: 'LO id from the active plan\'s <lesson_plan> block — must match LessonPlan.los[].id exactly.' },
        observation: { type: 'string', description: 'Your one- to two-sentence account of what the student got wrong and (when inferable) why. Drives the weak-areas UI label and pre-session priming next time.' },
        studentQuotes: {
          type: 'array',
          items: { type: 'string' },
          maxItems: 2,
          description: 'Verbatim student utterance(s) most diagnostic of the gap. ≤2 quotes, ≤30 words each. Pulled from this session\'s transcript. Used for "you previously said X" re-grounding next session. Optional — omit if no clean quote exists.',
        },
        signalsObserved: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['MISCONCEPTION_DETECTED', 'STUDENT_VERBALIZED_CONFUSION', 'INCORRECT_AFTER_HINT', 'NO_RECOVERY'],
          },
          minItems: 1,
          description: 'At least one structured signal you observed. MISCONCEPTION_DETECTED = student\'s reasoning revealed a wrong mental model; STUDENT_VERBALIZED_CONFUSION = student said they don\'t understand a concept; INCORRECT_AFTER_HINT = wrong answer after you provided a hint; NO_RECOVERY = repeated attempts in segment with no progress. Combined with orchestrator-stamped objective signals at write time; total signal count drives the gap\'s confidence score.',
        },
      },
      required: ['loId', 'observation', 'signalsObserved'],
    },
  },
  {
    name: 'flag_prerequisite_gap',
    description: 'Record a gap on a foundational concept the student lacks but the active plan does NOT directly teach. Fires silently AND in addition to your normal teaching response (do not skip just because you are also explaining). Use when the student\'s error or confusion is rooted in something that\'s a prerequisite to (or upstream of) the current LO, but isn\'t one of this plan\'s LOs. **GUARANTEED-FIRE TRIGGERS (fire every time, no exceptions):** (i) the student EXPLICITLY admits a prerequisite weakness — phrases like "I don\'t know my times tables", "I forget how to subtract", "I can\'t read this word", "I always mix up [foundational concept]" — these are unambiguous signals and MUST be flagged; (ii) the student fails on a sub-step that\'s pure rote / fact-fluency (basic arithmetic, sight-word reading, vocabulary recognition) when the active LO assumes mastery of it. STRUCTURAL SHAPES (subject-agnostic, additional to the guaranteed triggers): the student in an advanced session struggles with a procedure introduced in an earlier grade; an arithmetic / reading / vocabulary weakness blocks the conceptual step the current LO targets; the student demonstrates absence of a fact-fluency the current LO assumes. The `conceptLabel` is free-form English, 3–6 words, the way a teacher would describe the missing concept. Same per-session dedup: fire at most once per concept_label.',
    parameters: {
      type: 'object',
      properties: {
        conceptLabel: { type: 'string', description: '3–6 word teacher-style English label for the missing foundational concept. Describe the concept the way a teacher would, not the symptom. Free-form — no controlled vocabulary.' },
        observation: { type: 'string', description: 'Your one- to two-sentence account of what the student got wrong and (when inferable) why this surfaces a prerequisite weakness rather than a current-LO gap.' },
        studentQuotes: {
          type: 'array',
          items: { type: 'string' },
          maxItems: 2,
          description: 'Verbatim student utterance(s) most diagnostic of the gap. ≤2 quotes, ≤30 words each. Optional.',
        },
        signalsObserved: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['MISCONCEPTION_DETECTED', 'STUDENT_VERBALIZED_CONFUSION', 'INCORRECT_AFTER_HINT', 'NO_RECOVERY'],
          },
          minItems: 1,
          description: 'At least one structured signal you observed (same enum as record_gap). Drives confidence.',
        },
      },
      required: ['conceptLabel', 'observation', 'signalsObserved'],
    },
  },
  {
    name: 'expand_topic_notes_theory',
    description: 'Add a theory-bucket entry to the student\'s persistent topic-notes for the active plan\'s CED topic. Fires SILENTLY — the student does not hear or see this. The new entry surfaces in the student\'s revision notes OUTSIDE this session (one notes doc per CED topic; revisable later). Three kinds: (i) `expansion` — adds depth to a baseline LO entry the student needed extra context on. Set `loId` to an LO id from the active `<lesson_plan>`; orchestrator silent-drops loIds that don\'t exist in the baseline. (ii) `prereq-refresher` — cross-LO refresher on a prerequisite concept that surfaced as weak (typically paired with a same-turn `flag_prerequisite_gap`). Set `loId=null` and `conceptLabel` to the prereq label. (iii) `student-add` — cross-LO addition that doesn\'t anchor to one LO (rare). Set `loId=null`. **FIRE WHEN:** the student demonstrably benefited from explanation that is NOT already in the baseline, AND the explanation is worth remembering for revision. DO NOT FIRE FOR: rote restatement of existing baseline content, transient slips the student self-corrected, generic encouragement, or content that only makes sense in this exact session\'s flow. The first 3 segments of a fresh session are warmup; calls before then are silent-dropped (be patient — let the student show their range first). Per session, the orchestrator caps theory expansions at ~5 per topic and silent-drops over-firing. Content that already exists (in baseline or in your prior overlays) is silent-deduped — re-firing the same idea across sessions just bumps a "reinforced" counter, which is desirable, not a problem.',
    parameters: {
      type: 'object',
      properties: {
        loId: { type: 'string', description: 'LO id from the active `<lesson_plan>` block when kind=\'expansion\'. Omit or pass null for prereq-refresher / student-add.' },
        kind: {
          type: 'string',
          enum: ['expansion', 'prereq-refresher', 'student-add'],
          description: '`expansion` = anchored to a baseline LO; `prereq-refresher` = cross-LO prereq lift (set conceptLabel); `student-add` = cross-LO addition.',
        },
        conceptLabel: { type: 'string', description: 'Required when kind=\'prereq-refresher\'. 3-6 word teacher-style English label (mirror `flag_prerequisite_gap`\'s shape).' },
        title: { type: 'string', description: 'Optional headline for the entry. ≤80 chars.' },
        content: { type: 'string', description: 'Entry body. Markdown allowed (KaTeX for math). ≤500 chars; over-length is truncated.' },
        rationale: { type: 'string', description: 'Brief reason the brain decided this is notes-worthy. Telemetry only — not shown to student.' },
      },
      required: ['kind', 'content', 'rationale'],
    },
  },
  {
    name: 'add_topic_notes_method',
    description: 'Add a method-bucket entry (procedural recipe) to the student\'s persistent topic-notes for the active plan\'s CED topic. Fires SILENTLY. The new entry surfaces in the student\'s revision notes outside this session. **FIRE WHEN:** (a) the student solved a problem using a method that is NOT in the baseline (capture their working alternative), OR (b) you demonstrated a method during the segment that the baseline does not have, and the student successfully followed it. **alternativeTo (optional):** the title of a baseline method this complements; the renderer sub-numbers it (e.g. "Method 2a") under that baseline method. DO NOT FIRE FOR: methods already in the baseline (orchestrator dedups by title); one-off shortcuts that won\'t generalize; methods you described abstractly without the student successfully applying them. Per session, the orchestrator caps method adds at ~3 per topic and silent-drops over-firing. 3-segment warmup applies.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Procedural headline, e.g. teacher-style "How to do X" or "Alternative: Y approach". ≤120 chars.' },
        when_to_use: { type: 'string', description: 'Optional brief condition — when this method is the right choice over the baseline alternatives.' },
        steps: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          description: 'Ordered procedure. ≥2 non-empty steps required (single-step methods aren\'t methods).',
        },
        alternativeTo: { type: 'string', description: 'Optional title of a baseline method this complements. Renderer sub-numbers under it (e.g. "Method 2a").' },
        relatedLoIds: { type: 'array', items: { type: 'string' }, description: 'Optional cross-reference to LOs from the active plan this method touches.' },
        rationale: { type: 'string', description: 'Brief reason this is notes-worthy. Telemetry only.' },
      },
      required: ['title', 'steps', 'rationale'],
    },
  },
  {
    name: 'add_topic_notes_pointer',
    description: 'Add a pointer-bucket entry (tactical reminder, gotcha, exam-rubric vocabulary, edge case, common error, exam-strategy tip) to the student\'s persistent topic-notes for the active plan\'s CED topic. Fires SILENTLY. Surfaces in the student\'s revision notes outside this session. **FIRE WHEN:** a moment in the segment exposed a vocabulary trap, edge case, common error, or exam-strategy tip the student is likely to forget without a written reminder. The most additive bucket — pointers accumulate across sessions and become the night-before-exam value of the notes. DO NOT FIRE FOR: general study advice ("review before the exam"); restatement of theory or methods that already exist; mid-flow encouragement; mistakes the student already self-corrected fluently. Keep pointers terse and imperative ("Don\'t confuse X with Y"; "When the question asks Z, say Z back"). Per session, the orchestrator caps pointer adds at ~5 per topic and silent-drops over-firing. 3-segment warmup applies.',
    parameters: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Pointer text. Markdown allowed. ≤300 chars; over-length is truncated. Imperative voice preferred.' },
        kind: { type: 'string', description: 'Optional classification — common values: "gotcha" | "frq-vocab" | "edge-case" | "common-error" | "tip". Free-form; drives renderer styling.' },
        relatedLoIds: { type: 'array', items: { type: 'string' }, description: 'Optional cross-reference to LOs from the active plan.' },
        rationale: { type: 'string', description: 'Brief reason this is notes-worthy. Telemetry only.' },
      },
      required: ['content', 'rationale'],
    },
  },
  {
    name: 'mark_segment_complete',
    description: 'Record that a lesson-plan segment is finished. Optionally include a mastery delta (-1 to 1) reflecting how well the student handled the segment\'s goal. Used by the session intelligence layer to update the student profile.',
    parameters: {
      type: 'object',
      properties: {
        segmentId: { type: 'string' },
        masteryDelta: { type: 'number', description: 'Optional, -1 to 1. Negative = struggled, 0 = neutral, positive = strong.' },
        notes: { type: 'string', description: 'Optional free-form note about the student\'s engagement / difficulties.' },
      },
      required: ['segmentId'],
    },
  },
  {
    name: 'generate_problem',
    description: 'Request a practice problem at a specified relative difficulty, anchored on the student\'s most recent try-yourself or worked example. Use ONLY when the student explicitly asks for another problem ("give me another one", "harder please", "easier") OR when adaptive thresholds fire. The runtime returns a canonical problem (from problem bank or brain-generated and verified). The brain MUST emit a brief pre-call TTS bridge (≤10 words like "Sure, here\'s another one for you") and then quote the returned canonicalText VERBATIM in the next show_problem call + spoken delivery. Do NOT paraphrase the canonicalText.',
    parameters: {
      type: 'object',
      properties: {
        difficulty: {
          type: 'string',
          enum: ['slightly_easier', 'same', 'slightly_harder', 'much_harder'],
          description: 'Relative difficulty vs the anchor problem. "same" = same level, useful for "another one like that". "slightly_harder" is the typical step-up.',
        },
        anchorProblem: {
          type: 'string',
          description: 'The statement of the anchor problem the student just engaged with (the prior try-yourself or worked example).',
        },
        anchorAnswer: {
          type: 'string',
          description: 'Optional: the expected answer to the anchor problem, used to calibrate generation.',
        },
        rationale: {
          type: 'string',
          description: 'Brief reason this generation is firing (e.g. "student asked for harder", "adaptive: aced 2 in a row"). For telemetry.',
        },
      },
      required: ['difficulty', 'anchorProblem'],
    },
  },
];

/**
 * Map a function call name + arguments to a WhiteboardCommand.
 *
 * This is the shared logic used by both useOpenAIRealtime and useGeminiLive
 * to convert AI tool calls into whiteboard rendering commands.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapFunctionCallToCommand(funcName: string, funcArgs: Record<string, any>): WhiteboardCommand | null {
  // Phase-3 live round (2026-07-23, Matrices/conics session) + round-6
  // formatting audit (2026-07-24, "*same*" in a try-yourself card): the
  // brain writes markdown emphasis into display strings — chat bubbles
  // render it, but board renderers print strings verbatim, so the student
  // sees literal asterisks. Deep-strip EVERY display field at this single
  // chokepoint (all renderers inherit); math/code/data fields and lookup
  // keys are protected by wb-emphasis-strip's SKIP_KEYS, and $...$ math
  // spans plus bare multiplication/exponent asterisks survive inside prose.
  if (funcArgs && typeof funcArgs === 'object') {
    funcArgs = deepStripWbEmphasis(funcArgs) as Record<string, any>;
  }
  if (funcName === 'new_page') {
    return { action: 'newPage', title: funcArgs.title };
  }
  if (funcName === 'go_to_page') {
    return {
      action: 'goToPage',
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
      page: typeof funcArgs.page === 'number' ? funcArgs.page : undefined,
    };
  }
  if (funcName === 'show_equation') {
    return { action: 'showEquation', latex: funcArgs.latex, label: funcArgs.label };
  }
  if (funcName === 'show_sketch') {
    // Request only — `primitives` are resolved async by the doodler
    // (api/tutor/sketch) and mutated onto the command before it flushes.
    return {
      action: 'showSketch',
      concept: typeof funcArgs.concept === 'string' ? funcArgs.concept : '',
      labels: Array.isArray(funcArgs.labels) ? funcArgs.labels.map(String) : undefined,
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
    };
  }
  if (funcName === 'show_code') {
    return {
      action: 'showCode',
      code: funcArgs.code,
      language: funcArgs.language,
      label: funcArgs.label,
      // Optional sandbox execution fields — consumed by the auto-run hook.
      entryName: funcArgs.entryName,
      testCases: Array.isArray(funcArgs.testCases) ? funcArgs.testCases : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_table') {
    return {
      action: 'showTable',
      headers: (Array.isArray(funcArgs.headers) ? funcArgs.headers : []) as string[],
      rows: (Array.isArray(funcArgs.rows) ? funcArgs.rows : []) as string[][],
    };
  }
  if (funcName === 'show_function_graph') {
    const sanitizeExpr = (expr: string): string => {
      return expr
        .replace(/\bx(\d)/g, 'x**$1')
        .replace(/\by(\d)/g, 'y**$1')
        .replace(/\^/g, '**');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fns = Array.isArray(funcArgs.functions) ? funcArgs.functions : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fnsOfY = Array.isArray(funcArgs.functionsOfY) ? funcArgs.functionsOfY : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphFunctions = fns.map((f: any) => {
      const expr = String(f.expr || '');
      const isLatex = /\\(?:frac|sqrt|sin|cos|tan|log|ln|pi|left|right)/.test(expr) || /[=<>]/.test(expr);
      return {
        latex: expr,
        fn: isLatex ? undefined : sanitizeExpr(expr),
        color: f.color,
        label: f.label,
        domain: f.domain,
      };
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphFunctionsOfY = fnsOfY.map((f: any) => {
      const expr = String(f.expr || '');
      const isLatex = /\\(?:frac|sqrt|sin|cos|tan|log|ln|pi|left|right)/.test(expr) || /[=<>]/.test(expr);
      return {
        latex: expr,
        fn: isLatex ? undefined : sanitizeExpr(expr),
        color: f.color,
        label: f.label,
        domain: f.domain,
      };
    });
    const xRange = (Array.isArray(funcArgs.xRange) ? funcArgs.xRange : [-5, 5]) as [number, number];
    const yRange = (Array.isArray(funcArgs.yRange) ? funcArgs.yRange : [-5, 5]) as [number, number];
    return {
      action: 'showGraph',
      type: 'generic-xy' as const,
      data: {
        title: funcArgs.title || '',
        xLabel: funcArgs.xLabel || 'x',
        yLabel: funcArgs.yLabel || 'y',
        xRange,
        yRange,
        functions: graphFunctions,
        functionsOfY: graphFunctionsOfY,
        points: Array.isArray(funcArgs.points) ? funcArgs.points : [],
        shadedRegion: funcArgs.shadedRegion ? funcArgs.shadedRegion as unknown as ShadedRegion : undefined,
      },
    };
  }
  if (funcName === 'show_molecule') {
    return {
      action: 'showMolecule',
      smiles: funcArgs.smiles,
      title: funcArgs.title,
      description: funcArgs.description,
      interactive: !!(funcArgs.interactive),
      mode: typeof funcArgs.mode === 'string' ? funcArgs.mode : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_number_line') {
    return { action: 'showNumberLine', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_geometry') {
    return { action: 'showGeometry', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_geometry_constructed') {
    return { action: 'showGeometryConstructed', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_unit_circle') {
    return { action: 'showUnitCircle', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_fraction_bar') {
    return { action: 'showFractionBar', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_tree') {
    return { action: 'showTree', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_venn_diagram') {
    return { action: 'showVennDiagram', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_matrix') {
    return { action: 'showMatrix', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_stats') {
    return { action: 'showStats', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_timeline') {
    return {
      action: 'showTimeline',
      title: funcArgs.title,
      events: Array.isArray(funcArgs.events) ? funcArgs.events : [],
      orientation: funcArgs.orientation,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_map') {
    return {
      action: 'showMap',
      title: funcArgs.title,
      background: funcArgs.background,
      pins: Array.isArray(funcArgs.pins) ? funcArgs.pins : [],
      regions: Array.isArray(funcArgs.regions) ? funcArgs.regions : [],
      caption: funcArgs.caption,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_circuit') {
    return {
      action: 'showCircuit',
      title: funcArgs.title,
      // nodes is no longer used — the renderer auto-computes positions.
      // Kept for back-compat with any cached legacy args.
      nodes: Array.isArray(funcArgs.nodes) ? funcArgs.nodes : undefined,
      components: Array.isArray(funcArgs.components) ? funcArgs.components : [],
      showNodes: funcArgs.showNodes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_early_math') {
    return {
      action: 'showEarlyMath',
      // Pass everything through; the renderer reads spec by `kind`.
      spec: funcArgs as never,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_phonics') {
    return { action: 'showPhonics', spec: funcArgs as never } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_graphic_organizer') {
    return { action: 'showGraphicOrganizer', spec: funcArgs as never } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_writing_frame') {
    return { action: 'showWritingFrame', spec: funcArgs as never } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_labeled_image') {
    return { action: 'showLabeledImage', spec: funcArgs as never } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_solved_example') {
    return { action: 'showSolvedExample', spec: funcArgs as never } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_quiz') {
    return { action: 'showQuiz', spec: funcArgs as never } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_run_code') {
    return {
      action: 'showRunCode',
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
      code: String(funcArgs.code ?? ''),
      entry: typeof funcArgs.entry === 'string' ? funcArgs.entry : undefined,
      language: typeof funcArgs.language === 'string' ? funcArgs.language : undefined,
      tests: Array.isArray(funcArgs.tests) ? funcArgs.tests : undefined,
      timeoutMs: typeof funcArgs.timeoutMs === 'number' ? funcArgs.timeoutMs : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_dimensional_check') {
    return {
      action: 'showDimensionalCheck',
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
      formula: typeof funcArgs.formula === 'string' ? funcArgs.formula : undefined,
      expression: typeof funcArgs.expression === 'string' ? funcArgs.expression : undefined,
      expectedUnit: typeof funcArgs.expectedUnit === 'string' ? funcArgs.expectedUnit : undefined,
      note: typeof funcArgs.note === 'string' ? funcArgs.note : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_balanced_equation') {
    return {
      action: 'showBalancedEquation',
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
      equation: String(funcArgs.equation ?? ''),
      reactionType: typeof funcArgs.reactionType === 'string' ? funcArgs.reactionType : undefined,
      note: typeof funcArgs.note === 'string' ? funcArgs.note : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_lewis_constructed') {
    return {
      action: 'showLewisConstructed',
      title: funcArgs.title,
      formula: funcArgs.formula,
      geometry: funcArgs.geometry,
      atoms: Array.isArray(funcArgs.atoms) ? funcArgs.atoms : [],
      bonds: Array.isArray(funcArgs.bonds) ? funcArgs.bonds : [],
      layout: funcArgs.layout,
      centerAtomId: funcArgs.centerAtomId,
      skipValidation: funcArgs.skipValidation,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_lewis') {
    return {
      action: 'showLewis',
      title: funcArgs.title,
      formula: funcArgs.formula,
      atoms: Array.isArray(funcArgs.atoms) ? funcArgs.atoms : [],
      bonds: Array.isArray(funcArgs.bonds) ? funcArgs.bonds : [],
      geometry: funcArgs.geometry,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_periodic_table') {
    return {
      action: 'showPeriodicTable',
      title: funcArgs.title,
      highlight: Array.isArray(funcArgs.highlight) ? funcArgs.highlight : [],
      highlightGroup: funcArgs.highlightGroup,
      highlightPeriod: funcArgs.highlightPeriod,
      highlightCategory: funcArgs.highlightCategory,
      showMass: funcArgs.showMass,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_annotated_passage') {
    return {
      action: 'showAnnotatedPassage',
      title: funcArgs.title,
      source: funcArgs.source,
      passage: funcArgs.passage,
      lines: Array.isArray(funcArgs.lines) ? funcArgs.lines : undefined,
      startLineNumber: funcArgs.startLineNumber,
      highlights: Array.isArray(funcArgs.highlights) ? funcArgs.highlights : [],
      marginNotes: Array.isArray(funcArgs.marginNotes) ? funcArgs.marginNotes : [],
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_passage') {
    return {
      action: 'showPassage',
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
      source: typeof funcArgs.source === 'string' ? funcArgs.source : undefined,
      text: typeof funcArgs.text === 'string' ? funcArgs.text : '',
      highlights: Array.isArray(funcArgs.highlights) ? funcArgs.highlights.map(String) : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_call_stack') {
    // OpenAI Realtime's strict schema forbids free-form objects, so args/locals
    // arrive as JSON-encoded strings. Decode them back into real objects here
    // (and pass through if the Gemini engine already sent objects).
    const decodeBindings = (v: unknown): Record<string, string | number> | undefined => {
      if (v == null) return undefined;
      if (typeof v === 'object' && !Array.isArray(v)) return v as Record<string, string | number>;
      if (typeof v === 'string') {
        try {
          const parsed = JSON.parse(v);
          return typeof parsed === 'object' && parsed !== null ? parsed : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    };
    const rawFrames = Array.isArray(funcArgs.frames) ? funcArgs.frames : [];
    const frames = rawFrames.map((f: Record<string, unknown>) => ({
      ...f,
      args: decodeBindings(f.args),
      locals: decodeBindings(f.locals),
    }));
    return {
      action: 'showCallStack',
      title: funcArgs.title,
      frames,
      finalReturn: funcArgs.finalReturn,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_flowchart') {
    return {
      action: 'showFlowchart',
      title: funcArgs.title,
      nodes: Array.isArray(funcArgs.nodes) ? funcArgs.nodes : [],
      edges: Array.isArray(funcArgs.edges) ? funcArgs.edges : [],
      layout: funcArgs.layout,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_manipulative') {
    return {
      action: 'showManipulative',
      title: funcArgs.title,
      type: funcArgs.type,
      base10: funcArgs.base10,
      tenFrame: funcArgs.tenFrame,
      areaModel: funcArgs.areaModel,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_diagram') {
    return {
      action: 'showDiagram',
      type: funcArgs.type,
      params: funcArgs.params || {},
    } as unknown as WhiteboardCommand;
  }
  // show_image removed — see comment above the tool definition. If
  // the brain still emits it (cached prompt or otherwise), the call
  // returns null and the orchestrator drops it.
  if (funcName === 'show_solution') {
    return {
      action: 'showSolution',
      steps: Array.isArray(funcArgs.steps) ? funcArgs.steps : [],
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_worked_example') {
    return {
      action: 'showWorkedExample',
      example: funcArgs.example || {},
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'highlight') {
    return {
      action: 'annotate', // highlight renders as an annotate card with highlight style
      text: funcArgs.text,
      style: funcArgs.style || 'highlight',
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'annotate') {
    return {
      action: 'annotate',
      text: funcArgs.text,
      style: funcArgs.style || 'default',
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'draw_vector') {
    return {
      action: 'drawVector',
      from: funcArgs.from,
      to: funcArgs.to,
      label: funcArgs.label,
      color: funcArgs.color,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'clear') {
    return { action: 'clear' } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_punnett') {
    return {
      action: 'showPunnett',
      parent1: funcArgs.parent1,
      parent2: funcArgs.parent2,
      title: funcArgs.title,
      trait: funcArgs.trait,
      showPhenotypeRatio: funcArgs.showPhenotypeRatio !== false,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_try_yourself') {
    return {
      action: 'showTryYourself',
      problem: String(funcArgs.problem ?? ''),
      expectedAnswer: typeof funcArgs.expectedAnswer === 'string' ? funcArgs.expectedAnswer : undefined,
      responseFormat: funcArgs.responseFormat,
      choices: Array.isArray(funcArgs.choices) ? funcArgs.choices : undefined,
      hints: Array.isArray(funcArgs.hints) ? funcArgs.hints : undefined,
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_problem') {
    // Map the flat tool args into the whiteboard's nested `problem` shape.
    // The renderer expects { action: 'showProblem', problem: {...} }.
    const givenValues = Array.isArray(funcArgs.givens)
      ? funcArgs.givens.map((g: { symbol?: string; value?: string | number; unit?: string }) => ({
          symbol: g.symbol,
          value: g.value,
          unit: g.unit,
        }))
      : undefined;
    return {
      action: 'showProblem',
      problem: {
        title: funcArgs.title,
        statement: funcArgs.statement,
        format: funcArgs.format,
        answerChoices: Array.isArray(funcArgs.answerChoices) ? funcArgs.answerChoices : undefined,
        sourceTag: funcArgs.source,
        difficultyLabel: funcArgs.difficulty,
        givenValues,
      },
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_collision') {
    return {
      action: 'showCollision',
      title: funcArgs.title,
      dimension: funcArgs.dimension,
      type: funcArgs.type,
      before: Array.isArray(funcArgs.before) ? funcArgs.before : [],
      after: Array.isArray(funcArgs.after) ? funcArgs.after : [],
      notes: funcArgs.notes,
      momentumAnnotation: funcArgs.momentumAnnotation,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_reaction_coordinate') {
    return {
      action: 'showReactionCoordinate',
      title: funcArgs.title,
      reactants_energy: typeof funcArgs.reactants_energy === 'number' ? funcArgs.reactants_energy : 0,
      products_energy: funcArgs.products_energy,
      activation_energies: Array.isArray(funcArgs.activation_energies) ? funcArgs.activation_energies : [],
      curve_labels: Array.isArray(funcArgs.curve_labels) ? funcArgs.curve_labels : undefined,
      reactant_label: funcArgs.reactant_label,
      product_label: funcArgs.product_label,
      units: funcArgs.units,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_energy_bars') {
    return {
      action: 'showEnergyBars',
      title: funcArgs.title,
      positions: Array.isArray(funcArgs.positions) ? funcArgs.positions : [],
      yAxisLabel: funcArgs.yAxisLabel,
      showTotalLine: funcArgs.showTotalLine,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_free_body_diagram') {
    return {
      action: 'showFreeBodyDiagram',
      title: funcArgs.title,
      object: funcArgs.object || { shape: 'box' },
      // Default to NO surface when the model doesn't specify one — safer than
      // defaulting to "horizontal", which previously drew a spurious floor
      // under hanging/suspended/free-fall objects.
      surface: funcArgs.surface || { type: 'none' },
      forces: Array.isArray(funcArgs.forces) ? funcArgs.forces : [],
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }

  // ── Tier-1 structured tools (batch shipped 2026-04-22) ──
  if (funcName === 'show_coordinate_plane') {
    return {
      action: 'showCoordinatePlane',
      title: funcArgs.title,
      xRange: Array.isArray(funcArgs.xRange) ? funcArgs.xRange : undefined,
      yRange: Array.isArray(funcArgs.yRange) ? funcArgs.yRange : undefined,
      xLabel: funcArgs.xLabel,
      yLabel: funcArgs.yLabel,
      showGrid: funcArgs.showGrid,
      points: Array.isArray(funcArgs.points) ? funcArgs.points : [],
      segments: Array.isArray(funcArgs.segments) ? funcArgs.segments : [],
      vectors: Array.isArray(funcArgs.vectors) ? funcArgs.vectors : [],
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_scatter_plot') {
    return {
      action: 'showScatterPlot',
      title: funcArgs.title,
      xLabel: funcArgs.xLabel,
      yLabel: funcArgs.yLabel,
      points: Array.isArray(funcArgs.points) ? funcArgs.points : [],
      xRange: Array.isArray(funcArgs.xRange) ? funcArgs.xRange : undefined,
      yRange: Array.isArray(funcArgs.yRange) ? funcArgs.yRange : undefined,
      showTrendLine: funcArgs.showTrendLine,
      trendLineEquation: funcArgs.trendLineEquation,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_cycle_diagram') {
    return {
      action: 'showCycleDiagram',
      title: funcArgs.title,
      stages: Array.isArray(funcArgs.stages) ? funcArgs.stages : [],
      clockwise: funcArgs.clockwise,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_concept_map') {
    return {
      action: 'showConceptMap',
      title: funcArgs.title,
      nodes: Array.isArray(funcArgs.nodes) ? funcArgs.nodes : [],
      edges: Array.isArray(funcArgs.edges) ? funcArgs.edges : [],
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_motion_diagram') {
    return {
      action: 'showMotionDiagram',
      title: funcArgs.title,
      timeLabel: funcArgs.timeLabel,
      series: Array.isArray(funcArgs.series) ? funcArgs.series : [],
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_projectile_motion') {
    return {
      action: 'showProjectileMotion',
      title: funcArgs.title,
      v0: funcArgs.v0,
      angle: funcArgs.angle,
      y0: funcArgs.y0,
      g: funcArgs.g,
      showComponents: funcArgs.showComponents,
      sampleCount: funcArgs.sampleCount,
      speedUnit: funcArgs.speedUnit,
      distanceUnit: funcArgs.distanceUnit,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_simple_machine') {
    return {
      action: 'showSimpleMachine',
      title: funcArgs.title,
      type: funcArgs.type,
      variant: funcArgs.variant,
      effort: funcArgs.effort,
      load: funcArgs.load,
      effortArm: funcArgs.effortArm,
      loadArm: funcArgs.loadArm,
      angle: funcArgs.angle,
      length: funcArgs.length,
      height: funcArgs.height,
      ropes: funcArgs.ropes,
      unit: funcArgs.unit,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_pendulum') {
    return {
      action: 'showPendulum',
      title: funcArgs.title,
      length: funcArgs.length,
      amplitude: funcArgs.amplitude,
      mass: funcArgs.mass,
      g: funcArgs.g,
      showArc: funcArgs.showArc,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_spring_mass') {
    return {
      action: 'showSpringMass',
      title: funcArgs.title,
      // Chain mode: pass elements[] through verbatim so the renderer can
      // pick up wall/spring/mass entries in left-to-right order.
      elements: Array.isArray(funcArgs.elements) ? funcArgs.elements : undefined,
      // Legacy single-mass fields (ignored by the renderer when elements is set).
      k: funcArgs.k,
      mass: funcArgs.mass,
      displacement: funcArgs.displacement,
      naturalLength: funcArgs.naturalLength,
      orientation: funcArgs.orientation,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_ray_diagram') {
    return {
      action: 'showRayDiagram',
      title: funcArgs.title,
      type: funcArgs.type,
      focalLength: funcArgs.focalLength,
      objectDistance: funcArgs.objectDistance,
      objectHeight: funcArgs.objectHeight,
      showLabels: funcArgs.showLabels,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_wave') {
    return {
      action: 'showWave',
      title: funcArgs.title,
      wave: funcArgs.wave,
      secondary: funcArgs.secondary,
      showSuperposition: funcArgs.showSuperposition,
      frequency: funcArgs.frequency,
      showAnnotations: funcArgs.showAnnotations,
      xLabel: funcArgs.xLabel,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_vector') {
    return {
      action: 'showVector',
      title: funcArgs.title,
      vectors: Array.isArray(funcArgs.vectors) ? funcArgs.vectors : [],
      layout: funcArgs.layout,
      showResultant: funcArgs.showResultant,
      resultantLabel: funcArgs.resultantLabel,
      showComponents: funcArgs.showComponents,
      showAxes: funcArgs.showAxes,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_orbital_diagram') {
    return {
      action: 'showOrbitalDiagram',
      title: funcArgs.title,
      element: funcArgs.element,
      configuration: Array.isArray(funcArgs.configuration) ? funcArgs.configuration : undefined,
      condensed: funcArgs.condensed,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_pedigree') {
    return {
      action: 'showPedigree',
      title: funcArgs.title,
      individuals: Array.isArray(funcArgs.individuals) ? funcArgs.individuals : [],
      marriages: Array.isArray(funcArgs.marriages) ? funcArgs.marriages : [],
      children: Array.isArray(funcArgs.children) ? funcArgs.children : [],
      legend: Array.isArray(funcArgs.legend) ? funcArgs.legend : undefined,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_cell_diagram') {
    return {
      action: 'showCellDiagram',
      title: funcArgs.title,
      type: funcArgs.type,
      highlight: Array.isArray(funcArgs.highlight) ? funcArgs.highlight : undefined,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_dna') {
    return {
      action: 'showDna',
      title: funcArgs.title,
      mode: funcArgs.mode,
      sequence: funcArgs.sequence,
      complement: funcArgs.complement,
      mrna: funcArgs.mrna,
      rungs: funcArgs.rungs,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_food_web') {
    return {
      action: 'showFoodWeb',
      title: funcArgs.title,
      species: Array.isArray(funcArgs.species) ? funcArgs.species : [],
      edges: Array.isArray(funcArgs.edges) ? funcArgs.edges : [],
      showLevelLabels: funcArgs.showLevelLabels,
      notes: funcArgs.notes,
    } as unknown as WhiteboardCommand;
  }

  if (funcName === 'tutor_scribble') {
    const target = typeof funcArgs.target === 'string' && funcArgs.target.trim() ? funcArgs.target.trim() : undefined;
    if (!target) return null;
    // Post-redesign vocabulary: only 'tick' + 'highlight'. Legacy shapes
    // (circle/underline/box/arrow) silently remap to 'tick' so in-flight
    // sessions and old lesson plans keep working without validator
    // rejection. Default when shape is omitted is 'tick'.
    const rawShape = typeof funcArgs.shape === 'string' ? funcArgs.shape : 'tick';
    const shape: 'tick' | 'highlight' = rawShape === 'highlight' ? 'highlight' : 'tick';
    return {
      action: 'scribble',
      target,
      shape,
      color: typeof funcArgs.color === 'string' ? funcArgs.color : undefined,
      // stripInlineMathForInk: scribble labels render on the ink overlay
      // (no KaTeX) — flatten $-spans (round 29).
      label: typeof funcArgs.label === 'string' ? stripInlineMathForInk(funcArgs.label) : undefined,
      // Board Map page-scoping: disambiguates a feature name repeated across
      // pages. Resolved (fail-open) in the orchestrator's resolveTarget call.
      page: typeof funcArgs.page === 'number' ? funcArgs.page : undefined,
    };
  }

  if (funcName === 'tutor_link') {
    if (!linksEnabled()) return null; // stale brain flag-off — silent
    const from = typeof funcArgs.from === 'string' ? funcArgs.from.trim() : '';
    const to = typeof funcArgs.to === 'string' ? funcArgs.to.trim() : '';
    if (!from || !to) return null;
    const cmd: WhiteboardCommand = { action: 'link', from, to };
    if (typeof funcArgs.label === 'string' && funcArgs.label.trim()) cmd.label = stripInlineMathForInk(funcArgs.label);
    if (typeof funcArgs.color === 'string' && funcArgs.color.trim()) cmd.color = funcArgs.color.trim();
    return cmd;
  }

  if (funcName === 'tutor_scroll_whiteboard') {
    const target = typeof funcArgs.target === 'string' ? funcArgs.target.trim() : '';
    if (!target) return null;
    return {
      action: 'scrollTo',
      target,
      page: typeof funcArgs.page === 'number' ? funcArgs.page : undefined,
    };
  }
  if (funcName === 'tutor_handwrite') {
    // stripInlineMathForInk (round 29): ink notes render raw text nodes —
    // no KaTeX — so "$10$ is even" printed its dollar signs literally.
    const text = typeof funcArgs.text === 'string' ? stripInlineMathForInk(funcArgs.text) : '';
    if (!text) return null;
    // Post-redesign: handwrite is a pure text note command (formerly fed
    // the now-deleted AnnotationStrip; now on-board via InkNotesOverlay).
    // The `position` / `margin` fields are accepted-but-ignored so
    // in-flight brain calls during system-prompt cache turnover don't
    // crash. The orchestrator strips these silently before rendering.
    //
    // SmoothDraw Phase 3: `near` rides through by default (ink notes are
    // ON by default post-legibility-gate) — the kill switch
    // (`NEXT_PUBLIC_TUTOR_INK_NOTES=off`) drops it here, mirroring the
    // orchestrator's stripping loop, the second half of this gate.
    const cmd: WhiteboardCommand = { action: 'handwrite', text, ...(typeof funcArgs.color === 'string' ? { color: funcArgs.color } : {}) };
    if (inkNotesEnabled() && typeof funcArgs.near === 'string' && funcArgs.near.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmd as any).near = funcArgs.near.trim();
    }
    return cmd;
  }
  if (funcName === 'advance_lesson') {
    return { action: 'advanceLesson', to: String(funcArgs.to ?? 'next'), reason: funcArgs.reason };
  }
  if (funcName === 'propose_plan_swap') {
    const targetSubTopic = typeof funcArgs.targetSubTopic === 'string' ? funcArgs.targetSubTopic.trim() : '';
    if (!targetSubTopic) return null;
    return {
      action: 'proposePlanSwap',
      targetSubTopic,
      reason: typeof funcArgs.reason === 'string' ? funcArgs.reason : undefined,
    };
  }
  if (funcName === 'confirm_plan_los') {
    const raw = funcArgs.pickedLoIds;
    if (!Array.isArray(raw)) return null;
    const pickedLoIds = raw
      .map((v) => (typeof v === 'string' ? v.trim() : ''))
      .filter((v): v is string => v.length > 0);
    if (pickedLoIds.length === 0) return null;
    return { action: 'confirmPlanLos', pickedLoIds };
  }
  if (funcName === 'mark_segment_complete') {
    return {
      action: 'markSegmentComplete',
      segmentId: String(funcArgs.segmentId ?? ''),
      masteryDelta: typeof funcArgs.masteryDelta === 'number' ? funcArgs.masteryDelta : undefined,
      notes: typeof funcArgs.notes === 'string' ? funcArgs.notes : undefined,
    };
  }
  if (funcName === 'record_gap') {
    const observation = typeof funcArgs.observation === 'string'
      ? funcArgs.observation
      : typeof funcArgs.description === 'string'
        ? funcArgs.description // legacy callers
        : '';
    return {
      action: 'recordGap',
      loId: String(funcArgs.loId ?? ''),
      observation,
      studentQuotes: Array.isArray(funcArgs.studentQuotes)
        ? funcArgs.studentQuotes.filter((q: unknown): q is string => typeof q === 'string').slice(0, 2)
        : [],
      signalsObserved: Array.isArray(funcArgs.signalsObserved)
        ? funcArgs.signalsObserved.filter((s: unknown): s is string => typeof s === 'string')
        : [],
    };
  }
  if (funcName === 'flag_prerequisite_gap') {
    return {
      action: 'flagPrerequisiteGap',
      conceptLabel: String(funcArgs.conceptLabel ?? ''),
      observation: typeof funcArgs.observation === 'string' ? funcArgs.observation : '',
      studentQuotes: Array.isArray(funcArgs.studentQuotes)
        ? funcArgs.studentQuotes.filter((q: unknown): q is string => typeof q === 'string').slice(0, 2)
        : [],
      signalsObserved: Array.isArray(funcArgs.signalsObserved)
        ? funcArgs.signalsObserved.filter((s: unknown): s is string => typeof s === 'string')
        : [],
    };
  }
  if (funcName === 'expand_topic_notes_theory') {
    const rawKind = funcArgs.kind;
    const kind: 'expansion' | 'prereq-refresher' | 'student-add' =
      rawKind === 'prereq-refresher' || rawKind === 'student-add' ? rawKind : 'expansion';
    const loIdRaw = funcArgs.loId;
    return {
      action: 'expandTopicNotesTheory',
      loId: typeof loIdRaw === 'string' && loIdRaw ? loIdRaw : null,
      kind,
      conceptLabel: typeof funcArgs.conceptLabel === 'string' ? funcArgs.conceptLabel : undefined,
      title: typeof funcArgs.title === 'string' ? funcArgs.title : undefined,
      content: String(funcArgs.content ?? ''),
      rationale: typeof funcArgs.rationale === 'string' ? funcArgs.rationale : undefined,
    };
  }
  if (funcName === 'add_topic_notes_method') {
    return {
      action: 'addTopicNotesMethod',
      title: String(funcArgs.title ?? ''),
      when_to_use: typeof funcArgs.when_to_use === 'string' ? funcArgs.when_to_use : undefined,
      steps: Array.isArray(funcArgs.steps)
        ? funcArgs.steps.filter((s: unknown): s is string => typeof s === 'string')
        : [],
      alternativeTo: typeof funcArgs.alternativeTo === 'string' ? funcArgs.alternativeTo : undefined,
      relatedLoIds: Array.isArray(funcArgs.relatedLoIds)
        ? funcArgs.relatedLoIds.filter((s: unknown): s is string => typeof s === 'string')
        : undefined,
      rationale: typeof funcArgs.rationale === 'string' ? funcArgs.rationale : undefined,
    };
  }
  if (funcName === 'add_topic_notes_pointer') {
    return {
      action: 'addTopicNotesPointer',
      content: String(funcArgs.content ?? ''),
      kind: typeof funcArgs.kind === 'string' ? funcArgs.kind : undefined,
      relatedLoIds: Array.isArray(funcArgs.relatedLoIds)
        ? funcArgs.relatedLoIds.filter((s: unknown): s is string => typeof s === 'string')
        : undefined,
      rationale: typeof funcArgs.rationale === 'string' ? funcArgs.rationale : undefined,
    };
  }
  // generate_problem is NOT a whiteboard command — it's a server-side
  // pipeline trigger handled by toolResultProvider in claude-brain.ts.
  // The brain receives the canonical text in the tool_result and then
  // emits a separate show_problem with that text. Returning null here
  // is intentional.
  if (funcName === 'generate_problem') {
    return null;
  }

  return null;
}

/**
 * Convert tool definitions to OpenAI Realtime API format.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toOpenAITools(tools: ToolDefinition[]): any[] {
  return tools.map(tool => ({
    type: 'function',
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}

/**
 * Convert tool definitions to the Anthropic Messages API format. Anthropic
 * uses `input_schema` instead of `parameters` — otherwise the JSON Schema
 * shape is the same as OpenAI's, so no field-by-field conversion needed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toAnthropicTools(tools: ToolDefinition[]): any[] {
  return tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters,
  }));
}

/**
 * Convert JSON Schema types to Gemini format (uppercase types, no unsupported features).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertSchemaForGemini(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === 'type' && typeof value === 'string') {
      // Gemini uses uppercase type names
      result.type = value.toUpperCase();
    } else if (key === 'items') {
      result.items = convertSchemaForGemini(value);
    } else if (key === 'properties') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.properties = {} as any;
      for (const [propKey, propValue] of Object.entries(value as Record<string, unknown>)) {
        result.properties[propKey] = convertSchemaForGemini(propValue);
      }
    } else if (key === 'enum') {
      // Gemini supports enum but only for STRING type
      result.enum = value;
    } else if (key === 'required') {
      result.required = value;
    } else if (key === 'description') {
      result.description = value;
    }
    // Skip other JSON Schema features not supported by Gemini
  }

  return result;
}

/**
 * Convert tool definitions to Google Gemini function calling format.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toGeminiTools(tools: ToolDefinition[]): any[] {
  return [{
    functionDeclarations: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: convertSchemaForGemini(tool.parameters),
    })),
  }];
}
