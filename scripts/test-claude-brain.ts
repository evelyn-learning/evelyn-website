/**
 * Smoke test for the Claude brain module.
 *
 * Replays the exact scenario from the 2026-04-26 production session that
 * exposed the triangle-area conceptual lapse. The Realtime model walked
 * the student into using "y-coordinate of A" as the height for base = DC
 * — a classic mismatched-base/height error — and ended up with area =
 * 17.99 when the correct answer is 3.
 *
 * Run: npx ts-node --project tsconfig.json scripts/test-claude-brain.ts
 *
 * Exit 0 if the brain handles the turn cleanly; exit 1 otherwise.
 */
import { runBrainTurn, streamBrainTurn } from '../apps/marketing/src/lib/tutor/voice/claude-brain';
import { WHITEBOARD_TOOLS } from '../apps/marketing/src/app/tutor/hooks/toolDefinitions';

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set — aborting.');
    process.exit(1);
  }

  // Minimal tutoring system prompt — no domain examples. Just style + API.
  const systemPrompt = [
    'You are a Socratic voice tutor. Keep responses to 1–3 sentences.',
    'Do not solve problems for the student — guide them with one focused question.',
    'When the student is at a multi-step computation, verify each step before advancing.',
    'You have whiteboard tools available (show_geometry, show_coordinate_plane, show_equation, etc.).',
    'Only call a tool when a fresh visual genuinely helps; otherwise just speak.',
  ].join('\n');

  // Reconstruct the conversation up to the moment the original tutor blundered.
  const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [
    { role: 'user', content: 'Plot the points A(2, 3), B(-4, 1), and C(0, -5) on a coordinate plane and connect them with line segments' },
    { role: 'assistant', content: "Here's the coordinate plane with points A, B, and C plotted, and the lines connecting them to form a triangle. What do you notice about the shape?" },
    { role: 'user', content: 'Can you draw a perpendicular from A to the x-axis?' },
    { role: 'assistant', content: "I've added the perpendicular from point A down to the x-axis. Notice how it forms a right angle. Anything else you'd like to explore here?" },
    { role: 'user', content: 'Now join D and C and then find the area of ACD' },
    { role: 'assistant', content: "We've now got triangle ACD clearly outlined. Let's find the area. First, what's the length of the base DC?" },
    { role: 'user', content: 'find it using distance formula?' },
    { role: 'assistant', content: 'Great! We have the distance formula here. Now, what are the coordinates of points D and C that we plug into this formula?' },
    { role: 'user', content: '2, 0 and 0, -5 are the x\'s and y\'s' },
  ];

  // Whiteboard state at this point: triangle ABC, perpendicular AD, triangle ACD outlined,
  // distance formula equation. The brain should know D = (2, 0) is the foot of the
  // perpendicular and C = (0, -5).
  const whiteboardSnapshot = [
    { itemId: 'wb-1', action: 'showCoordinatePlane', title: 'Triangle ABC', featureCount: 6 },
    { itemId: 'wb-2', action: 'showCoordinatePlane', title: 'Triangle ABC with Perpendicular from A', featureCount: 8 },
    { itemId: 'wb-3', action: 'showCoordinatePlane', title: 'Triangle ACD', featureCount: 7 },
    { itemId: 'wb-4', action: 'showEquation', title: 'Distance formula', featureCount: 1 },
  ];

  // Test 1: the original blunder turn. The Realtime model said:
  //   "So the length of DC is about 5.39. Now let's use the height from A to
  //    the x-axis. What's the height of point A above the x-axis?"
  // That's wrong — base = DC, but it asked for the y-coordinate of A which
  // is the height to the x-axis, not to line CD. We expect Sonnet to either
  // pick a base/height pair that's actually perpendicular, or to ask the
  // student a question that doesn't lead them into the same mismatch.
  console.log('═══ Test: Triangle ACD area, post DC-distance turn ═══\n');
  console.log('Conversation: 9 turns (last student turn = "2, 0 and 0, -5 are the x\'s and y\'s")');
  console.log('Whiteboard:   4 items (triangle, perpendicular AD, triangle ACD, distance formula)');
  console.log('Expecting:    a turn that does NOT couple base=DC with height=y-coordinate-of-A.\n');

  const t0 = Date.now();
  const out = await runBrainTurn({
    systemPrompt,
    conversationHistory,
    studentTranscript: '2, 0 and 0, -5 are the x\'s and y\'s',
    whiteboardSnapshot,
    tools: WHITEBOARD_TOOLS,
  });
  const ms = Date.now() - t0;

  console.log(`── Brain response (${ms}ms) ──`);
  console.log(`Stop reason: ${out.stopReason}`);
  console.log(`Tokens: in=${out.usage.inputTokens} out=${out.usage.outputTokens} cache_read=${out.usage.cacheReadTokens} cache_create=${out.usage.cacheCreationTokens}`);
  console.log(`Tool calls: ${out.toolCalls.length}`);
  for (const tc of out.toolCalls) {
    console.log(`  - ${tc.name}(${JSON.stringify(tc.args).slice(0, 200)}${JSON.stringify(tc.args).length > 200 ? '…' : ''})`);
  }
  console.log(`\nText:\n${out.text}\n`);

  // Heuristic: flag the original error pattern. Phrases like "height from A
  // to the x-axis" or "y-coordinate of A" appearing as the height when the
  // base is DC = the bug. Phrases like "perpendicular distance from A to CD"
  // or "perpendicular from A to line CD" = correct. We don't fail on this
  // alone (Sonnet might phrase the right idea differently); print warnings.
  const lower = out.text.toLowerCase();
  const dangerous =
    /height (of |from )?a (above|to|from)? ?(the )?x.?axis/.test(lower) ||
    /y.coordinate (of )?a/.test(lower);
  const safe =
    /perpendicular distance from a to (line )?cd/.test(lower) ||
    /perpendicular from a to (line )?cd/.test(lower) ||
    /point.to.line/.test(lower) ||
    /shoelace/.test(lower);

  if (dangerous && !safe) {
    console.error('❌ Brain reproduced the original conceptual error pattern.');
    process.exit(1);
  }

  console.log('✅ Brain did not reproduce the dangerous "y-coord of A as height" pattern.');
  if (safe) console.log('   (Bonus: it explicitly invoked perpendicular-to-CD or point-to-line distance.)');

  // ───────────────────────────────────────────────────────────────────
  // Test 2: the exact moment the production tutor blundered.
  // After DC distance is computed, the Realtime model said:
  //   "Now let's use the height from A to the x-axis. What's the
  //    height of point A above the x-axis?"
  // — coupling base=DC with height=y-coord. We extend the conversation
  // through the distance computation and re-run to see what Claude
  // proposes as the height step.
  // ───────────────────────────────────────────────────────────────────
  console.log('\n═══ Test 2: post-DC-distance turn (the trap moment) ═══\n');

  const extended: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...conversationHistory,
    { role: 'assistant', content: 'Plug those into the distance formula. What length do you get for DC?' },
    { role: 'user', content: 'About 5.39, since sqrt(4+25) is sqrt(29).' },
  ];

  const t1 = Date.now();
  const out2 = await runBrainTurn({
    systemPrompt,
    conversationHistory: extended,
    studentTranscript: 'About 5.39, since sqrt(4+25) is sqrt(29).',
    whiteboardSnapshot,
    tools: WHITEBOARD_TOOLS,
  });
  const ms2 = Date.now() - t1;

  console.log(`── Brain response (${ms2}ms) ──`);
  console.log(`Stop reason: ${out2.stopReason}`);
  console.log(`Tokens: in=${out2.usage.inputTokens} out=${out2.usage.outputTokens} cache_read=${out2.usage.cacheReadTokens} cache_create=${out2.usage.cacheCreationTokens}`);
  console.log(`Tool calls: ${out2.toolCalls.length}`);
  for (const tc of out2.toolCalls) {
    console.log(`  - ${tc.name}(${JSON.stringify(tc.args).slice(0, 200)}${JSON.stringify(tc.args).length > 200 ? '…' : ''})`);
  }
  console.log(`\nText:\n${out2.text}\n`);

  const lower2 = out2.text.toLowerCase();
  const dangerous2 =
    /height (of |from )?a (above|to|from)? ?(the )?x.?axis/.test(lower2) ||
    /(use|using).*y.coordinate (of )?a/.test(lower2);
  const safe2 =
    /perpendicular distance from a to (line )?cd/.test(lower2) ||
    /perpendicular from a to (line )?cd/.test(lower2) ||
    /point.to.line/.test(lower2) ||
    /shoelace/.test(lower2) ||
    /\bbase\b.*\bad\b/.test(lower2) ||  // chose AD (vertical leg) as base — also correct
    /\bad\b.*\bbase\b/.test(lower2);

  if (dangerous2 && !safe2) {
    console.error('❌ Brain reproduced the trap pattern at the critical decision point.');
    process.exit(1);
  }

  console.log('✅ Brain navigated the trap moment without coupling base=DC with height=y-coord.');
  if (safe2) console.log('   (It explicitly chose a perpendicular-pair or used point-to-line.)');

  // ───────────────────────────────────────────────────────────────────
  // Test 3: streaming variant — verify sentences arrive incrementally
  // and the first sentence shows up well before the full response.
  // ───────────────────────────────────────────────────────────────────
  console.log('\n═══ Test 3: streamBrainTurn — incremental sentence delivery ═══\n');

  const t2 = Date.now();
  let firstSentenceMs: number | null = null;
  let lastEventMs: number | null = null;
  const sentencesSeen: Array<{ at: number; text: string }> = [];
  const toolCallsSeen: Array<{ at: number; name: string }> = [];
  let doneEvent: { stopReason: string; toolCallCount: number; chars: number } | null = null;

  for await (const ev of streamBrainTurn({
    systemPrompt,
    conversationHistory: extended,
    studentTranscript: 'About 5.39, since sqrt(4+25) is sqrt(29).',
    whiteboardSnapshot,
    tools: WHITEBOARD_TOOLS,
  })) {
    const at = Date.now() - t2;
    lastEventMs = at;
    if (ev.type === 'sentence') {
      if (firstSentenceMs === null) firstSentenceMs = at;
      sentencesSeen.push({ at, text: ev.text });
    } else if (ev.type === 'tool-call') {
      toolCallsSeen.push({ at, name: ev.name });
    } else if (ev.type === 'done') {
      doneEvent = {
        stopReason: ev.stopReason,
        toolCallCount: ev.toolCalls.length,
        chars: ev.fullText.length,
      };
    }
  }

  console.log(`── Stream timeline (total ${lastEventMs}ms) ──`);
  for (const s of sentencesSeen) {
    console.log(`  +${String(s.at).padStart(5)}ms · sentence (${s.text.length} chars): "${s.text.slice(0, 70)}${s.text.length > 70 ? '…' : ''}"`);
  }
  for (const t of toolCallsSeen) {
    console.log(`  +${String(t.at).padStart(5)}ms · tool-call: ${t.name}`);
  }
  console.log(`  +${String(lastEventMs).padStart(5)}ms · done · stop=${doneEvent?.stopReason} · ${doneEvent?.toolCallCount} tool(s) · ${doneEvent?.chars} chars`);

  // Sanity checks. The big claim of streaming is that the FIRST sentence
  // arrives well before the LAST event. If first-sentence latency is
  // close to total latency, streaming bought us nothing.
  if (firstSentenceMs === null) {
    console.warn('⚠️  No sentences arrived during streaming. Either the response was tool-only or the buffer never flushed.');
  } else if (lastEventMs === null) {
    console.error('❌ Stream ended without a `done` event.');
    process.exit(1);
  } else if (firstSentenceMs > lastEventMs * 0.9) {
    console.warn(`⚠️  First sentence at ${firstSentenceMs}ms vs total ${lastEventMs}ms — streaming gave little headroom. Acceptable for short responses, worth investigating for long ones.`);
  } else {
    console.log(`✅ First sentence arrived at ${firstSentenceMs}ms; total turn ${lastEventMs}ms — streaming saved ~${lastEventMs - firstSentenceMs}ms of perceived latency.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Test errored:', err);
  process.exit(1);
});
