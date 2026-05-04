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
import { getSegmentTruth } from '../lesson-plan/context';
import type { Segment } from '../lesson-plan/types';
import { buildWhiteboardSummary } from '../whiteboard/summary';

export const BRAIN_MODEL_ID = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1500;
/**
 * Hard cap on agent-loop iterations per brain turn. Each iteration is one
 * Anthropic call. Typical multi-step plan completes in 1-3 rounds; cap
 * exists to prevent a runaway loop if the model keeps emitting tool_use
 * forever without converging.
 *
 * Bumped 5 → 9 on 2026-04-30 after a circles-session turn that emitted
 * 1 sentence + 6 tool calls hit the cap before narrating. Symptom: brain
 * said "Let's build the core vocabulary..." then went silent while the
 * board filled. Higher cap costs at most a few extra Anthropic calls
 * per stuck turn; the real protection is still the cap, not its value.
 */
const MAX_AGENT_ITERATIONS = 9;

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
  /** Active lesson plan context, when the session is plan-driven. The brain
   *  treats the current segment as the proximate teaching goal and uses
   *  `advance_lesson` to move on. Free-form sessions omit this. */
  lessonPlanContext?: LessonPlanContext;
  /** Compact student-profile block for cross-session memory. Empty for
   *  unauthenticated demo sessions; populated for retail / B2B with a
   *  persistent student id. The brain reads it for past mastery, open
   *  gaps, and recent-session continuity. */
  studentProfileBlock?: string;
  /** Statement of the problem the student is currently working on
   *  (most-recently-rendered showProblem / show_segment_card / generated
   *  problem). Surfaces as a dedicated `<active_problem>` block above the
   *  whiteboard snapshot so the brain anchors verification on this exact
   *  text — not on stale problem cards still visible in the snapshot from
   *  earlier in the same segment, and not on the anchor problem passed to
   *  generate_problem. The catastrophe this addresses (2026-05-02): brain
   *  called generate_problem with anchor={2,4,6,8,10}, pipeline returned
   *  canonicalText={12,14,16,18,20}, brain rendered the new card BUT then
   *  on the next turn verified the student's correct answer against the
   *  anchor's expected answer — five judge KILLs in a row before the
   *  brain regrasped which dataset was active. */
  activeProblem?: { statement: string };
  /** Optional override (defaults to claude-sonnet-4-6). */
  model?: string;
  /** Optional override (defaults to 1500). */
  maxTokens?: number;
  /** Optional async resolver for tool_result content. Default behavior
   *  returns "${name} executed successfully" — fire-and-forget tools
   *  like show_problem just need an ack. For tools that produce DATA
   *  the brain needs in the next iteration (e.g. `generate_problem`
   *  returning a canonical problem text), pass a resolver here.
   *
   *  Resolver receives the tool name + args, returns the string the
   *  brain sees as tool_result. May throw — the orchestrator will
   *  catch and fall back to the default ack. */
  toolResultProvider?: (
    name: string,
    args: Record<string, unknown>
  ) => Promise<string>;
}

