/**
 * Hand-authored DRAWN practice items — GreenApple T4 (29-Oct release, contract
 * v1.22.0 drawn answers): the student plots points or a line on a blank
 * coordinate grid, or marks one interval / ray on a number line, and the
 * contract's `gradeDrawn` grades it (no model).
 *
 * The items are data, one file per writing group under ./t4-drawn-items/
 * (kit.ts holds the shape; objectives.ts the objectives). drawn-core.ts builds
 * each into its stored row, serves it through the engine's serve path and
 * proves it (see that file); this script refuses to write anything while a
 * single problem stands.
 *
 * Outputs (insert-only rows — NOT imported here) under the working folder
 * docs/whitelabel/greenapple/integration/practice-drawn-2026-10-t4/:
 *   final/drawn-rows-t4.json      every built row
 *   final/key-proofs-t4.json      per item: the proof, and every answer graded
 *   served-items-t4.json          the items as POST /api/portal/v1/practice returns them (svg + frame)
 *   mapping.json, summary.json, gallery.html, png/ (figure at the 340 px column, 2×)
 *   read/<group>/packet.md|json   for the independent readers: stem + figure, no key
 * and with --finalize (after the readers' read/<group>/answers.json):
 *   read/<group>/compare.json, final/import-rows-t4.json, final/import-ids-t4.json,
 *   final/audited-rows-to-append-t4.csv, final/audited-generated-combined-t4.csv,
 *   final/import-t4.mongosh.js
 *
 * ⚠️ Drawn rows may be inserted ONLY AFTER the engine carrying the drawn gate
 * (drawn-items.ts, PRACTICE_DRAWN_ANSWER_PARTNERS) is deployed.
 *
 * No database, no network, no model. Run from apps/tutor:
 *   env -u MONGODB_URI npx tsx scripts/practice-extend/author-t4-drawn-items.ts [--only <group>[,<group>]] [--check] [--finalize]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { gradeDrawn } from '@evelyn/portal-contract/v1';
import { SEED_PLANS } from '../../src/lib/tutor/lesson-plan/store';
import { buildDrawnItem, drawnBankRow, fmt, intervalText, setProblems, type BuiltDrawn } from './drawn-core';
import { T4_GROUPS, T4_OBJECTIVE_GROUP } from './t4-drawn-items/objectives';
import type { DrawnItem } from './t4-drawn-items/kit';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const OUT = `${INTEGRATION}/practice-drawn-2026-10-t4`;
const PACKS = `${INTEGRATION}/practice-expand-2026-10-12/packs`;
const COMBINED_BEFORE = `${INTEGRATION}/practice-figures-2026-10-t2/final/audited-generated-combined-t2.csv`;
const AUDITED_LIST = path.resolve(__dirname, '../../src/data/audited-generated-items.json');
const EVIDENCE = 'T4 drawn items 2026-10-15/17: key proven in code (gradeDrawn on the served spec, truth check, near misses), independent read, rendered through the engine serve path and the academy DrawnAnswer';
const PNG_WIDTH = 680;

interface Objective { lo: string; group: string; topic: string; subject: string; description: string; want: number }

function readJson<T>(f: string): T { return JSON.parse(fs.readFileSync(f, 'utf8')) as T; }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function loadT4Objectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  const packs = fs.readdirSync(PACKS).map((f) => readJson<{ subject: string; skill: string; objectives: Array<{ objectiveLoId: string; description: string }> }>(path.join(PACKS, f)));
  for (const [group, los] of Object.entries(T4_GROUPS)) {
    for (const [lo, want] of Object.entries(los)) {
      if (lo.startsWith('gen-')) {
        const p = packs.find((pk) => pk.objectives.some((o) => o.objectiveLoId === lo));
        if (!p) throw new Error(`${lo}: in no 10-12 pack`);
        // Topic of a newer objective's rows = its skill (the T2 convention).
        out.set(lo, { lo, group, topic: p.skill, subject: p.subject, description: p.objectives.find((o) => o.objectiveLoId === lo)!.description, want });
      } else {
        const plan = SEED_PLANS.find((pl) => pl.los.some((l) => l.id === lo));
        if (!plan || !plan.topic) throw new Error(`${lo}: in no seed plan with a topic`);
        out.set(lo, { lo, group, topic: plan.topic ?? '', subject: plan.topic ?? '', description: plan.los.find((l) => l.id === lo)!.description, want });
      }
    }
  }
  return out;
}

/** What the reader is told about the blank figure (no key). */
function figureText(b: BuiltDrawn): string {
  const it = b.item;
  if (it.kind === 'interval') return `A number line from ${fmt(it.line.min)} to ${fmt(it.line.max)}; ticks every ${fmt(it.snap ?? it.line.minorStep ?? it.line.step ?? 1)}. Ends snap to the ticks.`;
  const g = it.grid;
  const s = it.snap ?? { x: 1, y: 1 };
  return `A blank coordinate grid: ${g.xLabel ?? 'x'} from ${fmt(g.xRange[0])} to ${fmt(g.xRange[1])}, ${g.yLabel ?? 'y'} from ${fmt(g.yRange[0])} to ${fmt(g.yRange[1])}. Points snap to multiples of ${fmt(s.x)} across and ${fmt(s.y)} up.`;
}

