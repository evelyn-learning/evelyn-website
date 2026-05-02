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
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import {
  generateProblem,
  type Difficulty,
} from '@/lib/tutor/voice/problem-generator';

export const runtime = 'nodejs';

interface BrainStreamRequestBody {
  systemPrompt: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  studentTranscript: string;
  whiteboardSnapshot: BrainTurnInput['whiteboardSnapshot'];
  /** Active lesson plan context, when the session is plan-driven. */
  lessonPlanContext?: BrainTurnInput['lessonPlanContext'];
  /** Pre-rendered student profile block (cross-session memory). */
  studentProfileBlock?: string;
  /** Configured grade — drives pedagogy pacing knobs. */
  grade?: string;
  model?: string;
  maxTokens?: number;
  /** Adaptive-pacing v1: bank IDs + brain-gen problem-text hashes
   *  already shown this session, used as exclusion filters when the
   *  brain calls `generate_problem`. The client maintains this list
   *  in session-scoped refs and sends it on every brain turn so the
   *  resolver can dedup. */
  shownProblemIds?: string[];
  shownProblemHashes?: string[];
}

/**
 * Build a toolResultProvider that resolves `generate_problem` against
 * the adaptive-pacing pipeline. All other tools fall through to the
 * default "executed successfully" ack inside claude-brain.ts.
 *
 * The provider returns a JSON string the brain reads as tool_result
 * content. Shape: { canonicalText, expectedAnswer?, hints?,
 * responseFormat?, choices?, provenance, trackingId }. The brain is
 * instructed (in the system prompt) to quote canonicalText verbatim
 * in the next show_problem call.
 */
