/**
 * Round-4 item 9 (sketch tool off): with TUTOR_SKETCH=false the brain loses
 * the show_sketch tool (toolDefinitions gates it) — so the system prompt must
 * not name the tool ANYWHERE. Before the fix, the BASE_PROMPT analogy-mapping
 * paragraph (system-prompt-builder.ts ~:646) named `show_sketch`
 * unconditionally, telling the brain to call a tool it doesn't have.
 *
 * The flag is read at module scope, so each assertion runs in a child
 * process with the env set before import.
 *
 * Run: npx tsx scripts/test-sketch-flag-prompt.ts
 */

import { execFileSync } from 'node:child_process';

async function assertMode() {
  const { strict: assert } = await import('node:assert');
  const { buildSystemPrompt } = await import('../apps/marketing/src/lib/tutor/ai/system-prompt-builder');
  const prompt = buildSystemPrompt({ module: null, studentName: 'Ravi' });
  const mentions = prompt.includes('show_sketch');
  if (process.env.TUTOR_SKETCH === 'true') {
    assert.ok(mentions, 'flag ON: prompt should still name show_sketch (SKETCH verb clause)');
    console.log('  ✓ TUTOR_SKETCH=true: prompt names show_sketch');
  } else {
    assert.ok(
      !mentions,
      'flag OFF: prompt must not name show_sketch anywhere (the brain has no such tool)',
    );
    console.log('  ✓ TUTOR_SKETCH=false: prompt never names show_sketch');
  }
}

if (process.argv[2] === 'assert') {
  assertMode().catch((err) => {
    console.log(`  ✗ ${(err as Error).message}`);
    process.exit(1);
  });
} else {
  let failed = false;
  for (const flag of ['false', 'true']) {
    try {
      // TUTOR_BOARD_ANCHORED_SPEECH=true mirrors prod — the SKETCH verb
      // clause only renders inside that rule, so without it the flag-ON
      // assertion would vacuously pass.
      execFileSync('npx', ['tsx', process.argv[1], 'assert'], {
        env: { ...process.env, TUTOR_SKETCH: flag, TUTOR_BOARD_ANCHORED_SPEECH: 'true' },
        stdio: 'inherit',
      });
    } catch {
      failed = true;
    }
  }
  if (failed) process.exit(1);
  console.log('\nall sketch-flag prompt checks passed');
}
