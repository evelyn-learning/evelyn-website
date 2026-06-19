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
import type { CatalogSnapshotEntry, Page } from '../whiteboard/catalog';
import type { ToolDefinition } from '../../../app/tutor/hooks/toolDefinitions';
import { toAnthropicTools } from '../../../app/tutor/hooks/toolDefinitions';
import { getSegmentTruth } from '../lesson-plan/context';
import type { Segment } from '../lesson-plan/types';
import { buildWhiteboardSummary } from '../whiteboard/summary';
import { validateToolCall } from '../whiteboard/validate-tool-call';

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
  /** Current whiteboard contents (catalog snapshot). Empty array = blank board.
   *  For the Board Map (project_tutor_board_map_design), this is the FULL-board
   *  snapshot (NOT segment-scoped) so off-segment expanded pages have detail;
   *  buildWhiteboardSummary owns the segment-scoping via whiteboardPages +
   *  currentSegmentId. Legacy callers may still pass a segment-scoped snapshot
   *  with no whiteboardPages → flat rendering. */
  whiteboardSnapshot: CatalogSnapshotEntry[];
  /** Full-board page list (catalog.getPages()) for the Board Map. Presence
   *  switches buildWhiteboardSummary into page-grouped MAP mode; absence →
   *  legacy flat list. */
  whiteboardPages?: readonly Page[];
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
  /** Targets the brain passed to tutor_scribble last turn that the
   *  runtime silently dropped (no_match / whole-item alias / iframe).
   *  Surfaces as an `<unrealized_marks>` advisory so the brain knows the
   *  promised marks did not land — and can adjust narration on this
   *  turn if it references those features again. One-turn lifetime:
   *  the orchestrator pushes here at silent-drop in turn N, the next
   *  brain call in turn N+1 reads + clears. Cheaper than judge-side
   *  detection and compatible with the Round-7+ silent-drop guardrail
   *  (next-turn advisory, not same-turn rejection — no audio cascade).
   *  Whiteboard markup initiative, Phase 1 (audit 2026-05-13). */
  unrealizedMarks?: string[];
  /** show_* tool calls the orchestrator collapsed via cross-turn dedup
   *  last turn (signature already in WhiteboardCatalog → no re-render
   *  needed). Without this signal, the brain assumes its re-render
   *  landed and speaks AS IF the new version is on the board — when
   *  in fact the original is still showing. Catastrophe observed
   *  2026-05-13 G5 comparison_table session: brain emitted a second
   *  comparison_table with reworded cells, structuralAxesFor dedup
   *  fired (correct — axes match), brain then quizzed the student
   *  against ITS unrendered version's cell strings ("Slide past each
   *  other") while the rendered table had different strings ("Flows
   *  freely"). Student gave the correct answer for the visible table
   *  and was told they were wrong.
   *
   *  Surfaces as `<deduplicated_renders>` advisory. Brain reads it
   *  and routes through tutor_scroll_whiteboard / tutor_scribble
   *  against the existing item, accepts the existing rendered content
   *  as canonical, and stops verbalizing "let me get the chart up". */
  deduplicatedShows?: string[];
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
  /** Pacing v2 student-state snapshot. Surfaces as `<student_state>`
   *  block when any signal is interesting (streak > 0 OR cue present
   *  OR segmentMastered set OR segTurns >= 2). Block is OMITTED
   *  entirely when uninteresting to keep prompt tokens small.
   *
   *  Phase 2: when `thresholds` are provided AND a threshold is
   *  crossed, the formatter appends a `hint:` line that the brain is
   *  instructed (in the system prompt) to honor as a directive.
   *  Without thresholds (Phase 1 / advisory flag off), no hint lines
   *  render — block stays informational.
   *
   *  Sourced from VoiceTutorRealtime refs (studentStreakRef,
   *  studentIncorrectStreakRef, studentCueRef, segmentTurnCountRef,
   *  segmentMasteredFlagRef) + gradeProfile.pacingThresholds. */
  pacingState?: {
    correctStreak: number;
    incorrectStreak: number;
    cue?: string;
    segmentTurns: number;
    segmentMastered?: { segId: string; streakAtComplete: number };
    /** Phase 2: per-grade thresholds. When omitted, no hint: line is
     *  rendered (Phase 1 inert mode, or advisory flag is off). */
    thresholds?: {
      silentRampStreak: number;
      explicitOfferStreak: number;
      inverseStreak: number;
      checkInMinTurns: number;
      checkInCooldown: number;
    };
    /** Phase 3: session-level depth preference. Stepped by Slow down /
     *  Speed up button click OR matching verbal cue. Negative = student
     *  wants more depth / slower teaching. Positive = less depth.
     *  Clamped -2..+2. When non-zero, the brain receives a separate
     *  `<pace_preference>` block instructing it to adjust teaching
     *  depth. Never resets within a session (session-end only). */
    paceBias?: number;
    /** Number of turns since paceBias was last set / changed. Surfaces
     *  as "applied since N turns ago" in the pace_preference block. */
    paceBiasAppliedSinceTurns?: number;
  };
  /** Topic-notes orchestrator state — warmup status + remaining per-bucket
   *  capacity for the current session. Surfaces as a compact
   *  `<topic_notes_state>` block so the brain knows when to fire (warmup
   *  cleared) vs. wait (warmup not yet cleared, calls would be silent-
   *  dropped). Without this signal the brain has no way to know whether
   *  its tool calls would land. Computed in the orchestrator from
   *  `completedSegmentIdsRef.size` + `sessionAccumRef.topicNotesCount` +
   *  the rate-limit constants. */
  topicNotesState?: {
    /** Active plan id (== topic-notes baselineId). Empty/omitted in
     *  free-conversation sessions; the formatter renders nothing. */
    baselineId: string;
    completedSegments: number;
    warmupSegmentsRequired: number;
    /** Per-bucket capacity remaining this session (cap minus attempts). */
    remaining: { theory: number; methods: number; pointers: number };
  };
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
  /** A tool call whose payload failed validation (e.g. empty showTable
   *  rows, blank showMolecule smiles). Not dispatched to the whiteboard
   *  renderer. Consumers may log it to debugEvents for telemetry. */
  | { type: 'tool-rejected'; id: string; name: string; args: Record<string, unknown>; reason: string }
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
/**
 * Compute the advisory hint (Phase 2) given counters + thresholds.
 * Returns the hint text WITHOUT the leading "hint: " prefix, or null
 * when no threshold crossed. Cue hint takes precedence over streak
 * hints — a verbal cue is the strongest signal. Among streak hints,
 * incorrect-streak takes precedence over correct-streak (struggling
 * is truth, ramping easier is more important than ramping harder).
 * Generic phrasings — no subject-specific terms.
 */
