/**
 * TUTOR_PLANGEN_EFFORT knob — no network (2026-10-22, plangen model-compare eval).
 *
 * Proves the knob UNSET leaves both plan-generation request bodies
 * byte-identical to the pre-knob literal (today's Haiku 4.5 traffic must not
 * change), and that SET adds `output_config.effort` on both stages plus the
 * Stage-1 max_tokens raise to 4 000. The shared plangen-fast client's
 * `messages.create` is stubbed, so nothing leaves the process.
 *
 * 2026-10-23: role 'plangen' defaults to Haiku 5.5 with effort 'low' (no env);
 * a Haiku 4.5 model with the env unset keeps the exact old body. The Haiku 4.5
 * half runs in a child process (the registry reads its env at module load).
 *
 * Run: npx tsx scripts/test-plangen-effort-knob.ts
 */
import assert from 'node:assert';

const LEGACY = process.argv[2] === 'legacy';

async function main() {
  if (process.argv[2] === 'print-model') {
    const { getModelClient: g } = await import('../src/lib/tutor/ai/model-registry');
    console.log(g('plangen').model);
    return;
  }
  process.env.ANTHROPIC_API_KEY ||= 'test-key';
  delete process.env.TUTOR_PLANGEN_EFFORT;
  if (LEGACY) process.env.TUTOR_MODEL_PLANGEN = 'claude-haiku-4-5-20251001'; else delete process.env.TUTOR_MODEL_PLANGEN;
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const gen = await import('../src/lib/tutor/lesson-plan/generate-from-text');
  const { client, model } = getModelClient('plangen');

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

  if (LEGACY) {
    assert.equal(model, 'claude-haiku-4-5-20251001');
    // (c) Haiku 4.5, env unset => byte-identical to the pre-change capture.
    // 1. Unset ⇒ byte-identical bodies (key order included).
  const [b1, b2] = await run();
  const p1 = JSON.parse(b1);
  assert.equal(b1, JSON.stringify({ model, max_tokens: 1500, system: p1.system, messages: expected1.messages }), 'stage 1 body changed with the knob unset');
  assert.ok(typeof p1.system === 'string' && p1.system.startsWith('You extract a list of learning objectives'), 'stage 1 system prompt');
  assert.equal(b2, JSON.stringify(expected2), 'stage 2 body changed with the knob unset');
  assert.ok(!b1.includes('output_config') && !b2.includes('output_config'));

  // 1b. withPlangenEffort returns the SAME object when unset / invalid.
  const obj = { max_tokens: 10 };
  assert.equal(gen.withPlangenEffort(obj, 1), obj, 'same object on Haiku 4.5, env unset');
  assert.equal(gen.plangenEffort('max'), undefined);
  assert.equal(gen.plangenEffort(''), undefined);

    // (d) env override still applies on Haiku 4.5.
    process.env.TUTOR_PLANGEN_EFFORT = 'medium';
    const [m1, m2] = (await run()).map((b) => JSON.parse(b));
    assert.deepEqual(m1.output_config, { effort: 'medium' });
    assert.deepEqual(m2.output_config, { effort: 'medium' });
    assert.equal(m1.max_tokens, 4000);
    console.log('test-plangen-effort-knob (legacy haiku-4.5): ok');
    return;
  }

  // (a) role default + env override
  assert.equal(model, 'claude-haiku-5-5', 'plangen defaults to Haiku 5.5');
  // plangen-fast moved to Haiku 5.5 too (2026-10-23) — see test-plangen-fast-params.ts.
  assert.equal(gen.PLANGEN_MODEL_ID, 'claude-haiku-5-5');

  // (b) Haiku 5.5, env unset => effort low on both stages, stage-1 cap 4000, no sampling params.
  const [d1, d2] = (await run()).map((b) => JSON.parse(b));
  for (const d of [d1, d2]) {
    assert.deepEqual(d.output_config, { effort: 'low' });
    assert.equal(d.model, 'claude-haiku-5-5');
    assert.ok(!('temperature' in d) && !('top_p' in d), 'no sampling params');
  }
  assert.equal(d1.max_tokens, 4000);
  assert.equal(d2.max_tokens, 8192);

  // Pure helper: 4.5 => undefined, others => low, env wins.
  assert.equal(gen.plangenEffort(undefined, 'claude-haiku-4-5-20251001'), undefined);
  assert.equal(gen.plangenEffort(undefined, 'claude-sonnet-5'), 'low');
  assert.equal(gen.plangenEffort('max', 'claude-haiku-4-5-20251001'), undefined);
  assert.equal(gen.plangenEffort('high', 'claude-haiku-4-5-20251001'), 'high');

  // (d) env override
  process.env.TUTOR_PLANGEN_EFFORT = 'medium';
  const [e1, e2] = (await run()).map((b) => JSON.parse(b));
  assert.deepEqual(e1.output_config, { effort: 'medium' });
  assert.deepEqual(e2.output_config, { effort: 'medium' });
  assert.equal(e1.max_tokens, 4000);
  delete process.env.TUTOR_PLANGEN_EFFORT;

  // Cache key carries the generator model; Haiku 4.5 keeps the old key.
  const { topicCacheKey } = await import('../src/lib/tutor/lesson-plan/generation-cache');
  const a = { topic: 'waves', subject: 'physics', grade: '10', sessionMinutes: 28 };
  const kOld = topicCacheKey(a);
  assert.equal(topicCacheKey({ ...a, model: 'claude-haiku-4-5-20251001' }), kOld, 'Haiku 4.5 keeps the pre-change key');
  const k55 = topicCacheKey({ ...a, model: 'claude-haiku-5-5' });
  const kS5 = topicCacheKey({ ...a, model: 'claude-sonnet-5' });
  assert.notEqual(k55, kOld);
  assert.notEqual(k55, kS5);

  // TUTOR_MODEL_PLANGEN override + legacy half in a child process.
  const { execFileSync } = await import('node:child_process');
  const env = { ...process.env };
  delete env.TUTOR_PLANGEN_EFFORT;
  execFileSync('npx', ['tsx', __filename, 'legacy'], { stdio: 'inherit', env });
  const viaEnv = execFileSync('npx', ['tsx', __filename, 'print-model'], { env: { ...env, ANTHROPIC_API_KEY: 'k', TUTOR_MODEL_PLANGEN: 'claude-sonnet-5' } }).toString().trim();
  assert.equal(viaEnv, 'claude-sonnet-5', 'TUTOR_MODEL_PLANGEN honoured');

  console.log('test-plangen-effort-knob: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
