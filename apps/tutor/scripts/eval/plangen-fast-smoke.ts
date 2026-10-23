/**
 * plangen-fast smoke compare — Haiku 4.5 vs Haiku 5.5 (low effort) on the five
 * 'plangen-fast' callers (2026-10-23).
 *
 *   enumerate-problems · material-classify · material-summary ·
 *   derive-rail-labels (model call + parseLabelResponse only — no Mongo) ·
 *   condenseForPipeline
 *
 * Each caller runs over 4–6 fixture inputs, twice per model (Haiku 5.5 has no
 * temperature 0, so run-to-run stability is part of the check). The registry
 * and the callers resolve their model at module load, so each model runs in a
 * CHILD PROCESS with TUTOR_MODEL_PLANGEN_FAST set; the child wraps the shared
 * client's `messages.create` to record latency, usage and stop_reason.
 *
 * Live API spend (~cents). Never touches MongoDB (MONGODB_URI is deleted).
 *
 * Run (from apps/tutor):
 *   env -u MONGODB_URI npx tsx scripts/eval/plangen-fast-smoke.ts [--out <md path>]
 *   (PLANGEN_FAST_EVAL_DIR=<dir> keeps the raw per-model JSON there)
 */
import { config } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

config({ path: path.resolve(process.cwd(), '.env.local') });
delete process.env.MONGODB_URI;

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5', inPerM: 1.0, outPerM: 5.0 },
  { id: 'claude-haiku-5-5', label: 'Haiku 5.5 low', inPerM: 0.1, outPerM: 0.5 },
] as const;
const REPS = 2;

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const ENUMERATE_FIXTURES: Record<string, string> = {
  'algebra-worksheet': `Algebra 1 — Homework 4.3  Name: ________  Period: __
Solve each equation. Show your work.
1. 3x + 7 = 22
2. 5(2x - 3) = 4x + 9
3. -2(x + 4) = 3x - 18
4. x/4 + 2 = 7
5. Solve for y: 6x - 3y = 12
6. A phone plan costs $25 per month plus $0.10 per text. Last month the bill was $41.50. How many texts were sent?`,
  'chem-shared-data': `Chem HW ch 9 stoichiometry
Use the reaction: 2H2 + O2 -> 2H2O
a) How many moles of water form from 3.5 mol of O2?
b) How many grams of H2 are needed to react completely with 64 g of O2?
c) If 10.0 g H2 reacts with 64.0 g O2, which is the limiting reactant?
d) What is the percent yield if 60.0 g of water is actually collected in part c?`,
  'geometry-ocr': `Unit 3 Quiz Review - Parallel Lines & Transversals
1) Lines m and n are parallel and cut by transversal t. If angle 1 = 3x + 10 and angle 5 = 5x - 30 are corresponding angles, find x.
2) Two angles are supplementary. One angle is 24 degrees more than twice the other. Find both angles.
3) In triangle ABC, angle A = 47 degrees and angle B = 68 degrees. Find the exterior angle at C.
4) True or False: Alternate interior angles are always supplementary. Explain.
5) The measure of each interior angle of a regular polygon is 140 degrees. How many sides does it have?`,
  'essay-prompt': `My English teacher gave us this prompt: "In The Great Gatsby, Fitzgerald uses the green light as a symbol. Write a 5-paragraph essay explaining how the meaning of the green light changes over the course of the novel." I have to write a thesis statement by tomorrow and I don't know how to start it or what my three body paragraphs should be about.`,
  'physics-scenario': `Physics problem set 2 (kinematics)
A ball is thrown straight up from the edge of a 20 m tall cliff with an initial speed of 15 m/s. Ignore air resistance and use g = 9.8 m/s^2.
(a) How long does the ball take to reach its maximum height?
(b) What is the maximum height above the ground at the base of the cliff?
(c) How long after being thrown does it hit the ground?
(d) What is its velocity just before impact?
7. A car accelerates uniformly from rest to 27 m/s in 9.0 s. How far does it travel?`,
  'single-question': `how do i find the derivative of f(x) = x^2 sin(x)? we just learned the product rule`,
};

