/**
 * Phase 3(b) — concept normalizer + prereq-gap resolution tests.
 *
 * Run: `npm run test:portal-concept`
 * Style mirrors scripts/test-cross-session-promotion.ts. No DB / no network —
 * the normalizer core is dependency-injected with fakes.
 */

import assert from 'node:assert';
import {
  canonicalizeConceptLabelWith,
  cosineSimilarity,
  makeConceptId,
  type ConceptRegistry,
  type ConceptLite,
  type Embedder,
} from '@/lib/tutor/concept-registry/normalizer';
import { resolveSettledPrereqGaps } from '@/lib/tutor/concept-registry/resolve-prereq-gaps';
import { recordGap } from '@/lib/tutor/student-profile/store';
import type { StudentProfile, GapEntry } from '@/lib/tutor/student-profile/types';

let passed = 0;
let failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
  }
}

// --- Fakes ----------------------------------------------------------------

const VECTORS: Record<string, number[]> = {
  'adding fractions': [1, 0, 0],
  'fraction addition': [0.99, 0.0141, 0], // cosine ≈ 0.9999 with [1,0,0]
  photosynthesis: [0, 1, 0], // orthogonal → new
  'kind of related': [0.8, 0.6, 0], // cosine 0.8 with [1,0,0] → below 0.85
};

const fakeEmbedder: Embedder = {
  async embed(text: string) {
    const key = text.toLowerCase().replace(/\s+/g, ' ').trim();
    return VECTORS[key] ?? [0, 0, 1];
  },
};

class FakeRegistry implements ConceptRegistry {
  public rows: ConceptLite[];
  public created: ConceptLite[] = [];
  constructor(seed: ConceptLite[] = []) {
    this.rows = [...seed];
  }
  async findAll() {
    return [...this.rows];
  }
  async create(input: { id: string; label: string; embedding: number[] }) {
    const row: ConceptLite = { id: input.id, label: input.label, embedding: input.embedding };
    this.rows.push(row);
    this.created.push(row);
    return row;
  }
}

const seededRegistry = () =>
  new FakeRegistry([{ id: 'concept:adding-fractions', label: 'adding fractions', embedding: [1, 0, 0] }]);

// --- Profile fixture helpers ----------------------------------------------

function profileWith(gaps: GapEntry[], mastery: StudentProfile['mastery'] = {}): StudentProfile {
  return {
    id: 'stu',
    mastery,
    gaps,
    recentSessions: [],
    preferences: {},
    createdAt: '2026-06-26T00:00:00.000Z',
    updatedAt: '2026-06-26T00:00:00.000Z',
    schemaVersion: 1,
  };
}

function prereqGap(over: Partial<GapEntry> = {}): GapEntry {
  return {
    id: 'gap-pre',
    kind: 'prerequisite',
    conceptLabel: 'factoring quadratics',
    conceptId: 'concept:factoring-quadratics',
    status: 'confirmed',
    firstSeenAt: '2026-06-01T00:00:00.000Z',
    lastSeenAt: '2026-06-20T00:00:00.000Z',
    ...over,
  };
}

const masteryAt = (loId: string, score: number, exposures: number) => ({
  [loId]: { loId, score, exposures, lastTouchedAt: '2026-06-26T00:00:00.000Z' },
});

