/**
 * Brain API route — server wrapper around runBrainTurn so the voice tutor
 * client doesn't need to import the Anthropic SDK directly.
 *
 * Receives the conversation context for one turn, returns Claude's text
 * response and structured tool calls. Tool calls are then dispatched
 * client-side through the existing whiteboard pipeline (validators,
 * catalog, renderers) — this route is a pure reasoning step, no rendering
 * concerns.
 */
import { NextRequest, NextResponse } from 'next/server';
import { runBrainTurn, type BrainTurnInput } from '@/lib/tutor/voice/claude-brain';
import { WHITEBOARD_TOOLS } from '@/app/tutor/hooks/toolDefinitions';

export const runtime = 'nodejs';

interface BrainRequestBody {
  systemPrompt: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  studentTranscript: string;
  whiteboardSnapshot: BrainTurnInput['whiteboardSnapshot'];
  /** Optional model override. */
  model?: string;
  /** Optional max_tokens override. */
  maxTokens?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BrainRequestBody;

    // Minimum-viable validation. Heavy schema validation lives in the
    // brain itself; this just guards against missing fields that would
    // produce a confusing 500 deeper down.
    if (typeof body.systemPrompt !== 'string' || body.systemPrompt.length === 0) {
      return NextResponse.json({ error: 'systemPrompt is required' }, { status: 400 });
    }
    if (typeof body.studentTranscript !== 'string') {
      return NextResponse.json({ error: 'studentTranscript is required' }, { status: 400 });
    }
    if (!Array.isArray(body.conversationHistory)) {
      return NextResponse.json({ error: 'conversationHistory must be an array' }, { status: 400 });
    }
    if (!Array.isArray(body.whiteboardSnapshot)) {
      return NextResponse.json({ error: 'whiteboardSnapshot must be an array' }, { status: 400 });
    }

    const output = await runBrainTurn({
      systemPrompt: body.systemPrompt,
      conversationHistory: body.conversationHistory,
      studentTranscript: body.studentTranscript,
      whiteboardSnapshot: body.whiteboardSnapshot,
      tools: WHITEBOARD_TOOLS,
      model: body.model,
      maxTokens: body.maxTokens,
    });

    return NextResponse.json(output);
  } catch (err) {
    console.error('[brain] error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
