import { renderTransientContextBlock } from '../src/lib/tutor/student-profile/transient-context';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
const out = renderTransientContextBlock({ socialMemory: [
  { id: 't1', note: 'Goal: an A in algebra by December', kind: 'context', capturedAt: '2026-09-01T00:00:00Z' },
  { id: 't2', note: 'has a dog called Max', kind: 'context', capturedAt: '2026-09-01T00:00:00Z' },
] })!;
check('goal thread renders with [goal] tag', /- \[goal\] an A in algebra by December/.test(out), out);
check('ordinary context thread unchanged', /- \[context\] has a dog called Max/.test(out));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