function computePacingHint(state: NonNullable<BrainTurnInput['pacingState']>): string | null {
  const t = state.thresholds;
  if (!t) return null;
  // Q15 conflict resolution. paceBias indicates the student's
  // explicitly-stated depth preference (set via Slow down / Speed up
  // button or matching verbal cue). When a hint direction is
  // ALIGNED with the bias direction, suppress the hint — the student
  // has already chosen this depth/style. When OPPOSED (e.g. student
  // asked for less depth but is now struggling), the hint still
  // fires — truth (struggling / acing) wins over style preference.
  // Cue-freshness override: a recent verbal cue can override a stale
  // bias for THIS turn's offer decision (bias state preserved for
  // subsequent turns).
  const bias = state.paceBias ?? 0;
  const cueWantsHarder = !!state.cue && /\b(easy|boring|skip|next|i\s+know|obviously|duh|faster|speed\s+up)\b/i.test(state.cue);
  const cueWantsEasier = !!state.cue && /\b(slow\s+down|slower|too\s+fast)\b/i.test(state.cue);
  // Cue → strongest signal. Verbal disengagement / pace request. Cue
  // is naturally edge-triggered: studentCueRef.current is sticky for
  // ONE turn only (cleared on next utterance arrival), so this hint
  // can't level-fire across multiple turns.
  if (state.cue) {
    return `boredom cue detected — verbally offer "harder / skip / different topic" immediately`;
  }
  // Streak-based hints are EDGE-triggered: fire ONCE when count first
  // hits the threshold value, then go silent. Conversation history
  // carries the offer forward; the brain doesn't need re-nudging on
  // every subsequent turn. (Pre-2026-05-06 these used `>=` — observed
  // session 8 produced 13+ identical "Want another / harder / skip?"
  // offers in a row because the hint level-fired every turn while
  // streak stayed above threshold.)
  //
  // Edge cases:
  // - Streak count jumping from below threshold to above (e.g. some
  //   future regression spikes 2 → 4): silent-ramp at 3 is missed,
  //   only explicit-offer at 4 fires. Acceptable — losing the silent
  //   ramp is preferable to looping the offer.
  // - Segment carries streak count across (Phase 1 retag policy): if
  //   streak was 4 in segment A and segment B also evaluates with
  //   count=4, hint would fire AGAIN. In practice, the count keeps
  //   incrementing on the next correct answer in segment B, so the
  //   match window is at most ONE turn.
  //
  // Incorrect-streak: ALWAYS fires regardless of paceBias (struggle is
  // truth, style preference doesn't change whether help is needed).
  if (state.incorrectStreak === t.inverseStreak + 1) {
    return `incorrect-streak threshold reached — verbally offer "break this down / try a simpler version" choice`;
  }
  if (state.incorrectStreak === t.inverseStreak) {
    return `incorrect-streak threshold reached — next generate_problem should pass difficulty="slightly_easier"`;
  }
  // Correct-streak: harder/skip-aligned offers. Suppressed when bias <
  // 0 (student wants more depth, not faster ramp) UNLESS a recent cue
  // contradicts the stale bias.
  const correctSuppressed = bias < 0 && !cueWantsHarder;
  if (!correctSuppressed) {
    if (state.correctStreak === t.explicitOfferStreak) {
      return `explicit-offer threshold reached — verbally offer "another at this level / harder / skip ahead" choice`;
    }
    if (state.correctStreak === t.silentRampStreak) {
      return `silent-ramp threshold reached — next generate_problem should pass difficulty="slightly_harder"`;
    }
  }
  // bias > 0 + recent cue wanting easier (rare collision case): no
  // explicit hint. Brain handles via standard binding-choice rule.
  void cueWantsEasier;
  return null;
}

