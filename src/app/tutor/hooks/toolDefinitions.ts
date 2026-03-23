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
  enum?: string[];
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
    description: 'Display geometric figures with labeled vertices, segments, polygons, circles, and angle markers. ALWAYS use this instead of show_svg_diagram for geometric figures.',
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
    name: 'show_stats',
    description: 'Display statistical charts: histogram, box plot, dot plot, bar chart, or pie chart.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['histogram', 'boxplot', 'dotplot', 'bar', 'pie'] },
        data: { type: 'array', items: { type: 'number' } },
        binWidth: { type: 'number' },
        xLabel: { type: 'string' },
        yLabel: { type: 'string' },
        boxplot: { type: 'object', properties: { datasets: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, min: { type: 'number' }, q1: { type: 'number' }, median: { type: 'number' }, q3: { type: 'number' }, max: { type: 'number' }, outliers: { type: 'array', items: { type: 'number' } }, color: { type: 'string' } }, required: ['label', 'min', 'q1', 'median', 'q3', 'max'] } }, showValues: { type: 'boolean' } } },
        bar: { type: 'object', properties: { categories: { type: 'array', items: { type: 'string' } }, values: { type: 'array', items: { type: 'number' } }, colors: { type: 'array', items: { type: 'string' } } } },
        pie: { type: 'object', properties: { slices: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'number' }, color: { type: 'string' } }, required: ['label', 'value'] } }, showPercentages: { type: 'boolean' } } },
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
