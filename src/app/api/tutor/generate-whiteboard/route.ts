/**
 * Generate Missing Whiteboard Commands
 *
 * Called by the Realtime voice tutor when the AI speaks about showing
 * something on the whiteboard but doesn't call the tool function.
 * Uses Claude to infer and generate the appropriate whiteboard commands.
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// Rate limiting per session
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // per minute per session
const RATE_WINDOW = 60_000;

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

const SYSTEM_PROMPT = `You are a whiteboard command generator for an AI tutoring platform. The voice tutor sometimes describes a visual in speech but forgets to emit the corresponding function call. Your job is to infer the RIGHT structured command from the tutor's text + the student's most recent message, and emit it as a \`\`\`whiteboard JSON block so the student sees the figure.

You will be told which actions the tutor ALREADY emitted on this turn (via the recentActions list). Do NOT duplicate any action in that list — return empty for anything already handled.

**Visual-exclusion rule (important):** If recentActions contains ANY structured visual action (anything starting with "show" that is not showEquation / showCode / showTable / showSvgDiagram), the tutor has already drawn the figure. You must NOT emit any other visual action for the same turn — even a different one (e.g., tutor emitted showCoordinatePlane, so you must NOT emit showGeometry for the same triangle; tutor emitted showSpringMass, so you must NOT emit showSimpleMachine). You may still emit showEquation / showCode / showTable / showSvgDiagram (CS-only) when the tutor spoke math or pseudocode that the tutor didn't render itself.

# STRUCTURED TOOLS (prefer these over free-form SVG)

When the tutor's text or the student's problem matches one of these topics, emit the structured command. Extract numeric parameters from the student's message when possible; if values are missing, pick sensible defaults noted below.

## Physics

**showSpringMass** — spring connected to a mass, shown at displaced position.
Use when: "spring", "mass on spring", "Hooke's law", "SHM", "k = ... N/m", "pulled/compressed ... from equilibrium", "oscillator".
Schema:
  { "action": "showSpringMass",
    "title": "<short>",
    "k": <N/m, required>,
    "mass": <kg, required>,
    "displacement": <m, default 0.1>,
    "orientation": "horizontal" | "vertical" (default "horizontal"),
    "naturalLength": <m, default 1> }
Example: student says "A 0.5 kg mass on a spring with k = 200 N/m pulled 0.1 m" →
  { "action": "showSpringMass", "title": "Spring-Mass Setup",
    "k": 200, "mass": 0.5, "displacement": 0.1, "orientation": "horizontal" }

**showProjectileMotion** — parabolic trajectory.
Use when: "projectile", "launched", "thrown at angle", "initial velocity", "from a cliff/tower of height".
Schema:
  { "action": "showProjectileMotion",
    "title": "<short>",
    "initialVelocity": <m/s, required>,
    "launchAngle": <degrees, required>,
    "launchHeight": <m, default 0>,
    "g": <m/s², default 9.8> }

**showPendulum** — rod or string with bob at an angle.
Use when: "pendulum", "bob on a string", "swings back and forth".
Schema:
  { "action": "showPendulum",
    "title": "<short>",
    "length": <m, required>,
    "angle": <degrees, default 20>,
    "mass": <kg, default 1> }

**showWave** — sinusoidal wave with wavelength/amplitude labels.
Use when: "wave", "wavelength", "frequency", "amplitude", "crest/trough".
Schema:
  { "action": "showWave",
    "title": "<short>",
    "wavelength": <m or arbitrary, required>,
    "amplitude": <same unit, default 1>,
    "frequency": <Hz, optional> }

**showFreeBodyDiagram** — object with force vectors.
Use when: "free body diagram", "FBD", "draw the forces", "weight, normal, friction".
Schema:
  { "action": "showFreeBodyDiagram",
    "title": "<short>",
    "objectShape": "box" | "circle" (default "box"),
    "onSurface": "horizontal" | "inclined" | "none" (default "horizontal"),
    "inclineAngle": <degrees, required if onSurface === "inclined">,
    "forces": [
      { "name": "weight", "magnitude": <N>, "direction": "down" },
      { "name": "normal", "magnitude": <N>, "direction": "up" },
      { "name": "friction", "magnitude": <N>, "direction": "left" | "right" },
      { "name": "applied", "magnitude": <N>, "direction": "right" }
    ] }

**showRayDiagram** — lens/mirror optics.
Use when: "lens", "mirror", "ray diagram", "focal length", "object at distance", "image formed".
Schema:
  { "action": "showRayDiagram",
    "title": "<short>",
    "opticalElement": "convex-lens" | "concave-lens" | "concave-mirror" | "convex-mirror" (required),
    "focalLength": <cm or m, required>,
    "objectDistance": <same unit, required>,
    "objectHeight": <same unit, default 1> }

**showSimpleMachine** — inclined plane, lever, pulley, wedge.
Use when: "inclined plane / ramp", "lever", "pulley", "wedge", "mechanical advantage".
Schema (inclined plane):
  { "action": "showSimpleMachine",
    "title": "<short>",
    "machineType": "inclined-plane" | "lever" | "pulley" | "wedge" (required),
    "rampAngle": <degrees, inclined-plane only>,
    "rampLength": <m, inclined-plane only>,
    "rampHeight": <m, optional — derivable from angle+length>,
    "loadWeight": <N, optional>,
    "effort": <N, optional> }

**showCollision** — before/after object positions with momentum arrows.
Use when: "collision", "elastic/inelastic", "momentum before and after".
Schema:
  { "action": "showCollision",
    "title": "<short>",
    "collisionType": "elastic" | "inelastic" | "perfectly-inelastic",
    "objectA": { "mass": <kg>, "velocityBefore": <m/s>, "velocityAfter": <m/s> },
    "objectB": { "mass": <kg>, "velocityBefore": <m/s>, "velocityAfter": <m/s> } }

## Math

**showCoordinatePlane** — labeled x-y grid with optional points/lines/vectors.
Use when: "coordinate plane", "plot the point", "graph the line", "x-y axes".
Schema:
  { "action": "showCoordinatePlane",
    "title": "<short>",
    "xRange": [<min>, <max>],
    "yRange": [<min>, <max>],
    "points": [ { "x": <n>, "y": <n>, "label": "<short>" } ],
    "segments": [ { "from": {"x": <n>, "y": <n>}, "to": {"x": <n>, "y": <n>}, "label": "<short>" } ] }

**showScatterPlot** — data points with optional regression.
Use when: "scatter plot", "data points", "line of best fit", "R²", "correlation".
Schema:
  { "action": "showScatterPlot",
    "title": "<short>",
    "xLabel": "<short>",
    "yLabel": "<short>",
    "points": [ { "x": <n>, "y": <n>, "label": "<optional>" } ],
    "showTrendLine": true | false }

## Biology / Earth science

**showCycleDiagram** — stages around a circle.
Use when: "water cycle", "carbon cycle", "cell cycle", "nitrogen cycle", "rock cycle".
Schema:
  { "action": "showCycleDiagram",
    "title": "<short>",
    "stages": [ { "label": "<stage name>", "description": "<short>" } ],
    "clockwise": true }

# FALLBACK TOOLS (when no structured tool fits)

- showEquation: { "action": "showEquation", "latex": "...", "label": "..." }
  For any math formula, identity, or algebraic manipulation. Use proper LaTeX.

- showCode: { "action": "showCode", "language": "python", "label": "...", "code": "..." }
  For code/pseudocode only.

- showTable: { "action": "showTable", "headers": ["..."], "rows": [["..."]] }
  For step tables, truth tables, comparisons.

- showSvgDiagram: { "action": "showSvgDiagram", "svg": "<svg>...</svg>", "title": "...", "description": "..." }
  STRICTLY LIMITED to data-structure / CS diagrams the structured renderers don't cover: trees, linked lists, stacks, queues, hash tables, graphs for algorithms, state machines. Do NOT emit for physics / math / biology / chemistry / geometry — those go through the structured tools above. Prefer emitting empty over inventing a diagram the voice tutor will render with a structured call.

# RULES

- Generate ONLY \`\`\`whiteboard JSON blocks. No other text, no explanations.
- ONE JSON object per \`\`\`whiteboard block. Multiple blocks if multiple independent commands.
- Do NOT emit any action that appears in recentActions (the tutor already handled it).
- Extract parameters from the STUDENT'S MESSAGE (it usually contains the numeric setup). Fall back to the tutor's text if needed.
- Return EMPTY (no blocks at all) when: (a) the tutor text is purely conversational / Socratic with no visual content, (b) the matching structured tool is already in recentActions, (c) you're unsure which tool fits or what parameters to use.
- Never invent numeric values the student didn't provide. Defaults listed above are acceptable; other unknowns → omit or return empty.
- For multilingual content, translate action labels to English; preserve math/code as-is.
- Preserve the tutor's described content exactly. Do not add steps the tutor didn't describe.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorText, studentText, sessionId, recentContext, recentActions } = body;

    console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | tutorText="${tutorText?.substring(0, 100)}..." | studentText="${studentText?.substring(0, 80)}" | recentActions=${Array.isArray(recentActions) ? recentActions.join(',') : '(none)'}`);

    if (!tutorText || !sessionId) {
      console.warn('[GENERATE_WHITEBOARD] Missing required fields');
      return NextResponse.json(
        { error: "Missing required fields: tutorText, sessionId" },
        { status: 400 }
      );
    }

    if (!checkRateLimit(sessionId)) {
      console.warn(`[GENERATE_WHITEBOARD] Rate limited: session=${sessionId}`);
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // Build the user prompt with context
    let userPrompt = `The tutor just said this to a student:\n\n"${tutorText}"`;
    if (studentText) {
      userPrompt += `\n\nThe student's message was: "${studentText}"`;
    }
    if (recentContext) {
      userPrompt += `\n\nRecent conversation context:\n${recentContext}`;
    }
    if (Array.isArray(recentActions) && recentActions.length > 0) {
      userPrompt += `\n\nrecentActions (actions the tutor already emitted on this turn — DO NOT duplicate): ${recentActions.join(', ')}`;
    } else {
      userPrompt += `\n\nrecentActions: (none — the tutor has not emitted any whiteboard commands on this turn)`;
    }
    userPrompt +=
      "\n\nGenerate the whiteboard command(s) that should accompany this tutor response. Focus on the mathematical, code, or visual content that the tutor described or referenced. Prefer the structured tools. Return empty if nothing visual needs to be added.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ commands: [] });
    }

    // Parse whiteboard commands from the response
    const commands: Record<string, unknown>[] = [];
    const whiteboardRegex = /```whiteboard\s*([\s\S]*?)```/g;
    let match;

    while ((match = whiteboardRegex.exec(content.text)) !== null) {
      const block = match[1].trim();
      try {
        const cmd = JSON.parse(block);
        if (cmd && typeof cmd === "object" && cmd.action) {
          commands.push(cmd);
        }
      } catch {
        // Try line-by-line
        const lines = block.split("\n").filter((l: string) => l.trim());
        for (const line of lines) {
          try {
            const cmd = JSON.parse(line.trim());
            if (cmd && typeof cmd === "object" && cmd.action) {
              commands.push(cmd);
            }
          } catch {
            // skip
          }
        }
      }
    }

    // Second-line dedup + content validation, in case the model emitted
    // something despite the system-prompt instructions.
    //
    // Rules enforced server-side (belt-and-braces):
    //   1. Exact action already in recentActions → drop.
    //   2. A structured visual action when recentActions already has a
    //      structured visual → drop. Prevents the 2026-04-24 duplicate
    //      render bug (tutor emitted showCoordinatePlane; enricher
    //      emitted showGeometry for the same triangle — rendered twice).
    //   3. showEquation with empty/placeholder latex → drop. Prevents the
    //      2026-04-24 "Equation: Points" / "Equation: Area formula for
    //      triangle" items that had blank content.
    const NON_VISUAL_ACTIONS = new Set([
      'showEquation', 'showCode', 'showTable', 'showSvgDiagram',
    ]);
    const isVisualAction = (action: string): boolean =>
      action.startsWith('show') && !NON_VISUAL_ACTIONS.has(action);
    const recentList = Array.isArray(recentActions) ? recentActions.map(String) : [];
    const recentSet = new Set(recentList);
    const recentHasVisual = recentList.some(isVisualAction);

    const isEmptyEquation = (c: Record<string, unknown>): boolean => {
      if (c.action !== 'showEquation') return false;
      const latex = typeof c.latex === 'string' ? c.latex.trim() : '';
      if (!latex) return true;
      // Bare label-like placeholders with no math operators. Catches things
      // like "Points", "Area formula for triangle" where latex was just
      // copied from the label field.
      if (latex.length <= 60 && !/[=+\-*/^\\{}_()]/.test(latex)) return true;
      return false;
    };

    const deduped = commands.filter((c) => {
      const action = String(c.action ?? '');
      if (recentSet.has(action)) {
        console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | Dropping duplicate action '${action}' (already in recentActions)`);
        return false;
      }
      if (recentHasVisual && isVisualAction(action)) {
        console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | Dropping '${action}' — tutor already emitted a structured visual this turn`);
        return false;
      }
      if (isEmptyEquation(c)) {
        console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | Dropping empty showEquation (latex="${String(c.latex ?? '').slice(0, 40)}")`);
        return false;
      }
      return true;
    });

    console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | Generated ${deduped.length} command(s): ${deduped.map(c => c.action).join(', ') || '(none)'}`);
    if (deduped.length === 0) {
      console.warn(`[GENERATE_WHITEBOARD] Session=${sessionId} | No commands generated for tutor text: "${tutorText.substring(0, 150)}"`);
      console.log(`[GENERATE_WHITEBOARD] Claude raw response: "${content.text.substring(0, 300)}"`);
    }

    return NextResponse.json({
      commands: deduped,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("[GENERATE_WHITEBOARD] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate whiteboard commands" },
      { status: 500 }
    );
  }
}
