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
          description: 'Labeled points to mark on the graph',
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
    description: 'Display geometric figures with labeled vertices, segments, polygons, circles, and angle markers. ALWAYS use this instead of show_svg_diagram for geometric figures. CRITICAL: If drawing a circle (or anything with "circle" in the title, e.g. "Circle with Chord"), you MUST include at least one entry in `circles` with a `center` point id and a `radius` number — points and segments alone do NOT draw a circle boundary. For a chord, put the two endpoints in `points` with coordinates that lie on the circle (|point - center| = radius), and add a `segment` between them. Same rule for `polygons` (triangle/square/etc. titles require a polygon entry).',
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
    description: 'Display a tree diagram with auto-layout. Use for: probability trees, factor trees, decision trees.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['probability', 'factor', 'decision', 'generic'] },
        root: { type: 'object', description: 'Recursive tree node: { label, value?, color?, children?: [{ label, probability?, node: TreeNode }] }' },
        showLeafProbabilities: { type: 'boolean' },
        direction: { type: 'string', enum: ['top-down', 'left-right'] },
      },
      required: ['root'],
    },
  },
  {
    name: 'show_venn_diagram',
    description: 'Display a 2 or 3 set Venn diagram.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        sets: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, color: { type: 'string' } }, required: ['label'] } },
        regions: { type: 'object', description: 'Region keys: onlyA, onlyB, intersection, neither (2 sets)' },
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
    description: 'Display a schematic map with pins and optional highlighted regions. Use for geography, history, civics, economics — any topic where spatial location matters. Choose a `background` preset for a rough regional outline (world, continent, or a few specific countries). Place pins at x,y in a normalized 0–100 coordinate system (0,0 = top-left; 100,100 = bottom-right). For a specific detailed cartographic map (e.g. "the exact route of the Silk Road"), prefer show_image with a Wikimedia URL — this renderer is for quick schematic teaching maps.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        background: {
          type: 'string',
          enum: ['blank', 'world', 'north-america', 'south-america', 'europe', 'asia', 'africa', 'australia', 'usa', 'india', 'china', 'middle-east', 'mediterranean'],
          description: 'Preset regional outline. Use "blank" for a clean canvas when pin positions alone communicate the geography.',
        },
        pins: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              x: { type: 'number', description: '0–100, left to right.' },
              y: { type: 'number', description: '0–100, top to bottom.' },
              label: { type: 'string' },
              color: { type: 'string' },
            },
            required: ['x', 'y', 'label'],
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
    description: 'Display a schematic circuit diagram with standard IEEE symbols (zigzag resistors, parallel-plate capacitors, inductor coils, battery cells, switches, bulbs, voltmeters, ammeters, ground). Use for AP Physics 2, AP Physics C: E&M, and college intro physics. Define `nodes` as named connection points placed at x,y in a normalized 0–100 coordinate system, then list `components` as {type, from, to, value, unit, label}. A wire is a component with type "wire" and no value. Put component values in `value` (numeric) and units in `unit` ("Ω", "μF", "V", "H", "A") so they render as "R = 100 Ω" etc.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Node identifier used by components — e.g. "a", "b", "v+".' },
              x: { type: 'number', description: '0–100.' },
              y: { type: 'number', description: '0–100.' },
            },
            required: ['id', 'x', 'y'],
          },
        },
        components: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['resistor', 'capacitor', 'inductor', 'battery', 'wire', 'switch-open', 'switch-closed', 'bulb', 'voltmeter', 'ammeter', 'ground'],
              },
              from: { type: 'string', description: 'Node id.' },
              to: { type: 'string', description: 'Node id.' },
              value: { type: 'string' },
              unit: { type: 'string' },
              label: { type: 'string', description: 'Variable name, e.g. "R_1" or "ε".' },
            },
            required: ['type', 'from', 'to'],
          },
        },
        showNodes: { type: 'boolean', description: 'Draw small dots at each node. Default true.' },
      },
      required: ['nodes', 'components'],
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
    description: 'Display a flowchart for algorithm teaching or any procedure with branching. Node types: "start" / "end" (rounded pills), "process" (rectangle), "decision" (diamond, for branches), "io" (parallelogram, for read/write). Connect nodes via `edges` with optional `label` — label decision-branch edges with "yes" / "no" / condition text. Provide `x` and `y` (0–100) on each node for explicit layout; omit for automatic top-down or left-right placement.',
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
    description: 'Display an elementary-math visual manipulative — a concrete representation of abstract number concepts for K-5 students. Three types: "base-10" (ones/tens/hundreds/thousands blocks for place value), "ten-frame" (2×5 grid with counters for counting 0–20), "area-model" (partitioned rectangle for multi-digit multiplication). Choose based on the topic: base-10 for place value and addition/subtraction regrouping; ten-frame for counting, addition, subitizing; area-model for multiplication strategies and later distributive property / factoring.',
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
    };
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
      nodes: Array.isArray(funcArgs.nodes) ? funcArgs.nodes : [],
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
    return {
      action: 'showCallStack',
      title: funcArgs.title,
      frames: Array.isArray(funcArgs.frames) ? funcArgs.frames : [],
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
