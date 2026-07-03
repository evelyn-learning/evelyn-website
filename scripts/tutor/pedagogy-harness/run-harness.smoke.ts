/// <reference types="node" />
/**
 * Gated smoke test for the pedagogy harness driver (Task H4).
 *
 * SPENDS REAL TOKENS (Haiku student-simulator calls + a real claude-brain
 * tutor session) and REQUIRES a running dev server (npm run dev, default
 * http://localhost:3006) reachable at $TUTOR_E2E_URL/tutor, plus
 * ANTHROPIC_API_KEY (env or .env.local).
 *
 * If the dev server isn't reachable, this prints `[SKIP] ...` and exits 0 —
 * safe to wire into a default test pipeline without a live server.
 *
 * Run: npm run test:pedagogy-driver
 */
import { loadPersona } from './fixtures/personas';
import { runScenario } from './run-harness';

const BASE_URL = process.env.TUTOR_E2E_URL || 'http://localhost:3006';

async function main() {
  console.log('[pedagogy-driver-smoke] this run SPENDS REAL TOKENS (Haiku student-sim + claude-brain tutor turns) and needs a running dev server.');

  try {
    await fetch(`${BASE_URL}/tutor`);
  } catch {
    console.log(`[SKIP] no dev server at ${BASE_URL} — start one with \`npm run dev\` and re-run \`npm run test:pedagogy-driver\`.`);
    process.exit(0);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    try {
      const fs = await import('fs');
      const env = fs.readFileSync('.env.local', 'utf8');
      if (!/^ANTHROPIC_API_KEY=/m.test(env)) throw new Error('not set');
    } catch {
      console.log('[SKIP] no ANTHROPIC_API_KEY (env or .env.local) — the student-simulator needs a real Haiku key.');
      process.exit(0);
    }
  }

  console.log(`[pedagogy-driver-smoke] dev server reachable at ${BASE_URL} — running runScenario(maya, {maxTurns: 3})…`);
  const maya = loadPersona('maya');
  const bundle = await runScenario(maya, { maxTurns: 3, taskId: 'H4-smoke', baseUrl: BASE_URL });

  if (bundle.turns.length < 1) throw new Error(`expected >=1 turn, got ${bundle.turns.length}`);
  const first = bundle.turns[0];
  if (!first.tutorText || first.tutorText.trim().length === 0) throw new Error('turn 0 has empty tutorText');
  if (!first.studentReply || first.studentReply.trim().length === 0) throw new Error('turn 0 has empty studentReply');

  console.log(`[pedagogy-driver-smoke] PASS — ${bundle.turns.length} turn(s) captured.`);
  console.log(`[pedagogy-driver-smoke] turn 0 tutorText: "${first.tutorText.slice(0, 100)}..."`);
  console.log(`[pedagogy-driver-smoke] turn 0 studentReply: "${first.studentReply.slice(0, 100)}"`);
  console.log(`[pedagogy-driver-smoke] turn 0 toolCalls: ${first.toolCalls.length}`);
}

main().catch((e) => { console.error('[pedagogy-driver-smoke] FAIL:', e); process.exit(1); });