function makeToolResultProvider(
  ctx: BrainTurnInput['lessonPlanContext'] | undefined,
  shownProblemIds: string[],
  shownProblemHashes: string[]
): BrainTurnInput['toolResultProvider'] {
  if (!ctx) return undefined;
  return async (name, args) => {
    // Incoherence-fix: advance_lesson failures (end-of-plan, unknown
    // segment id) must be reported back to the brain. Without this,
    // the React orchestrator's silent failure at line 1810-ish leaves
    // the brain assuming it's on the next segment when it's actually
    // pinned to the last; subsequent show_segment_card / show_problem
    // calls then drift catastrophically. We synthesize a feasibility
    // check here using the plan + currentSegmentId from this turn's
    // context. The check can be slightly stale relative to mid-turn
    // catalog state, but the lesson-plan structure + currentSegmentId
    // are stable enough for end-of-plan detection.
    if (name === 'advance_lesson') {
      const to = String((args as { to?: unknown }).to ?? 'next');
      const segIdx = ctx.segmentIndex;
      const curIdx = segIdx.findIndex((s) => s.id === ctx.currentSegmentId);
      let resolvable = false;
      if (to === 'next') {
        resolvable = curIdx >= 0 && curIdx < segIdx.length - 1;
      } else if (to === 'previous') {
        resolvable = curIdx > 0;
      } else {
        resolvable = segIdx.some((s) => s.id === to);
      }
      if (!resolvable) {
        return JSON.stringify({
          error: 'advance_lesson_failed',
          message: to === 'next'
            ? 'Cannot advance — the student is on the LAST segment of the lesson plan. Do NOT pretend to advance. Either (a) wrap the session up gracefully ("nice work, we covered everything in this lesson — anything you want to revisit?"), or (b) suggest a follow-up plan / topic, or (c) offer to drill more on the current concept via generate_problem with difficulty="same" / "slightly_harder". DO NOT call show_segment_card or show_problem assuming a fresh segment is now active.'
            : `Cannot advance to "${to}" — that segment id is not in this plan. Either correct the id or wrap up the session.`,
          currentSegmentId: ctx.currentSegmentId,
          segmentIndex: segIdx,
        });
      }
      return `advance_lesson executed successfully (to=${to}).`;
    }
    if (name !== 'generate_problem') {
      return `${name} executed successfully.`;
    }
    const planId = ctx.plan.id;
    const plan = await getLessonPlan(planId);
    if (!plan) {
      return JSON.stringify({
        error: 'plan_not_found',
        message: 'The runtime could not resolve the lesson plan; falling back to plan-authored.',
      });
    }
    const difficulty = (args.difficulty as Difficulty) ?? 'same';
    const anchorStatement = String(args.anchorProblem ?? '').trim();
    const anchorAnswer = typeof args.anchorAnswer === 'string' ? args.anchorAnswer : undefined;
    if (!anchorStatement) {
      return JSON.stringify({
        error: 'missing_anchor',
        message: 'generate_problem requires anchorProblem (the statement of the prior problem).',
      });
    }
    try {
      const { result, telemetry } = await generateProblem({
        planId,
        plan,
        topic: plan.topic ?? '',
        difficulty,
        anchor: { statement: anchorStatement, expectedAnswer: anchorAnswer },
        excludeIds: shownProblemIds,
        excludeHashes: shownProblemHashes,
      });
      console.log('[brain.stream:generate_problem] telemetry:', JSON.stringify(telemetry));
      if (!result) {
        return JSON.stringify({
          error: 'no_problem_available',
          message: 'No problem could be sourced. Continue without injection.',
          telemetry,
        });
      }
      return JSON.stringify({
        canonicalText: result.canonicalText,
        expectedAnswer: result.expectedAnswer,
        hints: result.hints,
        responseFormat: result.responseFormat,
        choices: result.choices,
        provenance: result.provenance,
        trackingId: result.trackingId,
      });
    } catch (err) {
      console.error('[brain.stream:generate_problem] pipeline error:', err);
      return JSON.stringify({
        error: 'pipeline_error',
        message: err instanceof Error ? err.message : 'unknown',
      });
    }
  };
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

      // Once the client disconnects, every subsequent enqueue throws
      // "Invalid state: Controller is already closed." We track that
      // with a flag so:
      //   1) further send() calls become no-ops (no spammed errors),
      //   2) the for-await loop breaks early (no wasted brain compute),
      //   3) controller.close() in finally is also gated.
      // Observed in production 2026-04-30: a single client disconnect
      // produced three separate `enqueue failed` errors per turn (one
      // from the loop, one from the catch's done-event send, one from
      // the finally close). The streamed content also got truncated
      // and the client orchestrator may interpret the abrupt end as a
      // need to retry — surfacing as the "let me reframe" mid-turn
      // glitch the user reported.
      let clientGone = false;
      const send = (event: BrainStreamEvent) => {
        if (clientGone) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch (err) {
          clientGone = true;
          console.warn('[brain.stream] enqueue failed (client gone?):', err);
        }
      };

      try {
        for await (const ev of runTutorTurn({
          systemPrompt: body.systemPrompt,
          conversationHistory: body.conversationHistory,
          studentTranscript: body.studentTranscript,
          whiteboardSnapshot: body.whiteboardSnapshot,
          lessonPlanContext: body.lessonPlanContext,
          studentProfileBlock: body.studentProfileBlock,
          grade: body.grade,
          tools: WHITEBOARD_TOOLS,
          model: body.model,
          maxTokens: body.maxTokens,
          toolResultProvider: makeToolResultProvider(
            body.lessonPlanContext,
            body.shownProblemIds ?? [],
            body.shownProblemHashes ?? []
          ),
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
          // Bail early if the client is gone — no point continuing to
          // pull from the brain generator (costs API tokens) when no
          // one is listening.
          if (clientGone) break;
        }
      } catch (err) {
        console.error('[brain.stream] error:', err);
        send({ type: 'done', stopReason: 'error', usage, fullText, toolCalls: [] });
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
          (violatedRule8 ? ' ⚠ RULE8_VIOLATION' : '') +
          (clientGone ? ' (client_gone)' : '')
        );
        // Defensive close — already-closed throws here too.
        if (!clientGone) {
          try { controller.close(); } catch { /* already closed */ }
        }
      }
    },
    cancel() {
      // Client closed the connection. The next enqueue inside the
      // generator loop will throw, set clientGone=true, and the loop
      // will break out cleanly.
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