/**
 * Render the `<student_state>` block. Pacing v2 surfaces counters
 * (streak, incorrect-streak, cue, segment turns, segment-mastered
 * flag) plus, when thresholds are provided AND a threshold has been
 * crossed, an advisory `hint:` line the brain treats as a directive
 * (per the system-prompt rule).
 *
 * Block is OMITTED entirely when no signal is interesting (everything
 * zero, no cue, segment just started). Round-7 architecture flagged
 * always-on prompt blocks as a token-cost concern; Pacing v2 follows
 * the same pattern as `<active_problem>` (suppress when null) to
 * preserve cache hit rate on uneventful turns.
 *
 * Returns { block, hint } so callers (the brain stream route) can
 * also log the hint server-side for telemetry.
 */
function formatStudentStateBlock(
  state: BrainTurnInput['pacingState'],
): { block: string; hint: string | null } {
  if (!state) return { block: '', hint: null };
  const interesting =
    state.correctStreak > 0
    || state.incorrectStreak > 0
    || !!state.cue
    || !!state.segmentMastered
    || state.segmentTurns >= 2;
  if (!interesting) return { block: '', hint: null };
  const parts: string[] = [];
  parts.push(`streak=${state.correctStreak >= 0 ? '+' : ''}${state.correctStreak}`);
  parts.push(`wrong=${state.incorrectStreak}`);
  parts.push(`segTurns=${state.segmentTurns}`);
  if (state.cue) parts.push(`cue="${state.cue}"`);
  if (state.segmentMastered) parts.push(`mastered="${state.segmentMastered.segId}"@${state.segmentMastered.streakAtComplete}`);
  const hint = computePacingHint(state);
  const lines = [parts.join(' ')];
  if (hint) lines.push(`hint: ${hint}`);
  return {
    block: `<student_state>\n${lines.join('\n')}\n</student_state>\n\n`,
    hint,
  };
}

/**
 * Render the `<pace_preference>` block (Phase 3). Active only when the
 * student has clicked Slow down / Speed up OR uttered a matching verbal
 * cue ("slow down" / "faster" etc). Negative bias = student wants more
 * depth + smaller chunks + comprehension checks; positive = less depth +
 * tighter explanations. Block is OMITTED when bias === 0 / undefined to
 * keep token cost zero on the common case.
 *
 * Note this is a session-level preference — does NOT reset on segment
 * change. Brain should sustain the preference across the entire session
 * unless the student verbally requests a change in the other direction.
 */
