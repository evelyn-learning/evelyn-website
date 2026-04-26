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
 * plus context, gets back a structured response. No streaming for now —
 * Realtime can voice the full text once it arrives. (Streaming is a Phase 5
 * latency optimization, not a correctness concern.)
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

  const response = await anthropic.messages.create({
    model: input.model ?? BRAIN_MODEL_ID,
    max_tokens: input.maxTokens ?? DEFAULT_MAX_TOKENS,
    // Ephemeral cache marker on the system prompt — Anthropic caches up to
    // the marker, so subsequent turns in this session read the prompt at
    // ~90% discount.
    system: [
      {
        type: 'text',
        text: input.systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    tools: toAnthropicTools(input.tools),
    messages: [
      ...input.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: userContent },
    ],
  });

  let text = '';
  const toolCalls: BrainToolCall[] = [];
  for (const block of response.content) {
    if (block.type === 'text') {
      text += (text ? '\n' : '') + block.text;
    } else if (block.type === 'tool_use') {
      toolCalls.push({
        id: block.id,
        name: block.name,
        args: (block.input ?? {}) as Record<string, unknown>,
      });
    }
  }

  return {
    text: text.trim(),
    toolCalls,
    stopReason: response.stop_reason ?? 'unknown',
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
    },
  };
}
