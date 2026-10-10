/**
 * KEY FORM report for the served numeric practice rows: could a student with
 * the right answer be marked wrong because of the form they type, or because
 * of ordinary rounding? Offline — no database, no network, no model.
 *
 *   cd apps/tutor && env -u MONGODB_URI npx tsx scripts/practice-fix/key-form.ts
 *
 * Every form is graded by the product's own code (product-grader.ts: the
 * academy card + stored grade, which implement the shared numeric rule of
 * src/lib/tutor/portal/numeric-answer-rule.ts):
 *   - the practice job's generated equivalents and wrong answers
 *     (grader-test.ts `numericSubs`: trailing zeros, exact fraction, percent
 *     sign, unit, thousands separators, scientific notation, …);
 *   - the extra forms of key-form-core.ts (the fraction the solution arrives
 *     at, the unrounded value, one place fewer, a decimal for a fraction key).
 * Rounding of intermediates cannot be read off the text: the rows that need
 * it were recomputed in work/key_form_checks.py, which also holds the
 * proposals; this script turns each proposal into exact old/new stem text
 * and fails if a mechanically found risk has no proposal.
 *
 * Writes …/older-items-truth-read-2026-10-17/key-form-report.json. Nothing
 * here changes fixes.json or the apply data: these are PROPOSALS.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseNumericKey } from '../../src/lib/tutor/portal/numeric-answer-rule';
import { extraForms, stemEdit, stemInstruction, type Proposal } from './key-form-core';
import { READ_DIR, loadBatches, loadFixFile, loadGrades, loadRows, loadWithdrawnIds } from './io';
import { formContradictions, grade, networkGuard, numericSubs, type Outcome } from './product-grader';

interface Check { id: string; suffix: string; key: string; places: number; exact: number; exactDecimal?: string; full: string; sf4: string; sf3: string; ansPlaces: string | null; tieMargin: number; misses: string[] }
interface ProposalEntry { id: string; suffix: string; class: string; severity: string; finding: string; proposal: Proposal }
interface Tested { cls: string; kind: string; text: string; outcome: Outcome; stored?: Outcome }

async function main(): Promise<void> {
  const rows = loadRows();
  const batches = loadBatches();
  const grades = loadGrades();
  const checksFile = JSON.parse(fs.readFileSync(path.join(READ_DIR, 'work', 'key-form-checks.json'), 'utf8')) as { recomputed: Check[]; proposals: ProposalEntry[] };
  const checks = new Map(checksFile.recomputed.map((c) => [c.id, c]));
  const proposals = new Map(checksFile.proposals.map((p) => [p.id, p]));
  const fixed = new Map(loadFixFile().items.map((i) => [i.id, i]));
  const withdrawn = loadWithdrawnIds();

  const outcomeCounts: Record<string, number> = {};
  const risk: Array<Record<string, unknown>> = [];
  const noHarm = { stemAsksFractionKeyIsDecimal: [] as unknown[], stemAsksFractionKeyIsInteger: [] as unknown[], otherStemFormNotes: [] as unknown[] };
  const unresolved: string[] = [];
  let numericRows = 0;
  let submissions = 0;

  for (const [id, b] of batches) {
    const row = rows.get(id);
    if (!row || row.responseFormat !== 'numeric') continue;
    numericRows += 1;
    const key = parseNumericKey(row.answer);
    const suffix = id.split('.').pop() as string;
    const g = grades.get(id);
    const tested: Tested[] = [];
    for (const s of numericSubs(row, g ? [g] : [])) tested.push({ cls: s.cls, kind: s.kind, text: s.text, ...(await grade(row, s.text)) });
    const extras = extraForms(row);
    let repeats = 0;
    for (const e of extras) {
      // A coarse form the generators already submitted (as a "wrong" answer)
      // is graded once and looked at again under its own heading.
      const seen = tested.find((t) => t.text === e.text);
      if (seen && e.expect === 'accept') continue;
      if (seen) repeats += 1;
      tested.push({ cls: e.expect === 'accept' ? 'equiv' : 'coarse', kind: e.kind, text: e.text, ...(seen ? { outcome: seen.outcome, stored: seen.stored } : await grade(row, e.text)) });
    }
    submissions += tested.length - repeats;
    for (const t of tested) outcomeCounts[`${t.cls}:${t.kind}:${t.outcome}`] = (outcomeCounts[`${t.cls}:${t.kind}:${t.outcome}`] ?? 0) + 1;
    const rejected = (t: Tested): boolean => t.outcome === 'rejected' || t.stored === 'rejected';
    const accepted = (t: Tested): boolean => t.outcome === 'accepted' || t.stored === 'accepted';
    const keyRejected = tested.filter((t) => t.cls === 'key' && !accepted(t));
    const equivRejected = tested.filter((t) => t.cls === 'equiv' && rejected(t));
    const coarseRejected = tested.filter((t) => t.cls === 'coarse' && rejected(t));
    const wrongAccepted = tested.filter((t) => t.cls === 'wrong' && accepted(t));
    const instr = stemInstruction(row.problemText);
    const check = checks.get(id);
    // Is the stored key a rounded value? Where the row was recomputed, that
    // decides it; otherwise the solution's own "≈ key" or a more precise
    // value printed next to it.
    const keyIsRounded = check !== undefined
      ? key !== null && key.form !== 'fraction' && Math.abs(check.exact - key.value) > 1e-9
      : extras.some((e) => e.kind === 'unrounded-from-solution') ||
        new RegExp(`(?:≈|approximately|about)\\s*-?\\$?${row.answer.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d.])`).test(row.solutionText.replace(/[−–]/g, '-'));

    const mechanical: string[] = [];
    if (keyRejected.length) mechanical.push('key-not-accepted');
    if (equivRejected.length) mechanical.push('equivalent-form-rejected');
    if (wrongAccepted.length) mechanical.push('wrong-answer-accepted');
    if (key?.form === 'fraction' && !instr.fraction && !instr.decimal && coarseRejected.length) mechanical.push('fraction-key-form-unstated');
    if (key && key.form !== 'fraction' && keyIsRounded && !instr.rounding) mechanical.push('rounding-unstated');
    if (check && check.tieMargin < 1e-6) mechanical.push('rounding-tie');
    else if (check && check.misses.length) mechanical.push('rounding-of-intermediates');

    const p = proposals.get(id);
    const forms = instr.fraction && key && key.form !== 'fraction';
    if (forms) {
      const frac = tested.filter((t) => /fraction/.test(t.kind) && t.cls === 'equiv');
      const entry = { id, suffix, subject: b.subject, key: row.answer, fractionForms: frac.map((t) => `${t.text} → ${t.outcome}`), allAccepted: frac.every((t) => !rejected(t)), note: key.form === 'integer' ? 'the stem asks for a fraction but the answer is a whole number; "n/1" and "n" are both accepted' : 'the stem asks for a fraction and the key is a decimal; the fraction is accepted (an exact fraction is treated as the unrounded answer)' };
      (key.form === 'integer' ? noHarm.stemAsksFractionKeyIsInteger : noHarm.stemAsksFractionKeyIsDecimal).push(entry);
    }
    const contradictions = formContradictions(row).filter((c) => !/fraction/.test(c.kind));
    if (contradictions.length) noHarm.otherStemFormNotes.push({ id, suffix, subject: b.subject, key: row.answer, notes: contradictions });

    const coarseAllowed = key?.form === 'fraction' ? !instr.fraction && !instr.decimal : !instr.rounding;
    const plausibleRejected: string[] = [];
    if (check && key) {
      const candidates = new Map<string, string>();
      if (check.tieMargin < 1e-6) {
        const unit = 10 ** -check.places;
        const other = Math.abs(key.value - check.exact) < 1e-9 ? null : (key.value > check.exact ? key.value - unit : key.value + unit).toFixed(check.places);
        if (other) candidates.set(other, 'the other side of the tie');
      }
      for (const [k, label] of [['sf4', 'intermediates to 4 s.f.'], ['sf3', 'intermediates to 3 s.f.'], ['ansPlaces', "intermediates to the answer's places"]] as const) {
        const v = check[k];
        if (v !== null && Number(v) !== key.value && !candidates.has(v)) candidates.set(v, label);
      }
      for (const [text, label] of candidates) {
        const res = await grade(row, text);
        submissions += 1;
        if (res.outcome === 'rejected' || res.stored === 'rejected') plausibleRejected.push(`${text} (${label})`);
        else unresolved.push(`${suffix}: ${text} (${label}) differs from the key but is accepted`);
      }
    }
    if (key && key.form === 'integer' && check && Math.abs(check.exact - key.value) > 1e-9 && !instr.rounding) {
      for (const places of [1, 2]) {
        const text = check.exact.toFixed(places);
        const res = await grade(row, text);
        submissions += 1;
        if (res.outcome === 'rejected' || res.stored === 'rejected') plausibleRejected.push(`${text} (the unrounded value to ${places} place${places === 1 ? '' : 's'})`);
      }
    }

    if (mechanical.length === 0 && !p) continue;
    if (!p) { unresolved.push(`${suffix}: ${mechanical.join(', ')}`); continue; }
    if (mechanical.length === 0 && p.class !== 'rounding-of-intermediates') unresolved.push(`${suffix}: proposal of class ${p.class} but nothing found mechanically`);
    if (mechanical.length && !mechanical.includes(p.class)) unresolved.push(`${suffix}: proposal says ${p.class}, found ${mechanical.join(', ')}`);
    const edit = stemEdit(row.problemText, p.proposal);
    risk.push({
      id, suffix, subject: b.subject, skill: b.skill, key: row.answer,
      class: p.class, severity: p.severity, finding: p.finding,
      stemStatesRounding: instr.rounding, stemAsksFraction: instr.fraction,
      recomputed: check ? { exact: check.exactDecimal ?? Number(check.exact.toPrecision(10)), tieMarginInUnitsOfLastPlace: check.tieMargin, fullValues: check.full, intermediatesTo4sf: check.sf4, intermediatesTo3sf: check.sf3, intermediatesToAnswerPlaces: check.ansPlaces } : null,
      // What a student with the right method could type and have rejected:
      // a coarser rounding where the stem asks for none, the other side of a
      // tie, the value reached with rounded intermediates.
      correctAnswersRejectedByTheRule: [
        ...equivRejected.map((t) => `${t.text} (${t.kind})`),
        ...(coarseAllowed ? coarseRejected.map((t) => `${t.text} (${t.kind})`) : []),
        ...plausibleRejected,
      ],
      wrongAnswersAcceptedByTheRule: wrongAccepted.map((t) => `${t.text} (${t.kind})`),
      readerVerdict: g?.verdict ?? null,
      alsoInFixes: fixed.has(id) ? fixed.get(id)!.kind : null,
      onWithdrawList: withdrawn.has(id),
      proposal: p.proposal.type === 'withdraw'
        ? { action: 'withdraw', reason: 'the key sits exactly on a rounding tie; any rescue changes the data and so the key' }
        : { action: 'stem-edit', optional: p.proposal.optional === true, edit, ...(p.proposal.type === 'append' && p.proposal.alsoSolution ? { alsoSolution: p.proposal.alsoSolution } : {}) },
    });
  }
  for (const id of proposals.keys()) if (!risk.some((r) => r.id === id)) unresolved.push(`${id}: proposal for a row that is not a served numeric row`);

  const order = ['rounding-tie', 'rounding-of-intermediates', 'rounding-unstated', 'fraction-key-form-unstated'];
  risk.sort((a, b) => order.indexOf(a.class as string) - order.indexOf(b.class as string) || String(a.subject).localeCompare(String(b.subject)) || String(a.suffix).localeCompare(String(b.suffix)));
  const by = (k: string): Record<string, number> => risk.reduce<Record<string, number>>((a, r) => { a[String(r[k])] = (a[String(r[k])] ?? 0) + 1; return a; }, {});
  const edits = risk.filter((r) => (r.proposal as { action: string }).action === 'stem-edit');
  const report = {
    generatedAt: new Date().toISOString(),
    rule: 'the product numeric rule (engine src/lib/tutor/portal/numeric-answer-rule.ts; the academy card and stored grade run the same block) — every form below was graded by that code',
    numericRowsTested: numericRows,
    submissionsGraded: submissions,
    summary: {
      rowsWhereACorrectStudentCouldBeMarkedWrong: risk.length,
      byClass: by('class'),
      bySeverity: by('severity'),
      markedForWithdrawal: risk.filter((r) => (r.proposal as { action: string }).action === 'withdraw').map((r) => r.suffix),
      stemEditsProposed: edits.filter((r) => !(r.proposal as { optional: boolean }).optional).map((r) => r.suffix),
      stemEditsOptional: edits.filter((r) => (r.proposal as { optional: boolean }).optional).map((r) => r.suffix),
      generatedEquivalentFormsRejected: Object.entries(outcomeCounts).filter(([k]) => k.startsWith('equiv:') && k.endsWith(':rejected')).reduce((a, [, v]) => a + v, 0),
      generatedWrongAnswersAccepted: Object.entries(outcomeCounts).filter(([k]) => k.startsWith('wrong:') && k.endsWith(':accepted')).reduce((a, [, v]) => a + v, 0),
      unresolved,
    },
    whatTheRuleDoesWithNaturalForms: [
      'a fraction typed for a decimal key is accepted when it lies within half a unit of the key\'s last place (17/25 for 0.68) — so "give a fraction" stems with decimal keys mark nobody wrong',
      'trailing zeros, a leading plus, thousands separators, scientific notation, a percent sign and an appended unit are accepted on the practice card (all generated forms: 0 rejected)',
      'a decimal key accepts answers with at least as many places within half a unit of its last place; an answer with FEWER places only if it is exactly equal — so 0.57 is wrong for 0.565',
      'an INTEGER key accepts nothing but the same value — so 275.1 is wrong for 275',
      'a FRACTION key accepts a decimal with 2 or more places equal to the key rounded to that many places — so 6.67 is right and 6.7 wrong for 20/3',
      'a value exactly on a rounding tie is accepted only on the half-up side (0.69 for 0.685), and the unrounded value itself (0.685) is accepted',
    ],
    rows: risk,
    checkedNoStudentHarm: noHarm,
    recomputedAndRobust: checksFile.recomputed.filter((c) => !proposals.has(c.id)).map((c) => ({ suffix: c.suffix, key: c.key, exact: Number(c.exact.toPrecision(8)), tieMargin: c.tieMargin })),
    outcomesByClassKind: Object.fromEntries(Object.entries(outcomeCounts).sort()),
    networkGuard,
  };
  fs.writeFileSync(path.join(READ_DIR, 'key-form-report.json'), `${JSON.stringify(report, null, 1)}\n`);
  console.log(`numeric rows ${numericRows} · submissions graded ${submissions} · rows at risk ${risk.length} ${JSON.stringify(report.summary.byClass)}`);
  console.log(`withdraw (tie): ${report.summary.markedForWithdrawal.join(', ')} · stem edits: ${report.summary.stemEditsProposed.join(', ')} · optional: ${report.summary.stemEditsOptional.join(', ')}`);
  console.log(`generated equivalents rejected ${report.summary.generatedEquivalentFormsRejected} · generated wrong answers accepted ${report.summary.generatedWrongAnswersAccepted}`);
  console.log(`fraction asked, decimal key: ${noHarm.stemAsksFractionKeyIsDecimal.length} rows (all accepted: ${noHarm.stemAsksFractionKeyIsDecimal.every((x) => (x as { allAccepted: boolean }).allAccepted)}) · fraction asked, integer key: ${noHarm.stemAsksFractionKeyIsInteger.length}`);
  if (unresolved.length) { console.log(`UNRESOLVED (${unresolved.length}):`); for (const u of unresolved) console.log(`  ${u}`); process.exitCode = 1; }
  console.log(`report: ${path.join(READ_DIR, 'key-form-report.json')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
