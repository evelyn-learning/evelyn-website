/**
 * Tutor brain v2 — one turn over SSE (docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md).
 *
 * The server is stateless: the client sends the session's state (history,
 * note, goal statuses, board record) with each turn and gets the next state
 * back in the `done` event. Events, in order:
 *   { type: 'text', delta }                       the tutor's words as they are written
 *   { type: 'tool-call', id, name, args, outcome } each tool call once settled
 *   { type: 'done', spoken, state, usage, firstTextMs, totalMs }
 *   { type: 'error', message }
 */
import { NextRequest } from 'next/server';
import { V2_BACKGROUND_LINE_CHARS, V2_BACKGROUND_MAX_LINES } from '@/lib/tutor/v2/background';
import { denyIfNoDemoAccess } from '@/lib/tutor/demo-gate/enforce';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { embedTokenPartnerClaim } from '@/lib/tutor/portal/embed-token';
import { readHomeworkState, v2HomeworkFor, v2SheetFor } from '@/lib/tutor/v2/homework';
import { runV2HomeworkTurn, runV2SheetTurn } from '@/lib/tutor/v2/homework-turn';
import { runV2Turn } from '@/lib/tutor/v2/turn';
import type { V2Session, V2State, V2ToolCall } from '@/lib/tutor/v2/types';

export const runtime = 'nodejs';

