/**
 * GAC content check — PART B report: what the sandbox SERVED vs Part A, and live grading.
 *
 *   tsx -r scripts/audit/content-check/css-stub.cjs scripts/audit/content-check/part-b-report.ts \
 *     --crawl <scratch>/crawl-log.jsonl [--grade <scratch>/grade-log.jsonl] [--new-rows <scratch>/new-pgen-rows.json] --out <results dir>
 *
 * Reads the crawl / grading logs and Part A's items.jsonl + skills.json from --out.
 * No network, no database, no model calls. Items that Part A did not know (generated on
 * request) go through every Part A check here and are listed in full.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { loadProduct, checkItem, kindOf, csvRow, uiPathOf, type Item, type ItemResult } from './lib';

/* eslint-disable @typescript-eslint/no-explicit-any */

const arg = (name: string, def?: string): string => {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1]!;
  if (def !== undefined) return def;
  throw new Error(`missing --${name}`);
};
const readJsonl = (p: string): any[] => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);
const sha = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const choiceTexts = (ch: any): string[] => (Array.isArray(ch) ? ch.map((c: any) => (typeof c === 'string' ? c : `${c.text}`)) : []);

async function main() {
  const outDir = arg('out');
  const P = await loadProduct();
  const partA = new Map<string, ItemResult>(readJsonl(path.join(outDir, 'items.jsonl')).map((r) => [r.id, r]));
  const skills: any[] = JSON.parse(fs.readFileSync(path.join(outDir, 'skills.json'), 'utf8'));
  const skillByLo = new Map(skills.map((s) => [`${s.subject}|${s.loId}`, s]));
  const crawl = readJsonl(arg('crawl'));
  const grade = readJsonl(arg('grade', ''));
  const newRows: any[] = arg('new-rows', '') && fs.existsSync(arg('new-rows', '')) ? JSON.parse(fs.readFileSync(arg('new-rows', ''), 'utf8')) : [];
  const newRowById = new Map(newRows.map((r) => [r.id, r]));
  const crawlStart = crawl.find((r) => r.type === 'practice')?.at ?? '';

  /* ---------------- served items ---------------- */
  interface Served { id: string; payload: any; under: Set<string>; students: Set<string>; times: number; firstAt: string; phases: Set<number>; payloadHashes: Set<string> }
  const served = new Map<string, Served>();
  const mism: string[] = [csvRow(['kind', 'subject', 'skill', 'item_id', 'detail', 'request', 'response'])];
  const kinds = new Map<string, number>();
  const addM = (kind: string, subject: string, skill: string, id: string, detail: string, req: unknown = '', res: unknown = '') => { kinds.set(kind, (kinds.get(kind) ?? 0) + 1); mism.push(csvRow([kind, subject, skill, id, detail, typeof req === 'string' ? req : JSON.stringify(req), typeof res === 'string' ? res : JSON.stringify(res).slice(0, 1500)])); };
  const perSkill = new Map<string, { requests: number; errors: number; slow: number; servedIds: Set<string>; generated: Set<string>; unexpected: Set<string>; stop: string[]; maxMs: number; shortResponses: number; emptyResponses: number }>();
  const sk = (subject: string, loId: string) => { const k = `${subject}|${loId}`; return perSkill.get(k) ?? perSkill.set(k, { requests: 0, errors: 0, slow: 0, servedIds: new Set(), generated: new Set(), unexpected: new Set(), stop: [], maxMs: 0, shortResponses: 0, emptyResponses: 0 }).get(k)!; };
  let keyVisible = 0; let flagVisible = 0; let itemOccurrences = 0;
  const slowRows: any[] = []; const errorRows: any[] = [];
  for (const r of crawl) {
    if (r.type === 'skill-done') { sk(r.subject, r.loId).stop.push(`phase ${r.phase}: ${r.stop ?? `${r.items} items`}`); continue; }
    if (r.type !== 'practice') continue;
    const s = sk(r.subject, r.loId);
    s.requests++; s.maxMs = Math.max(s.maxMs, r.ms);
    const req = { route: 'POST /api/practice', student: r.student, body: { scope: { loId: r.loId }, count: r.count } };
    if (r.status !== 201 && r.status !== 200) { s.errors++; errorRows.push(r); addM('error_response', r.subject, r.loId, '', `HTTP ${r.status || 'no response'} ${r.error ?? ''}`, req, r.error ?? ''); continue; }
    if (r.ms > 5000) { s.slow++; slowRows.push(r); addM('slow_response', r.subject, r.loId, '', `${r.ms} ms for ${r.items.length} items (phase ${r.phase}${r.note ? `, ${r.note}` : ''})`, req, r.items.map((i: any) => i.id)); }
    if (r.items.length === 0) s.emptyResponses++; else if (r.items.length < r.count) s.shortResponses++;
    const expected = new Set<string>(skillByLo.get(`${r.subject}|${r.loId}`)?.itemIds ?? []);
    for (const it of r.items) {
      itemOccurrences++;
      const ph = sha(JSON.stringify([it.problemText, it.expectedAnswer, it.choices, it.hints, it.responseFormat]));
      const e = served.get(it.id) ?? served.set(it.id, { id: it.id, payload: it, under: new Set(), students: new Set(), times: 0, firstAt: r.at, phases: new Set(), payloadHashes: new Set() }).get(it.id)!;
      e.under.add(`${r.subject}|${r.loId}`); e.students.add(r.student); e.times++; e.phases.add(r.phase); e.payloadHashes.add(ph);
      s.servedIds.add(it.id);
      if (it.expectedAnswer !== undefined && it.expectedAnswer !== null && String(it.expectedAnswer) !== '') keyVisible++;
      if (Array.isArray(it.choices) && it.choices.some((c: any) => c.correct !== undefined)) flagVisible++;
      const res = { practiceSetId: r.practiceSetId, item: it };
      if (P.isWithdrawnItem(it.id)) addM('withdrawn_item_served', r.subject, r.loId, it.id, 'the item is on the live withdrawal list', req, res);
      if (/^(?:rev|freestyle)-|homework-lo|\.homework/.test(it.id)) addM('private_plan_item_served', r.subject, r.loId, it.id, 'review / freestyle / homework-plan item', req, res);
      if (it.loId && it.loId !== r.loId) {
        const alias = partA.get(it.id)?.skills.some((x) => x.loId === r.loId);
        if (!alias) addM('item_from_other_skill', r.subject, r.loId, it.id, `payload loId ${it.loId}`, req, res);
      }
      if (!expected.has(it.id)) {
        const a = partA.get(it.id);
        if (a) { s.unexpected.add(it.id); addM('item_from_other_skill_or_subject', r.subject, r.loId, it.id, `Part A has this item under ${a.skills.map((x) => `${x.subject}/${x.loId}`).join(', ')}`, req, res); } else s.generated.add(it.id);
      } else {
        const a = partA.get(it.id)!;
        const diffs: string[] = [];
        if (a.question !== (it.problemText ?? '')) diffs.push('question');
        if ((a.key ?? '') !== (it.expectedAnswer ?? '')) diffs.push('key');
        if (JSON.stringify(choiceTexts(a.choices)) !== JSON.stringify(choiceTexts(it.choices))) diffs.push('options');
        if (JSON.stringify(a.hints ?? []) !== JSON.stringify(it.hints ?? [])) diffs.push('hints');
        if ((a.format ?? '') !== (it.responseFormat ?? '')) diffs.push('format');
        if (diffs.length) addM('served_payload_differs_from_part_a', r.subject, r.loId, it.id, `differs in: ${diffs.join(', ')}`, req, res);
      }
    }
    if (new Set(r.items.map((i: any) => i.id)).size !== r.items.length) addM('duplicate_item_in_one_response', r.subject, r.loId, '', 'same id twice in one response', req, r.items.map((i: any) => i.id));
  }
  for (const e of served.values()) if (e.payloadHashes.size > 1) addM('item_payload_varies_between_responses', [...e.under][0]!.split('|')[0]!, [...e.under][0]!.split('|')[1]!, e.id, `${e.payloadHashes.size} different payloads for the same id`);

  /* ---------------- generated / unknown items: every Part A check ---------------- */
  const genResults: any[] = [];
  const genDefRows = [csvRow(['item_id', 'subject', 'skill', 'format', 'grading_path', 'defect_class', 'severity', 'field', 'excerpt', 'question', 'key', 'options'])];
  for (const e of served.values()) {
    if (partA.has(e.id)) continue;
    const it = e.payload;
    const under = [...e.under].map((u) => { const [subject, loId] = u.split('|') as [string, string]; return { subject, loId, title: skillByLo.get(u)?.title ?? '' }; });
    const item: Item = { id: e.id, kind: kindOf(e.id), format: it.responseFormat, question: it.problemText ?? '', key: it.expectedAnswer ?? undefined, choices: Array.isArray(it.choices) ? it.choices : [], hints: Array.isArray(it.hints) ? it.hints : [], skills: under, passageIds: [], difficulty: it.difficulty };
    const p = uiPathOf(item);
    const gradeItem = p === 'mcq' ? null : { itemId: e.id, expectedAnswer: it.expectedAnswer, problemText: it.problemText };
    let assessmentKey: any = null;
    if (p === 'mcq') { const flagged = item.choices.find((c) => c.correct)?.id; const letter = /^[A-E]$/i.test((it.expectedAnswer ?? '').trim()) && item.choices.some((c) => c.id === it.expectedAnswer.trim().toUpperCase()) ? it.expectedAnswer.trim().toUpperCase() : undefined; assessmentKey = { correctChoiceId: flagged ?? letter }; }
    const res = await checkItem(P, item, gradeItem, assessmentKey);
    const row = newRowById.get(e.id);
    const createdAt = row?.createdAt?.$date ?? row?.createdAt;
    const origin = e.id.startsWith('practice-gen.') ? (createdAt ? (createdAt >= crawlStart ? 'generated on request during this crawl' : `generated earlier (bank row created ${createdAt}), not in the Part A dump`) : 'generated (practice-gen id not in the Part A dump)') : 'unknown id — not in Part A';
    genResults.push({ ...res, origin, bankRowCreatedAt: createdAt ?? null, verifierModel: row?.verifierModel ?? null, servedUnder: [...e.under], servedTo: [...e.students], timesServed: e.times, firstServedAt: e.firstAt, payload: it });
    for (const d of res.defects) genDefRows.push(csvRow([e.id, under.map((u) => u.subject).join('|'), under.map((u) => u.loId).join('|'), item.format ?? '', p, d.cls, d.severity, d.field, d.excerpt, item.question, item.key ?? '', choiceTexts(item.choices).join(' ¦ ')]));
  }
  fs.writeFileSync(path.join(outDir, 'generated-items.jsonl'), genResults.map((r) => JSON.stringify(r)).join('\n') + (genResults.length ? '\n' : ''));
  fs.writeFileSync(path.join(outDir, 'generated-defects.csv'), genDefRows.join('\n') + '\n');

  /* ---------------- served.jsonl ---------------- */
  const servedOut = [...served.values()].map((e) => {
    const a = partA.get(e.id);
    const g = genResults.find((x) => x.id === e.id);
    const kind = kindOf(e.id);
    const origin = a ? ({ bank: 'authored (problem bank)', seedtry: 'authored (lesson-plan try-yourself)', gentry: 'generated course plan (stored, audited 10-04)', pgen: 'generated earlier on request (stored bank row, in Part A)', revtry: 'review plan', other: 'other' } as Record<string, string>)[kind] : g?.origin;
    return { id: e.id, textHash: sha(e.payload.problemText ?? ''), inPartA: !!a, origin, source: e.payload.source, format: e.payload.responseFormat, servedUnder: [...e.under], servedTo: [...e.students], timesServed: e.times, firstServedAt: e.firstAt, keyInPayload: e.payload.expectedAnswer !== undefined && e.payload.expectedAnswer !== null, correctFlagInPayload: Array.isArray(e.payload.choices) && e.payload.choices.some((c: any) => c.correct !== undefined), text: e.payload.problemText, options: e.payload.choices ?? null, expectedAnswer: e.payload.expectedAnswer ?? null, hints: e.payload.hints ?? null };
  });
  fs.writeFileSync(path.join(outDir, 'served.jsonl'), servedOut.map((r) => JSON.stringify(r)).join('\n') + '\n');

  /* ---------------- coverage.csv ---------------- */
  const cov = [csvRow(['subject', 'skill', 'title', 'stored_items_part_a', 'items_served', 'stored_items_served', 'stored_items_not_served', 'generated_count', 'items_from_elsewhere', 'requests', 'short_responses', 'empty_responses', 'errors', 'slow_over_5s', 'max_ms', 'crawled', 'exhausted', 'notes'])];
  let crawled = 0; const unservedAll: Array<{ subject: string; loId: string; id: string }> = [];
  for (const s of skills) {
    const c = perSkill.get(`${s.subject}|${s.loId}`);
    const expected: string[] = [...new Set<string>(s.itemIds)];
    const storedServed = expected.filter((id) => c?.servedIds.has(id));
    const unserved = expected.filter((id) => !c?.servedIds.has(id));
    const wasCrawled = !!c && (c.requests > 0 || c.stop.length > 0);
    if (wasCrawled) crawled++;
    if (wasCrawled && c!.requests > 0) for (const id of unserved) unservedAll.push({ subject: s.subject, loId: s.loId, id });
    const storedExhausted = wasCrawled && unserved.length === 0;
    const drillExhausted = c?.stop.some((x) => /empty-response/.test(x));
    cov.push(csvRow([s.subject, s.loId, s.title, expected.length, c?.servedIds.size ?? 0, storedServed.length, unserved.length, c?.generated.size ?? 0, c?.unexpected.size ?? 0, c?.requests ?? 0, c?.shortResponses ?? 0, c?.emptyResponses ?? 0, c?.errors ?? 0, c?.slow ?? 0, c?.maxMs ?? 0, wasCrawled ? 'yes' : 'no', drillExhausted ? 'yes — the drill returned nothing more' : storedExhausted ? 'stored pool fully served (generation top-up not driven to its cap)' : 'no', (c?.stop ?? []).join(' ¦ ')]));
  }
  fs.writeFileSync(path.join(outDir, 'coverage.csv'), cov.join('\n') + '\n');
  for (const u of unservedAll) addM('in_service_item_not_served', u.subject, u.loId, u.id, 'Part A has this item in service for the skill; the crawl drew the skill and never received it');

  /* ---------------- live grading ---------------- */
  const g = { attemptSets: 0, mcq: 0, mcqKeyOk: 0, mcqWrongOk: 0, num: 0, numKeyOk: 0, numWrongOk: 0, eng: 0, engKeyOk: 0, engWrongOk: 0, errors: 0 };
  const engBySubject = new Map<string, { n: number; keyOk: number; wrongOk: number }>();
  const gradedItems: any[] = [];
  for (const r of grade) {
    if (r.type === 'attempt') {
      if (r.which === 'key') g.attemptSets++;
      if (r.status !== 200) { g.errors++; addM('grade_error_response', r.subject, r.loId, '', `POST /api/practice/attempt → HTTP ${r.status || 'no response'} ${r.error ?? ''}`, r.request, r.response ?? r.error); continue; }
      for (const it of r.items) {
        const per = (r.response?.perItem ?? []).find((p: any) => p.itemId === it.id);
        const submitted = r.request.responses.find((x: any) => x.itemId === it.id)?.answer;
        const isMcq = it.path === 'mcq';
        const want = r.which === 'key';
        const ok = !!per && per.gradable === true && (per.correct === true) === want;
        if (isMcq) { if (want) { g.mcq++; if (ok) g.mcqKeyOk++; } else if (ok) g.mcqWrongOk++; } else { if (want) { g.num++; if (ok) g.numKeyOk++; } else if (ok) g.numWrongOk++; }
        gradedItems.push({ id: it.id, route: 'attempt', path: it.path, which: r.which, submitted, correct: per?.correct ?? null, ok });
        if (!ok) addM(want ? (isMcq ? 'keyed_option_graded_incorrect' : 'stored_key_graded_incorrect') : (isMcq ? 'other_option_graded_correct' : 'wrong_value_graded_correct'), r.subject, r.loId, it.id, `submitted ${JSON.stringify(submitted)}; key ${JSON.stringify(it.expectedAnswer)}; stored grade: ${JSON.stringify(per ?? null)}`, { route: 'POST /api/practice/attempt', student: r.student, body: r.request }, r.response);
      }
    } else if (r.type === 'grade') {
      const want = r.which === 'key';
      if (want) { g.eng++; const e = engBySubject.get(r.subject) ?? engBySubject.set(r.subject, { n: 0, keyOk: 0, wrongOk: 0 }).get(r.subject)!; e.n++; }
      if (r.status !== 200) { g.errors++; addM('grade_error_response', r.subject, r.loId, r.item.id, `POST /api/practice/grade → HTTP ${r.status || 'no response'} ${r.error ?? ''}`, r.request, r.response ?? r.error); continue; }
      const correct = r.response && r.response.maxPoints > 0 && r.response.totalPoints >= r.response.maxPoints;
      const ok = correct === want;
      const e = engBySubject.get(r.subject) ?? engBySubject.set(r.subject, { n: 0, keyOk: 0, wrongOk: 0 }).get(r.subject)!;
      if (want && ok) { g.engKeyOk++; e.keyOk++; } if (!want && ok) { g.engWrongOk++; e.wrongOk++; }
      gradedItems.push({ id: r.item.id, route: 'grade', path: 'engine', which: r.which, submitted: r.request.response.text, correct, points: `${r.response?.totalPoints}/${r.response?.maxPoints}`, ok, ms: r.ms });
      if (!ok) addM(want ? 'stored_key_graded_incorrect' : 'wrong_value_graded_correct', r.subject, r.loId, r.item.id, `submitted ${JSON.stringify(String(r.request.response.text).slice(0, 200))}; key ${JSON.stringify(String(r.item.expectedAnswer).slice(0, 200))}; ${r.response?.totalPoints}/${r.response?.maxPoints}; feedback: ${JSON.stringify((r.response?.parts ?? []).map((p: any) => p.feedback).join(' ').slice(0, 300))}; question: ${JSON.stringify(String(r.item.problemText).slice(0, 200))}`, { route: 'POST /api/practice/grade', student: r.student, body: r.request }, r.response);
      if (r.ms > 5000) addM('slow_response', r.subject, r.loId, r.item.id, `grade took ${r.ms} ms`, { route: 'POST /api/practice/grade' }, '');
    }
  }
  fs.writeFileSync(path.join(outDir, 'live-grading.jsonl'), gradedItems.map((r) => JSON.stringify(r)).join('\n') + (gradedItems.length ? '\n' : ''));
  fs.writeFileSync(path.join(outDir, 'live-mismatches.csv'), mism.join('\n') + '\n');

  /* ---------------- summary ---------------- */
  const inServiceServed = [...served.keys()].filter((id) => partA.has(id)).length;
  const students = [...new Set(crawl.filter((r) => r.type === 'signin').map((r) => r.student))];
  const practice = crawl.filter((r) => r.type === 'practice');
  const L: string[] = [];
  L.push('# GAC practice content check — Part B (live crawl of the sandbox)', '');
  L.push(`Crawl ${crawl[0]?.at ?? '—'} → ${crawl[crawl.length - 1]?.at ?? '—'} against https://greenapple.evelynlearning.com as ${students.length} tagged test students (\`test-students.txt\`).`, '');
  L.push('## Coverage', '');
  L.push(`- Skills crawled: **${crawled} / ${skills.length}** (${skills.filter((s) => s.itemIds.length === 0).length} skills have no stored item; they are drawn only in the generation-limited probe).`);
  L.push(`- Practice requests: ${practice.length} (${practice.filter((r) => r.status !== 200 && r.status !== 201).length} error responses, ${slowRows.length} slower than 5 s; median ${practice.map((r) => r.ms).sort((a, b) => a - b)[Math.floor(practice.length / 2)] ?? 0} ms).`);
  L.push(`- In-service items served: **${inServiceServed} / ${partA.size}**; in-service items the crawl drew the skill for and never received: ${unservedAll.length}.`);
  L.push(`- Items served that Part A did not know: **${genResults.length}** (${genResults.filter((x) => /during this crawl/.test(x.origin)).length} generated on request during the crawl) — listed in full in \`generated-items.jsonl\`; their findings in \`generated-defects.csv\`.`);
  L.push(`- Item payloads delivered: ${itemOccurrences}; with the answer key (\`expectedAnswer\`) in the payload before the student answers: **${keyVisible}**; with a \`correct\` flag on an option: ${flagVisible}. The drill checks multiple-choice and numeric answers in the browser, so the key is sent with every item.`);
  L.push('', '## Live findings by kind', '', '| kind | rows |', '|---|---|');
  for (const [k, n] of [...kinds].sort((a, b) => b[1] - a[1])) L.push(`| ${k} | ${n} |`);
  if (!kinds.size) L.push('| (none) | 0 |');
  L.push('', '## Live grading', '');
  L.push(`- Multiple choice (stored grade, POST /api/practice/attempt): ${g.mcq} items in ${g.attemptSets} sets — keyed option graded correct **${g.mcqKeyOk}/${g.mcq}**, another option graded incorrect **${g.mcqWrongOk}/${g.mcq}**.`);
  L.push(`- Numeric (same route): ${g.num} items — stored key correct **${g.numKeyOk}/${g.num}**, wrong value incorrect **${g.numWrongOk}/${g.num}**.`);
  L.push(`- Free / frq (POST /api/practice/grade → engine): ${g.eng} items — stored key full marks **${g.engKeyOk}/${g.eng}**, wrong value not full marks **${g.engWrongOk}/${g.eng}**.`);
  L.push(`- Error responses while grading: ${g.errors}.`, '');
  L.push('| subject | typed items on the grade route | key accepted | wrong rejected |', '|---|---|---|---|');
  for (const [s, e] of engBySubject) L.push(`| ${s} | ${e.n} | ${e.keyOk} | ${e.wrongOk} |`);
  L.push('', '## Generated / unknown items', '');
  const gd = new Map<string, number>(); for (const r of genResults) for (const d of r.defects) if (d.severity !== 'info') gd.set(`${d.severity} ${d.cls}`, (gd.get(`${d.severity} ${d.cls}`) ?? 0) + 1);
  L.push(`${genResults.length} items; findings: ${[...gd].map(([k, n]) => `${k} ×${n}`).join(', ') || 'none'}.`, '');
  L.push('## Thin skills', '');
  L.push(`Stored items per skill (Part A): 0 → ${skills.filter((s) => s.itemIds.length === 0).length} skills, 1 → ${skills.filter((s) => s.itemIds.length === 1).length}, 2 → ${skills.filter((s) => s.itemIds.length === 2).length}. See \`coverage.csv\` (column stored_items_part_a) and the probe rows (phase 2) for what the first click returns.`, '');
  L.push('| subject | skills | 0 stored | 1 stored | 2 stored |', '|---|---|---|---|---|');
  for (const subject of [...new Set(skills.map((s) => s.subject))]) { const m = skills.filter((s) => s.subject === subject); L.push(`| ${subject} | ${m.length} | ${m.filter((s) => s.itemIds.length === 0).length} | ${m.filter((s) => s.itemIds.length === 1).length} | ${m.filter((s) => s.itemIds.length === 2).length} |`); }
  L.push('', '## Probes (draw size 3, as the UI asks)', '', '| subject | skill | case | stored | returned | of which generated | ms |', '|---|---|---|---|---|---|---|');
  for (const r of practice.filter((x) => x.phase >= 2)) L.push(`| ${r.subject} | ${r.loId} | ${r.note} | ${skillByLo.get(`${r.subject}|${r.loId}`)?.itemIds.length ?? '?'} | ${r.items.length} | ${r.items.filter((i: any) => !partA.has(i.id)).length} | ${r.ms} |`);
  L.push('', '## Re-run', '', '```', '# from apps/tutor; Part A first (it writes items.jsonl + skills.json into the results directory)', 'node scripts/audit/content-check/crawl.mjs --skills <results>/skills.json --log <scratch>/crawl-log.jsonl --students <results>/test-students.txt --tag <new tag> --gen-budget 120', 'node scripts/audit/content-check/grade-live.mjs --crawl <scratch>/crawl-log.jsonl --log <scratch>/grade-log.jsonl', '<academy>/node_modules/.bin/tsx -r scripts/audit/content-check/css-stub.cjs scripts/audit/content-check/part-b-report.ts --crawl <scratch>/crawl-log.jsonl --grade <scratch>/grade-log.jsonl --new-rows <scratch>/new-pgen-rows.json --out <results>', '```', '', 'A new `--tag` makes new test students (a student never gets the same item twice, so a re-crawl with the same students returns nothing for skills already swept).', '');
  fs.writeFileSync(path.join(outDir, 'summary-part-b.md'), L.join('\n'));
  console.log(L.join('\n'));
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
