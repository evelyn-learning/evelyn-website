/**
 * Mechanical audit of Grade 8 seed files, by IMPORTING them (no regex parsing
 * of TypeScript). Run from apps/tutor:
 *   npx tsx <path>/g8-seed-audit.ts <course> <PREFIX> [slug ...]
 * With no slugs, audits every <course>-u*-*.ts on disk.
 *
 * Checks: export symbol, id, topic/grade/subject-agnostic identity via lint
 * later; 9-segment recipe; concept keyIdeas 4-6; three try_yourself with the
 * course tryFormat; MCQ = 4 choices a-d, exactly one correct, expectedAnswer
 * byte-equal to the correct text, no duplicate choice texts; 2 hints each;
 * DF-1 key positions from the (u+t+i) mod 4 formula (math: (u+t) mod 4 and
 * (u+t+2) mod 4); DF-3 longest-answer count REPORTED (never scored);
 * misconception_check 1-2 commonErrors; recap mustRemember non-empty; minutes
 * sum within 1 of estimatedMinutes and 18-22; U+2212 anywhere in the file;
 * banned substrings frq|dbq|leq|saq; description hygiene (no backtick, no
 * file name, no Grade 7/G7/Grade 6/Algebra 1/UNVERIFIED/sign-off/arrow);
 * "this lesson"/"Grade 7" in spoken fields flagged.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [course, prefix, ...only] = process.argv.slice(2);
const dir = process.cwd() + '/src/lib/tutor/lesson-plan/seeds/';
const tryFormat = course.endsWith('math') ? 'two-mcq-one-numeric' : 'three-mcq';
const files = readdirSync(dir)
  .filter((f) => f.startsWith(course + '-u') && f.endsWith('.ts'))
  .filter((f) => !only.length || only.some((s) => f.endsWith('-' + s + '.ts')))
  .sort();
if (!files.length) { console.error(`NO FILES MATCHED for ${course} in ${dir} (slugs: ${only.join(' ') || 'all'}) — this audit measured nothing`); process.exit(2); }
/**
 * A cross-grade LEAK is the tutor telling the student what they did or learned
 * in another school year ("Last year you learned this", "Last year you found
 * the volume of a box"). It is NOT any sentence containing "last year": an
 * invented passage may legitimately say the pool stayed open two hours later
 * than last year, or that 40 students signed up and the club should keep the
 * slot next year.
 *
 * History, so nobody re-widens this: the original regex was
 * /last year|next year/ (case-SENSITIVE). It flagged 11 passage sentences
 * across 3 m8ela seeds, all false, while MISSING two real leaks that began a
 * sentence with capitalised "Last year". Narrowing it to a list of teaching
 * verbs then missed m8math u6's "Last year you FOUND the volume". A verb list
 * cannot be completed, so this check no longer tries to reach a verdict: it
 * matches the phrase plus a first/second-person learner and PRINTS THE
 * SENTENCE for a human to rule on. It is ADVISORY -- expect true negatives in
 * word problems that legitimately address "you".
 */
