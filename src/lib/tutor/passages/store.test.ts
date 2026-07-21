import { strict as assert } from 'node:assert';
import { SEED_PASSAGES, resolvePassage } from './store';

let passed = 0, failed = 0;
function test(name: string, fn: () => void): void {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}`); console.error(e); }
}

test('resolvePassage returns a seeded passage', () => {
  const p = resolvePassage('evelyn.passage.douglass-fourth-of-july.v1');
  assert.ok(p, 'expected passage to resolve');
  assert.equal(p!.author, 'Frederick Douglass');
  assert.equal(p!.license, 'public-domain');
});

test('resolvePassage returns undefined for unknown id', () => {
  assert.equal(resolvePassage('nope'), undefined);
});

test('all passages carry an allowed license and unique ids', () => {
  const ids = SEED_PASSAGES.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate passage ids');
  // 'public-domain' = sourced historical texts; 'internal-original' =
  // Evelyn-authored (e.g. ACT mock reading/science passages).
  for (const p of SEED_PASSAGES) {
    assert.ok(
      p.license === 'public-domain' || p.license === 'internal-original',
      `unexpected license ${p.license} on ${p.id}`,
    );
    if (p.license === 'internal-original') {
      assert.ok(p.author.startsWith('Evelyn'), `internal-original passage ${p.id} must credit Evelyn as author`);
    }
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