function formatPacePreferenceBlock(state: BrainTurnInput['pacingState']): string {
  if (!state) return '';
  const bias = state.paceBias ?? 0;
  if (bias === 0) return '';
  const sign = bias < 0 ? 'negative' : 'positive';
  const absMag = Math.abs(bias);
  const mag = absMag === 1 ? 'mild' : 'strong';
  const since = state.paceBiasAppliedSinceTurns;
  const sinceLine = typeof since === 'number' && since >= 0
    ? `applied since: ${since} turn${since === 1 ? '' : 's'} ago`
    : '';
  // Generic guidance — no subject-specific examples. Brain reads + adapts.
  const guidance = bias < 0
    ? `student wants MORE depth and slower teaching. Break explanations into smaller chunks. Add a brief comprehension check between steps. Lengthen worked examples. Don't skip restatements that aid retention.`
    : `student wants LESS depth and faster teaching. Shorten explanations. Skip restating known facts. Cut comprehension checks unless the student is clearly stuck. Move through worked examples briskly.`;
  return (
    `<pace_preference>\n` +
    `bias: ${bias} (${sign}, ${mag})\n` +
    (sinceLine ? `${sinceLine}\n` : '') +
    `guidance: ${guidance}\n` +
    `</pace_preference>\n\n`
  );
}

/** Compact eligibility + capacity block for the topic-notes tools.
 *  Renders nothing when no plan / no baselineId. Three states:
 *    - warmup not cleared: tells brain calls would be silent-dropped.
 *    - warmup cleared, capacity remaining: tells brain it can fire +
 *      how many adds remain per bucket.
 *    - warmup cleared, capacity exhausted: tells brain not to bother.
 *  Generic structural shape per feedback_generic_prompts.md — no
 *  subject-specific examples. */
function formatTopicNotesStateBlock(state: BrainTurnInput['topicNotesState']): string {
  if (!state || !state.baselineId) return '';
  const eligible = state.completedSegments >= state.warmupSegmentsRequired;
  const r = state.remaining;
  const totalRemaining = r.theory + r.methods + r.pointers;
  // Telemetry — server log line verifies the eligibility signal reached
  // the prompt builder. Mirrors the [pacing] hint-rendered pattern.
  console.log(
    `[topic-notes] state-rendered eligible=${eligible ? 'yes' : 'no'} completed=${state.completedSegments}/${state.warmupSegmentsRequired} remaining=t${r.theory}/m${r.methods}/p${r.pointers}`,
  );
  if (!eligible) {
    return (
      `<topic_notes_state>\n` +
      `eligible: NO — warmup ${state.completedSegments}/${state.warmupSegmentsRequired} segments completed.\n` +
      `Topic-notes tools (expand_topic_notes_theory, add_topic_notes_method, add_topic_notes_pointer) will be silent-dropped if called this turn. Wait until warmup clears.\n` +
      `</topic_notes_state>\n\n`
    );
  }
  if (totalRemaining === 0) {
    return (
      `<topic_notes_state>\n` +
      `eligible: capacity exhausted this session (theory ${r.theory}, methods ${r.methods}, pointers ${r.pointers} remaining). Don't call topic-notes tools further this session.\n` +
      `</topic_notes_state>\n\n`
    );
  }
  return (
    `<topic_notes_state>\n` +
    `eligible: YES (warmup cleared) — topic-notes tool calls this turn will land on baseline "${state.baselineId}".\n` +
    `remaining capacity this session: theory ${r.theory}, methods ${r.methods}, pointers ${r.pointers}.\n` +
    `**Default to FIRING this turn if any moment is worth revision** — a vocabulary trap surfaced, the student used a non-canonical method that worked, an explanation deepened a baseline LO. Dedup against baseline + prior overlays is automatic, so over-firing is safe; the orchestrator collapses repeats. The 5/3/5 caps are headroom, not targets — spend them. The cost of leaving gaps in the student's revision artifact is higher than the cost of one too many entries.\n` +
    `</topic_notes_state>\n\n`
  );
}

/**
 * Render the `<unrealized_marks>` advisory block. Empty string when
 * the runtime did not silent-drop any scribble last turn. Surfaces the
 * failed target string(s) so the brain learns its narration was not
 * matched by a visual mark — and adjusts on this turn if it references
 * the same feature again. NOT a tool-result rejection (which would
 * trigger the Round-7+ retry cascade); informational only.
 */
