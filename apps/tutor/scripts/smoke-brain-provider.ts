/**
 * DeepSeek brain smoke test — sends the brain's EXACT payload shape
 * (full system prompt + all whiteboard tools + a student turn) through the
 * model-registry with the DeepSeek override env vars, via prepareParams
 * (which strips thinking/cache_control for non-native providers).
 * Run from apps/tutor with ts-node + tsconfig-paths (same as measure script).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { getModelClient, prepareParams, resolveModel } from '@/lib/tutor/ai/model-registry';
import { buildSystemPrompt } from '@/lib/tutor/ai/system-prompt-builder';
import { WHITEBOARD_TOOLS, toAnthropicTools } from '@/app/tutor/hooks/toolDefinitions';

async function main() {
  const r = resolveModel('brain');
  console.log('brain resolves to:', r.model, '| native:', r.native, '| baseURL:', r.baseURL ?? '(anthropic)');
  // Guard against accidental Anthropic spend; SMOKE_ALLOW_NATIVE=1 permits a
  // deliberate A/B against the native provider (one full-prefix call ≈ $0.18).
  if (r.native && process.env.SMOKE_ALLOW_NATIVE !== '1') throw new Error('override env vars not applied — refusing to run against Anthropic (set SMOKE_ALLOW_NATIVE=1 for a deliberate A/B)');

  const system = buildSystemPrompt({
    module: null,
    studentName: 'Alex',
    sessionGoal: 'concept-review',
    timeRemainingMinutes: 30,
  } as Parameters<typeof buildSystemPrompt>[0]);

  const { client, model } = getModelClient('brain');
  const params = prepareParams('brain', {
    model,
    max_tokens: 2000,
    thinking: { type: 'disabled' as const },
    system: [{ type: 'text' as const, text: system, cache_control: { type: 'ephemeral' as const, ttl: '1h' as const } }],
    tools: toAnthropicTools(WHITEBOARD_TOOLS),
    messages: [
      {
        role: 'user' as const,
        content: process.env.SMOKE_STUDENT_MSG
          || 'Hi! Can you show me the line y = 2x + 1 on the whiteboard and explain what the slope means?',
      },
    ],
  });
  const hasThinking = 'thinking' in (params as Record<string, unknown>);
  const sysBlock = (params as { system: Array<Record<string, unknown>> }).system[0];
  console.log('after prepareParams — thinking present:', hasThinking, '| cache_control present:', 'cache_control' in sysBlock);

  const t0 = Date.now();
  const stream = client.messages.stream(params as Parameters<typeof client.messages.stream>[0]);
  let text = '';
  let firstTokenMs = 0;
  const toolCalls: string[] = [];
  for await (const ev of stream) {
    if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
      if (!firstTokenMs) firstTokenMs = Date.now() - t0;
      text += ev.delta.text;
    }
    if (ev.type === 'content_block_start' && ev.content_block.type === 'tool_use') {
      if (!firstTokenMs) firstTokenMs = Date.now() - t0;
      toolCalls.push(ev.content_block.name);
    }
  }
  const final = await stream.finalMessage();
  console.log('\n--- RESULT ---');
  console.log('served model:', final.model, '| stop_reason:', final.stop_reason, '| ttfb:', firstTokenMs, 'ms | total:', Date.now() - t0, 'ms');
  console.log('usage:', JSON.stringify(final.usage));
  console.log('tool calls:', toolCalls.length ? toolCalls.join(', ') : '(none)');
  console.log('text (first 400 chars):', text.slice(0, 400));
}

main().catch((e) => { console.error('SMOKE FAILED:', e?.status ?? '', e?.message ?? e); process.exit(1); });