/** Plan slice the brain sees on each turn. */
export interface LessonPlanContext {
  /** Plan id, title, grade, subject, LO descriptions — for the brain to
   *  understand what the lesson is about. */
  plan: {
    id: string;
    title: string;
    grade: string;
    subject: string;
    los: Array<{ id: string; description: string }>;
    estimatedMinutes: number;
  };
  /** Id of the segment the brain is currently in. */
  currentSegmentId: string;
  /** The full current segment (kind-specific fields included). The brain
   *  reads `goal` / `keyIdeas` / `problem` / etc. and translates intent
   *  into tool calls + voice. */
  currentSegment: unknown;
  /** Ordered list of segment ids + kinds, so the brain knows what's next.
   *  `offTopic: true` segments are bait / test-only and must be skipped
   *  during advance_lesson; the orchestrator + server-side feasibility
   *  check both honor this flag. */
  segmentIndex: Array<{ id: string; kind: string; offTopic?: boolean }>;
  /** Segment ids the brain has already marked complete this session.
   *  Surfaced in the rendered lesson_plan block so the brain knows
   *  which segments to NEVER re-render via show_segment_card. The
   *  runtime also blocks these calls structurally, but each block
   *  triggers a validator-feedback retry whose kill-bridge phrase is
   *  audible to the student. Surfacing the list lets the brain skip
   *  the call in the first place. */
  completedSegmentIds?: string[];
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
  /** A complete sentence ready to be voiced. Already trimmed.
   *  May contain `*emphasized*` markers — the speakText layer maps
   *  those to TTS emphasis (Realtime: prosody hint; Cartesia: SSML).
   *  May also carry an inline `pauseAfter` hint requesting the speaking
   *  client to wait before the next sentence (used after dense
   *  explanations or when `<show_*>` just landed). */
  | { type: 'sentence'; text: string; pauseAfter?: 'small' | 'medium' | 'large' }
  /** A tool call whose input JSON is fully assembled. Dispatch inline. */
  | { type: 'tool-call'; id: string; name: string; args: Record<string, unknown> }
  /** Explicit pause directive emitted between sentences. The speakText
   *  layer waits this long before voicing the next sentence. Cancelled
   *  immediately if the student speaks (barge-in). */
  | { type: 'pause'; ms: number; reason?: string }
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
    // Sentence-merge defense (narrow). Sonnet occasionally drops the
    // space between a sentence-end period and the next sentence's
    // markdown-bold opener — e.g. "is 45.5.*85.4* — that's right"
    // where the second sentence is "*85.4* — that's right". Detect
    // ONLY the period-immediately-followed-by-asterisk pattern (an
    // unambiguous sentence-boundary marker — Sonnet only uses `*`
    // for bold emphasis, not for math) and insert a space. Real
    // decimals (3.14, 0.5, 85.4) are NEVER touched because they don't
    // have asterisks attached to the fractional digit. An earlier
    // version of this defense used a broader "period+digit followed
    // by discourse marker" regex that incorrectly split real decimals
    // — observed 2026-05-04 session where "85.4 — that's right" got
    // mangled into "85. 4 — that's right" and TTS read it as "eighty
    // five four". The asterisk-only rule is safe.
    const asteriskMergeRe = /(\d)\.(\*)/g;
    this.buf += delta.replace(asteriskMergeRe, '$1. $2');
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
 * one, or just talk. Includes the per-feature descriptions (point coords,
 * segment endpoints, etc.) so a follow-up "join OC and OD" turn preserves
 * the exact coordinates of C and D from the prior render instead of re-
 * imagining them off-circle. Without this, the brain sees only metadata
 * and has no way to keep figures consistent across turns.
 */
/** Render a LessonPlanContext into a compact prompt block. The brain
 *  reads this BEFORE deciding what to do this turn, so it must be
 *  unambiguous: which segment is current, what's next, what the segment
 *  asks for. Kind-specific fields are inlined as a small structured
 *  block so the brain doesn't have to guess at the schema. */
export function formatLessonPlanContext(ctx: LessonPlanContext): string {
  const { plan, currentSegmentId, currentSegment, segmentIndex, completedSegmentIds } = ctx;
  const completedSet = new Set(completedSegmentIds ?? []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seg = currentSegment as any;
  // Redact off-topic segment content from the current-segment dump —
  // the brain must not see the off-topic problem text because it will
  // narrate it before the runtime can refuse the render.
  const segIsOffTopic = !!seg?.offTopic;
  const segDetail = segIsOffTopic
    ? '  ⚠ OFF-TOPIC SEGMENT — content redacted. Do NOT narrate this segment. Do NOT call show_segment_card on it. Do NOT advance into it. Treat it as if it does not exist; if it ended up as the current segment, immediately call generate_problem (to give the student more practice on the prior on-topic concept) or wrap up.'
    : seg
      ? Object.entries(seg)
          .filter(([k, v]) => k !== 'id' && k !== 'kind' && v !== undefined && v !== null)
          .map(([k, v]) => `  ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
          .join('\n')
      : '(unknown)';
  // Surface the authored problem/question text for every segment with
  // one — not just the current segment. The brain often emits
  // advance_lesson + show_segment_card in the SAME response, then
  // narrates based on its expectation of the new segment's content
  // rather than the actual authored text. Listing every authored
  // problem inline lets the brain reach the correct tokens without an
  // extra round-trip. Cost: a few hundred extra cached tokens per plan
  // (the plan is the cache-stable preamble; this addition rides the
  // same cache window). Observed 2026-04-30 algebra-2 circles session:
  // chat said "radius 9, 120°" while the rendered worked-sector card
  // said "radius 8, 90°".
  const idx = segmentIndex
    .map((s, i) => {
      const isCurrent = s.id === currentSegmentId ? '  ← current' : '';
      const isCompleted = completedSet.has(s.id) ? '  ✓ COMPLETED' : '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sg = s as any;
      // Off-topic segments must NEVER expose their authored content to
      // the brain. Otherwise Sonnet reads the off-topic problem text
      // from this listing and speaks it before the runtime can refuse
      // the show_segment_card call. Mark them clearly and redact.
      const isOffTopic = sg.offTopic === true;
      const authored = (() => {
        if (isOffTopic) return null;
        if (sg.kind === 'try_yourself' && typeof sg.problem === 'string') return sg.problem;
        if (sg.kind === 'worked_example' && typeof sg.problem === 'string') return sg.problem;
        if (sg.kind === 'misconception_check' && typeof sg.question === 'string') return sg.question;
        if (sg.kind === 'extension' && typeof sg.advancedQuestion === 'string') return sg.advancedQuestion;
        return null;
      })();
      const offTopicTag = isOffTopic ? '  ⚠ OFF-TOPIC (do not advance into; do not narrate; content redacted)' : '';
      const head = `  ${i + 1}. ${s.id} [${s.kind}]${isCurrent}${isCompleted}${offTopicTag}`;
      return authored ? `${head}\n     authored: ${JSON.stringify(authored)}` : head;
    })
    .join('\n');
  const completedNote = completedSet.size > 0
    ? `\n\nCOMPLETED segments this session: ${[...completedSet].join(', ')}. NEVER call show_segment_card on any of these — the runtime blocks it and the kill-bridge phrase becomes audible to the student. To give the student more practice, call generate_problem instead.`
    : '';
  // Segments that carry an authored problem / question statement.
  // The brain MUST render that text verbatim to the whiteboard —
  // paraphrasing or substituting different numbers creates a
  // divergence between the brain's memory (the script) and what the
  // student sees (the rendered figure), which breaks answer validation.
  // Applies to every segment kind whose script names a specific problem,
  // question, or challenge.
  const segHasAuthoredText =
    seg && (
      (seg.kind === 'try_yourself' && typeof seg.problem === 'string') ||
      (seg.kind === 'worked_example' && typeof seg.problem === 'string') ||
      (seg.kind === 'misconception_check' && typeof seg.question === 'string') ||
      (seg.kind === 'extension' && typeof seg.advancedQuestion === 'string')
    );
  const problemLock = segHasAuthoredText
    ? [
        ``,
        `PROBLEM-LOCK for this segment: render the EXACT problem / question text from the segment above on the whiteboard before asking the student. Do not paraphrase, change numbers, or substitute a different problem. The student answers against the rendered version. If you depart from the script's text — even with the same intent — the validation gate compares against what you rendered, not what you remembered.`,
      ]
    : [];
  return [
    `plan: ${plan.title} — grade ${plan.grade}, ${plan.subject} (${plan.estimatedMinutes} min)`,
    `learning objectives:`,
    ...plan.los.map((lo) => `  - ${lo.description} (${lo.id})`),
    ``,
    `segments:`,
    idx,
    ``,
    `current segment "${currentSegmentId}" [${seg?.kind ?? 'unknown'}]:`,
    segDetail,
    ...problemLock,
    ``,
    `Stay within the current segment until its goal is met. Move on with`,
    `advance_lesson({ to: "next" }). Branch with advance_lesson({ to: "<id>" }).`,
    `Mark progress with mark_segment_complete({ segmentId, masteryDelta? }).`,
    completedNote,
  ].join('\n');
}

/** Render the segment's authored ground truth as a compact, fenced block
 *  the brain reads alongside `<lesson_plan>`. Distinct from the lesson
 *  plan dump because:
 *    1) it's only the bits the orchestrator can mechanically check
 *       (problem text, expected answer) — no goal/keyIdeas prose,
 *    2) the wording is enforcement-focused so the brain treats it as a
 *       contract not a hint, and
 *    3) the orchestrator uses the same `getSegmentTruth(seg)` helper to
 *       drift-check rendered tool calls, keeping prompt + runtime in
 *       lock-step. Returns '' for segments without authored truth.
 */
export function formatSegmentTruth(seg: unknown): string {
  // Redact off-topic segment truth — the brain must not see the
  // off-topic problem text via the segment_truth block either.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((seg as any)?.offTopic === true) return '';
  const truth = getSegmentTruth(seg as Segment | undefined);
  if (!truth) return '';
  const lines: string[] = [
    `kind: ${truth.kind}`,
    `problemText: ${JSON.stringify(truth.problemText)}`,
  ];
  if (truth.expectedAnswer !== undefined) {
    lines.push(`expectedAnswer: ${JSON.stringify(truth.expectedAnswer)}`);
  }
  lines.push(
    '',
    'CONTRACT: When you call show_problem (or show_equation labeled "Original' +
      ' Equation" / "Problem" / "Given"), the rendered text must match' +
      ' problemText above — same numbers, same operators, same wording.' +
      ' Paraphrasing or substituting different values will be rejected by' +
      ' the runtime drift check and you will be asked to retry. When you' +
      ' verbally state the answer, it must match expectedAnswer if one is' +
      ' provided. The student answers against what the board shows, not' +
      ' against your memory of the script.',
  );
  return lines.join('\n');
}

// Re-export from whiteboard/summary so client-side callers (the
// orchestrator's judge call) can import the helper without pulling in
// the Anthropic SDK that this file imports at top-level. The internal
// import below is what local callers (runBrainTurn / streamBrainTurn)
// use; the re-export keeps the public surface unchanged.
export { buildWhiteboardSummary };

/**
 * Render the `<active_problem>` block. Empty string when no active
 * problem is tracked (free-conversation, pre-render turns) so the block
 * is suppressed entirely. When set, this is the most-recently-rendered
 * problem statement — sourced from the orchestrator's currentProblemRef
 * which updates on every showProblem dispatch (including the show_problem
 * the brain emits with canonicalText after generate_problem returns).
 *
 * The block exists so the brain has ONE unambiguous answer to "which
 * problem is the student currently looking at?" — even when the
 * whiteboard snapshot still contains stale problem cards from earlier in
 * the same segment (e.g. the original try-yourself + a fresh
 * generate_problem variant, both stamped with the same segmentId).
 */
function formatActiveProblemBlock(active: BrainTurnInput['activeProblem']): string {
  if (!active?.statement) return '';
  return (
    `<active_problem>\n` +
    `This is the problem the student is currently working on. Verify their answers — and any narration that references "the problem" / numbers / data — against THIS statement only. ` +
    `Earlier problem cards may still be visible in <whiteboard_state> (the runtime keeps them for scroll-back); ignore them when reasoning about the current attempt. ` +
    `If you called generate_problem this session, the canonicalText that came back IS the active problem; the anchor problem you passed in was calibration only and is no longer the focus.\n\n` +
    `Statement: ${active.statement}\n` +
    `</active_problem>\n\n`
  );
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
  const profileBlock = input.studentProfileBlock ? `${input.studentProfileBlock}\n\n` : '';
  const lessonBlock = input.lessonPlanContext
    ? `<lesson_plan>\n${formatLessonPlanContext(input.lessonPlanContext)}\n</lesson_plan>\n\n`
    : '';
  const truthBody = input.lessonPlanContext
    ? formatSegmentTruth(input.lessonPlanContext.currentSegment)
    : '';
  const truthBlock = truthBody ? `<segment_truth>\n${truthBody}\n</segment_truth>\n\n` : '';
  const activeProblemBlock = formatActiveProblemBlock(input.activeProblem);
  const userContent =
    profileBlock +
    lessonBlock +
    truthBlock +
    activeProblemBlock +
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
  const profileBlock = input.studentProfileBlock ? `${input.studentProfileBlock}\n\n` : '';
  const lessonBlock = input.lessonPlanContext
    ? `<lesson_plan>\n${formatLessonPlanContext(input.lessonPlanContext)}\n</lesson_plan>\n\n`
    : '';
  const truthBody = input.lessonPlanContext
    ? formatSegmentTruth(input.lessonPlanContext.currentSegment)
    : '';
  const truthBlock = truthBody ? `<segment_truth>\n${truthBody}\n</segment_truth>\n\n` : '';
  const activeProblemBlock = formatActiveProblemBlock(input.activeProblem);
  const userContent =
    profileBlock +
    lessonBlock +
    truthBlock +
    activeProblemBlock +
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
          // Log args in dev so we can diagnose render-vs-brain disagreements
          // (e.g. "the chord doesn't pass through origin" — is that the
          // renderer's fault or did the brain emit asymmetric coords?).
          if (process.env.NODE_ENV !== 'production') {
            try {
              const preview = JSON.stringify(tc.args);
              console.log(
                `[brain.stream] tool-call ${tc.name} ${preview.length > 1500 ? preview.slice(0, 1500) + '…' : preview}`,
              );
            } catch {}
          }
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

    // Resolve tool_result content. Default ack for fire-and-forget
    // tools; data-returning tools (e.g. generate_problem) get the
    // resolver's output so the brain can use the result on the next
    // iteration.
    const resolvedResults = await Promise.all(
      newToolUseBlocks.map(async (b) => {
        let content = `${b.name} executed successfully.`;
        if (input.toolResultProvider) {
          try {
            const args = (b.input ?? {}) as Record<string, unknown>;
            content = await input.toolResultProvider(b.name, args);
          } catch (err) {
            console.warn(`[brain.stream] toolResultProvider failed for ${b.name}:`, err);
          }
        }
        return {
          type: 'tool_result' as const,
          tool_use_id: b.id,
          content,
        };
      })
    );
    messages = [
      ...messages,
      { role: 'assistant', content: finalMessage.content },
      {
        role: 'user',
        content: resolvedResults,
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
