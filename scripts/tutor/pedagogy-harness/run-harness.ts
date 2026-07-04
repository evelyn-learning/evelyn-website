/// <reference types="node" />
/**
 * Task H4: pedagogy harness driver + bundle capture.
 *
 * Drives a REAL claude-brain tutor session in headless Chromium for a
 * fixture persona (Task H1, ./fixtures/personas), loops the Haiku
 * student-simulator (Task H3, ./student-simulator) against the tutor's
 * turns, and assembles a structured `Bundle` for the H5 gates/judge.
 *
 * REUSE, not rebuild: the Playwright plumbing (launch/connect/turn-sync via
 * quiescence/screenshot) is the SAME pattern as scripts/tutor-e2e/run.ts —
 * see that file + types.ts + llm.ts, which this was modeled on. It is
 * duplicated here (not imported) because run.ts is a script that calls
 * `main()` unconditionally at module load (no exports) — importing it would
 * immediately try to run a CLI scenario. What's reused is the PROVEN
 * plumbing pattern: window.__tutorTestStart / __tutorSendText /
 * __tutorTestState, and the busy→quiet turn-sync bracket.
 *
 * SCOPE (updated by Task H2 — subscribed-persona enablement):
 *   - DEMO personas (maya, leo, aria, anon, sam, nina): picker-start path
 *     (`personaToPickerStart` → DEMO_PICKER_START), unchanged.
 *   - SUBSCRIBED personas (priya, noah, zoe, kai, diego, ravi): now
 *     supported. Each maps to a real seed-catalog plan
 *     (SUBSCRIBED_PICKER_START) PLUS the subscribed extras the /tutor
 *     page's extended __tutorTestStart hook accepts: a NAMESPACED
 *     studentId (`pedagogy-<id>`, seeded into the engine DB by
 *     ./seed-subscribed.ts — run `npm run test:pedagogy-seed` first or the
 *     profile-block fetch 404s and the session runs memory-less),
 *     the fixture's TRANSIENT socialMemory/progressDigest, and (ravi) a
 *     pre-built resume checkpoint.
 *   - diego's DIAGNOSTIC variant (studentContextDiagnostic,
 *     target.kind='diagnostic') is NOW WIRED: the engine grew an explicit
 *     targetKind signal (__tutorTestStart.targetKind → VoiceTutorRealtime
 *     prop → OpeningSignals.targetKind; production twin = the embed's
 *     EmbedConfig.target_kind). The S5 row runs him with
 *     opts.targetKind='diagnostic' — the same real signal the academy's
 *     diagnostic embeds send, not a fake.
 *   - ravi's STALE-checkpoint variant now passes the real checkpointStale
 *     marker (no resume seed + checkpointStale:true — mirroring
 *     portal/resume.ts's resolveResumeOutcome), so the resume-stale
 *     journey (light re-orient) is live-testable via the S6S row.
 */
