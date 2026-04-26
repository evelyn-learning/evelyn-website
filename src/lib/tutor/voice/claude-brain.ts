/**
 * Claude brain — the reasoning core for the Realtime-as-relay architecture.
 *
 * One async call: takes the conversation so far + the student's latest
 * utterance + a snapshot of what's currently on the whiteboard, and returns
 * (a) what the tutor should say next and (b) any whiteboard tool calls to
 * issue. The caller is responsible for routing tool calls through the
 * existing structural validators and rendering pipeline; this module is
 * pure — no React, no DOM, no Realtime SDK.
 *
 * Why a separate file: keeping the brain free of UI plumbing makes it
 * trivially unit-testable (feed in a transcript, assert on the response)
 * and keeps the swap from the Realtime-as-brain architecture localized.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { CatalogSnapshotEntry } from '../whiteboard/catalog';
import type { ToolDefinition } from '../../../app/tutor/hooks/toolDefinitions';
import { toAnthropicTools } from '../../../app/tutor/hooks/toolDefinitions';

export const BRAIN_MODEL_ID = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1500;
/**
 * Hard cap on agent-loop iterations per brain turn. Each iteration is one
 * Anthropic call. Sonnet's typical multi-step plan completes in 1-3 rounds;
 * cap exists to prevent a runaway loop if the model keeps emitting tool_use
 * forever without converging.
 */
const MAX_AGENT_ITERATIONS = 5;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface BrainTurnInput {
  /** System prompt — tutoring style + tool-API rules. NO domain examples. */
  systemPrompt: string;
  /** Prior conversation, oldest first. Each entry is one student or tutor turn. */
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** What the student just said — the trigger for this turn. */
  studentTranscript: string;
  /** Current whiteboard contents (catalog snapshot). Empty array = blank board. */
  whiteboardSnapshot: CatalogSnapshotEntry[];
  /** Tool definitions in the neutral format. Converted to Anthropic shape internally. */
  tools: ToolDefinition[];
  /** Optional override (defaults to claude-sonnet-4-6). */
  model?: string;
  /** Optional override (defaults to 1500). */
  maxTokens?: number;
}

export interface BrainToolCall {
  /** Anthropic-assigned ID, used as the tool_use_id when sending tool_results back. */
  id: string;
  /** Tool name (matches a `WHITEBOARD_TOOLS[i].name`). */
  name: string;
  /** Parsed argument object. */
  args: Record<string, unknown>;
}

export interface BrainTurnOutput {
  /** What the tutor should say (verbal) — empty if Claude only emitted tool calls. */
  text: string;
  /** Tool calls to dispatch through the existing whiteboard pipeline. */
  toolCalls: BrainToolCall[];
  /** Anthropic stop reason — useful for debugging / telemetry. */
  stopReason: string;
  /** Token accounting for cost telemetry. */
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
}

/**
 * One event in the streaming brain output. The streaming variant of
 * runBrainTurn emits these incrementally so the orchestrator can voice
 * sentences as they arrive (instead of waiting for the entire response)
 * and dispatch tool calls inline (interleaved with speech).
 *
 * Order within a turn is well-defined: sentences from one text block
 * appear before any tool-call from the same block, and blocks within
 * one Anthropic response appear in the order Claude emits them. Across
 * agent-loop iterations, all events from iteration N appear before any
 * event from iteration N+1.
 */
export type BrainStreamEvent =
  /** A complete sentence ready to be voiced. Already trimmed. */
  | { type: 'sentence'; text: string }
  /** A tool call whose input JSON is fully assembled. Dispatch inline. */
  | { type: 'tool-call'; id: string; name: string; args: Record<string, unknown> }
  /** Terminal event. Includes cumulative metadata for telemetry. */
  | {
      type: 'done';
      stopReason: string;
      usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
      /** Concatenated text across all sentences, for transcriptRef storage. */
      fullText: string;
      /** All tool calls, in emission order. */
      toolCalls: BrainToolCall[];
    };

