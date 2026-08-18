// apps/tutor/scripts/tutor/verdict-bank/report.test.ts
/**
 * Markdown report renderer for the verdict probe bank (2026-08-18 plan,
 * Task 5). Pure unit test — hand-built ProbeResult[] fixtures, no browser,
 * no network, no filesystem. run-bank.ts (the CLI) writes this string to
 * disk; it is exercised live in Task 6, not here.
 */
import { renderReport, renderSummaryTable, statusForProbe } from './report';
import type { ProbeResult, SampleResult } from './report';

let failures = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.error(`  ✗ ${name}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
  else console.log(`  ✓ ${name}`);
}

function sample(overrides: Partial<SampleResult> = {}): SampleResult {
  return {
    grade: 'pass',
    verdictClass: 'affirm',
    openerQuote: 'Right — nice work, that is exactly it.',
    guardEvents: [],
    bundleDir: 'artifacts/verdict-bank/2026-08-18T00-00-00/test-probe/sample-1',
    ...overrides,
  };
}

function probeResult(overrides: Partial<ProbeResult> = {}): ProbeResult {
  return {
    probe: {
      id: 'test-probe',
      cell: { provenance: 'tutor-posed-board', relation: 'exactly-correct', answerType: 'numeric' },
      expected: 'affirm',
      notes: 'unit-test fixture',
    },
    samples: [sample()],
    ...overrides,
  };
}

console.log('statusForProbe');
check(
  'all pass -> PASS',
  statusForProbe(probeResult({ samples: [sample({ grade: 'pass' }), sample({ grade: 'pass' })] })),
  'PASS',
);
check(
  'any fail -> FAIL',
  statusForProbe(probeResult({ samples: [sample({ grade: 'pass' }), sample({ grade: 'fail' })] })),
  'FAIL',
);
check(
  'no fail but a no-verdict -> FLAKY',
  statusForProbe(probeResult({ samples: [sample({ grade: 'pass' }), sample({ grade: 'no-verdict' })] })),
  'FLAKY',
);
check(
  'fail beats no-verdict -> FAIL',
  statusForProbe(probeResult({ samples: [sample({ grade: 'fail' }), sample({ grade: 'no-verdict' })] })),
  'FAIL',
);

console.log('renderSummaryTable');
{
  const rows = [
    probeResult({
      probe: {
        id: 'mx-equiv-form',
        cell: { provenance: 'volunteered', relation: 'correct-different-form', answerType: 'algebraic' },
        expected: 'affirm',
        notes: '',
      },
      samples: [sample({ grade: 'pass' }), sample({ grade: 'pass' }), sample({ grade: 'fail' })],
    }),
  ];
  const table = renderSummaryTable(rows);
  check('summary table has header row', table.includes('| Probe | Cell | Expected | Samples | Status |'), true);
  check('summary table names the probe id', table.includes('mx-equiv-form'), true);
  check('summary table names the cell axes', table.includes('volunteered / correct-different-form / algebraic'), true);
  check('summary table shows sample counts', table.includes('2×pass / 1×fail / 0×no-verdict'), true);
  check('summary table shows FAIL status', table.includes('FAIL'), true);
}

console.log('renderReport — summary section');
{
  const rows = [probeResult()];
  const md = renderReport(rows);
  check('starts with a top-level heading', md.startsWith('# Verdict Probe Bank Report'), true);
  check('has a Summary section', md.includes('## Summary'), true);
  check('embeds the summary table', md.includes(renderSummaryTable(rows)), true);
}

console.log('renderReport — non-PASS detail sections');
{
  const failingProbe = probeResult({
    probe: {
      id: 'inc-nonanswer-submission',
      cell: { provenance: 'tutor-posed-card', relation: 'non-answer', answerType: 'n/a' },
      expected: 'none',
      notes: '"a" was praised as "Right, a circle!"; any affirm/deny here is a fail.',
    },
    samples: [
      sample({ grade: 'pass', verdictClass: 'none', openerQuote: 'What made you pick that?' }),
      sample({
        grade: 'fail',
        verdictClass: 'affirm',
        openerQuote: 'Right, a circle! Great instinct.',
        guardEvents: ['nonanswer_credit_blocked'],
        bundleDir: 'artifacts/verdict-bank/2026-08-18T00-00-00/inc-nonanswer-submission/sample-2',
      }),
    ],
  });
  const passingProbe = probeResult({
    probe: {
      id: 'mx-equiv-form',
      cell: { provenance: 'volunteered', relation: 'correct-different-form', answerType: 'algebraic' },
      expected: 'affirm',
      notes: '',
    },
    samples: [sample({ grade: 'pass' })],
  });
  const md = renderReport([passingProbe, failingProbe]);

  check('has a Probe detail section', md.includes('## Probe detail'), true);
  check('non-PASS probe gets a heading naming its status', md.includes('### inc-nonanswer-submission — FAIL'), true);
  check('PASS-only probe gets no detail heading', md.includes('### mx-equiv-form'), false);
  check('detail section quotes the failing opener', md.includes('Right, a circle! Great instinct.'), true);
  check('detail section lists the guard events', md.includes('nonanswer_credit_blocked'), true);
  check('detail section names the bundle dir', md.includes('artifacts/verdict-bank/2026-08-18T00-00-00/inc-nonanswer-submission/sample-2'), true);
  check('detail section omits the passing sample\'s opener', md.includes('What made you pick that?'), false);
}

console.log('renderReport — all-pass has no detail sections');
{
  const md = renderReport([probeResult()]);
  check('no Probe detail heading content when everything passes', md.includes('### test-probe'), false);
  check('says so explicitly', md.includes('all probes passed'), true);
}

console.log('renderReport — Guard saves section');
{
  const passWithGuard = probeResult({
    probe: {
      id: 'inc-concept-denied',
      cell: { provenance: 'tutor-posed-speech', relation: 'exactly-correct', answerType: 'concept' },
      expected: 'affirm',
      notes: '',
    },
    samples: [
      sample({
        grade: 'pass',
        guardEvents: ['denied_answer_stashed', 'denied_answer_reversal_kill'],
        bundleDir: 'artifacts/verdict-bank/2026-08-18T00-00-00/inc-concept-denied/sample-1',
      }),
    ],
  });
  const cleanPass = probeResult({
    probe: {
      id: 'mx-equiv-form',
      cell: { provenance: 'volunteered', relation: 'correct-different-form', answerType: 'algebraic' },
      expected: 'affirm',
      notes: '',
    },
    samples: [sample({ grade: 'pass', guardEvents: [] })],
  });
  const md = renderReport([cleanPass, passWithGuard]);

  check('has a Guard saves section', md.includes('## Guard saves'), true);
  check('a PASSING probe with guard events still shows up', md.includes('inc-concept-denied'), true);
  check('lists the guard event types', md.includes('denied_answer_stashed'), true);
  check('lists the bundle dir', md.includes('artifacts/verdict-bank/2026-08-18T00-00-00/inc-concept-denied/sample-1'), true);
  // The clean-pass probe (no guard events on any sample) must not spuriously
  // appear in the Guard saves section.
  const guardSection = md.slice(md.indexOf('## Guard saves'));
  check('clean-pass probe is absent from Guard saves', guardSection.includes('mx-equiv-form'), false);
}

console.log('renderReport — no-verdict sample uses its own opener sentinel');
{
  const flakyProbe = probeResult({
    probe: {
      id: 'mx-second-attempt',
      cell: { provenance: 'tutor-posed-speech', relation: 'wrong-then-correct', answerType: 'numeric' },
      expected: 'affirm',
      notes: '',
    },
    samples: [sample({ grade: 'no-verdict', verdictClass: 'none', openerQuote: '(no tutor reply captured)' })],
  });
  const md = renderReport([flakyProbe]);
  check('FLAKY status appears', md.includes('### mx-second-attempt — FLAKY'), true);
  check('no-verdict opener sentinel is quoted', md.includes('(no tutor reply captured)'), true);
}

if (failures > 0) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log('\nAll verdict-report checks passed.');