// ---------------------------------------------------------------------------
(async () => {
  console.log('\nPhase 3(b) — cosine + normalizer core:\n');

  await test('cosineSimilarity: identical → ~1, orthogonal → 0, mismatch → 0', () => {
    assert.ok(Math.abs(cosineSimilarity([1, 2, 3], [1, 2, 3]) - 1) < 1e-9);
    assert.strictEqual(cosineSimilarity([1, 0], [0, 1]), 0);
    assert.strictEqual(cosineSimilarity([1, 0, 0], [1, 0]), 0);
  });

  await test('makeConceptId slugifies', () => {
    assert.strictEqual(makeConceptId('Adding   Fractions!'), 'concept:adding-fractions');
  });

  await test('merge: "fraction addition" canonicalizes to existing "adding fractions"', async () => {
    const reg = seededRegistry();
    const r = await canonicalizeConceptLabelWith('fraction addition', { registry: reg, embedder: fakeEmbedder });
    assert.ok(r);
    assert.strictEqual(r!.conceptId, 'concept:adding-fractions');
    assert.ok(r!.similarity >= 0.85, `similarity ${r!.similarity} should be ≥ 0.85`);
    assert.strictEqual(reg.created.length, 0, 'no new concept should be created on merge');
  });

  await test('new: unrelated "photosynthesis" creates a new concept', async () => {
    const reg = seededRegistry();
    const r = await canonicalizeConceptLabelWith('photosynthesis', { registry: reg, embedder: fakeEmbedder });
    assert.strictEqual(r!.conceptId, 'concept:photosynthesis');
    assert.strictEqual(reg.created.length, 1);
  });

  await test('threshold: cosine 0.8 < 0.85 → new concept (no false merge)', async () => {
    const reg = seededRegistry();
    const r = await canonicalizeConceptLabelWith('kind of related', { registry: reg, embedder: fakeEmbedder });
    assert.strictEqual(reg.created.length, 1, 'should NOT merge below threshold');
    assert.strictEqual(r!.conceptId, 'concept:kind-of-related');
  });

  await test('empty label → null', async () => {
    const r = await canonicalizeConceptLabelWith('   ', { registry: seededRegistry(), embedder: fakeEmbedder });
    assert.strictEqual(r, null);
  });

  console.log('\nPhase 3(b) — resolveSettledPrereqGaps:\n');

  await test('prereq gap resolves when concept mastery sustained (0.8 / 3)', () => {
    const p = profileWith([prereqGap()], masteryAt('concept:factoring-quadratics', 0.8, 3));
    const r = resolveSettledPrereqGaps(p);
    assert.strictEqual(r.gaps[0].status, 'resolved');
    assert.notStrictEqual(r, p);
  });

  await test('not resolved below score threshold', () => {
    const p = profileWith([prereqGap()], masteryAt('concept:factoring-quadratics', 0.79, 5));
    assert.strictEqual(resolveSettledPrereqGaps(p).gaps[0].status, 'confirmed');
  });

  await test('not resolved below exposures threshold', () => {
    const p = profileWith([prereqGap()], masteryAt('concept:factoring-quadratics', 0.95, 2));
    assert.strictEqual(resolveSettledPrereqGaps(p).gaps[0].status, 'confirmed');
  });

  await test('skipped when conceptId empty (normalizer has not run)', () => {
    const p = profileWith([prereqGap({ conceptId: undefined })], masteryAt('concept:factoring-quadratics', 0.95, 9));
    const r = resolveSettledPrereqGaps(p);
    assert.strictEqual(r.gaps[0].status, 'confirmed');
    assert.strictEqual(r, p, 'no mutation → same ref');
  });

  await test('lo-kind gaps untouched', () => {
    const loGap: GapEntry = {
      id: 'g-lo', kind: 'lo', loId: 'apstats.x', status: 'confirmed',
      firstSeenAt: '2026-06-01T00:00:00.000Z', lastSeenAt: '2026-06-01T00:00:00.000Z',
    };
    const p = profileWith([loGap], masteryAt('apstats.x', 0.99, 9));
    assert.strictEqual(resolveSettledPrereqGaps(p), p);
  });

  await test('idempotent: already-resolved stays resolved (same ref)', () => {
    const p = profileWith([prereqGap({ status: 'resolved' })], masteryAt('concept:factoring-quadratics', 0.9, 5));
    assert.strictEqual(resolveSettledPrereqGaps(p), p);
  });

  await test('reversible: re-firing the concept via recordGap reopens it (conceptId preserved)', () => {
    const resolved = prereqGap({ status: 'resolved' });
    const p = profileWith([resolved]);
    const reopened = recordGap(p, {
      kind: 'prerequisite',
      conceptLabel: 'factoring quadratics',
      observation: 'still struggling',
      studentQuotes: [],
      signals: ['MISCONCEPTION_DETECTED'],
      sessionId: 's-new',
    });
    const g = reopened.gaps[0];
    assert.notStrictEqual(g.status, 'resolved', 'should no longer be resolved');
    assert.strictEqual(g.conceptId, 'concept:factoring-quadratics', 'conceptId preserved across reopen');
  });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
})();
