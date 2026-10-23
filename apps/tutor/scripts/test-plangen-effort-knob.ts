/**
 * TUTOR_PLANGEN_EFFORT knob — no network (2026-10-22, plangen model-compare eval).
 *
 * Proves the knob UNSET leaves both plan-generation request bodies
 * byte-identical to the pre-knob literal (today's Haiku 4.5 traffic must not
 * change), and that SET adds `output_config.effort` on both stages plus the
 * Stage-1 max_tokens raise to 4 000. The shared plangen-fast client's
 * `messages.create` is stubbed, so nothing leaves the process.
 *
 * Run: npx tsx scripts/test-plangen-effort-knob.ts
 */
import assert from 'node:assert';

async function main() {
  process.env.ANTHROPIC_API_KEY ||= 'test-key';
  delete process.env.TUTOR_PLANGEN_EFFORT;
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const gen = await import('../src/lib/tutor/lesson-plan/generate-from-text');
  const { client, model } = getModelClient('plangen-fast');

  const seen: unknown[] = [];
  let reply = '';
  (client.messages as unknown as { create: (p: unknown) => Promise<unknown> }).create = async (p: unknown) => {
    seen.push(p);
    return { content: [{ type: 'text', text: reply }], usage: { input_tokens: 1, output_tokens: 1 } };
  };

  const input = { text: 'balancing chemical equations', topic: 'balancing chemical equations', subject: 'chemistry', grade: '9-10' };
  const los = [{ id: 'lo-1', description: 'Balance a chemical equation by counting atoms.' }];

  const run = async () => {
    seen.length = 0;
    reply = JSON.stringify({ titleSuggestion: 't', los });
    await gen.extractLearningObjectives(input);
    reply = JSON.stringify({ segments: [] });
    await gen.expandSegmentsForLOs(los, input);
    return seen.map((p) => JSON.stringify(p));
  };

  // The pre-knob request bodies, written out literally.
  const userText = (extra: string) => `Subject: ${input.subject}\nGrade: ${input.grade}\nTopic: ${input.topic}\n\n${extra}`;
  const expected1 = {
    model,
    max_tokens: 1500,
    messages: [{ role: 'user', content: [{ type: 'text', text: userText(`Student's text:\n${input.text}`) }] }],
  };
  const expected2 = {
    model,
    max_tokens: 8192,
    system: gen.STAGE2_SYSTEM,
    messages: [{ role: 'user', content: [{ type: 'text', text: gen.buildStage2UserMessage(los, input) }] }],
  };

  // 1. Unset ⇒ byte-identical bodies (key order included).
  const [b1, b2] = await run();
  const p1 = JSON.parse(b1);
  assert.equal(b1, JSON.stringify({ model, max_tokens: 1500, system: p1.system, messages: expected1.messages }), 'stage 1 body changed with the knob unset');
  assert.ok(typeof p1.system === 'string' && p1.system.startsWith('You extract a list of learning objectives'), 'stage 1 system prompt');
  assert.equal(b2, JSON.stringify(expected2), 'stage 2 body changed with the knob unset');
  assert.ok(!b1.includes('output_config') && !b2.includes('output_config'));

  // 1b. withPlangenEffort returns the SAME object when unset / invalid.
  const obj = { max_tokens: 10 };
  assert.equal(gen.withPlangenEffort(obj, 1, undefined), obj);
  assert.equal(gen.plangenEffort('max'), undefined);
  assert.equal(gen.plangenEffort(''), undefined);

  // 2. Set ⇒ effort on both stages, Stage 1 cap raised, Stage 2 cap kept.
  process.env.TUTOR_PLANGEN_EFFORT = 'low';
  const [s1, s2] = (await run()).map((b) => JSON.parse(b));
  assert.deepEqual(s1.output_config, { effort: 'low' });
  assert.deepEqual(s2.output_config, { effort: 'low' });
  assert.equal(s1.max_tokens, 4000);
  assert.equal(s2.max_tokens, 8192);
  assert.equal(s1.temperature, undefined, 'no sampling params (Haiku 5.5 rejects them)');

  console.log('test-plangen-effort-knob: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
