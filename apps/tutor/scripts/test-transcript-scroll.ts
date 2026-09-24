/**
 * Follow-to-bottom after KaTeX fonts load (GreenApple round 6, task 4).
 *
 * Live symptom: a math-bearing tutor reply landed, TranscriptView's scroll
 * effect ran and scrolled to `scrollHeight` at that instant, but the
 * bubble's KaTeX span (InlineMathText's `Math` component — a synchronous
 * `katex.render()` with no font-load handling, unlike EquationRenderer
 * which re-fits after `document.fonts.ready`) grew taller once the web
 * fonts swapped in, stranding the panel short of the bottom with no event
 * left to re-trigger the scroll.
 *
 * Part 1: numeric truth table for the pure decision
 * (`shouldFollowToBottom`, src/lib/tutor/voice/transcript-follow.ts) — the
 * rule TranscriptView's scroll effect uses for the IMMEDIATE scroll.
 *
 * Part 2 (fix round 1): numeric truth table for `refollowDecision`, the
 * separate pure function the `document.fonts.ready` and `ResizeObserver`
 * re-checks both call. Fix round 1 caught a bug where the fonts.ready
 * re-check re-applied a `decision` FROZEN at effect-run time instead of
 * reading the "scrolled up" latch live — this table exists so that
 * regression can't come back silently: it asserts a student who scrolled
 * up by the time the re-check fires is never yanked back down, and that
 * voice mode (`stickToBottom: false`) never re-follows at all.
 *
 * Part 3: a source-wiring check — TranscriptView.tsx must actually await
 * `document.fonts.ready` (gated to text mode) and construct a
 * `ResizeObserver`, and both callbacks must call `refollowDecision(`, or
 * the fix is effectively dead even though the pure helpers' truth tables
 * pass.
 *
 * Run: npx tsx scripts/test-transcript-scroll.ts
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { shouldFollowToBottom, refollowDecision } from '../src/lib/tutor/voice/transcript-follow';

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(name: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name} (expected ${expected}, got ${actual})`);
}

// --- Part 1: shouldFollowToBottom truth table -----------------------------

// Text mode ("stickToBottom"): the student's own message always follows,
// regardless of the "scrolled up" latch — sending a message always snaps
// a chat UI to the bottom.
check(
  'text mode: student just spoke, latch clear → follow',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: false, lastRole: 'student', nearBottom: false }),
  true,
);
check(
  'text mode: student just spoke, latch SET → still follows',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'student', nearBottom: false }),
  true,
);

// Text mode: a tutor reply follows unless the student deliberately
// scrolled away.
check(
  'text mode: tutor reply, latch clear → follow',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: false, lastRole: 'tutor', nearBottom: false }),
  true,
);
check(
  'text mode: tutor reply, latch SET (student scrolled up) → do not yank',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'tutor', nearBottom: false }),
  false,
);

// Text mode: a system pill entry follows the same "tutor" rule (anything
// that isn't the student's own message).
check(
  'text mode: system entry, latch clear → follow',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: false, lastRole: 'system', nearBottom: false }),
  true,
);
check(
  'text mode: system entry, latch SET → do not yank',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'system', nearBottom: false }),
  false,
);

// Text mode: `nearBottom` is irrelevant — the latch is the only gate.
check(
  'text mode: nearBottom=true but latch SET on a tutor reply → still no yank',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'tutor', nearBottom: true }),
  false,
);

// No entries yet (empty transcript) — lastRole is undefined, treated like
// "not the student" (falls to the latch check).
check(
  'text mode: no entries yet, latch clear → follow',
  shouldFollowToBottom({ stickToBottom: true, userScrolledUp: false, lastRole: undefined, nearBottom: false }),
  true,
);

// Voice mode: unconditional near-bottom-only rule — lastRole and the
// latch are both ignored.
check(
  'voice mode: near bottom → follow',
  shouldFollowToBottom({ stickToBottom: false, userScrolledUp: false, lastRole: 'tutor', nearBottom: true }),
  true,
);
check(
  'voice mode: not near bottom → do not yank',
  shouldFollowToBottom({ stickToBottom: false, userScrolledUp: false, lastRole: 'tutor', nearBottom: false }),
  false,
);
check(
  'voice mode: student entry but far from bottom → still no yank (latch/lastRole ignored)',
  shouldFollowToBottom({ stickToBottom: false, userScrolledUp: false, lastRole: 'student', nearBottom: false }),
  false,
);
check(
  'voice mode: latch SET but near bottom → follows anyway (voice ignores the latch)',
  shouldFollowToBottom({ stickToBottom: false, userScrolledUp: true, lastRole: 'tutor', nearBottom: true }),
  true,
);

// --- Part 2: refollowDecision truth table (fix round 1) -------------------

// The critical fix-round-1 case: the student scrolled up in the gap
// between the initial scroll and fonts/layout settling. The re-check
// must read that LIVE and must NOT follow — re-applying a frozen
// "should follow" here is exactly the bug that shipped in 97e933bc.
check(
  'refollow, text mode: student scrolled up by the time fonts settle → do not yank',
  refollowDecision({ stickToBottom: true, userScrolledUpNow: true, lastRole: 'tutor', nearBottomNow: true }),
  false,
);
check(
  'refollow, text mode: still at the bottom when fonts settle → follow',
  refollowDecision({ stickToBottom: true, userScrolledUpNow: false, lastRole: 'tutor', nearBottomNow: false }),
  true,
);
check(
  'refollow, text mode: lastRole student, latch set → still follows (student-send rule unchanged)',
  refollowDecision({ stickToBottom: true, userScrolledUpNow: true, lastRole: 'student', nearBottomNow: false }),
  true,
);

// The other critical fix-round-1 case: voice mode never re-follows via
// this path at all — before commit 97e933bc voice mode had no fonts.ready
// or ResizeObserver re-check, and that must stay byte-identical.
// `nearBottomNow: true` here would make `shouldFollowToBottom` say
// "follow" if it were reached — asserting `false` proves the
// `stickToBottom` short-circuit actually fires instead of falling through.
check(
  'refollow, voice mode: never re-follows regardless of latch/nearBottom',
  refollowDecision({ stickToBottom: false, userScrolledUpNow: false, lastRole: 'tutor', nearBottomNow: true }),
  false,
);
check(
  'refollow, voice mode: student entry, latch clear, near bottom → still no re-follow',
  refollowDecision({ stickToBottom: false, userScrolledUpNow: false, lastRole: 'student', nearBottomNow: true }),
  false,
);

// --- Part 3: source-wiring check --------------------------------------

const transcriptViewPath = join(__dirname, '../src/app/tutor/components/TranscriptView.tsx');
const source = readFileSync(transcriptViewPath, 'utf8');

function checkSource(name: string, pattern: RegExp) {
  const ok = pattern.test(source);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
}

checkSource(
  'TranscriptView imports the shared shouldFollowToBottom helper',
  /from ['"]@\/lib\/tutor\/voice\/transcript-follow['"]/,
);
checkSource(
  'TranscriptView calls shouldFollowToBottom (not a hand-rolled duplicate)',
  /shouldFollowToBottom\(/,
);
checkSource(
  'TranscriptView awaits document.fonts.ready',
  /document\.fonts\??\.ready\s*(\?\.|\.)\s*then\(/,
);
checkSource(
  'TranscriptView guards document.fonts before using it (SSR-safe)',
  /typeof document !== ['"]undefined['"][\s\S]{0,80}document\.fonts/,
);
checkSource(
  'TranscriptView constructs a ResizeObserver on the messages container',
  /new ResizeObserver\(/,
);
checkSource(
  'TranscriptView disconnects the ResizeObserver on cleanup',
  /ro\??\.disconnect\(\)/,
);

// Fix round 1 checks — the fonts.ready re-check must be gated to text
// mode AND must call the LIVE refollowDecision helper (not the frozen
// `decision` const, and not a duplicated shouldFollowToBottom call).
checkSource(
  'the fonts.ready condition is gated to text mode (stickToBottom)',
  /if\s*\(\s*stickToBottom\s*&&\s*typeof document/,
);
checkSource(
  'TranscriptView calls refollowDecision (both re-checks share one live decision fn)',
  /refollowDecision\(/,
);
// Count, not just presence — the requirement is BOTH callbacks (fonts.ready
// and ResizeObserver) call it, not just one of them.
{
  const matches = source.match(/refollowDecision\(/g) ?? [];
  const ok = matches.length >= 2;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — refollowDecision is called at least twice (fonts.ready + ResizeObserver), found ${matches.length}`);
}

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll transcript-scroll checks passed.');
