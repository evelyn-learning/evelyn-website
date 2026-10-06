/**
 * Text transcript follow-to-bottom: only a real gesture can latch "the
 * student scrolled up" (2026-10-06, portal-347539a7).
 *
 * The owner's report: after typing "…can you draw and show me the shaded
 * solution?" the panel stayed on an earlier tutor message while the reply
 * ("Good question — let's put it on the board…") arrived below the fold.
 * What the session data shows for that step (session-doc-text-347539a7.json):
 *   20:00:22.047  student message sent
 *   20:00:23.252  cover line, typing indicator up
 *   20:00:26.4    reply starts streaming
 *   20:00:27.249  auto_new_page — a THIRD board page, long title
 *   20:00:30.598  render_sync_flush — the graph card paints
 *   20:00:31.261  qpin_set — the pinned question changes
 * i.e. the one reply of the session that arrived together with a new board
 * page (the page chip row re-wraps, which moves the transcript panel's top)
 * and a new figure card.
 *
 * What the data does NOT show: the session saved no transcript-scroll
 * telemetry at all, so which event set the latch is not known. What the code
 * shows is that it did not need the student: under the old rule ANY `scroll`
 * event past the 400 ms guard, with the newest message more than 120px away
 * and no reply streaming, latched "scrolled up" — and the scroller's own
 * height changes with the board (panel top) and the composer (panel bottom)
 * without anything observing it. The model below reproduces that class of
 * sequence; the fix is the rule (a latch needs a gesture) plus following the
 * scroller's own resizes, plus telemetry so the next report can be answered
 * from the data.
 *
 * This drives the same pure helpers TranscriptView uses through that
 * sequence with a small model of the scroller.
 *
 * Run: npx tsx scripts/test-transcript-gesture-latch.ts
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  latchFromScrollEvent,
  shouldFollowToBottom,
  refollowDecision,
  newestStudentEntryId,
  isFreshStudentSend,
  GESTURE_WINDOW_MS,
  SCROLL_KEYS,
} from '../src/lib/tutor/voice/transcript-follow';

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${!cond && detail ? ` (${detail})` : ''}`);
}

// ── 1. truth table for the gesture rule ─────────────────────────────────────
const base = { type: 'scroll' as const, distanceFromBottom: 300, now: 5000, programmaticUntil: 0, contentGrowing: false };
check('scroll, far from bottom, NO gesture ever ⇒ latch untouched', latchFromScrollEvent({ ...base, requireGesture: true, lastGestureAt: null }) === null);
check('scroll, far from bottom, gesture 300 ms ago ⇒ latch set', latchFromScrollEvent({ ...base, requireGesture: true, lastGestureAt: 4700 }) === true);
check(`scroll, far from bottom, gesture just inside ${GESTURE_WINDOW_MS} ms ⇒ latch set`, latchFromScrollEvent({ ...base, requireGesture: true, lastGestureAt: 5000 - GESTURE_WINDOW_MS }) === true);
check('scroll, far from bottom, gesture 4 s ago ⇒ latch untouched (a layout shift, not the student)', latchFromScrollEvent({ ...base, requireGesture: true, lastGestureAt: 1000 }) === null);
check('scroll while a pointer is held on the scroller (scrollbar drag) ⇒ latch set', latchFromScrollEvent({ ...base, requireGesture: true, lastGestureAt: null, pointerHeld: true }) === true);
check('scroll that ends near the bottom ⇒ latch cleared, gesture or not', latchFromScrollEvent({ ...base, distanceFromBottom: 40, requireGesture: true, lastGestureAt: null }) === false);
check('scroll inside our own guard window ⇒ ignored even with a gesture', latchFromScrollEvent({ ...base, now: 100, programmaticUntil: 400, requireGesture: true, lastGestureAt: 90 }) === null);
check('scroll while the reply streams ⇒ ignored (wheel / touch carry intent then)', latchFromScrollEvent({ ...base, contentGrowing: true, requireGesture: true, lastGestureAt: 4900 }) === null);
check('wheel UP far from bottom ⇒ latch set (unchanged)', latchFromScrollEvent({ ...base, type: 'wheel', deltaY: -30, requireGesture: true }) === true);
check('wheel UP during streaming ⇒ latch set (the student can always scroll away)', latchFromScrollEvent({ ...base, type: 'wheel', deltaY: -30, contentGrowing: true, requireGesture: true }) === true);
check('touchmove far from bottom ⇒ latch set (unchanged)', latchFromScrollEvent({ ...base, type: 'touchmove', requireGesture: true }) === true);
check('flag off (requireGesture omitted) ⇒ the previous rule, byte for byte', latchFromScrollEvent(base) === true && latchFromScrollEvent({ ...base, distanceFromBottom: 40 }) === false);
check('scroll keys are recognised', SCROLL_KEYS.has('PageUp') && SCROLL_KEYS.has('Home') && SCROLL_KEYS.has('ArrowUp') && !SCROLL_KEYS.has('a'));

// ── 2. fresh send ───────────────────────────────────────────────────────────
{
  const t = [{ id: 't1', role: 'tutor' }, { id: 's1', role: 'student' }];
  check('newest student id is found', newestStudentEntryId(t) === 's1');
  check('…even when the reply already follows it in the same commit', newestStudentEntryId([...t, { id: 't2', role: 'tutor' }]) === 's1');
  check('no student entry ⇒ null', newestStudentEntryId([{ id: 't1', role: 'tutor' }]) === null && newestStudentEntryId([]) === null && newestStudentEntryId(null) === null);
  check('a new id is a fresh send', isFreshStudentSend('s2', 's1') && isFreshStudentSend('s1', null));
  check('the same id again is not', !isFreshStudentSend('s1', 's1') && !isFreshStudentSend(null, 's1'));
  check('fresh send follows even when latched', shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'student', nearBottom: false, freshStudentSend: true }));
  check('a re-run with the same student message last does NOT override a deliberate scroll-up', !shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'student', nearBottom: false, freshStudentSend: false }));
  check('…and follows when not scrolled up', shouldFollowToBottom({ stickToBottom: true, userScrolledUp: false, lastRole: 'student', nearBottom: false, freshStudentSend: false }));
  check('freshStudentSend omitted ⇒ the original rule', shouldFollowToBottom({ stickToBottom: true, userScrolledUp: true, lastRole: 'student', nearBottom: false }));
  check('voice mode ignores all of it', shouldFollowToBottom({ stickToBottom: false, userScrolledUp: false, lastRole: 'student', nearBottom: false, freshStudentSend: true }) === false);
}

// ── 3. the owner's sequence, old rule vs new ────────────────────────────────
interface Entry { id: string; role: 'student' | 'tutor'; streaming?: boolean }
class Panel {
  scrollHeight = 0; clientHeight = 500; scrollTop = 0;
  latched = false; guardUntil = 0; lastGestureAt: number | null = null; pointerHeld = false;
  followedSendId: string | null = null;
  transcript: Entry[] = [];
  constructor(private gestureLatch: boolean) {}
  get distance() { return this.scrollHeight - this.scrollTop - this.clientHeight; }
  private last() { return this.transcript[this.transcript.length - 1]; }
  private toBottom(now: number) { this.guardUntil = now + 400; this.scrollTop = Math.max(0, this.scrollHeight - this.clientHeight); }
  /** The follow effect, as TranscriptView runs it after a transcript change. */
  effect(now: number) {
    const last = this.last();
    let fresh: boolean | undefined;
    if (this.gestureLatch) {
      const id = newestStudentEntryId(this.transcript);
      fresh = isFreshStudentSend(id, this.followedSendId);
      if (fresh) { this.followedSendId = id; this.latched = false; this.lastGestureAt = null; }
    } else if (last?.role === 'student') this.latched = false;
    if (shouldFollowToBottom({ stickToBottom: true, userScrolledUp: this.latched, lastRole: last?.role, nearBottom: this.distance < 120, freshStudentSend: fresh })) this.toBottom(now);
  }
  add(e: Entry, height: number, now: number) { this.transcript = [...this.transcript, e]; this.scrollHeight += height; this.effect(now); }
  grow(height: number, now: number) { this.scrollHeight += height; this.transcript = [...this.transcript]; this.effect(now); }
  finishStreaming(now: number) { this.transcript = this.transcript.map((e, i) => (i === this.transcript.length - 1 ? { ...e, streaming: false } : e)); this.effect(now); }
  /** Content grew without a transcript change (typing indicator): the content ResizeObserver. */
  contentResize(height: number, now: number) { this.scrollHeight += height; if (refollowDecision({ stickToBottom: true, userScrolledUpNow: this.latched, nearBottomNow: true })) this.toBottom(now); }
  /** The scroller itself got shorter/taller (panel top or composer moved). */
  scrollerResize(delta: number, now: number) {
    this.clientHeight += delta;
    this.scrollTop = Math.max(0, Math.min(this.scrollTop, this.scrollHeight - this.clientHeight));
    // New rule only: the scroller is observed too.
    if (this.gestureLatch && refollowDecision({ stickToBottom: true, userScrolledUpNow: this.latched, nearBottomNow: true })) this.toBottom(now);
  }
  event(type: 'scroll' | 'wheel' | 'touchmove', now: number, deltaY?: number) {
    if (type !== 'scroll') this.lastGestureAt = now;
    const last = this.last();
    const latch = latchFromScrollEvent({
      type, distanceFromBottom: this.distance, now, programmaticUntil: this.guardUntil, deltaY,
      contentGrowing: last?.role === 'tutor' && last.streaming === true,
      requireGesture: this.gestureLatch, lastGestureAt: this.lastGestureAt, pointerHeld: this.pointerHeld,
    });
    if (latch !== null) this.latched = latch;
  }
  wheelUp(px: number, now: number) { this.event('wheel', now, -px); this.scrollTop = Math.max(0, this.scrollTop - px); this.event('scroll', now + 16); }
}

