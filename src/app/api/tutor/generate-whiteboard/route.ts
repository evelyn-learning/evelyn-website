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

const SYSTEM_PROMPT = `You are a whiteboard command generator for an AI tutoring platform. Given a tutor's spoken response, generate ONLY the whiteboard commands as \`\`\`whiteboard JSON blocks.

Available commands:
- showEquation: {"action": "showEquation", "latex": "LaTeX here", "label": "description"}
  Use for ANY mathematical expression, formula, identity, equation, or algebraic manipulation.
  Use proper LaTeX: \\frac{}{}, ^{}, _{}, \\sqrt{}, \\cdot, \\times, \\pm, \\leq, \\geq, etc.

- showCode: {"action": "showCode", "language": "python", "label": "description", "code": "code here"}
  Use for programming code, pseudocode, or algorithm steps.
  Use \\n for newlines and \\t or spaces for indentation within the code string.

- showTable: {"action": "showTable", "headers": ["col1", "col2"], "rows": [["val1", "val2"]]}
  Use for comparison tables, data tables, step-by-step breakdowns, truth tables, multiplication grids.

- showSvgDiagram: {"action": "showSvgDiagram", "svg": "<svg>...</svg>", "title": "title", "description": "desc"}
  Use for visual diagrams, geometric shapes, number lines, Venn diagrams, flowcharts.
  SVG must be self-contained with viewBox, use readable font sizes (14-18px).

Rules:
- Generate ONLY \`\`\`whiteboard blocks. No other text whatsoever.
- For step-by-step math work, use showTable with columns like ["Step", "Expression", "Reason"].
- For formulas/identities being taught, use showEquation.
- When the tutor walks through multiplication or expansion, show each step in a table AND the final equation.
- If the tutor mentions multiple equations or formulas, generate a separate showEquation for EACH one.
- Preserve the mathematical content exactly as described by the tutor.
- If the content is in a non-English language, extract the MATH/CODE content (which is universal) — labels can be in the tutor's language.
- For simple arithmetic (ratios, fractions, proportions), ALWAYS generate a showEquation. E.g. "15 over 20" → showEquation with latex "\\frac{15}{20}".
- For word problems, use showTable to lay out the given info and solution steps.
- For data structure diagrams (trees, linked lists, graphs), use showSvgDiagram with an educational SVG.
- NEVER return empty. If the tutor mentioned ANY math or visual content, generate at least one command.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorText, studentText, sessionId, recentContext } = body;

    console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | tutorText="${tutorText?.substring(0, 100)}..." | studentText="${studentText?.substring(0, 80)}"`);

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
    userPrompt +=
      "\n\nGenerate the whiteboard command(s) that should accompany this tutor response. Focus on the mathematical, code, or visual content that the tutor described or referenced.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
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

    console.log(`[GENERATE_WHITEBOARD] Session=${sessionId} | Generated ${commands.length} command(s): ${commands.map(c => c.action).join(', ') || '(none)'}`);
    if (commands.length === 0) {
      console.warn(`[GENERATE_WHITEBOARD] Session=${sessionId} | No commands generated for tutor text: "${tutorText.substring(0, 150)}"`);
      console.log(`[GENERATE_WHITEBOARD] Claude raw response: "${content.text.substring(0, 300)}"`);
    }

    return NextResponse.json({
      commands,
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
