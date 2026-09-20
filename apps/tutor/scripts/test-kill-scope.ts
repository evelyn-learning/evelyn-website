/**
 * portal-704e3e01 @1414.3s: the false-assertion kill retracted the spoken
 * affirmation, then mark_segment_complete / advance_lesson / show_problem
 * from the SAME killed turn dispatched anyway. The student got the next
 * segment with no closure on the previous one and said so.
 *
 * Usage: npx tsx scripts/test-kill-scope.ts  (npm run test:kill-scope)
 */
import { shouldWithholdAfterKill, LESSON_STATE_TOOLS } from '../src/lib/tutor/orchestrator/kill-scope';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the four tools that dispatched after the kill in portal-704e3e01 ───
check('advance_lesson is withheld', shouldWithholdAfterKill('advance_lesson'));
check('mark_segment_complete is withheld', shouldWithholdAfterKill('mark_segment_complete'));
check('add_topic_notes_pointer is withheld', shouldWithholdAfterKill('add_topic_notes_pointer'));
check('show_segment_card is withheld', shouldWithholdAfterKill('show_segment_card'));

// ─── renders are NOT withheld: TUTOR_KEEP_VALIDATED_ON_KILL exists so that
//     a validated figure survives a dropped narration. ───
check('show_equation is not withheld', !shouldWithholdAfterKill('show_equation'));
check('show_problem is not withheld', !shouldWithholdAfterKill('show_problem'));
check('scribble is not withheld', !shouldWithholdAfterKill('scribble'));
check('new_page is not withheld', !shouldWithholdAfterKill('new_page'));
check('generate_problem is not withheld', !shouldWithholdAfterKill('generate_problem'));
check('tutor_scroll_whiteboard is not withheld', !shouldWithholdAfterKill('tutor_scroll_whiteboard'));

// ─── unknown tools default to NOT withheld: a new render tool must never be
//     silently swallowed by this guard (the isTeachingRenderAction drift class). ───
check('unknown tool is not withheld', !shouldWithholdAfterKill('show_some_future_thing'));
check('empty name is safe', !shouldWithholdAfterKill(''));

// ─── the set is explicit and small ───
check('LESSON_STATE_TOOLS has exactly the four', LESSON_STATE_TOOLS.size === 4, `size=${LESSON_STATE_TOOLS.size}`);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
