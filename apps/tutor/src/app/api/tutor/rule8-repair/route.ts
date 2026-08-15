/**
 * Client-initiated Rule-8 repair (v2, net-of-client-drops).
 *
 * The in-stream repair pass (brain/stream route, post-`done`) fires only when
 * the turn emitted ZERO tool calls — it cannot see client-side drops. Round 6
 * showed the gap: the server sent a show_equation, the client dedup-dropped
 * it, the board stayed empty, and toolCount=1 skipped repair. Only the client
 * knows what actually painted, so it POSTs here at stream end when
 * serverToolCount > 0 but paintedCount === 0 (mutually exclusive with the
 * in-stream pass by construction — no turn can double-repair).
 *
 * Same safety shape as the in-stream pass: pure detector over the spoken
 * sentences, one bounded Haiku call (fail-to-nothing), wholesale-validated
 * output, server-side validateToolCall, and the client's validator/dedup
 * stack unchanged on dispatch. Every failure path returns { frames: [] }.
 *
 * Tests: npm run test:rule8-repair (pure halves — request validation,
 * decision predicate, detector, response parsing).
 */
import { NextRequest } from 'next/server';
import {
  detectRepairNeed,
  generateRule8Repairs,
  toToolCallFrames,
  parseClientRepairRequest,
  type RepairToolCallFrame,
} from '@/lib/tutor/voice/rule8-repair';
import { validateToolCall } from '@/lib/tutor/whiteboard/validate-tool-call';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (process.env.TUTOR_RULE8_REPAIR !== 'on') return Response.json({ frames: [] });
  try {
    const parsed = parseClientRepairRequest(await req.json());
    if (!parsed) return Response.json({ frames: [] });

    // From the board's perspective zero tools landed — that's the premise of
    // this endpoint — so the detector runs with toolCount 0.
    const detection = detectRepairNeed(parsed.sentences, 0);
    if (!detection.needed) return Response.json({ frames: [] });

    const started = Date.now();
    const repairs = await generateRule8Repairs(parsed.sentences, detection);
    const frames: RepairToolCallFrame[] = [];
    let rejected = 0;
    for (const frame of toToolCallFrames(repairs)) {
      const v = validateToolCall(frame.name, frame.args);
      if (!v.ok) {
        rejected++;
        console.log(`[rule8.repair.client] validator rejected ${frame.name}: ${v.reason}`);
        continue;
      }
      frames.push(frame);
    }
    console.log(
      `[rule8.repair.client] sent=${parsed.serverToolCount} painted=${parsed.paintedCount} ` +
      `promised=${detection.promisedVisual} math=[${detection.mathSentences.join(',')}] ` +
      `defs=[${detection.definitionSentences.join(',')}] posed=[${detection.posedQuestionSentences.join(',')}] ` +
      `model→${repairs.length} ok=${frames.length} rejected=${rejected} in ${Date.now() - started}ms`,
    );
    return Response.json({ frames });
  } catch {
    return Response.json({ frames: [] });
  }
}
