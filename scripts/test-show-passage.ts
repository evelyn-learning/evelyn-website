/**
 * Unit tests for the `show_passage` whiteboard tool's pure pieces:
 *  - solvePassage() — schema validation (advanced-math-ela-social.ts)
 *  - splitHighlights() — the mark-up segmenter PassageRenderer uses to
 *    wrap highlighted substrings (passage-highlights.ts)
 *
 * Both are dependency-free (no React/JSX, no KaTeX), so this runs as a
 * plain tsx script — same pattern as test-board-title.ts / test-inline-math.ts.
 *
 * Run: npm run test:show-passage
 */
import { solvePassage } from '../apps/marketing/src/lib/tutor/diagrams/catalog/kinds/advanced-math-ela-social';
import { splitHighlights } from '../apps/marketing/src/lib/tutor/whiteboard/passage-highlights';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${tag}  ${name}${detail ? `  — ${detail}` : ''}`);
  if (ok) pass++; else fail++;
}

function throws(fn: () => void): string | null {
  try {
    fn();
    return null;
  } catch (err) {
    return (err as Error).message;
  }
}

// ── solvePassage: valid payloads ─────────────────────────────────────
console.log('\n=== solvePassage: valid payloads ===');
{
  const fig = solvePassage({
    title: 'Key term',
    source: 'Frankenstein, Mary Shelley, Chapter 5',
    text: 'It was on a dreary night of November that I beheld the accomplishment of my toils.',
    highlights: ['dreary night'],
  });
  check('title passes through', fig.title === 'Key term');
  check('source passes through', fig.source === 'Frankenstein, Mary Shelley, Chapter 5');
  check('text passes through unchanged', fig.text === 'It was on a dreary night of November that I beheld the accomplishment of my toils.');
  check('highlights passes through', Array.isArray(fig.highlights) && fig.highlights.length === 1 && fig.highlights[0] === 'dreary night');
}
{
  // Minimal payload — only the required field.
  const fig = solvePassage({ text: 'A tariff is a tax on imported goods.' });
  check('minimal payload: text required field only', fig.text === 'A tariff is a tax on imported goods.');
  check('minimal payload: title undefined', fig.title === undefined);
  check('minimal payload: source undefined', fig.source === undefined);
  check('minimal payload: highlights undefined (none supplied)', fig.highlights === undefined);
}
{
  // Math-bearing text is passed through untouched — InlineMathText (a
  // separate, already-tested pipeline) does the $…$ rendering, not the
  // solver.
  const fig = solvePassage({ text: 'The area of a circle is defined as $A = \\pi r^2$.' });
  check('math-bearing text preserved verbatim', fig.text === 'The area of a circle is defined as $A = \\pi r^2$.');
}

// ── solvePassage: rejection ──────────────────────────────────────────
console.log('\n=== solvePassage: rejection ===');
{
  const err = throws(() => solvePassage({}));
  check('missing text is rejected', err !== null, err ?? '(did not throw)');
}
{
  const err = throws(() => solvePassage({ title: 'Untitled' }));
  check('text omitted (only other fields present) is rejected', err !== null, err ?? '(did not throw)');
}
{
  const err = throws(() => solvePassage({ text: '' }));
  check('empty-string text is rejected', err !== null, err ?? '(did not throw)');
}
{
  const err = throws(() => solvePassage({ text: '   ' }));
  check('whitespace-only text is rejected', err !== null, err ?? '(did not throw)');
}
{
  const err = throws(() => solvePassage({ text: 42 as unknown as string }));
  check('non-string text is rejected', err !== null, err ?? '(did not throw)');
}

// ── solvePassage: highlights coercion ────────────────────────────────
console.log('\n=== solvePassage: highlights coercion ===');
{
  const fig = solvePassage({ text: 'Some text here.', highlights: [] });
  check('empty highlights array normalizes to []', Array.isArray(fig.highlights) && fig.highlights.length === 0);
}
{
  const fig = solvePassage({ text: 'Some text here.', highlights: ['', 'valid', ''] });
  check('empty-string highlight entries are filtered out', JSON.stringify(fig.highlights) === JSON.stringify(['valid']));
}
{
  const fig = solvePassage({ text: 'Some text here.', highlights: 'not-an-array' as unknown as string[] });
  check('non-array highlights is dropped to undefined', fig.highlights === undefined);
}

// ── splitHighlights: no highlights ───────────────────────────────────
console.log('\n=== splitHighlights: no highlights ===');
{
  const segs = splitHighlights('Plain passage, no emphasis.');
  check('no highlights → single non-highlighted segment', segs.length === 1 && segs[0].highlighted === false && segs[0].text === 'Plain passage, no emphasis.');
}
{
  const segs = splitHighlights('Plain passage.', []);
  check('empty highlights array → single non-highlighted segment', segs.length === 1 && segs[0].highlighted === false);
}
{
  const segs = splitHighlights('');
  check('empty text → empty segment array', segs.length === 0);
}

// ── splitHighlights: single highlight ────────────────────────────────
console.log('\n=== splitHighlights: single highlight ===');
{
  const segs = splitHighlights('It was a dark and stormy night.', ['dark and stormy']);
  check('single mid-text highlight: 3 segments', segs.length === 3, JSON.stringify(segs));
  check('  segment 1 plain "It was a "', segs[0].text === 'It was a ' && segs[0].highlighted === false);
  check('  segment 2 highlighted "dark and stormy"', segs[1].text === 'dark and stormy' && segs[1].highlighted === true);
  check('  segment 3 plain " night."', segs[2].text === ' night.' && segs[2].highlighted === false);
}
{
  const segs = splitHighlights('Freedom is the core theme.', ['Freedom']);
  check('highlight at start of text: 2 segments', segs.length === 2, JSON.stringify(segs));
  check('  segment 1 highlighted "Freedom"', segs[0].highlighted === true && segs[0].text === 'Freedom');
  check('  segment 2 plain rest', segs[1].highlighted === false && segs[1].text === ' is the core theme.');
}
{
  const segs = splitHighlights('The theme is freedom', ['freedom']);
  check('highlight at end of text: 2 segments', segs.length === 2, JSON.stringify(segs));
  check('  segment 2 highlighted at end', segs[1].highlighted === true && segs[1].text === 'freedom');
}
{
  const segs = splitHighlights('freedom', ['freedom']);
  check('highlight covering entire text: 1 highlighted segment', segs.length === 1 && segs[0].highlighted === true && segs[0].text === 'freedom');
}

// ── splitHighlights: not found / multiple / overlap ──────────────────
console.log('\n=== splitHighlights: not found / multiple / overlap ===');
{
  const segs = splitHighlights('A short passage.', ['not present anywhere']);
  check('highlight not found in text is ignored', segs.length === 1 && segs[0].highlighted === false && segs[0].text === 'A short passage.');
}
{
  const segs = splitHighlights('Liberty, equality, fraternity.', ['Liberty', 'fraternity']);
  check('two non-overlapping highlights: 4 segments', segs.length === 4, JSON.stringify(segs));
  check('  first highlighted', segs[0].highlighted === true && segs[0].text === 'Liberty');
  check('  middle plain', segs[1].highlighted === false && segs[1].text === ', equality, ');
  check('  last highlighted', segs[2].highlighted === true && segs[2].text === 'fraternity');
  check('  trailing plain (period)', segs[3].highlighted === false && segs[3].text === '.');
}
{
  // "dark and stormy" and "and stormy night" overlap on "and stormy" — must merge into one highlighted run.
  const segs = splitHighlights('It was a dark and stormy night.', ['dark and stormy', 'and stormy night']);
  check('overlapping highlights merge into one run', segs.length === 3, JSON.stringify(segs));
  check('  merged highlighted segment spans both', segs[1].highlighted === true && segs[1].text === 'dark and stormy night');
}
{
  // Round-trip sanity: concatenating segment text always reconstructs the original.
  const original = 'Four score and seven years ago our fathers brought forth on this continent a new nation.';
  const segs = splitHighlights(original, ['Four score', 'new nation', 'not-there']);
  const joined = segs.map((s) => s.text).join('');
  check('segments join back to the original text', joined === original, joined);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
