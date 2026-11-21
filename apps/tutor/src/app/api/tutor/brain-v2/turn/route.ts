/**
 * Tutor brain v2 — one turn over SSE (docs/superpowers/specs/2026-11-09-tutor-brain-v2-design.md).
 *
 * The server is stateless: the client sends the session's state (history,
 * note, goal statuses, board record) with each turn and gets the next state
 * back in the `done` event. Events, in order:
 *   { type: 'text', delta }                       the tutor's words as they are written
 *   { type: 'tool-call', id, name, args, outcome } each tool call once settled
 *   { type: 'done', spoken, state, usage, firstTextMs, totalMs, events? }   events: Task 7q's session debug events
 *   { type: 'error', message }
 */
import { NextRequest } from 'next/server';
import { V2_BACKGROUND_LINE_CHARS, V2_BACKGROUND_MAX_LINES } from '@/lib/tutor/v2/background';
import { denyIfNoDemoAccess } from '@/lib/tutor/demo-gate/enforce';
import { getLessonPlan } from '@/lib/tutor/lesson-plan/store';
import { embedTokenPartnerClaim } from '@/lib/tutor/portal/embed-token';
import { resolvePartnerSessionOptions } from '@/lib/tutor/portal/partner-session-options';
import { v2HomeworkFor, v2SheetFor } from '@/lib/tutor/v2/homework';
import { runV2HomeworkTurn, runV2SheetTurn } from '@/lib/tutor/v2/homework-turn';
import { runV2Turn } from '@/lib/tutor/v2/turn';
import { v2HeardForBrain } from '@/lib/tutor/v2/heard';
import { TUTOR_PRONUNCIATION_ASSESS, TUTOR_WORKING_LEVEL } from '@/lib/tutor/orchestrator/flags';
import { parseTutorLanguages } from '@/lib/tutor/voice/tts-language';
import type { V2Session, V2State, V2ToolCall } from '@/lib/tutor/v2/types';
import { v2ScopeCarried } from '@/lib/tutor/v2/state-carry';
import { v2ReadClientState } from '@/lib/tutor/v2/client-state';

export const runtime = 'nodejs';

