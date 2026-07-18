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
import {
  resolveToolSubjects,
  filterToolsForSubject,
  type ToolFilterResult,
} from '@/lib/tutor/ai/tool-subject-taxonomy';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import {
  generateProblem,
  type Difficulty,
} from '@/lib/tutor/voice/problem-generator';
import { TUTOR_CONTENT_VARIETY } from '@/lib/tutor/orchestrator/flags';
import { searchImage } from '@/lib/tutor/image-search';
import { classifyBrainError, decideBrainRetry, withInactivityTimeout } from '@/lib/tutor/voice/brain-retry';

/** Task X10: max whole-turn retries the route performs on a transient /
 *  overloaded failure that produced ZERO content. Sits on top of the SDK
 *  client's own 2 fast retries (see brain-retry.ts). 2 ⇒ up to 3 attempts. */
const MAX_TURN_RETRIES = 2;

/** Round-23: inter-event inactivity ceiling for a brain turn. Observed
 *  2026-07-18 (session portal-6b84012b): the model stream went quiet ~55s
 *  between sentences (server total=62578ms, retries=0) without throwing,
 *  leaving the student in dead air no retry tier could see. Legitimate
 *  inter-event gaps sit far below this: first_sentence ≤ ~7s across the
 *  session's other turns, tool-result generation ≤ ~10s. */
const BRAIN_EVENT_STALL_MS = 30_000;

export const runtime = 'nodejs';

