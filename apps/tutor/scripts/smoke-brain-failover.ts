/**
 * Failover smoke (2026-08-31): drives streamBrainTurn with a deliberately
 * BROKEN primary key + DeepSeek fallback configured, and asserts the turn
 * still streams — served by the fallback. Set the env before importing:
 *   TUTOR_MODEL_BRAIN_API_KEY=sk-ant-bogus (forces 401 on primary)
 *   TUTOR_MODEL_BRAIN_FALLBACK{,_BASE_URL,_API_KEY}=…
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { streamBrainTurn, BRAIN_MODEL_ID } from '@/lib/tutor/voice/claude-brain';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { WHITEBOARD_TOOLS } from '@/app/tutor/hooks/toolDefinitions';

async function main() {
  console.log('primary model:', BRAIN_MODEL_ID, '| fallback:', process.env.TUTOR_MODEL_BRAIN_FALLBACK ?? '(none)');
  const system = buildSystemPrompt({
    module: null,
    studentName: 'Alex',
    sessionGoal: 'concept-review',
    timeRemainingMinutes: 30,
  } as Parameters<typeof buildSystemPrompt>[0]);

  const t0 = Date.now();
  let sentences = 0;
  let doneUsage: unknown = null;
  for await (const ev of streamBrainTurn({
    systemPrompt: system,
    conversationHistory: [],
    studentTranscript: 'Can you show me the line y = 2x + 1 on the whiteboard?',
    whiteboardSnapshot: [],
    tools: WHITEBOARD_TOOLS,
  })) {
    if (ev.type === 'sentence') { sentences++; if (sentences === 1) console.log('first sentence @', Date.now() - t0, 'ms:', ev.text.slice(0, 80)); }
    if (ev.type === 'tool-call') console.log('tool-call:', ev.name);
    if (ev.type === 'done') doneUsage = ev.usage;
  }
  console.log('sentences:', sentences, '| done usage:', JSON.stringify(doneUsage));
}

main().catch((e) => { console.error('FAILOVER SMOKE FAILED:', e?.status ?? '', e?.message ?? e); process.exit(1); });
