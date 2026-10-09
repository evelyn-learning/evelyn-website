/**
 * Practice coverage per generated-course skill, from a LOCAL dump — for each
 * skill (a generated plan's first LO, the id a course node holds): its
 * objectives, the servable practice items per objective, and the objectives
 * with none. The serving rules are the engine's own
 * (src/lib/tutor/portal/practice-coverage.ts runs the dump through
 * `retrievePractice`).
 *
 * Reads JSON files, prints a report. No database, no network, no .env, no
 * model call — it never opens a connection.
 *
 * Input, in the shape of the stored Mongo documents (a JSON array, or JSONL
 * as `mongoexport` writes it):
 *   <dump.json>                       one file: { "plans": [...], "bank": [...] }
 *   --plans <file> [--bank <file>]    or the two collections separately
 *                                     (lessonplans / problembanks)
 *
 *   npx tsx scripts/audit/practice-skill-coverage.ts <dump.json> [--partner <id>] [--audited-only] [--skills <file>] [--json] [--zero-only]
 *   npx tsx scripts/audit/practice-skill-coverage.ts --plans plans.json --bank bank.json --partner greenapple --audited-only
 *
 * --partner <id>   report what THIS partner is served (a plan stamped with
 *                  another partner then shows zero). Default: each plan as
 *                  its own stamped partner is served it.
 * --audited-only   apply the PRACTICE_GEN_AUDITED_ONLY_PARTNERS rules for the
 *                  caller: only audited generated rows, and only audited
 *                  lesson steps from objectives 2..N.
 * --skills <file>  restrict to these skill LO ids: a JSON array of strings or
 *                  of objects carrying `loId` (course nodes) or `skillLo`.
 * --json           print the full report as JSON (item ids included).
 * --zero-only      list only the skills that have an objective with no item.
 *
 * TUTOR_PRACTICE_SKILL_SCOPE=off in the environment shows the per-LO
 * behaviour (objective 1 only) for comparison.
 */
import fs from 'node:fs';
import { skillCoverage, summarizeCoverage } from '../../src/lib/tutor/portal/practice-coverage';

function readDocs(file: string): unknown {
  const text = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(text);
  } catch {
    // JSONL (mongoexport without --jsonArray).
    return text.split(/\r?\n/).filter((l) => l.trim().length > 0).map((line, n) => {
      try { return JSON.parse(line); } catch { throw new Error(`${file} line ${n + 1}: not JSON`); }
    });
  }
}

function asArray(v: unknown, what: string): unknown[] {
  if (!Array.isArray(v)) throw new Error(`${what}: expected an array of documents`);
  return v;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const flag = (name: string): string | undefined => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const valueFlags = new Set(['--plans', '--bank', '--partner', '--skills']);
  const positional = argv.filter((a, i) => !a.startsWith('--') && !valueFlags.has(argv[i - 1] ?? ''));
  const plansPath = flag('--plans');
  if (!positional[0] && !plansPath) {
    console.error('usage: npx tsx scripts/audit/practice-skill-coverage.ts <dump.json> | --plans <file> [--bank <file>]  [--partner <id>] [--audited-only] [--skills <file>] [--json] [--zero-only]');
    process.exit(2);
  }
  let plans: unknown[];
  let bank: unknown[];
  if (plansPath) {
    plans = asArray(readDocs(plansPath), plansPath);
    const bankPath = flag('--bank');
    bank = bankPath ? asArray(readDocs(bankPath), bankPath) : [];
  } else {
    const dump = readDocs(positional[0]) as { plans?: unknown; bank?: unknown };
    plans = asArray(dump?.plans, `${positional[0]} "plans"`);
    bank = dump?.bank === undefined ? [] : asArray(dump.bank, `${positional[0]} "bank"`);
  }
  const skillsPath = flag('--skills');
  const skillLoIds = skillsPath
    ? asArray(readDocs(skillsPath), skillsPath).map((s, n) => {
        const id = typeof s === 'string' ? s : (s as { loId?: unknown; skillLo?: unknown } | null)?.loId ?? (s as { skillLo?: unknown } | null)?.skillLo;
        if (typeof id !== 'string') throw new Error(`${skillsPath} entry ${n + 1}: no skill LO id`);
        return id;
      })
    : undefined;
  const partnerId = flag('--partner');
  const auditedOnly = argv.includes('--audited-only');

  const rows = await skillCoverage({ plans, bank }, { partnerId, auditedOnly, skillLoIds });
  if (argv.includes('--json')) {
    console.log(JSON.stringify({ partnerId: partnerId ?? null, auditedOnly, summary: summarizeCoverage(rows), skills: rows }, null, 2));
    return;
  }
  const shown = argv.includes('--zero-only') ? rows.filter((r) => r.zeroObjectives.length > 0) : rows;
  for (const r of shown) {
    console.log(`${r.skillLoId}  ${r.title ?? ''}${r.partnerId ? `  [${r.partnerId}]` : ''}`);
    console.log(`  objectives=${r.objectives.length} servable=${r.servable} zero=${r.zeroObjectives.length}`);
    r.objectives.forEach((o, i) => {
      console.log(`  ${o.servable === 0 ? '!' : ' '} lo-${i + 1}  servable=${o.servable} (steps ${o.servableSteps}/${o.authoredSteps}, bank ${o.servableBank})  ${o.description ?? o.loId}`);
    });
  }
  const s = summarizeCoverage(rows);
  console.log(`\n${plans.length} plans, ${bank.length} bank rows read; partner=${partnerId ?? '(each plan\'s own)'} audited-only=${auditedOnly ? 'yes' : 'no'} skill-scope=${(process.env.TUTOR_PRACTICE_SKILL_SCOPE ?? '').trim().toLowerCase() === 'off' ? 'OFF' : 'on'}`);
  console.log(`skills=${s.skills} objectives=${s.objectives} servable_items=${s.servable}`);
  console.log(`objectives_with_zero=${s.objectivesWithZero} skills_with_a_zero_objective=${s.skillsWithAZeroObjective} skills_with_nothing=${s.skillsWithNothing}`);
  if (skillLoIds) {
    const found = new Set(rows.map((r) => r.skillLoId));
    const missing = skillLoIds.filter((id) => !found.has(id));
    console.log(`skills_requested=${skillLoIds.length} not_a_skill_plan_in_dump=${missing.length}`);
    for (const id of missing.slice(0, 20)) console.log(`  missing ${id}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
