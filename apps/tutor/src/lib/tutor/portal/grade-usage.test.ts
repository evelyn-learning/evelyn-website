import { strict as assert } from 'node:assert';
import { callGraderJson } from './grade-free-response';
import { collectGradeUsage, gradeUsageCost, recordGradeUsage } from './grade-usage';

const reply = (usage?: object) => ({
  content: [{ type: 'text', text: '{"working":"ok","correct":true,"feedback":"Right."}' }],
  stop_reason: 'end_turn',
  ...(usage ? { usage } : {}),
});
const client = (usage?: object) => ({ messages: { create: async () => reply(usage) } }) as any;
const schema = { type: 'object', required: ['correct', 'feedback'], properties: {} } as any;

async function run() {
  // A grade's calls are collected and priced.
  const { result, calls } = await collectGradeUsage(async () => {
    await callGraderJson(client({ input_tokens: 1000, output_tokens: 200 }), 'claude-sonnet-4-6', 's', 'u', schema);
    return callGraderJson(client({ input_tokens: 500, output_tokens: 100, cache_read_input_tokens: 2000 }), 'claude-sonnet-4-6', 's', 'u', schema);
  });
  assert.equal(result.correct, true);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], { model: 'claude-sonnet-4-6', inputTokens: 500, outputTokens: 100, cacheReadTokens: 2000, cacheCreationTokens: 0 });
  // 1500 in × $3 + 300 out × $15 + 2000 cache-read × $0.30, per 1M tokens
  assert.equal(gradeUsageCost(calls), 0.0096);
  console.log('  ok - calls collected and priced');

  // A reply without usage (a fake) records nothing but zeros, and no collector is a no-op.
  const none = await collectGradeUsage(() => callGraderJson(client(), 'claude-sonnet-4-6', 's', 'u', schema));
  assert.equal(gradeUsageCost(none.calls), 0);
  recordGradeUsage('claude-sonnet-4-6', { input_tokens: 5 });
  console.log('  ok - no usage / no collector is harmless');

  // Concurrent grades keep their own calls.
  const [a, b] = await Promise.all([
    collectGradeUsage(() => callGraderJson(client({ input_tokens: 1, output_tokens: 1 }), 'm', 's', 'u', schema)),
    collectGradeUsage(async () => {
      await callGraderJson(client({ input_tokens: 2, output_tokens: 2 }), 'm', 's', 'u', schema);
      return callGraderJson(client({ input_tokens: 2, output_tokens: 2 }), 'm', 's', 'u', schema);
    }),
  ]);
  assert.equal(a.calls.length, 1);
  assert.equal(b.calls.length, 2);
  console.log('  ok - concurrent grades stay separate');
}
run().then(() => console.log('grade-usage: 3 passed')).catch((e) => { console.error(e); process.exit(1); });
