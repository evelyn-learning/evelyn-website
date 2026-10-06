/**
 * GAC served set under PRACTICE_GEN_AUDITED_ONLY_PARTNERS — offline recompute.
 *
 *   TS_NODE_TRANSPILE_ONLY=1 TS_NODE_BASEURL=./ npx ts-node -r tsconfig-paths/register --compiler-options '{"module":"commonjs","baseUrl":"./"}' \
 *     scripts/audit/content-check/audited-only-recompute.ts --dump <prod-dump.json> [--pgen <pgen-listing.json>] --out <file.json>
 *
 * Input: the same READ-ONLY dump part-a.ts takes (dump-prod.js). The in-service
 * set is derived twice with the engine's own `retrievePractice` per skill, as
 * the greenapple caller, with a generator that reserves nothing:
 *   1. the env unset           — the withdrawn list only (the set served today);
 *   2. the env = "greenapple"  — withdrawn list AND the audited-only filter.
 * Optional --pgen: a listing of every `practice-gen.*` bank row; the script
 * adds, per row LO, whether the engine treats that LO as an essay-practice
 * node (seed plans from the code + stored plans in the dump).
 *
 * No database connection, no env file, no model call.
 */
import * as fs from 'node:fs';
import { deriveServable } from './part-a';
import { kindOf, type Product } from './lib';

/* eslint-disable @typescript-eslint/no-explicit-any */
delete process.env.MONGODB_URI;

const arg = (name: string, def?: string): string | undefined => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};

async function main() {
  const dumpPath = arg('dump'); const outPath = arg('out'); const pgenPath = arg('pgen');
  if (!dumpPath || !outPath) throw new Error('usage: --dump <prod-dump.json> --out <file.json> [--pgen <listing.json>]');
  const practice = await import('@/lib/tutor/portal/practice');
  const adapters = await import('@/lib/tutor/portal/adapters');
  const store = await import('@/lib/tutor/lesson-plan/store');
  const essay = await import('@/lib/tutor/portal/essay-practice');
  const withdrawn = await import('@/lib/tutor/portal/withdrawn-items');
  const audited = await import('@/lib/tutor/portal/audited-items');
  // Only what deriveServable reads.
  const P = { retrievePractice: practice.retrievePractice, toPlanLite: adapters.toPlanLite, SEED_PLANS: store.SEED_PLANS } as unknown as Product;
  const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  const planById = new Map<string, any>(dump.plans.map((p: any) => [String(p._id), { ...p, id: String(p._id) }]));
  const plansFor = (loId: string): any[] => {
    const seed = (store.SEED_PLANS as any[]).filter((p) => p.los.some((l: any) => l.id === loId));
    const seen = new Set(seed.map((p) => p.id));
    const stored = (dump.planIdsByLo[loId] ?? []).map((id: string) => planById.get(id)).filter((p: any) => p && !seen.has(p.id));
    return [...seed, ...stored].map((p) => adapters.toPlanLite(p));
  };

  const run = async (env: string | undefined) => {
    if (env === undefined) delete process.env[audited.AUDITED_ONLY_PARTNERS_ENV]; else process.env[audited.AUDITED_ONLY_PARTNERS_ENV] = env;
    const d = await deriveServable(P, dump);
    const kinds: Record<string, number> = {}; const bySubject: Record<string, number> = {}; const pgenBySubject: Record<string, number> = {};
    for (const it of d.items.values()) {
      kinds[it.kind] = (kinds[it.kind] ?? 0) + 1;
      for (const s of new Set(it.skills.map((x) => x.subject))) {
        bySubject[s] = (bySubject[s] ?? 0) + 1;
        if (it.kind === 'pgen') pgenBySubject[s] = (pgenBySubject[s] ?? 0) + 1;
      }
    }
    const band = (n: number) => (n >= 3 ? '3+' : String(n));
    const bands: Record<string, number> = { '3+': 0, '2': 0, '1': 0, '0': 0 };
    for (const s of d.skills) bands[band(new Set(s.itemIds).size)]!++;
    return {
      env: env ?? null,
      items: d.items.size,
      byOrigin: kinds,
      bySubject,
      generatedBySubject: pgenBySubject,
      skills: d.skills.length,
      skillBands: bands,
      servedIds: [...d.items.keys()].sort(),
      skillCounts: d.skills.map((s) => ({ subject: s.subject, loId: s.loId, title: s.title, n: new Set(s.itemIds).size, generated: [...new Set(s.itemIds)].filter((i) => kindOf(i) === 'pgen').length })),
      withdrawnServed: [...d.items.keys()].filter((i) => withdrawn.isWithdrawnItem(i)).length,
      unauditedGeneratedServed: [...d.items.keys()].filter((i) => kindOf(i) === 'pgen' && !audited.isAuditedGeneratedItem(i)).sort(),
    };
  };
  const before = await run(undefined);
  const after = await run('greenapple');
  delete process.env[audited.AUDITED_ONLY_PARTNERS_ENV];

  const skillLos = new Set<string>(dump.courses.flatMap((c: any) => c.nodes.map((n: any) => n.loId)));
  const essayLos = [...skillLos].filter((lo) => essay.isEssayPracticeNode(lo, plansFor(lo))).sort();
  let pgenEssayLos: string[] = [];
  if (pgenPath) {
    const rows: any[] = JSON.parse(fs.readFileSync(pgenPath, 'utf8')).rows;
    pgenEssayLos = [...new Set(rows.map((r) => r.loId as string).filter(Boolean))].filter((lo) => essay.isEssayPracticeNode(lo, plansFor(lo))).sort();
  }
  fs.writeFileSync(outPath, JSON.stringify({
    dumpedAt: dump.dumpedAt, withdrawnListSize: withdrawn.WITHDRAWN_ITEM_IDS.size, auditedListSize: audited.AUDITED_GENERATED_ITEM_IDS.size,
    essayBlockOn: essay.essayGenBlockEnabled(), essaySkillLos: essayLos, generatedRowEssayLos: pgenEssayLos, before, after,
  }));
  const brief = (r: any) => ({ env: r.env, items: r.items, byOrigin: r.byOrigin, skillBands: r.skillBands, withdrawnServed: r.withdrawnServed, unauditedGeneratedServed: r.unauditedGeneratedServed.length });
  console.log(JSON.stringify({ dumpedAt: dump.dumpedAt, essaySkills: essayLos.length, generatedRowEssayLos: pgenEssayLos.length, before: brief(before), after: brief(after) }, null, 1));
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