/**
 * Sentence boundary detector. Buffers text deltas as they arrive and
 * extracts complete sentences once a sentence-terminator is seen with
 * enough preceding context to avoid false positives on abbreviations
 * ("Dr.", "1.", "v = 4 m/s.") and decimal numbers ("3.14").
 *
 * The 25-char minimum is a heuristic: most legitimate tutor sentences
 * are longer than that, while abbreviations + numbers are typically
 * shorter. False negatives (sentence held back too long) are corrected
 * on flush; false positives (premature flush) would cause speakText to
 * fire on a fragment, which is worse — so we err toward holding back.
 */
class SentenceBuffer {
  private buf = '';
  private static readonly MIN_LEN = 25;

  /** Append delta, return zero or more newly-completed sentences. */
  push(delta: string): string[] {
    this.buf += delta;
    const out: string[] = [];
    // Lazy quantifier {25,}? + terminator + trailing whitespace.
    // Use [\s\S] instead of `.` with the `s` flag so this builds under
    // ES2017 targets (Sonnet sometimes emits multi-line text mid-response).
    const re = /^([\s\S]{25,}?[.!?])(\s+)/;
    while (true) {
      const m = this.buf.match(re);
      if (!m) break;
      const sentence = m[1].trim();
      if (sentence) out.push(sentence);
      this.buf = this.buf.slice(m[0].length);
    }
    return out;
  }

  /** Flush whatever is left. Called at block boundaries and stream end. */
  flush(): string | null {
    const trimmed = this.buf.trim();
    this.buf = '';
    return trimmed || null;
  }
}

/**
 * Build a compact, human-readable description of what's on the whiteboard so
 * Claude can reason about whether to add a new figure, scribble on an existing
 * one, or just talk. Keeps the per-turn cost bounded — full structured state
 * would balloon the prompt.
 */
export function buildWhiteboardSummary(snapshot: CatalogSnapshotEntry[]): string {
  if (snapshot.length === 0) return '(whiteboard is empty)';
  return snapshot
    .map((entry, i) => {
      const title = entry.title ? ` — ${entry.title}` : '';
      const page = entry.pageTitle ? ` [page: ${entry.pageTitle}]` : '';
      const features = entry.featureCount > 0 ? ` (${entry.featureCount} addressable features)` : '';
      return `[${i + 1}] ${entry.action}${title}${page}${features}`;
    })
    .join('\n');
}

/**
 * Run one turn of the brain. The caller passes the latest student utterance
 * plus context, gets back a structured response with all text + tool calls
 * accumulated across however many round-trips Sonnet needed.
 *
 * The agent loop. This is the architectural piece without which Sonnet's
 * multi-step plans die after step 1: when Claude returns stop_reason=tool_use,
 * it is PAUSING for tool results, not finishing. We must send tool_result
 * blocks back to let it continue (e.g. emit new_page first, then follow up
 * with show_geometry once the page swap is acknowledged). Earlier versions
 * of this function executed only one round-trip; the result was that any
 * sequencing tool (new_page, list_whiteboard_features, etc.) would orphan
 * the actual rendering call. Observed 2026-04-26: every "Can you draw a
 * perpendicular CD" produced tools=[new_page] with no show_geometry follow-up.
 *
 * For now, tool_results are synthetic acknowledgments ("executed
 * successfully"). Phase 2 of this fix will pipe real validator feedback
 * (rejection reasons, board state changes) so Claude can self-correct.
 */
