// apps/tutor/scripts/tutor/verdict-bank/report.ts
/**
 * Markdown report renderer for the verdict probe bank (2026-08-18 plan,
 * Task 5). Pure — no fs, no network, deterministic (same input -> byte-
 * identical output). run-bank.ts (the CLI) is the only file in this
 * directory that does I/O; it writes this string to results.json/report.md.
 */
import type { ProbeExpected, VerdictClass, ProbeGrade } from './classifier';

export interface SampleResult {
  grade: ProbeGrade;
  verdictClass: VerdictClass;
  /** First 160 chars of the graded tutor reply. */
  openerQuote: string;
  /** Guard-family debug-event types matched for this sample. */
  guardEvents: string[];
  bundleDir: string;
}

export interface ProbeResult {
  probe: {
    id: string;
    cell: { provenance: string; relation: string; answerType: string };
    expected: ProbeExpected;
    notes: string;
  };
  samples: SampleResult[];
}

export type ProbeStatus = 'PASS' | 'FAIL' | 'FLAKY';

/** FAIL if any sample failed; FLAKY if no fails but >=1 no-verdict; PASS if
 *  every sample passed. */
export function statusForProbe(result: ProbeResult): ProbeStatus {
  const grades = result.samples.map((s) => s.grade);
  if (grades.some((g) => g === 'fail')) return 'FAIL';
  if (grades.some((g) => g === 'no-verdict')) return 'FLAKY';
  return 'PASS';
}

function sampleCounts(samples: SampleResult[]): { pass: number; fail: number; noVerdict: number } {
  return {
    pass: samples.filter((s) => s.grade === 'pass').length,
    fail: samples.filter((s) => s.grade === 'fail').length,
    noVerdict: samples.filter((s) => s.grade === 'no-verdict').length,
  };
}

function cellLabel(cell: { provenance: string; relation: string; answerType: string }): string {
  return `${cell.provenance} / ${cell.relation} / ${cell.answerType}`;
}

function summaryRow(result: ProbeResult): string {
  const { pass, fail, noVerdict } = sampleCounts(result.samples);
  const status = statusForProbe(result);
  return `| ${result.probe.id} | ${cellLabel(result.probe.cell)} | ${result.probe.expected} | ${pass}×pass / ${fail}×fail / ${noVerdict}×no-verdict | ${status} |`;
}

/** The roll-up table alone (probe id, cell, expected, sample counts,
 *  status) — reused by `renderReport` and by run-bank.ts to print a
 *  standalone summary to stdout. */
export function renderSummaryTable(rows: ProbeResult[]): string {
  return [
    '| Probe | Cell | Expected | Samples | Status |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(summaryRow),
  ].join('\n');
}

function sampleDetailLines(sample: SampleResult, index: number): string[] {
  return [
    `- Sample ${index + 1}: **${sample.grade}** (classified: ${sample.verdictClass})`,
    `  - Opener: "${sample.openerQuote}"`,
    `  - Guard events: ${sample.guardEvents.length ? sample.guardEvents.join(', ') : '(none)'}`,
    `  - Bundle: ${sample.bundleDir}`,
  ];
}

/** One detail section for a non-PASS probe — quotes every failing/
 *  no-verdict sample's opener, guard events, and bundle dir. Passing
 *  samples of an otherwise-non-PASS probe are omitted (they need no
 *  explanation); they still count in the summary table row. */
function probeDetail(result: ProbeResult): string {
  const status = statusForProbe(result);
  const lines = [
    `### ${result.probe.id} — ${status}`,
    '',
    `Expected: **${result.probe.expected}**`,
    `Notes: ${result.probe.notes || '(none)'}`,
    '',
  ];
  result.samples.forEach((s, i) => {
    if (s.grade === 'pass') return;
    lines.push(...sampleDetailLines(s, i));
  });
  return lines.join('\n');
}

function guardSaveLine(probeId: string, sample: SampleResult, index: number): string {
  return `- \`${probeId}\` sample ${index + 1} (${sample.grade}): ${sample.guardEvents.join(', ')} — ${sample.bundleDir}`;
}

/** Every sample (pass OR fail) whose guardEvents is non-empty — a guard
 *  intervening means the brain misfired even when the final grade is a
 *  pass, which is a finding on its own. */
function guardSavesSection(rows: ProbeResult[]): string {
  const lines: string[] = [];
  for (const r of rows) {
    r.samples.forEach((s, i) => {
      if (s.guardEvents.length > 0) lines.push(guardSaveLine(r.probe.id, s, i));
    });
  }
  return lines.length ? lines.join('\n') : '(none — no guard intervened on any sample)';
}

/**
 * Renders `rows` (one entry per probe, each carrying its samples) into a
 * single markdown report: a roll-up summary table, a detail section per
 * non-PASS probe, and a final Guard-saves section. Pure — same input
 * always yields byte-identical output.
 */
export function renderReport(rows: ProbeResult[]): string {
  const header = ['# Verdict Probe Bank Report', '', '## Summary', ''];
  const table = [renderSummaryTable(rows)];

  const nonPass = rows.filter((r) => statusForProbe(r) !== 'PASS');
  const detailHeader = ['', '## Probe detail', ''];
  const detailBlock = nonPass.length
    ? nonPass.map(probeDetail).join('\n\n')
    : '(all probes passed — no detail sections)';

  const guardHeader = ['', '## Guard saves', ''];
  const guardBlock = guardSavesSection(rows);

  return [...header, ...table, ...detailHeader, detailBlock, ...guardHeader, guardBlock].join('\n');
}