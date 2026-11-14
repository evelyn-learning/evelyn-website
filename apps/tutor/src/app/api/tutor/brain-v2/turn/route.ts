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
import { readHomeworkState, v2HomeworkFor } from '@/lib/tutor/v2/homework';
import { runV2HomeworkTurn } from '@/lib/tutor/v2/homework-turn';
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
  return { history: s.history, note: s.note, goals: s.goals, ...(gaps ? { gaps } : {}), board: s.board, startedAtMs: s.startedAtMs, closed: s.closed === true, ...(typeof s.closeSummary === 'string' ? { closeSummary: s.closeSummary } : {}), ...(homework ? { homework } : {}) };
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
  const homework = plan ? await v2HomeworkFor(cfg.lessonPlanId as string, embedTokenPartnerClaim(req.headers.get('x-embed-token')), { getPlan: async () => plan }) : null;
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
  };
  const silenceSeconds = typeof body.silenceSeconds === 'number' && body.silenceSeconds > 0 ? body.silenceSeconds : undefined;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // A client that has gone (interrupted turn, closed tab) is not an error: stop writing, stop the model.
      const send = (event: Record<string, unknown>) => { if (req.signal.aborted) return; try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); } catch { /* stream already closed */ } };
      try {
        const facts = { ...(silenceSeconds ? { silenceSeconds } : {}), ...(body.resumed === true ? { resumed: true } : {}) };
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
        const r = homework
          ? await runV2HomeworkTurn({ ...turnInput, resolved: homework, onHomeworkFrame: (f) => {
            send(f);
            if (f.type === 'homework-problem-done') console.log('[brain-v2] homework: every part confirmed — homework-problem-done');
            else console.log(`[brain-v2] homework check: part ${f.part} ${f.verdict}`);
          } })
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
