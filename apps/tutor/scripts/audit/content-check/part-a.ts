/**
 * GAC content check — PART A (offline).
 *
 *   tsx -r scripts/audit/content-check/css-stub.cjs scripts/audit/content-check/part-a.ts \
 *     --dump <prod-dump.json> --audit-dir <answer-key-audit dir> --out <results dir>
 *
 * Input: a READ-ONLY dump of what the engine's practice retrieval reads for the
 * 21 GAC Self Study courses (dump-prod.js, run with mongosh on the box).
 * The in-service set is re-derived by running the engine's own
 * `retrievePractice` per skill over that dump (seed plans from the code, stored
 * plans + bank rows from the dump, caller = the greenapple partner, a generator
 * that reserves nothing). No database connection, no env file, no model call.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { loadProduct, checkItem, kindOf, normText, levenshteinWithin, csvRow, uiPathOf, type Item, type ItemResult, type Skill, type Defect, type Product } from './lib';

/* eslint-disable @typescript-eslint/no-explicit-any */

const arg = (name: string, def?: string): string => {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1]!;
  if (def !== undefined) return def;
  throw new Error(`missing --${name}`);
};

export interface Derived { items: Map<string, Item>; skills: Array<Skill & { courseId: string; itemIds: string[]; unit?: number; nodeType?: string }>; gradeDeps: any; dumpedAt: string }

/** Re-derive the in-service set with the engine's own retrieval code. */
export async function deriveServable(P: Product, dump: any): Promise<Derived> {
  const bankById = new Map<string, any>(dump.bank.map((b: any) => [b.id, b]));
  const planById = new Map<string, any>(dump.plans.map((p: any) => [String(p._id), { ...p, id: String(p._id) }]));
  const sources = {
    async plansForLoId(loId: string) {
      const seed = P.SEED_PLANS.filter((p: any) => p.los.some((l: any) => l.id === loId));
      const seen = new Set(seed.map((p: any) => p.id));
      const stored = (dump.planIdsByLo[loId] ?? []).map((id: string) => planById.get(id)).filter((p: any) => p && !seen.has(p.id));
      return [...seed.map(P.toPlanLite), ...stored.map(P.toPlanLite)];
    },
    async plansForTopic() { return []; },
    async bankForLoId(loId: string) {
      return (dump.bankIdsByLo[loId] ?? []).map((id: string) => bankById.get(id)).filter(Boolean).map((b: any) => ({
        id: b.id, problemText: b.problemText, answer: b.answer, hints: b.hints, responseFormat: b.responseFormat, choices: b.choices, difficulty: b.difficulty, loId: b.loId, cedCode: b.cedCode,
      }));
    },
    async bankForTopic() { return []; },
  };
  const noGen = { async generateAndVerify() { return null; }, async reserve() { return 0; }, async persist() { /* never */ } };
  const gradeDeps = {
    async getStoredPlan(planId: string) { return planById.get(planId) ?? null; },
    async findBankRow(itemId: string) { return bankById.get(itemId) ?? null; },
  };
  const items = new Map<string, Item>();
  const skills: Derived['skills'] = [];
  const quiet = console.log; console.log = () => {}; // retrieval logs one line per skipped withdrawn/drawing item
  try {
    for (const c of dump.courses) {
      for (const n of c.nodes) {
        const res = await P.retrievePractice({ studentId: 'content-check', courseId: c.id, scope: { loId: n.loId }, count: 100000 }, sources, noGen, { partnerId: 'greenapple' });
        const sk = { subject: c.key, loId: n.loId, title: n.title, courseId: c.id, itemIds: [] as string[], unit: n.unit, nodeType: n.type };
        for (const pi of res.items) {
          sk.itemIds.push(pi.id);
          let it = items.get(pi.id);
          if (!it) {
            const kind = kindOf(pi.id);
            let rubric: any; let modelResponse: string | undefined; let solutionText: string | undefined; let passageIds: string[] = []; let verifierModel: string | undefined;
            if (kind === 'bank' || kind === 'pgen') {
              const b = bankById.get(pi.id);
              rubric = b?.rubric; solutionText = b?.solutionText; passageIds = b?.passageId ? [b.passageId] : []; verifierModel = b?.verifierModel;
            } else {
              const [planId, segId] = [pi.id.slice(0, pi.id.indexOf('::')), pi.id.slice(pi.id.indexOf('::') + 2)];
              const plan = P.SEED_PLANS.find((p: any) => p.id === planId) ?? planById.get(planId);
              const seg = plan?.segments?.find((s: any) => s.id === segId && s.kind === 'try_yourself');
              rubric = seg?.rubric ?? undefined; modelResponse = seg?.modelResponse ?? undefined;
              passageIds = [...(seg?.passageId ? [seg.passageId] : []), ...(seg?.passageIds ?? [])];
            }
            it = {
              id: pi.id, kind, format: pi.responseFormat, question: pi.problemText ?? '', key: pi.expectedAnswer ?? undefined,
              choices: Array.isArray(pi.choices) ? pi.choices : [], hints: Array.isArray(pi.hints) ? pi.hints : [], skills: [],
              rubric: rubric ?? undefined, modelResponse, solutionText, passageIds, verifierModel, difficulty: pi.difficulty,
            };
            items.set(pi.id, it);
          }
          it.skills.push({ subject: c.key, loId: n.loId, title: n.title });
        }
        skills.push(sk);
      }
    }
  } finally { console.log = quiet; }
  return { items, skills, gradeDeps, dumpedAt: dump.dumpedAt };
}