const MATERIAL_FIXTURES: Record<string, string> = {
  'worksheet-fractions': `Grade 6 Math — Dividing Fractions Practice
Directions: Divide. Write each answer in simplest form.
1. 3/4 ÷ 1/2    2. 5/6 ÷ 2/3    3. 2 1/3 ÷ 1/6    4. 7/8 ÷ 3
5. Maria has 3 3/4 cups of flour. Each batch of cookies needs 3/4 cup. How many batches can she make?
6. A ribbon 5/6 yard long is cut into pieces 1/12 yard long. How many pieces are there?`,
  'bio-notes': `Biology Notes — Unit 4: Photosynthesis
Photosynthesis converts light energy into chemical energy stored in glucose. It occurs in the chloroplasts of plant cells. The overall equation is 6CO2 + 6H2O + light -> C6H12O6 + 6O2.
Light-dependent reactions take place in the thylakoid membranes. Chlorophyll absorbs light, water is split (photolysis), oxygen is released, and ATP and NADPH are produced.
The Calvin cycle (light-independent reactions) takes place in the stroma. It uses ATP and NADPH to fix carbon dioxide into G3P, which is used to build glucose. The enzyme RuBisCO catalyzes carbon fixation.
Factors affecting rate: light intensity, CO2 concentration, temperature.`,
  'mixed-history': `World History — The Industrial Revolution (Section 8.2 Reading + Questions)
The Industrial Revolution began in Britain in the late 1700s. Britain had large deposits of coal and iron, a growing population, colonies that supplied raw materials, and a stable government that supported business. Inventions such as the spinning jenny, the water frame, and James Watt's improved steam engine transformed textile production. Factories drew workers from the countryside into crowded cities such as Manchester, where living conditions were often poor.
Review Questions
1. List three reasons the Industrial Revolution started in Britain.
2. How did the steam engine change where factories could be built?
3. Describe two effects of urbanization on workers' lives.
4. Do you think the benefits of industrialization outweighed the costs? Explain.`,
  'data-table': `Table 1. Population of Rabbits and Foxes, Island Study
Year | Rabbits | Foxes
2015 | 1200 | 40
2016 | 1650 | 52
2017 | 2100 | 85
2018 | 1500 | 120
2019 | 900 | 95
2020 | 1100 | 60
Figure 1: line graph of both populations (x-axis Year, y-axis Number of animals)`,
  'unusable-photo': `IMG_2041 sunset at the beach with my dog lol 🐶🌅 #summer #vibes kjsdf kjsdf  ...  ... `,
};

const RAIL_SEEDS = [
  'ap-chem-reaction-rates',
  'ap-bio-enzymes',
  'ap-calcbc-u1-limits-algebraic-properties',
  'ap-phys1-waves',
  'alg1-u4-slope-intercept-form',
];

const CONDENSE_SETS: Record<string, string[]> = {
  'bio-chapter': ['ap-bio-cellular-respiration-deep', 'ap-bio-enzymes', 'ap-bio-cell-signaling'],
  'physics-chapter': ['ap-phys1-momentum', 'ap-phys1-energy-conservation', 'ap-phys1-kinematics'],
  'algebra-unit': ['alg1-u4-slope-rate-of-change', 'alg1-u4-slope-intercept-form', 'alg1-u4-point-slope-standard-form'],
  'history-chapter': ['ap-european-history-renaissance', 'ap-art-history-analysis'],
};
const CONDENSE_TARGET = 8000;

/* ------------------------------------------------------------------ */
/* Child: run every caller on one model                                */
/* ------------------------------------------------------------------ */

interface CallRec { caller: string; fixture: string; rep: number; ms: number; inTok: number; outTok: number; stop: string; blocks: string[]; error?: string }
interface ChildOut { model: string; calls: CallRec[]; results: Record<string, Record<string, unknown[]>> }

