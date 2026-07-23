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
import type { PlanContentSeen } from '@/lib/tutor/student-profile/types';
import { buildWhiteboardSummary } from '../whiteboard/summary';
import { validateToolCall } from '../whiteboard/validate-tool-call';
import { normalizeSentenceSpacing } from './sentence-spacing';
import type { DemoStopPayload } from './demo-stop-mode';
import type { MockReviewContext } from '@/lib/tutor/mock-exam/review-focus';

// Brain model, env-selectable for A/B without a deploy (TUTOR_BRAIN_MODEL).
// Default is the known-good Sonnet 4.6; prod ships claude-sonnet-5 via env.
// NOTE: thinking is set to 'disabled' on every call below — required, because
// Sonnet 5 turns on adaptive thinking when the field is OMITTED (adds latency,
// bad for a live voice brain), whereas Sonnet 4.6 runs thinking-off on omit.
// Explicit-disabled keeps both models at the same low-latency no-thinking path.
export const BRAIN_MODEL_ID = process.env.TUTOR_BRAIN_MODEL || 'claude-sonnet-4-6';
// 2000 (was 1500): Sonnet 5's tokenizer emits ~30-36% more tokens for the same
// text than Sonnet 4.6, so the old 1500 cap truncated equivalent output. This
// is a ceiling, not a target — the brain's tool-call turns rarely approach it,
// so the headroom costs nothing until actually used.
const DEFAULT_MAX_TOKENS = 2000;
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
  /** Pedagogy-opener initiative (flag NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER):
   *  the opener/calibration directive for the session's OPENING PHASE only
   *  (buildOpenerClause output). Sent per-turn by the orchestrator while
   *  the opening is active and dropped once the brain advances the lesson
   *  (or a small turn ceiling passes) — it lives in the per-turn user
   *  content, NOT the cached system prompt, precisely so its appearance
   *  and retirement never invalidate the byte-stable cached prefix.
   *  Surfaces as an `<opening_directive>` block. */
  openingDirective?: string;
  /** Student whiteboard marks (Phase 1: tap-to-point). One-per-line plain
   *  sentences produced by formatStudentMarks. Surfaces as a
   *  `<student_marks>` block in the turn's user content. Absent ⇒ block
   *  omitted ⇒ request byte-identical. */
  studentMarks?: string;
  /** Task E1 (pedagogy, flag NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER): budget-aware
   *  satisfying stop for DEMO sessions only. The client sends it per-turn
   *  (never when the flag is off or the session resolved 'subscribed');
   *  absent ⇒ no `<demo_stop>` block ⇒ userContent byte-identical.
   *  - mode 'time' (standalone /tutor demo): remaining-minutes pacing so the
   *    session lands one earned "I get it now" moment AND a clean stop
   *    before the budget runs out.
   *  - mode 'milestone' (academy trial embed, is_trial=true): the win is
   *    boxed to completing the first concept, not a clock.
   *  Lives in the volatile per-turn user content (minutesElapsed changes
   *  every turn) — NEVER in the byte-stable cached system prefix. */
  demoStop?: DemoStopPayload;
  /** Practice-mode contract (Task X2). When true the session is a PRACTICE
   *  session: the durable per-turn `<practice_session>` block is rendered so
   *  the tutor runs problem → attempt → feedback and does NOT teach new
   *  concepts (brief prerequisite remediation is still allowed). Derived on
   *  the client from the embed token's session_goal === 'practice' — a boot
   *  flag that rides EVERY token mint, including the resume mint, so the mode
   *  is durable across resume WITHOUT any client persistence (the block
   *  re-renders every turn from the stable prop; contrast the one-shot
   *  "Give me some practice problems." starter chip, which steered a single
   *  turn and was lost on resume). Absent/false ⇒ block omitted ⇒ userContent
   *  byte-identical to before this field existed. */
  practiceMode?: boolean;
  /** Task WS3: durable mock-review context — present only when the student
   *  arrived from a completed full-length mock to review their misses.
   *  Absent ⇒ `<mock_review>` block omitted ⇒ userContent byte-identical. */
  mockReview?: MockReviewContext;
  /** Teacher-persona mid-session style salience (flag
   *  NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER): compact distilled style markers
   *  (renderTeacherStyleReminder output — pace / catchphrases / analogy
   *  domains + audibility line). The orchestrator attaches it on every
   *  brain turn AFTER the opening directive retires — while the directive
   *  rides, identity is already salient. Absent ⇒ no `<teacher_style>`
   *  block ⇒ userContent byte-identical. Lives in per-turn user content,
   *  NEVER the cached system prefix. */
  styleReminder?: string;
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
  activeProblem?: {
    statement: string;
    /** 'card' (2026-07-23, live round 5): a try-yourself card the brain
     *  authored — its declared expectedAnswer is what the typed-submit
     *  auto-scorer grades against, so spoken grading must match it. */
    source?: 'student' | 'generated' | 'card';
    /** Pipeline-verified expected answer for the active problem (2026-07-17).
     *  Carried on EVERY turn while the problem is active so the brain
     *  verifies attempts against it instead of re-deriving from scratch and
     *  drifting mid-thread. */
    expectedAnswer?: string;
  };
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
    /** #7 hybrid (2026-07-17): STANDING problem-difficulty preference, set
     *  by the Harder/Easier menu chips. -1 (easier) .. +2 (much harder);
     *  0/absent = neutral. Unlike the old behavior (each click fired a
     *  one-shot "give me a harder one" utterance and was then forgotten),
     *  this governs every upcoming problem: surfaces as a
     *  `<difficulty_preference>` block AND deterministically upgrades a
     *  generate_problem difficulty of 'same' at the route (an explicit
     *  brain-chosen non-'same' value — i.e. an in-the-moment student ask —
     *  wins for that one problem). Persisted in the pacing blob. */
    difficultyBias?: number;
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
  /** Task C1 (pedagogy): session mode controls how the plan is FRAMED to
   *  the brain — 'subscribed' = seed-not-script with the LOs as a coverage
   *  contract; 'demo' = raw material, no coverage obligation. ABSENT ⇒ no
   *  framing clause is rendered and formatLessonPlanContext output is
   *  byte-identical to the pre-C1 block (the flag-off guarantee: the
   *  client only sets this when NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER is on). */
  sessionMode?: 'demo' | 'subscribed';
  /** Content variety (phase 1): fillings this student has already been shown
   *  for THIS plan on prior sessions. Present only when the client's
   *  TUTOR_CONTENT_VARIETY flag is on AND there is prior-session content to
   *  diverge from. Absent ⇒ no <content_variety> block ⇒ byte-identical. */
  contentVariety?: PlanContentSeen;
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
  /** A tool call whose input JSON is fully assembled. Dispatch inline.
   *  `anchorSentence` (Phase 4.1 Rule-8 repair): present only on repair
   *  frames emitted AFTER `done` — the 1-based number of the sentence that
   *  spoke the content, so the client can anchor the render to it instead
   *  of the (already-finished) dispatch count. */
  | { type: 'tool-call'; id: string; name: string; args: Record<string, unknown>; anchorSentence?: number }
  /** A tool call whose payload failed validation (e.g. empty showTable
   *  rows, blank showMolecule smiles). Not dispatched to the whiteboard
   *  renderer. Consumers may log it to debugEvents for telemetry. */
  | { type: 'tool-rejected'; id: string; name: string; args: Record<string, unknown>; reason: string }
  /** Phase 4.2 drop telemetry: a render the SERVER dropped before it ever
   *  reached the client (e.g. show_labeled_image URL/search failures).
   *  Client maps it to a `render_dropped` debug event — telemetry only,
   *  never dispatched. */
  | { type: 'render-dropped'; action: string; reason: string }
  /** Explicit pause directive emitted between sentences. The speakText
   *  layer waits this long before voicing the next sentence. Cancelled
   *  immediately if the student speaks (barge-in). */
  | { type: 'pause'; ms: number; reason?: string }
  /** generate_problem resolved server-side (2026-07-17): the verified
   *  problem + its expected answer, surfaced so the CLIENT can pin the
   *  answer into subsequent turns' <active_problem> block. Without this
   *  the expected answer lived only in an old tool_result and the brain
   *  drifted from it during long verification threads (live 2026-07-17:
   *  affirmed 1/4 for a limit whose pipeline-verified answer was 1/32). */
  | { type: 'generated-problem'; statement: string; expectedAnswer?: string }
  /** Terminal event. Includes cumulative metadata for telemetry. */
  | {
      type: 'done';
      stopReason: string;
      usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
      /** Concatenated text across all sentences, for transcriptRef storage. */
      fullText: string;
      /** All tool calls, in emission order. */
      toolCalls: BrainToolCall[];
      /** Task X10: number of whole-turn retries the stream route performed
       *  after transient/overloaded failures before this turn resolved.
       *  Stamped by the route (streamBrainTurn itself never retries at the
       *  turn level), so it's absent/0 for the direct in-process generator. */
      retries?: number;
      /** Task X10: set true by the stream route when the turn FAILED after
       *  exhausting retries (or hit a non-retryable error) having produced
       *  ZERO content. Signals the client to render the HONEST "having
       *  trouble reaching my brain" fallback instead of the mis-blaming
       *  "could you say that again?" line. Absent on any successful turn. */
      brainUnavailable?: boolean;
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
export class SentenceBuffer {
  private buf = '';
  private static readonly MIN_LEN = 25;
  /** Abbreviation tails whose period must NOT end a sentence. Live
   *  2026-07-09: "…, Ms." was emitted as a full sentence and Cartesia
   *  voiced the "Ms. Kiara" honorific with a sentence-final pause.
   *  Deliberately excludes "St"/"Mt" (ordinals like "1st." would
   *  false-positive across the digit→letter word boundary). */
  private static readonly ABBREV_TAIL_RE =
    /(?:\b(?:Mr|Ms|Mrs|Mx|Dr|Prof|Sr|Jr|vs|etc|approx)|\be\.g|\bi\.e)\.$/i;

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
    // C1 (2026-07-08): repair terminator-glued sentences
    // ("independent.Let's build") so the boundary regex below can split
    // them and TTS/captions get a real sentence break. Applied to the
    // whole buffer (idempotent) so a terminator arriving at the end of
    // one delta and its uppercase follower at the start of the next
    // still get repaired. See sentence-spacing.ts for the guard rules.
    this.buf = normalizeSentenceSpacing(this.buf);
    const out: string[] = [];
    // Lazy quantifier {MIN,}? + terminator + trailing whitespace.
    // Use [\s\S] instead of `.` with the `s` flag so this builds under
    // ES2017 targets (Sonnet sometimes emits multi-line text mid-response).
    // A candidate whose tail is an abbreviation ("…, Ms.") is not a
    // boundary — re-match with the minimum pushed past it so the scan
    // continues to the NEXT terminator instead of splitting the honorific.
    while (true) {
      let minLen = SentenceBuffer.MIN_LEN;
      let m: RegExpMatchArray | null = null;
      while (true) {
        m = this.buf.match(new RegExp(`^([\\s\\S]{${minLen},}?[.!?])(\\s+)`));
        if (!m || !SentenceBuffer.ABBREV_TAIL_RE.test(m[1])) break;
        minLen = m[1].length + 1;
      }
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
/** Render the <content_variety> directive from per-plan seen-memory (content
 *  variety phase 1). Returns '' when there's nothing seen (caller renders
 *  nothing → byte-identical output). Generic wording only — no
 *  subject-specific teaching content (feedback_generic_prompts). */
export function buildContentVarietyDirective(seen: PlanContentSeen | undefined): string {
  if (!seen) return '';
  const slots: Array<[string, string[]]> = [
    ['hooks / openers', seen.hooks],
    ['worked-example contexts', seen.examples],
    ['practice problems', seen.problems],
  ];
  const shown = slots.filter(([, arr]) => arr.length > 0);
  if (shown.length === 0) return '';
  const lines: string[] = [
    ``,
    `<content_variety>`,
    `RETURNING STUDENT — this is a REPEAT of a plan they have already done. The hook script, worked-example, extension, and practice problems written in the segments above are the STANDARD version they have ALREADY experienced. Do NOT deliver those authored scripts this time. Instead invent FRESH equivalents — all teaching the SAME learning objectives, at the SAME difficulty, keeping the SAME vocabulary and targeting the SAME misconception in each check. Same skill, new clothing:`,
    `  • HOOK: a new opening story with different objects.`,
    `  • WORKED EXAMPLE: a different real-world context and different numbers.`,
    `  • PRACTICE PROBLEM (try-yourself): do NOT render the authored problem. Instead call generate_problem with anchorProblem set to the authored problem and difficulty "same" — the runtime returns a fresh, verified problem; quote its canonicalText verbatim. This keeps the answer-checking correct.`,
    `  • MISCONCEPTION CHECK: a new scenario that exposes the SAME misconception.`,
    `  • EXTENSION: a different challenge.`,
    `Do NOT reuse any of these already-seen fillings:`,
  ];
  for (const [label, arr] of shown) {
    lines.push(`  already seen (${label}): ${arr.map((s) => `"${s}"`).join(', ')}`);
  }
  lines.push(`</content_variety>`);
  return lines.join('\n');
}

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
  // Task C1 (pedagogy): plan-as-seed framing by session mode. Rendered
  // ONLY when ctx.sessionMode is present (client sets it only under
  // NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER) — absent ⇒ empty array ⇒ output
  // byte-identical to the pre-C1 block. The prerequisite-seeding hint is
  // a pedagogy-METHOD example (allowed per feedback_generic_prompts);
  // do not add topic-specific TEACHING examples here.
  const prerequisiteHint = `To meet a student below the topic, step down to the nearest prerequisite (use the plan's prerequisites and the taxonomy as hints) and build up — e.g. multiply two linear factors before naming it a quadratic.`;
  const planFraming =
    ctx.sessionMode === 'subscribed'
      ? [
          ``,
          `This plan is a seed, not a script. You may reorder, compress what they already show they know, detour through a prerequisite, swap in an example themed to their interests, or explain a different way — freely. But the plan's learning objectives are your coverage contract: by the end, each core LO must be genuinely taught or demonstrated, because that is how progress is recorded. Freedom over the *path*; faithfulness to the *destination*.`,
          prerequisiteHint,
          // Task C2: confirm directive — pairs with the client-side
          // completion gate (completion-gate.ts): compressing is welcome,
          // but a mark without a demonstrated attempt records nothing.
          `Never skip a to-be-learned objective on a student's say-so. If they claim they already know it, confirm fast — one quick problem — then move on. Going fast is fine; marking something learned without seeing it is not.`,
        ]
      : ctx.sessionMode === 'demo'
        ? [
            ``,
            `This plan is raw material only — no obligation to cover it. Spend the time on whatever teaches this student best and shows what great teaching feels like.`,
            prerequisiteHint,
            // Task E2 (pedagogy): soft conversion close — demo sessions
            // only, session-wide (rides the same sessionMode gate as the
            // raw-material framing, so flag-off / subscribed output is
            // untouched). The quoted banned examples are kept aligned with
            // the harness gate's BANNED_SELL_PHRASES list
            // (scripts/tutor/pedagogy-harness/assertions.ts) — this text is
            // PROMPT-side and never spoken; the gate scans tutor SPEECH.
            `When the session winds down, close warm and in-character — land the learning, celebrate the win, say a real goodbye. NEVER pitch, upsell, or steer toward signing up — no "sign up", "subscribe", "upgrade", "unlock", no pricing talk. If the student explicitly asks how to continue or get more sessions, answer plainly and briefly, then hand off — the page around you owns that conversation.`,
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
    ...planFraming,
    ...(ctx.contentVariety ? [buildContentVarietyDirective(ctx.contentVariety)].filter(Boolean) : []),
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
      ' against your memory of the script.' +
      ' EXCEPTION: if the student has stated their OWN concrete problem to' +
      ' work (their own values or expression), teach the student\'s problem —' +
      ' render and narrate THEIR numbers and derive the answer yourself —' +
      ' rather than problemText. The authored problem is the default example,' +
      ' not a mandate when the student brought their own. Apply the segment\'s' +
      ' method to the student\'s problem, then continue the plan normally.',
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
 * Phase-3 live rounds (2026-07-23, sessions -1784766708920 / -1784768779243):
 * short answers kept drawing reflexive praise-openers ("Right. 6 m/s²."
 * right after the student said "5") even with the system-prompt HARD RULE —
 * several consecutive legitimately-praised turns build in-context momentum
 * that outweighs a rule ~1400 lines back in the cached prefix. When the
 * student's utterance reads as a SHORT ANSWER (a bare number, an option
 * letter, ≤2 words, or ≤4 words containing a number), pin a compact verdict
 * guard DIRECTLY above <student_said>, where salience is highest. '' for
 * conversational turns — the block must never dilute normal dialogue.
 * Exported for scripts/test-verdict-guard.ts.
 */
export function formatVerdictGuardBlock(transcript: string): string {
  const t = (transcript ?? '').trim();
  // Bracketed context injections (student marks, validator feedback,
  // kill-bridge) are not spoken answers.
  if (!t || t.startsWith('[')) return '';
  const words = t.split(/\s+/);
  const hasNumber = /\d/.test(t);
  const bareOption = /^[a-eA-E][.)!?]?$/.test(t);
  const isShortAnswer = bareOption || (words.length <= 2) || (words.length <= 4 && hasNumber);
  if (!isShortAnswer) return '';
  return '<verdict_guard>\n'
    + 'The utterance below reads as a short ANSWER. Before your first word, silently check it against the question you actually asked. '
    + 'Open with praise ("Right." / "Exactly." / "Nice.") ONLY if it is correct or equivalent. '
    + 'If it is wrong: corrective opener ("Not quite." / "Close.") and do NOT state the correct value — guide them to it. '
    + 'If it does not parse as an answer to your question: NO verdict word — say what you heard and re-ask. '
    + 'Never praise first and correct after.\n'
    + '</verdict_guard>\n\n';
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
export function formatPacePreferenceBlock(state: BrainTurnInput['pacingState']): string {
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
  // Task W3 potency rewrite: the pre-W3 guidance ("break into smaller
  // chunks", "add a brief comprehension check") was soft, non-checkable
  // prose that reliably lost to strong segment_truth/lesson_plan mandates
  // stated elsewhere in the turn. Replaced with directive, checkable rules
  // a grader could verify turn-by-turn. -2 strengthens -1 further (two-
  // sentence cap + mandatory recall-back, not just "pause more"). Positive
  // bias gets a symmetric-but-lighter version (less depth should read as
  // "trim", not "rush past comprehension entirely" at mag 1).
  // Task W5: the Absorption rule (system-prompt-builder.ts, near Precision)
  // now owns the concrete dense-board-item pause/memory-worthiness/recall-
  // back mechanics. Negative bias here cross-references it rather than
  // re-deriving pause behavior — the two rules previously risked drifting
  // (this block's "pause and give the student a beat" vs. the Absorption
  // rule's structured hand-off) since W3 landed before W5 was written.
  let guidance: string;
  if (bias === -1) {
    guidance = `student wants MORE depth and a slower pace. Cap this turn to ONE new idea — do not bundle a second concept in. Increase absorption pauses per the Absorption rule — treat more board items as worth a full stop-and-hand-off, not just the clearly dense ones. Ask exactly one short check-in question before introducing anything new — but on a dense-render turn, the Absorption rule's no-question hand-off wins: the check-in question waits for the next turn, it does not get bundled into the render turn.`;
  } else if (bias <= -2) {
    guidance = `student wants MORE depth and a much slower pace (strong). Keep every spoken turn to two sentences or fewer. Increase absorption pauses per the Absorption rule — raise the recall-back rate above the default one-in-three toward closer to every dense, memorize-worthy item. Before introducing ANY new idea, require the student to recall or restate the prior point in their own words — do not proceed to a second new idea until that recall lands. Comprehension checks are mandatory here, not optional.`;
  } else if (bias === 1) {
    guidance = `student wants LESS depth and a faster pace. Trim explanations to the essential line — skip restating facts already established this session. Move to the next step unless the student flags confusion; don't insert a comprehension check just to be safe.`;
  } else {
    guidance = `student wants LESS depth and a much faster pace (strong). Assume prior steps landed after one pass — do not re-explain them. Compress worked examples to their final form, skipping intermediate restatements. Skip comprehension checks entirely unless the student explicitly stalls or answers incorrectly.`;
  }
  return (
    `<pace_preference>\n` +
    `bias: ${bias} (${sign}, ${mag})\n` +
    (sinceLine ? `${sinceLine}\n` : '') +
    `guidance: ${guidance}\n` +
    `</pace_preference>\n\n`
  );
}

/** #7 hybrid (2026-07-17): standing difficulty preference block. Sibling of
 *  formatPacePreferenceBlock (same pacingState input, same omit-when-neutral
 *  contract) but deliberately a SEPARATE block: a difficulty-only preference
 *  must render even when paceBias is 0, and the pace block's pinned
 *  invariants (bias 0 → empty) stay untouched. Exported for
 *  test-pace-preference-block.ts. */
export function formatDifficultyPreferenceBlock(state: BrainTurnInput['pacingState']): string {
  if (!state) return '';
  const bias = state.difficultyBias ?? 0;
  if (bias === 0) return '';
  const label = bias < 0 ? 'easier' : bias === 1 ? 'harder' : 'much harder';
  const genDifficulty = bias < 0 ? 'slightly_easier' : bias === 1 ? 'slightly_harder' : 'much_harder';
  return (
    `<difficulty_preference>\n` +
    `bias: ${bias} (${label})\n` +
    `The student set a STANDING difficulty preference via the session controls. It applies to every upcoming problem until they change it — they should never have to re-ask. ` +
    `When you call generate_problem, pass difficulty: "${genDifficulty}" — unless the student's CURRENT utterance explicitly asks for a different level, in which case the explicit in-the-moment ask wins for that one problem. ` +
    `When choosing among authored segment problems or improvising, bias the pick the same direction. ` +
    `Do NOT abandon or replace a problem the student is mid-attempt on because of this preference — it governs the NEXT problem onward. ` +
    `A "harder one" must be a genuinely NEW problem (generate_problem, or a fresh improvisation) — NEVER re-present an equation or problem already on the board as if it were the next problem; the runtime dedups the render silently and the student sees you asking about content they already solved.\n` +
    `</difficulty_preference>\n\n`
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

// Exported for scripts/test-active-problem-block.ts (same pattern as
// formatPracticeSessionBlock — testable without running a brain turn).
export function formatActiveProblemBlock(active: BrainTurnInput['activeProblem']): string {
  if (!active?.statement) return '';
  // Student-brought problem: the student stated their OWN concrete problem to
  // work. Teach THEIRS via show_problem (segment_truth is suppressed this turn,
  // so there's no authored mandate competing). Crucially NOT the "verify
  // against THIS only" framing used for generate_problem — that tunnels the
  // brain onto a single problem and skips a segment's other objectives (e.g. a
  // multi-part goal). Instead: teach their problem, then keep covering the
  // segment's remaining objectives.
  if (active.source === 'student') {
    return (
      `<active_problem>\n` +
      `The student brought THIS problem themselves — it is what they asked to work on. ` +
      `Render and narrate THEIR numbers/expression via show_problem (NOT the authored segment card; do not substitute different values), apply the current lesson's method, and derive the answer yourself — declare it via the expectedAnswer field on WHICHEVER card you render it with (show_problem preferred; show_equation also accepts it) so the runtime can verify it. ` +
      `This is the example to teach with — it does NOT replace the segment's learning objectives: once it is solved, keep going with the segment's remaining objectives and any follow-up the student raises, then advance normally. Do not tunnel on this single problem if the lesson has more to cover.\n\n` +
      `Statement: ${active.statement}\n` +
      (active.expectedAnswer
        // Round-17: an expectedAnswer here is ALWAYS runtime-verified (the
        // only writers are the pipeline and the blind-solve check) — safe
        // to trust for a student-brought problem too.
        ? `\nVERIFIED expected answer (your earlier derivation, independently confirmed by the runtime's blind solve): ${active.expectedAnswer}\n` +
          `Check the student's attempts against THIS — do not re-derive mid-conversation, and if your working starts disagreeing with it, TRUST THIS and re-check your working. Never reveal it before the student has genuinely attempted or given up.\n`
        : '') +
      `</active_problem>\n\n`
    );
  }
  // Try-yourself card (live round 5, 2026-07-23): the student is looking at
  // a card YOU authored, with an input box scored against your declared
  // expectedAnswer. The session-1784778855564 failure: the brain lost the
  // card's numbers, put up a REPLACEMENT problem with different values, and
  // graded the student's correct card answer as wrong. Anchor hard on the
  // card's own statement + declared answer.
  if (active.source === 'card') {
    return (
      `<active_problem>\n` +
      `The student is answering the try-yourself card currently on the board — a card YOU authored. Its statement and expected answer are below. ` +
      `A spoken or typed answer from the student refers to THIS card. Grade against the declared expected answer — the card's own auto-scorer uses exactly it, so your spoken verdict must agree with it. ` +
      `Do NOT pose a different problem or change the numbers while this card is active; if you want a fresh problem, say so explicitly and render a new card first.\n\n` +
      `Statement: ${active.statement}\n` +
      (active.expectedAnswer
        ? `\nExpected answer (declared on the card; the typed-submit auto-scorer grades against it): ${active.expectedAnswer}\n` +
          `Check the student's attempts against THIS. If your own re-derivation disagrees, re-check your working before saying anything — and never reveal it before the student has genuinely attempted or given up.\n`
        : '') +
      `</active_problem>\n\n`
    );
  }
  return (
    `<active_problem>\n` +
    `This is the problem the student is currently working on. Verify their answers — and any narration that references "the problem" / numbers / data — against THIS statement only. ` +
    `Earlier problem cards may still be visible in <whiteboard_state> (the runtime keeps them for scroll-back); ignore them when reasoning about the current attempt. ` +
    `If you called generate_problem this session, the canonicalText that came back IS the active problem; the anchor problem you passed in was calibration only and is no longer the focus.\n\n` +
    `Statement: ${active.statement}\n` +
    (active.expectedAnswer
      ? `\nVERIFIED expected answer (from the problem pipeline's independent solve): ${active.expectedAnswer}\n` +
        `Check the student's attempts against THIS. Do not re-derive the answer from scratch mid-conversation — long verification threads are where dropped factors and sign slips creep in. If your own working disagrees with this answer, TRUST THIS and re-check your working before saying anything. Never reveal it before the student has genuinely attempted or given up.\n`
      : '') +
    `</active_problem>\n\n`
  );
}

/**
 * Render the `<demo_stop>` block (Task E1 — budget-aware satisfying stop,
 * demo sessions only). Empty string when input is absent — the flag-off /
 * subscribed-session guarantee: `userContent` composition concatenates this
 * result, so '' leaves the prompt byte-identical.
 *
 * Exported for the standalone unit suite (scripts/test-demo-stop.ts) so the
 * block text is testable without running a whole brain turn.
 */
export function formatDemoStopBlock(input: BrainTurnInput['demoStop']): string {
  if (!input) return '';
  let body: string;
  if (input.mode === 'time') {
    // Graceful wrap phase: once we cross the wrap threshold (set only for a
    // real time-boxed demo), swap the pacing text for an explicit "land it and
    // close" directive so the tutor doesn't open new material with the clock
    // almost out. Below the threshold (or when it's absent) keep the
    // pre-existing pacing text byte-for-byte.
    const inWrap =
      typeof input.wrapAtMinutes === 'number' && input.minutesElapsed >= input.wrapAtMinutes;
    body = inWrap
      ? `Wrap up NOW: land the "I get it" moment if it hasn't landed yet, then summarize what they learned in 1-2 turns and end on an encouraging note. Do not start new material or open a new example — time is almost up.`
      : `You have about ${Math.max(0, input.budgetMinutes - input.minutesElapsed)} of ${input.budgetMinutes} minutes left with this student. Pace so they reach one genuine "I get it now" moment AND a clean stopping point before time runs out — never end mid-concept or mid-example. Show what great teaching feels like through the RIGHT visual and by adapting when they're confused, not by drawing extra pictures.`;
  } else {
    body = `This trial session's win must land ON completing the first concept: pace toward one genuinely-earned "I get it now" moment that completes a concept — the session's value is boxed to that moment; never end mid-concept.`;
  }
  return `<demo_stop>\n${body}\n</demo_stop>\n\n`;
}

/**
 * Practice-mode contract (Task X2). Renders the durable `<practice_session>`
 * block when the session is a practice session, else ''. Placed in the
 * governing "how to teach" tier AHEAD of <lesson_plan>/<segment_truth> (same
 * ordering rationale as pace_preference — see the W3 note in the turn
 * assemblers) so it out-competes the authored "teach concept X" mandates
 * that otherwise pull a practice session back into concept-review (the
 * observed drift: a 'concept-review'-goal session did new-concept teaching
 * even after the student asked for practice, and reverted fully on resume).
 *
 * Exported for the standalone probe (scripts/test-practice-session-block.ts)
 * so the block text is testable without running a whole brain turn.
 */
export function formatPracticeSessionBlock(practiceMode?: boolean): string {
  if (!practiceMode) return '';
  const body =
    `This is a PRACTICE session — the student is here to DO problems, not to be lectured. Hold this for the WHOLE session; it governs every turn.\n` +
    `- Every segment runs as: problem → student attempt → targeted feedback → next problem. LEAD with a problem, not an explanation.\n` +
    `- NO new-concept teaching. Do not deliver theory lectures or step-by-step worked-example walkthroughs of material they haven't attempted. If <lesson_plan> or <segment_truth> mandates teaching a new concept, DEMOTE that mandate: turn the concept into a problem for the student to attempt instead of explaining it yourself.\n` +
    `- Brief prerequisite remediation IS allowed — but only when a gap is actively blocking the current problem. Keep it to a quick recall check or a one-line reminder (a turn or two at most), then go straight back to a problem. Never let remediation expand into a full re-teach.\n` +
    `- Target problems at where the student is shaky. After each attempt give short, specific feedback, then move to the next problem.\n` +
    `- Keep feedback TIGHT: at most 2 short sentences between problems — the verdict plus one targeted note. No analogies, no metaphors, no "like a band where…" color, no pattern-history recaps of what they did three problems ago. Humor stays out of the way here. The student came to DO problems; every sentence of yours that isn't a problem or a verdict is friction. Get the next problem up promptly.\n` +
    `- ANSWER the student's questions — always. A direct question from the student ("what do you mean by X?", "why does that work?") is NEVER "lecturing" and is NOT friction: answer it plainly and completely first, then return to problems. Deflecting a genuine question back to "let's stick with the problems" is a failure — a real student asked twice what a phrase meant and was deflected both times. The no-lecture rule bans UNREQUESTED theory, not requested explanations.`;
  return `<practice_session>\n${body}\n</practice_session>\n\n`;
}

/** Task WS3: durable mock-review mandate — the student just finished a
 *  full-length mock and is here to review their missed questions. Exported
 *  for mock-review-block.test.ts. */
export function formatMockReviewBlock(ctx?: MockReviewContext): string {
  if (!ctx) return '';
  const items = ctx.focusItems.map((it, i) => {
    const lines = [
      `Item ${i + 1} (${it.sectionLabel}, Q${it.qNum}${it.loId ? `, ${it.loId}` : ''}):`,
      it.passageExcerpt ? `Stimulus: ${it.passageExcerpt}` : '',
      `Question: ${it.problemText}`,
      it.choices?.length ? `Choices: ${it.choices.map((c, j) => `${'ABCD'[j]}. ${c}`).join(' | ')}` : '',
      `Student answered: ${it.studentAnswer}`,
      it.correctAnswer ? `Correct answer: ${it.correctAnswer}` : '',
      it.solutionText ? `Solution: ${it.solutionText}` : '',
      it.frqFeedback?.length
        ? `Rubric feedback: ${it.frqFeedback.map((p) => `${p.criterionId} ${p.pointsAwarded}/${p.maxPoints} — ${p.feedback}`).join('; ')}`
        : '',
    ].filter(Boolean);
    return lines.join('\n');
  }).join('\n\n');

  const remainder = ctx.remainingMissSummary.length
    ? `\nBeyond these, the student also missed: ${ctx.remainingMissSummary.map((s) => `${s.missed} in ${s.unitLabel}`).join(', ')}.`
    : '';

  // When the student just picked item(s) from their on-screen review agenda,
  // the pinned focus items lead the list (Items 1..pinnedCount). Tell the brain
  // a selection happened so it starts working immediately instead of asking
  // "which question did you mean?".
  const pinnedDirective = ctx.pinnedCount > 0
    ? `IMPORTANT: the student just SELECTED Item 1${ctx.pinnedCount > 1 ? `–${ctx.pinnedCount}` : ''} from their on-screen review agenda. Do NOT ask which question they meant — begin working on Item 1 immediately.\n`
    : '';

  const body =
    pinnedDirective +
    `This is a MOCK-EXAM REVIEW session. The student just completed "${ctx.formLabel}" and scored ${ctx.composite} / ${ctx.compositeMax}. They missed ${ctx.totalMissed} question(s); the highest-value ones are listed below with their answers. Hold this agenda for the WHOLE session.\n` +
    `- Open by briefly acknowledging the score (one sentence, encouraging, no lecture), then recommend starting with Item 1 — but let the student pick any listed item or ask about something else from the exam.\n` +
    `- For each item: have the student re-attempt or explain their thinking FIRST, then re-teach the underlying concept, and only then connect it to the specific wrong answer. Never just read out the correct answer.\n` +
    `- Work ONE item at a time; never dump all the items at once or enumerate the whole list unprompted.\n` +
    `- The answer key below is for YOUR eyes — reveal an item's correct answer only after the student has engaged with it.${remainder}\n\n` +
    items;
  return `<mock_review>\n${body}\n</mock_review>\n\n`;
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
  // Pedagogy opener: per-turn opening-phase directive (see BrainTurnInput
  // doc). Placed ahead of the lesson blocks — it governs HOW this turn
  // opens/calibrates before the plan mandates kick in.
  const openingDirectiveBlock = input.openingDirective
    ? `<opening_directive>\n${input.openingDirective}\n</opening_directive>\n\n` : '';
  const studentMarksBlock = input.studentMarks
    ? `<student_marks>\n${input.studentMarks}\n</student_marks>\n\n` : '';
  // Teacher-persona mid-session style salience: '' when absent.
  const styleReminderBlock = input.styleReminder
    ? `<teacher_style>\n${input.styleReminder}\n</teacher_style>\n\n` : '';
  // Task E1 (pedagogy): demo-only budget-aware stop directive. '' when absent.
  const demoStopBlock = formatDemoStopBlock(input.demoStop);
  // Task X2: durable practice-mode mandate. '' when not a practice session.
  const practiceSessionBlock = formatPracticeSessionBlock(input.practiceMode);
  if (practiceSessionBlock) {
    console.log('[practice-mode] practice_session block attached');
  }
  // Task WS3: durable mock-review mandate. '' when not a mock-review session.
  const mockReviewBlock = formatMockReviewBlock(input.mockReview);
  if (mockReviewBlock) {
    console.log('[mock-review] mock_review block attached');
  }
  const lessonBlock = input.lessonPlanContext
    ? `<lesson_plan>\n${formatLessonPlanContext(input.lessonPlanContext)}\n</lesson_plan>\n\n`
    : '';
  const truthBody = input.lessonPlanContext
    ? formatSegmentTruth(input.lessonPlanContext.currentSegment)
    : '';
  // A student-brought problem suppresses the authored segment_truth mandate for
  // this turn — otherwise it competes with <active_problem> and the brain
  // anchors to the authored example (see formatActiveProblemBlock).
  const truthBlock = (truthBody && input.activeProblem?.source !== 'student')
    ? `<segment_truth>\n${truthBody}\n</segment_truth>\n\n` : '';
  const activeProblemBlock = formatActiveProblemBlock(input.activeProblem);
  const unrealizedMarksBlock = formatUnrealizedMarksBlock(input.unrealizedMarks);
  const deduplicatedShowsBlock = formatDeduplicatedShowsBlock(input.deduplicatedShows);
  const { block: studentStateBlock, hint: pacingHint } = formatStudentStateBlock(input.pacingState);
  if (pacingHint) {
    console.log(`[pacing] hint-rendered hint="${pacingHint}"`);
  }
  const pacePreferenceBlock = formatPacePreferenceBlock(input.pacingState);
  const difficultyPreferenceBlock = formatDifficultyPreferenceBlock(input.pacingState);
  if (pacePreferenceBlock) {
    console.log(`[pacing] pace-preference-rendered bias=${input.pacingState?.paceBias}`);
  }
  const topicNotesBlock = formatTopicNotesStateBlock(input.topicNotesState);
  // Task W3: pace_preference promoted ABOVE lessonBlock/truthBlock (the
  // "competing segment blocks" the W3 investigation identified as out-
  // competing a mild/soft pace directive). It now reads as a governing
  // how-to-teach directive stated ahead of the what-to-teach mandates,
  // alongside styleReminderBlock/demoStopBlock which occupy the same
  // "how" tier. Previously it sat near the end of userContent, after
  // truthBlock — this is the ordering-effect change; verified via the
  // node probe in scripts/ (see task-W3-report.md).
  const verdictGuardBlock = formatVerdictGuardBlock(input.studentTranscript);
  if (verdictGuardBlock) console.log('[verdict-guard] short-answer guard attached');
  const userContent =
    profileBlock +
    openingDirectiveBlock +
    studentMarksBlock +
    styleReminderBlock +
    demoStopBlock +
    practiceSessionBlock +
    mockReviewBlock +
    pacePreferenceBlock +
    difficultyPreferenceBlock +
    lessonBlock +
    truthBlock +
    activeProblemBlock +
    unrealizedMarksBlock +
    deduplicatedShowsBlock +
    studentStateBlock +
    topicNotesBlock +
    `<whiteboard_state>\n${whiteboardSummary}\n</whiteboard_state>\n\n` +
    verdictGuardBlock +
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
      thinking: { type: 'disabled' as const },
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
    // C1: transcript storage must match what the SentenceBuffer voiced —
    // repair terminator-glued sentences here too.
    text: normalizeSentenceSpacing(accumulatedText.trim()),
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
  // Pedagogy opener: per-turn opening-phase directive (see BrainTurnInput
  // doc). Placed ahead of the lesson blocks — it governs HOW this turn
  // opens/calibrates before the plan mandates kick in.
  const openingDirectiveBlock = input.openingDirective
    ? `<opening_directive>\n${input.openingDirective}\n</opening_directive>\n\n` : '';
  const studentMarksBlock = input.studentMarks
    ? `<student_marks>\n${input.studentMarks}\n</student_marks>\n\n` : '';
  // Teacher-persona mid-session style salience: '' when absent.
  const styleReminderBlock = input.styleReminder
    ? `<teacher_style>\n${input.styleReminder}\n</teacher_style>\n\n` : '';
  // Task E1 (pedagogy): demo-only budget-aware stop directive. '' when absent.
  const demoStopBlock = formatDemoStopBlock(input.demoStop);
  // Task X2: durable practice-mode mandate. '' when not a practice session.
  const practiceSessionBlock = formatPracticeSessionBlock(input.practiceMode);
  if (practiceSessionBlock) {
    console.log('[practice-mode] practice_session block attached');
  }
  // Task WS3: durable mock-review mandate. '' when not a mock-review session.
  const mockReviewBlock = formatMockReviewBlock(input.mockReview);
  if (mockReviewBlock) {
    console.log('[mock-review] mock_review block attached');
  }
  const lessonBlock = input.lessonPlanContext
    ? `<lesson_plan>\n${formatLessonPlanContext(input.lessonPlanContext)}\n</lesson_plan>\n\n`
    : '';
  const truthBody = input.lessonPlanContext
    ? formatSegmentTruth(input.lessonPlanContext.currentSegment)
    : '';
  // A student-brought problem suppresses the authored segment_truth mandate for
  // this turn — otherwise it competes with <active_problem> and the brain
  // anchors to the authored example (see formatActiveProblemBlock).
  const truthBlock = (truthBody && input.activeProblem?.source !== 'student')
    ? `<segment_truth>\n${truthBody}\n</segment_truth>\n\n` : '';
  const activeProblemBlock = formatActiveProblemBlock(input.activeProblem);
  const unrealizedMarksBlock = formatUnrealizedMarksBlock(input.unrealizedMarks);
  const deduplicatedShowsBlock = formatDeduplicatedShowsBlock(input.deduplicatedShows);
  const { block: studentStateBlock, hint: pacingHint } = formatStudentStateBlock(input.pacingState);
  if (pacingHint) {
    console.log(`[pacing] hint-rendered hint="${pacingHint}"`);
  }
  const pacePreferenceBlock = formatPacePreferenceBlock(input.pacingState);
  const difficultyPreferenceBlock = formatDifficultyPreferenceBlock(input.pacingState);
  if (pacePreferenceBlock) {
    console.log(`[pacing] pace-preference-rendered bias=${input.pacingState?.paceBias}`);
  }
  const topicNotesBlock = formatTopicNotesStateBlock(input.topicNotesState);
  // Task W3: same ordering change as runBrainTurn above — pace_preference
  // moved ahead of lessonBlock/truthBlock. Both twins must stay in lockstep
  // (see buildBrainMessages doc comment on cache-behavior consistency).
  const verdictGuardBlock = formatVerdictGuardBlock(input.studentTranscript);
  if (verdictGuardBlock) console.log('[verdict-guard] short-answer guard attached');
  const userContent =
    profileBlock +
    openingDirectiveBlock +
    studentMarksBlock +
    styleReminderBlock +
    demoStopBlock +
    practiceSessionBlock +
    mockReviewBlock +
    pacePreferenceBlock +
    difficultyPreferenceBlock +
    lessonBlock +
    truthBlock +
    activeProblemBlock +
    unrealizedMarksBlock +
    deduplicatedShowsBlock +
    studentStateBlock +
    topicNotesBlock +
    `<whiteboard_state>\n${whiteboardSummary}\n</whiteboard_state>\n\n` +
    verdictGuardBlock +
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
      thinking: { type: 'disabled' as const },
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
        max_tokens: 350, // was 250 — Sonnet 5 tokenizer headroom (see DEFAULT_MAX_TOKENS)
        thinking: { type: 'disabled' as const },
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
    // C1: keep transcript text consistent with the repaired sentences.
    fullText: normalizeSentenceSpacing(accumulatedText.trim()),
    toolCalls: accumulatedToolCalls,
  };
}
