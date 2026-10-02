/**
 * Behavioural pin for the shared prompt cache at the ROUTE level: the brain
 * route is invoked directly (mock request) and the model call is captured by
 * a local fake endpoint, so the test runs hermetically and reads the exact
 * `system` array the route sends.
 *
 *   1. split parts, flag on  → two system blocks whose texts concatenate to
 *      core + session (the shared entry is the first block)
 *   2. split parts, flag off → one block, text === core + session
 *   3. legacy `systemPrompt` → one block (old tabs keep working)
 *   4. toolScope 'full' + subject → every tool is sent
 *
 * The fake endpoint is a non-native base URL, so cache_control markers are
 * stripped by prepareParams before they reach it; marker placement is pinned
 * at the helper level (test-prompt-cache.ts). Run: npx tsx scripts/test-brain-route-cache-blocks.ts
 */
import * as http from 'node:http';
import { unsetServerOnlyPromptFlags } from './fixtures/browser-env';

type Captured = { system?: Array<{ type: string; text: string; cache_control?: unknown }>; tools?: Array<{ name: string }> };

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function fakeAnthropic(captured: Captured[]): Promise<http.Server> {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      captured.push(JSON.parse(body) as Captured);
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.write(sse('message_start', { type: 'message_start', message: { id: 'msg_test', type: 'message', role: 'assistant', model: 'fake', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 1 } } }));
      res.write(sse('content_block_start', { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }));
      res.write(sse('content_block_delta', { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Hi there, Alex.' } }));
      res.write(sse('content_block_stop', { type: 'content_block_stop', index: 0 }));
      res.write(sse('message_delta', { type: 'message_delta', delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 4 } }));
      res.write(sse('message_stop', { type: 'message_stop' }));
      res.end();
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function drain(res: Response): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) return;
  while (!(await reader.read()).done) { /* consume */ }
}

async function main() {
  const captured: Captured[] = [];
  const server = await fakeAnthropic(captured);
  const port = (server.address() as { port: number }).port;
  // Env BEFORE the route import: the registry resolves targets at load time.
  unsetServerOnlyPromptFlags();
  process.env.TUTOR_DEMO_GATE = 'off';
  process.env.TUTOR_MODEL_BRAIN_BASE_URL = `http://127.0.0.1:${port}`;
  process.env.TUTOR_MODEL_BRAIN_API_KEY = 'sk-test-not-used';
  process.env.ANTHROPIC_API_KEY ||= 'sk-ant-test-not-used';
  delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;
  process.env.TUTOR_TOOL_SUBJECT_FILTER = 'true';
  delete process.env.TUTOR_SHARED_PROMPT_CACHE;

  const { POST } = await import('../src/app/api/tutor/brain/stream/route');
  const { buildSystemPromptParts } = await import('@/lib/tutor/ai/system-prompt-builder');
  const { WHITEBOARD_TOOLS } = await import('@/app/tutor/hooks/toolDefinitions');
  const { PROMPT_MATRIX } = await import('./fixtures/system-prompt-matrix');
  const parts = buildSystemPromptParts(PROMPT_MATRIX.math_g8);
  const full = parts.core + parts.session;
  const base = { studentTranscript: 'hello', conversationHistory: [], whiteboardSnapshot: [], whiteboardPages: [] };
  const mockReq = (body: unknown) => ({ json: async () => body, headers: new Headers() });
  const call = async (body: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await POST(mockReq({ ...base, ...body }) as any);
    await drain(res as unknown as Response);
    return captured[captured.length - 1];
  };
  const checks: Array<[string, boolean]> = [];

  const a = await call({ systemPromptCore: parts.core, systemPromptSession: parts.session });
  checks.push(['split parts + flag on → two system blocks', a.system?.length === 2]);
  checks.push(['first block is core, blocks concatenate to core + session', a.system?.[0]?.text === parts.core && (a.system ?? []).map((b) => b.text).join('') === full]);

  process.env.TUTOR_SHARED_PROMPT_CACHE = 'off';
  const b = await call({ systemPromptCore: parts.core, systemPromptSession: parts.session });
  checks.push(['flag off → one block', b.system?.length === 1]);
  checks.push(['flag off → block text === core + session', b.system?.[0]?.text === full]);
  delete process.env.TUTOR_SHARED_PROMPT_CACHE;

  const c = await call({ systemPrompt: full });
  checks.push(['legacy systemPrompt → one block', c.system?.length === 1 && c.system[0].text === full]);

  const plan = {
    plan: { id: 'evelyn.math.test', title: 'Test plan', grade: '8', subject: 'math', los: [{ id: 'lo1', description: 'Solve linear equations' }], estimatedMinutes: 20 },
    currentSegmentId: 's1',
    currentSegment: { id: 's1', kind: 'concept', text: 'Intro' },
    segmentIndex: [{ id: 's1', kind: 'concept' }],
    completedSegmentIds: [],
  };
  const d = await call({ systemPromptCore: parts.core, systemPromptSession: parts.session, subject: 'math', toolScope: 'full', lessonPlanContext: plan });
  checks.push(['toolScope full + trusted plan → every tool sent (latch wins)', d.tools?.length === WHITEBOARD_TOOLS.length]);
  const e = await call({ systemPromptCore: parts.core, systemPromptSession: parts.session, subject: 'math', toolScope: 'subject', lessonPlanContext: plan });
  checks.push(['toolScope subject + trusted plan → filtered list', (e.tools?.length ?? 0) > 0 && (e.tools?.length ?? 0) < WHITEBOARD_TOOLS.length]);

  server.close();
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  console.log(`${checks.length - fail}/${checks.length} passed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