const choiceTexts = (ch: any): string[] => (Array.isArray(ch) ? ch.map((c: any) => (typeof c === 'string' ? c : `${c.text}${c.correct ? ' *' : ''}`)) : []);

async function main() {
  const dumpPath = arg('dump');
  const auditDir = arg('audit-dir');
  const outDir = arg('out');
  fs.mkdirSync(outDir, { recursive: true });
  const P = await loadProduct();
  const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
  const { items, skills, gradeDeps } = await deriveServable(P, dump);

  /* ---------------- drift vs the audited worklist ---------------- */
  const worklist: Record<string, any[]> = JSON.parse(fs.readFileSync(path.join(auditDir, 'worklist.json'), 'utf8'));
  const auditedIds = new Set(Object.keys(worklist));
  // first column of each CSV record (fields may contain quoted newlines)
  const withdrawnCsvIds = new Set<string>();
  { const csv = fs.readFileSync(path.join(auditDir, 'withdrawn-combined.csv'), 'utf8'); let inQ = false; let start = 0; let first = true;
    for (let i = 0; i <= csv.length; i++) { const ch = csv[i]; if (ch === '"') inQ = !inQ; if ((ch === '\n' && !inQ) || i === csv.length) { const rec = csv.slice(start, i); start = i + 1; if (first) { first = false; continue; } const id = rec.match(/^("(?:[^"]|"")*"|[^,]*)/)?.[1]?.replace(/^"|"$/g, '') ?? ''; if (id.trim()) withdrawnCsvIds.add(id.trim()); } } }
  const expected = [...auditedIds].filter((id) => !P.isWithdrawnItem(id));
  const drift = { newItems: [] as any[], missing: [] as any[], changed: [] as any[], withdrawnStillServed: [] as string[], withdrawnListVsCsv: { live: P.withdrawnIds.size, csv: withdrawnCsvIds.size, liveNotInCsv: [...P.withdrawnIds].filter((i) => !withdrawnCsvIds.has(i)).length, csvNotLive: [...withdrawnCsvIds].filter((i) => !P.withdrawnIds.has(i)).length, liveNotInAuditedSet: [...P.withdrawnIds].filter((i) => !auditedIds.has(i)).length } };
  for (const it of items.values()) {
    if (P.isWithdrawnItem(it.id)) drift.withdrawnStillServed.push(it.id);
    const w = worklist[it.id];
    if (!w) { drift.newItems.push({ id: it.id, kind: it.kind, subject: it.skills[0]?.subject, loId: it.skills[0]?.loId, format: it.format, question: it.question, key: it.key ?? null, choices: choiceTexts(it.choices) }); continue; }
    const [, , wfmt, wq, wkey, wch] = w;
    const diffs: string[] = [];
    if ((wq ?? '') !== it.question) diffs.push('question');
    if ((wkey ?? '') !== (it.key ?? '')) diffs.push('key');
    if (JSON.stringify(choiceTexts(wch)) !== JSON.stringify(choiceTexts(it.choices))) diffs.push('choices');
    if ((wfmt ?? '') !== (it.format ?? '')) diffs.push('format');
    if (diffs.length) drift.changed.push({ id: it.id, kind: it.kind, subject: it.skills[0]?.subject, fields: diffs, audited: { format: wfmt, question: wq, key: wkey, choices: choiceTexts(wch) }, now: { format: it.format, question: it.question, key: it.key ?? null, choices: choiceTexts(it.choices) } });
  }
  const planById = new Map<string, any>(dump.plans.map((p: any) => [String(p._id), p]));
  for (const id of expected) {
    if (items.has(id)) continue;
    const w = worklist[id]!;
    let why = 'not returned by retrieval';
    const kind = kindOf(id);
    if (kind === 'revtry') why = 'review plan — never a shared source since the 10-04 scoping fix';
    else if (kind === 'gentry') {
      const [planId, segId] = id.split('::');
      const plan = planById.get(planId!);
      const seg = plan?.segments?.find((s: any) => s.id === segId);
      if (!plan) why = 'generated plan not attached to any GAC skill for this partner (other partner / not in the per-skill plan lookup)';
      else if (plan.metadata?.portalPartnerId && plan.metadata.portalPartnerId !== 'greenapple') why = `plan belongs to partner ${plan.metadata.portalPartnerId}`;
      else if (!seg) why = 'segment no longer in the stored plan';
      else if (seg.keyCheck && seg.keyCheck.status !== 'verified') why = `keyCheck=${seg.keyCheck.status}`;
      else if (P.isDrawingOnlyItem(seg.problem ?? '')) why = 'drawing-only item (dropped)';
      else why = 'segment is not owned by any GAC skill LO (per-LO try-yourself rule)';
    } else if (kind === 'bank' || kind === 'pgen') {
      why = dump.bank.some((b: any) => b.id === id) ? 'bank row exists but is not within the first 50 rows of its skill' : 'bank row no longer exists / no longer tagged to a GAC skill';
    } else if (kind === 'seedtry') {
      const [planId, segId] = id.split('::');
      const plan = P.SEED_PLANS.find((p: any) => p.id === planId);
      const seg = plan?.segments?.find((s: any) => s.id === segId);
      why = !plan ? 'seed plan no longer in the code' : !seg ? 'segment no longer in the seed plan' : P.isDrawingOnlyItem(seg.problem ?? '') ? 'drawing-only item (dropped)' : 'seed plan segment not served under any GAC skill';
    }
    drift.missing.push({ id, kind, subject: w[0], format: w[2], why, question: String(w[3]).slice(0, 160) });
  }

  /* ---------------- per-item checks ---------------- */
  const results: ItemResult[] = [];
  for (const it of items.values()) {
    const path_ = uiPathOf(it);
    const gradeItem = path_ === 'mcq' ? null : await P.resolveGradeItem(it.id, gradeDeps);
    const assessmentKey = path_ === 'mcq' ? await P.resolveAssessmentItem(it.id, gradeDeps) : null;
    results.push(await checkItem(P, it, gradeItem, assessmentKey));
  }
  const byId = new Map(results.map((r) => [r.id, r]));

  /* ---------------- unaudited (drift) defects ---------------- */
  for (const n of drift.newItems) byId.get(n.id)!.defects.push({ cls: 'unaudited_new_item', severity: 'major', field: 'id', excerpt: `not in the 6,375 audited items (${n.kind}); key ${JSON.stringify(n.key)}` });
  for (const c of drift.changed) byId.get(c.id)!.defects.push({ cls: 'unaudited_changed_since_audit', severity: c.fields.some((f: string) => f !== 'format') ? 'major' : 'info', field: c.fields.join('+'), excerpt: `changed since the audit: ${c.fields.join(', ')}` });

  /* ---------------- duplicates ---------------- */
  const keyNorm = (r: ItemResult): string => {
    if (r.uiPath === 'mcq') { const id = r.checks.keyAcceptance.mcq?.webKeyId; return normText(r.choices.find((c) => c.id.toLowerCase() === (id ?? '').toLowerCase())?.text ?? `?${id}`); }
    return normText(r.key ?? '');
  };
  const qNorm = new Map(results.map((r) => [r.id, normText(r.question) + (r.uiPath === 'mcq' ? ' || ' + r.choices.map((c) => normText(c.text)).sort().join(' | ') : '')]));
  const stemNorm = new Map(results.map((r) => [r.id, normText(r.question)]));
  const dupRows: string[] = [csvRow(['scope', 'subject', 'skill', 'relation', 'item_a', 'item_b', 'key_a', 'key_b', 'question_a', 'question_b'])];
  const noted = new Set<string>();
  const addDup = (scope: string, subject: string, skill: string, relation: string, a: ItemResult, b: ItemResult) => {
    const k = `${relation}|${[a.id, b.id].sort().join('|')}`;
    const first = !noted.has(k);
    noted.add(k);
    if (first || scope === 'skill') dupRows.push(csvRow([scope, subject, skill, relation, a.id, b.id, a.uiPath === 'mcq' ? keyNorm(a) : a.key, b.uiPath === 'mcq' ? keyNorm(b) : b.key, a.question.slice(0, 200), b.question.slice(0, 200)]));
    if (!first) return;
    for (const [x, y] of [[a, b], [b, a]] as const) {
      x.checks.duplicates ??= { exactSameKey: [], conflictingKey: [], near: [] };
      if (relation === 'same_question_different_key') { x.checks.duplicates.conflictingKey.push(y.id); x.defects.push({ cls: 'duplicate_question_with_different_key', severity: 'blocker', field: 'question', excerpt: `same question as ${y.id} (${scope}) but key ${JSON.stringify(x.uiPath === 'mcq' ? keyNorm(x) : x.key)} vs ${JSON.stringify(y.uiPath === 'mcq' ? keyNorm(y) : y.key)}` }); } else if (relation === 'identical') { x.checks.duplicates.exactSameKey.push(y.id); x.defects.push({ cls: scope === 'skill' ? 'duplicate_item_within_skill' : 'duplicate_item_within_subject', severity: 'minor', field: 'question', excerpt: `same question and key as ${y.id}` }); } else { x.checks.duplicates.near.push(y.id); x.defects.push({ cls: 'near_duplicate_item', severity: 'minor', field: 'question', excerpt: `${relation} with ${y.id}: ${y.question.slice(0, 90)}` }); }
    }
  };
  const comparePool = (scope: string, subject: string, skill: string, pool: ItemResult[]) => {
    const groups = new Map<string, ItemResult[]>();
    for (const r of pool) { const k = stemNorm.get(r.id)!; if (!k) continue; (groups.get(k) ?? groups.set(k, []).get(k)!).push(r); }
    for (const g of groups.values()) {
      for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
        const a = g[i]!; const b = g[j]!;
        if (a.id === b.id) continue;
        const sameOptions = qNorm.get(a.id) === qNorm.get(b.id);
        // A generic stem ("Which sentence is punctuated correctly?") over different option sets is a different question.
        if (a.uiPath === 'mcq' && b.uiPath === 'mcq' && !sameOptions) continue;
        if (a.uiPath !== b.uiPath && (a.uiPath === 'mcq' || b.uiPath === 'mcq')) { addDup(scope, subject, skill, 'same_stem_as_typed_and_as_choice', a, b); continue; }
        if (keyNorm(a) === keyNorm(b)) addDup(scope, subject, skill, 'identical', a, b);
        else if (a.uiPath === 'engine' && b.uiPath === 'engine' && (a.checks.keyAcceptance.judgeGraded || b.checks.keyAcceptance.judgeGraded) && (normText(a.key ?? '').includes(normText(b.key ?? '')) || normText(b.key ?? '').includes(normText(a.key ?? '')))) addDup(scope, subject, skill, 'same_stem_key_worded_differently', a, b);
        else addDup(scope, subject, skill, 'same_question_different_key', a, b);
      }
    }
    if (scope !== 'skill') return;
    // near-duplicates (edit distance ≤ 8 % of length), excluding pairs that differ only in their numbers
    const arr = pool.map((r) => ({ r, s: stemNorm.get(r.id)! })).filter((x) => x.s.length >= 25);
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i]!; const b = arr[j]!;
      if (a.s === b.s) continue;
      const max = Math.floor(Math.max(a.s.length, b.s.length) * 0.08);
      if (levenshteinWithin(a.s, b.s, max) > max) continue;
      const strip = (s: string) => s.replace(/-?\d+(?:\.\d+)?/g, '#');
      addDup(scope, subject, skill, strip(a.s) === strip(b.s) ? 'near_duplicate_numbers_differ' : 'near_duplicate_wording', a.r, b.r);
    }
  };
  for (const sk of skills) comparePool('skill', sk.subject, sk.loId, [...new Set(sk.itemIds)].map((id) => byId.get(id)!));
  for (const subject of [...new Set(skills.map((s) => s.subject))]) comparePool('subject', subject, '', [...new Set(skills.filter((s) => s.subject === subject).flatMap((s) => s.itemIds))].map((id) => byId.get(id)!));
  // variants that differ only in their numbers are intended practice variety — keep them in duplicates.csv, not as defects
  for (const r of results) r.defects = r.defects.filter((d) => !(d.cls === 'near_duplicate_item' && d.excerpt.startsWith('near_duplicate_numbers_differ')));

  /* ---------------- outputs ---------------- */
  fs.writeFileSync(path.join(outDir, 'items.jsonl'), results.map((r) => JSON.stringify(r)).join('\n') + '\n');
  fs.writeFileSync(path.join(outDir, 'duplicates.csv'), dupRows.join('\n') + '\n');
  fs.writeFileSync(path.join(outDir, 'drift.json'), JSON.stringify(drift, null, 1));
  const defRows = [csvRow(['item_id', 'subject', 'skill', 'source', 'format', 'grading_path', 'defect_class', 'severity', 'field', 'excerpt', 'question'])];
  const sevRank: Record<string, number> = { blocker: 0, major: 1, minor: 2, info: 3 };
  const flat: Array<{ r: ItemResult; d: Defect }> = results.flatMap((r) => r.defects.map((d) => ({ r, d })));
  flat.sort((a, b) => sevRank[a.d.severity]! - sevRank[b.d.severity]! || a.d.cls.localeCompare(b.d.cls) || a.r.id.localeCompare(b.r.id));
  for (const { r, d } of flat) defRows.push(csvRow([r.id, r.subjects.join('|'), r.skills.map((s) => s.loId).join('|'), r.kind, r.format ?? '', r.uiPath, d.cls, d.severity, d.field, d.excerpt, r.question.slice(0, 240)]));
  fs.writeFileSync(path.join(outDir, 'defects.csv'), defRows.join('\n') + '\n');
  fs.writeFileSync(path.join(outDir, 'skills.json'), JSON.stringify(skills.map((s) => ({ subject: s.subject, courseId: s.courseId, loId: s.loId, title: s.title, unit: s.unit, nodeType: s.nodeType, itemIds: s.itemIds })), null, 0));
  // judge-graded list
  const judge = results.filter((r) => r.checks.keyAcceptance.judgeGraded);
  fs.writeFileSync(path.join(outDir, 'judge-graded.csv'), [csvRow(['item_id', 'subject', 'skill', 'source', 'format', 'judge_kind', 'key', 'question']), ...judge.map((r) => csvRow([r.id, r.subjects.join('|'), r.skills.map((s) => s.loId).join('|'), r.kind, r.format, r.checks.keyAcceptance.judgeKind, (r.key ?? '').slice(0, 160), r.question.slice(0, 200)]))].join('\n') + '\n');

  /* ---------------- summary ---------------- */
  const subjects = dump.courses.map((c: any) => c.key as string);
  const count = <T,>(xs: T[], f: (x: T) => string) => { const m = new Map<string, number>(); for (const x of xs) m.set(f(x), (m.get(f(x)) ?? 0) + 1); return m; };
  const L: string[] = [];
  L.push('# GAC practice content check — Part A (offline)', '');
  L.push(`Production data read ${dump.dumpedAt} (read-only dump). Engine + academy code = the deployed files (checksums compared on the box).`, '');
  L.push('## In-service set', '');
  L.push(`- Items in service now: **${items.size}** across ${skills.length} skills in ${subjects.length} subjects (audited worklist ${auditedIds.size}, live withdrawal list ${P.withdrawnIds.size}, expected ${expected.length}).`);
  L.push(`- By source: ${[...count(results, (r) => r.kind)].map(([k, n]) => `${k} ${n}`).join(' · ')}.`);
  L.push(`- By grading path: ${[...count(results, (r) => r.uiPath)].map(([k, n]) => `${k} ${n}`).join(' · ')} (mcq = decided in the browser + stored by the api; numeric-client = same, numeric rule; engine = the engine's grade endpoint).`);
  L.push(`- Skills with 0 stored items: ${skills.filter((s) => s.itemIds.length === 0).length}; with 1–2: ${skills.filter((s) => s.itemIds.length > 0 && s.itemIds.length < 3).length}.`);
  L.push('', '## Drift vs the audited worklist', '');
  L.push(`- New items (never audited): **${drift.newItems.length}** — ${[...count(drift.newItems, (n: any) => `${n.kind}/${n.subject}`)].map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}.`);
  L.push(`- Audited, not withdrawn, no longer served: **${drift.missing.length}** — ${[...count(drift.missing, (n: any) => `${n.kind}: ${n.why}`)].map(([k, n]) => `${k} (${n})`).join('; ') || 'none'}.`);
  L.push(`- Changed text / key / options since the audit: **${drift.changed.length}** — ${[...count(drift.changed, (n: any) => n.fields.join('+'))].map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}.`);
  L.push(`- Withdrawn ids still returned by retrieval: **${drift.withdrawnStillServed.length}**.`);
  L.push(`- Withdrawal list: live ${drift.withdrawnListVsCsv.live}, withdrawn-combined.csv ${drift.withdrawnListVsCsv.csv} (live not in csv ${drift.withdrawnListVsCsv.liveNotInCsv}, csv not live ${drift.withdrawnListVsCsv.csvNotLive}, live ids outside the audited set ${drift.withdrawnListVsCsv.liveNotInAuditedSet}).`);
  L.push('', 'Detail: `drift.json`.', '');
  L.push('## Defects by severity', '');
  const real = flat.filter((x) => x.d.severity !== 'info');
  for (const sev of ['blocker', 'major', 'minor', 'info']) L.push(`- ${sev}: ${flat.filter((x) => x.d.severity === sev).length} findings on ${new Set(flat.filter((x) => x.d.severity === sev).map((x) => x.r.id)).size} items`);
  L.push(`- items with at least one blocker/major/minor finding: ${new Set(real.map((x) => x.r.id)).size}; items with none: ${items.size - new Set(real.map((x) => x.r.id)).size}`);
  L.push('', '## Defects by class × subject (items, not findings)', '');
  const classes = [...new Set(flat.map((x) => `${x.d.severity}|${x.d.cls}`))].sort((a, b) => sevRank[a.split('|')[0]!]! - sevRank[b.split('|')[0]!]! || a.localeCompare(b));
  L.push(`| severity | class | total | ${subjects.join(' | ')} |`, `|---|---|---|${subjects.map(() => '---').join('|')}|`);
  for (const sc of classes) {
    const [sev, cls] = sc.split('|') as [string, string];
    const its = new Map<string, Set<string>>();
    for (const x of flat) if (x.d.cls === cls && x.d.severity === sev) for (const s of x.r.subjects) (its.get(s) ?? its.set(s, new Set()).get(s)!).add(x.r.id);
    const total = new Set(flat.filter((x) => x.d.cls === cls && x.d.severity === sev).map((x) => x.r.id)).size;
    L.push(`| ${sev} | ${cls} | ${total} | ${subjects.map((s) => its.get(s)?.size ?? '').join(' | ')} |`);
  }
  L.push('', '## Key acceptance (deterministic graders only)', '');
  const mcq = results.filter((r) => r.uiPath === 'mcq');
  const mcqOk = mcq.filter((r) => { const m = r.checks.keyAcceptance.mcq!; return m.perChoice.filter((c) => c.web).length === 1 && m.perChoice.filter((c) => c.api).length === 1 && m.perChoice.every((c) => c.web === c.api); });
  L.push(`- Multiple choice: ${mcq.length} items; keyed option graded correct and every other option incorrect under both the on-screen rule and the stored-grade rule: **${mcqOk.length}/${mcq.length}**.`);
  for (const p of ['numeric-client', 'engine'] as const) {
    const pool = results.filter((r) => r.uiPath === p);
    L.push('', `### Typed items on the ${p === 'engine' ? 'engine grade endpoint (free / frq)' : 'browser numeric check (numeric)'} path — ${pool.length} items`, '');
    L.push('| submitted | items | on-screen (web) accepts | stored grade (api) accepts | engine rule accepts | engine → judge |', '|---|---|---|---|---|---|');
    const names = [...new Set(pool.flatMap((r) => r.checks.keyAcceptance.variants.map((v) => v.name)))];
    for (const nme of names) {
      const vs = pool.flatMap((r) => r.checks.keyAcceptance.variants.filter((v) => v.name === nme));
      const c = (f: (v: any) => boolean) => vs.filter(f).length;
      L.push(`| ${nme} | ${vs.length} | ${p === 'engine' ? `(mirror) ${c((v) => v.web === 'correct')}` : c((v) => v.web === 'correct')} | ${p === 'engine' ? `(mirror) ${c((v) => v.api === 'correct')}` : c((v) => v.api === 'correct')} | ${c((v) => v.engine === 'correct')} | ${c((v) => v.engine === 'judge' || v.engine === 'judge-rubric')} |`);
    }
  }
  L.push('', '## Judge-graded items (the stored key itself goes to the model judge — not called here)', '');
  L.push(`Total **${judge.length}** (${judge.filter((r) => r.checks.keyAcceptance.judgeKind === 'rubric').length} rubric-graded, ${judge.filter((r) => r.checks.keyAcceptance.judgeKind === 'single-answer').length} single-answer). List: \`judge-graded.csv\`.`, '');
  L.push('| subject | single-answer judge | rubric judge |', '|---|---|---|');
  for (const s of subjects) L.push(`| ${s} | ${judge.filter((r) => r.subjects.includes(s) && r.checks.keyAcceptance.judgeKind === 'single-answer').length} | ${judge.filter((r) => r.subjects.includes(s) && r.checks.keyAcceptance.judgeKind === 'rubric').length} |`);
  L.push('', '## Self-containment', '');
  const refs = results.flatMap((r) => r.checks.selfContainment.map((f) => ({ r, f })));
  L.push('| reference kind | really missing | content is inline |', '|---|---|---|');
  for (const k of ['figure', 'table', 'data', 'passage', 'deictic']) L.push(`| ${k} | ${refs.filter((x) => x.f.kind === k && x.f.status === 'missing').length} | ${refs.filter((x) => x.f.kind === k && x.f.status === 'inline').length} |`);
  L.push('', '## Re-run', '', '```', '# 1. read-only dump of what practice retrieval reads (find/count only)', `ssh root@84.247.185.169 'mongosh "mongodb://127.0.0.1:2710/evelyn?directConnection=true" --quiet --eval "$(cat)"' < scripts/audit/content-check/dump-prod.js > <scratch>/prod-dump.json`, '# 2. offline checks (from apps/tutor; no DB, no env file, no model calls)', `<academy>/node_modules/.bin/tsx -r scripts/audit/content-check/css-stub.cjs scripts/audit/content-check/part-a.ts --dump <scratch>/prod-dump.json --audit-dir ${auditDir} --out ${outDir}`, '```', '');
  fs.writeFileSync(path.join(outDir, 'summary.md'), L.join('\n'));
  console.log(L.slice(0, 40).join('\n'));
}

if (require.main === module) main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