async function loadSeed(name: string) {
  const mod = (await import(`../../src/lib/tutor/lesson-plan/seeds/${name}`)) as Record<string, unknown>;
  const plan = Object.values(mod).find((v) => v && typeof v === 'object' && Array.isArray((v as { segments?: unknown }).segments));
  if (!plan) throw new Error(`no plan export in ${name}`);
  return plan as import('../../src/lib/tutor/lesson-plan/types').LessonPlan;
}

function collectStrings(v: unknown, out: string[]) {
  if (typeof v === 'string') { if (v.length > 25) out.push(v); return; }
  if (Array.isArray(v)) { for (const x of v) collectStrings(x, out); return; }
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'id' && k !== 'kind') collectStrings(x, out);
}

/** Teaching material built from seed plans: one SECTION heading per segment. */
async function condenseMaterial(names: string[]): Promise<{ text: string; headings: string[] }> {
  const parts: string[] = [];
  const headings: string[] = [];
  for (const n of names) {
    const plan = await loadSeed(n);
    headings.push(`CHAPTER: ${plan.title}`);
    parts.push(`CHAPTER: ${plan.title}`);
    for (const seg of plan.segments) {
      const h = `SECTION: ${String((seg as { title?: string }).title ?? seg.id).replace(/[-_.]/g, ' ')}`;
      headings.push(h);
      const strs: string[] = [];
      collectStrings(seg, strs);
      parts.push(`${h}\n${strs.join('\n')}`);
    }
  }
  return { text: parts.join('\n\n'), headings };
}

async function child(modelId: string, outFile: string) {
  if (process.env.TUTOR_MODEL_PLANGEN_FAST !== modelId) throw new Error('child env mismatch');
  const { getModelClient } = await import('../../src/lib/tutor/ai/model-registry');
  const enumerate = await import('../../src/lib/tutor/lesson-plan/enumerate-problems');
  const classify = await import('../../src/lib/tutor/lesson-plan/material-classify');
  const summary = await import('../../src/lib/tutor/lesson-plan/material-summary');
  const rail = await import('../../src/lib/tutor/lesson-plan/derive-rail-labels');
  const railLib = await import('../../src/lib/tutor/lesson-plan/rail-labels');
  const extract = await import('../../src/lib/tutor/lesson-plan/material-extract');
  const { client, model } = getModelClient('plangen-fast');
  if (model !== modelId) throw new Error(`registry resolved ${model}, expected ${modelId}`);
  if (getModelClient('plangen-classify').model !== modelId) throw new Error('classify role not on the model under test');

  const calls: CallRec[] = [];
  let cur: { caller: string; fixture: string; rep: number } = { caller: '', fixture: '', rep: 0 };
  const msgs = client.messages as unknown as { create: (...a: unknown[]) => Promise<unknown> };
  const orig = msgs.create.bind(client.messages);
  msgs.create = async (...args: unknown[]) => {
    const t0 = Date.now();
    try {
      const res = (await orig(...args)) as { usage: { input_tokens: number; output_tokens: number }; stop_reason: string; content: { type: string }[] };
      calls.push({ ...cur, ms: Date.now() - t0, inTok: res.usage.input_tokens, outTok: res.usage.output_tokens, stop: res.stop_reason, blocks: res.content.map((b) => b.type) });
      return res;
    } catch (err) {
      calls.push({ ...cur, ms: Date.now() - t0, inTok: 0, outTok: 0, stop: 'error', blocks: [], error: String((err as Error)?.message ?? err).slice(0, 300) });
      throw err;
    }
  };

  const results: ChildOut['results'] = { enumerate: {}, classify: {}, summary: {}, rail: {}, condense: {} };
  const push = (c: string, f: string, v: unknown) => ((results[c]![f] ??= []).push(v));

  for (let rep = 1; rep <= REPS; rep++) {
    for (const [f, text] of Object.entries(ENUMERATE_FIXTURES)) {
      cur = { caller: 'enumerate', fixture: f, rep };
      push('enumerate', f, await enumerate.enumerateProblems(text, enumerate.defaultEnumerateDeps(client)));
    }
    for (const [f, text] of Object.entries(MATERIAL_FIXTURES)) {
      cur = { caller: 'classify', fixture: f, rep };
      const cd = classify.defaultClassifyDeps(client);
      let raw = '';
      const result = await classify.classifyMaterial(text, '', { complete: async (sys, u) => (raw = await cd.complete(sys, u)) });
      push('classify', f, { result, raw: raw.slice(0, 400) });
      cur = { caller: 'summary', fixture: f, rep };
      push('summary', f, await summary.summarizeMaterial(text, summary.defaultSummaryDeps(client)));
    }
    for (const name of RAIL_SEEDS) {
      const plan = await loadSeed(name);
      cur = { caller: 'rail', fixture: name, rep };
      let raw = '';
      try { raw = await rail.realComplete(railLib.buildLabelPrompt(plan)); } catch (err) { raw = `ERROR ${(err as Error).message}`; }
      push('rail', name, { labels: railLib.parseLabelResponse(raw, plan), raw: raw.slice(0, 600) });
    }
    for (const [f, names] of Object.entries(CONDENSE_SETS)) {
      const { text, headings } = await condenseMaterial(names);
      cur = { caller: 'condense', fixture: f, rep };
      const out = await extract.condenseForPipeline(text, { targetChars: CONDENSE_TARGET });
      const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ');
      const kept = headings.filter((h) => norm(out).includes(norm(h.replace(/^(CHAPTER|SECTION): /, '')))).length;
      push('condense', f, { inLen: text.length, outLen: out.length, headings: headings.length, headingsKept: kept, truncatedFallback: out === text.slice(0, CONDENSE_TARGET), head: out.slice(0, 300) });
    }
  }
  fs.writeFileSync(outFile, JSON.stringify({ model: modelId, calls, results } satisfies ChildOut, null, 2));
}

