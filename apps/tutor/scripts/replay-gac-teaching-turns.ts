/**
 * Offline replay of the GreenApple 2026-10-14 failing turns (T6 + T7) —
 * before vs after the 2026-10-19 teaching round (voice/no-reveal-ledger-gate.ts).
 *
 * For each failing moment it rebuilds the brain request of that turn from the
 * engine's own record of the session (a read-only dump of `tutorsessions` and
 * the homework `lessonplans`), and runs it locally through the PRODUCTION
 * path `streamBrainTurn` in text mode (thinking, turn shape, verdict
 * pre-check, work-then-match — as a GAC text session runs). The browser's
 * before-display steps that decide what the student would SEE are replayed:
 * the pre-check opener contradiction kill, the work-then-match opener
 * backstop, and the one retry after the server withheld a value-bearing
 * sentence (`answer-reveal`).
 *
 *   before  partner gate OFF — the request as deployed on 10-14.
 *   after   partner gate ON (`noRevealLedger`). For a T7 turn the ledger is
 *           what the browser would hold at that turn: the NEW pre-check is run
 *           once on every earlier answer-shaped student turn of the session,
 *           in order, and each high-confidence `solvedProblem` is recorded
 *           (lesson-plan/homework-ledger.ts) — the engine's own checks, as live.
 *
 * Not reproduced (the record does not carry it): the partner persona and
 * student profile blocks, judge notes planted into a turn, pacing streaks.
 * The board is rebuilt from the recorded commands (text fields only).
 *
 * No database, no host: MONGODB_URI is overwritten before anything loads. The
 * only network calls are to the model API (ANTHROPIC_API_KEY).
 *
 * Usage (from apps/tutor):
 *   ANTHROPIC_API_KEY=… npx tsx scripts/replay-gac-teaching-turns.ts \
 *     --data artifacts/gac-1014-replay/data --out artifacts/gac-1014-replay \
 *     --arms before,after --runs 1 [--only <case-id fragment>] [--list] [--report]
 * --data holds db-sessions.json (tutorsessions dump: transcript, whiteboardCommands,
 * debugEvents), plans.json (lessonplans), plan-ids.json (slug → plan/session) and
 * precalculus-r1.json (the driver record of the cut-short run, not in the DB).
 * Results append to results.jsonl; a re-run skips trials already there.
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/replay-no-db';
process.env.TUTOR_BRAIN_MODEL = process.env.REPLAY_BRAIN_MODEL || 'claude-sonnet-5';
process.env.TUTOR_TOOL_SUBJECT_FILTER = 'true'; // as in production
delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;
delete process.env.TUTOR_NO_REVEAL_LEDGER_PARTNERS;

import * as fs from 'node:fs';
import * as path from 'node:path';

type Arm = 'before' | 'after';
const STEPS = ['2', '3', '4', '5', '6a', '6b', '7a', '7b', '8a', '8b', '9'] as const;
type Step = typeof STEPS[number];

interface Case {
  id: string; slug: string; step: Step; cls: 'T6a' | 'T6b' | 'T7';
  /** What went wrong live (for the report). */
  live: string;
  /** A hit in the DISPLAYED reply or board ⇒ the failure recurred. */
  fail: RegExp;
  /** T6b: the reply must ALSO match this (the claim is corrected). */
  pass?: RegExp;
}

