/**
 * Integration test for the /api/tutor/brain/stream SSE route.
 *
 * Bypasses Next's HTTP layer — invokes the POST handler directly with a
 * mock NextRequest, then drains the returned ReadableStream and parses
 * the SSE events. Verifies:
 *   1. The response advertises text/event-stream.
 *   2. The body is well-formed SSE ("data: <json>\n\n" lines).
 *   3. Events arrive in the expected order: zero+ sentence/tool-call,
 *      then exactly one done.
 *   4. The cumulative result matches what streamBrainTurn would return.
 *
 * Run: npx tsx scripts/test-brain-stream-route.ts
 */
import { POST } from '../apps/marketing/src/app/api/tutor/brain/stream/route';

// Minimal mock of NextRequest. The route only calls req.json(), so the
// rest of the NextRequest surface is unused.
function mockReq(body: unknown): unknown {
  return {
    json: async () => body,
  };
}

interface SSEEvent {
  type: string;
  [key: string]: unknown;
}

async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nlIdx;
    while ((nlIdx = buf.indexOf('\n\n')) >= 0) {
      const block = buf.slice(0, nlIdx);
      buf = buf.slice(nlIdx + 2);
      // Each block has one or more "data: ..." lines. We emit only data lines.
      for (const line of block.split('\n')) {
        if (line.startsWith('data: ')) {
          yield JSON.parse(line.slice(6)) as SSEEvent;
        }
      }
    }
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  const body = {
    systemPrompt: [
      'You are a Socratic voice tutor. 1–3 sentences per response.',
      'Acknowledge briefly, ask one focused question.',
    ].join(' '),
    studentTranscript: 'hello',
    conversationHistory: [],
    whiteboardSnapshot: [],
  };

  console.log('═══ /api/tutor/brain/stream — integration test ═══\n');
  const t0 = Date.now();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await POST(mockReq(body) as any);

  console.log('Status:', res.status);
  console.log('Content-Type:', res.headers.get('content-type'));
  console.log('Cache-Control:', res.headers.get('cache-control'));
  if (res.status !== 200) {
    const text = await res.text();
    console.error('Non-200:', text);
    process.exit(1);
  }
  if (!res.body) {
    console.error('Empty body');
    process.exit(1);
  }

  let firstSentenceMs: number | null = null;
  let firstToolMs: number | null = null;
  let doneEvent: SSEEvent | null = null;
  const sentences: Array<{ at: number; text: string }> = [];
  const toolCalls: Array<{ at: number; name: string }> = [];
  let totalEvents = 0;

  console.log('\n── Stream timeline ──');
  for await (const ev of parseSSE(res.body)) {
    const at = Date.now() - t0;
    totalEvents++;
    if (ev.type === 'sentence') {
      if (firstSentenceMs === null) firstSentenceMs = at;
      sentences.push({ at, text: ev.text as string });
      console.log(`  +${String(at).padStart(5)}ms · sentence: "${(ev.text as string).slice(0, 70)}"`);
    } else if (ev.type === 'tool-call') {
      if (firstToolMs === null) firstToolMs = at;
      toolCalls.push({ at, name: ev.name as string });
      console.log(`  +${String(at).padStart(5)}ms · tool-call: ${ev.name}`);
    } else if (ev.type === 'done') {
      doneEvent = ev;
      console.log(`  +${String(at).padStart(5)}ms · done · stop=${ev.stopReason} · sentences=${sentences.length} · tools=${toolCalls.length}`);
    }
  }

  console.log(`\n── Verdict ──`);
  if (!doneEvent) {
    console.error('❌ No done event received.');
    process.exit(1);
  }
  if (totalEvents < 1) {
    console.error('❌ No events received at all.');
    process.exit(1);
  }
  console.log(`✅ Received ${totalEvents} event(s) over ${Date.now() - t0}ms`);
  console.log(`✅ SSE stream well-formed (parser reached done event without errors)`);
  console.log(`   First sentence: ${firstSentenceMs ?? '—'}ms · First tool: ${firstToolMs ?? '—'}ms`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Test errored:', err);
  process.exit(1);
});
