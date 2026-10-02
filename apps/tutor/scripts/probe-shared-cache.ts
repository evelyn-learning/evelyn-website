/**
 * Proof that two different sessions share the tools + core cache entry.
 * SPENDS REAL MONEY: one cold write of tools + core (≈ $0.50 on Sonnet 5)
 * plus small writes. Requires PROBE_ALLOW_SPEND=1. Run from apps/tutor:
 *   PROBE_ALLOW_SPEND=1 npx tsx scripts/probe-shared-cache.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getModelClient, resolveModel } from '@/lib/tutor/ai/model-registry';
import { buildSystemPromptParts } from '@/lib/tutor/ai/system-prompt-builder';
import { buildSystemBlocks } from '@/lib/tutor/ai/prompt-cache';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';
import { PROMPT_MATRIX } from './fixtures/system-prompt-matrix';

async function main() {
  if (process.env.PROBE_ALLOW_SPEND !== '1') throw new Error('refusing to spend: set PROBE_ALLOW_SPEND=1');
  const r = resolveModel('brain');
  if (!r.native) throw new Error(`brain resolves to a non-Anthropic endpoint (${r.model}); caching cannot be probed`);
  const { client, model } = getModelClient('brain');
  const tools = toAnthropicTools(WHITEBOARD_TOOLS);

  const call = async (label: string, ctxName: keyof typeof PROMPT_MATRIX) => {
    const p = buildSystemPromptParts(PROMPT_MATRIX[ctxName]);
    const res = await client.messages.create({
      model,
      max_tokens: 16,
      thinking: { type: 'disabled' },
      system: buildSystemBlocks(p.core + p.session, p.core),
      tools,
      messages: [{ role: 'user', content: 'Say hi in three words.' }],
    });
    const u = res.usage;
    console.log(`${label.padEnd(34)} read=${u.cache_read_input_tokens ?? 0} created=${u.cache_creation_input_tokens ?? 0} in=${u.input_tokens}`);
    return { read: u.cache_read_input_tokens ?? 0, created: u.cache_creation_input_tokens ?? 0 };
  };

  // A: first session (cold unless something warmed it in the last hour).
  const a = await call('A  session math_g8 (first)', 'math_g8');
  // B: a DIFFERENT session (other student, subject, level, goal) — must read tools + core.
  const b = await call('B  session freetext_subject', 'freetext_subject');
  // A again: same session — must read everything.
  const a2 = await call('A2 session math_g8 (repeat)', 'math_g8');

  const shared = a.read + a.created - 0; // total cached prefix of A = tools + core + session_A
  const checks: Array<[string, boolean]> = [
    ['B reads a large shared prefix (> 60% of A\'s cached prefix)', b.read > 0.6 * shared],
    ['B writes only its session tail (< 40% of A\'s cached prefix)', b.created < 0.4 * shared],
    ['A2 reads its whole prefix and writes ~nothing', a2.created < 200 && a2.read >= b.read],
  ];
  let fail = 0;
  for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) fail++; }
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error('PROBE FAILED:', e?.status ?? '', e?.message ?? e); process.exit(1); });