import { chromium, type ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import type { SocialThread, ProgressDigest } from '@evelyn/portal-contract/v1';
import { isCheckpointResumable } from '../../../src/lib/tutor/portal/resume';
import type { Persona, ResumeStateFixture } from './fixtures/personas';
import { simulateStudent, type SimTurn } from './student-simulator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { __tutorTestStart: any; __tutorSendText: any; __tutorTestState: any } }

export type BundleTurn = {
  index: number;
  /** The tutor's spoken/typed turn text. */
  tutorText: string;
  /** Whiteboard/render tool calls attributed to this turn (best-effort —
   *  derived from the `tool_call`-typed debug events emitted between the
   *  previous turn boundary and this one; see `runScenario`'s
   *  `getNewToolCalls`). */
  toolCalls: unknown[];
  /** Screenshot filename captured right before the student replies (best-
   *  effort board snapshot ref — NOT a structured board summary). */
  boardState?: unknown;
  /** What simulateStudent (Task H3) replied. */
  studentReply: string;
  /** Simulator disengage sentinel — true if the student would leave. */
  ended: boolean;
};

/** Opener-recency (part A) — the wire shape shared by the engine's
 *  LastOpenerRecord (src/lib/tutor/student-profile/transient-context.ts),
 *  the __tutorTestStart cfg field, and __tutorTestState's
 *  sessionOpenerRecord. Redeclared (not imported) to keep this script's
 *  imports to the contract package + local files, matching the existing
 *  pattern. */
export type OpenerRecord = { kind: string; digest: string };

export type Bundle = {
  persona: { id: string; mode: 'demo' | 'subscribed' };
  turns: BundleTurn[];
  /** Emitted SessionResult, if the session produced one. NOT wired up for
   *  the demo/picker path today — the /tutor page's e2e test hook
   *  (__tutorTestState) has no sessionResult field; that concept currently
   *  only exists portal-side (src/lib/tutor/portal/session-result.ts). Left
   *  undefined rather than fabricated; a real hook is future work. */
  sessionResult?: unknown;
  /** Opener-recency (part A): the session's OWN captured opener record, as
   *  read from __tutorTestState at end-of-run (the engine captures it when
   *  the opener turn's text finalizes). Absent when the flag is off or the
   *  opener turn never completed — never fabricated. */
  sessionOpenerRecord?: OpenerRecord;
  meta: { taskId?: string; baseUrl: string; maxTurns: number };
};

/**
 * Picker-start config (subject/level/topic/lessonPlanId) for each DEMO
 * persona, keyed by persona id. Every lessonPlanId here is a REAL id from
 * the curated seed catalog (src/lib/tutor/lesson-plan/seeds via
 * SEED_PLANS/getPlanIndex()) — resolved by querying the plan index for each
 * persona's simProfile.topic and picking a real match in a reachable
 * (subject, level, topic) taxonomy cell (src/lib/tutor/topic-taxonomy.ts).
 * Per the task brief the EXACT plan doesn't need to match the persona's
 * topic precisely — only that it's a real plan the picker can actually
 * start a claude-brain session against. See task-H4-report.md for the
 * per-persona resolution notes.
 */
export const DEMO_PICKER_START: Record<
  string,
  { subject: string; level: string; topic: string; lessonPlanId: string }
> = {
  maya: { subject: 'math', level: '9-10', topic: 'quadratic-equations', lessonPlanId: 'evelyn.g9.math.algebra.quadratics-intro.v1' },
  leo: { subject: 'math', level: '9-10', topic: 'quadratic-equations', lessonPlanId: 'evelyn.g9.math.algebra.quadratics-intro.v1' },
  aria: { subject: 'math', level: '6-8', topic: 'integers-rational', lessonPlanId: 'evelyn.g6.math.fractions.add-unlike-denoms.v1' },
  anon: { subject: 'math', level: '6-8', topic: 'ratios-proportions', lessonPlanId: 'evelyn.g6.math.ratios-rates.v1' },
  // nina reuses anon's ratios plan DELIBERATELY — it's the exact plan the
  // Store-B misquote-adoption bug was observed on (2026-07-03).
  nina: { subject: 'math', level: '6-8', topic: 'ratios-proportions', lessonPlanId: 'evelyn.g6.math.ratios-rates.v1' },
  // tara (parent sitting in on a demo, T2 identity-bounds row) reuses the
  // same real ratios plan — her child is grade 6 and the row only needs a
  // real, startable plan.
  tara: { subject: 'math', level: '6-8', topic: 'ratios-proportions', lessonPlanId: 'evelyn.g6.math.ratios-rates.v1' },
  sam: { subject: 'math', level: 'college', topic: 'calculus-1', lessonPlanId: 'evelyn.g12.math.calc.limits.v1' },
};

/** Personas whose picker-start needs no engine-side state (logged-out /
 *  picker-driven). */
const DEMO_PERSONA_IDS = new Set(Object.keys(DEMO_PICKER_START));

/**
 * Task H2: picker-start config for each SUBSCRIBED persona. Same
 * real-seed-catalog rule as DEMO_PICKER_START (every lessonPlanId verified
 * against getPlanIndex(), cells from resolve-cell.ts; the plan only has to
 * be a real, startable match for the fixture's topic — not a perfect one):
 *   - priya  (Systems of Equations, g10)  → g9 systems-linear plan
 *   - noah   (Linear Equations, g9)       → g8 linear-equations plan
 *     (closest real catalog match — lives in the 6-8 cell)
 *   - zoe    (Triangle Congruence, g9)    → g10 triangle-congruence plan
 *   - kai    (Linear Inequalities, g9)    → g9 inequalities plan
 *   - diego  (Quadratics, g10)            → g9 quadratics-intro plan.
 *     Runs as a normal lessonNode session by default; the S5 row adds
 *     opts.targetKind='diagnostic' (the now-plumbed engine signal — see
 *     header SCOPE note) to exercise his diagnostic variant.
 *   - ravi   (Cellular Respiration, g11)  → hs cellular-respiration plan
 */
export const SUBSCRIBED_PICKER_START: Record<
  string,
  { subject: string; level: string; topic: string; lessonPlanId: string }
> = {
  priya: { subject: 'math', level: '9-10', topic: 'systems-of-equations', lessonPlanId: 'evelyn.g9.math.algebra.systems-linear.v1' },
  noah: { subject: 'math', level: '6-8', topic: 'expressions-equations', lessonPlanId: 'evelyn.g8.math.algebra.linear-equations.v1' },
  zoe: { subject: 'math', level: '9-10', topic: 'geometry', lessonPlanId: 'evelyn.g10.math.geometry.triangle-congruence.v1' },
  kai: { subject: 'math', level: '9-10', topic: 'algebra-1', lessonPlanId: 'evelyn.g9.math.algebra.inequalities.v1' },
  diego: { subject: 'math', level: '9-10', topic: 'quadratic-equations', lessonPlanId: 'evelyn.g9.math.algebra.quadratics-intro.v1' },
  ravi: { subject: 'science', level: '9-10', topic: 'biology', lessonPlanId: 'evelyn.hs.science.biology.cellular-respiration.v1' },
};

const SUBSCRIBED_PERSONA_IDS = new Set(Object.keys(SUBSCRIBED_PICKER_START));

/** The full `__tutorTestStart` config the driver sends — picker fields for
 *  everyone, plus the Task-H2 subscribed extras (see the hook's cfg doc in
 *  src/app/tutor/page.tsx). */
export interface TestStartConfig {
  subject: string;
  level: string;
  topic: string;
  lessonPlanId: string;
  studentName?: string;
  /** Namespaced engine id `pedagogy-<personaId>` — MUST match what
   *  ./seed-subscribed.ts wrote or the profile fetch finds nothing. */
  studentId?: string;
  socialMemory?: SocialThread[];
  progressDigest?: ProgressDigest;
  /** Pre-built TutorResumeState (post-buildResumeState shape). Staleness
   *  is filtered HERE in the driver (same isCheckpointResumable rule the
   *  production path applies before resumeState ever exists); a filtered
   *  (stale) checkpoint sets `checkpointStale` instead — mirroring
   *  portal/resume.ts's resolveResumeOutcome. */
  resume?: {
    currentSegmentId: string;
    completedSegmentIds: string[];
    transcript: unknown[];
    whiteboardCommands: unknown[];
  };
  /** Stale-checkpoint marker (resume-stale journey): a checkpoint existed
   *  but was too old to restore. Set by the driver when the requested
   *  resumeVariant's checkpoint fails isCheckpointResumable (never together
   *  with `resume`). */
  checkpointStale?: boolean;
  /** Session budget override (page-side default 30 — the production
   *  literal). The E2 soft-close row shrinks it to ~5 so the wind-down is
   *  actually reachable within a short live run. */
  sessionMaxMinutes?: number;
  /** Explicit OpeningSignals.targetKind (production twin: the embed's
   *  EmbedConfig.target_kind). 'diagnostic' = opener/calibration no-op +
   *  completion-gate/demo-stop off. Omitted = derived from lessonPlanId
   *  presence, exactly as before. */
  targetKind?: 'lessonNode' | 'freestyle' | 'diagnostic';
  /** Opener-recency (part A): the PREVIOUS session's opener record, passed
   *  through to the engine's transient-context block as a do-NOT-repeat
   *  directive. Set by `runReplayScenario` for session 2 only. */
  lastOpener?: OpenerRecord;
  /** Teacher persona pin (T-rows): resolved by the /tutor page against
   *  DEMO_TEACHERS (src/lib/tutor/ai/teacher-persona.ts). Unknown id ⇒
   *  ignored page-side (default = first teacher). */
  teacherId?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/** Fixture timestamps age with the calendar, so a thread authored as
 *  "recently used" (priya's Spider-Man `lastReferencedAt`) would silently
 *  stop being recent months from now — and the S1 no-spiderman-if-recent
 *  rubric would test nothing. Refresh any PRESENT lastReferencedAt to
 *  ~yesterday relative to the run; threads without the field stay
 *  untouched (they were never "recently used"). */
export function refreshThreadRecency(threads: SocialThread[], now: number = Date.now()): SocialThread[] {
  return threads.map((t) =>
    t.lastReferencedAt ? { ...t, lastReferencedAt: new Date(now - DAY_MS).toISOString() } : t,
  );
}

/** Same calendar-aging rationale for ravi's FRESH checkpoint fixture: its
 *  authored updatedAtISO drifts out of the RESUME_MAX_AGE_MS window over
 *  time, so the fresh variant refreshes it to ~1h ago. The STALE variant is
 *  deliberately NOT refreshed — it only gets older, which is the point. */
function refreshFreshCheckpoint(cp: ResumeStateFixture, now: number = Date.now()): ResumeStateFixture {
  return { ...cp, updatedAtISO: new Date(now - HOUR_MS).toISOString() };
}

/** Minimal typed view of the fixture's `studentContext` (validated in full
 *  against the contract schema by personas.test.ts — this cast just reads
 *  the three fields the driver forwards). */
interface StudentContextView {
  profile?: { name?: string };
  socialMemory?: SocialThread[];
  progressDigest?: ProgressDigest;
}

/**
 * Pure: maps a fixture persona to the `__tutorTestStart` config.
 *
 * DEMO personas → a real (subject, level, topic, lessonPlanId) from
 * DEMO_PICKER_START + a studentName derived from the persona id (omitted
 * for `anon`, matching its logged-out/anonymous fixture). No subscribed
 * extras — byte-identical to the pre-H2 behavior.
 *
 * SUBSCRIBED personas (Task H2 — the old Phase-D deferral throw is gone) →
 * SUBSCRIBED_PICKER_START + the subscribed extras:
 *   - studentId `pedagogy-<id>` (the namespaced engine profile seeded by
 *     ./seed-subscribed.ts — run `npm run test:pedagogy-seed` first),
 *   - the fixture's transient socialMemory (recency-refreshed, see
 *     refreshThreadRecency) + progressDigest,
 *   - ravi only: a resume checkpoint built from the requested variant
 *     (`opts.resumeVariant`, default 'fresh'). The driver applies the SAME
 *     staleness filter production applies (isCheckpointResumable /
 *     RESUME_MAX_AGE_MS via portal/resume.ts), so the 'stale' variant
 *     yields NO resume seed — instead it sets `checkpointStale: true`,
 *     which is exactly what production now derives from a stale checkpoint
 *     (resolveResumeOutcome → the resume-stale light-re-orient journey).
 *     The fixtures carry no prior transcript/whiteboard, so the fresh
 *     checkpoint seeds POSITION only (empty transcript/whiteboardCommands
 *     arrays).
 *
 * `opts.sessionMaxMinutes` / `opts.targetKind` are plain start-config
 * overrides applied to BOTH branches (demo + subscribed) — see their
 * TestStartConfig docs.
 */
export interface PickerStartOpts {
  resumeVariant?: 'fresh' | 'stale';
  sessionMaxMinutes?: number;
  targetKind?: TestStartConfig['targetKind'];
  teacherId?: TestStartConfig['teacherId'];
}

/** Applies the branch-independent driver overrides onto a built start
 *  config. Mutates + returns `start` (a fresh object at both call sites). */
function withDriverOverrides(start: TestStartConfig, opts?: PickerStartOpts): TestStartConfig {
  if (opts?.sessionMaxMinutes !== undefined) start.sessionMaxMinutes = opts.sessionMaxMinutes;
  if (opts?.targetKind) start.targetKind = opts.targetKind;
  if (opts?.teacherId) start.teacherId = opts.teacherId;
  return start;
}

export function personaToPickerStart(
  persona: Persona,
  opts?: PickerStartOpts,
): TestStartConfig {
  const fallbackName = persona.id.charAt(0).toUpperCase() + persona.id.slice(1);

  if (persona.mode === 'demo' && DEMO_PERSONA_IDS.has(persona.id)) {
    const cfg = DEMO_PICKER_START[persona.id];
    return withDriverOverrides({
      ...cfg,
      studentName: persona.id === 'anon' ? undefined : fallbackName,
    }, opts);
  }

  if (persona.mode === 'subscribed' && SUBSCRIBED_PERSONA_IDS.has(persona.id)) {
    const cfg = SUBSCRIBED_PICKER_START[persona.id];
    const ctx = (persona.studentContext ?? {}) as StudentContextView;
    const start: TestStartConfig = {
      ...cfg,
      studentName: ctx.profile?.name ?? fallbackName,
      studentId: `pedagogy-${persona.id}`,
    };
    if (ctx.socialMemory?.length) start.socialMemory = refreshThreadRecency(ctx.socialMemory);
    if (ctx.progressDigest) start.progressDigest = ctx.progressDigest;

    const variant = opts?.resumeVariant ?? 'fresh';
    const rawCp = variant === 'stale' ? persona.staleResumeState : persona.resumeState;
    if (rawCp) {
      const cp = variant === 'fresh' ? refreshFreshCheckpoint(rawCp) : rawCp;
      if (isCheckpointResumable(cp.updatedAtISO)) {
        start.resume = {
          currentSegmentId: cp.currentSegmentId,
          completedSegmentIds: [...cp.completedSegmentIds],
          transcript: [],
          whiteboardCommands: [],
        };
      } else {
        // The checkpoint EXISTED but is outside RESUME_MAX_AGE_MS — same
        // outcome production's resolveResumeOutcome reports: no resume
        // seed, checkpointStale marker on (the resume-stale journey).
        start.checkpointStale = true;
      }
    }
    return withDriverOverrides(start, opts);
  }

  throw new Error(
    `personaToPickerStart: no picker-start mapping for persona "${persona.id}" (mode=${persona.mode}). ` +
      `Known: demo=[${[...DEMO_PERSONA_IDS].join(', ')}], subscribed=[${[...SUBSCRIBED_PERSONA_IDS].join(', ')}].`,
  );
}

/** One turn's raw captured data, pre-index — what the driver loop collects
 *  before `assembleBundle` stamps sequential indices and wraps it in the
 *  final Bundle shape. */
export type RawCapturedTurn = Omit<BundleTurn, 'index'>;

/**
 * Pure: assembles the final `Bundle` from the raw per-turn captures the
 * driver loop collected. Stamps sequential `index`, carries persona
 * id/mode through, and only includes `sessionResult` when actually
 * provided (kept optional/undefined otherwise, never fabricated).
 */
export function assembleBundle(
  persona: Persona,
  rawTurns: RawCapturedTurn[],
  meta: { taskId?: string; baseUrl: string; maxTurns: number },
  sessionResult?: unknown,
): Bundle {
  return {
    persona: { id: persona.id, mode: persona.mode },
    turns: rawTurns.map((t, index) => ({ index, ...t })),
    ...(sessionResult !== undefined ? { sessionResult } : {}),
    meta,
  };
}

interface DebugEvent { type: string; message: string; timestamp: string; data?: Record<string, unknown> }
interface TestState {
  stage: string;
  brainBusy: boolean;
  connected: boolean;
  transcriptLen: number;
  turnsCompleted: number;
  error: string | null;
  debugEvents?: DebugEvent[];
  transcript?: Array<{ role: string; text: string }>;
  /** Opener-recency (part A): the session's own captured opener record
   *  (null until the opener turn's text finalizes / flag off). */
  sessionOpenerRecord?: OpenerRecord | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function log(msg: string) { console.log(`[pedagogy-harness] ${msg}`); }

/**
 * Drives a real claude-brain session for `persona` (demo AND subscribed —
 * see `personaToPickerStart`), looping the Haiku student-simulator against
 * the tutor's turns until `opts.maxTurns` or the simulator's disengage
 * sentinel, and returns the captured `Bundle`.
 *
 * Subscribed personas additionally need their engine profile seeded first
 * (`npm run test:pedagogy-seed`) — without it the session still runs, just
 * without cross-session memory (profile fetch finds nothing).
 */
export interface RunScenarioOpts {
  maxTurns: number;
  taskId?: string;
  baseUrl?: string;
  resumeVariant?: 'fresh' | 'stale';
  /** Session budget override → __tutorTestStart.sessionMaxMinutes (page
   *  default 30). E2's soft-close row shrinks it to ~5. */
  sessionMaxMinutes?: number;
  /** Explicit targetKind → __tutorTestStart.targetKind (S5 runs diego's
   *  diagnostic variant with 'diagnostic'). */
  targetKind?: TestStartConfig['targetKind'];
  /** Teacher persona pin → __tutorTestStart.teacherId (T1/T2 rows). */
  teacherId?: TestStartConfig['teacherId'];
  /** Opener-recency (part A): injected as __tutorTestStart's lastOpener
   *  (the previous session's opener record). Only `runReplayScenario`
   *  sets this — and only on its SECOND session. */
  lastOpener?: OpenerRecord;
}

export async function runScenario(
  persona: Persona,
  opts: RunScenarioOpts,
): Promise<Bundle> {
  const baseUrl = opts.baseUrl ?? process.env.TUTOR_E2E_URL ?? 'http://localhost:3006';
  const start = personaToPickerStart(persona, {
    resumeVariant: opts.resumeVariant,
    sessionMaxMinutes: opts.sessionMaxMinutes,
    targetKind: opts.targetKind,
    teacherId: opts.teacherId,
  });
  if (opts.lastOpener) start.lastOpener = opts.lastOpener;

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outDir = path.join(process.cwd(), 'artifacts', 'pedagogy-harness', `${persona.id}-${stamp}`);
  fs.mkdirSync(outDir, { recursive: true });
  log(`persona "${persona.id}" → ${outDir}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('console', (m: ConsoleMessage) => { if (m.type() === 'error') log(`[browser console error] ${m.text().slice(0, 200)}`); });

  const getState = () => page.evaluate(() => window.__tutorTestState() as TestState);

  // Turn-sync via quiescence — same pattern as scripts/tutor-e2e/run.ts's
  // waitForTurn: wait for the brain to go busy, then wait until it's been
  // idle continuously for QUIET_MS (rides through auto-chained follow-up
  // turns, e.g. a render turn -> a scribble turn).
  const QUIET_MS = 3500;
  async function waitForTurn(timeoutMs: number, what: string) {
    const startDeadline = Date.now() + 30_000;
    while (Date.now() < startDeadline && !(await getState()).brainBusy) await sleep(500);
    const deadline = Date.now() + timeoutMs;
    let lastBusy = Date.now();
    while (Date.now() < deadline) {
      const s = await getState();
      if (s.brainBusy) lastBusy = Date.now();
      else if (Date.now() - lastBusy >= QUIET_MS) return s;
      await sleep(500);
    }
    log(`TIMEOUT waiting for turn after "${what}" (${timeoutMs}ms)`);
    return getState();
  }
  // Headless has no audio playback, so render<->speech-sync flushes on its
  // stall timer, not sentence-start. Settle past that + paint before
  // screenshotting/reading the transcript (mirrors run.ts's SETTLE_MS).
  const SETTLE_MS = 7500;

  let shotIdx = 0;
  async function shot(label: string): Promise<string> {
    const file = `${String(shotIdx++).padStart(2, '0')}-${label.replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}.png`;
    await page.screenshot({ path: path.join(outDir, file), fullPage: false });
    return file;
  }

  // Per-turn tool-call attribution: bucket the `tool_call`-typed debug
  // events emitted since the last turn boundary. Best-effort (debug events
  // carry no explicit turn index — this attributes by emission order,
  // which is correct as long as tool calls for turn N land before the
  // brain goes idle for turn N and turn N+1's student reply is sent after).
  let debugSince = 0;
  async function collectNewToolCalls(): Promise<unknown[]> {
    const s = await getState();
    const events = s.debugEvents ?? [];
    const fresh = events.slice(debugSince);
    debugSince = events.length;
    return fresh.filter((e) => e.type === 'tool_call').map((e) => ({ message: e.message, data: e.data }));
  }

  // `waitForTurn`'s busy->quiet bracket (mirroring run.ts) returns
  // "successfully" even if brainBusy never went true within its 30s start
  // window — it just falls through to the quiescence check, which is
  // trivially satisfied once QUIET_MS elapses with brainBusy stuck false.
  // That's a real hazard (seen live in this task's own smoke run: the
  // kickoff's __tutorSendText fired while the realtime handle wasn't fully
  // ready, so no brain turn ever started, yet waitForTurn returned clean).
  // Rather than hand an empty tutorText to simulateStudent (which crashes
  // deep in the Anthropic SDK with a confusing "messages.0: user messages
  // must have non-empty content" 400), poll a bit longer for a genuine
  // non-empty tutor transcript entry and fail loudly with a diagnosable
  // error (naming the persona + screenshot) if it truly never arrives.
  async function waitForNonEmptyTutorText(extraTimeoutMs: number, what: string): Promise<string> {
    const deadline = Date.now() + extraTimeoutMs;
    while (Date.now() < deadline) {
      const tr = (await getState()).transcript ?? [];
      const lastTutor = [...tr].reverse().find((e) => e.role === 'tutor');
      if (lastTutor?.text && lastTutor.text.trim().length > 0) return lastTutor.text;
      await sleep(1000);
    }
    return '';
  }

  const rawTurns: RawCapturedTurn[] = [];
  let history: SimTurn[] = [];

  try {
    log(`navigating to ${baseUrl}/tutor`);
    await page.goto(`${baseUrl}/tutor`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.__tutorTestStart === 'function', { timeout: 30_000 });

    log(`starting session: ${JSON.stringify(start)}`);
    await page.evaluate((cfg) => window.__tutorTestStart(cfg), start);

    log('waiting for connect…');
    {
      const deadline = Date.now() + 60_000;
      while (Date.now() < deadline && !(await getState()).connected) await sleep(500);
    }
    await sleep(3000); // WS settle

    // Kickoff — same synthetic bracketed transcript run.ts uses (silent,
    // triggers the tutor's opener without a real mic click). For a resume
    // session (ravi fresh-checkpoint variant) send the SAME synthetic
    // resume message the /tutor page's resumeContinue path uses, so the
    // brain picks up mid-lesson instead of being told to "start".
    const kickoff = start.resume
      ? '[Session-resumed: the student reloaded mid-session; pick up exactly where you left off]'
      : '[start lesson]';
    log(`kickoff: ${kickoff}`);
    await page.evaluate((text) => window.__tutorSendText(text), kickoff);
    await waitForTurn(120_000, kickoff);
    await sleep(SETTLE_MS);
    debugSince = 0; // tool calls from the kickoff turn attribute to turn 0 below

    for (let i = 0; i < opts.maxTurns; i++) {
      const tutorText = await waitForNonEmptyTutorText(30_000, `turn ${i} tutor text`);
      const toolCalls = await collectNewToolCalls();
      const boardState = await shot(`turn-${i}`);

      if (!tutorText) {
        throw new Error(
          `runScenario: no tutor turn text appeared for persona "${persona.id}" at turn ${i} (session may not ` +
            `have started — the kickoff's __tutorSendText can race ahead of the realtime handle becoming ready). ` +
            `Screenshot: ${boardState}`,
        );
      }

      log(`turn ${i}: simulating student reply to "${tutorText.slice(0, 80)}"`);
      const { text: studentReply, ended } = await simulateStudent(persona, tutorText, history);
      history = [...history, { role: 'tutor', text: tutorText }, { role: 'student', text: studentReply }];

      rawTurns.push({ tutorText, toolCalls, boardState, studentReply, ended });

      if (ended) { log(`turn ${i}: student disengaged (ended sentinel) — stopping`); break; }

      log(`turn ${i}: student says "${studentReply.slice(0, 80)}"`);
      await page.evaluate((text) => window.__tutorSendText(text), studentReply);
      await waitForTurn(150_000, studentReply);
      await sleep(SETTLE_MS);
    }

    const bundle = assembleBundle(persona, rawTurns, { taskId: opts.taskId, baseUrl, maxTurns: opts.maxTurns });
    // Opener-recency (part A): read the session's own captured opener
    // record (page's __tutorTestState.sessionOpenerRecord) onto the bundle
    // — the replay driver derives session 2's lastOpener from it. Never
    // fabricated: absent when the engine didn't capture one.
    const finalState = await getState();
    if (finalState.sessionOpenerRecord) bundle.sessionOpenerRecord = finalState.sessionOpenerRecord;
    return bundle;
  } finally {
    await browser.close();
  }
}

/**
 * Opener-recency (part A) — pure: derives the `lastOpener` record to inject
 * into a FOLLOW-UP session from a completed session's bundle.
 *  - kind: the engine-captured record's kind when the bundle carries one
 *    (__tutorTestState.sessionOpenerRecord), else 'proactive' (the most
 *    common resolved kind — a safe default when the capture didn't land).
 *  - digest: the first 160 chars of turn 0's tutorText — ALWAYS available
 *    in a bundle with turns (unlike the captured record), which keeps the
 *    replay usable even when the engine-side capture was skipped.
 */
export function openerRecordFromBundle(bundle: Bundle): OpenerRecord {
  return {
    kind: bundle.sessionOpenerRecord?.kind ?? 'proactive',
    digest: (bundle.turns[0]?.tutorText ?? '').slice(0, 160),
  };
}

/** Injectable runner seam so `runReplayScenario`'s two-call orchestration is
 *  unit-testable without a browser (see run-harness.test.ts). */
export type ScenarioRunner = (persona: Persona, opts: RunScenarioOpts) => Promise<Bundle>;

/**
 * Opener-recency (part A) — TRUE REPLAY: runs `runScenario` TWICE
 * sequentially for the same persona. Session 1 runs normally; session 2
 * runs with `lastOpener` injected (built from session 1's bundle via
 * `openerRecordFromBundle`), exercising the engine's do-NOT-repeat
 * directive end-to-end. Returns both bundles + the injected record.
 */
export async function runReplayScenario(
  persona: Persona,
  opts: RunScenarioOpts,
  runner: ScenarioRunner = runScenario,
): Promise<{ session1: Bundle; session2: Bundle; lastOpener: OpenerRecord }> {
  const session1 = await runner(persona, { ...opts, lastOpener: undefined });
  const lastOpener = openerRecordFromBundle(session1);
  const session2 = await runner(persona, { ...opts, lastOpener });
  return { session1, session2, lastOpener };
}
