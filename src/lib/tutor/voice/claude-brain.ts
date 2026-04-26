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
