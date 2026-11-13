/**
 * Tutor brain v2 — the browser's side of one turn: POST the state, read the
 * SSE events (api/tutor/brain-v2/turn). No React and no DOM beyond fetch, so
 * it is unit-tested with a stub fetch.
 */
import type { V2State, V2ToolCall } from './types';

export interface V2ClientSession {
  studentName?: string;
  subject: string;
  level: string;
  mode: 'text' | 'voice';
  timeBoxMinutes?: number;
  lessonPlanId?: string;
  /** What the student asked to learn, when there is no lesson plan (a topic typed on the demo page, a partner's free practice). */
  topic?: string;
  teacher?: { name: string; nameIsRole?: boolean; style?: string };
  trial?: boolean;
}

export interface V2TurnDone {
  spoken: string;
  state: V2State;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number; model?: string };
  firstTextMs: number | null;
  totalMs: number;
}

export interface V2TurnRequest {
  session: V2ClientSession;
  state: V2State;
  studentSaid: string | null;
  silenceSeconds?: number;
  embedToken?: string;
  signal?: AbortSignal;
  onText?: (delta: string) => void;
  onToolCall?: (call: V2ToolCall) => void;
  onBoardOpen?: () => void;
  onBoardWithdraw?: (id: string) => void;
  fetchImpl?: typeof fetch;
}

/** Runs one turn. Resolves with the `done` event; rejects on an HTTP error, an `error` event or a stream that ends without `done`. */
export async function streamV2Turn(req: V2TurnRequest): Promise<V2TurnDone> {
  const doFetch = req.fetchImpl ?? fetch;
  const res = await doFetch('/api/tutor/brain-v2/turn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(req.embedToken ? { 'x-embed-token': req.embedToken } : {}) },
    body: JSON.stringify({ session: req.session, state: req.state, studentSaid: req.studentSaid, ...(req.silenceSeconds ? { silenceSeconds: req.silenceSeconds } : {}) }),
    signal: req.signal,
  });
  if (!res.ok || !res.body) {
    let detail = '';
    try { detail = ((await res.json()) as { error?: string }).error ?? ''; } catch { /* not JSON */ }
    throw new Error(`tutor turn failed (${res.status})${detail ? `: ${detail}` : ''}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buf = '';
  let done: V2TurnDone | null = null;
  const handle = (frame: string) => {
    for (const line of frame.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const ev = JSON.parse(line.slice(6)) as { type: string } & Record<string, unknown>;
      if (ev.type === 'text' && typeof ev.delta === 'string') req.onText?.(ev.delta);
      else if (ev.type === 'board-open') req.onBoardOpen?.();
      else if (ev.type === 'board-withdraw' && typeof ev.id === 'string') req.onBoardWithdraw?.(ev.id);
      else if (ev.type === 'tool-call') req.onToolCall?.(ev as unknown as V2ToolCall);
      else if (ev.type === 'done') done = ev as unknown as V2TurnDone;
      else if (ev.type === 'error') throw new Error(typeof ev.message === 'string' ? ev.message : 'tutor turn failed');
    }
  };
  for (;;) {
    const { value, done: end } = await reader.read();
    if (value) buf += decoder.decode(value, { stream: true });
    let i: number;
    while ((i = buf.indexOf('\n\n')) >= 0) { const frame = buf.slice(0, i); buf = buf.slice(i + 2); handle(frame); }
    if (end) break;
  }
  if (buf.trim()) handle(buf);
  if (!done) throw new Error('tutor turn ended without a result');
  return done;
}

/** Board tool calls that painted are the ones the whiteboard should draw. */
export function paintsOnBoard(call: V2ToolCall, controlToolNames: ReadonlySet<string>): boolean {
  return !controlToolNames.has(call.name) && !/^not (?:painted|opened)/.test(call.outcome);
}
