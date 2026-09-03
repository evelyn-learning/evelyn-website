// Controller check, run at registration. Answers by measurement the questions
// that cannot be answered by reading 40 files: did every agent use the exact
// curriculum scope sentence, the right standard code, the required answer
// positions, and a chain that resolves?
import { readFileSync, readdirSync } from 'node:fs';

const [course, prefix, curriculumPath, seedDir] = process.argv.slice(2);

// --- curriculum rows -------------------------------------------------------
const rows = [];
let unit = 0;
for (const line of readFileSync(curriculumPath, 'utf8').split('\n')) {
  const m = line.match(/^##\s+Unit\s+(\d+)\s+[—-]/);
  if (m) { unit = +m[1]; continue; }
  if (!unit || !line.trim().startsWith('|')) continue;
  const c = line.trim().replace(/^\||\|$/g, '').split('|').map((s) => s.trim());
  if (c.length < 5 || c[0].toLowerCase() === 'slug' || /^[-: ]+$/.test(c[0])) continue;
  const slug = c[0].replace(/`/g, '');
  rows.push({ unit, topic: rows.filter((r) => r.unit === unit).length + 1, slug, title: c[1], scope: c[3] });
}

const files = readdirSync(seedDir).filter((f) => f.startsWith(course + '-') && f.endsWith('.ts'));
const problems = [];
const seen = new Set();

for (const row of rows) {
  const fname = `${course}-u${row.unit}-${row.slug}.ts`;
  if (!files.includes(fname)) { problems.push(`MISSING FILE  ${fname}`); continue; }
  seen.add(fname);
  const src = readFileSync(`${seedDir}/${fname}`, 'utf8');
  const body = src.replace(/\/\*[\s\S]*?\*\//g, '');   // drop the SCOPE GUARD doc comment

  // 1. description carries the curriculum scope sentence verbatim
  // The convention is "<scope sentence> (CCSS <code>)." — the sentence's own
  // final period moves to after the citation, so compare without it.
  // Markdown emphasis and code ticks live in the curriculum CELL but never in
  // the shipped prose (`*why*` -> `why`). Strip them, or every row whose scope
  // sentence emphasises a word reads as drift. Third parser bug found in this
  // same test — the DESCRIPTION check has now produced more false positives
  // than real findings, which is itself the finding.
  // Normalise the punctuation the seeds are FORBIDDEN to reproduce. The
  // curriculum's scope sentences use em dashes and typographic quotes; the
  // fan-out contract bans em dashes from student-facing prose, so a seed
  // literally CANNOT carry such a sentence verbatim. Two rules in conflict,
  // and this test was scoring the conflict as agent error. Compare content,
  // not dash form.
  const demark = (t) =>
    t
      .replace(/[*`_]/g, '')
      .replace(/\s*(?:--|[\u2014\u2013])\s*/g, ' - ')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[()]/g, '');
  // The contract DELIBERATELY allows a detachable exclusion clause to live in
  // the SCOPE GUARD instead of the description, so requiring the whole cell
  // verbatim tests a rule the wave chose not to follow. Compare the POSITIVE
  // core only: truncate at the exclusion marker. A seed that keeps its clause
  // still passes (this is a containment test), so the check stays meaningful
  // in both directions while no longer scoring an authorised choice as drift.
  const scopeCore = demark(row.scope)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s-\s(?:without|with no|no content|not |stopping short|rather than|and not)[\s\S]*$/i, '')
    .replace(/[.,]$/, '');
  // TS single-quoted strings escape apostrophes as \' — unescape before
  // comparing, or every description containing "story's"/"author's" appears
  // to mismatch. This bit ELA (36/40 false positives) far worse than math.
  const srcFlat = demark(src.replace(/\\'/g, "'")).replace(/\s+/g, ' ');
  if (!srcFlat.includes(scopeCore)) {
    problems.push(`DESCRIPTION   ${fname}: los[0].description does not contain the curriculum scope sentence verbatim`);
  }

  // 2. standard code
  // TS string literals may be single- OR double-quoted; one file in 320 used
  // double quotes and this test called it a wrong standard code. Fifth parser
  // bug in this checker, and the second to indict correct work. Quote-agnostic
  // from here.
  const q = (t) => body.includes(`'${t}'`) || body.includes(`"${t}"`);
  const std = `${prefix}-${row.unit}.${row.topic}`;
  if (!q(std)) problems.push(`STANDARD      ${fname}: expected ${std}`);

  // 3. cedTopic / cedUnit
  const ced = `${row.unit}.${row.topic}`;
  if (!(body.includes(`cedTopic: '${ced}'`) || body.includes(`cedTopic: "${ced}"`)))
    problems.push(`CEDTOPIC      ${fname}: expected cedTopic '${ced}'`);

  // 4. plan id + loId
  if (!body.includes(`evelyn.ms.${course}.${row.slug}.v1`)) problems.push(`PLANID        ${fname}`);

  // 5. chain: prerequisites/followUps point at the neighbouring rows
  const idx = rows.indexOf(row);
  const prev = idx > 0 ? `${course}.${rows[idx - 1].slug}` : null;
  const next = idx + 1 < rows.length ? `${course}.${rows[idx + 1].slug}` : null;
  if (prev && !body.includes(prev)) problems.push(`CHAIN-PREREQ  ${fname}: expected ${prev}`);
  if (next && !body.includes(next)) problems.push(`CHAIN-FOLLOW  ${fname}: expected ${next}`);
}

for (const f of files) if (!seen.has(f)) problems.push(`ORPHAN FILE   ${f} — no curriculum row claims it`);

console.log(`${course}: ${rows.length} curriculum rows, ${files.length} seed files`);
if (!problems.length) console.log('  ALL CHECKS CLEAN');
else { console.log(`  ${problems.length} problem(s):`); for (const p of problems) console.log('   ' + p); }
