/**
 * Brain API route — STREAMING variant of /api/tutor/brain.
 *
 * Same input shape as the JSON route. Difference: instead of waiting for
 * the entire brain turn to complete and returning one JSON blob, this
 * route streams BrainStreamEvent values back as Server-Sent Events as
 * the brain produces them. Each event is a single SSE message:
 *
 *   data: {"type":"sentence","text":"Here's the triangle."}\n\n
 *   data: {"type":"tool-call","id":"...","name":"show_geometry","args":{...}}\n\n
 *   data: {"type":"done","stopReason":"end_turn", ...}\n\n
 *
 * The orchestrator on the client consumes these and (a) calls speakText
 * per sentence, (b) dispatches tool calls inline, (c) finalizes
 * transcriptRef on `done`. The non-streaming route at /api/tutor/brain
 * is left in place for fallback and for consumers that don't want
 * incremental updates.
 *
 * Why a separate route: lets us roll Phase 5 in incrementally. The
 * orchestrator can flip to /stream once Step 3 is wired; until then
 * the JSON route remains authoritative.
 */
import { NextRequest } from 'next/server';
import { runTutorTurn } from '@/lib/tutor/engine/orchestrator';
import type { BrainTurnInput, BrainStreamEvent } from '@/lib/tutor/voice/claude-brain';
import { WHITEBOARD_TOOLS } from '@/app/tutor/hooks/toolDefinitions';

export const runtime = 'nodejs';

interface BrainStreamRequestBody {
  systemPrompt: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  studentTranscript: string;
  whiteboardSnapshot: BrainTurnInput['whiteboardSnapshot'];
  /** Active lesson plan context, when the session is plan-driven. */
  lessonPlanContext?: BrainTurnInput['lessonPlanContext'];
  /** Configured grade — drives pedagogy pacing knobs. */
  grade?: string;
  model?: string;
  maxTokens?: number;
}

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  let body: BrainStreamRequestBody;
  try {
    body = (await req.json()) as BrainStreamRequestBody;
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (typeof body.systemPrompt !== 'string' || body.systemPrompt.length === 0) {
    return badRequest('systemPrompt is required');
  }
  if (typeof body.studentTranscript !== 'string') {
    return badRequest('studentTranscript is required');
  }
  if (!Array.isArray(body.conversationHistory)) {
    return badRequest('conversationHistory must be an array');
  }
  if (!Array.isArray(body.whiteboardSnapshot)) {
    return badRequest('whiteboardSnapshot must be an array');
  }

  const encoder = new TextEncoder();
  const studentSnippet = body.studentTranscript.slice(0, 80);
  const startedAt = Date.now();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Counters for the post-stream telemetry log line. We mirror the
      // shape of the JSON route's `[brain] student=... → tools=...`
      // line so server-log diagnostics work the same way regardless of
      // which route the orchestrator hit.
      let sentenceCount = 0;
      let firstSentenceMs: number | null = null;
      let firstToolMs: number | null = null;
      const toolNames: string[] = [];
      let fullText = '';
      let stopReason = 'unknown';
      const usage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };

      const send = (event: BrainStreamEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch (err) {
          // Client disconnected mid-stream. Log and bail.
          console.warn('[brain.stream] enqueue failed (client gone?):', err);
          throw err;
        }
      };

      try {
        for await (const ev of runTutorTurn({
          systemPrompt: body.systemPrompt,
          conversationHistory: body.conversationHistory,
          studentTranscript: body.studentTranscript,
          whiteboardSnapshot: body.whiteboardSnapshot,
          lessonPlanContext: body.lessonPlanContext,
          grade: body.grade,
          tools: WHITEBOARD_TOOLS,
          model: body.model,
          maxTokens: body.maxTokens,
        })) {
          if (ev.type === 'sentence') {
            sentenceCount++;
            if (firstSentenceMs === null) firstSentenceMs = Date.now() - startedAt;
          } else if (ev.type === 'tool-call') {
            toolNames.push(ev.name);
            if (firstToolMs === null) firstToolMs = Date.now() - startedAt;
          } else if (ev.type === 'done') {
            fullText = ev.fullText;
            stopReason = ev.stopReason;
            usage.inputTokens = ev.usage.inputTokens;
            usage.outputTokens = ev.usage.outputTokens;
            usage.cacheReadTokens = ev.usage.cacheReadTokens;
            usage.cacheCreationTokens = ev.usage.cacheCreationTokens;
          }
          send(ev);
        }
      } catch (err) {
        console.error('[brain.stream] error:', err);
        try {
          send({ type: 'done', stopReason: 'error', usage, fullText, toolCalls: [] });
        } catch { /* client gone */ }
      } finally {
        const totalMs = Date.now() - startedAt;
        const textSnippet = fullText.slice(0, 120).replace(/\n/g, ' ');
        const promiseRegex = /\b(let me|i['’]ll|i will|here['’]s|here is|i['’]m going to)\s+(draw|plot|show|sketch|display|render|graph|create)\b/i;
        const promisedVisual = promiseRegex.test(fullText);
        const violatedRule8 = promisedVisual && toolNames.length === 0;
        console.log(
          `[brain.stream] student="${studentSnippet}${body.studentTranscript.length > 80 ? '…' : ''}" ` +
          `→ tools=[${toolNames.join(', ') || '(none)'}] · sentences=${sentenceCount} ` +
          `· first_sentence=${firstSentenceMs}ms · first_tool=${firstToolMs}ms · total=${totalMs}ms ` +
          `· text="${textSnippet}${fullText.length > 120 ? '…' : ''}" ` +
          `· stop=${stopReason} · in=${usage.inputTokens} out=${usage.outputTokens} cache_read=${usage.cacheReadTokens}` +
          (violatedRule8 ? ' ⚠ RULE8_VIOLATION' : '')
        );
        controller.close();
      }
    },
    cancel() {
      // Client closed the connection. Generator iteration above will
      // throw on next enqueue and we'll fall through to the finally.
      console.log('[brain.stream] client cancelled');
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',  // disable nginx buffering if proxied
    },
  });
}
