/**
 * Hand-authored practice items read off a FIGURE — GreenApple T2 (29-Oct
 * release, docs/superpowers/plans/2026-10-15-gac-29-oct-release.md, T2).
 *
 * Two sets of objectives:
 *   OLDER — the seven older subjects (Algebra I, Geometry, Biology, Chemistry,
 *     AP Calculus BC, AP Statistics, APES): the 42 figure-dependent ("(a)")
 *     objectives of the T2 survey that are in scope — the 33 that existing
 *     kinds serve, the six transformation objectives (coordinate_polygon) and
 *     the three stemplot objectives. Objective = a seed LO (`geom.reflections`),
 *     plan = its seed plan, topic = the course slug. Three items an objective
 *     (at most four), at least one level 2 and one level 3.
 *   NEWER — the 22 FIGURE-NEEDED objectives of the T1 run (figure-split.json):
 *     each is brought to at least five served items (`have` from the T1 count
 *     + new items here, at most four new).
 *
 * The items are data, one file per group under ./t2-items/ (kit.ts holds the
 * item shape and helpers). The rules and checks are those of
 * author-batch9-figure-items.ts, which this script follows step for step:
 * every key is PROVEN from the figure spec (a figure-core checker `ck`, code
 * on checker results / the spec `calc`, or per-option truth `holds`); the
 * figure is drawn and passes the SVG safety check, the legibility report and
 * the option-letter guard; the alt text is `describeForAlt` + the item's own
 * specifics; options are shuffled with a seeded shuffle (correct one first
 * in the data).
 *
 * Outputs (insert-only rows — NOT imported here) to the working folder:
 *   final/figure-rows-t2.json, final/audited-figure-ids.json, final/key-proofs.json,
 *   mapping.json, summary.json, gallery.html, png/ (340 px column at 2×),
 *   png-desktop/ (720 px), sheets/ (contact sheets + index.txt), and
 *   read/<group>/packet.json + packet.md (for the independent readers: stem,
 *   options and figure — no key, no solution, no hints).
 *
 * No database, no network, no model. Run from apps/tutor:
 *   MONGODB_URI="" npx tsx scripts/practice-extend/author-t2-figure-items.ts [--only <group>[,<group>]] [--check] [--wip] [--out <dir>]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { checkFigureLegibility } from '../../src/lib/tutor/practice-figure/legibility';
import { buildPracticeFigure } from '../../src/lib/tutor/practice-figure/render';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { SEED_PLANS } from '../../src/lib/tutor/lesson-plan/store';
import { contentDefects, itemIdOf, simpleHash } from './core';
import { canonText, derivedText, describeFigure, describeForAlt, examineFigureItem, figureLetterClash, runChecker, type FigureItem } from './figure-core';
import { Ctx, near, type Item, type P, type Spec } from './t2-items/kit';
import { ITEMS as ALG1 } from './t2-items/alg1';
import { ITEMS as GEOM_FIGURE } from './t2-items/geom-figure';
import { ITEMS as GEOM_POLYGON } from './t2-items/geom-polygon';
import { ITEMS as BIO_CHEM } from './t2-items/bio-chem';
import { ITEMS as CALCBC } from './t2-items/calcbc';
import { ITEMS as STATS_APES } from './t2-items/stats-apes';
import { ITEMS as STATS_STEMPLOT } from './t2-items/stats-stemplot';
import { ITEMS as NEWER_MATH } from './t2-items/newer-math';
import { ITEMS as NEWER_SCI } from './t2-items/newer-sci';

const INTEGRATION = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration';
const DEFAULT_OUT = `${INTEGRATION}/practice-figures-2026-10-t2`;
const SURVEY = '/Users/luke/Dev/evelynlearning/.claude/worktrees/gac-29oct/docs/whitelabel/greenapple/integration/gac-29oct/t2-figure-survey.json';
const T1 = `${INTEGRATION}/practice-expand-2026-10-29-t1`;
const SPLIT = `${T1}/figure-split.json`;
const T1_PACKS = `${T1}/packs`;
const BANK_DIR = path.resolve(__dirname, '../../src/data/problem-bank');
const AUDITED_LIST = path.resolve(__dirname, '../../src/data/audited-generated-items.json');
/** Every figure rows file written before this run — no id may be reused; for the newer objectives no figure spec or stem of theirs either. */
const EARLIER_ROWS = [
  `${INTEGRATION}/release-2026-10-15/figure-rows-428.json`,
  `${INTEGRATION}/release-2026-10-15/figure-rows-253-second.json`,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4.json`,
  `${INTEGRATION}/practice-figures-2026-10-14-items/final/figure-rows-batch4-101.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5.json`,
  `${INTEGRATION}/practice-figures-2026-10-15-batch5/final/figure-rows-batch5-152.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6.json`,
  `${INTEGRATION}/practice-figures-2026-10-16-items/final/figure-rows-batch6-61.json`,
  `${INTEGRATION}/practice-figures-2026-10-17-items/final/figure-rows-batch7.json`,
  `${INTEGRATION}/practice-figures-2026-10-17-items/final/figure-rows-batch7-88.json`,
  `${INTEGRATION}/practice-figures-2026-10-18-items/final/figure-rows-batch8.json`,
  `${INTEGRATION}/practice-figures-2026-10-18-items/final/figure-rows-batch8-101.json`,
  `${INTEGRATION}/practice-figures-2026-10-19-items/final/figure-rows-batch9.json`,
  `${INTEGRATION}/practice-figures-2026-10-19-items/final/figure-rows-batch9-46.json`,
  `${T1}/final/import-rows-t1.json`,
];
const PNG_WIDTH = 680; // the 340 px column at 2×
const DESKTOP_WIDTH = 720;
/** Older objectives: this many new items (at most CAP). */
const OLDER_TARGET = 3;
const CAP_PER_OBJECTIVE = 4;
/** Newer objectives: brought to at least this many served items. */
const NEWER_TARGET = 5;

const GROUPS: Record<string, Item[]> = {
  alg1: ALG1,
  'geom-figure': GEOM_FIGURE,
  'geom-polygon': GEOM_POLYGON,
  'bio-chem': BIO_CHEM,
  calcbc: CALCBC,
  'stats-apes': STATS_APES,
  'stats-stemplot': STATS_STEMPLOT,
  'newer-math': NEWER_MATH,
  'newer-sci': NEWER_SCI,
};

/** The OLDER objectives in scope, by group. The 33 existing-kind objectives = the 28 (a) objectives with no missing kind
 *  + the five partial fits whose core task an existing kind draws (angle pairs and circle parts on geometric_figure,
 *  bar charts for one and two categorical variables, one polar curve for polar area). */
export const OLDER: Record<string, string[]> = {
  alg1: ['alg1.one-variable-statistics', 'alg1.scatterplots-trend-lines', 'alg1.compound-inequalities', 'alg1.one-variable-inequalities', 'alg1.relations-functions', 'alg1.slope-intercept-form', 'alg1.systems-applications', 'alg1.systems-by-graphing', 'alg1.quadratic-graphs-vertex'],
  'geom-figure': ['geom.parallel-lines-transversals', 'geom.proving-lines-parallel', 'geom.central-inscribed-angles', 'geom.angle-pair-relationships', 'geom.circle-basics-arcs'],
  'geom-polygon': ['geom.translations', 'geom.reflections', 'geom.rotations', 'geom.compositions-symmetry', 'geom.congruence-rigid-motions', 'geom.dilations-scale-factor'],
  'bio-chem': ['bio.cell-cycle-mitosis', 'bio.pedigrees-human-genetics', 'bio.biotechnology', 'bio.phylogenetics-cladograms', 'bio.energy-flow-food-webs', 'chem.covalent-bonding-lewis', 'chem.phase-changes-heating-curves'],
  calcbc: ['apcalcbc.limits-graphs-tables', 'apcalcbc.limits-representations', 'apcalcbc.differentiability-continuity', 'apcalcbc.estimating-derivatives', 'apcalcbc.graphing-f-fp-fpp', 'apcalcbc.slope-fields', 'apcalcbc.polar-area'],
  'stats-apes': ['apstats.residuals', 'apstats.scatterplots', 'apstats.categorical-data', 'apstats.two-categorical-relationships', 'apenvsci.food-webs'],
  'stats-stemplot': ['apstats.quantitative-graphs', 'apstats.distribution-shape', 'apstats.comparing-distributions'],
};
/** The NEWER objectives by group (packs of figure-split.json). */
const NEWER_GROUP_OF_SUBJECT: Record<string, string> = { ALGEBRA_2: 'newer-math', AP_CALCULUS_AB: 'newer-math', PRECALCULUS: 'newer-math', AP_BIOLOGY: 'newer-sci', AP_CHEMISTRY: 'newer-sci', PHYSICS: 'newer-sci' };

// ── seeded shuffle ──────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: T[], seedText: string): T[] {
  const rnd = mulberry32(parseInt(simpleHash(seedText), 36));
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// ── objectives ──────────────────────────────────────────────────────────────

interface Objective {
  loId: string; set: 'older' | 'newer'; group: string; subject: string; skill: string; topic: string; description: string;
  /** Items it holds now (newer: served count from the T1 run; older: authored bank rows). */
  have: number;
  /** Newer: new items needed to reach five. Older: OLDER_TARGET. */
  need: number;
  /** Texts of what it already holds (stems), for the twin check. */
  existing: string[];
  /** Lesson text the writer and reader may rely on. */
  lesson: string;
}

function readJson<T>(f: string): T { return JSON.parse(fs.readFileSync(f, 'utf8')) as T; }

function bankRowsByLo(): Map<string, Array<{ id: string; problemText: string }>> {
  const m = new Map<string, Array<{ id: string; problemText: string }>>();
  for (const dir of fs.readdirSync(BANK_DIR)) {
    const d = path.join(BANK_DIR, dir);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json'))) {
      const raw = readJson<unknown>(path.join(d, f));
      const rows = (Array.isArray(raw) ? raw : ((raw as { items?: unknown[] }).items ?? [])) as Array<{ id: string; loId: string; problemText: string }>;
      for (const r of rows) m.set(r.loId, [...(m.get(r.loId) ?? []), { id: r.id, problemText: r.problemText }]);
    }
  }
  return m;
}

function seedLesson(loId: string): { plan: (typeof SEED_PLANS)[number]; lesson: string; tries: string[] } {
  const plan = SEED_PLANS.find((p) => p.los.some((l) => l.id === loId));
  if (!plan) throw new Error(`no seed plan holds ${loId}`);
  const segs = plan.segments as unknown as Array<Record<string, unknown>>;
  const lesson = segs.flatMap((s) => [s.goal, ...((s.keyIdeas as string[]) ?? []), s.problem, s.answer, s.expectedAnswer].filter((x): x is string => typeof x === 'string')).join(' \n');
  const tries = segs.filter((s) => typeof s.problem === 'string').map((s) => s.problem as string);
  return { plan, lesson, tries };
}

export function loadObjectives(): Map<string, Objective> {
  const out = new Map<string, Objective>();
  const survey = readJson<{ objectives: Array<{ objectiveLoId: string; subject: string; title: string; figureNeed: string; essayNode: boolean }> }>(SURVEY).objectives;
  const bank = bankRowsByLo();
  for (const [group, los] of Object.entries(OLDER)) {
    for (const lo of los) {
      const s = survey.find((x) => x.objectiveLoId === lo);
      if (!s) throw new Error(`${lo} is not in the T2 survey`);
      if (s.figureNeed !== 'a' || s.essayNode) throw new Error(`${lo}: not an (a) objective, or an essay node`);
      const { plan, lesson, tries } = seedLesson(lo);
      const held = bank.get(lo) ?? [];
      out.set(lo, {
        loId: lo, set: 'older', group, subject: s.subject, skill: s.title, topic: plan.topic, description: plan.los.find((l) => l.id === lo)!.description,
        have: held.length, need: OLDER_TARGET, existing: [...held.map((r) => r.problemText), ...tries], lesson,
      });
    }
  }
  const split = readJson<Array<{ pack: string; subject: string; skill: string; lo: string; desc: string; need: number; split: string; kind: string }>>(SPLIT).filter((x) => x.split === 'FIGURE');
  if (split.length !== 22) throw new Error(`figure-split.json: ${split.length} FIGURE objectives, expected 22`);
  for (const x of split) {
    const pack = readJson<{ skill: string; objectives: Array<Record<string, unknown>> }>(path.join(T1_PACKS, `${x.pack}.json`));
    const o = pack.objectives.find((k) => k.objectiveLoId === x.lo);
    if (!o) throw new Error(`${x.lo} not in pack ${x.pack}`);
    const have = Number(o.have);
    const items = Array.isArray(o.existingItems) ? (o.existingItems as Array<Record<string, unknown>>) : [];
    const existing = items.map((k) => `${k.question}${k.answer !== undefined ? ` [answer: ${k.answer}]` : ''}`);
    const lesson = [o.concept, o.workedExample, o.tryStep].filter(Boolean).map((v) => (typeof v === 'string' ? v : JSON.stringify(v, null, 1))).join(' \n');
    out.set(x.lo, { loId: x.lo, set: 'newer', group: NEWER_GROUP_OF_SUBJECT[x.subject], subject: x.subject, skill: pack.skill, topic: pack.skill, description: x.desc, have, need: x.need, existing, lesson });
    if (have + x.need < NEWER_TARGET) throw new Error(`${x.lo}: have ${have} + need ${x.need} < ${NEWER_TARGET}`);
  }
  return out;
}

// ── build ───────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const arg = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const outDir = arg('--out') ?? DEFAULT_OUT;
  const only = arg('--only')?.split(',').map((s) => s.trim());
  for (const g of only ?? []) if (!(g in GROUPS)) throw new Error(`unknown group ${g} — one of ${Object.keys(GROUPS).join(', ')}`);
  const checkOnly = argv.includes('--check');
  const wip = argv.includes('--wip') || !!only;
  const objectives = loadObjectives();
  const groups = only ?? Object.keys(GROUPS);
  const inScope = [...objectives.values()].filter((o) => groups.includes(o.group));
  const ITEMS: Array<Item & { group: string }> = groups.flatMap((g) => GROUPS[g].filter((a) => a.lo !== '__none__').map((a) => ({ ...a, group: g })));

  if (argv.includes('--list-objectives')) {
    for (const o of inScope) console.log(`${o.group}\t${o.loId}\t${o.set}\thave ${o.have}\tneed ${o.need}\t${o.subject} · ${o.skill} · ${o.description}`);
    return;
  }

  type Row = { id: string; loId: string; problemText: string; figure: { spec: Spec } };
  const earlierFound = EARLIER_ROWS.filter((f) => fs.existsSync(f));
  const earlier = earlierFound.flatMap((f) => readJson<Row[]>(f));
  const earlierByLo = new Map<string, Row[]>();
  for (const r of earlier) earlierByLo.set(r.loId, [...(earlierByLo.get(r.loId) ?? []), r]);

  if (argv.includes('--dossier')) {
    // One file per group for its writer: each objective, what it needs, its lesson text, and every stem it holds.
    const dir = path.join(outDir, 'dossiers');
    fs.mkdirSync(dir, { recursive: true });
    for (const g of groups) {
      const mine = inScope.filter((o) => o.group === g);
      const text = mine.map((o) => [
        `## ${o.loId}`, '', `- Set: ${o.set} · Subject: ${o.subject} · Skill: ${o.skill} · topic: ${o.topic}`, `- Objective: ${o.description}`,
        `- Holds now: ${o.have} · NEW ITEMS TO WRITE: ${o.set === 'newer' ? `${Math.max(o.need, 2)} (needs ${o.need} to reach ${NEWER_TARGET}; one spare)` : `${o.need}`}`,
        '', '### Lesson text', '', o.lesson, '', '### Items it already holds (do not repeat a task or a figure)', '',
        ...o.existing.map((e) => `- ${e.replace(/\s+/g, ' ')}`),
        ...(earlierByLo.get(o.loId) ?? []).map((r) => `- [figure ${r.figure?.spec?.type}] ${r.problemText}`),
        '',
      ].join('\n')).join('\n');
      fs.writeFileSync(path.join(dir, `${g}.md`), `# Dossier — group ${g} (${mine.length} objectives)\n\n${text}`);
    }
    console.log(`dossiers written to ${dir}`);
    return;
  }
  const auditedIds = new Set(Object.keys(readJson<{ items: Record<string, string> }>(AUDITED_LIST).items));

  const problems: string[] = [];
  const notes: string[] = [];
  const offGrid: string[] = [];
  const now = new Date().toISOString();
  const rows: Array<Record<string, unknown>> = [];
  const proofs: Array<Record<string, unknown>> = [];
  const cards: string[] = [];
  const pngs: Array<{ id: string; svg: string }> = [];
  const packets = new Map<string, Array<Record<string, unknown>>>();
  const perLo = new Map<string, string[]>();
  const specsPerLo = new Map<string, string[]>();
  const meta: Array<{ id: string; lo: Objective; item: Item; format: string; proof: string }> = [];

  for (const [n, a] of ITEMS.entries()) {
    const obj = objectives.get(a.lo);
    const tag = `#${n + 1} ${a.lo} (${a.t})`;
    const bad = (m: string) => problems.push(`${tag}: ${m}`);
    if (!obj) { bad('not an objective of this run'); continue; }
    if (obj.group !== a.group) bad(`the objective belongs to group ${obj.group}, not ${a.group}`);
    if (![2, 3].includes(a.d)) bad('an item of this run is level 2 or 3');
    for (const r of earlierByLo.get(obj.loId) ?? []) {
      if (JSON.stringify(r.figure?.spec) === JSON.stringify(a.spec)) bad(`the figure is the same as that of the earlier row ${r.id}`);
      if (plain(r.problemText) === plain(a.q)) bad(`the stem is the same as that of the earlier row ${r.id}`);
    }
    const kinds = perLo.get(obj.loId) ?? [];
    if (kinds.includes(a.t)) bad('task kind repeated within the objective');
    kinds.push(a.t);
    perLo.set(obj.loId, kinds);
    const specs = specsPerLo.get(obj.loId) ?? [];
    if (specs.includes(JSON.stringify(a.spec))) bad('the same figure is used twice within the objective');
    specs.push(JSON.stringify(a.spec));
    specsPerLo.set(obj.loId, specs);
    if (obj.existing.some((e) => plain(e).includes(plain(a.q).slice(0, 90)))) bad('the stem repeats an item the objective already holds');
    const id = itemIdOf(obj.loId, a.q);

    try {
      const c = new Ctx(a.spec);
      const responseFormat: 'mcq' | 'numeric' = a.o ? 'mcq' : 'numeric';
      if (!a.o === !a.n) bad('give options or a number, not both / neither');
      if ([a.ck, a.calc, a.holds].filter(Boolean).length !== 1) bad('give exactly one of ck / calc / holds');
      let answer = '';
      let choices: string[] = [];
      let rationales: string[] = [];
      let keyText = '';
      if (a.o) {
        if (a.o.length !== 4 || a.o[0][1] !== 'correct') bad('needs four options, the correct one first');
        const order = shuffled(a.o, a.q);
        choices = order.map((x) => x[0]);
        rationales = order.map((x) => x[1]);
        answer = 'ABCD'[order.indexOf(a.o[0])];
        keyText = a.o[0][0];
        if (new Set(choices.map((x) => canonText(x))).size !== 4) bad('options are not four distinct texts');
        if (new Set(choices.map((x) => canonText(x).toLowerCase())).size !== 4) bad('two options differ only by letter case');
        const lens = choices.map((x) => x.length);
        if (Math.max(...lens) > Math.min(...lens) * 2 + 6) notes.push(`${tag}: option lengths ${lens.join('/')}`);
        if (lens.indexOf(Math.max(...lens)) === 'ABCD'.indexOf(answer) && Math.max(...lens) > [...lens].sort((x, y) => y - x)[1] * 1.35 + 3) bad(`the correct option is the longest by far (${lens.join('/')})`);
        const clash = figureLetterClash(a.spec, choices);
        if (clash) bad(`option letters — ${clash.message}`);
      } else if (a.n !== undefined) {
        answer = a.n;
        keyText = a.n;
        if (!parseNumericKey(answer)) bad(`the numeric key "${answer}" is not a plain number under the product's rule`);
      }

      // ── the proof ──────────────────────────────────────────────────────────
      let proofKind: 'checker' | 'checker+code' | 'code' = 'code';
      let proofHow = '';
      let proofResult = '';
      let derivation = { checker: 'none', args: {} as P };
      const stated = Number(answer);
      const places = (answer.split('.')[1] ?? '').length;
      const fits = (v: number): boolean => Number.isFinite(v) && (near(v, stated) || (places > 0 && Math.abs(v - stated) <= 0.5 * 10 ** -places + 1e-9));
      if (a.ck) {
        derivation = { checker: a.ck[0], args: a.ck[1] };
        const d = runChecker(a.spec, derivation);
        proofKind = 'checker';
        proofHow = `figure-core checker ${a.ck[0]} ${JSON.stringify(a.ck[1])}`;
        proofResult = derivedText(d);
      } else if (a.calc) {
        const v = a.calc[1](c);
        proofHow = a.calc[0];
        proofResult = String(v);
        if (a.o) {
          const hit = a.o.map((x) => canonText(x[0]) === canonText(String(v)));
          if (!(hit[0] && hit.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — computed "${v}", options ${JSON.stringify(a.o.map((x) => x[0]))}`);
        } else if (!fits(Number(v))) bad(`stated key ${answer}, computed ${v}`);
      } else if (a.holds) {
        if (!a.o || a.holds[1].length !== 4) bad('holds needs one test per option');
        const truth = a.holds[1].map((f) => f(c));
        proofHow = a.holds[0];
        proofResult = `options that answer the question, as written: [${truth.map((x, i) => (x ? a.o![i][0] : '')).filter(Boolean).join(' | ')}]`;
        if (!(truth[0] && truth.slice(1).every((x) => !x))) bad(`the key does not follow from the spec — the options as written: ${JSON.stringify(truth)}`);
      }
      if (a.alts) {
        if (a.o) bad('alts are for a numeric key');
        for (const alt of a.alts[1](c)) if (!(Number.isFinite(alt) && Math.abs(alt - stated) <= 0.5 * 10 ** -places + 1e-9)) bad(`the key moves with ordinary rounding — ${a.alts[0]}: ${alt} against the stated ${answer}`);
      }
      if (!a.ck && c.used.length) proofKind = 'checker+code';

      // ── alt text ─────────────────────────────────────────────────────────
      const base = describeForAlt(a.spec, { hide: a.hide ?? [] });
      const alt = `${base} ${a.alt}`.trim();
      if (a.alt.length < 40) bad('the alt specifics are too short (name the components / lanes / labels shown)');
      if (alt.length > 600) bad(`the alt text is ${alt.length} characters (600 at most) — shorten the item's alt specifics or hide less detail`);

      // ── rule checks ──────────────────────────────────────────────────────
      const figureItem = {
        objectiveLoId: obj.loId, responseFormat, problemText: a.q, answer, choices, hints: a.h, solutionText: a.s, difficulty: a.d,
        covers: obj.description, taskType: a.t, distractorRationales: rationales, figureSpec: a.spec, alt, derivation,
      } as unknown as FigureItem;
      const exam = examineFigureItem(figureItem);
      for (const d of exam.defects) {
        if (a.offGridOk && d.startsWith('it would need a reading finer than the grid')) { offGrid.push(`${tag}: ${a.offGridOk}`); continue; }
        bad(`rule check — ${d}`);
      }
      if (a.ck && exam.derivation.status !== 'derived') bad(`checker status ${exam.derivation.status}: ${exam.derivation.detail}`);
      for (const d of contentDefects(figureItem, { hasFigure: true } as never)) bad(`content check — ${d}`);
      const keyCanon = canonText(keyText).toLowerCase();
      for (const h of a.h) {
        if (keyText.length > 2 && canonText(h).toLowerCase().includes(keyCanon)) bad('a hint contains the answer');
        if (!a.o && new RegExp(`(?<![\\d.,/−-])${answer.replace('-', '[−-]').replace('.', '\\.')}(?![\\d/]|[.,]\\d)`).test(h.replace(/\b(?:x|y|t)\s*=\s*[−-]?[\d.]+/g, ''))) bad(`a hint prints the key ${answer}`);
      }
      if (/\\[a-zA-Z]|\$/.test([a.q, a.s, ...a.h, ...choices].join(' '))) bad('LaTeX in the text');
      if (a.h.length !== 2) bad('needs two hints');
      if (a.s.length < 60) bad('the solution is too short to name what is read from the figure');
      if (!/\bread/i.test(a.s)) bad('the solution does not say what is read from the figure');

      const figure = buildPracticeFigure(a.spec, alt);
      const safety = validateFigureSvg(figure.svg);
      if (!safety.ok) bad(`svg safety — ${JSON.stringify(safety.issues)}`);
      if (figure.svg.length > MAX_FIGURE_SVG_CHARS) bad(`svg is ${figure.svg.length} chars`);
      const warnings = checkFigureLegibility(a.spec);
      if (warnings.length) bad(`legibility — ${warnings.map((w) => `${w.code}: ${w.message}`).join('; ')}`);
      const figureText = describeFigure(a.spec).text;

      rows.push({
        id, topic: obj.topic, topicId: obj.topic, loId: obj.loId, subtopic: a.sub, difficulty: a.d,
        problemText: a.q, answer, solutionText: a.s, hints: a.h, responseFormat, choices,
        figure,
        source: { name: 'Evelyn (practice-extend offline job, figure track — hand-authored T2 figures, GreenApple 29-Oct release)' }, license: 'internal-original', verifiedAt: now,
        verifierModel: 'none — key proven from the figure spec in code + independent read + visual read',
      });
      proofs.push({ ...(a.offGridOk ? { offGridOk: a.offGridOk } : {}), id, loId: obj.loId, group: a.group, kind: a.spec.type, format: responseFormat, need: a.need, difficulty: a.d, key: answer, keyText, proof: proofKind, how: proofHow, result: proofResult, checkers: a.ck ? [{ checker: a.ck[0], args: a.ck[1], result: proofResult }] : c.used });
      meta.push({ id, lo: obj, item: a, format: responseFormat, proof: proofKind });
      pngs.push({ id, svg: figure.svg });
      const pk = packets.get(a.group) ?? [];
      pk.push({ n: pk.length + 1, id, subject: obj.subject, objective: obj.description, format: responseFormat, question: a.q, choices: choices.map((x, i) => `${'ABCD'[i]}) ${x}`), png: path.join(outDir, 'png', `${id}.png`), pngDesktop: path.join(outDir, 'png-desktop', `${id}.png`), alt });
      packets.set(a.group, pk);
      cards.push(`<section id="${esc(id)}"><div class="fig">${figure.svg}</div><div class="q"><p class="meta">#${n + 1} · ${esc(a.group)} · ${esc(id)}<br>${esc(obj.subject)} · ${esc(obj.skill)}<br>${esc(obj.description)}<br>task: ${esc(a.t)} · level ${a.d} · ${responseFormat} · ${esc(a.spec.type)} · asks: ${a.need}</p><p class="stem">${esc(a.q)}</p>${
        choices.length ? `<ol type="A">${choices.map((x, i) => `<li class="${'ABCD'[i] === answer ? 'key' : ''}">${esc(x)}${'ABCD'[i] === answer ? ' ✓' : ` <span class="why">— ${esc(rationales[i])}</span>`}</li>`).join('')}</ol>` : ''
      }<p><b>Key:</b> ${esc(answer)}${choices.length ? ` — ${esc(keyText)}` : ''}</p><p><b>Hints:</b> ${a.h.map(esc).join(' / ')}</p><p><b>Solution:</b> ${esc(a.s)}</p><p class="der"><b>Proof (${proofKind}):</b> ${esc(proofHow)} → ${esc(proofResult)}</p><p class="der"><b>Alt:</b> ${esc(alt)}</p><details><summary>spec · figure as text</summary><pre>${esc(JSON.stringify(a.spec, null, 1))}\n\n${esc(figureText)}</pre></details></div></section>`);
    } catch (e) {
      bad(`threw — ${(e as Error).message}`);
    }
  }

  // ── ids, caps, coverage ───────────────────────────────────────────────────
  const ids = rows.map((r) => r.id as string);
  if (new Set(ids).size !== ids.length) problems.push(`ids are not unique: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  const taken = new Set(earlier.map((r) => r.id));
  for (const r of rows) {
    const id = r.id as string;
    if (!/^practice-gen\.[a-z0-9.-]+\.[0-9a-z]+$/.test(id) || !id.startsWith(`practice-gen.${r.loId}.`)) problems.push(`${id}: id is not in the scheme / does not match its loId`);
    if (taken.has(id)) problems.push(`${id}: id already used by an earlier figure row`);
    if (auditedIds.has(id)) problems.push(`${id}: id already on the audited list`);
  }
  for (const [lo, kinds] of perLo) if (kinds.length > CAP_PER_OBJECTIVE) problems.push(`${lo}: ${kinds.length} items, cap ${CAP_PER_OBJECTIVE}`);
  const letters = rows.filter((r) => r.responseFormat === 'mcq').map((r) => r.answer as string);
  for (const l of 'ABCD') if (letters.length >= 12 && letters.filter((x) => x === l).length > letters.length * 0.45) problems.push(`the key is option ${l} in ${letters.filter((x) => x === l).length} of ${letters.length} multiple-choice items`);
  for (const o of inScope) {
    const levels = meta.filter((m) => m.lo.loId === o.loId).map((m) => m.item.d);
    if (levels.length < o.need) problems.push(`${o.group} ${o.loId}: ${levels.length} new item(s), needs ${o.need}${o.set === 'newer' ? ` (holds ${o.have}, target ${NEWER_TARGET})` : ''}`);
    if (o.set === 'older' && levels.length >= 3 && !(levels.includes(2) && levels.includes(3))) problems.push(`${o.loId}: levels [${levels.join(', ')}] — at least one level 2 and one level 3`);
  }

  const count = <T,>(xs: T[], key: (x: T) => string): Record<string, number> => xs.reduce((t, x) => ({ ...t, [key(x)]: (t[key(x)] ?? 0) + 1 }), {} as Record<string, number>);
  const mapping = inScope.map((o) => {
    const mine = meta.filter((m) => m.lo.loId === o.loId);
    return { loId: o.loId, set: o.set, group: o.group, subject: o.subject, skill: o.skill, topic: o.topic, objective: o.description, held: o.have, needed: o.need, newItems: mine.length, totalAfter: o.set === 'newer' ? o.have + mine.length : undefined, levels: mine.map((m) => m.item.d).sort().join(','), kinds: [...new Set(mine.map((m) => m.item.spec.type))].join(', '), tasks: mine.map((m) => m.item.t), ids: mine.map((m) => m.id), status: mine.length >= o.need ? 'covered' : 'short' };
  });
  const summary = {
    generatedAt: now, groups, items: rows.length,
    objectivesInScope: inScope.length, objectivesCovered: mapping.filter((m) => m.status === 'covered').length,
    bySet: count(meta, (m) => m.lo.set), bySubject: count(meta, (m) => m.lo.subject), byKind: count(meta, (m) => m.item.spec.type),
    byFormat: count(meta, (m) => m.format), byProof: count(meta, (m) => m.proof), byDifficulty: count(meta, (m) => `level ${m.item.d}`), keyLetters: count(letters, (l) => l),
    short: mapping.filter((m) => m.status === 'short').map((m) => `${m.loId} (${m.newItems}/${m.needed})`),
    earlierRowFilesRead: earlierFound, earlierRowFilesMissing: EARLIER_ROWS.filter((f) => !earlierFound.includes(f)), earlierIds: taken.size,
  };

  console.log(`${ITEMS.length} items declared, ${rows.length} built, on ${new Set(meta.map((m) => m.lo.loId)).size} of ${inScope.length} objectives in scope (groups: ${groups.join(', ')})`);
  console.log(JSON.stringify({ bySubject: summary.bySubject, byKind: summary.byKind, byFormat: summary.byFormat, byProof: summary.byProof, byDifficulty: summary.byDifficulty, keyLetters: summary.keyLetters, missingEarlierFiles: summary.earlierRowFilesMissing }, null, 1));
  if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`);
  if (offGrid.length) console.log(`off-grid features the answer does not rest on (declared per item):\n  ${offGrid.join('\n  ')}`);
  if (problems.length && !wip) {
    console.error(`\n${problems.length} PROBLEM(S) — nothing written:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  if (problems.length) console.error(`\n${problems.length} PROBLEM(S)${only ? ` (groups ${only.join(', ')} only)` : ' (work in progress)'}:\n  ${problems.join('\n  ')}`);
  if (checkOnly) { if (problems.length) process.exit(1); return; }

  const suffix = only ? `-${only.join('+')}` : wip ? '-wip' : '';
  for (const d of ['png', 'png-desktop', 'final', 'sheets', 'read']) fs.mkdirSync(path.join(outDir, d), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'final', `figure-rows-t2${suffix}.json`), JSON.stringify(rows, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'final', `key-proofs${suffix}.json`), JSON.stringify(proofs, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, `mapping${suffix}.json`), JSON.stringify(mapping, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, `summary${suffix}.json`), JSON.stringify(summary, null, 2) + '\n');
  if (!only && !wip) fs.writeFileSync(path.join(outDir, 'final', 'audited-figure-ids.json'), JSON.stringify(ids) + '\n');
  for (const [g, pk] of packets) {
    fs.mkdirSync(path.join(outDir, 'read', g), { recursive: true });
    fs.writeFileSync(path.join(outDir, 'read', g, 'packet.json'), JSON.stringify(pk, null, 2) + '\n');
    fs.writeFileSync(path.join(outDir, 'read', g, 'packet.md'), `# Reader packet — group ${g} (${pk.length} items)\n\nFor each item: open the PNG (340 px column at 2×), read the question, answer it from the figure alone. Desktop PNG beside it.\n\n${pk.map((p) => `## ${p.n}. ${p.id}\n\n- Subject: ${p.subject}\n- Objective: ${p.objective}\n- Format: ${p.format}\n- Figure (phone): ${p.png}\n- Figure (desktop): ${p.pngDesktop}\n- Alt text: ${p.alt}\n\n${p.question}\n\n${(p.choices as string[]).join('\n')}\n`).join('\n')}`);
  }
  fs.writeFileSync(path.join(outDir, `gallery${suffix}.html`), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T2 figure practice items — gallery</title><style>
body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1c1c1c;background:#f6f6f4}
h1{font-size:20px}section{display:flex;gap:24px;flex-wrap:wrap;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;margin:0 0 16px}
.fig{width:340px;flex:none}.fig svg{width:340px;height:auto;display:block;border:1px dashed #bbb}.q{flex:1;min-width:300px}
.meta{font-size:12px;color:#666}.stem{font-weight:600}li.key{font-weight:700;color:#0a6b2d}.why{color:#777;font-weight:400;font-size:13px}.der{font-size:13px;color:#444}pre{font-size:12px;white-space:pre-wrap;background:#f8f8f6;padding:8px}
</style></head><body><h1>GreenApple T2 figure practice items — ${rows.length} items</h1><p>Each figure at 340 px, as on the student's card. Keys proven from the figure spec in code. Generated ${esc(now)}.</p>${cards.join('\n')}</body></html>\n`);

  const mod = (await import('sharp')) as unknown as { default?: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sharp = (mod.default ?? mod) as any;
  for (const { id, svg } of pngs) {
    await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(outDir, 'png', `${id}.png`));
    await sharp(Buffer.from(svg), { density: 192 }).resize({ width: DESKTOP_WIDTH }).png().toFile(path.join(outDir, 'png-desktop', `${id}.png`));
  }
  // Contact sheets: six figures a sheet (three across), each under its item number.
  const W = 520;
  const COLS = 3;
  const PER = 6;
  const index: string[] = [];
  for (let s = 0; s < rows.length; s += PER) {
    const group = rows.slice(s, s + PER);
    const imgs: Array<{ buf: Buffer; h: number; n: number }> = [];
    for (const [k, r] of group.entries()) {
      const buf = (await sharp(path.join(outDir, 'png', `${r.id}.png`)).resize({ width: W }).png().toBuffer()) as Buffer;
      const m = (await sharp(buf).metadata()) as { height: number };
      imgs.push({ buf, h: m.height, n: s + k + 1 });
    }
    const rowsH: number[] = [];
    for (let i = 0; i < imgs.length; i += COLS) rowsH.push(Math.max(...imgs.slice(i, i + COLS).map((x) => x.h)) + 26);
    const comp: Array<{ input: Buffer; left: number; top: number }> = [];
    let y = 0;
    for (let i = 0; i < imgs.length; i += COLS) {
      imgs.slice(i, i + COLS).forEach((im, j) => {
        comp.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="24"><rect width="${W}" height="24" fill="#222"/><text x="6" y="17" font-size="15" fill="#fff" font-family="Helvetica">#${im.n}</text></svg>`), left: j * W, top: y });
        comp.push({ input: im.buf, left: j * W, top: y + 24 });
      });
      y += rowsH[i / COLS];
    }
    const file = `sheet${suffix}-${String(s + 1).padStart(3, '0')}.png`;
    await sharp({ create: { width: W * COLS, height: rowsH.reduce((x, z) => x + z, 0), channels: 3, background: '#888' } }).composite(comp).png().toFile(path.join(outDir, 'sheets', file));
    index.push(`== ${file}`);
    for (const [k, r] of group.entries()) {
      index.push(`#${s + k + 1} [${(r.figure as { spec: Spec }).spec.type}] ${r.id}`);
      index.push(`   ${r.problemText}`);
      index.push((r.choices as string[]).length ? `   ${(r.choices as string[]).map((x, i) => `${'ABCD'[i]}${'ABCD'[i] === r.answer ? '*' : ''}) ${x}`).join('  |  ')}` : `   key: ${r.answer}`);
    }
  }
  fs.writeFileSync(path.join(outDir, 'sheets', `index${suffix}.txt`), index.join('\n') + '\n');
  console.log(`\nwrote ${rows.length} rows, ${pngs.length}×2 PNGs, ${Math.ceil(rows.length / PER)} sheets, gallery, reader packets to ${outDir}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