const SSE_HEADERS = { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' };
const MAX_STUDENT_CHARS = 8000;

interface TurnBody {
  session?: { studentName?: unknown; subject?: unknown; level?: unknown; mode?: unknown; languages?: unknown; timeBoxMinutes?: unknown; wrapMinutes?: unknown; lessonPlanId?: unknown; topic?: unknown; background?: unknown; teacher?: unknown; trial?: unknown; levelCheck?: unknown; pronunciation?: unknown };
  state?: unknown;
  studentSaid?: unknown;
  silenceSeconds?: unknown;
  resumed?: unknown;
  timeCheck?: unknown;
  roomVoices?: unknown;
}

const bad = (message: string) => new Response(JSON.stringify({ error: message }), { status: 400, headers: { 'Content-Type': 'application/json' } });

export async function POST(req: NextRequest) {
  const denied = await denyIfNoDemoAccess(req, 'brain-stream');
  if (denied) return denied;

  let body: TurnBody;
  try { body = (await req.json()) as TurnBody; } catch { return bad('Invalid JSON body'); }
  const cfg = body.session ?? {};
  if (typeof cfg.subject !== 'string' || !cfg.subject || typeof cfg.level !== 'string') return bad('session.subject and session.level are required');
  const state = v2ReadClientState(body.state);
  if (!state) return bad('state is missing or malformed');
  if (state.closed) return bad('the session is closed');
  const saidRaw = body.studentSaid === null || body.studentSaid === undefined ? null : typeof body.studentSaid === 'string' ? body.studentSaid.slice(0, MAX_STUDENT_CHARS) : undefined;
  if (saidRaw === undefined) return bad('studentSaid must be a string or null');
  // Recogniser noise in a spoken lesson reaches the brain as "nothing could be made out", never as the student's words
  // (heard.ts v2HeardForBrain; Task 6e: 5,000 characters of 、 and 号 went into the history as one student line).
  const studentSaid = v2HeardForBrain(saidRaw, cfg.mode === 'voice' ? 'voice' : 'text');

  const plan = typeof cfg.lessonPlanId === 'string' && cfg.lessonPlanId ? await getLessonPlan(cfg.lessonPlanId) : null;
  // Homework mode (v2/homework.ts): a one-problem homework plan. The key is read here and goes only to the checker.
  // The partner claim is unverified, as v1 reads it: a forged claim only makes the forger's own tutor stricter.
  const partnerClaim = embedTokenPartnerClaim(req.headers.get('x-embed-token'));
  const homework = plan ? await v2HomeworkFor(cfg.lessonPlanId as string, partnerClaim, { getPlan: async () => plan }) : null;
  // Whole-sheet homework: a homework-help plan with the sheet's problems; each problem's key from its build.
  const homeworkSheet = plan && !homework ? await v2SheetFor(plan as { id?: string; metadata?: Record<string, unknown> }, partnerClaim) : null;
  const t = (cfg.teacher && typeof cfg.teacher === 'object' ? cfg.teacher : {}) as { name?: unknown; nameIsRole?: unknown; style?: unknown; intro?: unknown; background?: unknown };
  const teacher = typeof t.name === 'string' && t.name.trim() ? { name: t.name.trim().slice(0, 80), ...(t.nameIsRole === true ? { nameIsRole: true } : {}), ...(typeof t.style === 'string' && t.style.trim() ? { style: t.style.trim().slice(0, 600) } : {}), ...(typeof t.intro === 'string' && t.intro.trim() ? { intro: t.intro.trim().slice(0, 400) } : {}), ...(typeof t.background === 'string' && t.background.trim() ? { background: t.background.trim().slice(0, 1200) } : {}) } : null;
  const background = Array.isArray(cfg.background) ? cfg.background.filter((x): x is string => typeof x === 'string' && !!x.trim()).slice(0, V2_BACKGROUND_MAX_LINES).map((x) => x.trim().slice(0, V2_BACKGROUND_LINE_CHARS)) : [];
  // The teaching languages, English first, only those the voice can speak and hear (tts-language.ts); none ⇒ English only.
  const languages = parseTutorLanguages(cfg.languages);
  const session: V2Session = {
    studentName: typeof cfg.studentName === 'string' ? cfg.studentName.slice(0, 80) : undefined,
    subject: cfg.subject.slice(0, 60),
    level: cfg.level.slice(0, 60),
    mode: cfg.mode === 'voice' ? 'voice' : 'text',
    ...(languages ? { languages: [...languages] } : {}),
    ...(typeof cfg.timeBoxMinutes === 'number' && cfg.timeBoxMinutes > 0 ? { timeBoxMinutes: Math.min(180, Math.round(cfg.timeBoxMinutes)) } : {}),
    // The wrap minute counts only inside a box (time-box.ts).
    ...(typeof cfg.timeBoxMinutes === 'number' && typeof cfg.wrapMinutes === 'number' && cfg.wrapMinutes > 0 && cfg.wrapMinutes < cfg.timeBoxMinutes ? { wrapMinutes: Math.round(cfg.wrapMinutes) } : {}),
    ...(background.length ? { background } : {}),
    ...(teacher ? { teacher } : {}),
    ...(cfg.trial === true ? { trial: true } : {}),
    // Unverified claim, as homework reads it: a forged one only keeps the forger's own trial on its plan.
    ...(cfg.trial === true && resolvePartnerSessionOptions({ partnerId: partnerClaim }).trialKeepsPlan ? { trialKeepsPlan: true } : {}),
    // The client's claim, as v1's brain route reads `levelCheck`: a forged one only levels the forger's own lesson.
    ...(cfg.levelCheck === true && TUTOR_WORKING_LEVEL ? { levelCheck: true } : {}),
    // The client's claim too: a forged one only arms recordings the assess route then refuses (it checks the session's
    // partner), and an unmeasured reply is said to be unmeasured.
    ...(cfg.pronunciation === true && TUTOR_PRONUNCIATION_ASSESS ? { pronunciation: true } : {}),
    ...(!plan && typeof cfg.topic === 'string' && cfg.topic.trim() ? { topic: cfg.topic.trim().slice(0, 160) } : {}),
    ...(plan ? { plan, topic: `${(plan as { topic?: string }).topic ?? ''} ${(plan as { title?: string }).title ?? ''}`.trim().slice(0, 160) } : {}),
    ...(homework ? { homework: homework.problem } : {}),
    ...(homeworkSheet ? { homeworkSheet: homeworkSheet.sheet } : {}),
  };
  // Task 7a fix round 2: what the turn wrote for the next turn is kept for spoken plan-led lessons only (state-carry.ts).
  v2ScopeCarried(state, session);
  const silenceSeconds = typeof body.silenceSeconds === 'number' && body.silenceSeconds > 0 ? body.silenceSeconds : undefined;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // A client that has gone (interrupted turn, closed tab) is not an error: stop writing, stop the model.
      const send = (event: Record<string, unknown>) => { if (req.signal.aborted) return; try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); } catch { /* stream already closed */ } };
      try {
        const facts = { ...(silenceSeconds ? { silenceSeconds } : {}), ...(body.resumed === true ? { resumed: true } : {}), ...(body.timeCheck === true ? { timeCheck: true } : {}), ...(typeof body.roomVoices === 'number' && body.roomVoices > 0 ? { roomVoices: Math.min(99, Math.round(body.roomVoices)) } : {}) };
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
        send({ type: 'done', spoken: r.spoken, state: r.state, usage: r.usage, firstTextMs: r.firstTextMs, totalMs: r.totalMs, ...(r.events?.length ? { events: r.events } : {}) });
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
