/**
 * WB markdown-emphasis strip — full-surface coverage (2026-07-24 audit).
 *
 * Live round 6 ("*same*" printed literally in a try-yourself card) showed the
 * round-2 strip only covered top-level label/title. These tests pin the
 * replacement: a math-span-aware text strip + a recursive walk over ALL
 * tool-call string fields with a skip-key denylist for math/code/data and
 * lookup/matching fields, plus the decideFallbackCard bypass path.
 *
 * Run: npx tsx scripts/test-wb-markdown-strip.ts   (npm run test:wb-markdown-strip)
 */
import assert from 'node:assert';
import {
  stripWbEmphasisText,
  deepStripWbEmphasis,
} from '../apps/marketing/src/lib/tutor/whiteboard/wb-emphasis-strip';
import { mapFunctionCallToCommand } from '../apps/marketing/src/app/tutor/hooks/toolDefinitions';
import { decideFallbackCard } from '../apps/marketing/src/lib/tutor/whiteboard/process-tool-call';

let passed = 0;
let failed = 0;
function check(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}\n    ${(e as Error).message}`);
  }
}

console.log('stripWbEmphasisText — prose emphasis stripped, math/code shapes preserved');

check('**bold** stripped', () => {
  assert.equal(stripWbEmphasisText('Look at equation **(A)**:'), 'Look at equation (A):');
});
check('*italic* stripped (round-6 case)', () => {
  assert.equal(stripWbEmphasisText('the *same* number'), 'the same number');
});
check('parenthesized *same* stripped', () => {
  assert.equal(stripWbEmphasisText('(*same*)'), '(same)');
});
check('bare multiplication a*b*c preserved', () => {
  assert.equal(stripWbEmphasisText('a*b*c'), 'a*b*c');
});
check('numeric multiplication 2*3 preserved', () => {
  assert.equal(stripWbEmphasisText('2*3'), '2*3');
});
check('spaced multiplication x * y preserved', () => {
  assert.equal(stripWbEmphasisText('x * y'), 'x * y');
});
check('$x*y*z$ math span untouched', () => {
  assert.equal(stripWbEmphasisText('$x*y*z$'), '$x*y*z$');
});
check('emphasis outside math stripped, math preserved', () => {
  assert.equal(stripWbEmphasisText('See **this**: $a*b$ here'), 'See this: $a*b$ here');
});
check('python exponent a**2 + b**2 preserved', () => {
  assert.equal(stripWbEmphasisText('a**2 + b**2'), 'a**2 + b**2');
});
check('spaced exponent x ** y ** z preserved', () => {
  assert.equal(stripWbEmphasisText('x ** y ** z'), 'x ** y ** z');
});
check('multi-word bold stripped', () => {
  assert.equal(stripWbEmphasisText('**two words** stay'), 'two words stay');
});

console.log('deepStripWbEmphasis — recursive walk with skip keys');

check('nested display fields stripped, expectedAnswer + latex untouched, input not mutated', () => {
  const input = {
    problem: 'What is the *same* value?',
    title: '**Your turn**',
    choices: [{ text: '**A** first' }, { text: 'plain' }],
    hints: ['try the *same* trick'],
    expectedAnswer: '2*x',
    latex: 'z^* \\cdot w^*',
  };
  const inputCopy = JSON.parse(JSON.stringify(input));
  const out = deepStripWbEmphasis(input) as typeof input;
  assert.equal(out.problem, 'What is the same value?');
  assert.equal(out.title, 'Your turn');
  assert.equal(out.choices[0].text, 'A first');
  assert.equal(out.hints[0], 'try the same trick');
  assert.equal(out.expectedAnswer, '2*x');
  assert.equal(out.latex, 'z^* \\cdot w^*');
  assert.deepEqual(input, inputCopy, 'input object must not be mutated');
});

console.log('mapFunctionCallToCommand — chokepoint covers every display field');

check('show_try_yourself: problem/choices/hints stripped, expectedAnswer preserved', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_try_yourself', {
    problem: 'Which is the *same* fraction as 1/2?',
    title: '**Your turn**',
    responseFormat: 'mcq',
    choices: [{ text: '**2/4**', correct: true }, { text: '3/4' }],
    hints: ['think about *equivalent* fractions'],
    expectedAnswer: '2*x',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.problem, 'Which is the same fraction as 1/2?');
  assert.equal(cmd.title, 'Your turn');
  assert.equal(cmd.choices[0].text, '2/4');
  assert.equal(cmd.hints[0], 'think about equivalent fractions');
  assert.equal(cmd.expectedAnswer, '2*x');
});

check('tutor_handwrite: text stripped (rule-8 repair path), near preserved', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('tutor_handwrite', {
    text: '**slope** = rise over run',
    near: 'equation-1',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.text, 'slope = rise over run');
  assert.equal(cmd.near, 'equation-1');
});

check('show_table: cells stripped, multiplication + $math$ cells preserved', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_table', {
    headers: ['**Case**', 'Value'],
    rows: [['**bold**', 'a*b', '$x*y$']],
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.headers[0], 'Case');
  assert.deepEqual(cmd.rows[0], ['bold', 'a*b', '$x*y$']);
});

check('show_equation: label stripped, latex untouched', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_equation', {
    latex: 'z^* \\cdot w^*',
    label: 'conjugates **(A)**',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.latex, 'z^* \\cdot w^*');
  assert.equal(cmd.label, 'conjugates (A)');
});

check('show_code: code untouched even with ** patterns', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_code', {
    code: 'y = x ** 2\nz = a ** b ** c',
    language: 'python',
    label: 'squaring **fast**',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.code, 'y = x ** 2\nz = a ** b ** c');
  assert.equal(cmd.label, 'squaring fast');
});

check('show_function_graph: nested labels + axis labels stripped, expr untouched', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_function_graph', {
    title: '**Parabola**',
    xLabel: '*time*',
    yLabel: 'height',
    functions: [{ expr: 'x^2', label: 'the **original**' }],
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.data.title, 'Parabola');
  assert.equal(cmd.data.xLabel, 'time');
  assert.equal(cmd.data.functions[0].label, 'the original');
  assert.equal(cmd.data.functions[0].latex, 'x^2');
});

check('show_flowchart: node/edge labels stripped', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_flowchart', {
    title: 'Loop',
    nodes: [{ id: 'a', label: '**start**' }],
    edges: [{ from: 'a', to: 'a', label: '*repeat*' }],
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.nodes[0].label, 'start');
  assert.equal(cmd.edges[0].label, 'repeat');
});

check('tutor_scribble: target lookup key untouched, label stripped', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('tutor_scribble', {
    target: 'bar-1',
    shape: 'circle',
    label: 'look **here**',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.target, 'bar-1');
  assert.equal(cmd.label, 'look here');
});

check('show_labeled_image: alt + callouts stripped via spec', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_labeled_image', {
    title: 'Cell',
    alt: 'a **plant** cell',
    query: 'plant cell diagram',
    callouts: [{ text: '**nucleus**', caption: 'the *control center*' }],
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.spec.alt, 'a plant cell');
  assert.equal(cmd.spec.query, 'plant cell diagram');
  assert.equal(cmd.spec.callouts[0].text, 'nucleus');
  assert.equal(cmd.spec.callouts[0].caption, 'the control center');
});

check('show_solution: step description stripped, equation/substitution/result untouched', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_solution', {
    steps: [{
      description: 'multiply **both** sides',
      equation: '2x = 6',
      substitution: 'x = 6/2',
      result: 'x = 3',
    }],
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.steps[0].description, 'multiply both sides');
  assert.equal(cmd.steps[0].equation, '2x = 6');
  assert.equal(cmd.steps[0].substitution, 'x = 6/2');
  assert.equal(cmd.steps[0].result, 'x = 3');
});

check('show_dna: sequence untouched, notes stripped', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('show_dna', {
    sequence: 'ATCG',
    title: 'DNA',
    notes: 'the **template** strand',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.sequence, 'ATCG');
  assert.equal(cmd.notes, 'the template strand');
});

check('annotate: text stripped', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = mapFunctionCallToCommand('annotate', {
    text: 'notice the *same* slope',
  }) as any;
  assert.ok(cmd);
  assert.equal(cmd.text, 'notice the same slope');
});

console.log('decideFallbackCard — server bypass path stripped');

check('fallback card title/body stripped', () => {
  const spec = decideFallbackCard(
    'show_diagram',
    {
      type: 'comparison_table',
      params: {
        title: '**Prokaryote vs Eukaryote**',
        items: ['has a *nucleus*', 'no **nucleus**', 'both have ribosomes'],
      },
    },
    'structural: missing columns',
  );
  assert.ok(spec, 'expected a fallback card');
  assert.equal(spec!.title, 'Prokaryote vs Eukaryote');
  assert.ok(!spec!.body.includes('*'), `body still has asterisks: "${spec!.body}"`);
  assert.ok(spec!.body.includes('has a nucleus'));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