const CASES: Case[] = [
  // T6a — the result stated after a wrong answer.
  { id: 'algebra-1-r1/3', slug: 'algebra-1-r1', step: '3', cls: 'T6a', live: 'stated 7y = −14 (the corrected line)', fail: /[−-]\s*14\b|y\s*=\s*[−-]\s*2\b/ },
  { id: 'geometry-r1/3', slug: 'geometry-r1', step: '3', cls: 'T6a', live: 'stated the corrected equation (… = 90, 5x + 5 = 90)', fail: /5x\s*\+\s*5\s*=\s*90|=\s*90\b|x\s*=\s*17\b|\b85\b/ },
  { id: 'geometry-r1/6a', slug: 'geometry-r1', step: '6a', cls: 'T6a', live: 'stated both angles, 44 and 46', fail: /\b44\b|\b46\b/ },
  { id: 'precalculus-r3/3', slug: 'precalculus-r3', step: '3', cls: 'T6a', live: 'stated y = 3x + 1', fail: /3\s*x\s*\+\s*1/ },
  { id: 'ap-chemistry-r3/3', slug: 'ap-chemistry-r3', step: '3', cls: 'T6a', live: 'stated "180/30 gives 6, not 3"', fail: /(?:gives?|is|=|equals?)\s*6\b|\b6,?\s*not\s*3|C_?\{?6\}?\s*H_?\{?12|\bby\s*6\b|multiplier (?:is|of)\s*6/i },
  { id: 'physics-r3/3', slug: 'physics-r3', step: '3', cls: 'T6a', live: 'stated v = 30 m/s', fail: /\b30\b/ },
  // T6b — a stated misconception not corrected.
  { id: 'biology-r1/7b', slug: 'biology-r1', step: '7b', cls: 'T6b', live: 'moved on without correcting "enzymes get used up"', fail: /^\W*(?:yes|yep|exactly|right|correct|that'?s (?:right|correct))\b/i, pass: /not (?:used up|consumed|changed|destroyed)|(?:aren'?t|isn'?t|are not|is not|don'?t|do not) (?:get )?(?:used up|consumed|changed|destroyed)|reus|unchanged|over and over|again and again|not (?:quite )?(?:right|true|correct)|isn'?t (?:quite )?(?:right|true|correct)/i },
  // T7 — a solved problem re-opened, re-offered or called open.
  { id: 'algebra-2-r3/6a', slug: 'algebra-2-r3', step: '6a', cls: 'T7', live: 'went back to the solved inequality (x + 4 > −6)', fail: /subtract(?:ing)? 4|x\s*\+\s*4\s*>\s*[−-]\s*6|[−-]\s*6\s*<\s*x\s*\+\s*4|this inequality/i },
  { id: 'algebra-2-r3/9', slug: 'algebra-2-r3', step: '9', cls: 'T7', live: 'closing: "most of problem 2"', fail: /most of problem|problem 2[^.]*(?:left|unfinished|open|in progress|pick up)|(?:finish|pick up)[^.]*problem 2/i },
  { id: 'ap-statistics-r1/6b', slug: 'ap-statistics-r1', step: '6b', cls: 'T7', live: '"ready to move to problem two?" after it was done', fail: /(?:ready|move on|move|go)[^.?]*(?:to|for) (?:problem|question|part) (?:two|2|\(b\)|b)\b/i },
  { id: 'biology-r1/6a', slug: 'biology-r1', step: '6a', cls: 'T7', live: 'asked for a vocabulary word on the solved problem 2', fail: /what (?:word|term)|vocabulary|one word|for problem two:|shaped like/i },
  { id: 'biology-r1/9', slug: 'biology-r1', step: '9', cls: 'T7', live: 'closing: "problem two is close"', fail: /problem (?:two|2) is close|one (?:more )?(?:vocabulary )?word|one more shot|(?:problem|question) (?:two|2)[^.]*(?:left|open|unfinished|in progress)/i },
  { id: 'ap-chemistry-r3/6a', slug: 'ap-chemistry-r3', step: '6a', cls: 'T7', live: '"ready to move to problem two?" after both were done', fail: /(?:ready|move on|move|go)[^.?]*(?:to|for) (?:problem|question|part) (?:two|2|\(b\)|b)\b/i },
  { id: 'ap-chemistry-r3/8b', slug: 'ap-chemistry-r3', step: '8b', cls: 'T7', live: '"Problem 2 is still open"', fail: /(?:problem|part) (?:two|2|\(b\)|b)\b[^.]*(?:still open|open|left|unfinished)|180 divided by 30/i },
  { id: 'ap-chemistry-r3/9', slug: 'ap-chemistry-r3', step: '9', cls: 'T7', live: 'closing: "molecular formula step left on problem two"', fail: /(?:left|still)[^.]*(?:problem|part) (?:two|2)|(?:problem|part) (?:two|2)[^.]*(?:left|open|unfinished)|molecular formula (?:step|one) (?:left|still)/i },
  { id: 'ap-environmental-science-r1/9', slug: 'ap-environmental-science-r1', step: '9', cls: 'T7', live: 'closing: part (b) "in progress"', fail: /in progress|part \(?b\)?[^.]*(?:left|open|unfinished|pick up)|pick up right there/i },
  { id: 'precalculus-r1/4', slug: 'precalculus-r1', step: '4', cls: 'T7', live: '"But I asked about f(x)" — returned to the solved problem 1', fail: /asked about f|f\s*\(x\)\s*=\s*2x\s*\+\s*6|solv(?:e|ing) x\s*=\s*2y/i },
];

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string, d?: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const DATA = path.resolve(opt('data', path.resolve(__dirname, '../artifacts/gac-1014-replay/data'))!);
const OUT = path.resolve(opt('out', path.resolve(__dirname, '../artifacts/gac-1014-replay'))!);
const ARMS = opt('arms', 'before,after')!.split(',') as Arm[];
const RUNS = Number(opt('runs', '1'));
const ONLY = opt('only');

// ── the record ─────────────────────────────────────────────────────────────

interface Msg { role: 'tutor' | 'student'; text: string; timestamp?: string }
interface Wb { action: string; data: Record<string, unknown>; idx: number }
interface Rec {
  slug: string; sessionId: string; subject: string; topic: string; level: string;
  transcript: Msg[]; wb: Wb[]; currentAt: Array<{ t: string; pos: number }>;
  problems: Array<{ n: number; text: string }>; plan: Record<string, unknown> | null;
}

function load(): Map<string, Rec> {
  const db = JSON.parse(fs.readFileSync(path.join(DATA, 'db-sessions.json'), 'utf8')) as Array<Record<string, any>>;
  const plans = JSON.parse(fs.readFileSync(path.join(DATA, 'plans.json'), 'utf8')) as Array<Record<string, any>>;
  const ids = JSON.parse(fs.readFileSync(path.join(DATA, 'plan-ids.json'), 'utf8')) as Record<string, { plan: string; session: string }>;
  const out = new Map<string, Rec>();
  for (const [slug, v] of Object.entries(ids)) {
    const doc = db.find((d) => d.sessionId === v.session);
    const plan = plans.find((p) => p._id === v.plan) ?? null;
    if (!doc) continue;
    out.set(slug, {
      slug, sessionId: doc.sessionId, subject: doc.subject, topic: doc.topic, level: doc.level,
      transcript: doc.transcript.map((m: any) => ({ role: m.role, text: m.text, timestamp: m.timestamp })),
      wb: (doc.whiteboardCommands ?? []).map((c: any) => ({ action: c.action, data: c.data ?? {}, idx: c.idx })),
      currentAt: (doc.debugEvents ?? []).filter((e: any) => e.type === 'homework_current_problem')
        .map((e: any) => ({ t: e.t, pos: Number(/pos=(\d+)/.exec(e.message)?.[1] ?? 1) })),
      problems: plan?.metadata?.problems ?? [], plan,
    });
  }
  // precalculus-r1: cut short by the provider limit; not persisted. Rebuilt
  // from the driver record (text only, no board), with r3's plan (same typed question).
  const pr1 = path.join(DATA, 'precalculus-r1.json');
  const r3 = out.get('precalculus-r3');
  if (fs.existsSync(pr1) && r3) {
    const d = JSON.parse(fs.readFileSync(pr1, 'utf8'));
    const transcript: Msg[] = [{ role: 'tutor', text: (d.opener?.tutor ?? []).join(' ') }];
    for (const t of d.turns) { transcript.push({ role: 'student', text: t.student }); transcript.push({ role: 'tutor', text: (t.tutor ?? []).join(' ') }); }
    out.set('precalculus-r1', { ...r3, slug: 'precalculus-r1', sessionId: 'precalculus-r1 (driver record)', transcript, wb: [], currentAt: [] });
  }
  return out;
}

/** Transcript index of the k-th student message (k = position in STEPS). */
function turnIndex(r: Rec, step: Step): number {
  const k = STEPS.indexOf(step);
  let seen = -1;
  for (let i = 0; i < r.transcript.length; i++) if (r.transcript[i].role === 'student' && ++seen === k) return i;
  throw new Error(`${r.slug}: no student turn for step ${step}`);
}

// ── request reconstruction ─────────────────────────────────────────────────

async function buildInput(r: Rec, idx: number, arm: Arm, solved: number[]) {
  const { buildSystemPromptParts } = await import('../src/lib/tutor/ai/system-prompt-builder');
  const { WHITEBOARD_TOOLS, SET_CURRENT_PROBLEM_TOOL } = await import('../src/app/tutor/hooks/toolDefinitions');
  const { filterToolsForSubject } = await import('../src/lib/tutor/ai/tool-subject-taxonomy');
  const { allowedSubjectsForTurn } = await import('../src/lib/tutor/ai/prompt-cache');
  const { buildLessonPlanContext } = await import('../src/lib/tutor/lesson-plan/context');
  const { getGradeProfile } = await import('../src/lib/tutor/pedagogy/grade-profile');
  const parts = buildSystemPromptParts({
    module: null, studentName: 'Student', partnerEmbed: true, sessionGoal: 'homework-help', timeRemainingMinutes: 30,
    currentState: 'greeting', subject: r.subject, topic: r.topic, level: r.level, studentPreferences: undefined,
    inputMode: 'text', firstTurnV2: true, answerRevealGuard: true,
  } as Parameters<typeof buildSystemPromptParts>[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lessonPlanContext = r.plan ? buildLessonPlanContext(r.plan as any, 'homework', []) : undefined;
  const student = r.transcript[idx];
  const at = student.timestamp ?? '';
  const current = r.currentAt.filter((c) => !at || c.t < at).pop()?.pos ?? 1;
  const snapshot: Array<Record<string, unknown>> = [];
  let activeStatement = '';
  let pageTitle = '';
  for (const c of r.wb.filter((w) => w.idx < idx)) {
    if (c.action === 'newPage') { pageTitle = String(c.data.title ?? ''); continue; }
    if (!/^show/.test(c.action)) continue;
    const prob = (c.data.problem ?? {}) as Record<string, unknown>;
    const text = String(prob.statement ?? c.data.latex ?? c.data.text ?? c.data.content ?? JSON.stringify(c.data)).slice(0, 400);
    if (c.action === 'showProblem') activeStatement = String(prob.statement ?? text);
    snapshot.push({
      itemId: String(c.data.id ?? `wb-${snapshot.length + 1}`), action: c.action, title: String(c.data.label ?? c.data.title ?? (c.action === 'showProblem' ? 'Problem' : '')),
      pageTitle: pageTitle || undefined, pageId: 'page-1', featureCount: 1, segmentId: 'homework', isOnCurrentPage: true, isOnActivePage: true,
      features: [{ canonical: c.action === 'showProblem' ? 'statement' : 'equation', kind: 'text', description: text }],
    });
  }
  const history = r.transcript.slice(0, idx).filter((m) => m.text.trim())
    .map((m) => ({ role: m.role === 'tutor' ? ('assistant' as const) : ('user' as const), content: m.text }));
  const planId = String(r.plan?._id ?? 'gen-replay');
  const allowed = allowedSubjectsForTurn({ toolScope: 'subject', subject: r.subject, hasPlan: !!r.plan, planId });
  const tools = [...filterToolsForSubject(WHITEBOARD_TOOLS, allowed).tools, SET_CURRENT_PROBLEM_TOOL];
  return {
    systemPrompt: parts.core + parts.session, systemPromptCore: parts.core,
    conversationHistory: history, studentTranscript: student.text, studentMessage: student.text,
    whiteboardSnapshot: snapshot as never[], lessonPlanContext,
    homework: { problems: r.problems, current, ...(arm === 'after' ? { solved } : {}) },
    activeProblem: activeStatement ? { statement: activeStatement } : undefined,
    pacingState: { correctStreak: 0, incorrectStreak: 0, segmentTurns: history.filter((h) => h.role === 'user').length, thresholds: getGradeProfile(r.level).pacingThresholds },
    grade: r.level, tools, allowFallback: false,
    textThinking: true, textTurnShape: true, textVerdictPrecheck: true, textWorkThenMatch: true,
    ...(arm === 'after' ? { noRevealLedger: true } : {}),
  };
}

// ── the ledger the browser would hold at a turn (arm `after`) ──────────────

const usage = { brainIn: 0, brainCacheRead: 0, brainCacheWrite: 0, brainOut: 0, checkIn: 0, checkOut: 0 };

async function ledgerAt(r: Rec, idx: number): Promise<{ solved: number[]; trail: string[] }> {
  const cacheFile = path.join(OUT, 'ledgers.json');
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
  const key = `${r.slug}@${idx}`;
  if (cache[key]) return cache[key];
  const { runVerdictPrecheck } = await import('../src/lib/tutor/voice/verdict-precheck');
  const { toPublicPrecheck } = await import('../src/lib/tutor/voice/verdict-precheck-shared');
  const { classifyTurnShape } = await import('../src/lib/tutor/voice/turn-shape-signal');
  const { recordSolved, solvedPositionFromCheck } = await import('../src/lib/tutor/lesson-plan/homework-ledger');
  let solved: number[] = [];
  const trail: string[] = [];
  for (let i = 0; i < idx; i++) {
    const m = r.transcript[i];
    if (m.role !== 'student') continue;
    const lastTutor = [...r.transcript.slice(0, i)].reverse().find((x) => x.role === 'tutor')?.text ?? '';
    const ts = classifyTurnShape(m.text, lastTutor);
    if (!ts?.answerShaped) continue;
    const at = m.timestamp ?? '';
    const current = r.currentAt.filter((c) => !at || c.t < at).pop()?.pos ?? 1;
    const res = await runVerdictPrecheck({
      problems: r.problems, currentProblem: current, solved,
      history: r.transcript.slice(0, i).map((x) => ({ role: x.role === 'tutor' ? 'assistant' as const : 'user' as const, content: x.text })),
      openQuestion: ts.open?.question ?? null, studentMessage: m.text,
    }, { ledger: true, claimVerdict: true, timeoutMs: 15_000 });
    if (res) { usage.checkIn += res.inputTokens; usage.checkOut += res.outputTokens; }
    const pub = res ? toPublicPrecheck(res) : null;
    const pos = solvedPositionFromCheck(pub, r.problems.length);
    solved = recordSolved(solved, pos, r.problems.length);
    trail.push(`"${m.text.slice(0, 50)}" → ${pub ? `${pub.answers}/${pub.verdict}/${pub.confidence}${pub.solvedProblem ? ` solved=${pub.solvedProblem}` : ''}` : 'no result'}`);
  }
  cache[key] = { solved, trail };
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 1));
  return cache[key];
}

// ── one turn as the student would see it ───────────────────────────────────

interface Pass { sentences: string[]; tools: Array<{ name: string; args: unknown }>; precheck?: Record<string, unknown>; seal?: string; reveal: boolean; error?: string }

async function streamOnce(input: Record<string, unknown>): Promise<Pass> {
  const { streamBrainTurn } = await import('../src/lib/tutor/voice/claude-brain');
  const p: Pass = { sentences: [], tools: [], reveal: false };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for await (const ev of streamBrainTurn(input as any)) {
      const e = ev as Record<string, any>;
      if (e.type === 'sentence') p.sentences.push(String(e.text));
      else if (e.type === 'tool-call') p.tools.push({ name: e.name, args: e.args });
      else if (e.type === 'verdict-precheck') { p.precheck = e.result; p.seal = e.seal; }
      else if (e.type === 'answer-reveal') p.reveal = true;
      else if (e.type === 'done' && e.usage) {
        usage.brainIn += e.usage.inputTokens ?? e.usage.input_tokens ?? 0;
        usage.brainOut += e.usage.outputTokens ?? e.usage.output_tokens ?? 0;
        usage.brainCacheRead += e.usage.cacheReadTokens ?? e.usage.cache_read_input_tokens ?? 0;
        usage.brainCacheWrite += e.usage.cacheCreationTokens ?? e.usage.cache_creation_input_tokens ?? 0;
      }
    }
  } catch (err) { p.error = (err as Error).message.slice(0, 300); }
  return p;
}

async function runTurn(c: Case, r: Rec, arm: Arm) {
  const { classifyTurnShape } = await import('../src/lib/tutor/voice/turn-shape-signal');
  const ps = await import('../src/lib/tutor/voice/verdict-precheck-shared');
  const wtm = await import('../src/lib/tutor/voice/work-then-match');
  const { buildValidatorFeedback } = await import('../src/lib/tutor/orchestrator/validator-feedback');
  const { wholeAnswerRevealFeedback, WHOLE_ANSWER_REVEAL_ACTION } = await import('../src/lib/tutor/voice/whole-answer-reveal');
  const idx = turnIndex(r, c.step);
  const student = r.transcript[idx].text;
  const lastTutor = [...r.transcript.slice(0, idx)].reverse().find((m) => m.role === 'tutor')?.text ?? '';
  const ledger = arm === 'after' ? await ledgerAt(r, idx) : { solved: [], trail: [] };
  const input = await buildInput(r, idx, arm, ledger.solved) as unknown as Record<string, unknown>;
  const first = await streamOnce(input);
  let shown = first;
  let kill: { action: string; reason: string; at: number } | null = null;
  const pc = ps.sanitizePublicPrecheck(first.precheck);
  const ts = classifyTurnShape(student, lastTutor);
  if (first.reveal) kill = { action: WHOLE_ANSWER_REVEAL_ACTION, reason: wholeAnswerRevealFeedback(student), at: first.sentences.length };
  else if (pc && first.sentences.length) {
    const k = ps.precheckOpenerContradiction(pc, first.sentences[0], { enabled: true });
    if (k) kill = { action: 'precheck_verdict_contradiction', reason: ps.precheckContradictionFeedback(k, pc, student), at: 1 };
  }
  let backstop = '';
  if (!kill && wtm.backstopAppliesTo(ts) && first.sentences.length) {
    const b = wtm.applyOpenerBackstop(first.sentences, { answerShaped: ts?.answerShaped === true, canKill: true });
    backstop = b.action;
    if (b.action === 'kill') kill = { action: 'verdict_opener', reason: wtm.openerBackstopFeedback(first.sentences[b.at], student, { nonAnswer: wtm.isNonAnswerShape(ts) }), at: b.at + 1 };
    else shown = { ...first, sentences: b.sentences };
  }
  if (kill) {
    const retry = await streamOnce({
      ...input,
      conversationHistory: [...(input.conversationHistory as unknown[]), { role: 'user', content: student }, { role: 'assistant', content: first.sentences.slice(0, kill.at).join(' ') || '(emitted only tool calls)' }],
      studentTranscript: buildValidatorFeedback({ rejections: [{ action: kill.action, reason: kill.reason }], attemptKilled: true, originalTranscript: student, includeStudentContext: true }),
      studentMessage: undefined,
      ...(first.precheck ? { verdictPrecheckCarry: first.precheck } : {}),
      ...(first.seal ? { verdictPrecheckSeal: first.seal } : {}),
    });
    shown = retry;
    if (wtm.backstopAppliesTo(ts) && retry.sentences.length) shown = { ...retry, sentences: wtm.applyOpenerBackstop(retry.sentences, { answerShaped: ts?.answerShaped === true, canKill: false }).sentences };
  }
  const reply = shown.sentences.join(' ').trim();
  const board = shown.tools.map((t) => JSON.stringify(t.args)).join(' ');
  const failHit = c.fail.exec(`${reply}\n${board}`)?.[0] ?? null;
  const passOk = c.pass ? c.pass.test(reply) : true;
  return {
    id: c.id, cls: c.cls, arm, student, lastTutor: lastTutor.slice(-300), live: c.live,
    ledger: arm === 'after' ? ledger : undefined,
    precheck: pc, firstReply: first.sentences.join(' '), killed: kill?.action ?? null, backstop, revealWithheld: first.reveal || shown.reveal,
    reply, board: board.slice(0, 600), failHit, passOk, clean: !failHit && passOk && !shown.error, error: shown.error ?? first.error,
  };
}

// ── main ───────────────────────────────────────────────────────────────────

function report() {
  const file = path.join(OUT, 'results.jsonl');
  const rows = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  const out: string[] = ['# GAC 10-14 failing turns — offline replay', '', '| case | class | live failure | before (clean/runs) | after (clean/runs) |', '|---|---|---|---|---|'];
  for (const c of CASES) {
    const cell = (arm: Arm) => { const rs = rows.filter((x) => x.id === c.id && x.arm === arm); return rs.length ? `${rs.filter((x) => x.clean).length}/${rs.length}` : '—'; };
    out.push(`| ${c.id} | ${c.cls} | ${c.live} | ${cell('before')} | ${cell('after')} |`);
  }
  out.push('');
  for (const x of rows) {
    out.push(`## ${x.id} · ${x.arm} · ${x.clean ? 'CLEAN' : 'FAIL'}${x.failHit ? ` (hit: "${x.failHit}")` : ''}${x.passOk ? '' : ' (claim not corrected)'}`);
    out.push(`- student: ${x.student}`);
    if (x.precheck) out.push(`- check: ${x.precheck.answers}/${x.precheck.verdict}/${x.precheck.confidence}${x.precheck.solvedProblem ? ` solved=${x.precheck.solvedProblem}` : ''}`);
    if (x.ledger) out.push(`- ledger: [${x.ledger.solved.join(',')}] ← ${x.ledger.trail.join(' · ')}`);
    if (x.killed) out.push(`- killed first attempt (${x.killed}): ${x.firstReply}`);
    out.push(`- shown: ${x.reply}`);
    if (x.board) out.push(`- board: ${x.board}`);
    out.push('');
  }
  fs.writeFileSync(path.join(OUT, 'report.md'), out.join('\n'));
  console.log(out.slice(0, CASES.length + 4).join('\n'));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (flag('report')) { report(); return; }
  const recs = load();
  const cases = CASES.filter((c) => !ONLY || c.id.includes(ONLY));
  if (flag('list')) {
    for (const c of cases) { const r = recs.get(c.slug); console.log(`${c.id} [${c.cls}] ${r ? `"${r.transcript[turnIndex(r, c.step)].text.slice(0, 70)}"` : 'NO RECORD'}`); }
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is required');
  const file = path.join(OUT, 'results.jsonl');
  const done = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  for (const c of cases) {
    const r = recs.get(c.slug);
    if (!r) { console.warn(`skip ${c.id}: no record`); continue; }
    for (const arm of ARMS) {
      const have = done.filter((x) => x.id === c.id && x.arm === arm).length;
      for (let k = have; k < RUNS; k++) {
        const quiet = { log: console.log, warn: console.warn };
        console.log = () => {}; console.warn = () => {};
        let row;
        try { row = await runTurn(c, r, arm); } finally { console.log = quiet.log; console.warn = quiet.warn; }
        fs.appendFileSync(file, JSON.stringify(row) + '\n');
        console.log(`${c.id} ${arm} #${k + 1}: ${row.clean ? 'CLEAN' : 'FAIL'}${row.failHit ? ` hit="${row.failHit}"` : ''}${row.killed ? ` (retry after ${row.killed})` : ''} — ${row.reply.slice(0, 160)}`);
      }
    }
  }
  fs.appendFileSync(path.join(OUT, 'usage.jsonl'), JSON.stringify({ at: new Date().toISOString(), ...usage }) + '\n');
  console.log('usage this invocation:', JSON.stringify(usage));
  report();
}

main().catch((err) => { console.error(err); process.exit(1); });