/* ------------------------------------------------------------------ */
/* Parent: spawn, compare, write markdown                              */
/* ------------------------------------------------------------------ */

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

function render(outs: ChildOut[], dir: string): string {
  const L: string[] = [];
  const [a, b] = outs as [ChildOut, ChildOut];
  const mA = MODELS[0], mB = MODELS[1];
  L.push('# plangen-fast: Haiku 4.5 vs Haiku 5.5 (low effort) — 2026-10-23', '');
  L.push(`Script: \`apps/tutor/scripts/eval/plangen-fast-smoke.ts\` (branch gac-29oct). ${REPS} runs per fixture per model, sequential. Raw JSON: \`${dir}\`.`, '');
  L.push('Haiku 4.5 = old request (temperature 0 / 0.1). Haiku 5.5 = new request (no temperature, `output_config.effort: low`, max_tokens floor 4000; 8192 for enumerate + condense).', '');

  // Cost / latency table
  L.push('## Latency, tokens, cost per caller', '', '| caller | model | calls | p50 ms | max ms | avg in tok | avg out tok | stop≠end_turn | errors | cost/call | total cost |', '|---|---|---|---|---|---|---|---|---|---|---|');
  let grand = 0;
  for (const caller of ['enumerate', 'classify', 'summary', 'rail', 'condense']) {
    for (const [o, m] of [[a, mA], [b, mB]] as const) {
      const cs = o.calls.filter((c) => c.caller === caller);
      const ms = cs.map((c) => c.ms).sort((x, y) => x - y);
      const cost = cs.reduce((s, c) => s + (c.inTok * m.inPerM + c.outTok * m.outPerM) / 1e6, 0);
      grand += cost;
      const avg = (k: 'inTok' | 'outTok') => Math.round(cs.reduce((s, c) => s + c[k], 0) / Math.max(1, cs.length));
      L.push(`| ${caller} | ${m.label} | ${cs.length} | ${ms[Math.floor(ms.length / 2)] ?? '-'} | ${ms[ms.length - 1] ?? '-'} | ${avg('inTok')} | ${avg('outTok')} | ${cs.filter((c) => c.stop !== 'end_turn').map((c) => `${c.fixture}:${c.stop}`).join(', ') || 0} | ${cs.filter((c) => c.error).length} | $${(cost / Math.max(1, cs.length)).toFixed(5)} | $${cost.toFixed(4)} |`);
    }
  }
  L.push('', `Total eval spend: **$${grand.toFixed(4)}**.`, '');
  const errs = [...a.calls, ...b.calls].filter((c) => c.error);
  if (errs.length) { L.push('Errors:', ''); for (const e of errs) L.push(`- ${e.caller}/${e.fixture} rep ${e.rep}: ${esc(e.error!)}`); L.push(''); }

  // enumerate
  L.push('## enumerate-problems', '', '| fixture | 4.5 count (runs) | 5.5 count (runs) | 5.5 run1 = 4.5 run1 (texts) | 5.5 stable across runs | 5.5 non-verbatim problems | failedOpen 4.5 / 5.5 |', '|---|---|---|---|---|---|---|');
  type Enum = { problems: { n: number; text: string }[]; failedOpen: boolean };
  for (const [f, input] of Object.entries(ENUMERATE_FIXTURES)) {
    const ra = a.results.enumerate![f] as Enum[], rb = b.results.enumerate![f] as Enum[];
    const texts = (r: Enum) => r.problems.map((p) => norm(p.text));
    const same = (x: Enum, y: Enum) => JSON.stringify(texts(x)) === JSON.stringify(texts(y));
    const nonVerb = rb.flatMap((r) => r.problems).filter((p) => !norm(input).includes(norm(p.text))).length;
    L.push(`| ${f} | ${ra.map((r) => r.problems.length).join('/')} | ${rb.map((r) => r.problems.length).join('/')} | ${same(ra[0]!, rb[0]!) ? 'yes' : 'NO'} | ${rb.every((r) => same(r, rb[0]!)) ? 'yes' : 'NO'} | ${nonVerb} | ${ra.map((r) => r.failedOpen).join('/')} · ${rb.map((r) => r.failedOpen).join('/')} |`);
  }
  L.push('', '<details><summary>enumerate texts (run 1)</summary>', '');
  for (const f of Object.keys(ENUMERATE_FIXTURES)) {
    L.push(`**${f}**`, '');
    for (const [o, m] of [[a, mA], [b, mB]] as const) {
      L.push(`- ${m.label}:`);
      for (const p of (o.results.enumerate![f]![0] as Enum).problems) L.push(`  - ${p.n}. ${esc(p.text).slice(0, 220)}`);
    }
    L.push('');
  }
  L.push('</details>', '');

  // classify + summary
  L.push('## material-classify', '', '| fixture | Haiku 4.5 (run1 / run2) | Haiku 5.5 (run1 / run2) |', '|---|---|---|');
  type Cls = { kind: string; itemCount?: number; topicSummary?: string; reason?: string } | null;
  type ClsRun = { result: Cls; raw: string };
  const cls = (r: ClsRun) => { const c = r.result; return c ? `${c.kind}${c.itemCount != null ? ` (${c.itemCount})` : ''} — ${esc(c.topicSummary || c.reason || '')}` : `**null** (raw: \`${esc(r.raw)}\`)`; };
  for (const f of Object.keys(MATERIAL_FIXTURES)) {
    L.push(`| ${f} | ${(a.results.classify![f] as ClsRun[]).map(cls).join(' / ')} | ${(b.results.classify![f] as ClsRun[]).map(cls).join(' / ')} |`);
  }
  L.push('', '## material-summary', '', '| fixture | Haiku 4.5 subject · level · topic | Haiku 5.5 subject · level · topic (run1 / run2) |', '|---|---|---|');
  type Sum = { subject: string; level?: string; topic: string } | null;
  const sum = (s: Sum) => (s ? esc(`${s.subject} · ${s.level ?? '–'} · ${s.topic}`) : 'null');
  for (const f of Object.keys(MATERIAL_FIXTURES)) {
    L.push(`| ${f} | ${(a.results.summary![f] as Sum[]).map(sum).join(' / ')} | ${(b.results.summary![f] as Sum[]).map(sum).join(' / ')} |`);
  }

  // rail
  L.push('', '## derive-rail-labels (model call + parseLabelResponse)', '', '| seed | Haiku 4.5 labels (run1) | Haiku 5.5 labels (run1) | parsed ok 4.5 / 5.5 (runs) |', '|---|---|---|---|');
  type Rail = { labels: Record<string, string> | null; raw: string };
  const lab = (r: Rail) => (r.labels ? esc(Object.values(r.labels).join(', ')) : `null (raw: ${esc(r.raw).slice(0, 120)})`);
  for (const s of RAIL_SEEDS) {
    const ra = a.results.rail![s] as Rail[], rb = b.results.rail![s] as Rail[];
    L.push(`| ${s} | ${lab(ra[0]!)} | ${lab(rb[0]!)} | ${ra.map((r) => (r.labels ? 'y' : 'n')).join('')} / ${rb.map((r) => (r.labels ? 'y' : 'n')).join('')} |`);
  }

  // condense
  L.push('', '## condenseForPipeline (target 8000 chars)', '', '| set | in chars | 4.5 out chars (runs) | 4.5 headings kept | 5.5 out chars (runs) | 5.5 headings kept | hard-truncate fallback 4.5 / 5.5 |', '|---|---|---|---|---|---|---|');
  type Cond = { inLen: number; outLen: number; headings: number; headingsKept: number; truncatedFallback: boolean };
  for (const f of Object.keys(CONDENSE_SETS)) {
    const ra = a.results.condense![f] as Cond[], rb = b.results.condense![f] as Cond[];
    L.push(`| ${f} | ${ra[0]!.inLen} | ${ra.map((r) => r.outLen).join('/')} | ${ra.map((r) => `${r.headingsKept}/${r.headings}`).join(', ')} | ${rb.map((r) => r.outLen).join('/')} | ${rb.map((r) => `${r.headingsKept}/${r.headings}`).join(', ')} | ${ra.map((r) => r.truncatedFallback).join('/')} · ${rb.map((r) => r.truncatedFallback).join('/')} |`);
  }
  L.push('');
  return L.join('\n');
}

