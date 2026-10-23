/**
 * 'plangen-fast' request shape — no network (2026-10-23, Haiku 5.5 move).
 *
 * The four plangen-fast callers (enumerate-problems, material-summary,
 * derive-rail-labels, condenseForPipeline) plus material-classify (role
 * 'plangen-classify', kept on Haiku 4.5) are run against a stubbed
 * `messages.create` and their request bodies checked:
 *   - default (Haiku 5.5): no temperature/top_p, `output_config.effort: 'low'`,
 *     max_tokens raised for thinking headroom; reply parsing ignores thinking blocks.
 *   - classify: Haiku 4.5, exact old body, and TUTOR_PLANGEN_FAST_EFFORT ignored.
 *   - TUTOR_PLANGEN_FAST_EFFORT=medium overrides the level.
 *   - rollback (child process, TUTOR_MODEL_PLANGEN_FAST=claude-haiku-4-5-20251001):
 *     the exact pre-change bodies, key order included.
 *
 * Run: npx tsx scripts/test-plangen-fast-params.ts
 */
import assert from 'node:assert';

const LEGACY = process.argv[2] === 'legacy';

async function main() {
  process.env.ANTHROPIC_API_KEY ||= 'test-key';
  delete process.env.TUTOR_PLANGEN_FAST_EFFORT;
  delete process.env.MONGODB_URI;
  if (LEGACY) process.env.TUTOR_MODEL_PLANGEN_FAST = 'claude-haiku-4-5-20251001';
  else delete process.env.TUTOR_MODEL_PLANGEN_FAST;

  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const enumerate = await import('../src/lib/tutor/lesson-plan/enumerate-problems');
  const classify = await import('../src/lib/tutor/lesson-plan/material-classify');
  const summary = await import('../src/lib/tutor/lesson-plan/material-summary');
  const rail = await import('../src/lib/tutor/lesson-plan/derive-rail-labels');
  const extract = await import('../src/lib/tutor/lesson-plan/material-extract');
  const fast = await import('../src/lib/tutor/lesson-plan/plangen-fast');
  const { client, model } = getModelClient('plangen-fast');

  const seen: Record<string, unknown>[] = [];
  (client.messages as unknown as { create: (p: unknown) => Promise<unknown> }).create = async (p: unknown) => {
    seen.push(p as Record<string, unknown>);
    // A thinking block first: every caller must read the text block only.
    return {
      content: [{ type: 'thinking', thinking: '', signature: 'x' }, { type: 'text', text: 'REPLY' }],
      stop_reason: 'end_turn',
      usage: { input_tokens: 1, output_tokens: 1 },
    };
  };

  const longText = 'Heading One\n' + 'some material line. '.repeat(600);
  const runAll = async () => {
    seen.length = 0;
    const out = {
      enumerate: await enumerate.defaultEnumerateDeps(client).complete('S', 'U'),
      classify: await classify.defaultClassifyDeps(client).complete('S', 'U'),
      summary: await summary.defaultSummaryDeps(client).complete('S', 'U'),
      rail: await rail.realComplete('P'),
      condense: await extract.condenseForPipeline(longText, { targetChars: 8000 }),
    };
    assert.equal(seen.length, 5, 'one call per caller');
    return { out, bodies: { enumerate: seen[0]!, classify: seen[1]!, summary: seen[2]!, rail: seen[3]!, condense: seen[4]! } };
  };

  const { out, bodies } = await runAll();
  for (const [name, text] of Object.entries(out)) assert.equal(text, 'REPLY', `${name}: text block only (thinking ignored)`);

  const user = (t: string) => [{ role: 'user', content: [{ type: 'text', text: t }] }];
  if (LEGACY) {
    assert.equal(model, 'claude-haiku-4-5-20251001');
    assert.equal(JSON.stringify(bodies.enumerate), JSON.stringify({ model, max_tokens: 4096, temperature: 0, system: 'S', messages: user('U') }));
    assert.equal(JSON.stringify(bodies.classify), JSON.stringify({ model, max_tokens: 400, temperature: 0, system: 'S', messages: user('U') }));
    assert.equal(JSON.stringify(bodies.summary), JSON.stringify({ model, max_tokens: 400, temperature: 0, system: 'S', messages: user('U') }));
    assert.equal(JSON.stringify(bodies.rail), JSON.stringify({ model, max_tokens: 400, temperature: 0.1, messages: user('P') }));
    const c = bodies.condense as { system: string; messages: unknown };
    assert.equal(JSON.stringify(bodies.condense), JSON.stringify({ model, max_tokens: 4096, system: c.system, messages: c.messages }));
    console.log('test-plangen-fast-params (rollback haiku-4.5): ok');
    return;
  }

  assert.equal(model, 'claude-haiku-5-5', 'plangen-fast defaults to Haiku 5.5');
  const classifyOld = JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 400, temperature: 0, system: 'S', messages: user('U') });
  assert.equal(getModelClient('plangen-classify').model, 'claude-haiku-4-5-20251001', 'classify stays on Haiku 4.5');
  assert.equal(JSON.stringify(bodies.classify), classifyOld, 'classify: exact old body');
  const expectMax: Record<string, number> = { enumerate: 8192, summary: 4000, rail: 4000, condense: 8192 };
  for (const [name, b] of Object.entries(bodies)) {
    if (name === 'classify') continue;
    assert.equal(b.model, 'claude-haiku-5-5', `${name}: model`);
    assert.ok(!('temperature' in b) && !('top_p' in b) && !('top_k' in b), `${name}: no sampling params`);
    assert.deepEqual(b.output_config, { effort: 'low' }, `${name}: effort low`);
    assert.equal(b.max_tokens, expectMax[name], `${name}: max_tokens headroom`);
    assert.ok(!('thinking' in b), `${name}: thinking left at the model default`);
  }

  // Env override.
  process.env.TUTOR_PLANGEN_FAST_EFFORT = 'medium';
  const { bodies: m } = await runAll();
  for (const [name, b] of Object.entries(m)) {
    if (name === 'classify') assert.equal(JSON.stringify(b), classifyOld, 'classify: effort env ignored on Haiku 4.5');
    else assert.deepEqual(b.output_config, { effort: 'medium' }, `${name}: env override`);
  }
  delete process.env.TUTOR_PLANGEN_FAST_EFFORT;

  // Pure helper.
  assert.equal(fast.plangenFastEffort(undefined, 'claude-haiku-4-5-20251001'), undefined);
  assert.equal(fast.plangenFastEffort('bogus', 'claude-haiku-5-5'), 'low');
  assert.equal(fast.plangenFastEffort('high', 'claude-haiku-4-5-20251001'), undefined, 'Haiku 4.5 never gets effort');
  assert.deepEqual(fast.plangenFastParams(400, 0, { model: 'claude-haiku-4-5-20251001' }), { max_tokens: 400, temperature: 0 });
  assert.deepEqual(fast.plangenFastParams(9000, 0, { model: 'claude-haiku-5-5' }), { max_tokens: 9000, output_config: { effort: 'low' } });

  // Rollback env, in a child (the callers resolve their model at module load).
  const { execFileSync } = await import('node:child_process');
  const env = { ...process.env };
  delete env.TUTOR_PLANGEN_FAST_EFFORT;
  execFileSync('npx', ['tsx', __filename, 'legacy'], { stdio: 'inherit', env });

  console.log('test-plangen-fast-params: all assertions passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