function keyText(b: BuiltDrawn): string {
  const it = b.item;
  if (it.kind === 'interval') return intervalText(it.key);
  return it.key.map(([x, y]) => `(${fmt(x)}, ${fmt(y)})`).join(' ');
}

async function main() {
  const argv = process.argv.slice(2);
  const arg = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const only = arg('--only')?.split(',').map((s) => s.trim());
  for (const g of only ?? []) if (!(g in T4_GROUPS)) throw new Error(`unknown group ${g} — one of ${Object.keys(T4_GROUPS).join(', ')}`);
  const checkOnly = argv.includes('--check');
  const objectives = loadT4Objectives();
  const groups = only ?? Object.keys(T4_GROUPS);
  // One group file at a time (a group being written cannot break another group's check).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const itemsOf = (g: string): DrawnItem[] => (require(`./t4-drawn-items/${g}`) as { ITEMS: DrawnItem[] }).ITEMS;
  const items = groups.flatMap((g) => itemsOf(g).map((it) => ({ it, g })));

  const problems: string[] = [];
  const built: BuiltDrawn[] = [];
  for (const [n, { it, g }] of items.entries()) {
    const tag = `${g} #${n + 1} ${it.lo} (${it.t})`;
    const o = objectives.get(it.lo);
    if (!o) { problems.push(`${tag}: not an objective of this run`); continue; }
    if (o.group !== g) problems.push(`${tag}: the objective belongs to group ${o.group}`);
    const b = buildDrawnItem(it);
    for (const p of b.problems) problems.push(`${tag}: ${p}`);
    built.push(b);
  }
  for (const p of setProblems(built)) problems.push(p);
  const audited = new Set(Object.keys(readJson<{ items: Record<string, string> }>(AUDITED_LIST).items));
  for (const b of built) if (audited.has(b.id)) problems.push(`${b.id}: already on the audited list`);
  for (const g of groups) {
    for (const [lo, want] of Object.entries(T4_GROUPS[g])) {
      const have = built.filter((b) => b.item.lo === lo).length;
      if (have < want) problems.push(`${g} ${lo}: ${have} item(s), wants ${want}`);
    }
  }

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  console.log(`${items.length} items declared, ${built.length} built (groups: ${groups.join(', ')})`);
  console.log(JSON.stringify({ byKind: count(built, (b) => b.kind), byGroup: count(built, (b) => T4_OBJECTIVE_GROUP[b.item.lo] ?? '?'), byLevel: count(built, (b) => `level ${b.item.d}`) }));
  if (problems.length) {
    console.error(`\n${problems.length} PROBLEM(S)${checkOnly || only ? '' : ' — nothing written'}:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log('no problems');
  if (checkOnly) return;

  const now = new Date().toISOString();
  const suffix = only ? `-${only.join('+')}` : '';
  for (const d of ['final', 'png', 'read']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const rows = built.map((b) => drawnBankRow(b, objectives.get(b.item.lo)!.topic, now));
  const served = built.map((b) => ({ id: b.id, source: 'bank', problemText: b.item.q, expectedAnswer: b.item.a, responseFormat: 'drawn', difficulty: b.item.d, loId: b.item.lo, figure: b.served!.figure, drawn: b.served!.drawn }));
  const proofs = built.map((b) => ({
    id: b.id, loId: b.item.lo, group: T4_OBJECTIVE_GROUP[b.item.lo], kind: b.kind, task: b.item.t, difficulty: b.item.d, key: keyText(b), answerText: b.item.a, proof: b.proof,
    mustPass: b.mustPass.map((a) => ({ ...a, grade: gradeDrawn(b.served!.drawn, a.answer) })),
    mustFail: b.mustFail.map((a) => ({ ...a, grade: gradeDrawn(b.served!.drawn, a.answer) })),
  }));
  fs.writeFileSync(path.join(OUT, 'final', `drawn-rows-t4${suffix}.json`), JSON.stringify(rows, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, 'final', `key-proofs-t4${suffix}.json`), JSON.stringify(proofs, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, `served-items-t4${suffix}.json`), JSON.stringify({ about: 'T4 drawn items as POST /api/portal/v1/practice serves them (figure svg + drawn frame drawn now by the engine serve path).', items: served }, null, 1) + '\n');
  const mapping = [...objectives.values()].filter((o) => groups.includes(o.group)).map((o) => {
    const mine = built.filter((b) => b.item.lo === o.lo);
    return { loId: o.lo, group: o.group, subject: o.subject, topic: o.topic, objective: o.description, items: mine.length, kinds: [...new Set(mine.map((b) => b.kind))], levels: mine.map((b) => b.item.d), ids: mine.map((b) => b.id) };
  });
  fs.writeFileSync(path.join(OUT, `mapping${suffix}.json`), JSON.stringify(mapping, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, `summary${suffix}.json`), JSON.stringify({ generatedAt: now, items: built.length, objectives: mapping.filter((m) => m.items > 0).length, byKind: count(built, (b) => b.kind), byGroup: count(built, (b) => T4_OBJECTIVE_GROUP[b.item.lo]), byLevel: count(built, (b) => `level ${b.item.d}`), answersGraded: proofs.reduce((t, p) => t + p.mustPass.length + p.mustFail.length, 0) }, null, 1) + '\n');

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp = (mod.default ?? mod) as any;
  for (const b of built) await sharp(Buffer.from(b.served!.figure.svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(OUT, 'png', `${b.id}.png`));

  for (const g of groups) {
    const mine = built.filter((b) => T4_OBJECTIVE_GROUP[b.item.lo] === g);
    if (!mine.length) continue;
    const pk = mine.map((b, i) => {
      const o = objectives.get(b.item.lo)!;
      return { n: i + 1, id: b.id, subject: o.subject, objective: o.description, answerKind: b.kind, question: b.item.q, figure: figureText(b), png: path.join(OUT, 'png', `${b.id}.png`) };
    });
    fs.mkdirSync(path.join(OUT, 'read', g), { recursive: true });
    fs.writeFileSync(path.join(OUT, 'read', g, 'packet.json'), JSON.stringify(pk, null, 1) + '\n');
    fs.writeFileSync(path.join(OUT, 'read', g, 'packet.md'), `# Reader packet — group ${g} (${pk.length} items)\n\n${pk.map((p) => `## ${p.n}. ${p.id}\n\n- Subject: ${p.subject}\n- Objective: ${p.objective}\n- Answer by: ${p.answerKind}\n- Figure: ${p.figure}\n- Figure image (phone width): ${p.png}\n\n${p.question}\n`).join('\n')}`);
  }

  const cards = built.map((b, i) => `<section><div class="fig">${b.served!.figure.svg}</div><div class="q"><p class="meta">#${i + 1} · ${esc(b.id)} · ${esc(b.kind)} · level ${b.item.d} · ${esc(b.item.t)}<br>${esc(objectives.get(b.item.lo)!.description)}</p><p class="stem">${esc(b.item.q)}</p><p><b>Key:</b> ${esc(keyText(b))} — “${esc(b.item.a)}”</p><p><b>Hints:</b> ${b.item.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(b.item.s)}</p><p class="der"><b>Proof:</b> ${esc(b.proof.how)} → ${esc(b.proof.result)}</p><p class="der">${b.mustPass.length} answers must grade correct, ${b.mustFail.length} must grade wrong — all do.</p></div></section>`);
  fs.writeFileSync(path.join(OUT, `gallery${suffix}.html`), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T4 drawn items</title><style>body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block}.q{flex:1;min-width:300px}.meta{font-size:12px;color:#666}.stem{font-weight:600}.der{font-size:13px;color:#444}</style></head><body><h1>GreenApple T4 drawn items — ${built.length}</h1>${cards.join('\n')}</body></html>\n`);
  console.log(`wrote ${rows.length} rows, PNGs, packets, gallery to ${OUT}`);
}

/** After the readers: grade their answers, keep the items every reader got right with no wording defect. */
export function finalize(): void {
  const rows = readJson<Array<Record<string, unknown>>>(path.join(OUT, 'final', 'drawn-rows-t4.json'));
  const served = new Map(readJson<{ items: Array<{ id: string; drawn: unknown }> }>(path.join(OUT, 'served-items-t4.json')).items.map((i) => [i.id, i]));
  const verdict = new Map<string, { pass: boolean; why: string[] }>();
  for (const g of Object.keys(T4_GROUPS)) {
    const dir = path.join(OUT, 'read', g);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => /^answers.*\.json$/.test(f));
    const compare: Array<Record<string, unknown>> = [];
    for (const f of files) {
      for (const a of readJson<Array<{ id: string; answer: unknown; wording?: string; fit?: string }>>(path.join(dir, f))) {
        const s = served.get(a.id);
        if (!s) throw new Error(`${f}: unknown id ${a.id}`);
        const grade = gradeDrawn(s.drawn, a.answer);
        const wordingOk = !a.wording || /^ok\b/i.test(a.wording.trim());
        const v = verdict.get(a.id) ?? { pass: true, why: [] };
        if (!grade.correct) { v.pass = false; v.why.push(`${f}: reader answer graded ${grade.reason}`); }
        if (!wordingOk) { v.pass = false; v.why.push(`${f}: wording — ${a.wording}`); }
        verdict.set(a.id, v);
        compare.push({ id: a.id, file: f, grade, wording: a.wording ?? 'ok', pass: grade.correct && wordingOk });
      }
    }
    fs.writeFileSync(path.join(dir, 'compare.json'), JSON.stringify(compare, null, 1) + '\n');
  }
  const keep = rows.filter((r) => verdict.get(r.id as string)?.pass === true);
  const dropped = rows.filter((r) => verdict.get(r.id as string)?.pass !== true).map((r) => ({ id: r.id, why: verdict.get(r.id as string)?.why ?? ['not read'] }));
  const ids = keep.map((r) => r.id as string);
  fs.writeFileSync(path.join(OUT, 'final', 'import-rows-t4.json'), JSON.stringify(keep, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, 'final', 'import-ids-t4.json'), JSON.stringify(ids) + '\n');
  fs.writeFileSync(path.join(OUT, 'final', 'dropped-t4.json'), JSON.stringify(dropped, null, 1) + '\n');
  const csvLine = (id: string) => `${id},"${EVIDENCE}"`;
  fs.writeFileSync(path.join(OUT, 'final', 'audited-rows-to-append-t4.csv'), ids.map(csvLine).join('\n') + '\n');
  if (fs.existsSync(COMBINED_BEFORE)) {
    const base = fs.readFileSync(COMBINED_BEFORE, 'utf8').replace(/\n+$/, '') + '\n';
    const have = new Set(base.split('\n').slice(1).map((l) => l.split(',')[0]));
    for (const id of ids) if (have.has(id)) throw new Error(`${id} already in the combined CSV`);
    fs.writeFileSync(path.join(OUT, 'final', 'audited-generated-combined-t4.csv'), base + ids.map(csvLine).join('\n') + '\n');
  }
  const tpl = fs.readFileSync(path.join(__dirname, 't4-drawn-items', 'import.mongosh.tpl.js'), 'utf8');
  fs.writeFileSync(path.join(OUT, 'final', 'import-t4.mongosh.js'), tpl.replace(/__N__/g, String(keep.length)));
  console.log(`${keep.length} rows kept, ${dropped.length} dropped${dropped.length ? `: ${dropped.map((d) => `${d.id} (${d.why.join('; ')})`).join(' | ')}` : ''}`);
}

if (require.main === module) {
  if (process.argv.includes('--finalize')) finalize();
  else main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
