/**
 * A verdict / assent kill takes its board renders with it (kill-keep.ts).
 *
 * Fixture: portal-897212b5 (2026-10-06) @229s. Tutor: "…solid or dashed?".
 * Student: "Yes." The attempt answered "Right. Dashed line…", was killed
 * (bare_assent_praise), and its show_equation "⇒ dashed boundary line"
 * (showEquation-6) was kept by keep-validated-on-kill and painted while the
 * retry was asking "Which do you mean — solid, or dashed?".
 *
 * Run: npx tsx scripts/test-kill-discard.ts
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  decideKillKeep,
  isAnswerRevealingKill,
  isAnswerBearingRenderTool,
  splitAnswerRevealingKilled,
  ANSWER_REVEALING_KILL_ACTIONS,
  type KillRenderDesc,
} from '../src/lib/tutor/whiteboard/kill-keep';

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${!cond && detail ? ` (${detail})` : ''}`);
}

// ── which kills ─────────────────────────────────────────────────────────────
check('bare_assent_praise is an answer-revealing kill', isAnswerRevealingKill([{ action: 'bare_assent_praise' }]));
for (const a of ['nonanswer_praise', 'verdict_opener', 'false_praise_opener', 'precheck_verdict_contradiction', 'contradiction_inversion', 'try_yourself_answer_reveal', 'inverse_verdict_false_denial']) {
  check(`${a} is an answer-revealing kill`, isAnswerRevealingKill([{ action: a }]));
}
for (const a of ['false_arithmetic_claim', 'show_equation_spoken_mismatch', 'show_segment_card_narration_mismatch', 'required_phrase_missing', 'skip_button_no_advance', 'mid_turn_self_correction', 'show_function_graph', 'show_diagram', 'dev_forced_kill']) {
  check(`${a} is NOT (its collateral renders keep today's treatment)`, !isAnswerRevealingKill([{ action: a }]));
}
check('one answer-revealing rejection among others is enough', isAnswerRevealingKill([{ action: 'show_diagram' }, { action: 'verdict_opener' }]));
check('no rejections / null ⇒ false', !isAnswerRevealingKill([]) && !isAnswerRevealingKill(null) && !isAnswerRevealingKill(undefined));
check('the list is the documented thirteen', ANSWER_REVEALING_KILL_ACTIONS.size === 13);

// ── which tools ─────────────────────────────────────────────────────────────
check('show_equation is board content', isAnswerBearingRenderTool('show_equation'));
check('show_function_graph is board content', isAnswerBearingRenderTool('show_function_graph'));
check('tutor_handwrite is board content', isAnswerBearingRenderTool('tutor_handwrite'));
check('tutor_scribble is not (a mark on existing content)', !isAnswerBearingRenderTool('tutor_scribble'));
check('tutor_scroll_whiteboard is not', !isAnswerBearingRenderTool('tutor_scroll_whiteboard'));
check('advance_lesson is not (the lesson-state gate owns it)', !isAnswerBearingRenderTool('advance_lesson'));
check('flag_prerequisite_gap is not', !isAnswerBearingRenderTool('flag_prerequisite_gap'));

// ── the end-of-call decision ────────────────────────────────────────────────
{
  // The session: showEquation-6 was the killed attempt's only render.
  const uniq = (id: string, order: number): KillRenderDesc => ({ id, slot: `uniq:${id}`, order });
  const before = decideKillKeep([uniq('showEquation-6', 9)], [uniq('showEquation-5', 8), uniq('showEquation-6', 9)]);
  check('as it was: keep-validated KEEPS the answer card (the defect)', before.keep.includes('showEquation-6') && before.sweep.length === 0);

  const split = splitAnswerRevealingKilled(['showEquation-6'], new Set(['showEquation-6']));
  check('now: it is discarded before keep-validated ever sees it', split.discard.join() === 'showEquation-6' && split.rest.length === 0);
  const after = decideKillKeep(split.rest.map((id) => uniq(id, 9)), [uniq('showEquation-5', 8)]);
  check('…so nothing is kept', after.keep.length === 0);

  // A turn with two kills of different kinds: only the verdict-killed attempt's renders go.
  const mixed = splitAnswerRevealingKilled(['showEquation-7', 'showTable-1', 'showEquation-8'], new Set(['showEquation-8']));
  check('renders of a content-killed attempt still go to keep-validated', mixed.rest.join() === 'showEquation-7,showTable-1' && mixed.discard.join() === 'showEquation-8');
  // Needed by the retry: a re-emitted render is confirmed, which removes it
  // from the candidate list before this runs — so it is simply not there.
  const confirmed = splitAnswerRevealingKilled([], new Set(['showEquation-6']));
  check('a render the retry re-emitted (confirmed ⇒ not a candidate) is not discarded', confirmed.discard.length === 0);
  check('flag off ⇒ empty set ⇒ identical to before', splitAnswerRevealingKilled(['a', 'b'], new Set()).rest.join() === 'a,b');
}

// ── wiring ──────────────────────────────────────────────────────────────────
{
  const vtr = readFileSync(join(__dirname, '..', 'src', 'app', 'tutor', 'components', 'VoiceTutorRealtime.tsx'), 'utf8');
  check('a render arriving after an answer-revealing kill is withheld', /TUTOR_KILL_DISCARDS_ANSWER_RENDERS && attemptKilled\s+&& isAnswerRevealingKill\(rejectionsThisAttempt\) && isAnswerBearingRenderTool\(name\)/.test(vtr));
  check('…with its own event', /'killed_render_withheld_answer'/.test(vtr));
  check('renders painted before such a kill are remembered', /answerRevealKilledIdsRef\.current\.add\(id\)/.test(vtr));
  check('the end-of-call cleanup discards them ahead of keep-validated', /splitAnswerRevealingKilled\(staleIds, answerKilledThisCall\)/.test(vtr) && /planKillKeep\(killedForAnswer\.rest\)/.test(vtr));
  check('the withhold sits before the tool is counted as dispatched', vtr.indexOf("'killed_render_withheld_answer'") < vtr.indexOf('turnToolCallsSeen.push({ name, args });'));
}

console.log(failures === 0 ? '\nAll kill-discard checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
