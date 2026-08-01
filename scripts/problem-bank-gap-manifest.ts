/**
 * Compute per-LO problem-bank deficits against a floor (default 4 items/LO).
 *
 * Sources (git = source of truth, no DB access):
 *  - src/lib/tutor/lesson-plan/seeds/*.ts   → plan LO ids, CED codes (`standard`), unit (filename -u<N>-)
 *  - src/data/problem-bank/<course>/u*.json → current per-LO counts + difficulty spread
 *
 * LOs that appear ONLY in *-{frq,saq,dbq,leq}-practice plan files are
 * essay-skill LOs and are excluded (spec amendment 2026-07-18).
 *
 * Usage: npx tsx scripts/problem-bank-gap-manifest.ts [--course=ap-us-history] [--floor=4]
 * Writes .gap-manifests/<course>.json and prints a summary table.
 */
import * as fs from 'fs';
import * as path from 'path';

export interface PlanLo { loId: string; cedCode: string; unit: number; frqPracticeOnly: boolean; }
export interface BankCount { total: number; byDifficulty: Record<1 | 2 | 3 | 4, number>; }
export interface GapEntry {
  loId: string; cedCode: string; unit: number;
  current: number; deficit: number; difficultyGaps: Array<1 | 2 | 3 | 4>;
}

/** course dir → LO-id prefix */
export const COURSE_PREFIX: Record<string, string> = {
  'ap-calculus-bc': 'apcalcbc', 'ap-statistics': 'apstats', 'ap-macroeconomics': 'apmacro',
  'ap-environmental-science': 'apenvsci', 'ap-psychology': 'appsych',
  'ap-english-language': 'apenglang', 'ap-world-history': 'apworld',
  'ap-us-history': 'apush', 'ap-us-government': 'apgov',
  'algebra-1': 'alg1',
  geometry: 'geom',
  biology: 'bio',
  chemistry: 'chem',
  'hs-english': 'engl',
  'world-history': 'whist',
};

const FRQ_FILE_RE = /-(frq|saq|dbq|leq)-/;

/** Derive unit from filename -u<N>- segment, or from cedCode first digit, or default to 1. */
export function deriveUnit(filename: string, cedCode: string): number {
  // Try filename -u<N>- segment first
  const fileM = filename.match(/-u(\d+)-/);
  if (fileM) return parseInt(fileM[1], 10);
  // Try cedCode first digit
  const cedM = cedCode.match(/(\d+)\.\d+/);
  if (cedM) return parseInt(cedM[1], 10);
  // Fallback to 1 (no warning needed; handled at call site in collectPlanLos)
  return 1;
}

/** Extract `{ id: '<prefix>.x', ... standard: 'Y' }` pairs from plan seed source. */
export function parsePlanLosFromSource(src: string, prefix: string): Array<{ loId: string; cedCode: string }> {
  const out: Array<{ loId: string; cedCode: string }> = [];
  const re = new RegExp(
    `id:\\s*['"](${prefix}\\.[a-z0-9-]+)['"][^}]*?standard:\\s*['"]([^'"]+)['"]`, 'gs');
  for (const m of src.matchAll(re)) out.push({ loId: m[1], cedCode: m[2] });
  return out;
}

export function collectPlanLos(seedsDir: string, prefix: string): PlanLo[] {
  const byLo = new Map<string, PlanLo>();
  const scoreByLo = new Map<string, number>(); // preference score: 2 for -u<N>-, 1 otherwise
  const inNonFrq = new Set<string>();
  const files = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.ts')).sort();
  for (const f of files) {
    const src = fs.readFileSync(path.join(seedsDir, f), 'utf8');
    const isFrq = FRQ_FILE_RE.test(f);
    const score = f.match(/-u(\d+)-/) ? 2 : 1; // preference score
    for (const { loId, cedCode } of parsePlanLosFromSource(src, prefix)) {
      if (!isFrq) inNonFrq.add(loId);
      const unit = deriveUnit(f, cedCode); // derive per-LO
      const prev = byLo.get(loId);
      const prevScore = scoreByLo.get(loId) ?? 0;
      // Only replace if: no prev, or (prev is frq and new is non-frq), or (same frq status but higher score)
      if (!prev || (prev.frqPracticeOnly && !isFrq) || (!prev.frqPracticeOnly && !isFrq && score > prevScore)) {
        byLo.set(loId, { loId, cedCode, unit, frqPracticeOnly: isFrq });
        scoreByLo.set(loId, score);
      }
    }
  }
  for (const lo of byLo.values()) lo.frqPracticeOnly = !inNonFrq.has(lo.loId);
  return [...byLo.values()];
}

export function collectBankCounts(courseDir: string): Map<string, BankCount> {
  const counts = new Map<string, BankCount>();
  for (const f of fs.readdirSync(courseDir).filter((f) => f.endsWith('.json'))) {
    const items = JSON.parse(fs.readFileSync(path.join(courseDir, f), 'utf8')) as Array<{ loId: string; difficulty: 1 | 2 | 3 | 4 }>;
    for (const it of items) {
      const c = counts.get(it.loId) ?? { total: 0, byDifficulty: { 1: 0, 2: 0, 3: 0, 4: 0 } };
      c.total += 1;
      c.byDifficulty[it.difficulty] += 1;
      counts.set(it.loId, c);
    }
  }
  return counts;
}

export function computeManifest(planLos: PlanLo[], bankCounts: Map<string, BankCount>, floor = 4): GapEntry[] {
  return planLos
    .filter((lo) => !lo.frqPracticeOnly)
    .map((lo) => {
      const c = bankCounts.get(lo.loId) ?? { total: 0, byDifficulty: { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<1 | 2 | 3 | 4, number> };
      const difficultyGaps = ([1, 2, 3, 4] as const).filter((d) => c.byDifficulty[d] === 0);
      return { loId: lo.loId, cedCode: lo.cedCode, unit: lo.unit, current: c.total, deficit: Math.max(0, floor - c.total), difficultyGaps: [...difficultyGaps] };
    })
    .sort((a, b) => a.unit - b.unit || a.loId.localeCompare(b.loId));
}

function main() {
  const courseArg = process.argv.find((a) => a.startsWith('--course='))?.split('=')[1];
  const floor = parseInt(process.argv.find((a) => a.startsWith('--floor='))?.split('=')[1] ?? '4', 10);
  const root = path.join(__dirname, '..');
  const seedsDir = path.join(root, 'src/lib/tutor/lesson-plan/seeds');
  const outDir = path.join(root, '.gap-manifests');
  fs.mkdirSync(outDir, { recursive: true });
  const courses = courseArg ? [courseArg] : Object.keys(COURSE_PREFIX);
  for (const course of courses) {
    const prefix = COURSE_PREFIX[course];
    if (!prefix) throw new Error(`unknown course ${course}`);
    const manifest = computeManifest(
      collectPlanLos(seedsDir, prefix),
      collectBankCounts(path.join(root, 'src/data/problem-bank', course)),
      floor,
    );
    fs.writeFileSync(path.join(outDir, `${course}.json`), JSON.stringify(manifest, null, 2));
    const need = manifest.reduce((s, m) => s + m.deficit, 0);
    const zero = manifest.filter((m) => m.current === 0).length;
    console.log(`${course}: LOs=${manifest.length} zero-item=${zero} totalDeficit=${need}`);
  }
}

if (require.main === module) main();