const SSE_HEADERS = { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' };
const MAX_STUDENT_CHARS = 8000;

interface TurnBody {
  session?: { studentName?: unknown; subject?: unknown; level?: unknown; mode?: unknown; timeBoxMinutes?: unknown; lessonPlanId?: unknown; topic?: unknown; background?: unknown; teacher?: unknown; trial?: unknown };
  state?: unknown;
  studentSaid?: unknown;
  silenceSeconds?: unknown;
  resumed?: unknown;
  timeCheck?: unknown;
}

const bad = (message: string) => new Response(JSON.stringify({ error: message }), { status: 400, headers: { 'Content-Type': 'application/json' } });

function readState(raw: unknown): V2State | null {
  const s = raw as Partial<V2State> | null;
  if (!s || typeof s !== 'object') return null;
  if (!Array.isArray(s.history) || typeof s.note !== 'string' || typeof s.goals !== 'object' || s.goals === null) return null;
  if (!s.board || !Array.isArray(s.board.pages) || typeof s.board.current !== 'number') return null;
  if (typeof s.startedAtMs !== 'number' || !Number.isFinite(s.startedAtMs)) return null;
  const gaps = Array.isArray(s.gaps) ? s.gaps.filter((g) => g && typeof g.what === 'string' && typeof g.status === 'string').slice(-12) : undefined;
  const homework = readHomeworkState(s.homework);
  const t = s.thinking as Partial<NonNullable<V2State['thinking']>> | undefined;
  const strs = (x: unknown, n: number) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string').slice(-n) : []);
  const thinking = t && typeof t === 'object' ? {
    position: typeof t.position === 'string' ? t.position.slice(0, 300) : '', weighed: strs(t.weighed, 12), shifts: strs(t.shifts, 6),
    ...(typeof t.example === 'string' ? { example: t.example.slice(0, 240) } : {}),
    ...(typeof t.direction === 'string' ? { direction: t.direction.slice(0, 240) } : {}),
    ...(t.justComplicated === true ? { justComplicated: true } : {}),
    ...(t.steered === true ? { steered: true } : {}),
    ...(typeof t.theirMinutes === 'number' && Number.isFinite(t.theirMinutes) ? { theirMinutes: Math.min(60, Math.max(2, Math.round(t.theirMinutes))) } : {}),
    ...(typeof t.complications === 'number' && Number.isFinite(t.complications) ? { complications: Math.min(20, Math.max(0, Math.round(t.complications))) } : {}),
  } : undefined;
  // What the board has shown of the plan (turn.ts). Left out of this list, both were dropped between turns: the
  // phases never followed the board and a plan problem's card was never found again (AP Statistics, portal-b8ee9d0f).
  const map = <T,>(x: unknown, ok: (v: unknown) => v is T): Record<string, T> | undefined => { if (!x || typeof x !== 'object' || Array.isArray(x)) return undefined; const out = Object.fromEntries(Object.entries(x as Record<string, unknown>).filter((e): e is [string, T] => ok(e[1])).slice(0, 60)); return Object.keys(out).length ? out : undefined; };
  const problemCards = map(s.problemCards, (v): v is string => typeof v === 'string' && v.length < 80);
  const partsSeen = map(s.partsSeen, (v): v is number => typeof v === 'number' && Number.isFinite(v));
  const ownKeys = map(s.ownKeys, (v): v is string => typeof v === 'string' && v.length <= 800);
  const ak = s.askedKey as { q?: unknown; key?: unknown } | undefined;
  const askedKey = ak && typeof ak === 'object' && typeof ak.q === 'string' && typeof ak.key === 'string' && ak.key ? { q: ak.q.slice(0, 200), key: ak.key.slice(0, 800) } : undefined;
  return { ...(problemCards ? { problemCards } : {}), ...(partsSeen ? { partsSeen } : {}), ...(ownKeys ? { ownKeys } : {}), ...(askedKey ? { askedKey } : {}), history: s.history, note: s.note, goals: s.goals, ...(gaps ? { gaps } : {}), ...(thinking ? { thinking } : {}), board: s.board, startedAtMs: s.startedAtMs, closed: s.closed === true, ...(typeof s.closeSummary === 'string' ? { closeSummary: s.closeSummary } : {}), ...(homework ? { homework } : {}) };
}

export async function POST(req: NextRequest) {
  const denied = await denyIfNoDemoAccess(req, 'brain-stream');
  if (denied) return denied;

  let body: TurnBody;
  try { body = (await req.json()) as TurnBody; } catch { return bad('Invalid JSON body'); }
  const cfg = body.session ?? {};
  if (typeof cfg.subject !== 'string' || !cfg.subject || typeof cfg.level !== 'string') return bad('session.subject and session.level are required');
  const state = readState(body.state);
  if (!state) return bad('state is missing or malformed');
  if (state.closed) return bad('the session is closed');
  const studentSaid = body.studentSaid === null || body.studentSaid === undefined ? null : typeof body.studentSaid === 'string' ? body.studentSaid.slice(0, MAX_STUDENT_CHARS) : undefined;
  if (studentSaid === undefined) return bad('studentSaid must be a string or null');

  const plan = typeof cfg.lessonPlanId === 'string' && cfg.lessonPlanId ? await getLessonPlan(cfg.lessonPlanId) : null;
  // Homework mode (v2/homework.ts): a one-problem homework plan. The key is read here and goes only to the checker.
  // The partner claim is unverified, as v1 reads it: a forged claim only makes the forger's own tutor stricter.
  const partnerClaim = embedTokenPartnerClaim(req.headers.get('x-embed-token'));
  const homework = plan ? await v2HomeworkFor(cfg.lessonPlanId as string, partnerClaim, { getPlan: async () => plan }) : null;
  // Whole-sheet homework: a homework-help plan with the sheet's problems; each problem's key from its build.
  const homeworkSheet = plan && !homework ? await v2SheetFor(plan as { id?: string; metadata?: Record<string, unknown> }, partnerClaim) : null;
  const t = (cfg.teacher && typeof cfg.teacher === 'object' ? cfg.teacher : {}) as { name?: unknown; nameIsRole?: unknown; style?: unknown };
  const teacher = typeof t.name === 'string' && t.name.trim() ? { name: t.name.trim().slice(0, 80), ...(t.nameIsRole === true ? { nameIsRole: true } : {}), ...(typeof t.style === 'string' && t.style.trim() ? { style: t.style.trim().slice(0, 600) } : {}) } : null;
  const background = Array.isArray(cfg.background) ? cfg.background.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, V2_BACKGROUND_MAX_LINES).map((x) => x.trim().slice(0, V2_BACKGROUND_LINE_CHARS)) : [];
  const session: V2Session = {
    studentName: typeof cfg.studentName === 'string' ? cfg.studentName.slice(0, 80) : undefined,
    subject: cfg.subject.slice(0, 60),
    level: cfg.level.slice(0, 60),
    mode: cfg.mode === 'voice' ? 'voice' : 'text',
    ...(typeof cfg.timeBoxMinutes === 'number' && cfg.timeBoxMinutes > 0 ? { timeBoxMinutes: Math.min(180, Math.round(cfg.timeBoxMinutes)) } : {}),
    ...(background.length ? { background } : {}),
    ...(teacher ? { teacher } : {}),
    ...(cfg.trial === true ? { trial: true } : {}),
    ...(!plan && typeof cfg.topic === 'string' && cfg.topic.trim() ? { topic: cfg.topic.trim().slice(0, 160) } : {}),
    ...(plan ? { plan, topic: `${(plan as { topic?: string }).topic ?? ''} ${(plan as { title?: string }).title ?? ''}`.trim().slice(0, 160) } : {}),
    ...(homework ? { homework: homework.problem } : {}),
    ...(homeworkSheet ? { homeworkSheet: homeworkSheet.sheet } : {}),
  };
  const silenceSeconds = typeof body.silenceSeconds === 'number' && body.silenceSeconds > 0 ? body.silenceSeconds : undefined;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // A client that has gone (interrupted turn, closed tab) is not an error: stop writing, stop the model.
      const send = (event: Record<string, unknown>) => { if (req.signal.aborted) return; try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); } catch { /* stream already closed */ } };
      try {
        const facts = { ...(silenceSeconds ? { silenceSeconds } : {}), ...(body.resumed === true ? { resumed: true } : {}), ...(body.timeCheck === true ? { timeCheck: true } : {}) };
        const turnInput = {
          session, state, studentSaid, signal: req.signal,
          ...(Object.keys(facts).length ? { facts } : {}),
          onText: (delta: string) => send({ type: 'text', delta }),
          onBoardOpen: () => send({ type: 'board-open' }),
          onBoardWithdraw: (id: string) => send({ type: 'board-withdraw', id }),
          onToolCall: (call: V2ToolCall) => send({ type: 'tool-call', ...call }),
        };
        // Homework mode (v2/homework.ts): the answer is checked against the key before the model is called, and
        // the browser records each verdict as the debug event the academy's outcome route reads.
        const logFrame = (f: { type: string; part?: string; verdict?: string; n?: number }) => console.log(`[brain-v2] homework: ${f.type}${f.part !== undefined ? ` part ${f.part} ${f.verdict}` : ''}${f.n !== undefined ? ` problem ${f.n}` : ''}`);
        const r = homework
          ? await runV2HomeworkTurn({ ...turnInput, resolved: homework, onHomeworkFrame: (f) => { send(f); logFrame(f); } })
          : homeworkSheet
          ? await runV2SheetTurn({ ...turnInput, resolvedSheet: homeworkSheet, onHomeworkFrame: (f) => { send(f); logFrame(f); } })
          : await runV2Turn(turnInput);
        console.log(`[brain-v2] student="${(studentSaid ?? '(none)').slice(0, 80)}" → tools=[${r.toolCalls.map((t) => t.name).join(', ') || '(none)'}] · calls=${r.modelCalls} · first=${r.firstTextMs}ms total=${r.totalMs}ms · in=${r.usage.inputTokens} out=${r.usage.outputTokens} cr=${r.usage.cacheReadTokens} cc=${r.usage.cacheCreationTokens}`);
        send({ type: 'done', spoken: r.spoken, state: r.state, usage: r.usage, firstTextMs: r.firstTextMs, totalMs: r.totalMs });
      } catch (err) {
        if (req.signal.aborted) { console.log('[brain-v2] turn cancelled by the client'); return; }
        console.error('[brain-v2] error:', err);
        send({ type: 'error', message: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });
  return new Response(stream, { headers: SSE_HEADERS });
}
