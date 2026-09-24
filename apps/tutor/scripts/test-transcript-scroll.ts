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
import { shouldFollowToBottom, refollowDecision, latchFromScrollEvent } from '../src/lib/tutor/voice/transcript-follow';

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
// Final-review fix: unlike shouldFollowToBottom's IMMEDIATE-scroll rule,
// the re-check must NOT grant the student-message "always follow"
// exception. lastRole often stays 'student' for the several seconds
// between send and reply (typing indicator mounting, thinkingHint
// growing at 4s/8s) — before this fix, a student who scrolled up during
// that window was yanked back to the bottom by the ResizeObserver and/or
// fonts.ready re-checks, up to three times, before the reply even landed.
check(
  'refollow, text mode: lastRole student, latch SET → do NOT follow (no student-send exception in the re-check)',
  refollowDecision({ stickToBottom: true, userScrolledUpNow: true, lastRole: 'student', nearBottomNow: false }),
  false,
);
check(
  'refollow, text mode: lastRole student, latch clear → follow (still at the bottom)',
  refollowDecision({ stickToBottom: true, userScrolledUpNow: false, lastRole: 'student', nearBottomNow: false }),
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

// --- Part 2b: latchFromScrollEvent truth table (round 7, task 5) ----------
//
// TranscriptView's own programmatic `el.scrollTop = el.scrollHeight` writes
// dispatch a native `scroll` event — measured, at the next listener tick,
// against content that streamed in and grew the scroller by well over
// 120px, the event falsely looked like the student deliberately scrolling
// away. `latchFromScrollEvent` lets the listener recognize "this scroll
// event landed inside our own programmatic scroll's 200ms guard window" and
// ignore it (`null`) instead of latching. `wheel`/`touchmove` are always
// real user gestures — the guard never applies to them.

check(
  'scroll event inside the guard window, far from bottom → ignore (own scroll)',
  latchFromScrollEvent({ type: 'scroll', distanceFromBottom: 300, now: 100, programmaticUntil: 300 }) === null,
  true,
);
check(
  'scroll event after the guard window, far from bottom → latch set',
  latchFromScrollEvent({ type: 'scroll', distanceFromBottom: 300, now: 400, programmaticUntil: 300 }) === true,
  true,
);
check(
  'wheel event inside the guard window, far from bottom → latch set (guard never applies to wheel)',
  latchFromScrollEvent({ type: 'wheel', distanceFromBottom: 300, now: 100, programmaticUntil: 300 }) === true,
  true,
);
check(
  'scroll event after the guard window, near bottom (distance 50) → latch cleared',
  latchFromScrollEvent({ type: 'scroll', distanceFromBottom: 50, now: 400, programmaticUntil: 300 }) === false,
  true,
);
check(
  'touchmove event inside the guard window, far from bottom → latch set (guard never applies to touchmove)',
  latchFromScrollEvent({ type: 'touchmove', distanceFromBottom: 300, now: 100, programmaticUntil: 300 }) === true,
  true,
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

// Round 7, task 5: the listener must not falsely latch on our own
// programmatic scroll — verify the guard's plumbing is actually wired, not
// just that latchFromScrollEvent itself is correct in isolation.
checkSource(
  'TranscriptView imports latchFromScrollEvent',
  /latchFromScrollEvent/,
);
checkSource(
  'TranscriptView tracks a programmatic-scroll guard window ref',
  /programmaticScrollUntilRef/,
);
{
  // Fix round 1: `scrollToBottom()` was hoisted out of the follow-to-bottom
  // effect to component scope so the round-6e drawer-open snap effect
  // (which writes `el.scrollTop = el.scrollHeight` on the SAME container)
  // can share the same guard window — it can false-latch identically to
  // the three sites fixed in the first pass. All FOUR programmatic scroll
  // sites (immediate follow, fonts.ready re-check, ResizeObserver
  // re-check, drawer-open snap) must now go through the one helper; a
  // bare write anywhere outside the helper's own body bypasses the guard
  // and reintroduces the false-latch bug at that site.
  const calls = source.match(/scrollToBottom\(\)/g) ?? [];
  const okCalls = calls.length >= 4;
  if (!okCalls) failures++;
  console.log(`${okCalls ? 'PASS' : 'FAIL'} — scrollToBottom() called at all four scroll sites (follow, fonts.ready, ResizeObserver, drawer-open), found ${calls.length}`);

  // Exactly one bare write is expected in the whole component: the shared
  // scrollToBottom() helper's own body. Any more means some site bypassed
  // the helper (and its comment-only mentions above must not count).
  const codeOnly = source
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
  const bareWrites = codeOnly.match(/el\.scrollTop\s*=\s*el\.scrollHeight/g) ?? [];
  const okBare = bareWrites.length === 1;
  if (!okBare) failures++;
  console.log(`${okBare ? 'PASS' : 'FAIL'} — only scrollToBottom()'s own body writes el.scrollTop = el.scrollHeight directly, found ${bareWrites.length}`);
}

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log('\nAll transcript-scroll checks passed.');