/** A tutor reply (#28) has finished; then the step the owner reported. */
function ownerSequence(gestureLatch: boolean): Panel {
  const p = new Panel(gestureLatch);
  let t = 0;
  for (let i = 0; i < 12; i++) { p.add({ id: `s${i}`, role: 'student' }, 60, t += 1000); p.add({ id: `t${i}`, role: 'tutor', streaming: true }, 160, t += 4000); p.finishStreaming(t += 2000); }
  // #28 lands long: the panel is at the bottom, unlatched. The student reads for ~25 s, then sends.
  p.add({ id: 's-ask', role: 'student' }, 80, t += 25000);              // 20:00:22
  p.contentResize(56, t += 1200);                                       // typing indicator
  p.add({ id: 't-reply', role: 'tutor', streaming: true }, 90, t += 3000); // 20:00:26 reply starts
  p.grow(120, t += 500);
  p.finishStreaming(t += 2500);                                          // text complete
  // 20:00:27–31: new board page + graph card + pinned question. The chip
  // row wraps and the panel loses height; the newest lines fall below the
  // fold with no gesture, and the browser reports a scroll after the guard.
  p.scrollerResize(-150, t += 1500);
  p.event('scroll', t += 600);
  return p;
}
{
  const before = ownerSequence(false);
  check('old rule, owner sequence: the layout-shift scroll LATCHES with no gesture (the defect)', before.latched === true, `distance=${before.distance}`);
  const tNext = 1e7;
  before.add({ id: 't-next', role: 'tutor', streaming: true }, 200, tNext);
  check('old rule: the next tutor message is then left below the fold', before.distance > 120, `distance=${before.distance}`);

  const after = ownerSequence(true);
  check('new rule, owner sequence: no gesture ⇒ no latch', after.latched === false);
  check('new rule: the scroller resize itself is followed (newest lines back in view)', after.distance === 0, `distance=${after.distance}`);
  after.add({ id: 't-next', role: 'tutor', streaming: true }, 200, tNext);
  check('new rule: the next tutor message is followed', after.distance === 0, `distance=${after.distance}`);
}
// Deliberate scroll-up is still honoured — and still ends at the next send.
{
  const p = ownerSequence(true);
  let t = 2e7;
  p.wheelUp(400, t);
  check('a real wheel-up latches', p.latched === true && p.distance > 120);
  p.add({ id: 't-more', role: 'tutor', streaming: true }, 200, t += 3000);
  check('a tutor message arriving while latched does not yank the student down', p.distance > 120);
  p.scrollerResize(-80, t += 500);
  check('a scroller resize while latched does not yank either', p.latched && p.distance > 120);
  p.add({ id: 's-next', role: 'student' }, 60, t += 5000);
  check('the student sends ⇒ latch cleared, view at the newest message', !p.latched && p.distance === 0);
  p.add({ id: 't-after', role: 'tutor', streaming: true }, 300, t += 4000);
  check('…and the reply after that send is followed', p.distance === 0);
}
// Scrolled up AFTER the send, then an unrelated re-render with the student's message still last.
{
  const p = new Panel(true);
  let t = 0;
  for (let i = 0; i < 8; i++) { p.add({ id: `s${i}`, role: 'student' }, 60, t += 1000); p.add({ id: `t${i}`, role: 'tutor' }, 200, t += 3000); }
  p.add({ id: 's-wait', role: 'student' }, 60, t += 1000);
  p.wheelUp(500, t += 2000);
  check('fixture: scrolled up while waiting for the reply', p.latched && p.distance > 120);
  p.grow(0, t += 500); // transcript identity changes (a board card attached), same entries
  check('an unrelated re-render does not pull the student back down', p.latched && p.distance > 120, `distance=${p.distance}`);
  const old = new Panel(false);
  t = 0;
  for (let i = 0; i < 8; i++) { old.add({ id: `s${i}`, role: 'student' }, 60, t += 1000); old.add({ id: `t${i}`, role: 'tutor' }, 200, t += 3000); }
  old.add({ id: 's-wait', role: 'student' }, 60, t += 1000);
  old.wheelUp(500, t += 2000);
  old.grow(0, t += 500);
  check('(old rule did pull them back down)', old.distance === 0);
}
// A send whose reply's first chunk lands in the same commit still clears the latch.
{
  const p = ownerSequence(true);
  let t = 3e7;
  p.wheelUp(400, t);
  p.transcript = [...p.transcript, { id: 's-batched', role: 'student' }, { id: 't-batched', role: 'tutor', streaming: true }];
  p.scrollHeight += 260;
  p.effect(t += 5000);
  check('student + first tutor chunk in one commit ⇒ still treated as a send', !p.latched && p.distance === 0);
}