export async function runBrainTurn(input: BrainTurnInput): Promise<BrainTurnOutput> {
  const whiteboardSummary = buildWhiteboardSummary(input.whiteboardSnapshot);

  // Compose the user-side message with whiteboard state + the student's words
  // wrapped in clearly labeled blocks. Keeping them in the user role (rather
  // than as a separate "system" injection) lets prompt caching segment the
  // stable preamble from the volatile per-turn payload.
  const userContent =
    `<whiteboard_state>\n${whiteboardSummary}\n</whiteboard_state>\n\n` +
    `<student_said>\n${input.studentTranscript}\n</student_said>`;

  // Initial messages: prior conversation + the student's just-said wrapper.
  let messages: Anthropic.MessageParam[] = [
    ...input.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userContent },
  ];

  let accumulatedText = '';
  const accumulatedToolCalls: BrainToolCall[] = [];
  const totalUsage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  let lastStopReason: string = 'unknown';

  for (let iter = 0; iter < MAX_AGENT_ITERATIONS; iter++) {
    const response = await anthropic.messages.create({
      model: input.model ?? BRAIN_MODEL_ID,
      max_tokens: input.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: input.systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: toAnthropicTools(input.tools),
      messages,
    });

    totalUsage.inputTokens += response.usage.input_tokens;
    totalUsage.outputTokens += response.usage.output_tokens;
    totalUsage.cacheReadTokens += response.usage.cache_read_input_tokens ?? 0;
    totalUsage.cacheCreationTokens += response.usage.cache_creation_input_tokens ?? 0;
    lastStopReason = response.stop_reason ?? 'unknown';

    // Extract text + tool_use blocks from this iteration.
    const newToolUseBlocks: Array<{ id: string; name: string; input: unknown }> = [];
    for (const block of response.content) {
      if (block.type === 'text') {
        accumulatedText += (accumulatedText ? '\n' : '') + block.text;
      } else if (block.type === 'tool_use') {
        newToolUseBlocks.push({ id: block.id, name: block.name, input: block.input });
        accumulatedToolCalls.push({
          id: block.id,
          name: block.name,
          args: (block.input ?? {}) as Record<string, unknown>,
        });
      }
    }

    // If Claude is done OR didn't actually emit tool calls this round,
    // exit the loop. (Defensive: if stop_reason were tool_use but no
    // blocks came through, looping without tool_results would hang.)
    if (response.stop_reason !== 'tool_use' || newToolUseBlocks.length === 0) {
      break;
    }
    if (iter === MAX_AGENT_ITERATIONS - 1) {
      console.warn('[brain] hit MAX_AGENT_ITERATIONS, returning partial result');
      break;
    }

    // Append the assistant's tool_use response and a synthetic tool_result
    // turn so Claude can continue. The result content is intentionally
    // generic — the actual rendering happens client-side after this
    // function returns. Phase 2 will plumb real validator feedback here.
    messages = [
      ...messages,
      { role: 'assistant', content: response.content },
      {
        role: 'user',
        content: newToolUseBlocks.map((b) => ({
          type: 'tool_result' as const,
          tool_use_id: b.id,
          content: `${b.name} executed successfully.`,
        })),
      },
    ];
  }

  return {
    text: accumulatedText.trim(),
    toolCalls: accumulatedToolCalls,
    stopReason: lastStopReason,
    usage: totalUsage,
  };
}

/**
 * Streaming variant of runBrainTurn. Emits BrainStreamEvent values as
 * Anthropic produces them — sentences as soon as a boundary is seen,
 * tool calls as soon as their content_block_stop event fires. Caller
 * voices each sentence via Realtime's TTS and dispatches each tool call
 * through the existing handleWhiteboardCommand pipeline.
 *
 * The agent loop runs across multiple Anthropic iterations, all within
 * the lifetime of this single generator. The consumer sees events from
 * iteration N before iteration N+1; loop boundaries are invisible to
 * the consumer.
 */
