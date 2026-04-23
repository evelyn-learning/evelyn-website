/**
 * Shared Tool Definitions for AI Voice Tutor
 *
 * Defines all whiteboard tools in a neutral format that can be converted
 * to OpenAI Realtime or Google Gemini function calling schemas.
 * This prevents duplicating ~300 lines of tool definitions across hooks.
 */

import type { WhiteboardCommand, ShadedRegion } from '@/lib/knowledge/types';

export interface ToolParameter {
  type: string;
  description?: string;
  enum?: Array<string | number>;
  items?: ToolParameter | { type: string; properties?: Record<string, ToolParameter>; required?: string[] };
  properties?: Record<string, ToolParameter>;
  required?: string[];
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

/**
 * All whiteboard tools available to the AI tutor.
 * These are the canonical definitions — convert to platform-specific
 * format using toOpenAITools() or toGeminiTools().
 */
export const WHITEBOARD_TOOLS: ToolDefinition[] = [
  {
    name: 'show_equation',
    description: 'Display an equation on the whiteboard. You MUST call this whenever you mention ANY equation, formula, or mathematical relationship in your speech. Always show equations visually — never just say them without also displaying them.',
    parameters: {
      type: 'object',
      properties: {
        latex: { type: 'string', description: 'The equation in LaTeX format' },
        label: { type: 'string', description: 'A label for the equation' },
      },
      required: ['latex'],
    },
  },
  {
    name: 'show_function_graph',
    description: 'Plot mathematical functions on the whiteboard using Desmos. Use this INSTEAD of show_svg_diagram for graphs. Supports: equations (y=f(x), x=f(y)), implicit equations (x²+y²=1), inequalities, labeled points, and shaded regions. Function expressions use LaTeX math notation: use ^ for exponents, \\frac{a}{b} for fractions, \\sqrt{x} for square root, \\sin, \\cos, \\tan, \\pi, e. You can also provide implicit equations like "x^2/4 + y^2 = 1" directly. For y=f(x) curves, use "functions". For x=f(y) curves, use "functionsOfY". For vertical lines x=c, use functionsOfY with expr "c". For horizontal lines y=c, use functions with expr "c". ALWAYS provide a label for each function.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title for the graph' },
        xLabel: { type: 'string', description: 'X-axis label (default: "x")' },
        yLabel: { type: 'string', description: 'Y-axis label (default: "y")' },
        xRange: { type: 'array', items: { type: 'number' }, description: 'Visible x-axis range as [min, max], e.g. [-5, 10]' },
        yRange: { type: 'array', items: { type: 'number' }, description: 'Visible y-axis range as [min, max], e.g. [-5, 5]' },
        functions: {
          type: 'array',
          description: 'y=f(x) functions or implicit equations to plot.',
          items: {
            type: 'object',
            properties: {
              expr: { type: 'string', description: 'LaTeX expression, e.g. "x^2", "\\sin(x)", "\\frac{x^2}{4} + y^2 = 1"' },
              color: { type: 'string', description: 'Color hex, e.g. "#dc2626"' },
              label: { type: 'string', description: 'Legend label. ALWAYS provide a readable label.' },
              domain: { type: 'array', items: { type: 'number' }, description: 'Optional x-domain restriction [min, max]' },
            },
            required: ['expr', 'label'],
          },
        },
        functionsOfY: {
          type: 'array',
          description: 'x=f(y) functions to plot (curves where x depends on y, or vertical lines).',
          items: {
            type: 'object',
            properties: {
              expr: { type: 'string', description: 'LaTeX expression using y, or a constant for vertical line' },
              color: { type: 'string', description: 'Color hex' },
              label: { type: 'string', description: 'Legend label. ALWAYS provide a readable label.' },
              domain: { type: 'array', items: { type: 'number' }, description: 'Optional y-domain restriction [min, max]' },
            },
            required: ['expr', 'label'],
          },
        },
        points: {
          type: 'array',
          description: 'Labeled points to mark on the graph. CRITICAL when marking intersections of multiple curves: every (x, y) you include MUST satisfy EVERY plotted equation — do NOT label x-intercepts, y-intercepts, vertices, or critical points of a SINGLE curve as intersections. For y=f(x) and y=g(x), verify f(x)=g(x)=y for each point before including it (e.g. for y=x^3 and y=4x−x², only (0,0) and x = (−1+√17)/2 ≈ 1.56 are intersections; (2,4) is the parabola vertex, (4,0) is just an x-intercept — NEITHER is an intersection). Incorrect intersection labels will be auto-removed by the validator.',
          items: {
            type: 'object',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              label: { type: 'string', description: 'e.g. "(1, 1)"' },
              color: { type: 'string' },
            },
            required: ['x', 'y'],
          },
        },
        shadedRegion: {
          type: 'object',
          description: 'Shade area between two curves.',
          properties: {
            axis: { type: 'string', enum: ['x', 'y'] },
            between: { type: 'array', items: { type: 'string' } },
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
    description: 'Start a new whiteboard page. Use this BEFORE showing content for a new concept or topic.',
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
    description: 'Navigate the whiteboard to a previously created page by its title.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'The title of the page to navigate to.' },
      },
      required: ['title'],
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
    name: 'show_svg_diagram',
    description: 'Display a diagram on the whiteboard using SVG. Use for physical setups, biology, chemistry structures. NOT for math function graphs. LAYOUT ZONES (viewBox 0 0 400 300): Title y=10-30, Shapes y=60-200, Labels y=210-290. ALL text labels go OUTSIDE shapes.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title for the visual' },
        description: { type: 'string', description: 'Brief description' },
        svg: { type: 'string', description: 'SVG markup with viewBox="0 0 400 300"' },
      },
      required: ['svg', 'title'],
    },
  },
  {
    name: 'show_molecule',
    description: 'Display a molecular structure on the whiteboard using an interactive chemistry editor. The editor renders a proper 2D structural formula from the SMILES notation with correct bond angles and atom positions. Students can modify the structure. Use for: organic molecules, functional groups, chemical structures, reactions.',
    parameters: {
      type: 'object',
      properties: {
        smiles: { type: 'string', description: 'SMILES notation for the molecule (e.g., "CCO" for ethanol, "c1ccccc1" for benzene, "CC(=O)O" for acetic acid)' },
        title: { type: 'string', description: 'Title/name of the molecule' },
        description: { type: 'string', description: 'What to notice about this structure' },
        interactive: { type: 'boolean', description: 'Allow student to edit the structure (default: false)' },
      },
      required: ['smiles', 'title'],
    },
  },
  {
    name: 'show_number_line',
    description: 'Display a number line with points, intervals, and hops.',
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
    description: 'Display geometric figures with labeled vertices, segments, polygons, circles, and angle markers. ALWAYS use this instead of show_svg_diagram for geometric figures.\n\nCRITICAL: If drawing a circle (or anything with "circle" in the title, e.g. "Circle with Chord"), you MUST include at least one entry in `circles` with a `center` point id and a `radius` number — points and segments alone do NOT draw a circle boundary. For a chord, put the two endpoints in `points` with coordinates that lie on the circle (|point - center| = radius), and add a `segment` between them. Same rule for `polygons` (triangle/square/etc. titles require a polygon entry).\n\nLABELING CONVENTIONS:\n- Point `label`: when the student\'s prompt specifies explicit coordinates (e.g. "A=(0,0), B=(6,0)"), include them in the label: `label: "A(0, 0)"`. When coordinates are implicit or symbolic, just use the letter: `label: "A"`.\n- Segment `label`: use the two endpoint letters, e.g. "AB" or the length if known (e.g. "AB = 6" or "6"). Never leave it blank if the user asked to label sides.\n- Angle `label`: prefer the measure in degrees (e.g. "53°", "90°"). If the measure is unknown, use a name like "α" or "∠A = ?". AVOID labeling an angle with just the bare symbol "∠" — the renderer will auto-compute the degree measure from geometry if the label is missing or just "∠", so you can also omit `label` entirely and let the renderer fill it in.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        points: { type: 'array', description: 'Named points with coordinates', items: { type: 'object', properties: { id: { type: 'string' }, x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' }, color: { type: 'string' } }, required: ['id', 'x', 'y'] } },
        segments: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, style: { type: 'string', enum: ['solid', 'dashed', 'dotted'] }, color: { type: 'string' }, label: { type: 'string' }, tickMarks: { type: 'number' } }, required: ['from', 'to'] } },
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
    name: 'show_unit_circle',
    description: 'Display the unit circle with angle markers, reference triangles, and trig coordinates.',
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
    description: 'Display a tree diagram with auto-layout. Use for: probability trees, factor trees, decision trees.\n\nSCHEMA — a child is an EDGE wrapper `{ label, probability?, node }`, NOT a bare node. The nested node must go under `node`, not inline.\n\nFOR A PROBABILITY TREE (e.g. 3 coin flips), set `type: "probability"` and `showLeafProbabilities: true`. Example for coin × 3:\n{\n  "label": "Start",\n  "children": [\n    { "label": "H", "probability": "1/2", "node": {\n        "label": "H",\n        "children": [\n          { "label": "H", "probability": "1/2", "node": { "label": "HH", "children": [\n              { "label": "H", "probability": "1/2", "node": { "label": "HHH" } },\n              { "label": "T", "probability": "1/2", "node": { "label": "HHT" } }\n          ]}},\n          { "label": "T", "probability": "1/2", "node": { "label": "HT", "children": [\n              { "label": "H", "probability": "1/2", "node": { "label": "HTH" } },\n              { "label": "T", "probability": "1/2", "node": { "label": "HTT" } }\n          ]}}\n        ]\n    }},\n    { "label": "T", "probability": "1/2", "node": { /* mirror of H branch */ }}\n  ]\n}\n\nEvery child object MUST have a `node` field (the child subtree). Leaf nodes have `children: []` or omit children entirely. Never send `children: [{ label: "H" }]` without the `node` wrapper — the renderer needs the edge/node split to draw branch labels separately.',
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
    description: 'Display a 2- or 3-set Venn diagram. Each call REPLACES the previous diagram — if the student provides counts after an empty diagram, call this again with `regions` populated; do not stall with "which region first?" conversationally.\n\nREGION KEYS (use EXACTLY these strings):\n  2-set: "onlyA", "onlyB", "intersection", "neither"\n  3-set: "onlyA", "onlyB", "onlyC", "AB", "AC", "BC", "ABC", "neither"\nEach region maps to A/B/C in declaration order: sets[0]=A, sets[1]=B, sets[2]=C.\nFor 3-set, "AB" means "in A and B, NOT in C" (the lens between A and B minus the triple overlap). "ABC" is the center where all three overlap.\n\nREGION VALUE:\n  regions["AB"] = { "value": "65" }  ← the number shown in that region.\n  Optional: "highlight": true (faint yellow fill), "items": ["Alice", "Bob"] (listed contents instead of a single value).\n\nWHEN THE STUDENT GIVES DATA, COMPUTE THE EXCLUSIVE-REGION COUNTS AND FILL THE DIAGRAM:\nIf the student says "|M|=100, |S|=200, |E|=300, |M∩S|=75, |S∩E|=65, |M∩E|=55, |M∩S∩E|=10" (cumulative counts, meaning |M| = all students in Math including overlaps), compute:\n  ABC = 10\n  AB (M∩S only) = |M∩S| - |M∩S∩E| = 75 - 10 = 65\n  AC (M∩E only) = |M∩E| - |M∩S∩E| = 55 - 10 = 45\n  BC (S∩E only) = |S∩E| - |M∩S∩E| = 65 - 10 = 55\n  onlyA (M only) = |M| - (AB + AC + ABC) = 100 - (65 + 45 + 10) = -20 (flag inconsistency to the student)\n  onlyB (S only) = |S| - (AB + BC + ABC) = 200 - (65 + 55 + 10) = 70\n  onlyC (E only) = |E| - (AC + BC + ABC) = 300 - (45 + 55 + 10) = 190\n\nIf the student\'s numbers are ALREADY the exclusive region counts ("Math-only=100, Science-only=200, ..., all-three=10"), just assign them directly.\n\nEXAMPLE CALL:\n{\n  "sets": [{"label":"Math","color":"#2563eb"},{"label":"Science","color":"#16a34a"},{"label":"English","color":"#dc2626"}],\n  "regions": {\n    "onlyA": {"value":"100"}, "onlyB": {"value":"200"}, "onlyC": {"value":"300"},\n    "AB": {"value":"75"}, "AC": {"value":"55"}, "BC": {"value":"65"},\n    "ABC": {"value":"10"}\n  },\n  "universalLabel": "Students"\n}',
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
    name: 'show_problem',
    description: 'Display a complete problem as a formatted card on the whiteboard. Use whenever the student asks for a practice problem, quiz question, or says "give me a problem", "quiz me", "I want to practice", or similar.\n\nREQUIRED FIELDS — YOU MUST POPULATE BOTH OR THE CALL WILL BE REJECTED:\n• statement: the full problem text, written out as ONE complete string. Never empty. Never a placeholder.\n• format: one of "multiple-choice" | "grid-in" | "free-response" | "short-answer" | "true-false".\n\nCORRECT EXAMPLE (copy this shape):\n{"statement":"Find the area of the region enclosed by the curves y=x^2 and y=4x-x^2.","format":"free-response","title":"AP Calculus AB – Area Between Curves","source":"AP Calculus AB FRQ","difficulty":"medium"}\n\nAfter the call, your voice narration should be brief: "Here is a problem for you — take a look and tell me when you are ready." Do not start teaching until the student has read and engaged.\n\nMATCH THE FORMAT TO THE TEST when the student is prepping for SAT, ACT, AP, JEE, GRE, GCSE, IB, etc.: use the test\'s actual answer-choice convention (SAT/ACT/AP MC: A–D; JEE: 4 choices with negative marking; GRE Quant: 5 choices) and set `source` to the test name + section.',
    parameters: {
      type: 'object',
      properties: {
        statement: { type: 'string', description: 'REQUIRED. The full problem text the student will read — write it out completely as ONE string. This field MUST be populated on every show_problem call; leaving it blank or omitting it will cause the tool call to be rejected. The whiteboard has no memory of prior titles, so every show_problem needs the entire problem restated here, even if you already said something about it in a prior turn.' },
        format: { type: 'string', enum: ['multiple-choice', 'grid-in', 'free-response', 'short-answer', 'true-false'], description: 'Presentation format. Use "multiple-choice" when the test format has answer choices (SAT, ACT, AP MC, JEE, GRE, etc.) — in that case answerChoices is REQUIRED.' },
        answerChoices: {
          type: 'array',
          description: 'REQUIRED when format is "multiple-choice". Each entry has a letter (A/B/C/D/E or 1/2/3/4) and the choice text. Use the letter convention of the actual test.',
          items: { type: 'object', properties: { letter: { type: 'string' }, text: { type: 'string' } }, required: ['letter', 'text'] },
        },
        title: { type: 'string', description: 'Short title shown above the problem, e.g. "SAT No-Calc Problem" or "JEE Main – Quadratics".' },
        givens: {
          type: 'array',
          description: 'Optional list of named given quantities, shown under the statement for problems with defined variables.',
          items: { type: 'object', properties: { symbol: { type: 'string' }, value: { type: 'string' }, unit: { type: 'string' } }, required: ['symbol', 'value'] },
        },
        source: { type: 'string', description: 'Test/exam name and section shown as a provenance tag, e.g. "SAT No-Calc", "AP Physics 1 MC", "JEE Main Algebra", "GCSE Higher Tier", "IB HL Paper 1". Always set this when the student is on a test prep track.' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'], description: 'Shown as a badge. Match what the actual test considers easy/medium/hard for that topic.' },
      },
      required: ['statement', 'format'],
    },
  },
  {
    name: 'show_diagram',
    description: 'Display a structured physics / motion / fluid diagram. Use this INSTEAD of show_svg_diagram for any of these: free-body diagrams (forces on an object), motion diagrams (positions over time), projectile trajectories, vector addition (wind+boat, relative motion), coordinate systems with labeled axes, circular paths (cyclist, orbit, banked turn), pipe flow / continuity (fluid dynamics). Pick the `type` that matches the problem and pass structured `params` — the renderer handles the drawing. For velocity/wind/relative-motion problems use type: "vectors" and provide a `vectors` array. For forces on an object use type: "free-body" and provide a `forces` array. NEVER describe these in words without calling this tool.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'free-body',
            'motion',
            'projectile',
            'vectors',
            'velocity',
            'vector-addition',
            'coordinate-system',
            'circular-path',
            'pipe-flow',
            'fluid-flow',
            'continuity',
          ],
          description: 'Diagram family. "vectors" for comparing/adding velocities and forces as arrows. "free-body" for forces on one object. "projectile" for trajectories. "motion" for position-over-time dots. "circular-path" for circular motion paths. "pipe-flow" for fluid continuity.',
        },
        params: {
          type: 'object',
          description: 'Type-specific parameters. Examples — free-body: { forces: [{magnitude, direction, label, color}], objectLabel, showNet, scale }. vectors: { title, vectors: [{magnitude, direction, label, color}], showResultant, resultantLabel, scale, showAxes }. projectile: { v0, angle, showComponents, showVelocityAtPoints }. motion: { positions: [{x,y,t}], showVelocityVectors }. circular-path: { radius, title, points: [{angle, label, color}], path: [{from, to, type, color}] }. pipe-flow: { segments: [{radius, velocity, label}] }. Direction convention: 0°=East, 90°=North, 180°=West, 270°=South.',
        },
      },
      required: ['type', 'params'],
    },
  },
  {
    name: 'show_image',
    description: 'Display an image on the whiteboard — e.g. a photograph, a periodic table image, a historical photo, a painting, an anatomical diagram, a microscope image. Use this when the best teaching aid is a real image rather than a generated diagram. Only use image URLs you are confident exist (well-known public domain images, Wikimedia, or URLs the student provided). If unsure, draw instead of linking.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Fully qualified image URL.' },
        alt: { type: 'string', description: 'Short caption / alt text shown below the image.' },
      },
      required: ['url'],
    },
  },
  {
    name: 'show_solution',
    description: 'Display a structured multi-step solution card with numbered steps. Each step has a description and optionally an equation, substitution, result, and short explanation. USE THIS when working through a problem end-to-end (especially in walk-through mode) — it gives the student a clean review artifact. Do NOT use this in pure Socratic mode where the student is deriving the steps themselves.',
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
              properties: { statement: { type: 'string' } },
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
    description: 'Draw a single labeled vector arrow from one coordinate to another. Use for one-off vector illustrations outside of a full diagram. For multiple vectors or a full physics diagram, use show_diagram with type "vectors" or "free-body" instead.',
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
    description: 'Clear the whiteboard and return to the first page. Use sparingly — prefer new_page for transitioning between concepts so the student can still scroll back. Only clear when the board is genuinely cluttered and the student asks for a fresh start.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'show_timeline',
    description: 'Display a horizontal timeline of dated events — for history, biography, scientific discovery, literature periods, language evolution, or any topic where sequence-in-time matters. Events are auto-spaced by year when dates parse to numbers (supports BCE via negative years, "500 BCE", "1492 CE", "1776"); falls back to even spacing for string dates ("Paleozoic Era", "5th century"). Use `category` to color-group related events.',
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
    description: 'Display a schematic circuit diagram with standard IEEE symbols (zigzag resistors, parallel-plate capacitors, battery cells, switches, bulbs, voltmeters, ammeters, ground). Describe the circuit as a NETLIST — a list of components, each with `from` and `to` node ids (any strings). The renderer handles all positioning and wire routing. Components sharing the same {from, to} pair are rendered as parallel branches. IMPORTANT: the circuit MUST form a closed loop — include a component returning to the battery\'s other terminal. Put component values in `value` (numeric) and units in `unit` ("Ω", "μF", "V", "H", "A").',
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
              from: { type: 'string', description: 'Node id — any string.' },
              to: { type: 'string', description: 'Node id — any string.' },
              value: { type: 'string' },
              unit: { type: 'string' },
              label: { type: 'string', description: 'Variable name, e.g. "R_1" or "ε".' },
            },
            required: ['type', 'from', 'to'],
          },
        },
        showNodes: { type: 'boolean', description: 'Draw small dots at each node. Default true.' },
      },
      required: ['components'],
    },
  },
  {
    name: 'show_lewis',
    description: 'Display a 2D Lewis dot structure — atoms connected by single/double/triple bonds, with lone pair electrons drawn as dots around each atom, and optional formal charges. Use for chemistry teaching of bonding, resonance, formal charge, electron accounting, and molecular geometry. Place atoms at x,y in a normalized 0–100 coordinate system (keep atoms ~30 units apart for clear bond visibility). This renderer is DIFFERENT from show_molecule — use this for 2D Lewis structures and show_molecule for 3D molecular models with SMILES. Formal charges are shown as superscripts in red (+1, -1).',
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
    name: 'show_periodic_table',
    description: 'Display the full periodic table with all 118 elements arranged in the standard group/period layout. Elements are colored by category (alkali metals, halogens, noble gases, etc.) with a legend. Use this to teach periodic trends, group chemistry, element properties, or to point out specific elements. Use highlights to focus attention: `highlight` for specific symbols, `highlightGroup` (1–18) for an entire column, `highlightPeriod` (1–7) for an entire row, `highlightCategory` for all elements of one type. Set `showMass` to display atomic masses on each tile.',
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
    description: 'Display a reading passage with line numbers, highlighted text spans, and margin notes — the core ELA teaching artifact for close reading, literary analysis, rhetoric, poetry analysis, and SAT/ACT/AP reading comprehension. Provide the passage as a single `passage` string (will be split on newlines) OR as pre-split `lines` array. Highlights reference text by line number + substring. Margin notes attach to a line number and appear in a right-hand gutter. Use colors thoughtfully — e.g. yellow for imagery, blue for evidence, green for thesis.',
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
    name: 'show_call_stack',
    description: 'Display a visual call stack for teaching recursion, scope, and function invocation. Provide `frames` with the OLDEST frame first (bottom of stack, usually `main`) and the newest call LAST (top). Each frame shows its function signature, argument bindings, local variables, and optionally the currently-executing line. Use `returnValue` on a frame to indicate it is about to return. Use for CS101, AP CS A, recursion teaching, debugging scope.',
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
    description: 'Display a flowchart for algorithm teaching or any procedure with branching. Node types: "start" / "end" (rounded pills), "process" (rectangle), "decision" (diamond, for branches), "io" (parallelogram, for read/write). ALWAYS include `edges`. Label every decision-branch edge with "yes" / "no" / condition text.\n\nLAYOUT RULES for branching / looping algorithms (always use explicit x,y on every node):\n1. Main spine at x=50 (start → inputs → condition diamond → body → exit).\n2. Off-spine branches at x=15 (left) or x=85 (right). The decision diamond\'s "yes" and "no" should exit on OPPOSITE sides so they don\'t collide with the loop-back. (For a simple while-loop with one body branch, typically: yes=continue downward on spine, no=exit right to x=85.)\n3. `end` at x=50 (bottom center) so all return paths converge cleanly.\n4. Short labels (≤18 chars ideal; auto-wraps to 2 lines if longer). Prefer `low = mid + 1` over `Set low = mid + 1 and continue`.\n\nTHE RENDERER\'S AUTO-ROUTER handles (no manual work needed):\n- Back-edges (y2 < y1) route orthogonally around a side channel.\n- Forward edges that would pass through an intermediate node also detour.\n- Channel side is chosen opposite to the target\'s occupied side (so a loop-back doesn\'t enter the same side a yes/no branch exits).\n\nCANONICAL EXAMPLES:\n\n(a) Euclidean gcd — simple loop with early exit:\nnodes: start(50,10) input(50,25) cond-diamond(50,40) returnA(85,40) body(50,60) end(50,85).\nedges: start→input, input→cond, cond→returnA ("yes"), cond→body ("no"), body→cond (BACK-EDGE to condition, NOT input), returnA→end.\n\n(b) Binary search — multi-way branching with loop-back:\nnodes: start(50,5) input(50,15) init(50,25) loopCond-diamond(50,35) midCalc(50,45) eqCheck-diamond(50,55) returnMid(85,55) gtCheck-diamond(50,65) highUpdate(15,75) lowUpdate(85,75) returnNotFound(50,85) end(50,95).\nedges: start→input, input→init, init→loopCond, loopCond→midCalc ("yes"), loopCond→returnNotFound ("no"), midCalc→eqCheck, eqCheck→returnMid ("yes"), eqCheck→gtCheck ("no"), gtCheck→highUpdate ("yes"), gtCheck→lowUpdate ("no"), highUpdate→loopCond (BACK-EDGE, NOT midCalc), lowUpdate→loopCond (BACK-EDGE, NOT midCalc), returnMid→end, returnNotFound→end.\n\nCRITICAL: loop-back edges MUST target the condition-check node (not the body). Targeting the body directly creates an infinite loop.\n\nWithout explicit coords, layout is a straight top-down chain — use ONLY for purely linear procedures with no back-edges.',
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
    description: 'Display an elementary-math visual manipulative — a concrete representation of abstract number concepts for K-5 students. Three types: "base-10" (ones/tens/hundreds/thousands blocks for place value), "ten-frame" (2×5 grid with counters for counting 0–20), "area-model" (partitioned rectangle for multi-digit multiplication). Choose based on the topic: base-10 for place value and addition/subtraction regrouping; ten-frame for counting, addition, subitizing; area-model for multiplication strategies and later distributive property / factoring.\n\nFOR ADDITION-WITH-REGROUPING demos, issue TWO calls: (1) "before regrouping" with the raw sums, e.g. 47+28 → { tens: 6, ones: 15 } showing all 15 ones visible so the student sees the overflow, and (2) "after regrouping" with the carried result { tens: 8, ones: 5 }. Ones up to 18 are supported (wraps to 2 rows). DO NOT pre-carry the ones in the "before" step — the whole point is to SEE the regrouping happen.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['base-10', 'ten-frame', 'area-model'] },
        base10: {
          type: 'object',
          description: 'Required when type is "base-10". Counts for each place value.',
          properties: {
            ones: { type: 'number' },
            tens: { type: 'number' },
            hundreds: { type: 'number' },
            thousands: { type: 'number' },
            showTotal: { type: 'boolean', description: 'Show numeric total below. Default true.' },
          },
        },
        tenFrame: {
          type: 'object',
          description: 'Required when type is "ten-frame". Use count > 10 to show two ten-frames side-by-side (for numbers 11–20).',
          properties: {
            count: { type: 'number', description: 'Number of filled dots, 0–20.' },
            color: { type: 'string' },
            label: { type: 'string', description: 'Optional label shown below — defaults to the count.' },
          },
          required: ['count'],
        },
        areaModel: {
          type: 'object',
          description: 'Required when type is "area-model". Each row and column is a partitioned section: e.g. rows: [20, 3], cols: [40, 5] splits 23 × 45 into four cells (20×40, 20×5, 3×40, 3×5).',
          properties: {
            rows: { type: 'array', items: { type: 'number' } },
            cols: { type: 'array', items: { type: 'number' } },
            showProducts: { type: 'boolean', description: 'Fill each cell with its product. Default true.' },
            showSum: { type: 'boolean', description: 'Show the total sum below. Default true.' },
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
    description: 'Display statistical charts: histogram, box plot, dot plot, bar chart, pie chart, or a continuous distribution curve. Use `type: "distribution"` for AP Statistics inference — draws a normal / t / chi-square / F density curve with an optional shaded region for P(X<a), P(X>a), P(a<X<b), or P(X<a or X>b). Provide `distribution.family`, `distribution.params` (mean/sd for normal; df for t and chi-square; df1, df2 for F), and `distribution.shade` with the boundary values. Add `distribution.probabilityLabel` to write the computed probability directly inside the shaded region (e.g. "p = 0.025", "α = 0.05", "P(Z > 1.96)").',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['histogram', 'boxplot', 'dotplot', 'bar', 'pie', 'distribution'] },
        data: { type: 'array', items: { type: 'number' } },
        binWidth: { type: 'number' },
        xLabel: { type: 'string' },
        yLabel: { type: 'string' },
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
    description: 'Display a before/after collision diagram with masses and velocity vectors. ALWAYS use this instead of show_svg_diagram when teaching conservation of momentum, elastic / inelastic / perfectly-inelastic collisions, or any two-object interaction. Each body is rendered as a filled circle sized by mass (visual hint, not to scale) with a velocity arrow whose length scales with speed. For `type: "perfectly-inelastic"`, the after-panel automatically renders the combined mass as a single merged blob.\n\nEXAMPLE (1D elastic collision):\n{"title":"Elastic collision","type":"elastic","before":[{"label":"A","mass":2,"velocity":5},{"label":"B","mass":3,"velocity":0}],"after":[{"label":"A","mass":2,"velocity":-1},{"label":"B","mass":3,"velocity":4}],"momentumAnnotation":"p = Σmv = 10 kg·m/s (conserved)"}',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        dimension: { type: 'string', enum: ['1D', '2D'], description: 'Default "1D" — velocities along x only. Use "2D" for glancing / angled collisions; then provide vx and vy on each body instead of velocity.' },
        type: { type: 'string', enum: ['elastic', 'inelastic', 'perfectly-inelastic'] },
        before: {
          type: 'array',
          description: 'Bodies in their pre-collision state.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', description: 'Short label shown inside the circle (defaults to A, B, …).' },
              mass: { type: 'number' },
              velocity: { type: 'number', description: '1D signed velocity (positive = right).' },
              vx: { type: 'number', description: '2D x-velocity.' },
              vy: { type: 'number', description: '2D y-velocity (positive = up).' },
              color: { type: 'string' },
            },
          },
        },
        after: {
          type: 'array',
          description: 'Bodies after the collision. For perfectly-inelastic, you can pass a single combined body OR the pre-collision list with the combined velocity on each — the renderer merges them.',
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
        momentumAnnotation: { type: 'string', description: 'Optional equation shown below panels, e.g. "p = Σmv = 10 kg·m/s (conserved)".' },
        notes: { type: 'string' },
      },
      required: ['before', 'after'],
    },
  },
  {
    name: 'show_reaction_coordinate',
    description: 'Display a chemistry reaction coordinate (energy profile) diagram: reactants baseline, activation-energy hump(s), products baseline. ALWAYS use this instead of show_function_graph for "reaction coordinate", "energy profile", "activation energy", or exothermic/endothermic reaction prompts. Auto-handles negative y-axis for exothermic reactions and supports multi-curve catalyst comparisons.\n\nEXAMPLE (exothermic with catalyst comparison):\n{"title":"Reaction coordinate","reactants_energy":0,"products_energy":-120,"activation_energies":[50,30],"curve_labels":["Without catalyst","With catalyst"]}',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        reactants_energy: { type: 'number', description: 'Energy of reactants (reference level). Usually 0.' },
        products_energy: { type: 'number', description: 'Energy of products. Negative = exothermic, positive = endothermic.' },
        activation_energies: {
          type: 'array',
          description: 'One activation energy per curve — use [Ea] for single curve, [Ea_no_cat, Ea_cat] for catalyst comparison.',
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
    description: 'Display a conservation-of-energy bar chart showing kinetic, gravitational PE, spring PE, and thermal (friction-loss) energy at multiple labeled positions in a scenario. ALWAYS use this instead of show_svg_diagram when teaching conservation of energy, spring-loaded problems, roller-coaster / pendulum energy transforms, or friction dissipation. Each position is a column of stacked bars; when totals match across all positions, a dashed "total energy (conserved)" line is drawn across the top automatically.\n\nEXAMPLE (ball dropped from height h):\n{"title":"Ball dropped from rest","positions":[{"label":"Top","pe":100,"ke":0},{"label":"Middle","pe":50,"ke":50},{"label":"Bottom","pe":0,"ke":100}]}',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        positions: {
          type: 'array',
          description: 'One column per position in the scenario. At least one of ke/pe/spring/thermal must be non-zero on each position.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', description: 'Short label for this position/moment (e.g. "Top", "Middle", "Bottom", "A", "Before collision").' },
              ke: { type: 'number', description: 'Kinetic energy (J or any consistent unit).' },
              pe: { type: 'number', description: 'Gravitational potential energy.' },
              spring: { type: 'number', description: 'Elastic/spring potential energy.' },
              thermal: { type: 'number', description: 'Energy dissipated as heat/friction (stacked at the base of the bar).' },
            },
            required: ['label'],
          },
        },
        yAxisLabel: { type: 'string', description: 'Vertical axis label. Default "Energy (J)".' },
        showTotalLine: { type: 'boolean', description: 'Force a dashed total-energy line across the top. Default: auto-drawn when all column totals are equal (conservation scenario).' },
        notes: { type: 'string', description: 'Short caption under the chart (e.g. "Neglecting air resistance").' },
      },
      required: ['positions'],
    },
  },
  {
    name: 'show_free_body_diagram',
    description: 'Display a physics free-body diagram with force vectors. ALWAYS use this instead of show_svg_diagram for any free-body / force / Newton\'s-laws visualization.\n\nThe model supplies semantic parameters — object shape, surface type, and a list of forces with names and directions — and the renderer handles geometry, arrowheads, and label placement. Force colors are auto-assigned by name convention (W/Mg → green gravity, N → amber normal, f/friction → purple, T → blue tension, default red for applied forces).\n\nDirection options:\n• Cardinal: "up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"\n• Slope-relative (for inclined surfaces): "normal" (perpendicular-out), "up-slope", "down-slope", "into-surface"\n• Numeric: an angle in degrees (math convention, CCW from +x — so 90 = up, 180 = left)\n\nEXAMPLE (5 kg block on a 30° frictionless incline):\n{"title":"Block on frictionless incline","object":{"shape":"box","mass":"5 kg"},"surface":{"type":"inclined","angle":30},"forces":[{"name":"W","magnitude":"mg","direction":"down"},{"name":"N","direction":"normal"}]}',
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
              direction: { type: 'string', description: 'Named direction ("up"/"down"/"left"/"right"/"up-left"/"up-right"/"down-left"/"down-right"/"normal"/"up-slope"/"down-slope"/"into-surface") OR a numeric angle in degrees as a string (math convention, e.g. "45" or "-135").' },
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
    description: 'Display a 2D coordinate plane with axes, gridlines, labeled points, line segments, and/or vectors from origin. Broader than show_geometry: always shows axes + ticks, handles vectors as first-class, and does NOT require a points array. USE THIS when teaching vectors from origin, plotting loci, showing ordered pairs, introducing the coordinate plane, or displaying transformations.',
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
    description: 'Display stages of a cyclic process arranged around a circle, with arrows flowing back to the start. USE THIS for water cycle, carbon cycle, rock cycle, nitrogen cycle, cell cycle, PDCA, product loops, etc.',
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
    description: 'Display a labeled schematic of a simple machine with effort, load, and mechanical-advantage annotation. Types: lever (class-1/2/3), pulley (fixed/movable/compound), inclined-plane, wedge. USE THIS instead of show_svg_diagram for mechanical-advantage lessons.',
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
    description: 'Horizontal or vertical spring attached to a mass at a displaced position, with natural-length reference, displacement annotation, and derived ω = √(k/m), T = 2π/ω. USE THIS for Hooke\'s law and SHM spring lessons.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        k: { type: 'number', description: 'Spring constant (N/m).' },
        mass: { type: 'number', description: 'Mass (kg).' },
        displacement: { type: 'number', description: 'Displacement from equilibrium (m). Negative = compressed.' },
        naturalLength: { type: 'number' },
        orientation: { type: 'string', enum: ['horizontal', 'vertical'] },
        notes: { type: 'string' },
      },
      required: ['k', 'mass', 'displacement'],
    },
  },

  {
    name: 'show_ray_diagram',
    description: 'Thin-lens or spherical-mirror ray diagram with object, image, focal points, principal rays, and thin-lens equation readout. USE THIS for optics instead of show_svg_diagram.',
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
    description: 'Electron configuration box-and-arrow notation following Aufbau, Pauli, Hund. Pass `element` ("N", "Fe") to derive the configuration, or provide an explicit `configuration` array. USE THIS for electron-configuration lessons.',
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
    description: 'Standard pedigree notation: squares=male, circles=female, filled=affected, half-filled=carrier, strike=deceased. Horizontal lines between pairs = marriages; vertical drop lines = offspring. USE THIS for genetics inheritance lessons. CARRIER vs AFFECTED rules: a carrier expresses no phenotype but carries one recessive allele — use status="carrier" (not "affected"). For X-linked recessive: an affected father\'s daughters are OBLIGATE CARRIERS (status="carrier"); an affected mother\'s sons are all affected. For autosomal recessive: unaffected parents of an affected child are both obligate carriers.',
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
    name: 'show_cell_diagram',
    description: 'Schematic of an animal or plant cell with labeled organelles (nucleus, mitochondria, ribosomes, ER, Golgi; plant adds chloroplast, vacuole, cell wall). USE THIS for cell biology intro instead of show_svg_diagram.',
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
];