// ── 4. wiring ───────────────────────────────────────────────────────────────
{
  const src = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'TranscriptView.tsx'), 'utf8');
  check('TranscriptView passes the gesture inputs to latchFromScrollEvent', /requireGesture: TUTOR_TRANSCRIPT_GESTURE_LATCH,\s+lastGestureAt: lastGestureAtRef\.current,\s+pointerHeld: pointerHeldRef\.current,/.test(src));
  check('wheel / touch are recorded as gestures before the decision', /if \(event\.type !== 'scroll'\) lastGestureAtRef\.current = now;/.test(src));
  check('pointer press and scroll keys are recorded as gestures', /addEventListener\('pointerdown', onPointerDown/.test(src) && /addEventListener\('keydown', onKeyDown\)/.test(src) && /SCROLL_KEYS\.has\(/.test(src));
  check('every added listener is removed', ['pointerdown', 'keydown', 'pointerup', 'pointercancel', 'scroll', 'wheel', 'touchmove'].every((ev) => new RegExp(`removeEventListener\\('${ev}'`).test(src)));
  check('a fresh send clears the latch once (by entry id)', /isFreshStudentSend\(newestSendId, followedSendIdRef\.current\)/.test(src) && /followedSendIdRef\.current = newestSendId;/.test(src));
  check('the scroller itself is observed for resizes', /if \(TUTOR_TRANSCRIPT_GESTURE_LATCH\) ro\.observe\(el\);/.test(src));
  check('the latch and a not-followed tutor message are reported', (src.match(/'transcript_follow'/g) ?? []).length >= 2);
  const session = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'session', 'TutorSession.tsx'), 'utf8');
  check('TutorSession hands the text transcript its telemetry sink', /onDebugEvent=\{sessionMode === 'text' \? onDebugEvent : undefined\}/.test(session));
  const embed = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor-portal', 'embed', 'page.tsx'), 'utf8');
  check('transcript_* events are persisted for embed sessions', /'transcript_'/.test(embed));
}

console.log(failures === 0 ? '\nAll transcript gesture-latch checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