function schoolYearLeaks(s: string): string[] {
  return s
    .split(/(?<=[.!?]["']?)\s+|\s+\/\s+/)
    .filter((sent) => /\b(last|next) year\b/i.test(sent) && /\b(you|your|we|our)\b/i.test(sent));
}
// Self-tests: a check that has never been shown to fire is not evidence of absence.
if (!schoolYearLeaks('Last year you learned that an opinion turns into an argument.').length) throw new Error('self-test: missed a real leak (learned)');
if (!schoolYearLeaks('Last year you found the volume of a box with V = Bh.').length) throw new Error('self-test: missed a real leak (found)');
if (schoolYearLeaks('The pool stayed open two hours later than last year.').length) throw new Error('self-test: fired on a passage sentence');
if (schoolYearLeaks('40 students signed up, and the club should keep the slot next year.').length) throw new Error('self-test: fired on the noun "students"');
// A quoted pair separated by " / " must not fuse into one sentence: the splitter
// needs the closing quote and the slash, or an unrelated "we" joins an unrelated "last year".
if (schoolYearLeaks('PAIR A: "If the floor is wet, we will move." / "was" states something that happened last year.').length) throw new Error('self-test: fused a quoted pair into one sentence');

const LETTERS = ['a', 'b', 'c', 'd'];
let total = 0, longest = 0, mcqs = 0;
const problems: string[] = [];
const walk = (o: any, path: string, fn: (s: string, p: string) => void) => {
  if (typeof o === 'string') fn(o, path);
  else if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${path}[${i}]`, fn));
  else if (o && typeof o === 'object') for (const k of Object.keys(o)) walk(o[k], `${path}.${k}`, fn);
};
for (const f of files) {
  const src = readFileSync(dir + f, 'utf8');
  const m = f.match(new RegExp(`^${course}-u(\\d+)-(.+)\\.ts$`));
  if (!m) continue;
  const unit = +m[1], slug = m[2];
  const sym = `SEED_${prefix}_U${unit}_${slug.toUpperCase().replace(/-/g, '_')}`;
  const P = (msg: string) => problems.push(`${f}: ${msg}`);
  if (src.includes('−')) P('U+2212 minus sign present');
  if (/frq|dbq|leq|saq/i.test(src.replace(/\/\*[\s\S]*?\*\//g, ''))) P('banned substring frq|dbq|leq|saq');
  let mod: any;
  try { mod = await import(dir + f); } catch (e: any) { P('IMPORT FAILED: ' + e.message.split('\n')[0]); continue; }
  const plan = mod[sym];
  if (!plan) { P(`export ${sym} missing (exports: ${Object.keys(mod).join(',')})`); continue; }
  total++;
  if (plan.id !== `evelyn.ms.${course}.${slug}.v1`) P(`id ${plan.id}`);
  if (plan.grade !== '8') P(`grade ${plan.grade}`);
  const lo = plan.los?.[0];
  if (!lo || plan.los.length !== 1) P('los must have exactly one entry');
  const topic = lo?.standard?.match(new RegExp(`^${prefix}-(\\d+)\\.(\\d+)$`));
  if (!topic || +topic[1] !== unit) P(`standard ${lo?.standard}`);
  const t = topic ? +topic[2] : 0;
  if (plan.metadata?.cedUnit !== String(unit) || plan.metadata?.cedTopic !== `${unit}.${t}`) P(`metadata cedUnit/cedTopic ${JSON.stringify(plan.metadata)}`);
  const d: string = lo?.description ?? '';
  if (/`|\.ts\b|\bG7\b|Grade 7|Grade 6|\bG6\b|Algebra 1|Geometry course|UNVERIFIED|sign-off|Withholds|Deepens G|Builds on `|Stops short/.test(d) || /→/.test(d.replace(/\)\s*→\s*\(/g, ')'))) P('description carries lineage/withheld material: ' + d.slice(0, 80));
  if (!/\(.*(CCSS|NGSS|National Geography Standard|MS-PS|DCI).*\)\.?$/.test(d.trim())) P('description lacks a trailing standards citation');
  const kinds = (plan.segments ?? []).map((s: any) => s.kind);
  const expect = ['hook','concept','worked_example','worked_example','try_yourself','try_yourself','try_yourself','misconception_check','recap'];
  if (kinds.join() !== expect.join()) P(`segment recipe ${kinds.join(',')}`);
  const concept = plan.segments.find((s: any) => s.kind === 'concept');
  if (concept && (concept.keyIdeas?.length < 4 || concept.keyIdeas?.length > 6)) P(`keyIdeas ${concept.keyIdeas?.length}`);
  const mc = plan.segments.find((s: any) => s.kind === 'misconception_check');
  if (mc && !(mc.commonErrors?.length >= 1 && mc.commonErrors.length <= 2)) P(`commonErrors ${mc.commonErrors?.length}`);
  const recap = plan.segments.find((s: any) => s.kind === 'recap');
  if (recap && !recap.mustRemember?.length) P('recap mustRemember empty');
  const mins = plan.segments.reduce((a: number, s: any) => a + (s.estimatedMinutes ?? 0), 0);
  if (Math.abs(mins - plan.estimatedMinutes) > 1 || plan.estimatedMinutes < 18 || plan.estimatedMinutes > 22) P(`minutes: segments ${mins} vs plan ${plan.estimatedMinutes}`);
  const tys = plan.segments.filter((s: any) => s.kind === 'try_yourself');
  const wantKeys = tryFormat === 'three-mcq'
    ? [0, 1, 2].map((i) => LETTERS[(unit + t + i) % 4])
    : [LETTERS[(unit + t) % 4], LETTERS[(unit + t + 2) % 4]];
  let mi = 0;
  const geoKeys: string[] = [];
  tys.forEach((ty: any, i: number) => {
    if ((ty.hints?.length ?? 0) !== 2) P(`try_yourself ${i + 1}: hints ${ty.hints?.length}`);
    if (ty.responseFormat === 'numeric') {
      if (tryFormat === 'three-mcq') P(`try_yourself ${i + 1}: numeric in a three-mcq course`);
      if (i !== 2) P(`try_yourself ${i + 1}: numeric item should be third`);
      if (!/^-?\d+(\.\d+)?(\/\d+)?$/.test(ty.expectedAnswer ?? '')) P(`try_yourself ${i + 1}: numeric expectedAnswer '${ty.expectedAnswer}' not bare`);
      return;
    }
    if (ty.responseFormat !== 'mcq') { P(`try_yourself ${i + 1}: responseFormat ${ty.responseFormat}`); return; }
    const ch = ty.choices ?? [];
    if (ch.length !== 4 || ch.map((c: any) => c.id).join() !== 'a,b,c,d') P(`try_yourself ${i + 1}: choices ids ${ch.map((c: any) => c.id).join()}`);
    const correct = ch.filter((c: any) => c.correct);
    if (correct.length !== 1) P(`try_yourself ${i + 1}: ${correct.length} correct choices`);
    if (correct[0] && ty.expectedAnswer !== correct[0].text) P(`try_yourself ${i + 1}: expectedAnswer != correct text`);
    if (new Set(ch.map((c: any) => c.text.trim().toLowerCase())).size !== ch.length) P(`try_yourself ${i + 1}: duplicate choice text`);
    if (correct[0]) {
      if (course.endsWith('geo')) geoKeys.push(correct[0].id);
      else if (correct[0].id !== wantKeys[mi]) P(`try_yourself ${i + 1}: DF-1 key at '${correct[0].id}', formula wants '${wantKeys[mi]}'`);
    }
    mi++;
    mcqs++;
    const maxLen = Math.max(...ch.map((c: any) => c.text.length));
    if (correct[0] && correct[0].text.length === maxLen && ch.filter((c: any) => c.text.length === maxLen).length === 1) longest++;
  });
  if (course.endsWith('geo')) {
    const omit = LETTERS[(unit + t) % 4];
    const want = LETTERS.filter((l) => l !== omit).join();
    if ([...geoKeys].sort().join() !== want) P(`DF-1 (geo variant): keys ${geoKeys.join(',')}; must be three different ids omitting '${omit}'`);
  }
  if (tryFormat === 'two-mcq-one-numeric' && tys.filter((x: any) => x.responseFormat === 'numeric').length !== 1) P('math course needs exactly one numeric try_yourself');
  walk(plan.segments, 'segments', (s, p) => {
    if (/\bGrade [678]\b|\bG[678]\b/.test(s)) P(`spoken field names a grade band: ${p}`);
    for (const sent of schoolYearLeaks(s)) P(`ADVISORY -- another school year addressed to the student: ${p}: "${sent.trim().slice(0, 110)}"`);
    if (/\bthis lesson\b|\bin this lesson\b/i.test(s) && /try_yourself|choices|problem/.test(p)) P(`try item references "this lesson": ${p}`);
  });
}
console.log(`${course}: ${total} plans audited · MCQs ${mcqs} · longest-answer keyed ${longest}/${mcqs} (DIAGNOSTIC, chance ~25%)`);
if (!problems.length) console.log('  ALL CHECKS CLEAN');
else { console.log(`  ${problems.length} problem(s):`); for (const p of problems) console.log('   ' + p); }