export async function* streamBrainTurn(input: BrainTurnInput): AsyncGenerator<BrainStreamEvent, void, void> {
  const whiteboardSummary = buildWhiteboardSummary(input.whiteboardSnapshot);
  const userContent =
    `<whiteboard_state>\n${whiteboardSummary}\n</whiteboard_state>\n\n` +
    `<student_said>\n${input.studentTranscript}\n</student_said>`;

  let messages: Anthropic.MessageParam[] = [
    ...input.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userContent },
  ];

  let accumulatedText = '';
  const accumulatedToolCalls: BrainToolCall[] = [];
  const totalUsage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  let lastStopReason: string = 'unknown';

  for (let iter = 0; iter < MAX_AGENT_ITERATIONS; iter++) {
    const sentenceBuffer = new SentenceBuffer();
    const newToolUseBlocks: Array<{ id: string; name: string; input: unknown }> = [];
    // Per-block tool-use accumulator. Anthropic streams the input JSON
    // as `input_json_delta` events; we parse it once on content_block_stop.
    let currentToolUse: { id: string; name: string; rawJson: string } | null = null;

    const stream = anthropic.messages.stream({
      model: input.model ?? BRAIN_MODEL_ID,
      max_tokens: input.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: input.systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: toAnthropicTools(input.tools),
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          currentToolUse = {
            id: event.content_block.id,
            name: event.content_block.name,
            rawJson: '',
          };
        }
      } else if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          accumulatedText += event.delta.text;
          for (const sentence of sentenceBuffer.push(event.delta.text)) {
            yield { type: 'sentence', text: sentence };
          }
        } else if (event.delta.type === 'input_json_delta' && currentToolUse) {
          currentToolUse.rawJson += event.delta.partial_json;
        }
      } else if (event.type === 'content_block_stop') {
        // Flush any buffered text before dispatching a tool call from the
        // same response — keeps the audio→visual ordering correct (the
        // student hears "Here's the triangle" then sees the triangle pop in).
        const remaining = sentenceBuffer.flush();
        if (remaining) yield { type: 'sentence', text: remaining };
        if (currentToolUse) {
          let args: Record<string, unknown> = {};
          if (currentToolUse.rawJson) {
            try {
              args = JSON.parse(currentToolUse.rawJson) as Record<string, unknown>;
            } catch (err) {
              console.error('[brain.stream] failed to parse tool input JSON:', err, currentToolUse.rawJson);
            }
          }
          const tc: BrainToolCall = { id: currentToolUse.id, name: currentToolUse.name, args };
          newToolUseBlocks.push({ id: tc.id, name: tc.name, input: args });
          accumulatedToolCalls.push(tc);
          yield { type: 'tool-call', id: tc.id, name: tc.name, args: tc.args };
          currentToolUse = null;
        }
      }
    }

    // Stream finished. Pull final metadata + assistant content for the
    // next agent-loop iteration.
    const finalMessage = await stream.finalMessage();
    totalUsage.inputTokens += finalMessage.usage.input_tokens;
    totalUsage.outputTokens += finalMessage.usage.output_tokens;
    totalUsage.cacheReadTokens += finalMessage.usage.cache_read_input_tokens ?? 0;
    totalUsage.cacheCreationTokens += finalMessage.usage.cache_creation_input_tokens ?? 0;
    lastStopReason = finalMessage.stop_reason ?? 'unknown';

    if (finalMessage.stop_reason !== 'tool_use' || newToolUseBlocks.length === 0) {
      break;
    }
    if (iter === MAX_AGENT_ITERATIONS - 1) {
      console.warn('[brain.stream] hit MAX_AGENT_ITERATIONS, ending early');
      break;
    }

    messages = [
      ...messages,
      { role: 'assistant', content: finalMessage.content },
      {
        role: 'user',
        content: newToolUseBlocks.map((b) => ({
          type: 'tool_result' as const,
          tool_use_id: b.id,
          content: `${b.name} executed successfully.`,
        })),
      },
    ];
  }

  yield {
    type: 'done',
    stopReason: lastStopReason,
    usage: totalUsage,
    fullText: accumulatedText.trim(),
    toolCalls: accumulatedToolCalls,
  };
}