function formatUnrealizedMarksBlock(marks?: string[]): string {
  if (!marks || marks.length === 0) return '';
  const list = marks.map((t) => `- target="${t}"`).join('\n');
  return (
    `<unrealized_marks>\n` +
    `Last turn, the following tutor_scribble calls did NOT land on any feature on the whiteboard:\n` +
    `${list}\n\n` +
    `Do NOT re-emit the same scribble — the target was not addressable. If you need to reference one of these features again this turn, either: (a) consult the boardSnapshot for the actual feature name and use that verbatim, (b) speak about the feature without claiming a visual mark, or (c) re-render the underlying item with more structural detail so the part you want to mark exists as a feature.\n` +
    `</unrealized_marks>\n\n`
  );
}

/**
 * Render the `<deduplicated_renders>` advisory block. Empty string when
 * the runtime did not dedup any show_* calls last turn. Tells the brain
 * its re-render attempts were collapsed — the original is still
 * canonical on the board. Without this, the brain teaches against its
 * mental (unrendered) version of the figure's content and quizzes the
 * student on values they never saw.
 */
function formatDeduplicatedShowsBlock(shows?: string[]): string {
  if (!shows || shows.length === 0) return '';
  const list = shows.map((s) => `- ${s}`).join('\n');
  return (
    `<deduplicated_renders>\n` +
    `Last turn, the following show_* tool calls were DEDUPLICATED (not re-rendered) because their structural axes already match an existing item on the whiteboard:\n` +
    `${list}\n\n` +
    `What is currently rendered on the board is the ORIGINAL item, NOT the version you just tried to emit. Do NOT:\n` +
    `- Narrate "let me get the chart up" / "let me show you the table" — the chart IS already up.\n` +
    `- Quiz the student against the cell content YOU just emitted — only the ORIGINAL item's cell content is visible to them.\n` +
    `- Re-emit the same show_* with reworded content — the dedup will fire again.\n\n` +
    `Instead: read the current cell content from the boardSnapshot, then use tutor_scroll_whiteboard / tutor_scribble to direct attention to existing cells, OR call show_* with genuinely different structural axes (different items / attributes / claim / etc.) if a new figure is warranted.\n` +
    `</deduplicated_renders>\n\n`
  );
}

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

/**
 * Assemble the `messages` array for a brain SDK call: prior conversation
 * (oldest-first) followed by this turn's volatile userContent wrapper.
 *
 * Stage 1 item 2 (2026-05-18 caching initiative): a 2nd cache breakpoint
 * on the LAST conversationHistory message. conversationHistory is
 * strictly append-only across turns — the client rebuilds it from refs
 * each turn and never mutates prior entries (VoiceTutorRealtime
 * runHistory: `[...runHistory, u, a]`), so turn N's history is a
 * byte-stable prefix of turn N+1's. Caching through the last history
 * message converts the growing transcript from full-price input
 * ($3/MTok) to cache reads ($0.30/MTok) and trims TTFT. The volatile
 * userContent (lesson plan / whiteboard / student_said) is the LAST
 * message and is intentionally left UNMARKED — it changes every turn
 * and must not be cached. ttl:'1h' matches the system breakpoint
 * (item 1) so the whole cached region has a uniform 1-hour TTL: no
 * mixed-TTL ordering subtlety, and the history survives mid-session
 * pauses for the same reason the system prefix does.
 *
 * Empty history (turn 1 of a session): map yields [] (lastIdx = -1),
 * so no 2nd breakpoint is added — the system breakpoint already caches
 * tools+system and userContent stays correctly uncached.
 *
 * Within a turn's agent loop / validator retry, callers append after
 * userContent; the history prefix and its breakpoint position are
 * unchanged, so the cached prefix is re-read (not rebuilt) each
 * iteration.
 *
 * Both runBrainTurn (non-streaming fallback) and streamBrainTurn (live
 * path) build messages through this helper so their cache behavior
 * cannot drift — the same twin-consistency requirement as item 1.
 */
