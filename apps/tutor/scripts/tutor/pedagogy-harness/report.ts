/**
 * Task H5 — markdown report generator. Combines Layer-1 gate results
 * (assertions.ts) and Layer-2 advisory judge results (judge.ts) for one or
 * more scenarios into a single markdown report: a roll-up table + a
 * per-scenario detail section, per the plan's "Reporting checkpoint"
 * (docs/superpowers/plans/2026-07-02-tutor-pedagogy-opener-calibration.md
 * — "generate the per-scenario report ... and present it to the user").
 *
 * Pure string output — no I/O, no network, deterministic (same input ->
 * byte-identical output).
 */
import type { GateResult } from './assertions';
import type { JudgeResult } from './judge';

export type ScenarioResult = {
  taskId: string;
  persona: string;
  gates: GateResult[];
  judge?: JudgeResult;
  anomalies?: string[];
};

function rollupRow(r: ScenarioResult): string {
  const passCount = r.gates.filter((g) => g.ok).length;
  const l1 = `${passCount}/${r.gates.length}`;
  const l2 = r.judge ? String(r.judge.flagged.length) : '—';
  return `| ${r.taskId} | ${r.persona} | ${l1} | ${l2} |`;
}

function gateLine(g: GateResult): string {
  return `- ${g.ok ? 'PASS' : 'FAIL'} \`${g.id}\`: ${g.detail}`;
}

function judgeLine(s: { id: string; score: number; rationale: string }): string {
  const flaggedTag = s.score < 4 ? ' (FLAGGED)' : '';
  return `- ${s.score}/5 \`${s.id}\`${flaggedTag}: ${s.rationale}`;
}

function scenarioDetail(r: ScenarioResult): string {
  const lines: string[] = [`### ${r.taskId} — ${r.persona}`, ''];

  lines.push('**Layer 1 — deterministic gates**');
  lines.push(r.gates.length ? r.gates.map(gateLine).join('\n') : '(no gates registered for this taskId)');
  lines.push('');

  lines.push('**Layer 2 — Sonnet judge (advisory)**');
  if (r.judge && r.judge.scores.length) {
    lines.push(r.judge.scores.map(judgeLine).join('\n'));
  } else {
    lines.push('(not run)');
  }
  lines.push('');

  lines.push('**Anomalies**');
  lines.push(r.anomalies && r.anomalies.length ? r.anomalies.map((a) => `- ${a}`).join('\n') : '(none)');

  return lines.join('\n');
}

/**
 * Renders `results` (one entry per scenario run — a taskId x persona pair)
 * into a single markdown report: a roll-up table, then a detail section per
 * scenario. Pure.
 */
export function renderReport(results: ScenarioResult[]): string {
  const header = ['# Pedagogy Harness Report', '', '## Roll-up', ''];
  const table = [
    '| Task | Persona | L1 pass/total | L2 flagged |',
    '| --- | --- | --- | --- |',
    ...results.map(rollupRow),
  ];
  const detailHeader = ['', '## Scenario detail', ''];
  const detailsBlock = results.map(scenarioDetail).join('\n\n');

  return [...header, ...table, ...detailHeader, detailsBlock].join('\n');
}