interface BrainStreamRequestBody {
  systemPrompt: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  studentTranscript: string;
  whiteboardSnapshot: BrainTurnInput['whiteboardSnapshot'];
  /** Full-board page list for the Board Map (project_tutor_board_map_design).
   *  Presence drives page-grouped rendering of the whiteboard summary. */
  whiteboardPages?: BrainTurnInput['whiteboardPages'];
  /** Active lesson plan context, when the session is plan-driven. */
  lessonPlanContext?: BrainTurnInput['lessonPlanContext'];
  /** Pre-rendered student profile block (cross-session memory). */
  studentProfileBlock?: string;
  /** Pedagogy opener (NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER): per-turn
   *  opening-phase directive; present only while the client's opening
   *  phase is active. Surfaces as `<opening_directive>` in the user
   *  content. See BrainTurnInput.openingDirective. */
  openingDirective?: string;
  /** Student whiteboard marks block body (tap-to-point). Clamped ≤2000
   *  chars. See BrainTurnInput.studentMarks. */
  studentMarks?: string;
  /** Teacher-persona mid-session style salience
   *  (NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER): compact per-turn style reminder,
   *  attached only AFTER the opening directive retires. Surfaces as
   *  `<teacher_style>` in the user content. See BrainTurnInput.styleReminder. */
  styleReminder?: string;
  /** Task E1 (pedagogy, NEXT_PUBLIC_TUTOR_PEDAGOGY_OPENER): budget-aware
   *  satisfying stop for DEMO sessions. Bounds-checked below (mode enum,
   *  finite non-negative numbers) — anything malformed collapses to
   *  undefined so a bad client can never inject an arbitrary blob.
   *  See BrainTurnInput.demoStop. */
  demoStop?: BrainTurnInput['demoStop'];
  /** Practice-mode contract (Task X2). Client sends true when the session's
   *  embed token carried session_goal === 'practice'. Surfaces as the durable
   *  `<practice_session>` block. See BrainTurnInput.practiceMode. */
  practiceMode?: boolean;
  /** Configured grade — drives pedagogy pacing knobs. */
  grade?: string;
  /** Configured session subject (UI `selectedSubject`). Used ONLY by the
   *  Lever A tools-array filter (TUTOR_TOOL_SUBJECT_FILTER). Immutable for
   *  a running session ⇒ the filtered tools array is byte-stable ⇒
   *  prefix cache safe. A future mid-session subject change must make the
   *  client STOP sending this (⇒ sticky fail open). See
   *  project_lever_a_tools_filter.md. */
  subject?: string;
  model?: string;
  maxTokens?: number;
  /** Adaptive-pacing v1: bank IDs + brain-gen problem-text hashes
   *  already shown this session, used as exclusion filters when the
   *  brain calls `generate_problem`. The client maintains this list
   *  in session-scoped refs and sends it on every brain turn so the
   *  resolver can dedup. */
  shownProblemIds?: string[];
  shownProblemHashes?: string[];
  /** Most-recently-rendered problem statement (from the client's
   *  currentProblemRef). Surfaced to the brain as a dedicated
   *  `<active_problem>` block so it anchors verification on this exact
   *  text rather than on stale cards still visible in the snapshot. See
   *  BrainTurnInput.activeProblem for the catastrophe this addresses. */
  activeProblem?: BrainTurnInput['activeProblem'];
  /** Whiteboard markup Phase 1 (audit 2026-05-13): failed tutor_scribble
   *  targets from the prior turn that the orchestrator silently dropped.
   *  Surfaces to the brain as `<unrealized_marks>` advisory. See
   *  BrainTurnInput.unrealizedMarks. */
  unrealizedMarks?: BrainTurnInput['unrealizedMarks'];
  /** Whiteboard markup Phase 1: show_* tool calls collapsed by
   *  cross-turn dedup last turn. Surfaces as `<deduplicated_renders>`
   *  advisory so the brain knows its re-emission did not land. See
   *  BrainTurnInput.deduplicatedShows. */
  deduplicatedShows?: BrainTurnInput['deduplicatedShows'];
  /** Pacing v2 — Phase 1 (inert) student-state snapshot. See
   *  BrainTurnInput.pacingState for shape; the brain formatter omits
   *  the block entirely when nothing is interesting. */
  pacingState?: BrainTurnInput['pacingState'];
  /** Topic-notes orchestrator state. Surfaces as `<topic_notes_state>`
   *  block in the brain prompt so the brain knows whether tools are
   *  eligible (warmup cleared) and how much budget remains per bucket. */
  topicNotesState?: BrainTurnInput['topicNotesState'];
  /** Pacing v2 telemetry — events buffered on the client since the
   *  previous brain call. Each line is already-formatted ("[pacing]
   *  streak-correct seg=… count=…"). The route emits each as its own
   *  console.log so they appear in serverlog_*.txt for grep-based
   *  verification. Browser console.log doesn't reach the server log
   *  reliably, so the client mirrors every pacing event into this
   *  buffer at emit time and we drain it here. */
  pacingTelemetry?: string[];
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
  shownProblemHashes: string[],
  // 2026-07-17: lets the route surface a resolved generate_problem to the
  // CLIENT as a 'generated-problem' SSE event, so the client can pin the
  // verified expectedAnswer into later turns' <active_problem> block.
  onGeneratedProblem?: (p: { statement: string; expectedAnswer?: string }) => void,
  // #7 hybrid (2026-07-17): standing difficulty preference from the session
  // controls (pacingState.difficultyBias). Deterministically upgrades a
  // brain-chosen difficulty of 'same' — the default it passes when the
  // student didn't verbally ask for a level — so the preference holds even
  // when the brain forgets the <difficulty_preference> block. An explicit
  // non-'same' choice (in-the-moment student ask) is honored untouched.
  difficultyBias?: number
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
      const isOffTopic = (s: { offTopic?: boolean }) => s.offTopic === true;
      let resolvedSegmentId: string | null = null;
      if (to === 'next') {
        // Skip off-topic segments. Mirrors resolveAdvanceTarget client-
        // side. If no on-topic segment remains after the current one,
        // treat as end-of-plan (resolvedSegmentId stays null).
        if (curIdx >= 0) {
          for (let j = curIdx + 1; j < segIdx.length; j++) {
            if (!isOffTopic(segIdx[j])) { resolvedSegmentId = segIdx[j].id; break; }
          }
        }
      } else if (to === 'previous') {
        if (curIdx > 0) {
          for (let j = curIdx - 1; j >= 0; j--) {
            if (!isOffTopic(segIdx[j])) { resolvedSegmentId = segIdx[j].id; break; }
          }
        }
      } else {
        const target = segIdx.find((s) => s.id === to);
        if (target && !isOffTopic(target)) resolvedSegmentId = target.id;
      }
      if (!resolvedSegmentId) {
        return JSON.stringify({
          error: 'advance_lesson_failed',
          message: to === 'next'
            ? 'Cannot advance — no more on-topic segments remain in the lesson plan. Do NOT pretend to advance. Preferred next move: keep the student engaged with more practice on the concepts already covered via generate_problem (difficulty="same" or "slightly_harder"). Only suggest wrap-up if the student has signaled they want to stop. DO NOT call show_segment_card or show_problem assuming a fresh segment is now active.'
            : `Cannot advance to "${to}" — that segment id is either not in this plan or is marked off-topic and cannot be entered. Either correct the id or call generate_problem to continue practice.`,
          currentSegmentId: ctx.currentSegmentId,
          segmentIndex: segIdx,
        });
      }
      // Ground the brain in the segment it ACTUALLY landed on. Without
      // this, the brain receives a bare "success" and may teach whatever
      // it thought "next" meant rather than what the orchestrator
      // resolved (observed 2026-05-12 bio session: Skip Ahead resolved
      // to lo-3-worked but brain taught LO-4 passive/active transport).
      const resolvedSeg = segIdx.find((s) => s.id === resolvedSegmentId);
      // Derive loId from the conventional "<loId>-<kind>" id pattern.
      // Falls back to null for curated plans / intro / picker ids.
      let loId: string | null = null;
      let loDescription: string | null = null;
      for (const lo of ctx.plan.los ?? []) {
        if (resolvedSegmentId.startsWith(`${lo.id}-`) || resolvedSegmentId === lo.id) {
          loId = lo.id;
          loDescription = lo.description;
          break;
        }
      }
      return JSON.stringify({
        ok: true,
        advancedTo: resolvedSegmentId,
        segmentKind: resolvedSeg?.kind ?? null,
        loId,
        loDescription,
        instruction: `You are now at segment "${resolvedSegmentId}" (kind: ${resolvedSeg?.kind ?? 'unknown'}${loDescription ? `, LO: "${loDescription}"` : ''}). Teach the content of THIS segment. Do not skip ahead further on your own — the next advance must come from another advance_lesson call or natural completion.`,
      });
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
    let difficulty = (args.difficulty as Difficulty) ?? 'same';
    if (difficulty === 'same' && typeof difficultyBias === 'number' && difficultyBias !== 0) {
      difficulty = difficultyBias < 0 ? 'slightly_easier' : difficultyBias === 1 ? 'slightly_harder' : 'much_harder';
      console.log(`[brain.stream:generate_problem] difficulty 'same' → '${difficulty}' (standing difficultyBias=${difficultyBias})`);
    }
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
        // Content variety (phase 2): enable verified Layer-2 brain-gen so
        // practice problems come out FRESH + verified regardless of the
        // per-topic brainGen ramp. Falls back to bank/authored on failure.
        forceBrainGen: TUTOR_CONTENT_VARIETY,
      });
      console.log('[brain.stream:generate_problem] telemetry:', JSON.stringify(telemetry));
      if (!result) {
        return JSON.stringify({
          error: 'no_problem_available',
          message: 'No problem could be sourced. Continue without injection.',
          telemetry,
        });
      }
      // Surface to the client so the expectedAnswer can ride every later
      // turn's <active_problem> block instead of decaying in an old
      // tool_result (the 2026-07-17 verification-drift fix).
      onGeneratedProblem?.({
        statement: result.canonicalText,
        expectedAnswer: result.expectedAnswer,
      });
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
  if (body.whiteboardPages !== undefined && !Array.isArray(body.whiteboardPages)) {
    return badRequest('whiteboardPages must be an array');
  }

  // Pacing v2 telemetry forwarding: drain the client's buffer to the
  // server log so grep on serverlog_*.txt finds [pacing] lines.
  if (body.pacingTelemetry && body.pacingTelemetry.length > 0) {
    for (const line of body.pacingTelemetry) {
      // Lines arrive already-prefixed with "[pacing] "; emit verbatim.
      console.log(line);
    }
  }

  // Pacing v2 — Phase 2 advisory gate. PACING_V2_ADVISORIES=false (or
  // 0) → strip the thresholds field so the brain prompt formatter
  // can't compute hint: lines (Phase 1-only mode for diagnostic
  // isolation if Phase 2 misbehaves). Default ON (any other value or
  // unset).
  const advisoriesEnabled = (() => {
    const v = process.env.PACING_V2_ADVISORIES;
    if (v === undefined || v === null || v === '') return true;
    const s = String(v).trim().toLowerCase();
    return s !== 'false' && s !== '0' && s !== 'off' && s !== 'no';
  })();
  if (!advisoriesEnabled && body.pacingState?.thresholds) {
    console.log(`[pacing] advisories-disabled (PACING_V2_ADVISORIES=${process.env.PACING_V2_ADVISORIES})`);
    body.pacingState = { ...body.pacingState, thresholds: undefined };
  }

  const encoder = new TextEncoder();
  const studentSnippet = body.studentTranscript.slice(0, 80);
  const startedAt = Date.now();

  // Humor-level diagnostic: scan the received system prompt for the
  // <humor level="X"> tag the system-prompt builder writes. Lets us
  // confirm the student's preference / partner cap actually reached
  // the brain without having to log the entire prompt. One line per
  // turn — cheap. Tag is "off" when humor is disabled, otherwise one
  // of light/medium/heavy.
  const humorMatch = body.systemPrompt.match(/<humor\s+level="(off|light|medium|heavy)"/);
  if (humorMatch) {
    console.log(`[humor] active=${humorMatch[1]}`);
  } else {
    console.log(`[humor] active=UNKNOWN (no <humor level=...> tag found in system prompt)`);
  }

  // show_labeled_image URL precheck (Fix B). Wikimedia thumb URLs and
  // other broken third-party CDNs cause the renderer's onError fallback
  // to show a text-only panel — student sees no actual image. We HEAD
  // the URL before forwarding the tool call to the client; if it's
  // unreachable, drop the SSE event entirely. The brain's agent loop
  // still gets a tool_result via toolResultProvider, so it doesn't hang.
  // 1500ms timeout caps worst-case latency on valid URLs.
  const validateImageUrl = async (url: string, timeoutMs = 1500): Promise<boolean> => {
    if (!url || typeof url !== 'string') return false;
    try { new URL(url); } catch { return false; }
    // Known-bad pattern shortcut: Wikimedia commons thumb URLs are
    // hotlink-blocked. Skip the network call.
    if (/^https?:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\//i.test(url)) {
      return false;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
      return res.ok || (res.status >= 200 && res.status < 400);
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  };

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
      // Task X10 — bounded-retry telemetry. `turnRetries` counts whole-turn
      // re-dispatches performed on transient/overloaded failures;
      // `gaveUp` marks a turn that exhausted retries (or hit a non-retryable
      // error) — distinct final-failure signals in the turn log line.
      let turnRetries = 0;
      let gaveUp = false;
      // Task X10 — egress count: incremented in send() for EVERY event type
      // forwarded to the client (sentence, tool-call, tool-rejected, pause).
      // Authoritative for the zero-egress retry guard: if emittedToClient > 0,
      // any retry would cause duplication.
      let emittedToClient = 0;

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
          // Increment egress counter on ALL event types send() forwards
          // (sentence, tool-call, tool-rejected, pause, done). Used by the
          // retry guard to detect: if any event reached the client, retrying
          // is unsafe. Note: pause alone is inert to user experience (just
          // timing), but tool-rejected is actionable (can be logged), and
          // done closes the stream, so all are part of the egress count.
          emittedToClient++;
        } catch (err) {
          clientGone = true;
          console.warn('[brain.stream] enqueue failed (client gone?):', err);
        }
      };

      // Lever A — flag-gated subject filter for the tools array (the
      // largest cached-prefix cost). Default OFF ⇒ pass WHITEBOARD_TOOLS
      // by reference, byte-identical to pre-Lever-A. Freestyle/pasted
      // plans + no-plan sessions ⇒ fail open (untrusted subject). The
      // log line is grep-able (one per turn) as the before/after harness.
      // See project_lever_a_tools_filter.md.
      let toolFilter: ToolFilterResult;
      if (process.env.TUTOR_TOOL_SUBJECT_FILTER !== 'true') {
        toolFilter = {
          tools: WHITEBOARD_TOOLS,
          mode: 'failopen',
          sent: WHITEBOARD_TOOLS.length,
          total: WHITEBOARD_TOOLS.length,
          excluded: [],
        };
      } else {
        const planId = body.lessonPlanContext?.plan?.id ?? '';
        const untrusted =
          !body.lessonPlanContext || planId.startsWith('freestyle-');
        toolFilter = filterToolsForSubject(
          WHITEBOARD_TOOLS,
          untrusted ? null : resolveToolSubjects(body.subject),
        );
      }
      console.log(
        `[toolfilter] flag=${process.env.TUTOR_TOOL_SUBJECT_FILTER === 'true' ? 'on' : 'off'} ` +
          `subject=${body.subject ?? ''} mode=${toolFilter.mode} ` +
          `sent=${toolFilter.sent}/${toolFilter.total}` +
          (toolFilter.excluded.length
            ? ` excluded=[${toolFilter.excluded.join(',')}]`
            : ''),
      );
      // Pedagogy opener: which turns carry the opening directive. The
      // directive must appear on the first few turns of a flag-ON session
      // and then STOP (advance_lesson or turn ceiling) — this line is how a
      // live run proves the retirement actually happened server-side.
      if (body.openingDirective) {
        console.log(`[opener] opening_directive attached (${String(body.openingDirective.length)} chars)`);
      }
      if (body.studentMarks) {
        console.log(`[student-marks] block attached (${String(body.studentMarks.length)} chars)`);
      }
      // Teacher-persona style salience: which turns carry the reminder.
      // Must be ABSENT while the opening directive rides and PRESENT on
      // every teacher-session turn after — this line is how a live run
      // proves the hand-off happened server-side.
      if (body.styleReminder) {
        console.log(`[teacher-style] style_reminder attached (${String(body.styleReminder.length)} chars)`);
      }
      // Task E1 (pedagogy): sanitize demoStop. Mode enum + finite,
      // non-negative numbers only; anything else ⇒ undefined (no block).
      // Grep-able one-liner per turn so a live run can prove the demo-only
      // gating + the elapsed clock actually reached the brain.
      const demoStop: BrainTurnInput['demoStop'] = (() => {
        const ds = body.demoStop;
        if (!ds || typeof ds !== 'object') return undefined;
        if (ds.mode === 'milestone') return { mode: 'milestone' as const };
        if (ds.mode === 'time') {
          const { budgetMinutes, minutesElapsed, wrapAtMinutes } = ds as {
            budgetMinutes?: unknown;
            minutesElapsed?: unknown;
            wrapAtMinutes?: unknown;
          };
          if (
            typeof budgetMinutes === 'number' && Number.isFinite(budgetMinutes) && budgetMinutes >= 0 &&
            typeof minutesElapsed === 'number' && Number.isFinite(minutesElapsed) && minutesElapsed >= 0
          ) {
            return {
              mode: 'time' as const,
              budgetMinutes,
              minutesElapsed,
              // Optional wrap threshold (real time-boxed demo only). Same
              // finite/non-negative guard; anything else ⇒ omitted (no wrap).
              ...(typeof wrapAtMinutes === 'number' && Number.isFinite(wrapAtMinutes) && wrapAtMinutes >= 0
                ? { wrapAtMinutes }
                : {}),
            };
          }
        }
        return undefined;
      })();
      if (demoStop) {
        console.log(
          `[demo-stop] attached mode=${demoStop.mode}` +
            (demoStop.mode === 'time'
              ? ` elapsed=${demoStop.minutesElapsed}/${demoStop.budgetMinutes}min` +
                (typeof demoStop.wrapAtMinutes === 'number'
                  ? ` wrapAt=${demoStop.wrapAtMinutes}${demoStop.minutesElapsed >= demoStop.wrapAtMinutes ? ' WRAP' : ''}`
                  : '')
              : ''),
        );
      }

      // Task X10: the turn input is pure, byte-stable data (no per-attempt
      // mutation), so the SAME object is safely reused on every retry.
      const turnInput = {
          systemPrompt: body.systemPrompt,
          conversationHistory: body.conversationHistory,
          studentTranscript: body.studentTranscript,
          whiteboardSnapshot: body.whiteboardSnapshot,
          whiteboardPages: body.whiteboardPages,
          lessonPlanContext: body.lessonPlanContext,
          studentProfileBlock: body.studentProfileBlock,
          // Opening-phase directive: string-typed + bounded (defense against
          // a malformed client resending an unbounded blob every turn).
          openingDirective:
            typeof body.openingDirective === 'string' && body.openingDirective.length <= 2000
              ? body.openingDirective
              : undefined,
          // Student marks: same string-typed + bounded defense.
          studentMarks:
            typeof body.studentMarks === 'string' && body.studentMarks.length <= 2000
              ? body.studentMarks
              : undefined,
          // Teacher style reminder: same string-typed + bounded defense.
          styleReminder:
            typeof body.styleReminder === 'string' && body.styleReminder.length <= 2000
              ? body.styleReminder
              : undefined,
          // Task E1: sanitized above (mode enum + finite ≥0 numbers, else
          // undefined). Surfaces as `<demo_stop>` in the user content.
          demoStop,
          // Task X2: durable practice-mode flag. Coerced to a strict boolean so
          // a malformed client can't inject a truthy non-bool. Surfaces as the
          // `<practice_session>` block in the user content.
          practiceMode: body.practiceMode === true,
          activeProblem: body.activeProblem,
          unrealizedMarks: body.unrealizedMarks,
          deduplicatedShows: body.deduplicatedShows,
          pacingState: body.pacingState,
          topicNotesState: body.topicNotesState,
          grade: body.grade,
          tools: toolFilter.tools,
          model: body.model,
          maxTokens: body.maxTokens,
          toolResultProvider: makeToolResultProvider(
            body.lessonPlanContext,
            body.shownProblemIds ?? [],
            body.shownProblemHashes ?? [],
            (p) => send({ type: 'generated-problem', ...p }),
            typeof body.pacingState?.difficultyBias === 'number' ? body.pacingState.difficultyBias : undefined
          ),
      };

      // Task X10 — bounded whole-turn retry. Wraps the generator so a turn
      // that throws (overloaded_error / transient) BEFORE emitting any
      // content can be re-dispatched from scratch. The cardinal safety
      // rule (decideBrainRetry): NEVER retry once ANY event (sentence,
      // tool-call, tool-rejected, or pause) has reached the client — a re-run
      // would cause duplication. Because we only retry on the ZERO-emitted
      // shape (emittedToClient === 0), re-running is provably duplication-free:
      // the client received nothing from the failed attempt, so the fresh
      // attempt's events are the only ones it sees. `emittedToClient` is
      // maintained in send() and is the authoritative count.
      let turnAttempt = 0;
      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
        try {
        for await (const ev of withInactivityTimeout(runTutorTurn(turnInput), BRAIN_EVENT_STALL_MS)) {
          // Stamp the whole-turn retry count onto the terminal event so the
          // client turn-ok log can surface it too (server log already has it).
          if (ev.type === 'done') {
            (ev as { retries?: number }).retries = turnRetries;
          }
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

          // show_labeled_image: two paths.
          //  - `query` (preferred): brain says what it wants pictured;
          //    we resolve to a real URL via Unsplash → Pixabay → Pexels
          //    and stamp args.src + args.credit on the event.
          //  - `src` (legacy): brain provides a known-good URL; we HEAD
          //    it to confirm it's reachable before forwarding.
          // In either path: a failure drops the tool-call event so the
          // client never tries to render a broken/missing image. Brain's
          // agent loop has already been given a tool_result, so this is
          // purely a display decision.
          if (ev.type === 'tool-call' && ev.name === 'show_labeled_image') {
            const query = typeof ev.args?.query === 'string' ? ev.args.query.trim() : '';
            const existingSrc = typeof ev.args?.src === 'string' ? ev.args.src : '';

            // Reject diagram-shaped queries. Stock-photo providers return
            // literal-keyword photo hits for things like "phospholipid
            // bilayer diagram labeled" — the top result is a person
            // holding a phone whose alt text mentions "labeled". The
            // brain should reach for show_diagram / show_svg_diagram /
            // a synthesized-diagram tool for these instead. Generic
            // pattern — no subject anchors; just structural words that
            // signal "I want a diagram, not a photograph".
            if (query) {
              const diagramShaped = /\b(diagram|schematic|labeled|labelled|anatomy|structure(?: of)?|cross[-\s]?section|bilayer|molecule|molecular|chemical structure|microscope view|cell wall|organelle|pathway|cycle|model of)\b/i.test(query);
              if (diagramShaped) {
                console.log(`[show_labeled_image] diagram-shaped query rejected: "${query}" — brain should use show_diagram / show_svg_diagram instead`);
                if (clientGone) break;
                continue;
              }
            }

            if (query) {
              try {
                const found = await searchImage({ query });
                if (!found) {
                  console.log(`[show_labeled_image] image-search MISS for query="${query}", dropping tool call`);
                  if (clientGone) break;
                  continue;
                }
                // Stamp resolved src + credit on the event so the client
                // renders the real image. Keep the brain's title/alt
                // intact. If the brain didn't supply credit, use the
                // provider-supplied one.
                //
                // STRIP callouts on the query path: the brain has never
                // seen the resolved image, so its percent-coordinate
                // callouts are blind guesses (observed 2026-05-06 G5
                // earth-systems: "Lava & rocks" labeled in a tree, "Ocean
                // & water" also in trees, on an Unsplash landscape that
                // had no lava). The tool description tells the brain to
                // omit callouts when using query; this strip is a
                // belt-and-suspenders enforcement.
                const droppedCallouts = Array.isArray(ev.args?.callouts) ? (ev.args.callouts as unknown[]).length : 0;
                ev.args = {
                  ...ev.args,
                  src: found.url,
                  credit: typeof ev.args?.credit === 'string' && ev.args.credit
                    ? ev.args.credit
                    : found.credit,
                  alt: typeof ev.args?.alt === 'string' && ev.args.alt
                    ? ev.args.alt
                    : found.alt,
                  callouts: [],
                };
                console.log(
                  `[show_labeled_image] resolved query="${query}" → ${found.source}` +
                  (droppedCallouts > 0 ? ` (stripped ${droppedCallouts} blind callouts)` : ''),
                );
              } catch (err) {
                console.warn(`[show_labeled_image] image-search threw, dropping:`, (err as Error).message);
                if (clientGone) break;
                continue;
              }
            } else if (existingSrc) {
              // Legacy URL path — HEAD the URL to confirm reachability.
              const ok = await validateImageUrl(existingSrc);
              if (!ok) {
                console.log(`[show_labeled_image] URL precheck FAILED, dropping. src="${existingSrc.slice(0, 160)}"`);
                if (clientGone) break;
                continue;
              }
            } else {
              // Neither query nor src — invalid call.
              console.log('[show_labeled_image] no query and no src, dropping');
              if (clientGone) break;
              continue;
            }
          }

          send(ev);
          // Bail early if the client is gone — no point continuing to
          // pull from the brain generator (costs API tokens) when no
          // one is listening.
          if (clientGone) break;
        }
        // Stream drained without throwing (or the client vanished) — this
        // attempt is terminal; leave the retry loop.
        break;
        } catch (err) {
          // The turn threw — classify it and decide retry vs honest give-up.
          if (clientGone) {
            console.warn('[brain.stream] client gone during turn error — not retrying');
            break;
          }
          const errorKind = classifyBrainError(err);
          const decision = decideBrainRetry({
            errorKind,
            sentencesEmitted: sentenceCount,
            toolsEmitted: toolNames.length,
            emittedToClient,
            attempt: turnAttempt,
            maxRetries: MAX_TURN_RETRIES,
          });
          console.warn(
            `[brain.stream] turn error kind=${errorKind} sentences=${sentenceCount} ` +
            `tools=${toolNames.length} attempt=${turnAttempt} → ${decision.action} ` +
            `(${decision.reason}): ${err instanceof Error ? err.message : String(err)}`,
          );
          if (decision.action === 'retry') {
            turnAttempt++;
            turnRetries = turnAttempt;
            await new Promise((r) => setTimeout(r, decision.delayMs));
            continue;
          }
          // Give up. Emit the terminal done with the honest-fallback signal —
          // `brainUnavailable` is set ONLY when zero content reached the
          // client (the observed incident shape). A partial turn already
          // played what it sent, so we don't flag it (the client's
          // empty-stream path requires 0 sentences + 0 tools anyway).
          gaveUp = true;
          stopReason = 'error';
          send({
            type: 'done',
            stopReason: 'error',
            usage,
            fullText,
            toolCalls: [],
            retries: turnRetries,
            brainUnavailable: sentenceCount === 0 && toolNames.length === 0,
          });
          break;
        }
        } // end whole-turn retry loop
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
          `· stop=${stopReason} · retries=${turnRetries}${gaveUp ? ' FAILED' : ''} · in=${usage.inputTokens} out=${usage.outputTokens} cache_read=${usage.cacheReadTokens} cache_creation=${usage.cacheCreationTokens}` +
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