/**
 * Map a function call name + arguments to a WhiteboardCommand.
 *
 * This is the shared logic used by both useOpenAIRealtime and useGeminiLive
 * to convert AI tool calls into whiteboard rendering commands.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapFunctionCallToCommand(funcName: string, funcArgs: Record<string, any>): WhiteboardCommand | null {
  if (funcName === 'new_page') {
    return { action: 'newPage', title: funcArgs.title };
  }
  if (funcName === 'go_to_page') {
    return { action: 'goToPage', title: funcArgs.title };
  }
  if (funcName === 'show_equation') {
    return { action: 'showEquation', latex: funcArgs.latex, label: funcArgs.label };
  }
  if (funcName === 'show_svg_diagram') {
    return {
      action: 'showSvgDiagram',
      svg: funcArgs.svg,
      title: funcArgs.title,
      description: funcArgs.description,
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
    } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_number_line') {
    return { action: 'showNumberLine', ...funcArgs } as unknown as WhiteboardCommand;
  }
  if (funcName === 'show_geometry') {
    return { action: 'showGeometry', ...funcArgs } as unknown as WhiteboardCommand;
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
  if (funcName === 'show_image') {
    return {
      action: 'showImage',
      url: funcArgs.url,
      alt: funcArgs.alt,
    } as unknown as WhiteboardCommand;
  }
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