function buildBrainMessages(
  conversationHistory: BrainTurnInput['conversationHistory'],
  userContent: string,
): Anthropic.MessageParam[] {
  const lastIdx = conversationHistory.length - 1;
  const history: Anthropic.MessageParam[] = conversationHistory.map((m, i) =>
    i === lastIdx
      ? {
          role: m.role,
          content: [
            {
              type: 'text' as const,
              text: m.content,
              cache_control: { type: 'ephemeral' as const, ttl: '1h' as const },
            },
          ],
        }
      : { role: m.role, content: m.content },
  );
  return [...history, { role: 'user' as const, content: userContent }];
}

export async function runBrainTurn(input: BrainTurnInput): Promise<BrainTurnOutput> {
  const whiteboardSummary = buildWhiteboardSummary(input.whiteboardSnapshot, {
    pages: input.whiteboardPages,
    currentSegmentId: input.lessonPlanContext?.currentSegmentId,
  });

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
  const unrealizedMarksBlock = formatUnrealizedMarksBlock(input.unrealizedMarks);
  const deduplicatedShowsBlock = formatDeduplicatedShowsBlock(input.deduplicatedShows);
  const { block: studentStateBlock, hint: pacingHint } = formatStudentStateBlock(input.pacingState);
  if (pacingHint) {
    console.log(`[pacing] hint-rendered hint="${pacingHint}"`);
  }
  const pacePreferenceBlock = formatPacePreferenceBlock(input.pacingState);
  if (pacePreferenceBlock) {
    console.log(`[pacing] pace-preference-rendered bias=${input.pacingState?.paceBias}`);
  }
  const topicNotesBlock = formatTopicNotesStateBlock(input.topicNotesState);
  const userContent =
    profileBlock +
    lessonBlock +
    truthBlock +
    activeProblemBlock +
    unrealizedMarksBlock +
    deduplicatedShowsBlock +
    studentStateBlock +
    pacePreferenceBlock +
    topicNotesBlock +
    `<whiteboard_state>\n${whiteboardSummary}\n</whiteboard_state>\n\n` +
    `<student_said>\n${input.studentTranscript}\n</student_said>`;

  // Initial messages: prior conversation + the student's just-said wrapper.
  let messages: Anthropic.MessageParam[] = buildBrainMessages(
    input.conversationHistory,
    userContent,
  );

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
          // Stage 1 item 1 (2026-05-18 caching initiative): 1-hour TTL
          // on the system+tools cached prefix (62K tok, $0.234 to
          // create). Default 5m expires on any >5-min student pause →
          // full re-create + cold ~62K prefill (latency stall) mid-
          // session. 1h write premium is +$0.141 once vs avoiding a
          // $0.234 re-create per gap — net win with ≥1 mid-session
          // pause. Both twins (this streaming live path + the
          // non-streaming fallback) carry it so their cache behavior
          // stays consistent. RISK 2 refuted in Stage 0 — the prefix is
          // byte-stable per turn, so this strictly extends a working
          // cache; no behavioral change.
          cache_control: { type: 'ephemeral', ttl: '1h' },
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
    const newToolUseBlocks: Array<{ id: string; name: string; input: unknown; rejectionReason?: string }> = [];
    for (const block of response.content) {
      if (block.type === 'text') {
        accumulatedText += (accumulatedText ? '\n' : '') + block.text;
      } else if (block.type === 'tool_use') {
        const args = (block.input ?? {}) as Record<string, unknown>;
        const validation = validateToolCall(block.name, args);
        if (!validation.ok) {
          console.warn(`[brain] tool-call rejected ${block.name}: ${validation.reason}`);
          newToolUseBlocks.push({ id: block.id, name: block.name, input: block.input, rejectionReason: validation.reason });
        } else {
          newToolUseBlocks.push({ id: block.id, name: block.name, input: block.input });
          accumulatedToolCalls.push({ id: block.id, name: block.name, args });
        }
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
          content: b.rejectionReason
            ? `${b.name} rejected: ${b.rejectionReason}. Do not retry with the same args — emit a corrected call or skip this tool.`
            : `${b.name} executed successfully.`,
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
  const whiteboardSummary = buildWhiteboardSummary(input.whiteboardSnapshot, {
    pages: input.whiteboardPages,
    currentSegmentId: input.lessonPlanContext?.currentSegmentId,
  });
  const profileBlock = input.studentProfileBlock ? `${input.studentProfileBlock}\n\n` : '';
  const lessonBlock = input.lessonPlanContext
    ? `<lesson_plan>\n${formatLessonPlanContext(input.lessonPlanContext)}\n</lesson_plan>\n\n`
    : '';
  const truthBody = input.lessonPlanContext
    ? formatSegmentTruth(input.lessonPlanContext.currentSegment)
    : '';
  const truthBlock = truthBody ? `<segment_truth>\n${truthBody}\n</segment_truth>\n\n` : '';
  const activeProblemBlock = formatActiveProblemBlock(input.activeProblem);
  const unrealizedMarksBlock = formatUnrealizedMarksBlock(input.unrealizedMarks);
  const deduplicatedShowsBlock = formatDeduplicatedShowsBlock(input.deduplicatedShows);
  const { block: studentStateBlock, hint: pacingHint } = formatStudentStateBlock(input.pacingState);
  if (pacingHint) {
    console.log(`[pacing] hint-rendered hint="${pacingHint}"`);
  }
  const pacePreferenceBlock = formatPacePreferenceBlock(input.pacingState);
  if (pacePreferenceBlock) {
    console.log(`[pacing] pace-preference-rendered bias=${input.pacingState?.paceBias}`);
  }
  const topicNotesBlock = formatTopicNotesStateBlock(input.topicNotesState);
  const userContent =
    profileBlock +
    lessonBlock +
    truthBlock +
    activeProblemBlock +
    unrealizedMarksBlock +
    deduplicatedShowsBlock +
    studentStateBlock +
    pacePreferenceBlock +
    topicNotesBlock +
    `<whiteboard_state>\n${whiteboardSummary}\n</whiteboard_state>\n\n` +
    `<student_said>\n${input.studentTranscript}\n</student_said>`;

  let messages: Anthropic.MessageParam[] = buildBrainMessages(
    input.conversationHistory,
    userContent,
  );

  let accumulatedText = '';
  const accumulatedToolCalls: BrainToolCall[] = [];
  const totalUsage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  let lastStopReason: string = 'unknown';
  // Last iteration's full message — hoisted out so the post-loop rescue
  // (Option A, 2026-06-16) can rebuild a valid tool_use/tool_result
  // message history to bridge into the rescue call.
  let lastFinalMessage: Anthropic.Message | null = null;

  for (let iter = 0; iter < MAX_AGENT_ITERATIONS; iter++) {
    const sentenceBuffer = new SentenceBuffer();
    const newToolUseBlocks: Array<{ id: string; name: string; input: unknown; rejectionReason?: string }> = [];
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
          // Stage 1 item 1 (2026-05-18 caching initiative): 1-hour TTL
          // on the system+tools cached prefix (62K tok, $0.234 to
          // create). Default 5m expires on any >5-min student pause →
          // full re-create + cold ~62K prefill (latency stall) mid-
          // session. 1h write premium is +$0.141 once vs avoiding a
          // $0.234 re-create per gap — net win with ≥1 mid-session
          // pause. Both twins (this streaming live path + the
          // non-streaming fallback) carry it so their cache behavior
          // stays consistent. RISK 2 refuted in Stage 0 — the prefix is
          // byte-stable per turn, so this strictly extends a working
          // cache; no behavioral change.
          cache_control: { type: 'ephemeral', ttl: '1h' },
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
          const validation = validateToolCall(tc.name, args);
          if (!validation.ok) {
            // Drop the tool call: don't yield it (so the renderer never
            // sees the malformed payload) and don't track it in
            // accumulatedToolCalls. We still register it in
            // newToolUseBlocks so the conversation contract with the
            // model is preserved — the resolved tool_result content
            // becomes the rejection reason, giving the brain feedback.
            console.warn(`[brain.stream] tool-call rejected ${tc.name}: ${validation.reason}`);
            newToolUseBlocks.push({ id: tc.id, name: tc.name, input: args, rejectionReason: validation.reason });
            yield { type: 'tool-rejected', id: tc.id, name: tc.name, args, reason: validation.reason };
            currentToolUse = null;
          } else {
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
    }

    // Stream finished. Pull final metadata + assistant content for the
    // next agent-loop iteration.
    const finalMessage = await stream.finalMessage();
    lastFinalMessage = finalMessage;
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
    // iteration. Rejected tool calls (validation failures) get the
    // rejection reason as their result so the model learns and can
    // retry with valid args.
    const resolvedResults = await Promise.all(
      newToolUseBlocks.map(async (b) => {
        let content: string;
        if (b.rejectionReason) {
          content = `${b.name} rejected: ${b.rejectionReason}. Do not retry with the same args — emit a corrected call or skip this tool.`;
        } else {
          content = `${b.name} executed successfully.`;
          if (input.toolResultProvider) {
            try {
              const args = (b.input ?? {}) as Record<string, unknown>;
              content = await input.toolResultProvider(b.name, args);
            } catch (err) {
              console.warn(`[brain.stream] toolResultProvider failed for ${b.name}:`, err);
            }
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

  // ── Option A rescue (2026-06-16) ──────────────────────────────────────
  // When the agent loop ends with tool calls accumulated but ZERO
  // narration text, Rule 9 ("Always speak when you act") was violated —
  // the student is on a voice channel and would hear silence while the
  // whiteboard fills. Make ONE more brain call with no tools registered
  // so the model is forced to emit text. Empirically rare; cost is one
  // extra Anthropic call per stuck turn (~$0.01 + ~3s).
  //
  // Path that triggers this:
  //  - MAX_AGENT_ITERATIONS exit with text="" + tool_use stream of N tools
  //    (observed 2026-06-15 SAT Math kickoff: 9 tools, 0 sentences).
  //  - Defensive end_turn exit with tools but no text (rare; same shape).
  //
  // To preserve a valid message history for the rescue call, append the
  // final iteration's assistant content + synthetic tool_result blocks
  // for any tool_use blocks it contained. This is the same bridging
  // pattern that the in-loop continuation uses; we just apply it once
  // more before the rescue user-message.
  if (!accumulatedText.trim() && accumulatedToolCalls.length > 0 && lastFinalMessage) {
    console.warn(`[brain.stream] OPTION-A rescue: ${accumulatedToolCalls.length} tools emitted with zero narration — invoking rescue call`);
    const lastToolUseBlocks = lastFinalMessage.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    );
    if (lastToolUseBlocks.length > 0) {
      messages = [
        ...messages,
        { role: 'assistant', content: lastFinalMessage.content },
        {
          role: 'user',
          content: lastToolUseBlocks.map((b) => ({
            type: 'tool_result' as const,
            tool_use_id: b.id,
            content: `${b.name} executed successfully.`,
          })),
        },
      ];
    }
    messages = [
      ...messages,
      {
        role: 'user',
        content:
          'You emitted whiteboard tools without any narration. ' +
          'Voice a brief opener sentence + 1-2 sentences describing what is now on the board. ' +
          'No more tools — text only.',
      },
    ];
    // No `tools` field → model has no tool slots to fill → forced to
    // emit text. We deliberately omit tools rather than passing []
    // because some Anthropic SDK versions treat [] as "no tools
    // available" while others raise on it; omitting is portable.
    try {
      const rescueStream = anthropic.messages.stream({
        model: input.model ?? BRAIN_MODEL_ID,
        max_tokens: 250,
        system: [
          {
            type: 'text',
            text: input.systemPrompt,
            cache_control: { type: 'ephemeral', ttl: '1h' },
          },
        ],
        messages,
      });
      const rescueBuffer = new SentenceBuffer();
      for await (const event of rescueStream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          accumulatedText += event.delta.text;
          for (const sentence of rescueBuffer.push(event.delta.text)) {
            yield { type: 'sentence', text: sentence };
          }
        } else if (event.type === 'content_block_stop') {
          const remaining = rescueBuffer.flush();
          if (remaining) yield { type: 'sentence', text: remaining };
        }
      }
      const rescueFinal = await rescueStream.finalMessage();
      totalUsage.inputTokens += rescueFinal.usage.input_tokens;
      totalUsage.outputTokens += rescueFinal.usage.output_tokens;
      totalUsage.cacheReadTokens += rescueFinal.usage.cache_read_input_tokens ?? 0;
      totalUsage.cacheCreationTokens += rescueFinal.usage.cache_creation_input_tokens ?? 0;
      lastStopReason = `${lastStopReason}+rescued`;
    } catch (err) {
      console.error('[brain.stream] OPTION-A rescue call failed:', err);
      // Swallow — the original (toolful, textless) result is still returned.
      // Better silent failure than crashing the whole turn.
    }
  }

  yield {
    type: 'done',
    stopReason: lastStopReason,
    usage: totalUsage,
    fullText: accumulatedText.trim(),
    toolCalls: accumulatedToolCalls,
  };
}