async function main() {
  if (process.argv[2] === '__child') return child(process.argv[3]!, process.argv[4]!);
  const outIdx = process.argv.indexOf('--out');
  const outMd = outIdx > 0 ? process.argv[outIdx + 1]! : path.resolve(process.cwd(), 'plangen-fast-compare.md');
  const dir = process.env.PLANGEN_FAST_EVAL_DIR ?? fs.mkdtempSync(path.join(process.env.TMPDIR ?? '/tmp', 'plangen-fast-'));
  fs.mkdirSync(dir, { recursive: true });
  const outs: ChildOut[] = [];
  for (const m of MODELS) {
    const file = path.join(dir, `${m.id}.json`);
    // classify has its own role ('plangen-classify', pinned to Haiku 4.5 after
    // this eval); set it too so all five callers are compared on both models.
    const env: NodeJS.ProcessEnv = { ...process.env, TUTOR_MODEL_PLANGEN_FAST: m.id, TUTOR_MODEL_PLANGEN_CLASSIFY: m.id };
    delete env.TUTOR_PLANGEN_FAST_EFFORT;
    delete env.MONGODB_URI;
    console.log(`[smoke] ${m.label} …`);
    const r = spawnSync('npx', ['tsx', process.argv[1]!, '__child', m.id, file], { stdio: 'inherit', env, cwd: process.cwd() });
    if (r.status !== 0) throw new Error(`child ${m.id} exited ${r.status}`);
    outs.push(JSON.parse(fs.readFileSync(file, 'utf8')) as ChildOut);
  }
  fs.writeFileSync(outMd, render(outs, dir));
  console.log(`[smoke] wrote ${outMd}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
