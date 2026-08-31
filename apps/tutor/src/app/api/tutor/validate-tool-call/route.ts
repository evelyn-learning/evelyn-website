/**
 * Tool Call Validation API
 *
 * Validates mathematical correctness of AI-generated whiteboard tool calls
 * using Claude. Called asynchronously after OpenAI Realtime generates a
 * tool call — the voice continues playing while this validates in the background.
 *
 * Only validates math-heavy tool calls (equations, graphs, geometry).
 * Skips validation for code, tables, SVG diagrams, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient } from '@/lib/tutor/ai/model-registry';

const { client: anthropic, model: VALIDATOR_MODEL } = getModelClient('validate-tool-call');

// Tool calls worth validating (math-sensitive)
const VALIDATABLE_TOOLS = new Set([
  'show_equation',
  'show_function_graph',
  'show_geometry',
  'show_number_line',
]);

export async function POST(request: NextRequest) {
  try {
    const { functionName, arguments: args, conversationContext } = await request.json();

    if (!functionName || !args) {
      return NextResponse.json({ error: 'Missing functionName or arguments' }, { status: 400 });
    }

    // Skip validation for non-math tool calls
    if (!VALIDATABLE_TOOLS.has(functionName)) {
      return NextResponse.json({ validated: true, corrected: false, data: args });
    }

    const argsJson = JSON.stringify(args, null, 2);

    const systemPrompt = `You are a mathematical accuracy validator and completer for an AI tutoring whiteboard.
Your job is to check mathematical content AND add missing elements that a good tutor would include.

YOU MUST FIX OR ADD:
1. **Wrong values**: Directrix of y=x² is y=-1/4 (NOT y=-1). Focus of y=x² is (0, 1/4). Focus of y²=4px is (p,0). Directrix is x=-p.
2. **Missing elements**: If the title mentions "directrix" or "focus" but the data doesn't include them, ADD them. A parabola graph should always show the directrix line and focus point.
3. **CRITICAL — Wrong axis for lines**: This is the #1 error. "functions" array plots y=f(x) curves — a constant like "4" draws a HORIZONTAL line at y=4. "functionsOfY" array plots x=f(y) curves — a constant like "4" draws a VERTICAL line at x=4. For a vertical directrix line at x=c, the entry MUST be in "functionsOfY", NOT "functions". Move any directrix/asymptote line entries to the correct array.
4. **Incomplete LaTeX**: If a function has latex "y^2" but the title says "y²=x", fix the latex to "y^2=x". Desmos needs the full equation.
5. **Wrong function format for Desmos**: Desmos plots implicit equations. For y²=x, use latex "y^2=x" in the functions array (Desmos handles it). Do NOT split into upper/lower halves unless necessary.
6. **Viewport**: xRange and yRange must show ALL plotted elements including directrix, focus, and asymptotes.
7. **Missing points**: For conic sections, always include vertex, focus/foci as labeled points.
8. **Foci calculations**: For ellipse x²/a²+y²/b²=1: c=sqrt(|a²-b²|), foci on the longer axis. For hyperbola x²/a²-y²/b²=1: c=sqrt(a²+b²), foci on x-axis.
9. **Directrix calculations**: For ellipse: directrix at ±a²/c from center (on major axis). For parabola y²=4px: directrix at x=-p. For hyperbola x²/a²-y²/b²=1: c=sqrt(a²+b²), directrix at x=±a²/c (NOT ±a, NOT ±c).
10. **Geometry references**: If a segment references a point ID (e.g., "D1") that doesn't exist in the points array, ADD the missing point with correct coordinates.
11. **CRITICAL — show_geometry missing shape primitive**: If the title or context implies a shape (e.g., "Circle with Chord", "Triangle ABC", "Square") but the corresponding array is empty or missing, the renderer will only draw dots. You MUST add the shape:
    - Title mentions "circle" → MUST have a non-empty \`circles\` array with {center: "<point-id>", radius: <number>}. Pick the center point (often "O" or a point labeled "Center"), and derive radius from the farthest labeled point or default to 3.
    - Title mentions "triangle" / "square" / "rectangle" / "polygon" → MUST have a \`polygons\` array entry with the vertex ids.
12. **Chord endpoints on the circle**: If there's a circle with center C radius r, and a chord is defined by two points P1-P2, both points MUST satisfy |P - C| ≈ r. If they don't, snap their coordinates to the circle (same angular direction from the center, distance = r).

ALWAYS provide correctedArgs — even if the original is "mostly correct", improve it by adding missing elements.

RESPOND WITH JSON ONLY:
{"correct": false, "issues": ["list"], "correctedArgs": { ... complete corrected data with same structure as input }}

The correctedArgs must have the EXACT same structure as the input — same field names, same nesting.`;

    const userMessage = `Validate and complete this ${functionName} tool call for a whiteboard tutor:

${argsJson}

${conversationContext ? `Recent conversation context:\n${conversationContext}` : ''}

Check mathematical correctness, add missing elements (directrix, focus, etc.), fix wrong values, and ensure the data is complete for a student to see a proper diagram. The rendering engine is Desmos which supports implicit equations like "y^2=x" directly. ALWAYS provide correctedArgs with the complete fixed version.`;

    console.log(`[VALIDATE] Validating ${functionName}, data:`, JSON.stringify(args).slice(0, 500));

    const response = await anthropic.messages.create({
      model: VALIDATOR_MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('');

    // Parse Claude's JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If Claude didn't return valid JSON, pass through original
      return NextResponse.json({ validated: true, corrected: false, data: args });
    }

    const validation = JSON.parse(jsonMatch[0]);
    console.log(`[VALIDATE] Claude response for ${functionName}:`, JSON.stringify(validation).slice(0, 500));

    if (validation.correct && !validation.correctedArgs) {
      console.log(`[VALIDATE] ${functionName}: Claude says correct, no changes`);
      return NextResponse.json({ validated: true, corrected: false, data: args });
    }

    // If Claude says correct but still provided correctedArgs, use the corrected version
    if (validation.correctedArgs) {
      console.log(`[VALIDATE] ${functionName}: Using corrected data. Issues:`, validation.issues);
      return NextResponse.json({
        validated: true,
        corrected: true,
        data: validation.correctedArgs,
        issues: validation.issues || [],
      });
    }

    // No corrections available
    return NextResponse.json({ validated: true, corrected: false, data: args });
  } catch (error) {
    console.error('[VALIDATE] Error:', error);
    // On failure, pass through the original — don't block rendering
    return NextResponse.json({
      validated: false,
      corrected: false,
      data: null,
      error: 'Validation failed',
    });
  }
}
