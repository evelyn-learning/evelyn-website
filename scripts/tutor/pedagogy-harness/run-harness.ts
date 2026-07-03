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
 * SCOPE (see task-H4-brief.md "Session start per persona"):
 *   - DEMO personas (maya, leo, aria, anon, sam): fully supported via the
 *     picker-start path (`personaToPickerStart`).
 *   - SUBSCRIBED personas (priya, noah, zoe, kai, diego, ravi): DEFERRED.
 *     `personaToPickerStart` throws a clear message for these — see the
 *     function doc for why (real DB-backed StudentProfile + portal context
 *     seeding is required, not just a picker start; that's Phase D work,
 *     not this task). `runScenario` surfaces the same error.
 */
import { chromium, type ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import type { Persona } from './fixtures/personas';
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

export type Bundle = {
  persona: { id: string; mode: 'demo' | 'subscribed' };
  turns: BundleTurn[];
  /** Emitted SessionResult, if the session produced one. NOT wired up for
   *  the demo/picker path today — the /tutor page's e2e test hook
   *  (__tutorTestState) has no sessionResult field; that concept currently
   *  only exists portal-side (src/lib/tutor/portal/session-result.ts). Left
   *  undefined rather than fabricated; a real hook is future work. */
  sessionResult?: unknown;
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
  sam: { subject: 'math', level: 'college', topic: 'calculus-1', lessonPlanId: 'evelyn.g12.math.calc.limits.v1' },
};

/** Personas whose picker-start is genuinely tractable in this task (they
 *  are logged-out / picker-driven, no durable engine-side state needed). */
const DEMO_PERSONA_IDS = new Set(Object.keys(DEMO_PICKER_START));

/**
 * Pure: maps a fixture persona to the `__tutorTestStart` picker config.
 *
 * DEMO personas → a real (subject, level, topic, lessonPlanId) from
 * DEMO_PICKER_START + a studentName derived from the persona id (omitted
 * for `anon`, matching its logged-out/anonymous fixture).
 *
 * SUBSCRIBED personas → throws. Making a subscribed persona's session
 * actually REFLECT its fixture (mastery/gaps/socialMemory/progressDigest)
 * requires a real DB-backed StudentProfile (src/lib/tutor/student-profile/
 * store.ts's getOrCreateStudentProfile, Mongo-backed) plus a portal context
 * record, seeded BEFORE the session starts and reachable via
 * /tutor?studentId=<id>. That's a real seeding pipeline, not a picker-start
 * mapping — deferred to Phase D per the task brief ("if it balloons,
 * implement DEMO fully, stub subscribed"). A bare picker-start (subject/
 * level/topic only, no studentId) would silently start an ANONYMOUS session
 * that ignores the persona's fixture entirely, which is worse than failing
 * loudly — hence the throw.
 */
export function personaToPickerStart(
  persona: Persona,
): { subject: string; level: string; topic: string; lessonPlanId: string; studentName?: string } {
  if (persona.mode !== 'demo' || !DEMO_PERSONA_IDS.has(persona.id)) {
    throw new Error(
      `personaToPickerStart: subscribed-context injection for "${persona.id}" is DEFERRED to Phase D ` +
        '(needs a real academy/engine StudentProfile + portal-context seed matching the fixture — not ' +
        'just a picker start; see /tutor?studentId= + src/lib/tutor/student-profile/store.ts). Use one of ' +
        `the DEMO personas (${[...DEMO_PERSONA_IDS].join(', ')}) with runScenario() instead.`,
    );
  }
  const cfg = DEMO_PICKER_START[persona.id];
  if (!cfg) throw new Error(`personaToPickerStart: no picker-start mapping for demo persona "${persona.id}"`);
  return {
    ...cfg,
    studentName: persona.id === 'anon' ? undefined : persona.id.charAt(0).toUpperCase() + persona.id.slice(1),
  };
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
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function log(msg: string) { console.log(`[pedagogy-harness] ${msg}`); }

/**
 * Drives a real claude-brain session for `persona` (DEMO only — see
 * `personaToPickerStart`), looping the Haiku student-simulator against the
 * tutor's turns until `opts.maxTurns` or the simulator's disengage
 * sentinel, and returns the captured `Bundle`.
 */
export async function runScenario(
  persona: Persona,
  opts: { maxTurns: number; taskId?: string; baseUrl?: string },
): Promise<Bundle> {
  const baseUrl = opts.baseUrl ?? process.env.TUTOR_E2E_URL ?? 'http://localhost:3006';
  const start = personaToPickerStart(persona); // throws for subscribed personas — by design

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
    // triggers the tutor's opener without a real mic click).
    log('kickoff: [start lesson]');
    await page.evaluate(() => window.__tutorSendText('[start lesson]'));
    await waitForTurn(120_000, '[start lesson]');
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

    return assembleBundle(persona, rawTurns, { taskId: opts.taskId, baseUrl, maxTurns: opts.maxTurns });
  } finally {
    await browser.close();
  }
}
